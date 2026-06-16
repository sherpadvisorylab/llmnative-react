import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tabDynamic: {
            page: {
                title: 'TabDynamic',
                description: 'Dynamic tabbed array editor for repeated form sections.',
            },
            sections: {
                editableTabs: {
                    title: 'Editable tabs',
                    description: 'TabDynamic renders each array item as a removable tab and keeps the active pane connected to the current Form record.',
                },
            },
            labels: {
                section: 'Section',
                dynamicSections: 'Dynamic sections',
                intro: 'Intro',
                title: 'Title',
            },
            propsDocs: {
                items: {
                    name: { description: 'Array field name in the Form record.' },
                    children: { description: 'Fields rendered inside the active tab.' },
                    onChange: { description: 'Custom change handler called by Form context.' },
                    onAdd: { description: 'Called after adding a tab.' },
                    onRemove: { description: 'Called after removing a tab.' },
                    label: { description: 'Tab label prefix or converter template.' },
                    min: { description: 'Minimum number of tabs.' },
                    max: { description: 'Maximum number of tabs.' },
                    activeIndex: { description: 'Initial active tab.' },
                    title: { description: 'Heading above the tabs.' },
                    readOnly: { description: 'Hides add/remove actions.' },
                    tabPosition: { description: 'Tab layout position.' },
                },
            },
            playground: {
                title: 'TabDynamic',
            },
        },
    },
});
