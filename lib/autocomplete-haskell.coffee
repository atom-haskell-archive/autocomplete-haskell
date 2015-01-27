SuggestionBuilder = require './suggestion-builder'
EditorController = require './editor-controller'

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

  constructor: ->
    @info = {}
    @editorMap = new WeakMap
    atom.services.consume "haskell-ghc-mod", "0.1.0", (gm) =>
      gm.list (res) => @info.moduleList=res
      gm.lang (res) => @info.langOpts=res
      gm.flag (res) => @info.ghcFlags=res
      gm.browse ["Prelude"], (res) =>
        @info.preludeSymbs=res
    @observers=atom.workspace.observeTextEditors (editor) =>
      return unless editor.getGrammar().scopeName=="source.haskell"
      @editorMap.set editor, new EditorController(editor)

  destroy: ->
    @observers.dispose()
    for editor in atom.workspace.getEditors()
      @editorMap.get(editor)?.desrtoy()
      @editorMap.delete(editor)

  buildSuggestions: (options) =>
    @editorMap.get(options.editor).getSuggestions options,@info
