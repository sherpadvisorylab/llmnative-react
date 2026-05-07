# Status del progetto

> Snapshot dello stato attuale vs target. Aggiornare ad ogni CR completata.
> Ultima revisione: 2026-05-07

---

## Stato generale

| Area | Stato attuale | Target | CR |
|------|---------------|--------|----|
| Database layer | DataProvider interface con FirebaseDataProvider, MockDataProvider e SupabaseDataProvider parziale | Provider registry stabile + integrazioni testate | CR-002 |
| Storage layer | StorageProvider interface con Firebase/Supabase/Dropbox adapters | Provider registry stabile + test integrazione | CR-002 |
| Auth/Email layer | AuthProvider ed EmailProvider con registry e implementazioni Google/Gmail | Provider alternativi documentati/testati | CR-002b |
| UI library | Tailwind v4 genera il CSS runtime tramite Bootstrap compatibility layer | shadcn/ui/Tailwind pienamente verificati visivamente | CR-004 |
| TypeScript | `strict: true`, build tipi pulita | Generics e API pubbliche ulteriormente raffinate | CR-003 / CR-014 |
| Documentazione AI | `CLAUDE.md` + docs wiki presenti | Docs mantenute in pari con ogni CR | CR-001 |
| Struttura cartelle | Logica in `providers/` e `types/`, stub legacy in `integrations/` e `models/` | Stub legacy rimossi solo in major successiva | CR-002 |
| Test | Vitest configurato, unit/provider/component test passano | Integration Firebase/Supabase, E2E Playwright e CI | CR-006 |
| CLI scaffolding | Vite-first con scelta provider, tema e icone | Rifiniture CLI residue tracciate nelle CR successive | CR-015 |
| Showcase app | `clients/showcase` Vite scaffold-first con App/menu/layout, Select/Upload/Form/Grid e provider comparison reali | Catalogo completo, corner case, deploy pubblico | CR-007 / CR-012 / CR-016 |

---

## Change request completate

| CR | Stato | Nota |
|----|-------|------|
| CR-001 | Done | Documentazione AI-first creata. |
| CR-002 | Done | Provider abstraction layer per data/storage e registry base. |
| CR-002b | Done | AuthProvider ed EmailProvider con context/registry. |
| CR-003 | Done | TypeScript strict e build tipi pulita. |
| CR-004 | Done | Tailwind runtime/CSS compatibility layer, CSS import docs e dark mode verificati. |
| CR-005 | Done | Assorbita da CR-015: CLI/scaffold Vite-first con scelta provider. |
| CR-013 | Done | Icon provider system assorbito/completato con CR-017 e ThemePanel showcase. |
| CR-015 | Done | Build libreria e scaffolding Vite-first. |
| CR-016 | Done | Showcase riallineato allo scaffold Vite. |
| CR-017 | Done | Theme e icon registries gestiti da `<App>`. |
| CR-018 | Done | Componente pubblico `MarkdownReader` basato su librerie mature per rendering Markdown. |
| CR-019 | Done | Showcase docs alimentate da Markdown wiki-style in `docs/`, con sidebar generata da frontmatter. |

---

## Change request aperte

| CR | Stato | Cosa manca |
|----|-------|------------|
| CR-006 | In progress | Integration test Firebase/Supabase, test Upload/Prompt/Repeat, Playwright E2E, CI. |
| CR-007 | In progress | Restano deploy, link docs, route example/provider ancora stub e corner case finali. |
| CR-008..CR-011 | Todo | Migrazione dei temi `empty`, `default`, `flat`, `cyber` a Tailwind/shadcn. |
| CR-012 | Todo | Refactor showcase per eliminare residui di pagine stub e usare solo pattern/componenti react-firestrap. |
| CR-014 | Todo | Audit API componenti emerso dalla showcase. |

---

## Struttura attuale

```
src/
  App.tsx                  # entry point: routing, config, provider registries, theme/icon registries
  Config.tsx               # Firebase, OAuth, AI, Dropbox config
  Global.tsx               # stato globale localStorage-backed
  Theme.tsx                # ThemeProvider, preset registry, useTheme/useThemeController
  components/
    ui/                    # primitivi presentazionali
    ui/fields/             # Input, Select, Upload, Prompt, AssistantAI, UploadCSV
    blocks/                # Brand, Menu, Breadcrumbs, Notifications, Search, Carousel, Dropdown
    widgets/               # Form, Grid, ImageEditor
  providers/
    data/                  # DataProvider, FirebaseDataProvider, MockDataProvider, SupabaseDataProvider
    storage/               # StorageProvider, Firebase/Supabase/Dropbox adapters
    auth/                  # AuthProvider + GoogleAuthProvider
    email/                 # EmailProvider + GmailEmailProvider
    icon/                  # Lucide/Phosphor icon providers
    ai/                    # AI multi-provider
    seo/                   # Google keyword/trend helpers
    scrape/                # SerpAPI scraping
    firebase-init.ts
  integrations/            # backward-compatible re-export stubs
  types/                   # TypeScript types e interfaces
  models/                  # backward-compatible re-export stubs
  libs/                    # utilities pure
  conf/                    # configurazioni statiche

clients/showcase/
  src/index.tsx            # consumer Vite reale basato su <App>
  src/conf/menu.ts         # menu unico dello showcase
  src/layouts/             # ShowcaseLayout
  src/pages/               # docs, componenti, provider, esempi
```

---

## Dipendenze legacy residue

CR-002 ha rimosso il coupling diretto da `Form` e `Grid`, che ora usano `useDataProvider()`.
Rimangono alcuni import backward-compatible da `libs/database` in componenti storici:

| File | Import | Nota |
|------|--------|------|
| `src/components/Component.tsx` | `libs/database` | Schema/template legacy. Da valutare in CR-014. |
| `src/components/Template.tsx` | `libs/database` | Template generati da database. Da valutare in CR-014. |
| `src/components/ui/fields/Select.tsx` | `libs/database` | Select `db` legacy; candidato a `useDataProvider()` in CR-014. |

---

## Verifica corrente

Ultima verifica manuale eseguita il 2026-05-07:

| Comando | Esito |
|---------|-------|
| `npm run test` | Passa: 11 file, 103 test. |
| `npm run build` | Passa: Vite library build + declarations. |
| `cd clients/showcase && npm run build` | Passa: Vite production build. |

---

## Versioni target

| Versione | Stato | Descrizione |
|----------|-------|-------------|
| 1.5.8 | current package | Modernizzazione in corso sul branch `modernize`. |
| 2.0.0-alpha | raggiunta internamente | Provider abstraction + TypeScript strict. |
| 2.0.0-rc | in progress | Tailwind/shadcn compatibility + test visivo. |
| 2.0.0 | target | Docs, tests e showcase completi. |
| 2.1.0 | target | CLI rifinita e documentata. |
| 2.2.0 | target | Showcase pubblica completa. |
