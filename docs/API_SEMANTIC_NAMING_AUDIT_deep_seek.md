# DeepSeek Review: API_SEMANTIC_NAMING_AUDIT (Post-Reconciliation)

**Reviewer:** deepseek-v4-flash-free via @llmnative/react AI agent
**Date:** 2026-05-29 (reconciled 2026-06-06)
**Status:** Post-reconciliation — the parent audit has accepted key corrections.

## Executive Summary

Il parent audit (`API_SEMANTIC_NAMING_AUDIT.md`) e' stato aggiornato dopo la mia prima revisione, incorporando quasi tutte le correzioni proposte. Le differenze residue sono poche e documentate nella sezione 3.

## 1. Corrections Accepted by the Audit

Le seguenti mie proposte sono state accettate e integrate nell'audit:

| My critique | Audit action |
|---|---|
| `Grid.layout` -> `view` (not keep `layout`) | ✅ Accettato — audit line 478 |
| `Form.aspect` -> `appearance` (not `variant`) | ✅ Accettato — audit line 319 |
| `Percentage.shape` -> `appearance` (not `layout`) | ✅ Accettato — audit line 563 |
| `AssistantAI.viewMode` -> `view` (not `layout`) | ✅ Accettato — audit line 453 |
| `Prompt.defaultValue` -> `initialValue` (not `initialPromptState`) | ✅ Accettato — audit line 438 |
| Allineamento con CLAUDE.md naming categories | ✅ Accettato — audit lines 60-62, 248-254 |
| Aggiunta Review Notes section | ✅ Accettato — audit lines 862-879 |

## 2. Points Where the Audit Disagreed (and My Rebuttal)

### 2.1 `onFinally` -> `afterRecordMutation`

**Audit position:** "the runtime does not express generic `finally` semantics strongly enough; `afterRecordMutation` remains the clearer AI-facing name"

**My rebuttal:** L'audit ha ragione sul fatto che `finally` e' semanticamente specifico (try/catch/finally), ma:

- `afterRecordMutation` e' lungo (19 char vs 9)
- E' meno preciso semanticamente: suggerisce "dopo qualsiasi mutazione" ma non specifica "sempre, anche in caso di errore"
- `onFinally` e' un pattern noto a ogni sviluppatore JavaScript/TypeScript

**Proposta di compromesso:** `onFinally` non e' perfetto, ma `afterRecordMutation` perde la garanzia di esecuzione. Suggerisco `onFinally` o `afterSaveOrDelete` (piu' esplicito sul "cosa", anche se non dice "sempre").

**Verdetto:** Rispetto la decisione dell'audit, ma rimango leggermente favorevole a `onFinally`.

### 2.2 Dead code non classificato come tale

**Audit position:** `Component.tsx`, `Template.tsx`, `FormEnhancer.tsx` "are still exported or still referenced in the current repository"

**My rebuttal:** Essere esportati non significa essere vivi. Vediamo i fatti:

- `Component.tsx`: esportato, ma nessun consumer reale nel framework. Lo scaffolding non lo genera. E' legacy del vecchio sistema schema-driven.
- `Template.tsx`: esportato, ma il suo unico consumer (`FormTemplate2`) non e' mai usato in produzione.
- `FormEnhancer.tsx`: menzionato dall'audit stesso come "if retained" — se serve un "if" per giustificarlo, e' candidato alla rimozione.

Questi file **aumentano il peso cognitivo** per un AI che deve analizzare il codebase per capire cosa usare. Un AI vede `Component.tsx` e Template.tsx come API pubbliche valide, sprecando token per analizzarle quando sono effettivamente morte.

**Proposta:** Marquarli come `@deprecated` con JSDoc e un messaggio che rimanda alle alternative (Form/Grid), e programmarne la rimozione in una CR dedicata.

## 3. Residual Observations Not Addressed by the Audit

Queste osservazioni della mia prima revisione rimangono valide e non sono state affrontate dall'audit.

### 3.1 `db` -> `optionsSource` e' troppo generico

L'audit propone `optionsSource` per `Select.db`. `optionsSource` non dice se i dati arrivano da un database, un'API, una funzione. Suggerisco:

| Proposta audit | Mia alternativa | Motivo |
|---|---|---|
| `optionsSource` | `remoteOptions` | dice che le opzioni vengono da una fonte remota, senza specificare il backend |

Oppure, piu' radicalmente: dato che `db` puo' puntare a Firebase o Supabase, e il sistema e' provider-agnostic, si potrebbe usare `from` o `dataSource` — ma entrambi sono troppo generici. `remoteOptions` e' il miglior compromesso.

### 3.2 `Image.label` -> `alt` e' giusto, ma con caveat

