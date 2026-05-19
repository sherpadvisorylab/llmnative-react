import React from 'react';
import type { PropDef } from '../types/playground';

interface PropsTableProps {
    props: PropDef[];
    title?: string;
}

export default function PropsTable({ props, title = 'Props' }: PropsTableProps) {
    if (props.length === 0) return null;

    return (
        <div className="border rounded-lg overflow-hidden bg-card">
            <div className="px-5 py-4 border-b">
                <h2 className="font-semibold text-foreground">{title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Complete list of available props and their accepted values.
                </p>
            </div>
            <table className="w-full text-sm table-fixed">
                <colgroup>
                    <col className="w-[14%]" />
                    <col className="w-[32%]" />
                    <col className="w-[12%]" />
                    <col className="w-[10%]" />
                    <col className="w-[32%]" />
                </colgroup>
                <thead>
                    <tr className="border-b bg-muted/40">
                        <th className="text-left px-5 py-3 font-semibold text-foreground">Prop</th>
                        <th className="text-left px-5 py-3 font-semibold text-foreground">Type</th>
                        <th className="text-left px-5 py-3 font-semibold text-foreground">Default</th>
                        <th className="text-left px-5 py-3 font-semibold text-foreground">Required</th>
                        <th className="text-left px-5 py-3 font-semibold text-foreground">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {props.map((prop, i) => (
                        <tr
                            key={prop.name}
                            className={`border-b last:border-0 align-top ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                        >
                            <td className="px-5 py-3 font-mono text-primary font-medium break-words align-top">
                                {prop.name}
                            </td>
                            <td className="px-5 py-3 font-mono text-xs text-muted-foreground break-words whitespace-pre-wrap align-top">
                                {prop.type}
                            </td>
                            <td className="px-5 py-3 font-mono text-xs text-foreground break-words align-top">
                                {prop.default ?? <span className="text-muted-foreground/50">-</span>}
                            </td>
                            <td className="px-5 py-3 align-top">
                                {prop.required ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">
                                        yes
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground text-xs">no</span>
                                )}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground break-words align-top">
                                {prop.description ?? <span className="text-muted-foreground/50">-</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
