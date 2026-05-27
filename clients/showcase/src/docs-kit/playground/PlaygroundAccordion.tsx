import React from 'react';
import type { PlaygroundIconProps } from './playground.types';

interface PlaygroundAccordionProps {
    Icon: React.ComponentType<PlaygroundIconProps>;
    icon: string;
    label: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

export default function PlaygroundAccordion({
    Icon,
    icon,
    label,
    defaultOpen = false,
    children,
}: PlaygroundAccordionProps) {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
        <div className="flex min-h-0 flex-col border-t">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Icon name={icon} size={14} />
                    {label}
                </span>
                <Icon
                    name="chevron-down"
                    size={14}
                    className="text-muted-foreground transition-transform"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
            </button>
            <div className={open ? 'min-h-0 overflow-hidden' : 'hidden'}>
                {children}
            </div>
        </div>
    );
}
