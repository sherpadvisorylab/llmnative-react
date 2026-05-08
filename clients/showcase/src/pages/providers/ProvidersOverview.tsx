import React from 'react';
import { useDataProvider } from 'react-firestrap';
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

function ProviderComparison() {
    const data = useDataProvider();
    const [count, setCount] = React.useState<number | null>(null);

    React.useEffect(() => {
        data.read('/showcase/users').then((records) => {
            setCount(Object.keys(records ?? {}).length);
        });
    }, [data]);

    const rows = [
        {
            name: 'MockDataProvider',
            status: 'live in showcase',
            backend: 'In-memory',
            realtime: 'Yes',
            credentials: 'No',
            note: `${count ?? 0} seeded users loaded from /showcase/users`,
        },
        {
            name: 'FirebaseDataProvider',
            status: 'built-in adapter',
            backend: 'Firebase Realtime Database',
            realtime: 'Yes',
            credentials: 'Firebase config',
            note: 'Use VITE_FIREBASE_* values in a real app.',
        },
        {
            name: 'SupabaseDataProvider',
            status: 'partial adapter',
            backend: 'Supabase REST',
            realtime: 'Polling fallback',
            credentials: 'Supabase URL + anon key',
            note: 'Needs integration tests before being treated as production-ready.',
        },
    ];

    return (
        <div className="card p-5">
            <div className="mb-4">
                <h3 className="font-semibold text-foreground">Provider comparison</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    The showcase uses MockDataProvider so every demo works offline; production apps can swap the adapter at App level.
                </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
                {rows.map((row) => (
                    <div key={row.name} className="rounded-md border bg-background p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <h4 className="text-sm font-semibold">{row.name}</h4>
                            <span className="badge bg-secondary text-[11px]">{row.status}</span>
                        </div>
                        <dl className="space-y-2 text-xs">
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">Backend</dt>
                                <dd className="text-right font-medium">{row.backend}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">Realtime</dt>
                                <dd className="text-right font-medium">{row.realtime}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted-foreground">Credentials</dt>
                                <dd className="text-right font-medium">{row.credentials}</dd>
                            </div>
                        </dl>
                        <p className="mt-3 text-xs text-muted-foreground">{row.note}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

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
        firebase: { config: firebaseConfig },
        supabase: { config: supabaseConfig },
        services: {
            data: import.meta.env.VITE_PROVIDER ?? 'firebase',
            storage: 'supabase',
        },
    }}
/>

// Consume in any component
const data     = useDataProvider();           // selected provider
const supabase = useDataProvider('supabase'); // named provider`}</pre>
                </div>

                <ProviderComparison />
            </div>
        </PageLayout>
    );
}
