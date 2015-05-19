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
    @scopes = @options.scope.scopes
    @symbols = @info.preludeSymbs.concat @controller.symbols
    @trimTypeTo=atom.config.get 'autocomplete-haskell.trimTypeTo'
    @hooglePath=atom.config.get 'autocomplete-haskell.hooglePath'

  #general utility
  trim: (label) =>
    if label?.length>@trimTypeTo
      label.slice(0,@trimTypeTo)+'...'
    else
      label

  #Hoogle search
  addModules: (search) =>
    '+'+@controller.modules.join(' +')+' '+search

  genTypeSearch: =>
    unless @controller.backend
      return Promise.reject(Error('no backend'))
    cr=@options.cursor.getCurrentWordBufferRange()
    @controller.backend.getType(@editor.getBuffer(),cr)

  #ghc-mod search
  getModule: (prefix) =>
    @info.moduleList
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        word: mod
        label: 'module'
        prefix: prefix

  getPreprocessor: (prefix) =>
    (if prefix[0]=='-' then @info.ghcFlags
    else @info.langOpts)
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        word: mod
        label: if prefix[0]=='-' then 'ghc flag' else 'Language'
        prefix: prefix

  isIn: (scope) ->
    @scopes.some (s) -> s==scope

  genSpaceSearch: =>
    r = new Range @options.cursor.getCurrentLineBufferRange().start,
      @options.position
    new Promise (resolve) =>
      @editor.backwardsScanInBufferRange /[^\s]+/, r, ({matchText,stop})->
        resolve(matchText)
        stop()

  getSymbols: () =>
    [].concat (@symbols.map (m) ->
      if m.qualified
        m.symbols.map (s) ->
          name: (m.alias ? m.name)+"."+s.name
          type: s.type
      else
        m.symbols)...

  getMatches: (prefix) =>
    @getSymbols()
      .filter (s) ->
        s.name.startsWith(prefix)
      .map (s) =>
        word: s.name
        label: @trim s.type
        prefix: prefix

  getTypeMatches: (type) =>
    @getSymbols()
      .filter (s) ->
        return false unless s.type?
        tl = s.type.split(' -> ').slice(-1)[0]
        return false if tl.match(/^[a-z]$/)
        ts = tl.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
        rx=RegExp ts.replace(/\b[a-z]\b/g,'.+'),''
        rx.test(type)
      .map (s) =>
        word: s.name
        label: @trim s.type
        prefix: @prefix

  getSuggestions: =>
    if @isIn(@typeScope)
      @getMatches(@prefix)
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
