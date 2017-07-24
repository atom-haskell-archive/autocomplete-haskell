export const config = {
  ingoreMinimumWordLengthForHoleCompletions: {
    type: 'boolean',
    default: 'true',
    description: `If enabled, hole completions will be shown on \'_\' keystroke. \
Otherwise, only when there is a prefix, e.g. \'_something\'`
  },
  defaultHintPanelVisibility: {
    type: 'string',
    default: 'Visible',
    enum: ['Visible', 'Hidden']
  },
  hideHintPanelIfEmpty: {
    type: 'boolean',
    default: true,
    description: `\
Hide hint panel if it's empty. Also enables 'escape' key
to hide it.\
`
  },
  showIdeHaskellTooltip: {
    type: 'boolean',
    default: false,
    description: `\
Show ide-haskell tooltip with last completion type\
`
  }
}
