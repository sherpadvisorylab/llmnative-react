import React, { useState } from 'react';
import { ActionButton } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';
import { useShowcaseActionButtonI18n, useShowcaseCommonI18n } from '../../../showcase/i18n';

const VARIANTS = [
    'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
    'outline-primary', 'outline-secondary', 'outline-danger', 'outline-success',
] as const;

const PROPS: PropDef[] = [
    { name: 'label', type: 'string | ReactNode', description: 'Visible button label', control: 'text' },
    { name: 'icon', type: 'string', description: 'Icon name resolved by the active IconProvider', control: 'icon' },
    { name: 'variant', type: '"primary" | "secondary" | "danger" | "success" | "warning" | "info" | "light" | "dark" | "outline-*" | "link"', description: 'Semantic color variant (preferred over raw className)', control: 'select', options: [...VARIANTS, 'link'] },
    { name: 'className', type: 'string', description: 'Raw CSS class override (used when variant is omitted)', control: 'text' },
    { name: 'badge', type: 'ReactNode | BadgeDescriptor', description: 'Notification badge rendered top-right', control: 'json', rows: 3, shortcuts: [
        { label: 'none', value: null, help: 'No badge.' },
        { label: 'count', value: { content: '3', variant: 'danger' }, help: 'Numeric danger badge.' },
        { label: 'new', value: { content: 'new', variant: 'primary' }, help: 'Text badge.' },
    ]},
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button and shows a not-allowed cursor', control: 'boolean' },
    { name: 'onClick', type: '(e) => void', description: 'Synchronous click handler. Stops propagation automatically.' },
    { name: 'title', type: 'string', description: 'Native title attribute (tooltip)', control: 'text' },
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
    defaultProps: { label: 'Save', icon: 'save', variant: 'primary', badge: null, disabled: false, title: '', className: '' },
    render: (p) => (
        <ActionButton
            label={p.label || undefined}
            icon={typeof p.icon === 'string' ? p.icon : undefined}
            variant={p.variant || undefined}
            className={p.className || undefined}
            badge={p.badge || undefined}
            disabled={p.disabled}
            title={p.title || undefined}
        />
    ),
};

export default function ActionButtonPage() {
    usePlayground(PLAYGROUND, 'ActionButton');
    const common = useShowcaseCommonI18n();
    const t = useShowcaseActionButtonI18n();
    const [count, setCount] = useState(0);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={common.sections.variants}
                description={t.sections.variants.description}
                preview={
                    <div className="flex flex-wrap gap-2">
                        {VARIANTS.map((v) => (
                            <ActionButton key={v} variant={v} label={v} />
                        ))}
                    </div>
                }
                code={`<ActionButton variant="primary" label="Save" />
<ActionButton variant="danger" label="Delete" />
<ActionButton variant="outline-secondary" label="Cancel" />`}
            />

            <Section
                title={t.sections.iconLabel.title}
                description={t.sections.iconLabel.description}
                preview={
                    <div className="flex flex-wrap gap-3">
                        <ActionButton variant="primary" icon="save" label="Save" />
                        <ActionButton variant="outline-secondary" icon="settings" label="Settings" />
                        <ActionButton variant="danger" icon="trash" title="Delete record" />
                        <ActionButton variant="outline-secondary" icon="download" title="Download" />
                    </div>
                }
                code={`// Icon + label
<ActionButton variant="primary" icon="save" label="Save" />

// Icon only - always add title for screen readers
<ActionButton variant="danger" icon="trash" title="Delete record" />`}
            />

            <Section
                title={t.sections.onClick.title}
                description={t.sections.onClick.description}
                preview={
                    <div className="flex items-center gap-4">
                        <ActionButton
                            variant="primary"
                            icon="plus"
                            label="Increment"
                            onClick={() => setCount((c) => c + 1)}
                        />
                        <span className="text-sm text-muted-foreground">Clicked: <strong>{count}</strong></span>
                        <ActionButton
                            variant="outline-secondary"
                            icon="rotate-ccw"
                            label="Reset"
                            onClick={() => setCount(0)}
                        />
                    </div>
                }
                code={`const [count, setCount] = useState(0);

<ActionButton
    variant="primary"
    icon="plus"
    label="Increment"
    onClick={() => setCount((c) => c + 1)}
/>
<span>Clicked: {count}</span>`}
            />

            <Section
                title={t.sections.disabled.title}
                description={t.sections.disabled.description}
                preview={
                    <div className="flex flex-wrap gap-3">
                        <ActionButton variant="primary" icon="save" label="Save" disabled />
                        <ActionButton variant="danger" icon="trash" label="Delete" disabled />
                        <ActionButton variant="outline-secondary" icon="settings" label="Settings" disabled />
                    </div>
                }
                code={`<ActionButton variant="primary" icon="save" label="Save" disabled />`}
            />

            <Section
                title={t.sections.badge.title}
                description={t.sections.badge.description}
                preview={
                    <div className="flex flex-wrap gap-6">
                        <ActionButton variant="outline-secondary" icon="bell" label="Notifications" badge={{ content: 5, variant: 'danger' }} />
                        <ActionButton variant="outline-secondary" icon="message-circle" label="Messages" badge={{ content: 'new', variant: 'primary' }} />
                        <ActionButton variant="outline-secondary" icon="shopping-cart" label="Cart" badge={{ content: 3, variant: 'success' }} />
                    </div>
                }
                code={`<ActionButton
    variant="outline-secondary"
    icon="bell"
    label="Notifications"
    badge={{ content: 5, variant: 'danger' }}
/>`}
            />

            <PropDocsTable props={PROPS} />
        </PageLayout>
    );
}
