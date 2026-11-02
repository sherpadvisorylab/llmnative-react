import React, { useEffect, useRef, useState } from 'react';
import { useI18nOrEnglish } from '../../I18n';
import { cn } from '../../libs/cn';
import { AXIS_TEXT, KEYBOARD_LIMIT, chartFill, chartToken, useAnimatedValues, useChartFormat, useChartWidth, type ChartColor } from './chartCore';
import { ChartDataTable, ChartEmpty, ChartLegend, hitHandlers, useChartTooltip, type ChartLegendItem, type ChartTooltipRow } from './ChartParts';

export interface BarListRow {
    readonly id: string;
    readonly label: string;
    readonly value: number;
    /** A lighter bar behind the main one (e.g. the delivered behind the active). */
    readonly background?: number;
    readonly color?: ChartColor;
    /** The text after the bar; by default the formatted value. */
    readonly valueText?: string;
    /** A note on the right with its own tone (a change over the previous period). */
    readonly trailing?: { readonly text: string; readonly tone: 'good' | 'bad' | 'neutral' };
    readonly tooltip?: readonly ChartTooltipRow[];
}

export interface BarListProps {
    rows: readonly BarListRow[];
    ariaLabel: string;
    color?: ChartColor;
    format?: (value: number) => string;
    /** The value of a full bar; by default the largest. */
    max?: number;
    /** Room for the labels, in px. */
    labelWidth?: number;
    legend?: readonly ChartLegendItem[];
    className?: string;
    onRowClick?: (row: BarListRow) => void;
}

const TONE: Record<'good' | 'bad' | 'neutral', string> = {
    good: 'hsl(var(--rf-success))',
    bad: 'hsl(var(--rf-destructive))',
    neutral: 'hsl(var(--rf-muted-foreground))',
};

/** CR-112 — horizontal bars, label on the left and value at the end: rankings, funnels, averages per group. */
export function BarList({ rows, ariaLabel, color, format: formatProp, max: fixedMax, labelWidth = 150, legend = [], className, onRowClick }: BarListProps) {
    const format = useChartFormat(formatProp);
    const tooltip = useChartTooltip();
    const animated = useAnimatedValues(rows.flatMap((row) => [row.value, row.background ?? 0]), 550, 22);
    const [figureRef, width] = useChartWidth<HTMLElement>(520);
    if (rows.length === 0) return <ChartEmpty height={80} />;
    const max = fixedMax ?? Math.max(1, ...rows.flatMap((row) => [row.value, row.background ?? 0]));
    const rowHeight = 34;
    // Room for the text after the bars and the notes on the right, from the longest of each (about 6.5 units a character).
    const valueWidth = Math.max(40, ...rows.map((row) => (row.valueText ?? format(row.value)).length * 6.5 + 12));
    const trailingWidth = Math.max(0, ...rows.map((row) => (row.trailing ? row.trailing.text.length * 6.5 + 10 : 0)));
    const barSpace = Math.max(40, width - labelWidth - trailingWidth - valueWidth);
    const height = rows.length * rowHeight + 4;
    // About 7 units per character at 12px: longer labels are cut, the tooltip shows them whole.
    const maxLabelChars = Math.max(4, Math.floor((labelWidth - 10) / 7));
    const keyboard = rows.length <= KEYBOARD_LIMIT;

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            <ChartLegend items={legend} />
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                {rows.map((row, index) => {
                    const top = index * rowHeight + 4;
                    const value = animated[index * 2] ?? 0;
                    const background = animated[index * 2 + 1] ?? 0;
                    const barWidth = (barSpace * value) / max;
                    const token = chartToken(row.color ?? color);
                    return (
                        <g key={row.id}>
                            <text x={labelWidth - 10} y={top + 17} textAnchor="end" fontSize="12" fill="hsl(var(--rf-foreground))">
                                {row.label.length > maxLabelChars ? `${row.label.slice(0, maxLabelChars - 1)}…` : row.label}
                            </text>
                            {row.background !== undefined && <rect x={labelWidth} y={top + 4} width={(barSpace * background) / max} height={20} rx={4} fill="hsl(var(--rf-muted))" />}
                            <rect x={labelWidth} y={top + 4} width={Math.max(0, barWidth)} height={20} rx={4} fill={chartFill(token)} />
                            <text x={labelWidth + Math.max(barWidth, (barSpace * background) / max) + 6} y={top + 18} fontSize="11.5" fill="hsl(var(--rf-foreground))" className="tabular-nums">
                                {row.valueText ?? format(value)}
                            </text>
                            {row.trailing && <text x={width - 2} y={top + 18} textAnchor="end" fontSize="11.5" fill={TONE[row.trailing.tone]} className="tabular-nums">{row.trailing.text}</text>}
                            <rect
                                x={0} y={top} width={width} height={rowHeight} fill="transparent"
                                style={onRowClick ? { cursor: 'pointer' } : undefined}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                {...hitHandlers(tooltip, row.label, row.tooltip ?? [{ label: ariaLabel, value: row.valueText ?? format(row.value), token }], keyboard)}
                            />
                        </g>
                    );
                })}
            </svg>
            <ChartDataTable caption={ariaLabel} columns={[ariaLabel]} rows={rows.map((row) => ({ label: row.label, values: [row.valueText ?? format(row.value)] }))} />
            {tooltip.element}
        </figure>
    );
}

