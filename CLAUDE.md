# react-firestrap — AI Reference

Framework React per UI data-driven. Schema-driven: definisci i campi → ottieni UI + persistenza con pochissimo codice.

**Branch attivo:** `modernize` (v2 in sviluppo — vedi `docs/ROADMAP.md`)  
**Stack attuale:** React 18 + Firebase Realtime DB + Tailwind CSS (Bootstrap compatibility layer)  
**Stack target v2:** React 18 + DataProvider pattern + shadcn/ui + Tailwind

> **CR-004 in corso:** Bootstrap è stato rimosso come dipendenza runtime. Il CSS è ora generato da Tailwind v4  
> tramite `@layer components` che ricrea le stesse classi Bootstrap (`.btn`, `.badge`, `.alert`, `.modal`, ecc.).  
> I consumer devono importare `react-firestrap/dist/index.css` una sola volta.

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
  providers/     ← Ports & Adapters: interfacce + implementazioni concrete, per dominio
    data/        ← DataProvider interface + FirebaseDataProvider
    storage/     ← StorageProvider interface + FirebaseStorageProvider, dropbox.tsx
    auth/        ← AuthProvider interface + google/GoogleAuthProvider
    email/       ← EmailProvider interface + google/GmailEmailProvider
    ai/          ← AI multi-provider (OpenAI/Gemini/Anthropic/DeepSeek/Mistral)
    seo/         ← Google Ads keyword, Trends
    scrape/      ← SerpAPI scraping
    firebase-init.ts  ← inizializzazione Firebase app
  integrations/  ← stub backward-compat (re-export da providers/) — non modificare
  types/         ← TypeScript types e interfaces (ex models/)
  models/        ← stub backward-compat (re-export da types/) — non modificare
  libs/          ← utilities pure senza dipendenze React (converter, path, sanitizer, cache…)
  conf/          ← configurazioni statiche (prompt templates)
  Theme.tsx      ← sistema tema via React Context
  Config.tsx     ← ConfigProvider: Firebase, Google OAuth, AI, Dropbox
  Global.tsx     ← stato globale localStorage-backed
  App.tsx        ← entry point con routing e provider
```

**Regola di dipendenza:** `libs/` non conosce React · `components/` non importa da `providers/` direttamente · tutto fluisce verso l'alto  
**Nota:** `integrations/` e `models/` sono stub di backward-compat — tutta la logica è in `providers/` e `types/`.

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

## Tema e icone - App managed

```tsx
// Uso semplice: App orchestra registry interni e default.
<App
  firebaseConfig={config.firebase}
  iconProvider="phosphor" // default: lucide
  themeProvider="cyber"   // default: default
  menuConfig={menuConfig}
  importPage={(path) => import(path)}
/>

// Uso avanzato: aggiungi o sovrascrivi provider e preset built-in.
<App
  iconProvider={{
    default: 'heroicons',
    providers: { heroicons: new HeroIconProvider() },
    aliases: { delete: 'trash', edit: 'pencil' },
  }}
  themeProvider={{
    defaultMode: 'dark',
    defaultPreset: 'brand',
    presets: {
      brand: {
        primary: '346.8 77.2% 49.8%',
        radius: 0.75,
        theme: { Button: { className: 'font-semibold' } },
      },
    },
    theme: { Modal: { size: 'xl' } },
  }}
/>

const theme = useThemeController()
theme.applyPreset('flat')
theme.setMode('dark')

const icons = useIconController()
icons.setProvider('lucide')
```

Built-in icon provider: `lucide`, `phosphor`.
Built-in theme preset: `default`, `flat`, `cyber`.
`importTheme={() => import('./my-theme')}` resta supportato come override legacy asincrono finale.

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

## Provider Registry (CR-002 / CR-002b)

Tutti i provider seguono il pattern **Ports & Adapters**: un'interfaccia (port) + implementazioni concrete (adapters) iniettate via React Context.

### Configurazione base (shorthand — backward compat)

```tsx
import { App } from 'react-firestrap'
import { FirebaseDataProvider } from 'react-firestrap/providers/data/firebase'
import { GmailEmailProvider } from 'react-firestrap/providers/email/google/GmailEmailProvider'

<App
  dataProvider={new FirebaseDataProvider()}
  emailProvider={new GmailEmailProvider()}
  ...