L'audit dice `label` -> `alt` su Image. Corretto semanticamente per lo standard HTML. Tuttavia:

- `label` e' semanticamente valido per accessibilita' in senso lato
- Se un componente accetta sia `label` (per uso generico) che `alt` (per immagini), la coerenza e' piu' importante della specificita'

**Verdetto:** `alt` e' piu' corretto per immagini. L'audit ha ragione.

### 3.3 `value` + `onChange` pattern (mancante)

L'audit non affronta il pattern piu' comune dei field: `value` (controlled) vs `defaultValue`/`initialValue` (uncontrolled). Suggerisco di aggiungere una nota esplicita:

| Prop | Stato | Note |
|---|---|---|
| `value` | keep | controlled mode |
| `onChange` | keep | field-level |
| `initialValue` | rename (da `defaultValue`) | uncontrolled initial value |

Il pattern controlled/uncontrolled e' fondamentale per un AI che genera forms.

### 3.4 `scrollRef` / `containerRef` non standardizzato

Componenti come Modal, Pagination, Table hanno bisogno di riferimenti al contenitore scrollabile. Non c'e' una prop standardizzata. Suggerisco `containerRef` come nome canonico.

### 3.5 `aria-*` props di accessibilita' non standardizzate

Non c'e' una sezione dedicata all'accessibilita'. Props come `aria-label`, `role`, `tabIndex` non hanno un pattern prevedibile. Per un framework AI-first, l'accessibilita' dovrebbe essere prevedibile senza dover ispezionare il componente.

### 3.6 Manca verifica test-driven

L'audit non menziona come verificare che i rename non rompano niente. Ogni rename dovrebbe essere accompagnato da:

1. `git grep` del nome vecchio in tutto il codebase
2. Update del test file corrispondente
3. Un test di integrazione che verifichi il componente con la nuova prop
4. Verifica che `npm run build && npm run test` passi

### 3.7 `headerClass`, `footerClass`, `bodyClass` -> classe singola vs area multipla

L'audit propone `headerClassName`, `footerClassName`, `bodyClassName` (standardizzare il suffix). Corretto.

Ma c'e' una sfumatura: alcuni componenti hanno **una sola area intermedia** (es. Card: solo `bodyClass`), mentre altri ne hanno **multiple** (es. Grid: header, body, footer). Suggerisco una nota per distinguere:

| Scenario | Prop |
|---|---|
| Singola area intermedia | `contentClassName` |
| Multiple aree distinte | `headerClassName`, `bodyClassName`, `footerClassName` |

## 4. Mapping Table: Current -> Canonical (Complete Reference)

Questa tabella riassume il mapping completo da nomi attuali a nomi canonici, consolidando audit + mie osservazioni.

### 4.1 Styling

| Current | Canonical | Scope |
|---|---|---|
| `wrapClass` | `wrapperClassName` | tutti i componenti con wrapper |
| `className` | `className` (keep) | elemento centrale/base |
| `headerClass` | `headerClassName` | Form, Card, Modal |
| `footerClass` | `footerClassName` | Form, Card, Modal |
| `bodyClass` | `bodyClassName` o `contentClassName` | Card, Modal, Gallery |
| `buttonClass` | `triggerClassName` | Dropdown |
| `checkClass` | `itemClassName` | Checklist |
| `menuClass` | `menuClassName` | Dropdown |
| `iconClass` | `iconClassName` | Buttons, Brand, Menu |
| `heightClass` | `heightClassName` o `viewportClassName` | Table |
| `subTitleClass` | `subtitleClassName` | Modal |
| `labelClass` | `labelClassName` | Brand |
| `logoClass` | `logoClassName` | Brand |
| `badgeClass` | `badgeClassName` | Dropdown |
| `inheritFormWrapClass` | `inheritFieldSpacing` | field components |

### 4.2 Slots

| Current | Canonical | Note |
|---|---|---|
| `pre` | `before` | Tutti i componenti con slot |
| `post` | `after` | Tutti i componenti con slot |

### 4.3 Data & Path

| Current | Canonical | Note |
|---|---|---|
| `path` | `resourcePath` | Grid lista |
| `sourcePath` | `resourcePath` | Grid (merge con `path`) |
| `fromUrl` | `resourcePathFromUrl` | Grid |
| `dataStoragePath` | `recordPath` | Form singolo record |
| `dataSource` | `recordPath` | FormTemplate2 |
| `template` | `templatePath` | FormTemplate2 |
| `recordId` | `recordKey` | Grid |
| `setPrimaryKey` | `createRecordKey` | Form |
| `body` | `records` | Table, Gallery |
| `header` (Table) | `columns` | Table (per allineamento con Grid) |

