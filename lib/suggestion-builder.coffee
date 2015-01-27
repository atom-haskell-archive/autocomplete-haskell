CP = require('child_process')
{Range} = require 'atom'
module.exports=
class SuggestionBuilder
  typeScope: 'meta.function.type-declaration.haskell'
  sourceScope: 'source.haskell'
  moduleScope: 'support.other.module.haskell'
  preprocessorScope: 'meta.preprocessor.haskell'

  constructor: (@options,@info) ->
    @editor = @options.editor
    @prefix = @options.prefix
    @scopes = @options.scope.scopes
    @trimTypeTo=atom.config.get 'autocomplete-haskell.trimTypeTo'
    @hooglePath=atom.config.get 'autocomplete-haskell.hooglePath'

  getBufferModules: =>
    modules=[]
    regex=/^import\s+(?:qualified\s+)?([\w.]+)/gm
    r = @editor.getBuffer().getRange()
    @editor.backwardsScanInBufferRange regex, r, ({match}) ->
      modules.push(match[1])
    modules

  addModules: (search) =>
    '+'+@getBufferModules().join(' +')+' '+search

  genTypeSearch: =>
    new Promise (resolve,reject) =>
      services=atom.services.consume "haskell-ghc-mod", "0.1.0", (gm) =>
        cr=@options.cursor.getCurrentWordBufferRange()
        gm.type @editor.getText(),cr,(range,type,crange)->
          services.dispose()
          if type!='???'
            resolve ':: '+type.replace /[\w.]+\.[\w.]+/g,'_'
          else
            reject(Error('err'))

  search: =>
    Promise.resolve(@prefix)

  searchHoogle: (search) =>
    new Promise (resolve,reject) =>
      CP.execFile @hooglePath,[search], {}, (error,data) ->
        if error
          reject(error)
          return
        resolve data.split('\n')

  trim: (label) =>
    if label.length>@trimTypeTo
      label.slice(0,@trimTypeTo)+'...'
    else
      label

  getFirstClass: (data) =>
    console.log(@scopes)
    data
      .filter (line) ->
        line.contains('::')
      .map (line) =>
        line=line.slice(line.indexOf(' ')+1)
        [name,type]=line.split('::').map (line) ->
          line.trim()
        type=type.slice(0,@trimTypeTo)+'...' if type.length>@trimTypeTo
        {
          word: name
          label: type
          prefix: @prefix
        }

  getType: (data) =>
    data
      .filter (line) ->
        line.contains('data') ||
          line.contains('type') ||
          line.contains('newtype')
      .map (line) =>
        label=line
        line=line.slice(line.indexOf(' ')+1)
        line=line.slice(line.indexOf(' ')+1)
        name=line.slice(0,line.indexOf(' '))
        {
          word: name
          label: @trim label
          prefix: @prefix
        }

  getModule: (prefix) =>
    @info.moduleList
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        word: mod
        label: 'preprocessor'
        prefix: prefix

  getPreprocessor: (prefix) =>
    (if prefix[0]=='-' then @info.ghcFlags
    else @info.langOpts)
      .filter (line) ->
        line.startsWith prefix
      .map (mod) ->
        word: mod
        label: 'preprocessor'
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

  getSuggestions: =>
    if @isIn(@typeScope)
      console.log('typeScope')
      #TODO: use ghc-mod, need to latch on to editor for this
      @search()
        .then(@addModules)
        .then(@searchHoogle)
        .then(@getType)
    else if @isIn(@moduleScope)
      console.log('moduleScope')
      @genSpaceSearch()
        .then(@getModule)
    else if @isIn(@preprocessorScope)
      console.log('preprocessorScope')
      @genSpaceSearch()
        .then(@getPreprocessor)
    #should be last as least sepcialized
    else if @isIn(@sourceScope)
      console.log('sourceScope')
      if(@prefix=='_')
        @genTypeSearch()
          .then(@addModules)
          .then(@searchHoogle)
          .then(@getFirstClass)
      else
      #TODO: use ghc-mod, need to latch on to editor for this
        @search()
          .then(@addModules)
          .then(@searchHoogle)
          .then(@getFirstClass)
    else
      console.log('unkScope')
      console.log(@scopes)
      []
