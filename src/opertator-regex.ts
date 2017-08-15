import XRegExp = require('xregexp')
// From language-haskell
const identCharClass = `[\\p{Ll}_\\p{Lu}\\p{Lt}\\p{Nd}']`
const classNameOne = `[\\p{Lu}\\p{Lt}]${identCharClass}*`
const className = `${classNameOne}(?:\\.${classNameOne})*`
const modulePrefix = `(?:${className}\\.)?`
const operatorChar = '(?:(?![(),;\\[\\]`{}_"\'])[\\p{S}\\p{P}])'
const operator = `${operatorChar}+`
export const identRx = XRegExp(`(${modulePrefix})(${identCharClass}*)$`, 'u')
export const operatorRx = XRegExp(`(${modulePrefix})(${operator})$`, 'u')
