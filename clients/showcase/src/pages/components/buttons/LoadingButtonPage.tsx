import React, { useState } from 'react';
import { LoadingButton, Alert } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseLoadingButtonI18n } from '../../../showcase/i18n';

const VARIANTS = [
    'primary', 'secondary', 'success', 'danger', 'warning', 'info',
    'outline-primary', 'outline-secondary',
] as const;

const PROPS: PropDef[] = [
    { name: 'label', type: 'string | ReactNode', description: 'Visible label while idle', control: 'text' },
    { name: 'icon', type: 'string', description: 'Icon shown while idle', control: 'icon' },
    { name: 'onClick', type: '(e, setMessage?) => Promise<unknown>', description: 'Async handler. Button disables itself until the promise resolves. Use setMessage to update the label mid-flight.' },
    { name: 'loadingLabel', type: 'string | ReactNode', description: 'Label shown while loading. Defaults to label + "..."', control: 'text' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Controlled loading state from outside (e.g. form submit in progress)', control: 'boolean' },
    { name: 'variant', type: '"primary" | "secondary" | ... | "outline-*"', description: 'Semantic color variant', control: 'select', options: [...VARIANTS] },
    { name: 'className', type: 'string', description: 'Raw CSS class override', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button permanently (regardless of loading)', control: 'boolean' },
    { name: 'badge', type: 'ReactNode | BadgeDescriptor', description: 'Badge shown while idle (hidden during loading)', control: 'json' },
    { name: 'title', type: 'string', description: 'Native title attribute', control: 'text' },
    { name: 'iconClassName', type: 'string', description: 'CSS classes applied to the icon element inside the button' },
    { name: 'style', type: 'React.CSSProperties', description: 'Inline style applied to the button element (merged with motion transform)' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered immediately before the button in the wrapper' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered immediately after the button in the wrapper' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes applied to the outermost wrapper element' },
    { name: 'motion', type: 'string | MotionEffect | false', default: '"press"', description: 'Named motion preset or inline MotionEffect override. Defaults to the theme press motion.' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS,
    defaultProps: { label: 'Save', icon: 'save', loadingLabel: '', loading: false, disabled: false, variant: 'primary', className: '', title: '', badge: null },
    render: (p) => (
        <LoadingButton
            label={p.label || undefined}
            icon={typeof p.icon === 'string' ? p.icon : undefined}
            variant={p.variant || undefined}
            className={p.className || undefined}
            loadingLabel={p.loadingLabel || undefined}
            loading={p.loading}
            disabled={p.disabled}
            title={p.title || undefined}
            badge={p.badge || undefined}
            onClick={async () => {
                await new Promise((r) => setTimeout(r, 1500));
            }}
        />
    ),
};

export default function LoadingButtonPage() {
    usePlayground(PLAYGROUND, 'LoadingButton');
    const common = useShowcaseCommonI18n();
    const t = useShowcaseLoadingButtonI18n();
    const [result, setResult] = useState<string | null>(null);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.asyncSave.title}
                description={t.sections.asyncSave.description}
                preview={
                    <div className="flex items-center gap-4 pt-2">
                        <LoadingButton
                            variant="primary"
                            icon="save"
                            label="Save"
                            onClick={async () => {
                                await new Promise((r) => setTimeout(r, 1500));
                            }}
                        />
                        <span className="text-sm text-muted-foreground">Click and watch it disable itself</span>
                    </div>
                }
                code={`<LoadingButton
    variant="primary"
    icon="save"
    label="Save"
    onClick={async () => {
        await saveRecord();
    }}
/>`}
            />

            <Section
                title={t.sections.customLabel.title}
                description={t.sections.customLabel.description}
                preview={
                    <div className="flex flex-wrap gap-3">
                        <LoadingButton
                            variant="primary"
                            icon="upload"
                            label="Upload"
                            loadingLabel="Uploading..."
                            onClick={async () => { await new Promise((r) => setTimeout(r, 2000)); }}
                        />
                        <LoadingButton
                            variant="outline-secondary"
                            icon="refresh-cw"
                            label="Sync"
                            loadingLabel="Syncing data..."
                            onClick={async () => { await new Promise((r) => setTimeout(r, 2000)); }}
                        />
                    </div>
                }
                code={`<LoadingButton
    variant="primary"
    icon="upload"
    label="Upload"
    loadingLabel="Uploading..."
    onClick={async () => { await uploadFile(); }}
/>`}
            />

            <Section
                title={t.sections.streaming.title}
                description={t.sections.streaming.description}
                preview={
                    <LoadingButton
                        variant="primary"
                        icon="zap"
                        label="Run pipeline"
                        onClick={async (_e, setMessage) => {
                            setMessage?.({ message: 'Step 1 of 3...' });
                            await new Promise((r) => setTimeout(r, 900));
                            setMessage?.({ message: 'Step 2 of 3...' });
                            await new Promise((r) => setTimeout(r, 900));
                            setMessage?.({ message: 'Finishing...' });
                            await new Promise((r) => setTimeout(r, 600));
                        }}
                    />
                }
                code={`<LoadingButton
    variant="primary"
    icon="zap"
    label="Run pipeline"
    onClick={async (_e, setMessage) => {
        setMessage?.({ message: 'Step 1 of 3...' });
        await runStep1();
        setMessage?.({ message: 'Step 2 of 3...' });
        await runStep2();
        setMessage?.({ message: 'Finishing...' });
        await runStep3();
    }}
/>`}
            />

            <Section
                title={t.sections.disabled.title}
                description={t.sections.disabled.description}
                preview={
                    <div className="flex flex-wrap gap-3">
                        <LoadingButton variant="primary" icon="save" label="Save" disabled />
                        <LoadingButton variant="outline-secondary" icon="send" label="Send" disabled />
                    </div>
                }
                code={`<LoadingButton variant="primary" icon="save" label="Save" disabled />`}
            />

            <Section
                title={t.sections.controlled.title}
                description={t.sections.controlled.description}
                preview={
                    <div className="flex items-center gap-4">
                        <LoadingButton
                            variant="primary"
                            icon="send"
                            label="Submit form"
                            loading={result === 'loading'}
                            onClick={async () => {
                                setResult('loading');
                                await new Promise((r) => setTimeout(r, 1500));
                                setResult('done');
                            }}
                        />
                        {result === 'done' && (
                            <Alert variant="success" timeout={3000} onClose={() => setResult(null)}>
                                Submitted successfully
                            </Alert>
                        )}
                    </div>
                }
                code={`const [loading, setLoading] = useState(false);

<LoadingButton
    variant="primary"
    label="Submit form"
    loading={loading}
    onClick={async () => {
        setLoading(true);
        await submitForm();
        setLoading(false);
    }}
/>`}
            />

            <Section
                title={common.sections.variants}
                description={t.sections.variants.description}
                preview={
                    <div className="flex flex-wrap gap-2">
                        {VARIANTS.map((v) => (
                            <LoadingButton
                                key={v}
                                variant={v}
                                label={v}
                                onClick={async () => { await new Promise((r) => setTimeout(r, 1000)); }}
                            />
                        ))}
                    </div>
                }
                code={`<LoadingButton variant="success" label="Confirm" onClick={async () => { await confirm(); }} />
<LoadingButton variant="danger" label="Delete" onClick={async () => { await deleteRecord(); }} />`}
            />

            <PropDocsTable props={PROPS} />
        </PageLayout>
    );
}
