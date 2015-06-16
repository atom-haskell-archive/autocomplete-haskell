{CompositeDisposable} = require 'atom'
SuggestionBuilder = require './suggestion-builder'
BackendHelper = require 'atom-backend-helper'

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

  activate: ->
    @backendHelper = new BackendHelper 'autocomplete-haskell',
      main: AutocompleteHaskell
      backendInfo: 'completionBackendInfo'
      backendName: 'haskell-completion-backend'

    @backendHelper.init()

    @disposables = new CompositeDisposable

  deactivate: ->
    @disposables.dispose()
    @disposables = null
    @backend = null
    @backendHelper = null

  autocompleteProvider_2_0_0: ->
    selector: '.source.haskell'
    disableForSelector: '.source.haskell .comment'
    inclusionPriority: 0
    getSuggestions: (options) =>
      return [] unless @backend?
      (new SuggestionBuilder options, @backend).getSuggestions()

  consumeCompBack_0_1_0: (service) ->
    @disposables.add @backendHelper.consume service, dispose: =>
      @disposables.dispose()
      @disposables = new CompositeDisposable
    @disposables.add atom.workspace.observeTextEditors (editor) =>
      return unless editor.getGrammar().scopeName == "source.haskell"
      @disposables.add(@backend.registerCompletionBuffer editor.getBuffer())
