"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsTUFBTSxHQUFHO0lBQ3BCLHlDQUF5QyxFQUFFO1FBQ3pDLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLE1BQU07UUFDZixXQUFXLEVBQUU7NERBQzJDO0tBQ3pEO0lBQ0QsMEJBQTBCLEVBQUU7UUFDMUIsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsU0FBUztRQUNsQixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0tBQzVCO0lBQ0Qsb0JBQW9CLEVBQUU7UUFDcEIsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFBRTs7O0NBR2hCO0tBQ0U7SUFDRCxxQkFBcUIsRUFBRTtRQUNyQixJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFOztDQUVoQjtLQUNFO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGluZ29yZU1pbmltdW1Xb3JkTGVuZ3RoRm9ySG9sZUNvbXBsZXRpb25zOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6ICd0cnVlJyxcbiAgICBkZXNjcmlwdGlvbjogYElmIGVuYWJsZWQsIGhvbGUgY29tcGxldGlvbnMgd2lsbCBiZSBzaG93biBvbiBcXCdfXFwnIGtleXN0cm9rZS4gXFxcbk90aGVyd2lzZSwgb25seSB3aGVuIHRoZXJlIGlzIGEgcHJlZml4LCBlLmcuIFxcJ19zb21ldGhpbmdcXCdgXG4gIH0sXG4gIGRlZmF1bHRIaW50UGFuZWxWaXNpYmlsaXR5OiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ1Zpc2libGUnLFxuICAgIGVudW06IFsnVmlzaWJsZScsICdIaWRkZW4nXVxuICB9LFxuICBoaWRlSGludFBhbmVsSWZFbXB0eToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXNjcmlwdGlvbjogYFxcXG5IaWRlIGhpbnQgcGFuZWwgaWYgaXQncyBlbXB0eS4gQWxzbyBlbmFibGVzICdlc2NhcGUnIGtleVxudG8gaGlkZSBpdC5cXFxuYFxuICB9LFxuICBzaG93SWRlSGFza2VsbFRvb2x0aXA6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246IGBcXFxuU2hvdyBpZGUtaGFza2VsbCB0b29sdGlwIHdpdGggbGFzdCBjb21wbGV0aW9uIHR5cGVcXFxuYFxuICB9XG59XG4iXX0=