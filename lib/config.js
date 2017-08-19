"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    defaultHintPanelVisibility: {
        type: 'string',
        default: 'Visible',
        enum: ['Visible', 'Hidden'],
    },
    hideHintPanelIfEmpty: {
        type: 'boolean',
        default: true,
        description: `\
Hide hint panel if it's empty. Also enables 'escape' key
to hide it.\
`,
    },
    showIdeHaskellTooltip: {
        type: 'boolean',
        default: false,
        description: `\
Show ide-haskell tooltip with last completion type\
`,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsTUFBTSxHQUFHO0lBQ3BCLDBCQUEwQixFQUFFO1FBQzFCLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLFNBQVM7UUFDbEIsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztLQUM1QjtJQUNELG9CQUFvQixFQUFFO1FBQ3BCLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUU7OztDQUdoQjtLQUNFO0lBQ0QscUJBQXFCLEVBQUU7UUFDckIsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFBRTs7Q0FFaEI7S0FDRTtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBkZWZhdWx0SGludFBhbmVsVmlzaWJpbGl0eToge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdWaXNpYmxlJyxcbiAgICBlbnVtOiBbJ1Zpc2libGUnLCAnSGlkZGVuJ10sXG4gIH0sXG4gIGhpZGVIaW50UGFuZWxJZkVtcHR5OiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgZGVzY3JpcHRpb246IGBcXFxuSGlkZSBoaW50IHBhbmVsIGlmIGl0J3MgZW1wdHkuIEFsc28gZW5hYmxlcyAnZXNjYXBlJyBrZXlcbnRvIGhpZGUgaXQuXFxcbmAsXG4gIH0sXG4gIHNob3dJZGVIYXNrZWxsVG9vbHRpcDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXNjcmlwdGlvbjogYFxcXG5TaG93IGlkZS1oYXNrZWxsIHRvb2x0aXAgd2l0aCBsYXN0IGNvbXBsZXRpb24gdHlwZVxcXG5gLFxuICB9LFxufVxuIl19