import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownDivider } from "./Dropdown";
import { useI18n } from "../../I18n";
import { useEnterMotion } from "../../motion";
import Icon from "../ui/Icon";
import type { BadgeProps } from "../ui/Badge";
import type { MotionReference } from "../../motion";
import { cn } from "../../libs/cn";

/** A button on a notification: it acts without opening the notification. */
export interface NotificationAction {
    label: string;
    icon?: string;
    /** May return a promise: the button shows it is working until it settles. */
    onClick: () => void | Promise<unknown>;
    /** `primary` stands out; the default is quiet. */
    variant?: "primary" | "default";
    /** Closes the menu once the action is done; by default it stays open. */
    closeOnClick?: boolean;
}

export interface NotificationItem {
    /** Stable key of the notification (the index otherwise). */
    id?: string;
    title: string;
    /** A line under the title: what and where. */
    description?: React.ReactNode;
    /** Where the notification leads: a route of the app, or an address when `external`. Without it, it only shows. */
    url?: string;
    /** Opens `url` as an address in a new tab instead of a route of the app. */
    external?: boolean;
    time: string;
    icon: string;
    read?: boolean;
    /** Buttons under the notification, to act on it from the menu. */
    actions?: NotificationAction[];
}

interface NotificationsProps {
    items?: NotificationItem[];
    badge?: BadgeProps;
    /** URL to a full notifications page — shown in the footer only when there are items */
    seeAllUrl?: string;
    /** Callback for "mark all as read" — shown in the header only when there are items */
    onMarkAllRead?: () => void;
    /** Called when a notification is opened (e.g. to mark it read); the menu closes. */
    onItemClick?: (item: NotificationItem, index: number) => void;
    /** Named motion preset for notification items appearance. */
    motion?: MotionReference;
    className?: string;
}

/** An action of a notification: working while its promise runs, never opening the notification. */
function ActionOf({ action, onDone }: { action: NotificationAction; onDone: () => void }) {
    const [busy, setBusy] = React.useState(false);
    const mounted = React.useRef(true);
    React.useEffect(() => () => { mounted.current = false; }, []);
    return (
        <button
            type="button"
            disabled={busy}
            onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                setBusy(true);
                try {
                    await action.onClick();
                } finally {
                    if (mounted.current) setBusy(false);
                }
                if (action.closeOnClick) onDone();
            }}
            className={cn(
                "inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
                action.variant === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-accent",
            )}
        >
            {(busy || action.icon) && <Icon name={busy ? "loader-circle" : action.icon!} size={12} className={busy ? "animate-spin" : undefined} />}
            {action.label}
        </button>
    );
}

function Notifications({
    items = [],
    badge,
    seeAllUrl,
    onMarkAllRead,
    onItemClick,
    motion,
    className,
}: NotificationsProps) {
    const dict = useI18n('notifications');
    const hasItems = items.length > 0;
    const [open, setOpen] = React.useState(false);

    const itemStyle = useEnterMotion(undefined, motion ?? 'fadeDown', motion ?? 'fadeDown');

    return (
        <Dropdown
            trigger={<Icon name="bell" size={18} />}
            triggerClassName="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            badge={badge}
            position="end"
            placement="auto"
            menuClassName="w-80"
            motion={motion}
            className={className}
            open={open}
            onOpenChange={setOpen}
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
                        {dict.markAllRead}
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
                        {dict.empty}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {dict.emptyHint}
                    </p>
                </div>
            )}

            {/* ── Items ───────────────────────────────────────────── */}
            {items.map((item, i) => {
                const opened = () => {
                    onItemClick?.(item, i);
                    setOpen(false);
                };
                const body = (
                    <>
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
                            {item.description && <p className="text-xs text-muted-foreground mt-0.5 break-words">{item.description}</p>}
                            <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                        {!item.read && (
                            <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                    </>
                );
                const rowClass = "flex items-start gap-3 px-3 py-2.5 rounded-sm transition-colors";
                // The notification opens where it leads; its actions sit under it (a button inside a link is not valid HTML).
                const main = !item.url
                    ? <div className={rowClass}>{body}</div>
                    : item.external
                        ? <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={opened} className={cn(rowClass, "hover:bg-accent")}>{body}</a>
                        : <Link to={item.url} onClick={opened} className={cn(rowClass, "hover:bg-accent")}>{body}</Link>;
                return (
                    <div key={item.id ?? i} style={{ ...itemStyle, transitionDelay: `${i * 30}ms` }}>
                        {main}
                        {item.actions?.length ? (
                            <div className="flex flex-wrap gap-1.5 ps-14 pe-3 pb-2.5 -mt-1">
                                {item.actions.map((action) => <ActionOf key={action.label} action={action} onDone={() => setOpen(false)} />)}
                            </div>
                        ) : null}
                    </div>
                );
            })}

            {/* ── Footer — only when there are items ──────────────── */}
            {hasItems && seeAllUrl && (
                <>
                    <DropdownDivider />
                    <div className="px-1 py-1">
                        <Link
                            to={seeAllUrl}
                            onClick={() => setOpen(false)}
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
