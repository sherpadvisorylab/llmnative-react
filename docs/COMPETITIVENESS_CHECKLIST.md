# Competitiveness Checklist

> Roadmap operativa per portare react-firestrap al livello di React Admin, Refine e Contember.
> Ogni sezione ha priorità P0 (bloccante) → P4 (nice-to-have).
> Ogni item è un task atomico verificabile: ✅ fatto, ⬜ da fare, 🔄 in progress.
>
> Ultima revisione: 2026-05-18
> Basato su analisi codebase `modernize` (v1.5.8 → target v2.0.0)

---

## Indice

1. [P0 — Bloccanti: nessuno lo usa in produzione senza questi](#p0--bloccanti-nessuno-lo-usa-in-produzione-senza-questi)
2. [P1 — Differenziatori: dove deve raddoppiare](#p1--differenziatori-dove-deve-raddoppiare)
3. [P2 — Feature parity: cosa hanno gli altri e manca](#p2--feature-parity-cosa-hanno-gli-altri-e-manca)
4. [P3 — Qualità e trust: test, CI, documentazione](#p3--qualità-e-trust-test-ci-documentazione)
5. [P4 — Ecosistema e community](#p4--ecosistema-e-community)
6. [Appendice A — Bug concreti trovati nella codebase](#appendice-a--bug-concreti-trovati-nella-codebase)
7. [Appendice B — Strategia di posizionamento](#appendice-b--strategia-di-posizionamento)
8. [Appendice C — Metriche target per v2.0.0](#appendice-c--metriche-target-per-v200)

---

## P0 — Bloccanti: nessuno lo usa in produzione senza questi

Sono i problemi che un CTO o un tech lead nota subito e che impediscono qualsiasi valutazione seria.

### P0.1 — Provider incompleti

- [ ] **FirebaseAuthProvider** (CR-032) — `src/providers/auth/firebase/FirebaseAuthProvider.ts`
  - Implementare `signIn({ method: 'email', email, password })` → `signInWithEmailAndPassword`
  - Implementare `signIn({ method: 'anonymous' })` → `signInAnonymously`
  - Implementare `signIn({ method: 'emailLink', email })` → `sendSignInLinkToEmail`
  - Implementare `signOut()` → `signOut(auth)`
  - Implementare `onAuthChange(cb)` → `onAuthStateChanged(auth, cb)`
  - Implementare `getUser()` → mappa `auth.currentUser` su `UserProfile`
  - Implementare `isAuthenticated()` → `auth.currentUser !== null`
  - Registrare driver `firebaseAuth` in `FIREBASE_MANIFEST` e `AuthDriverName`
  - Test unitari con emulatore o mock SDK

- [ ] **FirestoreDataProvider** (CR-033) — `src/providers/data/firestore.ts`
  - Implementare `read('/collection')` → `getDocs(collection(db, ...))` con `_key = doc.id`
  - Implementare `read('/collection/id')` → `getDoc(doc(db, ...))`
  - Implementare `read` con `WhereClause` (eq, lt, lte, gt, gte, in, nin)
  - Implementare `read` con `OrderClause` (asc/desc)
  - Implementare `set('/collection/id', data)` → `setDoc`
  - Implementare `update('/collection/id', data)` → `updateDoc` (merge parziale)
  - Implementare `remove('/collection/id', data)` → `deleteDoc`
  - Implementare `useListener` → `onSnapshot` con query constraints + cleanup
  - Implementare `count(path)` → `getCountFromServer`
  - Implementare `setChunks` → batch write
  - Implementare `getConfigurationState()` → verifica Firebase init
  - Registrare driver `firestore` in `FIREBASE_MANIFEST` e `DataDriverName`
  - Test unitari con emulatore o mock SDK

- [ ] **SupabaseDataProvider completo** (CR-034) — riscrivere `src/providers/data/supabase.ts`
  - Rimpiazzare `fetch` raw con `@supabase/supabase-js` v2
  - Singleton client per configurazione (url + anonKey)
  - Implementare `read('/table')` → `supabase.from('table').select('*')` con `_key = String(row.id)`
  - Implementare `read('/table/id')` → `.select('*').eq('id', id).single()`
  - Implementare `read` con `WhereClause` → `.eq()`, `.lt()`, `.gt()`, `.in()`, ecc.
  - Implementare `read` con `OrderClause` → `.order()`
  - Implementare `set` → `.upsert()` con `onConflict`
  - Implementare `update` → `.update(data).eq('id', id)`
  - Implementare `remove` → `.delete().eq('id', id)`
  - Implementare `useListener` → `supabase.channel().on('postgres_changes', ...)` con fetch iniziale
  - Implementare `count` → `.select('*', { count: 'exact', head: true })`
  - Implementare `setChunks` → upsert in batch
  - Implementare `getConfigurationState()` → verifica url + anonKey
  - Rimuovere `console.warn("not fully implemented yet")`
  - Test contratto con mock client o Supabase test

- [ ] **SupabaseStorageProvider completo** (CR-035) — riscrivere `src/providers/storage/supabase.ts`
  - Usare `@supabase/supabase-js` v2 Storage API
  - Configurazione bucket (default: `'public'`) + flag `isPrivate`
  - Implementare `upload(base64DataUrl, path)` → convertire Blob + `.upload()`
  - Implementare `getURL(path)` → `getPublicUrl()` per bucket pubblici, `createSignedUrl()` per privati
  - Implementare `download(path)` → `.download(path)` SDK
  - Implementare `delete(path)` → `.remove([path])`
  - Rimuovere `console.warn("not fully implemented yet")`
  - Test contratto

- [ ] **SupabaseAuthProvider** (CR-036) — `src/providers/auth/supabase/SupabaseAuthProvider.ts`
  - Implementare `signIn({ method: 'email', email, password })`
  - Implementare `signIn({ method: 'magicLink', email })`
  - Implementare `signIn({ method: 'oauth', provider: 'google' | 'github' | ... })`
  - Implementare `signIn({ method: 'anonymous' })`
  - Implementare `signOut()`
  - Implementare `onAuthChange(cb)` → `supabase.auth.onAuthStateChange`
  - Implementare `getUser()` → mappa `session.user` su `UserProfile`
  - Implementare `isAuthenticated()` → `session !== null`
  - Implementare `getAccessToken()` → `session.access_token`
  - Registrare driver `supabaseAuth` in manifest
  - Test con mock client

### P0.2 — Validazione form rotta

- [ ] **Fixare required field validation in Form.tsx** (linee 438-442)
  - Sostituire `document.querySelectorAll` (fragile, solo su DOM iniziale) con validazione React-state-based
  - Rimuovere `//return false` che neutralizza il blocco del submit
  - Aggiungere messaggi di errore inline per campo required
  - Aggiungere test: form con required fields → submit senza valori → errore
  - Aggiungere test: form con required fields → submit con valori → successo

### P0.3 — Debug log e sicurezza

- [ ] **Rimuovere `console.log("Laaaaaaaaaaaa")`** in `src/providers/ai/index.ts`
- [ ] **Rimuovere `console.log("<<<<<<<<impossible>>>>>>>>")`** in `src/providers/ai/index.ts`
- [ ] **Rimuovere log dei request payload** in AI provider (logga API key in chiaro)
- [ ] **Rimuovere commenti di debug** in `Form.tsx` (linee 127-136, 443-454)
- [ ] **Rimuovere tutti i `consoleLog`** in `src/providers/data/firebase.ts`
- [ ] **Verificare che nessun file logghi dati sensibili** (API key, token, password)

### P0.4 — Error boundary

- [ ] **Aggiungere ErrorBoundary** avvolge `<App>`
- [ ] **Aggiungere ErrorBoundary per provider** — se un provider crasha, non abbatte tutta l'app
- [ ] **Aggiungere ErrorBoundary per route** — pagina che crasha non abbatte navigazione

### P0.5 — i18n per le stringhe framework

- [ ] **Creare I18nProvider** e hook `useI18n()` (CR-029)
- [ ] **Estrarre tutte le stringhe hardcoded** in inglese
- [ ] **Sostituire stringhe italiane** trovate nel codice (`"Caricamento in corso..."`, ecc.)
- [ ] **Dizionario default `en`** per tutto il framework
- [ ] **Supporto locale switching** in `<App locale="it" />`
- [ ] **Test**: fallback lingua → `en` → chiave

---

## P1 — Differenziatori: dove deve raddoppiare

Qui sta il vantaggio competitivo. React Admin e Refine **non hanno** queste feature o le hanno in forma molto ridotta. react-firestrap deve renderle perfette, documentate e impossibili da ignorare.

### P1.1 — AI come cittadino di prima classe

- [ ] **Correggere URL API errati**:
  - Gemini: `https://api.gemini.com/v1/predict` → `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
  - Anthropic: `https://api.anthropic.com/v1/completions` → `https://api.anthropic.com/v1/messages`
  - DeepSeek: verificare endpoint corrente
  - Mistral: verificare endpoint corrente
- [ ] **Correggere parse response**:
  - Gemini: `response.predictions[0].text` → `response.candidates[0].content.parts[0].text`
  - Anthropic: verificare formato messaggi vs completions
- [ ] **Aggiornare model names**: `gpt-5.2` → dinamico/configurabile, `gemini-2.5-pro` → dinamico
- [ ] **Test AI provider**: mock HTTP + verifica chiamate corrette + parse response
- [ ] **Prompt Builder visuale** — componente per costruire template prompt con preview
- [ ] **AI-form generation**: `<AIForm prompt="Crea form per prodotti" />` → genera schema + campi
- [ ] **AI-Grid filtering**: input NLP → `"ordini in ritardo"` → filtri applicati
- [ ] **AI-assisted form filling**: bottone "Compila con AI" su form → descrizione → campi popolati
- [ ] **Auto-caption per Upload.Image**: AI genera descrizione dall'immagine

### P1.2 — CRUD Schema-Driven estremo

- [ ] **Zero-config Grid**: se nessuna `columns` specificata, auto-rilevare dal primo record
- [ ] **Auto-join FK**: campo che finisce per `Id` → Select popolata dalla collezione referenziata
- [ ] **Nested CRUD paths**: `<Grid dataStoragePath="/users/{userId}/posts" />` senza configurazione extra
- [ ] **Inline edit su Grid**: click su cella → edit senza modal
- [ ] **Bulk actions**: seleziona righe → azione batch (delete, export, update)
- [ ] **Export CSV/Excel** nativo da Grid
- [ ] **Import CSV** con mapping guidato (UploadCSV già esiste, integrarlo in Grid)
- [ ] **Grid preset view**: salva/carica configurazione colonne, filtri, ordine
- [ ] **Undo delete**: soft-delete + "Annulla" notification

### P1.3 — Provider Manifest + Configuration State

- [ ] **Documentare pubblicamente** il pattern manifest: "zero if per provider"
- [ ] **Provider Configuration Dashboard**: componente `<ProviderStatus />` che mostra stato di tutti i provider
- [ ] **Expandere `isConfigured()` a tutti i provider** (alcuni mancano)
- [ ] **Diagnostica avanzata**: `getConfigurationState()` deve dire esattamente cosa manca
- [ ] **Test automatici**: ogni provider deve passare un test di configuration state

### P1.4 — Theme + Motion + Head unificati

- [ ] **Showcase playground per temi**: switch live tra default/flat/cyber + dark mode
- [ ] **Showcase playground per motion**: preset selector (none/subtle/standard/expressive) + preview
- [ ] **Completare animazioni Notifications/Toast** (CR-027, checklist aperta)
- [ ] **Aggiungere motion preset `none`** che disabilita tutto rispettando `prefers-reduced-motion`
- [ ] **Testare keyboard navigation + reduced motion** in tutti i componenti animati
- [ ] **Documentare il theme system** con esempi di tema custom

### P1.5 — Multi-tenant nativo

- [ ] **Documentare `RuntimeProvider` + `TenantMenu`**
- [ ] **Scrivere test** per tenant switching
- [ ] **Esempio funzionante** nello showcase: `/examples/multi-tenant`
- [ ] **Template CLI `--template=saas`** che include multi-tenancy out of the box

### P1.6 — Head Management

- [ ] **Documentare tutti gli hook head** (`useSocialHead`, `usePwaHead`, ecc.)
- [ ] **Demo interattiva** nello showcase: mostra come cambia il `<head>` in tempo reale
- [ ] **Test** per ogni hook head

---

## P2 — Feature parity: cosa hanno gli altri e manca

React Admin e Refine hanno feature che react-firestrap non ha e che sono attese dal mercato.

### P2.1 — Gestione dati

- [ ] **GraphQL support** — anche minimale (query custom su DataProvider)
- [ ] **Paginazione server-side** nativa (oggi è tutta client-side)
- [ ] **Filtri server-side** (WhereClause già esiste, va usato dai widget)
- [ ] **Ordinamento server-side** (OrderClause già esiste, va usato dai widget)
- [ ] **Caching con invalidation** (React Query pattern)

### P2.2 — Auth

- [ ] **OAuth provider multipli**: GitHub, Microsoft, Apple (oggi solo Google + Dropbox)
- [ ] **Magic link** (Firebase e Supabase lo supportano)
- [ ] **Session persistence** e refresh token
- [ ] **2FA** (almeno interfaccia, anche senza implementazione completa)

### P2.3 — UI/UX

- [ ] **Command palette** (Ctrl+K) per navigazione e azioni rapide (Refine ce l'ha)
- [ ] **Notifications/Toast system** (Refine ha notification provider)
- [ ] **Guided tours / onboarding**
- [ ] **WYSIWYG editor** (CR-024 — Tiptap candidato)
- [ ] **ContextMenu con @mention** (CR-025)

### P2.4 — Developer experience

- [ ] **Devtools** (Refine ha Refine Devtools)
- [ ] **Storybook** per componenti pubblici
- [ ] **Inferencer** (Refine: auto-genera pagine CRUD da API response)
- [ ] **Bundle analyzer** e ottimizzazione

---

## P3 — Qualità e trust: test, CI, documentazione

Senza questi, nessuno fiducia. Con questi, si differenzia da progetti amatoriali.

### P3.1 — Test

- [ ] **Contract test per ogni DataProvider** (Mock passa, Firebase/Supabase devono passare)
- [ ] **Contract test per ogni StorageProvider**
- [ ] **Contract test per ogni AuthProvider**
- [ ] **Contract test per ogni EmailProvider**
- [ ] **Test concreti StorageProvider** (almeno mock adapter con implementazione reale)
- [ ] **Test Upload** (già fatti, verificare copertura)
- [ ] **Test Prompt** (esplicitamente mancante)
- [ ] **Test AI provider** (mock HTTP)
- [ ] **Test Repeat** (già fatti)
- [ ] **Test integration Firebase** (con emulatore o skip esplicito)
- [ ] **Test integration Supabase** (dopo CR-034/035/036)
- [ ] **Test regressione per ogni bug fix** (prima di chiudere un issue, scrivere test)

### P3.2 — CI/CD

- [ ] **GitHub Actions**: `npm run test` + `npm run build` su ogni PR
- [ ] **GitHub Actions**: `npm run test:coverage` con soglia minima (es. 60%)
- [ ] **GitHub Actions**: `cd clients/showcase && npm run build` su ogni PR
- [ ] **GitHub Actions**: lint (se configurato)
- [ ] **Badge README**: build passing, test count, coverage
- [ ] **Playwright E2E**: almeno un flusso CRUD completo su showcase

### P3.3 — TypeScript quality

- [ ] **Ridurre `any` sostituibili**:
  - AI provider: `parseContent`, `fetchOpenaiApi`, PROVIDERS object
  - Firebase provider: parametri `any`
  - Theme: `deepMerge` function
  - Config: type assertions (`as unknown as`)
- [ ] **Verificare TypeScript strict** su tutta la codebase (`npx tsc --noEmit`)
- [ ] **Aggiungere `noUncheckedIndexedAccess: true`** in tsconfig

### P3.4 — Bundle optimization

- [ ] **tui-image-editor** → valutare se necessario o sostituibile con alternativa più leggera
- [ ] **prismjs** → valutare dynamic import o tree-shaking
- [ ] **Due icon library come peer dep** → documentare che basta installarne una
- [ ] **Analizzare bundle** con `vite-bundle-visualizer`

### P3.5 — Documentazione pubblica

- [ ] **Landing page** (docs.react-firestrap.dev o simile)
- [ ] **Tutorial "5 minuti"** — da `npx create` a CRUD funzionante
- [ ] **Tutorial "30 minuti"** — auth + CRUD + AI + tema custom
- [ ] **API reference completa** per ogni componente pubblico
- [ ] **Esempi funzionanti** (non stub) per ogni pattern:
  - CRUD base con Grid + Form
  - Form con nested objects e arrays
  - Grid con custom formatters
  - Auth (Google, Firebase email, Supabase)
  - AI integration
  - Upload immagini
  - Multi-tenant
- [ ] **Demo live** (Vercel deploy dello showcase)
- [ ] **Video** (screencast di 2 minuti)

---

## P4 — Ecosistema e community

Non serve competere con React Admin (26k stelle) o Refine (30k stelle). Serve una community piccola ma fedele.

### P4.1 — Adapter ecosystem

- [ ] **Adapter template**: guida per scrivere un DataProvider custom in 10 minuti
- [ ] **Adapter gallery**: pagina showcase che lista tutti gli adapter disponibili
- [ ] **Adapter REST generico**: il 90% delle API è REST, un adapter generico sblocca mille casi
- [ ] **Adapter Airtable, Strapi, Hasura** (i più richiesti)

### P4.2 — CLI e scaffolding

- [ ] **Verificare build del progetto generato** — test automatico che `npx react-firestrap create` produce un progetto buildabile
- [ ] **Template `saas`** con auth + CRUD + tenant
- [ ] **Template `ai`** con AI integration preconfigurata
- [ ] **CLI `devtools`** — inspector per provider state, tema, routing

### P4.3 — Community

- [ ] **Discord server** (o GitHub Discussions)
- [ ] **Issue template** per bug report, feature request, domande
- [ ] **Contributing guide** (`CONTRIBUTING.md`)
- [ ] **Code of conduct**
- [ ] **Changelog pubblico** (CHANGELOG.md già esiste, mantenerlo)
- [ ] **Release note** su GitHub Releases

---

## Appendice A — Bug concreti trovati nella codebase

Qui elenco i bug specifici identificati durante l'analisi.

### A.1 AI Provider

| File | Linea | Bug |
|------|-------|-----|
| `src/providers/ai/index.ts` | — | `console.log("Laaaaaaaaaaaa")` in hot path |
| `src/providers/ai/index.ts` | — | `console.log("<<<<<<<<impossible>>>>>>>>")` |
| `src/providers/ai/index.ts` | — | Logga API key in chiaro nei request payload |
| `src/providers/ai/index.ts` | — | Gemini URL: `api.gemini.com/v1/predict` (inesistente) |
| `src/providers/ai/index.ts` | — | Gemini parse: `response.predictions[0].text` (formato sbagliato) |
| `src/providers/ai/index.ts` | — | Anthropic URL: `api.anthropic.com/v1/completions` (deprecato) |
| `src/providers/ai/index.ts` | — | Model names hardcoded: `gpt-5.2`, `gemini-2.5-pro`, `claude-3.5` |
| `src/providers/ai/index.ts` | — | Tipo `any` ovunque: `parseContent`, `fetchOpenaiApi`, PROVIDERS |

### A.2 Form

| File | Linea | Bug |
|------|-------|-----|
| `src/components/widgets/Form.tsx` | 416 | `useEffect` con `JSON.stringify(defaultValues)` nelle dipendenze → loop su oggetti profondi |
| `src/components/widgets/Form.tsx` | 438-442 | Required validation via `document.querySelectorAll` → non funziona su campi dinamici |
| `src/components/widgets/Form.tsx` | 441 | `//return false` → validazione required non blocca il submit |
| `src/components/widgets/Form.tsx` | 127-136 | Blocco commentato di 10 righe |
| `src/components/widgets/Form.tsx` | 443-454 | Blocco commentato `onSave` |
| `src/components/widgets/Form.tsx` | 130-131 | `console.log("FORM defaultValue!!!!!!!!!!!!")` commentato |

### A.3 Firebase

| File | Linea | Bug |
|------|-------|-----|
| `src/providers/data/firebase.ts` | — | Usa `firebase/compat` SDK (deprecato, bundle più grande) |
| `src/providers/data/firebase.ts` | — | `firebase/compat/database` non in dipendenze esplicite |
| `src/providers/data/firebase.ts` | — | `consoleLog` chiamate multiple non rimosse |

### A.4 Hook violations

| File | Linea | Bug |
|------|-------|-----|
| `src/providers/data/firebase.ts` | — | `useListener` chiamato come metodo durante render → fragile, dipende dall'ordine di chiamata |
| `src/providers/data/firebase.ts` | 39-43 | Side effect registrato a module import via `onConfigChange` (event bus fuori da React lifecycle) |
| `src/components/widgets/Form.tsx` | 416 | `JSON.stringify` in useEffect deps → identità non stabile |

### A.5 Legacy / dead code

| File | Cosa |
|------|------|
| `src/components/Component.tsx` | Pattern legacy model/template con `todo` comment |
| `src/components/Template.tsx` | Template legacy ancora presente |
| `src/components/ui/fields/Command.tsx` | `contentEditable`/`document.execCommand` — prototipo deprecato |
| `src/pages/Helper.tsx` | Bootstrap ScrollSpy storico, non parte del flusso moderno |

---

## Appendice B — Strategia di posizionamento

### B.1 Chi NON provare a essere

react-firestrap **non deve** competere su:
- **Ecosistema adapter**: React Admin ha 50+, non li raggiungerà mai
- **Headless flexibility**: Refine è nato headless, ha 5 UI library integrate
- **SSR/Next.js**: React Admin e Refine ci stanno investendo
- **Enterprise support**: React Admin ha un team pagato di 10+ persone
- **Stars GitHub**: non avrà mai 30k stelle

### B.2 Chi DEVE essere

> **Il framework React per backoffice AI-first, schema-driven, zero-config.**

Target:
- Team piccoli (1-5 dev) che costruiscono admin panel interni
- Progetti Firebase o Supabase (non REST/GraphQL generici)
- App che vogliono AI integrata senza doverla costruire
- Prototipazione rapida → produzione

### B.3 Value proposition in una riga

> *"10 righe di codice → CRUD + AI + auth + real-time. Qualsiasi backend. Zero configurazione."*

### B.4 Messaggi chiave

1. **"Schema-driven, non resource-driven"** — mentre React Admin ti fa configurare resource per resource, react-firestrap deduce tutto da un path
2. **"AI first-party"** — non un plugin, non un add-on enterprise. `AI.fetch()` è built-in come `<Input />`
3. **"Provider manifest: if-less architecture"** — aggiungere un backend = una riga in un array
4. **"Theme + Motion + Head: unified"** — un unico sistema per look, animazioni e SEO, non 3 library da integrare
5. **"Diagnostic by design"** — il framework ti dice cosa manca prima che tu fallisca

---

## Appendice C — Metriche target per v2.0.0

### C.1 Quality gates

| Metrica | Target | Come si misura |
|---------|--------|----------------|
| Test count | ≥ 200 | `npm run test -- --reporter=verbose` |
| Coverage | ≥ 70% | `npm run test:coverage` |
| TypeScript strict | 0 errori | `npx tsc --noEmit` |
| CI build | ✅ su ogni PR | GitHub Actions |
| Showcase build | ✅ | `cd clients/showcase && npm run build` |
| E2E flussi | ≥ 1 | Playwright |

### C.2 Provider matrix completa

| Provider | Data | Storage | Auth |
|----------|------|---------|------|
| Firebase (RTDB) | ✅ | ✅ | ❌ (manca email/password) |
| Firebase (Firestore) | ❌ (CR-033) | ✅ | ❌ |
| Supabase | ❌ stub (CR-034) | ❌ stub (CR-035) | ❌ (CR-036) |
| Mock | ✅ | N/A | N/A |
| Google | N/A | N/A | ✅ |
| Dropbox | N/A | ✅ (export) | ✅ |

Target: **tutti ✅**

### C.3 Feature checklist pubblica

| Feature | Stato | Priorità |
|---------|-------|----------|
| Grid CRUD | ✅ reale | — |
| Form + nested | ✅ reale | — |
| AI integration | 🔄 bug fix needed | P0 |
| Upload con crop | ✅ reale | — |
| Repeat dinamico | ✅ reale | — |
| Theme system | ✅ reale | — |
| Motion system | 🔄 quasi completo | P1 |
| Head management | ✅ reale | — |
| i18n | ❌ | P0 |
| Sidebar block | ❌ (CR-031) | P2 |
| WYSIWYG editor | ❌ (CR-024) | P2 |
| ContextMenu | ❌ (CR-025) | P3 |
| Command palette | ❌ | P2 |
| GraphQL | ❌ | P2 |
| SSR support | ❌ | P3 |
| E2E tests | ❌ | P0 |
| CI/CD | ❌ | P0 |

---

## Riepilogo ordine di esecuzione consigliato

```text
Fase 1 — Fondamenta (mese 1)
├── P0.1: Provider incompleti (FirebaseAuth, Firestore, Supabase tutto)
├── P0.2: Validazione form
├── P0.3: Debug log puliti
├── P0.4: Error boundaries
├── P0.5: i18n base
└── P3.2: CI/CD

Fase 2 — Qualità (mese 2)
├── P3.1: Contract test per tutti i provider
├── P3.3: TypeScript quality (ridurre any)
├── P3.4: Bundle optimization
├── A.5: Rimuovere legacy dead code
└── P3.5: Documentazione pubblica + tutorial

Fase 3 — Differenziatori (mese 3)
├── P1.1: AI provider fix + potenziamento
├── P1.2: CRUD schema-driven estremo
├── P1.3: Provider configuration state documentato
├── P1.4: Theme + Motion playground
├── P1.5: Multi-tenant documentato
├── P1.6: Head management documentato
└── P4.2: CLI template saas + ai

Fase 4 — Feature parity (mese 4)
├── P2.1: Paginazione/filtri server-side
├── P2.2: Auth provider multipli
├── P2.3: Command palette, Notifications
├── P2.4: Devtools
└── P4.1: REST adapter generico

Fase 5 — Community (mese 5+)
├── P4.3: Discord, contributing guide
├── P2.4: Storybook
├── P2.1: GraphQL support
└── v2.0.0 release
```

---

> Questo documento è uno strumento di lavoro. Spunta i checkbox man mano che avanzi.
> Quando tutti i P0 sono ✅, react-firestrap è pronto per produzione.
> Quando P0 + P1 sono ✅, è pronto per competere.
> Quando tutto è ✅, è pronto per vincere.
