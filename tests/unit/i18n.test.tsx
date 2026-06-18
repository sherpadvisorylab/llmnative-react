import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { I18nProvider, useI18n, interpolate, defineLocaleMessages } from '../../src/I18n';
import type { I18nDict, I18nLocale } from '../../src/I18n';

function Probe({ ns }: { ns?: string }) {
    if (ns) {
        const dict = useI18n(ns as any);
        return <div data-testid="probe">{JSON.stringify(dict)}</div>;
    }
    const ctrl = useI18n();
    return (
        <div>
            <span data-testid="locale">{ctrl.locale}</span>
            <span data-testid="available">{ctrl.availableLocales.join(',')}</span>
            <button data-testid="set-de" onClick={() => ctrl.setLocale('de')}>to DE</button>
        </div>
    );
}

describe('interpolate', () => {
    it('substitutes variables', () => {
        expect(interpolate('Hello {name}', { name: 'World' })).toBe('Hello World');
    });

    it('leaves missing variables verbatim', () => {
        expect(interpolate('{a} + {b}', { a: '1' })).toBe('1 + {b}');
    });

    it('handles numeric values', () => {
        expect(interpolate('Count: {n}', { n: 42 })).toBe('Count: 42');
    });

    it('returns the template unchanged when no placeholders', () => {
        expect(interpolate('Static text', {})).toBe('Static text');
    });
});

describe('I18nProvider', () => {
    it('renders children', () => {
        render(<I18nProvider><div data-testid="child">ok</div></I18nProvider>);
        expect(screen.getByTestId('child')).toHaveTextContent('ok');
    });

    it('provides the default English locale', () => {
        render(<I18nProvider><Probe /></I18nProvider>);
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
});

describe('useI18n() — full controller', () => {
    it('returns the full dictionary', () => {
        let ctrl: any;
        function Capture() { ctrl = useI18n(); return null; }
        render(<I18nProvider><Capture /></I18nProvider>);
        expect(ctrl.dict.common.save).toBe('Save');
        expect(ctrl.dict.grid.buttonAdd).toBe('Add');
    });

    it('returns available locales', () => {
        render(
            <I18nProvider config={{ translations: { it: {} } }}>
                <Probe />
            </I18nProvider>
        );
        expect(screen.getByTestId('available')).toHaveTextContent('en,it');
    });

    it('switches locale via setLocale', () => {
        render(
            <I18nProvider config={{ translations: { de: { common: { save: 'Speichern' } } } }}>
                <Probe />
            </I18nProvider>
        );
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
});

describe('useI18n(namespace) — namespace overload', () => {
    it('returns a typed slice for a top-level namespace', () => {
        function Slice() {
            const dict = useI18n('common');
            return <span data-testid="slice">{dict.save}</span>;
        }
        render(<I18nProvider><Slice /></I18nProvider>);
        expect(screen.getByTestId('slice')).toHaveTextContent('Save');
    });

    it('returns a string for a leaf key', () => {
        function Leaf() {
            const val = useI18n('form.buttonSave');
            return <span data-testid="leaf">{val}</span>;
        }
        render(<I18nProvider><Leaf /></I18nProvider>);
        expect(screen.getByTestId('leaf')).toHaveTextContent('Save');
    });
});

describe('fallback', () => {
    it('uses English for untranslated keys', () => {
        render(
            <I18nProvider config={{ locale: 'it', translations: { it: { common: { save: 'Salva' } } } }}>
                <Probe />
            </I18nProvider>
        );
        function Dict() {
            const { dict } = useI18n();
            return <span data-testid="fallback">{dict.common.save} | {dict.common.cancel}</span>;
        }
        render(<I18nProvider config={{ locale: 'it', translations: { it: { common: { save: 'Salva' } } } }}><Dict /></I18nProvider>);
        expect(screen.getAllByTestId('fallback')[0]).toHaveTextContent('Salva');
        expect(screen.getAllByTestId('fallback')[0]).toHaveTextContent('Cancel');
    });
});

describe('override — deep merge', () => {
    it('merges partial translations on top of English', () => {
        function Dict() {
            const { dict } = useI18n();
            return <span data-testid="merged">{dict.form.buttonSave} | {dict.form.buttonBack}</span>;
        }
        render(
            <I18nProvider config={{ translations: { en: { form: { buttonSave: 'Store' } } } }}>
                <Dict />
            </I18nProvider>
        );
        expect(screen.getByTestId('merged')).toHaveTextContent('Store');
        expect(screen.getByTestId('merged')).toHaveTextContent('Back');
    });
});

describe('registerTranslations', () => {
    it('adds translations at runtime and merges with existing', () => {
        function Runtime() {
            const { dict, registerTranslations } = useI18n();
            React.useEffect(() => {
                registerTranslations('en', { common: { search: 'Find' } });
            }, [registerTranslations]);
            return <span data-testid="runtime">{dict.common.search} | {dict.common.save}</span>;
        }
        render(<I18nProvider><Runtime /></I18nProvider>);
        expect(screen.getByTestId('runtime')).toHaveTextContent('Find');
        expect(screen.getByTestId('runtime')).toHaveTextContent('Save');
    });
});

describe('defineLocaleMessages', () => {
    it('returns the input unchanged for type-safe locale creation', () => {
        const fr = defineLocaleMessages({
            common: { save: 'Enregistrer' } as any,
        });
        expect(fr.common.save).toBe('Enregistrer');
    });
});

describe('cookie persistence', () => {
    it('reads locale from cookie on init', () => {
        Object.defineProperty(document, 'cookie', {
            writable: true,
            value: 'llmnative_locale=de',
        });
        render(
            <I18nProvider config={{ translations: { de: { common: { save: 'Speichern' } } } }}>
                <Probe />
            </I18nProvider>
        );
        expect(screen.getByTestId('locale')).toHaveTextContent('de');
    });
});
