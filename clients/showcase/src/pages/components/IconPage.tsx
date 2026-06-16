import React from 'react';
import { Icon, LucideIconProvider, PhosphorIconProvider, useIconController } from '@llmnative/react';
import type { IconProviderAdapter } from '@llmnative/react';
import type { PhosphorWeight } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseIconI18n } from '../../showcase/i18n';

// ─── icon catalogs ────────────────────────────────────────────────────────────

const COMMON_ICONS = [
    'search', 'settings', 'user', 'bell', 'check', 'warning', 'trash', 'download',
    'edit', 'add', 'close', 'menu', 'home', 'star', 'heart', 'bookmark',
    'calendar', 'clock', 'mail', 'phone', 'lock', 'unlock', 'eye', 'eye-off',
    'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'chevron-right', 'chevron-down',
    'link', 'external-link', 'copy', 'share', 'upload', 'file', 'folder', 'image',
    'play', 'pause', 'stop', 'refresh', 'filter', 'sort', 'grid', 'list',
];

const SIZES = [12, 16, 20, 24, 32, 40, 48] as const;

const COLORS: { label: string; className: string }[] = [
    { label: 'default',  className: 'text-foreground' },
    { label: 'primary',  className: 'text-primary' },
    { label: 'success',  className: 'text-success' },
    { label: 'warning',  className: 'text-warning' },
    { label: 'danger',   className: 'text-danger' },
    { label: 'muted',    className: 'text-muted-foreground' },
];

const PHOSPHOR_WEIGHTS: PhosphorWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

// ─── provider resolution ──────────────────────────────────────────────────────

const PROVIDER_REGISTRY: Record<string, IconProviderAdapter> = {
    lucide:   new LucideIconProvider(),
    phosphor: new PhosphorIconProvider(),
};

function resolveProvider(name: string | undefined): IconProviderAdapter | undefined {
    if (!name) return undefined;
    return PROVIDER_REGISTRY[name.trim().toLowerCase()];
}

// ─── playground ───────────────────────────────────────────────────────────────

