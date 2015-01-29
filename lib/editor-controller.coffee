_ = require 'underscore-plus'
{CompositeDisposable} = require 'atom'
SuggestionBuilder = require './suggestion-builder'

module.exports=
class EditorController
  constructor: (@editor,@ghcmod) ->
    @modules=[]
    @symbols=[]
    @subscriptions = new CompositeDisposable
    @subscriptions.add @editor.onDidStopChanging @checkImportedModules
    @subscriptions.add @editor.onDidDestroy @destroy
    @checkImportedModules

  setGhcModProvider: (@ghcmod) =>
    @updateModuleSymbols()

  destroy: =>
    @editor = null
    @subscriptions.dispose()

  checkImportedModules: =>
    modules=[]
    regex=/^import\s+(?:qualified\s+)?([\w.]+)/gm
    r = @editor.getBuffer().getRange()
    @editor.backwardsScanInBufferRange regex, r, ({match}) ->
      modules.push(match[1])
    unless _.isEqual(modules,@modules)
      @modules=modules
      @updateModuleSymbols()

  updateModuleSymbols: ->
    @ghcmod?.browse @modules,(data)=>
      @symbols=data

  getSuggestions: (options,info)->
    sb=new SuggestionBuilder(options,info,this)
    sb.getSuggestions()
