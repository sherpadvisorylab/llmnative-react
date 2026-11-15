import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../../I18n';
import { cn } from '../../libs/cn';
import { useTheme } from '../../Theme';
import Icon from '../ui/Icon';

// CR-131 — the sections of a long page (settings, a record's tabs in one column): a menu that stays at its
// side, says which section is on screen and goes to each one, the way the settings of Stripe, Linear,
// Vercel or GitHub work.

/** One entry of the menu: the `id` of its `PageSection`. */
export interface SectionNavItem {
    id: string;
    label: React.ReactNode;
    icon?: string;
    /** A state beside the label (a `Badge`, a count). */
    badge?: React.ReactNode;
    /** Entries with the same group are listed under it, in the order they come. */
    group?: string;
}

export interface UseActiveSectionOptions {
    /**
     * Height in px of what stays fixed over the scrolling area (a fixed header when the window scrolls). The
     * sections are measured in their own scrolling ancestor, so a layout whose `main` scrolls needs no offset.
     * Default 0.
     */
    offset?: number;
    /** The menu: on small screens its row sticks over the content, and the line moves below it. */
    menu?: React.RefObject<HTMLElement | null>;
}

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Below the `lg` breakpoint the menu is a row over the content. */
const isSmallScreen = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1023.98px)').matches;

const hashId = () => (typeof window === 'undefined' ? '' : decodeURIComponent(window.location.hash.slice(1)));

/** The nearest ancestor that scrolls (a layout's `main` with `overflow: auto`), or `null` for the window. */
function scrollParent(element: Element | null): Element | null {
    for (let node = element?.parentElement; node && node !== document.body; node = node.parentElement) {
        if (/(auto|scroll|overlay)/.test(getComputedStyle(node).overflowY)) return node;
    }
    return null;
}

/**
 * The section on screen, as the reader sees it: the last of `ids` whose top has passed a line just below
 * what is fixed over the content (`offset`, and the row of the `menu` on small screens), in their scrolling
 * area (the window or the nearest ancestor that scrolls). At the end of the page, where the last sections
 * cannot reach the line, the section chosen with `select` stays current. Before any scroll: the section of
 * the hash, else the first.
 */
export function useActiveSection(ids: readonly string[], { offset = 0, menu }: UseActiveSectionOptions = {}): [string | undefined, (id: string) => void] {
    const key = ids.join('|');
    const [active, setActive] = useState<string | undefined>(() => (ids.includes(hashId()) ? hashId() : ids[0]));
    // The section a click went to, until the reader scrolls on their own.
    const chosen = useRef<string | undefined>(undefined);

    useEffect(() => {
        const first = document.getElementById(ids[0] ?? '');
        if (!first) return undefined;
        const root = scrollParent(first);
        const target: HTMLElement | Window = (root as HTMLElement | null) ?? window;
        let frame = 0;
        let scheduled = false;
        const update = () => {
            const row = menu?.current && isSmallScreen() ? menu.current.getBoundingClientRect().height : 0;
            const line = (root ? root.getBoundingClientRect().top : 0) + offset + row + 32;
            let current = ids[0];
            for (const id of ids) {
                const element = document.getElementById(id);
                if (element && element.getBoundingClientRect().top <= line) current = id;
            }
            const scroller = root ?? document.scrollingElement;
            const atEnd = !!scroller && scroller.scrollHeight > scroller.clientHeight && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
            setActive(atEnd && chosen.current ? chosen.current : current);
        };
        // One measure a frame, however many scroll events.
        const onScroll = () => {
            if (scheduled) return;
            scheduled = true;
            frame = window.requestAnimationFrame(() => {
                scheduled = false;
                update();
            });
        };
        const release = () => { chosen.current = undefined; };
        target.addEventListener('scroll', onScroll, { passive: true });
        target.addEventListener('wheel', release, { passive: true });
        target.addEventListener('touchstart', release, { passive: true });
        window.addEventListener('keydown', release);
        return () => {
            if (scheduled) window.cancelAnimationFrame(frame);
            target.removeEventListener('scroll', onScroll);
            target.removeEventListener('wheel', release);
            target.removeEventListener('touchstart', release);
            window.removeEventListener('keydown', release);
        };
        // `key` stands for the ids: the listeners change when they do.
    }, [key, offset]);

    const select = useCallback((id: string) => {
        chosen.current = id;
        setActive(id);
    }, []);

    return [active, select];
}

