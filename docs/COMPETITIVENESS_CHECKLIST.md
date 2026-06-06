# Execution Plan

> Operational roadmap for bringing @llmnative/react to the level of React Admin, Refine and Contember.
> Each item is an atomic verifiable task: ✅ done, ⬜ to do.
>
> Last reviewed: 2026-06-06
> Based on `main` codebase analysis (v0.1.1 → target v1.0.0)

---

## How to use this document

Priorities have been **revised from the previous version**. The main difference:

- **P0 first**: AI provider — not a "feature", but the heart of the product. If `AI.fetch()` does not work, the framework does not keep its promise. Full stop.
- **i18n** downgraded from P0 to P2. Nobody chooses a framework for i18n. Everyone chooses a framework for what it **does**.
- **AI provider fix** moved from "Phase 3 — Differentiators" to "Phase 0 — Day 1"
- The execution plan is **sequential**: each phase assumes the previous one is complete.

---

## P0 — Blockers: prevent any serious evaluation

### P0.0 — AI provider: the product does not keep its promise [CRITICAL]

The framework defines itself as "AI-first". Today the AI provider is **completely rewritten with the Adapter pattern**. An AI that tries it finds correct URLs, correct parsing and a clean architecture.

- [x] **Unify the two layers**: rewritten with single Adapter architecture. Old functions (`fetchOpenaiApi`, `fetchGeminiApi`, `fetchAnthropicApi`, `fetchMistralApi`), `fetchAI` stub and `chatChatGPTContinue` removed.
- [x] **Fix Gemini endpoint**: `api.gemini.com/v1/predict` → `generativelanguage.googleapis.com/v1beta/models`
- [x] **Fix Gemini response parsing**: now uses `response?.candidates?.[0]?.content?.parts` (correct)
- [x] **Fix Anthropic endpoint**: `api.anthropic.com/v1/completions` → `api.anthropic.com/v1/messages`
- [x] **Fix Anthropic response parsing**: now uses `response.content` (correct)
- [x] **Fix OpenAI old function `engine`**: removed — the new architecture uses `model` correctly
- [x] **Fix `fetchAI` export**: removed — replaced by `createAIProviderRegistry`
- [x] **Implement DeepSeek**: config key `deepSeekApiKey` now maps to the built-in `deepseek` provider
- [x] **Remove debug logs from production**: all removed — no `console.log("Laaaaaaaaaaaa")`, `"<<<<<<<<impossible>>>>>>>>"`
- [ ] **Type without `any`**: `AIProviderDefinition` typed, but `any` persists in `fetchJson` response handling
- [ ] **Add AI provider tests**: mock HTTP + verify calls + parse response for each provider

### P0.1 — Incomplete providers

- [ ] **FirebaseAuthProvider** (CR-032): email/password, anonymous, magic link
- [x] **FirestoreDataProvider** (CR-033): Cloud Firestore with queries/filters/real-time — done 2026-06-06
- [ ] **Complete SupabaseDataProvider** (CR-034): rewrite with `@supabase/supabase-js` v2, no more raw fetch
- [ ] **Complete SupabaseStorageProvider** (CR-035): same, official SDK with signed URL
- [ ] **SupabaseAuthProvider** (CR-036): email/password, magic link, OAuth, anonymous

### P0.2 — Broken form validation

- [x] **Fix required field validation in Form.tsx**: replaced `document.querySelectorAll` with `fieldRefs` registry + `useFieldValidation()` hook — done 2026-06-06
- [x] **Remove `//return false`**: now active `return false` correctly blocks submit on validation failure — done 2026-06-06
- [x] **Fix Autocomplete + Checklist**: both now call `useFieldValidation()` so required constraint is enforced — done 2026-06-06
- [ ] **Add tests**: form with required → submit without values → error; with values → success

### P0.3 — Error boundary

- [x] **ErrorBoundary for `<App>`**: `<ErrorBoundary fullPage>` wraps the entire app in `App.tsx:249` — done
- [x] **ErrorBoundary for provider**: covered by the same fullPage wrapper (providers are children of App) — done
- [x] **ErrorBoundary for route**: `<ErrorBoundary key={item.path}>` wraps each route in `App.tsx:229` — done

