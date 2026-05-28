import React from 'react';

export type PropControl = 'text' | 'number' | 'boolean' | 'select' | 'json' | 'range' | 'textarea' | 'icon';

export type PropShortcut = {
    label: string;
    value: unknown;
    help?: string;
};

export type PropDef = {
    name: string;
    type: string;
    shape?: string;
    typeDetails?: string;
    example?: string;
    group?: string;
    default?: string;
    required?: boolean;
    description?: string;
    control?: PropControl;
    readOnly?: boolean;
    help?: string;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
    textareaMode?: 'text' | 'json';
    placeholder?: string;
    validationMessage?: string;
    shortcuts?: PropShortcut[];
    hidden?: (props: Record<string, any>) => boolean;
};

export type PlaygroundConfig = {
    props: PropDef[];
    defaultProps: Record<string, any>;
    mockSeed?: Record<string, Record<string, any>>;
    render: (props: Record<string, any>, onValuesChange?: (v: Record<string, any>) => void) => React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fullscreen';
    layout?: 'stacked' | 'split';
    showFormRecord?: boolean;
};

export interface PlaygroundIconProps {
    name: string;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

export interface PlaygroundModalProps {
    header: React.ReactNode;
    size?: PlaygroundConfig['size'];
    onClose: () => void;
    children: React.ReactNode;
}

export interface PlaygroundMockProviderProps {
    seed: Record<string, Record<string, any>>;
    children: React.ReactNode;
}

export type PlaygroundEnvironment = {
    Icon: React.ComponentType<PlaygroundIconProps>;
    Modal: React.ComponentType<PlaygroundModalProps>;
    MockProvider?: React.ComponentType<PlaygroundMockProviderProps>;
};
