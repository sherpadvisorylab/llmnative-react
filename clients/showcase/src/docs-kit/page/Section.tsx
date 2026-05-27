import React from 'react';

interface SectionProps {
    title: string;
    description?: string;
    preview: React.ReactNode;
    code: string;
    bare?: boolean;
}

export default function Section({ title, description, preview, code, bare = false }: SectionProps) {
    const [copied, setCopied] = React.useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b px-5 py-4">
                <h2 className="font-semibold text-foreground">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
            </div>

            <div className={bare
                ? 'px-5 py-4'
                : 'min-h-[80px] flex flex-wrap items-start gap-3 bg-background p-6'
            }>
                {preview}
            </div>

            <div className="relative overflow-hidden rounded-b-lg border-t bg-muted/50">
                <button
                    onClick={copy}
                    className="absolute right-3 top-3 rounded border bg-background px-2 py-1 text-xs hover:bg-accent transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-foreground">
                    <code>{code.trim()}</code>
                </pre>
            </div>
        </div>
    );
}
