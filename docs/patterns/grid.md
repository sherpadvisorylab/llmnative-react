---
title: CRUD Grid
group: Core patterns
order: 20
path: /docs/patterns/grid
description: The main pattern: a schema-driven list with add, edit, delete and a modal Form.
---

# CRUD Grid

`Grid` renders lists and tables by reading from the active `DataProvider`.

The three base entry points are:

```tsx
// Provider-backed records through the active DataProvider.
<Grid path="/users" />

// Explicit DB wrapper.
<GridDB path="/users" order={{ name: "asc" }} />

// Renders caller-owned data without a provider subscription.
<GridArray records={records} recordId="_key" />
```

```tsx
<Grid
  path="/users"
  order={{ name: "asc" }}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]}
  form={<UserFormFields />}
  title="Users"
  sortable={{ field: 'name', dir: 'asc' }}
  layout="table"
/>;
```

Use `columns` as the UI schema: define labels, sorting and renderers once. `path` is the DB entry point, while `records` + `recordId` power array-backed grids. `sortable` can stay a boolean or accept an `OrderConfig` object to seed the initial client-side sort. `form` is the shared default add/edit UI, while `actions` only overrides the CRUD behavior you want to customize. The default header renders `title` plus the built-in Add action.

Selection now follows the same contract in all visual modes:

```tsx
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);

<Grid
  path="/users"
  layout="gallery"
  selection="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={({ keys, records }) => {
    setSelectedKeys(keys);
    setSelectedRecords(records);
  }}
/>
```

When `layout="table"`, `reorderable` and `onReorder` enable manual row reordering:

```tsx
const [rows, setRows] = useState<RecordArray>(records);

<Grid
  records={rows}
  recordId="_key"
  layout="table"
  reorderable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
  ]}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>
```

> Note:
> manual reorder and sorting should not be used together on the same table view.
> If `reorderable` and `sortable` are combined, manual reorder takes precedence, sorting is ignored, and the component logs a `console.warn` to make the conflict explicit.
