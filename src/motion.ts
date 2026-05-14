import React from 'react';
import { useMotionRegistry } from './Theme';

export type ReducedMotionMode = 'respect-user' | 'always' | 'never';
export type MotionStyle = React.CSSProperties;
export type MotionReference = string | MotionEffect | false;

export interface MotionTransition {
    duration?: number;
    easing?: string;
    delay?: number;
    properties?: string[];
}

export interface MotionEffect {
    from?: MotionStyle;
    to?: MotionStyle;
    transition?: MotionTransition;
    reducedMotion?: ReducedMotionMode;
}

export type MotionRegistry = Record<string, MotionEffect>;

export interface ResolvedMotionEffect {
    from: MotionStyle;
    to: MotionStyle;
    transition: Required<MotionTransition>;
    reducedMotion: ReducedMotionMode;
    transitionValue: string;
}

const NONE_EFFECT: MotionEffect = {
    from: {},
    to: {},
    transition: {
        duration: 0,
        easing: 'linear',
        delay: 0,
        properties: ['opacity', 'transform', 'box-shadow'],
    },
    reducedMotion: 'always',
};

const FALLBACK_EFFECT: MotionEffect = {
    from: {},
    to: {},
    transition: {
        duration: 160,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        delay: 0,
        properties: ['opacity', 'transform', 'box-shadow'],
    },
    reducedMotion: 'respect-user',
};

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const resolveReference = (
    reference: MotionReference | undefined,
    registry: MotionRegistry,
    fallback: MotionReference = 'fade'
): MotionEffect => {
    const candidate = reference === undefined ? fallback : reference;

    if (candidate === false) return NONE_EFFECT;
    if (typeof candidate === 'string') return registry[candidate] ?? registry.none ?? NONE_EFFECT;
    return candidate;
};

export const createMotionTransition = (transition: Required<MotionTransition>): string =>
    transition.properties
        .map((property) => `${property} ${transition.duration}ms ${transition.easing} ${transition.delay}ms`)
        .join(', ');

export const resolveMotionEffect = (
    reference: MotionReference | undefined,
    registry: MotionRegistry = {},
    fallback?: MotionReference
): ResolvedMotionEffect => {
    const base = resolveReference(fallback, registry, 'fade');
    const effect = resolveReference(reference, registry, fallback);
    const mergedTransition = {
        ...FALLBACK_EFFECT.transition,
        ...base.transition,
        ...effect.transition,
    };
    const reducedMotion = effect.reducedMotion ?? base.reducedMotion ?? FALLBACK_EFFECT.reducedMotion!;
    const reduced = reducedMotion === 'always'
        || (reducedMotion === 'respect-user' && prefersReducedMotion());
    const transition = {
        duration: reduced ? 0 : mergedTransition.duration!,
        easing: reduced ? 'linear' : mergedTransition.easing!,
        delay: reduced ? 0 : mergedTransition.delay!,
        properties: mergedTransition.properties!,
    };

    return {
        from: reduced ? {} : { ...(base.from ?? {}), ...(effect.from ?? {}) },
        to: reduced ? {} : { ...(base.to ?? {}), ...(effect.to ?? {}) },
        transition,
        reducedMotion,
        transitionValue: createMotionTransition(transition),
    };
};

export const useMotionEffect = (
    reference?: MotionReference,
    fallback?: MotionReference
): ResolvedMotionEffect => {
    const registry = useMotionRegistry();
    return React.useMemo(
        () => resolveMotionEffect(reference, registry, fallback),
        [reference, registry, fallback]
    );
};

export const useMotionState = (
    active: boolean,
    reference?: MotionReference,
    fallback?: MotionReference,
    baseStyle?: React.CSSProperties
): React.CSSProperties => {
    const effect = useMotionEffect(reference, fallback);

    return React.useMemo(() => ({
        ...baseStyle,
        ...(active ? effect.to : effect.from),
        transition: [
            baseStyle?.transition,
            effect.transitionValue,
        ].filter(Boolean).join(', '),
    }), [active, baseStyle, effect]);
};

export const usePressMotion = (
    disabled = false,
    baseStyle?: React.CSSProperties,
    reference?: MotionReference,
    fallback: MotionReference = 'press'
) => {
    const effect = useMotionEffect(reference, fallback);
    const [pressed, setPressed] = React.useState(false);

    const style = React.useMemo<React.CSSProperties>(() => ({
        ...baseStyle,
        ...(pressed && !disabled ? effect.to : effect.from),
        transition: [
            baseStyle?.transition,
            effect.transitionValue,
        ].filter(Boolean).join(', '),
    }), [baseStyle, disabled, effect, pressed]);

    return {
        style,
        pressHandlers: {
            onMouseDown: () => !disabled && setPressed(true),
            onMouseUp: () => setPressed(false),
            onMouseLeave: () => setPressed(false),
            onBlur: () => setPressed(false),
        },
    };
};

export const useEnterMotion = (
    baseStyle?: React.CSSProperties,
    reference?: MotionReference,
    fallback: MotionReference = 'fadeUp'
) => {
    const [entered, setEntered] = React.useState(false);

    React.useEffect(() => {
        setEntered(false);
        const frame = window.requestAnimationFrame(() => setEntered(true));
        return () => window.cancelAnimationFrame(frame);
    }, [reference, fallback]);

    return useMotionState(entered, reference, fallback, baseStyle);
};