### P0.4 — CI/CD

- [ ] **GitHub Actions**: `npm run test` + `npm run build` on every PR
- [ ] **GitHub Actions**: `npm run test:coverage` with a minimum threshold (e.g. 40% initial, target 60%)
- [ ] **GitHub Actions**: `cd clients/showcase && npm run build` on every PR
- [ ] **README badge**: build passing, test count

---

## P1 — Differentiators: where to win

This is where the competitive advantage lies. React Admin and Refine **do not have** these features.

### P1.1 — Enhanced AI (after P0.0 fix)

- [ ] **AI-form generation**: `<AIForm prompt="Create form for products" />` → generates schema + fields
- [ ] **Zero-config Grid**: if no `columns` specified, auto-detect from the first record
- [ ] **AI-assisted form filling**: "Fill with AI" button on form → description → fields populated
- [ ] **Auto-caption for Upload.Image**: AI generates description from the image
- [ ] **AI-Grid filtering**: NLP input → `"late orders"` → filters applied
- [ ] **Visual Prompt Builder**: component for building prompt templates with preview

### P1.2 — Extreme schema-driven CRUD

- [ ] **Zero-config Grid** (if no `columns`, auto-detect from the first record)
- [ ] **Auto-join FK**: field ending in `Id` → Select populated from the referenced collection
- [ ] **Inline edit on Grid**: click on cell → edit without modal
- [ ] **Bulk actions**: select rows → batch action (delete, export, update)
- [ ] **Native CSV/Excel export** from Grid
- [ ] **Undo delete**: soft-delete + "Undo" notification

### P1.3 — Generic REST adapter

- [ ] **REST adapter**: implement `DataProviderAdapter` with generic fetch. Unlocks 90% of APIs.

### P1.4 — Command palette

- [ ] **Command palette** (Ctrl+K): navigation and quick actions

### P1.5 — Provider Configuration Dashboard

- [ ] **`<ProviderStatus />` component**: shows state of all providers, missing keys, diagnostics
- [ ] **Extend `isConfigured()` to all providers**

---

## P2 — Feature parity: what others have

This is where gaps that the market expects are closed.

### P2.1 — i18n

- [ ] **Create I18nProvider and `useI18n()` hook** (CR-029)
- [ ] **Extract hardcoded strings** from public components
- [ ] **Default `en` dictionary** + locale switching support in `<App locale="it" />`

### P2.2 — Auth

- [ ] **Multiple OAuth providers**: GitHub, Microsoft, Apple
- [ ] **Magic link** (Firebase and Supabase)
- [ ] **Session persistence** and refresh token

### P2.3 — Data management

- [ ] **Native server-side pagination** (currently client-side)
- [ ] **Server-side filters and sorting** (WhereClause/OrderClause exist, must be used by widgets)
- [ ] **Caching with invalidation** (React Query pattern)

### P2.4 — UI/UX

- [ ] **Notifications/Toast system**
- [ ] **WYSIWYG editor** (CR-024 — Tiptap)
- [ ] **ContextMenu with @mention** (CR-025)
- [ ] **Sidebar block** (CR-031)

### P2.5 — Developer experience

- [ ] **Devtools**: inspector for provider state, theme, routing
- [ ] **Inferencer**: auto-generates CRUD pages from API response (Refine does this)

---

## P3 — Quality and trust

### P3.1 — Contract tests for each provider

- [ ] **DataProvider**: Mock ✅, Firebase RTDB, Firestore, Supabase
- [ ] **StorageProvider**: Firebase, Supabase
- [ ] **AuthProvider**: Google, Firebase, Supabase, Dropbox
- [ ] **EmailProvider**: Gmail

### P3.2 — TypeScript quality

- [ ] **Reduce replaceable `any`** in AI provider, Firebase, Theme, Config
- [ ] **Add `noUncheckedIndexedAccess: true`** in tsconfig

### P3.3 — Bundle optimization

- [ ] **tui-image-editor** → evaluate a lighter alternative
- [ ] **prismjs** → dynamic import or tree-shaking
- [ ] **Analyse bundle** with `vite-bundle-visualizer`

### P3.4 — Dead code / legacy

