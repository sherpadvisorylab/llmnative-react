import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useI18nOrEnglish } from '../../I18n';

/**
 * CR-112 — the shared parts of the charts: scales, colours, motion, width, number format.
 * Colours are theme tokens: a series names one (`'--rf-chart-1'`, `'--rf-primary'`) or a slot of the
 * categorical palette (`1…8`, `--rf-chart-N`); marks read them as `hsl(var(--token))`, so every chart
 * follows the theme and its dark mode.
 */

/** A theme token (`'--rf-chart-2'`, `'--rf-success'`) or a slot of the categorical palette (1…8). */
export type ChartColor = string | number;

/** The CSS custom property of a chart colour; slots cycle through the eight of the palette. */
export function chartToken(color: ChartColor | undefined, fallbackSlot = 1): string {
    if (typeof color === 'string' && color.startsWith('--')) return color;
    const slot = typeof color === 'number' ? color : fallbackSlot;
    return `--rf-chart-${((Math.max(1, Math.round(slot)) - 1) % 8) + 1}`;
}

/** `hsl(var(--token))`, with an optional alpha. */
export const chartFill = (token: string, alpha?: number) => (alpha === undefined ? `hsl(var(${token}))` : `hsl(var(${token}) / ${alpha})`);

export const AXIS_TEXT = 'hsl(var(--rf-muted-foreground))';
export const GRID_LINE = 'hsl(var(--rf-border))';

/** Rounded axis maximum (1, 2, 2.5, 5 × 10ⁿ) at or above `value`. */
export function niceMax(value: number): number {
    if (!(value > 0)) return 1;
    const exponent = 10 ** Math.floor(Math.log10(value));
    const fraction = value / exponent;
    return (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10) * exponent;
}

/** Evenly spaced ticks from `min` to `max`, both included. */
export function ticks(min: number, max: number, count = 4): number[] {
    return Array.from({ length: count + 1 }, (_, index) => min + ((max - min) * index) / count);
}

/** The number format of the current locale (up to two decimals), the default of every chart. */
export function useChartFormat(format?: (value: number) => string): (value: number) => string {
    const { locale } = useI18nOrEnglish();
    const [formatter] = useState(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }));
    return format ?? ((value: number) => formatter.format(value));
}

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const ease = (t: number) => 1 - (1 - t) ** 3;

/**
 * Values that glide from what was shown before to `target` (from 0 on first mount), each mark
 * `stagger` ms after the previous one, ease-out cubic. Reduced motion shows `target` at once.
 */
export function useAnimatedValues(target: readonly number[], duration = 600, stagger = 15): number[] {
    const [shown, setShown] = useState<number[]>(() => (prefersReducedMotion() ? [...target] : target.map(() => 0)));
    const latest = useRef<number[]>(shown);
    const key = target.join('|');

    useEffect(() => {
        const from = latest.current.length === target.length ? latest.current : target.map(() => 0);
        if (prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') {
            latest.current = [...target];
            setShown([...target]);
            return undefined;
        }
        const startedAt = performance.now();
        const total = duration + stagger * Math.max(0, target.length - 1);
        let frame = 0;
        const step = (now: number) => {
            const values = target.map((value, index) => {
                const t = Math.min(1, Math.max(0, (now - startedAt - index * stagger) / duration));
                return (from[index] ?? 0) + (value - (from[index] ?? 0)) * ease(t);
            });
            latest.current = values;
            setShown(values);
            if (now - startedAt < total) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
        // `key` stands for the content of `target`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, duration, stagger]);

    return shown;
}

/** 0 → 1 once per `key` change: for fades and lines that draw themselves. */
export function useReveal(key: string, duration = 700, delay = 0): number {
    const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));
    useEffect(() => {
        if (prefersReducedMotion() || typeof requestAnimationFrame === 'undefined') {
            setProgress(1);
            return undefined;
        }
        const startedAt = performance.now() + delay;
        let frame = 0;
        const step = (now: number) => {
            const t = Math.min(1, Math.max(0, (now - startedAt) / duration));
            setProgress(ease(t));
            if (t < 1) frame = requestAnimationFrame(step);
        };
        setProgress(0);
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [key, duration, delay]);
    return progress;
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * The rendered width of a chart's container in CSS pixels, kept current with a ResizeObserver: the
 * charts use it as the width of their SVG viewBox, so text and marks keep their real size in a narrow
 * card and in a wide one. `fallback` is used before the first measure (and in server rendering).
 */
export function useChartWidth<T extends HTMLElement = HTMLElement>(fallback: number): [RefObject<T | null>, number] {
    const ref = useRef<T | null>(null);
    const [width, setWidth] = useState(fallback);
    useIsomorphicLayoutEffect(() => {
        const element = ref.current;
        if (!element) return undefined;
        const update = () => {
            const measured = Math.round(element.getBoundingClientRect().width);
            if (measured > 0) setWidth(measured);
        };
        update();
        if (typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    return [ref, width];
}

/** Hit areas take the keyboard while there are few of them; with many, the data table stands in. */
export const KEYBOARD_LIMIT = 40;
