/**
 * SideNav — modern collapsible sidebar with icon support.
 *
 * Features:
 * - Collapse to icon-only mode (toggle button at bottom)
 * - Hover to temporarily expand when collapsed (overlay, doesn't push content)
 * - Sub-menu sections with animated open/close
 * - Auto-opens the parent group that contains the active route
 * - Group headings collapse to separator lines in icon-only mode
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@llmnative/react';

// ── Constants ──────────────────────────────────────────────────────────────────

const W_EXPANDED = 208;
const W_COLLAPSED = 52;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SideNavItemDef {
    path: string;
    title?: string;
    icon?: string;
    group?: string;
    children?: SideNavItemDef[];
}

interface GroupDef {
    key: string;
    items: SideNavItemDef[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildGroups(items: SideNavItemDef[]): GroupDef[] {
    const map = new Map<string, SideNavItemDef[]>();
    for (const item of items) {
        const g = item.group ?? 'General';
        if (!map.has(g)) map.set(g, []);
        map.get(g)!.push(item);
    }
    return [...map.entries()].map(([key, items]) => ({ key, items }));
}

// ── Sub-items list ─────────────────────────────────────────────────────────────

function SubItems({ children, open }: { children: SideNavItemDef[]; open: boolean }) {
    return (
        <div
            style={{
                maxHeight: open ? `${children.length * 34 + 8}px` : '0px',
                overflow: 'hidden',
                transition: 'max-height 200ms ease',
            }}
        >
            <div className="py-0.5 space-y-0.5">
                {children.map(child => (
                    <NavLink
                        key={child.path}
                        to={child.path}
                        end
                        className={({ isActive }) =>
                            `flex items-center rounded-md pl-9 pr-3 py-[6px] text-sm transition-colors ${
                                isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`
                        }
                    >
                        {child.title}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

// ── Single nav item ────────────────────────────────────────────────────────────

interface NavItemProps {
    item: SideNavItemDef;
    expanded: boolean;
    open: boolean;
    onToggle: (path: string) => void;
}

function NavItem({ item, expanded, open, onToggle }: NavItemProps) {
    const { pathname } = useLocation();
    const hasChildren = (item.children?.length ?? 0) > 0;
    const isChildActive = hasChildren && item.children!.some(c => pathname.startsWith(c.path));

    const baseItemClass = 'flex items-center w-full rounded-md px-2 py-[7px] text-sm transition-colors';
    const iconSlot = (
        <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">
            {item.icon
                ? <Icon name={item.icon} size={17} />
                : <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
            }
        </span>
    );

    if (hasChildren) {
        return (
            <div>
                {/* Row: NavLink (icon + label) navigates to parent; chevron button toggles sub-menu */}
                <div className="flex items-center gap-0.5">
                    <NavLink
                        to={item.path}
                        end
                        title={!expanded ? item.title : undefined}
                        className={({ isActive: active }) =>
                            `flex-1 flex items-center gap-2.5 rounded-md px-2 py-[7px] text-sm transition-colors ${
                                active || isChildActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`
                        }
                    >
                        {iconSlot}
                        <span
                            style={{
                                opacity: expanded ? 1 : 0,
                                maxWidth: expanded ? '200px' : '0px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                transition: 'opacity 150ms ease, max-width 200ms ease',
                            }}
                        >
                            {item.title}
                        </span>
                    </NavLink>
                    {/* Chevron toggle — only visible when expanded */}
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
        <NavLink
            to={item.path}
            end
            title={!expanded ? item.title : undefined}
            className={({ isActive }) =>
                `${baseItemClass} gap-2.5 ${
                    isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`
            }
        >
            {iconSlot}
            <span
                style={{
                    opacity: expanded ? 1 : 0,
                    maxWidth: expanded ? '200px' : '0px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 150ms ease, max-width 200ms ease',
                }}
            >
                {item.title}
            </span>
        </NavLink>
    );
}

// ── Group ──────────────────────────────────────────────────────────────────────

function NavGroup({
    group,
    expanded,
    openItems,
    onToggle,
}: {
    group: GroupDef;
    expanded: boolean;
    openItems: Set<string>;
    onToggle: (path: string) => void;
}) {
    return (
        <div className="mb-1">
            {/* Group header */}
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
            {/* Items */}
            <div className="space-y-0.5">
                {group.items.map(item => (
                    <NavItem
                        key={item.path}
                        item={item}
                        expanded={expanded}
                        open={openItems.has(item.path)}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

export interface SideNavProps {
    items: SideNavItemDef[];
    defaultCollapsed?: boolean;
}

export default function SideNav({ items, defaultCollapsed = false }: SideNavProps) {
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [hovered, setHovered] = useState(false);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isExpanded = !collapsed || hovered;

    // Auto-open the parent group that contains the active child route
    useEffect(() => {
        setOpenItems(prev => {
            const next = new Set(prev);
            items.forEach(item => {
                if (item.children?.some(c => pathname.startsWith(c.path))) {
                    next.add(item.path);
                }
            });
            return next;
        });
    }, [pathname, items]);

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

    const groups = buildGroups(items);

    return (
        // Outer element reserves layout space (collapsed width) without changing.
        // Inner panel overlays the content when hover-expanded in collapsed mode.
        <div
            style={{
                width: collapsed ? W_COLLAPSED : W_EXPANDED,
                transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
                flexShrink: 0,
                position: 'relative',
            }}
        >
            <aside
                style={{
                    width: isExpanded ? W_EXPANDED : W_COLLAPSED,
                    transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
                    // When hover-expanding over collapsed: float above content
                    position: collapsed ? 'absolute' : 'sticky',
                    top: '3.5rem',  // below topbar (h-14 = 56px = 3.5rem)
                    zIndex: collapsed && hovered ? 50 : 10,
                    boxShadow: collapsed && hovered ? '4px 0 24px rgba(0,0,0,0.10)' : 'none',
                    height: 'calc(100vh - 3.5rem)',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}
                className="flex flex-col border-r bg-background"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Scrollable nav body */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-2">
                    {groups.map(group => (
                        <NavGroup
                            key={group.key}
                            group={group}
                            expanded={isExpanded}
                            openItems={openItems}
                            onToggle={toggleItem}
                        />
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div className="shrink-0 border-t px-1.5 py-2">
                    <button
                        onClick={() => { setCollapsed(c => !c); setHovered(false); }}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`flex items-center gap-2.5 w-full rounded-md px-2 py-[7px] text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent ${
                            !isExpanded ? 'justify-center' : ''
                        }`}
                    >
                        <span className="shrink-0 flex items-center justify-center w-[18px] h-[18px]">
                            <Icon name={collapsed ? 'chevrons-right' : 'chevrons-left'} size={16} />
                        </span>
                        <span
                            style={{
                                opacity: isExpanded ? 1 : 0,
                                maxWidth: isExpanded ? '200px' : '0px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                transition: 'opacity 150ms ease, max-width 200ms ease',
                            }}
                        >
                            Collapse
                        </span>
                    </button>
                </div>
            </aside>
        </div>
    );
}
