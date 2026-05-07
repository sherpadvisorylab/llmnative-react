# Changelog

Tutte le modifiche rilevanti al progetto sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/).
Versioning basato su [Semantic Versioning](https://semver.org/lang/it/).

---

## [Unreleased]

> Modifiche in corso sul branch `modernize`. Non ancora rilasciate su `main`.

### Added
- Build libreria Vite in library mode con output ESM/CJS: `dist/index.mjs` e `dist/index.js`.
- CSS bundle mantenuto come `dist/index.css`.
- CLI scaffold Vite-first con provider selection (`firebase`, `supabase`, `mock`, `custom`).
- Comando non interattivo `npx react-firestrap create --yes --provider=mock`.
- Docs provider pattern aggiornate dopo CR-002.
- Esempio `docs/examples/custom-provider.md` per implementare un DataProvider custom.
- Pagina showcase Upload con demo image, document e CSV.
- Demo showcase Select autocomplete e DataProvider-backed con MockDataProvider.
- Confronto provider side-by-side nella showcase.
- Pagina docs Quick start nello showcase.
- MarkdownReader pubblico basato su `react-markdown`/remark/rehype, con GFM, heading anchor, code copy e link interni intercettabili.
- Pagina showcase MarkdownReader.
- Loader Markdown showcase con frontmatter, route docs generate e link wiki-style interni.
- Convenzioni docs Markdown in `docs/README.md`.

### Changed
- `npm run build` usa Vite + TypeScript declarations.
- Webpack resta disponibile come `npm run build:webpack` per confronto temporaneo.
- `Select`, `Autocomplete` e `Checklist` leggono le opzioni `db` dal DataProvider registrato e accettano sia `db.srcPath` sia `db.path`.
- Sidebar docs dello showcase riallineata a pattern standard: Introduction, Installation, Quick start, Create an app, App configuration, Routing & menu.
- Pagine testuali Docs dello showcase migrate da TSX/stub a Markdown in `docs/`.
- `clients/showcase` usa Vite con `src/index.tsx`, `src/conf/menu.ts` e `vite.config.mts`; Webpack è stato rimosso dal client.

---

## [1.x.x] — Stato attuale (2026-05-04)

### Presente
- Framework React + Firebase Realtime Database + Bootstrap
- Sistema form con gestione stato contestuale (dot notation, nested objects)
- Grid con real-time updates via Firebase listener
- Integrazione AI multi-provider (OpenAI, Gemini, Anthropic, DeepSeek, Mistral)
- Sistema tema via React Context con deep merge
- Upload file con Firebase Storage
- Google OAuth 2.0
- CLI scaffolding (`npx react-firestrap create`)
- Multi-tenancy via localStorage
- Componenti: Input, Select, Upload, Prompt, AssistantAI, UploadCSV
- Widgets: Form, Grid, ImageEditor
- Blocks: Menu, Brand, Breadcrumbs, Notifications, Search, Carousel

### Problemi noti
- Firebase Realtime DB hardcoded in Form.tsx e Grid.tsx (nessun abstraction layer)
- Bootstrap come unico sistema UI (nessun supporto Tailwind/shadcn)
- `RecordProps` tipizzato come `any` (nessun TypeScript strict)
- Nessuna documentazione AI-first
- Cartella `integrations/` e `models/` con naming incoerente rispetto alla struttura target
