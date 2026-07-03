import React, { useMemo } from 'react';
import { useIconController } from '../../providers/icon/IconProviderContext';
import { PhosphorIconProvider } from '../../providers/icon/PhosphorIconProvider';
import type { PhosphorWeight } from '../../providers/icon/PhosphorIconProvider';
import { useThemeController } from '../../Theme';
import type { ColorScale } from '../../Theme';
import type { UIProps } from '../types';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';
import { cn } from '../../libs/cn';

export interface ThemeSwitcherThemeOption {
    label?: string;
    description?: string;
}

export interface ThemeSwitcherProps extends UIProps {
    open?: boolean;
    onClose?: () => void;
    surface?: 'flat' | 'modal';
    showHeader?: boolean;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    headerActions?: React.ReactNode;
    themeOptions?: Record<string, ThemeSwitcherThemeOption>;
    showModeSection?: boolean;
    showPrimarySection?: boolean;
    showRadiusSection?: boolean;
    showFontSection?: boolean;
    showStatusSection?: boolean;
    showThemeSection?: boolean;
    showIconLibrarySection?: boolean;
}

type IconLibraryId = 'lucide' | 'phosphor';

interface ColorSwatch {
    label: string;
    value: string;
    hex: string;
}

interface FontOption {
    label: string;
    fontSans: string;
    fontMono: string;
}

interface StatusSwatch {
    value: string;
    fgValue: string;
    hex: string;
}

const COLOR_SWATCHES: ColorSwatch[] = [
    { label: 'Blue', value: '221.2 83.2% 53.3%', hex: '#3b82f6' },
    { label: 'Violet', value: '262.1 83.3% 57.8%', hex: '#8b5cf6' },
    { label: 'Green', value: '142.1 76.2% 36.3%', hex: '#16a34a' },
    { label: 'Rose', value: '346.8 77.2% 49.8%', hex: '#e11d48' },
    { label: 'Orange', value: '24.6 95% 53.1%', hex: '#f97316' },
    { label: 'Slate', value: '215.4 16.3% 46.9%', hex: '#64748b' },
];

const FONT_OPTIONS: FontOption[] = [
    { label: 'System', fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontMono: "ui-monospace, 'SFMono-Regular', monospace" },
    { label: 'Inter', fontSans: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace" },
    { label: 'Geist', fontSans: "'Geist', sans-serif", fontMono: "'Geist Mono', monospace" },
    { label: 'Outfit', fontSans: "'Outfit', sans-serif", fontMono: "'JetBrains Mono', monospace" },
    { label: 'Plus Jakarta Sans', fontSans: "'Plus Jakarta Sans', sans-serif", fontMono: "'Fira Code', monospace" },
    { label: 'DM Sans', fontSans: "'DM Sans', sans-serif", fontMono: "'JetBrains Mono', monospace" },
    { label: 'Nunito', fontSans: "'Nunito', sans-serif", fontMono: "'Fira Code', monospace" },
    { label: 'Figtree', fontSans: "'Figtree', sans-serif", fontMono: "'Source Code Pro', monospace" },
    { label: 'Poppins', fontSans: "'Poppins', sans-serif", fontMono: "'Fira Code', monospace" },
    { label: 'Montserrat', fontSans: "'Montserrat', sans-serif", fontMono: "'Source Code Pro', monospace" },
];

const STATUS_COLORS: { label: string; key: keyof ColorScale; fgKey: keyof ColorScale; swatches: StatusSwatch[] }[] = [
    {
        label: 'Success',
        key: 'success',
        fgKey: 'successForeground',
        swatches: [
            { value: '142.1 76.2% 36.3%', fgValue: '0 0% 100%', hex: '#16a34a' },
            { value: '160 84% 39%', fgValue: '0 0% 0%', hex: '#10b981' },
            { value: '84 55% 46%', fgValue: '0 0% 100%', hex: '#65a30d' },
        ],
    },
    {
        label: 'Warning',
        key: 'warning',
        fgKey: 'warningForeground',
        swatches: [
            { value: '32.1 94.6% 43.7%', fgValue: '0 0% 100%', hex: '#d97706' },
            { value: '24.6 95% 53.1%', fgValue: '0 0% 100%', hex: '#f97316' },
            { value: '45 96% 48%', fgValue: '0 0% 0%', hex: '#eab308' },
        ],
    },
    {
        label: 'Info',
        key: 'info',
        fgKey: 'infoForeground',
        swatches: [
            { value: '198.6 88.7% 48.4%', fgValue: '0 0% 100%', hex: '#0ea5e9' },
            { value: '221.2 83.2% 53.3%', fgValue: '0 0% 100%', hex: '#3b82f6' },
            { value: '262.1 83.3% 57.8%', fgValue: '0 0% 100%', hex: '#8b5cf6' },
        ],
    },
    {
        label: 'Danger',
        key: 'destructive',
        fgKey: 'destructiveForeground',
        swatches: [
            { value: '0 84.2% 60.2%', fgValue: '0 0% 100%', hex: '#ef4444' },
            { value: '346.8 77.2% 49.8%', fgValue: '0 0% 100%', hex: '#e11d48' },
            { value: '0 72% 51%', fgValue: '0 0% 100%', hex: '#dc2626' },
        ],
    },
];

const ICON_LIBRARIES: { label: string; value: IconLibraryId; description: string }[] = [
    { label: 'Lucide', value: 'lucide', description: 'Clean outline icon set' },
    { label: 'Phosphor', value: 'phosphor', description: 'Flexible icon weights and styles' },
];

const PHOSPHOR_WEIGHTS: { label: string; value: PhosphorWeight }[] = [
    { label: 'Thin', value: 'thin' },
    { label: 'Light', value: 'light' },
    { label: 'Regular', value: 'regular' },
    { label: 'Bold', value: 'bold' },
    { label: 'Fill', value: 'fill' },
];

function toThemeLabel(themeId: string): string {
    return themeId
        .split('-')
        .map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : part)
        .join(' ');
}

