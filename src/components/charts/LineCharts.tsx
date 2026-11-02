import React, { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useI18nOrEnglish } from '../../I18n';
import { cn } from '../../libs/cn';
import { AXIS_TEXT, GRID_LINE, chartFill, chartToken, niceMax, ticks, useAnimatedValues, useChartFormat, useChartWidth, useReveal, type ChartColor } from './chartCore';
import { ChartDataTable, ChartEmpty, ChartLegend, useChartTooltip, type ChartTooltipRow } from './ChartParts';

export interface LineSeries {
    readonly id: string;
    readonly label: string;
    readonly color?: ChartColor;
    /** One value per label; null breaks the line (no data). */
    readonly values: ReadonlyArray<number | null>;
    /** A filled area under the line. */
    readonly area?: boolean;
    /** A comparison series: dashed, muted, no area. */
    readonly dashed?: boolean;
    /** A min–max band around the line (null: no band there). */
    readonly band?: { readonly min: ReadonlyArray<number | null>; readonly max: ReadonlyArray<number | null> };
}

export interface LineChartProps {
    series: readonly LineSeries[];
    labels: readonly string[];
    ariaLabel: string;
    titles?: readonly string[];
    labelEvery?: number;
    format?: (value: number) => string;
    /** A dashed line with a faint band above it (a limit). */
    threshold?: { readonly value: number; readonly label: string };
    /** A plain reference line (e.g. zero). */
    baseline?: number;
    /** The vertical range; by default from 0 to a rounded maximum of the data. */
    domain?: readonly [number, number];
    height?: number;
    className?: string;
}

