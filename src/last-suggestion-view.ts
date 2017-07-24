/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export class LastSuggestionView {
  public element: HTMLElement
  private editor: AtomTypes.TextEditor
  constructor () {
    this.element = document.createElement('atom-text-editor')
    this.element.setAttribute('mini', '')
    this.element.removeAttribute('tabindex')
    this.editor = (this.element as any).getModel()
  }

  public destroy () {
    return this.element.remove()
  }

  public setText (text: string) {
    const grammar = this.editor.getGrammar()
    if (!grammar || grammar.scopeName !== 'hint.haskell') {
      this.editor.setGrammar(atom.grammars.grammarForScopeName('hint.haskell'))
    }
    return this.editor.setText(text)
  }

  public getText () {
    return this.editor.getText()
  }
}
