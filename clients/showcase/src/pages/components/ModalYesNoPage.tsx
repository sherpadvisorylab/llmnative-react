import React, { useState } from 'react';
import { ModalYesNo, ActionButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Confirmation message shown in the body', control: 'text' },
    { name: 'title', type: 'ReactNode', description: 'Dialog title', control: 'text' },
    { name: 'onYes', type: '(e) => Promise<boolean>', description: 'Called when the user clicks Yes. Modal closes automatically after the handler resolves.' },
    { name: 'onNo', type: '(e) => Promise<boolean>', description: 'Called when the user clicks No. Modal closes automatically after the handler resolves.' },
    { name: 'onClose', type: '() => void', description: 'Called when the modal is dismissed via the X button or backdrop' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: {
        children: 'Are you sure you want to delete this record? This action cannot be undone.',
        title: 'Confirm deletion',
    },
    render: (p) => <ModalYesNoPlaygroundDemo props={p} />,
};

function ModalYesNoPlaygroundDemo({ props: p }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    return (
        <div className="flex flex-col items-start gap-3">
            <ActionButton
                label="Open ModalYesNo"
                className="btn-outline-secondary"
                onClick={() => { setResult(null); setOpen(true); }}
            />
            {result && <p className="text-sm font-medium">{result}</p>}
            {open && (
                <ModalYesNo
                    title={p.title || undefined}
                    onYes={async () => { setResult('You clicked Yes.'); setOpen(false); return true; }}
                    onNo={async () => { setResult('You clicked No.'); setOpen(false); return true; }}
                    onClose={() => setOpen(false)}
                >
                    <p className="text-sm">{p.children}</p>
                </ModalYesNo>
            )}
        </div>
    );
}

export default function ModalYesNoPage() {
    usePlayground(PLAYGROUND, 'ModalYesNo');
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    return (
        <PageLayout
            title="ModalYesNo"
            description="Confirmation dialog with Yes and No buttons. Both handlers close the modal automatically after they resolve."
        >
            <Section
                title="Destructive confirmation"
                description="Use ModalYesNo before any irreversible action - delete, reset, publish. The Yes handler runs the action; No cancels. Both close the modal when their async handler resolves."
                preview={
                    <div className="flex flex-col items-start gap-3">
                        <ActionButton
                            label="Delete record"
                            className="btn-danger"
                            onClick={() => { setResult(null); setOpen(true); }}
                        />
                        {result && <p className="text-sm font-medium">{result}</p>}
                        {open && (
                            <ModalYesNo
                                title="Confirm deletion"
                                onYes={async () => { setResult('Confirmed - record deleted.'); setOpen(false); return true; }}
                                onNo={async () => { setResult('Cancelled - nothing was deleted.'); setOpen(false); return true; }}
                                onClose={() => setOpen(false)}
                            >
                                <p className="text-sm">
                                    Are you sure you want to delete <strong>user_042</strong>?
                                    This action cannot be undone.
                                </p>
                            </ModalYesNo>
                        )}
                    </div>
                }
                code={`import { ModalYesNo } from '@llmnative/react';

const [open, setOpen] = useState(false);

<ActionButton label="Delete record" className="btn-danger" onClick={() => setOpen(true)} />

{open && (
    <ModalYesNo
        title="Confirm deletion"
        onYes={async () => {
            await deleteRecord(id);
            return true;   // modal closes after handler resolves
        }}
        onNo={async () => true}
        onClose={() => setOpen(false)}
    >
        Are you sure you want to delete this record? This action cannot be undone.
    </ModalYesNo>
)}`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
