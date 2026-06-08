import React, { useState } from 'react';
import { ModalOk, ActionButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Informational content shown in the body', control: 'text' },
    { name: 'title', type: 'ReactNode', description: 'Dialog title', control: 'text' },
    { name: 'onClose', type: '() => void', description: 'Called when the user clicks Ok or the X button' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: {
        children: '42 records were imported successfully.',
        title: 'Import complete',
    },
    render: (p) => <ModalOkPlaygroundDemo props={p} />,
};

function ModalOkPlaygroundDemo({ props: p }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col items-start gap-3">
            <ActionButton
                label="Open ModalOk"
                className="btn-outline-secondary"
                onClick={() => setOpen(true)}
            />
            {open && (
                <ModalOk
                    title={p.title || undefined}
                    onClose={() => setOpen(false)}
                >
                    <p className="text-sm">{p.children}</p>
                </ModalOk>
            )}
        </div>
    );
}

export default function ModalOkPage() {
    usePlayground(PLAYGROUND, 'ModalOk');
    const [open, setOpen] = useState(false);

    return (
        <PageLayout
            title="ModalOk"
            description="Informational dialog with a single Ok button. Use it for read-only status messages that only require acknowledgement."
        >
            <Section
                title="Status acknowledgement"
                description="ModalOk is the lightest modal variant - one button, no branching. Use it after background jobs, imports, or any operation the user should be aware of."
                preview={
                    <div className="flex flex-col items-start gap-3">
                        <ActionButton
                            label="Import CSV"
                            onClick={() => setOpen(true)}
                        />
                        {open && (
                            <ModalOk
                                title="Import complete"
                                onClose={() => setOpen(false)}
                            >
                                <p className="text-sm">
                                    42 records were imported successfully.
                                    3 rows were skipped due to validation errors.
                                </p>
                            </ModalOk>
                        )}
                    </div>
                }
                code={`import { ModalOk } from '@llmnative/react';

const [open, setOpen] = useState(false);

<ActionButton label="Import CSV" onClick={() => setOpen(true)} />

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
