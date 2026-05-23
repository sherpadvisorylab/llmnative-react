import React from 'react';
import { NavLink } from 'react-router-dom';
import { useThemeController } from '@llmnative/react';
import Icon from './Icon';
import { usePlaygroundContext } from '../context/PlaygroundContext';

interface TopbarProps {
    onOpenThemePanel: () => void;
}

const TOP_NAV = [
    { label: 'Docs',       path: '/docs' },
    { label: 'Components', path: '/components' },
    { label: 'Providers / Integrations',  path: '/providers' },
    { label: 'Examples',   path: '/examples' },
];

const activeLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-1 py-0.5 transition-colors border-b-2 ${
        isActive
            ? 'text-foreground border-primary'
            : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
    }`;

export default function Topbar({ onOpenThemePanel }: TopbarProps) {
    const { resolvedMode, toggleMode } = useThemeController();
    const { config, openPlayground } = usePlaygroundContext();

    return (
        <header className="sticky top-0 z-30 h-14 border-b bg-card/80 backdrop-blur-sm flex items-center px-6 gap-8">

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-foreground">@llmnative/react</span>
                <span className="badge bg-secondary text-xs hidden sm:inline-flex">showcase</span>
            </NavLink>

            {/* Main nav */}
            <nav className="flex items-center gap-6 flex-1">
                {TOP_NAV.map((item) => (
                    <NavLink key={item.path} to={item.path} className={activeLinkClass}>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Playground button — only shown on component pages */}
                {config && (
                    <button
                        onClick={openPlayground}
                        className="flex items-center gap-1.5 px-3 h-8 rounded-md text-sm font-medium border border-primary/40 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        title="Open Playground"
                    >
                        <Icon name="play" size={13} />
                        Playground
                    </button>
                )}
                {/* Dark / light toggle */}
                <button
                    onClick={toggleMode}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                    title={`Switch to ${resolvedMode === 'light' ? 'dark' : 'light'} mode`}
                    aria-label="Toggle color mode"
                >
                    <Icon name={resolvedMode === 'light' ? 'moon' : 'sun'} size={16} />
                </button>

                {/* Theme customizer */}
                <button
                    onClick={onOpenThemePanel}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Customize theme"
                    aria-label="Open theme customizer"
                >
                    <Icon name="palette" size={16} />
                </button>

                {/* GitHub */}
                <a
                    href="https://github.com/sherpadvisorylab/react-quicksuite"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                    title="GitHub"
                    aria-label="View on GitHub"
                >
                    <Icon name="github" size={16} />
                </a>
            </div>
        </header>
    );
}
