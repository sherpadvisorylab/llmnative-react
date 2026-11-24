import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/Theme', () => ({
    useMotionRegistry: vi.fn(() => ({})),
    useTheme: vi.fn(() => ({
        ActionButton: { className: '', badgeClass: '' },
        LoadingButton: { className: '', badgeClass: '', spinnerClass: '' },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import { Calendar, layoutDay, monthGrid, normalizeEvent, stepDate, viewRange, type CalendarEvent } from '../../../src/components';
import { I18nProvider } from '../../../src/I18n';
import { it as italian } from '../../../src/conf/i18n';

// CR-150 — the calendar: its pure part, then the component.

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }),
    });
});

const giorno = (d: number, h = 0, m = 0) => new Date(2026, 10, d, h, m);

describe('the periods of the views', () => {
    it('a day, a week from Monday, the weeks of a month, a month for the list', () => {
        const date = giorno(25, 15);
        expect(viewRange('day', date)).toEqual({ start: giorno(25), end: giorno(26) });
        expect(viewRange('week', date)).toEqual({ start: giorno(23), end: giorno(30) });
        expect(viewRange('week', date, 0)).toEqual({ start: giorno(22), end: giorno(29) });
        // November 2026: from Monday 26 October to Sunday 6 December.
        expect(viewRange('month', date)).toEqual({ start: new Date(2026, 9, 26), end: new Date(2026, 11, 7) });
        expect(viewRange('agenda', date)).toEqual({ start: giorno(1), end: new Date(2026, 11, 1) });
        expect(monthGrid(date).map((week) => week.length)).toEqual([7, 7, 7, 7, 7, 7]);
    });

    it('steps by a day, a week, a month (the 31st becomes the last day of a shorter month)', () => {
        expect(stepDate('day', giorno(30), 1)).toEqual(new Date(2026, 11, 1));
        expect(stepDate('week', giorno(25), -1)).toEqual(giorno(18));
        expect(stepDate('month', new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
    });
});

describe('the events of a day', () => {
    const ev = (id: string, start: Date, end?: Date, allDay = false) => normalizeEvent({ id, title: id, start, end, allDay })!;

    it('an event without an end lasts the default; an all-day one its day', () => {
        expect(ev('a', giorno(25, 9)).end).toEqual(giorno(25, 9, 30));
        expect(ev('b', giorno(25, 9), undefined, true)).toMatchObject({ start: giorno(25), end: giorno(26), allDay: true });
        expect(normalizeEvent({ id: 'x', title: 'x', start: 'not a date' })).toBeNull();
    });

    it('overlapping events share the width in columns; the ones apart take it all', () => {
        const placed = layoutDay([
            ev('a', giorno(25, 9), giorno(25, 10)),
            ev('b', giorno(25, 9, 30), giorno(25, 11)),
            ev('c', giorno(25, 10), giorno(25, 10, 30)),
            ev('d', giorno(25, 14), giorno(25, 15)),
            ev('tutto', giorno(25), undefined, true),
        ], giorno(25));
        const by = Object.fromEntries(placed.map((p) => [p.item.event.id, p]));
        expect(Object.keys(by).sort()).toEqual(['a', 'b', 'c', 'd']);
        expect([by.a!.column, by.b!.column, by.c!.column]).toEqual([0, 1, 0]);
        expect([by.a!.columns, by.b!.columns, by.c!.columns]).toEqual([2, 2, 2]);
        expect([by.d!.column, by.d!.columns, by.d!.top, by.d!.height]).toEqual([0, 1, 14 * 60, 60]);
    });
});

describe('Calendar', () => {
    const eventi: CalendarEvent[] = [
        { id: 'e1', title: 'Riunione Rossi', start: giorno(25, 9), end: giorno(25, 10), calendarId: 'carla' },
        { id: 'e2', title: 'Chiama Bianchi', start: giorno(25, 9, 30), calendarId: 'marco' },
        { id: 'e3', title: 'Fiera', start: giorno(26), allDay: true, calendarId: 'carla' },
        ...[10, 11, 12, 13].map((h) => ({ id: `m${h}`, title: `Visita ${h}`, start: giorno(27, h), calendarId: 'carla' })),
    ];
    const calendari = [
        { id: 'carla', label: 'Carla', group: 'Collaboratori' },
        { id: 'marco', label: 'Marco', group: 'Collaboratori', color: 3 },
    ];
    const mount = (props: Partial<React.ComponentProps<typeof Calendar>> = {}) => render(
        <I18nProvider config={{ locale: 'it', translations: { it: italian } }}>
            <Calendar events={eventi} calendars={calendari} defaultDate={giorno(25)} {...props} />
        </I18nProvider>,
    );

    it('the week: days in columns, side by side where they overlap, the all-day ones on top; the period to the app', () => {
        const onRangeChange = vi.fn();
        const { container } = mount({ onRangeChange });
        expect(container.querySelector('[data-rf-calendar="week"]')).not.toBeNull();
        expect(onRangeChange).toHaveBeenCalledWith({ start: giorno(23), end: giorno(30), view: 'week' });
        expect(screen.getByRole('button', { name: /Riunione Rossi, 09:00 – 10:00/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Chiama Bianchi, 09:30 – 10:00/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Fiera, Tutto il giorno/ })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Periodo successivo' }));
        expect(onRangeChange).toHaveBeenLastCalledWith({ start: giorno(30), end: new Date(2026, 11, 7), view: 'week' });
    });

    it('a calendar unchecked hides its events; at most maxSelected together', () => {
        mount({ maxSelected: 1, defaultSelectedCalendarIds: ['carla'] });
        expect(screen.queryByRole('button', { name: /Chiama Bianchi/ })).toBeNull();
        const marco = screen.getByRole('checkbox', { name: /Marco/ });
        expect(marco).toBeDisabled();
        expect(screen.getByText('Al massimo 1 insieme')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('checkbox', { name: /Carla/ }));
        expect(screen.queryByRole('button', { name: /Riunione Rossi/ })).toBeNull();
        expect(screen.getByRole('checkbox', { name: /Marco/ })).not.toBeDisabled();
    });

    it('the month: a few events per day, then «+N» that opens the day', () => {
        const onViewChange = vi.fn();
        mount({ defaultView: 'month', maxEventsPerDay: 2, onViewChange });
        expect(screen.getByRole('grid', { name: 'novembre 2026' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: '+2 altri' }));
        expect(onViewChange).toHaveBeenCalledWith('day');
        expect(screen.getByRole('button', { name: /Visita 13/ })).toBeInTheDocument();
    });

    it('the list: the days with something, in order; empty when there is nothing', () => {
        const { container, unmount } = mount({ defaultView: 'agenda' });
        const giorni = [...container.querySelectorAll('ol > li')].map((li) => within(li as HTMLElement).getAllByRole('button').map((b) => b.textContent));
        expect(giorni[0]).toEqual([expect.stringContaining('Riunione Rossi'), expect.stringContaining('Chiama Bianchi')]);
        unmount();
        render(
            <I18nProvider config={{ locale: 'it', translations: { it: italian } }}>
                <Calendar events={[]} defaultView="agenda" defaultDate={giorno(25)} />
            </I18nProvider>,
        );
        expect(screen.getByText('Niente in programma.')).toBeInTheDocument();
    });

    it('a click on an event, and on a free slot of the day (half an hour)', () => {
        const onEventClick = vi.fn();
        const onSlotClick = vi.fn();
        mount({ defaultView: 'day', onEventClick, onSlotClick, hourHeight: 48 });
        fireEvent.click(screen.getByRole('button', { name: /Riunione Rossi/ }));
        expect(onEventClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'e1' }));
        expect(onSlotClick).not.toHaveBeenCalled();
        const colonna = screen.getByRole('group', { name: /mercoledì 25 novembre 2026/ });
        colonna.getBoundingClientRect = () => ({ top: 0, left: 0, right: 100, bottom: 1152, width: 100, height: 1152, x: 0, y: 0, toJSON() {} });
        fireEvent.click(colonna, { clientY: 14.5 * 48 });
        expect(onSlotClick).toHaveBeenCalledWith({ start: giorno(25, 14, 30), end: giorno(25, 15), allDay: false });
    });

    it('the head of the grid keeps the room of the scrollbar of the body; fill takes the height of the container', () => {
        const { container, unmount } = mount();
        const scroller = container.querySelector('[data-rf-calendar-scroll]') as HTMLElement;
        expect(scroller.getAttribute('style')).toMatch(/scrollbar-gutter: stable/);
        const heads = [...container.querySelectorAll('.grid.shrink-0')] as HTMLElement[];
        expect(heads.length).toBeGreaterThan(0);
        expect(heads.every((head) => /scrollbar-gutter: stable/.test(head.getAttribute('style') ?? '') && head.style.overflowY === 'hidden')).toBe(true);
        unmount();
        const pieno = mount({ fill: true });
        expect(pieno.container.querySelector('section')!.className).toContain('h-full');
        const grid = pieno.container.querySelector('[data-rf-calendar-scroll]') as HTMLElement;
        expect(grid.className).toContain('flex-1');
        expect(grid.getAttribute('style') ?? '').not.toMatch(/(^|;\s*)height/);
    });

    it('keys: t today, n and p the periods, d w m a the views', () => {
        const onViewChange = vi.fn();
        const onDateChange = vi.fn();
        const { container } = mount({ onViewChange, onDateChange });
        const root = container.querySelector('section') as HTMLElement;
        fireEvent.keyDown(root, { key: 'm' });
        expect(onViewChange).toHaveBeenLastCalledWith('month');
        fireEvent.keyDown(root, { key: 'n' });
        expect(onDateChange).toHaveBeenLastCalledWith(new Date(2026, 11, 25));
    });
});
