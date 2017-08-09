"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const highlight = require("atom-highlight");
class LastSuggestionView {
    constructor(text = '') {
        this.element = document.createElement('div');
        this.disposables = new atom_1.CompositeDisposable();
        this.disposables.add(atom.config.observe('editor.fontFamily', (val) => {
            this.element.style.fontFamily = val ? val : '';
        }), atom.config.observe('editor.fontSize', (val) => {
            this.element.style.fontSize = val ? `${val}px` : '';
        }));
        this.setText(text);
    }
    destroy() {
        this.element.remove();
    }
    setText(text) {
        this.element.innerHTML = highlight({
            fileContents: text,
            scopeName: 'hint.haskell',
            nbsp: false,
            editorDiv: true,
            editorDivTag: 'autocomplete-haskell-hint'
        });
    }
}
exports.LastSuggestionView = LastSuggestionView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFzdC1zdWdnZXN0aW9uLXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGFzdC1zdWdnZXN0aW9uLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBd0M7QUFDeEMsNENBQTRDO0FBRTVDO0lBR0UsWUFBYSxPQUFlLEVBQUU7UUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSwwQkFBbUIsRUFBRSxDQUFBO1FBQzVDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQVc7WUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBO1FBQ2hELENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBVztZQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ3JELENBQUMsQ0FBQyxDQUNILENBQUE7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BCLENBQUM7SUFFTSxPQUFPO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0lBRU0sT0FBTyxDQUFFLElBQVk7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ2pDLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFNBQVMsRUFBRSxjQUFjO1lBQ3pCLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFLElBQUk7WUFDZixZQUFZLEVBQUUsMkJBQTJCO1NBQzFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQTlCRCxnREE4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgaGlnaGxpZ2h0ID0gcmVxdWlyZSgnYXRvbS1oaWdobGlnaHQnKVxuXG5leHBvcnQgY2xhc3MgTGFzdFN1Z2dlc3Rpb25WaWV3IHtcbiAgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50XG4gIHByaXZhdGUgZGlzcG9zYWJsZXM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgY29uc3RydWN0b3IgKHRleHQ6IHN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZWRpdG9yLmZvbnRGYW1pbHknLCAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRGYW1pbHkgPSB2YWwgPyB2YWwgOiAnJ1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdlZGl0b3IuZm9udFNpemUnLCAodmFsOiBudW1iZXIpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZvbnRTaXplID0gdmFsID8gYCR7dmFsfXB4YCA6ICcnXG4gICAgICB9KVxuICAgIClcbiAgICB0aGlzLnNldFRleHQodGV4dClcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKClcbiAgfVxuXG4gIHB1YmxpYyBzZXRUZXh0ICh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gaGlnaGxpZ2h0KHtcbiAgICAgIGZpbGVDb250ZW50czogdGV4dCxcbiAgICAgIHNjb3BlTmFtZTogJ2hpbnQuaGFza2VsbCcsXG4gICAgICBuYnNwOiBmYWxzZSxcbiAgICAgIGVkaXRvckRpdjogdHJ1ZSxcbiAgICAgIGVkaXRvckRpdlRhZzogJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLWhpbnQnXG4gICAgfSlcbiAgfVxufVxuIl19