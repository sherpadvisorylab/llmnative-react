export const mockData = {
    '/team': {
        'tm-1': { name: 'Alice Martin', role: 'Lead developer',  email: 'alice@example.com' },
        'tm-2': { name: 'Bob Chen',     role: 'Designer',        email: 'bob@example.com' },
        'tm-3': { name: 'Clara Rossi',  role: 'Project manager', email: 'clara@example.com' },
    },
    '/projects': {
        'pr-1': { name: 'Website redesign',   status: 'active',   owner: 'Alice Martin', deadline: '2025-08-31', description: 'Full UX and branding overhaul.' },
        'pr-2': { name: 'Mobile app v2',      status: 'active',   owner: 'Bob Chen',     deadline: '2025-10-15', description: 'React Native rebuild.' },
        'pr-3': { name: 'API migration',      status: 'done',     owner: 'Alice Martin', deadline: '2025-04-01', description: 'Move from REST to GraphQL.' },
        'pr-4': { name: 'Analytics dashboard',status: 'planning', owner: 'Clara Rossi',  deadline: '2025-12-01', description: 'Realtime metrics for ops team.' },
    },
    '/tasks': {
        't-1': { title: 'Define color palette',     project: 'Website redesign',   assignee: 'Bob Chen',     status: 'done',        priority: 'high' },
        't-2': { title: 'Implement auth flow',      project: 'Mobile app v2',      assignee: 'Alice Martin', status: 'in-progress', priority: 'high' },
        't-3': { title: 'Write API docs',           project: 'API migration',      assignee: 'Alice Martin', status: 'done',        priority: 'medium' },
        't-4': { title: 'Design dashboard layout',  project: 'Analytics dashboard',assignee: 'Bob Chen',     status: 'todo',        priority: 'medium' },
        't-5': { title: 'Homepage wireframes',      project: 'Website redesign',   assignee: 'Bob Chen',     status: 'in-progress', priority: 'medium' },
        't-6': { title: 'Data model planning',      project: 'Analytics dashboard',assignee: 'Clara Rossi',  status: 'todo',        priority: 'low' },
    },
};
