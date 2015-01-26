CP = require('child_process')

module.exports = AutocompleteHaskell =
  editorSubscription: null
  providers: []
  autocomplete: null

  activate: ->
    provider =
      selector: '.source.haskell'
      blacklist: '.source.haskell .comment'
      requestHandler: @buildSuggestions
      # dispose: ->
        # Your dispose logic here
    @registration = atom.services.provide('autocomplete.provider', '0.1.0', {provider:provider})

  deactivate: ->
    @registration.dispose()

  buildSuggestions: (options) ->
    editor = options.editor
    prefix = options.prefix

    if prefix=='_'
      controller=editor.haskellGhcModController
      return [] unless controller
      searchPromise= new Promise (resolve,reject) =>
        controller.getTypeCallback (range,type,crange)=>
          if type!='???'
            resolve ':: '+type.replace /[\w.]+\.[\w.]+/g,'_'
          else
            reject(Error('err'))
    else
      searchPromise= Promise.resolve(prefix)

    searchPromise.then((search) ->
      regex=/^import\s+(?:qualified\s+)?([\w.]+)/gm
      regex2=new RegExp(regex.source,"")
      modules=editor.getText().match(regex).map (item) ->
        regex2.exec(item)[1]
      '+'+modules.join(' +')+' '+search
    ).then (search) ->
        new Promise (resolve,reject) ->
          CP.execFile 'hoogle',[search], {}, (error,data) ->
            if error
              reject(error)
              return
            resolve (data.split('\n')
              .slice(0,10)
              .filter (line) =>
                line.contains('::')
              .map (line) =>
                line=line.slice(line.indexOf(' ')+1)
                [name,type]=line.split('::').map (line) ->
                  line.trim()
                type=type.slice(0,@trimTypeTo)+'...' if type.length>@trimTypeTo
                {
                  word: name
                  label: type
                  prefix: prefix
                })
