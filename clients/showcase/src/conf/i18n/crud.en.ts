import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        crud: {
            page: { title: 'CRUD table', description: 'Full create/read/update/delete with Grid + modal Form. Powered by MockDataProvider — no backend needed.' },
            sections: {
                data: { title: 'Data', description: 'The example uses a static array of products wrapped in a MockDataProvider. In a real app, swap the provider for Firebase or Supabase — no UI changes needed.' },
                providerSetup: { title: 'Provider setup', description: 'Wrap your components in DataProvider context with the mock provider. The same pattern works with Firebase or Supabase.' },
                fullCrud: { title: 'Full CRUD table', description: 'Sortable columns, pagination, inline search, and add/edit/delete via modal form. Try adding a product or editing an existing one.' },
            },
        },
    },
});
