CP = require('child_process')
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
    return unless label
    if label.length>@trimTypeTo
      label.slice(0,@trimTypeTo)+'...'
    else
      label

  #Hoogle search
  addModules: (search) =>
    '+'+@controller.modules.join(' +')+' '+search

  genTypeSearch: =>
    new Promise (resolve,reject) =>
      atom.services.consume "haskell-ghc-mod", "0.1.0", (gm) =>
        cr=@options.cursor.getCurrentWordBufferRange()
        gm.type @editor.getText(),cr,(range,type,crange)->
          if type!='???'
            resolve ':: '+type.replace /[\w.]+\.[\w.]+/g,'_'
          else
            reject(Error('err'))

  searchHoogle: (search) =>
    new Promise (resolve,reject) =>
      CP.execFile @hooglePath,[search], {}, (error,data) ->
        if error
          reject(error)
          return
        resolve data.split('\n')

  getFirstClass: (data) =>
    data
      .filter (line) ->
        line.contains('::')
      .map (line) =>
        line=line.slice(line.indexOf(' ')+1)
        [name,type]=line.split('::').map (line) ->
          line.trim()
        {
          word: name
          label: @trim type
          prefix: @prefix
        }

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

  getMatches: (symbols) =>
    symbols
      .filter (s) =>
        s.startsWith(@prefix)
      .map (s) ->
        s.split('::')
      .map (s) =>
        word: s[0].trim()
        label: @trim s[1]?.trim()
        prefix: @prefix

  getSuggestions: =>
    if @isIn(@typeScope)
      @getMatches @symbols
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
          .then(@addModules)
          .then(@searchHoogle)
          .then(@getFirstClass)
      else
        @getMatches @symbols
    else
      []