const pathOf = (points: ReadonlyArray<readonly [number, number]>) => points.map(([px, py], index) => `${index ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join('');

/** Runs of consecutive known values, by index. */
function runsOf(values: ReadonlyArray<number | null>): number[][] {
    const runs: number[][] = [];
    let current: number[] = [];
    values.forEach((value, index) => {
        if (value === null || value === undefined || !Number.isFinite(value)) {
            if (current.length) runs.push(current);
            current = [];
        } else current.push(index);
    });
    if (current.length) runs.push(current);
    return runs;
}

/** The index under the pointer, from its position over the plot. */
function bucketAt(event: ReactPointerEvent<SVGRectElement>, width: number, left: number, right: number, n: number): number {
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box || n === 0) return 0;
    const svgX = ((event.clientX - box.left) / box.width) * width;
    return Math.max(0, Math.min(n - 1, Math.round(((svgX - left) / (width - left - right)) * (n - 1))));
}

/**
 * CR-112 — lines over time with a crosshair tooltip. Gaps (null) break a line; optional areas, a
 * min–max band per series, a threshold with its band, a reference line. The lines draw themselves
 * left to right.
 */
export function LineChart({ series, labels, ariaLabel, titles, labelEvery = 1, format: formatProp, threshold, baseline, domain, height = 240, className }: LineChartProps) {
    const format = useChartFormat(formatProp);
    const tooltip = useChartTooltip();
    const [figureRef, width] = useChartWidth<HTMLElement>(520);
    const [hover, setHover] = useState<number | null>(null);
    const n = labels.length;
    const flat = series.flatMap((entry) => labels.map((_, index) => entry.values[index] ?? Number.NaN));
    const known = [
        ...flat.filter((value) => Number.isFinite(value)),
        ...series.flatMap((entry) => [...(entry.band?.min ?? []), ...(entry.band?.max ?? [])]).filter((value): value is number => typeof value === 'number'),
    ];
    const low = domain?.[0] ?? Math.min(0, ...known);
    const high = domain?.[1] ?? niceMax(Math.max(...known, threshold?.value ?? 0, 1) * 1.1);
    const animated = useAnimatedValues(flat.map((value) => (Number.isFinite(value) ? value : low)), 650, 0);
    const draw = useReveal(labels.join('|') + series.length, 800);
    // Its own clip path: several charts on one page never share one.
    const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
    if (n === 0 || series.length === 0) return <ChartEmpty height={height} />;
    const margin = { top: 14, right: 12, bottom: 28, left: 50 };
    const bottom = height - margin.bottom;
    const x = (index: number) => margin.left + (n <= 1 ? (width - margin.left - margin.right) / 2 : (index / (n - 1)) * (width - margin.left - margin.right));
    const y = (value: number) => bottom - ((value - low) / (high - low || 1)) * (bottom - margin.top);
    const clipId = `chart-line-${uid}`;
    const clipWidth = margin.left + (width - margin.left - margin.right) * draw + 6;
    const tokens = series.map((entry, index) => (entry.dashed ? '--rf-muted-foreground' : chartToken(entry.color, index + 1)));
    const floor = y(Math.max(low, Math.min(high, baseline ?? low)));
    const point = (seriesIndex: number, index: number) => [x(index), y(animated[seriesIndex * n + index] ?? low)] as const;
    const shown = (value: number | null | undefined) => (value === null || value === undefined ? '—' : format(value));
    const rowsAt = (index: number): ChartTooltipRow[] => series.map((entry, seriesIndex) => ({ label: entry.label, value: shown(entry.values[index]), token: tokens[seriesIndex] }));

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            {series.length > 1 && (
                <ChartLegend items={series.map((entry, index) => ({ label: entry.label, token: tokens[index]!, shape: entry.dashed ? 'dashed' as const : 'line' as const }))} />
            )}
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                <defs><clipPath id={clipId}><rect x={0} y={0} width={clipWidth} height={height} /></clipPath></defs>
                {ticks(low, high).map((tick) => (
                    <g key={tick}>
                        <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke={GRID_LINE} strokeDasharray={tick === low ? undefined : '3 4'} />
                        <text x={margin.left - 6} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={AXIS_TEXT}>{format(tick)}</text>
                    </g>
                ))}
                {labels.map((label, index) => (index % labelEvery === 0 || index === n - 1 ? (
                    <text key={index} x={x(index)} y={height - 8} textAnchor={n > 1 && index === 0 ? 'start' : n > 1 && index === n - 1 ? 'end' : 'middle'} fontSize="11" fill={AXIS_TEXT}>{label}</text>
                ) : null))}
                {baseline !== undefined && baseline > low && baseline < high && (
                    <line x1={margin.left} x2={width - margin.right} y1={y(baseline)} y2={y(baseline)} stroke={AXIS_TEXT} strokeWidth={1} />
                )}
                {threshold && threshold.value > low && threshold.value < high && (
                    <g>
                        <rect x={margin.left} y={margin.top} width={width - margin.left - margin.right} height={Math.max(0, y(threshold.value) - margin.top)} fill="hsl(var(--rf-destructive) / 0.07)" />
                        <line x1={margin.left} x2={width - margin.right} y1={y(threshold.value)} y2={y(threshold.value)} stroke="hsl(var(--rf-destructive))" strokeWidth={1.2} strokeDasharray="5 4" />
                        <text x={width - margin.right} y={y(threshold.value) - 6} textAnchor="end" fontSize="11" fill="hsl(var(--rf-foreground))">{threshold.label}</text>
                    </g>
                )}
                <g clipPath={`url(#${clipId})`}>
                    {series.map((entry, seriesIndex) => {
                        const token = tokens[seriesIndex]!;
                        const runs = runsOf(labels.map((_, index) => entry.values[index] ?? null));
                        const bandRuns = entry.band ? runsOf(labels.map((_, index) => (entry.band!.min[index] === null || entry.band!.min[index] === undefined ? null : entry.band!.max[index] ?? null))) : [];
                        return (
                            <g key={entry.id}>
                                {bandRuns.map((run) => (
                                    <polygon
                                        key={`band-${run[0]}`}
                                        points={[...run.map((index) => `${x(index)},${y(entry.band!.max[index] as number)}`), ...[...run].reverse().map((index) => `${x(index)},${y(entry.band!.min[index] as number)}`)].join(' ')}
                                        fill={chartFill(token, 0.14)}
                                    />
                                ))}
                                {entry.area && !entry.dashed && runs.map((run) => run.length > 1 && (
                                    <path key={`area-${run[0]}`} d={`${pathOf(run.map((index) => point(seriesIndex, index)))}L${x(run[run.length - 1]!)},${floor}L${x(run[0]!)},${floor}Z`} fill={chartFill(token, 0.14)} />
                                ))}
                                {runs.map((run) => (run.length > 1 ? (
                                    <path
                                        key={`line-${run[0]}`} d={pathOf(run.map((index) => point(seriesIndex, index)))} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
                                        stroke={chartFill(token)} strokeDasharray={entry.dashed ? '5 4' : undefined}
                                    />
                                ) : (
                                    <circle key={`dot-${run[0]}`} cx={point(seriesIndex, run[0]!)[0]} cy={point(seriesIndex, run[0]!)[1]} r={2.5} fill={chartFill(token)} />
                                )))}
                            </g>
                        );
                    })}
                </g>
                {hover !== null && (
                    <g pointerEvents="none">
                        <line x1={x(hover)} x2={x(hover)} y1={margin.top} y2={bottom} stroke={AXIS_TEXT} strokeWidth={1} />
                        {series.map((entry, seriesIndex) => {
                            const value = entry.values[hover];
                            return value === null || value === undefined ? null : (
                                <circle key={entry.id} cx={x(hover)} cy={y(value)} r={4} fill={chartFill(tokens[seriesIndex]!)} stroke="hsl(var(--rf-card))" strokeWidth={2} />
                            );
                        })}
                    </g>
                )}
                <rect
                    x={margin.left} y={margin.top} width={width - margin.left - margin.right} height={bottom - margin.top} fill="transparent"
                    onPointerMove={(event) => {
                        const index = bucketAt(event, width, margin.left, margin.right, n);
                        setHover(index);
                        tooltip.show(event, titles?.[index] ?? labels[index] ?? '', rowsAt(index));
                    }}
                    onPointerLeave={() => {
                        setHover(null);
                        tooltip.hide();
                    }}
                />
            </svg>
            <ChartDataTable caption={ariaLabel} columns={series.map((entry) => entry.label)} rows={labels.map((label, index) => ({ label: titles?.[index] ?? label, values: series.map((entry) => shown(entry.values[index])) }))} />
            {tooltip.element}
        </figure>
    );
}

