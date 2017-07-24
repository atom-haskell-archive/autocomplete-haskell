"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    completionBackendInfo: {
        type: 'boolean',
        default: true,
        description: `Show info message about haskell-completion-backend service \
on activation`
    },
    useBackend: {
        type: 'string',
        default: '',
        description: `Name of backend to use. Leave empty for any. Consult \
backend provider documentation for name.`
    },
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
        default: false,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsTUFBTSxHQUFHO0lBQ3BCLHFCQUFxQixFQUFFO1FBQ3JCLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUU7Y0FDSDtLQUNYO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsRUFBRTtRQUNYLFdBQVcsRUFBRTt5Q0FDd0I7S0FDdEM7SUFDRCx5Q0FBeUMsRUFBRTtRQUN6QyxJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxNQUFNO1FBQ2YsV0FBVyxFQUFFOzREQUMyQztLQUN6RDtJQUNELDBCQUEwQixFQUFFO1FBQzFCLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLFNBQVM7UUFDbEIsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztLQUM1QjtJQUNELG9CQUFvQixFQUFFO1FBQ3BCLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLEtBQUs7UUFDZCxXQUFXLEVBQUU7OztDQUdoQjtLQUNFO0lBQ0QscUJBQXFCLEVBQUU7UUFDckIsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFBRTs7Q0FFaEI7S0FDRTtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBjb21wbGV0aW9uQmFja2VuZEluZm86IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBkZXNjcmlwdGlvbjogYFNob3cgaW5mbyBtZXNzYWdlIGFib3V0IGhhc2tlbGwtY29tcGxldGlvbi1iYWNrZW5kIHNlcnZpY2UgXFxcbm9uIGFjdGl2YXRpb25gXG4gIH0sXG4gIHVzZUJhY2tlbmQ6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnJyxcbiAgICBkZXNjcmlwdGlvbjogYE5hbWUgb2YgYmFja2VuZCB0byB1c2UuIExlYXZlIGVtcHR5IGZvciBhbnkuIENvbnN1bHQgXFxcbmJhY2tlbmQgcHJvdmlkZXIgZG9jdW1lbnRhdGlvbiBmb3IgbmFtZS5gXG4gIH0sXG4gIGluZ29yZU1pbmltdW1Xb3JkTGVuZ3RoRm9ySG9sZUNvbXBsZXRpb25zOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6ICd0cnVlJyxcbiAgICBkZXNjcmlwdGlvbjogYElmIGVuYWJsZWQsIGhvbGUgY29tcGxldGlvbnMgd2lsbCBiZSBzaG93biBvbiBcXCdfXFwnIGtleXN0cm9rZS4gXFxcbk90aGVyd2lzZSwgb25seSB3aGVuIHRoZXJlIGlzIGEgcHJlZml4LCBlLmcuIFxcJ19zb21ldGhpbmdcXCdgXG4gIH0sXG4gIGRlZmF1bHRIaW50UGFuZWxWaXNpYmlsaXR5OiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ1Zpc2libGUnLFxuICAgIGVudW06IFsnVmlzaWJsZScsICdIaWRkZW4nXVxuICB9LFxuICBoaWRlSGludFBhbmVsSWZFbXB0eToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXNjcmlwdGlvbjogYFxcXG5IaWRlIGhpbnQgcGFuZWwgaWYgaXQncyBlbXB0eS4gQWxzbyBlbmFibGVzICdlc2NhcGUnIGtleVxudG8gaGlkZSBpdC5cXFxuYFxuICB9LFxuICBzaG93SWRlSGFza2VsbFRvb2x0aXA6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246IGBcXFxuU2hvdyBpZGUtaGFza2VsbCB0b29sdGlwIHdpdGggbGFzdCBjb21wbGV0aW9uIHR5cGVcXFxuYFxuICB9XG59XG4iXX0=