import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        checklist: {
            page: {
                title: 'Checklist',
                description: 'Vertical list of checkboxes for multi-select. Selected values are stored as an array in the form record.',
            },
            sections: {
                basic: {
                    title: 'Basic checklist',
                    description: 'Renders a checkbox for each option. Pre-selected values come from the Form defaultValues.',
                },
                permissions: {
                    title: 'Permissions checklist',
                    description: 'Common pattern for role and permission configuration.',
                },
                requiredDisabled: {
                    title: 'Required and disabled',
                },
            },
            labels: {
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                read: 'Read',
                write: 'Write',
                delete: 'Delete',
                admin: 'Admin',
                technologies: 'Technologies',
                selectTechnologies: 'Select technologies',
                permissions: 'Permissions',
                required: 'Required',
                disabled: 'Disabled',
            },
            propsDocs: {
                title: 'Checklist props',
                items: {
                    name: { description: 'Field name used as form key and stores selected values as an array.' },
                    label: { description: 'Group label above the checkboxes.' },
                    title: { description: 'Native title attribute on each checkbox input.' },
                    options: { description: 'Static checkbox options.' },
                    optionsSource: { description: 'DataProvider path used to fetch checkbox options.', help: 'This playground uses a MockDataProvider. Edit the records below to change returned options.' },
                    required: { description: 'Marks the field as required.' },
                    disabled: { description: 'Disables all checkboxes.' },
                    readOnlyAfterSet: { description: 'Field becomes read-only once a value has been set.' },
                    defaultValue: { description: 'Initial selected values.' },
                    feedback: { description: 'Validation feedback shown below the list.' },
                    validator: { description: 'Custom validation function. Return an error string to block submission.' },
                    order: { description: 'Sort order for options. Default is label ascending.' },
                    before: { description: 'Content rendered before the checklist inside an input group.' },
                    after: { description: 'Content rendered after the checklist inside an input group.' },
                    onChange: { description: 'Custom change handler called by the Form context.' },
                    itemClassName: { description: 'CSS classes applied to each checkbox wrapper.' },
                    className: { description: 'CSS classes on the checklist root.' },
                    wrapperClassName: { description: 'CSS classes on the outer wrapper.' },
                },
            },
            playground: {
                title: 'Checklist',
            },
        },
    },
});
