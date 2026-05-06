import React, { useMemo, useState } from 'react';
import { Modal, Icon, PhosphorIconProvider, useIconController, useThemeController } from 'react-firestrap';
import type { PhosphorWeight } from 'react-firestrap';

interface ThemePanelProps {
    open: boolean;
    onClose: () => void;
}

type ThemePreset = 'default' | 'flat' | 'cyber';
type IconLibraryId = 'lucide' | 'phosphor';

interface ColorSwatch {
    label: string;
    value: string;
    hex: string;
}

const COLOR_SWATCHES: ColorSwatch[] = [
    { label: 'Blue',   value: '221.2 83.2% 53.3%', hex: '#3b82f6' },
    { label: 'Violet', value: '262.1 83.3% 57.8%', hex: '#8b5cf6' },
    { label: 'Green',  value: '142.1 76.2% 36.3%', hex: '#16a34a' },
    { label: 'Rose',   value: '346.8 77.2% 49.8%', hex: '#e11d48' },
    { label: 'Orange', value: '24.6 95% 53.1%',    hex: '#f97316' },
    { label: 'Slate',  value: '215.4 16.3% 46.9%', hex: '#64748b' },
];

const PRESETS: { label: string; value: ThemePreset; description: string }[] = [
    { label: 'Default', value: 'default', description: 'Clean, rounded, blue primary' },
    { label: 'Flat',    value: 'flat',    description: 'Sharp corners, slate tones' },
    { label: 'Cyber',   value: 'cyber',   description: 'Zero radius, green neon' },
];

const ICON_LIBRARIES: { label: string; value: IconLibraryId; description: string }[] = [
    { label: 'Lucide',   value: 'lucide',   description: 'shadcn/ui default, 1000+ icons' },
    { label: 'Phosphor', value: 'phosphor', description: 'Flexible weights, 1400+ icons' },
];

const PHOSPHOR_WEIGHTS: { label: string; value: PhosphorWeight }[] = [
    { label: 'Thin',    value: 'thin' },
    { label: 'Light',   value: 'light' },
    { label: 'Regular', value: 'regular' },
    { label: 'Bold',    value: 'bold' },
    { label: 'Fill',    value: 'fill' },
];

export default function ThemePanel({ open, onClose }: ThemePanelProps) {
    const { resolvedMode, primary, radius, preset, toggleMode, setPrimary, setRadius, applyPreset } = useThemeController();
    const { providerId, setProvider, registerProvider } = useIconController();
    const [copied, setCopied] = useState(false);
    const iconLibraryId = (providerId === 'phosphor' ? 'phosphor' : 'lucide') as IconLibraryId;

    const appConfiguration = useMemo(() => {
        return `import { App } from 'react-firestrap';

<App
    iconProvider="${iconLibraryId}"
    themeProvider={{
        defaultPreset: '${preset}',
        mode: '${resolvedMode}',
        primary: '${primary}',
        radius: ${Number(radius.toFixed(2))},
    }}
/>`;
    }, [iconLibraryId, preset, primary, radius, resolvedMode]);

    const copyConfiguration = () => {
        navigator.clipboard.writeText(appConfiguration.trim());
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    if (!open) return null;

    const header = (
        <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
                <h3 className="offcanvas-title truncate">Customize</h3>
                <div className="offcanvas-sub-title truncate">Live CSS variables, no reload.</div>
            </div>
            <button
                type="button"
                title={copied ? 'Configuration copied' : 'Copy App configuration'}
                aria-label={copied ? 'Configuration copied' : 'Copy App configuration'}
                onClick={copyConfiguration}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
                <Icon name={copied ? 'check' : 'copy'} size={15} />
            </button>
        </div>
    );

    return (
        <Modal
            position="right"
            header={header}
            onClose={onClose}
            buttonFullscreen={false}
            footerClose={false}
            headerClass="h-14 !py-0 px-4"
        >
            <div className="space-y-6">

                {/* Mode */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                        Color mode
                    </label>
                    <div className="flex gap-2">
                        {(['light', 'dark'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => resolvedMode !== m && toggleMode()}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md border text-sm font-medium transition-colors
                                    ${resolvedMode === m
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border text-muted-foreground hover:bg-accent'}`}
                            >
                                <Icon name={m === 'light' ? 'sun' : 'moon'} size={14} />
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Primary color */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                        Primary color
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {COLOR_SWATCHES.map((swatch) => (
                            <button
                                key={swatch.label}
                                onClick={() => setPrimary(swatch.value)}
                                title={swatch.label}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                                    ${primary === swatch.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: swatch.hex }}
                                aria-label={swatch.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Border radius */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Border radius
                        </label>
                        <span className="text-xs font-mono text-muted-foreground">
                            {radius.toFixed(2)}rem
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={radius}
                        onChange={(e) => setRadius(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Sharp</span>
                        <span>Rounded</span>
                    </div>
                </div>

                {/* Theme preset */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                        Theme preset
                    </label>
                    <div className="space-y-2">
                        {PRESETS.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => applyPreset(p.value)}
                                className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors
                                    ${preset === p.value
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:bg-accent'}`}
                            >
                                <span className={`font-medium ${preset === p.value ? 'text-primary' : 'text-foreground'}`}>
                                    {p.label}
                                </span>
                                <span className="block text-xs text-muted-foreground mt-0.5">
                                    {p.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icon library */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                        Icon library
                    </label>
                    <div className="space-y-2">
                        {ICON_LIBRARIES.map((lib) => (
                            <button
                                key={lib.value}
                                onClick={() => setProvider(lib.value)}
                                className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors
                                    ${iconLibraryId === lib.value
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:bg-accent'}`}
                            >
                                <span className={`font-medium flex items-center gap-2 ${iconLibraryId === lib.value ? 'text-primary' : 'text-foreground'}`}>
                                    <Icon name="palette" size={12} />
                                    {lib.label}
                                </span>
                                <span className="block text-xs text-muted-foreground mt-0.5">
                                    {lib.description}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Weight picker — only when Phosphor is active */}
                    {iconLibraryId === 'phosphor' && (
                        <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-2">Weight</p>
                            <div className="flex gap-1 flex-wrap">
                                {PHOSPHOR_WEIGHTS.map((w) => (
                                    <button
                                        key={w.value}
                                        onClick={() => {
                                            registerProvider('phosphor', new PhosphorIconProvider(w.value));
                                            setProvider('phosphor');
                                        }}
                                        className="px-2 py-1 text-xs rounded border border-border hover:bg-accent transition-colors"
                                    >
                                        {w.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Icon preview row */}
                    <div className="mt-3 flex items-center gap-3 px-1">
                        {(['sun', 'moon', 'bell', 'settings', 'search', 'trash'] as const).map((name) => (
                            <Icon key={name} name={name} size={16} className="text-muted-foreground" />
                        ))}
                    </div>
                </div>

            </div>
        </Modal>
    );
}
