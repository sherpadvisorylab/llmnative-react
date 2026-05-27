import React from 'react';
import type { PlaygroundIconProps } from './playground.types';

interface MockDataEditorProps {
    Icon: React.ComponentType<PlaygroundIconProps>;
    seed: Record<string, any>;
    onApply: (seed: Record<string, any>) => void;
}

export default function MockDataEditor({ Icon, seed, onApply }: MockDataEditorProps) {
    const [open, setOpen] = React.useState(false);
    const [json, setJson] = React.useState(() => JSON.stringify(seed, null, 2));
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        setJson(JSON.stringify(seed, null, 2));
    }, [seed]);

    const apply = () => {
        try {
            onApply(JSON.parse(json));
            setError(null);
        } catch {
            setError('Invalid JSON - check syntax and try again.');
        }
    };

    return (
        <div className="border-t">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Icon name="database" size={14} />
                    Mock database
                </span>
                <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} className="text-muted-foreground" />
            </button>
            {open && (
                <div className="space-y-2 px-4 pb-4">
                    <p className="text-xs text-muted-foreground">Edit the seed data used by the component. Changes are applied when the editor loses focus.</p>
                    <textarea
                        className="h-52 w-full resize-y rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={json}
                        onChange={(e) => { setJson(e.target.value); setError(null); }}
                        onBlur={apply}
                        spellCheck={false}
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
            )}
        </div>
    );
}
