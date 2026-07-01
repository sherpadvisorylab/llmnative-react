import React, { useMemo, useState } from 'react';
import { Modal, ActionButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseModalI18n } from '../../showcase/i18n';

type Position = 'center' | 'left' | 'right' | 'top' | 'bottom';

const POSITIONS: Position[] = ['center', 'left', 'right', 'top', 'bottom'];

function DemoModal({ position, onClose }: { position: Position; onClose: () => void }) {
    const t = useShowcaseModalI18n();

    return (
        <Modal
            title={position === 'center' ? t.demo.dialogTitleCenter : t.demo.panelTitle.replace('{position}', position)}
            position={position}
            size="lg"
            onClose={onClose}
            onSave={async () => true}
        >
            <p>
                {position === 'center'
                    ? t.demo.dialogBody
                    : t.demo.panelBody.replace('{position}', position)}
            </p>
        </Modal>
    );
}

function ModalPlaygroundDemo({ props: p }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(false);
    const t = useShowcaseModalI18n();

    return (
        <>
            <ActionButton label={t.demo.openButton} onClick={() => setOpen(true)} />
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
    const t = useShowcaseModalI18n();

    const propsConfig: PropDef[] = useMemo(() => ([
        { name: 'children', type: 'ReactNode', required: true, description: t.propsDocs.items.children.description, control: 'text' },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'header', type: 'ReactNode', description: t.propsDocs.items.header.description, control: 'text', example: t.propsDocs.items.header.example },
        { name: 'footer', type: 'ReactNode | false', description: t.propsDocs.items.footer.description, control: 'text', typeDetails: t.propsDocs.items.footer.typeDetails, example: t.propsDocs.items.footer.example },
        { name: 'size', type: '"sm" | "md" | "lg" | "xl" | "2xl" | "fullscreen"', default: '"lg"', description: t.propsDocs.items.size.description, control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'fullscreen'] },
        { name: 'position', type: '"center" | "top" | "left" | "right" | "bottom"', default: '"center"', description: t.propsDocs.items.position.description, control: 'select', options: ['center', 'top', 'left', 'right', 'bottom'] },
        { name: 'onClose', type: '() => void', description: t.propsDocs.items.onClose.description },
        { name: 'onSave', type: 'ModalSaveHandler', description: t.propsDocs.items.onSave.description, shape: t.propsDocs.items.onSave.typeDetails, example: t.propsDocs.items.onSave.example },
        { name: 'onDelete', type: 'ModalDeleteHandler', description: t.propsDocs.items.onDelete.description, shape: t.propsDocs.items.onDelete.typeDetails, example: t.propsDocs.items.onDelete.example },
        { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: t.propsDocs.items.closeOnBackdrop.description, control: 'boolean' },
        { name: 'allowFullscreen', type: 'boolean', default: 'false', description: t.propsDocs.items.allowFullscreen.description, control: 'boolean' },
        { name: 'showCancel', type: 'boolean', default: 'true', description: t.propsDocs.items.showCancel.description, control: 'boolean' },
        { name: 'zIndex', type: 'number', description: t.propsDocs.items.zIndex.description, control: 'number' },
        { name: 'headerClassName', type: 'string', description: t.propsDocs.items.headerClassName.description, control: 'text' },
        { name: 'titleClassName', type: 'string', description: t.propsDocs.items.titleClassName.description, control: 'text' },
        { name: 'subtitleClassName', type: 'string', description: t.propsDocs.items.subtitleClassName.description, control: 'text' },
        { name: 'bodyClassName', type: 'string', description: t.propsDocs.items.bodyClassName.description, control: 'text' },
        { name: 'footerClassName', type: 'string', description: t.propsDocs.items.footerClassName.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description },
        { name: 'motion', type: 'MotionReference', description: t.propsDocs.items.motion.description, typeDetails: t.propsDocs.items.motion.typeDetails },
    ]), [t]);

    const playground: PlaygroundConfig = useMemo(() => ({
        size: 'lg',
        props: propsConfig,
        defaultProps: {
            children: t.demo.defaultBody,
            title: t.demo.defaultTitle,
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
    }), [propsConfig, t]);

    usePlayground(playground, t.page.title);

    const [open, setOpen] = useState<Position | null>(null);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.positions.title}
                description={t.sections.positions.description}
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

            <PropDocsTable props={propsConfig} />
        </PageLayout>
    );
}
