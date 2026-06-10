# Showcase Props Audit — Issue Report

> **Metodo:** Verifica personale prop-per-prop di 18 pagine showcase vs source framework.
> **Data:** 2026-06-10

---

## Categoria A — Nome prop sbagliato (showcase documenta un nome, source ne usa un altro)

La prop **non funziona** a runtime. Se un utente copia il nome dallo showcase, il componente la ignora silenziosamente.

| # | Componente | Showcase dice | Source usa | Danno |
|---|---|---|---|---|
| 1 | Carousel | `layoutDark` | `dark` | Prop ignorata |
| 2 | Carousel | `startSlide` | `initialSlide` | Prop ignorata |
| 3 | Carousel | `onParseCaption` | `renderCaption` | Prop ignorata |
| 4 | Carousel | `onClick` | `onSlideClick` | Prop ignorata |
| 5 | ListGroup | `actives` | `activeIndices` | Prop ignorata |
| 6 | ListGroup | `disables` | `disabledIndices` | Prop ignorata |
| 7 | ListGroup | `loaders` | `loadingIndices` | Prop ignorata |
| 8 | ListGroup | `itemClass` | `itemClassName` | Prop ignorata |
| 9 | MarkdownReader | `head` | `metadata` | Prop ignorata |
| 10 | MarkdownReader | `onNavigateInternal` | `onInternalLinkClick` | Prop ignorata |
| 11 | Modal | `buttonFullscreen` | `allowFullscreen` | Prop ignorata |
| 12 | LoadingButton | `showLoader` | `loading` | Prop ignorata |
| 13 | Card | `showLoader` | `loading` | Prop ignorata |
| 14 | ImageEditor | `imageUrl` | `src` | Prop ignorata |
| 15 | ImageEditor | `modal` | `mode` | Prop ignorata (type anche sbagliato) |
| 16 | Dropdown | `alwaysOpen` | `staticOpen` | Prop ignorata |
| 17 | Dropdown | `itemsPath` | *non esiste* | Prop falsa (artifact playground) |
| 18 | Percentage | `maxItems` | `max` | Prop ignorata |
| 19 | Percentage | `minItems` | `min` | Prop ignorata |
| 20 | Input | `updatable` | `readOnlyAfterSet` | Prop ignorata |
| 21 | Input | `minItems` | `min` | Prop ignorata |
| 22 | Input | `maxItems` | `max` | Prop ignorata |
| 23 | Select | `updatable` | `readOnlyAfterSet` | Prop ignorata |
| 24 | Select | `db` | `optionsSource` | Prop ignorata |
| 25 | Select | `optionEmpty` | `placeholderOption` | Prop ignorata |
| 26 | Autocomplete | `updatable` | `readOnlyAfterSet` | Prop ignorata |
| 27 | Autocomplete | `db` | `optionsSource` | Prop ignorata |
| 28 | Checklist | `updatable` | `readOnlyAfterSet` | Prop ignorata |
| 29 | Checklist | `db` | `optionsSource` | Prop ignorata |
| 30 | Checklist | `checkClass` | `itemClassName` | Prop ignorata |
| 31 | TabDynamic | `minItems` | `min` | Prop ignorata |
| 32 | TabDynamic | `maxItems` | `max` | Prop ignorata |
| 33 | Search | `handleSearch` | `onQueryChange` | Prop ignorata |
| 34 | Brand | `logoClass` | `logoClassName` | Prop ignorata |
| 35 | Brand | `labelClass` | `labelClassName` | Prop ignorata |
| 36 | Grid (3 pagine) | `layout` | `view` | Prop ignorata (TS error) |
| 37 | Grid (3 pagine) | `onAfterAction` | `onComplete` | Prop ignorata (TS error) |
| 38 | Image | `responsive` | *non esiste* | Prop falsa (è di useImage(), non di Image) |
| 39 | Image | `srcsetMode` | *non esiste* | Prop falsa (è di useImage(), non di Image) |
| 40 | Image | `sizesPreset` | *non esiste* | Prop falsa (è di useImage(), non di Image) |
| 41 | Image | `pre` | `before` | Prop ignorata |
| 42 | Image | `post` | `after` | Prop ignorata |
| 43 | Prompt (shared) | `pre` | `before` | Prop ignorata |
| 44 | Prompt (shared) | `post` | `after` | Prop ignorata |
| 45 | Prompt (shared) | `wrapClass` | `wrapperClassName` | Prop ignorata |

> **Totale: 45 occorrenze**

---

## Categoria B — Type mismatch critico

La prop esiste ma il tipo documentato non corrisponde al source.

