import React, { useMemo, useState } from 'react';
import { ModalYesNo, ActionButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseModalYesNoI18n } from '../../showcase/i18n';

function ModalYesNoPlaygroundDemo({ props: p }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const t = useShowcaseModalYesNoI18n();

    return (
        <div className="flex flex-col items-start gap-3">
            <ActionButton
                label={t.demo.openButton}
                className="btn-outline-secondary"
                onClick={() => { setResult(null); setOpen(true); }}
            />
            {result && <p className="text-sm font-medium">{result}</p>}
            {open && (
                <ModalYesNo
                    title={p.title || undefined}
                    onYes={async () => { setResult(t.demo.yesResult); setOpen(false); return true; }}
                    onNo={async () => { setResult(t.demo.noResult); setOpen(false); return true; }}
                    onClose={() => setOpen(false)}
                >
                    <p className="text-sm">{p.children}</p>
                </ModalYesNo>
            )}
        </div>
    );
}

export default function ModalYesNoPage() {
    const t = useShowcaseModalYesNoI18n();

    const propsConfig: PropDef[] = useMemo(() => ([
        { name: 'children', type: 'ReactNode', required: true, description: t.propsDocs.items.children.description, control: 'text' },
        { name: 'title', type: 'ReactNode', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'onYes', type: '(e) => Promise<boolean>', description: t.propsDocs.items.onYes.description },
        { name: 'onNo', type: '(e) => Promise<boolean>', description: t.propsDocs.items.onNo.description },
        { name: 'onClose', type: '() => void', description: t.propsDocs.items.onClose.description },
    ]), [t]);

    const playground: PlaygroundConfig = useMemo(() => ({
        size: 'lg',
        props: propsConfig,
        defaultProps: {
            children: t.demo.defaultBody,
            title: t.demo.defaultTitle,
        },
        render: (p) => <ModalYesNoPlaygroundDemo props={p} />,
    }), [propsConfig, t]);

    usePlayground(playground, t.page.title);

    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.destructiveConfirmation.title}
                description={t.sections.destructiveConfirmation.description}
                preview={
                    <div className="flex flex-col items-start gap-3">
                        <ActionButton
                            label={t.demo.deleteRecordButton}
                            className="btn-danger"
                            onClick={() => { setResult(null); setOpen(true); }}
                        />
                        {result && <p className="text-sm font-medium">{result}</p>}
                        {open && (
                            <ModalYesNo
                                title={t.demo.defaultTitle}
                                onYes={async () => { setResult(t.demo.confirmedResult); setOpen(false); return true; }}
                                onNo={async () => { setResult(t.demo.cancelledResult); setOpen(false); return true; }}
                                onClose={() => setOpen(false)}
                            >
                                <p className="text-sm">{t.demo.destructiveQuestion}</p>
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

            <PropDocsTable props={propsConfig} />
        </PageLayout>
    );
}
