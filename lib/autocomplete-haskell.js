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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWhhc2tlbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0b2NvbXBsZXRlLWhhc2tlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBa0U7QUFDbEUsNkRBQStFO0FBQy9FLGlFQUEyRDtBQUUzRCxJQUFJLE9BQTZELENBQUE7QUFDakUsSUFBSSxXQUE0QyxDQUFBO0FBQ2hELElBQUksS0FBa0MsQ0FBQTtBQUN0QyxJQUFJLEdBQWlDLENBQUE7QUFDckMsSUFBSSxrQkFBc0MsQ0FBQTtBQWExQyxtQ0FBaUM7QUFBeEIsMEJBQUEsTUFBTSxDQUFBO0FBRWYsa0JBQXlCLEtBQWE7SUFDcEMsV0FBVyxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtJQUV2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckMsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUE7SUFDekcsQ0FBQztJQUVELGtCQUFrQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQTtJQUU3QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2QixXQUFXLEVBQUUsQ0FBQTtJQUNmLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxFQUFFLENBQUMsR0FBRztRQUNuRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxHQUFHLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUMxRCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVILFdB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QyxDQUFBO0lBQzNDLENBQUMsQ0FBQyxDQUNILENBQUE7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWhCRCwwQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJRXZlbnREZXNjLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IFN1Z2dlc3Rpb25CdWlsZGVyLCBJT3B0aW9ucywgSVN1Z2dlc3Rpb24gfSBmcm9tICcuL3N1Z2dlc3Rpb24tYnVpbGRlcidcbmltcG9ydCB7IExhc3RTdWdnZXN0aW9uVmlldyB9IGZyb20gJy4vbGFzdC1zdWdnZXN0aW9uLXZpZXcnXG5cbmxldCBiYWNrZW5kOiBVUEkuQ29tcGxldGlvbkJhY2tlbmQuSUNvbXBsZXRpb25CYWNrZW5kIHwgdW5kZWZpbmVkXG5sZXQgZGlzcG9zYWJsZXM6IENvbXBvc2l0ZURpc3Bvc2FibGUgfCB1bmRlZmluZWRcbmxldCBwYW5lbDogQXRvbVR5cGVzLlBhbmVsIHwgdW5kZWZpbmVkXG5sZXQgdXBpOiBVUEkuSVVQSUluc3RhbmNlIHwgdW5kZWZpbmVkXG5sZXQgbGFzdENvbXBsZXRpb25EZXNjOiBzdHJpbmcgfCB1bmRlZmluZWRcblxuaW50ZXJmYWNlIElTdGF0ZSB7XG4gIHBhbmVsVmlzaWJsZT86IGJvb2xlYW5cbiAgbGFzdENvbXBsZXRpb25EZXNjOiBzdHJpbmcgfCB1bmRlZmluZWRcbn1cblxuaW50ZXJmYWNlIElBQ1BEaWRJbnNlcnRFdmVudFBhcmFtcyB7XG4gIGVkaXRvcjogQXRvbVR5cGVzLlRleHRFZGl0b3JcbiAgdHJpZ2dlclBvc2l0aW9uOiBBdG9tVHlwZXMuUG9pbnRcbiAgc3VnZ2VzdGlvbjogSVN1Z2dlc3Rpb25cbn1cblxuZXhwb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShzdGF0ZTogSVN0YXRlKSB7XG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGlmIChzdGF0ZS5wYW5lbFZpc2libGUgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXRlLnBhbmVsVmlzaWJsZSA9IChhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmRlZmF1bHRIaW50UGFuZWxWaXNpYmlsaXR5JykgPT09ICdWaXNpYmxlJylcbiAgfVxuXG4gIGxhc3RDb21wbGV0aW9uRGVzYyA9IHN0YXRlLmxhc3RDb21wbGV0aW9uRGVzY1xuXG4gIGlmIChzdGF0ZS5wYW5lbFZpc2libGUpIHtcbiAgICBjcmVhdGVQYW5lbCgpXG4gIH1cblxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuaGlkZUhpbnRQYW5lbElmRW1wdHknLCAodmFsKSA9PiB7XG4gICAgaWYgKHBhbmVsKSB7XG4gICAgICAhdmFsIHx8IGxhc3RDb21wbGV0aW9uRGVzYyA/IHBhbmVsLnNob3coKSA6IHBhbmVsLmhpZGUoKVxuICAgIH1cbiAgfSkpXG5cbiAgZGlzcG9zYWJsZXMuYWRkKFxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcn49XCJoYXNrZWxsXCJdJywge1xuICAgICAgJ2F1dG9jb21wbGV0ZS1oYXNrZWxsOmNvbmNlYWwtaGludC1wYW5lbCc6ICh7IGN1cnJlbnRUYXJnZXQsIGFib3J0S2V5QmluZGluZyB9OiBJRXZlbnREZXNjKSA9PiB7XG4gICAgICAgIGlmIChwYW5lbCAmJiBwYW5lbC5pc1Zpc2libGUoKSAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLmhpZGVIaW50UGFuZWxJZkVtcHR5JykpIHtcbiAgICAgICAgICBwYW5lbC5oaWRlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGFib3J0S2V5QmluZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgKSxcbiAgKVxuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgJ2F1dG9jb21wbGV0ZS1oYXNrZWxsOnRvZ2dsZS1jb21wbGV0aW9uLWhpbnQnOiAoKSA9PiB7XG4gICAgICBpZiAocGFuZWwpIHtcbiAgICAgICAgZGVzdHJveVBhbmVsKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZVBhbmVsKClcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuKSxcbiAgKVxuXG4gIGRpc3Bvc2FibGVzLmFkZChhdG9tLm1lbnUuYWRkKFt7XG4gICAgbGFiZWw6ICdIYXNrZWxsIElERScsXG4gICAgc3VibWVudTogW3tcbiAgICAgIGxhYmVsOiAnVG9nZ2xlIENvbXBsZXRpb24gSGludCBQYW5lbCcsXG4gICAgICBjb21tYW5kOiAnYXV0b2NvbXBsZXRlLWhhc2tlbGw6dG9nZ2xlLWNvbXBsZXRpb24taGludCcsXG4gICAgfV0sXG4gIH1dKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZSgpOiBJU3RhdGUge1xuICByZXR1cm4ge1xuICAgIHBhbmVsVmlzaWJsZTogISFwYW5lbCxcbiAgICBsYXN0Q29tcGxldGlvbkRlc2MsXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICBkaXNwb3NhYmxlcyA9IHVuZGVmaW5lZFxuICB1cGkgPSB1bmRlZmluZWRcbiAgZGVzdHJveVBhbmVsKClcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGFuZWwoKSB7XG4gIHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe1xuICAgIGl0ZW06IG5ldyBMYXN0U3VnZ2VzdGlvblZpZXcobGFzdENvbXBsZXRpb25EZXNjKSxcbiAgICB2aXNpYmxlOiB0cnVlLFxuICAgIHByaW9yaXR5OiAyMDAsXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lQYW5lbCgpIHtcbiAgcGFuZWwgJiYgcGFuZWwuZGVzdHJveSgpXG4gIHBhbmVsID0gdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvY29tcGxldGVQcm92aWRlcl8yXzBfMCgpIHtcbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RvcjogJy5zb3VyY2UuaGFza2VsbCcsXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAnLnNvdXJjZS5oYXNrZWxsIC5jb21tZW50JyxcbiAgICBpbmNsdXNpb25Qcmlvcml0eTogMCxcbiAgICBnZXRTdWdnZXN0aW9uczogKG9wdGlvbnM6IElPcHRpb25zKSA9PiB7XG4gICAgICBpZiAoIWJhY2tlbmQpIHsgcmV0dXJuIFtdIH1cbiAgICAgIHJldHVybiAobmV3IFN1Z2dlc3Rpb25CdWlsZGVyKG9wdGlvbnMsIGJhY2tlbmQpKS5nZXRTdWdnZXN0aW9ucygpXG4gICAgfSxcbiAgICBvbkRpZEluc2VydFN1Z2dlc3Rpb246ICh7IGVkaXRvciwgdHJpZ2dlclBvc2l0aW9uLCBzdWdnZXN0aW9uIH06IElBQ1BEaWRJbnNlcnRFdmVudFBhcmFtcykgPT4ge1xuICAgICAgaWYgKHN1Z2dlc3Rpb24gJiYgc3VnZ2VzdGlvbi5kZXNjcmlwdGlvbikge1xuICAgICAgICBjb25zdCBkZXNjID0gbGFzdENvbXBsZXRpb25EZXNjID0gc3VnZ2VzdGlvbi5kZXNjcmlwdGlvblxuICAgICAgICBpZiAocGFuZWwpIHtcbiAgICAgICAgICBjb25zdCB2aWV3OiBMYXN0U3VnZ2VzdGlvblZpZXcgPSBwYW5lbC5nZXRJdGVtKClcbiAgICAgICAgICB2aWV3LnNldFRleHQoZGVzYylcbiAgICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtaGFza2VsbC5oaWRlSGludFBhbmVsSWZFbXB0eScpKSB7XG4gICAgICAgICAgICBwYW5lbC5zaG93KClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwaSAmJiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLnNob3dJZGVIYXNrZWxsVG9vbHRpcCcpKSB7XG4gICAgICAgICAgY29uc3QgcDIgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgICBjb25zdCBwMSA9IHAyLnRyYW5zbGF0ZShbMCwgLXN1Z2dlc3Rpb24udGV4dC5sZW5ndGhdKVxuICAgICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICAgICAgICB1cGkgJiYgdXBpLnNob3dUb29sdGlwKHtcbiAgICAgICAgICAgICAgZWRpdG9yLFxuICAgICAgICAgICAgICBldmVudFR5cGU6IFVQSS5URXZlbnRSYW5nZVR5cGUua2V5Ym9hcmQsXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgICAgICAgICByYW5nZTogW3AxLCBwMl0sXG4gICAgICAgICAgICAgICAgcGVyc2lzdGVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICAgICAgICB0ZXh0OiBkZXNjLFxuICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZXI6ICdoaW50Lmhhc2tlbGwnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocGFuZWwpIHtcbiAgICAgICAgY29uc3QgdmlldzogTGFzdFN1Z2dlc3Rpb25WaWV3ID0gcGFuZWwuZ2V0SXRlbSgpXG4gICAgICAgIHZpZXcuc2V0VGV4dCgnJylcbiAgICAgICAgaWYgKHBhbmVsICYmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLWhhc2tlbGwuaGlkZUhpbnRQYW5lbElmRW1wdHknKSkge1xuICAgICAgICAgIHBhbmVsLmhpZGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZVVQSShzZXJ2aWNlOiBVUEkuSVVQSVJlZ2lzdHJhdGlvbikge1xuICB1cGkgPSBzZXJ2aWNlKHtcbiAgICBuYW1lOiAnYXV0b2NvbXBsZXRlLWhhc2tlbGwnLFxuICB9KVxuICBkaXNwb3NhYmxlcyAmJiBkaXNwb3NhYmxlcy5hZGQodXBpKVxuICByZXR1cm4gdXBpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lQ29tcEJhY2soc2VydmljZTogVVBJLkNvbXBsZXRpb25CYWNrZW5kLklDb21wbGV0aW9uQmFja2VuZCkge1xuICBiYWNrZW5kID0gc2VydmljZVxuICBjb25zdCBteWRpc3AgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmFkZChteWRpc3ApXG4gIG15ZGlzcC5hZGQoXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5oYXNrZWxsJykge1xuICAgICAgICBteWRpc3AuYWRkKHNlcnZpY2UucmVnaXN0ZXJDb21wbGV0aW9uQnVmZmVyKGVkaXRvci5nZXRCdWZmZXIoKSkpXG4gICAgICB9XG4gICAgfSksXG4gICAgbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgYmFja2VuZCA9IHVuZGVmaW5lZFxuICAgICAgZGlzcG9zYWJsZXMgJiYgZGlzcG9zYWJsZXMucmVtb3ZlKG15ZGlzcClcbiAgICB9KSxcbiAgKVxuICByZXR1cm4gbXlkaXNwXG59XG4iXX0=