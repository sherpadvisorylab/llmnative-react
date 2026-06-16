import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        select: {
            page: {
                title: 'Select',
                description: 'Native dropdown select. Options can be a static array or loaded from a DataProvider.',
            },
            sections: {
                basicDropdown: {
                    title: 'Basic dropdown',
                    description: 'Static options array, the simplest usage.',
                },
                requiredSelect: {
                    title: 'Required select',
                    description: 'Use required when the field must be chosen before form submission.',
                },
                noPlaceholderOption: {
                    title: 'No placeholder option',
                    description: 'Set placeholderOption to null to hide the empty row. When no value is set, Select automatically chooses the first available option.',
                },
                readOnlyAfterSet: {
                    title: 'Read-only after set',
                    description: 'Use readOnlyAfterSet when the choice should lock after the first selection. If the field already has a value, the select renders disabled.',
                },
                dataProviderBacked: {
                    title: 'DataProvider-backed',
                    description: 'Pass optionsSource instead of options to fetch live options from the registered DataProvider.',
                },
            },
            labels: {
                admin: 'Admin',
                editor: 'Editor',
                viewer: 'Viewer',
                italy: 'Italy',
                germany: 'Germany',
                france: 'France',
                spain: 'Spain',
                unitedKingdom: 'United Kingdom',
                unitedStates: 'United States',
                category: 'Category',
                chooseCategory: 'Choose a category',
                role: 'Role',
                country: 'Country',
                selectPlaceholder: 'Select...',
                chooseRolePlaceholder: 'Choose a role',
                sales: 'Sales',
                operations: 'Operations',
                support: 'Support',
                draft: 'draft',
                review: 'review',
                published: 'published',
            },
            propsDocs: {
                title: 'Select props',
                items: {
                    name: { description: 'Field name used as form key.' },
                    label: { description: 'Label displayed above the select.' },
                    title: { description: 'Native title attribute on the select element.' },
                    options: { description: 'Static options array.', help: 'Supports arrays of options, strings or numbers.' },
                    optionsSource: { description: 'DataProvider path used to fetch options.', help: 'The playground uses a MockDataProvider. Edit the records below to change returned options.' },
                    placeholderOption: { description: 'Placeholder option shown when nothing is selected. Set null to hide it.' },
                    required: { description: 'Marks the field as required.' },
                    disabled: { description: 'Disables the select.' },
                    readOnlyAfterSet: { description: 'Field becomes read-only once a value has been set.' },
                    defaultValue: { description: 'Initial selected value.' },
                    feedback: { description: 'Validation feedback shown below the field.' },
                    validator: { description: 'Custom validation function. Return an error string to block submission.' },
                    order: { description: 'Sort order for options. Default is label ascending.' },
                    before: { description: 'Content rendered before the select inside an input group.' },
                    after: { description: 'Content rendered after the select inside an input group.' },
                    onChange: { description: 'Custom change handler called by the Form context.' },
                    className: { description: 'CSS classes on the select element.' },
                    wrapperClassName: { description: 'CSS classes on the outer wrapper.' },
                },
            },
            playground: {
                title: 'Select',
            },
        },
    },
});
