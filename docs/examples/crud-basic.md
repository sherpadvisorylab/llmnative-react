# Example: Basic CRUD with Grid + Form

Scenario: user management with list, add, edit and delete.

---

## Page structure

```text
src/pages/
  users/
    index.tsx
    edit.tsx
```

---

## User list - `pages/users/index.tsx`

```tsx
import { Grid, Badge, Input, Select } from '@llmnative/react'

export default function UserList() {
  return (
    <Grid
      path="/users"
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
        {
          key: 'role',
          label: 'Role',
          render: ({ value }) => (
            <Badge variant={value === 'admin' ? 'danger' : 'secondary'}>
              {value}
            </Badge>
          ),
        },
        { key: 'createdAt', label: 'Joined on', render: 'date' },
      ]}
      actions={['add', 'edit', 'delete']}
      view="table"
      pagination={{ limit: 25, align: 'end' }}
      sortable
      header={<h4>Users</h4>}
      form={() => (
        <>
          <Input name="name" label="Name" required />
          <Input.Email name="email" label="Email" required />
          <Select
            name="role"
            label="Role"
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
            ]}
            defaultValue="user"
          />
        </>
      )}
    />
  )
}
```

Notes:

- `sortable` enables header sorting on the grid; `sortable: true` or `sortable: false` refine behavior column by column.
- Built-in `add` and `edit` actions open the framework modal automatically.
- Use `form` to define the fields rendered inside that modal.

---

## Dedicated form - `pages/users/edit.tsx`

For a separate page with more fields or custom route flow.

```tsx
import { Form, Input, Select, UploadImage } from '@llmnative/react'
import { useParams, useNavigate } from 'react-router-dom'

export default function UserEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <Form
      path="/users"
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
        if (action === 'save') navigate('/users')
        return true
      }}
    >
      <Input name="name" label="Name" required />
      <Input.Email name="email" label="Email" required />
      <Input name="phone" label="Phone" />
      <Select
        name="role"
        label="Role"
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Manager', value: 'manager' },
          { label: 'User', value: 'user' },
        ]}
      />
      <UploadImage name="avatar" label="Profile picture" />
    </Form>
  )
}
```

---

## Route configuration

```tsx
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
  component: UserEdit,
},
```
