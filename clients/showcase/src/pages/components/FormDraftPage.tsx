import React, { useMemo, useState } from 'react';
import {
    ActionButton,
    DataProvider,
    Form,
    Input,
    LoadingButton,
    MockDataProvider,
    Modal,
    Select,
    TextArea,
    useFormController,
} from '@llmnative/react';
import type { PlaygroundConfig, PropDef } from '../../docs-kit/playground';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';

const ROLES = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];

const STATUSES = [
    { label: 'Active', value: 'active' },
    { label: 'Review', value: 'review' },
    { label: 'Inactive', value: 'inactive' },
];

const DRAFT_SEED = {
    '/showcase/drafts': {
        user_1: {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'admin',
            status: 'active',
            bio: 'Platform admin and early adopter.',
        },
    },
    '/showcase/drafts-modal': {
        ticket_1: {
            subject: 'Draft-aware support ticket',
            email: 'ops@example.com',
            status: 'review',
            notes: 'Try closing the modal after editing this text.',
        },
    },
};

const mockProvider = new MockDataProvider(DRAFT_SEED);

function WithMock({ children }: { children: React.ReactNode }) {
    return (
        <DataProvider registry={{ default: mockProvider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

const FORM_PROPS: PropDef[] = [
    { name: 'path', type: 'string', description: 'Provider path for data load and save. Omit it for a pure local form.', control: 'text' },
    { name: 'defaultValues', type: 'object', description: 'Initial field values. Include _key to signal edit mode.', control: 'json' },
    { name: 'appearance', type: '"card" | "empty"', default: '"empty"', description: 'Visual wrapper style for the form shell.', control: 'select', options: ['card', 'empty'] },
    { name: 'controller', type: 'FormController', description: 'Shared controller exposing draft status, saveDisabled, restoreDraft() and discardDraft().' },
    { name: 'header', type: 'React.ReactNode', description: 'Custom content rendered in the form header area.' },
    { name: 'footer', type: 'React.ReactNode', description: 'Custom content rendered in the form footer area.' },
    { name: 'showBack', type: 'boolean', default: 'false', description: 'Show a back navigation button in the footer.', control: 'boolean' },
    { name: 'showNotice', type: 'boolean', default: 'true', description: 'Show the inline save/delete notice banner.', control: 'boolean' },
    { name: 'persistDraft', type: 'boolean', default: 'false', description: 'Persist unsaved changes in localStorage and offer restore/discard after remounting the form.', control: 'boolean' },
    { name: 'noticeAnchorRef', type: 'React.RefObject<HTMLElement>', description: 'Render save/delete notices as sticky alerts anchored to an external container.' },
    { name: 'keyGenerator', type: '(record) => string', description: 'Custom primary key generator for new records. Presence forces create mode.' },
    { name: 'onLoad', type: '(record: RecordProps) => void', description: 'Called after the record is loaded from the provider.' },
    { name: 'onSave', type: 'FormSaveHandler', description: 'Transform the record before saving or override the write path.' },
    { name: 'onDelete', type: 'FormDeleteHandler', description: 'Hook called before deletion. Return a custom path or undefined.' },
    { name: 'onComplete', type: 'FormFinallyHandler', description: 'Called after save or delete. Return false to keep the surrounding modal/page flow open.' },
    { name: 'onRecordChange', type: '(record: RecordProps) => void', description: 'Called on every field change with the current record state.' },
    { name: 'log', type: 'boolean', default: 'false', description: 'Log field change events to the provider-backed audit log when configured.', control: 'boolean' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outermost wrapper element.', control: 'text' },
    { name: 'headerClassName', type: 'string', description: 'CSS classes on the header container.', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the form body element.', control: 'text' },
    { name: 'footerClassName', type: 'string', description: 'CSS classes on the footer container.', control: 'text' },
];

const PLAYGROUND_SEED = {
    '/showcase/playground-draft': {
        user_1: {
            name: 'Showcase playground',
            email: 'playground@example.com',
            role: 'editor',
            status: 'review',
            bio: 'Toggle persistDraft, edit a field, close the playground and reopen it.',
        },
    },
};

function DraftPlaygroundForm(props: {
    path: string;
    appearance: 'card' | 'empty';
    showBack: boolean;
    persistDraft: boolean;
    showNotice: boolean;
}) {
    const form = useFormController();

    return (
        <div className="w-full max-w-lg space-y-3">
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                <LoadingButton
                    label="Save"
                    variant="primary"
                    disabled={form.saveDisabled}
                    loading={form.isSaving}
                    onClick={async () => form.save()}
                />
                {form.hasDraft ? (
                    <>
                        <ActionButton label="Restore draft" variant="outline-secondary" onClick={() => form.restoreDraft()} />
                        <ActionButton label="Discard draft" variant="outline-secondary" onClick={() => form.discardDraft()} />
                    </>
                ) : (
                    <span>No draft pending</span>
                )}
            </div>

            <Form
                controller={form}
                path={props.path}
                appearance={props.appearance}
                showBack={props.showBack}
                showNotice={props.showNotice}
                persistDraft={props.persistDraft}
                onComplete={async () => false}
            >
                <Input name="name" label="Full name" required />
                <Input name="email" label="Email" type="email" required />
                <Select name="role" label="Role" options={ROLES} />
                <Select name="status" label="Status" options={STATUSES} />
                <TextArea name="bio" label="Bio" minHeight={96} />
            </Form>
        </div>
    );
}

const PLAYGROUND: PlaygroundConfig = {
    size: '2xl',
    layout: 'split',
    props: [
        { name: 'path', type: 'string', description: 'Provider path.', control: 'text' },
        { name: 'appearance', type: '"card" | "empty"', default: '"card"', description: 'Visual wrapper style.', control: 'select', options: ['card', 'empty'] },
        { name: 'showBack', type: 'boolean', default: 'false', description: 'Show back button.', control: 'boolean' },
        { name: 'persistDraft', type: 'boolean', default: 'true', description: 'Enable local draft persistence.', control: 'boolean' },
        { name: 'showNotice', type: 'boolean', default: 'true', description: 'Show save/delete notices.', control: 'boolean' },
    ],
    defaultProps: {
        path: '/showcase/playground-draft/user_1',
        appearance: 'card',
        showBack: false,
        persistDraft: true,
        showNotice: true,
    },
    mockSeed: PLAYGROUND_SEED,
    render: (p) => (
        <DraftPlaygroundForm
            path={p.path || '/showcase/playground-draft/user_1'}
            appearance={p.appearance}
            showBack={p.showBack}
            persistDraft={p.persistDraft}
            showNotice={p.showNotice}
        />
    ),
};

function DraftPersistenceDemo({ persistDraft }: { persistDraft: boolean }) {
    const [mounted, setMounted] = useState(true);
    const helperText = persistDraft
        ? 'Type in the form, do not save, then unmount and mount again. The controller can restore or discard the draft.'
        : 'This version keeps the default behavior. Type, unmount, and mount again: no restore prompt is shown.';

    return (
        <WithMock>
            <div className="w-full max-w-3xl space-y-4">
                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {helperText}
                </div>

                <div className="flex flex-wrap gap-2">
                    <ActionButton
                        label={mounted ? 'Unmount form' : 'Mount form again'}
                        onClick={() => setMounted((current) => !current)}
                    />
                    <ActionButton
                        label="Mount fresh instance"
                        variant="outline-secondary"
                        onClick={() => setMounted(true)}
                    />
                </div>

                {mounted ? (
                    <DraftPlaygroundForm
                        path="/showcase/drafts/user_1"
                        appearance="card"
                        showBack={false}
                        persistDraft={persistDraft}
                        showNotice
                    />
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-sm text-slate-600">
                        The form is currently unmounted. Mount it again to verify whether the draft comes back.
                    </div>
                )}
            </div>
        </WithMock>
    );
}

function DraftModalDemo() {
    const [open, setOpen] = useState(false);
    const form = useFormController();

    return (
        <WithMock>
            <div className="w-full max-w-3xl space-y-4">
                <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Open the modal, edit a field, close it without saving, then reopen it. The form remounts and offers to restore the draft.
                </div>

                <ActionButton label="Open modal form" onClick={() => setOpen(true)} />

                {open && (
                    <Modal
                        title="Draft-aware modal form"
                        size="md"
                        position="right"
                        closeOnBackdrop
                        onClose={() => setOpen(false)}
                        onSave={() => form.save()}
                    >
                        <Form
                            controller={form}
                            path="/showcase/drafts-modal/ticket_1"
                            appearance="card"
                            persistDraft
                            onComplete={async () => false}
                        >
                            <Input name="subject" label="Subject" required />
                            <Input name="email" label="Requester email" type="email" required />
                            <Select name="status" label="Status" options={STATUSES} />
                            <TextArea name="notes" label="Notes" minHeight={120} />
                        </Form>
                    </Modal>
                )}
            </div>
        </WithMock>
    );
}

export default function FormDraftPage() {
    usePlayground(PLAYGROUND, 'Form Draft');

    const propertyDocs = useMemo(() => FORM_PROPS, []);

    return (
        <PageLayout
            title="Form - Draft persistence"
            description="persistDraft makes the Form remember unsaved edits in localStorage, while the shared controller exposes the same native draft actions to toolbars, modals and page headers."
        >
            <Section
                title="Basic recovery flow"
                description="This is the core persistDraft behavior on a page-level form. The draft is stored while you type, survives unmount/remount, and the controller can restore or discard it."
                preview={<DraftPersistenceDemo persistDraft />}
                code={`const form = useFormController();

<ActionButton label="Save" disabled={form.saveDisabled} onClick={() => { void form.save(); }} />
{form.hasDraft && <ActionButton label="Restore draft" onClick={() => form.restoreDraft()} />}

<Form controller={form} path="/users/user_1" appearance="card" persistDraft>
  <Input name="name" label="Full name" required />
  <Input name="email" label="Email" type="email" required />
  <Select name="role" label="Role" options={ROLES} />
  <TextArea name="bio" label="Bio" minHeight={96} />
</Form>`}
            />

            <Section
                title="Default-off comparison"
                description="persistDraft is opt-in. Without it, the Form still tracks dirty state and controller-driven save actions, but it does not remember local edits after the component is removed."
                preview={<DraftPersistenceDemo persistDraft={false} />}
                code={`<Form
  path="/users/user_1"
  appearance="card"
  onComplete={async () => false}
>
  <Input name="name" label="Full name" required />
  <Input name="email" label="Email" type="email" required />
</Form>`}
            />

            <Section
                title="Modal and accidental close"
                description="persistDraft is especially useful in modal workflows. The modal save action can use the same controller, so validation, save and draft recovery all stay aligned."
                preview={<DraftModalDemo />}
                code={`const form = useFormController();

<Modal title="Draft-aware modal form" onSave={() => form.save()}>
  <Form controller={form} path="/tickets/ticket_1" persistDraft>
    <Input name="subject" label="Subject" required />
    <Input name="email" label="Requester email" type="email" required />
    <TextArea name="notes" label="Notes" minHeight={120} />
  </Form>
</Modal>`}
            />

            <PropDocsTable props={propertyDocs} />
        </PageLayout>
    );
}
