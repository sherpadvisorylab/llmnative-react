import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@llmnative/react';
import PageLayout from '../../showcase/page';

const EXAMPLES = [
    {
        title: 'CRUD table',
        path: '/examples/crud',
        desc: 'Full create/read/update/delete flow with Grid + modal Form. Real-time updates via Firebase.',
        tags: ['Grid', 'Form', 'Modal', 'Firebase'],
    },
    {
        title: 'Dashboard',
        path: '/examples/dashboard',
        desc: 'Metric cards, charts and a recent-activity table — all from a single DataProvider.',
        tags: ['Card', 'Grid', 'Badge'],
    },
    {
        title: 'Nested form',
        path: '/examples/nested-form',
        desc: 'dot notation for deep objects, array index notation, and Repeat for dynamic lists.',
        tags: ['Form', 'Input', 'Repeat'],
    },
    {
        title: 'File manager',
        path: '/examples/file-manager',
        desc: 'Upload images and documents to Firebase Storage, browse with a gallery Grid.',
        tags: ['Upload', 'Grid', 'StorageProvider'],
    },
    {
        title: 'Google sign-in',
        path: '/examples/google-auth',
        desc: 'OAuth2 sign-in with Google, protected routes and user profile display.',
        tags: ['AuthProvider', 'AuthButton'],
    },
];

export default function ExamplesOverview() {
    return (
        <PageLayout
            title="Examples"
            description="Real-world patterns showing how to compose components, widgets and providers together."
        >
            <div className="space-y-3">
                {EXAMPLES.map((ex) => (
                    <Link
                        key={ex.path}
                        to={ex.path}
                        className="block p-5 rounded-lg border bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {ex.title}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">{ex.desc}</p>
                            </div>
                            <span className="text-muted-foreground shrink-0">â†’</span>
                        </div>
                        <div className="flex gap-1.5 mt-3 flex-wrap">
                            {ex.tags.map((tag) => (
                                <Badge key={tag}>{tag}</Badge>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </PageLayout>
    );
}