| # | Componente | Prop | Showcase dice | Source ha | Rischio |
|---|---|---|---|---|---|
| 1 | Form | `appearance` | `"card" \| "none"` | `"card" \| "empty"` | TypeScript error |
| 2 | Form | `onLoad` | `(data: object) => object` | `(record: RecordProps) => void` | Return value ignorato |
| 3 | GridSystem | `xs`–`xxl` | `boolean \| number \| "auto"` | `number \| 'auto'` | `true`/`false` passati sono errati |
| 4 | Icon | `provider` | `string` | `IconProviderAdapter` (oggetto) | Utente passa stringa, componente crasha |
| 5 | Modal | `size` default | `"md"` | risolve a `"lg"` | Aspettativa disallineata |
| 6 | Modal | `onSave`/`onDelete` shape | `HTMLButtonElement` | `HTMLElement` | Type shape errato |
| 7 | Dropdown | `badge` shape | `{ content, type }` | `{ content, variant }` | `type` ignorato |
| 8 | Carousel | `autoPlay.pause` | `"hover" \| false` | `"hover" \| "false" \| "true"` | `false` vs `"false"` |
| 9 | Icon | `weight` | `PhosphorWeight` | `string` | Falso specifico |
| 10 | Select | `db.order` | `{ field, dir }` | `{ [field]: "asc"\|"desc" }` | Struttura diversa |
| 11 | AuthButton | `options` type | `{ label, icon, className, disabled }` | IButton (più campi: loading, variant, before...) | Type incompleto |

---

## Categoria C — Playground render bug

Lo showcase nel playground passa la prop sbagliata al componente. Il playground non funziona per quella prop.

| # | Pagina | Bug |
|---|---|---|---|
| 1 | CardPage | defaultProps ha `pre`/`post`, render legge `p.pre`/`p.post` invece di `p.before`/`p.after` |
| 2 | CheckboxPage | defaultProps ha `pre`/`post`, spread `{...p}` passa `pre`/`post` ignorati da Checkbox |
| 3 | SwitchPage | defaultProps ha `pre`/`post`, spread `{...p}` passa `pre`/`post` ignorati da Switch |
| 2 | SelectPage | `optionsSource={{ path: p.db }}` ma `p.db` è `undefined` |
| 3 | AutocompletePage | Stesso bug Select + passa `min`/`max` invece di `minItems`/`maxItems` |
| 4 | ChecklistPage | `optionsSource={{ path: p.db }}` ma `p.db` è `undefined` |
| 5 | ModalPage | Passa `buttonFullscreen={p.buttonFullscreen}` (source ignora) |
| 6 | CarouselPage | Passa `layoutDark={p.layoutDark}` e `startSlide={p.startSlide}` (source ignora) |
| 7 | ImageEditorPage | Section preview passa `modal` (boolean, source ignora) |
| 8 | LoadingButtonPage | Passa `showLoader={p.showLoader}` (source ignora) |
| 9 | DropdownPage | Passa `alwaysOpen={p.alwaysOpen}` e `itemsPath={p.itemsPath}` (source ignora) |
| 10 | MarkdownReaderPage | Section preview passa `onNavigateInternal` (source ignora) |
| 11 | ImageUrlPage | defaultProps `pre`/`post`, render mappa `pre`→`before` (ok) ma prop table ha `pre`/`post` |
| 12 | ImageUrlPage | `mode` select options `['editor','live']` ma PromptMode enum ha `EDIT="edit"`, `RUN="run"` |
| 13 | Prompt pages | `createPromptPlaygroundDefaults` usa `pre`/`post`/`wrapClass`, render mappa `pre`→`before`, `post`→`after` |

---

## Categoria D — Props source non documentate nello showcase

Il componente supporta queste prop ma lo showcase non le elenca.

| # | Componente | N props mancanti | Props mancanti |
|---|---|---|---|
| 1 | Form | 10 | `header`, `footer`, `handlers`, `onRecordChange`, `log`, `showNotice`, `wrapperClassName`, `headerClassName`, `className`, `footerClassName` |
| 2 | Modal | 10 | `showCancel`, `titleClassName`, `subtitleClassName`, `zIndex`, `allowFullscreen`, `before`, `after`, `wrapperClassName`, `className`, `motion` |
| 3 | Gallery | 10 | `scrollToTopOnChange`, `scrollBehavior`, `scrollClassName`, `headerClassName`, `bodyClassName`, `footerClassName`, `before`, `after`, `wrapperClassName`, `className` |
| 4 | ActionButton | 7 | `loading`, `iconClassName`, `style`, `before`, `after`, `wrapperClassName`, `motion` |
| 5 | LoadingButton | 6 | `iconClassName`, `style`, `before`, `after`, `wrapperClassName`, `motion` |
| 6 | Pagination | 6 | `page`, `scrollBehavior`, `before`, `after`, `wrapperClassName`, `className` |
| 7 | Dropdown | 5 | `open`, `onOpenChange`, `staticOpen`, `placement`, `motion` |
| 8 | Table | 5 | `selection`, `activeKey`, `renderCell`, `before`, `after` |
| 9 | Input | 4 | `readOnlyAfterSet`, `id`, `labelClassName`, `validator` |
| 10 | TextArea | 3 | `readOnlyAfterSet`, `textareaRef`, `validator` |
| 11 | Select | 3 | `readOnlyAfterSet`, `validator`, `placeholderOption` |
| 12 | Carousel | 2 | `onSlideClick`, `renderCaption` |
| 13 | MarkdownReader | 2 | `components`, `wrapperClassName` |
| 14 | ImageEditor | 1 | `mode` |
| 15 | Checkbox | 2 | `ariaLabel`, `inheritWrapperClassName` |
| 16 | Switch | 2 | `ariaLabel`, `inheritWrapperClassName` |
| 17 | Tab | 3 | `before`, `after`, `motion` |
| 18 | AuthButton | 5 | `label`, `icon`, `title`, `disabled`, `className` |
| 19 | UploadDocument | 3 | `before`, `after`, `onChange` |
| 20 | UploadImage | 3 | `before`, `after`, `onChange` |
| 21 | UploadCSV | 2 | `before`, `after` |
| 22 | Loader | 2 | `before`, `after` |
| 23 | ImageUrl | 2 | `value`, `inheritWrapperClassName` |
| 24 | Prompt (3 pagine) | 2 | `renderAIUnavailable` (non inclusa in PropDocsTable), `inheritWrapperClassName` |
| 15 | GridSystem Col | 1 | `defaultSize` |
| 16 | Search | 1 | `onQueryChange` |
| 17 | Image | 2 | `srcset`, `sizes` |

