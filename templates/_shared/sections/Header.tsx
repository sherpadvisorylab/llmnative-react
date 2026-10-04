import React from 'react';
import { ActionButton, AuthButton, Brand, Menu, Notifications } from '@llmnative/react';

type HeaderProps = {
    onMenuToggle?: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
    return (
        <header className="flex items-center gap-3 px-4 h-14 border-b bg-background shrink-0">
            <ActionButton
                className="lg:hidden border-0"
                variant="outline-secondary"
                icon="list"
                ariaLabel="Toggle sidebar"
                onClick={onMenuToggle}
            />

            <Brand label="[projectname]" />

            <div className="flex-1">
                <Menu menuKey="header" className="flex flex-row gap-2" />
            </div>

            <div className="flex items-center gap-2">
                <Notifications />
                <AuthButton />
            </div>
        </header>
    );
}
