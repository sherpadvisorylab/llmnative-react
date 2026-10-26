/**
 * CR-097 — the visible texts of these components follow the active locale (Italian here).
 * The English side is covered by each component's own tests.
 */
import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../../../src/I18n';
import { it as itDict } from '../../../src/conf/i18n';
import { DataProvider } from '../../../src/providers/data/DataProviderContext';
import { MockDataProvider } from '../../../src/providers/data/mock';
import { HeadProvider } from '../../../src/Head';
import Notifications from '../../../src/components/blocks/Notifications';
import ErrorBoundary from '../../../src/components/ErrorBoundary';
import ThemeSwitcher from '../../../src/components/blocks/ThemeSwitcher';
import { ImageField } from '../../../src/components/ui/fields/ImageField';
import { RichText } from '../../../src/components/ui/fields/RichText';
import { UploadDocument } from '../../../src/components/ui/fields/Upload';
import TabDynamic from '../../../src/components/widgets/TabDynamic';
import Grid from '../../../src/components/widgets/Grid';
import { Chatbot } from '../../../src/components/widgets/Chatbot';
import { Breadcrumbs } from '../../../src/components/blocks/Breadcrumbs';
import Form from '../../../src/components/widgets/Form';

// ThemeSwitcher drives the theme and the icon library: their controllers are stubbed.
let iconProviderId = 'lucide';
vi.mock('../../../src/Theme', async () => {
    const actual = await vi.importActual<typeof import('../../../src/Theme')>('../../../src/Theme');
    return {
        ...actual,
        useThemeController: () => ({
            resolvedMode: 'light', primary: '', radius: 0.5, fontSans: '', theme: 'default', colors: {},
            themes: { default: {} }, toggleMode: vi.fn(), setPrimary: vi.fn(), setRadius: vi.fn(), setFont: vi.fn(),
            applyTheme: vi.fn(), setTokens: vi.fn(),
        }),
    };
});
vi.mock('../../../src/providers/icon/IconProviderContext', async () => {
    const actual = await vi.importActual<typeof import('../../../src/providers/icon/IconProviderContext')>(
        '../../../src/providers/icon/IconProviderContext',
    );
    return {
        ...actual,
        useIconController: () => ({ providerId: iconProviderId, setProvider: vi.fn(), registerProvider: vi.fn() }),
    };
});

function renderIn(ui: React.ReactElement, locale: 'it' | 'en' = 'it') {
    return render(
        <MemoryRouter>
            <DataProvider registry={{ default: new MockDataProvider() }} defaultKey="default">
                <HeadProvider>
                    <I18nProvider config={{ locale, translations: { it: itDict } }}>{ui}</I18nProvider>
                </HeadProvider>
            </DataProvider>
        </MemoryRouter>,
    );
}

describe('Notifications', () => {
    it('shows the empty state in the active locale', () => {
        renderIn(<Notifications items={[]} />);
        expect(screen.getByText('Nessuna notifica')).toBeInTheDocument();
        expect(screen.getByText('Sei in pari')).toBeInTheDocument();
    });

    it('translates "mark all read"', () => {
        renderIn(<Notifications items={[{ title: 'Nuovo ticket', time: 'ora', icon: 'bell' }]} onMarkAllRead={vi.fn()} />);
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getByRole('button', { name: 'Segna tutte come lette' })).toBeInTheDocument();
    });
});

describe('ErrorBoundary', () => {
    let consoleError: typeof console.error;
    beforeEach(() => { consoleError = console.error; console.error = vi.fn(); });
    afterEach(() => { console.error = consoleError; });

    function Bomb(): React.ReactElement { throw new Error('Boom'); }

    it('translates the error screen inside <I18nProvider>', () => {
        renderIn(<ErrorBoundary debug reportUrl="/report"><Bomb /></ErrorBoundary>);
        expect(screen.getByText('Questa pagina ha avuto un problema')).toBeInTheDocument();
        expect(screen.getByText('Dettagli tecnici')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Riprova' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Vai alla home' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Invia segnalazione/ })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Informazioni di debug/ }));
        expect(screen.getByText('Contesto')).toBeInTheDocument();
        expect(screen.getByText('Ora')).toBeInTheDocument();
        expect(screen.getByText('Agente')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Copia info di debug/ })).toBeInTheDocument();
    });

    it('falls back to English outside <I18nProvider>', () => {
        render(<ErrorBoundary><Bomb /></ErrorBoundary>);
        expect(screen.getByText('This page ran into a problem')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go to home' })).toBeInTheDocument();
    });
});

