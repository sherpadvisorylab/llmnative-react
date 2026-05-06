import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useMenu } from 'react-firestrap';

type MenuItem = { path: string; title?: string; group?: string; [key: string]: any };

function groupBy(items: MenuItem[]): Record<string, MenuItem[]> {
    return items.reduce<Record<string, MenuItem[]>>((acc, item) => {
        const g = item.group || 'General';
        (acc[g] ??= []).push(item);
        return acc;
    }, {});
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-1.5 text-sm rounded-md transition-colors ${
        isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    }`;

export default function Sidebar() {
    const { pathname } = useLocation();

    const docsItems       = useMenu('docs');
    const componentsItems = useMenu('components');
    const providersItems  = useMenu('providers');
    const examplesItems   = useMenu('examples');

    let items: MenuItem[] = [];
    if (pathname === '/docs' || pathname.startsWith('/docs/'))          items = docsItems;
    else if (pathname.startsWith('/components'))                        items = componentsItems;
    else if (pathname === '/providers' || pathname.startsWith('/providers/')) items = providersItems;
    else if (pathname.startsWith('/examples'))                          items = examplesItems;

    if (items.length === 0) return null;

    const groups = groupBy(items as MenuItem[]);

    return (
        <aside className="w-52 shrink-0 border-r h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
            <nav className="px-3 py-4 space-y-5">
                {Object.entries(groups).map(([groupTitle, groupItems]) => (
                    <div key={groupTitle}>
                        <div className="px-3 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {groupTitle}
                        </div>
                        <div className="space-y-0.5">
                            {groupItems.map((item) => (
                                <NavLink key={item.path} to={item.path} end className={linkClass}>
                                    {item.title}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
