# Project status

> Snapshot verificato contro la codebase, non contro il piano storico.
> Ultima revisione: 2026-05-12

---

## Stato generale

| Area | Stato reale verificato | Target / gap |
|------|------------------------|--------------|
| Data layer | `DataProvider` esiste con registry/context. Implementazioni presenti: `FirebaseDataProvider`, `MockDataProvider`, `SupabaseDataProvider`. | Firebase non ha test di integrazione/emulatore. Supabase e' parziale e logga `not fully implemented yet`. |
| Storage layer | `StorageProvider` esiste con context. Implementazioni presenti: Firebase, Supabase, Dropbox helper/export. `StorageProviderContext` ha copertura unit su registry/default/named adapter. | Supabase storage e' parziale. Manca copertura contract sulle implementazioni concrete. La API reale usa `getURL`/`delete`, non `getUrl`/`remove`. |
| Auth/Email layer | `AuthProvider`, `EmailProvider`, `GoogleAuthProvider`, `DropboxAuthProvider` e Gmail provider sono presenti ed esportati. `AuthButton` usa i provider auth registrati. | Mancano integration test reali sui browser OAuth provider e test email concreti. |
| Runtime/App config | `<App>` usa `RuntimeProvider`, che compone `ConfigContext` e stato globale persistito. | `GlobalProvider` resta interno per `useGlobalVars`; la config globale mantiene `onConfigChange` per i provider concreti. |
| Provider registries | `<App>` usa il **driver manifest** (`src/providers/manifest.ts`): ogni provider dichiara i propri driver con nome univoco e categoria. `services` seleziona driver per nome (`dbRealtime`, `firestorage`, `googleAuth`, `dropboxAuth`, `gmail`, ecc.). Loop generico in `resolveProviderRegistries` — zero if per provider. `gmail` non è più un campo separato ma un driver di `google`; `dropboxAuth` è un driver auth di `dropbox`. | Data/Auth hanno fallback automatico; Storage/Email sono opzionali. Supabase resta parziale. |
| Head management | `HeadProvider` e' montato da `<App>` e genera il browser `<head>` via JSX portal. Hook pubblici: `useHead`, `useDocumentHead`, `useSocialHead`, `useLanguageHead`, `usePaginationHead`, `useAssetsHead`, `usePwaHead`, `useSchemaOrgHead`. | Non c'e' SSR/head extraction; e' runtime client-side. |
| UI library | CSS runtime Tailwind v4 con compatibility layer Bootstrap-like. `src/globals.css` viene importato dal barrel pubblico. Tutte le classi Bootstrap utility (`d-flex`, `position-*`, `ps-`, `me-`, ecc.) rimosse dal JSX — sostituiti con Tailwind nativo equivalente (CR-022). | Non e' una migrazione shadcn component-by-component. Rimane da fare visual regression profonda. |
| Theme/Icon | Preset tema e icon registry sono gestiti da `<App>`. Hook pubblici: `useThemeController`, `useIconController`. Preset `default`, `flat`, `cyber` estratti da `src/Theme.tsx` in `themes/*.ts`. | Nessun gap strutturale residuo. Visual regression profonda non ancora fatta. |
| TypeScript | `strict: true`; `npm run build` genera build e declarations. | Alcuni tipi pubblici usano ancora `any` e pattern legacy; audit in CR-014. |
| Docs Markdown | Docs in `docs/` con frontmatter sono caricate nello showcase via `import.meta.glob` e `MarkdownReader`. | Le pagine operative (`STATUS`, `ROADMAP`, `CHANGE_REQUESTS`) restano documenti maintainer e non sidebar showcase. |
| Tests | Vitest configurato. Passano 17 file / 130 test: libs, MockDataProvider contract, App, theme/icon, storage context, auth button, DropboxAuthProvider, manifest, Form/Grid/Input/Select/Upload/Repeat/MarkdownReader. | Mancano integration test Firebase/Supabase, test Prompt, storage concrete/browser OAuth/email tests, Playwright E2E e CI. |
| Build libreria | `npm run build` passa. Output verificato: `dist/index.js`, `dist/index.mjs`, `dist/index.css`, `dist/types`. | Il log Vite mostra `style.css`, poi plugin Vite rinomina a `index.css` in `closeBundle`. |
| CLI scaffolding | CLI Vite-first aggiornato (CR-021). Domande separate per `theme` (default/flat/cyber) e `template` (blank/crm/admin/inventory/project). 5 template autonomi in `templates/`. | Verifica di build del progetto generato non ancora inclusa nei test automatici. |
| Showcase app | `clients/showcase` e' un consumer Vite reale basato su `<App>`, `menuConfig`, layout custom e `providers.mock`. Pagine componenti principali presenti. | Molte route provider/example sono ancora stub. Deploy pubblico e smoke E2E assenti. |