### 4.4 Values & Initialization

| Current | Canonical | Note |
|---|---|---|
| `defaultValue` | `initialValue` | field-level |
| `defaultValues` | `initialValues` | form-level |
| `defaultTab` | `initialIndex` | Tab |
| `startSlide` | `initialSlide` | Carousel |
| `optionEmpty` | `placeholderOption` | Select |
| `valueChecked` | `checkedValue` | Checkbox, Switch |

### 4.5 Callbacks & Lifecycle

| Current | Canonical | Note |
|---|---|---|
| `Form.onChange` | `onRecordChange` | Form riceve intero record |
| `Form.onLoad` | `onRecordLoad` | side effect, return ignorato |
| `Grid.onLoad` | `transformLoadedRecords` | trasforma collezione |
| `Form.onSave` | split: `transformRecordBeforeSave` + `resolveRecordPath` | |
| `Grid.onSave` | split: `transformRecordBeforeSave` + `resolveRecordPath` | |
| `onDelete` | `beforeDelete` | Form, Grid |
| `onFinally` | `afterRecordMutation` | (o `onFinally` — vedi 2.1) |
| `onAfterAction` | `onActionComplete` | Grid |
| `handleSearch` | `onQueryChange` | Search |
| `onClickRow` | `onRowClick` | Grid |
| `Table.onClick` | `onRowClick` | Table |
| `Gallery.onClick` | `onItemClick` | Gallery |

### 4.6 View, Appearance, Layout (CLAUDE.md alignment)

| Current | Canonical | Categoria | Note |
|---|---|---|---|
| `Grid.layout` | `view` | view | table/gallery = rappresentazione dati |
| `AssistantAI.viewMode` | `view` | view | list/carousel = rappresentazione dati |
| `Form.aspect` | `appearance` | appearance | card/plain = guscio visuale |
| `Percentage.shape` | `appearance` | appearance | bar/circle = guscio visuale |
| `Tab.tabPosition` | `layout` | layout | top/left/right/bottom = disposizione |
| `TabDynamic.tabPosition` | `layout` | layout | top/left/right/bottom = disposizione |
| `Carousel.layoutDark` | `dark` | mode (o variant) | boolean dark mode, non layout |
| `Buttons.variant` | `variant` | variant | primary/secondary/danger — gia' corretto |
| `Alert.type` | `tone` | variant (sub) | subtone del variant |
| `Badge.type` | `tone` | variant (sub) | subtone del variant |
| `Percentage.type` | `tone` | variant (sub) | subtone del variant |
| `Modal.size` | `size` | size | gia' corretto |

### 4.7 UI Controls

| Current | Canonical | Note |
|---|---|---|
| `toggleButton` | `trigger` | Dropdown |
| `buttonFullscreen` | `allowFullscreen` | Modal, GridAction |
| `buttonCancel` | `showCancel` | Modal |
| `inputId` | `id` | Input |
| `useRef` | `inputRef` | TextArea |
| `updatable` | `lockAfterInitialValue` | field components |
| `editable` | `canEdit` | Upload |
| `showLoader` | `loading` | Buttons, Card |
| `isFixed` | `fixedPosition` | Alert |
| `descriptorOnly` | `renderDescriptorOnly` | Badge |

## 5. Priority Refactor (Reconciled)

### Tier 0: Safety net
- Assicurarsi che `npm run build && npm run test` passi prima di iniziare
- `git stash` di eventuali modifiche non correlate

### Tier 1: UIProps foundation (cross-component, massimo impatto)
1. `UIProps`: `pre/post/wrapClass` -> `before/after/wrapperClassName`
2. `className` rimane invariato

### Tier 2: Data & path semantics (Form + Grid + Table + Gallery)
1. Grid: `path` -> `resourcePath`, `sourcePath` -> `resourcePath` (merge), `fromUrl` -> `resourcePathFromUrl`
2. Grid: `recordId` -> `recordKey`
3. Form: `dataStoragePath` -> `recordPath`
4. Form: `setPrimaryKey` -> `createRecordKey`
5. Table: `header` -> `columns`, `body` -> `records`, `Footer` -> `footer`
6. Gallery: `body` -> `records`, `Header` -> `header`, `Footer` -> `footer`

### Tier 3: Lifecycle callbacks (Form + Grid)
1. Form: `onSave` split in `transformRecordBeforeSave` + `resolveRecordPath`
2. Grid: `onSave` split in `transformRecordBeforeSave` + `resolveRecordPath`
3. Form: `onLoad` -> `onRecordLoad`
4. Grid: `onLoad` -> `transformLoadedRecords`
5. Form + Grid: `onDelete` -> `beforeDelete`
6. Grid: `onAfterAction` -> `onActionComplete`
7. Form: `onChange` -> `onRecordChange`
8. Form: `onFinally` -> `afterRecordMutation`

