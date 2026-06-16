# Project status

> Snapshot verified against the real codebase, not against the historical plan.
> Last reviewed: 2026-06-08

---

## General state

| Area | Verified real state | Target / gap |
|------|---------------------|--------------|
| Data layer | `DataProvider` registry/context present. All implementations complete: `FirebaseDataProvider` (RTDB), `FirestoreDataProvider` (Cloud Firestore + onSnapshot), `SupabaseDataProvider` (Postgres + Realtime), `MockDataProvider`. Unit tests for all four providers. | Firebase/Supabase integration/emulator tests missing. |
| Storage layer | `StorageProvider` context present. Implementations complete: `FirebaseStorageProvider` (upload/download/delete/list/rename + progress), `SupabaseStorageProvider` (upload/download/delete/list/rename/signed URLs). Unit tests for both. | Browser integration/E2E tests missing. |
| Auth/Email layer | `AuthProvider` complete. All four auth adapters present and exported: `GoogleAuthProvider` (GIS), `FirebaseAuthProvider` (password/anonymous/OAuth SSO), `SupabaseAuthProvider` (password/magic_link/oauth/anonymous), `DropboxAuthProvider`. `GmailEmailProvider` present. | Real browser OAuth integration tests missing. |
| Credentials layer | `CredentialsAdapter` contract present. `GoogleServiceAccountProvider` (Web Crypto JWT, browser-safe, scoped tokens) complete and exported. | No integration tests. |
| Runtime/App config | `<App>` uses `RuntimeProvider` composing `ConfigContext`, provider registries and persisted global state. `onConfigChange` used by concrete providers for lazy config. | No remaining structural gap. |
| Provider registries | `src/providers/manifest.ts` is the driver registry. All drivers registered: `dbRealtime`, `firestoreDb`, `supabaseDb`, `mock`, `firestorage`, `supabaseStorage`, `googleAuth`, `firebaseAuth`, `supabaseAuth`, `dropboxAuth`, `gmail`, `googleServiceAccount`. `services` selects drivers declaratively. | No remaining gap. Storage/Email optional (null if absent). |
| Motion system | Semantic motion layer present (`src/motion.ts`) with `prefers-reduced-motion`, theme registry and public hooks. Integrations verified on button, modal, dropdown, tab, image. | `Notifications`/toast-specific motion still missing (CR-027 partial). |
| Theme/Icon | Theme registry and icon registry managed by `<App>`. Public hooks: `useThemeController`, `useIconController`. Themes: `default`, `flat`, `cyber`. Icon providers: `lucide`, `phosphor`. | No structural gap. Visual regression not automated. |
| UI library | Tailwind v4 CSS runtime with Bootstrap-like compatibility layer (`@layer components`). Bootstrap utilities replaced with native Tailwind. | Broader visual regression remains manual. |
| TypeScript | `strict: true`; `npm run build` generates bundle + declarations. CR-042 done: `any` count → 6 justified exceptions, all annotated. | No remaining structural gap. |
| Dead code | Removed: `Helper.tsx` (1696 lines), `Blog.tsx`, `Template.tsx`, `FormEnhancer.tsx`, `AssistantAI.tsx`, `BlogPost.tsx`, `Component.tsx` dead exports, `libs/log.ts`, `libs/cache.ts`, `libs/database.ts`, `libs/storage.ts`, `libs/seo.ts`. Log logic inlined in `Form.tsx` via `useDataProvider()`. Cache logic inlined in `scrape/index.ts` via `DataProviderAdapter`. | `src/components/ui/fields/Command.tsx` still remains (CR-025). |
| Tests | 41 files / 425 tests pass (Vitest). Suites: libs, providers (Mock, Firebase RTDB, Firestore, FirebaseStorage, Supabase, SupabaseStorage, SupabaseAuth, AIProviders, DropboxStorage), App, theme/icon, motion, auth, Form/Grid/Input/Select/Upload/Repeat/MarkdownReader/Table/Modal/Dropdown/Gallery/Buttons. GitHub Actions CI present (test + build + showcase jobs). | Firebase/Supabase integration (emulator), browser OAuth, email, Playwright E2E remain. |
| Library build | `npm run build` passes. Output: `dist/index.js`, `dist/index.mjs`, `dist/index.css`, `dist/types`. | No structural gap. |
| Showcase app | `clients/showcase` is a real Vite consumer. Pages: Auth, Alert, Badge, Buttons, Card, Code, Dropdown, Gallery, GridSystem, Icon, Image, ImageAvatar, Loader, Modal (incl. ModalYesNo/ModalOk sub-pages), Motion, Notifications, Pagination, Prompt, Search, Select, Autocomplete, Checklist, Upload, Form, Grid, GridArray, GridDB, MarkdownReader, Repeat, LayoutBuilder. SideNav collapsible with icon-only mode. | Stub routes remain for concrete provider demos and application examples. |
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
| CR-037 | Done | `CredentialsAdapter` contract; `GoogleServiceAccountProvider` (Web Crypto JWT, scoped Google API tokens, browser-safe); `googleServiceAccount` driver registered. |
| CR-042 | Done | TypeScript no-any: `any` count 101 → 6 justified exceptions (all annotated `// CR-042`). `tsc --noEmit` 0 errors. |

