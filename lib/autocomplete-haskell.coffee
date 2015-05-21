AutocompleteProvider = require './autocomplete-provider.coffee'

module.exports = AutocompleteHaskell =
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
