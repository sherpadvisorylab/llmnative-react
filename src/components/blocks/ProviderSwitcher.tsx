import React from 'react';
import { Dropdown, DropdownHeader, DropdownItem } from './Dropdown';
import Icon from '../ui/Icon';
import { useTheme } from '../../Theme';
import { useI18n } from '../../I18n';
import { cn } from '../../libs/cn';
import type { UIProps } from '../types';

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
    onSelect?: (id: string) => void;
    /** Leading icon shown in the trigger and as the default per-item icon. Name resolved via the icon provider, or a ready-made node. */
    icon?: string | React.ReactNode;
    /** Small caption under the active item's label in the trigger (e.g. "Workspace"). Also used as the list header unless `listLabel` is set. */
    caption?: React.ReactNode;
    /** Header shown above the item list. Defaults to `caption`. */
    listLabel?: React.ReactNode;
    /** Shown in the trigger when `activeId` matches nothing in `items`. Defaults to the framework's generic "Select..." string. */
    placeholder?: React.ReactNode;
    /** Disables the trigger and shows a spinner instead of the chevron — e.g. while a switch is in flight. */
    loading?: boolean;
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
 * Generic named-item switcher — no domain vocabulary. Built to drive
 * useProviderSession().switchSession() from a list of app-defined sessions
 * (tenants, workspaces, environments, ...), but knows nothing about any of
 * that itself: it just renders `items`, reports which `id` was picked, and
 * gets out of the way. The caller owns what a "session" means and what
 * happens on selection.
 */
export default function ProviderSwitcher({
    items,
    activeId = null,
    onSelect = undefined,
    icon = 'layers',
    caption = undefined,
    listLabel = undefined,
    placeholder = undefined,
    loading = false,
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
    const activeItem = items.find((item) => item.id === activeId) ?? null;

    return (
        <>
            {before}
            <Dropdown
                open={open}
                onOpenChange={onOpenChange}
                placement="auto"
                wrapperClassName={cn(theme.ProviderSwitcher.wrapperClassName, wrapperClassName)}
                className={cn(theme.ProviderSwitcher.className, className)}
                triggerClassName={cn(theme.ProviderSwitcher.triggerClassName, disabled && theme.ProviderSwitcher.disabledClassName, triggerClassName)}
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
                        onClick={disabled ? undefined : () => onSelect?.(item.id)}
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
