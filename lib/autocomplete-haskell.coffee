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
    ingoreMinimumWordLengthForHoleCompletions:
      type: 'boolean'
      default: 'true'
      description: 'If enabled, hole completions will be shown on \'_\' keystroke.
                    Otherwise, only when there is a prefix, e.g. \'_something\''
    defaultHintPanelVisibility:
      type: 'string'
      default: 'Visible'
      enum: ['Visible', 'Hidden']
    hideHintPanelIfEmpty:
      type: 'boolean'
      default: false
      description: '''
      Hide hint panel if it's empty. Also enables 'escape' key
      to hide it.
      '''

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

    if state.panelVisible ? (atom.config.get('autocomplete-haskell.defaultHintPanelVisibility') is 'Visible')
      @createPanel()

    @globalDisposables.add atom.config.observe 'autocomplete-haskell.hideHintPanelIfEmpty', (val) =>
      if @panel?
        if val
          if @view.getText()
            @panel.show()
          else
            @panel.hide()
        else
          @panel.show()

    atom.keymaps.add 'autocomplete-haskell',
      'atom-text-editor[data-grammar~="haskell"]':
        'escape': 'autocomplete-haskell:conceal-hint-panel'

    @globalDisposables.add \
      atom.commands.add 'atom-text-editor[data-grammar~="haskell"]',
        'autocomplete-haskell:conceal-hint-panel': ({currentTarget, abortKeyBinding}) =>
          if @panel?.isVisible?() and atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')
            @panel.hide()
          else
            abortKeyBinding?()

    @globalDisposables.add atom.commands.add 'atom-workspace',
      'autocomplete-haskell:toggle-completion-hint': =>
        if @panel?
          @destroyPanel()
        else
          @createPanel()

    @globalDisposables.add atom.menu.add [
        'label': 'Haskell IDE'
        'submenu': [
          # 'label': 'Autocomplete Haskell'
          # 'submenu': [
              'label': 'Toggle Completion Hint Panel'
              'command': 'autocomplete-haskell:toggle-completion-hint'
          # ]
        ]
    ]

  serialize: ->
    panelVisible: @panel?

  deactivate: ->
    @backendHelperDisp?.dispose()
    @globalDisposables.dispose()
    atom.keymaps.removeBindingsFromSource 'autocomplete-haskell'
    @disposables = null
    @globalDisposables = null
    @backendHelper = null
    @destroyPanel()

  createPanel: ->
    @panel = atom.workspace.addBottomPanel
      item: @view = new LastSuggestionView
      visible: true
      priority: 200

  destroyPanel: ->
    @panel.destroy()
    @panel = null
    @view = null

  autocompleteProvider_2_0_0: ->
    selector: '.source.haskell'
    disableForSelector: '.source.haskell .comment'
    inclusionPriority: 0
    getSuggestions: (options) =>
      return [] unless @backend?
      (new SuggestionBuilder options, @backend).getSuggestions()
    onDidInsertSuggestion: ({editor, triggerPosition, suggestion}) =>
      if @view?
        if suggestion?.description?
          @view.setText "#{suggestion.description}"
          if atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')
            @panel.show()
        else
          @view.setText ''
          if atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')
            @panel.hide()

  consumeCompBack: (service) ->
    @backendHelperDisp = @backendHelper.consume service,
      success: =>
        @disposables.add atom.workspace.observeTextEditors (editor) =>
          return unless editor.getGrammar().scopeName == "source.haskell"
          @disposables.add service.registerCompletionBuffer editor.getBuffer()
      dispose: =>
        @disposables.dispose()
        @disposables = new CompositeDisposable
        @globalDisposables.add @disposables