### Tier 4: View / Appearance / Layout alignment
1. `Grid.layout` -> `Grid.view`
2. `Form.aspect` -> `Form.appearance`
3. `Percentage.shape` -> `Percentage.appearance`
4. `AssistantAI.viewMode` -> `AssistantAI.view`
5. `Tab.tabPosition` -> `Tab.layout`
6. `TabDynamic.tabPosition` -> `TabDynamic.layout`
7. `Carousel.layoutDark` -> `Carousel.dark`

### Tier 5: Field ecosystem
1. `defaultValues` -> `initialValues` (Form)
2. `defaultValue` -> `initialValue` (field components)
3. `optionEmpty` -> `placeholderOption` (Select)
4. `updatable` -> `lockAfterInitialValue` (field components)
5. `valueChecked` -> `checkedValue` (Checkbox, Switch)
6. `useRef` -> `inputRef` (TextArea)
7. `inheritFormWrapClass` -> `inheritFieldSpacing`
8. `min/max` -> `minItems/maxItems` (Repeat, TabDynamic)
9. `editable` -> `canEdit` (Upload)
10. `max` -> `maxFiles` (Upload)
11. `db` -> `remoteOptions` (Select)

### Tier 6: Visual & slot consistency
1. `type` -> `tone` (Alert, Badge, Percentage)
2. `Percentage.background` -> `Percentage.trackTone`
3. `toggleButton` -> `trigger` (Dropdown)
4. `buttonClass` -> `triggerClassName` (Dropdown)
5. `buttonFullscreen` -> `allowFullscreen` (Modal, GridAction)
6. `buttonCancel` -> `showCancel` (Modal)
7. `handleSearch` -> `onQueryChange` (Search)
8. `showLoader` -> `loading` (Buttons, Card)
9. `isFixed` -> `fixedPosition` (Alert)
10. `defaultTab` -> `defaultIndex` (Tab)
11. `startSlide` -> `initialSlide` (Carousel)
12. `inputId` -> `id` (Input)
13. `Children` as data -> `items` (Notifications)
14. `imageUrl` -> `src` (ImageEditor)
15. `Image.label` -> `Image.alt`
16. `Brand.logo` -> `Brand.logoSrc`
17. `Brand.url` -> `Brand.href`
18. `GoSite.url` -> `GoSite.href`
19. `ReferSite.url` -> `ReferSite.href`
20. `ReferSite.imageUrl` -> `ReferSite.imageSrc`
21. `GridAction.run` -> `GridAction.execute`
22. `onParseCaption` -> `renderCaption` (Carousel)
23. `Prompt.renderPlainFallback` -> `Prompt.renderFallbackValueEditor`
24. `Prompt.renderPromptDisabled` -> `Prompt.renderDisabledPromptFallback`

### Tier 7: Casing & normalization
1. `srcset` -> `srcSet` (Image)
2. `heightPx` -> `height` (LayoutBuilder)
3. `Grid.editDeepLink` -> `Grid.syncSelectionToUrl`
4. `Menu.context` -> `Menu.menuKey`
5. `Menu.Type` -> `Menu.as`
6. `MarkdownReader.head` -> `MarkdownReader.metadata`
7. `MarkdownReader.onNavigateInternal` -> `MarkdownReader.onInternalLinkClick`
8. `ImageEditor.modal` -> `ImageEditor.renderInModal`
9. `Code.html()` -> `Code.renderView()`
10. `Code.form()` -> `Code.renderForm()`
11. `Table.selectionMode` -> `Table.selection`
12. `Table.selectedRowKeys` -> `Table.selectedKeys`
13. `Gallery.selectedRowKeys` -> `Gallery.selectedKeys`
14. `Percentage.val` -> `Percentage.value`
15. `AssistantAI.promptTopic` -> `AssistantAI.promptTemplate`
16. `AssistantAI.configVariables` -> `AssistantAI.promptVariables`
17. `Dropdown.alwaysOpen` -> `Dropdown.staticOpen`

## 6. Conclusione Finale

L'audit e' ora in ottimo stato. Dopo la riconciliazione:

**Non ci sono piu' disaccordi sostanziali.** Le uniche divergenze residue sono:

1. `onFinally` vs `afterRecordMutation` — preferenza stilistica, non bloccante
2. Dead code da marcare `@deprecated` prima della rimozione — riguarda file fuori scope dell'audit

Il piano di refactor (Tier 0-7) e' pronto per essere eseguito. Ogni Tier produce un commit separato, con build + test che passano a ogni passo.
