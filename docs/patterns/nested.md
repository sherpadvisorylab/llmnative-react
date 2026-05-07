---
title: Nested objects
group: Core patterns
order: 40
path: /docs/patterns/nested
description: Dot notation and array index notation for nested objects in Form and Grid.
---

# Nested objects

Field names can use dot notation.

```tsx
<Input name="address.city" />
<Input name="contacts.0.email" />
```

`Form` creates intermediate objects when needed and updates the record without losing sibling values.
