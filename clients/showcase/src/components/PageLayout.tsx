import React from 'react';

interface PageLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
    showHeader?: boolean;
}

export default function PageLayout({ title, description, children, showHeader = true }: PageLayoutProps) {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            {showHeader && (
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    <p className="mt-1 text-muted-foreground">{description}</p>
                </div>
            )}
            <div className="space-y-8">{children}</div>
        </div>
    );
}