---

## Change request completate

| CR | Stato | Evidenza |
|----|-------|----------|
| CR-001 | Done | Docs AI-first e Markdown presenti in `docs/`. |
| CR-002 | Done con gap integrazione | Provider abstraction presente; test reali solo su MockDataProvider. |
| CR-002b | Done con gap test | Auth/Email interfaces e implementazioni Google/Gmail presenti. |
| CR-003 | Done | Build TypeScript passa con declarations. |
| CR-004 | Done come compatibility layer | Tailwind runtime presente; non shadcn component-by-component. |
| CR-005 | Done via CR-015 | Scaffolding assorbito da Vite-first. |
| CR-013 | Done via CR-017 | Icon registry pubblico presente. |
| CR-015 | Done | Build Vite library e scaffold Vite-first presenti. |
| CR-016 | Done | Showcase Vite scaffold-first presente e builda. |
| CR-017 | Done | Theme/icon registries e hook pubblici presenti. |
| CR-018 | Done | `MarkdownReader` pubblico presente, testato. |
| CR-019 | Done | Showcase docs alimentate da Markdown con frontmatter. |
| CR-020 | Done | Head management e provider config dichiarativa allineati in codebase, docs e scaffold. |
| CR-021 | Done | Separazione tema/template. 5 template in `templates/`. Preset estratti in `themes/*.ts`. CLI e docs aggiornati. |
| CR-022 | Done | Bootstrap utility cleanup. Tutte le classi `d-flex`, `position-*`, `ps-`, `me-`, ecc. rimosse dal JSX e sostituite con Tailwind nativo. |
| CR-023 | Done | Driver manifest + service registry. `src/providers/manifest.ts` creato. `resolveProviderRegistries` riscritto con loop generico. Nomi driver espliciti (`dbRealtime`, `firestorage`, `googleAuth`, `dropboxAuth`, `gmail`). |

---

## Change request aperte

| CR | Stato reale | Cosa manca |
|----|-------------|------------|
| CR-006 | In progress | La suite unit/component esiste e passa. Aggiunti test Upload, Repeat, StorageProviderContext, AuthButton, DropboxAuthProvider e manifest. Mancano integration Firebase/Supabase, Prompt, storage concrete/browser OAuth/email tests, Playwright E2E e CI. |
| CR-007 | In progress | Showcase builda. Pagine componenti principali presenti con playground interattivo (Badge, Alert, Button, Card, Input, Select, Upload, Form, Grid, Modal, Pagination, Tab, Table, Loader, MarkdownReader). Molte route provider/example ancora stub. |
| CR-008..CR-011 | Done | Vecchie cartelle `themes/*/src/` rimosse. Preset estratti in `themes/*.ts`. Layout/sections in `templates/`. Completato via CR-021. |
| CR-012 | Todo | Eliminare stub showcase e usare demo native react-firestrap per esempi/provider reali. |
| CR-014 | In progress | Badge overlay mode, Autocomplete creatable + bug fix disabled, Form onChange + reset fix, Playground layout e JSON accordion completati. Restano audit componenti e fix Grid/Modal/Input. |
| CR-024 | Todo | WYSIWYG editor `<RichEditor>`. Libreria (Tiptap candidata principale) da valutare all'avvio. |
| CR-025 | Todo | ContextMenu con slash command e @mention. Dipende da CR-024 per la scelta libreria. |

---

## Struttura reale

