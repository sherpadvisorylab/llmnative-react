import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        listGroup: {
            page: {
                title: 'ListGroup',
                description: 'Bootstrap-compatible list group with active, disabled, loading, click and drag states.',
            },
            sections: {
                statusList: {
                    title: 'Status list',
                    description: 'Use active, disabled and badge states to present workflow stages or grouped navigation items.',
                },
            },
            labels: {
                workflow: 'Workflow',
                backlog: 'Backlog',
                inProgress: 'In progress',
                review: 'Review',
                done: 'Done',
            },
            propsDocs: {
                items: {
                    children: { description: 'List item content.' },
                    label: { description: 'Optional label above the list.' },
                    onClick: { description: 'Enables clickable list items.' },
                    draggable: { description: 'Makes items draggable.' },
                    onDrop: { description: 'Transforms dragged text before it is placed on dataTransfer.' },
                    activeIndices: {
                        description: 'Indexes rendered as active.',
                        shortcuts: {
                            none: { label: 'none', help: 'No active items.' },
                            first: { label: 'first', help: 'First item active.' },
                            multi: { label: 'multi', help: 'Multiple active items.' },
                        },
                    },
                    disabledIndices: {
                        description: 'Indexes rendered as disabled.',
                        shortcuts: {
                            none: { label: 'none', help: 'No disabled items.' },
                            last: { label: 'last', help: 'Disable the last item.' },
                            mixed: { label: 'mixed', help: 'Disable first and last items.' },
                        },
                    },
                    loadingIndices: {
                        description: 'Indexes rendered as loading.',
                        shortcuts: {
                            none: { label: 'none', help: 'No loading state.' },
                            single: { label: 'single', help: 'Second item loading.' },
                            multi: { label: 'multi', help: 'Multiple loading items.' },
                        },
                    },
                    before: { description: 'Content before the list.' },
                    after: { description: 'Content after the list.' },
                    className: { description: 'CSS classes on list-group.' },
                    wrapperClassName: { description: 'CSS classes on wrapper.' },
                    itemClassName: { description: 'CSS classes on each item.' },
                },
            },
            playground: {
                title: 'ListGroup',
            },
        },
    },
});
