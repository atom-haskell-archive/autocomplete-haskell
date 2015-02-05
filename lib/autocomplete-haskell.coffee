EditorController = require './editor-controller'
{Emitter} = require 'atom'

module.exports =
class AutocompleteHaskell
  @config:
    trimTypeTo:
      type: 'string'
      default: '50'
      description: 'Trim long types to this number of characters'
    hooglePath:
      type: 'string'
      default: 'hoogle'
      description: 'Path to hoogle executable'

  @activate: ->
    @p = new AutocompleteHaskell

  @deactivate: ->
    @p.dispose()

  @autocompleteProvider_1_0_0: () =>
    {provider: @p}

  @consumeGhcMod_0_1_0: (service) =>
    @p.ghcModProvider service

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
  ghcmod: null

  ghcModProvider: (@ghcmod) =>
    @ghcmod.list (res) => @info.moduleList=res
    @ghcmod.lang (res) => @info.langOpts=res
    @ghcmod.flag (res) => @info.ghcFlags=res
    @ghcmod.browse ["Prelude"], (res) =>
      @info.preludeSymbs=res
    @emitter.emit 'did-get-ghc-mod-provider', @ghcmod

  onDidGetGhcModProvider: (callback) ->
    @emitter.on 'did-get-ghc-mod-provider', callback

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
