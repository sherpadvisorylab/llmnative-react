import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Dynamic array field that clones a field group for each item and keeps add / remove actions wired to the Form record.',
            },
            sections: {
                repeatedFields: {
                    title: 'Basic usage — horizontal layout',
                    description: 'Default layout. Each item gets a numbered header, its own field group, and a remove button. The add button appears below the list when a label is not set, or inline with the label when it is.',
                },
                inlineLayout: {
                    title: 'Inline layout',
                    description: 'Use layout="inline" to keep each row compact: children fill available space and the remove button sits flush at the end. Ideal for colour palettes, tag lists, or key-value pairs.',
                },
                multipleFields: {
                    title: 'Multiple fields per item',
                    description: 'Place any number of fields inside the repeated block — each item gets its own numbered section with a header and remove action.',
                },
                constraints: {
                    title: 'Min / max constraints',
                    description: 'minItems prevents removing items below a floor (first N items show no remove button). maxItems hides the add button once the ceiling is reached.',
                },
                readOnlyMode: {
                    title: 'Read-only mode',
                    description: 'Set readOnly to hide add and remove actions, turning the repeated list into a display-only view.',
                },
                functionChildren: {
                    title: 'Children as render function',
                    description: 'Pass a function as children to receive the current index and record — useful for dynamic labels, conditional fields, or index-aware rendering.',
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
                test: 'Test',
                addColor: 'Add color',
                colors: 'Colors',
                colorName: 'Token name',
                primary: 'primary',
                secondary: 'secondary',
                accent: 'accent',
                socialLinks: 'Social links',
                platform: 'Platform',
                url: 'URL',
                twitter: 'Twitter',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                languages: 'Languages',
                language: 'Language',
                english: 'English',
                italian: 'Italian',
                german: 'German',
                skills: 'Skills',
                skill: 'Skill',
                javascript: 'JavaScript',
                typescript: 'TypeScript',
                react: 'React',
                pipelineSteps: 'Pipeline steps',
                stepName: 'Step name',
                command: 'Command',
            },
            propsDocs: {
                title: 'Props',
                items: {
                    name: { description: 'Array field name in the Form record.' },
                    children: { description: 'Fields cloned for each repeated row. Pass a function to receive (record, records, index).' },
                    onChange: { description: 'Custom change handler called by Form context.' },
                    onAdd: { description: 'Called after adding an item.' },
                    onRemove: { description: 'Called after removing an item.' },
                    className: { description: 'CSS classes on root wrapper.' },
                    layout: { description: 'horizontal — numbered card per item; inline — compact single-row per item.' },
                    minItems: { description: 'Minimum number of items — remove button hidden for first N items.' },
                    maxItems: { description: 'Maximum number of items — add button hidden once limit is reached.' },
                    label: { description: 'Section label shown above the list; add button is placed inline with it.' },
                    readOnly: { description: 'Hides add and remove actions.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
