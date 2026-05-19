---
title: CRUD Grid
group: Core patterns
order: 20
path: /docs/patterns/grid
description: The main pattern: a schema-driven list with add, edit, delete and a modal Form.
---

# CRUD Grid

`Grid` renders lists and tables by reading from the active `DataProvider`.

The three base data-entry points are:

```tsx
// Reads from the current route path.
<Grid />

// Reads from a specific provider collection.
<Grid providerPath="/users" />

// Renders caller-owned data without a provider subscription.
<Grid records={records} />
```

```tsx
<Grid
  providerPath="/users"
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ]}
  actions={{ default: { add: true, edit: true, delete: true } }}
  order={{ field: 'name', dir: 'asc' }}
  editor={{ mode: 'modal', form: <UserFormFields /> }}
  view="table"
/>;
```

Use `columns` as the UI schema: define labels, sorting, transforms and editable fields once. `Grid` passes `order` to `Table` or `Gallery`; the table keeps header sorting internal, while the gallery applies the same order without a header UI.

Selection now follows the same contract in all visual modes:

```tsx
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);

<Grid
  providerPath="/users"
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
  records={rows}
  view="table"
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email' },
  ]}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>
```
