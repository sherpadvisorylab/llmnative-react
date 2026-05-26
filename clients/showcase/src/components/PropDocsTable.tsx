import React from 'react';
import type { PropDocsInput } from '../types/propDocs';

interface PropDocsTableProps {
    props: readonly PropDocsInput[];
    title?: string;
}

export default function PropDocsTable({
    props,
    title = 'Props',
}: PropDocsTableProps) {
    if (props.length === 0) return null;
    const [openProp, setOpenProp] = React.useState<string | null>(null);
    const inferShapeFromType = React.useCallback((type?: string) => {
        if (!type) return undefined;
        const trimmed = type.trim();
        if (!trimmed) return undefined;

        const looksStructured = (
            trimmed.includes('{')
            || trimmed.includes('=>')
            || trimmed.includes('[]')
            || trimmed.includes('Record<')
            || trimmed.includes('Array<')
            || (trimmed.includes('|') && trimmed.length > 28)
        );

        return looksStructured ? trimmed : undefined;
    }, []);
    const normalizedProps = React.useMemo(() => (
        props.map((prop) => {
            const normalizedType = prop.type?.trim();
            const candidateShape = prop.shape ?? prop.typeDetails ?? inferShapeFromType(prop.type);
            const normalizedShape = candidateShape?.trim();

            return {
                ...prop,
                description: prop.description ?? '',
                shape: normalizedShape && normalizedShape !== normalizedType ? normalizedShape : undefined,
                category: prop.category ?? prop.group,
            };
        })
    ), [inferShapeFromType, props]);

    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <div className="border-b px-5 py-4">
                <h2 className="font-semibold text-foreground">{title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Complete list of available props and their accepted values.
                </p>
            </div>
            <table className="w-full table-fixed text-sm">
                <colgroup>
                    <col className="w-[14%]" />
                    <col className="w-[32%]" />
                    <col className="w-[12%]" />
                    <col className="w-[10%]" />
                    <col className="w-[32%]" />
                </colgroup>
                <thead>
                    <tr className="border-b bg-muted/40">
                        <th className="px-5 py-3 text-left font-semibold text-foreground">Prop</th>
                        <th className="px-5 py-3 text-left font-semibold text-foreground">Type</th>
                        <th className="px-5 py-3 text-left font-semibold text-foreground">Default</th>
                        <th className="px-5 py-3 text-left font-semibold text-foreground">Required</th>
                        <th className="px-5 py-3 text-left font-semibold text-foreground">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {normalizedProps.map((prop, i) => {
                        const expandable = Boolean(prop.shape || prop.example);
                        const isOpen = openProp === prop.name;
                        const rowTone = i % 2 === 0 ? 'bg-background' : 'bg-muted/20';
                        const showGroupHeader = prop.category && (i === 0 || prop.category !== normalizedProps[i - 1].category);

                        return (
                            <React.Fragment key={prop.name}>
                                {showGroupHeader && (
                                    <tr>
                                        <td colSpan={5} className="border-b border-t bg-muted/50 px-5 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                                            {prop.category}
                                        </td>
                                    </tr>
                                )}
                                <tr
                                    className={`border-b align-top ${rowTone} ${expandable ? 'cursor-pointer hover:bg-muted/30' : ''}`}
                                    onClick={expandable ? () => setOpenProp(isOpen ? null : prop.name) : undefined}
                                >
                                    <td className="align-top break-words px-5 py-3 font-mono font-medium text-primary">
                                        <div className="flex items-start gap-2">
                                            {expandable ? (
                                                <span
                                                    className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`}
                                                    aria-hidden="true"
                                                >
                                                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
                                                        <path d="M5.5 3.5 10.5 8l-5 4.5z" />
                                                    </svg>
                                                </span>
                                            ) : null}
                                            <span>{prop.name}</span>
                                        </div>
                                    </td>
                                    <td className="align-top break-words whitespace-pre-wrap px-5 py-3 font-mono text-xs text-muted-foreground">
                                        {prop.type}
                                    </td>
                                    <td className="align-top break-words px-5 py-3 font-mono text-xs text-foreground">
                                        {prop.default ?? <span className="text-muted-foreground/50">-</span>}
                                    </td>
                                    <td className="align-top px-5 py-3">
                                        {prop.required ? (
                                            <span className="inline-flex items-center rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                                                yes
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">no</span>
                                        )}
                                    </td>
                                    <td className="align-top break-words px-5 py-3 text-muted-foreground">
                                        {prop.description}
                                    </td>
                                </tr>
                                {expandable && isOpen ? (
                                    <tr className={`border-b ${rowTone}`}>
                                        <td colSpan={5} className="px-0 pb-4 pt-0">
                                            <div className="space-y-4 pr-5 pt-4">
                                                {prop.shape ? (
                                                    <div className="grid grid-cols-[14%_1fr] items-start gap-x-0">
                                                        <div className="pl-5 pr-5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                                            Shape
                                                        </div>
                                                        <pre className="max-h-72 w-full overflow-auto whitespace-pre-wrap rounded-md border border-border/60 bg-muted/20 p-3 pr-4 font-mono text-[11px] leading-relaxed text-foreground">
                                                            <code>{prop.shape.trim()}</code>
                                                        </pre>
                                                    </div>
                                                ) : null}
                                                {prop.example ? (
                                                    <div className="grid grid-cols-[14%_1fr] items-start gap-x-0">
                                                        <div className="pl-5 pr-5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                                            Example
                                                        </div>
                                                        <pre className="max-h-72 w-full overflow-auto whitespace-pre-wrap rounded-md border border-border/60 bg-muted/20 p-3 pr-4 font-mono text-[11px] leading-relaxed text-foreground">
                                                            <code>{prop.example.trim()}</code>
                                                        </pre>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
