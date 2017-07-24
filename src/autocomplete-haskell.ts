/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import {CompositeDisposable, Disposable} from 'atom'
import {SuggestionBuilder, IOptions, ISuggestion} from './suggestion-builder'
import {LastSuggestionView} from './last-suggestion-view'
import {ICompletionBackend} from '../typings/completion-backend'

let backend: ICompletionBackend | undefined
let disposables: CompositeDisposable | undefined
let panel: AtomTypes.Panel | undefined
let upi: UPI.IUPIInstance | undefined

interface IState {
  panelVisible?: 'Visible' | 'Hidden'
}

interface IACPDidInsertEventParams {
  editor: AtomTypes.TextEditor
  triggerPosition: AtomTypes.Point
  suggestion: ISuggestion
}

export function activate (state: IState) {
  // backendHelper = new BackendHelper('autocomplete-haskell', {
  //   main: AutocompleteHaskell,
  //   backendInfo: 'completionBackendInfo',
  //   backendName: 'haskell-completion-backend'
  // }
  // );

  // backendHelper.init();

  disposables = new CompositeDisposable()

  createPanel((state.panelVisible || atom.config.get('autocomplete-haskell.defaultHintPanelVisibility')) === 'Visible')

  disposables.add(atom.config.observe('autocomplete-haskell.hideHintPanelIfEmpty', (val) => {
    if (panel != null) {
      if (val) {
        if ((panel.getItem() as LastSuggestionView).getText()) {
          return panel.show()
        } else {
          return panel.hide()
        }
      } else {
        return panel.show()
      }
    }
  })
  )

  atom.keymaps.add('autocomplete-haskell', {
    'atom-text-editor[data-grammar~="haskell"]': {
      escape: 'autocomplete-haskell:conceal-hint-panel'
    }
  }
  )

  disposables.add(
    atom.commands.add('atom-text-editor[data-grammar~="haskell"]', {
      'autocomplete-haskell:conceal-hint-panel': ({currentTarget, abortKeyBinding}: IEventDesc) => {
        if (panel && panel.isVisible() && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
          return panel.hide()
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
      if (panel != null) {
        return destroyPanel()
      } else {
        return createPanel(true)
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

export function serialize () {
  return {panelVisible: (panel != null)}
}

export function deactivate () {
  disposables && disposables.dispose()
  atom.keymaps.removeBindingsFromSource('autocomplete-haskell')
  disposables = undefined
  upi = undefined
  destroyPanel()
}

function createPanel (visible: boolean) {
  return panel = atom.workspace.addBottomPanel({
    item: new LastSuggestionView(),
    visible,
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
      if (backend == null) { return [] }
      return (new SuggestionBuilder(options, backend)).getSuggestions()
    },
    onDidInsertSuggestion: ({editor, triggerPosition, suggestion}: IACPDidInsertEventParams) => {
      if (suggestion && suggestion.description) {
        const desc = suggestion.description
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
        if (panel != null && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
          return panel.hide()
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

export function consumeCompBack (service: ICompletionBackend) {
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
