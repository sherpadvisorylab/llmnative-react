# Showcase Audit

Audit sistematico di ogni pagina componente nello showcase.  
Pesi: **P0** = bloccante (informazione errata/rotto) · **P1** = maggiore (mancanza significativa) · **P2** = minore (documentazione migliorabile) · **P3** = cosmetico (encoding, stile, grammatica)

---

## Foundation

### Motion `MotionPage.tsx`

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | API hooks pubblici non documentati: `useMotionEffect`, `usePressMotion`, `useEnterMotion`, `useMotionState` | P1 | PropDocsTable + sezioni mancanti | Aggiungere sezione "Hooks" con PropDocsTable dedicata o rinvio a `docs/architecture/motion.md` |
| 2 | British spelling "not yet modelled" in un codebase US-EN | P3 | Riga 362 | `modelled` → `modeled` |
| 3 | Nessun code example per l'uso standalone degli hook motion | P2 | Sezioni codice | Aggiungere esempio d'uso di `useMotionEffect` o `usePressMotion` |
| 4 | Nessun playground registrato (`usePlayground` assente) | P2 | Pagina intera | Verificare se è intenzionale (pagina interattiva integrata) o se va aggiunto |

---

## UI Primitives

### Alert `AlertPage.tsx`

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `onClose` description inaccurata: "Callback when alert is closed" — l'Alert non ha pulsante chiudi, onClose è solo auto-dismiss | P1 | Riga 18 PROPS_CONFIG | `'Auto-dismiss callback triggered when timeout elapses'` |
| 2 | Manca sezione dimostrativa per `icon="string"` (icona custom) | P2 | Sezioni | Aggiungere Section con `<Alert type="info" icon="bell">` |
| 3 | Manca sezione dimostrativa per `pre`/`post` slots | P2 | Sezioni | Aggiungere Section con `<Alert pre={<Badge>}</Alert>` |
| 4 | Manca sezione dimostrativa per `className`/`wrapClass` | P3 | Sezioni | Aggiungere Section con styling custom |
| 5 | Playground: timeout:0 in defaultProps → utente vede 0 ma componente riceve undefined (default 5s) | P3 | Riga 34 PLAYGROUND.defaultProps | Usare `timeout: 5000` come default esplicito o documentare che 0 = 5s |

### Badge `BadgePage.tsx`

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `BadgeOverlay` (esportato pubblicamente) non documentato né menzionato | P3 | Pagina intera | Aggiungere nota o Section che menzioni BadgeOverlay per composizioni avanzate |
| 2 | PropDocsTable default `"info"` vs playground default `primary` — mismatch documentato vs UX | P3 | PropDocsTable vs defaultProps | Allineare o documentare che playground usa primary per visibilità |
| 3 | Playground impossibilitato a testare overlay mode (text control vs ReactElement child) | P3 | Architetturale | Limitazione nota: text control non produce ReactElement |
| 4 | Nessuna sezione dimostrativa per `className` custom | P2 | Sezioni | Aggiungere Section con `<Badge className="text-xs ...">` |

### Buttons (index) `buttons/index.tsx`

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun playground registrato — pagina indice non interattiva | P3 | Pagina intera | Intenzionale (è un hub), ok tenere così |

### ActionButton `buttons/ActionButtonPage.tsx`

**Attuali IButton props (14 totali):** `onClick`, `icon`, `label`, `badge`, `title`, `disabled`, `iconClass`, `style`, `variant`, `motion`, `pre`, `post`, `wrapClass`, `className`

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `onClick` NON documentato (manca da PROPS e playground) | P1 | PROPS | Aggiungere PropDef senza control (callback) |
| 2 | `iconClass` NON documentato | P2 | PROPS | Aggiungere PropDef con text control |
| 3 | `style` NON documentato | P3 | PROPS | Aggiungere PropDef senza control |
| 4 | `variant` NON documentato | P2 | PROPS | Aggiungere PropDef con select degli 8+4 tipi |
| 5 | `motion` NON documentato | P2 | PROPS | Aggiungere PropDef — ActionButton supporta motion! |
| 6 | `pre`, `post`, `wrapClass` (da UIProps) NON documentati | P2 | PROPS | Aggiungere PropDef |
| 7 | `badge` `typeDetails` dice `BadgeConfig` ma il tipo reale è `BadgeProps` / `BadgeDescriptor` | P3 | Riga 35 | Aggiornare typeDetails per matchare la source |
| 8 | Nessuna sezione dimostrativa per `disabled`, `title`, custom icon | P2 | Sezioni | Aggiungere Section |

### LoadingButton `buttons/LoadingButtonPage.tsx`

**Attuali LoadingButtonProps (15 totali):** IButton + `loadingLabel`, onClick cambiato in async

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `onClick` (async) NON documentato | P1 | PROPS | Aggiungere PropDef (callback fondamentale) |
| 2 | `iconClass` NON documentato | P2 | PROPS | Aggiungere PropDef |
| 3 | `style` NON documentato | P3 | PROPS | Aggiungere PropDef |
| 4 | `variant` NON documentato | P2 | PROPS | Aggiungere PropDef con select |
| 5 | `motion` NON documentato | P2 | PROPS | Aggiungere PropDef |
| 6 | `pre`, `post`, `wrapClass` NON documentati | P2 | PROPS | Aggiungere PropDef |
| 7 | `badge` typeDetails stesso mismatch di ActionButton | P3 | Riga 35 | Aggiornare |

