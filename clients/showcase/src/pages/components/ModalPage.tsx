import React, { useState } from 'react';
import { Modal } from '@llmnative/react';
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
    { name: 'size', type: '"sm" | "md" | "lg" | "xl" | "2xl" | "fullscreen"', default: '"md"', description: 'Dialog width', control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'fullscreen'] },
    { name: 'position', type: '"center" | "top" | "left" | "right" | "bottom"', default: '"center"', description: 'Where the modal appears. Non-center positions render as edge panels.', control: 'select', options: ['center', 'top', 'left', 'right', 'bottom'] },
    { name: 'onClose', type: '() => void', description: 'Called when the user dismisses the modal' },
    { name: 'onSave', type: 'ModalSaveHandler', description: 'Async save handler. Return true to close, false to keep open.', shape: `type ModalSaveHandler = (
  e: React.MouseEvent<HTMLButtonElement>
) => Promise<boolean>`, example: `onSave={async () => {
  await saveRecord();
  return true;
}}` },
    { name: 'onDelete', type: 'ModalDeleteHandler', description: 'Async delete handler. Shows a delete button in the footer.', shape: `type ModalDeleteHandler = (
  e: React.MouseEvent<HTMLButtonElement>
) => Promise<boolean>`, example: `onDelete={async () => {
  await deleteRecord();
  return true;
}}` },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close the modal when the backdrop is clicked', control: 'boolean' },
    { name: 'buttonFullscreen', type: 'boolean', default: 'false', description: 'Show fullscreen toggle button in the header', control: 'boolean' },
    { name: 'headerClass', type: 'string', description: 'CSS classes on the header element', control: 'text' },
    { name: 'bodyClass', type: 'string', description: 'CSS classes on the body element', control: 'text' },
    { name: 'footerClass', type: 'string', description: 'CSS classes on the footer element', control: 'text' },
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
        buttonFullscreen: false,
        headerClass: '',
        bodyClass: '',
        footerClass: '',
    },
    render: (p) => {
        return <ModalPlaygroundDemo props={p} />;
    },
};

function ModalPlaygroundDemo({ props: p }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setOpen(true)}>Open modal</button>
            {open && (
                <Modal
                    title={p.title || undefined}
                    header={p.header || undefined}
                    footer={p.footer || undefined}
                    size={p.size}
                    position={p.position}
                    closeOnBackdrop={p.closeOnBackdrop}
                    buttonFullscreen={p.buttonFullscreen}
                    headerClass={p.headerClass || undefined}
                    bodyClass={p.bodyClass || undefined}
                    footerClass={p.footerClass || undefined}
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
                            <button
                                key={pos}
                                className="inline-flex items-center justify-center rounded-md border border-primary bg-transparent px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
                                onClick={() => setOpen(pos)}
                            >
                                {pos}
                            </button>
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

            <Section
                title="ModalYesNo - destructive confirmation"
                description="Use ModalYesNo for irreversible actions such as delete or reset."
                preview={
                    <div className="alert alert-warning text-sm">
                        <strong>Pattern:</strong> Always confirm destructive actions with ModalYesNo before
                        calling delete on the DataProvider.
                    </div>
                }
                code={`import { ModalYesNo } from '@llmnative/react';

{open && (
    <ModalYesNo
        title="Confirm deletion"
        onYes={async () => { await deleteRecord(id); return true; }}
        onNo={async () => true}
        onClose={() => setOpen(false)}
    >
        Are you sure you want to delete this record? This action cannot be undone.
    </ModalYesNo>
)}`}
            />

            <Section
                title="ModalOk - informational"
                description="Simple one-button acknowledgement dialog."
                preview={
                    <div className="alert alert-info text-sm">
                        Use <code className="font-mono">ModalOk</code> for read-only info dialogs that only need an OK button.
                    </div>
                }
                code={`import { ModalOk } from '@llmnative/react';

{open && (
    <ModalOk title="Import complete" onClose={() => setOpen(false)}>
        42 records were imported successfully.
    </ModalOk>
)}`}
            />

            <PropDocsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}
