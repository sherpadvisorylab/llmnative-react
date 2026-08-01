# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [1.5.0] - 2026-08-02

### Added
- `Grid.searchable` — built-in search box in `Grid`'s own default header. `true` searches every string-valued field on each record; pass a `GridSearchConfig` (`{ fields?, placeholder? }`) to restrict which fields match or customize the placeholder. Filters the records actually rendered (sort/pagination/selection all see the filtered set). Only wired into the default header — a fully custom `header` prop bypasses it. New public export `GridSearchConfig<TRecord>`. (CR-075)
- `Grid.cardClassName` / `Grid.bodyClassName` — control the `Card` root box and body div that `Grid` always renders inside, distinct from the existing `wrapperClassName` (the element around the Card). Needed together with `views.table.heightClassName` for a full-height `Grid` to scroll internally instead of growing past its container. (CR-075)
- `Grid`'s `views.table.className` / `heightClassName` / `scrollClassName` / `headerClassName` are now actually forwarded to the underlying `Table` — previously silently dropped by `GridTableView`/`GridCore` even though `Table` itself already supported them. (CR-075)
- `AuthProvider.getIdTokenClaims(forceRefresh?: boolean)` — optional parameter (backward-compatible) to force a fresh ID token fetch, e.g. after a server-side custom-claims change. (CR-076)

