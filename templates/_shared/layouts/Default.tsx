import React, { useState } from 'react';
import { PageBarProvider } from '@llmnative/react';
import Header from '../sections/Header';
import Sidebar from '../sections/Sidebar';
import Footer from '../sections/Footer';

/**
 * The layout of the app (CR-151): the sidebar at full height, with the brand and the account; on the right the bar
 * with the title and the actions of the page (`PageTitle`), the content and the footer.
 */
export default function Default({ children }: { children?: React.ReactNode }) {
    const [navOpen, setNavOpen] = useState(false);

    return (
        <PageBarProvider>
            <div className="flex h-screen overflow-hidden">
                <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
                <div className="flex min-w-0 flex-1 flex-col">
                    <Header onMenuToggle={() => setNavOpen(open => !open)} />
                    <main className="min-h-0 min-w-0 flex-1 overflow-auto p-4">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </PageBarProvider>
    );
}
