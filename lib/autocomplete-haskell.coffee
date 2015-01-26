SuggestionBuilder = require './suggestion-builder'

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

  activate: ->
    provider =
      selector: '.source.haskell'
      blacklist: '.source.haskell .comment'
      requestHandler: @buildSuggestions
      # dispose: ->
        # Your dispose logic here
    @registration = atom.services.provide  'autocomplete.provider',
     '1.0.0',
     provider:provider

  deactivate: ->
    @registration.dispose()

  buildSuggestions: (options) ->
    sb=new SuggestionBuilder(options)
    sb.getSuggestions()
