import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { PageSection, SectionLayout, SectionNav } from '../../../src/components/blocks/SectionNav';
import { I18nProvider } from '../../../src/I18n';

// CR-131: the menu of the sections of a page, with the section on screen.

const SECTIONS = [
    { id: 'posta', label: 'Posta in uscita', group: 'Configurazione' },
    { id: 'caselle', label: 'Caselle di posta', group: 'Configurazione', badge: <span>Interrotta</span> },
    { id: 'catalogo', label: 'Catalogo', group: 'Dati' },
];

function Page({ offset = 0 }: { offset?: number }) {
    return (
        <I18nProvider>
            <SectionLayout sections={SECTIONS} offset={offset}>
                <PageSection id="posta" title="Posta in uscita" description="Da dove parte la posta" actions={<button type="button">Modifica</button>} offset={offset}>riepilogo</PageSection>
                <PageSection id="caselle" title="Caselle di posta" offset={offset}>caselle</PageSection>
                <PageSection id="catalogo" title="Catalogo" offset={offset}>prodotti</PageSection>
            </SectionLayout>
        </I18nProvider>
    );
}

/** Puts the tops of the sections where the test says, as after a scroll, and says the page scrolled. */
function scrollTo(tops: Record<string, number>, target: EventTarget = window) {
    for (const [id, top] of Object.entries(tops)) {
        const element = document.getElementById(id)!;
        element.getBoundingClientRect = () => ({ top, bottom: top + 400, left: 0, right: 800, width: 800, height: 400, x: 0, y: top, toJSON: () => ({}) });
    }
    act(() => { target.dispatchEvent(new Event('scroll')); });
}

/** The label of the current entry (without its badge). */
const current = () => screen.getAllByRole('link').find((a) => a.getAttribute('aria-current') === 'location')?.querySelector('span')?.textContent;

beforeEach(() => {
    window.history.replaceState(null, '', '/impostazioni');
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { callback(0); return 1; });
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
});
afterEach(() => vi.unstubAllGlobals());

describe('SectionNav', () => {
    it('lists the sections in their groups, as links to their anchors, in a named menu', () => {
        render(<Page />);
        const nav = screen.getByRole('navigation', { name: 'Sections of the page' });
        expect([...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(['#posta', '#caselle', '#catalogo']);
        expect(nav.textContent).toContain('Configurazione');
        expect(nav.textContent).toContain('Dati');
        expect(nav.textContent).toContain('Interrotta');
        expect(current()).toBe('Posta in uscita');
    });

    it('highlights the last section whose top has passed the line below the header', () => {
        render(<Page offset={64} />);
        scrollTo({ posta: -500, caselle: 90, catalogo: 500 });
        expect(current()).toBe('Caselle di posta');
        scrollTo({ posta: -900, caselle: -400, catalogo: 120 });
        expect(current()).toBe('Caselle di posta');
        scrollTo({ posta: -900, caselle: -400, catalogo: 96 });
        expect(current()).toBe('Catalogo');
    });

    it('measures in the area that scrolls (a layout main), not the window', () => {
        render(<main style={{ overflowY: 'auto' }} data-testid="main"><Page /></main>);
        const main = screen.getByTestId('main');
        main.getBoundingClientRect = () => ({ top: 56, bottom: 800, left: 0, right: 800, width: 800, height: 744, x: 0, y: 56, toJSON: () => ({}) });
        scrollTo({ posta: -300, caselle: 80, catalogo: 400 }, main);
        expect(current()).toBe('Caselle di posta');
    });

    it('on a small screen the line moves below the row of the menu', () => {
        vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('max-width'), media: query, addEventListener() {}, removeEventListener() {} }));
        render(<Page />);
        const nav = screen.getByRole('navigation');
        nav.getBoundingClientRect = () => ({ top: 0, bottom: 48, left: 0, right: 390, width: 390, height: 48, x: 0, y: 0, toJSON: () => ({}) });
        scrollTo({ posta: -300, caselle: 70, catalogo: 400 });
        expect(current()).toBe('Caselle di posta');
        scrollTo({ posta: -300, caselle: 90, catalogo: 400 });
        expect(current()).toBe('Posta in uscita');
    });

    it('goes to a section: scrolls, puts it in the address and moves the focus there', () => {
        render(<Page />);
        fireEvent.click(screen.getByRole('link', { name: 'Catalogo' }));
        const section = document.getElementById('catalogo')!;
        expect(section.scrollIntoView).toHaveBeenCalled();
        expect(window.location.hash).toBe('#catalogo');
        expect(window.location.pathname).toBe('/impostazioni');
        expect(document.activeElement).toBe(section);
        expect(current()).toBe('Catalogo');
    });

    it('keeps the chosen section at the end of the page, where it cannot reach the line', () => {
        render(<Page />);
        const scroller = document.scrollingElement as HTMLElement;
        Object.defineProperties(scroller, { scrollHeight: { configurable: true, value: 2000 }, clientHeight: { configurable: true, value: 800 }, scrollTop: { configurable: true, value: 1200 } });
        fireEvent.click(screen.getByRole('link', { name: 'Catalogo' }));
        scrollTo({ posta: -900, caselle: 10, catalogo: 400 });
        expect(current()).toBe('Catalogo');
        act(() => { window.dispatchEvent(new Event('wheel')); });
        scrollTo({ posta: -900, caselle: 10, catalogo: 400 });
        expect(current()).toBe('Caselle di posta');
    });

    it('opens on the section of the hash', () => {
        window.history.replaceState(null, '', '/impostazioni#caselle');
        render(<Page />);
        expect(current()).toBe('Caselle di posta');
    });

    it('leaves a click with a modifier to the browser (a new tab)', () => {
        render(<Page />);
        const notCancelled = fireEvent.click(screen.getByRole('link', { name: 'Catalogo' }), { ctrlKey: true });
        expect(notCancelled).toBe(true);
        expect(document.getElementById('catalogo')!.scrollIntoView).not.toHaveBeenCalled();
        expect(document.activeElement).not.toBe(document.getElementById('catalogo'));
    });

    it('takes a label of its own', () => {
        render(<I18nProvider><SectionNav sections={SECTIONS} label="Impostazioni" /></I18nProvider>);
        expect(screen.getByRole('navigation', { name: 'Impostazioni' })).toBeTruthy();
    });
});

describe('PageSection', () => {
    it('is a section named by its title, with description, actions and the margin of the header', () => {
        render(<Page offset={64} />);
        const section = screen.getByRole('region', { name: 'Posta in uscita' });
        expect(section.id).toBe('posta');
        expect(section.style.getPropertyValue('--rf-section-offset')).toBe('80px');
        expect(section.className).toContain('max-lg:scroll-mt-[calc(var(--rf-section-offset)+3.5rem)]');
        expect(section.textContent).toContain('Da dove parte la posta');
        expect(screen.getByRole('button', { name: 'Modifica' })).toBeTruthy();
    });
});
