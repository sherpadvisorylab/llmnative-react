import React from 'react';
import { useIconProvider } from '../../providers/icon/IconProviderContext';
import type { IconProviderAdapter } from '../../providers/icon/IconProvider';

interface IconProps {
    name: string;
    size?: number;
    className?: string;
    /** Override the global icon provider for this instance only */
    provider?: IconProviderAdapter;
    label?: string;
}

const Icon = ({ name, size = 16, className, provider: overrideProvider }: IconProps) => {
    const contextProvider = useIconProvider();
    const provider = overrideProvider ?? contextProvider;
    if (!provider || !name) return null;
    const Component = provider.resolve(name);
    if (!Component) return null;
    return <Component size={size} className={className} />;
};

export default Icon;
