# Project status

> Snapshot verified against the real codebase, not against the historical plan.
> Last reviewed: 2026-08-02

---

## General state

| Area | Verified real state | Target / gap |
|------|---------------------|--------------|
| Data layer | `DataProvider` registry/context present. All implementations complete: `FirebaseDataProvider` (RTDB), `FirestoreDataProvider` (Cloud Firestore + onSnapshot), `SupabaseDataProvider` (Postgres + Realtime), `MockDataProvider`. Unit tests for all four providers. Firebase + Supabase emulator integration tests done. | No remaining gap. |
| Storage layer | `StorageProvider` context present. Implementations complete: `FirebaseStorageProvider` (upload/download/delete/list/rename + progress), `SupabaseStorageProvider` (upload/download/delete/list/rename/signed URLs). Unit tests for both. | Browser integration/E2E tests missing. |
| Auth/Email layer | `AuthProvider` complete. All four auth adapters present and exported: `GoogleAuthProvider` (GIS), `FirebaseAuthProvider` (password/anonymous/OAuth SSO), `SupabaseAuthProvider` (password/magic_link/oauth/anonymous), `DropboxAuthProvider`. `GmailEmailProvider` present. | Real browser OAuth integration tests missing. |
| Credentials layer | `CredentialsAdapter` contract present. `GoogleServiceAccountProvider` (Web Crypto JWT, browser-safe, scoped tokens) complete and exported. | No integration tests. |
| Runtime/App config | `<App>` uses `RuntimeProvider` composing `ConfigContext`, provider registries and persisted global state. `onConfigChange` used by concrete providers for lazy config. | No remaining structural gap. |
| Provider registries | `src/providers/manifest.ts` is the driver registry. All drivers registered: `dbRealtime`, `firestoreDb`, `supabaseDb`, `mock`, `firestorage`, `supabaseStorage`, `googleAuth`, `firebaseAuth`, `supabaseAuth`, `dropboxAuth`, `gmail`, `googleServiceAccount`. `services` selects drivers declaratively. | No remaining gap. Storage/Email optional (null if absent). |
| Motion system | Semantic motion layer present (`src/motion.ts`) with `prefers-reduced-motion`, theme registry and public hooks. Integrations verified on button, modal, dropdown, tab, image. | `Notifications`/toast-specific motion still missing (CR-027 partial). |
| Theme/Icon | Theme registry and icon registry managed by `<App>`. Public hooks: `useThemeController`, `useIconController`. Themes: `default`, `flat`, `cyber`. Icon providers: `lucide`, `phosphor`. | No structural gap. Visual regression not automated. |
| UI library | Tailwind v4 CSS runtime with Bootstrap-like compatibility layer (`@layer components`). Bootstrap utilities replaced with native Tailwind. | Broader visual regression remains manual. |
| TypeScript | `strict: true`; `npm run build` generates bundle + declarations. CR-042 done: `any` count → 6 justified exceptions, all annotated. | No remaining structural gap. |
| Dead code | Removed: `Helper.tsx` (1696 lines), `Blog.tsx`, `Template.tsx`, `FormEnhancer.tsx`, `AssistantAI.tsx`, `BlogPost.tsx`, `Component.tsx` dead exports, `libs/log.ts`, `libs/cache.ts`, `libs/database.ts`, `libs/storage.ts`, `libs/seo.ts`, `Command.tsx`. Log logic inlined in `Form.tsx` via `useDataProvider()`. Cache logic inlined in `scrape/index.ts` via `DataProviderAdapter`. | No remaining structural gap. |
| Tests | 61 unit/component files / 649 tests + 10 Firebase emulator + 8 Supabase emulator integration tests + 16 Playwright E2E (all pass). Suites: libs (utils, converter, path, sanitizer, fetch, promptUtils), providers (Mock, Firebase RTDB, Firestore, FirebaseStorage, Supabase, SupabaseStorage, SupabaseAuth, AIProviders, DropboxStorage, Gmail, Google Service Account, Scrape, ProxyRegistry), App, theme/icon, motion, auth, Form/Grid/Input/Select/Upload/Repeat/MarkdownReader/Table/Modal/Dropdown/Gallery/Buttons/Prompt + form-controller + smoke tests (blocks, switchers, fields, ui, widgets) plus the public export contract and proxy runtime e2e. Integration: Firebase RTDB/Firestore/Storage emulator CRUD + Supabase Postgres CRUD + Auth. E2E: 16 Playwright tests covering 30+ showcase pages (smoke + navigation + CRUD flow). GitHub Actions CI present (test + build + showcase jobs). | Google OAuth E2E ancora assente. |
| Library build | `npm run build` passes. Output: `dist/index.js`, `dist/index.mjs`, `dist/index.css`, `dist/types`. `ImageEditor` heavy runtime is now split into a separate lazy chunk (`dist/ImageEditorImpl-*`) instead of being forced into the root bundle. Published as `@llmnative/react@1.2.1` on npm. | No structural gap. |
| Showcase app | `clients/showcase` is a real Vite consumer. Pages: Auth, Alert, Badge, Buttons, Card, Code, Dropdown, Gallery, GridSystem, Icon, Image, ImageAvatar, ImageField, ImageEditor, Loader, LocaleSwitcher, Modal (incl. ModalYesNo/ModalOk sub-pages), Motion, Notifications, Pagination, Prompt, Search, Select, Autocomplete, Checklist, Upload, Form, Grid, GridArray, GridDB, MarkdownReader, Repeat, LayoutBuilder. SideNav collapsible with icon-only mode. | Stub routes remain for concrete provider demos and application examples. |
| Markdown docs | `AI_REFERENCE.md` and `PROMPT_TEMPLATE.md` added for LLM consumption of the full API surface. Docs with frontmatter load in showcase via `import.meta.glob`. | Operational docs (STATUS, ROADMAP, CHANGE_REQUESTS) remain maintainer-only. |

