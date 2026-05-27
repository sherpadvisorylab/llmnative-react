# Changelog

Tutte le modifiche rilevanti al progetto sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/).
Versioning basato su [Semantic Versioning](https://semver.org/lang/it/).

---

## [Unreleased]

> Snapshot riallineato al branch `modernize` verificato il 2026-05-27.

### Added
- Driver manifest e service registry tipizzato in `src/providers/manifest.ts`, con driver espliciti come `dbRealtime`, `firestorage`, `googleAuth`, `dropboxAuth` e `gmail`.
- `AuthButton` provider-agnostic e `DropboxAuthProvider`, con integrazione nel manifest auth.
- Provider configuration state condiviso (`getConfigurationState()` / `isConfigured()`) per auth, data, storage ed email provider.
- Motion system theme-driven con supporto `prefers-reduced-motion`, hook pubblici (`useMotionEffect`, `useMotionState`, `usePressMotion`, `useEnterMotion`) e documentazione dedicata in `docs/architecture/motion.md`.
- Temi self-contained in `themes/default.ts`, `themes/flat.ts` e `themes/cyber.ts`, con export `preset`, `motion` e `components`.
- Showcase Vite reale con nuove pagine componenti e playground per Auth, Notifications, Buttons, GridArray, GridDB, Prompt, Autocomplete, Checklist, Image, ImageAvatar e LayoutBuilder.
- Copertura test ampliata fino a 25 file / 188 test, includendo motion, provider configuration, Table, Modal, Dropdown, Gallery e Buttons.

### Changed
- `npm run build` usa stabilmente Vite library mode + TypeScript declarations.
- `clients/showcase` e' un consumer Vite reale del package e non fa piu' parte di una toolchain Webpack attiva.
- Le docs operative sono state riallineate alla codebase reale: stato verificato, versione corrente `0.1.1`, gap Supabase e stub showcase residui.
- Il tema runtime ora centralizza anche i motion preset e le reference component-level.

### Fixed
- Rimosse dalle note di rilascio le indicazioni stale che descrivevano la versione corrente come `1.5.8`.
- Rimossi dal changelog i riferimenti a uno script `build:webpack` non piu' presente nel `package.json`.

---

## [0.1.1]

### Present today
- Framework React/Vite con provider abstraction per data, storage, auth ed email.
- `RuntimeProvider`, theme registry, icon registry e head management client-side montati da `<App>`.
- Tailwind v4 runtime con compatibility layer CSS e bundle pubblico `dist/index.css`.
- `MarkdownReader` pubblico con pipeline `react-markdown` + remark/rehype.
- CLI scaffolding Vite-first con scelta separata di provider, theme e template.
- Showcase locale in `clients/showcase/` che consuma il package tramite `file:../../`.

### Known gaps
- `SupabaseDataProvider` e `SupabaseStorageProvider` sono ancora implementazioni parziali basate su `fetch`.
- Mancano `FirebaseAuthProvider`, `FirestoreDataProvider` e `SupabaseAuthProvider`.
- Mancano integration test Firebase/Supabase, smoke E2E Playwright e CI.
- Alcune route showcase per provider concreti ed esempi applicativi restano stub.
