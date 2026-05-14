import type React from 'react';
import type { MotionReference } from '../motion';

export interface UIProps {
    pre?: React.ReactNode;
    post?: React.ReactNode;
    wrapClass?: string;
    className?: string;
}

export interface MotionUIProps extends UIProps {
    motion?: MotionReference;
}
