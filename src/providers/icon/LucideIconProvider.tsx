import * as LucideIcons from 'lucide-react';
import type { IconProviderAdapter, IconComponentProps } from './IconProvider';

// Names that diverge from kebab→PascalCase convention in Lucide
const ALIASES: Record<string, string> = {
    'close':     'X',
    'warning':   'TriangleAlert',
    'edit':      'Pencil',
    'add':       'Plus',
    'dashboard': 'LayoutDashboard',
    'trash':     'Trash2',
    'file':      'FileText',
    'github':    'GitBranch',
};

function toPascalCase(name: string): string {
    return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

export class LucideIconProvider implements IconProviderAdapter {
    readonly id = 'lucide' as const;

    resolve(name: string): import('react').ComponentType<IconComponentProps> | null {
        const key = ALIASES[name] ?? toPascalCase(name);
        return (LucideIcons as unknown as Record<string, import('react').ComponentType<IconComponentProps>>)[key] ?? null;
    }
}
