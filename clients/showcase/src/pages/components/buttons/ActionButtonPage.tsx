import React from 'react';
import { ActionButton } from 'react-firestrap';
import PageLayout from '../../../components/PageLayout';
import Section from '../../../components/Section';
import PropsTable from '../../../components/PropsTable';
import { usePlayground } from '../../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../../types/playground';

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
const BADGE_TYPES = ['info', 'success', 'warning', 'danger', 'primary', 'secondary', 'light', 'dark'];

const PROPS: PropDef[] = [
    { name: 'icon', type: 'string', description: 'Icon name resolved by the active IconProvider', control: 'icon' },
    { name: 'label', type: 'string | ReactNode', description: 'Visible button label', control: 'text' },
    { name: 'badge', type: 'string', description: 'Optional badge content rendered on the top-right corner', control: 'text' },
    { name: 'title', type: 'string', description: 'Native button title attribute', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button', control: 'boolean' },
    { name: 'badgeType', type: 'BadgeType', description: 'Color variant for the optional badge', control: 'select', options: BADGE_TYPES },
    { name: 'className', type: 'string', description: 'CSS classes applied to the button', control: 'select', options: BUTTON_CLASSES },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'sm',
    props: PROPS,
    defaultProps: { label: 'Save', icon: 'save', badge: '', title: 'Save changes', disabled: false, badgeType: 'danger', className: BUTTON_CLASSES[0] },
    render: (p) => (
        <ActionButton
            label={p.label}
            icon={typeof p.icon === 'string' ? p.icon : undefined}
            badge={p.badge || undefined}
            title={p.title || undefined}
            disabled={p.disabled}
            badgeType={p.badgeType || undefined}
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
                        <ActionButton className="btn-outline-secondary" icon="settings" label="Settings" badge="3" badgeType="danger" />
                        <ActionButton className="btn-danger" icon="trash" title="Delete" />
                    </div>
                }
                code={`<ActionButton className="btn-primary" icon="save" label="Save" />`}
            />
            <PropsTable props={PROPS} />
        </PageLayout>
    );
}
