# Change Requests

> Ogni CR rappresenta un'unità di lavoro autonoma con motivazione, scope e checklist.  
> Stato: `⬜ todo` · `🔄 in progress` · `✅ done` · `🚫 cancelled`  
> Ultima revisione: 2026-05-06

---

## Indice

| CR | Titolo | Priorità | Dipende da | Stato |
|----|--------|----------|-----------|-------|
| [CR-001](#cr-001--documentazione-ai-first) | Documentazione AI-first | Alta | — | ✅ |
| [CR-002](#cr-002--provider-abstraction-layer) | Provider abstraction layer | Critica | — | ✅ |
| [CR-002b](#cr-002b--authprovider--emailprovider-interfaces) | AuthProvider + EmailProvider interfaces | Alta | CR-002 | ✅ |
| [CR-003](#cr-003--typescript-strict) | TypeScript strict | Alta | — | ✅ |
| [CR-004](#cr-004--shadcnui--tailwind-css) | shadcn/ui + Tailwind CSS | Alta | CR-002 | 🔄 |
| [CR-005](#cr-005--cli-update-e-scaffolding) | CLI update e scaffolding | Media | CR-002, CR-004 | ⬜ |
| [CR-006](#cr-006--batterie-di-test) | Batterie di test | Alta | CR-002, CR-003 | 🔄 |
| [CR-007](#cr-007--showcase-app) | Showcase app | Alta | CR-002, CR-004 | 🔄 |
| [CR-008](#cr-008--tema-empty--tailwind--shadcnui) | Tema `empty` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |
| [CR-009](#cr-009--tema-default--tailwind--shadcnui) | Tema `default` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |
| [CR-010](#cr-010--tema-flat--tailwind--shadcnui) | Tema `flat` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |
| [CR-011](#cr-011--tema-cyber--tailwind--shadcnui) | Tema `cyber` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |
| [CR-012](#cr-012--showcase-refactor--react-firestrap-native) | Showcase refactor — react-firestrap native | Alta | CR-004, CR-007 | ⬜ |
| [CR-013](#cr-013--icon-provider-system) | Icon provider system | Media | CR-004 | 🔄 |
| [CR-014](#cr-014--raffinazione-componenti--props-e-comportamenti) | Raffinazione componenti — props e comportamenti | Media | CR-007 | ⬜ |
| [CR-015](#cr-015--vite-toolchain-framework--scaffolding) | Vite toolchain framework + scaffolding | Alta | CR-003, CR-004, CR-006 | ✅ |
| [CR-016](#cr-016--showcase-vite--scaffold-first) | Showcase Vite + scaffold-first | Alta | CR-012, CR-015 | ✅ |
| [CR-017](#cr-017--app-managed-theme--icon-registries) | App-managed theme + icon registries | Alta | CR-004, CR-013 | ✅ |

---

## CR-001 — Documentazione AI-first

**Stato:** ✅ done  
**Branch:** `modernize/cr-001-docs`  
**Priorità:** Alta — inizia subito, parallela a tutto  
**Stima:** 2–3 giorni  

### Motivazione
Un AI che lavora su questo progetto ha zero training data su react-firestrap. Senza documentazione dedicata, ogni sessione riparte da zero e l'AI indovina le API sbagliando. `CLAUDE.md` nella root viene letto automaticamente da Claude Code ad ogni sessione.

### Scope
- `CLAUDE.md` (root) — quick reference per AI: pattern principali, dove cercare le cose, regole di dipendenza
- `docs/overview.md` — cos'è il framework, cosa non è, quando usarlo
- `docs/architecture.md` — struttura cartelle, regole di dipendenza tra layer
- `docs/patterns.md` — i 5 pattern che coprono il 90% dei casi d'uso
- `docs/components.md` — API reference di ogni componente pubblico
- `docs/providers.md` — come configurare e scrivere un DataProvider (aggiornare dopo CR-002)
- `docs/examples/crud-basic.md` — Grid + Form con Firebase
- `docs/examples/crud-modal.md` — Grid con modal edit
- `docs/examples/form-nested.md` — Form con oggetti annidati e array
- `docs/examples/custom-provider.md` — come scrivere un DataProvider custom

### Checklist
- [x] Scrivere `CLAUDE.md`
- [x] Scrivere `docs/overview.md`
- [x] Scrivere `docs/architecture.md`
- [x] Scrivere `docs/patterns.md`
- [x] Scrivere `docs/components.md`
- [x] Scrivere `docs/examples/crud-basic.md`
- [x] Scrivere `docs/examples/crud-modal.md`
- [x] Scrivere `docs/examples/form-nested.md`
- [ ] Aggiornare `docs/providers.md` dopo CR-002
- [ ] Scrivere `docs/examples/custom-provider.md` dopo CR-002

---

## CR-002 — Provider abstraction layer

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Critica — sblocca CR-004  
**Stima:** 1–2 settimane  
**Breaking change:** No (API pubblica invariata, cambia solo internamente)

### Motivazione
`Form.tsx` e `Grid.tsx` importano `db` direttamente da `libs/database.ts` che wrappa Firebase. Non è possibile usare Supabase, Firestore o REST senza riscrivere i widget core. Il coupling è il problema architetturale principale del progetto.

### Scope — Nuova struttura cartelle

```
src/
  providers/
    data/
      DataProvider.ts         ← interface
      DataProviderContext.tsx  ← React Context + useDataProvider() hook
      firebase.ts             ← migrato da libs/database.ts + integrations/google/firedatabase.ts
      supabase.ts             ← nuovo
    storage/
      StorageProvider.ts      ← interface
      StorageProviderContext.tsx
      firebase.ts             ← migrato da integrations/google/firestorage.ts
      supabase.ts             ← nuovo
    ai/
      index.ts                ← migrato da integrations/ai.ts (rimane concreto, no interface)
    auth/
      google/                 ← migrato da integrations/google/GoogleAuth.tsx + auth.ts
    scrape/
      index.ts                ← migrato da integrations/scrape.ts
    dropbox/
      index.ts                ← migrato da integrations/dropbox.tsx
  types/                      ← RINOMINATA da models/
```

### DataProvider interface

```typescript
// src/providers/data/DataProvider.ts
export interface QueryOptions {
  where?: { [field: string]: Condition | OperatorValue }
  order?: { [field: string]: 'asc' | 'desc' }
  limit?: number
  fieldMap?: Record<string, string>
}

export interface DataProvider {
  read(path: string): Promise<Record<string, any> | null>
  set(path: string, data: object): Promise<void>
  remove(path: string): Promise<void>
  list(path: string, options?: QueryOptions): Promise<RecordArray>
  useListener(path: string, callback: (data: RecordArray) => void): void
  count(path: string): Promise<number>
}
```

### StorageProvider interface

```typescript
// src/providers/storage/StorageProvider.ts
export interface StorageProvider {
  upload(path: string, file: File, onProgress?: (pct: number) => void): Promise<string>
  getUrl(path: string): Promise<string>
  remove(path: string): Promise<void>
}
```

### Iniezione in App.tsx

```tsx
<App
  dataProvider={new FirebaseDataProvider(firebaseConfig)}
  storageProvider={new FirebaseStorageProvider(firebaseConfig)}
  ...
/>
```

### Checklist
- [x] Creare `src/providers/data/DataProvider.ts` (interface + tipi)
- [x] Creare `src/providers/data/DataProviderContext.tsx` (Context + hook)
- [x] Creare `src/providers/storage/StorageProvider.ts` (interface)
- [x] Creare `src/providers/storage/StorageProviderContext.tsx`
- [x] Migrare `firedatabase.ts` → `providers/data/firebase.ts` implementando DataProvider
- [x] Migrare `firestorage.ts` → `providers/storage/firebase.ts` implementando StorageProvider
- [x] Scrivere `providers/data/supabase.ts`
- [x] Scrivere `providers/storage/supabase.ts`
- [x] Aggiornare `Form.tsx` — sostituire `import db` con `useDataProvider()`
- [x] Aggiornare `Grid.tsx` — sostituire `import db` con `useDataProvider()`
- [x] Aggiornare `Upload.tsx` — sostituire storage diretto con `useStorageProvider()`
- [x] Aggiornare `App.tsx` — accettare `dataProvider` e `storageProvider` come prop
- [x] Spostare `integrations/ai.ts` → `providers/ai/index.ts`
- [x] Spostare `integrations/google/GoogleAuth.tsx` → `providers/auth/google/`
- [x] Spostare `integrations/google/auth.ts` → `providers/auth/google/auth.ts`
- [x] Spostare `integrations/google/firebase.ts` → `providers/firebase-init.ts`
- [x] Spostare `integrations/google/email.ts` → `providers/email/google/email.ts`
- [x] Spostare `integrations/google/keyword.ts` → `providers/seo/google/keyword.ts`
- [x] Spostare `integrations/google/trend.ts` → `providers/seo/google/trend.ts`
- [x] Spostare `integrations/scrape.ts` → `providers/scrape/index.ts`
- [x] Spostare `integrations/dropbox.tsx` → `providers/storage/dropbox.ts`
- [x] Rinominare `models/` → `types/` (backward-compat stubs in models/)
- [x] Creare backward-compat stubs in integrations/ per tutti i file spostati
- [x] Aggiornare `src/index.ts` con i nuovi export path
- [x] Aggiornare libs/database.ts e libs/storage.ts (backward-compat re-export)
- [ ] Test manuale: Form con FirebaseDataProvider
- [ ] Test manuale: Grid con FirebaseDataProvider
- [ ] Test manuale: Upload con FirebaseStorageProvider
- [ ] Test manuale: Form con SupabaseDataProvider

---

## CR-002b — AuthProvider + EmailProvider interfaces

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002  
**Breaking change:** No

### Motivazione
`GoogleAuth.tsx` e `email.ts` sono implementazioni concrete senza contratto. Non è possibile sostituire l'autenticazione (es. GitHub OAuth, email+password) o il provider email (SendGrid, Mailgun) senza riscrivere i componenti che li usano. Si applica lo stesso pattern Ports & Adapters già usato per DataProvider e StorageProvider.

### Scope

```
providers/
  auth/
    AuthProvider.ts           ← interface: UserProfile, AuthProvider
    AuthProviderContext.tsx   ← React Context + useAuthProvider() hook
    google/
      GoogleAuthProvider.ts  ← GoogleAuthProvider implements AuthProvider
  email/
    EmailProvider.ts          ← interface: EmailSendParams, EmailProvider
    EmailProviderContext.tsx  ← React Context + useEmailProvider() hook
    google/
      GmailEmailProvider.ts  ← GmailEmailProvider implements EmailProvider
```

### AuthProvider interface

```typescript
export interface UserProfile {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  [key: string]: any;
}

export interface AuthProvider {
  getUser(): UserProfile | null;
  signOut(): Promise<void>;
  onAuthChange(callback: (user: UserProfile | null) => void): () => void;
  getAccessToken?(scopes?: string[]): Promise<string>;
}
```

### EmailProvider interface

```typescript
export interface EmailSendParams {
  to: string | string[];
  bcc?: string | string[];
  subject: string;
  message: string;
}

export interface EmailProvider {
  send(params: EmailSendParams): Promise<void>;
}
```

### Iniezione in App.tsx

```tsx
<App
  authProvider={new GoogleAuthProvider()}
  emailProvider={new GmailEmailProvider()}
  ...
/>
```

### Checklist

- [x] Creare `providers/auth/AuthProvider.ts`
- [x] Creare `providers/auth/AuthProviderContext.tsx`
- [x] Creare `providers/auth/google/GoogleAuthProvider.ts`
- [x] Creare `providers/email/EmailProvider.ts`
- [x] Creare `providers/email/EmailProviderContext.tsx`
- [x] Creare `providers/email/google/GmailEmailProvider.ts`
- [x] Aggiornare `App.tsx` — accettare `authProvider` e `emailProvider` come prop
- [x] Aggiornare `src/index.ts` con nuovi export

---

## CR-003 — TypeScript strict

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta — parallela a CR-002  
**Stima:** 1 settimana  
**Breaking change:** No

### Motivazione
`RecordProps` è tipizzato come `{ [key: string]: any }` (di fatto `any`). Questo impedisce all'AI di inferire i tipi dei campi, di trovare errori in anticipo, e di fare autocompletion utile. Con TypeScript strict il codice diventa auto-documentante.

### Scope
- Abilitare `strict: true` nel tsconfig
- Introdurre generics su `RecordProps<T>`
- Tipizzare `QueryOptions`, `ColumnFormatter`, `FormRef`, `FieldAdapter`
- Risolvere tutti gli errori TypeScript risultanti

### Checklist
- [x] `strict: true` già abilitato in `tsconfig.json`
- [x] Rimozione `@types/react-router-dom` v5 (obsoleto in RRD v6, tipi bundled)
- [x] Installazione `react-router-dom@^6.22.0` e `googleapis` come devDependencies
- [x] Fix `App.tsx`: cast nullable firebaseConfig/oAuth2 per strict null checks
- [x] Fix `providers/email/google/apis/email.ts`: overload googleapis corretto
- [x] Rimosso exclude stale `src/integrations/google` da tsconfig.json
- [x] Build pulita senza errori (`tsc --noEmit` exit 0)

---

## CR-004 — shadcn/ui + Tailwind CSS

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Alta — dopo CR-002 stabile  
**Stima:** 2–3 settimane  
**Dipende da:** CR-002 completata  
**Breaking change:** Sì — temi Bootstrap non più compatibili (major version bump)

### Motivazione
Bootstrap è in declino nell'ecosistema React. shadcn/ui + Tailwind è lo standard moderno: headless, accessibile, customizzabile, e ampiamente conosciuto dall'AI. Il sistema tema via Context è già pronto — si tratta di riscrivere i valori delle classi e i componenti sottostanti.

### Scope
- Installare e configurare Tailwind CSS
- Installare shadcn/ui
- Riscrivere i valori di classe in `Theme.tsx` (Bootstrap → Tailwind)
- Sostituire i componenti primitivi con equivalenti shadcn
- Mantenere invariata l'API pubblica dei componenti

### Componenti da migrare

| Componente | shadcn equivalente | Note |
|------------|-------------------|------|
| Button, LoadingButton | `Button` | varianti: default, outline, ghost |
| Input | `Input` | |
| Select, Autocomplete | `Select`, `Combobox` | |
| Checklist | `Checkbox` group | |
| Modal | `Dialog` | |
| Card | `Card` | |
| Badge | `Badge` | |
| Alert | `Alert` | |
| Table | `Table` | |
| Tab, TabDynamic | `Tabs` | |
| Pagination | custom Tailwind | shadcn non ha paginazione built-in |
| Upload | custom Tailwind | UI custom con drop zone |
| Loader | custom Tailwind | spinner o skeleton |

### Approccio scelto: Bootstrap compatibility layer via Tailwind `@layer components`

Invece di usare i componenti shadcn/ui direttamente (che richiederebbe riscrivere i file `.tsx`),  
si definiscono le stesse classi Bootstrap (`.btn`, `.badge`, `.alert`, `.modal`, `.card`, ecc.)  
come macro Tailwind via `@apply` in `@layer components`. Questo significa:
- Nessun cambiamento al codice dei componenti `.tsx`
- CSS generato da Tailwind (tree-shaking, zero Bootstrap runtime)
- `importTheme()` continua a funzionare — i valori delle classi nel tema sono ora Tailwind puri
- Consumatori che usano `cn()` possono usare utilities Tailwind direttamente

### Schema architetturale
```
src/globals.css          ← @import "tailwindcss" + @theme (colori) + @layer components (Bootstrap compat)
src/libs/cn.ts           ← helper clsx + tailwind-merge
src/Theme.tsx            ← defaultTheme aggiornato con classi Tailwind-compat
dist/index.css           ← CSS estratto da MiniCssExtractPlugin (consumer lo importa una volta)
dist/index.js            ← bundle JS invariato
```

### Consumer setup
```tsx
// main.tsx / App.tsx del consumer
import 'react-firestrap/dist/index.css';   // ← un solo import
```

### Checklist
- [x] Installare Tailwind CSS v4 + `@tailwindcss/postcss` + autoprefixer
- [x] Installare `clsx` + `tailwind-merge`
- [x] Configurare `tailwind.config.js` (content scan `src/**/*.{ts,tsx}`)
- [x] Configurare `postcss.config.js`
- [x] Aggiornare `webpack.config.js` — aggiungere `css-loader`, `postcss-loader`, `MiniCssExtractPlugin`
- [x] Creare `src/globals.css` — `@import "tailwindcss"` + `@theme inline` (colori) + `@layer components` (Bootstrap compat layer completo)
- [x] Creare `src/libs/cn.ts` — helper `cn()` esportato
- [x] Aggiornare `src/index.ts` — aggiungere `import './globals.css'`
- [x] Aggiornare `Theme.tsx` defaultTheme — tutti i valori Bootstrap → classi Tailwind-compat
- [x] Aggiornare `package.json` — aggiungere `"style"` + `"exports"` fields
- [x] Build pulita (webpack dev + prod, 0 errori)
- [ ] Test visivo completo di tutti i componenti nel consumer
- [ ] Aggiornare `docs/patterns.md` con nota import CSS
- [ ] Verificare dark mode via `.dark` class override delle `--rf-*` variables

---

## CR-005 — CLI update e scaffolding

**Stato:** ⬜ todo  
**Branch:** `modernize/cli`  
**Priorità:** Media — dopo CR-002 e CR-004  
**Stima:** 3–4 giorni  
**Dipende da:** CR-002, CR-004

### Motivazione
Il CLI (`npx react-firestrap create`) genera struttura con Bootstrap e Firebase hardcoded. Dopo le migrazioni deve offrire scelta del provider e generare il boilerplate aggiornato.

### Checklist
- [ ] Aggiornare `bin/cli.js` — scaffolding con Tailwind invece di Bootstrap
- [ ] Aggiungere prompt interattivo: scelta DataProvider (Firebase / Supabase / REST)
- [ ] Generare `providers/` con il provider scelto pre-configurato
- [ ] Generare `CLAUDE.md` nella root del progetto scaffoldato
- [ ] Generare `docs/` base nella root del progetto scaffoldato
- [ ] Aggiornare README con nuove istruzioni

---

## CR-006 — Batterie di test

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Alta  
**Stima:** 2–3 settimane  
**Dipende da:** CR-002 (i test testano le interface, non Firebase direttamente), CR-003 (TypeScript strict aiuta la correttezza dei test)  
**Breaking change:** No

### Motivazione
Senza test ogni refactor è un salto nel vuoto. I test devono essere scritti **dopo** CR-002 perché testano le interface (`DataProvider`, `StorageProvider`) e non l'implementazione Firebase — così rimangono validi quando aggiungi Supabase o altri provider. Tre livelli: unit (funzioni pure), integration (provider contract), component (UI con Testing Library).

### Stack di test

```
Vitest          ← test runner (più veloce di Jest, Vite-native)
React Testing Library  ← componenti React
@testing-library/user-event  ← interazioni utente realistiche
msw             ← mock service worker per intercettare fetch (AI, scrape)
vitest-firebase ← emulatore Firebase locale per test di integrazione
playwright      ← E2E (smoke test sui flussi critici)
```

### Struttura cartelle test

```
src/
  __tests__/
    unit/
      libs/                     ← test funzioni pure (converter, path, sanitizer, cache)
      providers/
        DataProvider.contract.ts  ← test contract: ogni provider DEVE superarli
    integration/
      providers/
        firebase.test.ts          ← FirebaseDataProvider contro emulatore locale
        supabase.test.ts          ← SupabaseDataProvider contro istanza test
    components/
      ui/
        Input.test.tsx
        Select.test.tsx
        Upload.test.tsx
      widgets/
        Form.test.tsx             ← form con mock DataProvider
        Grid.test.tsx             ← grid con mock DataProvider
      fields/
        Prompt.test.tsx
        AssistantAI.test.tsx
playground/                       ← (CR-007) app separata, non in __tests__
```

### Contract test — il pattern chiave

Il `DataProvider.contract.ts` è un set di test parametrici che ogni implementazione deve superare. Garantisce che Firebase, Supabase e REST si comportino identicamente dall'esterno:

```typescript
// src/__tests__/unit/providers/DataProvider.contract.ts
export function runDataProviderContract(
  createProvider: () => DataProvider,
  cleanup: () => Promise<void>
) {
  describe('DataProvider contract', () => {
    let provider: DataProvider

    beforeEach(() => { provider = createProvider() })
    afterEach(cleanup)

    it('read → null su path inesistente', async () => {
      expect(await provider.read('/nonexistent/path')).toBeNull()
    })

    it('set + read → ritorna il record salvato', async () => {
      await provider.set('/test/1', { name: 'Mario' })
      expect(await provider.read('/test/1')).toMatchObject({ name: 'Mario' })
    })

    it('remove → il record non esiste più', async () => {
      await provider.set('/test/2', { name: 'Luigi' })
      await provider.remove('/test/2')
      expect(await provider.read('/test/2')).toBeNull()
    })

    it('list → ritorna array con _key per ogni record', async () => {
      await provider.set('/test/a', { val: 1 })
      await provider.set('/test/b', { val: 2 })
      const list = await provider.list('/test')
      expect(list).toHaveLength(2)
      expect(list[0]).toHaveProperty('_key')
    })

    it('list con where eq → filtra correttamente', async () => { ... })
    it('list con order asc → ordine rispettato', async () => { ... })
    it('useListener → callback chiamata su cambio dati', async () => { ... })
    it('count → numero corretto di record', async () => { ... })
  })
}

// Uso nei test specifici:
// firebase.test.ts  → runDataProviderContract(() => new FirebaseDataProvider(testConfig), cleanup)
// supabase.test.ts  → runDataProviderContract(() => new SupabaseDataProvider(testConfig), cleanup)
```

### Unit test — libs/

```typescript
// converter.test.ts
describe('converter.toCamel', () => {
  it('converte snake_case', () => expect(converter.toCamel('hello_world')).toBe('helloWorld'))
  it('converte kebab-case', () => expect(converter.toCamel('hello-world')).toBe('helloWorld'))
  it('stringa vuota', () => expect(converter.toCamel('')).toBe(''))
})

// path.test.ts — normalizePath, trimPath, dirname, normalizeKey
// sanitizer.test.ts — html, key
// cache.test.ts — set/get/clear
```

### Component test — pattern standard

```tsx
// Form.test.tsx
const mockProvider = createMockDataProvider({
  '/users/1': { name: 'Mario', role: 'admin' }
})

it('carica i dati dal provider e popola i campi', async () => {
  render(
    <DataProviderContext.Provider value={mockProvider}>
      <Form dataStoragePath="/users/1">
        <Input name="name" label="Nome" />
        <Select name="role" options={[...]} />
      </Form>
    </DataProviderContext.Provider>
  )
  expect(await screen.findByDisplayValue('Mario')).toBeInTheDocument()
})

it('salva chiamando provider.set con i dati corretti', async () => {
  const spy = vi.spyOn(mockProvider, 'set')
  await userEvent.click(screen.getByText('Salva'))
  expect(spy).toHaveBeenCalledWith('/users/1', expect.objectContaining({ name: 'Mario' }))
})

it('validazione required — non salva se campo obbligatorio vuoto', async () => { ... })
it('dot notation — name="address.city" aggiorna oggetto annidato', async () => { ... })
it('array index — name="items.0.name" aggiorna primo elemento array', async () => { ... })
```

### Corner case da coprire obbligatoriamente

**Form:**
- [ ] Dot notation su N livelli di profondità (`a.b.c.d`)
- [ ] Array index notation (`items.0.name`, `items.99.value`)
- [ ] Campo `required` blocca il submit
- [ ] `onLoad` trasforma i dati prima del render
- [ ] `onSave` può modificare i dati prima della scrittura
- [ ] `onFinally` viene chiamato dopo save e delete
- [ ] Record nuovo vs record esistente (isNewRecord)
- [ ] `setPrimaryKey` custom
- [ ] `savePath` custom
- [ ] FormRef: handleSave, handleDelete, getRecord esposti correttamente

**Grid:**
- [ ] Dati vuoti — mostra stato empty
- [ ] Real-time update — nuovi record appaiono senza refresh
- [ ] Paginazione — navigazione tra pagine
- [ ] Sorting — ordine asc/desc su colonna
- [ ] groupBy — raggruppamento corretto
- [ ] allowedActions: solo "add" → no edit/delete visibili
- [ ] Modal add → Form nuovo record
- [ ] Modal edit → Form con dati esistenti
- [ ] onLoadRecord ritorna false → record escluso dalla lista

**DataProvider contract:**
- [ ] Path con caratteri speciali
- [ ] Record con valori null/undefined/0/false (non devono sparire)
- [ ] Listener si disconnette quando componente unmonta
- [ ] where con operatori: eq, lt, lte, gt, gte, in, nin
- [ ] order multi-campo

**Input:**
- [ ] Valore iniziale undefined → campo vuoto, non stringa "undefined"
- [ ] Tipo number → valore numerico, non stringa
- [ ] Drag and drop testo → inserito alla posizione cursore
- [ ] updatable: false → read-only dopo primo valore

**Select:**
- [ ] Options da array statico
- [ ] Options da DataProvider (db config)
- [ ] Autocomplete — filtra correttamente
- [ ] Checklist — multi-selezione, valore come array

### Checklist

- [x] Configurare Vitest 2.x + React Testing Library + happy-dom (`vitest.config.ts`)
- [ ] Configurare Firebase Emulator per test di integrazione
- [x] Creare `MockDataProvider` — implementazione in-memory completa (`src/providers/data/mock.ts`)
- [x] Scrivere `DataProvider.contract.ts` — contract test parametrico (14 test)
- [x] `MockDataProvider.test.ts` — MockDataProvider supera il contract + test useListener (22 test)
- [x] Unit test: `utils.ts` — trimSlash, normalizePath, normalizeKey, isEmpty, safeClone (23 test)
- [x] Unit test: `converter.ts` — toCamel, toUpper, toLower, toSlug, truncate, toQueryString, parse, subStringCount (16 test)
- [ ] Unit test: `path.ts`
- [ ] Unit test: `sanitizer.ts`
- [ ] Unit test: `cache.ts`
- [ ] Integration test: `FirebaseDataProvider` contro emulatore
- [ ] Integration test: `SupabaseDataProvider` contro istanza test
- [x] Component test: `Form.tsx` — defaultValues, FormDatabase loading, save, onFinally, nested dot notation (9 test)
- [x] Component test: `Grid.tsx` — headers, rows, empty state, dataArray, onDisplay formatter, real-time add/remove, allowedActions (8 test)
- [x] Component test: `Input.tsx` — rendering, labels, types, placeholder, disabled, user interaction (8 test)
- [ ] Component test: `Select.tsx`
- [ ] Component test: `Upload.tsx`
- [ ] Component test: `Prompt.tsx`
- [ ] Component test: `Repeat.tsx`
- [ ] Configurare Playwright per smoke test E2E
- [ ] E2E: flusso CRUD completo (add → edit → delete)
- [ ] E2E: login Google
- [x] Aggiungere script `test`, `test:watch`, `test:coverage` in `package.json`
- [ ] Aggiungere CI check (GitHub Actions o equivalente)

---

## CR-007 — Showcase app

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Alta — anticipata per testare visivamente CR-004  
**Stima:** 3–4 settimane  
**Dipende da:** CR-002, CR-004 (rimossa dipendenza da CR-006 — la showcase serve anche come test visivo)  
**Breaking change:** No (app separata)

### Motivazione
Una showcase app serve a tre cose contemporaneamente: documentazione interattiva per sviluppatori, test manuale visivo di ogni componente con ogni combinazione di props, e stress test di corner case reali. È anche il modo più efficace per mostrare il framework a chi non lo conosce. Anticipata rispetto a CR-006 perché è necessaria per verificare visivamente CR-004 (Tailwind migration).

### Struttura

App separata in `clients/showcase/` nella root del repo (non dentro `src/`). Usa il framework stesso come dipendenza locale:

```
clients/showcase/
  package.json                   ← dipendenza: "react-firestrap": "file:../../"
  webpack.config.js              ← dev/build webpack, entry `src/index.tsx`
  src/
    index.tsx                    ← entry `<App>` react-firestrap + provider/env config
    conf/
      menu.ts                    ← menuConfig canonico per navigazione e pagine
    layout/
      ShowcaseLayout.tsx         ← LayoutDefault custom con sidebar/topbar
    pages/
      index.tsx                  ← home: overview del framework, link rapidi
      components/
        input/
          index.tsx              ← panoramica Input con tutti i tipi
          string.tsx             ← Input.String — tutti i props configurabili live
          number.tsx
          email.tsx
          password.tsx
          color.tsx
          date.tsx
          datetime.tsx
        select/
          index.tsx
          basic.tsx              ← Select da array statico
          from-db.tsx            ← Select da DataProvider
          autocomplete.tsx
          checklist.tsx
        upload/
          index.tsx
          image.tsx              ← UploadImage con crop
          document.tsx
          csv.tsx
        form/
          index.tsx
          basic.tsx              ← Form minimo funzionante
          nested-objects.tsx     ← dot notation su oggetti profondi
          arrays.tsx             ← array index notation
          validation.tsx         ← tutti i casi di validazione
          callbacks.tsx          ← onLoad, onSave, onFinally, onDelete
          ref.tsx                ← FormRef e controllo esterno del form
          custom-save-path.tsx
          custom-primary-key.tsx
        grid/
          index.tsx
          basic.tsx              ← Grid minimo
          sorting.tsx            ← sorting multi-colonna
          pagination.tsx
          group-by.tsx
          real-time.tsx          ← mostra update in real-time
          modal-form.tsx         ← modal add/edit con form
          custom-columns.tsx     ← ColumnFormatter personalizzati
          gallery-mode.tsx       ← type="gallery"
          allowed-actions.tsx    ← combinazioni di allowedActions
        prompt/
          index.tsx
          editor-mode.tsx        ← PromptMode.EDITOR
          live-mode.tsx          ← PromptMode.LIVE con AI reale
          template-vars.tsx      ← interpolazione variabili nel template
        ai-assistant/
          index.tsx
        repeat/
          index.tsx
          with-form.tsx          ← Repeat dentro un Form
        theme/
          index.tsx              ← switch tema live
          custom-theme.tsx       ← importTheme() con tema custom
      providers/
        index.tsx                ← confronto provider side-by-side
        firebase.tsx             ← stessa UI con FirebaseDataProvider
        supabase.tsx             ← stessa UI con SupabaseDataProvider
      corner-cases/
        index.tsx
        empty-states.tsx         ← Grid/Form con dati vuoti
        deep-nesting.tsx         ← dot notation a 5+ livelli
        large-dataset.tsx        ← Grid con 10.000+ record
        concurrent-updates.tsx   ← real-time con modifiche concorrenti
        null-values.tsx          ← campi con null/undefined/0/false
        special-chars.tsx        ← path con caratteri speciali
        slow-network.tsx         ← comportamento con latenza simulata
```

### Pattern di ogni pagina componente

Ogni pagina segue la stessa struttura per consistenza:

```
┌─────────────────────────────────────────────────────┐
│ NomeComponente                                       │
│ Descrizione breve di cosa fa                        │
├──────────────────────┬──────────────────────────────┤
│                      │  Props configurabili          │
│   PREVIEW LIVE       │  ─────────────────────────── │
│                      │  label: [input testo]         │
│   [componente qui]   │  required: [toggle]           │
│                      │  defaultValue: [input]        │
│                      │  disabled: [toggle]           │
├──────────────────────┴──────────────────────────────┤
│ Codice generato (aggiornato live)                   │
│ <Input name="field" label="..." required />         │
├─────────────────────────────────────────────────────┤
│ Corner cases                                        │
│ [caso 1] [caso 2] [caso 3] ...                      │
└─────────────────────────────────────────────────────┘
```

Il codice generato live è particolarmente utile per l'AI: un developer (o un AI) può configurare visivamente il componente e ottenere il codice esatto da copiare.

### Checklist

- [x] Creare `clients/showcase/` con webpack + React + Tailwind
- [x] Collegare come dipendenza locale (`file:../../`)
- [x] Configurare router (react-router-dom) con sidebar
- [x] Creare layout: sidebar navigazione + area preview + blocco codice copiabile
- [x] Creare componente `PageLayout` — header pagina con titolo e descrizione
- [x] Creare componente `Section` — preview live + codice con pulsante copia
- [x] Home page con overview, quick links e quick start
- [x] Pagina Alert: tutte le varianti, senza icona, con timeout
- [x] Pagina Badge: tutte le varianti, in contesto con testo e bottoni
- [x] Pagina Button: solid, outline, link, disabilitato, stato loading
- [x] Pagina Card: base, con header/footer, griglia di card
- [x] Pagina Loader: spinner inline, Loader come wrapper
- [x] Pagina Modal: tutte le posizioni (center/left/right/top/bottom), ModalYesNo
- [x] Pagina Pagination: demo interattiva 50 record, spiegazione sticky
- [x] Pagina Tab: tutte le posizioni (default/top/left/right/bottom)
- [x] Pagina Table: striping, selezione riga, colonne custom
- [x] Build webpack production pulita (0 errori)
- [x] Pagine Input: tutti i tipi (string, number, email, password, color, date, datetime, week, month)
- [x] Pagine Select: basic, static options, checklist
- [ ] Pagine Select: from-db (richiede DataProvider live), autocomplete
- [ ] Pagine Upload: image (con crop), document, CSV
- [x] Pagine Form: basic, nested-objects, edit existing record, lifecycle hooks — powered by MockDataProvider
- [x] Pagine Grid: read-only table, full CRUD, pagination, column formatters, in-memory dataArray — powered by MockDataProvider
- [x] MockDataProvider: implementazione in-memory del DataProvider per showcase offline
- [ ] Pagine Providers: confronto Firebase vs Supabase side-by-side
- [ ] Pagina Theme: switch tema live + custom theme
- [ ] Deploy (GitHub Pages o Vercel)
- [ ] Link alla showcase da `CLAUDE.md` e `docs/`

---

## CR-008 — Tema `empty` → Tailwind + shadcn/ui

**Stato:** ⬜ todo  
**Branch:** `modernize/theme-empty-tailwind`  
**Priorità:** Bassa  
**Dipende da:** CR-004  
**Stima:** 1 giorno  
**Breaking change:** No — tema passthrough, nessuna logica visiva propria

### Scope

Tema minimale: passa solo `{children}` senza layout proprio. L'unica dipendenza Bootstrap è il CDN in `index.html` e `app.min.css`.

### Checklist

- [ ] Rimuovere Bootstrap 5.3 CDN e Bootstrap Icons da `public/index.html`
- [ ] Sostituire `app.min.css` con `globals.css` Tailwind (preflight + CSS variables shadcn)
- [ ] Aggiornare `theme.js` — token Tailwind vuoti (il tema non ha stile proprio)
- [ ] Verificare che `{children}` venga renderizzato correttamente senza Bootstrap

---

## CR-009 — Tema `default` → Tailwind + shadcn/ui

**Stato:** ⬜ todo  
**Branch:** `modernize/theme-default-tailwind`  
**Priorità:** Bassa  
**Dipende da:** CR-004  
**Stima:** 2–3 giorni  
**Breaking change:** Sì — layout visivo cambia (Bootstrap navbar/offcanvas → Tailwind/Sheet)

### Scope

Tema con navbar top, sidebar offcanvas (Bootstrap), layout flex. Struttura: `Header.js`, `Sidebar.js`, `Default.js`, `Footer.js`.

### Bootstrap → shadcn/ui mapping

| Bootstrap | Tailwind + shadcn/ui |
|-----------|---------------------|
| `Offcanvas` sidebar mobile | `Sheet` |
| `navbar` + `navbar-expand-lg` | `flex` + breakpoint Tailwind |
| `DropdownMenu` | shadcn `DropdownMenu` |
| `d-flex`, `align-items-center` ecc. | utility Tailwind dirette |
| `data-bs-toggle` JS behaviors | `useState` React |

### Checklist

- [ ] Rimuovere Bootstrap CDN da `public/index.html`
- [ ] Convertire `Header.js` → Tailwind flex navbar + shadcn `DropdownMenu`
- [ ] Convertire `Sidebar.js` → shadcn `Sheet` (mobile) + flex fisso (desktop)
- [ ] Convertire `Default.js` layout → Tailwind `flex flex-col h-screen`
- [ ] Convertire `Footer.js` → Tailwind utilities
- [ ] Convertire `theme.js` — tutti i token Bootstrap → Tailwind
- [ ] Rimuovere `app.min.css`, aggiungere `globals.css` Tailwind
- [ ] Test visivo: navbar responsive, sidebar mobile/desktop

---

## CR-010 — Tema `flat` → Tailwind + shadcn/ui

**Stato:** ⬜ todo  
**Branch:** `modernize/theme-flat-tailwind`  
**Priorità:** Bassa  
**Dipende da:** CR-004  
**Stima:** 2–3 settimane  
**Breaking change:** Sì — layout e stile completamente riscritti

### Scope

Admin dashboard completo con sidebar gerarchica collassabile, header con notifiche e dropdown, pageheader, preloader, sistema preset colori (`data-pc-preset`). CSS locale custom 10K+ righe (`style.css` + `style-preset.css`) + `pcoded.js` per sidebar/header JS.

### Strategia

1. **Eliminare** `style.css`, `style-preset.css`, `pcoded.js` — tutto il comportamento JS del sidebar viene riscritto in React con `useState`
2. **Ricostruire** il layout system (`.app`, `.app-content`, `.pc-container`) con Tailwind
3. **Sistema preset colori** → `tailwind.config.js` `extend.colors` + CSS variables shadcn (sostituisce `data-pc-preset`)
4. **Icone** → sostituire Phosphor duotone con Lucide (già bundled in shadcn)

### Bootstrap → shadcn/ui mapping

| Attuale | Tailwind + shadcn/ui |
|---------|---------------------|
| `.pc-sidebar` + pcoded.js collapse | `Collapsible` shadcn per submenu, `useState` per open/close |
| `.pc-header` + Bootstrap dropdown | `DropdownMenu` shadcn |
| Offcanvas mobile sidebar | `Sheet` shadcn |
| `data-pc-preset="preset-N"` CSS vars | CSS variables shadcn + `tailwind.config.js` colors |
| Phosphor icons (`ph-duotone ph-*`) | Lucide icons |
| `.loader-bg` + CSS animation | Tailwind `animate-*` |

### Checklist

- [ ] Rimuovere `style.css`, `style-preset.css`, `pcoded.js` da `public/`
- [ ] Ricostruire `Default.js` layout — `.app`, `.app-content`, `.pc-container` in Tailwind
- [ ] Ricostruire `Sidebar.js` — menu gerarchico con `Collapsible` shadcn, open/close con `useState`
- [ ] Ricostruire `Header.js` — top bar con shadcn `DropdownMenu`, `Sheet` per mobile
- [ ] Ricostruire `PageHeader.js` — breadcrumb + titolo in Tailwind grid
- [ ] Ricostruire `PreLoader.js` — `animate-spin` o `animate-pulse` Tailwind
- [ ] Ricostruire `Notifications.js` con shadcn `Popover` o `DropdownMenu`
- [ ] Ricostruire sistema preset colori → `tailwind.config.js` + CSS variables shadcn
- [ ] Sostituire Phosphor icons con Lucide
- [ ] Convertire `theme.js` — token Bootstrap → Tailwind
- [ ] Aggiornare `public/index.html` — rimuovere tutti i bundle Bootstrap
- [ ] Test visivo: sidebar collapse, submenu, mobile responsiveness, preset switch

---

## CR-011 — Tema `cyber` → Tailwind + shadcn/ui

**Stato:** ⬜ todo  
**Branch:** `modernize/theme-cyber-tailwind`  
**Priorità:** Bassa  
**Dipende da:** CR-004, CR-010 (condivide la struttura `.pc-*` con flat)  
**Stima:** 2–3 settimane  
**Breaking change:** Sì — layout e stile completamente riscritti

### Scope

Admin dashboard con struttura identica a `flat` ma palette "cyberpunk" (scuri, accenti neon), Bootstrap Icons invece di Phosphor. CSS: `vendor.min.css` (Bootstrap + vendor) + `app.min.css` (custom) + `bootstrap.bundle.min.js`.

### Strategia

Riusa la struttura React ricostruita in CR-010 (stesso sistema `.pc-*`), cambia:
- Palette colori → CSS variables shadcn con toni dark/neon
- Icone → Bootstrap Icons (`bi bi-*`) o Lucide
- Stile custom → Tailwind utilities per effetti "cyber" (borders, shadows, ring glow)

### Checklist

- [ ] Rimuovere `vendor.min.css`, `app.min.css`, `bootstrap.bundle.min.js` da `public/`
- [ ] Portare la struttura layout/sidebar/header da CR-010 (stesso sistema `.pc-*`)
- [ ] Applicare palette "cyber" → CSS variables shadcn dark mode + colori accent neon in `tailwind.config.js`
- [ ] Ricostruire `Sidebar.js` con stile cyber (border accent, dark bg)
- [ ] Ricostruire `Header.js` con stile cyber
- [ ] Decidere icone: mantenere Bootstrap Icons come font esterno o migrare a Lucide
- [ ] Convertire `theme.js` — token Bootstrap → Tailwind con classi cyber
- [ ] Aggiornare `public/index.html`
- [ ] Test visivo: dark theme, accenti neon, responsive

---

## CR-012 — Showcase refactor — react-firestrap native

**Stato:** ⬜ todo  
**Branch:** `modernize/cr-012-showcase-native`  
**Priorità:** Alta  
**Dipende da:** CR-004, CR-007  
**Stima:** 3–5 giorni  

### Motivazione

Il client `clients/showcase/` è nato come prototipo Vite standalone per sviluppare e testare i componenti visivamente. Nel corso del suo sviluppo è cresciuto in modo organico usando HTML grezzo, classi Bootstrap manuali e un routing custom — tutto materiale che non ha nulla a che fare con il framework stesso.

Questo è un problema su due livelli:

1. **Non è una prova autentica del framework.** Se il progetto più visibile di react-firestrap non usa react-firestrap, il framework perde credibilità come strumento di sviluppo reale.
2. **Duplicazione di soluzioni.** Ogni cosa costruita nello showcase da zero (layout, routing, menu, modal, form) è già risolta dal framework. Riscriverla in parallelo è spreco di codice e crea divergenza.

L'obiettivo di CR-012 è ricostruire `clients/showcase/` *integralmente* usando solo i pattern e i componenti descritti in `CLAUDE.md`: `<App>`, `menuConfig`, `LayoutDefault`, `Grid`, `Form`, `Modal`, provider, ecc. Lo showcase diventa così la documentazione vivente più credibile del framework — ogni feature esposta è una feature dimostrata in produzione.

### Scope

**Incluso:**
- Eliminare tutto il codice che non usa react-firestrap nativamente (routing custom, layout a mano, classi Bootstrap scritte a mano)
- Adottare `<App>` come entry point con `menuConfig` per la navigazione laterale
- Usare `LayoutDefault` (o un `importLayout` custom minimo) per header, sidebar, breadcrumb
- Ogni pagina del catalogo componenti dimostra il componente usando react-firestrap direttamente
- La pagina "Providers" mostra una configurazione reale con `DataProvider`, `StorageProvider`, ecc.
- La pagina "Theme" usa il `ThemePanel` collegato a CSS variables reali di react-firestrap
- Il client usa webpack come bundler unico dello showcase (`webpack.config.js` + `src/index.tsx`)

**Escluso:**
- Modifiche al core del framework (se serve cambiare qualcosa nel core, aprire CR separata)
- Firebase reale (lo showcase usa `dataArray` statici o un mock `DataProvider`)

### Architettura target

```
clients/showcase/
  src/
    index.tsx           ← <App> entry point, zero routing custom
    conf/
      menu.ts           ← menuConfig con voci per ogni sezione
    layout/
      ShowcaseLayout.tsx  ← LayoutDefault wrapper con Topbar e ThemePanel
    pages/
      components/       ← una pagina per componente (Alert, Badge, Card, ...)
      providers/        ← demo configurazione provider
      theme/            ← pannello tema con live CSS variables
      grid/             ← Grid CRUD demo con dataArray
      form/             ← Form demo con schema
    globals.css         ← solo @import tailwindcss + @theme inline (niente layout custom)
  webpack.config.js     ← entry `src/index.tsx`, alias peer deps, HtmlWebpackPlugin
  tsconfig.json         ← paths per react-firestrap (invariato)
```

### Decisione bundler

Lo showcase usa **webpack**. Motivi:
- Gli script effettivi del client (`dev`, `start`, `build`) puntano a `webpack serve` / `webpack --mode production`
- `webpack.config.js` usa `src/index.tsx`, che contiene la configurazione consumer completa (env Firebase, OAuth, AI, layout e menu)
- Il client showcase deve validare anche il percorso webpack storico usato dallo scaffolding del framework
- I residui Vite (`vite.config.ts`, `index.html`, `src/main.tsx`) sono stati rimossi per mantenere una sola entry point

La scelta webpack è un dettaglio di tooling del client, non un'API del framework. Non condiziona la dimostrazione dei pattern react-firestrap.

### Checklist

#### Setup
- [ ] Creare branch `modernize/cr-012-showcase-native`
- [ ] Rimuovere il routing custom da `App.tsx` dello showcase
- [ ] Adottare `<App>` di react-firestrap come entry point
- [ ] Definire `menuConfig` in `src/conf/menu.ts` con tutte le sezioni del catalogo

#### Layout
- [ ] Implementare `ShowcaseLayout.tsx` usando `LayoutDefault` (o il wrapper minimo equivalente)
- [ ] Integrare `Topbar` e `ThemePanel` nel layout custom
- [ ] Verificare dark mode, responsive, z-index sidebar

#### Pagine componenti
- [ ] `AlertPage` — usa `<Alert>` di react-firestrap, mostra tutte le varianti
- [ ] `BadgePage` — usa `<Badge>` di react-firestrap
- [ ] `CardPage` — usa `<Card>` di react-firestrap
- [ ] `ButtonPage` — usa `<LoadingButton>`, `<ActionButton>` di react-firestrap
- [ ] `ModalPage` — usa `<Modal>`, `<ModalYesNo>`, `<ModalOk>` con tutte le posizioni
- [ ] `InputPage` — usa `<Input>` con tutti gli `inputType`
- [ ] `SelectPage` — usa `<Select>`, `<Select.Autocomplete>`, `<Select.Checklist>`
- [ ] `UploadPage` — usa `<Upload>`, `<Upload.Image>`, `<Upload.Document>`
- [ ] `TablePage` — usa `<Grid type="table">` con `dataArray` statico
- [ ] `GalleryPage` — usa `<Grid type="gallery">` con `dataArray` statico

#### Pagine avanzate
- [ ] `FormPage` — Form standalone con schema reale, `onLoad`, `onSave`, `onFinally`
- [ ] `GridCrudPage` — Grid con `allowedActions`, `modal`, `groupBy`, `pagination`
- [ ] `ProvidersPage` — Descrive e dimostra la configurazione dei provider
- [ ] `ThemePage` — Live CSS variables con `ThemePanel` integrato

#### Qualità
- [ ] Zero classi Bootstrap scritte a mano nelle pagine (tutto passa dai componenti)
- [ ] Nessun routing custom (tutto gestito da `<App>` e `menuConfig`)
- [ ] TypeScript senza errori (`tsc --noEmit` pulito)
- [ ] Test visivo completo: light/dark, tutti i preset tema, tutte le icon library
- [ ] Aggiornare `docs/CHANGE_REQUESTS.md` — stato CR-007 e CR-012 a ✅

---

## CR-013 — Icon provider system

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-004  

### Motivazione

Il sistema di icone precedente usava classi Bootstrap (`<i className="bi-...">`) con risoluzione attraverso il tema. Non aveva nessuna astrazione portabile: cambiare libreria di icone significava modificare ogni componente.

La modernizzazione CR-004 (Tailwind) richiede SVG-based icons. La scelta della libreria (Lucide, Phosphor, Heroicons...) deve essere una decisione dell'app consumer, non della libreria, esattamente come avviene per DataProvider e StorageProvider.

### Principio di design: convention over configuration

Per evitare la mappatura manuale di ogni icona, il provider usa **auto-risoluzione PascalCase**:

```
"arrow-right"   → ArrowRight   ✓  (auto)
"check-circle"  → CheckCircle  ✓  (auto)
"sun"           → Sun          ✓  (auto)
```

Solo i nomi che **divergono per convenzione** tra librerie entrano nell'alias map (~10-15 per libreria, non 200+).

### Scope

#### Library (`src/`)

```
src/providers/icon/
  IconProvider.ts           ← interface: id, resolve(name)
  IconProviderContext.tsx   ← React Context + useIconProvider() hook
  IconProviderProvider      ← wrapper componente
  LucideIconProvider.tsx    ← impl Lucide: auto-PascalCase + alias map
  PhosphorIconProvider.tsx  ← impl Phosphor: auto-PascalCase + alias map + weight
  index.ts                  ← barrel export

src/components/ui/Icon.tsx  ← riscritto: usa useIconProvider(), props: name, size, className, provider?
src/App.tsx                 ← aggiunto iconProvider?: IconProvider prop → MaybeIconProvider wrapper
src/index.ts                ← export dei nuovi tipi e classi
package.json                ← lucide-react e @phosphor-icons/react come optionalPeerDependencies + devDependencies
```

#### Showcase (`clients/showcase/`)

```
src/context/ThemeContext.tsx  ← aggiunto iconLibraryId state + setIconLibrary() + IconProviderProvider wrapper
src/components/Icon.tsx       ← semplificato: re-export da react-firestrap (rimosse map locali)
src/components/ThemePanel.tsx ← usa setIconLibrary() da ThemeContext invece di setIconLibrary() locale
src/pages/docs/Icons.tsx      ← NUOVA pagina documentazione completa
src/conf/menu.ts              ← aggiunta voce /docs/icons
```

### Architettura

```
ShowcaseThemeProvider (stato iconProvider)
  └── IconProviderProvider (context)
        └── App
              └── Icon name="search"
                    └── useIconProvider() → provider.resolve("search") → <Search size={16} />
```

Il consumer sceglie il provider una volta sola. Tutto il codice consumer usa `<Icon name="...">` senza mai importare dalla libreria specifica.

### PhosphorIconProvider — feature weight

Phosphor supporta 6 pesi (thin, light, regular, bold, fill, duotone). Si passa al costruttore:

```ts
new PhosphorIconProvider('bold')   // tutti i componenti dell'app avranno icone bold
new PhosphorIconProvider('fill')   // icone filled
```

Il PhosphorIconProvider fa caching dei componenti wrappati per evitare re-render.

### Provider custom

```ts
import type { IconProvider, IconComponentProps } from 'react-firestrap';

export class HeroIconProvider implements IconProvider {
    readonly id = 'heroicons';
    resolve(name: string) {
        const key = toPascalCase(name) + 'Icon';
        return (HeroIcons as any)[key] ?? null;
    }
}
```

### Checklist

- [x] Creare `src/providers/icon/IconProvider.ts`
- [x] Creare `src/providers/icon/LucideIconProvider.tsx`
- [x] Creare `src/providers/icon/PhosphorIconProvider.tsx`
- [x] Creare `src/providers/icon/IconProviderContext.tsx`
- [x] Creare `src/providers/icon/index.ts`
- [x] Riscrivere `src/components/ui/Icon.tsx`
- [x] Aggiornare `src/App.tsx` — prop `iconProvider` + `MaybeIconProvider`
- [x] Aggiornare `src/index.ts` — export nuovi tipi
- [x] Aggiornare `package.json` — optionalPeerDependencies + devDependencies
- [x] Aggiornare `clients/showcase/src/context/ThemeContext.tsx`
- [x] Semplificare `clients/showcase/src/components/Icon.tsx`
- [x] Aggiornare `clients/showcase/src/components/ThemePanel.tsx`
- [x] Creare `clients/showcase/src/pages/docs/Icons.tsx`
- [x] Aggiornare `clients/showcase/src/conf/menu.ts`
- [ ] Rebuild libreria (`npm run build`) — verificare zero errori TypeScript
- [ ] Test visivo showcase: switch Lucide ↔ Phosphor, tutti i pesi Phosphor
- [ ] Aggiornare `CLAUDE.md` con il pattern IconProvider

---

## CR-014 — Raffinazione componenti — props e comportamenti

**Stato:** ⬜ todo  
**Branch:** `modernize/cr-014-component-refinement`  
**Priorità:** Media  
**Dipende da:** CR-007 (serve la showcase per avere visibilità su ogni componente)  
**Stima:** ongoing — affrontata per componente dopo CR-007 completa  
**Breaking change:** Potenziale — props rinominate o tipi più stretti

### Motivazione

Durante lo sviluppo della showcase (CR-007) è emerso che diversi componenti hanno props non dichiarate nel tipo, comportamenti impliciti non documentati, o mancano di varianti già usate internamente ma non esposte all'esterno. La showcase serve da "specchio": ogni sezione di demo rivela cosa manca o è inconsistente nell'API pubblica.

Questa CR è un **contenitore evolutivo**: non ha una deadline fissa, ma raccoglie tutto il debito di API che emerge man mano che la showcase viene completata e i test (CR-006) vengono scritti.

### Scope

Per ogni componente censito, verificare e correggere:

1. **Completezza dei tipi** — tutte le props usabili devono essere dichiarate nell'interfaccia TypeScript esportata
2. **Documentazione inline** — JSDoc minimo sulle props non ovvie
3. **Comportamenti impliciti** — es. `updatable` di Input, `optionEmpty` di Select, `setPrimaryKey` di Form: vanno testati e documentati
4. **Consistenza naming** — verificare che le props seguano una convenzione uniforme tra componenti (es. `wrapClass` vs `className`, `label` vs `title`)
5. **Default sensati** — props opzionali con default ragionevoli invece di `undefined` silenzioso

### Componenti da rivedere (censimento iniziale)

| Componente | Issue noti | Priorità |
|------------|-----------|----------|
| `Input` | `type` vs `inputType` usati in modo inconsistente nella codebase consumer | Alta |
| `Select` | `placeholder` non esposto su `SelectProps` (solo su `AutocompleteProps`) | Alta |
| `Select` | `db` prop usa `srcPath` invece di `path` come nel DataProvider | Media |
| `Form` | `aspect="none"` non valido (solo `"card" \| "empty"`) — manca un terzo valore o il bare layout | Media |
| `Grid` | `pagination.perPage` non esiste — si usa `limit` ma la docs dice `perPage` | Alta |
| `Grid` | `groupBy` non testato nella showcase | Media |
| `Modal` | `footerClose` prop aggiunta ma non nei tipi esportati | Bassa |
| `Icon` | `icon` prop (deprecated) ancora in uso in `Input`, `Upload`, `UploadCSV` | Bassa |

### Processo

Per ogni componente: aprire un sotto-task nella checklist, aggiornare il tipo, aggiornare la showcase, aggiornare i test (CR-006).

### Checklist

- [ ] Audit completo di tutti i componenti in `src/components/ui/` e `src/components/ui/fields/`
- [ ] Fix `Input`: chiarire `type` vs deprecato `inputType`
- [ ] Fix `Select`: esporre `placeholder` su `SelectProps` o documentare perché non c'è
- [ ] Fix `Select`: allineare naming `db.srcPath` → `db.path` (o documentare il mismatch)
- [ ] Fix `Form`: aggiungere `aspect="none"` o rinominare la variante bare
- [ ] Fix `Grid`: rinominare `pagination.limit` → `pagination.perPage` (o viceversa, con alias)
- [ ] Fix `Modal`: aggiungere `footerClose` ai tipi esportati
- [ ] Fix `Icon`: completare deprecazione `icon` prop, rimuovere dopo migration
- [ ] Aggiornare showcase per ogni fix — le pagine di demo diventano smoke test visivi
- [ ] Aggiornare `CLAUDE.md` con le API corrette dopo ogni fix

---

## CR-015 — Vite toolchain framework + scaffolding

**Stato:** ✅ done
**Branch:** `modernize/cr-015-vite-toolchain`
**Priorità:** Alta
**Dipende da:** CR-003, CR-004, CR-006
**Stima:** 3–5 giorni
**Breaking change:** Potenziale — cambia la toolchain di build e lo scaffold generato, non le API React pubbliche

### Motivazione

La modernizzazione del framework non deve fermarsi ai componenti e ai provider. Oggi la libreria e lo showcase vivono ancora su webpack, mentre lo stack React moderno usa sempre più spesso Vite per sviluppo rapido, build prevedibili e setup minimale.

Portare react-firestrap a Vite rende coerenti framework, consumer e scaffolding: un nuovo progetto generato dal CLI deve nascere già con la stessa toolchain che usiamo per validare il framework stesso.

### Obiettivo

Migrare la toolchain del framework a un modello Vite-first:

- build libreria con Vite library mode, oppure alternativa leggera equivalente se motivata (`tsup` solo se produce un risultato più pulito)
- output `dist/` compatibile con gli export pubblici attuali
- CSS bundle `dist/index.css` mantenuto
- dichiarazioni TypeScript `.d.ts` generate e pubblicate
- test Vitest invariati o semplificati
- CLI/scaffolding aggiornato per generare app Vite + React + Tailwind + provider configuration

### Scope

**Incluso:**
- Aggiungere `vite.config.mts` per la libreria root
- Valutare e rimuovere `webpack.config.js` dalla build principale solo quando Vite produce output equivalente
- Aggiornare `package.json` root: script `build`, `build:dev`, `watch/dev`, export ESM/CJS se necessari
- Verificare peer dependencies e externalization di React, ReactDOM, React Router, Firebase, icon libraries
- Mantenere `src/index.ts` come entry pubblica della libreria
- Aggiornare generazione CSS Tailwind in `dist/index.css`
- Aggiornare `bin/cli.js` e `scripts/cli/*` per scaffold Vite-first
- Lo scaffold deve creare `src/index.tsx`, `src/conf/menu.ts`, `src/layout/`, `src/pages/`, `src/globals.css`
- Lo scaffold deve configurare provider selezionati: Firebase, Supabase, mock/custom
- Aggiornare `README.md`, `CLAUDE.md`, `docs/patterns.md`, `docs/architecture.md`

**Escluso:**
- Riscrivere lo showcase: viene fatto in CR-016
- Cambiare API pubbliche di `App`, `Form`, `Grid`, providers o componenti UI
- Migrare i temi legacy `default`, `flat`, `cyber`, `empty` oltre quanto serve per buildare

### Architettura target root

```
react-firestrap/
  vite.config.mts             ← build libreria Vite-first
  tsconfig.json               ← strict + declarations
  package.json                ← exports coerenti con dist ESM/CSS/types
  src/
    index.ts                  ← public entry invariata
    globals.css               ← Tailwind/theme source
  scripts/cli/
    setup-project.js          ← genera consumer Vite
    templates/                ← se necessario, template scaffold
```

### Scaffold target

```
my-app/
  index.html
  vite.config.ts
  package.json
  src/
    index.tsx                 ← render <App>
    globals.css               ← import CSS app + eventuali override
    conf/
      menu.ts                 ← menuConfig
    layout/
      AppLayout.tsx           ← LayoutDefault consumer
    pages/
      Home.tsx
    providers/
      firebase.ts             ← opzionale, se scelto Firebase
      supabase.ts             ← opzionale, se scelto Supabase
```

### Checklist

- [x] Audit output webpack attuale: file prodotti, CSS, declarations, externals, export map
- [x] Aggiungere `vite.config.mts` root in library mode
- [x] Configurare externals per React, ReactDOM, React Router, Firebase, Lucide, Phosphor
- [x] Verificare generazione `dist/index.js` o decidere nuova export map ESM/CJS
- [x] Verificare generazione `dist/index.css`
- [x] Verificare generazione `dist/types`
- [x] Aggiornare `package.json` root: `main`, `module`, `types`, `style`, `exports`
- [x] Aggiornare script root: `build`, `build:dev`, `watch:dev`
- [x] Mantenere un comando legacy webpack temporaneo solo se serve confronto (`build:webpack`)
- [x] Eseguire build Vite e confrontare API pubbliche esportate
- [x] Eseguire `npm run test`
- [x] Aggiornare CLI scaffolding a Vite-first
- [x] Aggiungere prompt provider nello scaffolding: Firebase / Supabase / Mock / Custom
- [x] Generare `src/conf/menu.ts` nello scaffold
- [x] Generare `src/index.tsx` con `<App>` e provider config
- [x] Generare `vite.config.ts` consumer con alias/dedupe minimi
- [x] Aggiornare docs e README con Vite come percorso raccomandato
- [x] Aggiornare `CLAUDE.md` con la nuova toolchain
- [x] Aggiornare `CHANGELOG.md`

### Criteri di accettazione

- [x] `npm run build` root passa con Vite
- [x] `npm run test` passa
- [x] `npm pack --dry-run` contiene `dist`, types, CSS, CLI e themes previsti
- [x] Uno scaffold generato installa dipendenze e parte con `npm run dev`
- [x] Un consumer Vite importa `react-firestrap` senza doppia istanza React
- [x] Gli import CSS documentati funzionano: `import 'react-firestrap/dist/index.css'`

---

## CR-016 — Showcase Vite + scaffold-first

**Stato:** ✅ done
**Branch:** `modernize/cr-016-showcase-vite`
**Priorità:** Alta
**Dipende da:** CR-012, CR-015
**Stima:** 2–4 giorni
**Breaking change:** No per la libreria; cambia la struttura interna di `clients/showcase`

### Motivazione

Dopo CR-015, lo showcase deve diventare il primo consumer reale dello scaffold Vite generato dal framework. Non deve essere un client speciale mantenuto a mano: deve dimostrare che un'app nata dallo scaffolding ufficiale può documentare, validare e usare react-firestrap in modo completo.

Questo chiude il cerchio del refactoring: il framework usa Vite, lo scaffolding genera Vite, e lo showcase viene ricostruito con quella stessa struttura.

### Obiettivo

Ricostruire `clients/showcase/` come app Vite scaffold-first:

- struttura uguale o quasi uguale a quella generata dal CLI aggiornato in CR-015
- entry `src/index.tsx`
- menu canonico in `src/conf/menu.ts`
- layout custom in `src/layout/ShowcaseLayout.tsx`
- providers mock/offline configurati come in un consumer reale
- pagine componenti, provider, temi e docs migrate senza routing custom parallelo

### Scope

**Incluso:**
- Reintrodurre Vite nello showcase solo dopo CR-015
- Sostituire `webpack.config.js` con `vite.config.mts`
- Aggiornare `package.json` showcase: `dev`, `build`, `preview`
- Usare lo scaffold generato come base strutturale
- Mantenere `<App>` di react-firestrap come entry applicativa
- Mantenere `src/conf/menu.ts` come unica fonte del menu
- Collegare `ThemePanel`, App `themeProvider`, App `iconProvider` e dark mode
- Usare `MockDataProvider` per demo offline riproducibili
- Validare tutte le pagine già presenti

**Escluso:**
- Cambiare build root della libreria: già coperto da CR-015
- Aggiungere nuove API ai componenti: aprire/aggiornare CR-014 se emerge debito
- Deploy pubblico: può restare task CR-007 o CR separata

### Architettura target showcase

```
clients/showcase/
  index.html
  vite.config.mts
  package.json
  src/
    index.tsx                 ← render <App>
    globals.css
    conf/
      menu.ts                 ← menuConfig unico
    layout/
      ShowcaseLayout.tsx
    components/
      Topbar.tsx
      Sidebar.tsx
      ThemePanel.tsx
      PageLayout.tsx
      Section.tsx
    pages/
      docs/
      components/
      providers/
      examples/
      theme/
```

### Checklist

- [x] Generare una nuova app showcase da CLI CR-015 o allineare manualmente alla struttura prodotta
- [x] Aggiungere `vite.config.mts` showcase con dedupe React/ReactDOM/React Router
- [x] Aggiornare `package.json` showcase: `dev`, `build`, `preview`
- [x] Rimuovere `webpack.config.js` e dipendenze webpack dallo showcase
- [x] Mantenere `src/index.tsx` come entry unica
- [x] Mantenere `src/conf/menu.ts` come menu unico
- [x] Verificare import `react-firestrap/dist/index.css`
- [x] Configurare provider mock/offline per Form, Grid, Select e pagine Providers
- [x] Verificare tema App-managed: light/dark, preset, CSS variables
- [x] Verificare `IconProvider`: Lucide/Phosphor switch e weight Phosphor
- [x] Migrare pagine docs già coperte da CR-015/CR-017; lasciare gli altri stub alle CR dedicate
- [x] Aggiornare pagine docs Installation/Scaffolding per mostrare Vite-first
- [x] Eseguire `npm run build` nello showcase
- [x] Eseguire `npm run dev` e smoke test manuale
- [x] Documentare differenze rispetto al precedente showcase webpack
- [x] Aggiornare `CHANGE_REQUESTS.md`, `README.md`, `CLAUDE.md`

### Criteri di accettazione

- [x] `clients/showcase npm run build` passa con Vite
- [x] `clients/showcase npm run dev` serve l'app senza doppia istanza React
- [x] Navigazione gestita da `<App>` + `menuConfig`, nessun router custom parallelo
- [x] Tutte le pagine principali dello showcase renderizzano
- [x] ThemePanel modifica davvero CSS variables e dark mode
- [x] Switch icone Lucide/Phosphor visibile nello showcase
- [x] Lo showcase ha la stessa struttura dello scaffold ufficiale CR-015

---

## CR-017 — App-managed theme + icon registries

**Stato:** ✅ done
**Branch:** `modernize/cr-017-app-theme-icon-registries`
**Priorità:** Alta
**Dipende da:** CR-004, CR-013
**Stima:** 2–4 giorni
**Breaking change:** No — estende `App` mantenendo compatibilità con `importTheme` e `iconProvider` esistente

### Motivazione

`App` è già l'orchestratore dei provider principali: data, storage, auth, email e icon provider statico. Tema e icone devono seguire lo stesso principio: il framework offre default sensati, ma il consumer può scegliere, estendere o sovrascrivere tutto da un solo punto.

Oggi lo showcase mantiene un `ThemeContext` locale che gestisce light/dark, preset colore, radius e icon library. Questa logica è utile, ma non deve vivere solo nello showcase: deve diventare una funzionalità del framework, esposta da `App` e controllabile con hook pubblici.

### API target

Uso semplice:

```tsx
<App iconProvider="phosphor" themeProvider="cyber" />
```

Equivalente esplicito:

```tsx
<App
  iconProvider={{ default: 'phosphor' }}
  themeProvider={{ defaultPreset: 'cyber' }}
/>
```

Uso avanzato:

```tsx
<App
  iconProvider={{
    default: 'heroicons',
    providers: {
      heroicons: new HeroIconProvider(),
    },
    aliases: {
      delete: 'trash',
      edit: 'pencil',
    },
  }}
  themeProvider={{
    defaultMode: 'dark',
    defaultPreset: 'brand',
    presets: {
      brand: {
        primary: '346.8 77.2% 49.8%',
        radius: 0.75,
        theme: {
          Button: { className: 'font-semibold' },
          Card: { className: 'shadow-sm' },
        },
      },
    },
    theme: {
      Modal: { size: 'xl' },
    },
  }}
/>
```

### Regole icon registry

Il framework espone provider built-in:

```ts
{
  lucide: new LucideIconProvider(),
  phosphor: new PhosphorIconProvider(),
}
```

`App.iconProvider` accetta:

```ts
type AppIconProviderConfig =
  | string
  | {
      default?: string;
      providers?: Record<string, IconProvider>;
      aliases?: Record<string, string>;
    };
```

Comportamento:

- `undefined` usa `lucide`
- stringa usa quel valore come provider default
- oggetto fa merge con i provider built-in
- `providers` custom aggiungono o sovrascrivono provider built-in
- `aliases` custom si fondono con alias default
- se il provider richiesto non esiste, fallback a `lucide` con warning in development

### Regole theme registry

Il framework espone preset built-in:

```ts
{
  default: { mode: 'light', primary: '221.2 83.2% 53.3%', radius: 0.5 },
  flat:    { mode: 'light', primary: '215 25% 27%',        radius: 0.125 },
  cyber:   { mode: 'dark',  primary: '160 84% 39%',        radius: 0 },
}
```

`App.themeProvider` accetta:

```ts
type AppThemeProviderConfig =
  | string
  | {
      defaultMode?: 'light' | 'dark' | 'system';
      defaultPreset?: string;
      presets?: Record<string, ThemePresetConfig>;
      theme?: Partial<Theme>;
    };
```

Comportamento:

- `undefined` usa preset `default` e mode `light`
- stringa usa quel valore come `defaultPreset`
- oggetto fa merge con i preset built-in
- `presets` custom aggiungono o sovrascrivono preset built-in
- `theme` è un override globale applicato dopo il preset
- applica `.dark` su `document.documentElement`
- applica CSS variables principali, almeno `--rf-primary`, `--rf-primary-foreground`, `--radius`
- mantiene `importTheme` come compatibilità legacy, applicandolo come override asincrono finale

### Hook pubblici

```ts
const theme = useThemeController();

theme.mode;
theme.preset;
theme.primary;
theme.radius;
theme.setMode('dark');
theme.applyPreset('cyber');
theme.setPrimary('346.8 77.2% 49.8%');
theme.setRadius(0.75);
```

```ts
const icons = useIconController();

icons.providerId;
icons.setProvider('phosphor');
icons.registerProvider('heroicons', new HeroIconProvider());
```

### Scope

**Incluso:**
- Estendere `src/Theme.tsx` con theme registry, preset built-in e controller hook
- Estendere `src/App.tsx` con `themeProvider?: AppThemeProviderConfig`
- Evolvere `iconProvider` in `App` per accettare stringa o config avanzata
- Aggiungere un controller per cambiare icon provider a runtime
- Esportare tipi e hook da `src/index.ts`
- Migrare `clients/showcase` a usare `App iconProvider=... themeProvider=...`
- Rimuovere `IconProviderProvider` dal `ShowcaseThemeProvider`
- Ridurre `clients/showcase/src/context/ThemeContext.tsx` a state UI locale, o eliminarlo se `ThemePanel` può usare solo hook framework
- Aggiornare `ThemePanel` per usare `useThemeController()` e `useIconController()`
- Aggiornare docs e `CLAUDE.md`

**Escluso:**
- Migrazione Vite dello showcase: CR-016
- Conversione dei temi legacy completi: CR-008/009/010/011
- Redesign visuale dei componenti: CR-014

### Checklist

- [x] Definire tipi `AppIconProviderConfig`, `AppThemeProviderConfig`, `ThemePresetConfig`
- [x] Aggiungere registry icon built-in: `lucide`, `phosphor`
- [x] Aggiornare `App.iconProvider` per accettare stringa o config
- [x] Aggiungere `IconRegistryProvider` o estendere `IconProviderContext`
- [x] Aggiungere `useIconController()`
- [x] Aggiungere registry theme built-in: `default`, `flat`, `cyber`
- [x] Aggiornare `ThemeProvider` per accettare config diretta oltre a `importTheme`
- [x] Aggiungere `useThemeController()`
- [x] Applicare `.dark` e CSS variables dal provider framework
- [x] Mantenere backward compatibility di `useTheme(section)`
- [x] Mantenere backward compatibility di `importTheme`
- [x] Aggiornare `src/index.ts` con export tipi/hook
- [x] Aggiornare `clients/showcase/src/index.tsx` con `iconProvider="lucide"` e `themeProvider="default"` o preset desiderato
- [x] Aggiornare `ThemePanel` per usare hook framework
- [x] Rimuovere provider icon/theme duplicati dallo showcase
- [x] Aggiornare pagina docs Icons
- [x] Aggiungere pagina docs Theme o completare stub esistente
- [x] Aggiornare `CLAUDE.md`
- [x] Aggiungere test unitari per resolver string/object config
- [x] Eseguire `npm run build`
- [x] Eseguire `npm run test`
- [x] Eseguire `clients/showcase npm run build`

### Criteri di accettazione

- [x] `<App />` usa Lucide + preset `default`
- [x] `<App iconProvider="phosphor" />` cambia provider icone senza configurazione extra
- [x] `<App themeProvider="cyber" />` applica preset `cyber`
- [x] Config avanzate aggiungono provider/preset custom senza perdere quelli built-in
- [x] `ThemePanel` dello showcase controlla tema e icone tramite hook del framework
- [x] Nessun `IconProviderProvider` custom è necessario nello showcase
- [x] Backward compatibility: `importTheme` continua a funzionare
- [x] Backward compatibility: `useTheme(section)` continua a restituire classi e `getIcon`
