import React from 'react';
import { ActionButton, PageBar, useI18n } from '@llmnative/react';

type HeaderProps = {
    onMenuToggle: () => void;
};

/** The bar on top of the content: the title and the actions of the page (its breadcrumbs when it gives none). */
export default function Header({ onMenuToggle }: HeaderProps) {
    const common = useI18n('common');

    return (
        <header className="flex min-h-14 shrink-0 items-center gap-3 border-b border-header-border bg-header px-4 py-2 text-header-foreground">
            <ActionButton
                icon="menu"
                ariaLabel={common.openNavigation}
                variant="link"
                wrapperClassName="lg:hidden"
                onClick={onMenuToggle}
            />
            <PageBar />
        </header>
    );
}