const ICON_PROPS: PropDef[] = [
    { name: 'name',      type: 'string',              description: 'Icon name resolved by the active icon provider', control: 'select', options: COMMON_ICONS },
    { name: 'size',      type: 'number',              default: '16',   description: 'Rendered size in pixels', control: 'number', min: 8, max: 64 },
    { name: 'className', type: 'string',              default: '-',    description: 'Tailwind / CSS classes - use text-* for color', control: 'text', suggestions: [
        'text-foreground', 'text-primary', 'text-success', 'text-warning', 'text-danger', 'text-muted-foreground',
        'text-primary text-2xl', 'text-success text-2xl', 'text-danger text-2xl',
        'animate-spin', 'animate-pulse',
        'opacity-50', 'opacity-75',
    ]},
    { name: 'style',     type: 'React.CSSProperties', default: '-',    description: 'Inline style object' },
    { name: 'provider',  type: 'IconProviderAdapter',  default: '-',    description: 'Override the global provider for this instance only. In the playground, type "lucide" or "phosphor" to switch.', control: 'text', suggestions: ['lucide', 'phosphor'], placeholder: 'lucide / phosphor' },
    { name: 'weight',    type: 'string',              default: '-',    description: 'Provider-specific variant (Phosphor only). Overrides the provider default.', control: 'select', options: ['', 'thin', 'light', 'regular', 'bold', 'fill', 'duotone'] },
    { name: 'label',     type: 'string',              default: '-',    description: 'Accessible label - sets aria-label; omit for decorative icons (aria-hidden)' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: ICON_PROPS,
    defaultProps: { name: 'search', size: 24, className: 'text-primary', provider: '', weight: '' },
    render: (p) => {
        const provider = resolveProvider(p.provider);
        const providerMissing = p.provider && !provider;
        return (
            <div className="flex flex-col items-start gap-3">
                <Icon
                    name={p.name || 'search'}
                    size={p.size}
                    className={p.className || undefined}
                    label={p.label || undefined}
                    provider={provider}
                    weight={p.weight || undefined}
                />
                <span className="font-mono text-xs text-muted-foreground">{p.name || 'search'}</span>
                {providerMissing && (
                    <span className="text-xs text-danger">provider "{p.provider}" not found → renders nothing</span>
                )}
            </div>
        );
    },
};

// ─── provider switcher used inside sections ───────────────────────────────────

function ProviderSwitcher({ value, onChange }: { value: string; onChange: (id: string) => void }) {
    return (
        <div className="flex gap-1">
            {['lucide', 'phosphor'].map((id) => (
                <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${value === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                    {id}
                </button>
            ))}
        </div>
    );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function IconPage() {
    usePlayground(PLAYGROUND, 'Icon');
    const common = useShowcaseCommonI18n();
    const t = useShowcaseIconI18n();

    const { providerId, setProvider } = useIconController();
    const [phosphorWeight, setPhosphorWeight] = React.useState<PhosphorWeight>('regular');

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            {/* ── Basic usage ── */}
            <Section
                title={common.sections.basicUsage}
                description={t.sections.basicUsage.description}
                preview={
                    <div className="flex flex-wrap items-center gap-6 text-foreground">
                        <Icon name="search" size={20} />
                        <Icon name="settings" size={20} />
                        <Icon name="bell" size={20} />
                        <Icon name="user" size={20} />
                        <Icon name="trash" size={20} className="text-danger" />
                        <Icon name="check" size={20} className="text-success" />
                    </div>
                }
                code={`import { Icon } from '@llmnative/react';

<Icon name="search" size={20} />
<Icon name="settings" size={20} />
<Icon name="bell" size={20} />
<Icon name="user" size={20} />
<Icon name="trash" size={20} className="text-danger" />
<Icon name="check" size={20} className="text-success" />`}
            />

            {/* ── Icon catalog ── */}
            <Section
                title={t.sections.catalog.title}
                description={t.sections.catalog.description.replace('{providerId}', providerId)}
                preview={
                    <div className="w-full">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">Provider:</span>
                            <ProviderSwitcher value={providerId} onChange={setProvider} />
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
                            {COMMON_ICONS.map((name) => (
                                <div key={name} className="flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-foreground">
                                    <Icon name={name} size={20} />
                                    <span className="font-mono text-[10px] text-muted-foreground leading-tight text-center">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                code={`// Same names resolve across providers
<Icon name="search" />
<Icon name="edit" />
<Icon name="trash" />
<Icon name="settings" />`}
                bare
            />

            {/* ── Sizes ── */}
            <Section
                title={common.sections.sizes}
                description={t.sections.sizes.description}
                preview={
                    <div className="flex flex-wrap items-end gap-6 text-foreground">
                        {SIZES.map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <Icon name="bell" size={s} />
                                <span className="font-mono text-xs text-muted-foreground">{s}</span>
                            </div>
                        ))}
                    </div>
                }
                code={`<Icon name="bell" size={12} />
<Icon name="bell" size={16} />   {/* default */}
<Icon name="bell" size={20} />
<Icon name="bell" size={24} />
<Icon name="bell" size={32} />
<Icon name="bell" size={40} />
<Icon name="bell" size={48} />`}
            />

            {/* ── Colors ── */}
            <Section
                title={t.sections.colors.title}
                description={t.sections.colors.description}
                preview={
                    <div className="flex flex-wrap items-center gap-5">
                        {COLORS.map(({ label, className }) => (
                            <div key={label} className="flex flex-col items-center gap-1.5">
                                <Icon name="star" size={24} className={className} />
                                <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </div>
                }
                code={`<Icon name="star" size={24} />                                 {/* inherits text color */}
<Icon name="star" size={24} className="text-primary" />
<Icon name="star" size={24} className="text-success" />
<Icon name="star" size={24} className="text-warning" />
<Icon name="star" size={24} className="text-danger" />
<Icon name="star" size={24} className="text-muted-foreground" />`}
            />

            {/* ── Providers comparison ── */}
            <Section
                title={t.sections.providers.title}
                description={t.sections.providers.description}
                preview={
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="py-2 pr-8 text-left font-medium">name</th>
                                    <th className="py-2 pr-8 text-center font-medium">lucide</th>
                                    <th className="py-2 text-center font-medium">phosphor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['search', 'settings', 'trash', 'edit', 'warning', 'download', 'user', 'bell'].map((name) => {
                                    const ph = new PhosphorIconProvider();
                                    return (
                                        <tr key={name} className="border-b last:border-0">
                                            <td className="py-2 pr-8 font-mono text-xs text-muted-foreground">{name}</td>
                                            <td className="py-2 pr-8 text-center">
                                                <Icon name={name} size={20} />
                                            </td>
                                            <td className="py-2 text-center">
                                                <Icon name={name} size={20} provider={ph} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                }
                code={`import { PhosphorIconProvider } from '@llmnative/react';

// Switch all icons globally at App level
<App iconProvider="phosphor" />

// Override the provider for one instance only
const ph = new PhosphorIconProvider();
<Icon name="search" provider={ph} />`}
                bare
            />

            {/* ── Phosphor weights ── */}
            <Section
                title={t.sections.phosphor.title}
                description={t.sections.phosphor.description}
                preview={
                    <div className="w-full">
                        <div className="mb-4 flex flex-wrap gap-1">
                            {PHOSPHOR_WEIGHTS.map((w) => (
                                <button
                                    key={w}
                                    onClick={() => setPhosphorWeight(w)}
                                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${phosphorWeight === w ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                        {(() => {
                            const ph = new PhosphorIconProvider();
                            return (
                                <div className="flex flex-wrap gap-5 text-foreground">
                                    {['search', 'star', 'bell', 'heart', 'warning', 'settings', 'user', 'trash'].map((name) => (
                                        <div key={name} className="flex flex-col items-center gap-1.5">
                                            <Icon name={name} size={24} provider={ph} weight={phosphorWeight} />
                                            <span className="font-mono text-[10px] text-muted-foreground">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                }
                code={`import { PhosphorIconProvider } from '@llmnative/react';

// weight as prop — no re-instantiation needed
const ph = new PhosphorIconProvider();
<Icon name="star" provider={ph} weight="bold" />
<Icon name="star" provider={ph} weight="fill" />
<Icon name="star" provider={ph} />              {/* uses provider default: regular */}

// App-level default weight
<App iconProvider={{ provider: new PhosphorIconProvider('bold') }} />

// Available weights: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'`}
                bare
            />

            {/* ── App-level config ── */}
            <Section
                title={t.sections.appConfig.title}
                description={t.sections.appConfig.description}
                preview={
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Active provider:</span>
                            <span className="font-mono font-semibold">{providerId}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ProviderSwitcher value={providerId} onChange={setProvider} />
                            <div className="flex gap-3 text-foreground">
                                <Icon name="search" size={20} />
                                <Icon name="settings" size={20} />
                                <Icon name="bell" size={20} />
                                <Icon name="star" size={20} />
                            </div>
                        </div>
                    </div>
                }
                code={`import { App, useIconController } from '@llmnative/react';

// 1. Built-in id
<App iconProvider="phosphor" />

// 2. Custom provider instance
<App iconProvider={new PhosphorIconProvider('bold')} />

// 3. With aliases
<App iconProvider={{ provider: new PhosphorIconProvider(), aliases: { delete: 'trash' } }} />

// 4. Multiple providers registered, switch at runtime
<App iconProvider={{ default: 'lucide', providers: { heroicons: new HeroIconProvider() } }} />

// Runtime switch
const { setProvider } = useIconController();
setProvider('phosphor');`}
            />

            {/* ── Aliases ── */}
            <Section
                title={t.sections.aliases.title}
                description={t.sections.aliases.description}
                preview={
                    <div className="flex flex-wrap items-center gap-6 text-foreground">
                        {[
                            { alias: 'delete', resolves: 'trash' },
                            { alias: 'confirm', resolves: 'check' },
                            { alias: 'expand', resolves: 'external-link' },
                        ].map(({ alias, resolves }) => (
                            <div key={alias} className="flex flex-col items-center gap-1.5">
                                <Icon name={resolves} size={22} />
                                <span className="font-mono text-[10px] text-muted-foreground">{alias}</span>
                            </div>
                        ))}
                    </div>
                }
                code={`<App
  iconProvider={{
    provider: new LucideIconProvider(),
    aliases: {
      delete:  'trash',
      confirm: 'check',
      expand:  'external-link',
    },
  }}
/>

// Use semantic names throughout your codebase
<Icon name="delete" />   // → trash
<Icon name="confirm" />  // → check`}
            />

            {/* ── Accessibility ── */}
            <Section
                title={t.sections.a11y.title}
                description={t.sections.a11y.description}
                preview={
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Icon name="trash" size={20} className="text-danger" />
                            <code className="font-mono text-xs text-muted-foreground">{'<Icon name="trash" />'}</code>
                            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">aria-hidden</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Icon name="trash" size={20} className="text-danger" label="Delete item" />
                            <code className="font-mono text-xs text-muted-foreground">{'<Icon name="trash" label="Delete item" />'}</code>
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">aria-label</span>
                        </div>
                    </div>
                }
                code={`// Decorative - aria-hidden="true" (default)
<button><Icon name="trash" size={18} /> Delete</button>

// Meaningful standalone - aria-label set
<button aria-label="Delete"><Icon name="trash" size={18} label="Delete" /></button>`}
            />

            {/* ── Custom provider ── */}
            <Section
                title={t.sections.customProvider.title}
                description={t.sections.customProvider.description}
                preview={
                    <div className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
                        Provide your own class - see code snippet.
                    </div>
                }
                code={`import type { IconProviderAdapter, IconComponentProps } from '@llmnative/react';
import * as HeroIcons from '@heroicons/react/24/outline';

class HeroIconProvider implements IconProviderAdapter {
    readonly id = 'heroicons';

    resolve(name: string): React.ComponentType<IconComponentProps> | null {
        const key = name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('') + 'Icon';
        return (HeroIcons as Record<string, React.ComponentType<IconComponentProps>>)[key] ?? null;
    }
}

<App iconProvider={new HeroIconProvider()} />`}
                bare
            />

            <PropDocsTable props={ICON_PROPS} />
        </PageLayout>
    );
}
