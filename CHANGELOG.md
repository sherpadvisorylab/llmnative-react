# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

> Snapshot realigned to the `modernize` branch, verified 2026-05-27.

### Added
- Driver manifest and typed service registry in `src/providers/manifest.ts`, with explicit drivers such as `dbRealtime`, `firestorage`, `googleAuth`, `dropboxAuth` and `gmail`.
- Provider-agnostic `AuthButton` and `DropboxAuthProvider`, integrated into the auth manifest.
- Shared provider configuration state (`getConfigurationState()` / `isConfigured()`) for auth, data, storage and email providers.
- Theme-driven motion system with `prefers-reduced-motion` support, public hooks (`useMotionEffect`, `useMotionState`, `usePressMotion`, `useEnterMotion`) and dedicated documentation in `docs/architecture/motion.md`.
- Self-contained themes in `themes/default.ts`, `themes/flat.ts` and `themes/cyber.ts`, exporting `preset`, `motion` and `components`.
- Real Vite showcase with new component pages and playgrounds for Auth, Motion, Notifications, Buttons, GridArray, GridDB, Prompt, Autocomplete, Checklist, Image, ImageAvatar and LayoutBuilder.
- Expanded test coverage to 25 files / 188 tests, including motion, provider configuration, Table, Modal, Dropdown, Gallery and Buttons.

### Changed
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