export interface AreaChartProps {
    series: readonly { readonly id: string; readonly label: string; readonly color?: ChartColor; readonly values: readonly number[] }[];
    labels: readonly string[];
    ariaLabel: string;
    titles?: readonly string[];
    labelEvery?: number;
    format?: (value: number) => string;
    /** Each series on top of the previous ones (default true): a cumulative flow, a composition. */
    stacked?: boolean;
    height?: number;
    className?: string;
}

/**
 * CR-112 — areas over time, stacked by default: the cumulative flow of work through its stages, the
 * composition of a total. A crosshair shows every series and the total at a point.
 */
export function AreaChart({ series, labels, ariaLabel, titles, labelEvery = 1, format: formatProp, stacked = true, height = 240, className }: AreaChartProps) {
    const format = useChartFormat(formatProp);
    const { dict } = useI18nOrEnglish();
    const tooltip = useChartTooltip();
    const [figureRef, width] = useChartWidth<HTMLElement>(520);
    const [hover, setHover] = useState<number | null>(null);
    const n = labels.length;
    const flat = series.flatMap((entry) => labels.map((_, index) => entry.values[index] ?? 0));
    const animated = useAnimatedValues(flat, 650, 0);
    if (n === 0 || series.length === 0) return <ChartEmpty height={height} />;
    const margin = { top: 12, right: 12, bottom: 28, left: 50 };
    const bottom = height - margin.bottom;
    const totals = labels.map((_, index) => series.reduce((sum, entry) => sum + (entry.values[index] ?? 0), 0));
    const max = niceMax(Math.max(1, ...(stacked ? totals : flat)) * 1.05);
    const x = (index: number) => margin.left + (n <= 1 ? (width - margin.left - margin.right) / 2 : (index / (n - 1)) * (width - margin.left - margin.right));
    const y = (value: number) => bottom - (value / max) * (bottom - margin.top);
    const tokens = series.map((entry, index) => chartToken(entry.color, index + 1));
    // The lower and upper edge of each series at each point.
    const edges = series.map((_, seriesIndex) => labels.map((__, index) => {
        const value = animated[seriesIndex * n + index] ?? 0;
        const below = stacked ? series.slice(0, seriesIndex).reduce((sum, ___, lower) => sum + (animated[lower * n + index] ?? 0), 0) : 0;
        return { low: below, high: below + value };
    }));
    const rowsAt = (index: number): ChartTooltipRow[] => [
        ...series.map((entry, seriesIndex) => ({ label: entry.label, value: format(entry.values[index] ?? 0), token: tokens[seriesIndex] })),
        ...(stacked ? [{ label: dict.charts.total, value: format(totals[index] ?? 0) }] : []),
    ];

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            <ChartLegend items={series.map((entry, index) => ({ label: entry.label, token: tokens[index]! }))} />
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                {ticks(0, max).map((tick) => (
                    <g key={tick}>
                        <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke={GRID_LINE} strokeDasharray={tick === 0 ? undefined : '3 4'} />
                        <text x={margin.left - 6} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={AXIS_TEXT}>{format(tick)}</text>
                    </g>
                ))}
                {labels.map((label, index) => (index % labelEvery === 0 || index === n - 1 ? (
                    <text key={index} x={x(index)} y={height - 8} textAnchor={n > 1 && index === 0 ? 'start' : n > 1 && index === n - 1 ? 'end' : 'middle'} fontSize="11" fill={AXIS_TEXT}>{label}</text>
                ) : null))}
                {series.map((entry, seriesIndex) => {
                    const edge = edges[seriesIndex]!;
                    const top = edge.map((point, index) => [x(index), y(point.high)] as const);
                    const base = edge.map((point, index) => [x(index), y(point.low)] as const).reverse();
                    return (
                        <g key={entry.id}>
                            <path d={`${pathOf(top)}${base.map(([px, py]) => `L${px.toFixed(1)},${py.toFixed(1)}`).join('')}Z`} fill={chartFill(tokens[seriesIndex]!, stacked ? 0.72 : 0.2)} />
                            <path d={pathOf(top)} fill="none" stroke={chartFill(tokens[seriesIndex]!)} strokeWidth={1.5} strokeLinejoin="round" />
                        </g>
                    );
                })}
                {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={margin.top} y2={bottom} stroke={AXIS_TEXT} strokeWidth={1} pointerEvents="none" />}
                <rect
                    x={margin.left} y={margin.top} width={width - margin.left - margin.right} height={bottom - margin.top} fill="transparent"
                    onPointerMove={(event) => {
                        const index = bucketAt(event, width, margin.left, margin.right, n);
                        setHover(index);
                        tooltip.show(event, titles?.[index] ?? labels[index] ?? '', rowsAt(index));
                    }}
                    onPointerLeave={() => {
                        setHover(null);
                        tooltip.hide();
                    }}
                />
            </svg>
            <ChartDataTable
                caption={ariaLabel}
                columns={[...series.map((entry) => entry.label), ...(stacked ? [dict.charts.total] : [])]}
                rows={labels.map((label, index) => ({ label: titles?.[index] ?? label, values: [...series.map((entry) => format(entry.values[index] ?? 0)), ...(stacked ? [format(totals[index] ?? 0)] : [])] }))}
            />
            {tooltip.element}
        </figure>
    );
}

