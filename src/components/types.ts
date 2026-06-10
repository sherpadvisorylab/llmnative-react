import type React from 'react';
import type { MotionReference } from '../motion';

/** Slot and class props shared by every UI component. */
export interface UIProps {
    /** Content rendered immediately before the component's root element. */
    before?: React.ReactNode;
    /** Content rendered immediately after the component's root element. */
    after?: React.ReactNode;
    /** CSS classes applied to the outermost wrapper element. */
    wrapperClassName?: string;
    /** CSS classes applied to the component's primary element. */
    className?: string;
}

/** UIProps extended with an optional motion animation reference. */
export interface MotionUIProps extends UIProps {
    /** Named motion preset or inline MotionProps override. */
    motion?: MotionReference;
}