export default function ThemeSwitcher({
    open = true,
    onClose = undefined,
    surface = 'flat',
    showHeader = undefined,
    title = 'Customize theme',
    subtitle = 'Live theme tokens and mode controls with no reload.',
    headerActions = undefined,
    themeOptions = undefined,
    showModeSection = true,
    showPrimarySection = true,
    showRadiusSection = true,
    showFontSection = true,
    showStatusSection = true,
    showThemeSection = true,
    showIconLibrarySection = true,
    className = undefined,
    wrapperClassName = undefined,
}: ThemeSwitcherProps) {
    const {
        resolvedMode,
        primary,
        radius,
        fontSans,
        theme,
        colors,
        themes,
        toggleMode,
        setPrimary,
        setRadius,
        setFont,
        applyTheme,
        setTokens,
    } = useThemeController();
    const { providerId, setProvider, registerProvider } = useIconController();
    const iconLibraryId = (providerId === 'phosphor' ? 'phosphor' : 'lucide') as IconLibraryId;

    const availableThemes = useMemo(() => {
        return Object.keys(themes).map((themeId) => ({
            value: themeId,
            label: themeOptions?.[themeId]?.label ?? toThemeLabel(themeId),
            description: themeOptions?.[themeId]?.description ?? 'Theme available in the current registry.',
        }));
    }, [themeOptions, themes]);

    const shouldShowHeader = showHeader ?? (surface === 'modal');
    const header = (
        <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold leading-none">{title}</h3>
                {subtitle ? (
                    <div className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</div>
                ) : null}
            </div>
            {headerActions ? (
                <div className="flex shrink-0 items-center gap-2">
                    {headerActions}
                </div>
            ) : null}
        </div>
    );

    const sections = (
        <>
            {showModeSection ? (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Color mode
                    </label>
                    <div className="flex gap-2">
                        {(['light', 'dark'] as const).map((modeOption) => (
                            <button
                                key={modeOption}
                                type="button"
                                onClick={() => resolvedMode !== modeOption && toggleMode()}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium transition-colors ${
                                    resolvedMode === modeOption
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border text-muted-foreground hover:bg-accent'
                                }`}
                            >
                                <Icon name={modeOption === 'light' ? 'sun' : 'moon'} size={14} />
                                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}

            {showPrimarySection ? (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Primary color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COLOR_SWATCHES.map((swatch) => (
                            <button
                                key={swatch.label}
                                type="button"
                                onClick={() => setPrimary(swatch.value)}
                                title={swatch.label}
                                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                    primary === swatch.value ? 'scale-110 border-foreground' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: swatch.hex }}
                                aria-label={swatch.label}
                            />
                        ))}
                    </div>
                </div>
            ) : null}

            {showRadiusSection ? (
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Border radius
                        </label>
                        <span className="text-xs font-mono text-muted-foreground">{radius.toFixed(2)}rem</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={radius}
                        onChange={(event) => setRadius(parseFloat(event.target.value))}
                        className="w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>Sharp</span>
                        <span>Rounded</span>
                    </div>
                </div>
            ) : null}

            {showFontSection ? (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Font
                    </label>
                    <div className="relative">
                        <select
                            value={(FONT_OPTIONS.find((font) => font.fontSans === fontSans) ?? FONT_OPTIONS[0]).fontSans}
                            onChange={(event) => {
                                const selectedFont = FONT_OPTIONS.find((font) => font.fontSans === event.target.value);
                                if (selectedFont) setFont(selectedFont.fontSans, selectedFont.fontMono);
                            }}
                            className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {FONT_OPTIONS.map((font) => (
                                <option key={font.label} value={font.fontSans}>
                                    {font.label}
                                </option>
                            ))}
                        </select>
                        <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>
            ) : null}

            {showStatusSection ? (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Status colors
                    </label>
                    <div className="space-y-2">
                        {STATUS_COLORS.map(({ label, key, fgKey, swatches }) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className="w-14 shrink-0 text-xs text-muted-foreground">{label}</span>
                                <div className="flex gap-1.5">
                                    {swatches.map((swatch) => (
                                        <button
                                            key={swatch.hex}
                                            type="button"
                                            onClick={() => setTokens({ [key]: swatch.value, [fgKey]: swatch.fgValue })}
                                            title={`${label} - ${swatch.hex}`}
                                            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                                                colors?.[key] === swatch.value ? 'scale-110 border-foreground' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: swatch.hex }}
                                            aria-label={`${label} ${swatch.hex}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {showThemeSection ? (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Theme
                    </label>
                    <div className="space-y-2">
                        {availableThemes.map((themeOption) => (
                            <button
                                key={themeOption.value}
                                type="button"
                                onClick={() => applyTheme(themeOption.value)}
                                className={`w-full rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                                    theme === themeOption.value
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:bg-accent'
                                }`}
                            >
                                <span className={`font-medium ${theme === themeOption.value ? 'text-primary' : 'text-foreground'}`}>
                                    {themeOption.label}
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {themeOption.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}

            {showIconLibrarySection ? (
                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Icon library
                    </label>
                    <div className="space-y-2">
                        {ICON_LIBRARIES.map((library) => (
                            <button
                                key={library.value}
                                type="button"
                                onClick={() => setProvider(library.value)}
                                className={`w-full rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                                    iconLibraryId === library.value
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:bg-accent'
                                }`}
                            >
                                <span className={`flex items-center gap-2 font-medium ${iconLibraryId === library.value ? 'text-primary' : 'text-foreground'}`}>
                                    <Icon name="palette" size={12} />
                                    {library.label}
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {library.description}
                                </span>
                            </button>
                        ))}
                    </div>

                    {iconLibraryId === 'phosphor' ? (
                        <div className="mt-3">
                            <p className="mb-2 text-xs text-muted-foreground">Weight</p>
                            <div className="flex flex-wrap gap-1">
                                {PHOSPHOR_WEIGHTS.map((weight) => (
                                    <button
                                        key={weight.value}
                                        type="button"
                                        onClick={() => {
                                            registerProvider('phosphor', new PhosphorIconProvider(weight.value));
                                            setProvider('phosphor');
                                        }}
                                        className="rounded border border-border px-2 py-1 text-xs transition-colors hover:bg-accent"
                                    >
                                        {weight.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-3 flex items-center gap-3 px-1">
                        {(['sun', 'moon', 'bell', 'settings', 'search', 'trash'] as const).map((iconName) => (
                            <Icon key={iconName} name={iconName} size={16} className="text-muted-foreground" />
                        ))}
                    </div>
                </div>
            ) : null}
        </>
    );

    const content = (
        <div className={cn(
            'space-y-6',
            surface === 'flat' && 'rounded-xl border border-border/60 bg-card p-5',
            className,
        )}>
            {surface === 'flat' && shouldShowHeader ? (
                <div className="border-b border-border/60 pb-4">
                    {header}
                </div>
            ) : null}
            {sections}
        </div>
    );

    if (surface === 'modal') {
        if (!open) return null;

        return (
            <Modal
                position="right"
                header={shouldShowHeader ? header : undefined}
                onClose={onClose}
                allowFullscreen={false}
                headerClassName="h-14 !py-0 px-4"
                className={className}
                wrapperClassName={wrapperClassName}
            >
                <div className="space-y-6">{sections}</div>
            </Modal>
        );
    }

    return (
        <div className={wrapperClassName}>
            {content}
        </div>
    );
}
