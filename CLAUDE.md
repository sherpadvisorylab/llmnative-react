# react-firestrap — AI Reference

Framework React per UI data-driven. Schema-driven: definisci i campi → ottieni UI + persistenza con pochissimo codice.

**Branch attivo:** `modernize` (v2 in sviluppo — vedi `docs/ROADMAP.md`)  
**Stack attuale:** React 18 + Firebase Realtime DB + Bootstrap  
**Stack target v2:** React 18 + DataProvider pattern + shadcn/ui + Tailwind

---

## Struttura cartelle

```
src/
  components/
    ui/          ← primitivi: Alert, Badge, Button, Card, Icon, Image, Loader, Modal,
    │               Pagination, Table, Gallery, Tab, Repeat, GridSystem
    ui/fields/   ← form fields: Input, Select, Upload, Prompt, AssistantAI, UploadCSV
    blocks/      ← composizioni: Menu, Brand, Breadcrumbs, Notifications, Search, Carousel
    widgets/     ← smart components: Form, Grid, ImageEditor
    Component.tsx   ← FieldAdapter pattern per schema-driven forms
    FormEnhancer.tsx
    Template.tsx
  integrations/  ← Firebase, AI (OpenAI/Gemini/Anthropic/DeepSeek/Mistral), Dropbox, Scrape
  libs/          ← utilities pure senza dipendenze React (converter, path, sanitizer, cache…)
  models/        ← TypeScript types e interfaces
  conf/          ← configurazioni statiche (prompt templates)
  Theme.tsx      ← sistema tema via React Context
  Config.tsx     ← ConfigProvider: Firebase, Google OAuth, AI, Dropbox
  Global.tsx     ← stato globale localStorage-backed
  App.tsx        ← entry point con routing e provider
```

**Regola di dipendenza:** `libs/` non conosce React · `components/` non importa da `integrations/` direttamente · tutto fluisce verso l'alto

---

## Pattern 1 — Grid CRUD (il più comune)

```tsx
import { Grid } from 'react-firestrap'

// Lista con add/edit/delete, modal automatico, real-time updates
export default function UserList() {
  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name', label: 'Nome', sort: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Ruolo', onDisplay: ({ value }) => <Badge>{value}</Badge> },
      ]}
      allowedActions={["add", "edit", "delete"]}
      modal={{ mode: "form" }}
      type="table"
      pagination={{ perPage: 20 }}
    />
  )
}
```

---

## Pattern 2 — Form standalone

```tsx
import { Form, Input, Select } from 'react-firestrap'

// Carica da Firebase, salva su Firebase, validazione built-in
export default function UserForm() {
  return (
    <Form
      dataStoragePath="/users"     // path collezione
      aspect="card"
      showBack
    >
      <Input name="name" label="Nome" required />
      <Input name="email" label="Email" inputType="email" />
      <Select
        name="role"
        label="Ruolo"
        options={[
          { label: "Admin", value: "admin" },
          { label: "User", value: "user" },
        ]}
      />
    </Form>
  )
}
```

---

## Pattern 3 — Form con oggetti annidati e array

```tsx
// dot notation → oggetto annidato
<Input name="address.city" label="Città" />
<Input name="address.zip" label="CAP" />

// array index notation → array
<Input name="items.0.name" label="Primo elemento" />
<Input name="items.1.name" label="Secondo elemento" />

// Repeat per array dinamici
<Repeat name="items" defaultLength={3}>
  {(index) => <Input name={`items.${index}.name`} label={`Item ${index + 1}`} />}
</Repeat>
```

---

## Pattern 4 — Grid con formatter colonne personalizzati

```tsx
<Grid
  dataStoragePath="/orders"
  columns={[
    { key: 'status', label: 'Stato', onDisplay: ({ value }) => {
      const colors = { pending: 'warning', done: 'success', failed: 'danger' }
      return <Badge variant={colors[value]}>{value}</Badge>
    }},
    { key: 'amount', label: 'Importo', onDisplay: ({ value }) => `€ ${value.toFixed(2)}` },
    { key: 'createdAt', onDisplay: 'toDate' },   // converter built-in
  ]}
  groupBy="status"
  allowedSorting
/>
```

**Converter built-in:** `toDate`, `toCamel`, `toSnake`, `toKebab` — usabili come stringa in `onDisplay`.

---

## Pattern 5 — Form con callbacks lifecycle

```tsx
<Form
  dataStoragePath="/products"
  onLoad={(data) => ({ ...data, price: data.price / 100 })}        // trasforma prima del render
  onSave={async ({ record }) => ({ ...record, price: record.price * 100 })}  // trasforma prima del salvataggio
  onFinally={async ({ action }) => {
    if (action === 'save') navigate('/products')
  }}
  setPrimaryKey={() => `prod_${Date.now()}`}   // chiave custom
>
  <Input name="title" label="Titolo" required />
  <Input name="price" label="Prezzo (€)" inputType="number" />
</Form>
```

---