/** Brings section `id` into view, puts it in the address (no router navigation) and moves the focus there. */
export function goToSection(id: string): void {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView?.({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (window.location.hash !== `#${id}`) window.history.replaceState(window.history.state, '', `#${encodeURIComponent(id)}`);
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
}

export interface SectionNavProps {
    sections: readonly SectionNavItem[];
    /** Height in px of what is fixed over the scrolling area: the menu sticks below it. Default 0. */
    offset?: number;
    /** The name of the menu for assistive technologies (default `common.pageSections`). */
    label?: string;
    className?: string;
    itemClassName?: string;
    activeClassName?: string;
    groupClassName?: string;
}

/**
 * The menu of the sections of a page. On large screens a sticky column, grouped by `group`; on small ones a
 * sticky row that scrolls sideways. The section on screen is highlighted (`aria-current="location"`); a click
 * scrolls to its section (instantly with reduced motion) and puts it in the address, so a link can open it.
 */
export function SectionNav({ sections, offset = 0, label, className, itemClassName, activeClassName, groupClassName }: SectionNavProps) {
    const theme = useTheme('sectionNav').SectionNav;
    const dict = useI18n('common');
    const ids = sections.map((section) => section.id);
    const menu = useRef<HTMLElement>(null);
    const [active, setActive] = useActiveSection(ids, { offset, menu });

    // Opened with a hash: go to its section once it is on the page.
    useEffect(() => {
        const id = hashId();
        if (!ids.includes(id)) return;
        const frame = window.requestAnimationFrame?.(() => document.getElementById(id)?.scrollIntoView?.({ block: 'start' }));
        return () => { if (frame !== undefined) window.cancelAnimationFrame?.(frame); };
        // Only on the first render: later hashes come from the menu itself.
    }, []);

    const onClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        setActive(id);
        goToSection(id);
    }, [setActive]);

    const groups: { name?: string; items: SectionNavItem[] }[] = [];
    for (const section of sections) {
        const last = groups[groups.length - 1];
        if (last && last.name === section.group) last.items.push(section);
        else groups.push({ name: section.group, items: [section] });
    }

    const link = (section: SectionNavItem) => {
        const current = section.id === active;
        return (
            <li key={section.id} className="max-lg:shrink-0">
                <a
                    href={`#${encodeURIComponent(section.id)}`}
                    aria-current={current ? 'location' : undefined}
                    onClick={(event) => onClick(event, section.id)}
                    className={cn(
                        'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-lg:whitespace-nowrap',
                        current
                            ? cn('bg-accent font-medium text-accent-foreground', theme?.activeClassName, activeClassName)
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                        theme?.itemClassName,
                        itemClassName,
                    )}
                >
                    {section.icon ? <Icon name={section.icon} size={16} className="shrink-0" /> : null}
                    <span className="min-w-0 flex-1">{section.label}</span>
                    {section.badge ? <span className="shrink-0">{section.badge}</span> : null}
                </a>
            </li>
        );
    };

    return (
        <nav
            ref={menu}
            aria-label={label ?? dict.pageSections}
            className={cn(
                // What differs between a small and a large screen is only in `max-lg:` and `lg:`: no base class a
                // later stylesheet of the app could put back over a breakpoint.
                'sticky z-10 max-lg:-mx-1 max-lg:overflow-x-auto max-lg:bg-background/95 max-lg:px-1 max-lg:py-2 max-lg:backdrop-blur lg:max-h-[calc(100vh-var(--rf-section-nav-top))] lg:overflow-y-auto',
                theme?.className,
                className,
            )}
            style={{ top: offset, ['--rf-section-nav-top' as string]: `${offset + 16}px` }}
        >
            <div className="flex max-lg:gap-1 lg:flex-col lg:gap-4">
                {groups.map((group, index) => (
                    <div key={group.name ?? `group-${index}`} className="max-lg:flex max-lg:gap-1">
                        {group.name ? (
                            <div className={cn('px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground max-lg:hidden', theme?.groupClassName, groupClassName)}>
                                {group.name}
                            </div>
                        ) : null}
                        <ul className="flex gap-1 lg:flex-col">{group.items.map(link)}</ul>
                    </div>
                ))}
            </div>
        </nav>
    );
}

export interface PageSectionProps {
    /** The anchor of the section: the `id` of its entry in `SectionNav`. */
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Buttons on the right of the title. */
    actions?: React.ReactNode;
    /** Height in px of what is fixed over the scrolling area: scrolling to the section stops below it. Default 0. */
    offset?: number;
    children?: React.ReactNode;
    className?: string;
    headerClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    bodyClassName?: string;
}

/** A section of a long page, with its anchor: a heading, a line of description, actions, its content. */
export function PageSection({ id, title, description, actions, offset = 0, children, className, headerClassName, titleClassName, descriptionClassName, bodyClassName }: PageSectionProps) {
    const theme = useTheme('pageSection').PageSection;
    const headingId = `${id}-title`;
    return (
        <section
            id={id}
            aria-labelledby={title ? headingId : undefined}
            // Scrolling stops below the fixed header, and on small screens also below the row of the menu.
            className={cn('outline-none scroll-mt-[var(--rf-section-offset)] max-lg:scroll-mt-[calc(var(--rf-section-offset)+3.5rem)]', theme?.className, className)}
            style={{ ['--rf-section-offset' as string]: `${offset + 16}px` }}
        >
            {title || description || actions ? (
                <div className={cn('mb-3 flex flex-wrap items-start justify-between gap-3', theme?.headerClassName, headerClassName)}>
                    <div className="min-w-0">
                        {title ? <h2 id={headingId} className={cn('text-lg font-semibold', theme?.titleClassName, titleClassName)}>{title}</h2> : null}
                        {description ? <p className={cn('mt-1 text-sm text-muted-foreground', theme?.descriptionClassName, descriptionClassName)}>{description}</p> : null}
                    </div>
                    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
                </div>
            ) : null}
            <div className={cn(theme?.bodyClassName, bodyClassName)}>{children}</div>
        </section>
    );
}

export interface SectionLayoutProps {
    sections: readonly SectionNavItem[];
    /** Height in px of what is fixed over the scrolling area (a fixed header when the window scrolls). Default 0. */
    offset?: number;
    /** The name of the menu for assistive technologies. */
    label?: string;
    /** The `PageSection`s. */
    children?: React.ReactNode;
    className?: string;
    navClassName?: string;
    contentClassName?: string;
}

/** The menu beside the sections on large screens, above them on small ones. */
export function SectionLayout({ sections, offset = 0, label, children, className, navClassName, contentClassName }: SectionLayoutProps) {
    return (
        <div className={cn('grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start', className)}>
            <SectionNav sections={sections} offset={offset} label={label} className={navClassName} />
            <div className={cn('flex min-w-0 flex-col gap-10', contentClassName)}>{children}</div>
        </div>
    );
}