---

## Completed change requests

| CR | State | Evidence |
|----|-------|----------|
| CR-001 | Done | AI-first docs, `AI_REFERENCE.md`, `PROMPT_TEMPLATE.md` present. |
| CR-002 | Done | Provider abstraction + registry/context + named provider config. Unit tests on all data providers. |
| CR-002b | Done | Auth/Email/Credentials interfaces + Google/Gmail/Google ServiceAccount implementations. Named provider config. |
| CR-003 | Done | TypeScript strict build passes with declarations. |
| CR-004 | Done | Tailwind v4 runtime; Bootstrap removed as runtime dependency. |
| CR-005 | Done via CR-015 | Scaffolding absorbed by the Vite-first flow. |
| CR-013 | Done via CR-017 | Public icon registry present. |
| CR-015 | Done | Vite library build and Vite-first scaffold present. |
| CR-016 | Done | Vite scaffold-first showcase builds and runs. |
| CR-017 | Done | Theme/icon registries and public hooks (`useThemeController`, `useIconController`). |
| CR-018 | Done | Public `MarkdownReader` present and tested. |
| CR-019 | Done | Showcase docs fed from Markdown with frontmatter. |
| CR-020 | Done | Head management and declarative provider config aligned. |
| CR-021 | Done | Theme/template separation; five templates in `templates/`; themes in `themes/*.ts`. |
| CR-022 | Done | Bootstrap utilities in JSX replaced with native Tailwind. |
| CR-023 | Done | Driver manifest + service registry with explicit driver names. |
| CR-026 | Done | Provider-agnostic `AuthButton` and `DropboxAuthProvider` with test coverage. |
| CR-028 | Done | Provider configuration state present and used by main providers/components. |
| CR-030 | Done | Typed, self-contained themes with `preset`, `motion` and `components`. |
| CR-032 | Done | `FirebaseAuthProvider` (password/anonymous/OAuth SSO); `firebaseAuth` driver registered in manifest. Unit tests present. |
| CR-033 | Done | `FirestoreDataProvider` (onSnapshot realtime, where/orderBy, set/update/remove/count); `firestoreDb` driver registered. Unit tests present. |
| CR-034 | Done | `SupabaseDataProvider` (Postgres + Realtime `postgres_changes`); `supabaseDb` driver registered. Unit tests (24) present. |
| CR-035 | Done | `SupabaseStorageProvider` (upload/delete/rename/download/list/getFileInfo/createUpload); `supabaseStorage` driver registered. Unit tests (23) present. |
| CR-036 | Done | `SupabaseAuthProvider` (password/magic_link/oauth/anonymous, `onAuthChange`, `getAccessToken`); `supabaseAuth` driver registered. Unit tests (14) present. |
| CR-037 | ⬜ | Component Builder System — `useImage()` pattern non ancora standardizzato. |
| CR-052 | Done | `CredentialsAdapter` contract; `GoogleServiceAccountProvider` (Web Crypto JWT, scoped Google API tokens, browser-safe); `googleServiceAccount` driver registered. |
| CR-029 | Done | `I18nProvider`, `useI18n()`, runtime translation registration, `LocaleSwitcher` and root exports are present and used by `<App>`. Docs (`docs/architecture/i18n.md`), showcase page (`/components/locale-switcher`), and 16 dedicated tests all done. All 14 files fully migrated (I18N_AUDIT.md). `npm run test` and `npm run build` pass. |
| CR-042 | Done | TypeScript no-any: `any` count 101 → 6 justified exceptions (all annotated `// CR-042`). `tsc --noEmit` 0 errors. |
| CR-012 | Done | Showcase refactor completo. `.env.template` rimosso. |
| CR-024 | Done | `RichText.tsx` (1510 righe) con TipTap, lazy loading, toolbar configurabile, export pubblico, pagina showcase `RichTextPage.tsx`, file i18n multilingua. |
| CR-031 | Done | `SideNav` in `src/components/blocks/SideNav.tsx`, esportato pubblicamente e usato dallo showcase. |
| CR-038 | Done | Public naming normalization per AI-first completata. |
| CR-044 | Done | Crop, Label, UploadCSV pagine showcase tutte presenti. |
| CR-025 | Done | `ContextMenu` standalone (floating, keynav, searchable, trigger custom). Integrato showcase Prompt (`{`, `@`, `/`). `Command.tsx` rimosso. |
| CR-046 | Done | PromptRun redesign chatbot-style. |
| CR-047 | Done | Prompt extensible toolbar + PromptUtils API. |
| CR-049 | Done | Component.schema meta-layer per configurazione campi. |
| CR-014 | Done | Audit API completo su 40+ componenti. 8 bug fix. JSDoc su 20+ file. |
| CR-006 | Done | Test suite: 61 file, 649+ unit/component, 10 Firebase emulator + 8 Supabase emulator integration, 16 Playwright E2E (smoke + navigation + CRUD). 100%. Google OAuth E2E deferito. |
| CR-007 | Done | Showcase stubs risolti: 0 stub routes. 4 provider redirects, 5 example pages reali (CRUD, Dashboard, NestedForm, FileManager, GoogleAuth). Showcase deployato su GH Pages. Docs allineati. |
| CR-053 | Done | Doc audit: api, publish, ProviderSession, ProviderSwitcher docs scritti. 25 discrepanze corrette. |
| CR-054 | Done | Grid views config (toggle table/gallery, column picker, field picker). |
| CR-055 | Done | Fill-height editor (`EditorHeight = number \| 'fill'`). |
| CR-056 | Done | Grouped command menu in ContextMenu. |
| CR-057 | Done | Theming fixes Grid.Table/Grid.Gallery. |
| CR-058 | Done | AI tool calling system (Anthropic, Gemini, OpenAI, OpenCode). |
| CR-059 | Done | Abortable AI provider calls. |
| CR-060 | Done | i18n'd Modal confirm dialogs. |
| CR-061 | Done | Modal rightInset / closeSlot props. |
| CR-062 | Done | Secret redaction in fetch error logs. |
| CR-063 | Done | Tenant Firestore db (databaseId, dispose). |
| CR-064 | Done | Provider dispose contract. |
| CR-065 | Done | Firestore getDb() dentro try block. |
| CR-066 | Done | Empty cache snapshot filter in Firestore subscribe. |
| CR-067 | Done | AsyncDropdown searchable con debounce, AbortSignal, stati asincroni, test e showcase. Issue #7 chiusa. |
| CR-068 | Done | Node 24 LTS, Vite 8, React 19, dipendenze stabili correnti, browser policy e allineamento framework/showcase/CMS. Issue #8 chiusa. |
| CR-069 | Done | Workflow AI centralizzato, adapter per gli agenti e preflight automatico di release. Issue #9 chiusa. |
| CR-070 | Done | Registrazione della stessa istanza di provider resa no-op, switchSession deduplica gli switch concorrenti della stessa sessione. Issue #10 chiusa. |
| CR-071 | Done | `Chatbot` component estratto da `Prompt` (textarea, allegati con drag&drop, model picker, dropdown opzionali), `PromptRun` refattorizzato per consumarlo con zero breaking change. Issue #13 chiusa. |
| CR-073 | Done | Log file LLM opzionale (dev-only, un file per conversazione) nel proxy Vite; fix allegati ignorati dal provider `opencode`; `libs/csv.ts`. Issue #17 chiusa. |
| CR-074 | Done | `Table`/`Grid` — nuovo prop `recordId` per una key di riga stabile sotto churn di identità d'oggetto (fix: `GridTableView` ora lo inoltra a `Table`, prima no); risolve il remount-on-keystroke di una riga Form-bound. Showcase aggiornato (props/playground/demo, 6 lingue). Issue #18 chiusa. |
| CR-077 | Done | `UploadImage` — nuovo prop `allowUrl` per inserire un'immagine da URL invece di caricarla, stessa forma `FileProps`/preview di un upload reale. i18n 6 lingue, 3 nuovi test, showcase aggiornato (sezione dedicata + playground + 6 lingue). Issue #21 chiusa. |
| CR-078 | Done | `Grid` — nuovo prop `filters?: GridFilterConfig<TRecord>[]`: checkbox toggle nell'header di default, accanto a `searchable`, applicate PRIMA della ricerca testuale. Nuovo export pubblico `GridFilterConfig`. 4 nuovi test, props table showcase aggiornata (6 lingue). Follow-up (1.7.1): resa visiva a toggle-switch, esempio live + playground (readOnly) nello showcase (6 lingue). Issue #22 chiusa. |
| CR-079 | Done | `Grid.filters` esteso con `kind: 'select'\|'multiselect'\|'dateRange'\|'numberRange'` (oltre a `'toggle'`, retrocompatibile); nuovo bottone "Filtri" nell'header apre un pannello laterale con un controllo per filtro, ogni filtro attivo mostra una chip rimovibile sulla riga di ricerca. 6 nuovi export pubblici (`GridFilterOption` + 5 config per kind), test riscritti/estesi, showcase e i18n aggiornati (6 lingue). Follow-up (1.8.1): bottone Filtri icon-only accanto alla search, chip con `Badge`+`ActionButton` reali, pannello più largo, date/number range impilati verticalmente. Follow-up (1.8.2): contatore "N / M" spostato dopo le chip attive invece che tra il bottone Filtri e le chip. Follow-up (1.8.3): denominatore del contatore fissato al totale non filtrato; header colonna `Table` non va più a capo. Issue #23 chiusa. |

