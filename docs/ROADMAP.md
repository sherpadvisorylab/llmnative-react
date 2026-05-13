# Roadmap

> Roadmap operativa riallineata alla codebase il 2026-05-08.
> Il piano storico dettagliato vive in `docs/CHANGE_REQUESTS.md`; lo stato corrente verificato vive in `docs/STATUS.md`.

---

## Direzione

React FireStrap sta diventando un framework React Vite-first, provider-agnostic e AI-friendly. Il vantaggio da preservare resta sempre lo stesso: costruire interfacce data-driven complesse con poche righe, senza costringere il consumer a conoscere i dettagli interni del provider.

---

## Stato consolidato

Gia' implementato e verificato:

- Vite library build con output CJS/ESM/CSS/types.
- `DataProvider`, `StorageProvider`, `AuthProvider`, `EmailProvider` e relativi context.
- `FirebaseDataProvider`, `FirebaseStorageProvider`, `MockDataProvider`.
- Implementazioni Supabase presenti ma parziali.
- App-level provider config dichiarativa in `<App providers={{ ... }}>`.
- `RuntimeProvider` interno che compone config runtime e stato globale persistito.
- Head management client-side via `HeadProvider`, `Head` e hook dedicati per metadata/document/social/language/pagination/assets/PWA/schema.org.
- Theme registry e icon registry controllabili da `<App>`.
- Tailwind v4 runtime tramite compatibility layer CSS.
- `MarkdownReader` pubblico.
- Showcase Vite basato su `<App providers={{ ... }}>` e docs Markdown via frontmatter.
- Scaffold Vite-first riallineato alla nuova API `providers`.
- Test unit/component: 14 file, 124 test passanti.

Non ancora completo:

- Integration test Firebase/Supabase.
- Test Storage/Auth/Email provider.
- Test component per Prompt.
- Test contract sulle implementazioni storage concrete.
- Playwright E2E e CI.
- Showcase senza stub per provider ed esempi.
- Deploy pubblico dello showcase.
- Audit finale API componenti e rimozione/isolamento del debito legacy.

---

## Sequenza consigliata

```text
CR-006 tests hardening              in progress
CR-007 showcase completion          in progress
CR-012 showcase native examples     next
CR-014 component API audit          after/while CR-012
CR-008..CR-011 themes cleanup       after visual baseline
2.0.0-rc                            after tests + showcase no critical stubs
```

---

## Priorita' 1 - Verificabilita'

Obiettivo: poter dire cosa funziona con test automatici, non solo con build.

Task:

- Aggiungere test `Upload`. *(fatto: copertura component base)*
- Aggiungere test `Prompt`.
- Aggiungere test `Repeat`. *(fatto: render/add/readOnly/save nested)*
- Aggiungere test storage provider almeno su mock/fake adapter o contract dedicato. *(parziale: coperto `StorageProviderContext`)*
- Aggiungere integration Firebase con emulatore oppure marcarla esplicitamente come manuale fino a setup emulatore.
- Aggiungere integration Supabase solo quando `SupabaseDataProvider` smette di loggare `not fully implemented yet`.
- Aggiungere script separati se servono: `test:unit`, `test:integration`, `test:e2e`.
- Aggiungere CI.

---

## Priorita' 2 - Showcase reale

Obiettivo: eliminare le route stub che oggi danno una percezione piu' completa dello stato reale.

Prime pagine da rendere reali:

- `/examples/crud`: `Grid + Form + MockDataProvider`.
- `/examples/nested-form`: dot notation, array/repeat e default values.
- `/examples/dashboard`: metriche e tabelle da dati mock.
- `/providers/data/firebase`: contratto, config e limiti reali.
- `/providers/data/supabase`: pagina onesta su stato parziale e API REST usata.
- `/providers/storage`: contratto reale `upload/getURL/download/delete`.

Accettazione:

- Ogni route nel menu o e' una demo funzionante o dichiara esplicitamente che e' una pagina pianificata.
- `clients/showcase npm run build` continua a passare.

---

## Priorita' 3 - API audit

Obiettivo: far emergere e correggere le incoerenze pubbliche prima della RC.

Issue gia' censite:

- `Input`: chiarire `type` vs `inputType`.
- `Select`: completare/documentare `placeholder` e naming `db.path`.
- `Form`: chiarire la variante bare rispetto ad `aspect`.
- `Grid`: allineare docs/API su `pagination.limit` vs `pagination.perPage`.
- `Modal`: verificare props effettivamente esportate.
- `Icon`: prop `name` unica; la prop `icon` e' stata rimossa dal componente `Icon`.
- `StorageProvider`: docs allineate alla API reale `getURL`/`delete`.

---

## Priorita' 4 - Release readiness

Prima di `2.0.0-rc`:

- `npm run test` passa.
- `npm run build` passa.
- `cd clients/showcase && npm run build` passa.
- Showcase senza stub critici nei percorsi principali.
- Docs operative aggiornate alla stessa data.
- Gap non risolti dichiarati in `STATUS.md`.

Prima di `2.0.0`:

- CI attiva.
- Almeno un flusso E2E CRUD.
- Integration strategy chiara per Firebase e Supabase.
- README e docs pubbliche allineate allo stato reale.
