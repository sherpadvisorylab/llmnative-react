import React, { useState } from 'react';
import {
    Icon,
    IconProvider,
    LucideIconProvider,
    PhosphorIconProvider,
    useIconController,
} from 'react-firestrap';
import type { IconProviderAdapter, PhosphorWeight } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';

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
                onClick={() => {
                    navigator.clipboard.writeText(code.trim());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute right-3 top-3 text-xs px-2 py-1 rounded border bg-background hover:bg-accent transition-colors"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="p-5 text-xs overflow-x-auto leading-relaxed"><code>{code.trim()}</code></pre>
        </div>
    );
}

function IconGrid({ provider }: { provider: IconProviderAdapter }) {
    return (
        <IconProvider provider={provider}>
            <div className="grid grid-cols-6 gap-3">
                {PREVIEW_ICONS.map((name) => (
                    <div key={name} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-default">
                        <Icon name={name} size={20} className="text-foreground" />
                        <span className="text-[10px] text-muted-foreground text-center leading-tight">{name}</span>
                    </div>
                ))}
            </div>
        </IconProvider>
    );
}

function ActiveProviderPreview() {
    const { providerId, setProvider, registerProvider } = useIconController();

    return (
        <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold">Current App provider</p>
                    <p className="text-xs text-muted-foreground">Controlled by useIconController()</p>
                </div>
                <span className="badge bg-secondary">{providerId}</span>
            </div>
            <div className="flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => setProvider('lucide')}>Lucide</button>
                <button className="btn btn-sm btn-outline-primary" onClick={() => setProvider('phosphor')}>Phosphor</button>
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                        registerProvider('phosphor', new PhosphorIconProvider('fill'));
                        setProvider('phosphor');
                    }}
                >
                    Phosphor fill
                </button>
            </div>
            <div className="flex items-center gap-3">
                {['sun', 'moon', 'bell', 'settings', 'search', 'trash'].map((name) => (
                    <Icon key={name} name={name} size={18} className="text-muted-foreground" />
                ))}
            </div>
        </div>
    );
}

export default function Icons() {
    const [activeLib, setActiveLib] = useState<'lucide' | 'phosphor'>('lucide');
    const [phosphorWeight, setPhosphorWeight] = useState<PhosphorWeight>('regular');

    const activeProvider = activeLib === 'lucide'
        ? new LucideIconProvider()
        : new PhosphorIconProvider(phosphorWeight);

    return (
        <PageLayout
            title="Icon provider"
            description="Icons are managed by App. Use a built-in provider by name, or extend the registry with custom providers."
        >
            <div className="space-y-10">
                <section>
                    <h2 className="text-base font-semibold mb-3">App-level API</h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        The default icon provider is <code className="text-xs bg-muted px-1 py-0.5 rounded">lucide</code>.
                        A string selects the default provider. An object lets you add or override providers.
                    </p>
                    <CodeBlock code={`// Built-in defaults
<App />

// String shorthand
<App iconProvider="phosphor" />

// Advanced registry
<App
  iconProvider={{
    default: 'heroicons',
    providers: {
      heroicons: new HeroIconProvider(),
    },
    aliases: {
      delete: 'trash',
      edit: 'pencil',
    },
  }}
/>`} />
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">Runtime control</h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Use <code className="text-xs bg-muted px-1 py-0.5 rounded">useIconController()</code> inside layouts,
                        panels, or settings screens. The showcase theme panel uses this hook.
                    </p>
                    <ActiveProviderPreview />
                    <div className="mt-4">
                        <CodeBlock code={`import { useIconController, PhosphorIconProvider } from 'react-firestrap';

function Preferences() {
  const icons = useIconController();

  return (
    <>
      <button onClick={() => icons.setProvider('lucide')}>Lucide</button>
      <button onClick={() => icons.setProvider('phosphor')}>Phosphor</button>
      <button onClick={() => {
        icons.registerProvider('phosphor', new PhosphorIconProvider('fill'));
        icons.setProvider('phosphor');
      }}>
        Phosphor fill
      </button>
    </>
  );
}`} />
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold">Provider preview</h2>
                        <div className="flex items-center gap-2">
                            {(['lucide', 'phosphor'] as const).map((lib) => (
                                <button
                                    key={lib}
                                    onClick={() => setActiveLib(lib)}
                                    className={`px-3 py-1.5 text-xs rounded-md border font-medium transition-colors
                                        ${activeLib === lib ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent'}`}
                                >
                                    {lib === 'lucide' ? 'Lucide' : 'Phosphor'}
                                </button>
                            ))}
                            {activeLib === 'phosphor' && (
                                <select
                                    value={phosphorWeight}
                                    onChange={(e) => setPhosphorWeight(e.target.value as PhosphorWeight)}
                                    className="text-xs border rounded-md px-2 py-1.5 bg-background"
                                >
                                    {PHOSPHOR_WEIGHTS.map((weight) => (
                                        <option key={weight} value={weight}>{weight}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <IconGrid provider={activeProvider} />
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-4">Built-in providers</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card p-5">
                            <h3 className="font-semibold mb-1">lucide</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Default provider. Stroke-based SVG icons, aligned with shadcn/ui conventions.
                            </p>
                            <CodeBlock code={`<App iconProvider="lucide" />`} />
                        </div>
                        <div className="card p-5">
                            <h3 className="font-semibold mb-1">phosphor</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Flexible icon set with weights: thin, light, regular, bold, fill, duotone.
                            </p>
                            <CodeBlock code={`<App iconProvider="phosphor" />

// For a specific weight in a custom registry:
<App
  iconProvider={{
    default: 'phosphor-bold',
    providers: {
      'phosphor-bold': new PhosphorIconProvider('bold'),
    },
  }}
/>`} />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">Custom provider</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Implement <code className="text-xs bg-muted px-1 py-0.5 rounded">IconProviderAdapter</code> to use any icon library.
                    </p>
                    <CodeBlock code={`import type { IconProviderAdapter, IconComponentProps } from 'react-firestrap';
import * as HeroIcons from '@heroicons/react/24/outline';

function toPascalCase(name: string) {
  return name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('');
}

export class HeroIconProvider implements IconProviderAdapter {
  readonly id = 'heroicons';

  resolve(name: string): React.ComponentType<IconComponentProps> | null {
    return (HeroIcons as any)[toPascalCase(name) + 'Icon'] ?? null;
  }
}

<App
  iconProvider={{
    default: 'heroicons',
    providers: { heroicons: new HeroIconProvider() },
  }}
/>`} />
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">Local override</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        App-level registry is the normal path. For isolated previews or subtrees, you can still override locally.
                    </p>
                    <CodeBlock code={`<Icon name="star" provider={new PhosphorIconProvider('fill')} />

<IconProvider provider={new PhosphorIconProvider('bold')}>
  <SidebarPreview />
</IconProvider>`} />
                </section>
            </div>
        </PageLayout>
    );
}
