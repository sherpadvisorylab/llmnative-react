import React, { useCallback, useState } from 'react';
import type { FocusEvent as ReactFocusEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useI18nOrEnglish } from '../../I18n';
import { chartFill } from './chartCore';

export interface ChartLegendItem {
    readonly label: string;
    /** Theme token of the swatch, e.g. `'--rf-chart-1'`. */
    readonly token: string;
    readonly shape?: 'square' | 'line' | 'dashed' | 'dot';
}

/** The legend of a chart: swatch and label, the text in the text tokens (identity is never colour alone). */
export function ChartLegend({ items }: { items: readonly ChartLegendItem[] }) {
    if (items.length === 0) return null;
    return (
        <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {items.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                    {item.shape === 'dashed'
                        ? <span aria-hidden="true" className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: chartFill(item.token) }} />
                        : <span
                            aria-hidden="true"
                            className={item.shape === 'line' ? 'inline-block h-0.5 w-4 rounded' : item.shape === 'dot' ? 'inline-block size-2.5 rounded-full' : 'inline-block size-2.5 rounded-sm'}
                            style={{ background: chartFill(item.token) }}
                        />}
                    {item.label}
                </span>
            ))}
        </figcaption>
    );
}

export interface ChartTooltipRow {
    readonly label: string;
    readonly value: string;
    /** Theme token of the series swatch, e.g. `'--rf-chart-1'`. */
    readonly token?: string;
}

interface TooltipState {
    readonly x: number;
    readonly y: number;
    readonly title: string;
    readonly rows: readonly ChartTooltipRow[];
}

/**
 * The tooltip of the charts: follows the pointer, or sits by the mark that has the keyboard focus;
 * rendered in a portal so the overflow or transform of a card never clips it. Values use the text
 * tokens; only the swatch carries colour.
 */
export function useChartTooltip(): {
    readonly show: (event: ReactPointerEvent, title: string, rows: readonly ChartTooltipRow[]) => void;
    readonly showAt: (event: ReactFocusEvent<Element>, title: string, rows: readonly ChartTooltipRow[]) => void;
    readonly hide: () => void;
    readonly element: ReactNode;
} {
    const [state, setState] = useState<TooltipState | null>(null);
    const show = useCallback((event: ReactPointerEvent, title: string, rows: readonly ChartTooltipRow[]) => {
        setState({ x: event.clientX, y: event.clientY, title, rows });
    }, []);
    const showAt = useCallback((event: ReactFocusEvent<Element>, title: string, rows: readonly ChartTooltipRow[]) => {
        const box = event.currentTarget.getBoundingClientRect();
        setState({ x: box.left + box.width / 2, y: box.top, title, rows });
    }, []);
    const hide = useCallback(() => setState(null), []);
    const element = state && typeof document !== 'undefined'
        ? createPortal(
            <div
                role="tooltip"
                className="pointer-events-none fixed z-[100] min-w-40 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
                style={{
                    left: Math.max(8, Math.min(state.x + 14, window.innerWidth - 240)),
                    top: Math.max(8, Math.min(state.y + 14, window.innerHeight - 40 - state.rows.length * 20)),
                }}
            >
                <div className="mb-1 font-semibold text-foreground">{state.title}</div>
                {state.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            {row.token && <span aria-hidden="true" className="inline-block size-2 rounded-sm" style={{ background: chartFill(row.token) }} />}
                            {row.label}
                        </span>
                        <span className="font-medium tabular-nums text-foreground">{row.value}</span>
                    </div>
                ))}
            </div>,
            document.body,
        )
        : null;
    return { show, showAt, hide, element };
}

/**
 * The data of a chart as a table only screen readers read: its text alternative. `rows` are the
 * buckets (a label and one formatted value per column).
 */
export function ChartDataTable({ caption, columns, rows }: { caption: string; columns: readonly string[]; rows: ReadonlyArray<{ label: string; values: readonly string[] }> }) {
    const { dict } = useI18nOrEnglish();
    if (rows.length === 0) return null;
    return (
        <table className="sr-only">
            <caption>{`${dict.charts.dataTable}: ${caption}`}</caption>
            <thead>
                <tr>
                    <th scope="col" />
                    {columns.map((column) => <th key={column} scope="col">{column}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={`${row.label}-${index}`}>
                        <th scope="row">{row.label}</th>
                        {row.values.map((value, column) => <td key={column}>{value}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/** What a chart shows with nothing to draw. */
export function ChartEmpty({ height }: { height: number }) {
    const { dict } = useI18nOrEnglish();
    return <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>{dict.charts.noData}</div>;
}

/** The handlers of a hit area: the pointer, and the keyboard while the chart has few of them. */
export function hitHandlers(
    tooltip: ReturnType<typeof useChartTooltip>,
    title: string,
    rows: readonly ChartTooltipRow[],
    keyboard: boolean,
) {
    return {
        onPointerMove: (event: ReactPointerEvent) => tooltip.show(event, title, rows),
        onPointerLeave: tooltip.hide,
        ...(keyboard ? {
            tabIndex: 0,
            role: 'img' as const,
            'aria-label': `${title}: ${rows.map((row) => `${row.label} ${row.value}`).join(', ')}`,
            onFocus: (event: ReactFocusEvent<Element>) => tooltip.showAt(event, title, rows),
            onBlur: tooltip.hide,
            className: 'outline-none focus-visible:stroke-ring focus-visible:[stroke-width:2]',
        } : {}),
    };
}