## Form — Props chiave

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `dataStoragePath` | `string` | Path Firebase della collezione o del record |
| `aspect` | `"card" \| "none"` | Wrapper visuale |
| `showBack` | `boolean` | Mostra bottone indietro |
| `onLoad` | `(data) => data` | Trasforma i dati dopo il caricamento |
| `onSave` | `async ({ record }) => record` | Trasforma i dati prima del salvataggio |
| `onDelete` | `async ({ record }) => void` | Hook prima della cancellazione |
| `onFinally` | `async ({ action }) => boolean` | Dopo save/delete (action: 'save'\|'delete') |
| `setPrimaryKey` | `() => string` | Generatore chiave primaria custom |
| `savePath` | `(record) => string` | Path salvataggio custom |
| `defaultValues` | `object` | Valori iniziali per nuovo record |

---

## Grid — Props chiave

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `dataStoragePath` | `string` | Path Firebase (real-time listener automatico) |
| `dataArray` | `RecordArray` | Dati in memoria (alternativa a Firebase) |
| `columns` | `Column[]` | Definizione colonne con `key`, `label`, `sort`, `onDisplay` |
| `allowedActions` | `Array<"add"\|"edit"\|"delete">` | Azioni abilitate |
| `modal` | `{ mode: "form"\|"empty", size?, position? }` | Configurazione modal |
| `type` | `"table"\|"gallery"` | Tipo di visualizzazione |
| `groupBy` | `string \| string[]` | Raggruppa per campo |
| `pagination` | `{ perPage: number }` | Paginazione |
| `allowedSorting` | `boolean` | Abilita sorting su colonne |
| `onLoadRecord` | `(record, index) => record \| false` | Filtra/trasforma record in ingresso |
| `onSave` | `async ({ record, action }) => string` | Hook dopo salvataggio |
| `onFinally` | `async ({ record, action }) => boolean` | Dopo ogni operazione |

---

## Input — Tipi disponibili

```tsx
<Input name="x" />                           // stringa (default)
<Input name="x" inputType="number" />
<Input name="x" inputType="email" />
<Input name="x" inputType="password" />
<Input name="x" inputType="color" />
<Input name="x" inputType="date" />
<Input name="x" inputType="datetime-local" />
<Input name="x" inputType="time" />
<Input name="x" inputType="week" />
<Input name="x" inputType="month" />
```

---

## Select — Varianti

```tsx
// Array statico
<Select name="role" options={[{ label: "Admin", value: "admin" }]} />

// Da Firebase
<Select name="categoryId" db={{ path: "/categories", labelField: "name", valueField: "_key" }} />

// Autocomplete
<Select.Autocomplete name="userId" db={{ path: "/users", labelField: "email" }} />

// Multi-selezione
<Select.Checklist name="tags" options={[...]} />
```

---

## Upload — Varianti

```tsx
<Upload name="avatar" label="Foto" />                    // generico
<Upload.Image name="cover" label="Immagine copertina" /> // con crop
<Upload.Document name="pdf" label="Documento" />
<UploadCSV name="data" label="Importa CSV" />
```

---

## Tema — personalizzazione

```tsx
// App.tsx
<App
  firebaseConfig={config.firebase}
  importTheme={() => import('./my-theme')}   // lazy import del tema custom
  menuConfig={menuConfig}
  importPage={(path) => import(path)}
/>

// my-theme.ts — sovrascrive solo le chiavi che vuoi
export const theme = {
  Form: { buttonSaveClass: 'btn btn-primary px-5' },
  Grid: { Table: { wrapperClass: 'table-responsive shadow' } },
}
```

---

## AI integration

```tsx
import { AI } from 'react-firestrap'

// Risposta testuale
const text = await AI.fetch("Scrivi un titolo per: {keyword}", { keywords: ["React"] })

// JSON strutturato
const items = await AI.json("Lista di 5 categorie per un blog tech")

// Array di stringhe
const tags = await AI.array("5 tag per: machine learning")
```

Provider configurati in `Config.tsx` via `AIConfig` (geminiApiKey, openaiApiKey, anthropicApiKey, deepSeekApiKey, mistralApiKey).

---

## Dove cercare

| Cosa stai cercando | Dove guardare |
|--------------------|---------------|
| Come funziona Form | `src/components/widgets/Form.tsx` |
| Come funziona Grid | `src/components/widgets/Grid.tsx` |
| Un campo specifico | `src/components/ui/fields/` |
| Logica Firebase DB | `src/integrations/google/firedatabase.ts` |
| Logica Firebase Storage | `src/integrations/google/firestorage.ts` |
| Integrazione AI | `src/integrations/ai.ts` |
| Utilities pure | `src/libs/` |
| Sistema tema | `src/Theme.tsx` |
| Configurazione app | `src/Config.tsx` |
| Tipi e interfaces | `src/models/` |

---

## Piano di modernizzazione v2

In corso sul branch `modernize`. Vedi `docs/CHANGE_REQUESTS.md` per i dettagli.

| CR | Descrizione | Stato |
|----|-------------|-------|
| CR-001 | Documentazione AI-first (questo file) | 🔄 in progress |
| CR-002 | Provider abstraction layer (DataProvider interface) | ⬜ todo |
| CR-003 | TypeScript strict | ⬜ todo |
| CR-004 | shadcn/ui + Tailwind (rimpiazza Bootstrap) | ⬜ todo |
| CR-005 | CLI aggiornato | ⬜ todo |
| CR-006 | Batterie di test (unit + integration contract + component) | ⬜ todo |
| CR-007 | Showcase app con tutti i componenti e corner case | ⬜ todo |
