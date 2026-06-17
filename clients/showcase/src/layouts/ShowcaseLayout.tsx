import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssetsHead } from '@llmnative/react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import ThemePanel from '../components/ThemePanel';
import { PlaygroundDrawer, PlaygroundProvider, usePlaygroundContext } from '../docs-kit/playground';
import { llmnativePlaygroundEnvironment } from '../showcase/llmnative';

const GOOGLE_FONTS_URL =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700' +
    '&family=Geist:wght@400;500;600;700' +
    '&family=Nunito:wght@400;500;600;700' +
    '&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700' +
    '&family=Roboto:wght@400;500;700' +
    '&family=Poppins:wght@400;500;600;700' +
    '&family=Lato:wght@400;700' +
    '&family=Montserrat:wght@400;500;600;700' +
    '&family=Open+Sans:wght@400;500;600;700' +
    '&family=Raleway:wght@400;500;600;700' +
    '&family=Outfit:wght@400;500;600;700' +
    '&family=Plus+Jakarta+Sans:wght@400;500;600;700' +
    '&family=Figtree:wght@400;500;600;700' +
    '&family=Geist+Mono:wght@400;500' +
    '&family=JetBrains+Mono:wght@400;500' +
    '&family=Fira+Code:wght@400;500' +
    '&family=Source+Code+Pro:wght@400;500' +
    '&display=swap';

function LayoutInner({ children }: { children?: React.ReactNode }) {
    useAssetsHead({
        fonts: [
            {
                href: GOOGLE_FONTS_URL,
                preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
                crossOrigin: 'anonymous',
            },
        ],
    });

    const [themePanelOpen, setThemePanelOpen] = useState(false);
    const { pathname } = useLocation();
    const { config, title, open, closePlayground } = usePlaygroundContext();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Topbar onOpenThemePanel={() => setThemePanelOpen(true)} />
            <div className="flex h-[calc(100vh-3.5rem)]">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
            <ThemePanel
                open={themePanelOpen}
                onClose={() => setThemePanelOpen(false)}
            />
            {config && (
                <PlaygroundDrawer
                    title={title}
                    config={config}
                    open={open}
                    onClose={closePlayground}
                />
            )}
        </div>
    );
}

export default function ShowcaseLayout({ children }: { children?: React.ReactNode }) {
    return (
        <PlaygroundProvider environment={llmnativePlaygroundEnvironment}>
            <LayoutInner>{children}</LayoutInner>
        </PlaygroundProvider>
    );
}