---

## Open change requests

| CR | Real state | What is missing |
|----|-----------|-----------------|
| CR-006 | **65%** — 41 files / 425 unit tests pass. GitHub Actions CI present (test + build + showcase). Firebase/Supabase emulator integration, browser OAuth, email and Playwright E2E still absent. | E2E/Playwright tests. |
| CR-007 | **70%** — Showcase is a real Vite consumer app with many component pages and interactive playgrounds. SideNav present. | Stub routes on concrete provider demos and application examples remain. |
| CR-012 | **0%** — Stub routes still in showcase menu. | Replace provider/example stubs with real demos or honest placeholder pages. |
| CR-014 | **40%** — Component API and playground much richer than May snapshot. | Public API audit, Input/Modal/Grid doc clarifications, remaining `any` patterns. |
| CR-024 | **0%** | WYSIWYG `<RichEditor>` not started. |
| CR-025 | **0%** | `Command.tsx` (legacy `contentEditable`/`execCommand`) still present; no ContextMenu/slash command. |
| CR-027 | **70%** | Motion system complete and tested. `Notifications`/toast motion still missing. |
| CR-029 | **0%** | No `I18nProvider`, `useI18n()` or framework-level dictionary. |
| CR-031 | **0%** | Sidebar block still in `clients/showcase/src/components/Sidebar.tsx`; `src/components/blocks/Sidebar.tsx` does not exist. |
| CR-038 | **0%** | Public naming normalization for AI-first: `Grid.layout`, `Form.aspect`, `AuthButton.aspect`, `ImageUrl.mode` inconsistent with target vocabulary. |
| CR-039 | **0% — spec written** | WorkflowAI declarative multi-step pipeline; spec in `CHANGE_REQUESTS.md`. No implementation. |
| CR-040 | **0% — spec written** | SchemaForm (form generation from JSON schema/factory); spec in `CHANGE_REQUESTS.md`. No implementation. |
| CR-041 | **0% — proposal written** | SeoEnhancer (HTML filter applying technical SEO, structured report); proposal in `CHANGE_REQUESTS.md`. No implementation. |

---

## Real structure

