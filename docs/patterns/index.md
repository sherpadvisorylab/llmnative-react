---
title: Core patterns
group: Core patterns
order: 10
path: /docs/patterns
description: Recurring patterns for Grid, Form, nested data, formatters and schema-driven composition.
---

# Core Patterns

These patterns cover most `@llmnative/react` usage.

## Pattern 1: CRUD Grid

```tsx
import { Grid } from '@llmnative/react'

export default function UserList() {
  return (
    <Grid
      path="/users"
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'createdAt', label: 'Created', render: 'date' },
      ]}
      actions={['add', 'edit', 'delete']}
      view="table"
      pagination={{ limit: 25, align: 'end' }}
      sortable
    />
  )
}
```

Built-in `add` and `edit` actions already open the framework modal. If you need custom fields, pass them through `form`.

```tsx
<Grid
  path="/users"
  actions={['add', 'edit', 'delete']}
  form={() => (
    <>
      <Input name="name" label="Name" required />
      <Input.Email name="email" label="Email" />
      <Select name="role" label="Role" options={roleOptions} />
    </>
  )}
/>
```

## Pattern 2: Standalone Form

```tsx
import { ActionButton, Form, Input, Select, UploadImage, useFormController } from '@llmnative/react'

export default function UserEdit() {
  const form = useFormController()

  return (
    <>
      <ActionButton
        label="Save"
        disabled={form.saveDisabled}
        onClick={() => { void form.save() }}
      />

      <Form controller={form} path="/users/user_1" appearance="card" showBack draftBucket="workspace/acme">
        <Input name="name" label="Name" required />
        <Input.Email name="email" label="Email" />
        <Select
          name="role"
          label="Role"
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ]}
        />
        <UploadImage name="avatar" label="Avatar" />
      </Form>
    </>
  )
}
```

## Pattern 3: Nested Objects And Arrays

```tsx
<Form path="/companies">
  <Input name="name" label="Company name" required />
  <Input name="address.street" label="Street" />
  <Input name="address.city" label="City" />
  <Input name="address.zip" label="ZIP" />

  <Repeat name="tags" defaultLength={3}>
    {(index) => <Input name={`tags.${index}`} label={`Tag ${index + 1}`} />}
  </Repeat>
</Form>
```

## Pattern 4: Form Lifecycle Callbacks

```tsx
<Form
  path="/products"
  onLoad={(data) => ({
    ...data,
    price: data.price ? data.price / 100 : 0,
  })}
  onSave={async ({ record }) => ({
    ...record,
    price: Math.round(record.price * 100),
    updatedAt: Date.now(),
  })}
  keyGenerator={() => `prod_${crypto.randomUUID()}`}
>
  <Input name="title" label="Title" required />
  <Input.Number name="price" label="Price" />
</Form>
```

## Pattern 5: Grid Formatters

Use `render` when raw data needs to become readable UI.

```tsx
<Grid
  records={orders}
  recordId="_key"
  columns={[
    {
      key: 'amount',
      label: 'Amount',
      render: ({ value }) => `$ ${Number(value).toFixed(2)}`,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: 'date',
    },
  ]}
  groupBy="status"
  sortable
/>
```

## Pattern 6: Shared Selection

```tsx
const [selectedKeys, setSelectedKeys] = useState<string[]>([])
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([])

<Grid
  records={assets}
  recordId="_key"
  view="gallery"
  selection={{
    mode: 'multiple',
    defaultKeys: selectedKeys,
    onChange: ({ keys, records }) => {
      setSelectedKeys(keys)
      setSelectedRecords(records)
    },
  }}
/>
```

## Pattern 7: Table Reorder

```tsx
const [rows, setRows] = useState<RecordArray>(initialRows)

<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status' },
  ]}
  records={rows}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>
```

## Anti-pattern

```tsx
<Form path="/users">
  <Input name="name" label="Name" />
</Form>
```
