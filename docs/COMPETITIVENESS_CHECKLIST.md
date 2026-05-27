# Execution Plan

> Roadmap operativa per portare @llmnative/react al livello di React Admin, Refine e Contember.
> Ogni item è un task atomico verificabile: ✅ fatto, ⬜ da fare.
>
> Ultima revisione: 2026-05-27
> Basato su analisi codebase `main` (v0.1.1 → target v1.0.0)

---

## Come usare questo documento

Le priorità sono **riviste rispetto alla versione precedente**. La differenza principale:

- **P0 primo**: AI provider — non "feature", ma il cuore del prodotto. Se `AI.fetch()` non funziona, il framework non mantiene la sua promessa. Punto.
- **i18n** declassato da P0 a P2. Nessuno sceglie un framework per l'i18n. Tutti scelgono un framework per quello che **fa**.
- **AI provider fix** spostato da "Fase 3 — Differenziatori" a "Fase 0 — Giorno 1"
- Il piano esecutivo è **sequenziale**: ogni fase presuppone la precedente completata.

---

## P0 — Bloccanti: impediscono qualsiasi valutazione seria

### P0.0 — AI provider: il prodotto non mantiene la promessa [CRITICO]

Il framework si definisce "AI-first". Oggi l'AI provider è **rotto su 3 provider su 4**. Un'AI che lo prova impara che non funziona e non torna più.

- [ ] **Unificare i due layer**: oggi `src/providers/ai/index.ts` ha:
  - Vecchie funzioni (`fetchOpenaiApi`, `fetchGeminiApi`, `fetchAnthropicApi`, `fetchMistralApi`) — usate da codice legacy
  - Nuovo `PROVIDERS` object + `AI` class — usato dalla nuova API pubblica
  - `export default function fetchAI()` — stub che ignora il parametro `provider`
  - Decidere UN solo layer e rimuovere l'altro
- [ ] **Fixare Gemini endpoint**: `api.gemini.com/v1/predict` (inesistente) → `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- [ ] **Fixare Gemini response parsing**: riga 280-282: `if (response?.predictions) { return; }` ritorna `undefined` **sempre**. Il parsing reale a riga 283 è dead code.
  - Parsing corretto: `response.candidates[0].content.parts[0].text`
- [ ] **Fixare Anthropic endpoint**: `api.anthropic.com/v1/completions` (deprecato) → `https://api.anthropic.com/v1/messages`
- [ ] **Fixare Anthropic response parsing**: `response.choices[0].message.content` → `response.content[0].text`
  - Anthropic non usa il formato `choices[]`, ma `content[]`
- [ ] **Fixare OpenAI old function**: `engine` → `model` in `chatChatGPTContinue` (riga 147)
- [ ] **Fixare `fetchAI` export**: deve accettare e usare il parametro `provider`, non ritornare sempre `fetchOpenaiApi` (riga 335-337)
- [ ] **Implementare DeepSeek**: config key `deepSeekApiKey` esiste in `AIConfig`, ma nessun provider
- [ ] **Rimuovere debug log da produzione**:
  - `console.log("Laaaaaaaaaaaa")` (riga 200)
  - `console.log("<<<<<<<<impossible>>>>>>>>")` (riga 154)
  - `console.log(this.config.name + "->request", body)` (riga 552)
  - `console.log(this.config.name + "->response", response)` (riga 560)
- [ ] **Tipizzare senza `any`**: `parseContent(str: string): any` → tipo concreto; `parseResponse(response: any): any` → tipo concreto; rimuovere `any` da PROVIDERS
- [ ] **Aggiungere test AI provider**: mock HTTP + verifica chiamate corrette + parse response per ogni provider

### P0.1 — Provider incompleti

- [ ] **FirebaseAuthProvider** (CR-032): email/password, anonymous, magic link
- [ ] **FirestoreDataProvider** (CR-033): Cloud Firestore con query/filtri/real-time
- [ ] **SupabaseDataProvider completo** (CR-034): riscrivere con `@supabase/supabase-js` v2, niente più fetch raw
- [ ] **SupabaseStorageProvider completo** (CR-035): idem, SDK ufficiale con signed URL
- [ ] **SupabaseAuthProvider** (CR-036): email/password, magic link, OAuth, anonymous

### P0.2 — Form validation rotta

- [ ] **Fixare required field validation in Form.tsx**: sostituire `document.querySelectorAll` con validazione React-state-based
- [ ] **Rimuovere `//return false`** che neutralizza il submit bloccato
- [ ] **Aggiungere test**: form con required → submit senza valori → errore; con valori → successo

