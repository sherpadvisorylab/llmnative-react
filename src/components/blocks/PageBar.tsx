import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { cn } from '../../libs/cn';
import Breadcrumbs from './Breadcrumbs';
import Icon from '../ui/Icon';

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

export interface PageTitleProps {
    title: ReactNode;
    /** Before the title: an icon of the provider, or a node of its own. */
    icon?: ReactNode;
    /** The page above (a list), before the title: `Pratiche › Rossi Srl`. */
    parent?: { readonly label: ReactNode; readonly to: string };
    /** The buttons of the page, at the end of the bar. */
    actions?: ReactNode;
    className?: string;
}

/** The title of the page, with its actions: in the `PageBar` of the layout, or here without one. */
export function PageTitle({ title, icon, parent, actions, className }: PageTitleProps) {
    const bar = useContext(PageBarContext);
    const register = bar?.register;
    useEffect(() => (register ? register() : undefined), [register]);
    const content = (
        <div className={cn('flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2', className)} data-rf-page-title>
            <div className="flex min-w-0 flex-1 items-center gap-2">
                {typeof icon === 'string' ? <Icon name={icon} size={20} className="shrink-0 text-primary" /> : icon ?? null}
                {parent ? (
                    <>
                        <Link to={parent.to} className="shrink-0 truncate text-sm text-muted-foreground hover:text-foreground hover:underline">{parent.label}</Link>
                        <Icon name="chevron-right" size={14} className="shrink-0 text-muted-foreground" />
                    </>
                ) : null}
                <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-foreground">{title}</h1>
            </div>
            {actions ? <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div> : null}
        </div>
    );
    if (!bar) return content;
    return bar.target ? createPortal(content, bar.target) : null;
}

export default PageBar;
