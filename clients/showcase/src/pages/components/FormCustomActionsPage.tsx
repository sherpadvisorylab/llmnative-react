import React from 'react';
import {
    ActionButton,
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

const USER = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    status: 'active',
    bio: 'Platform admin and early adopter.',
};

function WithMock({ children }: { children: React.ReactNode }) {
    const provider = new MockDataProvider({ '/users/user_1': USER });
    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

function ToolbarDemo() {
    const form = useFormController();

    return (
        <WithMock>
            <div className="w-full max-w-lg space-y-3">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <LoadingButton
                        label="Save"
                        variant="primary"
                        disabled={form.saveDisabled}
                        loading={form.isSaving}
                        onClick={async () => form.save()}
                    />
                    <LoadingButton
                        label="Delete"
                        variant="danger-outline"
                        disabled={form.deleteDisabled}
                        loading={form.isDeleting}
                        onClick={async () => form.delete()}
                    />
                    <ActionButton
                        label="Reset"
                        variant="outline-secondary"
                        disabled={form.saveDisabled}
                        onClick={() => form.reset()}
                    />
                    {form.isDirty && (
                        <span className="ml-auto text-xs text-amber-700">Unsaved changes</span>
                    )}
                </div>

                {form.hasErrors && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {Object.entries(form.errors).map(([field, msg]) => (
                            <div key={field}><strong>{field}:</strong> {msg}</div>
                        ))}
                    </div>
                )}

                <Form
                    controller={form}
                    path="/users/user_1"
                    appearance="card"
                    persistDraft
                    showNotice={false}
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

function FooterDemo() {
    const form = useFormController();

    return (
        <WithMock>
            <div className="w-full max-w-lg space-y-3">
                <Form
                    controller={form}
                    path="/users/user_1"
                    appearance="card"
                    showBack
                    onComplete={async () => false}
                    footer={
                        <div className="flex items-center justify-between gap-2">
                            <ActionButton
                                label="Reset"
                                variant="outline-secondary"
                                disabled={form.saveDisabled}
                                onClick={() => form.reset()}
                            />
                            <LoadingButton
                                label="Publish"
                                variant="primary"
                                disabled={form.saveDisabled}
                                loading={form.isSaving}
                                onClick={async () => form.save()}
                            />
                        </div>
                    }
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

export default function FormCustomActionsPage() {
    return (
        <PageLayout
            title="Form — Custom actions"
            description="useFormController exposes the same native save, delete, reset and dirty state that the Form uses internally. Wire them into any layout — toolbars, headers, modals, custom footers."
        >
            <Section
                title="Toolbar with save, delete and reset"
                description="Create a controller with useFormController(), pass it to the Form, and bind external buttons to the same state and actions. The toolbar shows saveDisabled/isSaving for the save button, deleteDisabled/isDeleting for delete, and a reset button that reverts to the loaded record. The dirty indicator appears automatically when any field changes."
                preview={<ToolbarDemo />}
                code={`const form = useFormController();

<div className="toolbar">
  <LoadingButton label="Save"   disabled={form.saveDisabled}   loading={form.isSaving}   onClick={() => form.save()} />
  <LoadingButton label="Delete" disabled={form.deleteDisabled} loading={form.isDeleting} onClick={() => form.delete()} />
  <ActionButton  label="Reset"  disabled={form.saveDisabled}   onClick={() => form.reset()} />
  {form.isDirty && <span>Unsaved changes</span>}
</div>

{form.hasErrors && (
  <div className="error-banner">
    {Object.entries(form.errors).map(([field, msg]) => (
      <div key={field}><strong>{field}:</strong> {msg}</div>
    ))}
  </div>
)}

<Form controller={form} path="/users/user_1" appearance="card">
  <Input name="name"  label="Full name" required />
  <Input name="email" label="Email" type="email" required />
  <Select name="role"  label="Role"  options={ROLES} />
  <Select name="status" label="Status" options={STATUS} />
  <TextArea name="bio" label="Bio" minHeight={96} />
</Form>`}
            />

            <Section
                title="Custom footer with reset + publish"
                description="The Form's footer prop replaces the built-in button row. You can render any layout while still using the controller for native saveDisabled, isSaving and reset."
                preview={<FooterDemo />}
                code={`const form = useFormController();

<Form
  controller={form}
  path="/users/user_1"
  appearance="card"
  showBack
  footer={(
    <div className="flex items-center justify-between gap-2">
      <ActionButton label="Reset"  disabled={form.saveDisabled} onClick={() => form.reset()} />
      <LoadingButton label="Publish" disabled={form.saveDisabled} loading={form.isSaving} onClick={() => form.save()} />
    </div>
  )}
>
  <Input name="name"  label="Full name" required />
  <Input name="email" label="Email" type="email" required />
  <Select name="role"  label="Role"  options={ROLES} />
  <Select name="status" label="Status" options={STATUS} />
  <TextArea name="bio" label="Bio" minHeight={96} />
</Form>`}
            />
        </PageLayout>
    );
}
