import React, { useRef } from 'react';
import { Form, Input, Select, TextArea, MockDataProvider, DataProvider } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

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
    { name: 'aspect', type: '"card" | "none"', default: '"none"', description: 'Visual wrapper style', control: 'select', options: ['none', 'card'] },
    { name: 'showBack', type: 'boolean', default: 'false', description: 'Show a back navigation button', control: 'boolean' },
    { name: 'keyGenerator', type: '(record) => string', description: 'Custom primary key generator for new records. Presence forces create mode (no DB read).' },
    { name: 'onLoad', type: '(data: object) => object', description: 'Transform record data after loading (e.g. unit conversions)' },
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
        name: 'onFinally',
        type: 'FormFinallyHandler',
        description: 'Called after save or delete. Return true to close modal, false to stay.',
        shape: `type FormFinallyHandler = (
  args: FormFinallyArgs
) => Promise<boolean>

type FormFinallyArgs = {
  record?: RecordProps;
  action: "create" | "update" | "delete";
}`,
    },
];

const PLAYGROUND_SEED = { '/users': USERS_SEED };

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: FORM_PROPS,
    defaultProps: {
        path: '/users/user_1',
        aspect: 'card',
        showBack: false,
    },
    mockSeed: PLAYGROUND_SEED,
    render: (p) => (
        <div className="w-full max-w-lg">
            <Form
                path={p.path || '/users/user_1'}
                aspect={p.aspect}
                showBack={p.showBack}
                onFinally={async () => false}
            >
                <Input name="name"  label="Full name" required />
                <Input name="email" label="Email" type="email" />
                <Select name="role"   label="Role"   options={ROLES} />
                <Select name="status" label="Status" options={STATUS} />
                <TextArea name="bio" label="Bio" rows={3} />
            </Form>
        </div>
    ),
};

export default function FormPage() {
    usePlayground(PLAYGROUND, 'Form');

    return (
        <PageLayout
            title="Form widget"
            description="Full CRUD form: loads a record from the DataProvider, validates, saves and optionally deletes. Wrap fields as children — the Form wires everything automatically via React context."
        >
            {/* ── New record ── */}
            <Section
                title="New record (keyGenerator)"
                description="Pass path (collection) + keyGenerator to create a new record. No DB read is performed. Save calls set() at path/generatedKey."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                path="/users"
                                defaultValues={{ role: 'viewer', status: 'active' }}
                                aspect="card"
                                keyGenerator={() => `user_${Date.now()}`}
                                onFinally={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="name"  label="Full name" required />
                                <Input name="email" label="Email" type="email" required />
                                <Select name="role"   label="Role"   options={ROLES}   />
                                <Select name="status" label="Status" options={STATUS}  />
                                <TextArea name="bio" label="Bio" rows={3} />
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
        aspect="card"
        keyGenerator={() => \`user_\${Date.now()}\`}
    >
        <Input   name="name"   label="Full name" required />
        <Input   name="email"  label="Email" type="email" required />
        <Select  name="role"   label="Role"   options={ROLES}   />
        <Select  name="status" label="Status" options={STATUS}  />
        <TextArea name="bio"   label="Bio" rows={3} />
    </Form>
</DataProvider>`}
            />

            {/* ── Edit existing record ── */}
            <Section
                title="Edit existing record"
                description="Pass path (full record path including key) with no defaultValues. The Form reads the record on mount, pre-fills the fields, and saves back to the same path."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                path="/users/user_1"
                                aspect="card"
                                onFinally={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="name"  label="Full name" required />
                                <Input name="email" label="Email" type="email" />
                                <Select name="role"   label="Role"   options={ROLES}   />
                                <Select name="status" label="Status" options={STATUS}  />
                                <TextArea name="bio" label="Bio" rows={3} />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`// path="/users/user_1" → reads /users/user_1, saves back to same path
<Form path="/users/user_1" aspect="card">
    <Input  name="name"   label="Full name" required />
    <Input  name="email"  label="Email" type="email" />
    <Select name="role"   label="Role"   options={ROLES}  />
    <Select name="status" label="Status" options={STATUS} />
</Form>`}
            />

            {/* ── Lifecycle hooks ── */}
            <Section
                title="Lifecycle hooks"
                description="onLoad transforms data after reading. onSave transforms before writing. onFinally runs after every action."
                preview={
                    <div className="text-sm text-muted-foreground italic p-4">
                        Code example — hooks are not visually distinct from a standard form.
                    </div>
                }
                code={`<Form
    path="/products/prod_1"
    // prices stored as cents in DB, displayed as euros
    onLoad={(data) => ({ ...data, price: data.price / 100 })}
    onSave={async ({ record }) => ({ ...record, price: record.price * 100 })}
    onFinally={async ({ action }) => {
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
                title="Nested objects and arrays"
                description="Dot notation maps to nested object keys. Array index notation maps to array elements."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                aspect="card"
                                onFinally={async () => { alert('Saved!'); return false; }}
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
