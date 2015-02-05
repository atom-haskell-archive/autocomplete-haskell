AutocompleteProvider = require './autocomplete-provider.coffee'

module.exports = AutocompleteHaskell =
  config:
    trimTypeTo:
      type: 'string'
      default: '50'
      description: 'Trim long types to this number of characters'
    hooglePath:
      type: 'string'
      default: 'hoogle'
      description: 'Path to hoogle executable'

  provider: null

  activate: ->
    @provider = new AutocompleteProvider unless @provider?

  deactivate: ->
    @provider.dispose()
    @provider = null

  autocompleteProvider_1_0_0: () =>
    @provider = new AutocompleteProvider unless @provider?
    {provider:@provider}

  consumeGhcMod_0_1_0: (service) =>
    @provider = new AutocompleteProvider unless @provider?
    @provider.ghcModProvider service
