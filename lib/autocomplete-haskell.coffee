{CompositeDisposable} = require 'atom'
SuggestionBuilder = require './suggestion-builder'
BackendHelper = require 'atom-backend-helper'
LastSuggestionView = require './last-suggestion-view'

module.exports = AutocompleteHaskell =
  config:
    completionBackendInfo:
      type: "boolean"
      default: true
      description: "Show info message about haskell-completion-backend service
                    on activation"
    useBackend:
      type: "string"
      default: ''
      description: 'Name of backend to use. Leave empty for any. Consult
                    backend provider documentation for name.'

  backend: null
  disposables: null
  backendHelperDisp: null

  activate: (state) ->
    @backendHelper = new BackendHelper 'autocomplete-haskell',
      main: AutocompleteHaskell
      backendInfo: 'completionBackendInfo'
      backendName: 'haskell-completion-backend'

    @backendHelper.init()

    @disposables = new CompositeDisposable
    @globalDisposables = new CompositeDisposable
    @globalDisposables.add @disposables

    @panel = atom.workspace.addBottomPanel
      item: @view = new LastSuggestionView
      visible: state.panelVisible
      priority: 200

    @globalDisposables.add atom.commands.add 'atom-workspace',
      'autocomplete-haskell:toggle-completion-hint': =>
        if @panel.isVisible()
          @panel.hide()
        else
          @panel.show()

  serialize: ->
    panelVisible: @panel.isVisible()

  deactivate: ->
    @backendHelperDisp?.dispose()
    @globalDisposables.dispose()
    @disposables = null
    @globalDisposables = null
    @backendHelper = null
    @panel.destroy()
    @panel = null

  autocompleteProvider_2_0_0: ->
    selector: '.source.haskell'
    disableForSelector: '.source.haskell .comment'
    inclusionPriority: 0
    getSuggestions: (options) =>
      return [] unless @backend?
      (new SuggestionBuilder options, @backend).getSuggestions()
    onDidInsertSuggestion: ({editor, triggerPosition, suggestion}) =>
      @view.setText "#{suggestion.description}"

  consumeCompBack: (service) ->
    @backendHelperDisp = @backendHelper.consume service,
      success: =>
        @disposables.add atom.workspace.observeTextEditors (editor) =>
          return unless editor.getGrammar().scopeName == "source.haskell"
          @disposables.add service.registerCompletionBuffer editor.getBuffer()
      dispose: =>
        @disposables.dispose()
        @disposables = new CompositeDisposable