### P0.3 — Error boundary

- [ ] **ErrorBoundary per `<App>`**: se App crasha, mostra fallback, non white screen
- [ ] **ErrorBoundary per provider**: se un provider crasha, non abbatte tutta l'app
- [ ] **ErrorBoundary per route**: pagina che crasha non abbatte navigazione

### P0.4 — CI/CD

- [ ] **GitHub Actions**: `npm run test` + `npm run build` su ogni PR
- [ ] **GitHub Actions**: `npm run test:coverage` con soglia minima (es. 40% iniziale, target 60%)
- [ ] **GitHub Actions**: `cd clients/showcase && npm run build` su ogni PR
- [ ] **Badge README**: build passing, test count

---

## P1 — Differenziatori: dove vincere la partita

Qui sta il vantaggio competitivo. React Admin e Refine **non hanno** queste feature.

### P1.1 — AI potenziato (dopo il fix P0.0)

- [ ] **AI-form generation**: `<AIForm prompt="Crea form per prodotti" />` → genera schema + campi
- [ ] **Zero-config Grid**: se nessuna `columns` specificata, auto-rilevare dal primo record
- [ ] **AI-assisted form filling**: bottone "Compila con AI" su form → descrizione → campi popolati
- [ ] **Auto-caption per Upload.Image**: AI genera descrizione dall'immagine
- [ ] **AI-Grid filtering**: input NLP → `"ordini in ritardo"` → filtri applicati
- [ ] **Prompt Builder visuale**: componente per costruire template prompt con preview

### P1.2 — CRUD schema-driven estremo

- [ ] **Zero-config Grid** (se nessuna `columns`, auto-rileva dal primo record)
- [ ] **Auto-join FK**: campo che finisce per `Id` → Select popolata dalla collezione referenziata
- [ ] **Inline edit su Grid**: click su cella → edit senza modal
- [ ] **Bulk actions**: seleziona righe → azione batch (delete, export, update)
- [ ] **Export CSV/Excel** nativo da Grid
- [ ] **Undo delete**: soft-delete + "Annulla" notification

### P1.3 — REST adapter generico

- [ ] **Adapter REST**: implementa `DataProviderAdapter` con fetch generico. Sblocca il 90% delle API.

### P1.4 — Command palette

- [ ] **Command palette** (Ctrl+K): navigazione e azioni rapide

### P1.5 — Provider Configuration Dashboard

- [ ] **Componente `<ProviderStatus />`**: mostra stato di tutti i provider, chiavi mancanti, diagnostica
- [ ] **Expandere `isConfigured()` a tutti i provider**

---

## P2 — Feature parity: cosa hanno gli altri

Qui si colmano gap che il mercato si aspetta.

### P2.1 — i18n

- [ ] **Creare I18nProvider e hook `useI18n()`** (CR-029)
- [ ] **Estrarre stringhe hardcoded** da componenti pubblici
- [ ] **Dizionario default `en`** + supporto locale switching in `<App locale="it" />`

### P2.2 — Auth

- [ ] **OAuth provider multipli**: GitHub, Microsoft, Apple
- [ ] **Magic link** (Firebase e Supabase)
- [ ] **Session persistence** e refresh token

### P2.3 — Gestione dati

- [ ] **Paginazione server-side** nativa (oggi client-side)
- [ ] **Filtri e ordinamento server-side** (WhereClause/OrderClause esistono, vanno usati dai widget)
- [ ] **Caching con invalidation** (React Query pattern)

### P2.4 — UI/UX

- [ ] **Notifications/Toast system**
- [ ] **WYSIWYG editor** (CR-024 — Tiptap)
- [ ] **ContextMenu con @mention** (CR-025)
- [ ] **Sidebar block** (CR-031)

### P2.5 — Developer experience

- [ ] **Devtools**: inspector per provider state, tema, routing
- [ ] **Inferencer**: auto-genera pagine CRUD da API response (Refine lo fa)

---

## P3 — Qualità e trust

### P3.1 — Contract test per ogni provider

- [ ] **DataProvider**: Mock ✅, Firebase RTDB, Firestore, Supabase
- [ ] **StorageProvider**: Firebase, Supabase
- [ ] **AuthProvider**: Google, Firebase, Supabase, Dropbox
- [ ] **EmailProvider**: Gmail

### P3.2 — TypeScript quality

- [ ] **Ridurre `any` sostituibili** in AI provider, Firebase, Theme, Config
- [ ] **Aggiungere `noUncheckedIndexedAccess: true`** in tsconfig

### P3.3 — Bundle optimization

