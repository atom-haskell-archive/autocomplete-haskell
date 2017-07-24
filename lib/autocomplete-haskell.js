"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const suggestion_builder_1 = require("./suggestion-builder");
const last_suggestion_view_1 = require("./last-suggestion-view");
let backend;
let disposables;
let panel;
let upi;
function activate(state) {
    disposables = new atom_1.CompositeDisposable();
    createPanel((state.panelVisible || atom.config.get('autocomplete-haskell.defaultHintPanelVisibility')) === 'Visible');
    disposables.add(atom.config.observe('autocomplete-haskell.hideHintPanelIfEmpty', (val) => {
        if (panel != null) {
            if (val) {
                if (panel.getItem().getText()) {
                    return panel.show();
                }
                else {
                    return panel.hide();
                }
            }
            else {
                return panel.show();
            }
        }
    }));
    atom.keymaps.add('autocomplete-haskell', {
        'atom-text-editor[data-grammar~="haskell"]': {
            escape: 'autocomplete-haskell:conceal-hint-panel'
        }
    });
    disposables.add(atom.commands.add('atom-text-editor[data-grammar~="haskell"]', {
        'autocomplete-haskell:conceal-hint-panel': ({ currentTarget, abortKeyBinding }) => {
            if (panel && panel.isVisible() && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
                return panel.hide();
            }
            else {
                if (typeof abortKeyBinding === 'function') {
                    abortKeyBinding();
                }
            }
        }
    }));
    disposables.add(atom.commands.add('atom-workspace', {
        'autocomplete-haskell:toggle-completion-hint': () => {
            if (panel != null) {
                return destroyPanel();
            }
            else {
                return createPanel(true);
            }
        }
    }));
    disposables.add(atom.menu.add([{
            label: 'Haskell IDE',
            submenu: [{
                    label: 'Toggle Completion Hint Panel',
                    command: 'autocomplete-haskell:toggle-completion-hint'
                }]
        }]));
}
exports.activate = activate;
function serialize() {
    return { panelVisible: (panel != null) };
}
exports.serialize = serialize;
function deactivate() {
    disposables && disposables.dispose();
    atom.keymaps.removeBindingsFromSource('autocomplete-haskell');
    disposables = undefined;
    upi = undefined;
    destroyPanel();
}
exports.deactivate = deactivate;
function createPanel(visible) {
    return panel = atom.workspace.addBottomPanel({
        item: new last_suggestion_view_1.LastSuggestionView(),
        visible,
        priority: 200
    });
}
function destroyPanel() {
    panel && panel.destroy();
    panel = undefined;
}
function autocompleteProvider_2_0_0() {
    return {
        selector: '.source.haskell',
        disableForSelector: '.source.haskell .comment',
        inclusionPriority: 0,
        getSuggestions: (options) => {
            if (backend == null) {
                return [];
            }
            return (new suggestion_builder_1.SuggestionBuilder(options, backend)).getSuggestions();
        },
        onDidInsertSuggestion: ({ editor, triggerPosition, suggestion }) => {
            if (suggestion && suggestion.description) {
                const desc = suggestion.description;
                if (panel) {
                    const view = panel.getItem();
                    view.setText(desc);
                    if (atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
                        panel.show();
                    }
                }
                if (upi && atom.config.get('autocomplete-haskell.showIdeHaskellTooltip')) {
                    const p2 = editor.getLastCursor().getBufferPosition();
                    const p1 = p2.translate([0, -suggestion.text.length]);
                    setImmediate(() => {
                        upi && upi.showTooltip({
                            editor,
                            eventType: "keyboard",
                            tooltip: {
                                range: [p1, p2],
                                persistent: true,
                                text: {
                                    text: desc,
                                    highlighter: 'hint.haskell'
                                }
                            }
                        });
                    });
                }
            }
            else if (panel) {
                const view = panel.getItem();
                view.setText('');
                if (panel != null && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
                    return panel.hide();
                }
            }
        }
    };
}
exports.autocompleteProvider_2_0_0 = autocompleteProvider_2_0_0;
function consumeUPI(service) {
    upi = service({
        name: 'autocomplete-haskell'
    });
    disposables && disposables.add(upi);
    return upi;
}
exports.consumeUPI = consumeUPI;
function consumeCompBack(service) {
    backend = service;
    const mydisp = new atom_1.CompositeDisposable();
    disposables && disposables.add(mydisp);
    mydisp.add(atom.workspace.observeTextEditors((editor) => {
        if (editor.getGrammar().scopeName === 'source.haskell') {
            mydisp.add(service.registerCompletionBuffer(editor.getBuffer()));
        }
    }), new atom_1.Disposable(() => {
        backend = undefined;
        disposables && disposables.remove(mydisp);
    }));
    return mydisp;
}
exports.consumeCompBack = consumeCompBack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhc2tlbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0b2NvbXBsZXRlLWhhc2tlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSwrQkFBb0Q7QUFDcEQsNkRBQTZFO0FBQzdFLGlFQUF5RDtBQUd6RCxJQUFJLE9BQXVDLENBQUE7QUFDM0MsSUFBSSxXQUE0QyxDQUFBO0FBQ2hELElBQUksS0FBa0MsQ0FBQTtBQUN0QyxJQUFJLEdBQWlDLENBQUE7QUFZckMsa0JBQTBCLEtBQWE7SUFVckMsV0FBVyxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtJQUV2QyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQTtJQUVySCxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxFQUFFLENBQUMsR0FBRztRQUNuRixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLEVBQUUsQ0FBQyxDQUFFLEtBQUssQ0FBQyxPQUFPLEVBQXlCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN0RCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUNyQixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ3JCLENBQUM7WUFDSCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUNyQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUMsQ0FBQyxD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VUFBVSxFQUFFLENBQUMsU0FBUyxLQUFLLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLENBQUM7SUFDSCxDQUFDLENBQUMsRUFDRixJQUFJLGlCQUFVLENBQUM7UUFDYixPQUFPLEdBQUcsU0FBUyxDQUFBO1FBQ25CLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUNILENBQUE7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWhCRCwwQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogZGVjYWZmZWluYXRlIHN1Z2dlc3Rpb25zOlxuICogRFMxMDI6IFJlbW92ZSB1bm5lY2Vzc2FyeSBjb2RlIGNyZWF0ZWQgYmVjYXVzZSBvZiBpbXBsaWNpdCByZXR1cm5zXG4gKiBEUzEwMzogUmV3cml0ZSBjb2RlIHRvIG5vIGxvbmdlciB1c2UgX19ndWFyZF9fXG4gKiBEUzIwNzogQ29uc2lkZXIgc2hvcnRlciB2YXJpYXRpb25zIG9mIG51bGwgY2hlY2tzXG4gKiBGdWxsIGRvY3M6IGh0dHBzOi8vZ2l0aHViLmNvbS9kZWNhZmZlaW5hdGUvZGVjYWZmZWluYXRlL2Jsb2IvbWFzdGVyL2RvY3Mvc3VnZ2VzdGlvbnMubWRcbiAqL1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtTdWdnZXN0aW9uQnVpbGRlciwgSU9wdGlvbnMsIElTdWdnZXN0aW9ufSBmcm9tICcuL3N1Z2dlc3Rpb24tYnVpbGRlcidcbmltcG9ydCB7TGFzdFN1Z2dlc3Rpb25WaWV3fSBmcm9tICcuL2xhc3Qtc3VnZ2VzdGlvbi12aWV3J1xuaW1wb3J0IHtJQ29tcGxldGlvbkJhY2tlbmR9IGZyb20gJy4uL3R5cGluZ3MvY29tcGxldGlvbi1iYWNrZW5kJ1xuXG5sZXQgYmFja2VuZDogSUNvbXBsZXRpb25CYWNrZW5kIHwgdW5kZWZpbmVkXG5sZXQgZGlzcG9zYWJsZXM6IENvbXBvc2l0ZURpc3Bvc2FibGUgfCB1bmRlZmluZWRcbmxldCBwYW5lbDogQXRvbVR5cGVzLlBhbmVsIHwgdW5kZWZpbmVkXG5sZXQgdXBpOiBVUEkuSVVQSUluc3RhbmNlIHwgdW5kZWZpbmVkXG5cbmludGVyZmFjZSBJU3RhdGUge1xuICBwYW5lbFZpc2libGU/OiAnVmlzaWJsZScgfCAnSGlkZGVuJ1xufVxuXG5pbnRlcmZhY2UgSUFDUERpZEluc2VydEV2ZW50UGFyYW1zIHtcbiAgZWRpdG9yOiBBdG9tVHlwZXMuVGV4dEVkaXRvclxuICB0cmlnZ2VyUG9zaXRpb246IEF0b21UeXBlcy5Qb2ludFxuICBzdWdnZXN0aW9uOiBJU3VnZ2VzdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKHN0YXRlOiBJU3RhdGUpIHtcbiAgLy8gYmFja2VuZEhlbHBlciA9IG5ldyBCYWNrZW5kSGVscGVyKCdhdXRvY29tcGxldGUtaGFza2VsbCcsIHtcbiAgLy8gICBtYWluOiBBdXRvY29tcGxldGVIYXNrZWxsLFxuICAvLyAgIGJhY2tlbmRJbmZvOiAnY29tcGxldGlvbkJhY2tlbmRJbmZvJyxcbiAgLy8gICBiYWNrZW5kTmFtZTogJ2hhc2tlbGwtY29tcGxldGlvbi1iYWNrZW5kJ1xuICAvLyB9XG4gIC8vICk7XG5cbiAgLy8gYmFja2VuZEhlbHBlci5pbml0KCk7XG5cbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgY3JlYXRlUGFuZWwoKHN0YXRlLnBhbmVsVmlzaWJsZSB8fCBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmRlZmF1bHRIaW50UGFuZWxWaXNpYmlsaXR5JykpID09PSAnVmlzaWJsZScpXG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JywgKHZhbCkgPT4ge1xuICAgIGlmIChwYW5lbCAhPSBudWxsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIGlmICgocGFuZWwuZ2V0SXRlbSgpIGFzIExhc3RTdWdnZXN0aW9uVmlldykuZ2V0VGV4dCgpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhbmVsLnNob3coKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBwYW5lbC5oaWRlKClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhbmVsLnNob3coKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgKVxuXG4gIGF0b20ua2V5bWFwcy5hZGQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsJywge1xuICAgICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcn49XCJoYXNrZWxsXCJdJzoge1xuICAgICAgZXNjYXBlOiAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6Y29uY2VhbC1oaW50LXBhbmVsJ1xuICAgIH1cbiAgfVxuICApXG5cbiAgZGlzcG9zYWJsZXMuYWRkKFxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcn49XCJoYXNrZWxsXCJdJywge1xuICAgICAgJ2F1dG9jb21wbGV0ZS1oYXNrZWxsOmNvbmNlYWwtaGludC1wYW5lbCc6ICh7Y3VycmVudFRhcmdldCwgYWJvcnRLZXlCaW5kaW5nfTogSUV2ZW50RGVzYykgPT4ge1xuICAgICAgICBpZiAocGFuZWwgJiYgcGFuZWwuaXNWaXNpYmxlKCkgJiYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5oaWRlSGludFBhbmVsSWZFbXB0eScpKSB7XG4gICAgICAgICAgcmV0dXJuIHBhbmVsLmhpZGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgYWJvcnRLZXlCaW5kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhYm9ydEtleUJpbmRpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICApXG4gIClcblxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICdhdXRvY29tcGxldGUtaGFza2VsbDp0b2dnbGUtY29tcGxldGlvbi1oaW50JzogKCkgPT4ge1xuICAgICAgaWYgKHBhbmVsICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGRlc3Ryb3lQYW5lbCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3JlYXRlUGFuZWwodHJ1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgKVxuICApXG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20ubWVudS5hZGQoW3tcbiAgICBsYWJlbDogJ0hhc2tlbGwgSURFJyxcbiAgICBzdWJtZW51OiBbe1xuICAgICAgICBsYWJlbDogJ1RvZ2dsZSBDb21wbGV0aW9uIEhpbnQgUGFuZWwnLFxuICAgICAgICBjb21tYW5kOiAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6dG9nZ2xlLWNvbXBsZXRpb24taGludCdcbiAgICB9XVxuICB9XSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUgKCkge1xuICByZXR1cm4ge3BhbmVsVmlzaWJsZTogKHBhbmVsICE9IG51bGwpfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICBhdG9tLmtleW1hcHMucmVtb3ZlQmluZGluZ3NGcm9tU291cmNlKCdhdXRvY29tcGxldGUtaGFza2VsbCcpXG4gIGRpc3Bvc2FibGVzID0gdW5kZWZpbmVkXG4gIHVwaSA9IHVuZGVmaW5lZFxuICBkZXN0cm95UGFuZWwoKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVQYW5lbCAodmlzaWJsZTogYm9vbGVhbikge1xuICByZXR1cm4gcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG4gICAgaXRlbTogbmV3IExhc3RTdWdnZXN0aW9uVmlldygpLFxuICAgIHZpc2libGUsXG4gICAgcHJpb3JpdHk6IDIwMFxuICB9KVxufVxuXG5mdW5jdGlvbiBkZXN0cm95UGFuZWwgKCkge1xuICBwYW5lbCAmJiBwYW5lbC5kZXN0cm95KClcbiAgcGFuZWwgPSB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9jb21wbGV0ZVByb3ZpZGVyXzJfMF8wICgpIHtcbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RvcjogJy5zb3VyY2UuaGFza2VsbCcsXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5oYXNrZWxsIC5jb21tZW50JyxcbiAgICBpbmNsdXNpb25Qcmlvcml0eTogMCxcbiAgICBnZXRTdWdnZXN0aW9uczogKG9wdGlvbnM6IElPcHRpb25zKSA9PiB7XG4gICAgICBpZiAoYmFja2VuZCA9PSBudWxsKSB7IHJldHVybiBbXSB9XG4gICAgICByZXR1cm4gKG5ldyBTdWdnZXN0aW9uQnVpbGRlcihvcHRpb25zLCBiYWNrZW5kKSkuZ2V0U3VnZ2VzdGlvbnMoKVxuICAgIH0sXG4gICAgb25EaWRJbnNlcnRTdWdnZXN0aW9uOiAoe2VkaXRvciwgdHJpZ2dlclBvc2l0aW9uLCBzdWdnZXN0aW9ufTogSUFDUERpZEluc2VydEV2ZW50UGFyYW1zKSA9PiB7XG4gICAgICBpZiAoc3VnZ2VzdGlvbiAmJiBzdWdnZXN0aW9uLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlc2MgPSBzdWdnZXN0aW9uLmRlc2NyaXB0aW9uXG4gICAgICAgIGlmIChwYW5lbCkge1xuICAgICAgICAgIGNvbnN0IHZpZXc6IExhc3RTdWdnZXN0aW9uVmlldyA9IHBhbmVsLmdldEl0ZW0oKVxuICAgICAgICAgIHZpZXcuc2V0VGV4dChkZXNjKVxuICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICAgIHBhbmVsLnNob3coKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodXBpICYmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuc2hvd0lkZUhhc2tlbGxUb29sdGlwJykpIHtcbiAgICAgICAgICBjb25zdCBwMiA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgICAgIGNvbnN0IHAxID0gcDIudHJhbnNsYXRlKFswLCAtc3VnZ2VzdGlvbi50ZXh0Lmxlbmd0aF0pXG4gICAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgICAgICAgIHVwaSAmJiB1cGkuc2hvd1Rvb2x0aXAoe1xuICAgICAgICAgICAgICBlZGl0b3IsXG4gICAgICAgICAgICAgIGV2ZW50VHlwZTogVVBJLlRFdmVudFJhbmdlVHlwZS5rZXlib2FyZCxcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgICAgIHJhbmdlOiBbcDEsIHAyXSxcbiAgICAgICAgICAgICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6IGRlc2MsXG4gICAgICAgICAgICAgICAgICBoaWdobGlnaHRlcjogJ2hpbnQuaGFza2VsbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYW5lbCkge1xuICAgICAgICBjb25zdCB2aWV3OiBMYXN0U3VnZ2VzdGlvblZpZXcgPSBwYW5lbC5nZXRJdGVtKClcbiAgICAgICAgdmlldy5zZXRUZXh0KCcnKVxuICAgICAgICBpZiAocGFuZWwgIT0gbnVsbCAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICByZXR1cm4gcGFuZWwuaGlkZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN1bWVVUEkgKHNlcnZpY2U6IFVQSS5JVVBJUmVnaXN0cmF0aW9uKSB7XG4gIHVwaSA9IHNlcnZpY2Uoe1xuICAgIG5hbWU6ICdhdXRvY29tcGxldGUtaGFza2VsbCdcbiAgfSlcbiAgZGlzcG9zYWJsZXMgJiYgZGlzcG9zYWJsZXMuYWRkKHVwaSlcbiAgcmV0dXJuIHVwaVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZUNvbXBCYWNrIChzZXJ2aWNlOiBJQ29tcGxldGlvbkJhY2tlbmQpIHtcbiAgYmFja2VuZCA9IHNlcnZpY2VcbiAgY29uc3QgbXlkaXNwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5hZGQobXlkaXNwKVxuICBteWRpc3AuYWRkKFxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgPT09ICdzb3VyY2UuaGFza2VsbCcpIHtcbiAgICAgICAgbXlkaXNwLmFkZChzZXJ2aWNlLnJlZ2lzdGVyQ29tcGxldGlvbkJ1ZmZlcihlZGl0b3IuZ2V0QnVmZmVyKCkpKVxuICAgICAgfVxuICAgIH0pLFxuICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGJhY2tlbmQgPSB1bmRlZmluZWRcbiAgICAgIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLnJlbW92ZShteWRpc3ApXG4gICAgfSlcbiAgKVxuICByZXR1cm4gbXlkaXNwXG59XG4iXX0=