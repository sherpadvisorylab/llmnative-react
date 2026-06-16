# Performance Audit

**Auditor:** deepseek-v4-flash-free via @llmnative/react AI agent
**Date:** 2026-05-29
**Last updated:** 2026-06-07
**Scope:** Bundle size, React rendering, tree-shaking, dead code

---

## Stato complessivo

| Categoria | Completamento | Stato |
|-----------|--------------|-------|
| P0 — Re-render critici Form.tsx | **100%** | ✅ completato |
| P1 — Zero React.memo | **0%** | ⬜ deferred (prerequisiti non soddisfatti) |
| P2 — Dead code bundle | **100%** | ✅ completato |
| P3 — Barrel exports | **70%** | 🔄 parziale |
| P4 — Dipendenze pesanti | **0%** | ⬜ da fare |
| P5 — Grid inline callbacks | **0%** | ⬜ da fare (latent) |
| P6 — GridDB rest spread | **0%** | ⬜ da fare (solo se P1) |
| **Totale** | **~45%** | |

---

## P0 — Form.tsx: Re-render critici ✅ 100%

### P0.1 FormContext value ricreato a ogni render ✅ DONE

**File:** `src/components/widgets/Form.tsx`

**Fix applicato (2026-06-07):**
```tsx
const formCtx = useMemo(() => ({ record, setRecord, wrapClass: "mb-3" as const }), [record, setRecord]);
```
`<FormContext.Provider value={formCtx}>` — il valore non viene più ricreato a ogni render.

### P0.2 `components` e `notificationEl` non memoizzati ✅ DONE

**Fix applicato (2026-06-07):**
```tsx
const components = useMemo(() => (
    <FormContext.Provider value={formCtx}>...</FormContext.Provider>
), [formCtx, children, validationContextValue]);

const notificationEl = useMemo(() => (
    notification ? <Alert ...>{notification}</Alert> : null
), [notification]);
```

### P0.3 `handleChange` non memoizzato ✅ DONE

**Fix applicato (2026-06-07):**
```tsx
const handleChange = useCallback((event: ChangeHandler) => {
    validationCtx?.clearFieldError(event.target.name);
    ctx.setRecord((prev) => applyChangeToRecord(prev, event, inputType));
    onChange?.({ ... });
}, [validationCtx, ctx.setRecord, onChange, name, inputType]);
```
Usa il functional updater pattern (`setRecord(prev => ...)`) per evitare `ctx.record` nelle deps.

---

## P1 — Re-render propagation (zero React.memo) ⬜ 0% — DEFERRED

### Motivo del deferral (2026-06-07)

Analisi del codice ha rivelato che `Table.tsx` usa il pattern anti-memo `useState(body || [])` + `useEffect` sync, e `useTheme` context subscription. `React.memo` applicato senza prima risolvere questi pattern sarebbe inefficace o dannoso.

**Prerequisiti prima di P1:**
1. Risolvere il pattern `useState(body || [])` in `Table.tsx` — body come derived state, non state
2. Separare la context subscription dal rendering (context splitting)
3. Solo dopo: aggiungere `React.memo` a Table, Gallery, Input, Badge

### Componenti target (da fare in ordine quando prerequisiti soddisfatti)

| Componente | Priorità | Blockers |
|---|---|---|
| `Input` + field variants | Alta | P0.3 ✅ già fatto |
| `Table` | Alta | useState anti-pattern da risolvere |
| `Gallery` | Alta | Stesso pattern di Table |
| `Badge` | Bassa | Nessuno |
| `Card` | Media | Nessuno |
| `Modal` | Bassa | Nessuno |
| `Select`, `Autocomplete`, `Checklist` | Media | Nessuno |
| `Grid` | Media | P5 prima |

---

## P2 — Dead code bundle ✅ 100%

### File rimossi (2026-06-07)

| File | Righe rimosse | Come |
|------|--------------|------|
| `src/components/FormEnhancer.tsx` | 147 | Eliminato; `extractComponentProps` inlinata in `grid-core/utils.ts` |
| `src/components/ui/fields/AssistantAI.tsx` | ~180 | Eliminato; sostituito concettualmente da CR-039 WorkflowAI |
| `src/pages/BlogPost.tsx` | ~120 | Eliminato |
| `src/pages/Helper.tsx` | 1696 | Eliminato |
| `src/pages/Blog.tsx` | ~40 | Eliminato (import rotto su BlogPost) |
| `src/components/Template.tsx` | 265 | Eliminato; pattern sbagliato per SPA |
| `src/components/Component.tsx` | ~270 rimossi | Pulito: rimossi `ComponentBlockSave`, `ComponentBlockSave2`, `ComponentTemplate` |
| `src/libs/log.ts` | 26 | Eliminato; logica inlinata in `Form.tsx` con `useDataProvider()` |
| `src/libs/cache.ts` | 43 | Eliminato; logica inlinata in `scrape/index.ts` con `DataProviderAdapter` |
| `src/libs/database.ts` | 4 | Eliminato; zero consumer rimasti |
| `src/libs/storage.ts` | 3 | Eliminato; zero consumer rimasti |
| `src/libs/seo.ts` | 10 | Eliminato; zero consumer |
| `clients/showcase/src/pages/components/AssistantAIPage.tsx` | ~50 | Eliminato |
| **Totale** | **~2854 righe** | |

