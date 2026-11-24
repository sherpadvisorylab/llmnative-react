import React from 'react';
import { AccountMenu, Brand, Modal, SideNav } from '@llmnative/react';

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

/**
 * The sidebar at full height: the brand and the button that reduces it to icons on top, the account at the bottom.
 * On a small screen it opens in a drawer.
 */
export default function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <>
            <div className="hidden h-full lg:flex">
                <SideNav
                    menuKey="main"
                    collapseButtonPlacement="header"
                    header={({ expanded }) => (expanded ? <Brand url="/" label="[projectname]" /> : null)}
                    footer={({ expanded }) => <AccountMenu compact={!expanded} />}
                />
            </div>
            {open && (
                <Modal title="[projectname]" position="left" size="sm" footer={false} onClose={onClose}>
                    <SideNav menuKey="main" embedded />
                    <div className="mt-4 border-t border-border pt-2">
                        <AccountMenu />
                    </div>
                </Modal>
            )}
        </>
    );
}
