import React from 'react';
import { Head } from '@llmnative/react';
import { PageLayout as DocsKitPageLayout } from '../../docs-kit/page';

interface ShowcasePageLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
    showHeader?: boolean;
}

export default function ShowcasePageLayout({
    title,
    description,
    children,
    showHeader = true,
}: ShowcasePageLayoutProps) {
    return (
        <>
            <Head title={title} description={description} />
            <DocsKitPageLayout title={title} description={description} showHeader={showHeader}>
                {children}
            </DocsKitPageLayout>
        </>
    );
}