```text
src/
  App.tsx                  # routing, RuntimeProvider, provider config dichiarativa, theme/icon/head
  Config.tsx               # RuntimeProvider, tenant config, Firebase/Google/AI/Dropbox config
  Global.tsx               # stato globale localStorage-backed, composto dal runtime provider
  Head.tsx                 # head controller JSX: metadata, document, social, assets, PWA, schema.org
  Theme.tsx                # ThemeProvider, preset registry, useTheme/useThemeController
  components/
    ui/                    # primitivi presentazionali
    ui/fields/             # Input, Select, Upload, Prompt, AssistantAI, UploadCSV
    blocks/                # Brand, Menu, Breadcrumbs, Notifications, Search, Carousel, Dropdown
    widgets/               # Form, Grid, MarkdownReader, ImageEditor
  providers/
    manifest.ts            # driver manifest: PROVIDER_MANIFESTS, DriverDescriptor, ServicesConfig, driver name types
    data/                  # DataProvider, FirebaseDataProvider, MockDataProvider, SupabaseDataProvider
    storage/               # StorageProvider, Firebase/Supabase/Dropbox
    auth/                  # AuthProvider + GoogleAuthProvider + DropboxAuthProvider
    email/                 # EmailProvider + GmailEmailProvider
    icon/                  # Lucide/Phosphor icon providers
    ai/                    # AI multi-provider
    seo/                   # Google keyword/trend helpers
    scrape/                # SerpAPI scraping
    firebase-init.ts
  types/
  libs/
  pages/
```

Nota: in questa codebase non esistono piu' le cartelle `src/integrations` e `src/models`. I backward-compatible re-export verificati sono in file come `src/libs/database.ts`, `src/libs/storage.ts` e negli export pubblici.

```text
clients/showcase/
  src/index.tsx            # consumer Vite reale basato su <App providers={{ ... }}>
  src/conf/menu.ts         # menu unico dello showcase
  src/docs/markdownDocs.ts # loader Markdown/frontmatter
  src/layouts/             # ShowcaseLayout
  src/pages/               # docs, componenti, provider, esempi
```

---

## Stub e gap visibili nello showcase

Route ancora stub in `clients/showcase/src/conf/menu.ts`:

| Area | Route stub |
|------|------------|
| Providers data | `/providers/data/firebase`, `/providers/data/supabase`, `/providers/data/custom` |
| Providers storage | `/providers/storage`, `/providers/storage/firebase` |
| Providers auth/email/AI | `/providers/auth`, `/providers/auth/google`, `/providers/email`, `/providers/ai` |
| Examples | `/examples/crud`, `/examples/dashboard`, `/examples/nested-form`, `/examples/file-manager`, `/examples/google-auth` |

Route reali principali:

| Area | Route |
|------|-------|
| Docs | generate da Markdown in `docs/` |
| Components | Alert, Badge, Button, Card, Loader, Modal, Pagination, Tab, Table, Input, Select, Upload, Form, Grid, MarkdownReader |
| Providers | `/providers`, `/providers/data` |
| Examples | `/examples/ai` |

---

## Dipendenze legacy residue

| File | Stato |
|------|-------|
| `src/components/Component.tsx` | Contiene commento `todo` e pattern legacy di model/template. |
| `src/components/Template.tsx` | Pattern template legacy ancora presente. |
| `src/components/ui/fields/Select.tsx` | Usa `useDataProvider()` per opzioni `db`, ma mantiene API legacy con `db.srcPath`/`db.path`. |
| `src/libs/database.ts` / `src/libs/storage.ts` | Re-export/backward compatibility verso provider Firebase. Non sono il percorso raccomandato per nuovi consumer. |

---

## Verifica eseguita

Verifica reale eseguita il 2026-05-08:

| Comando | Esito |
|---------|-------|
| `npm run test` | Passa: 14 file, 124 test. |
| `npm run build` | Passa: Vite library build + declarations. |
| `cd clients/showcase && npm run build` | Passa: Vite production build. |
| `node scripts/cli/setup-project.js` via harness temporaneo | Passa: genera scaffold con `VITE_PROVIDER` e nuova `providers` API. |

---

## Versioni target

| Versione | Stato reale |
|----------|-------------|
| 1.5.8 | Versione corrente in `package.json`. |
| 2.0.0-alpha | Funzionalmente raggiunta per provider abstraction + strict build, ma senza integration provider tests. |
| 2.0.0-rc | Non ancora pronta: showcase incompleta, E2E/CI assenti, Supabase parziale. |
| 2.0.0 | Target: docs operative allineate, test integrazione/E2E, showcase senza stub critici. |
