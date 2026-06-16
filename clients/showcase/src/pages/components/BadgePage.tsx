import React from 'react';
import { Badge } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { useShowcaseBadgeI18n } from '../../showcase/i18n';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const primaryButton = "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90";
const outlineButton = "inline-flex items-center justify-center rounded-md border border-secondary-foreground/30 bg-transparent px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary";

const TYPES = ['primary', 'info', 'success', 'warning', 'danger', 'secondary', 'light', 'dark'] as const;

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'string | ReactNode', required: true, description: 'Badge label for inline mode, or the wrapped React element for overlay mode', control: 'text' },
    { name: 'variant', type: '"info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark"', default: '"info"', description: 'Color variant', control: 'select', options: ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'] },
    { name: 'before', type: 'ReactNode', description: 'Inline: content before the badge. Overlay: badge label top-left', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Inline: content after the badge. Overlay: badge label top-right', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the badge span', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes applied to the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROPS_CONFIG,
    defaultProps: { children: 'Badge', variant: 'primary', className: '', wrapperClassName: '', before: '', after: '' },
    render: (p) => (
        <Badge
            variant={p.variant}
            className={p.className || undefined}
            wrapperClassName={p.wrapperClassName || undefined}
            before={p.before || undefined}
            after={p.after || undefined}
        >
            {p.children}
        </Badge>
    ),
};

export default function BadgePage() {
    usePlayground(PLAYGROUND, 'Badge');
    const t = useShowcaseBadgeI18n();

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.colorVariants.title}
                description={t.sections.colorVariants.description}
                preview={
                    <div className="flex flex-wrap gap-2">
                        {TYPES.map((type) => (
                            <Badge key={type} variant={type}>{type}</Badge>
                        ))}
                    </div>
                }
                code={`import { Badge } from '@llmnative/react';

<Badge variant="primary">primary</Badge>
<Badge variant="success">success</Badge>
<Badge variant="warning">warning</Badge>
<Badge variant="danger">danger</Badge>`}
            />

            <Section
                title={t.sections.overlayAfter.title}
                description={t.sections.overlayAfter.description}
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge variant="danger" after={5}>
                            <button className={primaryButton}>Messages</button>
                        </Badge>
                        <Badge variant="warning" after={12}>
                            <button className={outlineButton}>Orders</button>
                        </Badge>
                        <Badge variant="success" after={3}>
                            <button className={outlineButton}>Notifications</button>
                        </Badge>
                    </div>
                }
                code={`<Badge variant="danger" after={5}>
    <button className="btn btn-primary">Messages</button>
</Badge>`}
            />

            <Section
                title={t.sections.overlayBefore.title}
                description={t.sections.overlayBefore.description}
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge variant="danger" before={5}>
                            <button className={primaryButton}>Messages</button>
                        </Badge>
                        <Badge variant="info" before="new">
                            <button className={outlineButton}>Updates</button>
                        </Badge>
                    </div>
                }
                code={`<Badge variant="danger" before={5}>
    <button className="btn btn-primary">Messages</button>
</Badge>`}
            />

            <Section
                title={t.sections.overlayBoth.title}
                description={t.sections.overlayBoth.description}
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge variant="danger" before={2} after={7}>
                            <button className={outlineButton}>Inbox</button>
                        </Badge>
                        <Badge variant="warning" before="!" after={99}>
                            <button className={outlineButton}>Alerts</button>
                        </Badge>
                    </div>
                }
                code={`<Badge variant="danger" before={2} after={7}>
    <button className="btn btn-outline-secondary">Inbox</button>
</Badge>`}
            />

            <Section
                title={t.sections.overlayDot.title}
                description={t.sections.overlayDot.description}
                preview={
                    <div className="flex flex-wrap items-center gap-10">
                        <Badge variant="danger">
                            <button className={outlineButton}>Messages</button>
                        </Badge>
                        <Badge variant="success">
                            <button className={outlineButton}>Status</button>
                        </Badge>
                        <Badge variant="warning">
                            <button className={outlineButton}>Alerts</button>
                        </Badge>
                    </div>
                }
                code={`<Badge variant="danger">
    <button className="btn btn-outline-secondary">Messages</button>
</Badge>`}
            />

            <Section
                title={t.sections.inlineMode.title}
                description={t.sections.inlineMode.description}
                preview={
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span>Pending orders <Badge variant="warning">12</Badge></span>
                        <span>Notifications <Badge variant="danger">3</Badge></span>
                        <span><Badge variant="info" before="Status:" after="ok">active</Badge></span>
                    </div>
                }
                code={`<span>Pending orders <Badge variant="warning">12</Badge></span>
<Badge variant="info" before="Status:" after="ok">active</Badge>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
