import React, { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../libs/cn';
import { useI18n } from '../../I18n';
import { ActionButton } from '../ui/Buttons';
import Icon from '../ui/Icon';
import { chartFill, chartToken, type ChartColor } from '../charts/chartCore';
import {
    addDays, dayKey, daysOf, eventsByDay, layoutDay, monthGrid, normalizeEvent, sameDay, spansDays, startOfDay, stepDate, viewRange,
    type CalendarEventInput, type CalendarRange, type CalendarView, type NormalizedEvent,
} from './calendar/calendarCore';

export type { CalendarView, CalendarRange } from './calendar/calendarCore';
export { viewRange, stepDate, monthGrid, layoutDay, normalizeEvent, eventsInRange, eventsByDay } from './calendar/calendarCore';

/** An event of the calendar. */
export interface CalendarEvent extends CalendarEventInput {
    /** The calendar it belongs to: its colour, and hidden with it. */
    readonly calendarId?: string;
    /** An icon of the active provider, before the title. */
    readonly icon?: string;
    /** Its own colour (a chart slot or a `--token`), over the one of its calendar. */
    readonly color?: ChartColor;
    /** A second line (agenda, tooltip). */
    readonly description?: string;
}

/** A calendar that events belong to (a person, a room): its colour and whether it is shown. */
export interface CalendarSource {
    readonly id: string;
    readonly label: string;
    /** A chart slot (1–8) or a `--token`; by default its place in the list. */
    readonly color?: ChartColor;
    readonly description?: string;
    /** A heading the calendars are grouped under, in the order they come. */
    readonly group?: string;
}

/** A free slot clicked: where a new event would go. */
export interface CalendarSlot {
    readonly start: Date;
    readonly end: Date;
    readonly allDay: boolean;
}

export interface CalendarProps {
    events: readonly CalendarEvent[];
    /** The calendars, in the side column with their colour and their check. */
    calendars?: readonly CalendarSource[];
    /** Controlled: the calendars shown. */
    selectedCalendarIds?: readonly string[];
    /** Uncontrolled: the calendars shown at first; by default all. */
    defaultSelectedCalendarIds?: readonly string[];
    onSelectedCalendarsChange?: (ids: string[]) => void;
    /** At most this many calendars shown together (the others cannot be checked). */
    maxSelected?: number;
    view?: CalendarView;
    /** By default `week`, `agenda` on a narrow screen. */
    defaultView?: CalendarView;
    onViewChange?: (view: CalendarView) => void;
    /** The views offered, in this order. */
    views?: readonly CalendarView[];
    date?: Date;
    defaultDate?: Date;
    onDateChange?: (date: Date) => void;
    /** The period shown, at first and at each change: load its events. */
    onRangeChange?: (range: CalendarRange & { readonly view: CalendarView }) => void;
    onEventClick?: (event: CalendarEvent) => void;
    /** A free slot clicked (half an hour of the grid, or a day of the month): to create an event there. */
    onSlotClick?: (slot: CalendarSlot) => void;
    /** The content of an event, instead of its time and title. */
    renderEvent?: (event: CalendarEvent, context: { readonly view: CalendarView; readonly compact: boolean }) => ReactNode;
    /** 0 Sunday … 6 Saturday; by default Monday. */
    weekStartsOn?: number;
    /** The hour the day and week open on. */
    scrollToHour?: number;
    /** The height of an hour, in px. */
    hourHeight?: number;
    /** Events shown in a day of the month before «+N». */
    maxEventsPerDay?: number;
    /** Minutes of an event with no end. */
    defaultDuration?: number;
    /** The side column (mini month and calendars); by default when there are calendars. */
    sidebar?: boolean;
    loading?: boolean;
    /** Next to the views, in the bar. */
    actions?: ReactNode;
    /** The height of the time grid of day and week; by default it fits the screen. */
    height?: number | string;
    ariaLabel?: string;
    className?: string;
}

const VIEWS: readonly CalendarView[] = ['day', 'week', 'month', 'agenda'];

/** Whether the screen is narrower than `px` (false where there is no window). */
function useNarrow(px: number): boolean {
    const query = `(max-width: ${px - 1}px)`;
    const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches);
    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
        const list = window.matchMedia(query);
        const change = () => setNarrow(list.matches);
        list.addEventListener?.('change', change);
        return () => list.removeEventListener?.('change', change);
    }, [query]);
    return narrow;
}

