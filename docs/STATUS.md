# Project status

> Snapshot verificato contro la codebase reale, non contro il piano storico.
> Ultima revisione: 2026-05-27

---

## Stato generale

| Area | Stato reale verificato | Target / gap |
|------|------------------------|--------------|
| Data layer | `DataProvider` esiste con registry/context. Implementazioni presenti: `FirebaseDataProvider`, `MockDataProvider`, `SupabaseDataProvider`. | Firebase non ha test di integrazione/emulatore. `SupabaseDataProvider` resta parziale e logga `not fully implemented yet`. |
| Storage layer | `StorageProvider` esiste con context. Implementazioni presenti: Firebase, Supabase, Dropbox helper/export. `StorageProviderContext` ha copertura unit su registry/default/named adapter. | `SupabaseStorageProvider` resta parziale e logga `not fully implemented yet`. Mancano contract/integration test sulle implementazioni concrete. La API reale usa `getURL` e `delete`. |
| Auth/Email layer | `AuthProvider`, `EmailProvider`, `GoogleAuthProvider`, `DropboxAuthProvider` e `GmailEmailProvider` sono presenti ed esportati. `AuthButton` usa i provider auth registrati via manifest. | Mancano integration test reali sui browser OAuth provider e test email concreti. |
| Runtime/App config | `<App>` usa `RuntimeProvider`, che compone `ConfigContext`, provider registries e stato globale persistito. | `GlobalProvider` resta interno per `useGlobalVars`; la config globale mantiene `onConfigChange` per i provider concreti. |
| Provider registries | `<App>` usa il driver manifest (`src/providers/manifest.ts`): ogni provider dichiara driver con nome univoco e categoria. `services` seleziona driver come `dbRealtime`, `firestorage`, `googleAuth`, `dropboxAuth`, `gmail`. | Data/Auth hanno fallback automatico; Storage/Email restano opzionali. I driver `firebaseAuth`, `firestore` e `supabaseAuth` non esistono ancora. |
| Motion system | Esiste un layer motion semantico (`src/motion.ts`) con supporto `prefers-reduced-motion`, theme registry e hook pubblici (`useMotionEffect`, `useMotionState`, `usePressMotion`, `useEnterMotion`). Integrazioni verificate su button, modal, dropdown, tab, image e image avatar. Docs dedicate in `docs/architecture/motion.md`. | Manca ancora un polish specifico per `Notifications`/toast e non esiste ancora una pagina showcase dedicata al motion playground. |
| Theme/Icon | Theme registry e icon registry sono gestiti da `<App>`. Hook pubblici: `useThemeController`, `useIconController`. I temi `default`, `flat`, `cyber` sono self-contained in `themes/*.ts` con `preset`, `motion` e `components`. | Nessun gap strutturale residuo. Manca solo visual regression profonda. |
| UI library | CSS runtime Tailwind v4 con compatibility layer Bootstrap-like. `src/globals.css` viene importato dal barrel pubblico. Le utility Bootstrap nel JSX sono state sostituite con classi Tailwind native. | Non e' una migrazione shadcn component-by-component. Rimane da fare visual regression piu' ampia. |
| TypeScript | `strict: true`; `npm run build` genera bundle e declarations. | Alcuni tipi pubblici usano ancora `any` e pattern legacy; audit in CR-014. |
| Docs Markdown | Docs in `docs/` con frontmatter vengono caricate nello showcase via `import.meta.glob` e `MarkdownReader`. | Le pagine operative (`STATUS`, `ROADMAP`, `CHANGE_REQUESTS`) restano documenti maintainer e non fanno parte della sidebar docs pubblica. |
| Tests | Vitest configurato. Passano 25 file / 188 test: libs, MockDataProvider contract, App, theme/icon, motion, storage context, auth button, DropboxAuthProvider, provider configuration, manifest, Form/Grid/Input/Select/Upload/Repeat/MarkdownReader/Table/Modal/Dropdown/Gallery/Buttons. | Mancano integration test Firebase/Supabase, test `Prompt`, test storage concrete/browser OAuth/email, Playwright E2E e CI. |
| Build libreria | `npm run build` passa. Output verificato: `dist/index.js`, `dist/index.mjs`, `dist/index.css`, `dist/types`. | Il log Vite continua a mostrare `style.css` prima del rename finale a `index.css`. |
| CLI scaffolding | CLI Vite-first aggiornata. Theme e template sono scelte separate; i template disponibili sono `blank`, `crm`, `admin`, `inventory`, `project`. | La build del progetto generato non e' ancora coperta da test automatici. |
| Showcase app | `clients/showcase` e' un consumer Vite reale basato su `<App>`, `menuConfig`, layout custom, docs Markdown e `providers.mock`. Sono presenti pagine componenti molto piu' ampie rispetto allo snapshot di maggio: Auth, Notifications, Buttons dedicate, Grid, GridArray, GridDB, Prompt, Autocomplete, Checklist, Image, ImageAvatar, LayoutBuilder, ecc. | Restano route stub per alcuni provider concreti e per diversi esempi applicativi. Deploy pubblico e smoke E2E assenti. |

