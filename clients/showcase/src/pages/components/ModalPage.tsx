import React, { useState } from 'react';
import { Modal, ActionButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

type Position = 'center' | 'left' | 'right' | 'top' | 'bottom';

const POSITIONS: Position[] = ['center', 'left', 'right', 'top', 'bottom'];

function DemoModal({ position, onClose }: { position: Position; onClose: () => void }) {
    return (
        <Modal
            title={position === 'center' ? 'Dialog - center' : `Panel - ${position}`}
            position={position}
            size="lg"
            onClose={onClose}
            onSave={async () => true}
        >
            {position === 'center' ? (
                <p>
                    Centered dialog. Supports <code>sm</code>, <code>md</code>, <code>lg</code>,{' '}
                    <code>xl</code>, <code>2xl</code> and <code>fullscreen</code> sizes.
                </p>
            ) : (
                <p>
                    Side panel with <strong>{position}</strong> position.
                    Renders into <code>document.body</code> via a React portal.
                </p>
            )}
        </Modal>
    );
}

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Modal body content', control: 'text' },
    { name: 'title', type: 'string', description: 'Modal title shown in the header', control: 'text' },
    { name: 'header', type: 'ReactNode', description: 'Custom header content (overrides title)', control: 'text', example: `header={<div className="text-sm text-muted-foreground">Extra context above the body.</div>}` },
    { name: 'footer', type: 'ReactNode | false', description: 'Custom footer content, or false to hide footer entirely', control: 'text', typeDetails: `ReactNode | false`, example: `footer={(
  <div className="flex justify-end gap-2">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
)}` },
    { name: 'size', type: '"sm" | "md" | "lg" | "xl" | "2xl" | "fullscreen"', default: '"lg"', description: 'Dialog width', control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'fullscreen'] },
    { name: 'position', type: '"center" | "top" | "left" | "right" | "bottom"', default: '"center"', description: 'Where the modal appears. Non-center positions render as edge panels.', control: 'select', options: ['center', 'top', 'left', 'right', 'bottom'] },
    { name: 'onClose', type: '() => void', description: 'Called when the user dismisses the modal' },
    { name: 'onSave', type: 'ModalSaveHandler', description: 'Async save handler. Return true to close, false to keep open.', shape: `type ModalSaveHandler = (
  e: React.MouseEvent<HTMLElement>
) => Promise<boolean>`, example: `onSave={async () => {
  await saveRecord();
  return true;
}}` },
    { name: 'onDelete', type: 'ModalDeleteHandler', description: 'Async delete handler. Shows a delete button in the footer.', shape: `type ModalDeleteHandler = (
  e: React.MouseEvent<HTMLElement>
) => Promise<boolean>`, example: `onDelete={async () => {
  await deleteRecord();
  return true;
}}` },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close the modal when the backdrop is clicked', control: 'boolean' },
    { name: 'allowFullscreen', type: 'boolean', default: 'true', description: 'Show fullscreen toggle button in the header', control: 'boolean' },
    { name: 'showCancel', type: 'boolean', default: 'true', description: 'Show the Cancel button in the footer when onClose is provided', control: 'boolean' },
    { name: 'zIndex', type: 'number', description: 'CSS z-index override — useful when stacking multiple modals', control: 'number' },
    { name: 'headerClassName', type: 'string', description: 'CSS classes on the header container', control: 'text' },
    { name: 'titleClassName', type: 'string', description: 'CSS classes on the title element', control: 'text' },
    { name: 'subtitleClassName', type: 'string', description: 'CSS classes on the subtitle element (rendered when both title and header are set)', control: 'text' },
    { name: 'bodyClassName', type: 'string', description: 'CSS classes on the body container', control: 'text' },
    { name: 'footerClassName', type: 'string', description: 'CSS classes on the footer container', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outermost dialog wrapper element', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the inner content flex container', control: 'text' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the inner content container, inside the dialog wrapper' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the inner content container, inside the dialog wrapper' },
    { name: 'motion', type: 'MotionReference', description: 'Named motion preset or inline MotionProps override for the dialog entrance/exit animation', typeDetails: 'string | MotionEffect | false' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: {
        children: 'Modal body content goes here.',
        title: 'Dialog title',
        header: '',
        footer: '',
        size: 'md',
        position: 'center',
        closeOnBackdrop: true,
        allowFullscreen: false,
        headerClassName: '',
        bodyClassName: '',
        footerClassName: '',
    },
    render: (p) => <ModalPlaygroundDemo props={p} />,
};

function ModalPlaygroundDemo({ props: p }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <ActionButton label="Open modal" onClick={() => setOpen(true)} />
            {open && (
                <Modal
                    title={p.title || undefined}
                    header={p.header || undefined}
                    footer={p.footer || undefined}
                    size={p.size}
                    position={p.position}
                    closeOnBackdrop={p.closeOnBackdrop}
                    allowFullscreen={p.allowFullscreen}
                    headerClassName={p.headerClassName || undefined}
                    bodyClassName={p.bodyClassName || undefined}
                    footerClassName={p.footerClassName || undefined}
                    onClose={() => setOpen(false)}
                    onSave={async () => { setOpen(false); return true; }}
                >
                    <p className="text-sm text-muted-foreground">{p.children}</p>
                </Modal>
            )}
        </>
    );
}

export default function ModalPage() {
    usePlayground(PLAYGROUND, 'Modal');
    const [open, setOpen] = useState<Position | null>(null);

    return (
        <PageLayout
            title="Modal"
            description="Centered dialogs and edge panels. Fullscreen toggle, async save/delete actions and portal rendering."
        >
            <Section
                title="Positions"
                description="Click a button to open the modal in the corresponding position."
                preview={
                    <div className="flex flex-wrap gap-2">
                        {POSITIONS.map((pos) => (
                            <ActionButton
                                key={pos}
                                label={pos}
                                className="btn-outline-secondary"
                                onClick={() => setOpen(pos)}
                            />
                        ))}
                        {open && <DemoModal position={open} onClose={() => setOpen(null)} />}
                    </div>
                }
                code={`import { Modal } from '@llmnative/react';

const [open, setOpen] = useState(false);

{open && (
    <Modal
        title="Dialog title"
        position="center"     // center | left | right | top | bottom
        size="lg"             // sm | md | lg | xl | 2xl | fullscreen
        onClose={() => setOpen(false)}
        closeOnBackdrop={true}
        onSave={async () => {
            await save();
            return true;      // true closes the modal, false keeps it open
        }}
    >
        Modal content here
    </Modal>
)}`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
