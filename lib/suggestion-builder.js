"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const fuzzaldrin_1 = require("fuzzaldrin");
const typeScope = ['meta.type-signature.haskell'];
const sourceScope = ['source.haskell'];
const moduleScope = ['meta.import.haskell', 'support.other.module.haskell'];
const preprocessorScope = ['meta.preprocessor.haskell'];
const instancePreprocessorScope = ['meta.declaration.instance.haskell', 'meta.preprocessor.haskell'];
const exportsScope = ['meta.import.haskell', 'meta.declaration.exports.haskell'];
const pragmaWords = [
    'LANGUAGE', 'OPTIONS_GHC', 'INCLUDE', 'WARNING', 'DEPRECATED', 'INLINE',
    'NOINLINE', 'ANN', 'LINE', 'RULES', 'SPECIALIZE', 'UNPACK', 'SOURCE'
];
const instancePragmaWords = [
    'INCOHERENT',
    'OVERLAPPABLE',
    'OVERLAPPING',
    'OVERLAPS'
];
class SuggestionBuilder {
    constructor(options, backend) {
        this.options = options;
        this.backend = backend;
        this.buffer = this.options.editor.getBuffer();
        this.lineRange = new atom_1.Range([this.options.bufferPosition.row, 0], this.options.bufferPosition);
        this.line = this.buffer.getTextInRange(this.lineRange);
        this.mwl =
            this.options.activatedManually ?
                0
                :
                    atom.config.get('autocomplete-plus.minimumWordLength');
    }
    getSuggestions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isIn(instancePreprocessorScope)) {
                return this.preprocessorSuggestions(instancePragmaWords);
            }
            else if (this.isIn(typeScope)) {
                return this.symbolSuggestions(this.backend.getCompletionsForType.bind(this.backend));
            }
            else if (this.isIn(moduleScope)) {
                return this.moduleSuggestions();
            }
            else if (this.isIn(exportsScope)) {
                return this.symbolSuggestions(this.backend.getCompletionsForSymbolInModule.bind(this.backend));
            }
            else if (this.isIn(preprocessorScope)) {
                return this.preprocessorSuggestions(pragmaWords);
            }
            else if (this.isIn(sourceScope)) {
                if (this.getPrefix().startsWith('_')) {
                    if (atom.config.get('autocomplete-haskell.ingoreMinimumWordLengthForHoleCompletions')) {
                        this.mwl = 1;
                    }
                    return this.symbolSuggestions(this.backend.getCompletionsForHole.bind(this.backend));
                }
                else {
                    return this.symbolSuggestions(this.backend.getCompletionsForSymbol.bind(this.backend));
                }
            }
            else {
                return [];
            }
        });
    }
    lineSearch(rx, idx = 0) {
        const match = this.line.match(rx);
        if (match) {
            return match[0];
        }
        else {
            return '';
        }
    }
    isIn(scope) {
        return scope.every((s1) => this.options.scopeDescriptor.getScopesArray().includes(s1));
    }
    getPrefix(rx) {
        if (!rx) {
            rx = /[\w.']+$/;
        }
        return this.lineSearch(rx);
    }
    buildSymbolSuggestion(s, prefix) {
        return {
            text: s.qname ? s.qname : s.name,
            rightLabel: (s.module ? s.module.name : undefined),
            type: s.symbolType,
            replacementPrefix: prefix,
            description: s.name + ' :: ' + s.typeSignature
        };
    }
    buildSimpleSuggestion(type, text, prefix, label) {
        return {
            text,
            type,
            replacementPrefix: prefix,
            rightLabel: label
        };
    }
    processSuggestions(f, rx, p) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = this.getPrefix(rx);
            if (prefix.length < this.mwl) {
                return [];
            }
            const symbols = yield f(this.buffer, prefix, this.options.bufferPosition);
            return symbols.map((s) => p(s, prefix));
        });
    }
    symbolSuggestions(f) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.processSuggestions(f, undefined, this.buildSymbolSuggestion.bind(this));
        });
    }
    moduleSuggestions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.processSuggestions(this.backend.getCompletionsForModule.bind(this.backend), undefined, (s, prefix) => this.buildSimpleSuggestion('import', s, prefix));
        });
    }
    preprocessorSuggestions(pragmaList) {
        let f;
        const kwrx = new RegExp(`\\b(${pragmaList.join('|')})\\b`);
        const kw = this.lineSearch(kwrx);
        let label = '';
        let rx;
        switch (false) {
            case kw !== 'OPTIONS_GHC':
                rx = /[\w-]+$/;
                label = 'GHC Flag';
                f = this.backend.getCompletionsForCompilerOptions;
                break;
            case kw !== 'LANGUAGE':
                label = 'Language';
                f = this.backend.getCompletionsForLanguagePragmas;
                break;
            case !!kw:
                label = 'Pragma';
                f = (b, p) => __awaiter(this, void 0, void 0, function* () { return fuzzaldrin_1.filter(pragmaList, p); });
                break;
            default:
                return [];
        }
        return this.processSuggestions(f, rx, (s, prefix) => this.buildSimpleSuggestion('keyword', s, prefix, label));
    }
}
exports.SuggestionBuilder = SuggestionBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VnZ2VzdGlvbi1idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N1Z2dlc3Rpb24tYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0JBQTBCO0FBQzFCLDJDQUFpQztBQUdqQyxNQUFNLFNBQVMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUE7QUFDakQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3RDLE1BQU0sV0FBVyxHQUFHLENBQUMscUJBQXFCLEVBQUUsOEJBQThCLENBQUMsQ0FBQTtBQUMzRSxNQUFNLGlCQUFpQixHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtBQUN2RCxNQUFNLHlCQUF5QixHQUFHLENBQUMsbUNBQW1DLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtBQUNwRyxNQUFNLFlBQVksR0FBRyxDQUFDLHFCQUFxQixFQUFFLGtDQUFrQyxDQUFDLENBQUE7QUFFaEYsTUFBTSxXQUFXLEdBQUc7SUFDbEIsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRO0lBQ3ZFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFFBQVE7Q0FDckUsQ0FBQTtBQUVELE1BQU0sbUJBQW1CLEdBQUc7SUFDMUIsWUFBWTtJQUNaLGNBQWM7SUFDZCxhQUFhO0lBQ2IsVUFBVTtDQUNYLENBQUE7QUFtQkQ7SUFLRSxZQUFxQixPQUFpQixFQUFVLE9BQThCO1FBQXpELFlBQU8sR0FBUCxPQUFPLENBQVU7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQUM1RSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxZQUFLLENBQ3hCLENBQUMs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QUFDLENBQUMsQ0FBQTtJQUM1RCxDQUFDO0NBQ0Y7QUFuSUQsOENBbUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7ZmlsdGVyfSBmcm9tICdmdXp6YWxkcmluJ1xuaW1wb3J0IENCID0gVVBJLkNvbXBsZXRpb25CYWNrZW5kXG5cbmNvbnN0IHR5cGVTY29wZSA9IFsnbWV0YS50eXBlLXNpZ25hdHVyZS5oYXNrZWxsJ11cbmNvbnN0IHNvdXJjZVNjb3BlID0gWydzb3VyY2UuaGFza2VsbCddXG5jb25zdCBtb2R1bGVTY29wZSA9IFsnbWV0YS5pbXBvcnQuaGFza2VsbCcsICdzdXBwb3J0Lm90aGVyLm1vZHVsZS5oYXNrZWxsJ11cbmNvbnN0IHByZXByb2Nlc3NvclNjb3BlID0gWydtZXRhLnByZXByb2Nlc3Nvci5oYXNrZWxsJ11cbmNvbnN0IGluc3RhbmNlUHJlcHJvY2Vzc29yU2NvcGUgPSBbJ21ldGEuZGVjbGFyYXRpb24uaW5zdGFuY2UuaGFza2VsbCcsICdtZXRhLnByZXByb2Nlc3Nvci5oYXNrZWxsJ11cbmNvbnN0IGV4cG9ydHNTY29wZSA9IFsnbWV0YS5pbXBvcnQuaGFza2VsbCcsICdtZXRhLmRlY2xhcmF0aW9uLmV4cG9ydHMuaGFza2VsbCddXG5cbmNvbnN0IHByYWdtYVdvcmRzID0gW1xuICAnTEFOR1VBR0UnLCAnT1BUSU9OU19HSEMnLCAnSU5DTFVERScsICdXQVJOSU5HJywgJ0RFUFJFQ0FURUQnLCAnSU5MSU5FJyxcbiAgJ05PSU5MSU5FJywgJ0FOTicsICdMSU5FJywgJ1JVTEVTJywgJ1NQRUNJQUxJWkUnLCAnVU5QQUNLJywgJ1NPVVJDRSdcbl1cblxuY29uc3QgaW5zdGFuY2VQcmFnbWFXb3JkcyA9IFtcbiAgJ0lOQ09IRVJFTlQnLFxuICAnT1ZFUkxBUFBBQkxFJyxcbiAgJ09WRVJMQVBQSU5HJyxcbiAgJ09WRVJMQVBTJ1xuXVxuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcbiAgZWRpdG9yOiBBdG9tVHlwZXMuVGV4dEVkaXRvclxuICBidWZmZXJQb3NpdGlvbjogQXRvbVR5cGVzLlBvaW50XG4gIGFjdGl2YXRlZE1hbnVhbGx5OiBib29sZWFuXG4gIHNjb3BlRGVzY3JpcHRvcjogQXRvbVR5cGVzLlNjb3BlRGVzY3JpcHRvclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTdWdnZXN0aW9uIHtcbiAgdGV4dDogc3RyaW5nXG4gIHJpZ2h0TGFiZWw/OiBzdHJpbmdcbiAgdHlwZTogQ0IuU3ltYm9sVHlwZSB8ICdpbXBvcnQnIHwgJ2tleXdvcmQnXG4gIHJlcGxhY2VtZW50UHJlZml4OiBzdHJpbmdcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmdcbn1cblxudHlwZSBHZXRTeW1ib2xzQ2FsbGJhY2s8VD4gPSAoYnVmZmVyOiBBdG9tVHlwZXMuVGV4dEJ1ZmZlciwgcHJlZml4OiBzdHJpbmcsIHBvc2l0aW9uOiBBdG9tVHlwZXMuUG9pbnQpID0+IFByb21pc2U8VFtdPlxuXG5leHBvcnQgY2xhc3MgU3VnZ2VzdGlvbkJ1aWxkZXIge1xuICBwcml2YXRlIGJ1ZmZlcjogQXRvbVR5cGVzLlRleHRCdWZmZXJcbiAgcHJpdmF0ZSBsaW5lUmFuZ2U6IEF0b21UeXBlcy5SYW5nZVxuICBwcml2YXRlIGxpbmU6IHN0cmluZ1xuICBwcml2YXRlIG13bDogbnVtYmVyXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIG9wdGlvbnM6IElPcHRpb25zLCBwcml2YXRlIGJhY2tlbmQ6IENCLklDb21wbGV0aW9uQmFja2VuZCkge1xuICAgIHRoaXMuYnVmZmVyID0gdGhpcy5vcHRpb25zLmVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHRoaXMubGluZVJhbmdlID0gbmV3IFJhbmdlKFxuICAgICAgW3RoaXMub3B0aW9ucy5idWZmZXJQb3NpdGlvbi5yb3csIDBdLFxuICAgICAgdGhpcy5vcHRpb25zLmJ1ZmZlclBvc2l0aW9uXG4gICAgKVxuICAgIHRoaXMubGluZSA9IHRoaXMuYnVmZmVyLmdldFRleHRJblJhbmdlKHRoaXMubGluZVJhbmdlKVxuICAgIHRoaXMubXdsID1cbiAgICAgIHRoaXMub3B0aW9ucy5hY3RpdmF0ZWRNYW51YWxseSA/XG4gICAgICAgIDBcbiAgICAgIDpcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGx1cy5taW5pbXVtV29yZExlbmd0aCcpXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0U3VnZ2VzdGlvbnMgKCk6IFByb21pc2U8SVN1Z2dlc3Rpb25bXT4ge1xuICAgIGlmICh0aGlzLmlzSW4oaW5zdGFuY2VQcmVwcm9jZXNzb3JTY29wZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZXByb2Nlc3NvclN1Z2dlc3Rpb25zKGluc3RhbmNlUHJhZ21hV29yZHMpXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSW4odHlwZVNjb3BlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sU3VnZ2VzdGlvbnModGhpcy5iYWNrZW5kLmdldENvbXBsZXRpb25zRm9yVHlwZS5iaW5kKHRoaXMuYmFja2VuZCkpXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSW4obW9kdWxlU2NvcGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2R1bGVTdWdnZXN0aW9ucygpXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSW4oZXhwb3J0c1Njb3BlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sU3VnZ2VzdGlvbnModGhpcy5iYWNrZW5kLmdldENvbXBsZXRpb25zRm9yU3ltYm9sSW5Nb2R1bGUuYmluZCh0aGlzLmJhY2tlbmQpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0luKHByZXByb2Nlc3NvclNjb3BlKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlcHJvY2Vzc29yU3VnZ2VzdGlvbnMocHJhZ21hV29yZHMpXG4gICAgLy8gc2hvdWxkIGJlIGxhc3QgYXMgbGVhc3Qgc2VwY2lhbGl6ZWRcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbihzb3VyY2VTY29wZSkpIHtcbiAgICAgIGlmICh0aGlzLmdldFByZWZpeCgpLnN0YXJ0c1dpdGgoJ18nKSkge1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5pbmdvcmVNaW5pbXVtV29yZExlbmd0aEZvckhvbGVDb21wbGV0aW9ucycpKSB7XG4gICAgICAgICAgdGhpcy5td2wgPSAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sU3VnZ2VzdGlvbnModGhpcy5iYWNrZW5kLmdldENvbXBsZXRpb25zRm9ySG9sZS5iaW5kKHRoaXMuYmFja2VuZCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2xTdWdnZXN0aW9ucyh0aGlzLmJhY2tlbmQuZ2V0Q29tcGxldGlvbnNGb3JTeW1ib2wuYmluZCh0aGlzLmJhY2tlbmQpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxpbmVTZWFyY2ggKHJ4OiBSZWdFeHAsIGlkeDogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IG1hdGNoID0gdGhpcy5saW5lLm1hdGNoKHJ4KVxuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hdGNoWzBdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNJbiAoc2NvcGU6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHNjb3BlLmV2ZXJ5KChzMSkgPT4gdGhpcy5vcHRpb25zLnNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpLmluY2x1ZGVzKHMxKSlcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UHJlZml4IChyeD86IFJlZ0V4cCkge1xuICAgIGlmICghcngpIHsgcnggPSAvW1xcdy4nXSskLyB9XG4gICAgcmV0dXJuIHRoaXMubGluZVNlYXJjaChyeClcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRTeW1ib2xTdWdnZXN0aW9uIChzOiBDQi5JU3ltYm9sLCBwcmVmaXg6IHN0cmluZyk6IElTdWdnZXN0aW9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDogcy5xbmFtZSA/IHMucW5hbWUgOiBzLm5hbWUsXG4gICAgICByaWdodExhYmVsOiAocy5tb2R1bGUgPyBzLm1vZHVsZS5uYW1lIDogdW5kZWZpbmVkKSxcbiAgICAgIHR5cGU6IHMuc3ltYm9sVHlwZSxcbiAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXgsXG4gICAgICBkZXNjcmlwdGlvbjogcy5uYW1lICsgJyA6OiAnICsgcy50eXBlU2lnbmF0dXJlXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBidWlsZFNpbXBsZVN1Z2dlc3Rpb24gKFxuICAgIHR5cGU6ICdpbXBvcnQnIHwgJ2tleXdvcmQnLCB0ZXh0OiBzdHJpbmcsIHByZWZpeDogc3RyaW5nLCBsYWJlbD86IHN0cmluZ1xuICApOiBJU3VnZ2VzdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQsXG4gICAgICB0eXBlLFxuICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeCxcbiAgICAgIHJpZ2h0TGFiZWw6IGxhYmVsXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzU3VnZ2VzdGlvbnM8VD4gKFxuICAgIGY6IEdldFN5bWJvbHNDYWxsYmFjazxUPiwgcng6IFJlZ0V4cCB8IHVuZGVmaW5lZCwgcDogKHM6IFQsIHA6IHN0cmluZykgPT4gSVN1Z2dlc3Rpb25cbiAgKSB7XG4gICAgY29uc3QgcHJlZml4ID0gdGhpcy5nZXRQcmVmaXgocngpXG4gICAgaWYgKHByZWZpeC5sZW5ndGggPCB0aGlzLm13bCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGNvbnN0IHN5bWJvbHMgPSBhd2FpdCBmKHRoaXMuYnVmZmVyLCBwcmVmaXgsIHRoaXMub3B0aW9ucy5idWZmZXJQb3NpdGlvbilcbiAgICByZXR1cm4gc3ltYm9scy5tYXAoKHMpID0+IHAocywgcHJlZml4KSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc3ltYm9sU3VnZ2VzdGlvbnMgKGY6IEdldFN5bWJvbHNDYWxsYmFjazxDQi5JU3ltYm9sPikge1xuICAgIHJldHVybiB0aGlzLnByb2Nlc3NTdWdnZXN0aW9ucyhmLCB1bmRlZmluZWQsIHRoaXMuYnVpbGRTeW1ib2xTdWdnZXN0aW9uLmJpbmQodGhpcykpXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1vZHVsZVN1Z2dlc3Rpb25zICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9jZXNzU3VnZ2VzdGlvbnModGhpcy5iYWNrZW5kLmdldENvbXBsZXRpb25zRm9yTW9kdWxlLmJpbmQodGhpcy5iYWNrZW5kKSwgdW5kZWZpbmVkLCAocywgcHJlZml4KSA9PlxuICAgICAgdGhpcy5idWlsZFNpbXBsZVN1Z2dlc3Rpb24oJ2ltcG9ydCcsIHMsIHByZWZpeCkpXG4gIH1cblxuICBwcml2YXRlIHByZXByb2Nlc3NvclN1Z2dlc3Rpb25zIChwcmFnbWFMaXN0OiBzdHJpbmdbXSkge1xuICAgIGxldCBmOiBHZXRTeW1ib2xzQ2FsbGJhY2s8c3RyaW5nPlxuICAgIGNvbnN0IGt3cnggPSBuZXcgUmVnRXhwKGBcXFxcYigke3ByYWdtYUxpc3Quam9pbignfCcpfSlcXFxcYmApXG4gICAgY29uc3Qga3cgPSB0aGlzLmxpbmVTZWFyY2goa3dyeClcbiAgICBsZXQgbGFiZWwgPSAnJ1xuICAgIGxldCByeFxuICAgIHN3aXRjaCAoZmFsc2UpIHtcbiAgICAgIGNhc2Uga3cgIT09ICdPUFRJT05TX0dIQyc6XG4gICAgICAgIHJ4ID0gL1tcXHctXSskL1xuICAgICAgICBsYWJlbCA9ICdHSEMgRmxhZydcbiAgICAgICAgZiA9IHRoaXMuYmFja2VuZC5nZXRDb21wbGV0aW9uc0ZvckNvbXBpbGVyT3B0aW9uc1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSBrdyAhPT0gJ0xBTkdVQUdFJzpcbiAgICAgICAgbGFiZWwgPSAnTGFuZ3VhZ2UnXG4gICAgICAgIGYgPSB0aGlzLmJhY2tlbmQuZ2V0Q29tcGxldGlvbnNGb3JMYW5ndWFnZVByYWdtYXNcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgISFrdzpcbiAgICAgICAgbGFiZWwgPSAnUHJhZ21hJ1xuICAgICAgICBmID0gYXN5bmMgKGIsIHApID0+IGZpbHRlcihwcmFnbWFMaXN0LCBwKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc1N1Z2dlc3Rpb25zKGYsIHJ4LCAocywgcHJlZml4KSA9PlxuICAgICAgdGhpcy5idWlsZFNpbXBsZVN1Z2dlc3Rpb24oJ2tleXdvcmQnLCBzLCBwcmVmaXgsIGxhYmVsKSlcbiAgfVxufVxuIl19