import React from 'react';

export interface IconComponentProps {
    size?: number;
    className?: string;
    [key: string]: unknown;
}

export interface IconProviderAdapter {
    readonly id: string;
    resolve(name: string): React.ComponentType<IconComponentProps> | null;
    /** The names of the icons it draws, each one that `resolve` finds (CR-148: the grid of `IconPicker`). */
    list?(): string[];
}

/** An icon name of a component name, so that the kebab→PascalCase of `resolve` finds it again (`ArrowUp01` → `arrow-up-01`). */
export function toKebabCase(name: string): string {
    return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])([0-9])/g, '$1-$2').toLowerCase();
}
