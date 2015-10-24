module.exports =
class LastSuggestionView
  constructor: ->
    @[0] = @element = document.createElement 'atom-text-editor'
    @element.setAttribute 'mini', true
    @element.removeAttribute 'tabindex'
    @editor = @element.getModel()
    @editor.setGrammar atom.grammars.grammarForScopeName 'source.haskell'

  destroy: ->
    @element.remove()

  setText: (text) ->
    @editor.setText text
