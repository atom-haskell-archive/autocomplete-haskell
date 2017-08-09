import {CompositeDisposable} from 'atom'
import highlight = require('atom-highlight')

export class LastSuggestionView {
  public element: HTMLElement
  private disposables: CompositeDisposable
  constructor (text: string = '') {
    this.element = document.createElement('div')
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.config.observe('editor.fontFamily', (val: string) => {
        this.element.style.fontFamily = val ? val : ''
      }),
      atom.config.observe('editor.fontSize', (val: number) => {
        this.element.style.fontSize = val ? `${val}px` : ''
      })
    )
    this.setText(text)
  }

  public destroy () {
    this.element.remove()
  }

  public setText (text: string) {
    this.element.innerHTML = highlight({
      fileContents: text,
      scopeName: 'hint.haskell',
      nbsp: false,
      editorDiv: true,
      editorDivTag: 'autocomplete-haskell-hint'
    })
  }
}
