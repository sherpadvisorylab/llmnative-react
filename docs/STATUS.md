# Project status

> Snapshot verified against the real codebase, not against the historical plan.
> Last reviewed: 2026-05-27

---

## General state

| Area | Verified real state | Target / gap |
|------|---------------------|--------------|
| Data layer | `DataProvider` exists with registry/context. Implementations present: `FirebaseDataProvider`, `MockDataProvider`, `SupabaseDataProvider`. | Firebase has no integration/emulator tests. `SupabaseDataProvider` remains partial and logs `not fully implemented yet`. |
| Storage layer | `StorageProvider` exists with context. Implementations present: Firebase, Supabase, Dropbox helper/export. `StorageProviderContext` has unit coverage on registry/default/named adapter. | `SupabaseStorageProvider` remains partial and logs `not fully implemented yet`. Contract/integration tests on concrete implementations are missing. The real API uses `getURL` and `delete`. |
| Auth/Email layer | `AuthProvider`, `EmailProvider`, `GoogleAuthProvider`, `DropboxAuthProvider` and `GmailEmailProvider` are present and exported. `AuthButton` uses auth providers registered via manifest. | Real integration tests on browser OAuth providers and concrete email tests are missing. |
| Runtime/App config | `<App>` uses `RuntimeProvider`, which composes `ConfigContext`, provider registries and persisted global state. | `GlobalProvider` remains internal for `useGlobalVars`; global config maintains `onConfigChange` for concrete providers. |
| Provider registries | `<App>` uses the driver manifest (`src/providers/manifest.ts`): each provider declares a driver with a unique name and category. `services` selects drivers such as `dbRealtime`, `firestorage`, `googleAuth`, `dropboxAuth`, `gmail`. | Data/Auth have automatic fallback; Storage/Email remain optional. The `firebaseAuth`, `firestore` and `supabaseAuth` drivers do not yet exist. |
| Motion system | A semantic motion layer exists (`src/motion.ts`) with `prefers-reduced-motion` support, theme registry and public hooks (`useMotionEffect`, `useMotionState`, `usePressMotion`, `useEnterMotion`). Integrations verified on button, modal, dropdown, tab, image and image avatar. Dedicated docs in `docs/architecture/motion.md`. The showcase now includes a dedicated motion playground page. | Specific polish for `Notifications`/toast is still missing. |
| Theme/Icon | Theme registry and icon registry are managed by `<App>`. Public hooks: `useThemeController`, `useIconController`. The `default`, `flat`, `cyber` themes are self-contained in `themes/*.ts` with `preset`, `motion` and `components`. | No remaining structural gap. Only deeper visual regression is missing. |
| UI library | Tailwind v4 CSS runtime with Bootstrap-like compatibility layer. `src/globals.css` is imported from the public barrel. Bootstrap utilities in JSX have been replaced with native Tailwind classes. | This is not a shadcn component-by-component migration. Broader visual regression remains to be done. |
| TypeScript | `strict: true`; `npm run build` generates bundle and declarations. | Some public types still use `any` and legacy patterns; audit in CR-014. |
| Markdown docs | Docs in `docs/` with frontmatter are loaded in the showcase via `import.meta.glob` and `MarkdownReader`. | Operational pages (`STATUS`, `ROADMAP`, `CHANGE_REQUESTS`) remain maintainer documents and are not part of the public docs sidebar. |
| Tests | Vitest configured. 25 files / 188 tests pass: libs, MockDataProvider contract, App, theme/icon, motion, storage context, auth button, DropboxAuthProvider, provider configuration, manifest, Form/Grid/Input/Select/Upload/Repeat/MarkdownReader/Table/Modal/Dropdown/Gallery/Buttons. | Firebase/Supabase integration tests, `Prompt` tests, concrete storage/browser OAuth/email tests, Playwright E2E and CI are missing. |
| Library build | `npm run build` passes. Verified output: `dist/index.js`, `dist/index.mjs`, `dist/index.css`, `dist/types`. | The Vite log continues to show `style.css` before the final rename to `index.css`. |
| CLI scaffolding | Vite-first CLI updated. Theme and template are separate choices; available templates are `blank`, `crm`, `admin`, `inventory`, `project`. | The build of the generated project is not yet covered by automated tests. |
| Showcase app | `clients/showcase` is a real Vite consumer based on `<App>`, `menuConfig`, custom layout, Markdown docs and `providers.mock`. Component pages are now much broader than the May snapshot: Auth, Notifications, dedicated Buttons, Grid, GridArray, GridDB, Prompt, Autocomplete, Checklist, Image, ImageAvatar, LayoutBuilder, etc. | Stub routes remain for some concrete providers and several application examples. Public deploy and smoke E2E are absent. |

