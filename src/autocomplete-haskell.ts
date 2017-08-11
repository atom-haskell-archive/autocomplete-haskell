import {IEventDesc, CompositeDisposable, Disposable} from 'atom'
import {SuggestionBuilder, IOptions, ISuggestion} from './suggestion-builder'
import {LastSuggestionView} from './last-suggestion-view'

let backend: UPI.CompletionBackend.ICompletionBackend | undefined
let disposables: CompositeDisposable | undefined
let panel: AtomTypes.Panel | undefined
let upi: UPI.IUPIInstance | undefined
let lastCompletionDesc: string | undefined

interface IState {
  panelVisible?: boolean
  lastCompletionDesc: string | undefined
}

interface IACPDidInsertEventParams {
  editor: AtomTypes.TextEditor
  triggerPosition: AtomTypes.Point
  suggestion: ISuggestion
}

export {config} from './config'

export function activate (state: IState) {
  disposables = new CompositeDisposable()

  if (state.panelVisible === undefined) {
    state.panelVisible = (atom.config.get('autocomplete-haskell.defaultHintPanelVisibility') === 'Visible')
  }

  lastCompletionDesc = state.lastCompletionDesc

  if (state.panelVisible) {
    createPanel()
  }

  disposables.add(atom.config.observe('autocomplete-haskell.hideHintPanelIfEmpty', (val) => {
    if (panel) {
      !val || lastCompletionDesc ? panel.show() : panel.hide()
    }
  }))

  disposables.add(
    atom.commands.add('atom-text-editor[data-grammar~="haskell"]', {
      'autocomplete-haskell:conceal-hint-panel': ({currentTarget, abortKeyBinding}: IEventDesc) => {
        if (panel && panel.isVisible() && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
          panel.hide()
        } else {
          if (typeof abortKeyBinding === 'function') {
            abortKeyBinding()
          }
        }
      }
    }
    )
  )

  disposables.add(atom.commands.add('atom-workspace', {
    'autocomplete-haskell:toggle-completion-hint': () => {
      if (panel) {
        destroyPanel()
      } else {
        createPanel()
      }
    }
  }
  )
  )

  disposables.add(atom.menu.add([{
    label: 'Haskell IDE',
    submenu: [{
        label: 'Toggle Completion Hint Panel',
        command: 'autocomplete-haskell:toggle-completion-hint'
    }]
  }]))
}

export function serialize (): IState {
  return {
    panelVisible: !!panel,
    lastCompletionDesc
  }
}

export function deactivate () {
  disposables && disposables.dispose()
  disposables = undefined
  upi = undefined
  destroyPanel()
}

function createPanel () {
  panel = atom.workspace.addBottomPanel({
    item: new LastSuggestionView(lastCompletionDesc),
    visible: true,
    priority: 200
  })
}

function destroyPanel () {
  panel && panel.destroy()
  panel = undefined
}

export function autocompleteProvider_2_0_0 () {
  return {
    selector: '.source.haskell',
    disableForSelector: '.source.haskell .comment',
    inclusionPriority: 0,
    getSuggestions: (options: IOptions) => {
      if (!backend) { return [] }
      return (new SuggestionBuilder(options, backend)).getSuggestions()
    },
    onDidInsertSuggestion: ({editor, triggerPosition, suggestion}: IACPDidInsertEventParams) => {
      if (suggestion && suggestion.description) {
        const desc = lastCompletionDesc = suggestion.description
        if (panel) {
          const view: LastSuggestionView = panel.getItem()
          view.setText(desc)
          if (atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
            panel.show()
          }
        }
        if (upi && atom.config.get('autocomplete-haskell.showIdeHaskellTooltip')) {
          const p2 = editor.getLastCursor().getBufferPosition()
          const p1 = p2.translate([0, -suggestion.text.length])
          setImmediate(() => {
            upi && upi.showTooltip({
              editor,
              eventType: UPI.TEventRangeType.keyboard,
              tooltip: {
                range: [p1, p2],
                persistent: true,
                text: {
                  text: desc,
                  highlighter: 'hint.haskell'
                }
              }
            })
          })
        }
      } else if (panel) {
        const view: LastSuggestionView = panel.getItem()
        view.setText('')
        if (panel && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
          panel.hide()
        }
      }
    }
  }
}

export function consumeUPI (service: UPI.IUPIRegistration) {
  upi = service({
    name: 'autocomplete-haskell'
  })
  disposables && disposables.add(upi)
  return upi
}

export function consumeCompBack (service: UPI.CompletionBackend.ICompletionBackend) {
  backend = service
  const mydisp = new CompositeDisposable()
  disposables && disposables.add(mydisp)
  mydisp.add(
    atom.workspace.observeTextEditors((editor) => {
      if (editor.getGrammar().scopeName === 'source.haskell') {
        mydisp.add(service.registerCompletionBuffer(editor.getBuffer()))
      }
    }),
    new Disposable(() => {
      backend = undefined
      disposables && disposables.remove(mydisp)
    })
  )
  return mydisp
}
