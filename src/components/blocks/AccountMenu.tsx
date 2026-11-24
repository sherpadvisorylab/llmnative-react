import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../libs/cn';
import { useI18n } from '../../I18n';
import { PLACEHOLDER_USER } from '../../Theme';
import { useAuthSession } from '../auth/useAuthFlows';
import Icon from '../ui/Icon';
import ImageAvatar from '../ui/ImageAvatar';

/** An entry of the menu of the account. */
export interface AccountMenuItem {
    readonly id: string;
    readonly label: ReactNode;
    readonly icon?: string;
    readonly onClick?: () => void;
    /** A link, instead of `onClick`. */
    readonly href?: string;
}

export interface AccountMenuProps {
    /** The auth provider of the session (by default the one of the app). */
    provider?: string;
    /** The name shown; by default the one of the user, or the email. */
    name?: ReactNode;
    /** The line under the name (a role, the email); by default the email. */
    description?: ReactNode;
    /** The picture; by default the one of the user. */
    photoURL?: string;
    /** The entries before Esci (profile, settings…). */
    items?: readonly AccountMenuItem[];
    /** Content of the menu after the entries (e.g. a switch of light and dark). */
    children?: ReactNode;
    /** Esci at the end of the menu. Default true. */
    signOut?: boolean;
    /** Only the avatar (a collapsed sidebar). */
    compact?: boolean;
    className?: string;
}

/**
 * CR-151 — the account in the footer of a sidebar: the avatar, the name and a line; a click opens the menu above it
 * (the entries of the app, then Esci). Compact, only the avatar.
 */
export function AccountMenu({ provider, name, description, photoURL, items = [], children, signOut = true, compact = false, className }: AccountMenuProps) {
    const session = useAuthSession(provider);
    const dict = useI18n('auth');
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement | null>(null);
    const user = session.user;

    useEffect(() => {
        if (!open) return undefined;
        const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
        const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
        document.addEventListener('pointerdown', outside);
        document.addEventListener('keydown', escape);
        return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
    }, [open]);

    if (!user) return null;
    const shownName = name ?? user.displayName ?? user.email ?? '';
    const line = description ?? (user.displayName ? user.email : undefined);
    const label = typeof shownName === 'string' ? shownName : String(user.displayName ?? user.email ?? '');
    const item = 'flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground';

    return (
        <div ref={root} className={cn('relative', className)}>
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={label}
                title={compact ? label : undefined}
                onClick={() => setOpen((value) => !value)}
                className={cn('flex w-full min-w-0 items-center gap-2 rounded-md p-1 text-start outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring', compact && 'justify-center')}
            >
                <ImageAvatar src={photoURL ?? user.photoURL ?? PLACEHOLDER_USER} title={label} height={32} className="size-8 shrink-0 rounded-full object-cover" />
                {!compact ? (
                    <>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground">{shownName}</span>
                            {line ? <span className="block truncate text-xs text-muted-foreground">{line}</span> : null}
                        </span>
                        <Icon name="chevrons-up-down" size={14} className="shrink-0 text-muted-foreground" />
                    </>
                ) : null}
            </button>
            {open ? (
                <div role="menu" className="absolute bottom-full start-0 z-50 mb-2 min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    {items.map((entry) => (entry.href ? (
                        <a key={entry.id} role="menuitem" href={entry.href} className={item} onClick={() => setOpen(false)}>
                            {entry.icon ? <Icon name={entry.icon} size={16} /> : null}
                            {entry.label}
                        </a>
                    ) : (
                        <button key={entry.id} type="button" role="menuitem" className={item} onClick={() => { setOpen(false); entry.onClick?.(); }}>
                            {entry.icon ? <Icon name={entry.icon} size={16} /> : null}
                            {entry.label}
                        </button>
                    )))}
                    {children ? <div className="px-2 py-1.5">{children}</div> : null}
                    {signOut ? (
                        <>
                            {items.length || children ? <div className="my-1 h-px bg-border" role="separator" /> : null}
                            <button type="button" role="menuitem" className={item} onClick={() => { setOpen(false); void session.signOut(); }}>
                                <Icon name="log-out" size={16} />
                                {dict.signOut}
                            </button>
                        </>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export default AccountMenu;
