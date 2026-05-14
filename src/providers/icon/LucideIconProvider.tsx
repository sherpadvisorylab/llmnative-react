import * as LucideIcons from 'lucide-react';
import type { IconProviderAdapter, IconComponentProps } from './IconProvider';

// Names that diverge from kebab→PascalCase convention in Lucide
const ALIASES: Record<string, string> = {
    'add':                    'Plus',
    'arrow-arc-left':         'Undo2',
    'arrow-arc-right':        'Redo2',
    'arrow-line-down':        'FlipVertical',
    'arrow-line-right':       'FlipHorizontal',
    'camera-rotate':          'RotateCw',
    'caret-down':             'ChevronDown',
    'caret-right':            'ChevronRight',
    'close':                  'X',
    'dashboard':              'LayoutDashboard',
    'edit':                   'Pencil',
    'file':                   'FileText',
    'floppy-disk':            'Save',
    'fullscreen':             'Maximize',
    'fullscreen-exit':        'Minimize',
    'github':                 'GitBranch',
    'house-door':             'Home',
    'link-break':             'Unlink',
    'magnifying-glass-minus': 'ZoomOut',
    'magnifying-glass-plus':  'ZoomIn',
    'rectangle':              'Square',
    'text-t':                 'Type',
    'trash':                  'Trash2',
    'warning':                'TriangleAlert',
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
