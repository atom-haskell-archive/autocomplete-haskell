import {Range} from 'atom'
import {filter} from 'fuzzaldrin'
import CB = UPI.CompletionBackend

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

import {operatorRx, identRx} from './opertator-regex'

export interface IOptions {
  editor: AtomTypes.TextEditor
  bufferPosition: AtomTypes.Point
  activatedManually: boolean
  scopeDescriptor: AtomTypes.ScopeDescriptor
}

export interface ISuggestion {
  text: string
  rightLabel?: string
  type: CB.SymbolType | 'import' | 'keyword'
  replacementPrefix: string
  description?: string
}

type GetSymbolsCallback<T> = (buffer: AtomTypes.TextBuffer, prefix: string, position: AtomTypes.Point) => Promise<T[]>

export class SuggestionBuilder {
  private buffer: AtomTypes.TextBuffer
  private lineRange: AtomTypes.Range
  private line: string
  private mwl: number
  constructor (private options: IOptions, private backend: CB.ICompletionBackend) {
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
        return this.symbolSuggestions(this.backend.getCompletionsForHole.bind(this.backend))
      } else if (this.getPrefix() === '' && this.getPrefix(operatorRx) !== '') {
        return this.operatorSuggestions()
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
      return match
    } else {
      return ['']
    }
  }

  private isIn (scope: string[]) {
    return scope.every((s1) => this.options.scopeDescriptor.getScopesArray().includes(s1))
  }

  private getPrefix (rx?: RegExp) {
    if (!rx) { rx = identRx }
    return this.lineSearch(rx)[0]
  }

  private buildSymbolSuggestion (s: CB.ISymbol, prefix: string): ISuggestion {
    return {
      text: s.qname ? s.qname : s.name,
      rightLabel: (s.module ? s.module.name : undefined),
      type: s.symbolType,
      replacementPrefix: prefix,
      description: this.nameFix(s) + ' :: ' + s.typeSignature
    }
  }

  private nameFix (s: CB.ISymbol) {
    if (s.symbolType === 'operator') {
      return `(${s.name})`
    } else {
      return s.name
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

  private async symbolSuggestions (f: GetSymbolsCallback<CB.ISymbol>, rx?: RegExp) {
    return this.processSuggestions(f, rx, this.buildSymbolSuggestion.bind(this))
  }

  private async moduleSuggestions () {
    return this.processSuggestions(this.backend.getCompletionsForModule.bind(this.backend), undefined, (s, prefix) =>
      this.buildSimpleSuggestion('import', s, prefix))
  }

  private preprocessorSuggestions (pragmaList: string[]) {
    let f: GetSymbolsCallback<string>
    const kwrx = new RegExp(`\\b(${pragmaList.join('|')})\\b`)
    const kw = this.lineSearch(kwrx)[0]
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

  private async operatorSuggestions () {
    const prefixMatch = this.lineSearch(operatorRx)
    if (!prefixMatch) { return [] }
    const [mod, op] = prefixMatch.slice(1)
    if (prefixMatch[0].length < this.mwl) {
      return []
    }
    const symbols =
      await this.backend.getCompletionsForSymbol(this.buffer, `${mod || ''}${op}`, this.options.bufferPosition)
    const newSyms =
      symbols
      .filter(({symbolType}) => symbolType === 'operator')
    const allSyms = filter(newSyms, prefixMatch[0], {key: 'qname'})
    return allSyms.map((s) => this.buildSymbolSuggestion(s, prefixMatch[0]))
  }
}
