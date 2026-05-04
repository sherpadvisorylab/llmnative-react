# Pattern principali

> TL;DR per AI: cinque pattern coprono il 90% dei casi d'uso. Leggili tutti prima di scrivere codice.

---

## Pattern 1 — Grid CRUD completo

Il pattern più comune: lista con add/edit/delete, modal automatico, real-time updates.

```tsx
import { Grid } from 'react-firestrap'

export default function UserList() {
  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name',      label: 'Nome',    sort: true },
        { key: 'email',     label: 'Email' },
        { key: 'role',      label: 'Ruolo',   onDisplay: ({ value }) => <Badge>{value}</Badge> },
        { key: 'createdAt', label: 'Data',    onDisplay: 'toDate' },
      ]}
      allowedActions={["add", "edit", "delete"]}
      modal={{ mode: "form" }}
      type="table"
      pagination={{ perPage: 25 }}
      allowedSorting
    />
  )
}
```

**Come funziona il modal:** `modal={{ mode: "form" }}` apre automaticamente un `<Form>` con i fields figli della Grid. Se non specifichi children, il form è vuoto (gestisci tu).

**Variante con form custom nel modal:**
```tsx
<Grid dataStoragePath="/users" allowedActions={["add", "edit", "delete"]} modal={{ mode: "form" }}>
  {({ record }) => (
    <>
      <Input name="name" label="Nome" required />
      <Input name="email" label="Email" inputType="email" />
      <Select name="role" label="Ruolo" options={roleOptions} />
    </>
  )}
</Grid>
```

---

## Pattern 2 — Form standalone

Form che carica da database, gestisce lo stato, salva e cancella.

```tsx
import { Form, Input, Select, Upload } from 'react-firestrap'
import { useParams } from 'react-router-dom'

export default function UserEdit() {
  const { id } = useParams()

  return (
    <Form
      dataStoragePath="/users"
      recordId={id}             // se omesso → nuovo record
      aspect="card"
      showBack
    >
      <Input name="name"  label="Nome"  required />
      <Input name="email" label="Email" inputType="email" />
      <Select name="role" label="Ruolo" options={[
        { label: "Admin", value: "admin" },
        { label: "User",  value: "user" },
      ]} />
      <Upload.Image name="avatar" label="Avatar" />
    </Form>
  )
}
```

**Nuovo record vs record esistente:** se `recordId` è undefined il form crea un nuovo record usando `Date.now()` come chiave (o il `setPrimaryKey` custom).

---

## Pattern 3 — Form con oggetti annidati e array

La dot notation gestisce automaticamente la profondità.

```tsx
<Form dataStoragePath="/companies">
  <Input name="name" label="Ragione sociale" required />

  {/* oggetto annidato → salva in record.address.* */}
  <Input name="address.street" label="Via" />
  <Input name="address.city"   label="Città" />
  <Input name="address.zip"    label="CAP" />

  {/* array con indice fisso */}
  <Input name="contacts.0.name"  label="Contatto 1 - Nome" />
  <Input name="contacts.0.email" label="Contatto 1 - Email" />
  <Input name="contacts.1.name"  label="Contatto 2 - Nome" />

  {/* array dinamico con Repeat */}
  <Repeat name="tags" defaultLength={3} label="Tag">
    {(index) => (
      <Input name={`tags.${index}`} label={`Tag ${index + 1}`} />
    )}
  </Repeat>
</Form>
```

**Record risultante:**
```json
{
  "name": "Acme Srl",
  "address": { "street": "Via Roma 1", "city": "Milano", "zip": "20100" },
  "contacts": [
    { "name": "Mario", "email": "mario@acme.it" },
    { "name": "Luigi", "email": "luigi@acme.it" }
  ],
  "tags": ["react", "firebase", "typescript"]
}
```

---

## Pattern 4 — Callbacks lifecycle del Form

Per trasformare dati, navigare dopo il salvataggio, o integrare logica custom.

```tsx
import { useNavigate } from 'react-router-dom'

export default function ProductForm() {
  const navigate = useNavigate()

  return (
    <Form
      dataStoragePath="/products"
      // trasforma i dati DOPO il caricamento da DB (es: da centesimi a euro)
      onLoad={(data) => ({
        ...data,
        price: data.price ? data.price / 100 : 0,
      })}
      // trasforma i dati PRIMA del salvataggio su DB (es: da euro a centesimi)
      onSave={async ({ record, isNewRecord }) => ({
        ...record,
        price: Math.round(record.price * 100),
        updatedAt: Date.now(),
        ...(isNewRecord && { createdAt: Date.now() }),
      })}
      // dopo save O delete
      onFinally={async ({ action, record }) => {
        if (action === 'save')   navigate('/products')
        if (action === 'delete') navigate('/products')
        return true  // true = operazione confermata, false = annulla navigazione
      }}
      // chiave primaria custom
      setPrimaryKey={() => `prod_${crypto.randomUUID()}`}
    >
      <Input name="title" label="Titolo" required />
      <Input name="price" label="Prezzo (€)" inputType="number" />
    </Form>
  )
}
```

