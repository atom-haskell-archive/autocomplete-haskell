CP = require('child_process')
module.exports=
class SuggestionBuilder
  constructor: (@options) ->

  searchPromise: (editor,prefix) ->

  getSuggestions: ->
    editor = @options.editor
    prefix = @options.prefix
    scopes = @options.scope.scopes

    if (scopes.some (scope) -> scope!='source.haskell')
      return [] # TODO: modules and types shoul also be a-c'd

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
        hooglePath=atom.config.get 'autocomplete-haskell.hooglePath'
        new Promise (resolve,reject) ->
          CP.execFile hooglePath,[search], {}, (error,data) ->
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
                trimTypeTo=atom.config.get 'autocomplete-haskell.trimTypeTo'
                type=type.slice(0,trimTypeTo)+'...' if type.length>trimTypeTo
                {
                  word: name
                  label: type
                  prefix: prefix
                })