describe('ThemeSwitcher', () => {
    afterEach(() => { iconProviderId = 'lucide'; });

    it('translates sections, modes, radius ends and swatches', () => {
        renderIn(<ThemeSwitcher surface="flat" showHeader />);
        expect(screen.getByText('Personalizza tema')).toBeInTheDocument();
        expect(screen.getByText('Modalità colore')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Chiaro/ })).toBeInTheDocument();
        expect(screen.getByText('Squadrato')).toBeInTheDocument();
        expect(screen.getByText('Arrotondato')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Blu' })).toBeInTheDocument();
        expect(screen.getByText('Colori di stato')).toBeInTheDocument();
        expect(screen.getByText('Tema disponibile nel registro corrente.')).toBeInTheDocument();
    });

    it('translates the Phosphor weights', () => {
        iconProviderId = 'phosphor';
        renderIn(<ThemeSwitcher surface="flat" />);
        expect(screen.getByText('Spessore')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Grassetto' })).toBeInTheDocument();
    });

    it('keeps an explicit title', () => {
        renderIn(<ThemeSwitcher surface="flat" showHeader title="Aspetto" subtitle={null} />);
        expect(screen.getByText('Aspetto')).toBeInTheDocument();
        expect(screen.queryByText('Personalizza tema')).not.toBeInTheDocument();
    });
});

describe('ImageField', () => {
    it('translates its labels and buttons', () => {
        renderIn(
            <Form defaultValues={{ cover: { src: 'https://example.com/a.png', alt: '' } }}>
                <ImageField name="cover" />
            </Form>,
        );
        expect(screen.getByText('URL immagine')).toBeInTheDocument();
        expect(screen.getByText('Testo alternativo')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Es. Foto principale del prodotto')).toBeInTheDocument();
        expect(screen.getByTitle('Apri originale')).toBeInTheDocument();
        expect(screen.getByTitle('Ritaglia')).toBeInTheDocument();
    });
});

describe('RichText', () => {
    it('translates the toolbar and the status bar', async () => {
        renderIn(
            <Form defaultValues={{ body: '<p>Ciao a tutti</p>' }}>
                <RichText name="body" toolbarCommands={['bold', 'italic', 'headings', 'table', 'sourceCode']} statusBar />
            </Form>,
        );
        expect(await screen.findByTitle('Grassetto', {}, { timeout: 15_000 })).toBeInTheDocument();
        expect(screen.getByTitle('Corsivo')).toBeInTheDocument();
        expect(screen.getByTitle('Stile paragrafo')).toBeInTheDocument();
        expect(screen.getByTitle('Inserisci tabella')).toBeInTheDocument();
        expect(screen.getByTitle('Codice sorgente')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText(/\d+ parole/)).toBeInTheDocument());
    }, 20_000);
});

describe('UploadDocument', () => {
    it('translates the file name of the editor', () => {
        renderIn(
            <Form defaultValues={{ docs: [{ key: 'a', fileName: 'contratto.pdf', size: 1, type: 'application/pdf', progress: 100, url: 'https://example.com/contratto.pdf', variants: {} }] }}>
                <UploadDocument name="docs" editable />
            </Form>,
        );
        fireEvent.click(screen.getByText('contratto.pdf').closest('tr')!);
        expect(screen.getByText('Nome file')).toBeInTheDocument();
    });
});

describe('TabDynamic', () => {
    it('translates the add-tab button', () => {
        renderIn(
            <Form defaultValues={{ tabs: [{ title: 'Uno' }] }}>
                <TabDynamic name="tabs">{() => <div />}</TabDynamic>
            </Form>,
        );
        expect(screen.getByTitle('Aggiungi scheda')).toBeInTheDocument();
    });
});

describe('Grid', () => {
    it('translates the view toggle and the column picker', () => {
        renderIn(<Grid records={[{ _key: '1', name: 'Uno' }]} views={{ toggle: true, table: { columnPicker: true } }} />);
        expect(screen.getByRole('button', { name: 'Vista tabella' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Vista galleria' })).toBeInTheDocument();
        expect(screen.getByTitle('Colonne')).toBeInTheDocument();
    });
});

describe('Chatbot', () => {
    it('translates the settings menus', () => {
        renderIn(<Chatbot value="" onChange={vi.fn()} onSubmit={vi.fn()} showSettings />);
        for (const name of ['Ruolo', 'Lingua', 'Voce', 'Stile', 'Temperatura']) {
            expect(screen.getByTitle(name)).toBeInTheDocument();
        }
    });
});

describe('Breadcrumbs', () => {
    it('names the navigation in the active locale', () => {
        renderIn(<Breadcrumbs trail={[{ label: 'Clienti', href: '/clienti' }, { label: 'Acme' }]} />);
        expect(screen.getByRole('navigation', { name: 'Percorso di navigazione' })).toBeInTheDocument();
    });
});
