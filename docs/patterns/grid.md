---
title: CRUD Grid
group: Core patterns
order: 20
path: /docs/patterns/grid
description: The main pattern: a schema-driven list with add, edit, delete and a modal Form.
---

# CRUD Grid

`Grid` renders lists and tables by reading from the active `DataProvider`.

```tsx
<Grid
  dataStoragePath="/users"
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]}
  allowedActions={['add', 'edit', 'delete']}
  modal={{ mode: 'form' }}
  type="table"
/>;
```

Use `columns` as the UI schema: define labels, sorting, formatters and editable fields once.