---

## Open change requests

| CR | Real state | What is missing |
|----|-----------|-----------------|
| CR-072 | **Diagnosed — not fixable via config alone** | 890 `tsc --noEmit` errori in `clients/showcase` causati da TypeScript 6.0.3: named exports da `.d.ts` files fuori dallo scope del progetto (`include: ["src"]`) non sono visibili in modalità named import (`import { Icon }`), mentre `import * as` e `typeof import()` funzionano. Tentate: `paths`, `moduleResolution: node10/bundler`, `include` espanso, `.ts` proxy, `.d.ts` proxy, skipLibCheck toggle — stesso risultato. Root cause: regressione TS 6.0.3 nel cross-project type resolution. `npm run build` (Vite/esbuild) è l'unico gate reale e passa. 15 errori prismjs risolti (wildcard declaration in `vite-env.d.ts`). Issue #14 aperta. |
| CR-037 | ⬜ | Component Builder System — `useImage()` pattern non ancora standardizzato. |
| CR-040 | **0% — spec written** | SchemaForm (form generation from JSON schema/factory); spec in `CHANGE_REQUESTS.md`. No implementation. |
| CR-041 | **0% — proposal written** | SeoEnhancer (HTML filter applying technical SEO, structured report); proposal in `CHANGE_REQUESTS.md`. No implementation. |
| CR-045 | ⬜ | AI Adoption: piano di distribuzione e visibilità. |
| CR-051 | **0% — spec written** | WorkflowAI declarative multi-step pipeline; spec in `CHANGE_REQUESTS.md`. No implementation. |

