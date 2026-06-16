import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Dynamic array field helper for adding and removing repeated form sections.',
            },
            sections: {
                repeatedFields: {
                    title: 'Repeated fields',
                    description: 'Repeat clones the same field group for each array item and keeps add/remove actions aligned with the current Form record.',
                },
            },
            labels: {
                items: 'Items',
                name: 'Name',
                firstItem: 'First item',
                tasks: 'Tasks',
                taskName: 'Task name',
                design: 'Design',
                build: 'Build',
            },
            propsDocs: {
                items: {
                    name: { description: 'Array field name in the Form record.' },
                    children: { description: 'Fields cloned for each repeated row.' },
                    onChange: { description: 'Custom change handler called by Form context.' },
                    onAdd: { description: 'Called after adding an item.' },
                    onRemove: { description: 'Called after removing an item.' },
                    className: { description: 'CSS classes on root wrapper.' },
                    layout: { description: 'Repeat layout variant.' },
                    minItems: { description: 'Minimum number of items.' },
                    maxItems: { description: 'Maximum number of items.' },
                    label: { description: 'Section label with add action.' },
                    readOnly: { description: 'Hides add/remove actions.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
