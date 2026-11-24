import React, { useMemo, useState } from 'react';
import { Calendar, type CalendarEvent, type CalendarSource } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

// CR-150 — a calendar: day, week, month and list; the calendars of people with their colour.

const PROPS: PropDef[] = [
    { name: 'events', type: 'CalendarEvent[]', description: 'The events: `id`, `title`, `start`, `end` (exclusive; without it `defaultDuration` minutes), `allDay`, `calendarId`, `icon`, `color`, `description`.' },
    { name: 'calendars', type: 'CalendarSource[]', description: 'The calendars of the side column: `id`, `label`, `color` (a chart slot or a `--token`), `description`, `group`.' },
    { name: 'selectedCalendarIds / defaultSelectedCalendarIds', type: 'string[]', description: 'The calendars shown, controlled or at first (by default all); `onSelectedCalendarsChange`.' },
    { name: 'maxSelected', type: 'number', description: 'At most this many calendars together: the others cannot be checked.' },
    { name: 'view / defaultView', type: "'day' | 'week' | 'month' | 'agenda'", default: "'week'", description: 'The view, controlled or at first (on a narrow screen the list); `onViewChange`; `views` the ones offered.' },
    { name: 'date / defaultDate', type: 'Date', default: 'today', description: 'The date shown, controlled or at first; `onDateChange`.' },
    { name: 'onRangeChange', type: '({ start, end, view }) => void', description: 'The period shown, at first and at each change: load its events (end exclusive).' },
    { name: 'onEventClick', type: '(event) => void', description: 'A click on an event.' },
    { name: 'onSlotClick', type: '({ start, end, allDay }) => void', description: 'A click on a free half hour of the day and week, or on a day of the month: to create an event there.' },
    { name: 'renderEvent', type: '(event, { view, compact }) => ReactNode', description: 'The content of an event instead of its time and title.' },
    { name: 'weekStartsOn', type: 'number', default: '1', description: '0 Sunday … 6 Saturday.' },
    { name: 'scrollToHour / hourHeight', type: 'number', default: '8 / 48', description: 'The hour day and week open on; the height of an hour in px.' },
    { name: 'maxEventsPerDay', type: 'number', default: '3', description: 'Events in a day of the month before «+N», which opens the day.' },
    { name: 'sidebar / loading / actions / height', type: 'boolean / boolean / ReactNode / number | string', description: 'The side column (by default with calendars); a spinner and faded events while loading; buttons in the bar; the height of the time grid.' },
];

const PEOPLE: CalendarSource[] = [
    { id: 'anna', label: 'Anna Rossi', description: 'Front office', group: 'Office', color: 1 },
    { id: 'bruno', label: 'Bruno Neri', description: 'Sales', group: 'Team', color: 2 },
    { id: 'carla', label: 'Carla Verdi', description: 'Sales', group: 'Team', color: 3 },
    { id: 'dario', label: 'Dario Bianchi', description: 'Consultant', group: 'Team', color: 4 },
];

const TITLES = ['Call with the client', 'Site visit', 'Contract review', 'Team meeting', 'Send the offer', 'Follow-up'];

/** A week of events around today, made the same way at every render. */
function sampleEvents(): CalendarEvent[] {
    const today = new Date();
    const at = (days: number, hour: number, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, hour, minute);
    const events: CalendarEvent[] = [];
    let n = 0;
    for (let day = -10; day <= 20; day += 1) {
        for (const [i, person] of PEOPLE.entries()) {
            if ((day + i) % 3 === 0) continue;
            const hour = 8 + ((day * 7 + i * 3 + 20) % 9);
            events.push({ id: `e${n++}`, calendarId: person.id, title: TITLES[(n + i) % TITLES.length]!, start: at(day, hour, (i % 2) * 30), end: at(day, hour + 1, (i % 2) * 30), description: person.label });
        }
    }
    events.push({ id: 'fair', calendarId: 'bruno', title: 'Trade fair', start: at(2, 0), allDay: true, icon: 'flag' });
    events.push({ id: 'reminder', calendarId: 'anna', title: 'Renew the insurance', start: at(0, 11), icon: 'bell' });
    return events;
}

export default function CalendarPage() {
    const events = useMemo(sampleEvents, []);
    const [clicked, setClicked] = useState<string>('—');
    return (
        <PageLayout
            title="Calendar"
            description="Day, week, month and list, as the common calendars: the calendars of people with their colour, shown or hidden from the side column; overlapping events side by side, the line of now, «+N» in the month. Dates and names in the language of the app, colours of the theme, no external library."
        >
            <Section
                title="The calendars of a team"
                description="Check or uncheck a person in the side column; switch view; t, n, p and d, w, m, a work from the keyboard. A click on an event or on a free slot is reported below."
                preview={(
                    <div className="flex w-full flex-col gap-2">
                        <Calendar
                            events={events}
                            calendars={PEOPLE}
                            maxSelected={4}
                            onEventClick={(event) => setClicked(`event: ${event.title}`)}
                            onSlotClick={(slot) => setClicked(`slot: ${slot.start.toLocaleString()}${slot.allDay ? ' (all day)' : ''}`)}
                        />
                        <p className="text-sm text-muted-foreground">Last click: {clicked}</p>
                    </div>
                )}
                code={`import { Calendar } from '@llmnative/react';

<Calendar
    events={items.map((i) => ({ id: i.id, calendarId: i.owner, title: i.title, start: i.start, end: i.end }))}
    calendars={people.map((p) => ({ id: p.uid, label: p.name, group: p.team }))}
    maxSelected={10}
    onRangeChange={({ start, end }) => load(start, end)}
    onEventClick={(event) => open(event.id)}
/>`}
            />
            <PropDocsTable props={PROPS} title="Calendar props" />
        </PageLayout>
    );
}