/** A value controlled by a prop, or kept here. */
function useControlled<T>(controlled: T | undefined, initial: () => T, onChange?: (value: T) => void): [T, (value: T) => void] {
    const [own, setOwn] = useState<T>(initial);
    const value = controlled === undefined ? own : controlled;
    return [value, (next: T) => {
        if (controlled === undefined) setOwn(next);
        onChange?.(next);
    }];
}

/** The time now, again each minute. */
function useNow(active: boolean): Date {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        if (!active) return undefined;
        setNow(new Date());
        const timer = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(timer);
    }, [active]);
    return now;
}

/**
 * CR-150 — a calendar as the common ones: day, week, month and agenda; the calendars of people or rooms with their
 * colour, shown or hidden from the side column. The app gives the events of the period shown (`onRangeChange`).
 */
export function Calendar({
    events, calendars, selectedCalendarIds, defaultSelectedCalendarIds, onSelectedCalendarsChange, maxSelected,
    view: viewProp, defaultView, onViewChange, views = VIEWS, date: dateProp, defaultDate, onDateChange, onRangeChange,
    onEventClick, onSlotClick, renderEvent, weekStartsOn = 1, scrollToHour = 8, hourHeight = 48, maxEventsPerDay = 3,
    defaultDuration = 30, sidebar, loading = false, actions, height, ariaLabel, className,
}: CalendarProps) {
    const dict = useI18n('calendar');
    const { locale } = useI18n();
    const narrow = useNarrow(640);
    const [view, setView] = useControlled<CalendarView>(viewProp, () => defaultView ?? (narrow && views.includes('agenda') ? 'agenda' : views.includes('week') ? 'week' : views[0]!), onViewChange);
    const [date, setDate] = useControlled<Date>(dateProp, () => startOfDay(defaultDate ?? new Date()), onDateChange);
    const allIds = useMemo(() => (calendars ?? []).map((c) => c.id), [calendars]);
    const [selected, setSelected] = useControlled<readonly string[]>(selectedCalendarIds, () => defaultSelectedCalendarIds ?? allIds, onSelectedCalendarsChange as ((ids: readonly string[]) => void) | undefined);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const showSidebar = sidebar ?? Boolean(calendars?.length);
    const range = useMemo(() => viewRange(view, date, weekStartsOn), [view, date, weekStartsOn]);

    // The period shown, to the app, once per change.
    const rangeKey = `${view}:${range.start.getTime()}:${range.end.getTime()}`;
    const onRange = useRef(onRangeChange);
    onRange.current = onRangeChange;
    useEffect(() => { onRange.current?.({ ...range, view }); }, [rangeKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const colors = useMemo(() => new Map((calendars ?? []).map((c, i) => [c.id, chartToken(c.color, i + 1)])), [calendars]);
    const shown = useMemo(() => new Set(selected), [selected]);
    const normalized = useMemo(() => events
        .filter((e) => !calendars?.length || !e.calendarId || shown.has(e.calendarId))
        .map((e) => normalizeEvent(e, defaultDuration))
        .filter((e): e is NormalizedEvent<CalendarEvent> => e !== null), [events, calendars, shown, defaultDuration]);
    const tokenOf = (event: CalendarEvent) => (event.color !== undefined ? chartToken(event.color) : (event.calendarId && colors.get(event.calendarId)) || chartToken(undefined, 1));

    const format = useMemo(() => ({
        time: new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }),
        weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
        weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
        dayMonth: new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }),
        full: new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        monthYear: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
        short: new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
    }), [locale]);
    const title = view === 'day'
        ? format.full.format(date)
        : view === 'week'
            ? formatRange(format.short, range.start, addDays(range.end, -1))
            : format.monthYear.format(date);

    const go = (next: Date) => setDate(startOfDay(next));
    const toggle = (id: string) => {
        const has = shown.has(id);
        if (!has && maxSelected !== undefined && selected.length >= maxSelected) return;
        setSelected(has ? selected.filter((x) => x !== id) : [...selected, id]);
    };
    const openDay = (day: Date) => {
        go(day);
        if (views.includes('day')) setView('day');
    };

    // Keys, when the focus is in the calendar and not in a field: t today, p/n before/after, d/w/m/a the views.
    const onKeyDown = (event: React.KeyboardEvent) => {
        const target = event.target as HTMLElement;
        if (event.altKey || event.ctrlKey || event.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
        const key = event.key.toLowerCase();
        const byKey: Record<string, CalendarView> = { d: 'day', w: 'week', m: 'month', a: 'agenda' };
        if (key === 't') go(new Date());
        else if (key === 'p' || key === 'k') go(stepDate(view, date, -1));
        else if (key === 'n' || key === 'j') go(stepDate(view, date, 1));
        else if (byKey[key] && views.includes(byKey[key]!)) setView(byKey[key]!);
        else return;
        event.preventDefault();
    };

    const eventProps = { onEventClick, renderEvent, tokenOf, format, dict };
    return (
        <section aria-label={ariaLabel ?? dict.title} className={cn('flex min-w-0 flex-col gap-3', className)} onKeyDown={onKeyDown} data-rf-calendar={view}>
            <div className="flex flex-wrap items-center gap-2">
                {showSidebar ? (
                    <ActionButton icon="menu" variant="link" ariaLabel={dict.calendars} wrapperClassName="lg:hidden" onClick={() => setSidebarOpen((open) => !open)} />
                ) : null}
                <ActionButton label={dict.today} variant="secondary" onClick={() => go(new Date())} />
                <div className="flex items-center">
                    <ActionButton icon="chevron-left" variant="link" ariaLabel={dict.previous} onClick={() => go(stepDate(view, date, -1))} />
                    <ActionButton icon="chevron-right" variant="link" ariaLabel={dict.next} onClick={() => go(stepDate(view, date, 1))} />
                </div>
                <h2 className="min-w-0 flex-1 truncate text-lg font-semibold first-letter:uppercase text-foreground" aria-live="polite">{title}</h2>
                {loading ? <span className="inline-block size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" role="status" aria-label={dict.loading} /> : null}
                {actions}
                {views.length > 1 ? (
                    <div className="inline-flex rounded-lg border border-border p-0.5" role="group" aria-label={dict.view}>
                        {views.map((v) => (
                            <ActionButton key={v} label={dict.views[v]} variant={view === v ? 'primary' : 'link'} className="h-8 px-3 text-sm" onClick={() => setView(v)} />
                        ))}
                    </div>
                ) : null}
            </div>
            <div className="flex min-w-0 gap-4">
                {showSidebar ? (
                    <aside className={cn('w-60 shrink-0 flex-col gap-5', sidebarOpen ? 'flex' : 'hidden lg:flex')} aria-label={dict.calendars}>
                        <MiniMonth date={date} range={range} weekStartsOn={weekStartsOn} format={format} dict={dict} onPick={(day) => { go(day); setSidebarOpen(false); }} />
                        {calendars?.length ? (
                            <CalendarList calendars={calendars} colors={colors} shown={shown} maxSelected={maxSelected} selectedCount={selected.length} onToggle={toggle} dict={dict} />
                        ) : null}
                    </aside>
                ) : null}
                <div className={cn('min-w-0 flex-1 transition-opacity', loading && 'opacity-60')}>
                    {view === 'day' || view === 'week' ? (
                        <TimeGrid days={daysOf(range)} events={normalized} hourHeight={hourHeight} scrollToHour={scrollToHour} height={height} view={view} onSlotClick={onSlotClick} openDay={views.includes('day') ? openDay : undefined} {...eventProps} />
                    ) : view === 'month' ? (
                        <MonthView date={date} weekStartsOn={weekStartsOn} events={normalized} maxEventsPerDay={maxEventsPerDay} onSlotClick={onSlotClick} openDay={openDay} {...eventProps} />
                    ) : (
                        <AgendaView range={range} events={normalized} {...eventProps} />
                    )}
                </div>
            </div>
        </section>
    );
}

