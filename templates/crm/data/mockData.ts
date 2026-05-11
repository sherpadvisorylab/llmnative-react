export const mockData = {
    '/contacts': {
        'c-1': { name: 'Alice Martin',   email: 'alice@acme.com',   company: 'Acme Corp',   status: 'active',   phone: '+1 555 0101' },
        'c-2': { name: 'Bob Chen',       email: 'bob@globex.com',   company: 'Globex',      status: 'active',   phone: '+1 555 0102' },
        'c-3': { name: 'Clara Rossi',    email: 'clara@initech.it', company: 'Initech',     status: 'inactive', phone: '+39 02 0103' },
        'c-4': { name: 'David Park',     email: 'd.park@umbrella.co', company: 'Umbrella',  status: 'active',   phone: '+1 555 0104' },
        'c-5': { name: 'Eva Müller',     email: 'eva@hooli.de',     company: 'Hooli',       status: 'lead',     phone: '+49 89 0105' },
    },
    '/companies': {
        'co-1': { name: 'Acme Corp',  industry: 'Manufacturing', website: 'acme.com',    employees: 320 },
        'co-2': { name: 'Globex',     industry: 'Technology',    website: 'globex.com',  employees: 85  },
        'co-3': { name: 'Initech',    industry: 'IT Services',   website: 'initech.it',  employees: 50  },
        'co-4': { name: 'Umbrella',   industry: 'Pharma',        website: 'umbrella.co', employees: 1200 },
        'co-5': { name: 'Hooli',      industry: 'Technology',    website: 'hooli.de',    employees: 600 },
    },
    '/deals': {
        'd-1': { title: 'Enterprise license',  contact: 'Alice Martin',  value: 12000, stage: 'qualified',  closedAt: '' },
        'd-2': { title: 'SaaS subscription',   contact: 'Bob Chen',      value: 4800,  stage: 'prospect',   closedAt: '' },
        'd-3': { title: 'Consulting package',  contact: 'Clara Rossi',   value: 7500,  stage: 'proposal',   closedAt: '' },
        'd-4': { title: 'Support renewal',     contact: 'David Park',    value: 2400,  stage: 'won',        closedAt: '2025-03-15' },
        'd-5': { title: 'Migration project',   contact: 'Eva Müller',    value: 18000, stage: 'prospect',   closedAt: '' },
        'd-6': { title: 'Hardware bundle',     contact: 'Alice Martin',  value: 5600,  stage: 'lost',       closedAt: '2025-02-28' },
    },
};
