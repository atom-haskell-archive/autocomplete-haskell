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
    if (state.panelVisible || (atom.config.get('autocomplete-haskell.defaultHintPanelVisibility') === 'Visible')) {
        createPanel();
    }
    lastCompletionDesc = state.lastCompletionDesc;
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
    return {
        panelVisible: !!panel,
        lastCompletionDesc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhc2tlbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0b2NvbXBsZXRlLWhhc2tlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBb0Q7QUFDcEQsNkRBQTZFO0FBQzdFLGlFQUF5RDtBQUd6RCxJQUFJLE9BQXVDLENBQUE7QUFDM0MsSUFBSSxXQUE0QyxDQUFBO0FBQ2hELElBQUksS0FBa0MsQ0FBQTtBQUN0QyxJQUFJLEdBQWlDLENBQUE7QUFDckMsSUFBSSxrQkFBc0MsQ0FBQTtBQWExQyxtQ0FBK0I7QUFBdkIsMEJBQUEsTUFBTSxDQUFBO0FBRWQsa0JBQTBCLEtBQWE7SUFDckMsV0FBVyxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtJQUV2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaURBQWlELENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0csV0FBVyxFQUFFLENBQUE7SUFDZixDQUFDO0lBRUQsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFBO0lBRTdDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMkNBQTJDLEVBQUUsQ0FBQyxHQUFHO1FBQ25GLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixDQUFDLEdBQUcsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO1FBQzFELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRUgsV0FBVyxDQUFDLEdBQUcsQ0FDYixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsRUFBRTtRQUM3RCx5Q0FBeUMsRUFBRSxDQUFDLEVBQUMsYUFBYSxFQUFF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IjpbImltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7U3VnZ2VzdGlvbkJ1aWxkZXIsIElPcHRpb25zLCBJU3VnZ2VzdGlvbn0gZnJvbSAnLi9zdWdnZXN0aW9uLWJ1aWxkZXInXG5pbXBvcnQge0xhc3RTdWdnZXN0aW9uVmlld30gZnJvbSAnLi9sYXN0LXN1Z2dlc3Rpb24tdmlldydcbmltcG9ydCB7SUNvbXBsZXRpb25CYWNrZW5kfSBmcm9tICcuLi90eXBpbmdzL2NvbXBsZXRpb24tYmFja2VuZCdcblxubGV0IGJhY2tlbmQ6IElDb21wbGV0aW9uQmFja2VuZCB8IHVuZGVmaW5lZFxubGV0IGRpc3Bvc2FibGVzOiBDb21wb3NpdGVEaXNwb3NhYmxlIHwgdW5kZWZpbmVkXG5sZXQgcGFuZWw6IEF0b21UeXBlcy5QYW5lbCB8IHVuZGVmaW5lZFxubGV0IHVwaTogVVBJLklVUElJbnN0YW5jZSB8IHVuZGVmaW5lZFxubGV0IGxhc3RDb21wbGV0aW9uRGVzYzogc3RyaW5nIHwgdW5kZWZpbmVkXG5cbmludGVyZmFjZSBJU3RhdGUge1xuICBwYW5lbFZpc2libGU/OiBib29sZWFuXG4gIGxhc3RDb21wbGV0aW9uRGVzYzogc3RyaW5nIHwgdW5kZWZpbmVkXG59XG5cbmludGVyZmFjZSBJQUNQRGlkSW5zZXJ0RXZlbnRQYXJhbXMge1xuICBlZGl0b3I6IEF0b21UeXBlcy5UZXh0RWRpdG9yXG4gIHRyaWdnZXJQb3NpdGlvbjogQXRvbVR5cGVzLlBvaW50XG4gIHN1Z2dlc3Rpb246IElTdWdnZXN0aW9uXG59XG5cbmV4cG9ydCB7Y29uZmlnfSBmcm9tICcuL2NvbmZpZydcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlIChzdGF0ZTogSVN0YXRlKSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGlmIChzdGF0ZS5wYW5lbFZpc2libGUgfHwgKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuZGVmYXVsdEhpbnRQYW5lbFZpc2liaWxpdHknKSA9PT0gJ1Zpc2libGUnKSkge1xuICAgIGNyZWF0ZVBhbmVsKClcbiAgfVxuXG4gIGxhc3RDb21wbGV0aW9uRGVzYyA9IHN0YXRlLmxhc3RDb21wbGV0aW9uRGVzY1xuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdXRvY29tcGxldGUtaGFza2VsbC5oaWRlSGludFBhbmVsSWZFbXB0eScsICh2YWwpID0+IHtcbiAgICBpZiAocGFuZWwpIHtcbiAgICAgICF2YWwgfHwgbGFzdENvbXBsZXRpb25EZXNjID8gcGFuZWwuc2hvdygpIDogcGFuZWwuaGlkZSgpXG4gICAgfVxuICB9KSlcblxuICBkaXNwb3NhYmxlcy5hZGQoXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cImhhc2tlbGxcIl0nLCB7XG4gICAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6Y29uY2VhbC1oaW50LXBhbmVsJzogKHtjdXJyZW50VGFyZ2V0LCBhYm9ydEtleUJpbmRpbmd9OiBJRXZlbnREZXNjKSA9PiB7XG4gICAgICAgIGlmIChwYW5lbCAmJiBwYW5lbC5pc1Zpc2libGUoKSAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICBwYW5lbC5oaWRlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGFib3J0S2V5QmluZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgKVxuICApXG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6dG9nZ2xlLWNvbXBsZXRpb24taGludCc6ICgpID0+IHtcbiAgICAgIGlmIChwYW5lbCkge1xuICAgICAgICBkZXN0cm95UGFuZWwoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3JlYXRlUGFuZWwoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICApXG4gIClcblxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5tZW51LmFkZChbe1xuICAgIGxhYmVsOiAnSGFza2VsbCBJREUnLFxuICAgIHN1Ym1lbnU6IFt7XG4gICAgICAgIGxhYmVsOiAnVG9nZ2xlIENvbXBsZXRpb24gSGludCBQYW5lbCcsXG4gICAgICAgIGNvbW1hbmQ6ICdhdXRvY29tcGxldGUtaGFza2VsbDp0b2dnbGUtY29tcGxldGlvbi1oaW50J1xuICAgIH1dXG4gIH1dKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZSAoKTogSVN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBwYW5lbFZpc2libGU6ICEhcGFuZWwsXG4gICAgbGFzdENvbXBsZXRpb25EZXNjXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgZGlzcG9zYWJsZXMgPSB1bmRlZmluZWRcbiAgdXBpID0gdW5kZWZpbmVkXG4gIGRlc3Ryb3lQYW5lbCgpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsICgpIHtcbiAgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG4gICAgaXRlbTogbmV3IExhc3RTdWdnZXN0aW9uVmlldyhsYXN0Q29tcGxldGlvbkRlc2MpLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgcHJpb3JpdHk6IDIwMFxuICB9KVxufVxuXG5mdW5jdGlvbiBkZXN0cm95UGFuZWwgKCkge1xuICBwYW5lbCAmJiBwYW5lbC5kZXN0cm95KClcbiAgcGFuZWwgPSB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9jb21wbGV0ZVByb3ZpZGVyXzJfMF8wICgpIHtcbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RvcjogJy5zb3VyY2UuaGFza2VsbCcsXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5oYXNrZWxsIC5jb21tZW50JyxcbiAgICBpbmNsdXNpb25Qcmlvcml0eTogMCxcbiAgICBnZXRTdWdnZXN0aW9uczogKG9wdGlvbnM6IElPcHRpb25zKSA9PiB7XG4gICAgICBpZiAoIWJhY2tlbmQpIHsgcmV0dXJuIFtdIH1cbiAgICAgIHJldHVybiAobmV3IFN1Z2dlc3Rpb25CdWlsZGVyKG9wdGlvbnMsIGJhY2tlbmQpKS5nZXRTdWdnZXN0aW9ucygpXG4gICAgfSxcbiAgICBvbkRpZEluc2VydFN1Z2dlc3Rpb246ICh7ZWRpdG9yLCB0cmlnZ2VyUG9zaXRpb24sIHN1Z2dlc3Rpb259OiBJQUNQRGlkSW5zZXJ0RXZlbnRQYXJhbXMpID0+IHtcbiAgICAgIGlmIChzdWdnZXN0aW9uICYmIHN1Z2dlc3Rpb24uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGxhc3RDb21wbGV0aW9uRGVzYyA9IHN1Z2dlc3Rpb24uZGVzY3JpcHRpb25cbiAgICAgICAgaWYgKHBhbmVsKSB7XG4gICAgICAgICAgY29uc3QgdmlldzogTGFzdFN1Z2dlc3Rpb25WaWV3ID0gcGFuZWwuZ2V0SXRlbSgpXG4gICAgICAgICAgdmlldy5zZXRUZXh0KGRlc2MpXG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuaGlkZUhpbnRQYW5lbElmRW1wdHknKSkge1xuICAgICAgICAgICAgcGFuZWwuc2hvdygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1cGkgJiYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5zaG93SWRlSGFza2VsbFRvb2x0aXAnKSkge1xuICAgICAgICAgIGNvbnN0IHAyID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgICAgY29uc3QgcDEgPSBwMi50cmFuc2xhdGUoWzAsIC1zdWdnZXN0aW9uLnRleHQubGVuZ3RoXSlcbiAgICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgICAgdXBpICYmIHVwaS5zaG93VG9vbHRpcCh7XG4gICAgICAgICAgICAgIGVkaXRvcixcbiAgICAgICAgICAgICAgZXZlbnRUeXBlOiBVUEkuVEV2ZW50UmFuZ2VUeXBlLmtleWJvYXJkLFxuICAgICAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IFtwMSwgcDJdLFxuICAgICAgICAgICAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICAgICAgdGV4dDogZGVzYyxcbiAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVyOiAnaGludC5oYXNrZWxsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBhbmVsKSB7XG4gICAgICAgIGNvbnN0IHZpZXc6IExhc3RTdWdnZXN0aW9uVmlldyA9IHBhbmVsLmdldEl0ZW0oKVxuICAgICAgICB2aWV3LnNldFRleHQoJycpXG4gICAgICAgIGlmIChwYW5lbCAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICBwYW5lbC5oaWRlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZVVQSSAoc2VydmljZTogVVBJLklVUElSZWdpc3RyYXRpb24pIHtcbiAgdXBpID0gc2VydmljZSh7XG4gICAgbmFtZTogJ2F1dG9jb21wbGV0ZS1oYXNrZWxsJ1xuICB9KVxuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5hZGQodXBpKVxuICByZXR1cm4gdXBpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lQ29tcEJhY2sgKHNlcnZpY2U6IElDb21wbGV0aW9uQmFja2VuZCkge1xuICBiYWNrZW5kID0gc2VydmljZVxuICBjb25zdCBteWRpc3AgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmFkZChteWRpc3ApXG4gIG15ZGlzcC5hZGQoXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5oYXNrZWxsJykge1xuICAgICAgICBteWRpc3AuYWRkKHNlcnZpY2UucmVnaXN0ZXJDb21wbGV0aW9uQnVmZmVyKGVkaXRvci5nZXRCdWZmZXIoKSkpXG4gICAgICB9XG4gICAgfSksXG4gICAgbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgYmFja2VuZCA9IHVuZGVmaW5lZFxuICAgICAgZGlzcG9zYWJsZXMgJiYgZGlzcG9zYWJsZXMucmVtb3ZlKG15ZGlzcClcbiAgICB9KVxuICApXG4gIHJldHVybiBteWRpc3Bcbn1cbiJdfQ==