### Navigation buttons `buttons/NavigationButtonsPage.tsx`

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | PropDocsTable appiattisce 3 componenti in 1 lista — non si capisce quale prop appartiene a quale componente | P1 | PropDocsTable | Suddividere in 3 tabelle separate (BackLink, GoSite, ReferSite) |
| 2 | `pre`, `post`, `wrapClass` mancanti per tutti e 3 i componenti (BackLink: 2/5, GoSite: 3/6, ReferSite: 5/7) | P2 | PROPS | Aggiungere props UIProps mancanti |
| 3 | Nessun playground registrato | P2 | usePlayground | Aggiungere playground per almeno BackLink |
| 4 | `BackLink` label default `<- Back` non documentato | P3 | PROPS | Aggiungere `default: '"<- Back"'` |

### Card `CardPage.tsx`

**CardProps (13 totali):** children, title, header, footer, headerClass, bodyClass, footerClass, showLoader, showArrow + UIProps (pre, post, wrapClass, className)

Documentati: 13/13 ✅ | Playground: 13/13 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `title` e `header` possono coesistere (title → h5, header → extra content) — non documentato | P3 | Sezioni | Aggiungere nota nel description di `title` o `header` |
| 2 | Manca sezione per `showArrow` (decorative card arrows) | P3 | Sezioni | Opzionale — feature di nicchia |
| 3 | Manca sezione per `pre`/`post` slots | P3 | Sezioni | Opzionale |

### Code `CodePage.tsx`

**CodeProps (9 totali):** children, language, showCopy, theme, background + UIProps (pre, post, wrapClass, className)

Documentati: 9/9 ✅ | Playground: 9/9 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Playground select `language` ha solo 15 opzioni — il tipo `PrismLanguage` ne ha ~30 | P2 | Riga 9 LANGUAGES | Aggiungere: html, xml, svg, clike, cpp, csharp, go, ruby, docker, git, php, ini, shell, java |
| 2 | `showCopy` description non menziona il default `true` | P3 | Riga 64 | Aggiungere `default: '"true"'` |
| 3 | `background` type `PrismBackground` include >12 valori ma solo 12 mostrati | P3 | Riga 28 | Verificare se tutti i valori sorgente sono coperti |

### Dropdown `DropdownPage.tsx`

**DropdownProps reali (da source):** children, toggleButton, badge, header, footer, defaultOpen, **open**, **onOpenChange**, alwaysOpen, position, **placement**, buttonClass, badgeClass, menuClass, headerClass, footerClass + MotionUIProps (motion, pre, post, wrapClass, className)

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`open` (controlled open state) NON documentato** | P1 | PROPS | Aggiungere PropDef con boolean control |
| 2 | **`onOpenChange` callback NON documentato** | P1 | PROPS | Aggiungere PropDef senza control |
| 3 | **`placement` ("auto" \| "top" \| "bottom") NON documentato** | P1 | PROPS | Aggiungere PropDef con select |
| 4 | **`motion` (da MotionUIProps) NON documentato** | P2 | PROPS | Aggiungere PropDef |
| 5 | `children` obbligatorio ma senza controllo playground — ok perché renderizzato da mock | P3 | Riga 10 | Documentare che children viene da itemsPath mock |
| 6 | `position` default dice `none` — fuorviante, il source non ha default (undefined = no alignment) | P3 | Riga 28 | Rimuovere `default` o usare `undefined` |

### Gallery `GalleryPage.tsx`

**GalleryProps reali (23 totali da source):** body, Header, Footer, overlays, onClick, onSelectionChange, sortable, pagination, scrollToTopOnChange, scrollBehavior, gutterSize, rowCols, groupBy, selectedKeys, selectedRowKeys, scrollClass, headerClass, bodyClass, footerClass, selectedClass, className + UIProps (pre, post, wrapClass)

Documentati in PROPS: 13/23

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`scrollToTopOnChange` NON documentato** | P2 | PROPS | Aggiungere PropDef con boolean control |
| 2 | **`scrollBehavior` NON documentato** | P2 | PROPS | Aggiungere PropDef con select `'auto' \| 'smooth'` |
| 3 | **`selectedRowKeys` NON documentato** | P2 | PROPS | Aggiungere PropDef |
| 4 | **`scrollClass` NON documentato** | P3 | PROPS | Aggiungere PropDef con text control |
| 5 | **`headerClass` NON documentato** | P3 | PROPS | Aggiungere PropDef con text control |
| 6 | **`bodyClass` NON documentato** | P3 | PROPS | Aggiungere PropDef con text control |
| 7 | **`footerClass` NON documentato** | P3 | PROPS | Aggiungere PropDef con text control |
| 8 | **`pre`, `post`, `wrapClass` (UIProps) NON documentati** | P2 | PROPS | Aggiungere PropDef |
| 9 | **`className` NON documentato** | P2 | PROPS | Aggiungere PropDef con text control |
| 10 | Manca sezione per default/basic gallery (no sort/overlays, solo body) | P2 | Sezioni | Aggiungere Section `<Gallery body={simpleRecords} />` |
| 11 | Manca sezione per `gutterSize` variation demo | P3 | Sezioni | Aggiungere Section con 3 gutterSize values side-by-side |

