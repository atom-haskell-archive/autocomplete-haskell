EditorController = require './editor-controller'
{Emitter} = require 'atom'

module.exports =
class AutocompleteProvider
  selector: '.source.haskell'
  blacklist: '.source.haskell .comment'
  info:
    moduleList: []
    langOpts: []
    ghcFlags: []
    preludeSymbs: []
  emitter: null
  editorMap: null
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
    @editorMap = new WeakMap
    @observers=atom.workspace.observeTextEditors (editor) =>
      return unless editor.getGrammar().scopeName=="source.haskell"
      @editorMap.set editor, new EditorController(editor,this)

  dispose: =>
    @observers.dispose()
    @emtitter?.destroy()
    for editor in atom.workspace.getEditors()
      @editorMap.get(editor)?.desrtoy?()
      @editorMap.delete(editor)

  requestHandler: (options) =>
    @editorMap.get(options.editor)?.getSuggestions options,@info