### Fixed
- `Table`: removed a hardcoded `min-w-full` class that had the same CSS specificity as a consumer-supplied `className` with its own `min-w-[...]` — depending on generated-stylesheet order, it could silently cancel the intended horizontal scroll. (CR-075)
- `Table`: when `heightClassName` enables internal scrolling, the header (and footer, if present) now stay visually fixed while only the body rows scroll — `position: sticky` applied to each individual `<th>`/footer cell (not `<thead>`/`<tfoot>`, which browsers don't reliably honor for `sticky`). Automatic, no extra prop needed. (CR-075)
- `Pagination`'s `sticky` wrapper no longer renders an empty, translucent bar pinned to the bottom of every table when there's nothing to paginate — now gated on `records.length > pageLimit`, not unconditionally on the theme's `sticky: true` default. (CR-075)
- `FirestoreDataProvider.subscribe()` now reopens its data listener on `onIdTokenChanged`, not just `onAuthStateChanged` — Firestore security rules can depend on custom claims, which can change while the same user stays signed in; the listener previously kept using stale claims until the next sign-in/out. (CR-076)
- `FirebaseAuthProvider.getConfigurationState()` no longer requires a Realtime Database `databaseURL` — it was incorrectly disabling `AuthButton` for apps that only use Firestore. (CR-076)
- `AuthButton`'s avatar dropdown now closes when clicking outside it or pressing Escape; added `aria-expanded`/`aria-haspopup` to the trigger. (CR-076)

## [1.4.0] - 2026-08-01

### Added
- `Table.recordId` — optional field name or resolver function to derive a stable per-row key, checked before the `_key`/object-identity fallback in `useStableRecordKey`. New public export `RecordKeyResolver<TRecord>`. (CR-074)

### Fixed
- `GridTableView` now forwards its own `recordId` prop into the `<Table>` it renders — previously it computed a stable key for its own internal maps but never passed it down, so `Grid`'s `recordId` prop didn't protect the underlying `Table` at all. Symptom: a `Grid`/`Table` bound to a `Form` (cell inputs writing `rows.{index}.{field}`) would remount the edited row on every keystroke — since `Form.tsx`'s immutable per-field cloning gives the touched row a new object identity, and without a recognized `_key`/`recordId` the row's React key was derived from that identity — dropping focus after the first character typed. (CR-074)

## [1.3.0] - 2026-07-29

### Added
- `Chatbot` (`src/components/widgets/Chatbot.tsx`): standalone AI composer extracted from `Prompt` — textarea, slash-commands, attachments (with drag&drop), model picker, optional role/language/voice/style/temperature dropdowns, run/stop button. No dependency on `Form`, no knowledge of AI providers or template variables — returns a resolved `ChatbotSubmitPayload` to `onSubmit`. `PromptRun` now mounts `Chatbot` internally with zero breaking changes to its public props. (CR-071)
- Drag&drop file attachment on `Chatbot` — drop files anywhere on the composer to attach them, same as the paperclip picker. New i18n key `prompt.dropFilesHere` (6 languages). (CR-071)
- `AICompleteRequest.logId` — optional, stable per-conversation id forwarded as `x-llmnative-log-id` to the dev proxy. `createProxyPlugin(route, logOptions)` accepts `ProxyLogOptions` to append request/response bodies to a per-conversation log file — dev-only, opt-in, never active by default. (CR-073)
- `libs/csv.ts` — `parseCsvText(text)`, CSV/TSV parsing for text already in memory (e.g. a decoded attachment), same engine as `<UploadCSV>`. (CR-073)
- `PromptUtils.isTextAttachment(mimeType)` / `PromptUtils.decodeBase64Text(base64)`. (CR-073)

### Fixed
- `opencode` AI provider now actually sends `request.attachments` to the model — it previously built the user message ignoring attachments entirely, so files silently never reached the model. Capabilities updated to reflect real support (`supportsVision`, `supportsDocuments`). (CR-073)
- `Dropdown` closes after selecting a `DropdownItem` by default. Set `closeOnSelect={false}` for the rare menu that must remain open.
- `Pagination` now honors an explicit `sticky={false}` instead of always falling back to the theme default (`sticky || theme.Pagination.sticky` could never be overridden with `false`).

### Changed
- AI directive files moved under `docs/directives/` (`maintainers/`, `consumers/`), renamed with an `llm-rule-` prefix, and indexed in a single "Direttive" trigger table in `AGENTS.md`; tool-specific files (`CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.github/copilot-instructions.md`) now only reference that table instead of duplicating trigger text.

## [1.2.1] - 2026-07-25

### Added
- Canonical framework change-and-release workflow shared by Codex, Claude, Copilot, Cursor and Gemini.
- `release:check` preflight validating CR and GitHub Issue state, version metadata, branch synchronization, annotated tag, npm authentication and registry availability.

### Changed
- Agent-specific instruction files now reference the single maintainer workflow instead of duplicating release policy.

### Fixed
- The release preflight invokes npm through the active Node/npm CLI path, including on Windows.

## [1.2.0] - 2026-07-25

> Snapshot realigned to the `modernize` branch, verified 2026-05-27.

### Added
- Public generic `AsyncDropdown<TItem>` with debounced search, request cancellation through
  `AbortSignal`, controlled and uncontrolled modes, and native loading, empty and error states.
- Driver manifest and typed service registry in `src/providers/manifest.ts`, with explicit drivers such as `dbRealtime`, `firestorage`, `googleAuth`, `dropboxAuth` and `gmail`.
- Provider-agnostic `AuthButton` and `DropboxAuthProvider`, integrated into the auth manifest.
- Shared provider configuration state (`getConfigurationState()` / `isConfigured()`) for auth, data, storage and email providers.
- Theme-driven motion system with `prefers-reduced-motion` support, public hooks (`useMotionEffect`, `useMotionState`, `usePressMotion`, `useEnterMotion`) and dedicated documentation in `docs/architecture/motion.md`.
- Self-contained themes in `themes/default.ts`, `themes/flat.ts` and `themes/cyber.ts`, exporting `preset`, `motion` and `components`.
- Real Vite showcase with new component pages and playgrounds for Auth, Motion, Notifications, Buttons, GridArray, GridDB, Prompt, Autocomplete, Checklist, Image, ImageAvatar and LayoutBuilder.
- Expanded test coverage to 25 files / 188 tests, including motion, provider configuration, Table, Modal, Dropdown, Gallery and Buttons.

### Changed
- Runtime baseline moved to Node.js 24 LTS, React 19.2, Vite 8, Vitest 4 and the current stable
  compatible dependency set; CI, showcase, generated scaffolding and CMS consumer are aligned.
- `npm run build` now consistently uses Vite library mode + TypeScript declarations.
- `clients/showcase` is now a real Vite consumer of the package and is no longer part of an active Webpack toolchain.
- Operational documentation realigned to the actual codebase: verified state, current version `0.1.1`, remaining Supabase and showcase stub gaps documented.
- The runtime theme now also centralises motion presets and component-level references.

### Fixed
- Removed stale release notes that described the current version as `1.5.8`.
- Removed changelog references to a `build:webpack` script no longer present in `package.json`.

---

## [0.1.1]

### Present today
- React/Vite framework with provider abstraction for data, storage, auth and email.
- `RuntimeProvider`, theme registry, icon registry and client-side head management mounted by `<App>`.
- Tailwind v4 runtime with compatibility layer CSS and public bundle `dist/index.css`.
- Public `MarkdownReader` with `react-markdown` + remark/rehype pipeline.
- Vite-first CLI scaffolding with separate provider, theme and template selection.
- Local showcase in `clients/showcase/` consuming the package via `file:../../`.

### Known gaps
- `SupabaseDataProvider` and `SupabaseStorageProvider` are still partial fetch-based implementations.
- `FirebaseAuthProvider`, `FirestoreDataProvider` and `SupabaseAuthProvider` are missing.
- Firebase/Supabase integration tests, smoke E2E Playwright tests and CI are missing.
- Some showcase routes for concrete providers and application examples remain stubs.