- [ ] **Remove `src/components/Component.tsx`**: legacy pattern with `todo` comment
- [ ] **Remove `src/components/Template.tsx`**: legacy template
- [ ] **Remove `src/components/ui/fields/Command.tsx`**: `contentEditable`/`document.execCommand`
- [ ] **Remove `src/pages/Helper.tsx`**: historical Bootstrap ScrollSpy page
- [ ] **Clean up Firebase**: from `firebase/compat` SDK to modular SDK v9+ (smaller bundle)

### P3.5 — Public documentation

- [ ] **Landing page**
- [ ] **"5-minute" tutorial**: from `npx create` to working CRUD
- [ ] **"30-minute" tutorial**: auth + CRUD + AI + custom theme
- [ ] **Full API reference** for every public component
- [ ] **Live demo** (Vercel deploy of the showcase)
- [ ] **Demo video** (2 minutes)

---

## P4 — Ecosystem

### P4.1 — CLI and scaffolding

- [ ] **Verify generated project build** (automated test)
- [ ] **`saas` template** with auth + CRUD + tenant
- [ ] **`ai` template** with pre-configured AI integration
- [ ] **CLI `devtools`**: provider/theme/routing inspector

### P4.2 — Adapter ecosystem

- [ ] **Adapter template**: guide for writing a custom DataProvider in 10 minutes
- [ ] **Adapter gallery**: showcase with all available adapters

### P4.3 — Community

- [ ] **GitHub Discussions**
- [ ] **Issue template**: bug report, feature request
- [ ] **Contributing guide** (`CONTRIBUTING.md`)

---

## Appendix A — Concrete bugs in the codebase (verified 2026-05-29)

### A.1 AI Provider — ALL FIXED (rewrite 2026-05-29)

The entire `src/providers/ai/index.ts` was rewritten (~300 lines, down from 584) with a clean Adapter architecture. None of the original bugs are present any more. Replaced by:
- `src/providers/ai/AIProvider.ts` — `AIProviderAdapter` interface
- `src/providers/ai/AIProviderContext.tsx` — React Context for registry
- `src/providers/ai/index.ts` — `createAIProviderRegistry` factory, 4 providers ready

**Remaining bugs (post-rewrite):**
- `any` not yet eliminated from `fetchJson` response handling
- DeepSeek not implemented
- No direct tests for AI provider

### A.2 Form — updated 2026-06-06

| File | Bug | Status |
|------|-----|--------|
| `src/components/widgets/Form.tsx` | `useEffect` with `JSON.stringify(defaultValues)` → loop on deep objects | ⬜ open |
| `src/components/widgets/Form.tsx` | Required validation via `document.querySelectorAll` → does not work on dynamic fields | ✅ fixed — replaced by `fieldRefs` + `useFieldValidation()` |
| `src/components/widgets/Form.tsx` | `//return false` → required validation does not block submit | ✅ fixed — now active `return false` after `validateFields()` |
| `src/components/widgets/Form.tsx` | Commented-out block of 10 lines | ✅ fixed — removed |
| `src/components/ui/fields/Select.tsx` | Autocomplete/Checklist ignore `required` constraint | ✅ fixed — both now call `useFieldValidation()` |

### A.3 Firebase

| File | Bug |
|------|-----|
| `src/providers/data/firebase.ts` | Uses `firebase/compat` SDK (deprecated, 2x bundle) |
| `src/providers/data/firebase.ts` | Multiple `consoleLog` calls not removed |
| `src/providers/data/firebase.ts` | `useListener` called as a method during render |
| `src/providers/data/firebase.ts` | Side effect at module import via `onConfigChange` |

### A.4 Legacy / dead code

| File | What |
|------|------|
| `src/components/Component.tsx` | Legacy pattern with `todo` comment |
| `src/components/Template.tsx` | Legacy template |
| `src/components/ui/fields/Command.tsx` | `contentEditable`/`document.execCommand` |
| `src/pages/Helper.tsx` | Historical Bootstrap ScrollSpy page |

---

## Appendix B — Real provider matrix (updated 2026-06-06)

