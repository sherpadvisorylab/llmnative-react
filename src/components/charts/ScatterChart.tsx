import React from 'react';
import { cn } from '../../libs/cn';
import { AXIS_TEXT, GRID_LINE, KEYBOARD_LIMIT, chartFill, chartToken, niceMax, ticks, useChartFormat, useChartWidth, useReveal, type ChartColor } from './chartCore';
import { ChartDataTable, ChartEmpty, ChartLegend, hitHandlers, useChartTooltip, type ChartTooltipRow } from './ChartParts';

export interface ScatterPoint {
    readonly id: string;
    readonly label: string;
    readonly x: number;
    readonly y: number;
    /** A third quantity as the area of the point (e.g. how many turns); all points the same without it. */
    readonly size?: number;
    /** The id of its series (its colour and legend); the first series without it. */
    readonly series?: string;
    /** Rows of its tooltip; by default its x, y and size. */
    readonly tooltip?: readonly ChartTooltipRow[];
}

export interface ScatterChartProps {
    points: readonly ScatterPoint[];
    ariaLabel: string;
    /** The groups of points: their label and colour, in the legend. */
    series?: readonly { readonly id: string; readonly label: string; readonly color?: ChartColor }[];
    xLabel: string;
    yLabel: string;
    sizeLabel?: string;
    formatX?: (value: number) => string;
    formatY?: (value: number) => string;
    formatSize?: (value: number) => string;
    /** The label of each point next to it (default true with few points). */
    showLabels?: boolean;
    height?: number;
    className?: string;
    onPointClick?: (point: ScatterPoint) => void;
}

/**
 * CR-112 — points by two quantities, an optional third as their area, coloured by series: cost against
 * rework per model, speed against size. Axes from zero to rounded maxima; points fade in.
 */
export function ScatterChart({
    points, ariaLabel, series = [], xLabel, yLabel, sizeLabel, formatX: formatXProp, formatY: formatYProp, formatSize: formatSizeProp,
    showLabels, height = 280, className, onPointClick,
}: ScatterChartProps) {
    const formatX = useChartFormat(formatXProp);
    const formatY = useChartFormat(formatYProp);
    const formatSize = useChartFormat(formatSizeProp);
    const tooltip = useChartTooltip();
    const [figureRef, width] = useChartWidth<HTMLElement>(520);
    const reveal = useReveal(points.map((point) => point.id).join('|'), 600);
    if (points.length === 0) return <ChartEmpty height={height} />;
    const margin = { top: 14, right: 16, bottom: 40, left: 56 };
    // Axes to the data, small values too (cents, fractions): an empty axis only when every value is 0.
    const maxX = niceMax(Math.max(...points.map((point) => point.x)) * 1.05);
    const maxY = niceMax(Math.max(...points.map((point) => point.y)) * 1.05);
    const maxSize = Math.max(0, ...points.map((point) => point.size ?? 0));
    const bottom = height - margin.bottom;
    const x = (value: number) => margin.left + (value / maxX) * (width - margin.left - margin.right);
    const y = (value: number) => bottom - (value / maxY) * (bottom - margin.top);
    // The area of a point follows its size: radius from 4 to 14.
    const radius = (size: number | undefined) => (maxSize > 0 && size !== undefined ? 4 + 10 * Math.sqrt(Math.max(0, size) / maxSize) : 6);
    const tokenOf = (id: string | undefined) => {
        const index = series.findIndex((entry) => entry.id === id);
        return chartToken(series[Math.max(0, index)]?.color, Math.max(0, index) + 1);
    };
    const labelled = showLabels ?? points.length <= 12;
    const keyboard = points.length <= KEYBOARD_LIMIT;
    const rowsOf = (point: ScatterPoint): readonly ChartTooltipRow[] => point.tooltip ?? [
        { label: xLabel, value: formatX(point.x) },
        { label: yLabel, value: formatY(point.y) },
        ...(point.size !== undefined && sizeLabel ? [{ label: sizeLabel, value: formatSize(point.size) }] : []),
    ];

    return (
        <figure ref={figureRef} className={cn('space-y-2', className)}>
            {series.length > 1 && <ChartLegend items={series.map((entry, index) => ({ label: entry.label, token: chartToken(entry.color, index + 1), shape: 'dot' as const }))} />}
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
                {ticks(0, maxY).map((tick) => (
                    <g key={`y-${tick}`}>
                        <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke={GRID_LINE} strokeDasharray={tick === 0 ? undefined : '3 4'} />
                        <text x={margin.left - 6} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill={AXIS_TEXT}>{formatY(tick)}</text>
                    </g>
                ))}
                {ticks(0, maxX).map((tick) => (
                    <g key={`x-${tick}`}>
                        <line x1={x(tick)} x2={x(tick)} y1={margin.top} y2={bottom} stroke={GRID_LINE} strokeDasharray={tick === 0 ? undefined : '3 4'} />
                        <text x={x(tick)} y={bottom + 16} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>{formatX(tick)}</text>
                    </g>
                ))}
                <text x={width - margin.right} y={height - 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>{xLabel}</text>
                <text x={margin.left} y={margin.top - 4} fontSize="11" fill={AXIS_TEXT}>{yLabel}</text>
                {points.map((point) => {
                    const token = tokenOf(point.series);
                    const r = radius(point.size);
                    return (
                        <g key={point.id} opacity={reveal}>
                            <circle
                                cx={x(point.x)} cy={y(point.y)} r={r} fill={chartFill(token, 0.55)} stroke={chartFill(token)} strokeWidth={1.5}
                                style={onPointClick ? { cursor: 'pointer' } : undefined}
                                onClick={onPointClick ? () => onPointClick(point) : undefined}
                                {...hitHandlers(tooltip, point.label, rowsOf(point), keyboard)}
                            />
                            {labelled && <text x={x(point.x) + r + 4} y={y(point.y) + 4} fontSize="11" fill="hsl(var(--rf-foreground))" pointerEvents="none">{point.label}</text>}
                        </g>
                    );
                })}
            </svg>
            <ChartDataTable
                caption={ariaLabel}
                columns={[xLabel, yLabel, ...(sizeLabel ? [sizeLabel] : [])]}
                rows={points.map((point) => ({ label: point.label, values: [formatX(point.x), formatY(point.y), ...(sizeLabel ? [point.size === undefined ? '—' : formatSize(point.size)] : [])] }))}
            />
            {tooltip.element}
        </figure>
    );
}
