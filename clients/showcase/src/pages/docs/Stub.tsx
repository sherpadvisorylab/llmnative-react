import React from 'react';
import { PageLayout } from '../../docs-kit/page';
import { useShowcaseCommonI18n } from '../../showcase/i18n';

interface StubProps {
    title: string;
    description?: string;
}

export default function Stub({ title, description }: StubProps) {
    const t = useShowcaseCommonI18n();
    return (
        <PageLayout
            title={title}
            description={description ?? t.stub.comingSoon}
        >
            <div className="alert alert-secondary">
                {t.stub.underConstruction}
            </div>
        </PageLayout>
    );
}
