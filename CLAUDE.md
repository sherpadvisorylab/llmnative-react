# @llmnative/react — AI Reference

Framework React AI-first per generazione deterministica di UI. Data-driven di default, schema-driven opzionale. Ottimizzato per il minimo consumo di token AI.

**Branch attivo:** `main`
**Stack attuale:** React 18 + Vite library build + DataProvider pattern + Tailwind CSS compatibility layer

> **CR-004 completata come compatibility layer:** Bootstrap e' stato rimosso come dipendenza runtime. Il CSS e' ora generato da Tailwind v4  
> tramite `@layer components` che ricrea le stesse classi Bootstrap (`.btn`, `.badge`, `.alert`, `.modal`, ecc.).  
> I consumer devono importare `@llmnative/react/dist/index.css` una sola volta.
>
> **CR-015:** la build root e lo scaffolding ufficiale sono Vite-first.

---

## Struttura cartelle

```
src/
  components/
    ui/          ← primitivi: Alert, Badge, Button, Card, Icon, Image, Loader, Modal,
    │               Pagination, Table, Gallery, Tab, Repeat, GridSystem
    ui/fields/   ← form fields: Input, Select, Upload, Prompt, AssistantAI, UploadCSV
    blocks/      ← composizioni: Menu, Brand, Breadcrumbs, Notifications, Search, Carousel
    widgets/     ← smart components: Form, Grid, MarkdownReader, ImageEditor
    Component.tsx   ← FieldAdapter pattern per schema-driven forms
    FormEnhancer.tsx
    Template.tsx
  providers/     ← Ports & Adapters: interfacce + implementazioni concrete, per dominio
    data/        ← DataProviderAdapter contract + FirebaseDataProvider, MockDataProvider, SupabaseDataProvider
    storage/     ← StorageProviderAdapter contract + FirebaseStorageProvider, SupabaseStorageProvider, dropbox.tsx
    auth/        ← AuthProviderAdapter contract + google/GoogleAuthProvider
    email/       ← EmailProviderAdapter contract + google/GmailEmailProvider
    ai/          ← AI multi-provider (OpenAI/Gemini/Anthropic/DeepSeek/Mistral)
    seo/         ← Google Ads keyword, Trends
    scrape/      ← SerpAPI scraping
    firebase-init.ts  ← inizializzazione Firebase app
  types/         ← TypeScript types e interfaces (ex models/)
  libs/          ← utilities pure senza dipendenze React (converter, path, sanitizer, cache…)
  conf/          ← configurazioni statiche (prompt templates)
  Theme.tsx      ← sistema tema via React Context
  Config.tsx     ← RuntimeProvider: tenant config, Firebase, Google OAuth, AI, Dropbox
  Global.tsx     ← stato globale localStorage-backed
  App.tsx        ← entry point con routing e provider
```

## Toolchain

```bash
npm run build         # Vite library mode: dist/index.mjs, dist/index.js, dist/index.css + types
npm run build:dev     # Vite development build + declarations
npm run watch:dev     # Vite build in watch mode
npm run test          # Vitest
```

Lo scaffold ufficiale genera app Vite:

```bash
npx @llmnative/react create
npx @llmnative/react create --yes --provider=mock
npx @llmnative/react devtools
```

Lo scaffold crea `index.html`, `vite.config.ts`, `src/index.tsx`, `src/conf/`, `src/layouts/`,
`src/pages/`, `src/sections/`, `src/components/`, `src/data/`, `src/styles/globals.css` e provider config tramite env `VITE_*`.

`clients/showcase` segue lo stesso modello scaffold-first: Vite, entry unica `src/index.tsx`, menu unico
`src/conf/menu.ts`, layout in `src/layouts/ShowcaseLayout.tsx`, tema e icone gestiti da `<App>`.

Le pagine testuali della sezione Docs dello showcase sono generate dai Markdown in `docs/` con frontmatter
`title`, `group`, `order`, `path`, `description`. I link relativi `.md` vengono riscritti in route interne
dallo showcase. Le pagine componenti/live restano TSX. Vedi `docs/README.md` per la convenzione contributor.

**Regola di dipendenza:** `libs/` non conosce React · `components/` non importa da `providers/` direttamente · tutto fluisce verso l'alto  
**Nota verificata 2026-05-08:** `src/integrations/` e `src/models/` non esistono piu' in questa codebase. Le API pubbliche correnti passano da `providers/`, `types/`, `Head.tsx`, `Theme.tsx` e `App.tsx`.

---

## Naming conventions

- `view`: data/content representation
- `appearance`: visual shell
- `layout`: spatial arrangement
- `mode`: operational behavior
- `variant`: semantic tone
- `position`: anchor point
- `size`: scale/dimension

### Regola AI-first

Ogni public prop deve usare il nome piu' esplicito possibile per un agente AI.  
Non usare sinonimi intercambiabili se descrivono concetti diversi.

- Usa `view` quando il componente cambia forma di presentazione del contenuto:
  - `table | gallery`
  - `list | carousel`
