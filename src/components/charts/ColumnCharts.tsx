import React from 'react';
import { useI18nOrEnglish } from '../../I18n';
import { cn } from '../../libs/cn';
import { AXIS_TEXT, GRID_LINE, KEYBOARD_LIMIT, chartFill, chartToken, niceMax, ticks, useAnimatedValues, useChartFormat, useChartWidth, useReveal, type ChartColor } from './chartCore';
import { ChartDataTable, ChartEmpty, ChartLegend, hitHandlers, useChartTooltip, type ChartTooltipRow } from './ChartParts';

export interface ColumnChartColumn {
    readonly label: string;
    readonly value: number;
    /** Its own colour (e.g. the critical bucket); otherwise the colour of the chart. */
    readonly color?: ChartColor;
    /** Rows of its tooltip; by default its value. */
    readonly tooltip?: readonly ChartTooltipRow[];
}

export interface ColumnChartMarker {
    /** Position in column units: 0 the left edge of the first column, n the right edge of the last. */
    readonly position: number;
    readonly label: string;
    readonly dashed?: boolean;
}

export interface ColumnChartProps {
    columns: readonly ColumnChartColumn[];
    /** Text alternative of the chart, also the caption of its data table. */
    ariaLabel: string;
    color?: ChartColor;
    format?: (value: number) => string;
    /** Vertical markers (a median, a percentile). */
    markers?: readonly ColumnChartMarker[];
    /** Label at the end of the horizontal axis. */
    axisLabel?: string;
    /** The value on top of each column (default true). */
    showValues?: boolean;
    height?: number;
    className?: string;
    onColumnClick?: (column: ColumnChartColumn, index: number) => void;
}

/** CR-112 — one series of columns (a distribution, ordered buckets), value labels on top, optional markers. */
export function ColumnChart({ columns, ariaLabel, color, format: formatProp, markers = [], axisLabel, showValues = true, height = 250, className, onColumnClick }: ColumnChartProps) {
    const format = useChartFormat(formatProp);
    const tooltip = useChartTooltip();
    const [figureRef, width] = useChartWidth<HTMLElement>(520);
    const animated = useAnimatedValues(columns.map((column) => column.value), 500, 30);
    const reveal = useReveal(markers.map((marker) => marker.position).join('|'), 400, 350);
    if (columns.length === 0) return <ChartEmpty height={height} />;
    const margin = { top: 24, right: 8, bottom: 30, left: 44 };
    const max = niceMax(Math.max(...columns.map((column) => column.value), 1) * 1.15);
    const bottom = height - margin.bottom;
    const y = (value: number) => bottom - (value / max) * (bottom - margin.top);
    const slot = (width - margin.left - margin.right) / Math.max(1, columns.length);
    const barWidth = Math.min(64, slot * 0.72);
    const keyboard = columns.length <= KEYBOARD_LIMIT;
    const token = chartToken(color);

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                {ticks(0, max).map((tick) => (
                    <g key={tick}>
                        <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke={GRID_LINE} strokeDasharray={tick === 0 ? undefined : '3 4'} />
                        <text x={margin.left - 6} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={AXIS_TEXT}>{format(tick)}</text>
                    </g>
                ))}
                {columns.map((column, index) => {
                    const left = margin.left + slot * index + (slot - barWidth) / 2;
                    const value = animated[index] ?? 0;
                    const top = y(value);
                    const rows = column.tooltip ?? [{ label: ariaLabel, value: format(column.value), token: chartToken(column.color ?? color) }];
                    return (
                        <g key={`${column.label}-${index}`}>
                            <rect x={left} y={top} width={barWidth} height={Math.max(0, bottom - top)} rx={3} fill={chartFill(column.color === undefined ? token : chartToken(column.color))} />
                            {showValues && column.value > 0 && (
                                <text x={left + barWidth / 2} y={top - 5} textAnchor="middle" fontSize="11" fill="hsl(var(--rf-foreground))" className="tabular-nums">{format(value)}</text>
                            )}
                            <text x={left + barWidth / 2} y={height - 12} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>{column.label}</text>
                            <rect
                                x={margin.left + slot * index} y={margin.top} width={slot} height={bottom - margin.top} fill="transparent"
                                style={onColumnClick ? { cursor: 'pointer' } : undefined}
                                onClick={onColumnClick ? () => onColumnClick(column, index) : undefined}
                                {...hitHandlers(tooltip, column.label, rows, keyboard)}
                            />
                        </g>
                    );
                })}
                {markers.map((marker) => {
                    const x = margin.left + slot * marker.position;
                    return (
                        <g key={marker.label} opacity={reveal} pointerEvents="none">
                            <line x1={x} x2={x} y1={margin.top - 8} y2={bottom} stroke="hsl(var(--rf-foreground))" strokeWidth={1.5} strokeDasharray={marker.dashed ? '4 3' : undefined} />
                            <text x={x + 5} y={margin.top - 10} fontSize="11" fill="hsl(var(--rf-foreground))">{marker.label}</text>
                        </g>
                    );
                })}
                {axisLabel && <text x={width - margin.right} y={height - 1} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>{axisLabel}</text>}
            </svg>
            <ChartDataTable caption={ariaLabel} columns={[ariaLabel]} rows={columns.map((column) => ({ label: column.label, values: [format(column.value)] }))} />
            {tooltip.element}
        </figure>
    );
}

