/**
 * SideNav — collapsible sidebar block.
 *
 * Accepts either `menuKey` (reads from App menuConfig via useMenu) or explicit `items`.
 * Features: collapse to icon-only, hover-expand overlay, groups, active state, animated sub-menu, badges.
 *
 * Active state is computed manually via useLocation (not NavLink.isActive) to avoid
 * React Router quirks with the "/" root path and the `end` flag.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMenu, type UseMenuItem } from '../../App';
import Icon from '../ui/Icon';

// ── Constants ──────────────────────────────────────────────────────────────

const W_EXPANDED = 208;
const W_COLLAPSED = 52;

// ── Types ──────────────────────────────────────────────────────────────────

export interface SideNavItemDef {
    path: string;
    title?: string;
    icon?: string;
    group?: string;
    /** Match exact path only (needed for "/" to avoid matching everything). Default: false. */
    end?: boolean;
    /** Badge label shown next to the item title. Collapsed: dot indicator. */
    badge?: string | number;
    children?: SideNavItemDef[];
}

export interface SideNavProps {
    /** Menu key registered in App menuConfig — calls useMenu() internally */
    menuKey?: string;
    /** Explicit items — alternative to menuKey */
    items?: SideNavItemDef[];
    defaultCollapsed?: boolean;
    /** Show icon slot. Default true. */
    showIcons?: boolean;
    /** Label for the collapse toggle button */
    collapseLabel?: string;
    /**
     * Embedded mode — renders only the nav items without the sidebar shell
     * (no sticky wrapper, no collapse button). Use inside drawers or panels.
     */
    embedded?: boolean;
}

