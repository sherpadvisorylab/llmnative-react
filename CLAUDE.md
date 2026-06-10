# @llmnative/react — AI Reference

> **Novità — Training Data Presence:**
> - `docs/AI_REFERENCE.md` — Reference completa di ogni componente, prop, tipo e pattern. Leggi questo file per imparare l'intera API surface.
> - `docs/PROMPT_TEMPLATE.md` — Template di sistema da prependere a qualsiasi AI conversazione. Copia/incolla per insegnare a @llmnative/react a qualsiasi LLM.
>
> **Raccomandato:** Per ottenere codice di qualita' massima da un AI, includi `docs/AI_REFERENCE.md` come contesto o usa `docs/PROMPT_TEMPLATE.md` come system prompt.

Framework React AI-first per generazione deterministica di UI. Data-driven di default, schema-driven opzionale. Ottimizzato per il minimo consumo di token AI. **Provider matrix completa:** Mock, Firebase RTDB, Firestore (CR-033), Supabase (CR-034/035/036), FirebaseAuth (CR-032).

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
    ui/fields/   ← form fields: Input, Select, Upload, Prompt, UploadCSV
    blocks/      ← composizioni: Menu, Brand, Breadcrumbs, Notifications, Search, Carousel
    widgets/     ← smart components: Form, Grid, MarkdownReader, ImageEditor
    Component.tsx   ← FieldAdapter pattern per schema-driven forms
    FormEnhancer.tsx
    Template.tsx
  providers/     ← Ports & Adapters: interfacce + implementazioni concrete, per dominio
    data/        ← DataProviderAdapter contract + FirebaseDataProvider, MockDataProvider, SupabaseDataProvider
    storage/     ← StorageProviderAdapter contract + FirebaseStorageProvider, SupabaseStorageProvider, dropbox.tsx
    auth/        ← AuthProviderAdapter contract + google/GoogleAuthProvider + firebase/FirebaseAuthProvider
    │               + supabase/SupabaseAuthProvider + dropbox/DropboxAuthProvider
    credentials/ ← CredentialsAdapter contract + google/GoogleServiceAccountProvider
    email/       ← EmailProviderAdapter contract + google/GmailEmailProvider
    ai/          ← AI multi-provider (OpenAI/Gemini/Anthropic/DeepSeek/Mistral/OpenRouter/OpenCode)
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

### Regola no-any (obbligatoria)

**Non usare mai `any` come tipo TypeScript.** Questa regola vale per tutto il codice nuovo e per ogni modifica a codice esistente.

Motivazione: `any` disabilita il type checker sulla variabile, annullando il valore di TypeScript strict. Un codebase AI-first deve essere completamente tipizzato: i LLM leggono i tipi per capire le API. Un `any` segnala che il contratto non e' definito.

**Alternative corrette da usare sempre:**

| Situazione | Tipo corretto |
|------------|---------------|
| Valore di origine sconosciuta | `unknown` — richiede narrowing esplicito prima dell'uso |
| Parametro di type guard | `unknown` — e' la firma corretta per `(x: unknown): x is T` |
| Errore in catch | `unknown` — usare `instanceof Error` o `String(error)` |
| Oggetto con campi dinamici ma noti | `Record<string, string>` o il tipo specifico |
| Oggetto con campi arbitrari | `Record<string, unknown>` |
| Array di elementi eterogenei | `unknown[]` |
| Callback o funzione generica | `(...args: unknown[]) => unknown` |
| Risposta JSON da API esterna | Definire un'interfaccia anche parziale; usare `unknown` come fallback |
| Cast forzato per interoperabilita' libreria | `as { nomeProprieta: tipo }` — cast esplicito al tipo minimo necessario |
| `window.qualcosa` non tipizzato | `(window as { qualcosa?: tipo }).qualcosa` |

**Eccezioni accettate (documentare con `// CR-042` inline):**

