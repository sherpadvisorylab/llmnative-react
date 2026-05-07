# Roadmap

> Documento vivo. Aggiornare ad ogni cambio di priorita o completamento di fase.
> Ultima revisione: 2026-05-07
>
> Nota: per lo stato operativo aggiornato usare `docs/STATUS.md` e `docs/CHANGE_REQUESTS.md`.
> Le sezioni di fase sotto mantengono il piano originale e possono contenere checklist storiche.

---

## Visione

Rendere react-firestrap un framework React **provider-agnostic**, **AI-friendly** e **moderno** che mantiene il suo vantaggio principale: costruire interfacce data-driven complesse con il minimo codice possibile, in modo omogeneo e rapido.

**Prima:** Firebase + Bootstrap + zero astrazione  
**Dopo:** Vite-first + DataProvider pattern + provider registry + Tailwind/shadcn + documentazione AI-first

---

## Obiettivi non negoziabili

1. **Poche righe per costruire una pagina** — il vantaggio principale non deve mai degradare
2. **Codebase omogenea** — un solo modo di fare ogni cosa, sempre
3. **AI-friendly** — un AI deve poter generare codice corretto al primo tentativo con CLAUDE.md
4. **Provider-agnostic** — Firebase, Supabase, REST, Firestore devono essere intercambiabili
5. **Nessuna breaking change visibile** — l'API pubblica (Form, Grid, Input, Select...) resta identica

---

## Branch strategy

```
main
└── modernize    ← unico branch di lavoro, merge finale su main quando v2.0 è stabile
```

Tutto il refactoring avviene in sequenza su `modernize`, una CR alla volta.
Nessun sub-branch — ogni CR è tracciata dai commit e dalla checklist in CHANGE_REQUESTS.md.

### Ordine di esecuzione (sequenziale su `modernize`)

```
CR-001 docs                         done
CR-002 providers                    done
CR-002b auth/email providers        done
CR-003 typescript                   done
CR-004 tailwind                     done
CR-006 tests                        in progress
CR-007 showcase                     in progress
CR-013 icon provider                done
CR-015 vite toolchain/scaffolding   done
CR-016 showcase vite/scaffold       done
CR-017 app-managed theme/icons      done
CR-018 markdown reader              done
CR-019 markdown showcase docs       done
CR-005 cli                          done via CR-015
CR-008..CR-012, CR-014              todo
```

---

## Fase 0 — Documentazione AI-first `[ATTIVA]`

**Branch:** `modernize/docs`  
**Obiettivo:** Dare contesto immediato all'AI su come usare il framework  
**Non blocca niente:** può partire oggi in parallelo a tutto  

| Task | Stato |
|------|-------|
| Creare `CLAUDE.md` nella root | ⬜ todo |
| Creare `docs/overview.md` | ⬜ todo |
| Creare `docs/architecture.md` | ⬜ todo |
| Creare `docs/patterns.md` con i 5 pattern principali | ⬜ todo |
| Creare `docs/components.md` (API reference) | ⬜ todo |
| Creare `docs/examples/` con esempi completi | ⬜ todo |
| Creare `docs/providers.md` (dopo Fase 1) | ⬜ todo |

---

## Fase 1 — Provider abstraction layer `[PROSSIMA]`

**Branch:** `modernize/providers`  
**Dipendenze:** nessuna  
**Obiettivo:** Eliminare il coupling diretto tra componenti e Firebase

### Ristrutturazione cartelle

```
src/
  providers/                        ← NUOVA (sostituisce integrations/ per DB/Storage)
    data/
      DataProvider.ts               ← interface
      firebase.ts                   ← implementazione attuale firedatabase.ts
      supabase.ts                   ← nuova
    storage/
      StorageProvider.ts            ← interface
      firebase.ts                   ← implementazione attuale firestorage.ts
      supabase.ts                   ← nuova
    ai/
      index.ts                      ← attuale integrations/ai.ts (rimane concreto)
    auth/
      google/                       ← attuale integrations/google/GoogleAuth.tsx
    scrape/                         ← attuale integrations/scrape.ts
    dropbox/                        ← attuale integrations/dropbox.tsx
  types/                            ← RINOMINATA da models/
```

### Interface DataProvider

```typescript
interface DataProvider {
  read(path: string): Promise<Record<string, any> | null>
  set(path: string, data: object): Promise<void>
  remove(path: string): Promise<void>
  list(path: string, options?: QueryOptions): Promise<RecordArray>
  useListener(path: string, callback: (data: RecordArray) => void): void
  count(path: string): Promise<number>
}

interface StorageProvider {
  upload(path: string, file: File, onProgress?: (pct: number) => void): Promise<string>
  download(path: string): Promise<string>
  remove(path: string): Promise<void>
}
```