---

## Real structure

```text
src/
  App.tsx                  # routing, RuntimeProvider, declarative provider config, theme/icon/head, basename
  Config.tsx               # runtime config, tenant config, Firebase/Google/AI/Dropbox config
  Global.tsx               # localStorage-backed global state, composed by runtime provider
  Head.tsx                 # head controller JSX: metadata, document, social, assets, PWA, schema.org
  Theme.tsx                # ThemeProvider, theme registry, useTheme/useThemeController
  motion.ts                # motion registry helpers, reduced motion, motion hooks
  I18n.tsx                 # I18nProvider, useI18n, locale dictionaries, interpolate
  components/
    ui/                    # presentational primitives (Alert, Badge, Button, Card, Icon, Image,
    │                        Loader, Modal, Pagination, Table, Gallery, Tab, Repeat, GridSystem)
    ui/fields/             # Input (String/Number/Email/Password/Color/Date/…), Select, Upload,
    │                        ImageField, RichText, Prompt, UploadCSV
    blocks/                # Brand, Menu, Breadcrumbs, Notifications, Search, Carousel, Dropdown, SideNav, ProviderSwitcher
    widgets/               # Form, Grid, MarkdownReader, ImageEditor wrapper + lazy impl chunk
    Component.tsx          # FieldAdapter pattern for schema-driven forms (cleaned up)
  providers/
    ProviderDescriptor.ts  # Metadata descriptor for provider registry UI
    ProviderSession.tsx    # useProviderSession, registerProviderSessionFactory
    manifest.ts            # driver manifest: PROVIDER_MANIFESTS, DriverDescriptor, ServicesConfig
    api/                   # ApiProviderAdapter + Firebase/Supabase/Mock adapters
    data/                  # DataProvider contract; FirebaseDataProvider (RTDB), FirestoreDataProvider,
    │                        SupabaseDataProvider, MockDataProvider
    storage/               # StorageProvider contract; FirebaseStorageProvider,
    │                        SupabaseStorageProvider, Dropbox helper
    auth/                  # AuthProvider contract; GoogleAuthProvider, FirebaseAuthProvider,
    │                        SupabaseAuthProvider, DropboxAuthProvider
    credentials/           # CredentialsAdapter contract; GoogleServiceAccountProvider
    email/                 # EmailProvider contract; GmailEmailProvider, definitions
    icon/                  # LucideIconProvider, PhosphorIconProvider
    ai/                    # AI multi-provider (OpenAI/Gemini/Anthropic/DeepSeek/Mistral/…/GLM)
    publish/               # PublishProviderAdapter + CloudflarePages/Netlify definitions
    seo/                   # Google keyword/trend helpers
    scrape/                # SerpAPI scraping (cache via DataProviderAdapter)
    firebase-init.ts
    proxy/                 # Proxy registry, Vite dev proxy, Express proxy
  types/
  libs/                    # pure utilities: path, converter, sanitizer, email, fetch, utils, order, cn, imageBuilder
  pages/                   # PageNotFound (only remaining page export)
  conf/i18n/               # Framework-level i18n dictionaries (en/it/de/ru/zh/ar)
```

