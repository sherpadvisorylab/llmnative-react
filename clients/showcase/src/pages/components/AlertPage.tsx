import React, { useState } from 'react';
import { Alert } from '@ash/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const TYPES = ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'] as const;

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'string | ReactNode', required: true, description: 'Alert message content', control: 'text' },
    { name: 'type', type: '"info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark"', default: '"info"', description: 'Color variant', control: 'select', options: ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'] },
    { name: 'icon', type: 'string | boolean', default: 'true', description: 'true = auto icon per type, false = none, or any icon name from the provider', control: 'icon' },
    { name: 'isFixed', type: '"top" | "bottom"', description: 'Pin to top or bottom of viewport via portal (renders outside preview)', control: 'select', options: ['', 'top', 'bottom'] },
    { name: 'timeout', type: 'number', description: 'Auto-dismiss after N milliseconds', control: 'number', min: 0, step: 500 },
    { name: 'onClose', type: '() => void', description: 'Callback when alert is closed' },
    { name: 'className', type: 'string', description: 'Additional CSS classes', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the alert', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the alert', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'sm',
    props: PROPS_CONFIG,
    defaultProps: {
        type: 'info',
        icon: true,
        children: 'This is an alert message.',
        isFixed: '',
        timeout: 0,
        className: '',
        wrapClass: '',
        pre: '',
        post: '',
    },
    render: (p) => (
        <Alert
            type={p.type || 'info'}
            icon={p.icon}
            isFixed={p.isFixed || undefined}
            timeout={p.timeout || undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
            pre={p.pre || undefined}
            post={p.post || undefined}
        >
            {p.children}
        </Alert>
    ),
};

export default function AlertPage() {
    usePlayground(PLAYGROUND, 'Alert');
    const [visible, setVisible] = useState(true);

    return (
        <PageLayout
            title="Alert"
            description="Contextual feedback messages for the user. Supports icons, auto-dismiss timeout and fixed positioning."
        >
            <Section
                title="Variants"
                description="Each type has preset colors and an icon."
                preview={
                    <div className="flex flex-col gap-2 w-full">
                        {TYPES.map((type) => (
                            <Alert key={type} type={type}>
                                Alert of type <strong>{type}</strong>
                            </Alert>
                        ))}
                    </div>
                }
                code={`import { Alert } from '@ash/react';

<Alert type="info">Informational message</Alert>
<Alert type="success">Operation completed successfully</Alert>
<Alert type="warning">Warning: please review your input</Alert>
<Alert type="danger">A critical error occurred</Alert>`}
            />

            <Section
                title="Without icon"
                preview={<Alert type="info" icon={false}>Alert without icon</Alert>}
                code={`<Alert type="info" icon={false}>Alert without icon</Alert>`}
            />

            <Section
                title="Auto-dismiss"
                description="The alert closes automatically after the specified timeout (ms)."
                preview={
                    <div className="flex flex-col gap-2 w-full">
                        {visible ? (
                            <Alert type="success" timeout={3000} onClose={() => setVisible(false)}>
                                This alert dismisses after 3 seconds
                            </Alert>
                        ) : (
                            <button className="inline-flex items-center justify-center rounded-md border border-primary bg-transparent px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setVisible(true)}>
                                Show again
                            </button>
                        )}
                    </div>
                }
                code={`const [visible, setVisible] = useState(true);

{visible && (
    <Alert type="success" timeout={3000} onClose={() => setVisible(false)}>
        This alert dismisses after 3 seconds
    </Alert>
)}`}
            />

            <Section
                title="Fixed positioning"
                description="Use isFixed to pin the alert to the top or bottom of the viewport via a React portal."
                preview={
                    <Alert type="warning" icon={false}>
                        <code className="font-mono">isFixed="top"</code> or{' '}
                        <code className="font-mono">isFixed="bottom"</code> renders into{' '}
                        <code className="font-mono">document.body</code> via a portal.
                    </Alert>
                }
                code={`<Alert type="warning" isFixed="top">
    This appears pinned at the top of the viewport
</Alert>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}
