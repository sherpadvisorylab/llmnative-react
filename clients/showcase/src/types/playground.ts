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
    /** Hide this control when the predicate returns true. Evaluated against current prop values. */
    hidden?: (props: Record<string, any>) => boolean;
};

export type PlaygroundConfig = {
    props: PropDef[];
    defaultProps: Record<string, any>;
    mockSeed?: Record<string, Record<string, any>>;
    render: (props: Record<string, any>, onValuesChange?: (v: Record<string, any>) => void) => React.ReactNode;
    /** Width of the playground drawer. Default: 'md' */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
    /** Use a side-by-side controls and preview layout for visual components. Default: false */
    layout?: 'stacked' | 'split';
    /** Show the Form record (JSON) accordion. Enable only for form-field components. Default: false */
    showFormRecord?: boolean;
};

import React from 'react';