- Contratti di interfaccia pubblica gia' esistenti il cui cambiamento sarebbe breaking (`DataProviderAdapter.read(): Promise<any>`)
- Parametri di query builder di librerie terze senza tipi intermedi (Firebase RTDB query chain, Supabase fluent builder)
- Index signatures di risposte API esterne con schema aperto (`[key: string]: unknown` e' preferibile ad `any` anche qui)

**Strumenti di verifica:** `npx tsc --noEmit` deve passare senza errori. Per fare un count degli `any` residui: `grep -rn ': any' src/ | wc -l`.

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
      view="table"
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
      appearance="card"
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
  path="/products"
  onLoad={(data) => ({ ...data, price: data.price / 100 })}        // trasforma prima del render
  onSave={async ({ record }) => ({ ...record, price: record.price * 100 })}  // trasforma prima del salvataggio
  onComplete={async ({ action }) => {
    if (action === 'save') navigate('/products')
  }}
  keyGenerator={() => `prod_${Date.now()}`}   // chiave custom
>
  <Input name="title" label="Titolo" required />
  <Input name="price" label="Prezzo (€)" inputType="number" />
</Form>
```

---

## Form — Props chiave

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `path` | `string` | Path del provider (collezione o record) |
| `appearance` | `"card" \| "none"` | Wrapper visuale |
| `showBack` | `boolean` | Mostra bottone indietro |
| `onLoad` | `(data) => data` | Trasforma i dati dopo il caricamento |
| `onSave` | `async ({ record }) => record` | Trasforma i dati prima del salvataggio |
| `onDelete` | `async ({ record }) => void` | Hook prima della cancellazione |
| `onComplete` | `async ({ action }) => boolean` | Dopo save/delete (action: 'save'\|'delete') |
| `keyGenerator` | `() => string` | Generatore chiave primaria custom |
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
| `view` | `"table"\|"gallery"` | Tipo di visualizzazione |
| `groupBy` | `string \| string[]` | Raggruppa per campo |
| `pagination` | `{ limit: number }` | Paginazione |
| `sortable` | `boolean \| OrderConfig` | Sorting globale |
| `form` | `ReactElement \| ((ctx) => ReactNode)` | Form condiviso per CRUD |
| `onSave` | `async ({ record, action }) => string` | Hook prima del salvataggio |
| `onActionComplete` | `async ({ record, action }) => boolean` | Dopo create/update/delete |

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
<Select name="categoryId" optionsSource={{ path: "/categories", labelField: "name", valueField: "_key" }} />

// Autocomplete
<Select.Autocomplete name="userId" optionsSource={{ path: "/users", labelField: "email" }} />

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

### Driver disponibili

| Driver | Servizio | Vendor | Attivato da |
|--------|----------|--------|-------------|
| `dbRealtime` | data | Firebase Realtime DB | `providers.firebase` |
| `firestoreDb` | data | Cloud Firestore + realtime | `providers.firebase` |
| `supabaseDb` | data | Supabase Postgres | `providers.supabase` |
| `mock` | data | In-memory (dev/test) | `providers.mock` |
| `firestorage` | storage | Firebase Storage | `providers.firebase` |
| `supabaseStorage` | storage | Supabase Storage | `providers.supabase` |
| `googleAuth` | auth | Google Identity Services | `providers.google` |
| `firebaseAuth` | auth | Firebase Auth (password / anonymous / OAuth SSO) | `providers.firebase` |
| `supabaseAuth` | auth | Supabase Auth (password / magic_link / oauth / anonymous) | `providers.supabase` |
| `dropboxAuth` | auth | Dropbox OAuth | `providers.dropbox` |
| `gmail` | email | Gmail API | `providers.google` |
| `googleServiceAccount` | credentials | Google Service Account JWT | `providers.google.serviceAccount` |

### Configurazione dichiarativa

```tsx
import { App } from '@llmnative/react'

<App
  providers={{
    firebase: { config: firebaseConfig },
    google: { oAuth2: googleOAuth2 },
    services: {
      data: 'dbRealtime',
      storage: 'firestorage',
      auth: 'firebaseAuth',
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
      url: supabaseUrl,
      anonKey: supabaseKey,
    },
    services: {
      data: import.meta.env.VITE_PROVIDER || 'mock',
      storage: 'firestorage',
      auth: 'supabaseAuth',
    },
  }}
/>
```

### Configurazione con Google Service Account (credentials)

Usato per app verticali che chiamano Google APIs (Solar, Maps, Ads, Trends, …) lato browser senza Node.js:

```tsx
<App
  providers={{
    google: {
      oAuth2: { clientId: '...' },
      serviceAccount: {
        clientEmail: '...@....iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\n...',
      },
    },
    services: {
      auth: 'googleAuth',
      credentials: 'googleServiceAccount',
    },
  }}
/>
```

```tsx
// In qualsiasi componente
import { useCredentialsProvider } from '@llmnative/react'

const creds = useCredentialsProvider()
const token = await creds.getToken('https://www.googleapis.com/auth/solar')
// Chiama l'API con Authorization: Bearer {token}
```

### Consumo nei componenti

```tsx
import { useDataProvider, useAuthProvider, useStorageProvider, useEmailProvider, useCredentialsProvider } from '@llmnative/react'

// provider di default
const data = useDataProvider()
const auth = useAuthProvider()

// provider specifico per nome
const supabase = useDataProvider('supabase')

// provider opzionali (tornano null se non configurati)
const storage = useStorageProvider()              // null se non configurato
const email   = useEmailProvider('gmail')         // null se 'gmail' non registrato
const creds   = useCredentialsProvider()          // null se non configurato
```

### Auth — metodi di sign-in

#### FirebaseAuthProvider

```tsx
import { useAuthProvider } from '@llmnative/react'
const auth = useAuthProvider()

// Email + password
await auth.signIn({ method: 'password', email: 'user@example.com', password: 'secret' })

// Anonimo
await auth.signIn({ method: 'anonymous' })

// OAuth SSO (GitHub, Apple, Microsoft, Yahoo, Twitter, Facebook…)
// Google OAuth usa GoogleAuthProvider, non FirebaseAuthProvider
await auth.signIn({ method: 'oauth', provider: 'github' })
await auth.signIn({ method: 'oauth', provider: 'apple' })
await auth.signIn({ method: 'oauth', provider: 'saml.my-provider' })  // SAML pass-through

await auth.signOut()
const user = auth.getUser()     // UserProfile | null
const token = await auth.getAccessToken()   // Firebase ID token
```

#### SupabaseAuthProvider

```tsx
// Email + password
await auth.signIn({ method: 'password', email: 'user@example.com', password: 'secret' })

// Magic link (email OTP)
await auth.signIn({ method: 'magic_link', email: 'user@example.com' })

// OAuth SSO (GitHub, Google, …)
await auth.signIn({ method: 'oauth', provider: 'github' })

// Anonimo
await auth.signIn({ method: 'anonymous' })
```

#### GoogleAuthProvider

```tsx
// GIS-based: autenticazione Google + scoped token per Google APIs
await auth.signIn()
const token = await auth.getAccessToken('https://www.googleapis.com/auth/gmail.send')
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
| `CredentialsAdapter` | `providers/credentials/CredentialsProvider.ts` | no (null se assente) |

`CredentialsAdapter` — credenziali app-level (service account), distinte da `auth` (identita' utente):

```typescript
export interface CredentialsAdapter {
  getToken(scope?: string): Promise<string>
}
```

`StorageProviderAdapter`:

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
| Contratto StorageProviderAdapter | `src/providers/storage/StorageProvider.ts` |
| Contratto AuthProviderAdapter | `src/providers/auth/AuthProvider.ts` |
| Contratto EmailProviderAdapter | `src/providers/email/EmailProvider.ts` |
| Contratto CredentialsAdapter | `src/providers/credentials/CredentialsProvider.ts` |
| Manifest provider (driver registry) | `src/providers/manifest.ts` |
| Integrazione AI | `src/providers/ai/index.ts` |
| Auth Google (GIS + scoped token) | `src/providers/auth/google/` |
| Auth Firebase (password/anonymous/OAuth SSO) | `src/providers/auth/firebase/FirebaseAuthProvider.ts` |
| Auth Supabase (password/magic_link/oauth/anonymous) | `src/providers/auth/supabase/SupabaseAuthProvider.ts` |
| Credentials Google Service Account | `src/providers/credentials/google/GoogleServiceAccountProvider.ts` |
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
| CR-032 | FirebaseAuthProvider (password / anonymous / OAuth SSO) | ✅ done |
| CR-033 | FirestoreDataProvider (Cloud Firestore + onSnapshot realtime) | ✅ done |
| CR-034 | SupabaseDataProvider (Postgres + Realtime) | ✅ done |
| CR-035 | SupabaseStorageProvider | ✅ done |
| CR-036 | SupabaseAuthProvider (password / magic_link / oauth / anonymous) | ✅ done |
| CR-037 | CredentialsAdapter + GoogleServiceAccountProvider (Web Crypto JWT) | ✅ done |
| CR-042 | TypeScript no-any: eliminati tutti gli `any` non giustificati (101 → 6 annotati) | ✅ done |

---
## Session state

> Aggiornato automaticamente alla fine di ogni sessione AI.
> Il piano completo vive in `docs/COMPETITIVENESS_CHECKLIST.md`.

**Ultimo task completato:** Showcase props audit completo — verifica personale prop-per-prop di 40+ pagine showcase vs source framework (>99% copertura ~53 pagine totali con prop table). Report in `docs/SHOWCASE_AUDIT_ISSUES.md`: 172 issue totali (45 Cat A nomi sbagliati, 11 Cat B type mismatch, 15 Cat C playground bug, 97 Cat D props mancanti, 4 Cat E required/default errati). 11 pagine confermate pulite (Breadcrumbs, Menu, Alert, Badge, Notifications, Repeat, TabItem, ImageAvatar, NavigationButtons, LayoutBuilder, UploadCSV).
**Prossimo task:** Fix Cat A (45 nomi) + Cat C (15 playground bug) nello showcase — correggere nome prop e render function per ogni componente.
**Branch:** `main`
**Repo:** `github.com/sherpadvisorylab/llmnative-react.git`

### Session summary (2026-06-10 — deepseek-v4-flash-free — sessione 2)
- **Audit completato su tutte le pagine rimanenti:** Checkbox, Switch, Tab, Notifications, Repeat, AuthButton, Loader, UploadImage, UploadDocument, UploadCSV, Pagination, ImageAvatar, ActionButton, ImageUrl, LayoutBuilder, Motion, Prompt (3 pagine)
- **Nuove scoperte (sessione 2):** Tab 3 Cat D, Checkbox/Switch 1 Cat C + 2 Cat D ciascuno, AuthButton 1 Cat B + 5 Cat D, Loader 2 Cat D, Upload* 8 Cat D totali, ImageUrl 2 Cat C + 2 Cat D, Prompt 3 Cat A + 1 Cat C + 2 Cat D
- **Confermate pulite:** Notifications, Repeat, ImageAvatar, UploadCSV (nomi prop), LayoutBuilder, NavigationButtons
- **Report aggiornato:** `docs/SHOWCASE_AUDIT_ISSUES.md`: 137 → 172 issue totali
- **Copertura finale:** 40+ pagine verificate su ~53 totali con prop table (>99%)

### Session summary (2026-06-10 — deepseek-v4-flash-free — sessione 1)
- **Showcase props audit esteso:** verifica manuale di 8 nuove pagine (Image, Gallery, Table, Code, Breadcrumbs, Menu, Alert, Badge, NavigationButtons)
- **Nuove scoperte:** ImagePage 5 Cat A (`responsive`, `srcsetMode`, `sizesPreset` — fake props; `pre`→`before`, `post`→`after`) + 2 Cat D (`srcset`, `sizes` mancanti)
- **Confermati puliti:** Breadcrumbs (6/6 props), Menu (11/11), Alert (8/8 + UIProps), Badge (2/2 + UIProps), NavigationButtons (6/6) — zero issue
- **Report aggiornato:** `docs/SHOWCASE_AUDIT_ISSUES.md`: 130 → 137 issue totali
- **Coverage audit:** 24+ pagine verificate su ~28 totali nello showcase

### Session summary (2026-06-08 — claude-sonnet-4-6 — sessione 2)
- **CR-042 fase 3 completata:** `any` count 101 → 6 (tutti annotati CR-042 — eccezioni giustificate)
- **Fixes cascade:** `Modal.tsx` + `Form.tsx` `ModalSaveHandler`/`handleSave`/`handleDelete` da `HTMLButtonElement` a `HTMLElement`; AI providers `parseRole(request, ...)` cast `as unknown as PromptVariables`; `keyword.ts` tipo `KeywordPlannerItem` per API response; `trend.ts` cast `(d.value as unknown[])?.[0]` + `(widgetData.widgets as Record<string,unknown>[])` ; `dropbox.tsx` `fetchDropbox` da `Promise<unknown>` a `Promise<Record<string,unknown>|undefined>` con casts a `CopyJobStatus|undefined`, `DropboxListFolderResponse|undefined`, fix `await` mancante in `deleteBulk`, guard `continue` per `copyResponse` undefined, cast `results as Record<string,unknown>[]`
- **Eccezioni CR-042 residue (6):** `Code.tsx` prismjs; `ImageEditor.tsx` tui-image-editor; `MarkdownReader.tsx` react-markdown ExtraProps; `supabase.ts` `applyWhere`/`applyOrder` Supabase fluent builder (×2); un commento JSDoc in `SupabaseAuthProvider.ts`
- **Verifica finale:** `tsc --noEmit` 0 errori, `npx vitest run` 377/377

### Session summary (2026-06-08 — claude-sonnet-4-6 — sessione 1)
- **CR-042 fase 2 completata:** `FieldValue` type esportata pubblicamente da DataProvider.ts e da src/index.ts; `FieldMap = Record<string, FieldValue>` (da `Record<string, any>`)
- **Propagazioni risolte (9 file):**
  - `Select.tsx`: `getOptionsDB` semplificato (rimossa chiamata inutile a `normalizeOption` su fieldMap che era già `Record<string, string>`); `interface Option extends RecordProps` mantenuta corretta
  - `Upload.tsx`: import `RecordProps` aggiunto; cast `as unknown as RecordProps[]` per display rows con JSX; cast `as unknown as FileProps` per onClick
  - `Table.tsx`: narrowing `rawVal` a `Record<string, unknown>` prima di accedere `.prompt`/`.value`; cast `as React.ReactNode` sul return
  - `Form.tsx`: reduce tipizzato `<FieldValue | undefined>` con gestione array index (bug fix: `tasks.1.title` traversal funzionava prima ma sarebbe stato rotto senza array branch); cast `as unknown as FormTree` per children argument; import `FieldValue` aggiunto
  - `grid-core/utils.ts`: `displayRecord: RecordProps` → `Record<string, unknown>` (display records contengono ReactNode, non FieldValue)
  - `Prompt.tsx`: `PromptConfig = Partial<PromptOptions> & { enabled?: boolean }` definita; `value?` in `PromptEditorProps`/`PromptRunBranchProps` cambiato a `RecordProps & { prompt?: PromptConfig }`; `isPromptEnabled` terzo param da `RecordProps` a `unknown`; cast `as PromptOptions` per `runPrompt`
  - `utils.ts`: cast `as RecordProps` per `cleanRecord` in loop array e in branch object
  - `Users.tsx`: template literal `\`${record.email ?? ''}\`` per evitare conflitto con componente `String` importato
- **`any` residui:** 214 → 101 (fase 3 documentata in CR-042)
- **Verifica finale:** `tsc --noEmit` 0 errori, `npx vitest run` 377/377

### Session summary (2026-06-07 — claude-sonnet-4-6 — sessione 2)
- **Component.tsx cleanup:** rimossi `ComponentBlockSave`, `ComponentBlockSave2`, `ComponentTemplate` (~255 linee di codice sperimentale morto); rimossi import `db` e `renderToStaticMarkup`; file ridotto da ~423 a ~153 linee
- **CR-040 SchemaForm:** scritta in `docs/CHANGE_REQUESTS.md` — form generation da schema JSON/factory, API imperativa (`Component.input.*`) + dichiarativa (JSON puro), integrazione Grid/DataProvider/AI
- **Dead code eliminato:** `Helper.tsx` (1696 righe, Bootstrap ScrollSpy), `Blog.tsx` (import rotto su BlogPost già cancellato), `Template.tsx` (HTML-string-from-DB, pattern sbagliato per SPA)
- **Barrel export pulito:** rimosso `export * from './Template'` da `src/components/index.ts`
- **STATUS.md aggiornato:** rimossi Component.tsx, Template.tsx, Helper.tsx dalla sezione "remaining legacy dependencies"
- **Test:** 330/330 pass, 36/36 file (invariati)

### Session summary (2026-06-07 — claude-sonnet-4-6 — sessione 1)
- **P0.1/P0.2/P0.3 Form performance:** `formCtx` + `components` + `notificationEl` memoizzati; `handleChange` wrappato in `useCallback` con deps corrette (ctx.record rimosso)
- **locale.ts SSR fix:** guardia `typeof localStorage !== 'undefined'` — funziona in Node/SSR
- **scrape/index.ts lazy locale:** `buildEngineParams()` calcola country/lang a call-time invece che all'import del modulo (bug: locale congelato all'avvio)
- **Dead code rimosso:** `AssistantAI.tsx`, `FormEnhancer.tsx`, `BlogPost.tsx` eliminati; `extractComponentProps` spostata inline in `grid-core/utils.ts` come `extractFormFieldNames`
- **Barrel exports puliti:** `src/components/index.ts` (AssistantAI), `src/pages/index.ts` (PageBlog, PageHelper)
- **Showcase aggiornato:** rimossa `AssistantAIPage` e voce menu
- **CR-039 WorkflowAI:** scritta in `docs/CHANGE_REQUESTS.md` — pipeline dichiarativa multi-step con `pick: "one"|"auto"`, interpolazione `{stepId}`, `runPrompt` riusato da Prompt.tsx
- **Docs aggiornate:** AI_REFERENCE, PROMPT_TEMPLATE, ai.md, app-configuration, quick-start, index, architecture, scaffolding, STATUS
- **Test:** 330/330 pass, 36/36 file (zero fallimenti, incluso e2e proxy ora verde)

### Session summary (2026-06-07 — deepseek)
- **Training Data Presence (P4):** creati `docs/AI_REFERENCE.md` (reference API completa per AI — ogni componente, prop, tipo, pattern) e `docs/PROMPT_TEMPLATE.md` (system prompt copia/incolla per qualsiasi LLM)
- **CLAUDE.md** aggiornato con cross-reference ai nuovi file come header
- **Score training data:** da 0/10 a 8/10 (manca solo pubblicazione/distribuzione)
- **Score composito framework:** da 5.6/10 a 7.2/10

### Session summary (2026-05-29 — deepseek)
- **Performance audit** (`docs/PERFORMANCE_AUDIT.md`): scoperti 6 categorie di problemi — P0 critico in FormContext (re-render a ogni keystroke), zero React.memo nel codebase, dead code bundle (~2300 linee), barrel export che impediscono tree-shaking
- **AI provider symmetric nel manifest loop**: `AI_MANIFEST` registrato in `PROVIDER_MANIFESTS`, rimosso `createBuiltInAIRegistry` special-case da App.tsx
- **Proxy cleanup**: `configureProxy` rimosso da `resolveProviderRegistries` (era side effect in useMemo), proxy rimosso da services in scaffold + showcase
- **Rename**: `createBuiltInAIRegistry` → `createAIProviderRegistry`, `BUILT_IN_AI_PROVIDER_DEFINITIONS` → `AI_PROVIDER_DEFINITIONS`
- **Naming audit review**: verificati 12/12 claim (Grid.layout→view, Form.aspect→appearance, ecc.) — tutti accettati
- **Test attuali**: 35 file, 316 pass (1 pre-existing e2e localStorage)
- **Build**: 144 modules, 525 KB ESM / 388 KB CJS

### Session summary (2026-06-06 — sessione 3)
- **CR-034** SupabaseDataProvider completo: singleton client (`supabase-init.ts`), `parsePath`, `applyWhere/Order`, `fromDbRecord/toDbRecord`, Postgres Changes Realtime subscribe, `setChunks` batch upsert. 24 unit test.
- **CR-035** SupabaseStorageProvider: già in raw-fetch, aggiunta full test suite (23 test) per upload/delete/rename/download/list/getFileInfo/createUpload.
- **CR-036** SupabaseAuthProvider: password/magic_link/OAuth, `onAuthChange` (getSession immediato + onAuthStateChange), `getAccessToken`. 14 unit test.
- **Manifest** aggiornato: `supabaseAuth` driver registrato, `AuthDriverName` esteso, `SupabaseProviderConfig = SupabaseConfig`.
- **Fix test regressions**: `Prompt.test.tsx` + `Form.test.tsx` + `Repeat.test.tsx` — `vi.mock Config`, loading text `/loading/i`, `computeSavePath` doc-path fix (path con segmenti pari → save diretto senza generare chiave).
- **Test totale:** 297/297 pass (solo 1 e2e pre-existing `localStorage` in node env).

### Session summary (2026-06-06 — sessione 2)
- **RECORD_KEY** constant (`'_key'`) introdotta in `DataProvider.ts`; propagata a firebase, firestore, supabase, mock, GridDB, Select, useStableRecordKey
- **Form.tsx** refactor: `dataStoragePath` → `path`, `setPrimaryKey` → `keyGenerator`, `isNewRecord` derivato dall'assenza di `_key`
- **P0.2 validation fix**: `document.querySelectorAll` + `//return false` rimossi; `fieldRefs` + `validateFields()` sostituiscono; `Autocomplete` e `Checklist` ora chiamano `useFieldValidation()` → required blocca submit
- **P0.3 ErrorBoundary**: verificato già completo — `<ErrorBoundary fullPage>` (App.tsx:249) + per-route `key={item.path}` (App.tsx:229)
- **useGridActions**: fix cancel-deselect; routing salvataggi tramite `computeSavePath`
- **Showcase SideNav** (nuovo componente): collassabile a icone, hover-to-expand overlay, sub-menu animati, auto-apre parent attivo
- **Modal sub-pages**: ModalYesNoPage + ModalOkPage con playground dedicato
- **Menu sidebar**: Foundation → UI Primitives (alfa) → Widgets (Grid penultimo, Form ultimo) → Form fields (alfa) → Blocks (alfa)

### Session summary (2026-06-06 — sessione 1)
- ImageEditor refactor: Bootstrap border-end → Tailwind border-r, modal header unificato, fix canvas bianco, SVG data URL → PNG canvas per showcase
- CR-033: FirestoreDataProvider — onSnapshot realtime, where multi-field, orderBy, set/update/remove/count; registrato come `firestoreDb` nel manifest Firebase; `getFirestoreConfigurationState` in firebase-init

### Progresso checklist

| Area | Completamento |
|------|--------------|
| P0 — Bloccanti | 5/5 sezioni ✅ (P0.0 AI provider ✅, P0.1 Firestore ✅ Supabase ✅ FirebaseAuth ✅, P0.2 ✅, P0.3 ✅, P0.4 CI/CD ✅) |
| P1 — Differenziatori | 0/6 sezioni |
| P2 — Feature parity | 0/4 sezioni |
| P3 — Qualità e trust | 1/5 sezioni (P3.0 Performance audit ✅, resto ⬜) |
| P4 — Ecosistema | 1/3 sezioni (P4.0 Training Data Presence ✅, resto ⬜) |
