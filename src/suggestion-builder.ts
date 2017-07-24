/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import {Range} from 'atom'
import {filter} from 'fuzzaldrin'
import {ICompletionBackend, ISymbol, SymbolType} from '../typings/completion-backend'

const typeScope = ['meta.type-signature.haskell']
const sourceScope = ['source.haskell']
const moduleScope = ['meta.import.haskell', 'support.other.module.haskell']
const preprocessorScope = ['meta.preprocessor.haskell']
const instancePreprocessorScope = ['meta.declaration.instance.haskell', 'meta.preprocessor.haskell']
const exportsScope = ['meta.import.haskell', 'meta.declaration.exports.haskell']

const pragmaWords = [
  'LANGUAGE', 'OPTIONS_GHC', 'INCLUDE', 'WARNING', 'DEPRECATED', 'INLINE',
  'NOINLINE', 'ANN', 'LINE', 'RULES', 'SPECIALIZE', 'UNPACK', 'SOURCE'
]

const instancePragmaWords = [
  'INCOHERENT',
  'OVERLAPPABLE',
  'OVERLAPPING',
  'OVERLAPS'
]

export interface IOptions {
  editor: AtomTypes.TextEditor
  bufferPosition: AtomTypes.Point
  activatedManually: boolean
  scopeDescriptor: AtomTypes.ScopeDescriptor
}

export interface ISuggestion {
  text: string
  rightLabel?: string
  type: SymbolType | 'import' | 'keyword'
  replacementPrefix: string
  description?: string
}

type GetSymbolsCallback<T> = (buffer: AtomTypes.TextBuffer, prefix: string, position: AtomTypes.Point) => Promise<T[]>

export class SuggestionBuilder {
  private buffer: AtomTypes.TextBuffer
  private lineRange: AtomTypes.Range
  private line: string
  private mwl: number
  constructor (private options: IOptions, private backend: ICompletionBackend) {
    this.buffer = this.options.editor.getBuffer()
    this.lineRange = new Range(
      [this.options.bufferPosition.row, 0],
      this.options.bufferPosition
    )
    this.line = this.buffer.getTextInRange(this.lineRange)
    this.mwl =
      this.options.activatedManually ?
        0
      :
        atom.config.get('autocomplete-plus.minimumWordLength')
  }

  public async getSuggestions (): Promise<ISuggestion[]> {
    if (this.isIn(instancePreprocessorScope)) {
      return this.preprocessorSuggestions(instancePragmaWords)
    } else if (this.isIn(typeScope)) {
      return this.symbolSuggestions(this.backend.getCompletionsForType.bind(this.backend))
    } else if (this.isIn(moduleScope)) {
      return this.moduleSuggestions()
    } else if (this.isIn(exportsScope)) {
      return this.symbolSuggestions(this.backend.getCompletionsForSymbolInModule.bind(this.backend))
    } else if (this.isIn(preprocessorScope)) {
      return this.preprocessorSuggestions(pragmaWords)
    // should be last as least sepcialized
    } else if (this.isIn(sourceScope)) {
      if (this.getPrefix().startsWith('_')) {
        if (atom.config.get('autocomplete-haskell.ingoreMinimumWordLengthForHoleCompletions')) {
          this.mwl = 1
        }
        return this.symbolSuggestions(this.backend.getCompletionsForHole.bind(this.backend))
      } else {
        return this.symbolSuggestions(this.backend.getCompletionsForSymbol.bind(this.backend))
      }
    } else {
      return []
    }
  }

  private lineSearch (rx: RegExp, idx: number = 0) {
    const match = this.line.match(rx)
    if (match) {
      return match[0]
    } else {
      return ''
    }
  }

  private isIn (scope: string[]) {
    return scope.every((s1) => this.options.scopeDescriptor.getScopesArray().includes(s1))
  }

  private getPrefix (rx?: RegExp) {
    if (rx == null) { rx = /[\w.']+$/ }
    return this.lineSearch(rx)
  }

  private buildSymbolSuggestion (s: ISymbol, prefix: string): ISuggestion {
    return {
      text: s.qname != null ? s.qname : s.name,
      rightLabel: (s.module != null ? s.module.name : undefined),
      type: s.symbolType,
      replacementPrefix: prefix,
      description: s.name + ' :: ' + s.typeSignature
    }
  }

  private buildSimpleSuggestion (
    type: 'import' | 'keyword', text: string, prefix: string, label?: string
  ): ISuggestion {
    return {
      text,
      type,
      replacementPrefix: prefix,
      rightLabel: label
    }
  }

  private async processSuggestions<T> (
    f: GetSymbolsCallback<T>, rx: RegExp | undefined, p: (s: T, p: string) => ISuggestion
  ) {
    const prefix = this.getPrefix(rx)
    if (prefix.length < this.mwl) {
      return []
    }
    const symbols = await f(this.buffer, prefix, this.options.bufferPosition)
    return symbols.map((s) => p(s, prefix))
  }

  private async symbolSuggestions (f: GetSymbolsCallback<ISymbol>) {
    return this.processSuggestions(f, undefined, this.buildSymbolSuggestion.bind(this))
  }

  private async moduleSuggestions () {
    return this.processSuggestions(this.backend.getCompletionsForModule.bind(this.backend), undefined, (s, prefix) =>
      this.buildSimpleSuggestion('import', s, prefix))
  }

  private preprocessorSuggestions (pragmaList: string[]) {
    let f: GetSymbolsCallback<string>
    const kwrx = new RegExp(`\\b(${pragmaList.join('|')})\\b`)
    const kw = this.lineSearch(kwrx)
    let label = ''
    let rx
    switch (false) {
      case kw !== 'OPTIONS_GHC':
        rx = /[\w-]+$/
        label = 'GHC Flag'
        f = this.backend.getCompletionsForCompilerOptions
        break
      case kw !== 'LANGUAGE':
        label = 'Language'
        f = this.backend.getCompletionsForLanguagePragmas
        break
      case !!kw:
        label = 'Pragma'
        f = async (b, p) => filter(pragmaList, p)
        break
      default:
        return []
    }

    return this.processSuggestions(f, rx, (s, prefix) =>
      this.buildSimpleSuggestion('keyword', s, prefix, label))
  }
}
