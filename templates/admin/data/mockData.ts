export const mockData = {
    '/users': {
        'u-1': { name: 'Alice Martin',  email: 'alice@example.com',  role: 'admin',  status: 'active',   createdAt: 1710000000000 },
        'u-2': { name: 'Bob Chen',      email: 'bob@example.com',    role: 'editor', status: 'active',   createdAt: 1712000000000 },
        'u-3': { name: 'Clara Rossi',   email: 'clara@example.com',  role: 'viewer', status: 'inactive', createdAt: 1714000000000 },
        'u-4': { name: 'David Park',    email: 'david@example.com',  role: 'editor', status: 'active',   createdAt: 1716000000000 },
    },
    '/roles': {
        'r-1': { name: 'admin',  label: 'Administrator', description: 'Full access to all resources' },
        'r-2': { name: 'editor', label: 'Editor',        description: 'Can create and edit content' },
        'r-3': { name: 'viewer', label: 'Viewer',        description: 'Read-only access' },
    },
    '/settings': {
        'app': {
            siteName: '[projectname]',
            supportEmail: 'support@example.com',
            timezone: 'UTC',
            maintenanceMode: false,
        },
    },
};
