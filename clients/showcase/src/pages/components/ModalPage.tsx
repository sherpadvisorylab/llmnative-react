import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

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

export default function ModalPage() {
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
        </PageLayout>
    );
}
