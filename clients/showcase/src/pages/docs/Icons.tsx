import React, { useState } from 'react';
import { Icon, LucideIconProvider, PhosphorIconProvider, IconProviderProvider } from 'react-firestrap';
import type { IconProvider, PhosphorWeight } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';

// ── helpers ──────────────────────────────────────────────────────────────────

const PREVIEW_ICONS = [
    'sun', 'moon', 'bell', 'search', 'settings', 'trash',
    'edit', 'add', 'close', 'check', 'warning', 'info',
    'eye', 'copy', 'download', 'upload', 'external-link',
    'arrow-right', 'chevron-right', 'dashboard', 'file', 'layers', 'package',
];

const PHOSPHOR_WEIGHTS: PhosphorWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="relative border rounded-lg bg-muted/50 overflow-hidden">
            <button
                onClick={() => { navigator.clipboard.writeText(code.trim()); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="absolute right-3 top-3 text-xs px-2 py-1 rounded border bg-background hover:bg-accent transition-colors"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="p-5 text-xs overflow-x-auto leading-relaxed"><code>{code.trim()}</code></pre>
        </div>
    );
}

function IconGrid({ provider }: { provider: IconProvider }) {
    return (
        <IconProviderProvider provider={provider}>
            <div className="grid grid-cols-6 gap-3">
                {PREVIEW_ICONS.map((name) => (
                    <div key={name} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-default">
                        <Icon name={name} size={20} className="text-foreground" />
                        <span className="text-[10px] text-muted-foreground text-center leading-tight">{name}</span>
                    </div>
                ))}
            </div>
        </IconProviderProvider>
    );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function Icons() {
    const [activeLib, setActiveLib] = useState<'lucide' | 'phosphor'>('lucide');
    const [phosphorWeight, setPhosphorWeight] = useState<PhosphorWeight>('regular');

    const lucideProvider  = new LucideIconProvider();
    const phosphorProvider = new PhosphorIconProvider(phosphorWeight);
    const activeProvider   = activeLib === 'lucide' ? lucideProvider : phosphorProvider;

    return (
        <PageLayout
            title="Icon system"
            description="react-firestrap uses a provider-based icon system. Swap the entire icon library at runtime — consumer code stays unchanged."
        >
            <div className="space-y-10">

                {/* ── Overview ── */}
                <section>
                    <h2 className="text-base font-semibold mb-2">How it works</h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Icons are resolved through an <code className="text-xs bg-muted px-1 py-0.5 rounded">IconProvider</code> context.
                        Components call <code className="text-xs bg-muted px-1 py-0.5 rounded">{'<Icon name="search" />'}</code> using
                        semantic names — the active provider maps each name to the correct component from whichever library is installed.
                        Swapping from Lucide to Phosphor (or any custom library) requires changing one line at the app root.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { title: 'Semantic names', desc: 'Use "search", "trash", "close" — never import-path names.' },
                            { title: 'Convention-based', desc: 'kebab-case → PascalCase auto-resolves 90% of icons. Small alias map covers the rest.' },
                            { title: 'Zero consumer change', desc: 'Switch library or weight in one place. Every <Icon> in the app updates.' },
                        ].map((f) => (
                            <div key={f.title} className="card p-4">
                                <p className="text-sm font-semibold mb-1">{f.title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Quick start ── */}
                <section>
                    <h2 className="text-base font-semibold mb-3">Quick start</h2>
                    <CodeBlock code={`// 1. Install a library (choose one)
npm install lucide-react
npm install @phosphor-icons/react

// 2. Wrap your app
import { App, LucideIconProvider } from 'react-firestrap';

<App
    iconProvider={new LucideIconProvider()}
    ...
/>

// 3. Use icons anywhere — no imports needed
import { Icon } from 'react-firestrap';

<Icon name="search" />
<Icon name="trash" size={20} />
<Icon name="arrow-right" className="text-primary" />`} />
                </section>

                {/* ── Live comparison ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold">Live preview</h2>
                        <div className="flex items-center gap-2">
                            {(['lucide', 'phosphor'] as const).map((lib) => (
                                <button
                                    key={lib}
                                    onClick={() => setActiveLib(lib)}
                                    className={`px-3 py-1.5 text-xs rounded-md border font-medium transition-colors
                                        ${activeLib === lib ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent'}`}
                                >
                                    {lib === 'lucide' ? 'Lucide React' : 'Phosphor Icons'}
                                </button>
                            ))}
                            {activeLib === 'phosphor' && (
                                <select
                                    value={phosphorWeight}
                                    onChange={(e) => setPhosphorWeight(e.target.value as PhosphorWeight)}
                                    className="text-xs border rounded-md px-2 py-1.5 bg-background"
                                >
                                    {PHOSPHOR_WEIGHTS.map((w) => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <IconGrid provider={activeProvider} />
                </section>

                {/* ── Built-in providers ── */}
                <section>
                    <h2 className="text-base font-semibold mb-4">Built-in providers</h2>
                    <div className="space-y-4">

                        <div className="card p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold">LucideIconProvider</h3>
                                    <code className="text-xs text-muted-foreground">react-firestrap → LucideIconProvider</code>
                                </div>
                                <span className="badge bg-secondary">lucide-react required</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Default provider. Over 1 500 icons, consistent stroke style. The same library used by shadcn/ui.
                            </p>
                            <CodeBlock code={`import { LucideIconProvider } from 'react-firestrap';

// Basic usage
new LucideIconProvider()

// In App
<App iconProvider={new LucideIconProvider()} />`} />
                        </div>

                        <div className="card p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold">PhosphorIconProvider</h3>
                                    <code className="text-xs text-muted-foreground">react-firestrap → PhosphorIconProvider</code>
                                </div>
                                <span className="badge bg-secondary">@phosphor-icons/react required</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Over 1 400 icons available in six weights: thin, light, regular, bold, fill, duotone.
                                Pass the weight once at provider level — every icon inherits it.
                            </p>
                            <CodeBlock code={`import { PhosphorIconProvider } from 'react-firestrap';

// Regular weight (default)
new PhosphorIconProvider()

// All icons bold
new PhosphorIconProvider('bold')

// Runtime switch (e.g. user preference)
const [weight, setWeight] = useState<PhosphorWeight>('regular');
<App iconProvider={new PhosphorIconProvider(weight)} />`} />
                        </div>

                    </div>
                </section>

                {/* ── How resolution works ── */}
                <section>
                    <h2 className="text-base font-semibold mb-3">How name resolution works</h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        The provider tries two strategies in order, so you don't need to map every icon manually:
                    </p>
                    <div className="card overflow-hidden mb-4">
                        <table className="table text-sm">
                            <thead>
                                <tr>
                                    <th>Step</th>
                                    <th>Strategy</th>
                                    <th>Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-mono text-xs">1</td>
                                    <td>Check alias map (exceptions)</td>
                                    <td><code className="text-xs">"close" → "X"</code></td>
                                </tr>
                                <tr>
                                    <td className="font-mono text-xs">2</td>
                                    <td>Auto kebab → PascalCase</td>
                                    <td><code className="text-xs">"arrow-right" → "ArrowRight"</code></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                        This covers ~90% of icons automatically. The alias map only needs to handle names that genuinely diverge between semantic intent and library convention:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lucide aliases</p>
                            <CodeBlock code={`"close"     → X
"warning"   → TriangleAlert
"edit"      → Pencil
"add"       → Plus
"dashboard" → LayoutDashboard
"trash"     → Trash2
"file"      → FileText`} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Phosphor aliases</p>
                            <CodeBlock code={`"search"        → MagnifyingGlass
"settings"      → Gear
"external-link" → ArrowSquareOut
"dashboard"     → SquaresFour
"github"        → GithubLogo
"menu"          → List
"chevron-right" → CaretRight`} />
                        </div>
                    </div>
                </section>

                {/* ── Custom provider ── */}
                <section>
                    <h2 className="text-base font-semibold mb-3">Custom icon provider</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Implement the <code className="text-xs bg-muted px-1 py-0.5 rounded">IconProvider</code> interface to
                        plug in any icon library — Heroicons, Tabler, Remix Icons, your own SVG set, etc.
                    </p>
                    <CodeBlock code={`import type { IconProvider, IconComponentProps } from 'react-firestrap';
import * as HeroIcons from '@heroicons/react/24/outline';

function toPascalCase(name: string) {
    return name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
}

export class HeroIconProvider implements IconProvider {
    readonly id = 'heroicons';

    resolve(name: string): React.ComponentType<IconComponentProps> | null {
        const key = toPascalCase(name) + 'Icon';   // Heroicons convention: ArrowRightIcon
        return (HeroIcons as any)[key] ?? null;
    }
}

// Usage
<App iconProvider={new HeroIconProvider()} />`} />
                </section>

                {/* ── Per-instance override ── */}
                <section>
                    <h2 className="text-base font-semibold mb-3">Per-instance override</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Use a different provider for a single icon or a subtree without changing the global context.
                    </p>
                    <CodeBlock code={`import { Icon, IconProviderProvider, PhosphorIconProvider } from 'react-firestrap';

// Single icon override
<Icon name="star" provider={new PhosphorIconProvider('fill')} size={24} />

// Subtree override — all icons inside use Phosphor bold
<IconProviderProvider provider={new PhosphorIconProvider('bold')}>
    <Sidebar />
</IconProviderProvider>`} />
                </section>

                {/* ── Runtime switching ── */}
                <section>
                    <h2 className="text-base font-semibold mb-3">Runtime switching (user preference)</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Store the active provider in state and re-render — every icon updates without touching component code.
                        This showcase uses exactly this pattern in the ThemePanel (top-right ✦ button).
                    </p>
                    <CodeBlock code={`import { useState } from 'react';
import { App, IconProviderProvider, LucideIconProvider, PhosphorIconProvider } from 'react-firestrap';
import type { IconProvider } from 'react-firestrap';

function Root() {
    const [iconProvider, setIconProvider] = useState<IconProvider>(
        () => new LucideIconProvider()
    );

    return (
        <IconProviderProvider provider={iconProvider}>
            <App ... />
            <button onClick={() => setIconProvider(new PhosphorIconProvider('bold'))}>
                Switch to Phosphor Bold
            </button>
        </IconProviderProvider>
    );
}`} />
                </section>

                {/* ── Semantic name reference ── */}
                <section>
                    <h2 className="text-base font-semibold mb-3">Semantic name reference</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        These names work out of the box with both built-in providers.
                        Any other kebab-case name is resolved automatically via PascalCase conversion.
                    </p>
                    <div className="card overflow-hidden">
                        <table className="table text-sm">
                            <thead>
                                <tr>
                                    <th>Semantic name</th>
                                    <th>Lucide component</th>
                                    <th>Phosphor component</th>
                                    <th>Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['sun',           'Sun',            'Sun'],
                                    ['moon',          'Moon',           'Moon'],
                                    ['search',        'Search',         'MagnifyingGlass'],
                                    ['settings',      'Settings',       'Gear'],
                                    ['bell',          'Bell',           'Bell'],
                                    ['trash',         'Trash2',         'Trash'],
                                    ['edit',          'Pencil',         'PencilSimple'],
                                    ['add',           'Plus',           'Plus'],
                                    ['close',         'X',              'X'],
                                    ['check',         'Check',          'Check'],
                                    ['warning',       'TriangleAlert',  'Warning'],
                                    ['info',          'Info',           'Info'],
                                    ['eye',           'Eye',            'Eye'],
                                    ['copy',          'Copy',           'Copy'],
                                    ['download',      'Download',       'DownloadSimple'],
                                    ['upload',        'Upload',         'UploadSimple'],
                                    ['external-link', 'ExternalLink',   'ArrowSquareOut'],
                                    ['arrow-right',   'ArrowRight',     'ArrowRight'],
                                    ['chevron-right', 'ChevronRight',   'CaretRight'],
                                    ['dashboard',     'LayoutDashboard','SquaresFour'],
                                    ['file',          'FileText',       'FileText'],
                                    ['layers',        'Layers',         'Stack'],
                                    ['package',       'Package',        'Package'],
                                    ['github',        'Github',         'GithubLogo'],
                                    ['palette',       'Palette',        'Palette'],
                                ].map(([semantic, lucide, phosphor]) => (
                                    <tr key={semantic}>
                                        <td><code className="text-xs">{semantic}</code></td>
                                        <td className="text-xs text-muted-foreground">{lucide}</td>
                                        <td className="text-xs text-muted-foreground">{phosphor}</td>
                                        <td>
                                            <IconProviderProvider provider={activeProvider}>
                                                <Icon name={semantic} size={16} className="text-foreground" />
                                            </IconProviderProvider>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </PageLayout>
    );
}
