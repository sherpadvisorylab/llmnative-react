import React from 'react';
import { ActionButton } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';

const BUTTON_CLASSES = [
    'btn-primary',
    'btn-secondary',
    'btn-success',
    'btn-danger',
    'btn-warning',
    'btn-info',
    'btn-light',
    'btn-dark',
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-danger',
    'btn-outline-warning',
    'btn-outline-info',
    'btn-outline-light',
    'btn-outline-dark',
    'btn-link',
];
const PROPS: PropDef[] = [
    { name: 'icon', type: 'string', description: 'Icon name resolved by the active IconProvider', control: 'icon' },
    { name: 'label', type: 'string | ReactNode', description: 'Visible button label', control: 'text' },
    { name: 'badge', type: 'ReactNode | BadgeConfig', description: 'Optional badge rendered on the top-right corner', control: 'json', rows: 4, shortcuts: [
        { label: 'none', value: null, help: 'No badge.' },
        { label: 'count', value: { content: '3', type: 'danger' }, help: 'Numeric danger badge.' },
        { label: 'new', value: { content: 'new', type: 'primary' }, help: 'Text badge.' },
    ], typeDetails: `ReactNode | {
  content: ReactNode;
  type?: string;
}` },
    { name: 'title', type: 'string', description: 'Native button title attribute', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button', control: 'boolean' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the button', control: 'select', options: BUTTON_CLASSES },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'sm',
    props: PROPS,
    defaultProps: { label: 'Save', icon: 'save', badge: { content: '3', type: 'danger' }, title: 'Save changes', disabled: false, className: BUTTON_CLASSES[0] },
    render: (p) => (
        <ActionButton
            label={p.label}
            icon={typeof p.icon === 'string' ? p.icon : undefined}
            badge={p.badge || undefined}
            title={p.title || undefined}
            disabled={p.disabled}
            className={p.className || undefined}
        />
    ),
};

export default function ActionButtonPage() {
    usePlayground(PLAYGROUND, 'ActionButton');
    return (
        <PageLayout title="ActionButton" description="Immediate action button with icon, badge and press motion support.">
            <Section
                title="Common actions"
                preview={
                    <div className="flex flex-wrap gap-4 pt-3 pr-3">
                        <ActionButton className={BUTTON_CLASSES[0]} icon="save" label="Save" />
                        <ActionButton className="btn-outline-secondary" icon="settings" label="Settings" badge={{ content: '3', type: 'danger' }} />
                        <ActionButton className="btn-danger" icon="trash" title="Delete" />
                    </div>
                }
                code={`<ActionButton className="btn-primary" icon="save" label="Save" />`}
            />
            <PropDocsTable props={PROPS} />
        </PageLayout>
    );
}
