import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import ThemePanel from '../components/ThemePanel';

export default function ShowcaseLayout({ children }: { children?: React.ReactNode }) {
    const [themePanelOpen, setThemePanelOpen] = useState(false);

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
