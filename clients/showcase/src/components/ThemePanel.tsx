import React, { useMemo, useState } from 'react';
import { Modal, Icon, PhosphorIconProvider, useIconController, useThemeController } from 'react-firestrap';
import type { PhosphorWeight, ColorScale } from 'react-firestrap';

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

interface StatusSwatch { value: string; fgValue: string; hex: string; }

const STATUS_COLORS: { label: string; key: keyof ColorScale; fgKey: keyof ColorScale; swatches: StatusSwatch[] }[] = [
    {
        label: 'Success', key: 'success', fgKey: 'successForeground',
        swatches: [
            { value: '142.1 76.2% 36.3%', fgValue: '0 0% 100%', hex: '#16a34a' },
            { value: '160 84% 39%',        fgValue: '0 0% 0%',   hex: '#10b981' },
            { value: '84 55% 46%',         fgValue: '0 0% 100%', hex: '#65a30d' },
        ],
    },
    {
        label: 'Warning', key: 'warning', fgKey: 'warningForeground',
        swatches: [
            { value: '32.1 94.6% 43.7%', fgValue: '0 0% 100%', hex: '#d97706' },
            { value: '24.6 95% 53.1%',   fgValue: '0 0% 100%', hex: '#f97316' },
            { value: '45 96% 48%',       fgValue: '0 0% 0%',   hex: '#eab308' },
        ],
    },
    {
        label: 'Info', key: 'info', fgKey: 'infoForeground',
        swatches: [
            { value: '198.6 88.7% 48.4%', fgValue: '0 0% 100%', hex: '#0ea5e9' },
            { value: '221.2 83.2% 53.3%', fgValue: '0 0% 100%', hex: '#3b82f6' },
            { value: '262.1 83.3% 57.8%', fgValue: '0 0% 100%', hex: '#8b5cf6' },
        ],
    },
    {
        label: 'Danger', key: 'destructive', fgKey: 'destructiveForeground',
        swatches: [
            { value: '0 84.2% 60.2%',     fgValue: '0 0% 100%', hex: '#ef4444' },
            { value: '346.8 77.2% 49.8%', fgValue: '0 0% 100%', hex: '#e11d48' },
            { value: '0 72% 51%',         fgValue: '0 0% 100%', hex: '#dc2626' },
        ],
    },
];

const PHOSPHOR_WEIGHTS: { label: string; value: PhosphorWeight }[] = [
    { label: 'Thin',    value: 'thin' },
    { label: 'Light',   value: 'light' },
    { label: 'Regular', value: 'regular' },
    { label: 'Bold',    value: 'bold' },
    { label: 'Fill',    value: 'fill' },
];

interface FontOption {
    label: string;
    fontSans: string;
    fontMono: string;
    google: boolean;
}

const FONT_OPTIONS: FontOption[] = [
    { label: 'System',             fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontMono: "ui-monospace, 'SFMono-Regular', monospace",    google: false },
    { label: 'Inter',              fontSans: "'Inter', sans-serif",               fontMono: "'JetBrains Mono', monospace",  google: true },
    { label: 'Geist',              fontSans: "'Geist', sans-serif",               fontMono: "'Geist Mono', monospace",      google: true },
    { label: 'Outfit',             fontSans: "'Outfit', sans-serif",              fontMono: "'JetBrains Mono', monospace",  google: true },
    { label: 'Plus Jakarta Sans',  fontSans: "'Plus Jakarta Sans', sans-serif",   fontMono: "'Fira Code', monospace",       google: true },
    { label: 'DM Sans',            fontSans: "'DM Sans', sans-serif",             fontMono: "'JetBrains Mono', monospace",  google: true },
    { label: 'Nunito',             fontSans: "'Nunito', sans-serif",              fontMono: "'Fira Code', monospace",       google: true },
    { label: 'Figtree',            fontSans: "'Figtree', sans-serif",             fontMono: "'Source Code Pro', monospace", google: true },
    { label: 'Poppins',            fontSans: "'Poppins', sans-serif",             fontMono: "'Fira Code', monospace",       google: true },
    { label: 'Montserrat',         fontSans: "'Montserrat', sans-serif",          fontMono: "'Source Code Pro', monospace", google: true },
    { label: 'Raleway',            fontSans: "'Raleway', sans-serif",             fontMono: "'JetBrains Mono', monospace",  google: true },
    { label: 'Open Sans',          fontSans: "'Open Sans', sans-serif",           fontMono: "'Source Code Pro', monospace", google: true },
    { label: 'Lato',               fontSans: "'Lato', sans-serif",               fontMono: "'Fira Code', monospace",       google: true },
    { label: 'Roboto',             fontSans: "'Roboto', sans-serif",              fontMono: "'Fira Code', monospace",       google: true },
];

export default function ThemePanel({ open, onClose }: ThemePanelProps) {
    const { resolvedMode, primary, radius, fontSans, preset, colors, toggleMode, setPrimary, setRadius, setFont, applyPreset, setTokens } = useThemeController();
    const { providerId, setProvider, registerProvider } = useIconController();
    const [copied, setCopied] = useState(false);
    const iconLibraryId = (providerId === 'phosphor' ? 'phosphor' : 'lucide') as IconLibraryId;

    const appConfiguration = useMemo(() => {
        return `import { App } from 'react-firestrap';

<App
    iconProvider="${iconLibraryId}"
    themeProvider={{
        defaultPreset: '${preset}',
        themeOverride: {},
    }}
/>`;
    }, [iconLibraryId, preset]);

    const copyConfiguration = () => {
        navigator.clipboard.writeText(appConfiguration.trim());
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    if (!open) return null;

    const header = (
        <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold leading-none">Customize</h3>
                <div className="mt-1 truncate text-sm text-muted-foreground">Live CSS variables, no reload.</div>
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

                {/* Font */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Font
                        </label>
                        <a
                            href="https://fonts.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Icon name="external-link" size={10} />
                            Google Fonts
                        </a>
                    </div>
                    {(() => {
                        const active = FONT_OPTIONS.find((f) => f.fontSans === fontSans) ?? FONT_OPTIONS[0];
                        return (
                            <div className="space-y-2">
                                <div className="relative">
                                    <select
                                        value={active.fontSans}
                                        onChange={(e) => {
                                            const f = FONT_OPTIONS.find((o) => o.fontSans === e.target.value);
                                            if (f) setFont(f.fontSans, f.fontMono);
                                        }}
                                        className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {FONT_OPTIONS.map((f) => (
                                            <option key={f.label} value={f.fontSans}>
                                                {f.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Status colors */}
                <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                        Status colors
                    </label>
                    <div className="space-y-2">
                        {STATUS_COLORS.map(({ label, key, fgKey, swatches }) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-14 shrink-0">{label}</span>
                                <div className="flex gap-1.5">
                                    {swatches.map((s) => (
                                        <button
                                            key={s.hex}
                                            onClick={() => setTokens({ [key]: s.value, [fgKey]: s.fgValue })}
                                            title={`${label} — ${s.hex}`}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110
                                                ${colors?.[key] === s.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: s.hex }}
                                            aria-label={s.hex}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
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
