# Architettura

> TL;DR per AI: dipendenze fluiscono in una sola direzione — `libs` → `providers` → `components/ui` → `components/widgets` → `pages`. Non invertire mai questa direzione.

---

## Toolchain

La build del framework e lo scaffolding ufficiale sono Vite-first.

- Root: `npm run build` esegue `vite build` in library mode e poi genera `dist/types`.
- Output pubblico: `dist/index.mjs`, `dist/index.js`, `dist/index.css`, `dist/types/index.d.ts`.
- Webpack resta solo come confronto temporaneo: `npm run build:webpack`.
- Consumer scaffoldati: `index.html`, `vite.config.ts`, `src/index.tsx`, `src/conf/menu.ts`, `src/layout/`, `src/pages/`, `src/globals.css`.
- Il consumer Vite usa `resolve.dedupe` per `react`, `react-dom`, `react-router-dom`.

---

## Struttura cartelle

```
react-firestrap/
├── CLAUDE.md                    ← riferimento rapido per AI (leggi prima di tutto)
├── CHANGELOG.md
├── docs/                        ← documentazione wiki
├── src/
│   ├── App.tsx                  ← entry point: routing, ThemeProvider, ConfigProvider
│   ├── Config.tsx               ← ConfigProvider: Firebase, Google, AI, Dropbox config
│   ├── Global.tsx               ← stato globale localStorage-backed (useGlobalVars)
│   ├── Theme.tsx                ← ThemeProvider + useTheme() hook
│   ├── auth.tsx                 ← helpers autenticazione
│   │
│   ├── components/
│   │   ├── ui/                  ← primitivi presentazionali
│   │   │   ├── Alert.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Buttons.tsx      ← ActionButton, LoadingButton, BackLink
│   │   │   ├── Card.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── GridSystem.tsx   ← Wrapper, Col (Bootstrap grid)
│   │   │   ├── Icon.tsx
│   │   │   ├── Image.tsx / ImageAvatar.tsx
│   │   │   ├── LayoutBuilder.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Repeat.tsx
│   │   │   ├── Tab.tsx / TabDynamic.tsx
│   │   │   └── Table.tsx
│   │   │
│   │   ├── ui/fields/           ← form fields (controlled components)
│   │   │   ├── Input.tsx        ← string, number, email, password, color, date, time…
│   │   │   ├── Select.tsx       ← basic, autocomplete, checklist
│   │   │   ├── Upload.tsx       ← generico, image (con crop), document
│   │   │   ├── UploadCSV.tsx
│   │   │   ├── Prompt.tsx       ← AI prompt editor/executor
│   │   │   ├── AssistantAI.tsx
│   │   │   ├── ImageUrl.tsx
│   │   │   ├── Crop.tsx
│   │   │   └── Command.tsx
│   │   │
│   │   ├── blocks/              ← composizioni UI per layout applicativo
│   │   │   ├── Brand.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── Carousel.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── Search.tsx
│   │   │
│   │   ├── widgets/             ← smart components con stato e persistenza
│   │   │   ├── Form.tsx         ← CRUD form con Firebase integration
│   │   │   ├── Grid.tsx         ← data grid con real-time listener
│   │   │   └── ImageEditor.tsx
│   │   │
│   │   ├── Component.tsx        ← FieldAdapter pattern + buildFormFields()
│   │   ├── FormEnhancer.tsx     ← inietta form context in albero React
│   │   └── Template.tsx         ← UI generata da schema in database
│   │
│   ├── integrations/            ← (v1) servizi esterni — target v2: → providers/
│   │   ├── ai.ts                ← AI multi-provider (OpenAI, Gemini, Anthropic…)
│   │   ├── dropbox.tsx
│   │   ├── scrape.ts
│   │   └── google/
│   │       ├── firedatabase.ts  ← Firebase Realtime DB SDK
│   │       ├── firestorage.ts   ← Firebase Storage SDK
│   │       ├── GoogleAuth.tsx
│   │       ├── auth.ts
│   │       └── email.ts
│   │
│   ├── libs/                    ← utilities pure, zero dipendenze React
│   │   ├── cache.ts
│   │   ├── converter.ts         ← toCamel, toSnake, toKebab, toPascal…
│   │   ├── database.ts          ← (v1) proxy verso firedatabase.ts
│   │   ├── fetch.ts             ← fetch con proxy support
│   │   ├── locale.ts
│   │   ├── log.ts
│   │   ├── path.ts              ← normalizePath, trimPath, dirname, normalizeKey
│   │   ├── sanitizer.ts         ← html, key
│   │   ├── seo.ts
│   │   ├── storage.ts
│   │   └── utils.ts
│   │
│   ├── models/                  ← (v1) TypeScript types — target v2: → types/
│   │   ├── componentBlock.tsx
│   │   ├── componentFormFields.tsx
│   │   ├── componentLayout.tsx
│   │   └── componentSection.tsx
│   │
│   ├── conf/
│   │   └── Prompt.ts            ← template prompt AI predefiniti
│   │
│   └── pages/                   ← pagine di esempio
│       ├── Blog.tsx / BlogPost.tsx
│       ├── Users.tsx
│       ├── Helper.tsx
│       └── NotFound.tsx
│
├── bin/
│   └── cli.js                   ← npx react-firestrap create
└── playground/                  ← (v2, CR-007) showcase app separata
```