---

## Completed change requests

| CR | State | Evidence |
|----|-------|----------|
| CR-001 | Done | AI-first docs and Markdown structure present in `docs/`. |
| CR-002 | Done with integration gap | Provider abstraction present; real tests only on MockDataProvider. |
| CR-002b | Done with test gap | Auth/Email interfaces and Google/Gmail implementations present. |
| CR-003 | Done | TypeScript strict build passes with declarations. |
| CR-004 | Done as compatibility layer | Tailwind runtime present; not shadcn component-by-component. |
| CR-005 | Done via CR-015 | Scaffolding absorbed by the Vite-first flow. |
| CR-013 | Done via CR-017 | Public icon registry present. |
| CR-015 | Done | Vite library build and Vite-first scaffold present. |
| CR-016 | Done | Vite scaffold-first showcase present and builds. |
| CR-017 | Done | Theme/icon registries and public hooks present. |
| CR-018 | Done | Public `MarkdownReader` present and tested. |
| CR-019 | Done | Showcase docs fed from Markdown with frontmatter. |
| CR-020 | Done | Head management and declarative provider config aligned in codebase, docs and scaffold. |
| CR-021 | Done | Theme/template separation. Five templates in `templates/` and visual themes extracted in `themes/*.ts`. |
| CR-022 | Done | Cleanup of Bootstrap utilities in JSX in favour of native Tailwind. |
| CR-023 | Done | Driver manifest + service registry with explicit driver names and generic resolution. |
| CR-026 | Done | Provider-agnostic `AuthButton` and `DropboxAuthProvider` present with test coverage. |
| CR-028 | Done | Provider configuration state present and used by main providers/components. |
| CR-030 | Done | Typed, self-contained themes with `preset`, `motion` and `components`. |

---

## Open change requests

| CR | Real state | What is missing |
|----|-----------|-----------------|
| CR-006 | In progress | The unit/component suite has grown to 25 files / 188 tests. Firebase/Supabase integrations, `Prompt` tests, concrete storage/browser OAuth/email tests, Playwright E2E and CI remain. |
| CR-007 | In progress | The showcase builds and is now a real Vite consumer app with many component pages and interactive playgrounds. Stubs on concrete providers and application examples remain. |
| CR-012 | Todo | Remove remaining showcase stubs and replace them with native react-firestrap demos or honest pages about the real state of the providers. |
| CR-014 | In progress | The codebase shows concrete progress on component API and playground: separate Buttons pages, GridArray/GridDB, Auth, Notifications, Prompt, Autocomplete and Checklist; richer Grid/Table/Modal/Dropdown tests. Public API audit, Input/Modal/Grid docs clarifications and missing `Prompt` coverage remain. |
| CR-024 | Todo | WYSIWYG editor `<RichEditor>`. No implementation found in `src/` or in the showcase. |
| CR-025 | Todo | ContextMenu with slash command and `@mention`. The legacy file `src/components/ui/fields/Command.tsx` is still to be replaced. |
| CR-027 | In progress | Motion system present in codebase, docs, tests and dedicated showcase playground. `Notifications`/toast-specific motion remains. |
| CR-029 | Todo | No `I18nProvider`, `useI18n()` or framework-level dictionary present today. |
| CR-031 | Todo | The showcase sidebar still lives in `clients/showcase/src/components/Sidebar.tsx`; `src/components/blocks/Sidebar.tsx` does not yet exist. |
| CR-032 | Todo | `FirebaseAuthProvider` does not exist; no `firebaseAuth` driver registered in the manifest. |
| CR-033 | Todo | `FirestoreDataProvider` does not exist; no `firestore` driver registered in the manifest. |
| CR-034 | Todo | `SupabaseDataProvider` is still a partial fetch-based implementation without realtime `postgres_changes`. |
| CR-035 | Todo | `SupabaseStorageProvider` is still a partial fetch-based implementation without private signed URLs or the official SDK. |
| CR-036 | Todo | `SupabaseAuthProvider` does not exist; no `supabaseAuth` driver registered in the manifest. |
| CR-037 | Todo | `src/libs/imageBuilder.ts` exists, but a shared `ComponentBuilderResult` contract has not yet been extracted, nor a second builder to validate the pattern. |
| CR-038 | Todo | Public naming to normalise for AI-first: `Grid.layout`, `Form.aspect`, `AuthButton.aspect`, `AssistantAI.viewMode`, `ImageUrl.mode` remain inconsistent with the target vocabulary. |

