---
title: Core patterns
group: Core patterns
order: 10
path: /docs/patterns
description: Recurring patterns for Grid, Form, nested data, formatters and schema-driven composition.
---

# Core Patterns

These patterns cover most @llmnative/react usage. Read them before building custom abstractions.

## Pattern 0: Starting point

For a new project use the scaffold — it generates the full folder structure with providers, theme and routing already wired. See [Quick start](/docs/quick-start) for the walkthrough, or [Manual setup](/docs/manual-setup) if you are adding @llmnative/react to an existing project.

Wherever you start, import the library CSS once at the app entry:

```tsx
import '@llmnative/react/dist/index.css';
```

---

## Pattern 1: CRUD Grid

The most common screen is a list with add/edit/delete actions and an automatic modal form.

```tsx
import { Grid } from '@llmnative/react';

export default function UserList() {
  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name', label: 'Name', sort: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'createdAt', label: 'Created', onDisplay: 'toDate' },
      ]}
      allowedActions={['add', 'edit', 'delete']}
      modal={{ mode: 'form' }}
      type="table"
      pagination={{ limit: 25, align: 'end' }}
      sortable
    />
  );
}
```

`modal={{ mode: 'form' }}` opens a `Form` automatically. If you need custom fields, pass them as children.

```tsx
<Grid dataStoragePath="/users" allowedActions={['add', 'edit', 'delete']} modal={{ mode: 'form' }}>
  {() => (
    <>
      <Input name="name" label="Name" required />
      <Input name="email" label="Email" inputType="email" />
      <Select name="role" label="Role" options={roleOptions} />
    </>
  )}
</Grid>
```

---

## Pattern 2: Standalone Form

Use `Form` for detail pages that load, edit, save and delete a single record.

```tsx
import { Form, Input, Select, Upload } from '@llmnative/react';
import { useParams } from 'react-router-dom';

export default function UserEdit() {
  const { id } = useParams();

  return (
    <Form dataStoragePath="/users" recordId={id} aspect="card" showBack>
      <Input name="name" label="Name" required />
      <Input name="email" label="Email" inputType="email" />
      <Select name="role" label="Role" options={[
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ]} />
      <Upload.Image name="avatar" label="Avatar" />
    </Form>
  );
}
```

If `recordId` is omitted, the form creates a new record.

---

## Pattern 3: Nested Objects And Arrays

Dot notation handles nested data.

```tsx
<Form dataStoragePath="/companies">
  <Input name="name" label="Company name" required />

  <Input name="address.street" label="Street" />
  <Input name="address.city" label="City" />
  <Input name="address.zip" label="ZIP" />

  <Input name="contacts.0.name" label="Contact 1 name" />
  <Input name="contacts.0.email" label="Contact 1 email" />

  <Repeat name="tags" defaultLength={3} label="Tags">
    {(index) => (
      <Input name={`tags.${index}`} label={`Tag ${index + 1}`} />
    )}
  </Repeat>
</Form>
```

---

## Pattern 4: Form Lifecycle Callbacks

Use lifecycle callbacks to transform data, navigate after saving, or integrate custom logic.

```tsx
import { useNavigate } from 'react-router-dom';

export default function ProductForm() {
  const navigate = useNavigate();

  return (
    <Form
      dataStoragePath="/products"
      onLoad={(data) => ({
        ...data,
        price: data.price ? data.price / 100 : 0,
      })}
      onSave={async ({ record, isNewRecord }) => ({
        ...record,
        price: Math.round(record.price * 100),
        updatedAt: Date.now(),
        ...(isNewRecord && { createdAt: Date.now() }),
      })}
      onFinally={async ({ action }) => {
        if (action === 'save' || action === 'delete') navigate('/products');
        return true;
      }}
      setPrimaryKey={() => `prod_${crypto.randomUUID()}`}
    >
      <Input name="title" label="Title" required />
      <Input name="price" label="Price" inputType="number" />
    </Form>
  );
}
```

---

## Pattern 5: Grid Formatters

Use `onDisplay` when raw data needs to become readable UI.

```tsx
<Grid
  source={orders}
  columns={[
    {
      key: 'amount',
      label: 'Amount',
      onDisplay: ({ value }) => `$ ${Number(value).toFixed(2)}`,
    },
    {
      key: 'customer.name',
      label: 'Customer',
    },
    {
      key: 'createdAt',
      label: 'Created',
      onDisplay: 'toDate',
    },
  ]}
  groupBy="status"
  sortable
/>
```

## Pattern 6: Shared Selection

Selection works the same way in `Grid`, `Table` and `Gallery`: the component owns the checkbox UI, while commands stay outside.

```tsx
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);

<Grid
  source={assets}
  view="gallery"
  selectedKeys={selectedKeys}
  onSelectionChange={({ keys, records }) => {
    setSelectedKeys(keys);
    setSelectedRecords(records);
  }}
/>
```

If you need export, delete, archive or custom bulk actions, place those commands in the surrounding header/toolbar and consume `selectedRecords` there.

---

## Pattern 7: Table Reorder

Manual reorder is activated only by `onReorder`, so there is no extra flag to keep in sync.

```tsx
const [rows, setRows] = useState<RecordArray>(initialRows);

<Table
  header={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'status', label: 'Status' },
  ]}
  body={rows}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>
```

> Note:
> `onReorder` owns the visible order of the table.
> Do not rely on sorting at the same time in the same view.
> If they are combined, manual reorder wins, sorting is ignored, and the component emits a `console.warn`.

---

## Anti-patterns

Avoid manually duplicating behavior that the framework already owns.

```tsx
// Avoid manual form state for framework fields.
const [name, setName] = useState('');

// Prefer:
<Form dataStoragePath="/users">
  <Input name="name" label="Name" />
</Form>
```

Do not import database adapters directly inside UI components. Use `Form`, `Grid`, or provider hooks instead.

