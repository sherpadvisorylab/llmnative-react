import React from 'react';
import { Brand, Menu, Notifications, SignInButton } from '@llmnative/react';

type HeaderProps = {
    onMenuToggle?: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
    return (
        <header className="flex items-center gap-3 px-4 h-14 border-b bg-background shrink-0">
            <button
                className="lg:hidden btn btn-outline-secondary border-0 p-1"
                onClick={onMenuToggle}
                aria-label="Toggle sidebar"
            >
                <span className="flex flex-col gap-1">
                    <span className="block w-5 h-0.5 bg-current" />
                    <span className="block w-5 h-0.5 bg-current" />
                    <span className="block w-5 h-0.5 bg-current" />
                </span>
            </button>

            <Brand label="[projectname]" />

            <div className="flex-1">
                <Menu context="header" className="nav flex-row gap-2" />
            </div>

            <div className="flex items-center gap-2">
                <Notifications />
                <SignInButton iconLogout="power" />
            </div>
        </header>
    );
}
