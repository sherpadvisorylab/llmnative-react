import React from 'react';
import { ActionButton, SideNav } from '@llmnative/react';

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <>
            <div className="hidden lg:block">
                <SideNav menuKey="main" />
            </div>

            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                    <aside className="relative flex flex-col w-64 h-full bg-background border-r overflow-y-auto">
                        <div className="flex items-center justify-between px-4 h-14 border-b shrink-0">
                            <span className="font-semibold">Menu</span>
                            <ActionButton
                                className="border-0"
                                variant="outline-secondary"
                                icon="x"
                                ariaLabel="Close sidebar"
                                onClick={onClose}
                            />
                        </div>
                        <SideNav menuKey="main" embedded />
                    </aside>
                </div>
            )}
        </>
    );
}
