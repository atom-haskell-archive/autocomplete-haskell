AutocompleteProvider = require './autocomplete-provider.coffee'

module.exports = AutocompleteHaskell =
  config:
    ideBackendInfo:
      type: "boolean"
      default: true
      description: "Show info message about haskell-ide-backend service on
                    activation"

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
