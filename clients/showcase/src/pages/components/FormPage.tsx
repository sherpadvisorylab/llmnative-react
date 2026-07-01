import React from 'react';
import {
    ActionButton,
    Alert,
    DataProvider,
    Form,
    Input,
    LoadingButton,
    MockDataProvider,
    Select,
    TextArea,
    useFormController,
} from '@llmnative/react';
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
    { name: 'path', type: 'string', description: 'Collection or record path used for provider load/save.', control: 'text' },
    { name: 'defaultValues', type: 'object', description: 'Initial field values. Include _key to signal edit mode.' },
    { name: 'appearance', type: '"card" | "empty"', default: '"empty"', description: 'Visual wrapper style.', control: 'select', options: ['card', 'empty'] },
    { name: 'controller', type: 'FormController', description: 'Shared controller for custom save/delete buttons, dirty state, draft recovery and modal actions.' },
    { name: 'showBack', type: 'boolean', default: 'false', description: 'Show a back navigation button.', control: 'boolean' },
    { name: 'persistDraft', type: 'boolean', default: 'false', description: 'Persist unsaved local edits and expose restore/discard via the controller.', control: 'boolean' },
    { name: 'keyGenerator', type: '(record) => string', description: 'Custom primary key generator for new records. Presence forces create mode (no DB read).' },
    { name: 'onLoad', type: '(record: RecordProps) => void', description: 'Called after the record is loaded.' },
    {
        name: 'onSave',
        type: 'FormSaveHandler',
        description: 'Transform the record before saving or override the write path.',
        shape: `type FormSaveArgs = {
  record?: RecordProps;
  prevRecord?: RecordProps;
  storagePath?: string;
  action: "create" | "update";
}

type FormSaveHandler = (args: FormSaveArgs) => Promise<string | undefined>;`,
    },
    {
        name: 'onDelete',
        type: 'FormDeleteHandler',
        description: 'Hook called before deletion.',
        shape: `type FormDeleteArgs = { record?: RecordProps };
type FormDeleteHandler = (args: FormDeleteArgs) => Promise<string | undefined>;`,
    },
    {
        name: 'onComplete',
        type: 'FormFinallyHandler',
        description: 'Called after save or delete. Return false to keep surrounding UI open.',
        shape: `type FormFinallyArgs = {
  record?: RecordProps;
  action: "create" | "update" | "delete";
}

type FormFinallyHandler = (args: FormFinallyArgs) => Promise<boolean>;`,
    },
    { name: 'onRecordChange', type: '(record: RecordProps) => void', description: 'Called on every field change with the current record state.' },
    { name: 'header', type: 'React.ReactNode', description: 'Custom content rendered in the form header area.' },
    { name: 'footer', type: 'React.ReactNode', description: 'Custom content rendered in the form footer area.' },
    { name: 'log', type: 'boolean', default: 'false', description: 'Log field-change events to the console.', control: 'boolean' },
    { name: 'showNotice', type: 'boolean', default: 'true', description: 'Show the inline save/delete notice banner.', control: 'boolean' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outermost wrapper element.', control: 'text' },
    { name: 'headerClassName', type: 'string', description: 'CSS classes on the header container.', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the form body element.', control: 'text' },
    { name: 'footerClassName', type: 'string', description: 'CSS classes on the footer container.', control: 'text' },
];

const PLAYGROUND_SEED = { '/users': USERS_SEED };

function PlaygroundForm(props: {
    path: string;
    appearance: 'card' | 'empty';
    showBack: boolean;
    persistDraft: boolean;
}) {
    const form = useFormController();

    return (
        <div className="w-full max-w-lg space-y-3">
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <LoadingButton
                    label="Save from toolbar"
                    variant="primary"
                    disabled={form.saveDisabled}
                    loading={form.isSaving}
                    onClick={async () => form.save()}
                />
                {form.hasDraft ? <span className="text-xs text-slate-600">Draft available</span> : null}
                {form.isDirty ? <span className="text-xs text-amber-700">Unsaved changes</span> : null}
            </div>

            <Form
                controller={form}
                path={props.path}
                appearance={props.appearance}
                showBack={props.showBack}
                persistDraft={props.persistDraft}
                onComplete={async () => false}
            >
                <Input name="name"  label="Full name" required />
                <Input name="email" label="Email" type="email" />
                <Select name="role"   label="Role"   options={ROLES} />
                <Select name="status" label="Status" options={STATUS} />
                <TextArea name="bio" label="Bio" minHeight={96} />
            </Form>
        </div>
    );
}

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: FORM_PROPS,
    defaultProps: {
        path: '/users/user_1',
        appearance: 'card',
        showBack: false,
        persistDraft: false,
    },
    mockSeed: PLAYGROUND_SEED,
    render: (p) => (
        <PlaygroundForm
            path={p.path || '/users/user_1'}
            appearance={p.appearance}
            showBack={p.showBack}
            persistDraft={p.persistDraft}
        />
    ),
};

