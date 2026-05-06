import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    IconProviderProvider,
    LucideIconProvider,
    PhosphorIconProvider,
} from 'react-firestrap';
import type { IconProvider } from 'react-firestrap';

export type ColorMode = 'light' | 'dark';
export type ThemePreset = 'default' | 'flat' | 'cyber';
export type IconLibraryId = 'lucide' | 'phosphor';

export interface ColorSwatch {
    label: string;
    value: string;
    hex: string;
}

export const COLOR_SWATCHES: ColorSwatch[] = [
    { label: 'Blue',   value: '221.2 83.2% 53.3%', hex: '#3b82f6' },
    { label: 'Violet', value: '262.1 83.3% 57.8%', hex: '#8b5cf6' },
    { label: 'Green',  value: '142.1 76.2% 36.3%', hex: '#16a34a' },
    { label: 'Rose',   value: '346.8 77.2% 49.8%', hex: '#e11d48' },
    { label: 'Orange', value: '24.6 95% 53.1%',    hex: '#f97316' },
    { label: 'Slate',  value: '215.4 16.3% 46.9%', hex: '#64748b' },
];

interface ThemeVars {
    primary: string;
    radius: number;
}

export const PRESET_VARS: Record<ThemePreset, ThemeVars> = {
    default: { primary: '221.2 83.2% 53.3%', radius: 0.5 },
    flat:    { primary: '215 25% 27%',        radius: 0.125 },
    cyber:   { primary: '160 84% 39%',        radius: 0 },
};

interface ThemeState {
    mode: ColorMode;
    primary: string;
    radius: number;
    preset: ThemePreset;
}

interface ThemeContextValue extends ThemeState {
    setMode: (mode: ColorMode) => void;
    toggleMode: () => void;
    setPrimary: (hsl: string) => void;
    setRadius: (rem: number) => void;
    applyPreset: (preset: ThemePreset) => void;
    iconLibraryId: IconLibraryId;
    setIconLibrary: (id: IconLibraryId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyVars(state: Partial<ThemeState>) {
    const root = document.documentElement;
    if (state.mode !== undefined) root.classList.toggle('dark', state.mode === 'dark');
    if (state.primary !== undefined) {
        root.style.setProperty('--rf-primary', state.primary);
        root.style.setProperty('--rf-primary-foreground', '210 40% 98%');
    }
    if (state.radius !== undefined) root.style.setProperty('--radius', `${state.radius}rem`);
}

function makeProvider(id: IconLibraryId): IconProvider {
    return id === 'phosphor' ? new PhosphorIconProvider() : new LucideIconProvider();
}

export function ShowcaseThemeProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ThemeState>({
        mode: 'light',
        primary: PRESET_VARS.default.primary,
        radius: PRESET_VARS.default.radius,
        preset: 'default',
    });
    const [iconLibraryId, setIconLibraryId] = useState<IconLibraryId>('lucide');
    const [iconProvider, setIconProviderState] = useState<IconProvider>(() => new LucideIconProvider());

    useEffect(() => { applyVars(state); }, []);

    const setMode = useCallback((mode: ColorMode) => {
        applyVars({ mode });
        setState((s) => ({ ...s, mode, preset: 'default' }));
    }, []);

    const toggleMode = useCallback(() => {
        setState((s) => {
            const mode: ColorMode = s.mode === 'light' ? 'dark' : 'light';
            applyVars({ mode });
            return { ...s, mode };
        });
    }, []);

    const setPrimary = useCallback((primary: string) => {
        applyVars({ primary });
        setState((s) => ({ ...s, primary, preset: 'default' }));
    }, []);

    const setRadius = useCallback((radius: number) => {
        applyVars({ radius });
        setState((s) => ({ ...s, radius, preset: 'default' }));
    }, []);

    const applyPreset = useCallback((preset: ThemePreset) => {
        const vars = PRESET_VARS[preset];
        applyVars(vars);
        setState((s) => ({ ...s, ...vars, preset }));
    }, []);

    const setIconLibrary = useCallback((id: IconLibraryId) => {
        setIconLibraryId(id);
        setIconProviderState(makeProvider(id));
    }, []);

    return (
        <ThemeContext.Provider value={{ ...state, setMode, toggleMode, setPrimary, setRadius, applyPreset, iconLibraryId, setIconLibrary }}>
            <IconProviderProvider provider={iconProvider}>
                {children}
            </IconProviderProvider>
        </ThemeContext.Provider>
    );
}

export function useShowcaseTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useShowcaseTheme must be used inside ShowcaseThemeProvider');
    return ctx;
}
