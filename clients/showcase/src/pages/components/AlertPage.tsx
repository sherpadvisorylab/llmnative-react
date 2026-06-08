import React, { useState } from 'react';
import { Alert } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const TYPES = ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'] as const;

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'string | ReactNode', required: true, description: 'Alert message content', control: 'text' },
    { name: 'type', type: '"info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark"', default: '"info"', description: 'Color variant', control: 'select', options: ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'] },
    { name: 'appearance', type: '"default" | "text"', default: '"default"', description: 'default = full box with background and border · text = borderless, no background, width fits content', control: 'select', options: ['default', 'text'] },
    { name: 'icon', type: 'string | boolean', default: 'true', description: 'true = auto icon per type, false = none, or any icon name from the provider', control: 'icon' },
    { name: 'placement', type: '"inline" | "fixed"', default: '"inline"', description: 'inline = renders in place (default) · fixed = viewport-pinned via portal above all content', control: 'select', options: ['inline', 'fixed'] },
    { name: 'timeout', type: 'number', description: 'Auto-dismiss after N milliseconds', control: 'number', min: 0, step: 500 },
    { name: 'onClose', type: '() => void', description: 'Callback when alert is closed' },
    { name: 'className', type: 'string', description: 'Additional CSS classes', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the alert', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the alert', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: {
        type: 'info',
        appearance: 'default',
        icon: true,
        children: 'This is an alert message.',
        placement: 'inline',
        timeout: 0,
        className: '',
        wrapClass: '',
        pre: '',
        post: '',
    },
    render: (p) => (
        <Alert
            type={p.type || 'info'}
            appearance={p.appearance === 'text' ? 'text' : undefined}
            icon={p.icon}
            placement={p.placement === 'inline' ? undefined : p.placement}
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
                code={`import { Alert } from '@llmnative/react';

<Alert type="info">Informational message</Alert>
<Alert type="success">Operation completed successfully</Alert>
<Alert type="warning">Warning: please review your input</Alert>
<Alert type="danger">A critical error occurred</Alert>`}
            />

            <Section
                title="Appearance"
                description="appearance=&quot;text&quot; renders a compact inline indicator - no background, no border, width fits content. Ideal for status feedback next to buttons."
                preview={
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex flex-col gap-2">
                            {(['success', 'danger', 'warning', 'info'] as const).map(t => (
                                <Alert key={t} type={t} appearance="text">{t.charAt(0).toUpperCase() + t.slice(1)} - text appearance</Alert>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <Alert type="success" appearance="text">Saved</Alert>
                            <button className="btn btn-primary">Save</button>
                        </div>
                    </div>
                }
                code={`// Compact inline status - next to a save button
<Alert type="success" appearance="text" timeout={3000} onClose={() => setVisible(false)}>
    Saved
</Alert>
<button className="btn btn-primary">Save</button>`}
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
                title="Placement modes"
                description="placement controls where the alert renders: inline (default, in normal document flow) or fixed (viewport-pinned via portal above all content)."
                preview={
                    <div className="space-y-3">
                        <Alert type="info" icon={false}>
                            <code className="font-mono">placement="inline"</code> - renders where declared (default)
                        </Alert>
                        <Alert type="warning" icon={false}>
                            <code className="font-mono">placement="fixed"</code> - portal to body, try it from the playground above
                        </Alert>
                    </div>
                }
                code={`// Renders in document flow (default)
<Alert type="info">Inline alert</Alert>

// Viewport-pinned above everything - ideal for global toasts
<Alert type="success" placement="fixed" onClose={() => setVisible(false)}>
    Saved successfully
</Alert>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}