- Usa `appearance` quando cambia il guscio visuale del componente:
  - `card | plain`
  - `button | avatar`
- Usa `layout` solo quando cambia la disposizione spaziale interna:
  - `vertical | horizontal | inline`
  - `split | stacked`
- Usa `mode` solo quando cambia il comportamento operativo:
  - `editor | live`
  - `light | dark | system`
- Usa `variant` per tono semantico o cromatico:
  - `primary | secondary | danger`
- Usa `position` per ancoraggio o comparsa:
  - `center | left | right | top | bottom`
- Usa `size` per scala o dimensione:
  - `sm | md | lg | xl | fullscreen`

### Decisione di pulizia

Il framework preferisce rename espliciti e puliti rispetto a alias o layer di compatibilita'.  
Se un nome pubblico e' ambiguo, si corregge direttamente nella CR dedicata.

---

## Pattern 1 — Grid CRUD (il più comune)

```tsx
import { Grid } from '@llmnative/react'

// Lista con add/edit/delete, modal automatico, real-time updates
export default function UserList() {
  return (
    <Grid
      path="/users"
      columns={[
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Ruolo', render: ({ value }) => <Badge>{value}</Badge> },
      ]}
      actions={["add", "edit", "delete"]}
      layout="table"
      pagination={{ limit: 20 }}
    />
  )
}
```

---

## Pattern 2 — Form standalone

```tsx
import { Form, Input, Select } from '@llmnative/react'

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
  path="/orders"
  columns={[
    { key: 'status', label: 'Stato', render: ({ value }) => {
      const colors = { pending: 'warning', done: 'success', failed: 'danger' }
      return <Badge variant={colors[value]}>{value}</Badge>
    }},
    { key: 'amount', label: 'Importo', render: ({ value }) => `€ ${value.toFixed(2)}` },
    { key: 'createdAt', label: 'Creato', render: 'date' },
  ]}
  groupBy="status"
/>
```

**Renderer built-in:** `text`, `email`, `date`, `datetime`, `badge`, `image`, `boolean`, `json`.

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
| `path` | `string \| "fromUrl"` | Path provider-backed |
| `records` | `RecordArray` | Dati in memoria (alternativa al provider) |
| `columns` | `Column[]` | Definizione colonne con `key`, `label`, `sortable`, `render` |
| `actions` | `Array<"add"\|"edit"\|"delete"> \| Record<string, GridAction>` | Azioni abilitate o custom |
| `layout` | `"table"\|"gallery"` | Tipo di visualizzazione |
| `groupBy` | `string \| string[]` | Raggruppa per campo |
| `pagination` | `{ limit: number }` | Paginazione |
| `sortable` | `boolean \| OrderConfig` | Sorting globale |
| `form` | `ReactElement \| ((ctx) => ReactNode)` | Form condiviso per CRUD |
| `onSave` | `async ({ record, action }) => string` | Hook prima del salvataggio |
| `onAfterAction` | `async ({ record, action }) => boolean` | Dopo create/update/delete |

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
  providers={{
    firebase: config.firebase,
    google: config.google,
    services: { data: 'dbRealtime', storage: 'firestorage', auth: 'googleAuth' },
  }}
  iconProvider="phosphor" // default: lucide
  themeProvider="cyber"   // default: default
  menuConfig={menuConfig}
  importPage={(path) => import(path)}
/>

// Uso avanzato: aggiungi o sovrascrivi provider e temi built-in.
// defaultMotion/defaultComponents arrivano dal tema di base scelto come riferimento.
<App
  iconProvider={{
    providers: {
      heroicons: new HeroIconProvider(),
    },
    default: 'heroicons',
    aliases: { delete: 'trash', edit: 'pencil' },
  }}
  themeProvider={{
    defaultMode: 'dark',
    theme: 'brand',
    themes: {
      brand: {
        preset: {
          mode: 'dark',
          colors: { primary: '346.8 77.2% 49.8%' },
          radius: 0.75,
        },
        motion: defaultMotion,
        components: {
          ...defaultComponents,
          ActionButton: { ...defaultComponents.ActionButton, className: 'btn-primary font-semibold' },
        },
      },
    },
    themeOverride: { Modal: { size: 'xl' } },
  }}
/>

const theme = useThemeController()
theme.applyTheme('flat')
theme.setMode('dark')

const icons = useIconController()
icons.setProvider('lucide')
```

Built-in icon provider: `lucide`, `phosphor`.
Built-in themes: `default`, `flat`, `cyber`.
`themeProvider` e `iconProvider` sono la configurazione raccomandata per temi, provider custom e alias.

---

## AI integration

```tsx
import { AI } from '@llmnative/react'

// Risposta testuale
const text = await AI.fetch("Scrivi un titolo per: {keyword}", { keywords: ["React"] })

// JSON strutturato
const items = await AI.json("Lista di 5 categorie per un blog tech")

