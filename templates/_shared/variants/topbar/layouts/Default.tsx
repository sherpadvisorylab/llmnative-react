import React, { useState } from 'react';
import Header from '../sections/Header';
import Sidebar from '../sections/Sidebar';
import PageHeader from '../sections/PageHeader';
import Footer from '../sections/Footer';

export default function Default({ children }: { children?: React.ReactNode }) {
    const [navOpen, setNavOpen] = useState(false);

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <Header onMenuToggle={() => setNavOpen(open => !open)} />
            <div className="flex min-h-0 flex-1 overflow-hidden">
                <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
                <main className="min-h-0 min-w-0 flex-1 overflow-auto p-4">
                    <PageHeader />
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