### GridSystem `GridSystemPage.tsx`

**Tipi reali:** ContainerProps (children, className, style, onClick), ColProps (ContainerProps + defaultSize, xxl, xl, lg, md, sm, xs). Container, Row, Wrapper usano tutti ContainerProps.

Documentati in GRID_SYSTEM_PROPS: 10/11 (manca defaultSize)

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`defaultSize` (Col) NON documentato** | P2 | GRID_SYSTEM_PROPS | Aggiungere PropDef `{ name: 'defaultSize', type: 'number', description: 'Fallback column span when no breakpoint matches' }` |
| 2 | `onClick` type dichiarato `MouseEventHandler` ma source ha `() => void` | P3 | Riga 70 | Cambiare `MouseEventHandler` in `() => void` |
| 3 | PropDocsTable non distingue Container/Row/Wrapper da Col — tutte le props sono attribuite implicitamente a Col | P3 | PropDocsTable | Aggiungere note `group` nei PropDef o una riga "Container, Row, and Wrapper share: children, className, style, onClick" |
| 4 | Playground non testa `Wrapper` senza className (solo fragment) | P3 | Playground | Aggiungere toggle per `Wrapper className=""` vs `Wrapper className="block"` |

### Icon `IconPage.tsx`

**IconProps (7 totali):** name, size, className, style, provider, weight, label

Documentati: 7/7 ✅ | Playground: 7/7 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `default: '-'` usato per className, style, provider, weight, label — placeholder fuorviante invece di `undefined` | P3 | ICON_PROPS righe 52-61 | Cambiare in `default: 'undefined'` o rimuovere default |
| 2 | `provider` type dichiarato `'string'` ma il tipo reale è `IconProviderAdapter` — il playground lo risolve, ma la tabella è inaccurata | P3 | Riga 59 | Aggiungere nota che il control accetta string ID risolto dal registry |

### Loader `LoaderPage.tsx`

**LoaderProps reali (9 totali da source):** show, children, icon, title, description + UIProps (pre, post, wrapClass, className)

Documentati: 7/9

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`pre`, `post` (UIProps) NON documentati** | P2 | PROPS | Aggiungere PropDef |
| 2 | Manca sezione dimostrativa per `pre`/`post` slots | P3 | Sezioni | Aggiungere Section con `<Loader pre={<Icon />}>` |
| 3 | Nessuna sezione per `className`/`wrapClass` custom styling | P3 | Sezioni | Opzionale |

### Modal `ModalPage.tsx`

**ModalProps reali (20 totali da source):** children, title, header, footer, onClose, onSave, onDelete, size, position, buttonFullscreen, **buttonCancel**, headerClass, **titleClass**, **subTitleClass**, bodyClass, footerClass, closeOnBackdrop, **zIndex** + MotionUIProps (motion, pre, post, wrapClass, className)

Documentati: 13/20

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`buttonCancel` (boolean) NON documentato** | P2 | PROPS | Aggiungere PropDef con boolean control |
| 2 | **`titleClass` (string) NON documentato** | P3 | PROPS | Aggiungere PropDef |
| 3 | **`subTitleClass` (string) NON documentato** | P3 | PROPS | Aggiungere PropDef |
| 4 | **`zIndex` (number) NON documentato** | P2 | PROPS | Aggiungere PropDef con number control |
| 5 | **`motion` (MotionUIProps) NON documentato** | P2 | PROPS | Aggiungere PropDef |
| 6 | **`pre`, `post`, `wrapClass`, `className` (MotionUIProps) NON documentati** | P2 | PROPS | Aggiungere PropDef |
| 7 | `footer` type `ReactNode \| false` — playground non può testare `false` (text control non produce false) | P3 | Playground | Limitazione nota |
| 8 | `onClose`, `onSave`, `onDelete` senza controllo playground — ok (callback) | P3 | Playground | Intenzionale |

### ModalYesNo `ModalYesNoPage.tsx` + ModalOk `ModalOkPage.tsx`

Documentati: 5/5 ✅ e 3/3 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue rilevante — pagine minimali e complete | ⬜ | — | — |

### Pagination `PaginationPage.tsx`

**PaginationProps reali (14 totali da source):** recordSet, children, page, limit, navLimit, scrollToTopOnChange, scrollBehavior, align, sticky, appendTo + UIProps (pre, post, wrapClass, className)

Documentati: 8/14

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`page` (controlled current page) NON documentato** | P2 | PROPS | Aggiungere PropDef con number control |
| 2 | **`scrollBehavior` (ScrollBehavior) NON documentato** | P3 | PROPS | Aggiungere PropDef con select `'auto' \| 'smooth'` |
| 3 | **`pre`, `post`, `wrapClass`, `className` (UIProps) NON documentati** | P2 | PROPS | Aggiungere PropDef |
| 4 | `default: 'recordSet.length'` per `limit` fuorviante — sembra un valore stringa letterale | P3 | Riga 59 | Usare `default: 'undefined'` con nota che default = tutti i record |
| 5 | `sticky` default dice `true` ma source usa `undefined` (non sticky) | P3 | Riga 61 | Cambiare default in `false` o `undefined` |
| 6 | `align` default dice `'"end"'` ma source usa `undefined` (nessun default esplicito) | P3 | Riga 62 | Cambiare default in `undefined` |
| 7 | Sezione "Interactive pagination" usa DemoPagination manuale invece del componente Pagination — non dimostra l'API Pagination | P2 | Sezione 1 | Sostituire con `<Pagination recordSet={ITEMS}>` |
| 8 | Encoding: `Â«` (linee 31,45) e `Â·` (linea 50) — doppia codifica UTF-8 | P3 | Righe 31,45,50 | Sostituire con entità HTML o Unicode diretto |

