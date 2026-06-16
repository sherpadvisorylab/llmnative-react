import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        pagination: {
            page: {
                title: 'Pagination',
                description: 'Page navigation with first, previous, next and last controls plus a configurable page window. Used automatically by Grid.',
            },
            sections: {
                interactive: {
                    title: 'Interactive pagination - 50 records, 8 per page',
                    description: 'Click the page controls to navigate through the dataset.',
                },
                sticky: {
                    title: 'Sticky pagination bar',
                    description: 'When sticky=true the pagination bar floats at the bottom of the viewport with a blur backdrop. This is the default behavior in Grid.',
                },
            },
            labels: {
                recordPrefix: 'Record',
                stickyPreviewLead: 'renders the nav bar with',
                stickyPreviewMiddle: 'and',
                stickyPreviewEnd: 'so it floats above content without fully obscuring it.',
            },
            propsDocs: {
                items: {
                    records: { description: 'Full dataset to paginate.' },
                    children: { description: 'Render function receiving current page records and offset.' },
                    page: { description: 'Initial active page (1-based). Applied once on mount; internal state drives subsequent navigation.' },
                    limit: { description: 'Number of items per page.' },
                    maxPageButtons: { description: 'Maximum number of visible page buttons.' },
                    sticky: { description: 'Fix the pagination bar at the bottom of the viewport.' },
                    align: { description: 'Horizontal alignment of the pagination controls.' },
                    scrollToTopOnChange: { description: 'Scroll to the top of the page when the active page changes.' },
                    scrollBehavior: { description: 'scrollIntoView behavior used when scrollToTopOnChange is enabled.' },
                    appendTo: { description: 'Portal target for the pagination bar.' },
                    before: { description: 'Content rendered inside the pagination wrapper before the page-button nav bar.' },
                    after: { description: 'Content rendered inside the pagination wrapper after the page-button nav bar.' },
                    wrapperClassName: { description: 'CSS classes applied to the outermost wrapper element.' },
                    className: { description: 'CSS classes applied to the nav element containing the page buttons.' },
                },
            },
            playground: {
                title: 'Pagination',
                props: {
                    limit: { description: 'Number of items per page.' },
                    maxPageButtons: { description: 'Maximum number of visible page buttons.' },
                    sticky: { description: 'Fix the pagination bar at the bottom of the viewport.' },
                    align: { description: 'Horizontal alignment of the pagination controls.' },
                    scrollToTopOnChange: { description: 'Scroll to the top of the page when the active page changes.' },
                },
            },
        },
    },
});
