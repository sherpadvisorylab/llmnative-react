import React, { useState } from 'react';
import { LoadingButton, Alert } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';

const VARIANTS = [
    'primary', 'secondary', 'success', 'danger', 'warning', 'info',
    'outline-primary', 'outline-secondary',
] as const;

const PROPS: PropDef[] = [
    { name: 'label', type: 'string | ReactNode', description: 'Visible label while idle', control: 'text' },
    { name: 'icon', type: 'string', description: 'Icon shown while idle', control: 'icon' },
    { name: 'onClick', type: '(e, setMessage?) => Promise<unknown>', description: 'Async handler. Button disables itself until the promise resolves. Use setMessage to update the label mid-flight.' },
    { name: 'loadingLabel', type: 'string | ReactNode', description: 'Label shown while loading. Defaults to label + "…"', control: 'text' },
    { name: 'showLoader', type: 'boolean', default: 'false', description: 'Controlled loading state from outside (e.g. form submit in progress)', control: 'boolean' },
    { name: 'variant', type: '"primary" | "secondary" | … | "outline-*"', description: 'Semantic color variant', control: 'select', options: [...VARIANTS] },
    { name: 'className', type: 'string', description: 'Raw CSS class override', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button permanently (regardless of loading)', control: 'boolean' },
    { name: 'badge', type: 'ReactNode | BadgeDescriptor', description: 'Badge shown while idle (hidden during loading)', control: 'json' },
    { name: 'title', type: 'string', description: 'Native title attribute', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS,
    defaultProps: { label: 'Save', icon: 'save', loadingLabel: '', showLoader: false, disabled: false, variant: 'primary', className: '', title: '', badge: null },
    render: (p) => (
        <LoadingButton
            label={p.label || undefined}
            icon={typeof p.icon === 'string' ? p.icon : undefined}
            variant={p.variant || undefined}
            className={p.className || undefined}
            loadingLabel={p.loadingLabel || undefined}
            showLoader={p.showLoader}
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
    const [result, setResult] = useState<string | null>(null);

    return (
        <PageLayout
            title="LoadingButton"
            description="Async button that disables itself while work is pending. Supports streaming label updates mid-flight via setMessage."
        >
            <Section
                title="Async save"
                description="Pass an async onClick. The button spins and blocks re-click until the promise resolves."
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
                title="Custom loading label"
                description="loadingLabel replaces the default 'Save…' while the spinner is active."
                preview={
                    <div className="flex flex-wrap gap-3">
                        <LoadingButton
                            variant="primary"
                            icon="upload"
                            label="Upload"
                            loadingLabel="Uploading…"
                            onClick={async () => { await new Promise((r) => setTimeout(r, 2000)); }}
                        />
                        <LoadingButton
                            variant="outline-secondary"
                            icon="refresh-cw"
                            label="Sync"
                            loadingLabel="Syncing data…"
                            onClick={async () => { await new Promise((r) => setTimeout(r, 2000)); }}
                        />
                    </div>
                }
                code={`<LoadingButton
    variant="primary"
    icon="upload"
    label="Upload"
    loadingLabel="Uploading…"
    onClick={async () => { await uploadFile(); }}
/>`}
            />

            <Section
                title="Streaming label via setMessage"
                description="The second argument of onClick is setMessage — call it any time during the async work to update the loading label live. Useful for multi-step operations."
                preview={
                    <LoadingButton
                        variant="primary"
                        icon="zap"
                        label="Run pipeline"
                        onClick={async (_e, setMessage) => {
                            setMessage?.({ message: 'Step 1 of 3…' });
                            await new Promise((r) => setTimeout(r, 900));
                            setMessage?.({ message: 'Step 2 of 3…' });
                            await new Promise((r) => setTimeout(r, 900));
                            setMessage?.({ message: 'Finishing…' });
                            await new Promise((r) => setTimeout(r, 600));
                        }}
                    />
                }
                code={`<LoadingButton
    variant="primary"
    icon="zap"
    label="Run pipeline"
    onClick={async (_e, setMessage) => {
        setMessage?.({ message: 'Step 1 of 3…' });
        await runStep1();
        setMessage?.({ message: 'Step 2 of 3…' });
        await runStep2();
        setMessage?.({ message: 'Finishing…' });
        await runStep3();
    }}
/>`}
            />

            <Section
                title="Disabled state"
                description="disabled keeps the button permanently inactive regardless of the loading cycle."
                preview={
                    <div className="flex flex-wrap gap-3">
                        <LoadingButton variant="primary" icon="save" label="Save" disabled />
                        <LoadingButton variant="outline-secondary" icon="send" label="Send" disabled />
                    </div>
                }
                code={`<LoadingButton variant="primary" icon="save" label="Save" disabled />`}
            />

            <Section
                title="Controlled loading (showLoader)"
                description="showLoader lets a parent component control the loading state externally — useful when the button is part of a larger form submit flow."
                preview={
                    <div className="flex items-center gap-4">
                        <LoadingButton
                            variant="primary"
                            icon="send"
                            label="Submit form"
                            showLoader={result === 'loading'}
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
    showLoader={loading}
    onClick={async () => {
        setLoading(true);
        await submitForm();
        setLoading(false);
    }}
/>`}
            />

            <Section
                title="Color variants"
                description="LoadingButton supports the same variant tokens as ActionButton."
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
