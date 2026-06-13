import React from 'react';
import { useI18n } from '../../I18n';
import Icon from './Icon';

// Human-readable labels for the most common locale codes.
// Consumers can override via the `labels` prop.
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
    className?: string;
}

const LocaleSwitcher = ({ icon = 'Globe', label, labels, className = '' }: LocaleSwitcherProps) => {
    const { locale, availableLocales, setLocale } = useI18n();

    if (availableLocales.length <= 1) return null;

    const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

    return (
        <div className={`d-flex align-items-center gap-2 ${className}`.trim()}>
            <Icon name={icon} size={16} aria-hidden />
            {label && <span className="small">{label}</span>}
            <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="form-select form-select-sm"
                style={{ width: 'auto', minWidth: '6rem' }}
                aria-label={label ?? 'Select language'}
            >
                {availableLocales.map((loc) => (
                    <option key={loc} value={loc}>
                        {resolvedLabels[loc] ?? loc.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LocaleSwitcher;
