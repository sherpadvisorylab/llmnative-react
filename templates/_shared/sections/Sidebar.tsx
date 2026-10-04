import React from 'react';
import { Modal, SideNav } from '@llmnative/react';

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <>
            <div className="hidden lg:flex">
                <SideNav menuKey="main" />
            </div>
            {open && (
                <Modal title="[projectname]" position="left" size="sm" footer={false} onClose={onClose}>
                    <SideNav menuKey="main" embedded />
                </Modal>
            )}
        </>
    );
}