```text
src/
  App.tsx                  # routing, RuntimeProvider, declarative provider config, theme/icon/head
  Config.tsx               # runtime config, tenant config, Firebase/Google/AI/Dropbox config
  Global.tsx               # localStorage-backed global state, composed by runtime provider
  Head.tsx                 # head controller JSX: metadata, document, social, assets, PWA, schema.org
  Theme.tsx                # ThemeProvider, theme registry, useTheme/useThemeController
  motion.ts                # motion registry helpers, reduced motion, motion hooks
  components/
    ui/                    # presentational primitives (Alert, Badge, Button, Card, Icon, Image,
    │                        Loader, Modal, Pagination, Table, Gallery, Tab, Repeat, GridSystem)
    ui/fields/             # Input, Select, Upload, Prompt, UploadCSV, Command (legacy — CR-025)
    blocks/                # Brand, Menu, Breadcrumbs, Notifications, Search, Carousel, Dropdown
    widgets/               # Form, Grid, MarkdownReader, ImageEditor
    Component.tsx          # FieldAdapter pattern for schema-driven forms (cleaned up)
  providers/
    manifest.ts            # driver manifest: PROVIDER_MANIFESTS, DriverDescriptor, ServicesConfig
    data/                  # DataProvider contract; FirebaseDataProvider, FirestoreDataProvider,
    │                        SupabaseDataProvider, MockDataProvider
    storage/               # StorageProvider contract; FirebaseStorageProvider,
    │                        SupabaseStorageProvider, Dropbox helper
    auth/                  # AuthProvider contract; GoogleAuthProvider, FirebaseAuthProvider,
    │                        SupabaseAuthProvider, DropboxAuthProvider
    credentials/           # CredentialsAdapter contract; GoogleServiceAccountProvider
    email/                 # EmailProvider contract; GmailEmailProvider
    icon/                  # LucideIconProvider, PhosphorIconProvider
    ai/                    # AI multi-provider (OpenAI/Gemini/Anthropic/DeepSeek/Mistral/…)
    seo/                   # Google keyword/trend helpers
    scrape/                # SerpAPI scraping (cache via DataProviderAdapter)
    firebase-init.ts
  types/
  libs/                    # pure utilities: path, converter, sanitizer, email, fetch, utils, order, cn, imageBuilder
  pages/                   # PageNotFound (only remaining page export)
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

Routes still stubbed in `clients/showcase/src/conf/menu.ts`:

| Area | Stub routes |
|------|-------------|
| Providers | `/providers/data/firebase`, `/providers/data/supabase`, `/providers/storage/firebase`, `/providers/auth/google` |
| Examples | `/examples/crud`, `/examples/dashboard`, `/examples/nested-form`, `/examples/file-manager`, `/examples/google-auth` |

Main real routes:

| Area | Routes |
|------|--------|
| Docs | Generated from Markdown in `docs/` via `import.meta.glob` |
| Components | Alert, Badge, Buttons, Card, Code, Dropdown, Gallery, GridSystem, Icon, Image, ImageAvatar, Loader, Modal (+ ModalYesNo, ModalOk), Motion, Notifications, Pagination, Prompt, Search, Select, Autocomplete, Checklist, Upload, Form, Grid, GridArray, GridDB, MarkdownReader, Repeat, Auth, LayoutBuilder |
| Providers | `/providers`, `/providers/data`, `/providers/storage`, `/providers/auth`, `/providers/email`, `/providers/integrations` |
| Examples | `/examples/ai` |

---

## Remaining legacy dependencies

| File | State |
|------|-------|
| `src/components/ui/fields/Command.tsx` | Legacy prototype with `contentEditable` and `document.execCommand`; to be removed or replaced in CR-025. |

---

## Verification performed

Real verification performed on 2026-06-07:

| Command | Result |
|---------|--------|
| `npx vitest run --reporter=dot` | Passes: 39 files, 377 tests (1 pre-existing `localStorage` warning in Node e2e env). |
| `npm run build` | Passes: Vite library build + declarations. |
| `cd clients/showcase && npm run build` | Passes: Vite production build. |
| `Get-Content package.json` | Verified current version `0.1.1`. |
| Targeted audit of `src/`, `clients/showcase/`, `docs/`, `tests/` | Confirmed: all providers complete, dead code removed, tests green. |

---

## Target versions

| Version | Real state |
|---------|-----------|
| 0.1.1 | Current version in `package.json` and verified build. |
| 2.0.0-alpha | Useful roadmap label for the architectural transition (provider abstraction, manifest, theme/motion/credentials registries, all core providers complete). Not a published version. |
| 2.0.0-rc | Not yet ready: showcase has stubs, E2E/CI absent, CR-038 naming normalization pending. |
| 2.0.0 | Conceptual target: all CRs complete, CI green, showcase stub-free, E2E pass, published to npm. |