interface GroupDef {
    key: string;
    items: SideNavItemDef[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function mapMenuItems(items: UseMenuItem[]): SideNavItemDef[] {
    return items.map(item => ({
        path: item.path,
        title: item.title,
        icon: item.icon,
        group: item.group as string | undefined,
        end: (item as any).end as boolean | undefined,
        badge: (item as any).badge as string | number | undefined,
        children: item.children ? mapMenuItems(item.children as UseMenuItem[]) : undefined,
    }));
}

/** Returns true when `pathname` matches this item's path. */
function isPathActive(pathname: string, path: string, end?: boolean): boolean {
    if (end) return pathname === path;
    // prefix match, but "/" without end would match everything — guard it
    return pathname === path || (path !== '/' && pathname.startsWith(path + '/'));
}

function buildGroups(items: SideNavItemDef[]): GroupDef[] {
    const map = new Map<string, SideNavItemDef[]>();
    for (const item of items) {
        const g = item.group ?? 'General';
        if (!map.has(g)) map.set(g, []);
        map.get(g)!.push(item);
    }
    return [...map.entries()].map(([key, its]) => ({ key, items: its }));
}

// ── Badge pill ─────────────────────────────────────────────────────────────

function BadgePill({ value }: { value: string | number }) {
    return (
        <span className="ml-auto shrink-0 text-[10px] font-semibold leading-none px-1.5 py-[3px] rounded-full bg-primary/15 text-primary">
            {value}
        </span>
    );
}

// ── Sub-items list ─────────────────────────────────────────────────────────

function SubItems({ children, open }: { children: SideNavItemDef[]; open: boolean }) {
    const { pathname } = useLocation();
    return (
        <div
            style={{
                maxHeight: open ? `${children.length * 34 + 8}px` : '0px',
                overflow: 'hidden',
                transition: 'max-height 200ms ease',
            }}
        >
            <div className="py-0.5 space-y-0.5">
                {children.map(child => {
                    const active = isPathActive(pathname, child.path, child.end);
                    return (
                        <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center rounded-md pl-9 pr-3 py-[6px] text-sm transition-colors ${
                                active
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                        >
                            <span className="flex-1 truncate">{child.title}</span>
                            {child.badge !== undefined && <BadgePill value={child.badge} />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

// ── Single nav item ────────────────────────────────────────────────────────

interface NavItemProps {
    item: SideNavItemDef;
    expanded: boolean;
    open: boolean;
    showIcons: boolean;
    onToggle: (path: string) => void;
}

function NavItem({ item, expanded, open, showIcons, onToggle }: NavItemProps) {
    const { pathname } = useLocation();
    const hasChildren = (item.children?.length ?? 0) > 0;

    const isActive    = isPathActive(pathname, item.path, item.end);
    const childActive = hasChildren && item.children!.some(c => isPathActive(pathname, c.path, c.end));

    const activeClass = isActive
        ? 'bg-primary/10 text-primary font-medium'
        : childActive
            ? 'bg-accent text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent';

    const iconSlot = showIcons ? (
        <span className="relative shrink-0 flex items-center justify-center w-[18px] h-[18px]">
            {item.icon
                ? <Icon name={item.icon} size={17} />
                : <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
            }
            {/* Collapsed badge: dot indicator */}
            {!expanded && item.badge !== undefined && (
                <span className="absolute -top-0.5 -right-1 w-[7px] h-[7px] rounded-full bg-primary ring-1 ring-background" />
            )}
        </span>
    ) : null;

    const labelStyle = {
        opacity: expanded ? 1 : 0,
        maxWidth: expanded ? '200px' : '0px',
        overflow: 'hidden' as const,
        whiteSpace: 'nowrap' as const,
        transition: 'opacity 150ms ease, max-width 200ms ease',
    };

    const baseClass = 'flex items-center w-full rounded-md px-2 py-[7px] text-sm transition-colors gap-2.5';

    if (hasChildren) {
        return (
            <div>
                <div className="flex items-center gap-0.5">
                    <Link
                        to={item.path}
                        title={!expanded ? item.title : undefined}
                        className={`flex-1 flex items-center gap-2.5 rounded-md px-2 py-[7px] text-sm transition-colors ${activeClass}`}
                    >
                        {iconSlot}
                        <span style={labelStyle}>{item.title}</span>
                        {expanded && item.badge !== undefined && <BadgePill value={item.badge} />}
                    </Link>
                    {expanded && (
                        <button
                            onClick={() => onToggle(item.path)}
                            className="shrink-0 flex items-center justify-center w-6 h-6 rounded transition-colors text-muted-foreground/50 hover:text-foreground hover:bg-accent"
                            title={open ? 'Collapse' : 'Expand'}
                        >
                            <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>
                                <Icon name="chevron-down" size={13} />
                            </span>
                        </button>
                    )}
                </div>
                {expanded && <SubItems children={item.children!} open={open} />}
            </div>
        );
    }

    return (
        <Link
            to={item.path}
            title={!expanded ? item.title : undefined}
            className={`${baseClass} ${activeClass}`}
        >
            {iconSlot}
            <span style={labelStyle}>{item.title}</span>
            {expanded && item.badge !== undefined && <BadgePill value={item.badge} />}
        </Link>
    );
}

// ── Group ──────────────────────────────────────────────────────────────────

function NavGroup({
    group, expanded, openItems, showIcons, onToggle,
}: {
    group: GroupDef;
    expanded: boolean;
    openItems: Set<string>;
    showIcons: boolean;
    onToggle: (path: string) => void;
}) {
    const singleGroup = group.key === 'General';
    return (
        <div className="mb-1">
            {!singleGroup && (
                <div
                    style={{ height: expanded ? undefined : '1px' }}
                    className={expanded
                        ? 'px-2 pb-0.5 pt-3 first:pt-1'
                        : 'mx-2 my-2 bg-border/40'
                    }
                >
                    {expanded && (
                        <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
                            {group.key}
                        </span>
                    )}
                </div>
            )}
            <div className="space-y-0.5">
                {group.items.map(item => (
                    <NavItem
                        key={item.path}
                        item={item}
                        expanded={expanded}
                        open={openItems.has(item.path)}
                        showIcons={showIcons}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SideNav({
    menuKey,
    items: itemsProp,
    defaultCollapsed = false,
    showIcons = true,
    collapseLabel = 'Collapse',
    embedded = false,
}: SideNavProps) {
    const { pathname } = useLocation();
    const menuItems = useMenu(menuKey ?? '');
    const resolvedItems: SideNavItemDef[] = itemsProp ?? (menuKey ? mapMenuItems(menuItems) : []);

    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [hovered, setHovered] = useState(false);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isExpanded = !collapsed || hovered;

    // Auto-open parent groups when navigating to a child route
    useEffect(() => {
        setOpenItems(prev => {
            const next = new Set(prev);
            resolvedItems.forEach(item => {
                if (item.children?.some(c => isPathActive(pathname, c.path, c.end))) {
                    next.add(item.path);
                }
            });
            return next;
        });
    }, [pathname]);

    const toggleItem = useCallback((path: string) => {
        setOpenItems(prev => {
            const next = new Set(prev);
            next.has(path) ? next.delete(path) : next.add(path);
            return next;
        });
    }, []);

    const handleMouseEnter = () => {
        if (!collapsed) return;
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        setHovered(true);
    };
    const handleMouseLeave = () => {
        if (!collapsed) return;
        leaveTimer.current = setTimeout(() => setHovered(false), 80);
    };

    if (resolvedItems.length === 0) return null;

    const groups = buildGroups(resolvedItems);

    // Embedded mode: plain nav list, no wrapper shell, always fully expanded
    if (embedded) {
        return (
            <nav className="px-1.5 py-2">
                {groups.map(group => (
                    <NavGroup
                        key={group.key}
                        group={group}
                        expanded={true}
                        openItems={openItems}
                        showIcons={showIcons}
                        onToggle={toggleItem}
                    />
                ))}
            </nav>
        );
    }

    return (
        <div style={{ width: collapsed ? W_COLLAPSED : W_EXPANDED, height: '100%', transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)', flexShrink: 0, position: 'relative' }}>
            <aside
                style={{
                    width: isExpanded ? W_EXPANDED : W_COLLAPSED,
                    transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
                    position: collapsed ? 'absolute' : 'sticky',
                    top: 0,
                    zIndex: collapsed && hovered ? 50 : 10,
                    boxShadow: collapsed && hovered ? '4px 0 24px rgba(0,0,0,0.10)' : 'none',
                    height: '100%',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}
                className="flex flex-col border-r bg-background"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-2">
                    {groups.map(group => (
                        <NavGroup
                            key={group.key}
                            group={group}
                            expanded={isExpanded}
                            openItems={openItems}
                            showIcons={showIcons}
                            onToggle={toggleItem}
                        />
                    ))}
                </nav>
                <div className="shrink-0 border-t px-1.5 py-2">
                    <button
                        onClick={() => { setCollapsed(c => !c); setHovered(false); }}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`flex items-center gap-2.5 w-full rounded-md px-2 py-[7px] text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent ${!isExpanded ? 'justify-center' : ''}`}
                    >
                        <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">
                            <Icon name={collapsed ? 'chevrons-right' : 'chevrons-left'} size={16} />
                        </span>
                        <span style={{ opacity: isExpanded ? 1 : 0, maxWidth: isExpanded ? '200px' : '0px', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 150ms ease, max-width 200ms ease' }}>
                            {collapseLabel}
                        </span>
                    </button>
                </div>
            </aside>
        </div>
    );
}
