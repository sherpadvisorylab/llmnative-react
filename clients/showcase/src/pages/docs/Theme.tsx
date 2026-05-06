import React, { useState } from 'react';
import { useThemeController } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';

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

function ThemeControllerPreview() {
    const theme = useThemeController();

    return (
        <div className="card p-5 space-y-4">
            <div className="grid grid-cols-4 gap-3">
                <div>
                    <p className="text-xs text-muted-foreground">Preset</p>
                    <p className="text-sm font-semibold">{theme.preset}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Mode</p>
                    <p className="text-sm font-semibold">{theme.resolvedMode}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Primary</p>
                    <p className="text-sm font-semibold truncate">{theme.primary}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Radius</p>
                    <p className="text-sm font-semibold">{theme.radius.toFixed(2)}rem</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {Object.keys(theme.presets).map((preset) => (
                    <button
                        key={preset}
                        onClick={() => theme.applyPreset(preset)}
                        className={`btn btn-sm ${theme.preset === preset ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                        {preset}
                    </button>
                ))}
                <button className="btn btn-sm btn-outline-secondary" onClick={theme.toggleMode}>
                    Toggle mode
                </button>
            </div>
            <div className="flex items-center gap-3">
                <button className="btn btn-primary">Primary button</button>
                <span className="badge bg-primary">Primary badge</span>
                <div className="w-10 h-10 rounded bg-primary" />
            </div>
        </div>
    );
}

export default function ThemeDocs() {
    return (
        <PageLayout
            title="Theme provider"
            description="Theme is managed by App. Use built-in presets by name, or extend the registry with custom presets and theme overrides."
        >
            <div className="space-y-10">
                <section>
                    <h2 className="text-base font-semibold mb-3">App-level API</h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        The default theme preset is <code className="text-xs bg-muted px-1 py-0.5 rounded">default</code>.
                        A string selects the default preset. An object lets you add presets, choose mode, and override component theme tokens.
                    </p>
                    <CodeBlock code={`// Built-in defaults
<App />

// String shorthand
<App themeProvider="cyber" />

// Advanced registry
<App
  themeProvider={{
    defaultMode: 'dark',
    defaultPreset: 'brand',
    presets: {
      brand: {
        primary: '346.8 77.2% 49.8%',
        radius: 0.75,
        theme: {
          Button: { className: 'font-semibold' },
          Card: { className: 'shadow-sm' },
        },
      },
    },
    theme: {
      Modal: { size: 'xl' },
    },
  }}
/>`} />
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">Runtime control</h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Use <code className="text-xs bg-muted px-1 py-0.5 rounded">useThemeController()</code> inside layout,
                        settings panels, or live customization tools. The top-right customize panel uses this hook.
                    </p>
                    <ThemeControllerPreview />
                    <div className="mt-4">
                        <CodeBlock code={`import { useThemeController } from 'react-firestrap';

function Preferences() {
  const theme = useThemeController();

  return (
    <>
      <button onClick={() => theme.applyPreset('flat')}>Flat</button>
      <button onClick={() => theme.applyPreset('cyber')}>Cyber</button>
      <button onClick={theme.toggleMode}>Toggle mode</button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={theme.radius}
        onChange={(event) => theme.setRadius(Number(event.target.value))}
      />
    </>
  );
}`} />
                    </div>
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">Built-in presets</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            ['default', 'Light mode, blue primary, rounded controls.'],
                            ['flat', 'Light mode, slate primary, tighter radius.'],
                            ['cyber', 'Dark mode, green primary, sharp corners.'],
                        ].map(([name, description]) => (
                            <div key={name} className="card p-4">
                                <h3 className="text-sm font-semibold mb-1">{name}</h3>
                                <p className="text-xs text-muted-foreground">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">CSS variables</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        ThemeProvider applies the core CSS variables on the document root and toggles the
                        <code className="text-xs bg-muted px-1 py-0.5 rounded mx-1">.dark</code> class.
                    </p>
                    <CodeBlock code={`--rf-primary: ${'${theme.primary}'};
--rf-primary-foreground: ${'${theme.primaryForeground}'};
--radius: ${'${theme.radius}rem'};

document.documentElement.classList.toggle('dark', theme.resolvedMode === 'dark');`} />
                </section>

                <section>
                    <h2 className="text-base font-semibold mb-3">Legacy theme compatibility</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Existing consumers can still use <code className="text-xs bg-muted px-1 py-0.5 rounded">importTheme</code>.
                        It is applied as a final async override on top of the selected preset and direct theme overrides.
                    </p>
                    <CodeBlock code={`<App
  themeProvider="default"
  importTheme={() => import('./my-theme')}
/>

// my-theme.ts
export const theme = {
  Form: { buttonSaveClass: 'btn btn-primary px-5' },
  Grid: { Table: { wrapClass: 'table-responsive shadow' } },
};`} />
                </section>
            </div>
        </PageLayout>
    );
}
