import React from 'react';
import PageLayout from '../../components/PageLayout';

const PROVIDERS = [
    {
        name: 'DataProvider',
        interface: 'providers/data/DataProvider.ts',
        implementations: ['FirebaseDataProvider', 'SupabaseDataProvider', 'Custom'],
        required: true,
        desc: 'Handles all CRUD operations and real-time subscriptions. Used by Form and Grid.',
    },
    {
        name: 'StorageProvider',
        interface: 'providers/storage/StorageProvider.ts',
        implementations: ['FirebaseStorageProvider', 'SupabaseStorageProvider'],
        required: false,
        desc: 'File upload and URL resolution. Used by the Upload field.',
    },
    {
        name: 'AuthProvider',
        interface: 'providers/auth/AuthProvider.ts',
        implementations: ['GoogleAuthProvider'],
        required: true,
        desc: 'Authentication flow and user profile. Used by SignInButton and AuthButton.',
    },
    {
        name: 'EmailProvider',
        interface: 'providers/email/EmailProvider.ts',
        implementations: ['GmailEmailProvider'],
        required: false,
        desc: 'Transactional email sending. Optional — app works without it.',
    },
];

export default function ProvidersOverview() {
    return (
        <PageLayout
            title="Provider system"
            description="react-firestrap uses Ports & Adapters. Every external dependency is hidden behind a typed interface — swap implementations without touching your UI code."
        >
            <div className="space-y-4">
                {PROVIDERS.map((p) => (
                    <div key={p.name} className="card p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-foreground">{p.name}</h3>
                                <code className="text-xs text-muted-foreground">{p.interface}</code>
                            </div>
                            <span className={`badge ${p.required ? 'bg-primary' : 'bg-secondary'}`}>
                                {p.required ? 'required' : 'optional'}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
                        <div className="flex gap-2 flex-wrap">
                            {p.implementations.map((impl) => (
                                <span key={impl} className="badge bg-secondary">{impl}</span>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="card p-5 mt-4">
                    <h3 className="font-semibold mb-3">Named registry — multiple providers</h3>
                    <pre className="text-xs bg-muted rounded p-4 overflow-x-auto leading-relaxed">{`<App
    providers={{
        data: {
            firebase: new FirebaseDataProvider(),
            supabase: new SupabaseDataProvider(),
        },
    }}
    defaultProviders={{
        data: import.meta.env.VITE_DATA_PROVIDER ?? 'firebase',
    }}
/>

// Consume in any component
const data     = useDataProvider();           // default provider
const supabase = useDataProvider('supabase'); // named provider`}</pre>
                </div>
            </div>
        </PageLayout>
    );
}