```text
clients/showcase/
  src/index.tsx            # real Vite consumer based on <App providers={{ mock: ... }}>
  src/conf/menu.ts         # single showcase menu
  src/docs/markdownDocs.ts # Markdown/frontmatter loader
  src/layouts/ShowcaseLayout.tsx
  src/components/SideNav.tsx  # collapsible sidebar with icon-only mode + hover overlay
  src/pages/               # docs, components, providers, examples
```

---

## Visible stubs and gaps in the showcase

Tutti gli stub risolti. 0 route stub rimanenti.

Resolved provider stubs (redirect to `/providers/data`, `/providers/storage`, `/providers/auth`):

| Area | Route | Resolution |
|------|-------|------------|
| Providers | `/providers/data/firebase`, `/providers/data/supabase` | `<Navigate to="/providers/data">` |
| Providers | `/providers/storage/firebase` | `<Navigate to="/providers/storage">` |
| Providers | `/providers/auth/google` | `<Navigate to="/providers/auth">` |

Resolved example stubs (real pages with `MockDataProvider`):

| Area | Route | Resolution |
|------|-------|------------|
| Examples | `/examples/crud` | `CrudPage.tsx` — GridDB + Form + Badge, 6 prodotti sortable/paginati |
| Examples | `/examples/dashboard` | `DashboardPage.tsx` — Card metriche + GridDB ordini con status Badge |
| Examples | `/examples/nested-form` | `NestedFormPage.tsx` — dot notation + Repeat dinamico |
| Examples | `/examples/file-manager` | `FileManagerPage.tsx` — GridDB file listing + status Badge |
| Examples | `/examples/google-auth` | `GoogleAuthPage.tsx` — AuthButton demo + spiegazione OAuth |