export interface HeatmapProps {
    /** values[row][column]. */
    values: ReadonlyArray<readonly number[]>;
    rowLabels: readonly string[];
    /** One label per column; shown every `columnLabelEvery` columns. */
    columnLabels: readonly string[];
    columnLabelEvery?: number;
    ariaLabel: string;
    color?: ChartColor;
    format?: (value: number) => string;
    /** The title of a cell in its tooltip; by default its row and column. */
    cellTitle?: (row: number, column: number) => string;
    cellHeight?: number;
    className?: string;
}

/** CR-112 — a grid of rows × columns (weekday × hour, agent × stage), one hue: darker is more. Cells light up in turn. */
export function Heatmap({ values, rowLabels, columnLabels, columnLabelEvery = 1, ariaLabel, color = '--rf-primary', format: formatProp, cellTitle, cellHeight = 24, className }: HeatmapProps) {
    const format = useChartFormat(formatProp);
    const tooltip = useChartTooltip();
    const columns = columnLabels.length;
    const left = Math.min(120, Math.max(36, ...rowLabels.map((label) => label.length * 6.5 + 10)));
    const [figureRef, width] = useChartWidth<HTMLElement>(left + Math.max(1, columns) * 21);
    const flat = values.flatMap((row) => columnLabels.map((_, column) => row[column] ?? 0));
    const max = Math.max(1, ...flat);
    const animated = useAnimatedValues(flat.map((value) => value / max), 380, 3);
    if (values.length === 0 || columns === 0) return <ChartEmpty height={120} />;
    const gap = 2;
    const top = 6;
    const cellWidth = Math.max(8, (width - left) / columns - gap);
    const height = top + values.length * (cellHeight + gap) + 22;
    const token = chartToken(color);
    const keyboard = flat.length <= KEYBOARD_LIMIT;

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                {rowLabels.map((label, row) => (
                    <text key={`${label}-${row}`} x={left - 6} y={top + row * (cellHeight + gap) + cellHeight / 2 + 4} textAnchor="end" fontSize="10.5" fill={AXIS_TEXT}>{label}</text>
                ))}
                {flat.map((value, index) => {
                    const row = Math.floor(index / columns);
                    const column = index % columns;
                    const title = cellTitle?.(row, column) ?? `${rowLabels[row] ?? ''} · ${columnLabels[column] ?? ''}`;
                    return (
                        <rect
                            key={index}
                            x={left + column * (cellWidth + gap)} y={top + row * (cellHeight + gap)} width={cellWidth} height={cellHeight} rx={3}
                            fill={chartFill(token)} fillOpacity={0.06 + 0.9 * (animated[index] ?? 0)}
                            {...hitHandlers(tooltip, title, [{ label: ariaLabel, value: format(value) }], keyboard)}
                        />
                    );
                })}
                {columnLabels.map((label, column) => (column % columnLabelEvery === 0 ? (
                    <text key={column} x={left + column * (cellWidth + gap) + cellWidth / 2} y={top + values.length * (cellHeight + gap) + 14} textAnchor="middle" fontSize="10.5" fill={AXIS_TEXT}>{label}</text>
                ) : null))}
            </svg>
            <ChartDataTable caption={ariaLabel} columns={columnLabels} rows={values.map((row, index) => ({ label: rowLabels[index] ?? '', values: columnLabels.map((_, column) => format(row[column] ?? 0)) }))} />
            {tooltip.element}
        </figure>
    );
}

export interface CalendarHeatmapProps {
    /** One entry per day (ISO date `YYYY-MM-DD`); null: no data that day. Days left out count as no data. */
    days: ReadonlyArray<{ readonly date: string; readonly value: number | null }>;
    ariaLabel: string;
    color?: ChartColor;
    format?: (value: number) => string;
    className?: string;
}

const LEVELS = [0, 0.3, 0.55, 0.8, 1] as const;

