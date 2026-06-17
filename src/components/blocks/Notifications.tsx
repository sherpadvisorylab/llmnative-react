import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownDivider } from "./Dropdown";
import { useI18n } from "../../I18n";
import Icon from "../ui/Icon";
import type { BadgeProps } from "../ui/Badge";

interface NotificationItem {
    title: string;
    url: string;
    time: string;
    icon: string;
    read?: boolean;
}

interface NotificationsProps {
    items?: NotificationItem[];
    badge?: BadgeProps;
    /** URL to a full notifications page — shown in the footer only when there are items */
    seeAllUrl?: string;
    /** Callback for "mark all as read" — shown in the header only when there are items */
    onMarkAllRead?: () => void;
    className?: string;
}

function Notifications({
    items = [],
    badge,
    seeAllUrl,
    onMarkAllRead,
    className,
}: NotificationsProps) {
    const dict = useI18n('notifications');
    const hasItems = items.length > 0;

    return (
        <Dropdown
            trigger={<Icon name="bell" size={18} />}
            triggerClassName="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            badge={badge}
            position="end"
            placement="auto"
            menuClassName="w-80"
            className={className}
        >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold text-foreground">
                    {dict.title || 'Notifications'}
                </span>
                {hasItems && onMarkAllRead && (
                    <button
                        onClick={onMarkAllRead}
                        className="text-xs text-primary hover:underline transition-colors"
                    >
                        Mark all read
                    </button>
                )}
            </div>
            <DropdownDivider />

            {/* ── Empty state ─────────────────────────────────────── */}
            {!hasItems && (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Icon name="bell-off" size={18} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                        No notifications
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {"You're all caught up"}
                    </p>
                </div>
            )}

            {/* ── Items ───────────────────────────────────────────── */}
            {items.map((item, i) => (
                <Link
                    key={i}
                    to={item.url}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-sm hover:bg-accent transition-colors"
                >
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.read ? 'bg-muted' : 'bg-primary/10'
                    }`}>
                        <Icon
                            name={item.icon}
                            size={15}
                            className={item.read ? 'text-muted-foreground' : 'text-primary'}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${
                            item.read
                                ? 'text-muted-foreground'
                                : 'text-foreground font-medium'
                        }`}>
                            {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                    {!item.read && (
                        <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                </Link>
            ))}

            {/* ── Footer — only when there are items ──────────────── */}
            {hasItems && seeAllUrl && (
                <>
                    <DropdownDivider />
                    <div className="px-1 py-1">
                        <Link
                            to={seeAllUrl}
                            className="flex items-center justify-center w-full rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            {dict.seeAll || 'See all notifications'}
                            <Icon name="arrow-right" size={13} className="ml-1.5 opacity-60" />
                        </Link>
                    </div>
                </>
            )}
        </Dropdown>
    );
}

export default Notifications;