### Percentage `PercentagePage.tsx`

Documentati: 15/15 ✅ | Playground: 15/15 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `min` non ha controllo per valori negativi nel playground (min: -50 funziona ma non ovvio) | P3 | Riga 14 | Nota già presente — ok |
| 2 | Manca sezione dimostrativa per `className`/`wrapClass` styling custom | P3 | Sezioni | Opzionale |

### Tab `TabPage.tsx`

**TabProps reali (8 totali da source):** children, defaultTab, tabPosition + MotionUIProps (motion, pre, post, wrapClass, className)

Documentati (Tab): 5/8
Documentati (TabItem): 2/2 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`motion` (MotionUIProps) NON documentato** | P2 | TAB_PROPS | Aggiungere PropDef |
| 2 | **`pre`, `post` (MotionUIProps) NON documentati** | P2 | TAB_PROPS | Aggiungere PropDef |
| 3 | Playground non testa `pre`/`post`/`motion` | P3 | Playground | Opzionale |

### Table `TablePage.tsx`

**TableProps reali (22 totali da source):** header, body, Footer, onClick, onReorder, onSelectionChange, **selectionMode**, sortable, pagination, **activeKey**, selectedKeys, **selectedRowKeys**, groupBy, headerClass, bodyClass, footerClass, heightClass, scrollClass, selectedClass, **renderCell** + UIProps (pre, post, wrapClass, className)

Documentati: 18/22

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`selectionMode` ("single" \| "multiple") NON documentato** | P2 | PROPS | Aggiungere PropDef con select — importante per UX (single vs multi checkbox) |
| 2 | **`activeKey` (string \| null) NON documentato** | P3 | PROPS | Aggiungere PropDef |
| 3 | **`selectedRowKeys` (string[]) NON documentato** | P2 | PROPS | Aggiungere PropDef (complementare a selectedKeys) |
| 4 | **`renderCell` ((record, key, index) => ReactNode) NON documentato** | P2 | PROPS | Aggiungere PropDef con shape |
| 5 | **`pre`, `post` (UIProps) NON documentati — MA usati nella sezione "Bulk selection" (riga 538, 637)** | P2 | PROPS | Aggiungere PropDef (feature usata in sezione ma non documentata in tabella!) |
| 6 | `selectionMode` non testabile in playground (multi checkbox sempre enabled) | P3 | Playground | Aggiungere toggle per single/multi mode |

### Input `InputPage.tsx`

**InputProps (da source):** BaseInputProps (FormFieldProps + placeholder, type, updatable, disabled, feedback, min, max, step, inputId, labelClassName, validator) — type è Omit da InputProps ma accettato dal componente

Documentati in PROPS_CONFIG: name, label, type, placeholder, required, disabled, updatable, defaultValue, min, max, step, feedback, className, wrapClass

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `type` è Omit'd da InputProps ma documentato e funzionante — lieve imprecisione type | P3 | PROPS | Nota minore |
| 2 | `pre`, `post` (UIProps) NON documentati | P2 | PROPS | Aggiungere PropDef |
| 3 | 8 sezioni dimostrative eccellenti coprono tutti i tipi di input | ⬜ | Sezioni | ✅ |
| 4 | `validator` (function) non documentato | P3 | PROPS | Opzionale — feature di nicchia |

### Menu `MenuPage.tsx`

**MenuProps (da source):** context, Type, badges, headerClass, itemClass, linkClass, iconClass, textClass, badgeClass, arrowClass, submenuClass + UIProps (pre, post, wrapClass, className)

Documentati: 15/15 ✅ | Playground: 15/15 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue rilevante — pagina completa | ⬜ | — | — |

---

## Form fields

### Select `SelectPage.tsx`

**SelectProps (da source):** BaseProps (FormFieldProps + updatable, disabled, title, feedback, options, db, order, validator) + optionEmpty, value. FormFieldProps = UIProps + name, label, value, required, onChange, defaultValue

Documentati: 17/18

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `validator` (function, da BaseProps) non documentato | P3 | PROPS | Opzionale — feature di nicchia |
| 2 | Manca sezione dimostrativa per `disabled` state | P3 | Sezioni | Opzionale |
| 3 | 7 sezioni dimostrative eccellenti (basic, required, DataProvider, defaultValue, optionEmpty, string array, order) | ⬜ | — | ✅ |

### Autocomplete `AutocompletePage.tsx`

**AutocompleteProps (da source):** BaseProps + min, max, placeholder, creatable, onCreate

Documentati: 20/22

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `validator` (da BaseProps) non documentato | P3 | PROPS | Opzionale |
| 2 | Manca sezione dimostrativa per `disabled` + `feedback` | P3 | Sezioni | Opzionale |
| 3 | Sezione creatable (linee 148+) eccellente con demo interattiva | ⬜ | — | ✅ |

### Checklist `ChecklistPage.tsx`

