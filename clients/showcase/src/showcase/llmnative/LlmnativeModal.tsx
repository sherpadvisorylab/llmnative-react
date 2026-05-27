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
            headerClass="h-14 !py-0 px-4"
            bodyClass="min-h-0 flex-1 overflow-hidden p-4"
            footer={false}
            zIndex={31}
        >
            {children}
        </Modal>
    );
}
