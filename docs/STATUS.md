# Status del progetto

> Snapshot dello stato attuale vs target. Aggiornare ad ogni CR completata.  
> Ultima revisione: 2026-05-04

---

## Stato generale

| Area | Stato attuale | Target | CR |
|------|--------------|--------|----|
| Database layer | Firebase Realtime DB hardcoded | DataProvider interface + Firebase/Supabase | CR-002 |
| Storage layer | Firebase Storage hardcoded | StorageProvider interface + Firebase/Supabase | CR-002 |
| UI library | Bootstrap 5 | shadcn/ui + Tailwind CSS | CR-004 |
| TypeScript | Quasi-any (`FieldMap`) | Strict + generics | CR-003 |
| Documentazione AI | Assente | CLAUDE.md + docs/ wiki | CR-001 |
| Struttura cartelle | `integrations/` + `models/` | `providers/` + `types/` | CR-002 |
| Test | Assenti | Unit + Integration contract + Component + E2E | CR-006 |
| CLI scaffolding | Firebase + Bootstrap fissi | Provider a scelta + Tailwind | CR-005 |
| Showcase app | Assente | `playground/` con tutte le pagine componenti + corner case | CR-007 |

---

## Struttura cartelle attuale vs target

### Attuale
```
src/
  App.tsx
  Config.tsx
  Global.tsx
  Theme.tsx                        ← Bootstrap class names
  auth.tsx
  components/
    Component.tsx
    FormEnhancer.tsx
    Template.tsx
    blocks/                        ← Brand, Menu, Breadcrumbs, Notifications, Search, Carousel, Dropdown
    ui/                            ← Alert, Badge, Buttons, Card, Code, Gallery, GridSystem, Icon,
    │                                 Image, ImageAvatar, LayoutBuilder, Loader, Modal, Pagination,
    │                                 Percentage, Repeat, Tab, TabDynamic, Table
    ui/fields/                     ← AssistantAI, Command, Crop, ImageUrl, Input, Prompt, Select,
    │                                 Upload, UploadCSV
    widgets/                       ← Form, Grid, ImageEditor
  conf/
    Prompt.ts
  integrations/                    ← ⚠️ target: da rinominare/riorganizzare in providers/
    ai.ts
    dropbox.tsx
    scrape.ts
    google/
      GoogleAuth.tsx
      auth.ts
      email.ts
      firebase.ts
      firedatabase.ts              ← ⚠️ coupling diretto con Form.tsx e Grid.tsx
      firestorage.ts               ← ⚠️ coupling diretto con Upload.tsx
      keyword.ts
      trend.ts
      apis/
  libs/
    cache.ts
    converter.ts
    database.ts                    ← ⚠️ wrapper Firebase importato direttamente dai widget
    email.ts
    fetch.ts
    locale.ts
    log.ts
    path.ts
    sanitizer.ts
    seo.ts
    storage.ts
    utils.ts
  models/                          ← ⚠️ target: rinominare in types/
    componentBlock.tsx
    componentFormFields.tsx
    componentLayout.tsx
    componentSection.tsx
  pages/
    Blog.tsx, BlogPost.tsx, Helper.tsx, NotFound.tsx, Users.tsx
```

### Target
```
src/
  App.tsx                          ← accetta dataProvider e storageProvider come prop
  Config.tsx
  Global.tsx
  Theme.tsx                        ← Tailwind class names
  auth.tsx
  components/                      ← invariato
    ...
  conf/
    Prompt.ts
  providers/                       ← NUOVA, sostituisce integrations/
    data/
      DataProvider.ts              ← interface
      DataProviderContext.tsx      ← Context + useDataProvider() hook
      firebase.ts                  ← implementazione Firebase
      supabase.ts                  ← implementazione Supabase
    storage/
      StorageProvider.ts           ← interface
      StorageProviderContext.tsx
      firebase.ts
      supabase.ts
    ai/
      index.ts                     ← attuale integrations/ai.ts
    auth/
      google/
    scrape/
      index.ts
    dropbox/
      index.ts
  libs/                            ← invariato (utilities pure)
  types/                           ← RINOMINATA da models/
  pages/
```

---

## Dipendenze problematiche attuali

Queste sono le righe di codice che bloccano la portabilità. CR-002 le risolve tutte.

| File | Import problematico | Cosa fa |
|------|-------------------|---------|
| [src/components/widgets/Form.tsx](../src/components/widgets/Form.tsx) | `import db from "../../libs/database"` | Chiama `db.read()`, `db.set()`, `db.remove()` |
| [src/components/widgets/Grid.tsx](../src/components/widgets/Grid.tsx) | `import db from "../../libs/database"` | Chiama `db.useListener()` per real-time |
| [src/components/ui/fields/Upload.tsx](../src/components/ui/fields/Upload.tsx) | Firebase Storage diretto | Upload file hardcoded su Firebase |
| [src/libs/database.ts](../src/libs/database.ts) | `import firedatabase` | Proxy diretto verso Firebase SDK |

---

## Versioni

| Versione | Data | Descrizione |
|----------|------|-------------|
| 1.x.x | attuale | Firebase + Bootstrap, nessun abstraction layer, zero test |
| 2.0.0-alpha | target | CR-002: Provider abstraction layer |
| 2.0.0-beta | target | CR-002 + CR-003: Provider + TypeScript strict |
| 2.0.0-rc | target | + CR-004: shadcn/ui + Tailwind |
| 2.0.0 | target | + CR-001 + CR-006: Docs AI-first + test completi |
| 2.1.0 | target | CR-005: CLI aggiornato |
| 2.2.0 | target | CR-007: Showcase app pubblica |

---

## Come aggiornare questo file

Quando una CR viene completata:
1. Aggiornare la tabella "Stato generale" — cambiare stato nella colonna Target
2. Aggiornare la struttura cartelle se cambia
3. Rimuovere dalla tabella "Dipendenze problematiche" le righe risolte
4. Aggiornare la tabella "Versioni" con data di completamento
5. Aggiornare `CHANGELOG.md` nella root con le modifiche effettive
