import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { cn } from '../../libs/cn';
import Breadcrumbs from './Breadcrumbs';
import Icon from '../ui/Icon';
import { Dropdown, DropdownItem } from './Dropdown';
import { useI18n } from '../../I18n';

/**
 * CR-151 — the title and the actions of a page in the bar on top of the content. The layout holds a
 * `PageBarProvider` and draws a `PageBar` in its bar; a page states its title with `PageTitle`, drawn there through a
 * portal (its actions keep the contexts of the page). Without a `PageTitle` the bar shows the breadcrumbs; without a
 * provider `PageTitle` draws itself in place.
 */
interface PageBarState {
    readonly target: HTMLElement | null;
    readonly setTarget: (element: HTMLElement | null) => void;
    readonly titles: number;
    readonly register: () => () => void;
}

const PageBarContext = createContext<PageBarState | null>(null);

/** Around the layout: the bar and the pages that give it their title. */
export function PageBarProvider({ children }: { children?: ReactNode }) {
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const [titles, setTitles] = useState(0);
    const [state] = useState(() => ({
        register: () => {
            setTitles((n) => n + 1);
            return () => setTitles((n) => n - 1);
        },
    }));
    return <PageBarContext.Provider value={{ target, setTarget, titles, register: state.register }}>{children}</PageBarContext.Provider>;
}

export interface PageBarProps {
    /** What the bar shows while the page gives no title: by default the breadcrumbs. */
    fallback?: ReactNode;
    className?: string;
}

/** The place of the title and the actions of the page, in the bar of the layout. */
export function PageBar({ fallback, className }: PageBarProps) {
    const bar = useContext(PageBarContext);
    return (
        <div className={cn('flex min-w-0 flex-1 items-center', className)} data-rf-page-bar>
            {bar && bar.titles === 0 ? (fallback ?? <Breadcrumbs />) : null}
            <div ref={bar?.setTarget} className="flex min-w-0 flex-1 items-center empty:hidden" />
        </div>
    );
}

/** A page above the current one, in the trail of `PageTitle`. */
export interface PageTitleLink {
    readonly label: ReactNode;
    readonly to: string;
}

export interface PageTitleProps {
    /**
     * The title of the page: a text, truncated when the bar is narrow, or a node of its own (a menu to switch to
     * another record): then the `h1` does not clip it and the node truncates its own text (CR-152).
     */
    title: ReactNode;
    /** The name of the heading when `title` is a node whose text is not the name of the page (a menu button). */
    label?: string;
    /** Before the title: an icon of the provider, or a node of its own. */
    icon?: ReactNode;
    /** The page above (a list), before the title: `Pratiche › Rossi Srl`. Shorthand of `parents` with one level. */
    parent?: PageTitleLink;
    /**
     * CR-152 — the pages above, from the highest: `Library › Components › Edit component`. On a narrow screen the
     * levels before the direct parent become a menu (`…`); the direct parent stays.
     */
    parents?: readonly PageTitleLink[];
    /** CR-152 — right after the title, before the actions: a control of the open page (a switcher, a status badge). */
    after?: ReactNode;
    /** The buttons of the page, at the end of the bar. */
    actions?: ReactNode;
    className?: string;
}

const isText = (node: ReactNode): node is string | number => typeof node === 'string' || typeof node === 'number';

const linkClass = 'min-w-0 max-w-[12rem] shrink truncate text-sm text-muted-foreground hover:text-foreground hover:underline';

function Separator({ className }: { className?: string }) {
    return <Icon name="chevron-right" size={14} className={cn('shrink-0 text-muted-foreground', className)} />;
}

/** The pages above the title: links with separators; on a narrow screen the levels before the direct parent in a menu. */
function PageTrail({ trail }: { trail: readonly PageTitleLink[] }) {
    const dict = useI18n('breadcrumbs');
    if (!trail.length) return null;
    const hidden = trail.slice(0, -1);
    return (
        <nav aria-label={dict.label} className="flex min-w-0 shrink items-center gap-2" data-rf-page-trail>
            {hidden.length ? (
                <span className="flex shrink-0 items-center gap-2 sm:hidden">
                    <Dropdown trigger={{ icon: 'ellipsis', title: dict.more }} triggerClassName="h-7 px-1.5">
                        {hidden.map((level) => <DropdownItem key={level.to} url={level.to}>{level.label}</DropdownItem>)}
                    </Dropdown>
                    <Separator />
                </span>
            ) : null}
            {trail.map((level, i) => {
                const intermediate = i < trail.length - 1;
                return (
                    <React.Fragment key={level.to}>
                        <Link to={level.to} className={cn(linkClass, intermediate && 'hidden sm:block')}>{level.label}</Link>
                        <Separator className={intermediate ? 'hidden sm:block' : undefined} />
                    </React.Fragment>
                );
            })}
        </nav>
    );
}

/** The title of the page, with its actions: in the `PageBar` of the layout, or here without one. */
export function PageTitle({ title, label, icon, parent, parents, after, actions, className }: PageTitleProps) {
    const bar = useContext(PageBarContext);
    const register = bar?.register;
    useEffect(() => (register ? register() : undefined), [register]);
    const trail = parents ?? (parent ? [parent] : []);
    const content = (
        <div className={cn('flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2', className)} data-rf-page-title>
            <div className="flex min-w-0 flex-1 items-center gap-2">
                {typeof icon === 'string' ? <Icon name={icon} size={20} className="shrink-0 text-primary" /> : icon ?? null}
                <PageTrail trail={trail} />
                <h1
                    aria-label={label}
                    className={cn(
                        'min-w-0 text-lg font-semibold tracking-tight text-foreground',
                        isText(title) ? 'truncate' : 'flex items-center',
                    )}
                >
                    {title}
                </h1>
                {after ? <div className="flex shrink-0 items-center gap-2" data-rf-page-title-after>{after}</div> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div> : null}
        </div>
    );
    if (!bar) return content;
    return bar.target ? createPortal(content, bar.target) : null;
}

export default PageBar;
