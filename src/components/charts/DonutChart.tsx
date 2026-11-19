import React, { useState, type ReactNode } from 'react';
import { cn } from '../../libs/cn';
import { KEYBOARD_LIMIT, chartFill, chartToken, useAnimatedValues, useChartFormat, type ChartColor } from './chartCore';
import { ChartDataTable, ChartEmpty, hitHandlers, useChartTooltip, type ChartTooltipRow } from './ChartParts';

export interface DonutSlice {
    readonly id: string;
    readonly label: string;
    readonly value: number;
    readonly color?: ChartColor;
    /** The text of its value; by default the formatted value. */
    readonly valueText?: string;
    readonly tooltip?: readonly ChartTooltipRow[];
}

export interface DonutChartProps {
    slices: readonly DonutSlice[];
    ariaLabel: string;
    format?: (value: number) => string;
    /** The value of the whole ring (e.g. 100 for percentages): what the slices leave is drawn as the empty track. By default their sum. */
    total?: number;
    /** What the hole shows: by default the sum of the slices, formatted. */
    center?: { readonly value: ReactNode; readonly label?: ReactNode };
    /** The side of the ring, in px. */
    size?: number;
    /** The width of the ring, in px. */
    thickness?: number;
    /** The legend next to the ring (label, value and share of each slice); `false` hides it. */
    legend?: boolean;
    /** A slice shown as selected (the others fade). */
    activeId?: string | null;
    className?: string;
    onSliceClick?: (slice: DonutSlice) => void;
}

/**
 * CR-149 — a ring split in slices, each of its colour, with a value in the hole: how a whole is shared
 * (a budget, a commission, a team's time). `total` larger than the slices leaves the rest as the empty
 * track. Hover or focus a slice for its tooltip; it lifts and the others fade, the same in the legend.
 */
export function DonutChart({
    slices, ariaLabel, format: formatProp, total, center, size = 220, thickness = 28, legend = true, activeId = null, className, onSliceClick,
}: DonutChartProps) {
    const format = useChartFormat(formatProp);
    const tooltip = useChartTooltip();
    const [hover, setHover] = useState<string | null>(null);
    const values = slices.map((slice) => Math.max(0, slice.value));
    const animated = useAnimatedValues(values, 700, 60);
    const sum = values.reduce((acc, value) => acc + value, 0);
    if (slices.length === 0 || sum <= 0) return <ChartEmpty height={Math.min(size, 160)} />;
    const whole = Math.max(sum, total ?? 0);
    const radius = (size - thickness) / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    // A thin gap between the slices, when there is more than one.
    const gap = slices.filter((_, index) => values[index]! > 0).length > 1 ? Math.min(3, circumference / 200) : 0;
    const keyboard = slices.length <= KEYBOARD_LIMIT;
    const focus = hover ?? activeId;
    const share = (value: number) => `${((value / whole) * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
    const textOf = (slice: DonutSlice, index: number) => slice.valueText ?? format(values[index]!);
    let offset = 0;

    return (
        <figure className={cn('flex flex-wrap items-center gap-6', className)}>
            <div className="relative shrink-0" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={ariaLabel} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--rf-muted))" strokeWidth={thickness} />
                    {slices.map((slice, index) => {
                        const value = animated[index] ?? 0;
                        const length = (circumference * value) / whole;
                        const start = offset;
                        offset += (circumference * values[index]!) / whole;
                        if (values[index]! <= 0) return null;
                        const token = chartToken(slice.color, index + 1);
                        const faded = focus !== null && focus !== slice.id;
                        const lifted = focus === slice.id;
                        const handlers = hitHandlers(tooltip, slice.label, slice.tooltip ?? [{ label: share(values[index]!), value: textOf(slice, index), token }], keyboard);
                        return (
                            <circle
                                key={slice.id}
                                data-rf-donut-slice={slice.id}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={chartFill(token)}
                                strokeWidth={lifted ? thickness + 8 : thickness}
                                strokeDasharray={`${Math.max(0, length - gap)} ${circumference}`}
                                strokeDashoffset={-start}
                                opacity={faded ? 0.35 : 1}
                                style={{ transition: 'stroke-width 160ms ease, opacity 160ms ease', cursor: onSliceClick ? 'pointer' : undefined }}
                                onClick={onSliceClick ? () => onSliceClick(slice) : undefined}
                                {...handlers}
                                onPointerMove={(event) => { setHover(slice.id); handlers.onPointerMove(event); }}
                                onPointerLeave={() => { setHover(null); handlers.onPointerLeave(); }}
                            />
                        );
                    })}
                </svg>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center" aria-hidden="true">
                    <span className="text-2xl font-semibold tabular-nums text-foreground">{center ? center.value : format(sum)}</span>
                    {center?.label ? <span className="mt-0.5 max-w-[60%] text-xs text-muted-foreground">{center.label}</span> : null}
                </div>
            </div>
            {legend ? (
                <ul className="flex min-w-[10rem] flex-1 flex-col gap-1.5 text-sm">
                    {slices.map((slice, index) => (
                        <li
                            key={slice.id}
                            className={cn('flex items-center gap-2 rounded-md px-2 py-1 transition-opacity', focus !== null && focus !== slice.id && 'opacity-50')}
                            onPointerEnter={() => setHover(slice.id)}
                            onPointerLeave={() => setHover(null)}
                        >
                            <span aria-hidden="true" className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: chartFill(chartToken(slice.color, index + 1)) }} />
                            <span className="min-w-0 flex-1 truncate text-foreground">{slice.label}</span>
                            <span className="tabular-nums font-medium text-foreground">{textOf(slice, index)}</span>
                        </li>
                    ))}
                </ul>
            ) : null}
            <ChartDataTable caption={ariaLabel} columns={[ariaLabel]} rows={slices.map((slice, index) => ({ label: slice.label, values: [textOf(slice, index)] }))} />
            {tooltip.element}
        </figure>
    );
}
