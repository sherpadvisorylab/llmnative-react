# Example: Basic CRUD with Grid + Form

Scenario: user management with list, add, edit and delete.

---

## Page structure

```
src/pages/
  users/
    index.tsx     ← user list (Grid)
    edit.tsx      ← edit form (Form)
```

---

## User list — `pages/users/index.tsx`

```tsx
import { Grid, Badge } from '@llmnative/react'
import { useNavigate } from 'react-router-dom'

export default function UserList() {
  const navigate = useNavigate()

  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name',      label: 'Name',      sort: true },
        { key: 'email',     label: 'Email' },
        {
          key: 'role',
          label: 'Role',
          onDisplay: ({ value }) => (
            <Badge variant={value === 'admin' ? 'danger' : 'secondary'}>
              {value}
            </Badge>
          ),
        },
        { key: 'createdAt', label: 'Joined on', onDisplay: 'toDate' },
      ]}
      allowedActions={["add", "edit", "delete"]}
      modal={{ mode: "form" }}
      type="table"
      pagination={{ limit: 25, align: "end" }}
      sortable
      header={<h4>Users</h4>}
    >
      {({ record }) => (
        <>
          <Input name="name"     label="Name"   required />
          <Input name="email"    label="Email"  inputType="email" required />
          <Select
            name="role"
            label="Role"
            options={[
              { label: "Admin", value: "admin" },
              { label: "User",  value: "user" },
            ]}
            defaultValue="user"
          />
        </>
      )}
    </Grid>
  )
}
```

Notes:

- `sortable` enables header sorting on the `Table`; `sort: true` or `sort: false` refine the behaviour column by column.
- `onClick` always receives the full record.
- `onSelectionChange` and `selectedKeys` use the same semantics as `Table` and `Gallery`, so bulk actions can live outside the component.

---

## Dedicated form — `pages/users/edit.tsx`

For a separate page with more fields or complex logic.

```tsx
import { Form, Input, Select, Upload } from '@llmnative/react'
import { useParams, useNavigate } from 'react-router-dom'

export default function UserEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <Form
      dataStoragePath="/users"
      recordId={id}
      appearance="card"
      showBack
      defaultValues={{ role: 'user', active: true }}
      onSave={async ({ record, isNewRecord }) => ({
        ...record,
        updatedAt: Date.now(),
        ...(isNewRecord && { createdAt: Date.now() }),
      })}
      onComplete={async ({ action }) => {
        navigate('/users')
        return true
      }}
    >
      <Input name="name"    label="Name"    required />
      <Input name="email"   label="Email"   inputType="email" required />
      <Input name="phone"   label="Phone"   inputType="tel" />
      <Select
        name="role"
        label="Role"
        options={[
          { label: "Admin",    value: "admin" },
          { label: "Manager",  value: "manager" },
          { label: "User",     value: "user" },
        ]}
      />
      <Upload.Image name="avatar" label="Profile picture" />
    </Form>
  )
}
```

---

## Route configuration

```tsx
// In menuConfig or react-router routes
{
  path: '/users',
  component: UserList,
},
{
  path: '/users/:id',
  component: UserEdit,
},
{
  path: '/users/new',
  component: UserEdit,   // recordId will be undefined → new record
},
```

---

## Resulting Firebase data structure

```
/users/
  1234567890/
    name: "John Smith"
    email: "john@example.com"
    phone: "+1 555 1234567"
    role: "admin"
    avatar: { base64: "...", name: "avatar.jpg", type: "image/jpeg" }
    createdAt: 1746356400000
    updatedAt: 1746356400000
```
