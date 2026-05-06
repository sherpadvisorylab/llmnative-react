import React from 'react';
import { useIconProvider } from '../../providers/icon/IconProviderContext';
import type { IconProvider } from '../../providers/icon/IconProvider';

interface IconProps {
    name?: string;
    /** @deprecated use name */
    icon?: string;
    size?: number;
    className?: string;
    /** Override the global icon provider for this instance only */
    provider?: IconProvider;
    label?: string;
}

const Icon = ({ name, icon, size = 16, className, provider: overrideProvider }: IconProps) => {
    const resolvedName = name ?? icon ?? '';
    const nameProp = resolvedName; // local alias for clarity
    const contextProvider = useIconProvider();
    const provider = overrideProvider ?? contextProvider;
    if (!provider || !nameProp) return null;
    const Component = provider.resolve(nameProp);
    if (!Component) return null;
    return <Component size={size} className={className} />;
};

export default Icon;