type Formats = {
    time: Intl.DateTimeFormat; weekday: Intl.DateTimeFormat; weekdayLong: Intl.DateTimeFormat; dayMonth: Intl.DateTimeFormat;
    full: Intl.DateTimeFormat; monthYear: Intl.DateTimeFormat; short: Intl.DateTimeFormat;
};
type Dict = ReturnType<typeof useI18n<'calendar'>>;
interface EventProps {
    onEventClick?: (event: CalendarEvent) => void;
    renderEvent?: CalendarProps['renderEvent'];
    tokenOf: (event: CalendarEvent) => string;
    format: Formats;
    dict: Dict;
}

/** A period as «23 – 29 nov 2026», with the range format where the browser has it. */
function formatRange(format: Intl.DateTimeFormat, start: Date, end: Date): string {
    const ranged = format as Intl.DateTimeFormat & { formatRange?: (a: Date, b: Date) => string };
    return typeof ranged.formatRange === 'function' ? ranged.formatRange(start, end) : `${format.format(start)} – ${format.format(end)}`;
}

/** The time of an event, for its label: «09:00 – 10:30», or the whole day. */
function timeOf(item: NormalizedEvent<CalendarEvent>, format: Formats, dict: Dict): string {
    if (spansDays(item)) return dict.allDay;
    return `${format.time.format(item.start)} – ${format.time.format(item.end)}`;
}

