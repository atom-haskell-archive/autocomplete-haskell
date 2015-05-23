{CompositeDisposable} = require 'atom'
SuggestionBuilder = require './suggestion-builder'

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
    @disposables = new CompositeDisposable
    if atom.config.get('autocomplete-haskell.completionBackendInfo')
      setTimeout (=>
        unless @backend?
          bn = atom.config.get('autocomplete-haskell.useBackend')
          if !bn
            message = "
              Autocomplete-haskell:
              Autocomplete-haskell requires a package providing
              haskell-completion-backend service.
              Consider installing haskell-ghc-mod or other package, which
              provides haskell-completion-backend.
              You can disable this message in autocomplete-haskell settings.
              "
          else
            p=atom.packages.getActivePackage(bn)
            if p?
              message = "
                Autocomplete-haskell:
                You have selected #{bn} as your backend provider, but it
                does not provide haskell-completion-backend service.
                You may need to update #{bn}.
                You can disable this message in autocomplete-haskell settings.
                "
            else
              message = "
                Autocomplete-haskell:
                You have selected #{bn} as your backend provider, but it
                failed to activate.
                Check your spelling and if #{bn} is installed and activated.
                You can disable this message in autocomplete-haskell settings.
                "
          atom.notifications.addWarning message, dismissable: true
          console.log message
        ), 5000

  deactivate: ->
    @disposables.dispose()
    @disposables = null


  autocompleteProvider_2_0_0: () ->
    selector: '.source.haskell'
    disableForSelector: '.source.haskell .comment'
    inclusionPriority: 1
    excludeLowerPriority: false
    getSuggestions: (options) =>
      (new SuggestionBuilder options, @backend).getSuggestions()

  consumeCompBack_0_1_0: (service) ->
    return if @backend?
    bn = atom.config.get('autocomplete-haskell.useBackend')
    return if !!bn and service.name()!=bn
    @backend = service
    @backend.onDidDestroy =>
      @backend = null
      @disposables.dispose()
    @disposables.add atom.workspace.observeTextEditors (editor) =>
      return unless editor.getGrammar().scopeName=="source.haskell"
      @disposables.add(@backend.registerCompletionBuffer editor.getBuffer())
