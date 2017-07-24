"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const suggestion_builder_1 = require("./suggestion-builder");
const last_suggestion_view_1 = require("./last-suggestion-view");
let backend;
let disposables;
let panel;
let upi;
var config_1 = require("./config");
exports.config = config_1.config;
function activate(state) {
    disposables = new atom_1.CompositeDisposable();
    if (state.panelVisible || (atom.config.get('autocomplete-haskell.defaultHintPanelVisibility') === 'Visible')) {
        createPanel();
    }
    disposables.add(atom.config.observe('autocomplete-haskell.hideHintPanelIfEmpty', (val) => {
        if (panel) {
            !val || panel.getItem().getText() ? panel.show() : panel.hide();
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
        }
    }));
    disposables.add(atom.commands.add('atom-workspace', {
        'autocomplete-haskell:toggle-completion-hint': () => {
            if (panel) {
                destroyPanel();
            }
            else {
                createPanel();
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
    return { panelVisible: !!panel };
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
        item: new last_suggestion_view_1.LastSuggestionView(),
        visible: true,
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
            if (!backend) {
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
                if (panel && atom.config.get('autocomplete-haskell.hideHintPanelIfEmpty')) {
                    panel.hide();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhc2tlbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0b2NvbXBsZXRlLWhhc2tlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBb0Q7QUFDcEQsNkRBQTZFO0FBQzdFLGlFQUF5RDtBQUd6RCxJQUFJLE9BQXVDLENBQUE7QUFDM0MsSUFBSSxXQUE0QyxDQUFBO0FBQ2hELElBQUksS0FBa0MsQ0FBQTtBQUN0QyxJQUFJLEdBQWlDLENBQUE7QUFZckMsbUNBQStCO0FBQXZCLDBCQUFBLE1BQU0sQ0FBQTtBQUVkLGtCQUEwQixLQUFhO0lBQ3JDLFdBQVcsR0FBRyxJQUFJLDBCQUFtQixFQUFFLENBQUE7SUFFdkMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLFdBQVcsRUFBRSxDQUFBO0lBQ2YsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMkNBQTJDLEVBQUUsQ0FBQyxHQUFHO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixDQUFDLEdBQUcsSUFBSyxLQUFLLENBQUMsT0FBTyxFQUF5QixDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDekYsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFSCxXQUFXLENBQUMsR0FBRyxDQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxFQUFFO1FBQzdELHlDQUF5QyxFQUFFLENBQUMsRUFBQyxhQUFhLEVBQUUsZUFBZSxFQUFhO1lBQ3RGLEVBQUUsQ0FBQyxDQUFDLEtB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LENBQUE7Z0JBQ2QsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUE5Q0QsZ0VBOENDO0FBRUQsb0JBQTRCLE9BQTZCO0lBQ3ZELEdBQUcsR0FBRyxPQUFPLENBQUM7UUFDWixJQUFJLEVBQUUsc0JBQXNCO0tBQzdCLENBQUMsQ0FBQTtJQUNGLFdBQVcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUE7QUFDWixDQUFDO0FBTkQsZ0NBTUM7QUFFRCx5QkFBaUMsT0FBMkI7SUFDMUQsT0FBTyxHQUFHLE9BQU8sQ0FBQTtJQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLDBCQUFtQixFQUFFLENBQUE7SUFDeEMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FDUixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTTtRQUN2QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxLQUFLLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLENBQUM7SUFDSCxDQUFDLENBQUMsRUFDRixJQUFJLGlCQUFVLENBQUM7UUFDYixPQUFPLEdBQUcsU0FBUyxDQUFBO1FBQ25CLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUNILENBQUE7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWhCRCwwQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge1N1Z2dlc3Rpb25CdWlsZGVyLCBJT3B0aW9ucywgSVN1Z2dlc3Rpb259IGZyb20gJy4vc3VnZ2VzdGlvbi1idWlsZGVyJ1xuaW1wb3J0IHtMYXN0U3VnZ2VzdGlvblZpZXd9IGZyb20gJy4vbGFzdC1zdWdnZXN0aW9uLXZpZXcnXG5pbXBvcnQge0lDb21wbGV0aW9uQmFja2VuZH0gZnJvbSAnLi4vdHlwaW5ncy9jb21wbGV0aW9uLWJhY2tlbmQnXG5cbmxldCBiYWNrZW5kOiBJQ29tcGxldGlvbkJhY2tlbmQgfCB1bmRlZmluZWRcbmxldCBkaXNwb3NhYmxlczogQ29tcG9zaXRlRGlzcG9zYWJsZSB8IHVuZGVmaW5lZFxubGV0IHBhbmVsOiBBdG9tVHlwZXMuUGFuZWwgfCB1bmRlZmluZWRcbmxldCB1cGk6IFVQSS5JVVBJSW5zdGFuY2UgfCB1bmRlZmluZWRcblxuaW50ZXJmYWNlIElTdGF0ZSB7XG4gIHBhbmVsVmlzaWJsZT86IGJvb2xlYW5cbn1cblxuaW50ZXJmYWNlIElBQ1BEaWRJbnNlcnRFdmVudFBhcmFtcyB7XG4gIGVkaXRvcjogQXRvbVR5cGVzLlRleHRFZGl0b3JcbiAgdHJpZ2dlclBvc2l0aW9uOiBBdG9tVHlwZXMuUG9pbnRcbiAgc3VnZ2VzdGlvbjogSVN1Z2dlc3Rpb25cbn1cblxuZXhwb3J0IHtjb25maWd9IGZyb20gJy4vY29uZmlnJ1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKHN0YXRlOiBJU3RhdGUpIHtcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgaWYgKHN0YXRlLnBhbmVsVmlzaWJsZSB8fCAoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5kZWZhdWx0SGludFBhbmVsVmlzaWJpbGl0eScpID09PSAnVmlzaWJsZScpKSB7XG4gICAgY3JlYXRlUGFuZWwoKVxuICB9XG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JywgKHZhbCkgPT4ge1xuICAgIGlmIChwYW5lbCkge1xuICAgICAgIXZhbCB8fCAocGFuZWwuZ2V0SXRlbSgpIGFzIExhc3RTdWdnZXN0aW9uVmlldykuZ2V0VGV4dCgpID8gcGFuZWwuc2hvdygpIDogcGFuZWwuaGlkZSgpXG4gICAgfVxuICB9KSlcblxuICBkaXNwb3NhYmxlcy5hZGQoXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cImhhc2tlbGxcIl0nLCB7XG4gICAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6Y29uY2VhbC1oaW50LXBhbmVsJzogKHtjdXJyZW50VGFyZ2V0LCBhYm9ydEtleUJpbmRpbmd9OiBJRXZlbnREZXNjKSA9PiB7XG4gICAgICAgIGlmIChwYW5lbCAmJiBwYW5lbC5pc1Zpc2libGUoKSAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICBwYW5lbC5oaWRlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGFib3J0S2V5QmluZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgKVxuICApXG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6dG9nZ2xlLWNvbXBsZXRpb24taGludCc6ICgpID0+IHtcbiAgICAgIGlmIChwYW5lbCkge1xuICAgICAgICBkZXN0cm95UGFuZWwoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3JlYXRlUGFuZWwoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICApXG4gIClcblxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5tZW51LmFkZChbe1xuICAgIGxhYmVsOiAnSGFza2VsbCBJREUnLFxuICAgIHN1Ym1lbnU6IFt7XG4gICAgICAgIGxhYmVsOiAnVG9nZ2xlIENvbXBsZXRpb24gSGludCBQYW5lbCcsXG4gICAgICAgIGNvbW1hbmQ6ICdhdXRvY29tcGxldGUtaGFza2VsbDp0b2dnbGUtY29tcGxldGlvbi1oaW50J1xuICAgIH1dXG4gIH1dKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZSAoKTogSVN0YXRlIHtcbiAgcmV0dXJuIHsgcGFuZWxWaXNpYmxlOiAhIXBhbmVsIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgZGlzcG9zYWJsZXMgPSB1bmRlZmluZWRcbiAgdXBpID0gdW5kZWZpbmVkXG4gIGRlc3Ryb3lQYW5lbCgpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsICgpIHtcbiAgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG4gICAgaXRlbTogbmV3IExhc3RTdWdnZXN0aW9uVmlldygpLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgcHJpb3JpdHk6IDIwMFxuICB9KVxufVxuXG5mdW5jdGlvbiBkZXN0cm95UGFuZWwgKCkge1xuICBwYW5lbCAmJiBwYW5lbC5kZXN0cm95KClcbiAgcGFuZWwgPSB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9jb21wbGV0ZVByb3ZpZGVyXzJfMF8wICgpIHtcbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RvcjogJy5zb3VyY2UuaGFza2VsbCcsXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5oYXNrZWxsIC5jb21tZW50JyxcbiAgICBpbmNsdXNpb25Qcmlvcml0eTogMCxcbiAgICBnZXRTdWdnZXN0aW9uczogKG9wdGlvbnM6IElPcHRpb25zKSA9PiB7XG4gICAgICBpZiAoIWJhY2tlbmQpIHsgcmV0dXJuIFtdIH1cbiAgICAgIHJldHVybiAobmV3IFN1Z2dlc3Rpb25CdWlsZGVyKG9wdGlvbnMsIGJhY2tlbmQpKS5nZXRTdWdnZXN0aW9ucygpXG4gICAgfSxcbiAgICBvbkRpZEluc2VydFN1Z2dlc3Rpb246ICh7ZWRpdG9yLCB0cmlnZ2VyUG9zaXRpb24sIHN1Z2dlc3Rpb259OiBJQUNQRGlkSW5zZXJ0RXZlbnRQYXJhbXMpID0+IHtcbiAgICAgIGlmIChzdWdnZXN0aW9uICYmIHN1Z2dlc3Rpb24uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IHN1Z2dlc3Rpb24uZGVzY3JpcHRpb25cbiAgICAgICAgaWYgKHBhbmVsKSB7XG4gICAgICAgICAgY29uc3QgdmlldzogTGFzdFN1Z2dlc3Rpb25WaWV3ID0gcGFuZWwuZ2V0SXRlbSgpXG4gICAgICAgICAgdmlldy5zZXRUZXh0KGRlc2MpXG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuaGlkZUhpbnRQYW5lbElmRW1wdHknKSkge1xuICAgICAgICAgICAgcGFuZWwuc2hvdygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1cGkgJiYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5zaG93SWRlSGFza2VsbFRvb2x0aXAnKSkge1xuICAgICAgICAgIGNvbnN0IHAyID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgICAgY29uc3QgcDEgPSBwMi50cmFuc2xhdGUoWzAsIC1zdWdnZXN0aW9uLnRleHQubGVuZ3RoXSlcbiAgICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgICAgdXBpICYmIHVwaS5zaG93VG9vbHRpcCh7XG4gICAgICAgICAgICAgIGVkaXRvcixcbiAgICAgICAgICAgICAgZXZlbnRUeXBlOiBVUEkuVEV2ZW50UmFuZ2VUeXBlLmtleWJvYXJkLFxuICAgICAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IFtwMSwgcDJdLFxuICAgICAgICAgICAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICAgICAgdGV4dDogZGVzYyxcbiAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVyOiAnaGludC5oYXNrZWxsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBhbmVsKSB7XG4gICAgICAgIGNvbnN0IHZpZXc6IExhc3RTdWdnZXN0aW9uVmlldyA9IHBhbmVsLmdldEl0ZW0oKVxuICAgICAgICB2aWV3LnNldFRleHQoJycpXG4gICAgICAgIGlmIChwYW5lbCAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICBwYW5lbC5oaWRlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZVVQSSAoc2VydmljZTogVVBJLklVUElSZWdpc3RyYXRpb24pIHtcbiAgdXBpID0gc2VydmljZSh7XG4gICAgbmFtZTogJ2F1dG9jb21wbGV0ZS1oYXNrZWxsJ1xuICB9KVxuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5hZGQodXBpKVxuICByZXR1cm4gdXBpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lQ29tcEJhY2sgKHNlcnZpY2U6IElDb21wbGV0aW9uQmFja2VuZCkge1xuICBiYWNrZW5kID0gc2VydmljZVxuICBjb25zdCBteWRpc3AgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmFkZChteWRpc3ApXG4gIG15ZGlzcC5hZGQoXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5oYXNrZWxsJykge1xuICAgICAgICBteWRpc3AuYWRkKHNlcnZpY2UucmVnaXN0ZXJDb21wbGV0aW9uQnVmZmVyKGVkaXRvci5nZXRCdWZmZXIoKSkpXG4gICAgICB9XG4gICAgfSksXG4gICAgbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgYmFja2VuZCA9IHVuZGVmaW5lZFxuICAgICAgZGlzcG9zYWJsZXMgJiYgZGlzcG9zYWJsZXMucmVtb3ZlKG15ZGlzcClcbiAgICB9KVxuICApXG4gIHJldHVybiBteWRpc3Bcbn1cbiJdfQ==