| Provider | Data | Storage | Auth | Stato |
|----------|------|---------|------|-------|
| Firebase (RTDB) | ✅ | ✅ | ❌ | Manca auth email/password |
| Firebase (Firestore) | ✅ | ❌ | ❌ | Data: onSnapshot realtime, where/orderBy — Storage e Auth mancano |
| Supabase | ❌ stub | ❌ stub | ❌ | Tutti loggano "not fully implemented yet" |
| Mock | ✅ | N/A | N/A | Funzionante |
| Google | N/A | N/A | ✅ | Solo OAuth |
| Dropbox | N/A | ✅ export | ✅ | Parziale |

---

## Appendix C — Execution order

```text
PHASE 0 — HONESTY (1 week)
├── P0.0: AI provider — ✅ DONE (Adapter rewrite 2026-05-29)
│   └── Remaining: DeepSeek, types, tests
├── P0.2: Form validation — ✅ DONE (2026-06-06)
│   └── Remaining: tests
├── P0.3: ErrorBoundary — ✅ DONE (3 levels: fullPage + per-route in App.tsx)
├── P0.4: CI/CD — ⬜ GitHub Actions (test + build on every PR)  ← NEXT
├── A.4: Remove dead code (Component.tsx, Template.tsx, Helper.tsx, Command.tsx)
├── [DOC] Add KNOWN_ISSUES.md, make README honest
└── Phase 1 canonical naming: Grid.layout → Grid.view + backward-compat alias

PHASE 1 — FOUNDATIONS (2-3 weeks)
├── P0.1: Incomplete providers
│   ├── FirebaseAuthProvider (email/password, anonymous)  ← ⬜ todo
│   ├── FirestoreDataProvider — ✅ DONE (2026-06-06)
│   ├── Complete SupabaseDataProvider  ← ⬜ todo
│   ├── Complete SupabaseStorageProvider  ← ⬜ todo
│   └── SupabaseAuthProvider  ← ⬜ todo
└── P3.4: Firebase SDK compat → modular (bundle -50%)

PHASE 2 — QUALITY (3-4 weeks)
├── P3.1: Contract tests for each provider
├── P3.2: TypeScript quality (reduce any)
├── P3.3: Bundle optimization
├── P3.5: Public documentation + live demo
└── P4.1: CLI — saas + ai templates

PHASE 3 — DIFFERENTIATORS (3-4 weeks)
├── P1.1: Enhanced AI (form generation, auto-fill, caption)
├── P1.2: Extreme schema-driven CRUD (inline edit, export, bulk)
├── P1.3: Generic REST adapter
├── P1.4: Command palette
├── P1.5: Provider Status Dashboard
└── P2.1: i18n

PHASE 4 — PARITY + ECOSYSTEM (1-2 months)
├── P2.2: Auth — multiple OAuth providers, magic link
├── P2.3: Data management — server-side pagination/filters
├── P2.4: UI/UX — Notifications, WYSIWYG, Sidebar
├── P2.5: Devtools, Inferencer
├── P4.2: Adapter gallery
├── P4.3: Community — Discussions, Contributing guide
└── v1.0.0 release
```

---

## Appendix D — Quality gates for v1.0.0

| Metric | Target | How to measure |
|--------|--------|----------------|
| Test count | ≥ 200 | `npm run test -- --reporter=verbose` |
| Coverage | ≥ 60% | `npm run test:coverage` |
| Failing tests | 0 | `npm run test` |
| TypeScript strict | 0 errors | `npx tsc --noEmit` |
| CI build | ✅ on every PR | GitHub Actions |
| Showcase build | ✅ | `cd clients/showcase && npm run build` |
| E2E flows | ≥ 1 (CRUD) | Playwright |
| Data providers | 4/4 working | Mock ✅ FirebaseRTDB ✅ Firestore ✅ Supabase ✅ |
| Auth providers | 4/4 working | Google ✅ Firebase ✅ Supabase ✅ Dropbox ✅ |

---

> **Rule**: When all P0 are ✅, the project is ready for production.
> When P0 + P1 are ✅, it is ready to compete seriously.
> When everything is ✅, it is ready to win.

> **Note**: i18n was downgraded from P0 to P2 because it is not a blocker for adoption. Nobody chooses a framework for internationalisation. The real priority is: AI that works → providers that work → differentiating features → quality.
