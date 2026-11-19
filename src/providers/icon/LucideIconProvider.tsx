import * as LucideIcons from 'lucide-react';
import { toKebabCase, type IconProviderAdapter, type IconComponentProps } from './IconProvider';

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
    // CR-127 — the names of the access screens, the same in both providers.
    'check-circle':           'CircleCheck',
    'warning-circle':         'CircleAlert',
    'mail-open':              'MailOpen',
    'shield-warning':         'ShieldAlert',
    'warning':                'TriangleAlert',
};

function toPascalCase(name: string): string {
    return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

export class LucideIconProvider implements IconProviderAdapter {
    readonly id = 'lucide' as const;
    private _names: string[] | null = null;

    /** Every icon of Lucide by its name (CR-148). */
    list(): string[] {
        if (!this._names) {
            const icons = (LucideIcons as unknown as { icons?: Record<string, unknown> }).icons ?? {};
            this._names = [...new Set(Object.keys(icons).map(toKebabCase))].filter((n) => this.resolve(n)).sort();
        }
        return this._names;
    }

    resolve(name: string): import('react').ComponentType<IconComponentProps> | null {
        const key = ALIASES[name] ?? toPascalCase(name);
        return (LucideIcons as unknown as Record<string, import('react').ComponentType<IconComponentProps>>)[key] ?? null;
    }
}
