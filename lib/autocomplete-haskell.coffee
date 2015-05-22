AutocompleteProvider = require './autocomplete-provider.coffee'

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

  provider: null

  activate: ->
    @provider = new AutocompleteProvider

  deactivate: ->
    @provider.dispose()
    @provider = null

  autocompleteProvider_2_0_0: () ->
    @provider

  consumeCompBack_0_1_0: (service) ->
    @provider.backendProvider service
