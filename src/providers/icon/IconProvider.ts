import React from 'react';

export interface IconComponentProps {
    size?: number;
    className?: string;
    [key: string]: unknown;
}

export interface IconProviderAdapter {
    readonly id: string;
    resolve(name: string): React.ComponentType<IconComponentProps> | null;
}