export interface ChartSeries {
    readonly id: string;
    readonly label: string;
    /** A slot of the palette (1…8) or a theme token; by default the slot of its position. */
    readonly color?: ChartColor;
    readonly values: readonly number[];
}

export interface StackedColumnChartProps {
    series: readonly ChartSeries[];
    /** One label per bucket, on the horizontal axis. */
    labels: readonly string[];
    ariaLabel: string;
    /** Title of the tooltip per bucket; by default its label. */
    titles?: readonly string[];
    /** One axis label every N buckets (the last always shown). */
    labelEvery?: number;
    format?: (value: number) => string;
    /** The total of a comparison period per bucket, drawn as a dashed tick. */
    comparison?: readonly number[];
    comparisonLabel?: string;
    height?: number;
    className?: string;
}

/** CR-112 — columns per bucket, stacked by series, gliding between periods; optional comparison tick per column. */
export function StackedColumnChart({ series, labels, ariaLabel, titles, labelEvery = 1, format: formatProp, comparison, comparisonLabel, height = 250, className }: StackedColumnChartProps) {
    const format = useChartFormat(formatProp);
    const { dict } = useI18nOrEnglish();
    const tooltip = useChartTooltip();
    const [figureRef, width] = useChartWidth<HTMLElement>(960);
    const n = labels.length;
    const flat = series.flatMap((entry) => labels.map((_, bucket) => entry.values[bucket] ?? 0));
    const animated = useAnimatedValues([...flat, ...(comparison ?? [])], 550, 6);
    if (n === 0 || series.length === 0) return <ChartEmpty height={height} />;
    const margin = { top: 12, right: 8, bottom: 28, left: 64 };
    const value = (seriesIndex: number, bucket: number) => animated[seriesIndex * n + bucket] ?? 0;
    const totals = labels.map((_, bucket) => series.reduce((sum, entry) => sum + (entry.values[bucket] ?? 0), 0));
    const max = niceMax(Math.max(...totals, ...(comparison ?? [0])) * 1.05);
    const bottom = height - margin.bottom;
    const y = (v: number) => bottom - (v / max) * (bottom - margin.top);
    const slot = (width - margin.left - margin.right) / n;
    const barWidth = Math.min(44, slot * 0.62);
    const x = (bucket: number) => margin.left + slot * bucket + slot / 2;
    const tokens = series.map((entry, index) => chartToken(entry.color, index + 1));
    const keyboard = n <= KEYBOARD_LIMIT;

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            <ChartLegend items={[
                ...series.map((entry, index) => ({ label: entry.label, token: tokens[index]! })),
                ...(comparison && comparisonLabel ? [{ label: comparisonLabel, token: '--rf-muted-foreground', shape: 'dashed' as const }] : []),
            ]} />
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                {ticks(0, max).map((tick) => (
                    <g key={tick}>
                        <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke={GRID_LINE} strokeDasharray={tick === 0 ? undefined : '3 4'} />
                        <text x={margin.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={AXIS_TEXT}>{format(tick)}</text>
                    </g>
                ))}
                {labels.map((label, bucket) => (bucket % labelEvery === 0 || bucket === n - 1 ? (
                    <text key={bucket} x={x(bucket)} y={height - 8} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>{label}</text>
                ) : null))}
                {labels.map((label, bucket) => {
                    let accumulated = 0;
                    const segments = series.map((entry, seriesIndex) => {
                        const from = accumulated;
                        accumulated += Math.max(0, value(seriesIndex, bucket));
                        return { id: entry.id, token: tokens[seriesIndex]!, from, to: accumulated };
                    });
                    const visible = segments.filter((segment) => segment.to - segment.from > 0);
                    const rows: ChartTooltipRow[] = [
                        ...series.map((entry, index) => ({ label: entry.label, value: format(entry.values[bucket] ?? 0), token: tokens[index] })),
                        ...(comparison ? [{ label: comparisonLabel ?? '', value: format(comparison[bucket] ?? 0) }] : []),
                    ];
                    const comparisonValue = comparison ? animated[flat.length + bucket] ?? 0 : null;
                    return (
                        <g key={`${label}-${bucket}`}>
                            {visible.map((segment, index) => {
                                const top = y(segment.to);
                                const h = Math.max(0, y(segment.from) - top - (index > 0 ? 2 : 0));
                                return <rect key={segment.id} x={x(bucket) - barWidth / 2} y={top} width={barWidth} height={h} rx={index === visible.length - 1 ? 3 : 0} fill={chartFill(segment.token)} />;
                            })}
                            {comparisonValue !== null && comparisonValue > 0 && (
                                <line x1={x(bucket) - barWidth / 2 - 4} x2={x(bucket) + barWidth / 2 + 4} y1={y(comparisonValue)} y2={y(comparisonValue)} stroke={AXIS_TEXT} strokeWidth={2} strokeDasharray="4 3" />
                            )}
                            <rect
                                x={margin.left + slot * bucket} y={margin.top} width={slot} height={bottom - margin.top} fill="transparent"
                                {...hitHandlers(tooltip, `${titles?.[bucket] ?? label} · ${dict.charts.total} ${format(totals[bucket] ?? 0)}`, rows, keyboard)}
                            />
                        </g>
                    );
                })}
            </svg>
            <ChartDataTable
                caption={ariaLabel}
                columns={[...series.map((entry) => entry.label), dict.charts.total]}
                rows={labels.map((label, bucket) => ({ label: titles?.[bucket] ?? label, values: [...series.map((entry) => format(entry.values[bucket] ?? 0)), format(totals[bucket] ?? 0)] }))}
            />
            {tooltip.element}
        </figure>
    );
}