### Iniezione via Context

```tsx
// App.tsx
<App
  dataProvider={new FirebaseDataProvider(config)}
  storageProvider={new FirebaseStorageProvider(config)}
  ...
/>

// Dentro Form.tsx, Grid.tsx
const db = useDataProvider()   // invece di import db from "../../libs/database"
```

| Task | Stato |
|------|-------|
| Creare `DataProvider.ts` interface | ⬜ todo |
| Creare `StorageProvider.ts` interface | ⬜ todo |
| Creare `DataProviderContext` e `useDataProvider()` hook | ⬜ todo |
| Migrare `firedatabase.ts` → `providers/data/firebase.ts` | ⬜ todo |
| Migrare `firestorage.ts` → `providers/storage/firebase.ts` | ⬜ todo |
| Scrivere `providers/data/supabase.ts` | ⬜ todo |
| Scrivere `providers/storage/supabase.ts` | ⬜ todo |
| Aggiornare `Form.tsx` — rimuovere import `db` diretto | ⬜ todo |
| Aggiornare `Grid.tsx` — rimuovere import `db` diretto | ⬜ todo |
| Aggiornare `App.tsx` — iniettare provider via Context | ⬜ todo |
| Rinominare `integrations/` → `providers/` (parti non-DB) | ⬜ todo |
| Rinominare `models/` → `types/` | ⬜ todo |
| Aggiornare tutti gli import nel progetto | ⬜ todo |
| Test manuale: Form con Firebase provider | ⬜ todo |
| Test manuale: Grid con Firebase provider | ⬜ todo |

---

## Fase 2 — TypeScript strict `[PARALLELA A FASE 1]`

**Branch:** `modernize/typescript`  
**Dipendenze:** nessuna (può partire subito)  
**Obiettivo:** Eliminare i `any` impliciti, rendere i tipi utili all'AI

| Task | Stato |
|------|-------|
| Abilitare `strict: true` in `tsconfig.json` | ⬜ todo |
| Sostituire `RecordProps = FieldMap` (any) con generics | ⬜ todo |
| Tipizzare `QueryOptions` (where, order, limit) | ⬜ todo |
| Tipizzare `ColumnFormatter` in Grid | ⬜ todo |
| Tipizzare `FormRef` e handlers | ⬜ todo |
| Risolvere tutti gli errori TypeScript risultanti | ⬜ todo |

---

## Fase 3 — shadcn/ui + Tailwind `[DOPO FASE 1]`

**Branch:** `modernize/tailwind`  
**Dipendenze:** Fase 1 completa  
**Obiettivo:** Rimpiazzare Bootstrap con stack UI moderno

| Task | Stato |
|------|-------|
| Installare Tailwind CSS | ⬜ todo |
| Installare shadcn/ui + configurare | ⬜ todo |
| Riscrivere `Theme.tsx` — classi Tailwind al posto di Bootstrap | ⬜ todo |
| Migrare `Button` / `LoadingButton` → shadcn Button | ⬜ todo |
| Migrare `Input` → shadcn Input | ⬜ todo |
| Migrare `Select` → shadcn Select | ⬜ todo |
| Migrare `Modal` → shadcn Dialog | ⬜ todo |
| Migrare `Card` → shadcn Card | ⬜ todo |
| Migrare `Badge` → shadcn Badge | ⬜ todo |
| Migrare `Alert` → shadcn Alert | ⬜ todo |
| Migrare `Table` → shadcn Table | ⬜ todo |
| Migrare `Tabs` → shadcn Tabs | ⬜ todo |
| Migrare `Pagination` (custom, shadcn non ha paginazione) | ⬜ todo |
| Migrare `Upload` — UI custom con Tailwind | ⬜ todo |
| Rimuovere Bootstrap da `package.json` | ⬜ todo |
| Verificare che il tema custom (importTheme) funzioni ancora | ⬜ todo |
| Test visivo di tutti i componenti | ⬜ todo |

---

## Fase 4 — Batterie di test `[DOPO FASE 1 + 2]`

**Branch:** `modernize/tests`  
**Dipendenze:** Fase 1 (providers), Fase 2 (TypeScript strict)  
**Obiettivo:** Copertura test a tre livelli: unit, integration (contract), component

