import React from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';
import type { IconProvider, IconComponentProps } from './IconProvider';

export type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

// Names that diverge from kebab→PascalCase convention in Phosphor
const ALIASES: Record<string, string> = {
    'search':        'MagnifyingGlass',
    'settings':      'Gear',
    'external-link': 'ArrowSquareOut',
    'dashboard':     'SquaresFour',
    'github':        'GithubLogo',
    'menu':          'List',
    'layers':        'Stack',
    'chevron-right': 'CaretRight',
    'edit':          'PencilSimple',
    'file':          'FileText',
    'trash':         'Trash',
    'close':         'X',
    'add':           'Plus',
};

function toPascalCase(name: string): string {
    return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

export class PhosphorIconProvider implements IconProvider {
    readonly id = 'phosphor' as const;
    private readonly _cache = new Map<string, React.ComponentType<IconComponentProps>>();

    constructor(private readonly weight: PhosphorWeight = 'regular') {}

    resolve(name: string): React.ComponentType<IconComponentProps> | null {
        const cached = this._cache.get(name);
        if (cached) return cached;

        const key = ALIASES[name] ?? toPascalCase(name);
        const Base = (PhosphorIcons as unknown as Record<string, React.ComponentType<IconComponentProps & { weight?: PhosphorWeight }>>)[key];
        if (!Base) return null;

        const resolved: React.ComponentType<IconComponentProps> =
            this.weight === 'regular'
                ? Base
                : (props: IconComponentProps) =>
                    React.createElement(Base, { weight: this.weight, ...props } as IconComponentProps & { weight: PhosphorWeight });

        this._cache.set(name, resolved);
        return resolved;
    }
}