### Export pubblici rimossi da `src/index.ts`

```diff
- export { default as db } from './providers/data/firebase';
- export { default as storage } from './providers/storage/firebase';
- export * from './Template'; // da components/index.ts
- export { default as log } from './log'; // da libs/index.ts
- export { default as db } from './database'; // da libs/index.ts
- export { default as storage } from './storage'; // da libs/index.ts
- export { default as seo } from './seo'; // da libs/index.ts
```

---

## P3 — Barrel exports e tree-shaking 🔄 70%

### Fatto (2026-06-07)

| Export rimosso | Impatto |
|----------------|---------|
| `export * from './pages'` — includeva Helper.tsx (1696 righe) | ✅ risolto eliminando i file |
| `export * from './libs'` — includeva database.ts, storage.ts, log.ts, seo.ts | ✅ risolto eliminando i file |
| `export { default as db }` e `export { default as storage }` diretti in `src/index.ts` | ✅ rimosso |

### Da fare

| Item | Motivo | Priorità |
|------|--------|----------|
| `export * from './components'` in `src/index.ts` | Include tutti i componenti anche se l'utente importa solo `{Grid}`. Vite 5 gestisce ragionevolmente, impatto limitato | Bassa |
| Named export espliciti per `./libs` | Ora `export * from './libs'` esporta solo utility clean (cn, converter, sanitizer, fetch, utils, order, imageBuilder) | Bassa |

---

## P4 — Dipendenze pesanti (lazy loading) ⬜ 0%

| Dipendenza | Usata da | Taglio bundle | Stato |
|---|---|---|---|
| `prismjs` | Code component | ~40 KB gzipped | ⬜ da fare |
| `react-markdown` + remark/rehype | MarkdownReader | ~50 KB gzipped | ⬜ da fare |
| `tui-image-editor` | ImageEditor | ~100 KB gzipped | ⬜ da fare |
| `papaparse` | UploadCSV | ~10 KB | ⬜ da fare |

Tutte sono già **external** nel vite.config (non incluse nel bundle della library), ma installate come dipendenze obbligatorie. Fix: spostare in `peerDependenciesMeta.optional`.

---

## P5 — Grid inline callbacks ⬜ 0% (latent)

**File:** `src/components/widgets/grid-core/GridTableView.tsx` e `GridGalleryView.tsx`

Funzioni inline create a ogni render. Non causano problemi ora perché Table non ha `React.memo`. Diventano un problema quando/se si aggiunge memo a Table/Gallery.

**Da fare solo insieme a P1.**

---

## P6 — GridDB + GridArray rest spread ⬜ 0% (dipende da P1)

**File:** `src/components/widgets/grid-core/GridDB.tsx` e `GridArray.tsx`

`{...rest}` e `{...props}` creano un nuovo oggetto a ogni render — invalidano `React.memo` su GridCore se aggiunto.

**Da fare solo se si aggiunge `React.memo` a GridCore (parte di P1).**

---

## Summary: Impact vs Effort aggiornato

| # | Fix | Impatto | Effort | Stato |
|---|---|---|---|---|
| P0.1 | Memoize FormContext value | Alto | 2 righe | ✅ done |
| P0.2 | Memoize components/notificationEl | Alto | 3 righe | ✅ done |
| P0.3 | useCallback handleChange | Medio | 5 righe | ✅ done |
| P2 | Rimuovere dead code (~2854 righe) | Basso-Medio | Completato | ✅ done |
| P3 | Barrel export puliti | Basso | Parziale | 🔄 70% |
| P1 | React.memo (Table, Input, Badge…) | Medio | 10 componenti | ⬜ deferred |
| P4 | Dipendenze opzionali | Basso | package.json + docs | ⬜ da fare |
| P5 | useCallback in Grid views | Basso | 4 useCallback | ⬜ da fare (latent) |
| P6 | Rest spread in GridDB/Array | Basso | 10 righe | ⬜ solo se P1 |
