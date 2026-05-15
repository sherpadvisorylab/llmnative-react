import React from 'react';
import { LoadingButton } from 'react-firestrap';
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
const PROPS: PropDef[] = [
    { name: 'icon', type: 'string', description: 'Icon name shown while idle', control: 'icon' },
    { name: 'label', type: 'string | ReactNode', description: 'Visible button label', control: 'text' },
    { name: 'badge', type: 'ReactNode | { content; type? }', description: 'Optional badge rendered while idle', control: 'json' },
    { name: 'title', type: 'string', description: 'Native button title attribute', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button', control: 'boolean' },
    { name: 'showLoader', type: 'boolean', default: 'false', description: 'Controlled loading state from outside the component', control: 'boolean' },
    { name: 'loadingLabel', type: 'string | ReactNode', description: 'Optional label used while loading. Defaults to label + "...".', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the button', control: 'select', options: BUTTON_CLASSES },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'sm',
    props: PROPS,
    defaultProps: { label: 'Save', icon: 'save', badge: { content: '3', type: 'danger' }, title: 'Save changes', disabled: false, showLoader: false, loadingLabel: '', className: BUTTON_CLASSES[0] },
    render: (p) => (
        <LoadingButton
            label={p.label}
            icon={typeof p.icon === 'string' ? p.icon : undefined}
            badge={p.badge || undefined}
            title={p.title || undefined}
            disabled={p.disabled}
            showLoader={p.showLoader}
            loadingLabel={p.loadingLabel || undefined}
            className={p.className || undefined}
            onClick={async (_e, setMessage) => {
                await new Promise((r) => setTimeout(r, 1200));
            }}
        />
    ),
};

export default function LoadingButtonPage() {
    usePlayground(PLAYGROUND, 'LoadingButton');
    return (
        <PageLayout title="LoadingButton" description="Async button that disables itself while work is pending.">
            <Section
                title="Async save"
                preview={<div className="pt-3 pr-3"><LoadingButton className={BUTTON_CLASSES[0]} icon="save" label="Save" onClick={async () => { await new Promise((r) => setTimeout(r, 1500)); }} /></div>}
                code={`<LoadingButton
  className="btn-primary"
  icon="save"
  label="Save"
  onClick={async () => {
    await saveData();
  }}
/>`}
            />
            <PropsTable props={PROPS} />
        </PageLayout>
    );
}
