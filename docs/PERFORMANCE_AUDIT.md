# Performance Audit

**Auditor:** deepseek-v4-flash-free via @llmnative/react AI agent
**Date:** 2026-05-29
**Scope:** Bundle size, React rendering, tree-shaking, dead code

## Executive Summary

Il framework ha tre categorie di problemi di performance:

| Categoria | Impatto | Sforzo |
|---|---|---|
| **P0 — Re-render critici in Form.tsx** | Alto (ogni field re-render a ogni keystroke) | Basso (2-3 useMemo) |
| **P1 — Zero React.memo nel codebase** | Medio (re-render propagati senza difesa) | Medio (aggiungere memo ai componenti chiave) |
| **P2 — Dead code bundle** | Basso (5% del bundle) | Basso (rimuovere export) |
| **P3 — Barrel exports** | Basso (tree-shaking funziona, ma API surface confonde l'AI) | Basso (named export invece di `export *`) |

---

## P0 — Form.tsx: Re-render critici

### P0.1 FormContext value ricreato a ogni render (CRITICAL)

**File:** `src/components/widgets/Form.tsx:629`

```tsx
<FormContext.Provider value={{ record, setRecord, wrapClass: "mb-3" }}>
```

Ogni field dentro un Form consuma `FormContext` via `useContext`. L'oggetto `{ record, setRecord, wrapClass }` e' creato nuovo a ogni render di Form → **tutti i field re-renderano a ogni cambiamento di qualsiasi field**.

**Fix:** avvolgere in `useMemo`:

```tsx
const formCtx = useMemo(() => ({ record, setRecord, wrapClass: "mb-3" as const }), [record, setRecord]);
```

**Impatto:** ogni field passa da "re-render a ogni keystroke in qualsiasi field" a "re-render solo quando il suo record cambia". Impatto proporzionale al numero di field nel form.

### P0.2 `components` e `notificationEl` non memoizzati

**File:** `src/components/widgets/Form.tsx:628-646`

Le variabili `components` (JSX con `<FormContext>`) e `notificationEl` (JSX di notifica) sono create a ogni render e passate come dependency a `displayComponent` (un `useMemo`). Questo **invalida il useMemo a ogni render**, rendendolo inutile.

**Fix:**

```tsx
const components = useMemo(() => (
    <FormContext.Provider value={formCtx}>
        ...
    </FormContext.Provider>
), [formCtx, children, validationContextValue]);

const notificationEl = useMemo(() => (
    notification ? <Alert...>{notification}</Alert> : null
), [notification]);
```

**Impatto:** `displayComponent` smette di ricalcolare a ogni render.

### P0.3 `handleChange` in `useFormContext` non memoizzato

**File:** `src/components/widgets/Form.tsx:194-209`

`handleChange` e' una closure ricreata a ogni render di FormData. Viene passata a ogni field (via FormContext). Ogni field riceve una nuova referenza di `handleChange` a ogni render, impedendo eventuali `React.memo` sui field.

**Fix:**

```tsx
const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    validationCtx?.clearFieldError(event.target.name);
    ctx.setRecord(prev => formChange(event, prev));
    onChange?.({ ...ctx.record, [event.target.name]: event.target.value });
}, [validationCtx, ctx.setRecord, onChange, ctx.record]);
```

**Impatto:** prepara il terreno per `React.memo` sui field (Tier 4).

---

## P1 — Re-render propagation (zero React.memo)

### Stato attuale

Zero file in `src/` usano `React.memo` o `memo()`. Questo significa che **non c'e' nessuna difesa** contro la propagazione di re-render.

### Componenti che dovrebbero avere React.memo

| Componente | Priorita' | Motivo |
|---|---|---|
| `Table` | Alta | Renderizza N righe, ogni re-render e' O(N) |
| `Gallery` | Alta | Stesso pattern di Table |
| `Grid` | Media | Gia' ha useMemo interni, ma non ha memo esterno |
| `Card` | Media | Wrapper composito, spesso in liste |
| `Modal` | Bassa | Renderizzato una volta, ma child pesanti |
| `Input` + field variants | Alta | N field in un form, ogni re-render e' O(N) |
| `Select`, `Autocomplete`, `Checklist` | Media | Ha options array, re-render O(options) |
| `Badge` | Bassa | Leggero, ma usato in liste |

### Fix pattern

```tsx
export default React.memo(Badge);
export default React.memo(Table, (prev, next) => shallowEqual(prev, next));
```

**Attenzione:** `React.memo` senza `useCallback`/`useMemo` upstream e' inutile o dannoso. Va fatto in ordine:
1. Prima fissare i P0 (FormContext, inline callbacks)
2. Poi aggiungere memo ai componenti foglia (Input, Badge)
3. Poi memo ai componenti intermedi (Table, Gallery, Card)
4. Poi memo ai contenitori (Form, Grid)

---

## P2 — Dead code bundle

4 file sono esportati pubblicamente ma sono dead code o legacy non piu' usato:

| File | Linee | Esportato da | Perche' e' morto |
|---|---|---|---|
| `src/components/Component.tsx` | 355 | `src/components/index.ts:82` | Sistema schema-driven legacy. Nessun consumer. |
| `src/components/ComponentBlock.tsx` | (in Component.tsx) | `src/components/index.ts:83` | Stessa origine. |
| `src/components/Template.tsx` | 219 | `src/components/index.ts:84` (`export *`) | Sistema template legacy. Nessun consumer. |
| `src/components/FormEnhancer.tsx` | 147 | non esportato direttamente | Usato da AssistantAI, ma e' legacy sostituibile. |
| `src/pages/Helper.tsx` | 1581 | `src/pages/index.ts:2` | Pagina legacy di utilità. Nessun consumer moderno. |
| `src/pages/Blog.tsx` | ? | `src/pages/index.ts:3` | Blog page mai usata. |
| **Totale** | **~2300+** | | **~5% del bundle (stima 25 KB)** |

### Fix per Tier 0 (prima del refactor naming)

```diff
- export { default as Component } from './Component';
- export { ComponentBlock } from './Component';
- export * from './Template';
+ // Component e Template sono deprecati. Rimossi dalla public API.
+ // Usare Form e Grid come alternativa.

- export * from './pages';
+ // Pages non fanno parte della public API del framework.
```

E in `src/pages/index.ts`:
```diff
- export { default as PageHelper } from './Helper';
- export { default as PageBlog } from './Blog';
+ export { default as PageUsers } from './Users';
```

---

## P3 — Barrel exports e tree-shaking

### Problema

In `src/index.ts` (l'entry point del bundle), tre righe usano `export *`:

```ts
export * from './components';  // line 155 — 86 righe di export
export * from './libs';        // line 156 — 14 righe di export
export * from './pages';       // line 157 — 3 righe di export
```

Con Vite library mode, `export *` costringe Vite a **includere nel bundle tutti i moduli raggiungibili**, perche' non puo' sapere a compile-time quali named export verranno effettivamente importati dal consumer. Tree-shaking funziona solo a livello di modulo, non di export.

### Impatto reale

Vite 5 tree-shakes abbastanza bene, quindi l'impatto e' limitato. Tuttavia:

- `export * from './libs'` forza l'inclusione di `libs/fetch.ts` (con tutta la logica proxy), `libs/email.ts`, `libs/database.ts`, ecc. — anche se l'utente importa solo `{ Grid }`.
- `export * from './pages'` forza l'inclusione di Helper.tsx (1581 linee!) e Blog.tsx, che sono dead code.

### Fix

```diff
- export * from './components';
+ // Invece di export *, esportare solo cio' che serve
+ // (gia' fatto nelle righe 3-85 di index.ts)
+ // Rimuovere riga 155

- export * from './libs';
+ export { cn, converter, sanitizer } from './libs';  // solo utility realmente pubbliche
+ export { useImage } from './libs/imageBuilder';
+ // NON esportare: fetch.ts (proxyFetch e' gia' esportato da providers/proxy)
+ // NON esportare: database.ts, storage.ts, path.ts, log.ts, seo.ts, email.ts
+ // Questi sono legacy e/o interni.

- export * from './pages';
+ // Rimuovere (vedi P2)
```

---

## P4 — Dipendenze pesanti (lazy loading candidates)

Alcune dipendenze sono usate da un solo componente. Potrebbero essere caricate lazy:

| Dipendenza | Usata da | Taglio bundle |
|---|---|---|
| `prismjs` | Code component | ~40 KB gzipped |
| `react-markdown` + remark/rehype | MarkdownReader | ~50 KB gzipped |
| `tui-image-editor` | ImageEditor | ~100 KB gzipped |
| `papaparse` | UploadCSV | ~10 KB |
| `buffer` (polyfill) | Forse non serve piu' | ~6 KB |

Tutte sono gia' **external** nel vite.config (non incluse nel bundle della library), ma vengono installate come dipendenze obbligatorie. 

Per ridurre le dipendenze obbligatorie, si potrebbe:

1. **Spostare in `peerDependenciesMeta.optional`**: `prismjs`, `react-markdown`, `tui-image-editor`, `papaparse`
2. **Usare React.lazy()** per caricare il componente solo quando serve
3. **Documentare** quali dipendenze servono per quali componenti

Esempio per Code + prismjs:

```tsx
// Invece di import statico:
import { Prism } from 'prismjs';

// Usare import dinamico:
const Code = React.lazy(() => import('./Code'));
```

Ma questo cambia l'API pubblica (obbliga a usare `<Suspense>`), quindi va valutato.

---

## P5 — Grid inline callbacks (latent)

### GridTableView.tsx

**File:** `src/components/widgets/grid-core/GridTableView.tsx:113-138`

```tsx
<Table
    onSelectionChange={selection ? (nextSelection) => { ... } : undefined}
    onClick={onClickRow ? (record) => { ... } : undefined}
```

Sono funzioni inline create a ogni render. Oggi non causano problemi perche' Table non ha `React.memo`. Quando (e se) Table verra' memoizzato, queste funzioni lo faranno fallire.

### GridGalleryView.tsx

Stesso pattern in `GridGalleryView.tsx:35-57`.

### Fix

```tsx
// Con useCallback (richiede di estrarre in un hook o usare ref):
const handleSelectionChange = useCallback((nextSelection) => {
    // ...
}, [selection, ...]);

const handleRowClick = useCallback((record) => {
    const key = getRecordKey(record);
    const sourceRecord = sourceByKey.get(key);
    if (sourceRecord) onClickRow(sourceRecord);
}, [onClickRow, getRecordKey, sourceByKey]);
```

---

## P6 — GridDB + GridArray rest spread

### GridDB.tsx:36 e GridArray.tsx:7

```tsx
<GridCore {...rest} records={records} ... />
<GridCore {...props} />
```

Lo spread `{...rest}` e `{...props}` crea un nuovo oggetto a ogni render. Se GridCore avesse `React.memo`, sarebbe sempre invalidato.

### Fix

Per GridDB, elencare le props esplicitamente invece di `...rest`:

```tsx
<GridCore
    columns={rest.columns}
    actions={rest.actions}
    form={rest.form}
    // ecc.
    records={records}
    recordId={recordId}
    sourcePath={resolvedPath}
    sortable={resolvedSortable}
/>
```

Ma questo aumenta la manutenzione. Approccio pragmatico: **aggiungere questo fix solo quando si aggiunge `React.memo` a GridCore**.

---

## Summary: Impact vs Effort

| # | Fix | Impatto | Effort | Dipendenze |
|---|---|---|---|---|
| P0.1 | Memoize FormContext value | Alto | 2 righe | Nessuna |
| P0.2 | Memoize components/notificationEl | Alto | 3 righe | P0.1 |
| P0.3 | useCallback handleChange | Medio | 5 righe | Nessuna |
| P1 | Aggiungere React.memo a Table, Input, Badge... | Medio | 10 componenti × 1 riga | P0.1, P0.3, P5 |
| P2 | Rimuovere dead code export | Basso | 5 righe | Decisione su deprecation |
| P3 | Barrel export puliti | Basso | 5 righe | P2 |
| P4 | Dipendenze opzionali | Basso | package.json + docs | Nessuna |
| P5 | useCallback in Grid views | Basso | 4 useCallback | Nessuna (latent) |
| P6 | Rest spread in GridDB/Array | Basso | 10 righe | Solo se si aggiunge memo |

### Ordine consigliato

1. **P0.1 + P0.2 + P0.3** (Form rendering, impatto immediato)
2. **P5** (Grid callbacks, prepara per memo)
3. **P1** su Input + Table + Badge (render boundaries dopo aver preparato upstream)
4. **P2 + P3** (dead code + barrel, pulizia API publica)
5. **P6** solo se necessario dopo P1
6. **P4** (dipendenze opzionali, puo' aspettare)
