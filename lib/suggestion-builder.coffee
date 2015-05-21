{Range} = require 'atom'
module.exports=
class SuggestionBuilder
  typeScope: ['meta.function.type-declaration.haskell']
  sourceScope: ['source.haskell']
  moduleScope: ['meta.import.haskell', 'support.other.module.haskell']
  preprocessorScope: ['meta.preprocessor.haskell']
  exportsScope: ['meta.import.haskell', 'meta.declaration.exports.haskell']
  #TODO: exports scope

  constructor: (@options,@info,@controller) ->
    @editor = @options.editor
    @prefix = @options.prefix
    @scopes = @options.scopeDescriptor.scopes
    @symbols = @controller.symbols
    @lineRange = new Range [0, @options.bufferPosition.row],
      @options.bufferPosition

  genTypeSearch: =>
    unless @controller.backend
      return Promise.reject(Error('no backend'))
    r = new Range @options.bufferPosition, @options.bufferPosition
    @controller.backend.getType(@editor.getBuffer(), r)

  #ghc-mod search
  getModule: (prefix) =>
    @info.moduleList
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        text: mod
        replacementPrefix: prefix
        type: 'import'

  getPreprocessor: (prefix) =>
    (if prefix[0]=='-' then @info.ghcFlags
    else @info.langOpts)
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        text: mod
        rightLabel: if prefix[0]=='-' then 'ghc flag' else 'Language'
        replacementPrefix: prefix
        type: 'keyword'

  isIn: (scope) ->
    scope.every (s1) =>
      @scopes.some (s) ->
        s==s1

  genSpaceSearch: =>
    new Promise (resolve) =>
      @editor.backwardsScanInBufferRange /[\w.']+/,
        @lineRange, ({matchText,stop})->
          resolve(matchText)
          stop()

  buildSymbolSuggestion: (s, prefix) ->
    text: s.qname ? s.name
    rightLabel: s.module.name
    type: s.symbolType
    replacementPrefix: prefix
    description: s.name+" :: "+s.typeSignature

  getMatches: (prefix,type) =>
    @symbols
      .filter (s) ->
        s.name.startsWith(prefix)\
          and (if type? then s.symbolType=='class' or s.symbolType=='type'\
                        else true)
      .map (s) =>
        @buildSymbolSuggestion(s, prefix)

  getTypeMatches: (type) =>
    @symbols
      .filter (s) ->
        return false unless s.type?
        tl = s.type.split(' -> ').slice(-1)[0]
        return false if tl.match(/^[a-z]$/)
        ts = tl.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
        rx=RegExp ts.replace(/\b[a-z]\b/g,'.+'),''
        rx.test(type)
      .map (s) =>
        @buildSymbolSuggestion(s, @prefix)

  getModuleMatches: (prefix) =>
    mod=""
    @editor.backwardsScanInBufferRange /^import ([\w.]+)/, @lineRange,
      ({match,stop}) ->
        mod=match[1]
        stop()
    return [] unless mod?
    @controller.backend.listImportedSymbols @editor.getBuffer(), [{name: mod}]
      .then (symbols) =>
        symbols
          .filter (s) ->
            s.name.startsWith(prefix)
          .map (s) =>
            @buildSymbolSuggestion(s,prefix)

  getSuggestions: =>
    if @isIn(@typeScope)
      @genSpaceSearch()
        .then (prefix) =>
          @getMatches(prefix, true)
    else if @isIn(@moduleScope)
      @genSpaceSearch()
        .then(@getModule)
    else if @isIn(@exportsScope)
      @genSpaceSearch()
        .then(@getModuleMatches)
    else if @isIn(@preprocessorScope)
      @genSpaceSearch()
        .then(@getPreprocessor)
    #should be last as least sepcialized
    else if @isIn(@sourceScope)
      if(@prefix=='_')
        @genTypeSearch()
          .then @getTypeMatches
      else
        @genSpaceSearch()
          .then @getMatches
    else
      []
