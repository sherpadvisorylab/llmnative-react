import React from 'react';
import { Modal } from '@llmnative/react';
import type { PlaygroundModalProps } from '../../docs-kit/playground';

export default function LlmnativeModal({ header, size, onClose, children }: PlaygroundModalProps) {
    return (
        <Modal
            position="right"
            size={size ?? 'md'}
            header={header}
            onClose={onClose}
            closeOnBackdrop
            buttonFullscreen={false}
            headerClassName="h-14 !py-0 px-4"
            bodyClassName="min-h-0 flex-1 overflow-hidden p-4"
            footer={false}
            zIndex={31}
        >
            {children}
        </Modal>
    );
}
