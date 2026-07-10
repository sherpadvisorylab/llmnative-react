import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        fileManager: {
            page: { title: 'File manager', description: 'File listing with GridDB, status badges, and MockDataProvider — no backend needed.' },
            sections: {
                seedData: { title: 'Seed data', description: 'The example uses a static array of files with metadata (name, type, size, status). In production, this data comes from Firebase Storage or Supabase Storage.' },
                providerSetup: { title: 'Provider setup', description: 'Wrap your components in DataProvider context with the mock provider. The same pattern works with Firebase Storage or Supabase Storage.' },
                fileGrid: { title: 'File grid', description: 'Sortable, filterable GridDB with file status badges. Add/edit/delete actions available via modal form.' },
            },
        },
    },
});