export interface DivergingBar {
    readonly label: string;
    /** Above the zero line; null: no data (nothing drawn). */
    readonly up: number | null;
    /** Below the zero line; null: no data. */
    readonly down: number | null;
}

export interface DivergingBarChartProps {
    bars: readonly DivergingBar[];
    upLabel: string;
    downLabel: string;
    ariaLabel: string;
    upColor?: ChartColor;
    downColor?: ChartColor;
    titles?: readonly string[];
    labelEvery?: number;
    format?: (value: number) => string;
    height?: number;
    className?: string;
}

/**
 * CR-112 — two quantities per bucket around a zero line, one scale for both sides (charged above,
 * drawn below; income and costs). Buckets without data stay empty, data at zero shows a hairline.
 */
export function DivergingBarChart({ bars, upLabel, downLabel, ariaLabel, upColor = 1, downColor = 2, titles, labelEvery = 1, format: formatProp, height = 250, className }: DivergingBarChartProps) {
    const format = useChartFormat(formatProp);
    const tooltip = useChartTooltip();
    const [figureRef, width] = useChartWidth<HTMLElement>(960);
    const n = bars.length;
    const animated = useAnimatedValues(bars.flatMap((bar) => [bar.up ?? 0, bar.down ?? 0]), 550, 6);
    if (n === 0) return <ChartEmpty height={height} />;
    const margin = { top: 10, right: 8, bottom: 26, left: 64 };
    const max = niceMax(Math.max(1, ...bars.flatMap((bar) => [bar.up ?? 0, bar.down ?? 0])) * 1.05);
    const zero = (margin.top + height - margin.bottom) / 2;
    const half = zero - margin.top;
    const slot = (width - margin.left - margin.right) / n;
    const barWidth = Math.max(2, Math.min(40, slot * 0.6));
    const x = (bucket: number) => margin.left + slot * bucket + slot / 2;
    const upToken = chartToken(upColor);
    const downToken = chartToken(downColor, 2);
    const keyboard = n <= KEYBOARD_LIMIT;
    const shown = (value: number | null) => (value === null ? '—' : format(value));

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            <ChartLegend items={[{ label: upLabel, token: upToken }, { label: downLabel, token: downToken }]} />
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                {[-1, -0.5, 0, 0.5, 1].map((step) => (
                    <g key={step}>
                        <line x1={margin.left} x2={width - margin.right} y1={zero - step * half} y2={zero - step * half} stroke={step === 0 ? AXIS_TEXT : GRID_LINE} strokeDasharray={step === 0 ? undefined : '3 4'} />
                        <text x={margin.left - 8} y={zero - step * half} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={AXIS_TEXT}>{format(Math.abs(step) * max)}</text>
                    </g>
                ))}
                {bars.map((bar, bucket) => (bucket % labelEvery === 0 || bucket === n - 1 ? (
                    <text key={bucket} x={x(bucket)} y={height - 8} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>{bar.label}</text>
                ) : null))}
                {bars.map((bar, bucket) => {
                    const upHeight = ((animated[bucket * 2] ?? 0) / max) * half;
                    const downHeight = ((animated[bucket * 2 + 1] ?? 0) / max) * half;
                    const rows: ChartTooltipRow[] = [{ label: upLabel, value: shown(bar.up), token: upToken }, { label: downLabel, value: shown(bar.down), token: downToken }];
                    return (
                        <g key={`${bar.label}-${bucket}`}>
                            {bar.up !== null && <rect x={x(bucket) - barWidth / 2} y={zero - Math.max(1, upHeight) - 1} width={barWidth} height={Math.max(1, upHeight)} rx={2} fill={chartFill(upToken)} />}
                            {bar.down !== null && <rect x={x(bucket) - barWidth / 2} y={zero + 1} width={barWidth} height={Math.max(1, downHeight)} rx={2} fill={chartFill(downToken)} />}
                            <rect
                                x={margin.left + slot * bucket} y={margin.top} width={slot} height={height - margin.top - margin.bottom} fill="transparent"
                                {...hitHandlers(tooltip, titles?.[bucket] ?? bar.label, rows, keyboard)}
                            />
                        </g>
                    );
                })}
            </svg>
            <ChartDataTable caption={ariaLabel} columns={[upLabel, downLabel]} rows={bars.map((bar, bucket) => ({ label: titles?.[bucket] ?? bar.label, values: [shown(bar.up), shown(bar.down)] }))} />
            {tooltip.element}
        </figure>
    );
}
