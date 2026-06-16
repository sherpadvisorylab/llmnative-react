import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { useShowcaseExamplesOverviewI18n } from '../../showcase/i18n';

export default function ExamplesOverview() {
    const t = useShowcaseExamplesOverviewI18n();

    const examples = React.useMemo(() => ([
        {
            title: t.items.crudTable.title,
            path: '/examples/crud',
            desc: t.items.crudTable.description,
            tags: ['Grid', 'Form', 'Modal', 'Firebase'],
        },
        {
            title: t.items.dashboard.title,
            path: '/examples/dashboard',
            desc: t.items.dashboard.description,
            tags: ['Card', 'Grid', 'Badge'],
        },
        {
            title: t.items.nestedForm.title,
            path: '/examples/nested-form',
            desc: t.items.nestedForm.description,
            tags: ['Form', 'Input', 'Repeat'],
        },
        {
            title: t.items.fileManager.title,
            path: '/examples/file-manager',
            desc: t.items.fileManager.description,
            tags: ['Upload', 'Grid', 'StorageProvider'],
        },
        {
            title: t.items.googleSignIn.title,
            path: '/examples/google-auth',
            desc: t.items.googleSignIn.description,
            tags: ['AuthProvider', 'AuthButton'],
        },
    ]), [t]);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <div className="space-y-3">
                {examples.map((example) => (
                    <Link
                        key={example.path}
                        to={example.path}
                        className="block rounded-lg border bg-card p-5 transition-colors group hover:border-primary/50 hover:bg-primary/5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {example.title}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">{example.desc}</p>
                            </div>
                            <span className="shrink-0 text-muted-foreground">{t.labels.arrow}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {example.tags.map((tag) => (
                                <Badge key={tag}>{tag}</Badge>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </PageLayout>
    );
}