---

## Categoria E — Required / Default errati

| # | Componente | Prop | Showcase | Source |
|---|---|---|---|---|
| 1 | Table | `records` | required: true | optional |
| 2 | Code | `language` | required: true | optional |
| 3 | Icon | `name` | required: true | optional |
| 4 | Modal | `size` default | `"md"` | `"lg"` (effective) |

---

## Riepilogo per componente

| Componente | Cat A (nomi) | Cat B (type) | Cat C (playground) | Cat D (mancanti) | Cat E (req/default) | Totale |
|---|---|---|---|---|---|---|
| Carousel | 4 | 1 | 1 | 2 | 0 | 8 |
| ListGroup | 4 | 0 | 0 | 0 | 0 | 4 |
| MarkdownReader | 2 | 0 | 1 | 2 | 0 | 5 |
| Modal | 1 | 3 | 1 | 10 | 1 | 16 |
| LoadingButton | 1 | 0 | 1 | 6 | 0 | 8 |
| Card | 1 | 0 | 1 | 0 | 0 | 2 |
| Image | 5 | 0 | 0 | 2 | 0 | 7 |
| ImageEditor | 2 | 0 | 1 | 1 | 0 | 4 |
| Dropdown | 2 | 1 | 1 | 5 | 0 | 9 |
| Percentage | 2 | 0 | 0 | 0 | 0 | 2 |
| Input | 3 | 0 | 0 | 4 | 0 | 7 |
| Select | 3 | 1 | 1 | 3 | 0 | 8 |
| TextArea | 1 | 0 | 0 | 3 | 0 | 4 |
| Autocomplete | 2 | 0 | 1 | 0 | 0 | 3 |
| Checklist | 3 | 0 | 1 | 0 | 0 | 4 |
| TabDynamic | 2 | 0 | 0 | 0 | 0 | 2 |
| Search | 1 | 0 | 0 | 1 | 0 | 2 |
| Brand | 2 | 0 | 0 | 0 | 0 | 2 |
| Grid (3 pagine) | 2 | 0 | 0 | 0 | 0 | 2 |
| Form | 0 | 2 | 0 | 10 | 0 | 12 |
| GridSystem | 0 | 1 | 0 | 1 | 0 | 2 |
| Icon | 0 | 2 | 0 | 0 | 1 | 3 |
| Table | 0 | 0 | 0 | 5 | 1 | 6 |
| Gallery | 0 | 0 | 0 | 10 | 0 | 10 |
| Code | 0 | 0 | 0 | 0 | 1 | 1 |
| Pagination | 0 | 0 | 0 | 6 | 0 | 6 |
| Checkbox | 0 | 0 | 1 | 2 | 0 | 3 |
| Switch | 0 | 0 | 1 | 2 | 0 | 3 |
| Tab | 0 | 0 | 0 | 3 | 0 | 3 |
| AuthButton | 0 | 1 | 0 | 5 | 0 | 6 |
| UploadDocument | 0 | 0 | 0 | 3 | 0 | 3 |
| UploadImage | 0 | 0 | 0 | 3 | 0 | 3 |
| UploadCSV | 0 | 0 | 0 | 2 | 0 | 2 |
| Loader | 0 | 0 | 0 | 2 | 0 | 2 |
| ImageUrl | 0 | 0 | 2 | 2 | 0 | 4 |
| Prompt (3 pagine) | 3 | 0 | 1 | 2 | 0 | 6 |
| **Totale** | **45** | **11** | **15** | **97** | **4** | **172** |
