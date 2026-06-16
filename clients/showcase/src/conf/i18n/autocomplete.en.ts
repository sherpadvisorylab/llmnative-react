import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        autocomplete: {
            page: {
                title: 'Autocomplete',
                description: 'Multi-value tag input with type-ahead suggestions. Stores selected values as an array in the form record.',
            },
            sections: {
                basic: {
                    title: 'Basic autocomplete',
                    description: 'Type to filter suggestions. Selected items appear as removable tags.',
                },
                defaultValues: {
                    title: 'With default values and max limit',
                    description: 'Pre-populate with existing values. max=3 prevents selecting more than 3 items.',
                },
                tagInput: {
                    title: 'Tag input',
                    description: 'Works equally well for free-form tags, not just people. Any options array applies.',
                },
                creatable: {
                    title: 'Creatable - free input with persistence',
                    description: 'Enable creatable to let users type values not in the list. Press Enter to confirm. Use onCreate to persist the new option.',
                },
                dataProviderBacked: {
                    title: 'DataProvider-backed',
                    description: 'Pass optionsSource instead of options to load suggestions from the active DataProvider.',
                },
            },
            labels: {
                aliceJohnson: 'Alice Johnson',
                bobMartinez: 'Bob Martinez',
                carlaRossi: 'Carla Rossi',
                davidKim: 'David Kim',
                evaMuller: 'Eva Muller',
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                graphQl: 'GraphQL',
                users: 'Users',
                searchUsers: 'Search users',
                typeName: 'Type a name...',
                assignees: 'Assignees',
                assigneesMaxThree: 'Assignees (max 3)',
                technologies: 'Technologies',
                addTag: 'Add a tag...',
                selectOrTypeTag: 'Select or type a new tag...',
                persistedTags: 'Persisted tags',
            },
            propsDocs: {
                title: 'Autocomplete props',
                items: {
                    name: { description: 'Field name used as form key.' },
                    label: { description: 'Label above the input.' },
                    title: { description: 'Native title attribute on the text input.' },
                    options: { description: 'Static options for suggestions.' },
                    optionsSource: { description: 'DataProvider path used to fetch suggestions.', help: 'This playground uses a MockDataProvider. Edit the records below to change returned suggestions.' },
                    placeholder: { description: 'Input placeholder text.' },
                    minItems: { description: 'Minimum number of selected items.' },
                    maxItems: { description: 'Maximum number of selected items.' },
                    creatable: { description: 'Allow typing free values not in the options list. Press Enter to confirm.' },
                    onCreate: { description: 'Called when a new free value is confirmed. Use it to persist the new option.' },
                    required: { description: 'Marks the field as required.' },
                    disabled: { description: 'Disables the field.' },
                    readOnlyAfterSet: { description: 'Field becomes read-only once a value has been set.' },
                    defaultValue: { description: 'Initial selected values.' },
                    feedback: { description: 'Validation feedback shown below the field.' },
                    validator: { description: 'Custom validation function. Return an error string to block submission.' },
                    onChange: { description: 'Custom change handler called by the Form context.' },
                    order: { description: 'Sort order for options. Default is label ascending.' },
                    before: { description: 'Content rendered before the autocomplete inside an input group.' },
                    after: { description: 'Content rendered after the autocomplete inside an input group.' },
                    className: { description: 'CSS classes on the input element.' },
                    wrapperClassName: { description: 'CSS classes on the outer wrapper.' },
                },
            },
            playground: {
                title: 'Autocomplete',
            },
        },
    },
});