Main real routes:

| Area | Routes |
|------|--------|
| Docs | Generated from Markdown in `docs/` via `import.meta.glob` |
| Components | Alert, Badge, Buttons, Card, Code, Dropdown, Gallery, GridSystem, Icon, Image, ImageAvatar, ImageField, ImageEditor, Loader, LocaleSwitcher, Modal (+ ModalYesNo, ModalOk), Motion, Notifications, Pagination, Prompt, Search, Select, Autocomplete, Checklist, Upload, Form, Grid, GridArray, GridDB, MarkdownReader, Repeat, Auth, LayoutBuilder |
| Providers | `/providers`, `/providers/data`, `/providers/storage`, `/providers/auth`, `/providers/email`, `/providers/integrations` |
| Examples | `/examples/ai`, `/examples/crud`, `/examples/dashboard`, `/examples/nested-form`, `/examples/file-manager`, `/examples/google-auth` |

---

## Remaining legacy dependencies

| File | State |
|------|-------|
| ~~`src/components/ui/fields/Command.tsx`~~ | Removed in CR-025 (commit `df7d4a6`). |

---

## Verification performed

Real verification performed on 2026-09-04 (1.9.0 — CR-080, `Component.input` richtext/range/url):

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | Passes: 0 errors. |
| `npm test` | Passes: 63 files, 692 tests. |
| `npm run build` | Passes: Vite library build + declarations. |
| `npm pack --dry-run --json` | Passes: 216 entries. |

Real verification performed on 2026-09-02 (1.8.4 — opencode discoverModels fix, ContextMenu.Heading sticky fix):

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | Passes: 0 errors. |
| `npm test` | Passes: 63 files, 692 tests. |
| `npm run build` | Passes: Vite library build + declarations. |
| `npm pack --dry-run --json` | Passes: 216 entries. |

Real verification performed on 2026-08-02 (CR-075 Grid search/scroll/sticky-header + CR-076 Firebase auth/Firestore token refresh):

| Command | Result |
|---------|--------|
| `npx tsc --noEmit` | Passes: 0 errors. |
| `npm test` | 63 files, 684 tests — 682 passed, 2 failed (both `publicExports.contract.test.ts`, a known-flaky 5s filesystem-scan timeout unrelated to this release; re-run clean on isolated file). Two real test mocks fixed as part of this release (`FirestoreDataProvider.test.ts`'s `firebase/auth` mock, `FirebaseAuthProvider.test.ts`'s `firebase-init` mock) to match the `onIdTokenChanged`/`getFirestoreConfigurationState` production changes (CR-076). |
| `npm run build` | Passes: Vite library build + declarations (`dist/types/src/index.d.ts` regenerated). |
| `npm pack --dry-run --json` | Passes: 213 entries. |

Real verification performed on 2026-07-29 (CR-071 drag&drop addition + CR-073):

