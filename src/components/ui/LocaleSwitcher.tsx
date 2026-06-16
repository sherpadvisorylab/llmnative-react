import React from 'react';
import { useI18n } from '../../I18n';
import Icon from './Icon';

const DEFAULT_LABELS: Record<string, string> = {
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    pt: 'Português',
    nl: 'Nederlands',
    pl: 'Polski',
    ru: 'Русский',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
};

export interface LocaleSwitcherProps {
    /** Icon name passed to the Icon component. Default: 'Globe'. */
    icon?: string;
    /** Optional visible label rendered before the select. */
    label?: string;
    /** Override display names for locale codes. Merged with built-in defaults. */
    labels?: Record<string, string>;
    /** 'code' shows abbreviated codes (EN, IT). 'full' shows the full language name. Default: 'code'. */
    appearance?: 'code' | 'full';
    className?: string;
}

const LocaleSwitcher = ({ icon = 'Globe', label, labels, appearance = 'code', className = '' }: LocaleSwitcherProps) => {
    const { locale, availableLocales, setLocale } = useI18n();

    if (availableLocales.length <= 1) return null;

    const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

    const getOptionLabel = (loc: string) =>
        appearance === 'code' ? loc.toUpperCase() : (resolvedLabels[loc] ?? loc.toUpperCase());

    return (
        <div className={`flex items-center gap-1.5 ${className}`.trim()}>
            <Icon name={icon} size={16} aria-hidden />
            {label && <span className="text-sm">{label}</span>}
            <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="cursor-pointer rounded border border-border bg-transparent py-0.5 pl-1 pr-5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                style={{ width: 'auto' }}
                aria-label={label ?? 'Select language'}
            >
                {availableLocales.map((loc) => (
                    <option key={loc} value={loc}>
                        {getOptionLabel(loc)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LocaleSwitcher;