---

## Real structure

```text
src/
  App.tsx                  # routing, RuntimeProvider, declarative provider config, theme/icon/head
  Config.tsx               # runtime config, tenant config, Firebase/Google/AI/Dropbox config
  Global.tsx               # localStorage-backed global state, composed by the runtime provider
  Head.tsx                 # head controller JSX: metadata, document, social, assets, PWA, schema.org
  Theme.tsx                # ThemeProvider, theme registry, useTheme/useThemeController
  motion.ts                # motion registry helpers, reduced motion support, motion hooks
  components/
    ui/                    # presentational primitives
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

Note: the `src/integrations` and `src/models` folders no longer exist in this codebase. Verified backward-compatible re-exports remain in files such as `src/libs/database.ts`, `src/libs/storage.ts` and the public exports.

```text
clients/showcase/
  src/index.tsx            # real Vite consumer based on <App providers={{ ... }}>
  src/conf/menu.ts         # single showcase menu
  src/docs/markdownDocs.ts # Markdown/frontmatter loader
  src/layouts/             # ShowcaseLayout
  src/components/Sidebar.tsx
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
| Docs | generated from Markdown in `docs/` |
| Components | Alert, Badge, Buttons, Card, Code, Dropdown, Gallery, GridSystem, Icon, Image, ImageAvatar, Loader, Modal, Motion, Notifications, Pagination, Prompt, Search, Select, Autocomplete, Checklist, Upload, Form, Grid, GridArray, GridDB, MarkdownReader, Repeat, Auth, LayoutBuilder |
| Providers | `/providers`, `/providers/data`, `/providers/storage`, `/providers/auth`, `/providers/email`, `/providers/integrations` |
| Examples | `/examples/ai` |

---

## Remaining legacy dependencies

| File | State |
|------|-------|
| `src/components/Component.tsx` | Contains `todo` comments and legacy model/template patterns. |
| `src/components/Template.tsx` | Legacy template pattern still present. |
| `src/components/ui/fields/Command.tsx` | Legacy prototype with `contentEditable` and `document.execCommand`; to be removed or replaced in CR-025. |
| `src/pages/Helper.tsx` | Historical helper page with Bootstrap ScrollSpy references; not part of the modern App/theme flow. |
| `src/libs/database.ts` / `src/libs/storage.ts` | Re-export/backward compatibility towards Firebase providers. Not the recommended path for new consumers. |

---

## Verification performed

Real verification performed on 2026-05-27:

| Command | Result |
|---------|--------|
| `npx vitest run --reporter=dot` | Passes: 25 files, 188 tests. |
| `npm run build` | Passes: Vite library build + declarations. |
| `cd clients/showcase && npm run build` | Passes: Vite production build. |
| `Get-Content package.json` | Verified current version `0.1.1`. |
| Targeted audit of `src/`, `clients/showcase/` and `docs/` | Confirmed motion layer, provider manifest, Vite showcase, remaining stubs and Supabase partial state. |

---

## Target versions

| Version | Real state |
|---------|-----------|
| 0.1.1 | Current version in `package.json` and verified build. |
| 2.0.0-alpha | Useful roadmap label to indicate the already-advanced architectural transition (provider abstraction, manifest, theme/motion registries), but not a published version in this codebase. |
| 2.0.0-rc | Not yet ready: showcase still has stubs, E2E/CI absent, Supabase partial. |
| 2.0.0 | Conceptual target: aligned operational docs, integration/E2E tests, showcase without critical stubs, main providers complete. |
