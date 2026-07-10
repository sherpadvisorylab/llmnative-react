import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        nestedForm: {
            page: { title: 'Nested form', description: 'Deep dot notation, arrays and Repeat for dynamic lists — all backed by MockDataProvider.' },
            sections: {
                seedData: { title: 'Seed data', description: 'A contact record with nested address object and a dynamic array of phone numbers.' },
                liveForm: { title: 'Live form', description: 'Edit the existing record. Dot notation (address.street) saves into nested objects. Repeat manages dynamic phone number lists. Try adding or removing a phone number, then check the saved structure.' },
            },
        },
    },
});
