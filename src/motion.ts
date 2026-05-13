import React from 'react';
import { useTheme } from './Theme';

export type MotionPreset = 'none' | 'subtle' | 'standard' | 'expressive';
export type ReducedMotionMode = 'respect-user' | 'always' | 'never';

export interface MotionConfig {
    preset?: MotionPreset;
    reducedMotion?: ReducedMotionMode;
    duration?: number;
    easing?: string;
    pressScale?: number;
    enterDistance?: number;
}

export const MOTION_PRESETS: Record<MotionPreset, Required<Omit<MotionConfig, 'preset'>>> = {
    none: {
        reducedMotion: 'always',
        duration: 0,
        easing: 'linear',
        pressScale: 1,
        enterDistance: 0,
    },
    subtle: {
        reducedMotion: 'respect-user',
        duration: 120,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        pressScale: 0.99,
        enterDistance: 4,
    },
    standard: {
        reducedMotion: 'respect-user',
        duration: 160,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        pressScale: 0.98,
        enterDistance: 8,
    },
    expressive: {
        reducedMotion: 'respect-user',
        duration: 220,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pressScale: 0.97,
        enterDistance: 12,
    },
};

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const resolveMotionConfig = (config: MotionConfig = {}): Required<Omit<MotionConfig, 'preset'>> => {
    const preset = MOTION_PRESETS[config.preset ?? 'standard'];
    const merged = { ...preset, ...config };
    const reduced = merged.reducedMotion === 'always'
        || (merged.reducedMotion === 'respect-user' && prefersReducedMotion());

    return {
        reducedMotion: merged.reducedMotion ?? preset.reducedMotion,
        duration: reduced ? 0 : merged.duration ?? preset.duration,
        easing: reduced ? 'linear' : merged.easing ?? preset.easing,
        pressScale: reduced ? 1 : merged.pressScale ?? preset.pressScale,
        enterDistance: reduced ? 0 : merged.enterDistance ?? preset.enterDistance,
    };
};

export const useMotion = (override?: MotionConfig) => {
    const theme = useTheme('motion');
    return React.useMemo(
        () => resolveMotionConfig({ ...(theme.Motion ?? {}), ...(override ?? {}) }),
        [override, theme.Motion]
    );
};

export const createMotionTransition = (
    motion: Required<Omit<MotionConfig, 'preset'>>,
    properties: string[] = ['transform', 'opacity', 'box-shadow']
): string => properties
    .map((property) => `${property} ${motion.duration}ms ${motion.easing}`)
    .join(', ');

export const usePressMotion = (
    disabled = false,
    baseStyle?: React.CSSProperties,
    override?: MotionConfig
) => {
    const motion = useMotion(override);
    const [pressed, setPressed] = React.useState(false);

    const style = React.useMemo<React.CSSProperties>(() => ({
        ...baseStyle,
        transition: [
            baseStyle?.transition,
            createMotionTransition(motion),
        ].filter(Boolean).join(', '),
        transform: pressed && !disabled
            ? [baseStyle?.transform, `scale(${motion.pressScale})`].filter(Boolean).join(' ')
            : baseStyle?.transform,
    }), [baseStyle, disabled, motion, pressed]);

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
    override?: MotionConfig,
    distance?: number | string
) => {
    const motion = useMotion(override);
    const [entered, setEntered] = React.useState(false);

    React.useEffect(() => {
        setEntered(false);
        const frame = window.requestAnimationFrame(() => setEntered(true));
        return () => window.cancelAnimationFrame(frame);
    }, [motion.duration, motion.easing, motion.enterDistance]);

    return React.useMemo<React.CSSProperties>(() => {
        const enterDistance = distance ?? motion.enterDistance;
        return {
            ...baseStyle,
            opacity: entered ? baseStyle?.opacity : 0,
            transform: entered
                ? baseStyle?.transform
                : [baseStyle?.transform, `translateY(${typeof enterDistance === 'number' ? `${enterDistance}px` : enterDistance})`].filter(Boolean).join(' '),
            transition: [
                baseStyle?.transition,
                createMotionTransition(motion),
            ].filter(Boolean).join(', '),
        };
    }, [baseStyle, distance, entered, motion]);
};
