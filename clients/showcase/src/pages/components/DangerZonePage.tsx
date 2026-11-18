import React from 'react';
import { DangerZone, Form, Input } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

// CR-142 — the danger zone of a record.

const DANGER_ZONE_PROPS: PropDef[] = [
    { name: 'actions', type: 'DangerZoneAction[]', description: 'The actions: `title`, `description`, `label`, `icon`, `variant` (`danger` or `secondary`), `confirm`, `onConfirm` (returning `false` keeps the confirmation open), `disabled`.' },
    { name: 'confirm', type: 'boolean | { title?, message?, key?, confirmLabel? }', default: 'true', description: '`false` runs at once; `true` asks yes or no; with `key` the person types the key (a button copies it) before the red button works.' },
    { name: 'title / description', type: 'ReactNode', default: 'dangerZone.title', description: 'The heading of the zone and a line under it.' },
];

const FORM_PROPS: PropDef[] = [
    { name: 'dangerZone', type: 'FormDangerZone', description: 'Set, it replaces the Delete button of the footer: the zone at the bottom of the form, the deletion first (same `onDelete` and path), then `actions`.' },
    { name: 'dangerZone.delete', type: 'false | { title?, description?, label?, key? }', description: 'The deletion: its texts and the key to type (a string or `(record) => string`; default the key of the record). `false`: no deletion.' },
    { name: 'dangerZone.actions', type: 'DangerZoneAction[] | ({ record }) => DangerZoneAction[]', description: 'The other actions, after the deletion.' },
];

function Demo() {
    return (
        <div className="w-full max-w-2xl">
            <DangerZone
                description="What these actions do reaches the people who work with this Partner."
                actions={[
                    { id: 'disable', title: 'Disable the Partner', description: 'It no longer works new cases; its cases stay.', label: 'Disable', icon: 'ban', onConfirm: () => undefined },
                    { id: 'delete', title: 'Delete the Partner', description: 'It is removed for good: it cannot be undone.', label: 'Delete', icon: 'trash-2', confirm: { key: 'Leasing Nord Spa' }, onConfirm: () => undefined },
                ]}
            />
        </div>
    );
}

function FormDemo() {
    return (
        <div className="w-full max-w-2xl">
            <Form
                defaultValues={{ _key: 'partner_1', name: 'Leasing Nord Spa' }}
                onDelete={async () => undefined}
                dangerZone={{
                    delete: { key: (record) => String(record.name) },
                    actions: [{ id: 'block', title: 'Block access', description: 'Its people can no longer sign in.', label: 'Block', icon: 'lock', onConfirm: () => undefined }],
                }}
            >
                <Input name="name" label="Name" />
            </Form>
        </div>
    );
}

export default function DangerZonePage() {
    return (
        <PageLayout
            title="DangerZone"
            description="The destructive actions of a record, at the bottom of its page and apart: each says what it does and asks its confirmation; what cannot be undone asks to type a key."
        >
            <Section
                title="A danger zone"
                description="Disable asks yes or no; Delete asks to type the name of the record, which a button copies."
                preview={<Demo />}
                code={`import { DangerZone } from '@llmnative/react';

<DangerZone actions={[
    { title: 'Disable the Partner', label: 'Disable', icon: 'ban', onConfirm: disable },
    { title: 'Delete the Partner', label: 'Delete', icon: 'trash-2', confirm: { key: partner.name }, onConfirm: remove },
]} />`}
            />
            <Section
                title="In a Form, in place of the Delete button"
                description="One prop: `dangerZone`. The Delete button leaves the footer; the deletion becomes the first action of the zone, then yours."
                preview={<FormDemo />}
                code={`<Form path={\`partners/\${id}\`} dangerZone={{
    delete: { key: (record) => record.name },
    actions: [{ title: 'Block access', label: 'Block', icon: 'lock', onConfirm: block }],
}}>
    <Input name="name" label="Name" />
</Form>`}
            />
            <PropDocsTable props={DANGER_ZONE_PROPS} title="DangerZone props" />
            <PropDocsTable props={FORM_PROPS} title="Form props" />
        </PageLayout>
    );
}
