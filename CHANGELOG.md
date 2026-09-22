# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `README.md`: CI status badge for the `ci.yml` workflow on `main` and npm
  version badge for `@llmnative/react`, both linked to their respective
  Actions and npm pages. Documentation-only change (GH issue #38).
- `README.md`: Apache-2.0 license badge linked to the repo `LICENSE` file,
  displayed alongside the existing CI and npm badges. Documentation-only change
  (GH issue #41).

## [1.15.5] - 2026-09-23

### Fixed
- `UploadImage`/`UploadDocument`: an external reset of the field's Form value
  (a draft Restore/Discard, or any other `setRecord` not caused by the field
  itself) never reached the rendered thumbnails. `files` was seeded from
  `value` once at mount and never re-synced — the Form's own record was
  correctly restored, but the field kept showing whatever it had before the
  reset, indefinitely. This is the actual root cause behind "I uploaded an
  image, waited for it to finish, left the page, came back, clicked Restore,
  and the image is gone" even with 1.15.3/1.15.4 in place — the record itself
  was right, the field's own displayed state just never picked it up.

## [1.15.4] - 2026-09-22

### Fixed
- `UploadImage`: once a file finished uploading to a real `StorageProvider`
  (`uploadPath` set), the FileProps entry kept its base64 payload forever
  alongside the real `url` — `updateFile()` never cleared it. Every record
  with an uploaded image stayed as heavy as an unsent one, which is exactly
  what routinely exceeds the Form draft-autosave's localStorage quota (see
  1.15.3) even for a successfully persisted upload. `base64` is now cleared
  the moment a real remote URL lands, in both the plain-upload and the
  `srcsetWidths` variants path — a data:/blob: URL fallback (no storage
  configured, or the upload call resolved falsy) still keeps its base64,
  since that's the only persisted form `getFileUrl()` has to fall back to.

## [1.15.3] - 2026-09-22

### Fixed
- `Form`: the local draft autosave (`localStorage.setItem`) had no error
  handling. A record with an unsent base64 file upload (a field with no
  `StorageProvider`/`uploadPath` wired) can easily exceed the ~5-10MB
  localStorage budget on its own — the write then threw uncaught, silently
  stopping the draft from updating. `localStorage` kept the last write that
  DID fit, so a later "Restore" brought back the state from before the
  oversized change, not a partial one. Now caught and surfaced via the
  existing notice banner (new `dict.draftSaveError`, English-only for now,
  same as the other `draft*` keys); the unmount flush swallows the same
  error silently (no UI left to notify during teardown).

## [1.15.2] - 2026-09-22

### Fixed
- `UploadImage`/`UploadDocument`: the icon-only buttons (remove, crop/edit
  pencil, "upload more") never had an explicit `cursor-pointer` — Tailwind v4
  preflight, unlike Bootstrap/Normalize, no longer defaults `<button>` to a
  pointer cursor, so they rendered with the browser's default arrow cursor.
  Minor fix, no CR — no behavior change.

## [1.15.0] - 2026-09-22

### Added
- `UploadImage`/`FileProps`: new optional `alt?: string` field (CR-083),
  editable from the existing crop editor (pencil icon on hover, when
  `editable`) — a new textarea alongside the file name. Deliberately
  independent of `srcset`/`variants`: those are responsive width variants of
  the same image, `alt` is one description per file entry regardless of how
  many width variants exist. New `crop.altText`/`crop.altTextPlaceholder`
  i18n keys in all 6 framework languages. Purely additive — no change to
  existing `UploadImage`/`FileProps` behavior when `alt` is unused.

## [1.14.0] - 2026-09-21

### Added
- `CodeEditor`: new optional `validate` prop — overrides the built-in
  `language`-based syntax check used by `validateSyntax` for a field whose
  content embeds a foreign template syntax inside `language` (e.g. Liquid
  tags inside a `'css'` block: `.x { color: {{ tone | default: "#000" }}; }`,
  where the stock single-language CSS parser has no notion of Liquid and
  false-positives on the `|` filter pipe). Receives the current raw value and
  must return the same shape as the already-exported `getCodeValidationResult`.
  Purely additive: omitting it keeps the exact previous `language`-only check
  unchanged (now routed through `getCodeValidationResult` internally instead
  of a local try/catch around `validateCodeSyntax`, same observable behavior).

## [1.13.0] - 2026-09-16

### Added
- `Repeat`: new theme section (`theme.Repeat`) with `itemClassName` (applies to
  every item shell), `inlineItemClassName` (applies only when
  `layout="inline"`, merged after `itemClassName` so it wins on conflicting
  utilities — lets a consumer flatten the compact inline variant, e.g. inside
  an already-bordered popover, while keeping the carded look for
  `horizontal`/`vertical` repeats) and `addButtonClassName` (the "Add" button
  shown when `label` + `labelPosition="bottom"` are set). Purely additive:
  every field defaults to `''` in the built-in themes (`default`/`flat`/
  `cyber`), so omitting a `themeOverride.Repeat` entry keeps prior behavior
  unchanged.

## [1.12.0] - 2026-09-10

### Added
- `Gallery`: new optional `renderItem` prop — fully replaces an item's default
  content (the mandatory `<img>` + `overlays`) with custom markup, for a card
  with no image at all (icon/text/badges). Selection checkbox, click-handling
  (bubbling to `onRowClick`, same bail-out on interactive descendants as the
  default image) and grid item sizing stay owned by `Gallery`. Purely additive
  and backward compatible: omitting it leaves every existing `img`/`thumbnail`/
  `overlays` consumer unaffected.
- `Grid`/`GridCore`: `views.gallery.renderItem` threads the same capability
  through `GridGalleryView` — when set, it takes over the card entirely
  (`fields`/`overlays` are not computed/merged, since there is no default image
  left for them to sit on).
- (CR-082)

## [1.11.1] - 2026-09-10

### Fixed
- `ActionButton`: the disabled-only wrapper switched `display` to
  `inline-flex`, which establishes its own formatting context and shrinks
  to fit content — a button with `className="w-full"` (or
  `wrapperClassName`) correctly stretched to its container while enabled,
  then visibly shrank the instant it became disabled (e.g. during an async
  submit). Dropped the display override (keeping only the disabled
  cursor), matching the enabled case's default inline layout.

## [1.11.0] - 2026-09-08

### Added
- `SideNav`: new optional controlled-collapse props `collapsed`/
  `onCollapsedChange`, standard controlled/uncontrolled component pattern.
  Omitting both keeps the previous behavior unchanged (internal state
  driven by `defaultCollapsed` and the footer toggle button). Passing them
  lets a consumer decide the collapsed state itself — e.g. auto-collapsing
  to icon-only once its own layout detects the content area has gotten too
  narrow (a sibling panel opened, a responsive breakpoint reached) — since
  `SideNav` has no notion of viewport/layout on its own by design (a
  reusable block can't assume what surrounds it). The footer toggle button
  still works when controlled: it calls `onCollapsedChange` instead of
  flipping internal state, so the consumer stays the single source of
  truth.

## [1.10.3] - 2026-09-08

### Added
- `Chatbot`: new optional `modelPlaceholder` prop — text shown on the
  model-selector trigger when no model is selected, instead of the
  generic `dict.defaultOption` ("Default") shared with the role/language/
  voice/style selectors. A consumer that deliberately never auto-selects
  a model (no implicit `defaultModel` fallback — the user must choose
  explicitly) can now show something clearer, e.g. "Choose a model…",
  without changing the shared "Default" label used everywhere else.

## [1.10.2] - 2026-09-08

### Fixed
- `getAIModelCatalog`: isolates each provider's `getCapabilities()` call in
  its own try/catch instead of a single unguarded `Promise.all`. Before,
  one provider rejecting (an unexpected, unprotected exception — normal
  discovery failures were already caught inside `RuntimeAIProvider`) made
  the *entire* catalog reject, and the consumer's `.catch` silently reset
  every provider's models to empty — including healthy, fully-configured
  ones — with no error logged anywhere. A broken provider now degrades to
  an empty model list for itself only (with a `console.warn` naming it),
  never hiding another provider's models.

## [1.10.1] - 2026-09-07

### Fixed
- `Prompt` (RUN mode): no longer falls back to the provider's hardcoded
  `defaultModel` when no model is explicitly selected. Previously, a
  `localStorage['prompt.model']` value from a model that's no longer in
  the live catalog (or no stored value at all) silently resolved to
  `ai.defaultModel` — a value hand-written in the provider's own file,
  which goes stale every time the provider's actually-available models
  change upstream (far more often than the code gets updated). Now: the
  stored model is validated against the live catalog on every render: if
  it's missing or no longer listed, the selection stays empty and Run
  stays disabled until the user picks a model that's genuinely available
  today — same principle already applied to Agentico's own model catalog
  and composer in the `llmnative-cms` consumer.

## [1.10.0] - 2026-09-07

### Added
- `useFormContext`: new optional `subscribeToFullRecord` parameter (default
  `false`, backward compatible). `Form`'s record now lives in an external
  store (`useSyncExternalStore`, same pattern already used by
  `form-controller.ts`) instead of a plain `useState` propagated through a
  flat React Context — by default, a field consumer now re-renders only
  when its own path changes, not on every keystroke anywhere else in the
  form. Consumers that genuinely need to react to any other field
  (cross-field reads) opt in explicitly with `subscribeToFullRecord: true`
  — migrated `Prompt.tsx` (its live `{{variable}}` interpolation reads
  arbitrary sibling fields by name). A consumer subscribed to a parent
  (non-leaf) path still reacts to any change in a descendant field with no
  opt-in needed, since `applyChangeToRecord` clones every container along
  the edited path up to the root. (CR-081)

### Fixed
- `CodeEditor`: `onUpdate` is no longer a dependency of the CodeMirror
  mount effect (which creates/destroys the whole `EditorView`) — it's now
  read from a ref updated on every render instead. `onUpdate` depended on
  `handleChange`, which changes identity whenever the surrounding `Form`
  re-runs its own validation (e.g. after every save, via `setErrors({})`
  always producing a new object) — even for a field that isn't `required`
  and wasn't touched by the save. The editor was destroying and
  re-creating its `EditorView` on every save, which looked like the whole
  code box flashing empty and reappearing with the same content.

## [1.9.0] - 2026-09-04

### Added
- `Component.input`: added `richtext`, `range`, `url` — the three field
  components the framework already exported (`RichText`, `Range`, `Url`)
  but that were missing from the type→component dispatch table (CR-080,
  follow-up to CR-049). Closes the gap that kept a consumer from using
  `Component.input` as the single source of truth for dynamic field
  rendering.

## [1.8.4] - 2026-09-02

### Fixed
- `AIProviderDefinition` for `opencode`: `discoverModels` filtered the live `/zen/v1/models` response through a check (`entry.endpoint`/`entry.ai_sdk_package`) the endpoint's real response never actually carries — every entry there is just `{id, object, created, owned_by}`. The filter matched nothing, so discovery always returned an empty array and every caller silently fell back to the static `OPENCODE_FALLBACK_MODELS` list (11 models) instead of the full, current catalog (60+ models) OpenCode Zen actually serves. Removed the filter — Zen already normalizes every listed model to the same OpenAI-compatible chat-completions endpoint (`OPENCODE_CHAT_URL`), so there was no real per-model compatibility check to make.
- `ContextMenu.Heading`: made sticky (`sticky top-0`) within its menu's own scrollable list, so a group's heading stays visible while its items scroll past instead of scrolling away with them (affects any grouped `ContextMenu`, e.g. `CodeEditor`'s variable-insertion picker). Moved the menu's `p-1` padding from the scrolling container itself onto an inner wrapper — sticky's `top: 0` resolves against the scrolling ancestor's padding edge, so padding directly on that ancestor left a gap items could still scroll through, in front of the "stuck" heading, before disappearing.

## [1.8.3] - 2026-08-26

### Fixed
- `Grid`'s search match count now reads `X / total unfiltered records` instead of `X / records after filters` — with an active `Grid.filters` chip and no search term, the count previously always read as e.g. `120 / 120` (numerator always equal to denominator), which is meaningless. It now stays a stable "showing X of Y total" summary regardless of filters. (CR-079)
- `Table` column headers no longer wrap onto multiple lines (`whitespace-nowrap`) — a header like "Shipped at" broke into two lines given a narrow column, mis-aligning the sort icon from the label.

### Changed
- Reordered the elements next to `Grid`'s search box: the match count now trails after the active-filter chips instead of sitting between the "Filters" button and its own chips, which read as if the count belonged to the button rather than to the result set. New order: search + Filters icon → active chips → count. (CR-079)

## [1.8.1] - 2026-08-26

### Changed
- The "Filters" trigger in `Grid`'s default header is now icon-only and sits directly next to the search input (instead of a separately labeled button positioned after it). Active-filter chips are now built from real `Badge` + `ActionButton` components instead of hand-rolled `<span>`/`<button>` markup, so the remove control gets proper cursor/focus/disabled styling for free. The filters panel is wider (`size="md"`, was `"sm"`) and the two inputs of a `dateRange`/`numberRange` filter now stack vertically instead of sitting side by side, so the panel never needs a horizontal scrollbar. (CR-079)

## [1.8.0] - 2026-08-26

### Added
- `Grid.filters` now supports `kind: 'select' | 'multiselect' | 'dateRange' | 'numberRange'` alongside the original `'toggle'` (default when `kind` is omitted, fully backward-compatible with the 1.7.x shape). Filters are opened from a new "Filters" button in Grid's own default header (badge shows the active-filter count) and rendered in a side panel (`Modal position="right"`, no `Form` dependency) — a checkbox switch, native `<select>`, checkbox list, date-range pair, or number-range pair depending on `kind`. Each active filter shows as a removable chip on the header row, next to search. New public exports: `GridFilterOption`, `GridFilterToggleConfig`, `GridFilterSelectConfig`, `GridFilterMultiSelectConfig`, `GridFilterDateRangeConfig`, `GridFilterNumberRangeConfig`. (CR-079)

## [1.7.1] - 2026-08-26

### Changed
- `Grid.filters` checkboxes now render with the same toggle-switch visual as the `Switch` field, instead of a plain square checkbox — hand-rolled markup, not the `Switch` component itself, since `Switch` is a Form field and the default header has no `Form` around it. (CR-078)

### Docs
- Showcase (`clients/showcase`): `GridPage.tsx` now has a live example for `filters` (mirroring the existing `searchable` example) and a `readOnly` entry in the playground props list (the `predicate` function can't be represented in the playground's JSON editor, same treatment as `onSave`/`onDelete`/`form`); i18n updated across all 6 languages. (CR-078)

## [1.7.0] - 2026-08-26

### Added
- `Grid.filters` — toggle checkboxes rendered in `Grid`'s own default header, next to `searchable`. Each filter is `{ key, label, defaultValue?, predicate(record, value) }`; applied BEFORE the search term (filters → search → sort → pagination/selection all see the filtered set). Only wired into the default header — a fully custom `header` prop bypasses it. New public export `GridFilterConfig<TRecord>`. (CR-078)

## [1.6.1] - 2026-08-25

### Fixed
- `UploadImage`'s `allowUrl` icon button was missing `cursor-pointer` (Tailwind v4 resets `<button>` to `cursor: default`), so hovering it showed the regular arrow cursor instead of a pointer despite being clickable. (CR-077)

## [1.6.0] - 2026-08-25

### Added
- `UploadImage.allowUrl` — shows a link icon on the drop zone that opens a dialog for pasting an image URL instead of uploading a file. The confirmed URL is stored as a file entry (`progress: 100`, no upload) using the same `FileProps` shape and preview as a real upload — indistinguishable to the Form field either way. Inline URL validation. (CR-077)

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
