module.exports =
class LastSuggestionView
  constructor: ->
    @[0] = @element = document.createElement 'div'
    {CompositeDisposable} = require 'atom'
    @disposables = new CompositeDisposable
    @disposables.add atom.config.observe 'editor.fontFamily', (val) =>
      @element.style.fontFamily = val ? ''
    @disposables.add atom.config.observe 'editor.fontSize', (val) =>
      @element.style.fontSize = "#{val}px" ? ''

  destroy: ->
    @element.remove()

  setText: (text) ->
    @element.innerHTML = require('atom-highlight')
      fileContents: text
      scopeName: 'hint.haskell'
      nbsp: false
      editorDiv: true
      editorDivTag: 'autocomplete-haskell-hint'

  getText: ->
    @element.innerText
