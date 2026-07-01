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

  <Form controller={form} path="/users/alice" appearance="card" persistDraft>
    <Input name="name" label="Name" required />
    <Input name="email" label="Email" inputType="email" />
    <Select name="role" label="Role" options={roleOptions} />
  </Form>
</>;
```

Controlled fields read and update the record through `FormContext`.
The same controller also powers the native footer buttons, modal save actions, dirty state and draft recovery.
