import React from 'react';

type MarkdownContentProps = {
    title?: string;
    description?: string;
    children: React.ReactNode;
};

export default function MarkdownContent({ title, description, children }: MarkdownContentProps) {
    return (
        <div className="space-y-6">
            {(title || description) && (
                <div>
                    {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
                    {description && <p className="mt-1 text-muted-foreground">{description}</p>}
                </div>
            )}
            {children}
        </div>
    );
}
