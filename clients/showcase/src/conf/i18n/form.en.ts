import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        form: {
            page: { title: 'Form widget', description: 'Full CRUD form: loads a record from the DataProvider, validates, saves and optionally deletes. Wrap fields as children — the Form connects everything automatically via React context.' },
            sections: {
                newRecord: { title: 'New record (keyGenerator)', description: 'Pass path (collection) + keyGenerator to create a new record. No DB read is performed. Saving calls set() on path/generatedKey.' },
                editExisting: { title: 'Edit existing record', description: 'Pass path (full record path including the key) without defaultValues. The Form reads the record on mount, pre-fills the fields and saves to the same path.' },
                lifecycleHooks: { title: 'Lifecycle hooks', description: 'onLoad transforms data after reading. onSave transforms before writing. onComplete runs after every action.' },
                lifecycleHooksNote: 'Code example — hooks are not visually distinct from a standard form.',
                nestedObjects: { title: 'Nested objects and arrays', description: 'Dot notation maps nested object keys. Array index notation maps to array elements.' },
            },
        },
    },
});