/** An event as a button: its colour, time and title (or what `renderEvent` draws). */
function EventButton({ item, compact, view, className, style, onEventClick, renderEvent, tokenOf, format, dict }: EventProps & {
    item: NormalizedEvent<CalendarEvent>; compact: boolean; view: CalendarView; className?: string; style?: React.CSSProperties;
}) {
    const { event } = item;
    const token = tokenOf(event);
    const when = timeOf(item, format, dict);
    const content = renderEvent ? renderEvent(event, { view, compact }) : (
        <>
            <span className="flex min-w-0 items-center gap-1 font-medium">
                {event.icon ? <Icon name={event.icon} size={12} className="shrink-0" /> : null}
                <span className="truncate">{event.title}</span>
            </span>
            {!compact ? <span className="block truncate opacity-80">{when}</span> : null}
        </>
    );
    return (
        <button
            type="button"
            data-rf-calendar-event={event.id}
            title={`${event.title} · ${when}${event.description ? `\n${event.description}` : ''}`}
            aria-label={`${event.title}, ${when}`}
            onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
            className={cn('min-w-0 overflow-hidden rounded-md border-l-[3px] px-1.5 py-0.5 text-start text-xs text-foreground outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring', !onEventClick && 'cursor-default', className)}
            style={{ background: chartFill(token, 0.16), borderLeftColor: chartFill(token), ...style }}
        >
            {content}
        </button>
    );
}

