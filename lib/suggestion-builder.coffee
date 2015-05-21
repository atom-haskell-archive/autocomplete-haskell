{Range} = require 'atom'
module.exports=
class SuggestionBuilder
  typeScope: ['meta.function.type-declaration.haskell']
  sourceScope: ['source.haskell']
  moduleScope: ['meta.import.haskell', 'support.other.module.haskell']
  preprocessorScope: ['meta.preprocessor.haskell']
  exportsScope: ['meta.import.haskell', 'meta.declaration.exports.haskell']

  pragmaWords: [
    'LANGUAGE', 'OPTIONS_GHC', 'INCLUDE', 'WARNING', 'DEPRECATED', 'INLINE',
    'NOINLINE', 'ANN', 'LINE', 'RULES', 'SPECIALIZE', 'UNPACK', 'SOURCE'
  ]

  constructor: (@options,@info,@controller) ->
    @editor = @options.editor
    @prefix = @options.prefix
    @scopes = @options.scopeDescriptor.scopes
    @symbols = @controller.symbols
    @lineRange = new Range [0, @options.bufferPosition.row],
      @options.bufferPosition

  lineSearch: (rx,idx=0) =>
    res=""
    @editor.backwardsScanInBufferRange rx,
      @lineRange, ({match,stop})->
        res=match[idx]
        stop()
    res

  isIn: (scope) ->
    scope.every (s1) =>
      @scopes.some (s) ->
        s==s1

  getPrefix: (rx=/[\w.']+/) =>
    @lineSearch rx

  #ghc-mod search
  getModule: =>
    prefix = @getPrefix()
    @info.moduleList
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        text: mod
        replacementPrefix: prefix
        type: 'import'

  getPreprocessor: =>
    kw=@lineSearch /\b(LANGUAGE|OPTIONS_GHC)\b/
    prefix=@getPrefix()
    return [] unless kw?
    label=''
    if kw=='OPTIONS_GHC'
      prefix=@getPrefix(/[\w-]+/)
      label='GHC Flag'
      list=@info.ghcFlags
    else if kw=='LANGUAGE'
      label='Language'
      list=@info.langOpts
    else
      label='Pragma'
      list=@pragmaWords

    list
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        text: mod
        rightLabel: label
        replacementPrefix: prefix
        type: 'keyword'

  buildSymbolSuggestion: (s, prefix) ->
    text: s.qname ? s.name
    rightLabel: s.module.name
    type: s.symbolType
    replacementPrefix: prefix
    description: s.name+" :: "+s.typeSignature

  getMatches: (type) =>
    prefix=@getPrefix()
    @symbols
      .filter (s) ->
        s.name.startsWith(prefix)\
          and (if type? then s.symbolType=='class' or s.symbolType=='type'\
                        else true)
      .map (s) =>
        @buildSymbolSuggestion(s, prefix)

  getTypeMatches: () =>
    unless @controller.backend
      return Promise.reject(Error('no backend'))
    r = new Range @options.bufferPosition, @options.bufferPosition
    @controller.backend.getType @editor.getBuffer(), r
      .then (type) =>
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

  getModuleMatches: =>
    prefix = @getPrefix()
    mod=@lineSearch /^import ([\w.]+)/, 1
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
      @getMatches(true)
    else if @isIn(@moduleScope)
      @getModule()
    else if @isIn(@exportsScope)
      @getModuleMatches()
    else if @isIn(@preprocessorScope)
      @getPreprocessor()
    #should be last as least sepcialized
    else if @isIn(@sourceScope)
      if(@prefix=='_')
        @getTypeMatches()
      else
        @getMatches()
    else
      []
