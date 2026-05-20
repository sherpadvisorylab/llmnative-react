---
title: CRUD Grid
group: Core patterns
order: 20
path: /docs/patterns/grid
description: The main pattern: a schema-driven list with add, edit, delete and a modal Form.
---

# CRUD Grid

`Grid` renders lists and tables by reading from the active `DataProvider`.

The three base source shapes are:

```tsx
// Reads from the current route path.
<Grid />

// Reads from a specific provider collection.
<Grid source="/users" />

// Renders caller-owned data without a provider subscription.
<Grid source={records} />
```

```tsx
<Grid
  source={{ path: "/users", order: { name: "asc" } }}
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]}
  form={<UserFormFields />}
  title="Users"
  sortable={{ field: 'name', dir: 'asc' }}
  view="table"
/>;
```

Use `columns` as the UI schema: define labels, sorting and transforms once. `source` is the only data entry point: pass a string path, a db-style object, or a local record array. `sortable` can stay a boolean or accept an `OrderConfig` object to seed the initial client-side sort. `form` is the shared default add/edit UI, while `actions` only overrides the CRUD behavior you want to customize. The default header renders `title` plus the built-in Add action.

Selection now follows the same contract in all visual modes:

```tsx
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);

<Grid
  source="/users"
  view="gallery"
  selectedKeys={selectedKeys}
  onSelectionChange={({ keys, records }) => {
    setSelectedKeys(keys);
    setSelectedRecords(records);
  }}
/>
```

When `view="table"`, `onReorder` enables manual row reordering:

```tsx
const [rows, setRows] = useState<RecordArray>(records);

<Grid
  source={rows}
  view="table"
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email' },
  ]}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>
```

> Note:
> manual reorder and sorting should not be used together on the same table view.
> If `onReorder` is combined with `sortable`, manual reorder takes precedence, sorting is ignored, and the component logs a `console.warn` to make the conflict explicit.