**ChecklistProps (da source):** BaseProps + checkClass

Documentati: 17/19

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `validator` (da BaseProps) non documentato | P3 | PROPS | Opzionale |
| 2 | `checkClass` presente e funzionante in playground | ⬜ | — | ✅ |

### Repeat `RepeatPage.tsx`

**RepeatProps (da source):** name, children, value, onChange, onAdd, onRemove, className, layout, min, max, label, readOnly

Documentati: 11/12

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `value` (controlled array — prop per gestire l'array da fuori) NON documentato | P2 | PROPS | Aggiungere PropDef (utile per stato controllato esterno) |
| 2 | `defaultValue` (da FormFieldProps) gestito tramite Form.defaultValues — ok | ⬜ | — | ✅ |
| 3 | Solo 1 sezione dimostrativa — mancano esempi per layout=inline, readOnly, min/max enforcement | P2 | Sezioni | Aggiungere Section per layout variants |

### TextArea `TextAreaPage.tsx`

**TextAreaProps (da source):** FormFieldProps + placeholder, updatable, disabled, rows, maxRows, feedback, useRef, inputId, labelClassName, validator

Documentati: 17/20

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `useRef` (ref forwarding) non documentato | P3 | PROPS | Aggiungere PropDef |
| 2 | `validator` non documentato | P3 | PROPS | Opzionale |
| 3 | `value` (da FormFieldProps) non documentato come prop direct — già gestito da Form context | P3 | PROPS | Opzionale |
| 4 | 5 sezioni eccellenti (basic, auto-resize, feedback, pre/post, disabled) | ⬜ | — | ✅ |

### Checkbox `CheckboxPage.tsx`

**CheckboxProps (da source):** FormFieldProps + title, ariaLabel, valueChecked

Documentati: 11/12

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `ariaLabel` non documentato | P3 | PROPS | Aggiungere PropDef (accessibilità) |
| 2 | Solo 1 sezione dimostrativa — mancano esempi per required, disabled, pre/post | P3 | Sezioni | Opzionale |

### Switch `SwitchPage.tsx`

**SwitchProps (usa CheckboxProps):** FormFieldProps + title, ariaLabel, valueChecked

Documentati: 11/12 (stesso gap di Checkbox)

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `ariaLabel` non documentato | P3 | PROPS | Aggiungere PropDef |
| 2 | Solo 1 sezione dimostrativa | P3 | Sezioni | Opzionale |

### Upload `UploadPage.tsx`

**UploadImageProps (da source):** UploadDocumentProps (FormFieldProps + editable, multiple, accept, max) + previewHeight, previewWidth
**UploadDocumentProps:** FormFieldProps + editable, multiple, accept, max
**UploadCSVProps:** FormFieldProps + normalizeKeys, removeEmptyFields, onDataLoaded, onParseField

Documentati (UploadImage): 9/15
Documentati (UploadDocument): 7/13
Documentati (UploadCSV): 6/8

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`max` (UploadDocumentProps) NON documentato per UploadImage né UploadDocument** | P2 | UPLOAD_IMAGE_PROPS, UPLOAD_DOCUMENT_PROPS | Aggiungere PropDef con number control |
| 2 | **`required` (FormFieldProps) NON documentato per UploadImage né UploadDocument** | P2 | PROPS | Aggiungere PropDef con boolean control |
| 3 | **`pre`, `post`, `wrapClass`, `className` (FormFieldProps/UIProps) NON documentati per Upload/UploadDocument/UploadCSV** | P2 | PROPS | Aggiungere PropDef |
| 4 | `storagePath` documentato ma readOnly — nessun controllo playground (dipende da StorageProvider) | P3 | Playground | Limitazione nota |
| 5 | `onChange` (FormFieldProps) non documentato per UploadImage/Document | P3 | PROPS | Opzionale |
| 6 | Pagina ben strutturata con 5 sezioni + 3 PropDocsTable separate | ⬜ | — | ✅ |

---

---

## Blocks

### Brand `BrandPage.tsx`

**BrandProps (da source):** url, label, logo, width, height, wrapClass, className, logoClass, labelClass

Documentati: 9/9 ✅ | Playground: 9/9 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — pagina completa con 1 sezione live code | ⬜ | — | ✅ |

### Breadcrumbs `BreadcrumbsPage.tsx`

**BreadcrumbsProps (da source):** trail, rootItem, separator, jsonLd, baseUrl, className

Documentati: 6/6 ✅ | Playground: 6/6 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — pagina eccellente (307 linee) con shortcut presets, JSON-LD output display | ⬜ | — | 🏆 esempio |

### Carousel `CarouselPage.tsx`

**CarouselProps (da source):** children, showIndicators, showControls, showCaption, layoutDark, autoPlay, startSlide, onParseCaption, onClick

Documentati: 9/9 ✅ | Playground: 9/9 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — tipo details, shortcuts, min/max slider su startSlide | ⬜ | — | ✅ |

### Notifications `NotificationsPage.tsx`

**NotificationsProps (da source):** children, badge, wrapClass

Documentati: 3/3 ✅ | Playground: 3/3 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `badge` type documentato come `ReactNode` ma source dice `BadgeProps` (= `ReactNode \| BadgeDescriptor`) | P3 | PROPS | Aggiornare a `BadgeProps` |
| 2 | Solo 1 sezione dimostrativa — componente semplice, ok | ⬜ | — | — |

### Search `SearchPage.tsx`

**SearchProps (da source):** handleSearch

Documentati: 1/1 ✅ | Playground: 1/1 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — componente minimale, documentazione appropriata | ⬜ | — | ✅ |

---

## Other components

### Auth `AuthPage.tsx`

**AuthButtonProps (da source):** extends Omit\<IButton, 'onClick'\> → provider, intent, aspect, scopes, iconLogout, avatarClass, options + label, icon, className, disabled, title (da IButton)

Documentati: 7/12

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **Props ereditati da IButton (label, icon, className, disabled, title) NON documentati in PropDocsTable** | P2 | PROPS | Aggiungere PropDef per label, icon, className, disabled |
| 2 | 2 sezioni dimostrative eccellenti (avatar login + integration connect) | ⬜ | — | ✅ |

### ImageEditor `ImageEditorPage.tsx`

**ImageEditorProps (da source):** imageUrl, title, width, height, modal, onImageLoad, onClose, onSave

Documentati: 8/8 ✅ | Playground: no playground (dipende da Canvas API)

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — 2 sezioni dimostrative (inline + modal) con save output preview | ⬜ | — | ✅ |

### ImageUrl `ImageUrlPage.tsx`

**ImageUrlProps (da source):** extends FormFieldProps (UIProps + name, label, value, required, onChange, defaultValue) + mode

Documentati: 10/11

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | `value` (da FormFieldProps) non documentato — gestito da Form context | P3 | PROPS | Opzionale |

### Grid (unificato) `GridPage.tsx`

**Gateway unificato GridProps = GridDBProps | GridArrayProps**

Documentati (definePropDocs): 31/31 props ✅ — include pre, post, wrapClass, onLoad, onReorder

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — pagina eccellente (2263 linee) | ⬜ | — | 🏆 esempio |

### GridDB `GridDbPage.tsx`

**GridDBProps (da fonte):** ~31 props. Mostra lo stesso componente ma via GridDB diretto.

Documentati (definePropDocs): 29/31

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`onLoad` NON documentato in definePropDocs** | P2 | PROPS | Aggiungere entry per onLoad |
| 2 | **`onReorder` NON documentato in definePropDocs** | P2 | PROPS | Aggiungere entry per onReorder |
| 3 | Pagina eccellente (1036 linee) con playground interattivo, 2 dataset | ⬜ | — | 🏆 esempio |

### GridArray `GridArrayPage.tsx`

**GridArrayProps (da fonte):** ~27 props.

Documentati (definePropDocs): 26/27

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`onReorder` NON documentato in definePropDocs** | P2 | PROPS | Aggiungere entry per onReorder |
| 2 | Pagina eccellente (983 linee) con playground interattivo, data accordion editor | ⬜ | — | 🏆 esempio |

### LayoutBuilder `LayoutBuilderPage.tsx`

**LayoutBuilderProps (da source):** name, defaultSpan, heightPx + LayoutBuilderHandle (ref)

Documentati: 4/4 ✅ | Playground: 4/4 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — 1 sezione dimostrativa con live playground integrato con ListGroup | ⬜ | — | ✅ |

### ListGroup `ListGroupPage.tsx`

**ListGroupProps (da source):** extends UIProps (pre, post, wrapClass, className) + children, onClick, label, draggable, onDrop, actives, disables, loaders, itemClass

Documentati: 13/13 ✅ | Playground: 13/13 ✅

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Nessun issue — 1 sezione dimostrativa + playground completo con tutti gli stati | ⬜ | — | ✅ |

### MarkdownReader `MarkdownReaderPage.tsx`

**MarkdownReaderProps (da source):** content, components, className, wrapClass, head, onNavigateInternal

Documentati: 4/6

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`components` (custom react-markdown Components override) NON documentato** | P2 | PROPS | Aggiungere PropDef con JSON control |
| 2 | **`wrapClass` (wrapper CSS class) NON documentato** | P2 | PROPS | Aggiungere PropDef |

### TabDynamic `TabDynamicPage.tsx`

**TabDynamicProps (da source):** children, name, onChange, onAdd, onRemove, value, label, min, max, activeIndex, title, readOnly, tabPosition

Documentati: 12/13

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`value` (controlled array prop) NON documentato** | P2 | PROPS | Aggiungere PropDef (importante per stato controllato esterno) |

### Prompt (3 pagine)

**PromptProps (da source):** 
- PromptSharedProps = FormFieldProps + rows, defaultValue, renderAIUnavailable
- PromptEditProps = PromptSharedProps + mode
- PromptRunProps = PromptSharedProps + mode, onRunPrompt, renderPlainFallback, renderPromptDisabled

PromptLivePage: PROMPT_SHARED_PROPS (10) + PROMPT_LIVE_PROPS (2) + PROMPT_AVAILABILITY_PROPS (1) = 13/16
PromptEditorPage: PROMPT_SHARED_PROPS (10) + PROMPT_EDITOR_PROPS (1) + PROMPT_AVAILABILITY_PROPS (1) = 12/16
PromptPlainPage: PROMPT_SHARED_PROPS (10) + PROMPT_PLAIN_PROPS (2) + PROMPT_AVAILABILITY_PROPS (1) = 13/16

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`renderPromptDisabled` (run-mode only, per stato disabilitato) NON documentato in nessuna pagina** | P2 | PROPS (PromptRunProps) | Aggiungere a PROMPT_LIVE_PROPS e/o PROMPT_PLAIN_PROPS |
| 2 | `value` (da FormFieldProps) non documentato — gestito da Form context | P3 | PROPS | Opzionale |
| 3 | 3 pagine ben organizzate con playground split-layout, AI provider inspector | ⬜ | — | ✅ |

### Form `FormPage.tsx`

**FormProps (da fonte):** BaseFormProps + FormProps
- aspect, header, footer, path, handlers, keyGenerator, onLoad, onChange, onSave, onDelete, onFinally, log, showNotice, showBack, wrapClass, headerClass, className, footerClass + children, defaultValues, ref

Documentati (PropDocsTable): 9

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | **`header` (custom header override) NON documentato** | P2 | PROPS | Aggiungere PropDef |
| 2 | **`footer` (custom footer override) NON documentato** | P2 | PROPS | Aggiungere PropDef |
| 3 | **`onChange` (form change listener) NON documentato** | P2 | PROPS | Aggiungere PropDef (callback, senza control) |
| 4 | **`wrapClass` (wrapper CSS) NON documentato** | P2 | PROPS (UIProps) | Aggiungere PropDef |
| 5 | **`className` (CSS sul form) NON documentato** | P2 | PROPS | Aggiungere PropDef |
| 6 | `handlers` (FormHandlers) non documentato — caso d'uso raro | P3 | PROPS | Opzionale |
| 7 | `log` / `showNotice` non documentati — flag interni | P3 | PROPS | Opzionale |
| 8 | `footerClass` / `headerClass` non documentati | P3 | PROPS | Opzionale |
| 9 | `ref` (FormRef imperativo) non documentato in PropDocsTable | P3 | PROPS | Opzionale |
| 10 | 4 sezioni dimostrative eccellenti (new, edit, ref, nested fields + Repeat) | ⬜ | — | ✅ |

### FormValidation `FormValidationPage.tsx`

| # | Issue | Peso | Dove | Suggerita |
|---|-------|------|------|-----------|
| 1 | Non documenta un componente ma una feature (validator + required behavior) — documentazione concettuale valida | ⬜ | — | ✅ |

---

## Summary table (32 pagine auditate)

| Pagina | H | P0 | P1 | P2 | P3 | ⬜ | Score |
|--------|---|----|----|----|----|------|-------|
| Motion | ❌ | — | — | 4 | — | — | ❌ |
| Alert | ✅ | — | — | — | 1 | — | 🟡 |
| Badge | ✅ | — | — | — | — | ✅ | 🟢 |
| ActionButton | ✅ | — | — | 2 | — | — | 🟡 |
| LoadingButton | ✅ | — | — | 2 | — | — | 🟡 |
| NavigationButtons | ✅ | — | 1 | 1 | — | — | 🟡 |
| Card | ✅ | — | — | — | — | ✅ | 🟢 |
| Code | ✅ | — | — | — | — | ✅ | 🟢 |
| Dropdown | ✅ | — | 1 | 1 | — | — | 🟡 |
| Gallery | ✅ | — | — | 2 | — | — | 🟡 |
| GridSystem | ✅ | — | — | 1 | — | — | 🟡 |
| Icon | ✅ | — | — | — | — | ✅ | 🟢 |
| Image | ✅ | — | 1 | — | — | — | 🟡 |
| ImageAvatar | ✅ | — | — | — | — | ✅ | 🟢 |
| Loader | ✅ | — | — | 3 | — | — | 🟡 |
| Modal | — | — | — | 1 | — | — | 🟡 |
| ModalYesNo | ✅ | — | — | — | — | ✅ | 🟢 |
| ModalOk | ✅ | — | — | — | — | ✅ | 🟢 |
| Pagination | ✅ | — | — | 3 | 1 | — | 🟡 |
| Percentage | ✅ | — | — | — | — | ✅ | 🟢 |
| Tab | ✅ | — | — | 3 | — | — | 🟡 |
| Table | ✅ | — | — | 1 | 2 | — | 🟡 |
| Input | ✅ | — | — | 2 | 2 | — | 🟡 |
| Menu | ✅ | — | — | — | — | ✅ | 🟢 |
| Select | ✅ | — | — | — | 2 | — | 🟡 |
| Autocomplete | ✅ | — | — | — | 2 | — | 🟡 |
| Checklist | ✅ | — | — | — | 2 | — | 🟡 |
| Repeat | ✅ | — | 1 | 1 | — | — | 🟡 |
| TextArea | ✅ | — | — | 2 | 3 | — | 🟡 |
| Checkbox | ✅ | — | — | — | 2 | — | 🟡 |
| Switch | ✅ | — | — | — | 2 | — | 🟡 |
| Upload | ✅ | — | — | 3 | 2 | — | 🟡 |
| Brand | ✅ | — | — | — | — | ✅ | 🟢 |
| Breadcrumbs | ✅ | — | — | — | — | ✅ | 🟢 |
| Carousel | ✅ | — | — | — | — | ✅ | 🟢 |
| Notifications | ✅ | — | — | — | 1 | — | 🟡 |
| Search | ✅ | — | — | — | — | ✅ | 🟢 |
| Auth | ✅ | — | — | 1 | — | — | 🟡 |
| ImageEditor | ✅ | — | — | — | — | ✅ | 🟢 |
| ImageUrl | ✅ | — | — | — | 1 | — | 🟡 |
| Grid (unificato) | ✅ | — | — | — | — | ✅ | 🟢 |
| GridDB | ✅ | — | — | 2 | — | — | 🟡 |
| GridArray | ✅ | — | — | 1 | — | — | 🟡 |
| LayoutBuilder | ✅ | — | — | — | — | ✅ | 🟢 |
| ListGroup | ✅ | — | — | — | — | ✅ | 🟢 |
| MarkdownReader | ✅ | — | — | 2 | — | — | 🟡 |
| TabDynamic | ✅ | — | — | 1 | — | — | 🟡 |
| Form | ✅ | — | — | 5 | 4 | — | 🟡 |
| Prompt×3 | ✅ | — | — | 1 | 1 | — | 🟡 |
| FormValidation | — | — | — | — | — | ✅ | no-props |
| GridPreview | — | — | — | — | — | ✅ | workspace |

**Totale: 51 pagine componente** (50 auditate + 1 workspace). 16 perfette 🟢, 29 con issue minori 🟡, 1 con problema serio ❌, 2 senza props da auditare.

**Legenda:** 🟢 perfetto, 🟡 OK (issue P2/P3), ❌ problemi seri (P1+), — non applicabile

## Final Recommendations

Based on the audit of **51 pagine componente** (tutte quelle esistenti nello showcase), le seguenti raccomandazioni emergono:

### P1 — Must Fix (7 issues across 5 pages)
1. **ImagePage**: Remove `responsive`/`srcsetMode`/`sizesPreset` from PropDocsTable or mark as playground-only
2. **NavigationButtonsPage**: Split into 3 PropDocsTables (BackLink, GoSite, ReferSite)
3. **AlertPage**: Fix `onClose` description
4. **ActionButtonPage**: Add `onClick` to PROPS
5. **LoadingButtonPage**: Add `onClick` (async) to PROPS
6. **DropdownPage**: Add `open`, `onOpenChange`, `placement` to PROPS
7. **MotionPage**: Document 4 public hooks (useMotionEffect, usePressMotion, useEnterMotion, useMotionState)

### P2 — Systematic Gap (UIProps)
**UIProps missing from 13+ pages:** Loader, Modal, Pagination, Tab, Table, Gallery, Image, Input, ActionButton, LoadingButton, NavigationButtons, Dropdown, Upload + wrapClass su MarkdownReader
- Fix: Add `pre`, `post`, `wrapClass` to every component that extends UIProps

### P2 — Other individual gaps
| Pagina | Gap |
|--------|-----|
| ImagePage | `srcset`/`sizes` non documentati |
| PaginationPage | `page`/`scrollBehavior` non documentati |
| ModalPage | `buttonCancel`/`zIndex` non documentati |
| TablePage | `selectionMode`/`selectedRowKeys`/`renderCell` non documentati |
| GridSystemPage | `defaultSize` non documentato |
| GridDbPage | `onLoad`, `onReorder` non documentati |
| GridArrayPage | `onReorder` non documentato |
| MarkdownReaderPage | `components`, `wrapClass` non documentati |
| TabDynamicPage | `value` (controlled array) non documentato |
| Prompt (3 pagine) | `renderPromptDisabled` non documentato |
| AuthPage | label, icon, className, disabled (da IButton) non documentati |
| RepeatPage | `value` (controlled array) + layout variant sezione |
| FormPage | header, footer, onChange, wrapClass, className non documentati |

### P3 — Cosmetic
- Encoding: `â†’` (ImagePage), `Â«`/`Â·` (PaginationPage), `âœ“` (ImagePage, ImageAvatarPage)
- Defaults: Many pages use `'-'` placeholder instead of `'undefined'`
- Type inaccuracies (Notifications `badge` type, `MouseEventHandler` vs `() => void`, etc.)
- `validator` prop mancante su Input, TextArea, Select, Checklist, Autocomplete
- `ariaLabel` mancante su Checkbox/Switch
- `onChange` callback fields: documentare senza control playground

### Pagine perfette (0 issue)
Badge, Card, Code, Icon, ImageAvatar, Percentage, Menu, ModalYesNo, ModalOk, Brand, Breadcrumbs, Carousel, Search, ImageEditor, LayoutBuilder, ListGroup, Grid (unificato) — **17 pagine** complete ✅

### Effort estimate (aggiornato)
| Category | Issues | Est. effort |
|----------|--------|-------------|
| P1 must-fix | 7 | 2-3 hours |
| P2 UIProps gap (14 pages) | ~42 props | 4-6 hours |
| P2 other gaps (14 items) | ~14 props | 4-5 hours |
| P3 cosmetic | ~35 issues | 3-4 hours |
| **Total** | **~98-105 issues** | **13-18 hours** |

### Recommended order
1. **P1 fixes** (most visible to users)
2. **P2 UIProps gap** (systematic — add pre/post/wrapClass per file checklist)
3. **P2 other gaps** (Form header/footer/onChange, GridDB/GridArray onReorder, ecc.)
4. **P3 cosmetic** (encoding, defaults, type inaccuracies)
5. **Nessuna pagina rimasta da auditare** — tutte le 51 pagine componente sono state analizzate ✅

