"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const highlight = require("atom-highlight");
class LastSuggestionView {
    constructor(text) {
        this.element = document.createElement('div');
        this.disposables = new atom_1.CompositeDisposable();
        this.disposables.add(atom.config.observe('editor.fontFamily', (val) => {
            this.element.style.fontFamily = val ? val : '';
        }), atom.config.observe('editor.fontSize', (val) => {
            this.element.style.fontSize = val ? `${val}px` : '';
        }));
        text && this.setText(text);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFzdC1zdWdnZXN0aW9uLXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGFzdC1zdWdnZXN0aW9uLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBd0M7QUFDeEMsNENBQTRDO0FBRTVDO0lBR0UsWUFBYSxJQUFhO1FBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtRQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxHQUFXO1lBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQTtRQUNoRCxDQUFDLENBQUMsRUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEdBQVc7WUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNyRCxDQUFDLENBQUMsQ0FDSCxDQUFBO1FBQ0QsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVNLE9BQU87UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ3ZCLENBQUM7SUFFTSxPQUFPLENBQUUsSUFBWTtRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDakMsWUFBWSxFQUFFLElBQUk7WUFDbEIsU0FBUyxFQUFFLGNBQWM7WUFDekIsSUFBSSxFQUFFLEtBQUs7WUFDWCxTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSwyQkFBMkI7U0FDMUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBOUJELGdEQThCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBoaWdobGlnaHQgPSByZXF1aXJlKCdhdG9tLWhpZ2hsaWdodCcpXG5cbmV4cG9ydCBjbGFzcyBMYXN0U3VnZ2VzdGlvblZpZXcge1xuICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgcHJpdmF0ZSBkaXNwb3NhYmxlczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBjb25zdHJ1Y3RvciAodGV4dD86IHN0cmluZykge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5mb250RmFtaWx5JywgKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250RmFtaWx5ID0gdmFsID8gdmFsIDogJydcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZWRpdG9yLmZvbnRTaXplJywgKHZhbDogbnVtYmVyKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IHZhbCA/IGAke3ZhbH1weGAgOiAnJ1xuICAgICAgfSlcbiAgICApXG4gICAgdGV4dCAmJiB0aGlzLnNldFRleHQodGV4dClcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKClcbiAgfVxuXG4gIHB1YmxpYyBzZXRUZXh0ICh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gaGlnaGxpZ2h0KHtcbiAgICAgIGZpbGVDb250ZW50czogdGV4dCxcbiAgICAgIHNjb3BlTmFtZTogJ2hpbnQuaGFza2VsbCcsXG4gICAgICBuYnNwOiBmYWxzZSxcbiAgICAgIGVkaXRvckRpdjogdHJ1ZSxcbiAgICAgIGVkaXRvckRpdlRhZzogJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLWhpbnQnXG4gICAgfSlcbiAgfVxufVxuIl19