- [ ] **tui-image-editor** → valutare alternativa più leggera
- [ ] **prismjs** → dynamic import o tree-shaking
- [ ] **Analizzare bundle** con `vite-bundle-visualizer`

### P3.4 — Dead code / legacy

- [ ] **Rimuovere `src/components/Component.tsx`**: pattern legacy con `todo` comment
- [ ] **Rimuovere `src/components/Template.tsx`**: template legacy
- [ ] **Rimuovere `src/components/ui/fields/Command.tsx`**: `contentEditable`/`document.execCommand`
- [ ] **Rimuovere `src/pages/Helper.tsx`**: Bootstrap ScrollSpy storico
- [ ] **Pulire Firebase**: da `firebase/compat` SDK a modular SDK v9+ (bundle più piccolo)

### P3.5 — Documentazione pubblica

- [ ] **Landing page**
- [ ] **Tutorial "5 minuti"**: da `npx create` a CRUD funzionante
- [ ] **Tutorial "30 minuti"**: auth + CRUD + AI + tema custom
- [ ] **API reference completa** per ogni componente pubblico
- [ ] **Demo live** (Vercel deploy dello showcase)
- [ ] **Video dimostrativo** (2 minuti)

---

## P4 — Ecosistema

### P4.1 — CLI e scaffolding

- [ ] **Verificare build del progetto generato** (test automatico)
- [ ] **Template `saas`** con auth + CRUD + tenant
- [ ] **Template `ai`** con AI integration preconfigurata
- [ ] **CLI `devtools`**: inspector provider/tema/routing

### P4.2 — Adapter ecosystem

- [ ] **Adapter template**: guida per scrivere un DataProvider custom in 10 minuti
- [ ] **Adapter gallery**: showcase con tutti gli adapter disponibili

### P4.3 — Community

- [ ] **GitHub Discussions**
- [ ] **Issue template**: bug report, feature request
- [ ] **Contributing guide** (`CONTRIBUTING.md`)

---

## Appendice A — Bug concreti nella codebase (verificati 2026-05-27)

### A.1 AI Provider — tutti ancora presenti

| File | Linea | Bug | Gravità |
|------|-------|-----|---------|
| `src/providers/ai/index.ts` | 200 | `console.log("Laaaaaaaaaaaa")` in hot path | Media |
| `src/providers/ai/index.ts` | 154 | `console.log("<<<<<<<<impossible>>>>>>>>")` | Media |
| `src/providers/ai/index.ts` | 190/269/552 | Logga request body (potenziale leak dati) | Media |
| `src/providers/ai/index.ts` | 44 | Gemini URL: `api.gemini.com/v1/predict` (inesistente) | **Critica** |
| `src/providers/ai/index.ts` | 280-282 | Gemini early return `undefined` — **dead code dopo** | **Critica** |
| `src/providers/ai/index.ts` | 451 | Anthropic URL: `api.anthropic.com/v1/completions` (deprecato) | **Critica** |
| `src/providers/ai/index.ts` | 472 | Anthropic parse: `choices[0].message.content` (formato sbagliato) | **Critica** |
| `src/providers/ai/index.ts` | 147 | OpenAI `chatChatGPTContinue` usa `engine` invece di `model` | Alta |
| `src/providers/ai/index.ts` | 335-337 | `fetchAI` stub: ignora `provider`, ritorna sempre OpenAI | **Critica** |
| `src/providers/ai/index.ts` | 394,428,452 | Model names hardcoded: `gpt-5.2`, `gemini-2.5-pro`, `claude-3.5` | Bassa |
| `src/providers/ai/index.ts` | 86,349,546 | Tipo `any` ovunque: `parseContent`, `parseResponse`, PROVIDERS | Media |

### A.2 Form

| File | Linea | Bug |
|------|-------|-----|
| `src/components/widgets/Form.tsx` | 416 | `useEffect` con `JSON.stringify(defaultValues)` → loop su oggetti profondi |
| `src/components/widgets/Form.tsx` | 458 | Required validation via `document.querySelectorAll` → non funziona su campi dinamici |
| `src/components/widgets/Form.tsx` | 441 | `//return false` → validazione required non blocca il submit |
| `src/components/widgets/Form.tsx` | 127-136 | Blocco commentato di 10 righe |

### A.3 Firebase

| File | Bug |
|------|-----|
| `src/providers/data/firebase.ts` | Usa `firebase/compat` SDK (deprecato, bundle 2x) |
| `src/providers/data/firebase.ts` | `consoleLog` chiamate multiple non rimosse |
| `src/providers/data/firebase.ts` | `useListener` chiamato come metodo durante render |
| `src/providers/data/firebase.ts` | Side effect a module import via `onConfigChange` |

