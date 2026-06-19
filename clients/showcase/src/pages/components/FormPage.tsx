import React, { useRef } from 'react';
import { Form, Input, Select, TextArea, MockDataProvider, DataProvider } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseFormI18n } from '../../showcase/i18n';

const ROLES = [
    { label: 'Admin',  value: 'admin'  },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];

const STATUS = [
    { label: 'Active',   value: 'active'   },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending',  value: 'pending'  },
];

const USERS_SEED = {
    user_1: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin',
        status: 'active',
        bio: 'Platform admin and early adopter.',
    },
};

const mockProvider = new MockDataProvider({ '/users': USERS_SEED });

function WithMock({ children }: { children: React.ReactNode }) {
    return (
        <DataProvider registry={{ default: mockProvider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

const FORM_PROPS: PropDef[] = [
    { name: 'path', type: 'string', description: 'Collection path (e.g. /users). Appended with record._key on save.', control: 'text' },
    { name: 'defaultValues', type: 'object', description: 'Initial field values. Include _key to signal edit mode (isNewRecord = false → Save + Delete shown).' },
    { name: 'appearance', type: '"card" | "empty"', default: '"empty"', description: 'Visual wrapper style', control: 'select', options: ['card', 'empty'] },
    { name: 'showBack', type: 'boolean', default: 'false', description: 'Show a back navigation button', control: 'boolean' },
    { name: 'keyGenerator', type: '(record) => string', description: 'Custom primary key generator for new records. Presence forces create mode (no DB read).' },
    { name: 'onLoad', type: '(record: RecordProps) => void', description: 'Called after the record is loaded. Use it to trigger side effects; return value is not used.' },
    {
        name: 'onSave',
        type: 'FormSaveHandler',
        description: 'Transform record before saving or override the write path.',
        shape: `type FormSaveHandler = (
  args: FormSaveArgs
) => Promise<string | undefined>

type FormSaveArgs = {
  record?: RecordProps;
  prevRecord?: RecordProps;
  storagePath?: string;
  action: "create" | "update";
}`,
    },
    {
        name: 'onDelete',
        type: 'FormDeleteHandler',
        description: 'Hook called before deletion.',
        shape: `type FormDeleteHandler = (
  args: FormDeleteArgs
) => Promise<string | undefined>

type FormDeleteArgs = {
  record?: RecordProps;
}`,
    },
    {
        name: 'onComplete',
        type: 'FormCompleteHandler',
        description: 'Called after save or delete. Return true to close modal, false to stay.',
        shape: `type FormCompleteHandler = (
  args: FormCompleteArgs
) => Promise<boolean>

type FormCompleteArgs = {
  record?: RecordProps;
  action: "create" | "update" | "delete";
}`,
    },
    { name: 'onRecordChange', type: '(record: RecordProps) => void', description: 'Called on every field change with the current record state.' },
    { name: 'header', type: 'React.ReactNode', description: 'Custom content rendered in the form header area.' },
    { name: 'footer', type: 'React.ReactNode', description: 'Custom content rendered in the form footer area.' },
    { name: 'handlers', type: 'Partial<FormRef>', description: 'Expose internal save/delete handles to a parent ref, allowing external components to trigger form actions.' },
    { name: 'log', type: 'boolean', default: 'false', description: 'Log field-change events to the console (dev helper).', control: 'boolean' },
    { name: 'showNotice', type: 'boolean', default: 'true', description: 'Show the inline save/delete notice banner.', control: 'boolean' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outermost wrapper element.', control: 'text' },
    { name: 'headerClassName', type: 'string', description: 'CSS classes on the header container.', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the form body element.', control: 'text' },
    { name: 'footerClassName', type: 'string', description: 'CSS classes on the footer container.', control: 'text' },
];

const PLAYGROUND_SEED = { '/users': USERS_SEED };

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: FORM_PROPS,
    defaultProps: {
        path: '/users/user_1',
        appearance: 'card',
        showBack: false,
    },
    mockSeed: PLAYGROUND_SEED,
    render: (p) => (
        <div className="w-full max-w-lg">
            <Form
                path={p.path || '/users/user_1'}
                appearance={p.appearance}
                showBack={p.showBack}
                onComplete={async () => false}
            >
                <Input name="name"  label="Full name" required />
                <Input name="email" label="Email" type="email" />
                <Select name="role"   label="Role"   options={ROLES} />
                <Select name="status" label="Status" options={STATUS} />
                <TextArea name="bio" label="Bio" minHeight={96} />
            </Form>
        </div>
    ),
};

export default function FormPage() {
    usePlayground(PLAYGROUND, 'Form');
    const t = useShowcaseFormI18n();

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            {/* ── New record ── */}
            <Section
                title={t.sections.newRecord.title}
                description={t.sections.newRecord.description}
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                path="/users"
                                defaultValues={{ role: 'viewer', status: 'active' }}
                                appearance="card"
                                keyGenerator={() => `user_${Date.now()}`}
                                onComplete={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="name"  label="Full name" required />
                                <Input name="email" label="Email" type="email" required />
                                <Select name="role"   label="Role"   options={ROLES}   />
                                <Select name="status" label="Status" options={STATUS}  />
                                <TextArea name="bio" label="Bio" minHeight={96} />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`import { MockDataProvider, DataProvider, Form, Input, Select, TextArea } from '@llmnative/react';

const mockProvider = new MockDataProvider();

<DataProvider registry={{ default: mockProvider }} defaultKey="default">
    <Form
        path="/users"
        defaultValues={{ role: 'viewer', status: 'active' }}
        appearance="card"
        keyGenerator={() => \`user_\${Date.now()}\`}
    >
        <Input   name="name"   label="Full name" required />
        <Input   name="email"  label="Email" type="email" required />
        <Select  name="role"   label="Role"   options={ROLES}   />
        <Select  name="status" label="Status" options={STATUS}  />
        <TextArea name="bio"   label="Bio" minHeight={96} />
    </Form>
</DataProvider>`}
            />

            {/* ── Edit existing record ── */}
            <Section
                title={t.sections.editExisting.title}
                description={t.sections.editExisting.description}
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                path="/users/user_1"
                                appearance="card"
                                onComplete={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="name"  label="Full name" required />
                                <Input name="email" label="Email" type="email" />
                                <Select name="role"   label="Role"   options={ROLES}   />
                                <Select name="status" label="Status" options={STATUS}  />
                                <TextArea name="bio" label="Bio" minHeight={96} />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`// path="/users/user_1" → reads /users/user_1, saves back to same path
<Form path="/users/user_1" appearance="card">
    <Input  name="name"   label="Full name" required />
    <Input  name="email"  label="Email" type="email" />
    <Select name="role"   label="Role"   options={ROLES}  />
    <Select name="status" label="Status" options={STATUS} />
</Form>`}
            />

            {/* ── Lifecycle hooks ── */}
            <Section
                title={t.sections.lifecycleHooks.title}
                description={t.sections.lifecycleHooks.description}
                preview={
                    <div className="text-sm text-muted-foreground italic p-4">
                        {t.sections.lifecycleHooksNote}
                    </div>
                }
                code={`<Form
    path="/products/prod_1"
    // prices stored as cents in DB, displayed as euros
    onLoad={(data) => ({ ...data, price: data.price / 100 })}
    onSave={async ({ record }) => ({ ...record, price: record.price * 100 })}
    onComplete={async ({ action }) => {
        if (action === 'save') navigate('/products');
        return true; // true = close modal / navigate
    }}
>
    <Input name="title" label="Title" required />
    <Input name="price" label="Price (€)" type="number" />
</Form>`}
            />

            {/* ── Nested fields ── */}
            <Section
                title={t.sections.nestedObjects.title}
                description={t.sections.nestedObjects.description}
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                appearance="card"
                                onComplete={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="address.city"   label="City"    />
                                <Input name="address.zip"    label="ZIP"     />
                                <Input name="address.country" label="Country" />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`// dot notation → stored as { address: { city, zip, country } }
<Form>
    <Input name="address.city"    label="City"    />
    <Input name="address.zip"     label="ZIP"     />
    <Input name="address.country" label="Country" />
</Form>`}
            />

            <PropDocsTable props={FORM_PROPS} />

        </PageLayout>
    );
}
