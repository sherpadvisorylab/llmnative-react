import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownHeader, DropdownItem } from './Dropdown';
import Icon from '../ui/Icon';
import { useTheme } from '../../Theme';
import { useI18n } from '../../I18n';
import { cn } from '../../libs/cn';
import type { UIProps } from '../types';
import { useProviderSession } from '../../providers/ProviderSession';
import type { ProviderSessionResponse } from '../../providers/ProviderSession';
import { useAuthProvider } from '../../providers/auth/AuthProviderContext';

export interface ProviderSwitcherItem {
    id: string;
    label: string;
    /** Rendered on the trailing side of the row, e.g. a role or a status. */
    meta?: React.ReactNode;
    /** Icon name (resolved via the icon provider) or a ready-made node. Falls back to the switcher's own `icon`. */
    icon?: string | React.ReactNode;
}

export interface ProviderSwitcherProps extends UIProps {
    items: ProviderSwitcherItem[];
    activeId?: string | null;
    /** Fires once the switch has actually succeeded — never optimistically on click. */
    onSelect?: (id: string) => void;
    /** Fires when the endpoint call or the provider switch itself throws. */
    onError?: (id: string, error: unknown) => void;
    /** Inspect or transform the raw session response before it's applied — e.g. inject an extra category, filter one out, forward it to an audit log. */
    onResponse?: (response: ProviderSessionResponse) => ProviderSessionResponse | Promise<ProviderSessionResponse>;
    /**
     * URL of the session endpoint (POSTed with `requestBody(id)` on selection), or a
     * resolver called directly with the picked id — e.g. a mock/dev session provider,
     * or a Firebase Callable Function invocation. No fetch happens in the resolver case.
     */
    endpoint: string | ((id: string) => Promise<ProviderSessionResponse>);
    /**
     * Overrides the credential sent with the request. By default, ProviderSwitcher calls
     * getAccessToken() on the app's own registered auth provider — the identity the user
     * already negotiated at login — so most apps never need to set this. A function is
     * called fresh on every switch, which matters because tokens expire/rotate.
     */
    authorization?: string | (() => string | Promise<string>);
    /** Builds the POST body for a string `endpoint`. Defaults to `{ id }`. */
    requestBody?: (id: string) => unknown;
    /** HTTP method for a string `endpoint`. Default: 'POST'. */
    method?: string;
    /** Leading icon shown in the trigger and as the default per-item icon. Name resolved via the icon provider, or a ready-made node. */
    icon?: string | React.ReactNode;
    /** Small caption under the active item's label in the trigger (e.g. "Workspace"). Also used as the list header unless `listLabel` is set. */
    caption?: React.ReactNode;
    /** Header shown above the item list. Defaults to `caption`. */
    listLabel?: React.ReactNode;
    /** Shown in the trigger when `activeId` matches nothing in `items`. Defaults to the framework's generic "Select..." string. */
    placeholder?: React.ReactNode;
    disabled?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Rendered below the item list, inside the dropdown — e.g. a "manage" action. Omit for a plain list. */
    footer?: React.ReactNode;
    triggerClassName?: string;
    listClassName?: string;
    itemClassName?: string;
}

function renderIcon(icon: ProviderSwitcherItem['icon'], className?: string) {
    if (!icon) return null;
    if (typeof icon === 'string') return <Icon name={icon} size={15} className={className} />;
    return icon;
}

/**
 * Generic named-item switcher — no domain vocabulary (tenant, workspace, session, ...).
 * Given `items` and one `endpoint`, it performs the whole switch itself on selection:
 * resolves a credential (the app's own auth provider by default), calls the endpoint
 * for the picked id, and applies the response via useProviderSession().switchSession().
 * The caller only finds out once it's actually done (`onSelect`) or failed (`onError`) —
 * it never has to wire the request/loading/error plumbing itself.
 */
