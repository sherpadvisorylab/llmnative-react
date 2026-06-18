import React, { useState } from 'react';
import Header from '../sections/Header';
import Sidebar from '../sections/Sidebar';
import PageHeader from '../sections/PageHeader';
import Footer from '../sections/Footer';
import PreLoader from '../sections/PreLoader';

export default function Default({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <PreLoader />
            <Header onMenuToggle={() => setSidebarOpen(o => !o)} />
            <div className="flex min-h-0 flex-1 overflow-hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="min-w-0 min-h-0 flex-1 overflow-auto p-4">
                    <PageHeader />
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