### A.4 Legay / dead code

| File | Cosa |
|------|------|
| `src/components/Component.tsx` | Pattern legacy con `todo` comment |
| `src/components/Template.tsx` | Template legacy |
| `src/components/ui/fields/Command.tsx` | `contentEditable`/`document.execCommand` |
| `src/pages/Helper.tsx` | Bootstrap ScrollSpy storico |

---

## Appendice B — Provider matrix reale (2026-05-27)

| Provider | Data | Storage | Auth | Stato |
|----------|------|---------|------|-------|
| Firebase (RTDB) | ✅ | ✅ | ❌ | Manca auth email/password |
| Firebase (Firestore) | ❌ | ❌ | ❌ | Mai iniziato |
| Supabase | ❌ stub | ❌ stub | ❌ | Tutti loggano "not fully implemented yet" |
| Mock | ✅ | N/A | N/A | Funzionante |
| Google | N/A | N/A | ✅ | Solo OAuth |
| Dropbox | N/A | ✅ export | ✅ | Parziale |

---

## Appendice C — Ordine di esecuzione

```text
FASE 0 — ONESTA' (1 settimana)
├── P0.0: AI provider — fixare TUTTO (URL, parsing, log, tipi, test)
├── P0.4: CI/CD — GitHub Actions (test + build su ogni PR)
├── P0.3: ErrorBoundary — 3 livelli (App, provider, route)
├── A.4: Rimuovere dead code
└── [DOC] Aggiungere KNOWN_ISSUES.md, rendere README onesto

FASE 1 — FONDAMENTA (2-3 settimane)
├── P0.1: Provider incompleti
│   ├── FirebaseAuthProvider (email/password, anonymous)
│   ├── FirestoreDataProvider
│   ├── SupabaseDataProvider completo
│   ├── SupabaseStorageProvider completo
│   └── SupabaseAuthProvider
├── P0.2: Validazione form — fix required fields
└── P3.4: Firebase SDK compat → modular (bundle -50%)

FASE 2 — QUALITA' (3-4 settimane)
├── P3.1: Contract test per ogni provider
├── P3.2: TypeScript quality (ridurre any)
├── P3.3: Bundle optimization
├── P3.5: Documentazione pubblica + demo live
└── P4.1: CLI — template saas + ai

FASE 3 — DIFFERENZIATORI (3-4 settimane)
├── P1.1: AI potenziato (form generation, auto-fill, caption)
├── P1.2: CRUD schema-driven estremo (inline edit, export, bulk)
├── P1.3: REST adapter generico
├── P1.4: Command palette
├── P1.5: Provider Status Dashboard
└── P2.1: i18n

FASE 4 — PARITY + ECOSISTEMA (1-2 mesi)
├── P2.2: Auth — OAuth provider multipli, magic link
├── P2.3: Gestione dati — paginazione/filtri server-side
├── P2.4: UI/UX — Notifications, WYSIWYG, Sidebar
├── P2.5: Devtools, Inferencer
├── P4.2: Adapter gallery
├── P4.3: Community — Discussions, Contributing guide
└── v1.0.0 release
```

---

## Appendice D — Quality gates per v1.0.0

| Metrica | Target | Come si misura |
|---------|--------|----------------|
| Test count | ≥ 200 | `npm run test -- --reporter=verbose` |
| Coverage | ≥ 60% | `npm run test:coverage` |
| Test falliti | 0 | `npm run test` |
| TypeScript strict | 0 errori | `npx tsc --noEmit` |
| CI build | ✅ su ogni PR | GitHub Actions |
| Showcase build | ✅ | `cd clients/showcase && npm run build` |
| E2E flussi | ≥ 1 (CRUD) | Playwright |
| Provider Data | 4/4 funzionanti | Mock ✅ FirebaseRTDB ✅ Firestore ✅ Supabase ✅ |
| Provider Auth | 4/4 funzionanti | Google ✅ Firebase ✅ Supabase ✅ Dropbox ✅ |

---

> **Regola**: Quando tutti i P0 sono ✅, il progetto è pronto per produzione.
> Quando P0 + P1 sono ✅, è pronto per competere seriamente.
> Quando tutto è ✅, è pronto per vincere.

> **Nota**: i18n è stato declassato da P0 a P2 perché non è un bloccante per l'adozione. Nessuno sceglie un framework per l'internazionalizzazione. La priorità reale è: AI che funziona → provider che funzionano → feature differenzianti → qualità.
