"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const suggestion_builder_1 = require("./suggestion-builder");
const last_suggestion_view_1 = require("./last-suggestion-view");
let backend;
let disposables;
let panel;
let upi;
let lastCompletionDesc;
var config_1 = require("./config");
exports.config = config_1.config;
function activate(state) {
    disposables = new atom_1.CompositeDisposable();
    if (state.panelVisible === undefined) {
        state.panelVisible = (atom.config.get('autocomplete-haskell.defaultHintPanelVisibility') === 'Visible');
    }
    lastCompletionDesc = state.lastCompletionDesc;
    if (state.panelVisible) {
        createPanel();
    }
    disposables.add(atom.config.observe('autocomplete-haskell.hideHintPanelIfEmpty', (val) => {
        if (panel) {
            !val || lastCompletionDesc ? panel.show() : panel.hide();
        }
    }));
    disposables.add(atom.commands.add('atom-text-editor[data-grammar~="haskell"]', {
        'autocomplete-haskell:conceal-hint-panel': ({ currentTarget, abortKeyBinding }) => {
            if (panel && panel.isVisible() && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
                panel.hide();
            }
            else {
                if (typeof abortKeyBinding === 'function') {
                    abortKeyBinding();
                }
            }
        },
    }));
    disposables.add(atom.commands.add('atom-workspace', {
        'autocomplete-haskell:toggle-completion-hint': () => {
            if (panel) {
                destroyPanel();
            }
            else {
                createPanel();
            }
        },
    }));
    disposables.add(atom.menu.add([{
            label: 'Haskell IDE',
            submenu: [{
                    label: 'Toggle Completion Hint Panel',
                    command: 'autocomplete-haskell:toggle-completion-hint',
                }],
        }]));
}
exports.activate = activate;
function serialize() {
    return {
        panelVisible: !!panel,
        lastCompletionDesc,
    };
}
exports.serialize = serialize;
function deactivate() {
    disposables && disposables.dispose();
    disposables = undefined;
    upi = undefined;
    destroyPanel();
}
exports.deactivate = deactivate;
function createPanel() {
    panel = atom.workspace.addBottomPanel({
        item: new last_suggestion_view_1.LastSuggestionView(lastCompletionDesc),
        visible: true,
        priority: 200,
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
            if (!backend) {
                return [];
            }
            return (new suggestion_builder_1.SuggestionBuilder(options, backend)).getSuggestions();
        },
        onDidInsertSuggestion: ({ editor, triggerPosition, suggestion }) => {
            if (suggestion && suggestion.description) {
                const desc = lastCompletionDesc = suggestion.description;
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
                                    highlighter: 'hint.haskell',
                                },
                            },
                        });
                    });
                }
            }
            else if (panel) {
                const view = panel.getItem();
                view.setText('');
                if (panel && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
                    panel.hide();
                }
            }
        },
    };
}
exports.autocompleteProvider_2_0_0 = autocompleteProvider_2_0_0;
function consumeUPI(service) {
    upi = service({
        name: 'autocomplete-haskell',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhc2tlbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0b2NvbXBsZXRlLWhhc2tlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBa0U7QUFDbEUsNkRBQStFO0FBQy9FLGlFQUEyRDtBQUUzRCxJQUFJLE9BQTZELENBQUE7QUFDakUsSUFBSSxXQUE0QyxDQUFBO0FBQ2hELElBQUksS0FBc0QsQ0FBQTtBQUMxRCxJQUFJLEdBQWlDLENBQUE7QUFDckMsSUFBSSxrQkFBc0MsQ0FBQTtBQWExQyxtQ0FBaUM7QUFBeEIsMEJBQUEsTUFBTSxDQUFBO0FBRWYsa0JBQXlCLEtBQWE7SUFDcEMsV0FBVyxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtJQUV2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckMsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUE7SUFDekcsQ0FBQztJQUVELGtCQUFrQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQTtJQUU3QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2QixXQUFXLEVBQUUsQ0FBQTtJQUNmLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDdkYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNWLENBQUMsR0FBRyxJQUFJLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUMxRCxDQUFDO0lB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LEVBQ0YsSUFBSSxpQkFBVSxDQUFDLEdBQUcsRUFBRTtRQUNsQixPQUFPLEdBQUcsU0FBUyxDQUFBO1FBQ25CLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUNILENBQUE7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWhCRCwwQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJRXZlbnREZXNjLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IFN1Z2dlc3Rpb25CdWlsZGVyLCBJT3B0aW9ucywgSVN1Z2dlc3Rpb24gfSBmcm9tICcuL3N1Z2dlc3Rpb24tYnVpbGRlcidcbmltcG9ydCB7IExhc3RTdWdnZXN0aW9uVmlldyB9IGZyb20gJy4vbGFzdC1zdWdnZXN0aW9uLXZpZXcnXG5cbmxldCBiYWNrZW5kOiBVUEkuQ29tcGxldGlvbkJhY2tlbmQuSUNvbXBsZXRpb25CYWNrZW5kIHwgdW5kZWZpbmVkXG5sZXQgZGlzcG9zYWJsZXM6IENvbXBvc2l0ZURpc3Bvc2FibGUgfCB1bmRlZmluZWRcbmxldCBwYW5lbDogQXRvbVR5cGVzLlBhbmVsPExhc3RTdWdnZXN0aW9uVmlldz4gfCB1bmRlZmluZWRcbmxldCB1cGk6IFVQSS5JVVBJSW5zdGFuY2UgfCB1bmRlZmluZWRcbmxldCBsYXN0Q29tcGxldGlvbkRlc2M6IHN0cmluZyB8IHVuZGVmaW5lZFxuXG5pbnRlcmZhY2UgSVN0YXRlIHtcbiAgcGFuZWxWaXNpYmxlPzogYm9vbGVhblxuICBsYXN0Q29tcGxldGlvbkRlc2M6IHN0cmluZyB8IHVuZGVmaW5lZFxufVxuXG5pbnRlcmZhY2UgSUFDUERpZEluc2VydEV2ZW50UGFyYW1zIHtcbiAgZWRpdG9yOiBBdG9tVHlwZXMuVGV4dEVkaXRvclxuICB0cmlnZ2VyUG9zaXRpb246IEF0b21UeXBlcy5Qb2ludFxuICBzdWdnZXN0aW9uOiBJU3VnZ2VzdGlvblxufVxuXG5leHBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZydcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKHN0YXRlOiBJU3RhdGUpIHtcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgaWYgKHN0YXRlLnBhbmVsVmlzaWJsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhdGUucGFuZWxWaXNpYmxlID0gKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuZGVmYXVsdEhpbnRQYW5lbFZpc2liaWxpdHknKSA9PT0gJ1Zpc2libGUnKVxuICB9XG5cbiAgbGFzdENvbXBsZXRpb25EZXNjID0gc3RhdGUubGFzdENvbXBsZXRpb25EZXNjXG5cbiAgaWYgKHN0YXRlLnBhbmVsVmlzaWJsZSkge1xuICAgIGNyZWF0ZVBhbmVsKClcbiAgfVxuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdXRvY29tcGxldGUtaGFza2VsbC5oaWRlSGludFBhbmVsSWZFbXB0eScsICh2YWwpID0+IHtcbiAgICBpZiAocGFuZWwpIHtcbiAgICAgICF2YWwgfHwgbGFzdENvbXBsZXRpb25EZXNjID8gcGFuZWwuc2hvdygpIDogcGFuZWwuaGlkZSgpXG4gICAgfVxuICB9KSlcblxuICBkaXNwb3NhYmxlcy5hZGQoXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cImhhc2tlbGxcIl0nLCB7XG4gICAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6Y29uY2VhbC1oaW50LXBhbmVsJzogKHsgY3VycmVudFRhcmdldCwgYWJvcnRLZXlCaW5kaW5nIH06IElFdmVudERlc2MpID0+IHtcbiAgICAgICAgaWYgKHBhbmVsICYmIHBhbmVsLmlzVmlzaWJsZSgpICYmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuaGlkZUhpbnRQYW5lbElmRW1wdHknKSkge1xuICAgICAgICAgIHBhbmVsLmhpZGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgYWJvcnRLZXlCaW5kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBhYm9ydEtleUJpbmRpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICApLFxuICApXG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6dG9nZ2xlLWNvbXBsZXRpb24taGludCc6ICgpID0+IHtcbiAgICAgIGlmIChwYW5lbCkge1xuICAgICAgICBkZXN0cm95UGFuZWwoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3JlYXRlUGFuZWwoKVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG4pLFxuICApXG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20ubWVudS5hZGQoW3tcbiAgICBsYWJlbDogJ0hhc2tlbGwgSURFJyxcbiAgICBzdWJtZW51OiBbe1xuICAgICAgbGFiZWw6ICdUb2dnbGUgQ29tcGxldGlvbiBIaW50IFBhbmVsJyxcbiAgICAgIGNvbW1hbmQ6ICdhdXRvY29tcGxldGUtaGFza2VsbDp0b2dnbGUtY29tcGxldGlvbi1oaW50JyxcbiAgICB9XSxcbiAgfV0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKCk6IElTdGF0ZSB7XG4gIHJldHVybiB7XG4gICAgcGFuZWxWaXNpYmxlOiAhIXBhbmVsLFxuICAgIGxhc3RDb21wbGV0aW9uRGVzYyxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgZGlzcG9zYWJsZXMgJiYgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIGRpc3Bvc2FibGVzID0gdW5kZWZpbmVkXG4gIHVwaSA9IHVuZGVmaW5lZFxuICBkZXN0cm95UGFuZWwoKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVQYW5lbCgpIHtcbiAgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG4gICAgaXRlbTogbmV3IExhc3RTdWdnZXN0aW9uVmlldyhsYXN0Q29tcGxldGlvbkRlc2MpLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgcHJpb3JpdHk6IDIwMCxcbiAgfSlcbn1cblxuZnVuY3Rpb24gZGVzdHJveVBhbmVsKCkge1xuICBwYW5lbCAmJiBwYW5lbC5kZXN0cm95KClcbiAgcGFuZWwgPSB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9jb21wbGV0ZVByb3ZpZGVyXzJfMF8wKCkge1xuICByZXR1cm4ge1xuICAgIHNlbGVjdG9yOiAnLnNvdXJjZS5oYXNrZWxsJyxcbiAgICBkaXNhYmxlRm9yU2VsZWN0b3I6ICcuc291cmNlLmhhc2tlbGwgLmNvbW1lbnQnLFxuICAgIGluY2x1c2lvblByaW9yaXR5OiAwLFxuICAgIGdldFN1Z2dlc3Rpb25zOiAob3B0aW9uczogSU9wdGlvbnMpID0+IHtcbiAgICAgIGlmICghYmFja2VuZCkgeyByZXR1cm4gW10gfVxuICAgICAgcmV0dXJuIChuZXcgU3VnZ2VzdGlvbkJ1aWxkZXIob3B0aW9ucywgYmFja2VuZCkpLmdldFN1Z2dlc3Rpb25zKClcbiAgICB9LFxuICAgIG9uRGlkSW5zZXJ0U3VnZ2VzdGlvbjogKHsgZWRpdG9yLCB0cmlnZ2VyUG9zaXRpb24sIHN1Z2dlc3Rpb24gfTogSUFDUERpZEluc2VydEV2ZW50UGFyYW1zKSA9PiB7XG4gICAgICBpZiAoc3VnZ2VzdGlvbiAmJiBzdWdnZXN0aW9uLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRlc2MgPSBsYXN0Q29tcGxldGlvbkRlc2MgPSBzdWdnZXN0aW9uLmRlc2NyaXB0aW9uXG4gICAgICAgIGlmIChwYW5lbCkge1xuICAgICAgICAgIGNvbnN0IHZpZXc6IExhc3RTdWdnZXN0aW9uVmlldyA9IHBhbmVsLmdldEl0ZW0oKVxuICAgICAgICAgIHZpZXcuc2V0VGV4dChkZXNjKVxuICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICAgIHBhbmVsLnNob3coKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodXBpICYmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuc2hvd0lkZUhhc2tlbGxUb29sdGlwJykpIHtcbiAgICAgICAgICBjb25zdCBwMiA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgICAgIGNvbnN0IHAxID0gcDIudHJhbnNsYXRlKFswLCAtc3VnZ2VzdGlvbi50ZXh0Lmxlbmd0aF0pXG4gICAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgICAgICAgIHVwaSAmJiB1cGkuc2hvd1Rvb2x0aXAoe1xuICAgICAgICAgICAgICBlZGl0b3IsXG4gICAgICAgICAgICAgIGV2ZW50VHlwZTogVVBJLlRFdmVudFJhbmdlVHlwZS5rZXlib2FyZCxcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgICAgIHJhbmdlOiBbcDEsIHAyXSxcbiAgICAgICAgICAgICAgICBwZXJzaXN0ZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6IGRlc2MsXG4gICAgICAgICAgICAgICAgICBoaWdobGlnaHRlcjogJ2hpbnQuaGFza2VsbCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYW5lbCkge1xuICAgICAgICBjb25zdCB2aWV3OiBMYXN0U3VnZ2VzdGlvblZpZXcgPSBwYW5lbC5nZXRJdGVtKClcbiAgICAgICAgdmlldy5zZXRUZXh0KCcnKVxuICAgICAgICBpZiAocGFuZWwgJiYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5oaWRlSGludFBhbmVsSWZFbXB0eScpKSB7XG4gICAgICAgICAgcGFuZWwuaGlkZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lVVBJKHNlcnZpY2U6IFVQSS5JVVBJUmVnaXN0cmF0aW9uKSB7XG4gIHVwaSA9IHNlcnZpY2Uoe1xuICAgIG5hbWU6ICdhdXRvY29tcGxldGUtaGFza2VsbCcsXG4gIH0pXG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmFkZCh1cGkpXG4gIHJldHVybiB1cGlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN1bWVDb21wQmFjayhzZXJ2aWNlOiBVUEkuQ29tcGxldGlvbkJhY2tlbmQuSUNvbXBsZXRpb25CYWNrZW5kKSB7XG4gIGJhY2tlbmQgPSBzZXJ2aWNlXG4gIGNvbnN0IG15ZGlzcCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgZGlzcG9zYWJsZXMgJiYgZGlzcG9zYWJsZXMuYWRkKG15ZGlzcClcbiAgbXlkaXNwLmFkZChcbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgaWYgKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lID09PSAnc291cmNlLmhhc2tlbGwnKSB7XG4gICAgICAgIG15ZGlzcC5hZGQoc2VydmljZS5yZWdpc3RlckNvbXBsZXRpb25CdWZmZXIoZWRpdG9yLmdldEJ1ZmZlcigpKSlcbiAgICAgIH1cbiAgICB9KSxcbiAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBiYWNrZW5kID0gdW5kZWZpbmVkXG4gICAgICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5yZW1vdmUobXlkaXNwKVxuICAgIH0pLFxuICApXG4gIHJldHVybiBteWRpc3Bcbn1cbiJdfQ==