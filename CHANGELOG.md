# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