/** CR-112 — one square per day, weeks as columns from Monday: darker is more, a scale from less to more. */
export function CalendarHeatmap({ days, ariaLabel, color = '--rf-primary', format: formatProp, className }: CalendarHeatmapProps) {
    const format = useChartFormat(formatProp);
    const { dict, locale } = useI18nOrEnglish();
    const tooltip = useChartTooltip();
    if (days.length === 0) return <ChartEmpty height={120} />;
    const token = chartToken(color);
    const byDate = new Map(days.map((day) => [day.date, day.value]));
    const sorted = [...days].map((day) => day.date).sort();
    const utc = (date: string) => new Date(`${date}T00:00:00Z`);
    const first = utc(sorted[0]!);
    const last = utc(sorted[sorted.length - 1]!);
    // Back to the Monday of the first week.
    const start = new Date(first);
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
    const weeks: Array<Array<{ date: string; value: number | null } | null>> = [];
    for (const day = new Date(start); day <= last; day.setUTCDate(day.getUTCDate() + 1)) {
        const weekday = (day.getUTCDay() + 6) % 7;
        if (weekday === 0) weeks.push([]);
        const date = day.toISOString().slice(0, 10);
        weeks[weeks.length - 1]!.push(day < first ? null : { date, value: byDate.has(date) ? byDate.get(date)! : null });
    }
    const max = Math.max(1, ...days.map((day) => day.value ?? 0));
    const level = (value: number | null) => (value === null || value <= 0 ? 0 : Math.min(4, Math.ceil((value / max) * 4)));
    const fill = (value: number | null, known: boolean) => (known && value !== null && value > 0
        ? chartFill(token, LEVELS[level(value)])
        : known ? 'hsl(var(--rf-muted-foreground) / 0.25)' : 'hsl(var(--rf-muted))');
    const cell = 13;
    const gap = 3;
    const left = 26;
    const top = 16;
    const width = left + weeks.length * (cell + gap);
    const height = top + 7 * (cell + gap);
    const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
    const month = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });
    const dayTitle = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
    const monday = new Date(start);
    const keyboard = days.length <= KEYBOARD_LIMIT;
    let lastMonth = '';

    return (
        <figure className={cn('space-y-2', className)}>
            <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={ariaLabel}>
                    {[0, 2, 4].map((offset) => {
                        const date = new Date(monday);
                        date.setUTCDate(date.getUTCDate() + offset);
                        return <text key={offset} x={0} y={top + offset * (cell + gap) + cell - 3} fontSize="10" fill={AXIS_TEXT}>{weekday.format(date)}</text>;
                    })}
                    {weeks.map((week, column) => {
                        const firstDay = week.find((entry) => entry !== null);
                        const monthKey = firstDay ? firstDay.date.slice(0, 7) : '';
                        const showMonth = monthKey !== '' && monthKey !== lastMonth;
                        if (showMonth) lastMonth = monthKey;
                        return (
                            <g key={column}>
                                {showMonth && firstDay && <text x={left + column * (cell + gap)} y={10} fontSize="10" fill={AXIS_TEXT}>{month.format(utc(firstDay.date))}</text>}
                                {week.map((entry, row) => (entry === null ? null : (
                                    <rect
                                        key={entry.date} x={left + column * (cell + gap)} y={top + row * (cell + gap)} width={cell} height={cell} rx={2.5}
                                        fill={fill(entry.value, byDate.has(entry.date))}
                                        {...hitHandlers(tooltip, dayTitle.format(utc(entry.date)), [{ label: ariaLabel, value: entry.value === null ? '—' : format(entry.value) }], keyboard)}
                                    />
                                )))}
                            </g>
                        );
                    })}
                </svg>
            </div>
            <figcaption className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{dict.charts.less}</span>
                {LEVELS.map((_, index) => <span key={index} aria-hidden="true" className="inline-block size-3 rounded-sm" style={{ background: index === 0 ? 'hsl(var(--rf-muted-foreground) / 0.25)' : chartFill(token, LEVELS[index]) }} />)}
                <span>{dict.charts.more}</span>
            </figcaption>
            <ChartDataTable caption={ariaLabel} columns={[ariaLabel]} rows={days.map((day) => ({ label: dayTitle.format(utc(day.date)), values: [day.value === null ? '—' : format(day.value)] }))} />
            {tooltip.element}
        </figure>
    );
}

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * CR-112 — a number that counts from the previous value (0 on first mount) to `value` with an
 * ease-out, then shows `format(value)` exactly. Server rendering and reduced motion show it at once.
 */
export function AnimatedNumber({ value, format: formatProp, duration = 700 }: { value: number; format?: (value: number) => string; duration?: number }) {
    const format = useChartFormat(formatProp);
    const [shown, setShown] = useState(value);
    const previous = useRef<number | null>(null);
    useEffect(() => {
        const from = previous.current ?? 0;
        previous.current = value;
        if (prefersReducedMotion() || from === value || typeof requestAnimationFrame === 'undefined') {
            setShown(value);
            return undefined;
        }
        const startedAt = performance.now();
        let frame = 0;
        const step = (at: number) => {
            const progress = Math.min(1, (at - startedAt) / duration);
            setShown(from + (value - from) * (1 - (1 - progress) ** 3));
            if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [value, duration]);
    return <>{format(shown)}</>;
}
