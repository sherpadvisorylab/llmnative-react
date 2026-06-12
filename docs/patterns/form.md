---
title: Standalone Form
group: Core patterns
order: 30
path: /docs/patterns/form
description: Standalone Form for loading, validating and saving provider-backed records.
---

# Standalone Form

`Form` can live on its own or inside a modal opened by `Grid`.

```tsx
<Form
  path="/users/alice"
  fields={[
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'role', label: 'Role', type: 'select', options: ['admin', 'editor'] },
  ]}
/>;
```

Controlled fields read and update the record through `FormContext`.
