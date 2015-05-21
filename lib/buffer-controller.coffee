_ = require 'underscore-plus'
{CompositeDisposable} = require 'atom'
SuggestionBuilder = require './suggestion-builder'

module.exports=
class BufferController
  constructor: (@buffer,p) ->
    @modules=[]
    @symbols=[]
    @symbolsType=[]
    @backend=p.backend
    @subscriptions = new CompositeDisposable
    @subscriptions.add @buffer.onDidSave @checkImportedModules
    @subscriptions.add @buffer.onDidDestroy @destroy
    @subscriptions.add p.onDidGetBackend @setBackend
    @checkImportedModules()

  setBackend: (@backend) =>
    @checkImportedModules()

  destroy: =>
    @buffer = null
    @subscriptions.dispose()

  checkImportedModules: =>
    modules=@backend?.getImportedModules @buffer
    if modules?
      unless _.isEqual(modules,@modules)
        @modules=modules
        @updateModuleSymbols()

  updateModuleSymbols: =>
    @backend?.listImportedSymbols(@buffer,@modules).then (data) =>
      @symbols=data
      @symbolsType=@symbols.filter (s) ->
        s.symbolType=='class' or s.symbolType=='type'

  getSuggestions: (options,info)->
    sb=new SuggestionBuilder(options,info,this)
    sb.getSuggestions()