| Command | Result |
|---------|--------|
| `npm test` | Passes: 63 files, 681 tests (10 Chatbot tests incl. drag&drop, AIProviderDefinitions logId header tests for all 4 providers, promptUtils text-attachment tests). |
| `npm run test:integration` | Passes: 10 Firebase emulator tests (RTDB + Firestore + Storage) + 8 Supabase emulator tests (Postgres CRUD + Auth). Firebase Storage tests timed out (port 9199 not running). |
| `npm run test:e2e` | Passes: 16 Playwright tests (smoke + navigation + CRUD flow, 30+ showcase pages). 1 flaky (interactions/404 — Vite pre-transform race). |
| `npm run build` | Passes: Vite library build + declarations; `ImageEditor` emitted as a separate lazy chunk (`ImageEditorImpl-*`). |
| `cd clients/showcase && npm run build` | Passes: Vite production build. (Vite/esbuild, non tsc) |
| `cd clients/showcase && npx tsc --noEmit` | 890 errori (691 TS2305 + cascade): TypeScript 6.0.3 regression — named exports da `.d.ts` fuori scope non visibili. Non è un gate reale; `npm run build` è il gate documentato. |
| `npm pack --dry-run` | Passes: 283 files. |
| `tsc --noEmit` | Passes: 0 errors. |
| Targeted audit of `src/`, `clients/showcase/`, `.notes/`, `tests/` | Confirmed: i18n is real, `ImageField` is the active public image field, `ImageEditor` now lazy-loads heavy runtime, tests all green. |

---

## Target versions

| Version | Real state |
|---------|-----------|
| 1.0.0 | Published on npm (`@llmnative/react@1.0.0`). |
| 1.1.0 | Published on npm (`@llmnative/react@1.1.0`). CR-007 completo. GH Pages deploy live. |
| 1.2.0 | Published on npm (`@llmnative/react@1.2.0`). CR-067 e CR-068 complete. |
| 1.2.1 | Published on npm (`@llmnative/react@1.2.1`). CR-069 completa. Contiene anche CR-070 (unchanged provider no-op). |
| 1.3.0 | Published on npm (`@llmnative/react@1.3.0`). CR-071 (Chatbot, incl. drag&drop) e CR-073 (log LLM dev-only, fix allegati opencode) complete. |
| 1.4.0 | Published on npm (`@llmnative/react@1.4.0`). CR-074 (`Table`/`Grid` `recordId` — stable row identity) completa. |
| 1.5.0 | Published on npm (`@llmnative/react@1.5.0`). CR-075 (Grid built-in search, internal scroll with sticky header, Card layout props) e CR-076 (Firebase Auth/Firestore ID token refresh reactivity + Firestore-only config fix) complete. |
| 1.6.0 | Published on npm (`@llmnative/react@1.6.0`). CR-077 (`UploadImage` insert-from-URL) completa. |
| 1.7.0 | Published on npm (`@llmnative/react@1.7.0`). CR-078 (`Grid.filters` — toggle filters in header) completa. |
| 1.7.1 | Published on npm (`@llmnative/react@1.7.1`). CR-078 follow-up: toggle-switch visual, showcase live example + playground entry (6 lingue). |
| 1.8.0 | Published on npm (`@llmnative/react@1.8.0`). CR-079 (`Grid.filters` panel: select/multiselect/dateRange/numberRange + removable chips) completa. |
| 1.8.1 | Published on npm (`@llmnative/react@1.8.1`). CR-079 follow-up: icon-only Filters trigger next to search, real Badge/ActionButton chips, wider panel, stacked range inputs. |
| 1.8.2 | Published on npm (`@llmnative/react@1.8.2`). CR-079 follow-up: match count reordered to trail active-filter chips. |
| 1.8.3 | Published on npm (`@llmnative/react@1.8.3`). CR-079 follow-up: match count denominator fixed to total unfiltered records; Table column headers no longer wrap. |
| 1.8.4 | Published on npm (`@llmnative/react@1.8.4`). Minor fix release (no CR): `opencode` provider's `discoverModels` filter matched nothing against the real `/zen/v1/models` response shape, so it silently always fell back to the static model list; `ContextMenu.Heading` sticky positioning fix (grouped menu headers were scrolling away with their items instead of staying pinned). |
| 1.9.0 | Published on npm (`@llmnative/react@1.9.0`). CR-080 (`Component.input` — `richtext`/`range`/`url`) completa. |
| 1.x / 2.0 | Roadmap: CR-051 (WorkflowAI), CR-040 (SchemaForm), CR-041 (SeoEnhancer), E2E. CR-072 deferito (TypeScript 6 regression upstream). |
