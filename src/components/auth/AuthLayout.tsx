import React, { useEffect, useRef } from 'react';
import { cn } from '../../libs/cn';
import Icon from '../ui/Icon';

export type AuthLayoutTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface AuthLayoutProps {
    /** The heading of the screen (one `h1`). */
    title: React.ReactNode;
    /** One or two sentences under the title. */
    description?: React.ReactNode;
    /** An icon above the title, for a state (an email sent, a link expired). */
    icon?: string;
    /** The color of that icon. Default `neutral`. */
    tone?: AuthLayoutTone;
    /** The mark above the card: a `<Brand>`, a logo. */
    brand?: React.ReactNode;
    /** Top right of the page: a `ThemeSwitcher`, a `LocaleSwitcher`. */
    toolbar?: React.ReactNode;
    /** Under the card: another way in ("Don't have an account? Create one"). */
    below?: React.ReactNode;
    /** Bottom of the page: legal links, the copyright. */
    footer?: React.ReactNode;
    /**
     * When it changes, the focus moves to the title, so a screen reader announces the new step
     * (an email sent, a code to type). Default: the title itself, when it is a string.
     */
    focusKey?: string | number;
    children?: React.ReactNode;
    className?: string;
}

const TONES: Record<AuthLayoutTone, string> = {
    neutral: 'bg-muted text-foreground',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/20 text-foreground',
    danger: 'bg-destructive/15 text-destructive',
};

/**
 * The frame of an access screen (CR-127): the brand, a card in the middle of the page with the title,
 * the description and the content, then another way in and the footer. In the colors of the theme,
 * light and dark; on a phone the card becomes the page.
 */
export function AuthLayout({
    title,
    description,
    icon,
    tone = 'neutral',
    brand,
    toolbar,
    below,
    footer,
    focusKey,
    children,
    className,
}: AuthLayoutProps) {
    const heading = useRef<HTMLHeadingElement>(null);
    const key = focusKey ?? (typeof title === 'string' ? title : undefined);
    const first = useRef(true);

    useEffect(() => {
        // Not on the first render: the first field of the screen has the focus then.
        if (first.current) {
            first.current = false;
            return;
        }
        heading.current?.focus();
    }, [key]);

    return (
        <div className={cn('flex min-h-dvh flex-col bg-background text-foreground', className)}>
            {toolbar && <div className="flex justify-end gap-2 px-4 pt-4 sm:px-6">{toolbar}</div>}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-[400px]">
                    {brand && <div className="mb-8 flex justify-center">{brand}</div>}
                    <div className="sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-8 sm:text-card-foreground sm:shadow-sm">
                        <div className="space-y-2 text-center">
                            {icon && (
                                <div className={cn('mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full', TONES[tone])}>
                                    <Icon name={icon} size={22} />
                                </div>
                            )}
                            <h1
                                ref={heading}
                                tabIndex={-1}
                                className="text-2xl font-semibold leading-tight tracking-tight outline-none"
                            >
                                {title}
                            </h1>
                            {description && <div className="text-sm leading-relaxed text-muted-foreground">{description}</div>}
                        </div>
                        {children && <div className="mt-6">{children}</div>}
                    </div>
                    {below && <div className="mt-6">{below}</div>}
                </div>
            </main>
            {footer && (
                <footer className="px-4 pb-6 text-center text-xs text-muted-foreground">{footer}</footer>
            )}
        </div>
    );
}

/** The content of a screen in its `AuthLayout`, or alone when `bare`. */
export function AuthFrame({ bare, ...props }: AuthLayoutProps & { bare?: boolean }) {
    if (!bare) return <AuthLayout {...props} />;
    return (
        <div className={cn('w-full', props.className)}>
            <div className="space-y-2 text-center">
                {props.icon && (
                    <div className={cn('mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full', TONES[props.tone ?? 'neutral'])}>
                        <Icon name={props.icon} size={22} />
                    </div>
                )}
                <h2 className="text-xl font-semibold tracking-tight">{props.title}</h2>
                {props.description && <div className="text-sm text-muted-foreground">{props.description}</div>}
            </div>
            {props.children && <div className="mt-6">{props.children}</div>}
            {props.below && <div className="mt-6">{props.below}</div>}
        </div>
    );
}

export default AuthLayout;
