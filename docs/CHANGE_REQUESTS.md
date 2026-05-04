# Change Requests

> Ogni CR rappresenta un'unità di lavoro autonoma con motivazione, scope e checklist.  
> Stato: `⬜ todo` · `🔄 in progress` · `✅ done` · `🚫 cancelled`  
> Ultima revisione: 2026-05-04

---

## Indice

| CR | Titolo | Priorità | Dipende da | Stato |
|----|--------|----------|-----------|-------|
| [CR-001](#cr-001--documentazione-ai-first) | Documentazione AI-first | Alta | — | ✅ |
| [CR-002](#cr-002--provider-abstraction-layer) | Provider abstraction layer | Critica | — | ✅ |
| [CR-002b](#cr-002b--authprovider--emailprovider-interfaces) | AuthProvider + EmailProvider interfaces | Alta | CR-002 | ✅ |
| [CR-003](#cr-003--typescript-strict) | TypeScript strict | Alta | — | ✅ |
| [CR-004](#cr-004--shadcnui--tailwind-css) | shadcn/ui + Tailwind CSS | Alta | CR-002 | ⬜ |
| [CR-005](#cr-005--cli-update-e-scaffolding) | CLI update e scaffolding | Media | CR-002, CR-004 | ⬜ |
| [CR-006](#cr-006--batterie-di-test) | Batterie di test | Alta | CR-002, CR-003 | ⬜ |
| [CR-007](#cr-007--showcase-app) | Showcase app | Media | CR-002, CR-004, CR-006 | ⬜ |
| [CR-008](#cr-008--tema-empty--tailwind--shadcnui) | Tema `empty` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |
| [CR-009](#cr-009--tema-default--tailwind--shadcnui) | Tema `default` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |
| [CR-010](#cr-010--tema-flat--tailwind--shadcnui) | Tema `flat` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |
| [CR-011](#cr-011--tema-cyber--tailwind--shadcnui) | Tema `cyber` → Tailwind + shadcn/ui | Bassa | CR-004 | ⬜ |

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

**Stato:** ⬜ todo  
**Branch:** `modernize/tailwind`  
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

### Checklist
- [ ] Installare Tailwind CSS + configurare `tailwind.config.js`
- [ ] Installare shadcn/ui + configurare `components.json`
- [ ] Aggiungere CSS variables shadcn in `globals.css`
- [ ] Riscrivere `Theme.tsx` — tutti i valori Bootstrap → classi Tailwind
- [ ] Migrare `Buttons.tsx` → shadcn Button
- [ ] Migrare `ui/fields/Input.tsx` → shadcn Input
- [ ] Migrare `ui/fields/Select.tsx` → shadcn Select + Combobox
- [ ] Migrare `ui/Modal.tsx` → shadcn Dialog
- [ ] Migrare `ui/Card.tsx` → shadcn Card
- [ ] Migrare `ui/Badge.tsx` → shadcn Badge
- [ ] Migrare `ui/Alert.tsx` → shadcn Alert
- [ ] Migrare `ui/Table.tsx` → shadcn Table
- [ ] Migrare `ui/Tab.tsx` e `TabDynamic.tsx` → shadcn Tabs
- [ ] Migrare `ui/Pagination.tsx` → custom Tailwind
- [ ] Migrare `ui/fields/Upload.tsx` → custom Tailwind
- [ ] Migrare `ui/Loader.tsx` → custom Tailwind
- [ ] Rimuovere Bootstrap da `package.json`
- [ ] Verificare che `importTheme()` funzioni ancora con nuovi valori Tailwind
- [ ] Verificare dark mode via CSS variables shadcn
- [ ] Test visivo completo di tutti i componenti
- [ ] Aggiornare `docs/patterns.md` con esempi Tailwind

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

**Stato:** ⬜ todo  
**Branch:** `modernize/tests`  
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

- [ ] Configurare Vitest + React Testing Library + msw
- [ ] Configurare Firebase Emulator per test di integrazione
- [ ] Creare `createMockDataProvider()` utility
- [ ] Scrivere `DataProvider.contract.ts` (contract test parametrico)
- [ ] Unit test: `converter.ts`
- [ ] Unit test: `path.ts`
- [ ] Unit test: `sanitizer.ts`
- [ ] Unit test: `cache.ts`
- [ ] Unit test: `utils.ts`
- [ ] Integration test: `FirebaseDataProvider` contro emulatore
- [ ] Integration test: `SupabaseDataProvider` contro istanza test
- [ ] Component test: `Form.tsx` — tutti i corner case elencati
- [ ] Component test: `Grid.tsx` — tutti i corner case elencati
- [ ] Component test: `Input.tsx`
- [ ] Component test: `Select.tsx`
- [ ] Component test: `Upload.tsx`
- [ ] Component test: `Prompt.tsx`
- [ ] Component test: `Repeat.tsx`
- [ ] Configurare Playwright per smoke test E2E
- [ ] E2E: flusso CRUD completo (add → edit → delete)
- [ ] E2E: login Google
- [ ] Aggiungere script `test`, `test:unit`, `test:integration`, `test:e2e` in `package.json`
- [ ] Aggiungere CI check (GitHub Actions o equivalente)

---

## CR-007 — Showcase app

**Stato:** ⬜ todo  
**Branch:** `modernize/playground`  
**Priorità:** Media — ultimo step, dopo che tutto è stabile  
**Stima:** 3–4 settimane  
**Dipende da:** CR-002, CR-004, CR-006  
**Breaking change:** No (app separata)

### Motivazione
Una showcase app serve a tre cose contemporaneamente: documentazione interattiva per sviluppatori, test manuale visivo di ogni componente con ogni combinazione di props, e stress test di corner case reali. È anche il modo più efficace per mostrare il framework a chi non lo conosce.

### Struttura

App separata in `playground/` nella root del repo (non dentro `src/`). Usa il framework stesso come dipendenza locale:

```
playground/
  package.json                   ← dipendenza: "react-firestrap": "file:../"
  vite.config.ts
  src/
    App.tsx                      ← router principale con sidebar navigazione
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

- [ ] Creare `playground/` con Vite + React + Tailwind
- [ ] Collegare come dipendenza locale (`file:../`)
- [ ] Configurare router (react-router-dom) con sidebar
- [ ] Creare layout: sidebar navigazione + area preview + pannello props
- [ ] Creare componente `PropsPanel` — controlli dinamici (testo, toggle, select, number)
- [ ] Creare componente `CodePreview` — mostra codice aggiornato live
- [ ] Pagine Input: tutti i tipi (string, number, email, password, color, date, datetime, week, month)
- [ ] Pagine Select: basic, from-db, autocomplete, checklist
- [ ] Pagine Upload: image (con crop), document, CSV
- [ ] Pagine Form: basic, nested-objects, arrays, validation, callbacks, ref, custom-save-path, custom-primary-key
- [ ] Pagine Grid: basic, sorting, pagination, group-by, real-time, modal-form, custom-columns, gallery, allowed-actions
- [ ] Pagine Prompt: editor-mode, live-mode, template-vars
- [ ] Pagine Providers: confronto Firebase vs Supabase side-by-side
- [ ] Pagine Corner cases: tutti gli 8 scenari elencati
- [ ] Pagina Theme: switch tema live + custom theme
- [ ] Home page con overview e quick links
- [ ] Deploy della playground (GitHub Pages o Vercel)
- [ ] Link alla playground da `CLAUDE.md` e `docs/`

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
