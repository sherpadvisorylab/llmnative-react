# Changelog

Tutte le modifiche rilevanti al progetto sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/).
Versioning basato su [Semantic Versioning](https://semver.org/lang/it/).

---

## [Unreleased]

> Modifiche in corso sul branch `modernize`. Non ancora rilasciate su `main`.

### In Progress
- Nessuna modifica attiva al momento.

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
