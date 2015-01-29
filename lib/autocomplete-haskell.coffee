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
    provider =
      selector: '.source.haskell'
      blacklist: '.source.haskell .comment'
      requestHandler: @p.buildSuggestions
      # dispose: ->
        # Your dispose logic here
    @registration = atom.services.provide  'autocomplete.provider',
      '1.0.0',
      provider:provider

  @deactivate: ->
    @registration.dispose()
    @p.destroy()

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
    atom.services.consume "haskell-ghc-mod", "0.1.0", @ghcModProvider
    @observers=atom.workspace.observeTextEditors (editor) =>
      return unless editor.getGrammar().scopeName=="source.haskell"
      ec = new EditorController(editor,@ghcmod)
      @editorMap.set editor, ec
      @onDidGetGhcModProvider ec.setGhcModProvider

  destroy: ->
    @observers.dispose()
    @emtitter?.destroy()
    for editor in atom.workspace.getEditors()
      @editorMap.get(editor)?.desrtoy?()
      @editorMap.delete(editor)

  buildSuggestions: (options) =>
    @editorMap.get(options.editor)?.getSuggestions options,@info