export default function ProviderSwitcher({
    items,
    activeId = null,
    onSelect = undefined,
    onError = undefined,
    onResponse = undefined,
    endpoint,
    authorization = undefined,
    requestBody = undefined,
    method = 'POST',
    icon = 'layers',
    caption = undefined,
    listLabel = undefined,
    placeholder = undefined,
    disabled = false,
    open = undefined,
    onOpenChange = undefined,
    footer = undefined,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
    triggerClassName = undefined,
    listClassName = undefined,
    itemClassName = undefined,
}: ProviderSwitcherProps) {
    const theme = useTheme('providerSwitcher');
    const dict = useI18n('select');
    const { switchSession } = useProviderSession();
    const authProvider = useAuthProvider();
    const [internalOpen, setInternalOpen] = useState(false);
    const [switchingId, setSwitchingId] = useState<string | null>(null);
    const activeItem = items.find((item) => item.id === activeId) ?? null;
    const isOpen = open ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;
    const loading = switchingId !== null;

    // Guards against switching the same id twice: once when the user clicks it, and again
    // from the effect below reacting to `activeId` changing as a result of that same click
    // (onSelect typically feeds straight back into the `activeId` prop).
    const lastSwitchedId = useRef<string | null>(null);

    const resolveAuthorization = async (): Promise<string | undefined> => {
        if (authorization) return typeof authorization === 'function' ? authorization() : authorization;
        return authProvider.getAccessToken?.();
    };

    const performSwitch = async (item: ProviderSwitcherItem) => {
        if (lastSwitchedId.current === item.id) return;
        setSwitchingId(item.id);
        try {
            if (typeof endpoint === 'function') {
                await switchSession(() => endpoint(item.id), { onResponse });
            } else {
                const token = await resolveAuthorization();
                await switchSession(endpoint, {
                    onResponse,
                    fetchOptions: {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify(requestBody ? requestBody(item.id) : { id: item.id }),
                    },
                });
            }
            lastSwitchedId.current = item.id;
            onSelect?.(item.id);
        } catch (error) {
            onError?.(item.id, error);
        } finally {
            setSwitchingId(null);
        }
    };

    const handleSelect = (item: ProviderSwitcherItem) => {
        setOpen(false);
        void performSwitch(item);
    };

    // Switches on mount for a pre-set activeId (e.g. the first tenant auto-selected, or one
    // restored from persisted state) — the click path above only covers user-driven changes.
    useEffect(() => {
        if (!activeId || activeId === lastSwitchedId.current) return;
        const item = items.find((candidate) => candidate.id === activeId);
        if (item) void performSwitch(item);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId]);

    return (
        <>
            {before}
            <Dropdown
                open={isOpen}
                onOpenChange={setOpen}
                placement="auto"
                wrapperClassName={cn(theme.ProviderSwitcher.wrapperClassName, wrapperClassName)}
                className={cn(theme.ProviderSwitcher.className, className)}
                triggerClassName={cn(theme.ProviderSwitcher.triggerClassName, (disabled || loading) && theme.ProviderSwitcher.disabledClassName, triggerClassName)}
                footer={footer}
                trigger={(
                    <span className="flex w-full min-w-0 items-center gap-2.5">
                        <span className={cn(theme.ProviderSwitcher.iconWrapperClassName)}>
                            {renderIcon(activeItem?.icon ?? icon)}
                        </span>
                        <span className="min-w-0 flex-1 pr-2">
                            <span className={cn(theme.ProviderSwitcher.labelClassName)}>
                                {activeItem?.label ?? placeholder ?? dict.placeholder}
                            </span>
                            {caption ? (
                                <span className={cn(theme.ProviderSwitcher.captionClassName)}>
                                    {caption}
                                </span>
                            ) : null}
                        </span>
                        <Icon
                            name={loading ? 'loader-2' : 'chevrons-up-down'}
                            size={12}
                            className={cn(theme.ProviderSwitcher.chevronClassName, loading && 'animate-spin')}
                        />
                    </span>
                )}
            >
                {(listLabel ?? caption) ? (
                    <DropdownHeader>{listLabel ?? caption}</DropdownHeader>
                ) : null}
                {items.map((item) => (
                    <DropdownItem
                        key={item.id}
                        onClick={(disabled || loading) ? undefined : () => handleSelect(item)}
                        className={cn(
                            theme.ProviderSwitcher.itemClassName,
                            item.id === activeId ? theme.ProviderSwitcher.itemActiveClassName : theme.ProviderSwitcher.itemInactiveClassName,
                            itemClassName,
                            listClassName,
                        )}
                    >
                        <span className="flex w-full min-w-0 items-center gap-2">
                            <span className={cn('w-3.5 shrink-0', theme.ProviderSwitcher.checkClassName)}>
                                {item.id === activeId ? <Icon name="check" size={13} /> : null}
                            </span>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.meta ? (
                                <span className={cn('shrink-0', theme.ProviderSwitcher.itemMetaClassName)}>
                                    {item.meta}
                                </span>
                            ) : null}
                        </span>
                    </DropdownItem>
                ))}
            </Dropdown>
            {after}
        </>
    );
}
