module.exports =
class LastSuggestionView
  constructor: ->
    @[0] = @element = document.createElement 'atom-text-editor'
    @element.setAttribute 'mini', true
    @element.removeAttribute 'tabindex'
    @editor = @element.getModel()

  destroy: ->
    @element.remove()

  setText: (text) ->
    unless @editor.getGrammar()?.scopeName is 'hint.haskell'
      @editor.setGrammar atom.grammars.grammarForScopeName 'hint.haskell'
    @editor.setText text

  getText: ->
    @editor.getText()
