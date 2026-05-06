import React, { useState } from 'react';
import { Alert } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

const TYPES = ['info', 'success', 'warning', 'danger', 'primary', 'secondary'] as const;

export default function AlertPage() {
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
                code={`import { Alert } from 'react-firestrap';

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
                            <button className="btn btn-outline-primary" onClick={() => setVisible(true)}>
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
        </PageLayout>
    );
}
