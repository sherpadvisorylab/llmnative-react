import React, { useMemo, useState } from 'react';
import { ModalOk, ActionButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseModalOkI18n } from '../../showcase/i18n';

function ModalOkPlaygroundDemo({ props: p }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(false);
    const t = useShowcaseModalOkI18n();

    return (
        <div className="flex flex-col items-start gap-3">
            <ActionButton
                label={t.demo.openButton}
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
    const t = useShowcaseModalOkI18n();

    const propsConfig: PropDef[] = useMemo(() => ([
        { name: 'children', type: 'ReactNode', required: true, description: t.propsDocs.items.children.description, control: 'text' },
        { name: 'title', type: 'ReactNode', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'onClose', type: '() => void', description: t.propsDocs.items.onClose.description },
    ]), [t]);

    const playground: PlaygroundConfig = useMemo(() => ({
        size: 'lg',
        props: propsConfig,
        defaultProps: {
            children: t.demo.defaultBody,
            title: t.demo.defaultTitle,
        },
        render: (p) => <ModalOkPlaygroundDemo props={p} />,
    }), [propsConfig, t]);

    usePlayground(playground, t.page.title);

    const [open, setOpen] = useState(false);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.statusAcknowledgement.title}
                description={t.sections.statusAcknowledgement.description}
                preview={
                    <div className="flex flex-col items-start gap-3">
                        <ActionButton
                            label={t.demo.importCsvButton}
                            onClick={() => setOpen(true)}
                        />
                        {open && (
                            <ModalOk
                                title={t.demo.defaultTitle}
                                onClose={() => setOpen(false)}
                            >
                                <p className="text-sm">{t.demo.acknowledgementBody}</p>
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

            <PropDocsTable props={propsConfig} />
        </PageLayout>
    );
}