---

## Change request completate

| CR | Stato | Evidenza |
|----|-------|----------|
| CR-001 | Done | Docs AI-first e struttura Markdown presenti in `docs/`. |
| CR-002 | Done con gap integrazione | Provider abstraction presente; test reali solo su MockDataProvider. |
| CR-002b | Done con gap test | Auth/Email interfaces e implementazioni Google/Gmail presenti. |
| CR-003 | Done | Build TypeScript strict passa con declarations. |
| CR-004 | Done come compatibility layer | Tailwind runtime presente; non shadcn component-by-component. |
| CR-005 | Done via CR-015 | Scaffolding assorbito dal flusso Vite-first. |
| CR-013 | Done via CR-017 | Icon registry pubblico presente. |
| CR-015 | Done | Build Vite library e scaffold Vite-first presenti. |
| CR-016 | Done | Showcase Vite scaffold-first presente e builda. |
| CR-017 | Done | Theme/icon registries e hook pubblici presenti. |
| CR-018 | Done | `MarkdownReader` pubblico presente e testato. |
| CR-019 | Done | Showcase docs alimentate da Markdown con frontmatter. |
| CR-020 | Done | Head management e provider config dichiarativa allineati in codebase, docs e scaffold. |
| CR-021 | Done | Separazione theme/template. Cinque template in `templates/` e temi visuali estratti in `themes/*.ts`. |
| CR-022 | Done | Cleanup delle Bootstrap utility nel JSX a favore di Tailwind nativo. |
| CR-023 | Done | Driver manifest + service registry con nomi driver espliciti e risoluzione generica. |
| CR-026 | Done | `AuthButton` provider-agnostic e `DropboxAuthProvider` presenti con copertura test. |
| CR-028 | Done | Provider configuration state presente e usato da provider/componenti principali. |
| CR-030 | Done | Temi typed e self-contained con `preset`, `motion` e `components`. |

---

## Change request aperte

| CR | Stato reale | Cosa manca |
|----|-------------|------------|
| CR-006 | In progress | La suite unit/component e' cresciuta fino a 25 file / 188 test. Restano integration Firebase/Supabase, test `Prompt`, storage concrete/browser OAuth/email tests, Playwright E2E e CI. |
| CR-007 | In progress | Showcase builda ed e' ormai una consumer app Vite reale con molte pagine componente e playground interattivi. Restano stub su provider concreti ed esempi applicativi. |
| CR-012 | Todo | Eliminare gli stub showcase residui e sostituirli con demo native react-firestrap o pagine oneste sullo stato reale dei provider. |
| CR-014 | In progress | La codebase mostra avanzamenti concreti su component API e playground: pagine Buttons separate, GridArray/GridDB, Auth, Notifications, Prompt, Autocomplete e Checklist; test Grid/Table/Modal/Dropdown piu' ricchi. Restano audit API pubblica, chiarimenti docs su Input/Modal/Grid e copertura mancante su `Prompt`. |
| CR-024 | Todo | WYSIWYG editor `<RichEditor>`. Nessuna implementazione trovata in `src/` o nello showcase. |
| CR-025 | Todo | ContextMenu con slash command e `@mention`. Il file legacy `src/components/ui/fields/Command.tsx` e' ancora da sostituire. |
| CR-027 | In progress | Motion system presente in codebase, docs e test. Restano `Notifications`/toast-specific motion e una showcase page/playground dedicata. |
| CR-029 | Todo | Nessun `I18nProvider`, `useI18n()` o dizionario framework-level presente oggi. |
| CR-031 | Todo | La sidebar dello showcase vive ancora in `clients/showcase/src/components/Sidebar.tsx`; non esiste ancora `src/components/blocks/Sidebar.tsx`. |
| CR-032 | Todo | `FirebaseAuthProvider` non esiste; nessun driver `firebaseAuth` registrato nel manifest. |
| CR-033 | Todo | `FirestoreDataProvider` non esiste; nessun driver `firestore` registrato nel manifest. |
| CR-034 | Todo | `SupabaseDataProvider` e' ancora una implementazione fetch-based parziale senza realtime `postgres_changes`. |
| CR-035 | Todo | `SupabaseStorageProvider` e' ancora una implementazione fetch-based parziale senza signed URL privati o SDK ufficiale. |
| CR-036 | Todo | `SupabaseAuthProvider` non esiste; nessun driver `supabaseAuth` registrato nel manifest. |
| CR-037 | Todo | Esiste `src/libs/imageBuilder.ts`, ma non e' ancora stato estratto un contract condiviso `ComponentBuilderResult` ne' un secondo builder che validi il pattern. |

---

