# Esempio: CRUD base con Grid + Form

Scenario: gestione utenti con lista, aggiunta, modifica e cancellazione.

---

## Struttura pagine

```
src/pages/
  users/
    index.tsx     ← lista utenti (Grid)
    edit.tsx      ← form modifica (Form)
```

---

## Lista utenti — `pages/users/index.tsx`

```tsx
import { Grid, Badge } from 'react-firestrap'
import { useNavigate } from 'react-router-dom'

export default function UserList() {
  const navigate = useNavigate()

  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name',      label: 'Nome',   sort: true },
        { key: 'email',     label: 'Email' },
        {
          key: 'role',
          label: 'Ruolo',
          onDisplay: ({ value }) => (
            <Badge variant={value === 'admin' ? 'danger' : 'secondary'}>
              {value}
            </Badge>
          ),
        },
        { key: 'createdAt', label: 'Iscritto il', onDisplay: 'toDate' },
      ]}
      allowedActions={["add", "edit", "delete"]}
      modal={{ mode: "form" }}
      type="table"
      pagination={{ limit: 25, align: "end" }}
      sortable
      header={<h4>Utenti</h4>}
    >
      {({ record }) => (
        <>
          <Input name="name"     label="Nome"   required />
          <Input name="email"    label="Email"  inputType="email" required />
          <Select
            name="role"
            label="Ruolo"
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

Note:

- `sortable` abilita l'header sorting della `Table`; `sort: true` o `sort: false` rifiniscono il comportamento colonna per colonna.
- `onClick` riceve sempre il record completo.
- `onSelectionChange` e `selectedKeys` usano la stessa semantica di `Table` e `Gallery`, quindi le bulk actions possono stare fuori dal componente.

---

## Form dedicato — `pages/users/edit.tsx`

Per una pagina separata con più campi o logica complessa.

```tsx
import { Form, Input, Select, Upload } from 'react-firestrap'
import { useParams, useNavigate } from 'react-router-dom'

export default function UserEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <Form
      dataStoragePath="/users"
      recordId={id}
      aspect="card"
      showBack
      defaultValues={{ role: 'user', active: true }}
      onSave={async ({ record, isNewRecord }) => ({
        ...record,
        updatedAt: Date.now(),
        ...(isNewRecord && { createdAt: Date.now() }),
      })}
      onFinally={async ({ action }) => {
        navigate('/users')
        return true
      }}
    >
      <Input name="name"    label="Nome"     required />
      <Input name="email"   label="Email"    inputType="email" required />
      <Input name="phone"   label="Telefono" inputType="tel" />
      <Select
        name="role"
        label="Ruolo"
        options={[
          { label: "Admin",    value: "admin" },
          { label: "Manager",  value: "manager" },
          { label: "User",     value: "user" },
        ]}
      />
      <Upload.Image name="avatar" label="Foto profilo" />
    </Form>
  )
}
```

---

## Route configuration

```tsx
// In menuConfig o react-router routes
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
  component: UserEdit,   // recordId sarà undefined → nuovo record
},
```

---

## Struttura dati Firebase risultante

```
/users/
  1234567890/
    name: "Mario Rossi"
    email: "mario@example.com"
    phone: "+39 02 1234567"
    role: "admin"
    avatar: { base64: "...", name: "avatar.jpg", type: "image/jpeg" }
    createdAt: 1746356400000
    updatedAt: 1746356400000
```