// Array di stringhe
const tags = await AI.array("5 tag per: machine learning")
```

Provider configurati in `Config.tsx` via `AIConfig` (geminiApiKey, openaiApiKey, anthropicApiKey, deepSeekApiKey, mistralApiKey).

---

## Provider Registry (CR-002 / CR-002b / CR-020)

Tutti i provider seguono il pattern **Ports & Adapters**: un'interfaccia (port) + implementazioni concrete (adapters) selezionate da `<App providers={{ ... }}>`.

### Configurazione dichiarativa

```tsx
import { App } from '@llmnative/react'

<App
  providers={{
    firebase: { config: firebaseConfig },
    google: { oAuth2: googleOAuth2 },
    gmail: { enabled: true },
    services: {
      data: 'firebase',
      storage: 'firebase',
      auth: 'google',
      email: 'gmail',
    },
  }}
/>
```

### Configurazione multi-provider

Registra piu' backend e seleziona quale usare per ogni servizio:

```tsx
<App
  providers={{
    mock: {
      data: mockData,
    },
    firebase: {
      config: firebaseConfig,
    },
    supabase: {
      config: supabaseConfig,
    },
    services: {
      data: import.meta.env.VITE_PROVIDER || 'mock',
      storage: 'firebase',
      auth: 'google',
    },
  }}
/>
```

### Consumo nei componenti

```tsx
import { useDataProvider, useAuthProvider, useStorageProvider, useEmailProvider } from '@llmnative/react'

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
// my-providers/RestDataProvider.ts
import { DataProviderAdapter, RecordArray } from '@llmnative/react'

export class RestDataProvider implements DataProviderAdapter {
  async read(path: string): Promise<any> { /* ... */ }
  async set(path: string, data: object): Promise<void> { /* ... */ }
  async update(path: string, data: object): Promise<void> { /* ... */ }
  async remove(path: string): Promise<void> { /* ... */ }
  subscribe(path: string | undefined, callback: (records: RecordArray) => void): () => void {
    // Return a cleanup function if the provider polls/subscribes.
    return () => undefined
  }
}
```

### Interfacce disponibili

| Interfaccia | Path | Obbligatorio |
|-------------|------|--------------|
| `DataProviderAdapter` | `providers/data/DataProvider.ts` | sì (fallback: MockDataProvider) |
| `StorageProviderAdapter` | `providers/storage/StorageProvider.ts` | no (null se assente) |
| `AuthProviderAdapter` | `providers/auth/AuthProvider.ts` | sì (fallback: GoogleAuthProvider) |
| `EmailProviderAdapter` | `providers/email/EmailProvider.ts` | no (null se assente) |

StorageProvider reale:

```typescript
export interface StorageProviderAdapter {
  upload(file: string, path: string): Promise<string | undefined>
  getURL(path: string): Promise<string | undefined>
  download(path: string): Promise<Blob | undefined>
  delete(path: string): Promise<boolean>
}
```

---

## Dove cercare

| Cosa stai cercando | Dove guardare |
|--------------------|---------------|
| Come funziona Form | `src/components/widgets/Form.tsx` |
| Come funziona Grid | `src/components/widgets/Grid.tsx` |
| Un campo specifico | `src/components/ui/fields/` |
| Logica Firebase DB | `src/providers/data/firebase.ts` |
| Logica Firebase Storage | `src/providers/storage/firebase.ts` |
| Contratto DataProviderAdapter | `src/providers/data/DataProvider.ts` |
| Contratto AuthProviderAdapter | `src/providers/auth/AuthProvider.ts` |
| Contratto EmailProviderAdapter | `src/providers/email/EmailProvider.ts` |
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
| CR-002b | AuthProviderAdapter + EmailProviderAdapter contracts + named provider config | ✅ done |
| CR-003 | TypeScript strict | ✅ done |
| CR-004 | Tailwind compatibility layer (Bootstrap runtime rimosso) | ✅ done |
| CR-005 | CLI aggiornato | ⬜ todo / da riconciliare con CR-015 |
| CR-006 | Batterie di test (unit + integration contract + component) | 🔄 in progress |
| CR-007 | Showcase app con tutti i componenti e corner case | 🔄 in progress |
| CR-015 | Vite toolchain framework + scaffolding | ✅ done |
| CR-016 | Showcase Vite + scaffold-first | ✅ done |
| CR-017 | App-managed theme + icon registries | ✅ done |

---
## Session state

> Aggiornato automaticamente alla fine di ogni sessione AI.
> Il piano completo vive in `docs/COMPETITIVENESS_CHECKLIST.md`.

**Ultimo task completato:** Naming finale: `@llmnative/react` (LLM Native).
**Prossimo task:** npm publish (2FA bypass token needed).
**Branch:** `main`
**Repo:** `github.com/sherpadvisorylab/llmnative-react.git`

### Progresso checklist

| Area | Completamento |
|------|--------------|
| P0 — Bloccanti | 0/5 sezioni |
| P1 — Differenziatori | 0/6 sezioni |
| P2 — Feature parity | 0/4 sezioni |
| P3 — Qualità e trust | 0/5 sezioni |
| P4 — Ecosistema | 0/3 sezioni |
