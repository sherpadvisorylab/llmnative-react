# Change Requests

> Ogni CR rappresenta un'unità di lavoro autonoma con motivazione, scope e checklist.  
> Stato: `⬜ todo` · `🔄 in progress` · `✅ done` · `🚫 cancelled`  
> Ultima revisione: 2026-05-04

---

## Indice

| CR | Titolo | Priorità | Dipende da | Stato |
|----|--------|----------|-----------|-------|
| [CR-001](#cr-001--documentazione-ai-first) | Documentazione AI-first | Alta | — | ⬜ |
| [CR-002](#cr-002--provider-abstraction-layer) | Provider abstraction layer | Critica | — | ⬜ |
| [CR-003](#cr-003--typescript-strict) | TypeScript strict | Alta | — | ⬜ |
| [CR-004](#cr-004--shadcnui--tailwind-css) | shadcn/ui + Tailwind CSS | Alta | CR-002 | ⬜ |
| [CR-005](#cr-005--cli-update-e-scaffolding) | CLI update e scaffolding | Media | CR-002, CR-004 | ⬜ |
| [CR-006](#cr-006--batterie-di-test) | Batterie di test | Alta | CR-002, CR-003 | ⬜ |
| [CR-007](#cr-007--showcase-app) | Showcase app | Media | CR-002, CR-004, CR-006 | ⬜ |

---

## CR-001 — Documentazione AI-first

**Stato:** ⬜ todo  
**Branch:** `modernize/docs`  
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
- [ ] Scrivere `CLAUDE.md`
- [ ] Scrivere `docs/overview.md`
- [ ] Scrivere `docs/architecture.md`
- [ ] Scrivere `docs/patterns.md`
- [ ] Scrivere `docs/components.md`
- [ ] Scrivere `docs/examples/crud-basic.md`
- [ ] Scrivere `docs/examples/crud-modal.md`
- [ ] Scrivere `docs/examples/form-nested.md`
- [ ] Aggiornare `docs/providers.md` dopo CR-002
- [ ] Scrivere `docs/examples/custom-provider.md` dopo CR-002

---

## CR-002 — Provider abstraction layer

**Stato:** ⬜ todo  
**Branch:** `modernize/providers`  
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
- [ ] Creare `src/providers/data/DataProvider.ts` (interface + tipi)
- [ ] Creare `src/providers/data/DataProviderContext.tsx` (Context + hook)
- [ ] Creare `src/providers/storage/StorageProvider.ts` (interface)
- [ ] Creare `src/providers/storage/StorageProviderContext.tsx`
- [ ] Migrare `firedatabase.ts` → `providers/data/firebase.ts` implementando DataProvider
- [ ] Migrare `firestorage.ts` → `providers/storage/firebase.ts` implementando StorageProvider
- [ ] Scrivere `providers/data/supabase.ts`
- [ ] Scrivere `providers/storage/supabase.ts`
- [ ] Aggiornare `Form.tsx` — sostituire `import db` con `useDataProvider()`
- [ ] Aggiornare `Grid.tsx` — sostituire `import db` con `useDataProvider()`
- [ ] Aggiornare `Upload.tsx` — sostituire storage diretto con `useStorageProvider()`
- [ ] Aggiornare `App.tsx` — accettare `dataProvider` e `storageProvider` come prop
- [ ] Spostare `integrations/ai.ts` → `providers/ai/index.ts`
- [ ] Spostare `integrations/google/GoogleAuth.tsx` → `providers/auth/google/`
- [ ] Spostare `integrations/scrape.ts` → `providers/scrape/index.ts`
- [ ] Spostare `integrations/dropbox.tsx` → `providers/dropbox/index.ts`
- [ ] Rinominare `models/` → `types/`
- [ ] Aggiornare `src/index.ts` con i nuovi export path
- [ ] Aggiornare tutti gli import interni
- [ ] Test manuale: Form con FirebaseDataProvider
- [ ] Test manuale: Grid con FirebaseDataProvider
- [ ] Test manuale: Upload con FirebaseStorageProvider
- [ ] Test manuale: Form con SupabaseDataProvider

---

## CR-003 — TypeScript strict

**Stato:** ⬜ todo  
**Branch:** `modernize/typescript`  
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
- [ ] Abilitare `strict: true` in `tsconfig.json`
- [ ] Definire `type BaseRecord = Record<string, unknown>`
- [ ] Aggiornare `RecordProps` con generic `T extends BaseRecord`
- [ ] Aggiornare `RecordArray` di conseguenza
- [ ] Tipizzare `ColumnFormatter` in Grid
- [ ] Tipizzare `FormRef` (handleSave, handleDelete, getRecord, getHeader, getFooter)
- [ ] Tipizzare `FieldAdapter<TProps>` in Component.tsx
- [ ] Tipizzare `QueryOptions` e `Condition` in DataProvider
- [ ] Risolvere errori TypeScript in `Form.tsx`
- [ ] Risolvere errori TypeScript in `Grid.tsx`
- [ ] Risolvere errori TypeScript in `fields/Input.tsx`
- [ ] Risolvere errori TypeScript in `fields/Select.tsx`
- [ ] Risolvere errori TypeScript nei provider Firebase
- [ ] Build pulita senza errori

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
