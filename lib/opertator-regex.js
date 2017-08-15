"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XRegExp = require("xregexp");
const identCharClass = `[\\p{Ll}_\\p{Lu}\\p{Lt}\\p{Nd}']`;
const classNameOne = `[\\p{Lu}\\p{Lt}]${identCharClass}*`;
const className = `${classNameOne}(?:\\.${classNameOne})*`;
const modulePrefix = `(?:${className}\\.)?`;
const operatorChar = '(?:(?![(),;\\[\\]`{}_"\'])[\\p{S}\\p{P}])';
const operator = `${operatorChar}+`;
exports.identRx = XRegExp(`(${modulePrefix})(${identCharClass}*)$`, 'u');
exports.operatorRx = XRegExp(`(${modulePrefix})(${operator})$`, 'u');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcnRhdG9yLXJlZ2V4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL29wZXJ0YXRvci1yZWdleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUVuQyxNQUFNLGNBQWMsR0FBRyxrQ0FBa0MsQ0FBQTtBQUN6RCxNQUFNLFlBQVksR0FBRyxtQkFBbUIsY0FBYyxHQUFHLENBQUE7QUFDekQsTUFBTSxTQUFTLEdBQUcsR0FBRyxZQUFZLFNBQVMsWUFBWSxJQUFJLENBQUE7QUFDMUQsTUFBTSxZQUFZLEdBQUcsTUFBTSxTQUFTLE9BQU8sQ0FBQTtBQUMzQyxNQUFNLFlBQVksR0FBRywyQ0FBMkMsQ0FBQTtBQUNoRSxNQUFNLFFBQVEsR0FBRyxHQUFHLFlBQVksR0FBRyxDQUFBO0FBQ3RCLFFBQUEsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLFlBQVksS0FBSyxjQUFjLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUNoRSxRQUFBLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxZQUFZLEtBQUssUUFBUSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWFJlZ0V4cCA9IHJlcXVpcmUoJ3hyZWdleHAnKVxuLy8gRnJvbSBsYW5ndWFnZS1oYXNrZWxsXG5jb25zdCBpZGVudENoYXJDbGFzcyA9IGBbXFxcXHB7TGx9X1xcXFxwe0x1fVxcXFxwe0x0fVxcXFxwe05kfSddYFxuY29uc3QgY2xhc3NOYW1lT25lID0gYFtcXFxccHtMdX1cXFxccHtMdH1dJHtpZGVudENoYXJDbGFzc30qYFxuY29uc3QgY2xhc3NOYW1lID0gYCR7Y2xhc3NOYW1lT25lfSg/OlxcXFwuJHtjbGFzc05hbWVPbmV9KSpgXG5jb25zdCBtb2R1bGVQcmVmaXggPSBgKD86JHtjbGFzc05hbWV9XFxcXC4pP2BcbmNvbnN0IG9wZXJhdG9yQ2hhciA9ICcoPzooPyFbKCksO1xcXFxbXFxcXF1ge31fXCJcXCddKVtcXFxccHtTfVxcXFxwe1B9XSknXG5jb25zdCBvcGVyYXRvciA9IGAke29wZXJhdG9yQ2hhcn0rYFxuZXhwb3J0IGNvbnN0IGlkZW50UnggPSBYUmVnRXhwKGAoJHttb2R1bGVQcmVmaXh9KSgke2lkZW50Q2hhckNsYXNzfSopJGAsICd1JylcbmV4cG9ydCBjb25zdCBvcGVyYXRvclJ4ID0gWFJlZ0V4cChgKCR7bW9kdWxlUHJlZml4fSkoJHtvcGVyYXRvcn0pJGAsICd1JylcbiJdfQ==