| Task | Stato |
|------|-------|
| Configurare Vitest + React Testing Library + msw | ⬜ todo |
| Configurare Firebase Emulator per integration test | ⬜ todo |
| Creare `createMockDataProvider()` utility | ⬜ todo |
| Scrivere `DataProvider.contract.ts` — test parametrico per tutti i provider | ⬜ todo |
| Unit test: `libs/` (converter, path, sanitizer, cache, utils) | ⬜ todo |
| Integration test: `FirebaseDataProvider` vs emulatore | ⬜ todo |
| Integration test: `SupabaseDataProvider` vs istanza test | ⬜ todo |
| Component test: `Form.tsx` — tutti i corner case | ⬜ todo |
| Component test: `Grid.tsx` — tutti i corner case | ⬜ todo |
| Component test: `Input`, `Select`, `Upload`, `Prompt`, `Repeat` | ⬜ todo |
| Configurare Playwright per smoke test E2E | ⬜ todo |
| E2E: flusso CRUD completo | ⬜ todo |
| Script npm: `test`, `test:unit`, `test:integration`, `test:e2e` | ⬜ todo |

---

## Fase 5 — CLI update `[DOPO FASE 3]`

**Branch:** `modernize/cli`  
**Dipendenze:** Fase 3 (Tailwind)  
**Obiettivo:** CLI che scaffolda un progetto moderno con scelta del provider

| Task | Stato |
|------|-------|
| Aggiornare scaffolding con Tailwind + shadcn invece di Bootstrap | ⬜ todo |
| Aggiungere prompt interattivo scelta DataProvider | ⬜ todo |
| Generare `CLAUDE.md` e `docs/` nel progetto scaffoldato | ⬜ todo |
| Aggiornare README | ⬜ todo |

---

## Fase 6 — Showcase app `[ULTIMA, DOPO TUTTO]`

**Branch:** `modernize/playground`  
**Dipendenze:** Fase 1, Fase 3, Fase 4  
**Obiettivo:** App interattiva che mostra ogni componente con ogni combinazione di props, corner case inclusi

```
playground/
  src/
    pages/
      components/     ← ogni componente con props configurabili live + codice generato
      providers/      ← stessa UI con provider diversi affiancati
      corner-cases/   ← 8+ scenari critici: empty state, deep nesting, dataset grandi, etc.
      theme/          ← switch tema live
```

Ogni pagina ha: **preview live** + **pannello props configurabili** + **codice generato aggiornato in real-time**.

| Task | Stato |
|------|-------|
| Setup `playground/` con Vite + React + Tailwind | ⬜ todo |
| Layout: sidebar + preview + pannello props + code preview | ⬜ todo |
| Pagine Input (tutti i tipi) | ⬜ todo |
| Pagine Select (basic, from-db, autocomplete, checklist) | ⬜ todo |
| Pagine Upload (image, document, CSV) | ⬜ todo |
| Pagine Form (8 varianti + corner case) | ⬜ todo |
| Pagine Grid (9 varianti + corner case) | ⬜ todo |
| Pagine Prompt (editor, live, template vars) | ⬜ todo |
| Pagine Providers (confronto side-by-side) | ⬜ todo |
| Pagine Corner cases (8 scenari) | ⬜ todo |
| Pagina Theme (switch live + custom theme) | ⬜ todo |
| Deploy (GitHub Pages o Vercel) | ⬜ todo |

---

## Releases pianificate

| Versione | Contenuto | Branch sorgente | Stato |
|----------|-----------|-----------------|-------|
| `2.0.0-alpha` | Fase 1: Provider abstraction layer | modernize/providers | ⬜ |
| `2.0.0-beta` | Fase 1 + 2: Provider + TypeScript strict | modernize | ⬜ |
| `2.0.0-rc` | Fase 1 + 2 + 3: + shadcn/ui + Tailwind | modernize | ⬜ |
| `2.0.0` | Fase 0–4: release completa con test | modernize → main | ⬜ |
| `2.1.0` | Fase 5: CLI aggiornato | modernize/cli → main | ⬜ |
| `2.2.0` | Fase 6: Showcase app pubblica | modernize/playground → main | ⬜ |

---

## Principi guida per ogni decisione

- Se una modifica rompe l'API pubblica visibile all'utente finale → non si fa o si pianifica con major version bump
- Se una modifica aggiunge una cartella senza risolvere un problema concreto → non si fa
- Se una modifica non è documentabile in CLAUDE.md in 3 righe → probabilmente è troppo complessa
