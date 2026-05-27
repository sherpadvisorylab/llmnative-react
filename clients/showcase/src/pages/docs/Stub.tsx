import React from 'react';
import { PageLayout } from '../../docs-kit/page';

interface StubProps {
    title: string;
    description?: string;
}

export default function Stub({ title, description }: StubProps) {
    return (
        <PageLayout
            title={title}
            description={description ?? 'This page is coming soon.'}
        >
            <div className="alert alert-secondary">
                🚧 This section is under construction. Check back soon.
            </div>
        </PageLayout>
    );
}
