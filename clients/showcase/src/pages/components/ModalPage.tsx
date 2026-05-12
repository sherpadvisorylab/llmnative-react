import React, { useState } from 'react';
import { Modal } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

type Position = 'center' | 'left' | 'right' | 'top' | 'bottom';

const POSITIONS: Position[] = ['center', 'left', 'right', 'top', 'bottom'];

function DemoModal({ position, onClose }: { position: Position; onClose: () => void }) {
    const isOffcanvas = position !== 'center';

    if (isOffcanvas) {
        const offcanvasDir: Record<string, string> = {
            left: 'offcanvas-start',
            right: 'offcanvas-end',
            top: 'offcanvas-top',
            bottom: 'offcanvas-bottom',
        };
        return (
            <>
                <div className={`offcanvas ${offcanvasDir[position]}`} style={{ display: 'flex' }}>
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title">Panel — {position}</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>
                    <div className="offcanvas-body">
                        Side panel with <strong>{position}</strong> position.
                        Renders into <code>document.body</code> via a React portal.
                    </div>
                    <div className="offcanvas-footer">
                        <button className="btn btn-link" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={onClose}>Done</button>
                    </div>
                </div>
                <div className="offcanvas-backdrop" onClick={onClose} />
            </>
        );
    }

    return (
        <>
            <div className="modal-cover">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Dialog — {position}</h5>
                            <button className="btn-close" onClick={onClose} />
                        </div>
                        <div className="modal-body">
                            Centered dialog. Supports <code>sm</code>, <code>md</code>, <code>lg</code>,{' '}
                            <code>xl</code> and <code>fullscreen</code> sizes.
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-link" onClick={onClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={onClose}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </>
    );
}

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Modal body content', control: 'text' },
    { name: 'title', type: 'string', description: 'Modal title shown in the header', control: 'text' },
    { name: 'header', type: 'ReactNode', description: 'Custom header content (overrides title)', control: 'text' },
    { name: 'footer', type: 'ReactNode | false', description: 'Custom footer content, or false to hide footer entirely', control: 'text' },
    { name: 'size', type: '"sm" | "md" | "lg" | "xl" | "fullscreen"', default: '"md"', description: 'Dialog width', control: 'select', options: ['sm', 'md', 'lg', 'xl', 'fullscreen'] },
    { name: 'position', type: '"center" | "top" | "left" | "right" | "bottom"', default: '"center"', description: 'Where the modal appears. Non-center positions render as offcanvas panels.', control: 'select', options: ['center', 'top', 'left', 'right', 'bottom'] },
    { name: 'onClose', type: '() => void', description: 'Called when the user dismisses the modal' },
    { name: 'onSave', type: 'async (e) => boolean', description: 'Async save handler. Return true to close, false to keep open.' },
    { name: 'onDelete', type: 'async (e) => boolean', description: 'Async delete handler. Shows a delete button in the footer.' },
    { name: 'footerClose', type: 'boolean', default: 'true', description: 'Show a close/cancel button in the footer', control: 'boolean' },
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
        footerClose: true,
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
            <button className="btn btn-primary" onClick={() => setOpen(true)}>Open modal</button>
            {open && (
                <Modal
                    title={p.title || undefined}
                    header={p.header || undefined}
                    footer={p.footer || undefined}
                    size={p.size}
                    position={p.position}
                    footerClose={p.footerClose}
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
            description="Centered dialogs and side panels (offcanvas). Fullscreen toggle, async save/delete actions and portal rendering."
        >
            <Section
                title="Positions"
                description="Click a button to open the modal in the corresponding position."
                preview={
                    <div className="flex flex-wrap gap-2">
                        {POSITIONS.map((pos) => (
                            <button
                                key={pos}
                                className="btn btn-outline-primary"
                                onClick={() => setOpen(pos)}
                            >
                                {pos}
                            </button>
                        ))}
                        {open && <DemoModal position={open} onClose={() => setOpen(null)} />}
                    </div>
                }
                code={`import { Modal } from 'react-firestrap';

const [open, setOpen] = useState(false);

{open && (
    <Modal
        title="Dialog title"
        position="center"     // center | left | right | top | bottom
        size="lg"             // sm | md | lg | xl | fullscreen
        onClose={() => setOpen(false)}
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
                title="ModalYesNo — destructive confirmation"
                description="Use ModalYesNo for irreversible actions such as delete or reset."
                preview={
                    <div className="alert alert-warning text-sm">
                        <strong>Pattern:</strong> Always confirm destructive actions with ModalYesNo before
                        calling delete on the DataProvider.
                    </div>
                }
                code={`import { ModalYesNo } from 'react-firestrap';

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
                title="ModalOk — informational"
                description="Simple one-button acknowledgement dialog."
                preview={
                    <div className="alert alert-info text-sm">
                        Use <code className="font-mono">ModalOk</code> for read-only info dialogs that only need an OK button.
                    </div>
                }
                code={`import { ModalOk } from 'react-firestrap';

{open && (
    <ModalOk title="Import complete" onClose={() => setOpen(false)}>
        42 records were imported successfully.
    </ModalOk>
)}`}
            />

            <PropsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}
