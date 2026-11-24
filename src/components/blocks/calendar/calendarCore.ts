/**
 * CR-150 — the pure part of `Calendar`: the period of a view, the grid of a month, the events of a period and the
 * layout of the events that overlap in a day. Dates are local (the time zone of the browser); every end is exclusive.
 */

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

/** An event as the app gives it: `start`/`end` as `Date` or an ISO string. */
export interface CalendarEventInput {
    readonly id: string;
    readonly title: string;
    readonly start: Date | string;
    /** Exclusive. Without it a timed event lasts `defaultDuration` minutes; an all-day one its day. */
    readonly end?: Date | string | null;
    readonly allDay?: boolean;
}

/** An event with its dates as `Date`, its end always set. */
export interface NormalizedEvent<E extends CalendarEventInput = CalendarEventInput> {
    readonly event: E;
    readonly start: Date;
    readonly end: Date;
    readonly allDay: boolean;
}

export interface CalendarRange {
    readonly start: Date;
    /** Exclusive. */
    readonly end: Date;
}

const MINUTE = 60_000;

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const addDays = (date: Date, days: number): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
export const addMonths = (date: Date, months: number): Date => {
    const first = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return new Date(first.getFullYear(), first.getMonth(), Math.min(date.getDate(), last));
};
export const sameDay = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const startOfWeek = (date: Date, weekStartsOn: number): Date => {
    const day = startOfDay(date);
    return addDays(day, -((day.getDay() - weekStartsOn + 7) % 7));
};
/** The day as `YYYY-MM-DD`, local. */
export const dayKey = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** The period a view shows around `date`: a day, a week, the weeks of a month, a month (agenda). */
export function viewRange(view: CalendarView, date: Date, weekStartsOn = 1): CalendarRange {
    if (view === 'day') {
        const start = startOfDay(date);
        return { start, end: addDays(start, 1) };
    }
    if (view === 'week') {
        const start = startOfWeek(date, weekStartsOn);
        return { start, end: addDays(start, 7) };
    }
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    if (view === 'agenda') return { start: first, end: next };
    const start = startOfWeek(first, weekStartsOn);
    const end = addDays(startOfWeek(addDays(next, -1), weekStartsOn), 7);
    return { start, end };
}

/** The date one period before (`-1`) or after (`1`). */
export function stepDate(view: CalendarView, date: Date, direction: -1 | 1): Date {
    if (view === 'day') return addDays(date, direction);
    if (view === 'week') return addDays(date, 7 * direction);
    return addMonths(date, direction);
}

/** The days of a period, one per day. */
export function daysOf(range: CalendarRange): Date[] {
    const days: Date[] = [];
    for (let day = startOfDay(range.start); day < range.end; day = addDays(day, 1)) days.push(day);
    return days;
}

/** The weeks of the month of `date`, each of seven days (from `weekStartsOn`). */
export function monthGrid(date: Date, weekStartsOn = 1): Date[][] {
    const days = daysOf(viewRange('month', date, weekStartsOn));
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
}

const toDate = (value: Date | string): Date => (value instanceof Date ? value : new Date(value));

/** An event with its dates as `Date`; `null` when its start is not a date. */
export function normalizeEvent<E extends CalendarEventInput>(event: E, defaultDuration = 30): NormalizedEvent<E> | null {
    const start = toDate(event.start);
    if (Number.isNaN(start.getTime())) return null;
    const allDay = event.allDay === true;
    const given = event.end ? toDate(event.end) : null;
    const end = given && !Number.isNaN(given.getTime()) && given > start
        ? given
        : allDay ? addDays(startOfDay(start), 1) : new Date(start.getTime() + defaultDuration * MINUTE);
    return { event, start: allDay ? startOfDay(start) : start, end, allDay };
}

/** The events that touch the period, by start (all-day first on the same start), then by length, longest first. */
export function eventsInRange<E extends CalendarEventInput>(events: readonly NormalizedEvent<E>[], range: CalendarRange): NormalizedEvent<E>[] {
    return events
        .filter((e) => e.start < range.end && e.end > range.start)
        .sort((a, b) => a.start.getTime() - b.start.getTime() || Number(b.allDay) - Number(a.allDay) || (b.end.getTime() - b.start.getTime()) - (a.end.getTime() - a.start.getTime()));
}

/** Whether an event is drawn in the band of the whole day: all day, or lasting a day or more. */
export const spansDays = (e: NormalizedEvent): boolean => e.allDay || e.end.getTime() - e.start.getTime() >= 24 * 60 * MINUTE;

/** An event placed in a day of the time grid: minutes from midnight, and its column among the ones it overlaps. */
export interface PlacedEvent<E extends CalendarEventInput = CalendarEventInput> {
    readonly item: NormalizedEvent<E>;
    /** Minutes from the start of the day, clipped to the day. */
    readonly top: number;
    /** Minutes, at least `minDuration`. */
    readonly height: number;
    readonly column: number;
    readonly columns: number;
}

/**
 * The timed events of a day side by side where they overlap: each cluster of events that overlap (directly or through
 * another one) shares its width in as many columns as it needs; each event takes the first free column.
 */
export function layoutDay<E extends CalendarEventInput>(events: readonly NormalizedEvent<E>[], day: Date, minDuration = 20): PlacedEvent<E>[] {
    const start = startOfDay(day);
    const end = addDays(start, 1);
    const items = events
        .filter((e) => !spansDays(e) && e.start < end && e.end > start)
        .map((item) => {
            const from = Math.max(item.start.getTime(), start.getTime());
            const to = Math.min(item.end.getTime(), end.getTime());
            const top = (from - start.getTime()) / MINUTE;
            return { item, top, bottom: Math.min(24 * 60, top + Math.max(minDuration, (to - from) / MINUTE)) };
        })
        .sort((a, b) => a.top - b.top || b.bottom - a.bottom);
    const placed: PlacedEvent<E>[] = [];
    let cluster: { item: NormalizedEvent<E>; top: number; bottom: number; column: number }[] = [];
    let clusterEnd = -1;
    const flush = () => {
        const columns = cluster.reduce((max, c) => Math.max(max, c.column + 1), 0);
        for (const c of cluster) placed.push({ item: c.item, top: c.top, height: c.bottom - c.top, column: c.column, columns });
        cluster = [];
    };
    for (const entry of items) {
        if (cluster.length && entry.top >= clusterEnd) flush();
        // The first column whose last event ended by this start.
        const used = new Set(cluster.filter((c) => c.bottom > entry.top).map((c) => c.column));
        let column = 0;
        while (used.has(column)) column++;
        cluster.push({ ...entry, column });
        clusterEnd = Math.max(clusterEnd, entry.bottom);
    }
    if (cluster.length) flush();
    return placed;
}

/** The events of each day of a period (an event on several days is on each), by day key. */
export function eventsByDay<E extends CalendarEventInput>(events: readonly NormalizedEvent<E>[], range: CalendarRange): Map<string, NormalizedEvent<E>[]> {
    const byDay = new Map<string, NormalizedEvent<E>[]>();
    for (const day of daysOf(range)) {
        const next = addDays(day, 1);
        byDay.set(dayKey(day), eventsInRange(events, { start: day, end: next }));
    }
    return byDay;
}
