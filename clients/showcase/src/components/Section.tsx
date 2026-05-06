import React from 'react';

interface SectionProps {
    title: string;
    description?: string;
    preview: React.ReactNode;
    code: string;
}

export default function Section({ title, description, preview, code }: SectionProps) {
    const [copied, setCopied] = React.useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border rounded-lg overflow-hidden bg-card">
            <div className="px-5 py-4 border-b">
                <h2 className="font-semibold text-foreground">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
            </div>

            {/* Live preview */}
            <div className="p-6 bg-background flex flex-wrap gap-3 items-start min-h-[80px]">
                {preview}
            </div>

            {/* Code block */}
            <div className="relative border-t bg-muted/50">
                <button
                    onClick={copy}
                    className="absolute right-3 top-3 text-xs px-2 py-1 rounded border bg-background hover:bg-accent transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <pre className="p-5 text-xs text-foreground overflow-x-auto leading-relaxed">
                    <code>{code.trim()}</code>
                </pre>
            </div>
        </div>
    );
}
