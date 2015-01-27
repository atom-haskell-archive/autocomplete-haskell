SuggestionBuilder = require './suggestion-builder'

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
    @services=atom.services.consume "haskell-ghc-mod", "0.1.0", (gm) =>
      gm.list (res) => @info.moduleList=res
      gm.lang (res) => @info.langOpts=res
      gm.flag (res) => @info.ghcFlags=res
      gm.browse "Prelude", (res) =>
        @info.preludeMods=res

  destroy: ->
    @services.dispose()

  buildSuggestions: (options) =>
    sb=new SuggestionBuilder(options,@info)
    sb.getSuggestions()