## Struttura reale

```text
src/
  App.tsx                  # routing, RuntimeProvider, provider config dichiarativa, theme/icon/head
  Config.tsx               # runtime config, tenant config, Firebase/Google/AI/Dropbox config
  Global.tsx               # stato globale localStorage-backed, composto dal runtime provider
  Head.tsx                 # head controller JSX: metadata, document, social, assets, PWA, schema.org
  Theme.tsx                # ThemeProvider, theme registry, useTheme/useThemeController
  motion.ts                # motion registry helpers, reduced motion support, motion hooks
  components/
    ui/                    # primitivi presentazionali
    ui/fields/             # Input, Select, Upload, Prompt, AssistantAI, UploadCSV, Command legacy
    blocks/                # Brand, Menu, Breadcrumbs, Notifications, Search, Carousel, Dropdown
    widgets/               # Form, Grid, MarkdownReader, ImageEditor
  providers/
    manifest.ts            # driver manifest: PROVIDER_MANIFESTS, DriverDescriptor, ServicesConfig
    data/                  # DataProvider, FirebaseDataProvider, MockDataProvider, SupabaseDataProvider
    storage/               # StorageProvider, Firebase, Supabase, Dropbox helpers
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

Nota: in questa codebase non esistono piu' le cartelle `src/integrations` e `src/models`. I backward-compatible re-export verificati restano in file come `src/libs/database.ts`, `src/libs/storage.ts` e negli export pubblici.

```text
clients/showcase/
  src/index.tsx            # consumer Vite reale basato su <App providers={{ ... }}>
  src/conf/menu.ts         # menu unico dello showcase
  src/docs/markdownDocs.ts # loader Markdown/frontmatter
  src/layouts/             # ShowcaseLayout
  src/components/Sidebar.tsx
  src/pages/               # docs, componenti, provider, esempi
```

---

## Stub e gap visibili nello showcase

Route ancora stub in `clients/showcase/src/conf/menu.ts`:

| Area | Route stub |
|------|------------|
| Providers | `/providers/data/firebase`, `/providers/data/supabase`, `/providers/storage/firebase`, `/providers/auth/google` |
| Examples | `/examples/crud`, `/examples/dashboard`, `/examples/nested-form`, `/examples/file-manager`, `/examples/google-auth` |

Route reali principali:

| Area | Route |
|------|-------|
| Docs | generate da Markdown in `docs/` |
| Components | Alert, Badge, Buttons, Card, Code, Dropdown, Gallery, GridSystem, Icon, Image, ImageAvatar, Loader, Modal, Notifications, Pagination, Prompt, Search, Select, Autocomplete, Checklist, Upload, Form, Grid, GridArray, GridDB, MarkdownReader, Repeat, Auth, LayoutBuilder |
| Providers | `/providers`, `/providers/data`, `/providers/storage`, `/providers/auth`, `/providers/email`, `/providers/integrations` |
| Examples | `/examples/ai` |

---

## Dipendenze legacy residue

| File | Stato |
|------|-------|
| `src/components/Component.tsx` | Contiene commenti `todo` e pattern legacy di model/template. |
| `src/components/Template.tsx` | Pattern template legacy ancora presente. |
| `src/components/ui/fields/Command.tsx` | Prototipo legacy con `contentEditable` e `document.execCommand`; da rimuovere o sostituire in CR-025. |
| `src/pages/Helper.tsx` | Pagina helper storica con riferimenti Bootstrap ScrollSpy; non fa parte del flusso App/theme moderno. |
| `src/libs/database.ts` / `src/libs/storage.ts` | Re-export/backward compatibility verso provider Firebase. Non sono il percorso raccomandato per nuovi consumer. |

---

## Verifica eseguita

Verifica reale eseguita il 2026-05-27:

| Comando | Esito |
|---------|-------|
| `npx vitest run --reporter=dot` | Passa: 25 file, 188 test. |
| `npm run build` | Passa: Vite library build + declarations. |
| `cd clients/showcase && npm run build` | Passa: Vite production build. |
| `Get-Content package.json` | Verificata versione corrente `0.1.1`. |
| Audit mirato su `src/`, `clients/showcase/` e `docs/` | Confermati motion layer, manifest provider, showcase Vite, stub residui e parzialita' Supabase. |

---

## Versioni target

| Versione | Stato reale |
|----------|-------------|
| 0.1.1 | Versione corrente in `package.json` e build verificata. |
| 2.0.0-alpha | Etichetta roadmap utile per indicare la transizione architetturale gia' avanzata (provider abstraction, manifest, theme/motion registries), ma non e' una versione pubblicata in questa codebase. |
| 2.0.0-rc | Non ancora pronta: showcase ancora con stub, E2E/CI assenti, Supabase parziale. |
| 2.0.0 | Target concettuale: docs operative allineate, test integrazione/E2E, showcase senza stub critici, provider principali completi. |