export interface SparklineProps {
    /** The trend; null leaves a gap. */
    values: ReadonlyArray<number | null>;
    color?: ChartColor;
    height?: number;
    className?: string;
    /** Text alternative; without it the sparkline is decorative (beside the number it illustrates). */
    ariaLabel?: string;
}

/** CR-112 — the trend line of a KPI tile: a filled area, the last point marked, gaps skipped. */
export function Sparkline({ values, color = '--rf-primary', height = 30, className, ariaLabel }: SparklineProps) {
    const token = chartToken(color);
    const known = values.map((value) => (value === null || value === undefined ? Number.NaN : value));
    const finite = known.filter((value) => Number.isFinite(value));
    const min = finite.length ? Math.min(...finite) : 0;
    const max = finite.length ? Math.max(...finite) : 1;
    const animated = useAnimatedValues(known.map((value) => (Number.isFinite(value) ? value : min)), 700, 0);
    const points = animated
        .map((value, index) => ({ index, value, known: Number.isFinite(known[index]!) }))
        .filter((point) => point.known)
        .map((point) => [values.length <= 1 ? 80 : 1 + (point.index / (values.length - 1)) * 158, height - 3 - ((point.value - min) / (max - min || 1)) * (height - 8)] as const);
    const a11y = ariaLabel ? { role: 'img' as const, 'aria-label': ariaLabel } : { 'aria-hidden': true as const };
    if (points.length === 0) return <svg viewBox={`0 0 160 ${height}`} className={cn('block w-full', className)} style={{ height }} {...a11y} />;
    const line = points.map(([px, py], index) => `${index ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join('');
    const [lastX, lastY] = points[points.length - 1]!;
    return (
        <svg viewBox={`0 0 160 ${height}`} preserveAspectRatio="none" className={cn('block w-full', className)} style={{ height }} {...a11y}>
            <path d={`${line}L${lastX},${height - 1}L${points[0]![0]},${height - 1}Z`} fill={chartFill(token, 0.12)} />
            <path d={line} fill="none" stroke={chartFill(token)} strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <circle cx={lastX} cy={lastY} r={2.4} fill={chartFill(token)} />
        </svg>
    );
}
