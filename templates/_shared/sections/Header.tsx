import React from 'react';
import { ActionButton, AuthButton, Brand } from '@llmnative/react';

type HeaderProps = {
    onMenuToggle: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-header-border bg-header px-4 text-header-foreground">
            <ActionButton
                icon="menu"
                ariaLabel="Toggle navigation"
                variant="link"
                wrapperClassName="lg:hidden"
                onClick={onMenuToggle}
            />
            <Brand url="/" label="[projectname]" />
            <div className="ms-auto">
                <AuthButton />
            </div>
        </header>
    );
}
