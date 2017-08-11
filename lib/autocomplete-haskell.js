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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhc2tlbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0b2NvbXBsZXRlLWhhc2tlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBZ0U7QUFDaEUsNkRBQTZFO0FBQzdFLGlFQUF5RDtBQUV6RCxJQUFJLE9BQTZELENBQUE7QUFDakUsSUFBSSxXQUE0QyxDQUFBO0FBQ2hELElBQUksS0FBa0MsQ0FBQTtBQUN0QyxJQUFJLEdBQWlDLENBQUE7QUFDckMsSUFBSSxrQkFBc0MsQ0FBQTtBQWExQyxtQ0FBK0I7QUFBdkIsMEJBQUEsTUFBTSxDQUFBO0FBRWQsa0JBQTBCLEtBQWE7SUFDckMsV0FBVyxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtJQUV2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckMsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUE7SUFDekcsQ0FBQztJQUVELGtCQUFrQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQTtJQUU3QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2QixXQUFXLEVBQUUsQ0FBQTtJQUNmLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxFQUFFLENBQUMsR0FBRztRQUNuRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxHQUFHLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUMxRCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVILFdB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QyxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUNILENBQUE7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWhCRCwwQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lFdmVudERlc2MsIENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge1N1Z2dlc3Rpb25CdWlsZGVyLCBJT3B0aW9ucywgSVN1Z2dlc3Rpb259IGZyb20gJy4vc3VnZ2VzdGlvbi1idWlsZGVyJ1xuaW1wb3J0IHtMYXN0U3VnZ2VzdGlvblZpZXd9IGZyb20gJy4vbGFzdC1zdWdnZXN0aW9uLXZpZXcnXG5cbmxldCBiYWNrZW5kOiBVUEkuQ29tcGxldGlvbkJhY2tlbmQuSUNvbXBsZXRpb25CYWNrZW5kIHwgdW5kZWZpbmVkXG5sZXQgZGlzcG9zYWJsZXM6IENvbXBvc2l0ZURpc3Bvc2FibGUgfCB1bmRlZmluZWRcbmxldCBwYW5lbDogQXRvbVR5cGVzLlBhbmVsIHwgdW5kZWZpbmVkXG5sZXQgdXBpOiBVUEkuSVVQSUluc3RhbmNlIHwgdW5kZWZpbmVkXG5sZXQgbGFzdENvbXBsZXRpb25EZXNjOiBzdHJpbmcgfCB1bmRlZmluZWRcblxuaW50ZXJmYWNlIElTdGF0ZSB7XG4gIHBhbmVsVmlzaWJsZT86IGJvb2xlYW5cbiAgbGFzdENvbXBsZXRpb25EZXNjOiBzdHJpbmcgfCB1bmRlZmluZWRcbn1cblxuaW50ZXJmYWNlIElBQ1BEaWRJbnNlcnRFdmVudFBhcmFtcyB7XG4gIGVkaXRvcjogQXRvbVR5cGVzLlRleHRFZGl0b3JcbiAgdHJpZ2dlclBvc2l0aW9uOiBBdG9tVHlwZXMuUG9pbnRcbiAgc3VnZ2VzdGlvbjogSVN1Z2dlc3Rpb25cbn1cblxuZXhwb3J0IHtjb25maWd9IGZyb20gJy4vY29uZmlnJ1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKHN0YXRlOiBJU3RhdGUpIHtcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgaWYgKHN0YXRlLnBhbmVsVmlzaWJsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhdGUucGFuZWxWaXNpYmxlID0gKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuZGVmYXVsdEhpbnRQYW5lbFZpc2liaWxpdHknKSA9PT0gJ1Zpc2libGUnKVxuICB9XG5cbiAgbGFzdENvbXBsZXRpb25EZXNjID0gc3RhdGUubGFzdENvbXBsZXRpb25EZXNjXG5cbiAgaWYgKHN0YXRlLnBhbmVsVmlzaWJsZSkge1xuICAgIGNyZWF0ZVBhbmVsKClcbiAgfVxuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdXRvY29tcGxldGUtaGFza2VsbC5oaWRlSGludFBhbmVsSWZFbXB0eScsICh2YWwpID0+IHtcbiAgICBpZiAocGFuZWwpIHtcbiAgICAgICF2YWwgfHwgbGFzdENvbXBsZXRpb25EZXNjID8gcGFuZWwuc2hvdygpIDogcGFuZWwuaGlkZSgpXG4gICAgfVxuICB9KSlcblxuICBkaXNwb3NhYmxlcy5hZGQoXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cImhhc2tlbGxcIl0nLCB7XG4gICAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6Y29uY2VhbC1oaW50LXBhbmVsJzogKHtjdXJyZW50VGFyZ2V0LCBhYm9ydEtleUJpbmRpbmd9OiBJRXZlbnREZXNjKSA9PiB7XG4gICAgICAgIGlmIChwYW5lbCAmJiBwYW5lbC5pc1Zpc2libGUoKSAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICBwYW5lbC5oaWRlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGFib3J0S2V5QmluZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgKVxuICApXG5cbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6dG9nZ2xlLWNvbXBsZXRpb24taGludCc6ICgpID0+IHtcbiAgICAgIGlmIChwYW5lbCkge1xuICAgICAgICBkZXN0cm95UGFuZWwoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3JlYXRlUGFuZWwoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICApXG4gIClcblxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5tZW51LmFkZChbe1xuICAgIGxhYmVsOiAnSGFza2VsbCBJREUnLFxuICAgIHN1Ym1lbnU6IFt7XG4gICAgICAgIGxhYmVsOiAnVG9nZ2xlIENvbXBsZXRpb24gSGludCBQYW5lbCcsXG4gICAgICAgIGNvbW1hbmQ6ICdhdXRvY29tcGxldGUtaGFza2VsbDp0b2dnbGUtY29tcGxldGlvbi1oaW50J1xuICAgIH1dXG4gIH1dKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZSAoKTogSVN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBwYW5lbFZpc2libGU6ICEhcGFuZWwsXG4gICAgbGFzdENvbXBsZXRpb25EZXNjXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgZGlzcG9zYWJsZXMgPSB1bmRlZmluZWRcbiAgdXBpID0gdW5kZWZpbmVkXG4gIGRlc3Ryb3lQYW5lbCgpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhbmVsICgpIHtcbiAgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG4gICAgaXRlbTogbmV3IExhc3RTdWdnZXN0aW9uVmlldyhsYXN0Q29tcGxldGlvbkRlc2MpLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgcHJpb3JpdHk6IDIwMFxuICB9KVxufVxuXG5mdW5jdGlvbiBkZXN0cm95UGFuZWwgKCkge1xuICBwYW5lbCAmJiBwYW5lbC5kZXN0cm95KClcbiAgcGFuZWwgPSB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9jb21wbGV0ZVByb3ZpZGVyXzJfMF8wICgpIHtcbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RvcjogJy5zb3VyY2UuaGFza2VsbCcsXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5oYXNrZWxsIC5jb21tZW50JyxcbiAgICBpbmNsdXNpb25Qcmlvcml0eTogMCxcbiAgICBnZXRTdWdnZXN0aW9uczogKG9wdGlvbnM6IElPcHRpb25zKSA9PiB7XG4gICAgICBpZiAoIWJhY2tlbmQpIHsgcmV0dXJuIFtdIH1cbiAgICAgIHJldHVybiAobmV3IFN1Z2dlc3Rpb25CdWlsZGVyKG9wdGlvbnMsIGJhY2tlbmQpKS5nZXRTdWdnZXN0aW9ucygpXG4gICAgfSxcbiAgICBvbkRpZEluc2VydFN1Z2dlc3Rpb246ICh7ZWRpdG9yLCB0cmlnZ2VyUG9zaXRpb24sIHN1Z2dlc3Rpb259OiBJQUNQRGlkSW5zZXJ0RXZlbnRQYXJhbXMpID0+IHtcbiAgICAgIGlmIChzdWdnZXN0aW9uICYmIHN1Z2dlc3Rpb24uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGxhc3RDb21wbGV0aW9uRGVzYyA9IHN1Z2dlc3Rpb24uZGVzY3JpcHRpb25cbiAgICAgICAgaWYgKHBhbmVsKSB7XG4gICAgICAgICAgY29uc3QgdmlldzogTGFzdFN1Z2dlc3Rpb25WaWV3ID0gcGFuZWwuZ2V0SXRlbSgpXG4gICAgICAgICAgdmlldy5zZXRUZXh0KGRlc2MpXG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuaGlkZUhpbnRQYW5lbElmRW1wdHknKSkge1xuICAgICAgICAgICAgcGFuZWwuc2hvdygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1cGkgJiYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5zaG93SWRlSGFza2VsbFRvb2x0aXAnKSkge1xuICAgICAgICAgIGNvbnN0IHAyID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICAgICAgY29uc3QgcDEgPSBwMi50cmFuc2xhdGUoWzAsIC1zdWdnZXN0aW9uLnRleHQubGVuZ3RoXSlcbiAgICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgICAgdXBpICYmIHVwaS5zaG93VG9vbHRpcCh7XG4gICAgICAgICAgICAgIGVkaXRvcixcbiAgICAgICAgICAgICAgZXZlbnRUeXBlOiBVUEkuVEV2ZW50UmFuZ2VUeXBlLmtleWJvYXJkLFxuICAgICAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IFtwMSwgcDJdLFxuICAgICAgICAgICAgICAgIHBlcnNpc3RlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgICAgICAgdGV4dDogZGVzYyxcbiAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVyOiAnaGludC5oYXNrZWxsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBhbmVsKSB7XG4gICAgICAgIGNvbnN0IHZpZXc6IExhc3RTdWdnZXN0aW9uVmlldyA9IHBhbmVsLmdldEl0ZW0oKVxuICAgICAgICB2aWV3LnNldFRleHQoJycpXG4gICAgICAgIGlmIChwYW5lbCAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICBwYW5lbC5oaWRlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZVVQSSAoc2VydmljZTogVVBJLklVUElSZWdpc3RyYXRpb24pIHtcbiAgdXBpID0gc2VydmljZSh7XG4gICAgbmFtZTogJ2F1dG9jb21wbGV0ZS1oYXNrZWxsJ1xuICB9KVxuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5hZGQodXBpKVxuICByZXR1cm4gdXBpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lQ29tcEJhY2sgKHNlcnZpY2U6IFVQSS5Db21wbGV0aW9uQmFja2VuZC5JQ29tcGxldGlvbkJhY2tlbmQpIHtcbiAgYmFja2VuZCA9IHNlcnZpY2VcbiAgY29uc3QgbXlkaXNwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5hZGQobXlkaXNwKVxuICBteWRpc3AuYWRkKFxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICBpZiAoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgPT09ICdzb3VyY2UuaGFza2VsbCcpIHtcbiAgICAgICAgbXlkaXNwLmFkZChzZXJ2aWNlLnJlZ2lzdGVyQ29tcGxldGlvbkJ1ZmZlcihlZGl0b3IuZ2V0QnVmZmVyKCkpKVxuICAgICAgfVxuICAgIH0pLFxuICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGJhY2tlbmQgPSB1bmRlZmluZWRcbiAgICAgIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLnJlbW92ZShteWRpc3ApXG4gICAgfSlcbiAgKVxuICByZXR1cm4gbXlkaXNwXG59XG4iXX0=