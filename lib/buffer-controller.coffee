_ = require 'underscore-plus'
{CompositeDisposable} = require 'atom'
SuggestionBuilder = require './suggestion-builder'

module.exports=
class BufferController
  constructor: (@buffer,p) ->
    @modules=[]
    @symbols=[]
    @backend=p.backend
    @subscriptions = new CompositeDisposable
    @subscriptions.add @buffer.onDidStopChanging @checkImportedModules
    @subscriptions.add @buffer.onDidDestroy @destroy
    @subscriptions.add p.onDidGetBackend @setBackend
    @checkImportedModules()

  setBackend: (@backend) =>
    @updateModuleSymbols()

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

  getSuggestions: (options,info)->
    sb=new SuggestionBuilder(options,info,this)
    sb.getSuggestions()