/** Day and week: the days in columns, the hours down, the all-day events on top, the line of now. */
function TimeGrid({ days, events, hourHeight, scrollToHour, height, view, onSlotClick, openDay, ...eventProps }: EventProps & {
    days: Date[]; events: NormalizedEvent<CalendarEvent>[]; hourHeight: number; scrollToHour: number; height?: number | string;
    view: CalendarView; onSlotClick?: (slot: CalendarSlot) => void; openDay?: (day: Date) => void;
}) {
    const { format, dict } = eventProps;
    const scroller = useRef<HTMLDivElement | null>(null);
    const today = days.some((day) => sameDay(day, new Date()));
    const now = useNow(today);
    const range = { start: days[0]!, end: addDays(days[days.length - 1]!, 1) };
    const byDay = useMemo(() => eventsByDay(events, range), [events, range.start.getTime(), range.end.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps
    const placed = useMemo(() => days.map((day) => layoutDay(events, day)), [events, days.length, range.start.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps
    const allDay = days.map((day) => (byDay.get(dayKey(day)) ?? []).filter(spansDays));
    const hasAllDay = allDay.some((list) => list.length > 0);
    const minute = hourHeight / 60;
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const columns = `3.5rem repeat(${days.length}, minmax(0, 1fr))`;

    useEffect(() => {
        if (scroller.current) scroller.current.scrollTop = Math.max(0, scrollToHour * hourHeight - 8);
    }, [view, scrollToHour, hourHeight]);

    const slotAt = (day: Date, event: React.MouseEvent<HTMLDivElement>) => {
        if (!onSlotClick) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const minutes = Math.max(0, Math.min(24 * 60 - 30, Math.floor((event.clientY - rect.top) / minute / 30) * 30));
        const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);
        onSlotClick({ start, end: new Date(start.getTime() + 30 * 60_000), allDay: false });
    };

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid border-b border-border" style={{ gridTemplateColumns: columns }}>
                <div />
                {days.map((day) => {
                    const isToday = sameDay(day, new Date());
                    const label = `${format.weekday.format(day)} ${day.getDate()}`;
                    return (
                        <div key={dayKey(day)} className="flex flex-col items-center gap-0.5 border-l border-border py-2 text-center">
                            <span className={cn('text-xs uppercase tracking-wide', isToday ? 'text-primary' : 'text-muted-foreground')}>{format.weekday.format(day)}</span>
                            {openDay && view === 'week' ? (
                                <button type="button" aria-label={format.full.format(day)} onClick={() => openDay(day)} className={cn('flex size-9 items-center justify-center rounded-full text-lg tabular-nums outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring', isToday && 'bg-primary text-primary-foreground hover:bg-primary')}>{day.getDate()}</button>
                            ) : (
                                <span aria-label={label} className={cn('flex size-9 items-center justify-center rounded-full text-lg tabular-nums', isToday && 'bg-primary text-primary-foreground')}>{day.getDate()}</span>
                            )}
                        </div>
                    );
                })}
            </div>
            {hasAllDay ? (
                <div className="grid border-b border-border" style={{ gridTemplateColumns: columns }}>
                    <div className="px-1 py-1 text-end text-[10px] text-muted-foreground">{dict.allDay}</div>
                    {allDay.map((list, i) => (
                        <div key={i} className="flex min-w-0 flex-col gap-0.5 border-l border-border p-0.5">
                            {list.map((item) => <EventButton key={item.event.id} item={item} compact view={view} {...eventProps} />)}
                        </div>
                    ))}
                </div>
            ) : null}
            <div ref={scroller} className="overflow-y-auto" style={{ height: height ?? 'min(70vh, 44rem)' }}>
                <div className="relative grid" style={{ gridTemplateColumns: columns, height: 24 * hourHeight }}>
                    <div className="relative">
                        {hours.map((h) => (
                            <span key={h} className="absolute end-1.5 -translate-y-1/2 text-[10px] tabular-nums text-muted-foreground" style={{ top: h * hourHeight }}>
                                {h === 0 ? '' : format.time.format(new Date(2000, 0, 1, h))}
                            </span>
                        ))}
                    </div>
                    {days.map((day, i) => (
                        <div
                            key={dayKey(day)}
                            role="group"
                            aria-label={format.full.format(day)}
                            className={cn('relative border-l border-border', onSlotClick && 'cursor-pointer')}
                            onClick={onSlotClick ? (event) => slotAt(day, event) : undefined}
                            style={{ backgroundImage: `repeating-linear-gradient(to bottom, hsl(var(--rf-border)) 0 1px, transparent 1px ${hourHeight}px)` }}
                        >
                            {placed[i]!.map((p) => (
                                <EventButton
                                    key={p.item.event.id}
                                    item={p.item}
                                    compact={p.height * minute < 36}
                                    view={view}
                                    className="absolute"
                                    style={{ top: p.top * minute + 1, height: Math.max(18, p.height * minute - 2), left: `calc(${(p.column / p.columns) * 100}% + 2px)`, width: `calc(${100 / p.columns}% - 4px)` }}
                                    {...eventProps}
                                />
                            ))}
                            {sameDay(day, now) ? (
                                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: (now.getHours() * 60 + now.getMinutes()) * minute }}>
                                    <span className="-ms-1 size-2.5 rounded-full bg-destructive" />
                                    <span className="h-0.5 flex-1 bg-destructive" />
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** The month: its weeks, a few events per day and «+N» that opens the day. */
function MonthView({ date, weekStartsOn, events, maxEventsPerDay, onSlotClick, openDay, ...eventProps }: EventProps & {
    date: Date; weekStartsOn: number; events: NormalizedEvent<CalendarEvent>[]; maxEventsPerDay: number;
    onSlotClick?: (slot: CalendarSlot) => void; openDay: (day: Date) => void;
}) {
    const { format, dict } = eventProps;
    const weeks = useMemo(() => monthGrid(date, weekStartsOn), [date, weekStartsOn]);
    const range = { start: weeks[0]![0]!, end: addDays(weeks[weeks.length - 1]![6]!, 1) };
    const byDay = useMemo(() => eventsByDay(events, range), [events, range.start.getTime(), range.end.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card" role="grid" aria-label={format.monthYear.format(date)}>
            <div className="grid grid-cols-7 border-b border-border" role="row">
                {weeks[0]!.map((day) => (
                    <div key={dayKey(day)} role="columnheader" className="py-2 text-center text-xs uppercase tracking-wide text-muted-foreground">{format.weekday.format(day)}</div>
                ))}
            </div>
            {weeks.map((week) => (
                <div key={dayKey(week[0]!)} className="grid grid-cols-7" role="row">
                    {week.map((day, i) => {
                        const list = byDay.get(dayKey(day)) ?? [];
                        const other = day.getMonth() !== date.getMonth();
                        const isToday = sameDay(day, new Date());
                        const extra = list.length - maxEventsPerDay;
                        return (
                            <div
                                key={dayKey(day)}
                                role="gridcell"
                                className={cn('flex min-h-[6.5rem] min-w-0 flex-col gap-0.5 border-b border-border p-1', i > 0 && 'border-l', other && 'bg-muted/40', onSlotClick && 'cursor-pointer')}
                                onClick={onSlotClick ? () => onSlotClick({ start: day, end: addDays(day, 1), allDay: true }) : undefined}
                            >
                                <button
                                    type="button"
                                    aria-label={format.full.format(day)}
                                    onClick={(e) => { e.stopPropagation(); openDay(day); }}
                                    className={cn('mx-auto flex size-7 items-center justify-center rounded-full text-sm tabular-nums outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring', other && 'text-muted-foreground', isToday && 'bg-primary text-primary-foreground hover:bg-primary')}
                                >{day.getDate()}</button>
                                {list.slice(0, maxEventsPerDay).map((item) => (
                                    <EventButton key={item.event.id} item={item} compact view="month" {...eventProps}
                                        renderEvent={eventProps.renderEvent ?? ((event) => (
                                            <span className="flex min-w-0 items-center gap-1">
                                                {!spansDays(item) ? <span className="shrink-0 tabular-nums opacity-80">{format.time.format(item.start)}</span> : null}
                                                <span className="truncate font-medium">{event.title}</span>
                                            </span>
                                        ))}
                                    />
                                ))}
                                {extra > 0 ? (
                                    <button type="button" onClick={(e) => { e.stopPropagation(); openDay(day); }} className="rounded px-1.5 text-start text-xs font-medium text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                                        {dict.more.replace('{n}', String(extra))}
                                    </button>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

/** The agenda: the days of the period with something, each with its events in order. */
function AgendaView({ range, events, ...eventProps }: EventProps & { range: CalendarRange; events: NormalizedEvent<CalendarEvent>[] }) {
    const { format, dict, tokenOf, onEventClick, renderEvent } = eventProps;
    const byDay = useMemo(() => eventsByDay(events, range), [events, range]);
    const days = daysOf(range).filter((day) => (byDay.get(dayKey(day)) ?? []).length > 0);
    if (!days.length) return <p className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">{dict.noEvents}</p>;
    return (
        <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {days.map((day) => {
                const isToday = sameDay(day, new Date());
                return (
                    <li key={dayKey(day)} className="flex flex-col gap-2 p-3 sm:flex-row sm:gap-4">
                        <div className="flex items-baseline gap-2 sm:w-40 sm:shrink-0">
                            <span className={cn('flex size-8 items-center justify-center rounded-full text-base font-semibold tabular-nums', isToday && 'bg-primary text-primary-foreground')}>{day.getDate()}</span>
                            <span className="text-sm text-muted-foreground first-letter:uppercase">{format.weekdayLong.format(day)}</span>
                        </div>
                        <ul className="flex min-w-0 flex-1 flex-col gap-1">
                            {(byDay.get(dayKey(day)) ?? []).map((item) => {
                                const token = tokenOf(item.event);
                                return (
                                    <li key={item.event.id}>
                                        <button
                                            type="button"
                                            data-rf-calendar-event={item.event.id}
                                            onClick={() => onEventClick?.(item.event)}
                                            className={cn('flex w-full min-w-0 items-start gap-3 rounded-md px-2 py-1.5 text-start text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring', !onEventClick && 'cursor-default')}
                                        >
                                            <span aria-hidden="true" className="mt-1.5 inline-block size-2.5 shrink-0 rounded-full" style={{ background: chartFill(token) }} />
                                            <span className="w-28 shrink-0 tabular-nums text-muted-foreground">{timeOf(item, format, dict)}</span>
                                            {renderEvent ? <span className="min-w-0 flex-1">{renderEvent(item.event, { view: 'agenda', compact: false })}</span> : (
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
                                                        {item.event.icon ? <Icon name={item.event.icon} size={14} className="shrink-0 text-muted-foreground" /> : null}
                                                        <span className="truncate">{item.event.title}</span>
                                                    </span>
                                                    {item.event.description ? <span className="block truncate text-xs text-muted-foreground">{item.event.description}</span> : null}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                );
            })}
        </ol>
    );
}

/** The small month of the side column: a click on a day goes there; the period shown is marked. */
function MiniMonth({ date, range, weekStartsOn, format, dict, onPick }: { date: Date; range: CalendarRange; weekStartsOn: number; format: Formats; dict: Dict; onPick: (day: Date) => void }) {
    const [month, setMonth] = useState(() => new Date(date.getFullYear(), date.getMonth(), 1));
    useEffect(() => { setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); }, [date.getFullYear(), date.getMonth()]); // eslint-disable-line react-hooks/exhaustive-deps
    const weeks = monthGrid(month, weekStartsOn);
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium first-letter:uppercase text-foreground">{format.monthYear.format(month)}</span>
                <div className="flex">
                    <ActionButton icon="chevron-left" variant="link" ariaLabel={dict.previousMonth} className="h-7 px-1.5" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} />
                    <ActionButton icon="chevron-right" variant="link" ariaLabel={dict.nextMonth} className="h-7 px-1.5" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} />
                </div>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] uppercase text-muted-foreground">
                {weeks[0]!.map((day) => <span key={dayKey(day)}>{format.weekday.format(day).slice(0, 1)}</span>)}
            </div>
            {weeks.map((week) => (
                <div key={dayKey(week[0]!)} className="grid grid-cols-7">
                    {week.map((day) => {
                        const inRange = day >= range.start && day < range.end;
                        const isToday = sameDay(day, new Date());
                        return (
                            <button
                                key={dayKey(day)}
                                type="button"
                                aria-label={format.full.format(day)}
                                aria-current={sameDay(day, date) ? 'date' : undefined}
                                onClick={() => onPick(day)}
                                className={cn(
                                    'mx-auto flex size-7 items-center justify-center rounded-full text-xs tabular-nums outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
                                    day.getMonth() !== month.getMonth() && 'text-muted-foreground',
                                    inRange && !isToday && 'bg-primary/10',
                                    isToday && 'bg-primary text-primary-foreground hover:bg-primary',
                                )}
                            >{day.getDate()}</button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

/** The calendars with their colour and check, by group; a search when they are many. */
function CalendarList({ calendars, colors, shown, maxSelected, selectedCount, onToggle, dict }: {
    calendars: readonly CalendarSource[]; colors: Map<string, string>; shown: Set<string>; maxSelected?: number; selectedCount: number;
    onToggle: (id: string) => void; dict: Dict;
}) {
    const [search, setSearch] = useState('');
    const text = search.trim().toLowerCase();
    const visible = text ? calendars.filter((c) => `${c.label} ${c.description ?? ''}`.toLowerCase().includes(text)) : calendars;
    const groups: { name: string; items: CalendarSource[] }[] = [];
    for (const calendar of visible) {
        const name = calendar.group ?? '';
        const group = groups.find((g) => g.name === name) ?? (groups.push({ name, items: [] }), groups[groups.length - 1]!);
        group.items.push(calendar);
    }
    const full = maxSelected !== undefined && selectedCount >= maxSelected;
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">{dict.calendars}</span>
            {calendars.length > 8 ? (
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={dict.searchCalendars}
                    aria-label={dict.searchCalendars}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            ) : null}
            {full ? <span className="text-xs text-muted-foreground">{dict.maxSelected.replace('{n}', String(maxSelected))}</span> : null}
            <div className="flex max-h-[24rem] flex-col gap-3 overflow-y-auto pe-1">
                {groups.map((group) => (
                    <div key={group.name || '-'} className="flex flex-col gap-0.5" role="group" aria-label={group.name || dict.calendars}>
                        {group.name ? <span className="px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{group.name}</span> : null}
                        {group.items.map((calendar) => {
                            const checked = shown.has(calendar.id);
                            const token = colors.get(calendar.id) ?? chartToken(undefined, 1);
                            return (
                                <label key={calendar.id} className={cn('flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 text-sm hover:bg-muted', !checked && full && 'cursor-not-allowed opacity-50')}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={!checked && full}
                                        onChange={() => onToggle(calendar.id)}
                                        className="mt-0.5 size-4 shrink-0 rounded"
                                        style={{ accentColor: chartFill(token) }}
                                        data-rf-calendar-source={calendar.id}
                                    />
                                    <span className="min-w-0">
                                        <span className="block truncate text-foreground">{calendar.label}</span>
                                        {calendar.description ? <span className="block truncate text-xs text-muted-foreground">{calendar.description}</span> : null}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                ))}
                {!visible.length ? <span className="px-1 text-xs text-muted-foreground">{dict.noCalendars}</span> : null}
            </div>
        </div>
    );
}

export default Calendar;
