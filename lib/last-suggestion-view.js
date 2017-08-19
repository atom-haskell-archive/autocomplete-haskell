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
            editorDivTag: 'autocomplete-haskell-hint',
        });
    }
}
exports.LastSuggestionView = LastSuggestionView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFzdC1zdWdnZXN0aW9uLXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGFzdC1zdWdnZXN0aW9uLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBMEM7QUFDMUMsNENBQTRDO0FBRTVDO0lBR0UsWUFBWSxPQUFlLEVBQUU7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSwwQkFBbUIsRUFBRSxDQUFBO1FBQzVDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEdBQVc7WUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFBO1FBQ2hELENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBVztZQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ3JELENBQUMsQ0FBQyxDQUNILENBQUE7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BCLENBQUM7SUFFTSxPQUFPO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0lBRU0sT0FBTyxDQUFDLElBQVk7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ2pDLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFNBQVMsRUFBRSxjQUFjO1lBQ3pCLElBQUksRUFBRSxLQUFLO1lBQ1gsU0FBUyxFQUFFLElBQUk7WUFDZixZQUFZLEVBQUUsMkJBQTJCO1NBQzFDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQTlCRCxnREE4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBoaWdobGlnaHQgPSByZXF1aXJlKCdhdG9tLWhpZ2hsaWdodCcpXG5cbmV4cG9ydCBjbGFzcyBMYXN0U3VnZ2VzdGlvblZpZXcge1xuICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgcHJpdmF0ZSBkaXNwb3NhYmxlczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcgPSAnJykge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2VkaXRvci5mb250RmFtaWx5JywgKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250RmFtaWx5ID0gdmFsID8gdmFsIDogJydcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZWRpdG9yLmZvbnRTaXplJywgKHZhbDogbnVtYmVyKSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IHZhbCA/IGAke3ZhbH1weGAgOiAnJ1xuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc2V0VGV4dCh0ZXh0KVxuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpXG4gIH1cblxuICBwdWJsaWMgc2V0VGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gaGlnaGxpZ2h0KHtcbiAgICAgIGZpbGVDb250ZW50czogdGV4dCxcbiAgICAgIHNjb3BlTmFtZTogJ2hpbnQuaGFza2VsbCcsXG4gICAgICBuYnNwOiBmYWxzZSxcbiAgICAgIGVkaXRvckRpdjogdHJ1ZSxcbiAgICAgIGVkaXRvckRpdlRhZzogJ2F1dG9jb21wbGV0ZS1oYXNrZWxsLWhpbnQnLFxuICAgIH0pXG4gIH1cbn1cbiJdfQ==