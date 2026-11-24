import React from 'react';
import { ActionButton, AuthButton, Brand, useI18n } from '@llmnative/react';

type HeaderProps = {
    onMenuToggle: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
    const common = useI18n('common');

    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-header-border bg-header px-4 text-header-foreground">
            <ActionButton
                icon="menu"
                ariaLabel={common.openNavigation}
                variant="link"
                wrapperClassName="lg:hidden"
                onClick={onMenuToggle}
            />
            <Brand url="/" label="[projectname]" />
            <div className="ms-auto">
                <AuthButton aspect="avatar" />
            </div>
        </header>
    );
}
