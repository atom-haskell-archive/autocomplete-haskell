"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsTUFBTSxHQUFHO0lBQ3BCLDBCQUEwQixFQUFFO1FBQzFCLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLFNBQVM7UUFDbEIsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztLQUM1QjtJQUNELG9CQUFvQixFQUFFO1FBQ3BCLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUU7OztDQUdoQjtLQUNFO0lBQ0QscUJBQXFCLEVBQUU7UUFDckIsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFBRTs7Q0FFaEI7S0FDRTtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBkZWZhdWx0SGludFBhbmVsVmlzaWJpbGl0eToge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdWaXNpYmxlJyxcbiAgICBlbnVtOiBbJ1Zpc2libGUnLCAnSGlkZGVuJ11cbiAgfSxcbiAgaGlkZUhpbnRQYW5lbElmRW1wdHk6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBkZXNjcmlwdGlvbjogYFxcXG5IaWRlIGhpbnQgcGFuZWwgaWYgaXQncyBlbXB0eS4gQWxzbyBlbmFibGVzICdlc2NhcGUnIGtleVxudG8gaGlkZSBpdC5cXFxuYFxuICB9LFxuICBzaG93SWRlSGFza2VsbFRvb2x0aXA6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246IGBcXFxuU2hvdyBpZGUtaGFza2VsbCB0b29sdGlwIHdpdGggbGFzdCBjb21wbGV0aW9uIHR5cGVcXFxuYFxuICB9XG59XG4iXX0=