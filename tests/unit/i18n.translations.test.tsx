import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { I18nProvider } from '../../src/I18n';
import { it as itDict } from '../../src/conf/i18n/it';
import { renderWithProviders } from '../helpers/renderWithProviders';
import Notifications from '../../src/components/blocks/Notifications';
import Breadcrumbs from '../../src/components/blocks/Breadcrumbs';
import ErrorBoundary from '../../src/components/ErrorBoundary';
import ThemeSwitcher from '../../src/components/blocks/ThemeSwitcher';
import { ThemeProvider } from '../../src/Theme';
import { IconProvider } from '../../src/providers/icon/IconProviderContext';
import { Chatbot } from '../../src/components/widgets/Chatbot';
import Form from '../../src/components/widgets/Form';
import { ImageField } from '../../src/components/ui/fields/ImageField';
import { UploadDocument } from '../../src/components/ui/fields/Upload';
import type { FileProps } from '../../src/components/ui/fields/Upload';
import TabDynamic from '../../src/components/ui/TabDynamic';
import { Input } from '../../src/components/ui/fields/Input';

const itConfig = { locale: 'it', translations: { it: itDict } };

function Bomb(): React.ReactElement {
    throw new Error('Test explosion');
}

describe('i18n — traduzioni it dei componenti', () => {
    let consoleError: typeof console.error;
    beforeEach(() => {
        consoleError = console.error;
        console.error = vi.fn();
    });
    afterEach(() => {
        console.error = consoleError;
    });

    it('Notifications traduce stato vuoto e "segna tutte"', () => {
        renderWithProviders(<Notifications items={[]} />, { i18n: itConfig });
        expect(screen.getByText('Nessuna notifica')).toBeInTheDocument();
        expect(screen.getByText('Sei al passo con tutto')).toBeInTheDocument();
    });

    it('Notifications traduce "segna tutte come lette" con elementi', () => {
        renderWithProviders(
            <Notifications
                items={[{ title: 'Messaggio', url: '/m', time: '1m', icon: 'mail' }]}
                onMarkAllRead={vi.fn()}
            />,
            { i18n: itConfig },
        );
        expect(screen.getByText('Segna tutte come lette')).toBeInTheDocument();
    });

    it('Breadcrumbs traduce aria-label', () => {
        renderWithProviders(<Breadcrumbs trail="/a/b" />, { i18n: itConfig, route: '/a/b' });
        expect(screen.getByLabelText('Percorso di navigazione')).toBeInTheDocument();
    });

    it('Chatbot traduce le etichette delle impostazioni', () => {
        renderWithProviders(
            <Chatbot value="" onChange={vi.fn()} onSubmit={vi.fn()} showSettings />,
            { i18n: itConfig },
        );
        expect(screen.getByTitle('Ruolo')).toBeInTheDocument();
        expect(screen.getByTitle('Lingua')).toBeInTheDocument();
        expect(screen.getByTitle('Voce')).toBeInTheDocument();
        expect(screen.getByTitle('Stile')).toBeInTheDocument();
        expect(screen.getByTitle('Temperatura')).toBeInTheDocument();
    });

    it('ImageField traduce i title delle azioni immagine', () => {
        renderWithProviders(
            <Form defaultValues={{ img: { src: 'https://example.test/a.png', alt: '' } }}>
                <ImageField name="img" />
            </Form>,
            { i18n: itConfig },
        );
        expect(screen.getByTitle('Apri originale')).toBeInTheDocument();
        expect(screen.getByTitle('Ritaglia')).toBeInTheDocument();
    });

    it('UploadDocument traduce la label del nome file nell\'editor', () => {
        const file: FileProps = {
            key: 'contract.pdf',
            fileName: 'contract.pdf',
            size: 2048,
            type: 'application/pdf',
            progress: 100,
            url: 'https://example.test/contract.pdf',
            variants: {},
        };
        renderWithProviders(
            <Form defaultValues={{ doc: [file] }}>
                <UploadDocument name="doc" label="Documento" editable />
            </Form>,
            { i18n: itConfig },
        );
        fireEvent.click(screen.getByText('contract.pdf').closest('tr')!);
        expect(screen.getByText('Nome file')).toBeInTheDocument();
    });

    it('TabDynamic traduce il title "aggiungi scheda"', () => {
        renderWithProviders(
            <Form defaultValues={{ tabs: [{}] }}>
                <TabDynamic name="tabs"><Input name="a" /></TabDynamic>
            </Form>,
            { i18n: itConfig },
        );
        expect(screen.getByTitle('Aggiungi scheda')).toBeInTheDocument();
    });

    it('ThemeSwitcher traduce le etichette delle sezioni', () => {
        renderWithProviders(
            <ThemeProvider>
                <IconProvider>
                    <ThemeSwitcher surface="flat" />
                </IconProvider>
            </ThemeProvider>,
            { i18n: itConfig },
        );
        expect(screen.getByText('Modalità colore')).toBeInTheDocument();
        expect(screen.getByText('Colore primario')).toBeInTheDocument();
        expect(screen.getByText('Spigoloso')).toBeInTheDocument();
        expect(screen.getByText('Arrotondato')).toBeInTheDocument();
    });
});

describe('i18n — ErrorBoundary fuori e dentro il provider', () => {
    let consoleError: typeof console.error;
    beforeEach(() => {
        consoleError = console.error;
        console.error = vi.fn();
    });
    afterEach(() => {
        console.error = consoleError;
    });

    it('renderizza in inglese senza <I18nProvider> senza lanciare', () => {
        render(
            <ErrorBoundary>
                <Bomb />
            </ErrorBoundary>,
        );
        expect(screen.getByText('This page ran into a problem')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });

    it('traduce quando è dentro <I18nProvider>', () => {
        render(
            <I18nProvider config={itConfig}>
                <ErrorBoundary>
                    <Bomb />
                </ErrorBoundary>
            </I18nProvider>,
        );
        expect(screen.getByText('Questa pagina ha riscontrato un problema')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Riprova' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Vai alla home' })).toBeInTheDocument();
    });
});
