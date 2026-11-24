import React from 'react';
import { lazyModule } from '../../libs/lazyModule';
import { toKebabCase, type IconProviderAdapter, type IconComponentProps } from './IconProvider';

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
    // CR-127 — the names of the access screens, the same in both providers.
    'mail':          'Envelope',
    'mail-open':     'EnvelopeOpen',
    'eye-off':       'EyeSlash',
    // CR-138 — the kanban view of Grid.
    'move-horizontal': 'ArrowsLeftRight',
    // CR-151: the names of the sidebar and of the account, as Phosphor calls them.
    'chevron-left':     'CaretLeft',
    'chevron-right':    'CaretRight',
    'chevrons-left':    'CaretDoubleLeft',
    'chevrons-right':   'CaretDoubleRight',
    'chevrons-up-down': 'CaretUpDown',
    'log-out':          'SignOut',
    // CR-152: the levels of the trail of PageTitle hidden on a narrow screen.
    'ellipsis':         'DotsThree',
    // CR-154: the sort and the drag handle of Table, through the active provider.
    'arrow-up-down':    'ArrowsDownUp',
    'grip-vertical':    'DotsSixVertical',
};

/** CR-154 — `@phosphor-icons/react` (an optional peer) is loaded on demand, never when the package is imported. */
export const phosphorSdk = lazyModule(() => import('@phosphor-icons/react'), 'Install @phosphor-icons/react to use the Phosphor icons.');

function toPascalCase(name: string): string {
    return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

export class PhosphorIconProvider implements IconProviderAdapter {
    readonly id = 'phosphor' as const;
    private readonly _cache = new Map<string, React.ComponentType<IconComponentProps>>();
    private _names: string[] | null = null;

    /** Every icon of Phosphor by its name (CR-148): the exports with the `Icon` suffix, without it. */
    list(): string[] {
        const PhosphorIcons = phosphorSdk.peek();
        if (!PhosphorIcons) return [];
        if (!this._names) {
            const keys = Object.keys(PhosphorIcons).filter((k) => /^[A-Z]/.test(k) && k.endsWith('Icon') && k !== 'Icon');
            this._names = [...new Set(keys.map((k) => toKebabCase(k.slice(0, -'Icon'.length))))].filter((n) => n && this.resolve(n)).sort();
        }
        return this._names;
    }

    constructor(public weight: PhosphorWeight = 'regular') {}

    isReady(): boolean {
        return phosphorSdk.peek() !== undefined;
    }

    async load(): Promise<void> {
        await phosphorSdk.load();
    }

    resolve(name: string): React.ComponentType<IconComponentProps> | null {
        const cached = this._cache.get(name);
        if (cached) return cached;
        const PhosphorIcons = phosphorSdk.peek();
        if (!PhosphorIcons) return null;

        const key = ALIASES[name] ?? toPascalCase(name);
        // Some icons are exported only with the `Icon` suffix (CR-148).
        const all = PhosphorIcons as unknown as Record<string, React.ComponentType<IconComponentProps & { weight?: PhosphorWeight }>>;
        const Base = all[key] ?? all[`${key}Icon`];
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
