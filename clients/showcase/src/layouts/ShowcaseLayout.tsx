import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import ThemePanel from '../components/ThemePanel';

export default function ShowcaseLayout({ children }: { children?: React.ReactNode }) {
    const [themePanelOpen, setThemePanelOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Topbar onOpenThemePanel={() => setThemePanelOpen(true)} />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 overflow-auto min-h-[calc(100vh-3.5rem)]">
                    {children}
                </main>
            </div>
            <ThemePanel
                open={themePanelOpen}
                onClose={() => setThemePanelOpen(false)}
            />
        </div>
    );
}
