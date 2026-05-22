import React from 'react';
import { Badge } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const primaryButton = "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90";
const outlineButton = "inline-flex items-center justify-center rounded-md border border-secondary-foreground/30 bg-transparent px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary";

const TYPES = ['primary', 'info', 'success', 'warning', 'danger', 'secondary', 'light', 'dark'] as const;

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'string | ReactNode', required: true, description: 'Badge label for inline mode, or the wrapped React element for overlay mode', control: 'text' },
    { name: 'type', type: '"info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark"', default: '"info"', description: 'Color variant', control: 'select', options: ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'] },
    { name: 'pre', type: 'ReactNode', description: 'Inline: content before the badge. Overlay: badge label top-left', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Inline: content after the badge. Overlay: badge label top-right', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the badge span', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes applied to the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROPS_CONFIG,
    defaultProps: { children: 'Badge', type: 'primary', className: '', wrapClass: '', pre: '', post: '' },
    render: (p) => (
        <Badge
            type={p.type}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
            pre={p.pre || undefined}
            post={p.post || undefined}
        >
            {p.children}
        </Badge>
    ),
};

export default function BadgePage() {
    usePlayground(PLAYGROUND, 'Badge');

    return (
        <PageLayout
            title="Badge"
            description="Inline labels for status, counters and categories. When children is a React element, Badge enters overlay mode and positions indicators on that element."
        >
            <Section
                title="Color variants"
                description="Inline badges use text or inline React content as children."
                preview={
                    <div className="flex flex-wrap gap-2">
                        {TYPES.map((type) => (
                            <Badge key={type} type={type}>{type}</Badge>
                        ))}
                    </div>
                }
                code={`import { Badge } from 'react-firestrap';

<Badge type="primary">primary</Badge>
<Badge type="success">success</Badge>
<Badge type="warning">warning</Badge>
<Badge type="danger">danger</Badge>`}
            />

            <Section
                title="Overlay: post top-right"
                description="Pass a React element as children with post to show a badge top-right."
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge type="danger" post={5}>
                            <button className={primaryButton}>Messages</button>
                        </Badge>
                        <Badge type="warning" post={12}>
                            <button className={outlineButton}>Orders</button>
                        </Badge>
                        <Badge type="success" post={3}>
                            <button className={outlineButton}>Notifications</button>
                        </Badge>
                    </div>
                }
                code={`<Badge type="danger" post={5}>
    <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Messages</button>
</Badge>`}
            />

            <Section
                title="Overlay: pre top-left"
                description="Use pre instead to place the badge top-left."
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge type="danger" pre={5}>
                            <button className={primaryButton}>Messages</button>
                        </Badge>
                        <Badge type="info" pre="new">
                            <button className={outlineButton}>Updates</button>
                        </Badge>
                    </div>
                }
                code={`<Badge type="danger" pre={5}>
    <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Messages</button>
</Badge>`}
            />

            <Section
                title="Overlay: both corners"
                description="Both pre and post coexist: top-left and top-right simultaneously."
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge type="danger" pre={2} post={7}>
                            <button className={outlineButton}>Inbox</button>
                        </Badge>
                        <Badge type="warning" pre="!" post={99}>
                            <button className={outlineButton}>Alerts</button>
                        </Badge>
                    </div>
                }
                code={`<Badge type="danger" pre={2} post={7}>
    <button className="inline-flex items-center justify-center rounded-md border border-secondary-foreground/30 px-4 py-2 text-sm font-medium">Inbox</button>
</Badge>`}
            />

            <Section
                title="Overlay: dot"
                description="No pre or post renders a small dot indicator top-right."
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge type="danger">
                            <button className={outlineButton}>Messages</button>
                        </Badge>
                        <Badge type="success">
                            <button className={outlineButton}>Status</button>
                        </Badge>
                        <Badge type="warning">
                            <button className={outlineButton}>Alerts</button>
                        </Badge>
                    </div>
                }
                code={`<Badge type="danger">
    <button className="inline-flex items-center justify-center rounded-md border border-secondary-foreground/30 px-4 py-2 text-sm font-medium">Messages</button>
</Badge>`}
            />

            <Section
                title="Inline with pre/post"
                description="In inline mode, pre and post render outside the badge span."
                preview={
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span>Pending orders <Badge type="warning">12</Badge></span>
                        <span>Notifications <Badge type="danger">3</Badge></span>
                        <span><Badge type="info" pre="Status:" post="ok">active</Badge></span>
                    </div>
                }
                code={`<span>Pending orders <Badge type="warning">12</Badge></span>
<Badge type="info" pre="Status:" post="ok">active</Badge>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
