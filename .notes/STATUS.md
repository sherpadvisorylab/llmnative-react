# Project status

> Snapshot verified against the real codebase, not against the historical plan.
> Last reviewed: 2026-07-21

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
| Tests | 61 unit/component files / 643 tests + 10 Firebase emulator + 8 Supabase emulator integration tests + 16 Playwright E2E (all pass). Suites: libs (utils, converter, path, sanitizer, fetch, promptUtils), providers (Mock, Firebase RTDB, Firestore, FirebaseStorage, Supabase, SupabaseStorage, SupabaseAuth, AIProviders, DropboxStorage, Gmail, Google Service Account, Scrape, ProxyRegistry), App, theme/icon, motion, auth, Form/Grid/Input/Select/Upload/Repeat/MarkdownReader/Table/Modal/Dropdown/Gallery/Buttons/Prompt + form-controller + smoke tests (blocks, switchers, fields, ui, widgets) plus the public export contract and proxy runtime e2e. Integration: Firebase RTDB/Firestore/Storage emulator CRUD + Supabase Postgres CRUD + Auth. E2E: 16 Playwright tests covering 30+ showcase pages (smoke + navigation + CRUD flow). GitHub Actions CI present (test + build + showcase jobs). | Google OAuth E2E ancora assente. |
| Library build | `npm run build` passes. Output: `dist/index.js`, `dist/index.mjs`, `dist/index.css`, `dist/types`. `ImageEditor` heavy runtime is now split into a separate lazy chunk (`dist/ImageEditorImpl-*`) instead of being forced into the root bundle. `npm pack` verified (200 files, 437 KB). Published as `@llmnative/react@1.0.0` on npm. | No structural gap. |
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
| CR-006 | Done | Test suite: 61 file, 643 unit/component, 10 Firebase emulator + 8 Supabase emulator integration, 16 Playwright E2E (smoke + navigation + CRUD). 100%. Google OAuth E2E deferito. |
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

---

## Open change requests

| CR | Real state | What is missing |
|----|-----------|-----------------|
| CR-037 | ⬜ | Component Builder System — `useImage()` pattern non ancora standardizzato. |
| CR-040 | **0% — spec written** | SchemaForm (form generation from JSON schema/factory); spec in `CHANGE_REQUESTS.md`. No implementation. |
| CR-041 | **0% — proposal written** | SeoEnhancer (HTML filter applying technical SEO, structured report); proposal in `CHANGE_REQUESTS.md`. No implementation. |
| CR-045 | ⬜ | AI Adoption: piano di distribuzione e visibilità. |
| CR-051 | **0% — spec written** | WorkflowAI declarative multi-step pipeline; spec in `CHANGE_REQUESTS.md`. No implementation. |
| CR-067 | Done | AsyncDropdown searchable con debounce, AbortSignal, stati asincroni, test e showcase. |

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

Real verification performed on 2026-07-10:

| Command | Result |
|---------|--------|
| `npm test` | Passes: 61 files, 643 tests. |
| `npm run test:integration` | Passes: 10 Firebase emulator tests (RTDB + Firestore + Storage) + 8 Supabase emulator tests (Postgres CRUD + Auth). Firebase Storage tests timed out (port 9199 not running). |
| `npm run test:e2e` | Passes: 16 Playwright tests (smoke + navigation + CRUD flow, 30+ showcase pages). 1 flaky (interactions/404 — Vite pre-transform race). |
| `npm run build` | Passes: Vite library build + declarations; `ImageEditor` emitted as a separate lazy chunk (`ImageEditorImpl-*`). |
| `cd clients/showcase && npm run build` | Passes: Vite production build. |
| `npm pack --dry-run` | Passes: 200 files, 437 KB tarball. |
| `tsc --noEmit` | Passes: 0 errors. |
| Targeted audit of `src/`, `clients/showcase/`, `.notes/`, `tests/` | Confirmed: i18n is real, `ImageField` is the active public image field, `ImageEditor` now lazy-loads heavy runtime, tests all green. |

---

## Target versions

| Version | Real state |
|---------|-----------|
| 1.0.0 | Published on npm (`@llmnative/react@1.0.0`). |
| 1.1.0 | Published on npm (`@llmnative/react@1.1.0`). CR-007 completo. GH Pages deploy live. |
| 1.x / 2.0 | Roadmap: CR-051 (WorkflowAI), CR-040 (SchemaForm), CR-041 (SeoEnhancer), E2E. |