function HeaderActionDemo() {
    const form = useFormController();

    return (
        <WithMock>
            <div className="w-full max-w-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Header action driven by FormController</p>
                        <p className="text-xs text-slate-600">The button below is outside the Form tree but behaves like the native save action.</p>
                    </div>
                    <LoadingButton
                        label="Save changes"
                        variant="primary"
                        disabled={form.saveDisabled}
                        loading={form.isSaving}
                        onClick={async () => form.save()}
                    />
                </div>

                {form.isDirty ? (
                    <Alert variant="warning" appearance="text">
                        Unsaved changes are tracked by the controller, not by duplicated page state.
                    </Alert>
                ) : null}

                <Form
                    controller={form}
                    path="/users/user_1"
                    appearance="card"
                    persistDraft
                    onComplete={async () => false}
                >
                    <Input name="name"  label="Full name" required />
                    <Input name="email" label="Email" type="email" required />
                    <Select name="role"   label="Role"   options={ROLES} />
                    <Select name="status" label="Status" options={STATUS} />
                    <TextArea name="bio" label="Bio" minHeight={96} />
                </Form>
            </div>
        </WithMock>
    );
}

export default function FormPage() {
    usePlayground(PLAYGROUND, 'Form');
    const t = useShowcaseFormI18n();

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title="Shared controller and custom actions"
                description="Create a controller once with useFormController(), pass it to the Form, and use the same native state/actions anywhere in the page."
                preview={<HeaderActionDemo />}
                code={`import { Form, Input, LoadingButton, Select, TextArea, useFormController } from '@llmnative/react';

function SiteSettings() {
  const form = useFormController();

  return (
    <>
      <LoadingButton
        label="Save changes"
        disabled={form.saveDisabled}
        loading={form.isSaving}
        onClick={async () => form.save()}
      />

      <Form controller={form} path="/users/user_1" persistDraft appearance="card">
        <Input name="name" label="Full name" required />
        <Input name="email" label="Email" type="email" required />
        <Select name="role" label="Role" options={ROLES} />
        <TextArea name="bio" label="Bio" minHeight={96} />
      </Form>
    </>
  );
}`}
            />

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
                                <Select name="role"   label="Role"   options={ROLES} />
                                <Select name="status" label="Status" options={STATUS} />
                                <TextArea name="bio" label="Bio" minHeight={96} />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`<Form
  path="/users"
  defaultValues={{ role: 'viewer', status: 'active' }}
  appearance="card"
  keyGenerator={() => \`user_\${Date.now()}\`}
>
  <Input name="name" label="Full name" required />
  <Input name="email" label="Email" type="email" required />
  <Select name="role" label="Role" options={ROLES} />
  <Select name="status" label="Status" options={STATUS} />
  <TextArea name="bio" label="Bio" minHeight={96} />
</Form>`}
            />

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
                                <Select name="role"   label="Role"   options={ROLES} />
                                <Select name="status" label="Status" options={STATUS} />
                                <TextArea name="bio" label="Bio" minHeight={96} />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`// path="/users/user_1" -> reads /users/user_1 and writes back to the same record
<Form path="/users/user_1" appearance="card">
  <Input name="name" label="Full name" required />
  <Input name="email" label="Email" type="email" />
  <Select name="role" label="Role" options={ROLES} />
  <Select name="status" label="Status" options={STATUS} />
</Form>`}
            />

            <Section
                title={t.sections.nestedObjects.title}
                description={t.sections.nestedObjects.description}
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form appearance="card" onComplete={async () => false}>
                                <Input name="address.city" label="City" />
                                <Input name="address.zip" label="ZIP" />
                                <Input name="address.country" label="Country" />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`<Form appearance="card">
  <Input name="address.city" label="City" />
  <Input name="address.zip" label="ZIP" />
  <Input name="address.country" label="Country" />
</Form>`}
            />

            <PropDocsTable props={FORM_PROPS} />
        </PageLayout>
    );
}
