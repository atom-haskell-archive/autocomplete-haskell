CP = require('child_process')
module.exports=
class SuggestionBuilder
  typeScope: 'meta.function.type-declaration.haskell'
  sourceScope: 'source.haskell'
  moduleScope: 'support.other.module.haskell'

  constructor: (@options,@info) ->
    @editor = @options.editor
    @prefix = @options.prefix
    @scopes = @options.scope.scopes
    @trimTypeTo=atom.config.get 'autocomplete-haskell.trimTypeTo'
    @hooglePath=atom.config.get 'autocomplete-haskell.hooglePath'


  addModules: (search) =>
    regex=/^import\s+(?:qualified\s+)?([\w.]+)/gm
    regex2=new RegExp(regex.source,"")
    modules=@editor.getText().match(regex).map (item) ->
      regex2.exec(item)[1]
    '+'+modules.join(' +')+' '+search

  genSearch: =>
    if @prefix=='_'
      new Promise (resolve,reject) =>
        services=atom.services.consume "haskell-ghc-mod", "0.1.0", (gm) =>
          cr=@options.cursor.getCurrentWordBufferRange()
          gm.type @editor.getText(),cr,(range,type,crange)->
            services.dispose()
            if type!='???'
              resolve ':: '+type.replace /[\w.]+\.[\w.]+/g,'_'
            else
              reject(Error('err'))
    else
      @search()

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
  getModule: (data) =>
    data
      .filter (line) ->
        line.contains('module')
      .map (line) =>
        label='module'
        line=line.slice(line.indexOf(' ')+1)
        line=line.slice(line.indexOf(' ')+1)
        name=line
        {
          word: name
          label: @trim label
          prefix: @prefix
        }

  replaceModuleName: (search) ->
    search.replace('_','.')

  isIn: (scope) ->
    @scopes.some (s) -> s==scope

  getSuggestions: =>
    if @isIn(@typeScope)
      console.log('typeScope')
      @search()
        .then(@addModules)
        .then(@searchHoogle)
        .then(@getType)
    else if @isIn(@moduleScope)
      console.log('moduleScope')
      @info.moduleList
        .filter (line) =>
          line.startsWith @replaceModuleName(@prefix)
        .map (mod) =>
          word: mod
          label: 'module'
          prefix: @prefix
    #should be last as least sepcialized
    else if @isIn(@sourceScope)
      console.log('sourceScope')
      @genSearch()
        .then(@addModules)
        .then(@searchHoogle)
        .then(@getFirstClass)
    else
      console.log('unkScope')
      console.log(@scopes)
      []