/>
```

### Configurazione multi-provider (Named Registry)

Registra più provider dello stesso tipo, seleziona quale usare per ogni operazione:

```tsx
import { SupabaseDataProvider } from './my-providers/SupabaseDataProvider'

<App
  providers={{
    data: {
      firebase: new FirebaseDataProvider(),
      supabase: new SupabaseDataProvider(),
    },
    email: {
      gmail: new GmailEmailProvider(),
    },
  }}
  defaultProviders={{
    data: process.env.REACT_APP_DATA_PROVIDER || 'firebase',
  }}
  ...
/>
```

### Consumo nei componenti

```tsx
import { useDataProvider, useAuthProvider, useStorageProvider, useEmailProvider } from 'react-firestrap'

// provider di default
const data = useDataProvider()

// provider specifico per nome
const supabase = useDataProvider('supabase')

// provider opzionali (tornano null se non configurati)
const storage = useStorageProvider()        // null se non configurato
const email   = useEmailProvider('gmail')   // null se 'gmail' non registrato
```

### Implementare un provider custom

```typescript
// my-providers/SupabaseDataProvider.ts
import { DataProvider, RecordData, RecordArray } from 'react-firestrap'

export class SupabaseDataProvider implements DataProvider {
  async get(path: string, id: string): Promise<RecordData> { /* ... */ }
  async list(path: string): Promise<RecordArray> { /* ... */ }
  async save(path: string, id: string, data: RecordData): Promise<void> { /* ... */ }
  async delete(path: string, id: string): Promise<void> { /* ... */ }
  subscribe(path: string, cb: (data: RecordArray) => void): () => void { /* ... */ }
}
```

### Interfacce disponibili

| Interfaccia | Path | Obbligatorio |
|-------------|------|--------------|
| `DataProvider` | `providers/data/DataProvider.ts` | sì (fallback: FirebaseDataProvider) |
| `StorageProvider` | `providers/storage/StorageProvider.ts` | no (null se assente) |
| `AuthProvider` | `providers/auth/AuthProvider.ts` | sì (fallback: GoogleAuthProvider) |
| `EmailProvider` | `providers/email/EmailProvider.ts` | no (null se assente) |

---

## Dove cercare

| Cosa stai cercando | Dove guardare |
|--------------------|---------------|
| Come funziona Form | `src/components/widgets/Form.tsx` |
| Come funziona Grid | `src/components/widgets/Grid.tsx` |
| Un campo specifico | `src/components/ui/fields/` |
| Logica Firebase DB | `src/providers/data/firebase/` |
| Logica Firebase Storage | `src/providers/storage/firebase/` |
| Interfaccia DataProvider | `src/providers/data/DataProvider.ts` |
| Interfaccia AuthProvider | `src/providers/auth/AuthProvider.ts` |
| Interfaccia EmailProvider | `src/providers/email/EmailProvider.ts` |
| Integrazione AI | `src/providers/ai/index.ts` |
| Auth Google (UI + token) | `src/providers/auth/google/` |
| Email Gmail | `src/providers/email/google/GmailEmailProvider.ts` |
| Scraping | `src/providers/scrape/index.ts` |
| SEO / Keywords | `src/providers/seo/google/` |
| Utilities pure | `src/libs/` |
| Sistema tema | `src/Theme.tsx` |
| Configurazione app | `src/Config.tsx` |
| Tipi e interfaces | `src/types/` |

---

## Piano di modernizzazione v2

In corso sul branch `modernize`. Vedi `docs/CHANGE_REQUESTS.md` per i dettagli.

| CR | Descrizione | Stato |
|----|-------------|-------|
| CR-001 | Documentazione AI-first (questo file) | ✅ done |
| CR-002 | Provider abstraction layer (DataProvider, StorageProvider + Named Registry) | ✅ done |
| CR-002b | AuthProvider + EmailProvider interface + Named Registry | ✅ done |
| CR-003 | TypeScript strict | ⬜ todo |
| CR-004 | shadcn/ui + Tailwind (rimpiazza Bootstrap) | 🔄 in progress |
| CR-005 | CLI aggiornato | ⬜ todo |
| CR-006 | Batterie di test (unit + integration contract + component) | ⬜ todo |
| CR-007 | Showcase app con tutti i componenti e corner case | ⬜ todo |
