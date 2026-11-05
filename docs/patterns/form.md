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

## Action forms

By default a form saves only when a field changed: unchanged, its save is disabled and says "No changes to save".
A form that runs an action with proposed values (start a release with the proposed version, finish a session with the proposed title) sets `requireChanges={false}`: `save()` validates the fields and calls `onSave` even when nothing changed.
`isDirty` still tells whether the person changed something.

```tsx
const form = useFormController()

<>
  <LoadingButton label="Start the release" onClick={() => form.save()} />

  <Form controller={form} appearance="empty" requireChanges={false} defaultValues={{ version: '1.4.0', notes }} onSave={startRelease}>
    <Input name="version" label="Version" required />
    <TextArea name="notes" label="Notes" />
  </Form>
</>;
```
