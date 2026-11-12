---
title: Standalone Form
group: Core patterns
order: 30
path: /docs/patterns/form
description: Standalone Form for loading, validating and saving provider-backed records.
---

# Standalone Form

`Form` can live on its own or inside a modal opened by `Grid`.
When you need custom buttons outside the form, create a `FormController` with `useFormController()` and pass it in.

```tsx
const form = useFormController()

<>
  <ActionButton
    label="Save"
    disabled={form.saveDisabled}
    onClick={() => { void form.save() }}
  />

  <Form controller={form} path="/users/alice" appearance="card" draftBucket="workspace/acme">
    <Input name="name" label="Name" required />
    <Input type="email" name="email" label="Email" />
    <Select name="role" label="Role" options={roleOptions} />
  </Form>
</>;
```

Controlled fields read and update the record through `FormContext`.
The same controller also powers the native footer buttons, modal save actions, dirty state and draft recovery.

## Two kinds of Form

A Form either **saves a record** or **runs an action**, never both:

| | Saves a record | Runs an action |
|---|---|---|
| Props | `path`, `onSave`, `onDelete`, `keyGenerator` | `onSubmit({ record })` |
| Reads / writes the provider | yes | never |
| Needs a changed field | yes ("No changes to save") | no: its values may already be the submission |
| Says "Saved" | yes | no: what follows is yours (`onComplete` gets `action: 'submit'`) |
| Its button | the card's Save button | yours: `useFormController().save()`; Enter in a field submits too |
| An error thrown by the handler | in its notice | in its notice |
| The handler returns `false` | failed, the page says why: nothing written, no notice | failed, the page says why: no notice, no `onComplete` |

`onSubmit` with any prop of a saving Form is a type error, and an error at runtime.

## Action forms

An action form calls a command, sends a code, starts a release: `onSubmit` is the action.
The fields are checked first (`required`, `validator`); `isDirty` still tells whether the person changed something.

```tsx
const form = useFormController()

<>
  <Form controller={form} appearance="empty" onSubmit={({ record }) => call('requestLoginCode', record)}>
    <Input name="email" type="email" label="Email" required />
    <Input name="code" label="Code" inputMode="numeric" maxLength={6} pattern="[0-9]{6}" autoComplete="one-time-code" />
  </Form>
  <LoadingButton label="Send me a code" loading={form.isSaving} onClick={() => form.save()} />
</>;
```

With proposed values (start a release with the proposed version) the person can submit them unchanged:

```tsx
<Form controller={form} appearance="empty" defaultValues={{ version: '1.4.0', notes }} onSubmit={({ record }) => startRelease(record)}>
  <Input name="version" label="Version" required />
  <TextArea name="notes" label="Notes" />
</Form>
```

Migrating from 1.x: `requireChanges={false}` with an `onSave` that returned `undefined` becomes `onSubmit`.
