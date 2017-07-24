export const config = {
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
