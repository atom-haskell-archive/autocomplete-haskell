{Range} = require 'atom'
module.exports=
class SuggestionBuilder
  typeScope: 'meta.function.type-declaration.haskell'
  sourceScope: 'source.haskell'
  moduleScope: 'support.other.module.haskell'
  preprocessorScope: 'meta.preprocessor.haskell'
  exportsScope: 'meta.declaration.exports.haskell'
  #TODO: exports scope

  constructor: (@options,@info,@controller) ->
    @editor = @options.editor
    @prefix = @options.prefix
    @scopes = @options.scopeDescriptor.scopes
    @symbols = @controller.symbols

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
    @scopes.some (s) -> s==scope

  genSpaceSearch: =>
    r = new Range {column:0, row:@options.bufferPosition.row},
      @options.bufferPosition
    new Promise (resolve) =>
      @editor.backwardsScanInBufferRange /[^\s]+/, r, ({matchText,stop})->
        resolve(matchText)
        stop()

  buildSymbolSuggestion: (s, prefix) ->
    text: s.name
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

  getSuggestions: =>
    if @isIn(@typeScope)
      @getMatches(@prefix, 'type')
    else if @isIn(@moduleScope)
      @genSpaceSearch()
        .then(@getModule)
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
