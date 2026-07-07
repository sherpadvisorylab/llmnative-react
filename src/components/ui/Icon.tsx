import React from 'react';
import { useIconProvider } from '../../providers/icon/IconProviderContext';
import type { IconProviderAdapter } from '../../providers/icon/IconProvider';
import { LucideIconProvider } from '../../providers/icon/LucideIconProvider';

interface IconProps {
    /** Icon name (provider-specific identifier). */
    name?: string;
    /** Icon size in px. Defaults to `16`. */
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    /** Override the global icon provider for this instance only */
    provider?: IconProviderAdapter;
    /** Accessible label for screen readers. */
    label?: string;
    /** Provider-specific variant — e.g. PhosphorWeight: 'thin'|'light'|'regular'|'bold'|'fill'|'duotone'. Ignored by providers that don't support it. */
    weight?: string;
}

const defaultProvider = new LucideIconProvider();

const Icon = ({ name, size = 16, className, style, provider: overrideProvider, label, weight }: IconProps) => {
    const contextProvider = useIconProvider();
    const provider = overrideProvider ?? contextProvider ?? defaultProvider;
    if (!provider || typeof name !== 'string' || !name.trim()) return null;
    const Component = provider.resolve(name);
    if (!Component) return null;
    return <Component size={size} className={className} style={style} weight={weight} aria-label={label} aria-hidden={label ? undefined : true} />;
};

export default Icon;
