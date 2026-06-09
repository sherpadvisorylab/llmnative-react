import React from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';
import type { IconProviderAdapter, IconComponentProps } from './IconProvider';

export type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

// Names that diverge from kebab→PascalCase convention in Phosphor
const ALIASES: Record<string, string> = {
    'add':                    'Plus',
    'arrow-arc-left':         'ArrowArcLeft',
    'arrow-arc-right':        'ArrowArcRight',
    'arrow-line-down':        'ArrowLineDown',
    'arrow-line-right':       'ArrowLineRight',
    'camera-rotate':          'CameraRotate',
    'caret-down':             'CaretDown',
    'caret-right':            'CaretRight',
    'close':                  'X',
    'dashboard':              'SquaresFour',
    'edit':                   'PencilSimple',
    'external-link':          'ArrowSquareOut',
    'file':                   'FileText',
    'floppy-disk':            'FloppyDisk',
    'fullscreen':             'CornersOut',
    'fullscreen-exit':        'CornersIn',
    'github':                 'GithubLogo',
    'house-door':             'House',
    'link-break':             'LinkBreak',
    'magnifying-glass-minus': 'MagnifyingGlassMinus',
    'magnifying-glass-plus':  'MagnifyingGlassPlus',
    'menu':                   'List',
    'rectangle':              'Rectangle',
    'search':        'MagnifyingGlass',
    'settings':      'Gear',
    'text-t':        'TextT',
    'trash':         'Trash',
    'warning':       'Warning',
    'layers':        'Stack',
};

function toPascalCase(name: string): string {
    return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

export class PhosphorIconProvider implements IconProviderAdapter {
    readonly id = 'phosphor' as const;
    private readonly _cache = new Map<string, React.ComponentType<IconComponentProps>>();

    constructor(public weight: PhosphorWeight = 'regular') {}

    resolve(name: string): React.ComponentType<IconComponentProps> | null {
        const cached = this._cache.get(name);
        if (cached) return cached;

        const key = ALIASES[name] ?? toPascalCase(name);
        const Base = (PhosphorIcons as unknown as Record<string, React.ComponentType<IconComponentProps & { weight?: PhosphorWeight }>>)[key];
        if (!Base) return null;

        // Always wrap so props.weight overrides the provider default at render time.
        // The cache stores the wrapper per icon name (not per weight).
        const defaultWeight = this.weight;
        const resolved: React.ComponentType<IconComponentProps> = (props: IconComponentProps) =>
            React.createElement(Base, { weight: defaultWeight, ...props } as IconComponentProps & { weight: PhosphorWeight });

        this._cache.set(name, resolved);
        return resolved;
    }
}
