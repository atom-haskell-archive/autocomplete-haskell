BufferController = require './buffer-controller'
{Emitter} = require 'atom'

module.exports =
class AutocompleteProvider
  selector: '.source.haskell'
  disableForSelector: '.source.haskell .comment'
  inclusionPriority: 1
  excludeLowerPriority: false
  info:
    moduleList: []
    langOpts: []
    ghcFlags: []
  emitter: null
  bufferMap: null
  observers: null
  backend: null

  backendProvider: (@backend) =>
    @emitter.emit 'did-get-backend', @backend
    @backend.listModules(atom.project.getDirectories()[0]).then (res) =>
      @info.moduleList=res
    @backend.listLanguagePragmas().then (res) => @info.langOpts=res
    @backend.listCompilerOptions().then (res) => @info.ghcFlags=res

  onDidGetBackend: (callback) ->
    @emitter.on 'did-get-backend', callback

  constructor: ->
    @emitter = new Emitter
    @bufferMap = new WeakMap
    @observers=atom.workspace.observeTextEditors (editor) =>
      return unless editor.getGrammar().scopeName=="source.haskell"
      buf = editor.getBuffer()
      @bufferMap.set buf, new BufferController(buf,this)

  dispose: =>
    @observers.dispose()
    @emtitter?.destroy()
    for editor in atom.workspace.getTextEditors()
      @bufferMap.get(editor.getBuffer())?.desrtoy?()
      @bufferMap.delete(editor.getBuffer())

  getSuggestions: (options) =>
    @bufferMap.get(options.editor.getBuffer())?.getSuggestions? options,@info