---

## Regole di dipendenza

La regola fondamentale: **le dipendenze fluiscono sempre verso il basso, mai verso l'alto.**

```
pages
  ↓ usa
widgets  (Form, Grid)
  ↓ usa
ui/fields  (Input, Select, Upload)
  ↓ usa
ui  (Button, Card, Modal)
  ↓ usa
libs  (converter, path, sanitizer)
  ↓
providers  (v2: DataProvider, StorageProvider)
```

**Violazioni da non fare mai:**
- `libs/` non importa componenti React
- `ui/` non importa da `widgets/`
- `components/` non importa direttamente da `integrations/` (v1: eccezione temporanea in Form e Grid)
- `libs/` non importa da `integrations/`

---

## Sistema tema

Il tema è distribuito via React Context. Ogni componente legge solo le sue chiavi.

```tsx
// In qualsiasi componente
const theme = useTheme('form')      // legge theme.Form.*
const theme = useTheme('grid')      // legge theme.Grid.*
const theme = useTheme('buttons')   // legge theme.Buttons.*

// Uso
<div className={theme.Form.wrapClass}>
  <button className={theme.Form.buttonSaveClass}>Salva</button>
</div>
```

**Struttura del tema (chiavi principali):**
```typescript
{
  Icons: { default, sidebar, header, profile },
  Grid: { Card, Table, Gallery, Modal, i18n },
  Table: { wrapClass, className, headerClass, rowClass },
  Gallery: { wrapClass, rowCols, gutterSize },
  Form: { buttonSaveClass, buttonDeleteClass, Card, wrapClass, i18n },
  Buttons: { ActionButton, LoadingButton, BackLink },
  Modal: { size, position },
  Pagination: { perPage, className },
  Alert: { className },
  Badge: { className },
  // ... altri componenti
}
```

**Tema custom:** passare `importTheme` ad `<App>`. Il framework fa deep merge — sovrascrivere solo le chiavi che cambiano.

```tsx
// my-theme.ts
export const theme = {
  Form: { buttonSaveClass: 'btn btn-success px-5' }
  // tutto il resto resta il default
}

// App.tsx
<App importTheme={() => import('./my-theme')} ... />
```

---

## Configurazione globale

`ConfigProvider` (wrappa l'intera app) gestisce la configurazione di tutti i servizi esterni:

```tsx
// Config.tsx espone
useConfig()                    // hook per leggere la config corrente
onConfigChange(callback)       // subscribe a cambi di config (es. multi-tenant)

// Struttura config
{
  firebase: FirebaseConfig,
  google: { oAuth2: GoogleOAuth2 },
  ai: AIConfig,                // chiavi API per ogni provider AI
  dropbox: DropboxConfig,
  scrape: ScrapeConfig,
  proxyUri: string,            // proxy per richieste esterne
  tenantsURI: string,          // endpoint lista tenant (multi-tenancy)
}
```

---

## Stato globale

`useGlobalVars(namespace)` — stato persistito in localStorage, sincronizzato tra tab:

```tsx
const [value, setValue, removeValue] = useGlobalVars('auth.token')
// equivalente a useState ma persiste e sincronizza tra tab del browser
```

Usato internamente per: token di autenticazione, configurazione tenant attivo, preferenze utente.

---

## Form Context (come funziona internamente)

Ogni `<Form>` crea un Context con `record` (stato corrente) e `handleChange`. I fields lo leggono via `useFormContext(name)`.

```
<Form dataStoragePath="/users/123">           ← crea FormContext
  <Input name="address.city" />              ← legge record.address.city
  <Input name="tags.0" />                    ← legge record.tags[0]
</Form>
```

`FormEnhancer` gestisce il caso in cui i fields vengono passati come `children` generici: trova i componenti marcati con `__form` e inietta automaticamente `value`, `onChange` e il prefisso del nome.

**Dot notation:** `name="a.b.c"` → aggiorna `record.a.b.c` creando oggetti intermedi se non esistono.  
**Array index:** `name="items.0.name"` → aggiorna `record.items[0].name`.

---

## Target architettura v2

In v2 (CR-002) `integrations/` diventa `providers/` con interfacce esplicite:

```
src/
  providers/
    data/
      DataProvider.ts          ← interface: read, set, remove, list, useListener, count
      DataProviderContext.tsx  ← Context + useDataProvider() hook
      firebase.ts              ← implementazione attuale
      supabase.ts              ← nuova
    storage/
      StorageProvider.ts       ← interface: upload, getUrl, remove
      StorageProviderContext.tsx
      firebase.ts
      supabase.ts
    ai/ auth/ scrape/ dropbox/ ← resto degli attuali integrations/
  types/                       ← rinominato da models/
```

`Form.tsx` e `Grid.tsx` passeranno da `import db from "../../libs/database"` a `const db = useDataProvider()`.