---

## Pattern 5 — Grid con formatter e dati in memoria

Quando i dati vengono da una fonte esterna o da uno state locale (non direttamente da Firebase).

```tsx
import { Grid, Badge } from 'react-firestrap'

const STATUS_COLORS = {
  pending:   'warning',
  approved:  'success',
  rejected:  'danger',
} as const

export default function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Grid
      dataArray={orders}              // dati in memoria invece di dataStoragePath
      columns={[
        {
          key: 'status',
          label: 'Stato',
          onDisplay: ({ value }) => (
            <Badge variant={STATUS_COLORS[value] ?? 'secondary'}>
              {value}
            </Badge>
          ),
        },
        {
          key: 'amount',
          label: 'Importo',
          onDisplay: ({ value }) => `€ ${Number(value).toFixed(2)}`,
        },
        {
          key: 'customer.name',       // dot notation anche nelle colonne
          label: 'Cliente',
        },
        {
          key: 'createdAt',
          label: 'Data',
          onDisplay: 'toDate',        // converter built-in
        },
      ]}
      groupBy="status"
      allowedSorting
      type="table"
      onClick={(record) => navigate(`/orders/${record._key}`)}
    />
  )
}
```

**Converter built-in usabili come stringa in `onDisplay`:**
- `toDate` — timestamp → data formattata
- `toCamel` — snake_case → camelCase
- `toSnake` — camelCase → snake_case
- `toKebab` — camelCase → kebab-case

---

## Pattern 6 — Select da database

```tsx
{/* opzioni caricate da Firebase in tempo reale */}
<Select
  name="categoryId"
  label="Categoria"
  db={{
    path: "/categories",
    labelField: "name",
    valueField: "_key",       // _key = chiave Firebase del record
    where: { active: true },  // filtra solo categorie attive
    order: { name: "asc" },
  }}
/>

{/* autocomplete con ricerca */}
<Select.Autocomplete
  name="userId"
  label="Utente"
  db={{ path: "/users", labelField: "email" }}
/>

{/* multi-selezione */}
<Select.Checklist
  name="permissions"
  label="Permessi"
  options={[
    { label: "Lettura",    value: "read" },
    { label: "Scrittura",  value: "write" },
    { label: "Admin",      value: "admin" },
  ]}
/>
```

---

## Pattern 7 — FormRef (controllo esterno del form)

Per controllare il form da fuori (es. bottone salva in un header separato).

```tsx
import { useRef } from 'react'
import { Form, FormRef, Input } from 'react-firestrap'

export default function UserEdit() {
  const formRef = useRef<FormRef>(null)

  const handleExternalSave = async () => {
    const success = await formRef.current?.handleSave()
    if (success) console.log('salvato')
  }

  // record corrente senza salvare
  const getCurrentData = () => {
    return formRef.current?.getRecord()
  }

  return (
    <>
      <button onClick={handleExternalSave}>Salva dall'esterno</button>

      <Form ref={formRef} dataStoragePath="/users">
        <Input name="name" label="Nome" />
      </Form>
    </>
  )
}
```

**FormRef API completa:**
```typescript
formRef.current?.handleSave(e?)    // → Promise<boolean>
formRef.current?.handleDelete(e?)  // → Promise<boolean>
formRef.current?.getRecord()       // → { record, isNewRecord }
formRef.current?.getHeader()       // → ReactNode
formRef.current?.getFooter()       // → ReactNode
```

---

## Pattern 8 — AI nel form

```tsx
import { Prompt, PromptMode } from 'react-firestrap'

<Form dataStoragePath="/articles">
  <Input name="title" label="Titolo" required />

  {/* campo che genera contenuto via AI e lo salva nel record */}
  <Prompt
    name="content"
    label="Contenuto"
    mode={PromptMode.LIVE}
    prompt="Scrivi un articolo su: {title}"     // {title} interpola dal record corrente
    model="gemini-pro"
    temperature={0.7}
  />
</Form>
```

**`PromptMode.EDITOR`** — mostra UI per configurare prompt, modello, temperatura  
**`PromptMode.LIVE`** — esegue il prompt e scrive il risultato nel campo

---

## Anti-pattern da evitare

```tsx
// ❌ NON gestire lo stato del form manualmente
const [name, setName] = useState('')
const [email, setEmail] = useState('')
// → usa <Form> con <Input name="name"> e lascia che gestisca lo stato

// ❌ NON importare db direttamente nei componenti
import db from '../libs/database'
const data = await db.read('/users/123')
// → usa <Form dataStoragePath="/users"> oppure useDataProvider() (v2)

// ❌ NON duplicare la logica di salvataggio
const handleSave = async () => {
  await firebase.database().ref('/users').set(data)
}
// → usa Form.onSave per trasformazioni, il salvataggio lo gestisce il form

// ❌ NON usare Bootstrap classes direttamente nei componenti custom
<div className="d-flex justify-content-between">
// → usa le classi del tema via useTheme() oppure (v2) classi Tailwind
```
