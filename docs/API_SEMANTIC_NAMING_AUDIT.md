# API Semantic Naming Audit

Last reviewed: 2026-06-06
Scope: public component API exported from `src/components/index.ts` and the field/widget APIs directly consumed through `@llmnative/react`.
Goal: define a single AI-friendly semantic vocabulary so an LLM can predict component signatures without reading implementation details.

## Verification Protocol

This file follows a double-check process.

1. Per-component verification
   Every component section below was written after checking the source file for the live prop names and runtime behavior.
2. Final reverse verification
   After drafting the file, the document must be re-read against source files from bottom to top to confirm that:
   - current prop names are real
   - suggested names do not collide with stronger existing semantics elsewhere
   - identical semantics use identical names across components

## Source Of Truth

- Framework naming conventions: `CLAUDE.md`
- Public exports: `src/components/index.ts`
- Cross-cutting prop base: `src/components/types.ts`
- Form API: `src/components/widgets/Form.tsx`
- Grid API: `src/components/widgets/grid-core/types.ts`

## How To Read This File

This audit is organized around **current public input props**.

Core rule:

- one row = one current prop name with one precise semantic function

This means the matrix does **not** start from the target canonical API.

It starts from the API that exists today.

The second rule is the normalization rule:

- if two different rows receive the same proposed refactor name, they are semantically equivalent and should be fused in the refactor

So the matrix must be read in this order:

1. identify the current prop name
2. verify its exact semantic function as implemented today
3. verify all components already using that exact current prop for that exact semantic
4. verify all components expressing the same semantic with a different current prop name
5. read the proposed refactor name
6. infer semantic equivalence classes only from equal proposed refactor names

Important correction:

- `wrapClass` and `className` are **not** the same semantic in the current framework
- `wrapClass` means: add a wrapper element class around the component
- `className` means: customize the central or base rendered element of the component

Important alignment rule:

- when this audit proposes canonical names, they must be compatible with the framework categories already defined in `CLAUDE.md`
- especially: `view`, `appearance`, `layout`, `mode`, `variant`, `position`, `size`

The `Component Audit` remains below as traceability support, but the matrix is the primary artifact.

## Executive Summary

The main issue is not only that some prop names are weak.

The real issue is that the same **semantic function** is currently exposed with different names in different components.

That is exactly what forces an AI to inspect the codebase instead of trusting the signatures.

The most important semantic inconsistencies are:

1. styling semantics
   Distinct functions are currently too close in naming: `wrapClass`, `className`, area-specific classes
2. slot injection semantics
   Same function, current names: `pre`, `post`
3. data source semantics
   Same function, multiple names: `dataStoragePath`, `path`, `sourcePath`, `dataSource`, `template`
4. record identity semantics
   Same function, multiple names: `recordId`, `setPrimaryKey`, internal `key`
5. initialization semantics
   Same function, multiple names: `defaultValue`, `defaultValues`, `startSlide`, `defaultTab`
6. mutation lifecycle semantics
   Same function, multiple names: `onLoad`, `onSave`, `onDelete`, `onFinally`, `onAfterAction`
7. collection payload semantics
   Same function, multiple names: `body`, `records`, `children` used as data payload
8. visual status semantics
   Same function, multiple names: `type`, `background`, `layoutDark`
9. representation / appearance / layout semantics
   Same function families are currently mixed: `layout`, `shape`, `aspect`, `viewMode`, `tabPosition`, `position`
10. UI action trigger semantics
   Same function, multiple names: `toggleButton`, `buttonFullscreen`, `buttonCancel`, `handleSearch`

## Functional Semantic Matrix

This is the primary decision table.

Important:

- one row = one current prop name with one current semantic
- two different rows can legitimately converge to the same proposed refactor name
- if that happens, those rows represent the same semantic function with different current names
- if one current prop is used with two different semantics, it must appear in separate rows or be explicitly marked as semantically broken

The first verified block below is the foundation block. It has been re-checked against source code line by line.

| Functional semantic | Current prop name | Components already using that prop name for that semantic | Components implementing the same semantic with a different prop name | Proposed refactor name | Safe? | Why the proposed words are AI-clear | Final verdict |
|---|---|---|---|---|---|---|---|
| add an outer wrapper element class around the component | `wrapClass` | `Alert`, `Badge`, `Brand`, `Dropdown`, `Menu`, `Notifications`, `LoadingButton`, `ActionButton`, `BackLink`, `GoSite`, `ReferSite`, `Card`, `Code`, `Form`, `GridPresentation`, `GridTableView`, `GridGalleryView`, `Gallery`, `Image`, `ImageAvatar`, `Loader`, `Modal`, `Pagination`, `Percentage`, `Prompt`, `Tab`, `UploadCSV`, `AssistantAI`, `ImageUrl`, `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `Checkbox`, `Switch`, `TextArea`, `ListGroup`, `Select`, `Autocomplete`, `Checklist`, `UploadDocument`, `UploadImage` | none with a different current prop name for the same explicit wrapper-class semantic | `wrapperClassName` | `safe` | says explicitly that this class belongs to the wrapper element | keep this semantic distinct from `className`; do not fuse them |
| customize the central or base rendered element of the component | `className` | `Alert`, `Badge`, `Brand`, `Breadcrumbs`, `LoadingButton`, `ActionButton`, `BackLink`, `GoSite`, `ReferSite`, `Code`, `Dropdown`, `Form`, `Image`, `Loader`, `Menu`, `Modal`, `Pagination`, `Percentage`, `Repeat`, `Tab`, `Table`, `MarkdownReader`, `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `Checkbox`, `Switch`, `TextArea`, `ListGroup`, `Select`, `Autocomplete`, `Checklist`, `UploadDocument`, `UploadImage`, `AssistantAI`, `ImageUrl`, `GridSystem.Wrapper`, `GridSystem.Container`, `GridSystem.Row`, `GridSystem.Col` | `Card (bodyClass)`, `Gallery (bodyClass)`, `Modal (bodyClass)`, `Table (bodyClass)` | `className` | `safe` | standard React name for the main styled element | keep as the base-element styling prop; `MarkdownReader` is internally ambiguous because `wrapClass` and `className` hit the same DOM node |
| inject content before the main rendered content | `pre` | `Alert`, `Badge`, `Menu`, `LoadingButton`, `ActionButton`, `BackLink`, `GoSite`, `ReferSite`, `Code`, `Gallery`, `GridPresentation`, `GridTableView`, `GridGalleryView`, `Image`, `ImageAvatar`, `Loader`, `Modal`, `Pagination`, `Percentage`, `Prompt`, `Tab`, `Table`, `UploadCSV`, `AssistantAI`, `ImageUrl`, `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `Checkbox`, `Switch`, `TextArea`, `ListGroup`, `Select`, `Autocomplete`, `Checklist`, `UploadDocument`, `UploadImage` | none with a different explicit prop name today | `before` | `safe` | plain English slot name that directly expresses placement | semantically stable and broadly uniform; rename globally for readability |
| inject content after the main rendered content | `post` | `Alert`, `Badge`, `Menu`, `LoadingButton`, `ActionButton`, `BackLink`, `GoSite`, `ReferSite`, `Code`, `Gallery`, `GridPresentation`, `GridTableView`, `GridGalleryView`, `Image`, `ImageAvatar`, `Loader`, `Modal`, `Pagination`, `Percentage`, `Prompt`, `Tab`, `Table`, `UploadCSV`, `AssistantAI`, `ImageUrl`, `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `Checkbox`, `Switch`, `TextArea`, `ListGroup`, `Select`, `Autocomplete`, `Checklist`, `UploadDocument`, `UploadImage` | none with a different explicit prop name today | `after` | `safe` | plain English slot name that directly expresses placement | semantically stable and broadly uniform; rename globally for readability |
| declare a list or collection data source | `path` | `GridDB`, `Grid (DB branch)` | `GridCore (sourcePath)`, `GridDB (fromUrl)`, `Grid (DB branch via fromUrl)` | `resourcePath` | `design choice` | separates generic resource scope from single-record scope | same semantic currently split across three names |
| declare a concrete single-record data source | `dataStoragePath` | `Form`, `FormDatabase`, `FormModel`, `FormTemplate` | `FormTemplate2 (dataSource)` | `recordPath` | `safe` | says this path points to one concrete record, not generic storage | same semantic, multiple names |
| declare a template source | `template` | `FormTemplate2` | `Template.loadFromDatabase(path)` | `templatePath` | `safe` | binds the prop to a template source instead of a generic value | same semantic, multiple names |
| identify an existing record | `recordId` | `GridCore`, `GridArray`, `GridDB`, `GridTableView`, `GridGalleryView`, `Grid` | none with another current prop name in public API | `recordKey` | `safe` | backend-agnostic word that still signals stable identity | current naming is internally consistent but semantically suboptimal |
| generate a new record identity | `setPrimaryKey` | `Form` | none | `createRecordKey` | `safe` | `create` signals factory behavior and `recordKey` signals the result clearly | semantically wrong even if locally consistent |
| provide an initial primitive field value | `defaultValue` | `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `Checkbox`, `Switch`, `TextArea`, `Select`, `Autocomplete`, `Checklist`, `Prompt`, `ImageUrl` | none with another current prop name for the same field-level semantic | `initialValue` | `safe` | says this value is used only at initialization time | internally consistent but semantically improvable |
| provide initial object values for a full form or model | `defaultValues` | `Form`, `FormDatabase`, `FormModel`, `FormTemplate`, `FormTemplate2` | none with another current prop name for the same form-level semantic | `initialValues` | `safe` | plural form makes the object-of-values meaning immediate | internally consistent but semantically improvable |
| provide the initial active index in a stateful sequence widget | `defaultTab` | `Tab` | `Carousel (startSlide)`, `TabDynamic (activeIndex used as initial uncontrolled state)` | `initialIndex` | `design choice` | expresses a generic initial position independently from the widget metaphor | same semantic, multiple names and mixed control semantics |
| provide a collection of record objects to render | `records` | `Grid` | `Table (body)`, `Gallery (body)` | `records` | `safe` | explicit collection noun already understood by both humans and LLMs | should converge on Grid vocabulary |
| provide a collection of generic items, not React children | `children` | none, because using `children` here is itself the problem | `Notifications (children)` | `items` | `safe` | avoids collision with React composition semantics | semantically incorrect API shape |
| notify when a full form record changes | `onChange` | `Form` | none with a different current prop name | `onRecordChange` | `safe` | adds the changed entity directly in the callback name | must be separated from field-level `onChange` |
| notify when a primitive field DOM-like event changes | `onChange` | `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `Checkbox`, `Switch`, `TextArea`, `Select`, `Autocomplete`, `Checklist`, `UploadDocument`, `UploadImage`, `ImageUrl`, `Prompt`, `Repeat`, `TabDynamic`, `AssistantAI` | `Form (onChange)` | `onChange` | `safe` | standard event callback name that AI already strongly associates to fields | name is correct only in field scope; `Form` must exit this semantic |
| run side effects after loading one record without transforming it | `onLoad` | `Form` runtime behavior only | none with a different public name, but semantics are wrong | `onRecordLoad` | `contract split required` | adds the subject and preserves callback lifecycle meaning | current name underspecified |
| transform one loaded record before use | `onLoad` in docs only | none in runtime | `Form` docs imply this semantic but runtime does not implement it | `transformLoadedRecord` | `contract split required` | `transform` makes the returned-value semantics explicit | currently broken semantic |
| transform a loaded record collection before render | `onLoad` | `Grid`, `GridArray`, `GridDB` | none with another current prop name | `transformLoadedRecords` | `safe` | tells both the timing and that the callback rewrites a collection | locally consistent but cross-component ambiguous |
| transform a record before persistence | `onSave` | none, because current semantics are overloaded | `Form (onSave)`, `Grid (onSave)` | `transformRecordBeforeSave` | `contract split required` | separates payload transformation from persistence target resolution | current prop is semantically invalid |
| resolve the persistence target path | `savePath` | `Form` | `Form.onSave` also partially acts as path resolver | `resolveRecordPath` | `contract split required` | `resolve` signals derived output and `recordPath` states what is returned | split required |
| intercept delete before persistence layer removal | `onDelete` | `Form`, `Grid`, `GridArray`, `GridDB` | none with another current prop name | `beforeDelete` | `safe` | makes the timing explicit instead of a generic event hook | consistent today, but semantically improvable |
| react after create/update/delete mutation completes | `onFinally` | `Form` | `Grid`, `GridArray`, `GridDB (onAfterAction when used for mutation-complete semantics)` | `afterRecordMutation` | `design choice` | replaces try/finally vocabulary with domain vocabulary and explicit subject | currently fragmented |
| react after a generic UI/data action completes | `onAfterAction` | `Grid`, `GridArray`, `GridDB` | none | `onActionComplete` | `safe` | clearer completion event phrasing than `after action` | locally consistent but semantically weak |
| configure selection mode or selection behavior | `selection` | `Grid` | `Table (selectionMode)` | `selection` | `safe` | compact generic noun that already captures configuration scope | Grid already has better vocabulary |
| control selected record identities | `selectedKeys` | `Grid` | `Table (selectedRowKeys)`, `Gallery (selectedRowKeys)` | `selectedKeys` | `safe` | removes widget-specific wording and keeps identity semantics clear | should be unified |
| react to selection state changes | `onSelectionChange` | `Grid`, `Table`, `Gallery` | none | `onSelectionChange` | `safe` | standard descriptive event name already fully explicit | already coherent |
| choose data or content representation mode | `layout` | `Grid` | `AssistantAI (viewMode)` | `view` | `design choice` | `view` directly signals representation like table, gallery, list, carousel | should align with `CLAUDE.md` and stop overloading `layout` |
| choose a spatial arrangement mode | `tabPosition` | `Tab`, `TabDynamic` | none with a different current prop name for the same arrangement semantic | `layout` | `safe` | `layout` is the `CLAUDE.md` category for spatial arrangement | current prop is positional but the semantic is arrangement |
| choose a visual shell appearance | `aspect` | `Form` | `Percentage (shape)` | `appearance` | `design choice` | `appearance` is clearer than `aspect` for card/plain or bar/circle shell choices | should align with `CLAUDE.md` instead of using `variant` |
| choose dark visual mode | `layoutDark` | `Carousel` | none | `dark` | `safe` | boolean `dark` is more direct than a name that incorrectly suggests layout | current prop leaks a wrong category name |
| choose a visual component variant | `variant` | `Buttons` | none | `variant` | `safe` | standard design-system word for semantic or color variant | already aligned with `CLAUDE.md` |
| choose a semantic status tone | `type` | `Alert`, `Badge`, `Percentage` | `Percentage (background)` for the separate track-tone semantic | `tone` | `safe` | distinguishes visual status from HTML/native `type` semantics | current name is consistent but semantically weak |
| configure dropdown or popover trigger content | `toggleButton` | `Dropdown` | none | `trigger` | `safe` | broader and more exact because not every trigger is literally a toggle button | locally consistent but poor naming |
| configure trigger styling | `buttonClass` | `Dropdown` | none | `triggerClassName` | `safe` | names both the target element and the value type clearly | locally consistent but poor naming |
| declare whether fullscreen action is available | `buttonFullscreen` | `Modal` | `Grid modal action descriptors (buttonFullscreen)` | `allowFullscreen` | `safe` | reads as a capability flag, not as a button implementation detail | same semantic exists both on a component and on grid action configuration |
| declare whether cancel action is visible | `buttonCancel` | `Modal` | none | `showCancel` | `safe` | maps directly to UI visibility semantics | locally consistent but poor naming |
| react to query text changes in search UI | `handleSearch` | `Search` | none | `onQueryChange` | `safe` | names both the data (`query`) and the event (`change`) | locally consistent but poor naming |
| configure an empty placeholder option in a select-like field | `optionEmpty` | `Select` | none | `placeholderOption` | `safe` | says exactly that this is the placeholder entry in the option list | locally consistent but poor naming |
| configure whether a field becomes immutable after first meaningful value | `updatable` | `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `TextArea`, `Select`, `Autocomplete`, `Checklist` | none | `lockAfterInitialValue` | `design choice` | describes the real behavior instead of a vague capability adjective | locally consistent but semantically vague |
| configure the checked value of boolean-like fields | `valueChecked` | `Checkbox`, `Switch` | none | `checkedValue` | `safe` | standard adjective-noun order that immediately reads as the checked-state payload | locally consistent but awkward naming |
| pass the input DOM id | `inputId` | `Input` | none | `id` | `safe` | standard DOM prop with zero extra interpretation cost | easy normalization |
| pass the input ref | `useRef` | `TextArea` | none | `inputRef` | `safe` | names the target and the value type instead of sounding like a hook | current name is misleading |
| inherit form-level field spacing | `inheritFormWrapClass` | `Input`, `String`, `Number`, `Email`, `Password`, `Color`, `Date`, `Time`, `DateTime`, `Week`, `Month`, `Range`, `Url`, `Checkbox`, `Switch`, `TextArea`, `Select`, `Autocomplete`, `Checklist` | none | `inheritFieldSpacing` | `safe` | describes the inherited semantic outcome instead of the CSS implementation detail | locally consistent but leaks implementation |

## Semantic Modeling Notes

If a single current prop covers two different semantic functions, it must be split.

Current critical split cases:

| Current prop | Why it is semantically wrong | Required split |
|---|---|---|
| `Form.onLoad` | name suggests generic lifecycle, docs suggest transform, runtime behaves like side effect only | split into `onRecordLoad` and `transformLoadedRecord` if both are needed |
| `Grid.onLoad` | same prop family as `Form.onLoad`, but here it transforms collections | rename to `transformLoadedRecords` |
| `Form.onSave` | today it is described like payload transform but typed like path resolver | split into `transformRecordBeforeSave` and `resolveRecordPath` |
| `Grid.onSave` | same ambiguity inherited in grid mutation layer | split into `transformRecordBeforeSave` and `resolveRecordPath` |
| `MarkdownReader.wrapClass` + `MarkdownReader.className` | both props are currently merged onto the same DOM node, so wrapper-vs-base semantics collapse at runtime | split into a real `wrapperClassName` and a real `className`, or keep only one prop |

## Canonical Vocabulary

This is the recommended semantic vocabulary to use everywhere.

### 1. Styling And Slots

| Semantic role | Canonical name | Notes |
|---|---|---|
| wrapper CSS class | `wrapperClassName` | Use only when the component renders a real outer wrapper shell |
| central or base element CSS class | `className` | `className` should target the main rendered element, not the wrapper shell |
| inner content class beyond the base element | `contentClassName` | Use an area name when the component has more than one meaningful inner surface |
| content before main body | `before` | Cross-component replacement for `pre` |
| content after main body | `after` | Cross-component replacement for `post` |
| header class | `headerClassName` | not `headerClass` |
| body/content class | `bodyClassName` or `contentClassName` | prefer `contentClassName` outside card/modal/table metaphors |
| footer class | `footerClassName` | not `footerClass` |

Decision:

- Rename `wrapClass` to `wrapperClassName`
- Rename `pre` to `before`
- Rename `post` to `after`

### 2. Data Scope

| Semantic role | Canonical name | Notes |
|---|---|---|
| collection or list source path | `resourcePath` | for list/grid/query scope |
| full single-record path | `recordPath` | only when the API truly needs the full record path |
| record identity within a resource | `recordKey` | generic and backend-agnostic |
| multiple records | `records` | keep |
| single record | `record` | keep |
| generated record key factory | `createRecordKey` | not `setPrimaryKey` |

Decision:

- Reserve `path` for local or generic path only if the scope is obvious.
- Prefer `resourcePath` and `recordPath` over infrastructure-heavy names like `dataStoragePath`.

### 3. Values And Initialization

| Semantic role | Canonical name | Notes |
|---|---|---|
| current controlled value | `value` | keep |
| initial primitive value | `initialValue` | field-level |
| initial object/map values | `initialValues` | form-level |
| empty/default option | `placeholderOption` | better than `optionEmpty` |

Decision:

- `defaultValue` is familiar in HTML-like APIs, but `initialValue` is semantically clearer for an AI-first framework.
- `defaultValues` at form level should become `initialValues`.

### 4. Events And Lifecycle

| Semantic role | Canonical name | Notes |
|---|---|---|
| primitive value changed | `onValueChange` | if callback receives the next value |
| field event passthrough | `onChange` | keep only if it truly mirrors DOM event semantics |
| full form record changed | `onRecordChange` | not generic `onChange` |
| transform loaded record | `transformLoadedRecord` | if return value is used |
| side-effect after record load | `onRecordLoad` | if return value is ignored |
| transform record before save | `transformRecordBeforeSave` | if return value mutates payload |
| resolve output record path | `resolveRecordPath` | if return value is a path |
| before delete | `beforeDelete` | if it intercepts delete flow |
| after create/update/delete | `afterRecordMutation` | replaces `onFinally` |
| selection changed | `onSelectionChange` | keep |
| action completed | `onActionComplete` | grid/modal/action systems |

Decision:

- Never use one callback name for two different semantics.
- `onSave` must never mean both "transform payload" and "return save path".

### 5. Variants And Presentation

| Semantic role | Canonical name | Notes |
|---|---|---|
| data/content representation | `view` | use for table/gallery, list/carousel |
| visual shell | `appearance` | use for card/plain, bar/circle, button/avatar |
| spatial arrangement | `layout` | use for vertical/horizontal, inline, top/left tabs |
| semantic status kind | `tone` | local extension used for visual status to avoid HTML `type` collisions |
| absolute placement | `position` | keep |
| content mode | `mode` | keep when behavior changes materially |
| semantic or color variant | `variant` | use for primary/secondary/danger and similar semantic skins |

Decision:

- Use `view` for representation.
- Use `appearance` for shell changes.
- Use `layout` for arrangement.
- Avoid overloading `type` unless mapping to a native HTML concept.
- Treat `tone` as an explicit subcategory for status styling inside the broader `variant` space.

## Cross-Framework Renaming Rules

These should be applied incrementally across all public APIs.

| Current family | Suggested family |
|---|---|
| `pre` / `post` | `before` / `after` |
| `wrapClass` | `wrapperClassName` |
| `headerClass`, `bodyClass`, `footerClass` | `headerClassName`, `bodyClassName`, `footerClassName` |
| `dataStoragePath`, `path`, `sourcePath` | `resourcePath` or `recordPath` depending on scope |
| `recordId`, `setPrimaryKey` | `recordKey`, `createRecordKey` |
| `defaultValues` | `initialValues` |
| `defaultValue` | `initialValue` where not tightly mirroring native input semantics |
| `optionEmpty` | `placeholderOption` |
| `isFixed` | `fixedPosition` |
| `layout` with values like `table|gallery`, `viewMode` | `view` |
| `aspect`, `shape` when they change the shell | `appearance` |
| `tabPosition` | `layout` |
| uppercase content props like `Header`, `Footer`, `Type` | lowercase semantic props like `header`, `footer`, `as` |

## Component Audit

Status legend:

- `keep`: already semantically strong
- `rename`: should be renamed
- `split`: one prop currently hides two semantics
- `normalize`: casing or vocabulary should be standardized

### Foundation: Shared Props

#### `UIProps` and `MotionUIProps`
Source: `src/components/types.ts`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `pre` | rename | `before` | generic and AI-readable across all components |
| `post` | rename | `after` | generic and AI-readable across all components |
| `wrapClass` | rename | `wrapperClassName` | explicit wrapper-shell semantic |
| `className` | keep | `className` | keep for the central or base rendered element |
| `motion` | keep | `motion` | clear behavior semantic |

Primary rule:

- The wrapper shell should use `wrapperClassName`.
- The central or base rendered element should use `className`.
- Deeper inner areas must use explicit semantic names like `bodyClassName`, `contentClassName`, `menuClassName`.

### Form System

#### `Form`
Source: `src/components/widgets/Form.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `aspect` | rename | `appearance` | visual shell choice like card/plain, not semantic tone |
| `dataStoragePath` | rename | `recordPath` | current public API behaves as a concrete single-record path |
| `defaultValues` | rename | `initialValues` | clearer initial state semantics |
| `handlers` | rename | `imperativeApi` or `formRefOverrides` | reveals purpose |
| `setPrimaryKey` | rename | `createRecordKey` | factory semantics, not mutation |
| `savePath` | rename | `resolveRecordPath` | return value is a path, not a save action |
| `onLoad` | split | `onRecordLoad` or `transformLoadedRecord` | current name hides whether return value matters |
| `onChange` | rename | `onRecordChange` | callback receives whole record |
| `onSave` | split | `transformRecordBeforeSave` or `resolveRecordPath` | must not mix payload transform and path resolution |
| `onDelete` | rename | `beforeDelete` | clearer lifecycle point |
| `onFinally` | rename | `afterRecordMutation` | domain semantic is better than try/finally semantic |
| `showNotice` | keep | `showNotice` | explicit UI visibility semantic |
| `showBack` | keep | `showBack` | explicit UI visibility semantic |
| `wrapClass` | rename | `wrapperClassName` | explicit wrapper-shell semantic |
| `headerClass` | rename | `headerClassName` | standard class suffix |
| `footerClass` | rename | `footerClassName` | standard class suffix |

Behavior mismatch to fix before or during rename:

- `onLoad` return value is ignored.
- `onSave` type returns a path, but docs often describe a record transform.

#### `FormFieldProps`
Source: `src/components/widgets/Form.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `name` | keep | `name` | shortest valid semantic key path |
| `label` | keep | `label` | standard |
| `value` | keep | `value` | standard |
| `defaultValue` | rename | `initialValue` | clearer field initialization |
| `inheritFormWrapClass` | rename | `inheritFieldSpacing` | current name is implementation-heavy |

#### `Input`, `TextArea`, `Checkbox`, `Switch`
Source: `src/components/ui/fields/Input.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `type` on `Input` | keep | `type` | native HTML semantic |
| `updatable` | rename | `lockAfterInitialValue` | current name is vague |
| `feedback` | keep | `feedback` | clear field feedback semantic |
| `inputId` | normalize | `id` | standard DOM semantic |
| `labelClassName` | keep | `labelClassName` | already standard |
| `valueChecked` | rename | `checkedValue` | more natural phrase |
| `useRef` on `TextArea` | rename | `inputRef` | standard React semantic |
| `inheritFormWrapClass` | rename | `inheritFieldSpacing` | cross-field consistency |

#### `Select`, `Autocomplete`, `Checklist`
Source: `src/components/ui/fields/Select.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `options` | keep | `options` | strong |
| `db` | rename | `optionsSource` | describes semantic role, not storage implementation |
| `optionEmpty` | rename | `placeholderOption` | clearer intent |
| `order` | keep | `order` | clear ordering semantic |
| `creatable` | keep | `creatable` | standard enough |
| `onCreate` | keep | `onCreate` | clear |
| `checkClass` | rename | `itemClassName` | semantic child target |

#### `UploadDocument`, `UploadImage`
Source: `src/components/ui/fields/Upload.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `editable` | rename | `canEdit` | boolean capability pattern |
| `multiple` | keep | `multiple` | native semantic |
| `accept` | keep | `accept` | native semantic |
| `max` | rename | `maxFiles` | units must be explicit |
| `previewHeight` | keep | `previewHeight` | good |
| `previewWidth` | keep | `previewWidth` | good |

#### `ImageUrl`
Source: `src/components/ui/fields/ImageUrl.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `mode` | keep | `mode` | behavior switch for prompt integration |
| inner nested fields `.url/.alt/.width/.height` | keep | keep | self-explanatory and AI-friendly |

#### `Repeat`
Source: `src/components/ui/Repeat.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `onAdd` | keep | `onAdd` | clear |
| `onRemove` | keep | `onRemove` | clear |
| `layout` | keep | `layout` | structural |
| `min` | rename | `minItems` | unit explicit |
| `max` | rename | `maxItems` | unit explicit |
| `readOnly` | keep | `readOnly` | standard |

#### `TabDynamic`
Source: `src/components/widgets/TabDynamic.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `label` | split | `tabLabelTemplate` | current value is used to generate tab titles, not field label |
| `min` | rename | `minTabs` | unit explicit |
| `max` | rename | `maxTabs` | unit explicit |
| `activeIndex` | keep | `activeIndex` | clear |
| `tabPosition` | rename | `layout` | position is actually tab arrangement |
| `title` | keep | `title` | section title |

#### `LayoutBuilder`
Source: `src/components/ui/LayoutBuilder.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `defaultSpan` | keep | `defaultSpan` | explicit |
| `heightPx` | rename | `height` | CSS units should not live in prop name |

#### `Prompt`
Source: `src/components/widgets/Prompt.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `mode` | keep | `mode` | strong semantic |
| `rows` | keep | `rows` | native textarea semantic |
| `defaultValue` | rename | `initialValue` | consistency is more valuable here than a Prompt-specific alias |
| `renderAIUnavailable` | keep | `renderAIUnavailable` | explicit |
| `onRunPrompt` | keep | `onRunPrompt` | explicit |
| `renderPlainFallback` | rename | `renderFallbackValueEditor` | clarifies branch purpose |
| `renderPromptDisabled` | rename | `renderDisabledPromptFallback` | more exact |

#### `AssistantAI`
Source: `src/components/ui/fields/AssistantAI.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `promptTopic` | rename | `promptTemplate` | prop contains prompt config, not topic only |
| `configVariables` | rename | `promptVariables` | domain-accurate |
| `aiOptions` | keep | `aiOptions` | clear provider request-options semantic |
| `initialValue` | keep | `initialValue` | good |
| `viewMode` | rename | `view` | list vs carousel is a content representation choice |
| `autoStart` | keep | `autoStart` | clear |
| `onReset` | keep | `onReset` | clear |

Notes:

- `AssistantAI` is one of the few live consumers of `FormEnhancer`; if retained, its props should align with the same `initialValue` and `promptVariables` vocabulary used by `Prompt`.

#### `UploadCSV`
Source: `src/components/ui/fields/UploadCSV.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `onDataLoaded` | keep | `onDataLoaded` | explicit |
| `onParseField` | keep | `onParseField` | explicit |
| `normalizeKeys` | keep | `normalizeKeys` | good |
| `removeEmptyFields` | keep | `removeEmptyFields` | good |

### Grid And Collection System

#### `Grid`
Source: `src/components/widgets/Grid.tsx`, `src/components/widgets/grid-core/types.ts`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `layout` | rename | `view` | `table | gallery` is a representation choice, not spatial arrangement |
| `sticky` | keep | `sticky` | strong |
| `loading` | keep | `loading` | strong |
| `sortable` | keep | `sortable` | strong |
| `selection` | keep | `selection` | strong |
| `onClickRow` | rename | `onRowClick` | more standard event order |
| `reorderable` | keep | `reorderable` | clear |
| `groupBy` | keep | `groupBy` | strong |
| `onLoad` | rename | `transformLoadedRecords` | function transforms records, not just lifecycle side effect |
| `onSave` | split | `transformRecordBeforeSave` or `resolveRecordPath` | same ambiguity as Form |
| `onDelete` | rename | `beforeDelete` | clearer lifecycle point |
| `onAfterAction` | rename | `onActionComplete` | clearer outcome semantic |
| `audit` | keep | `audit` | clear persistence-side audit toggle |
| `columns` | keep | `columns` | strong |
| `actions` | keep | `actions` | strong |
| `form` | keep | `form` | clear record-editor slot semantic |
| `editDeepLink` | rename | `syncSelectionToUrl` | reveals actual behavior |
| `header` | keep | `header` | strong |
| `footer` | keep | `footer` | strong |
| `recordId` | rename | `recordKey` | backend-agnostic and cross-framework consistent |
| `sourcePath` | rename | `resourcePath` | actual list source |
| `path` | rename | `resourcePath` | too generic |
| `fromUrl` | rename | `resourcePathFromUrl` | explicit derived source semantics |

Grid-specific verdict:

- `Grid` is close to a strong API, but path and record identity naming should be aligned with `Form`.
- The `Grid`/`Form` pair should share the same mutation lifecycle vocabulary.

#### `GridColumn`
Source: `src/components/widgets/grid-core/types.ts`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `key` | keep | `key` | standard column access key |
| `label` | keep | `label` | strong |
| `sortable` | keep | `sortable` | strong |
| `render` | split | `format` or `renderCell` | current union mixes formatter name and renderer callback |

#### `GridAction`
Source: `src/components/widgets/grid-core/types.ts`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `kind` | keep | `kind` | strong discriminant |
| `to` | keep | `to` | standard route target |
| `href` | keep | `href` | standard external target |
| `run` | rename | `execute` | more action-semantic, less ambiguous |
| `buttonFullscreen` | rename | `allowFullscreen` | capability boolean |

### Data Display Primitives

#### `Table`
Source: `src/components/ui/Table.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `header` | rename | `columns` | current prop should become `columns` for parity with Grid |
| `body` | rename | `records` | aligns with Grid and Gallery |
| `Footer` | normalize | `footer` | casing consistency |
| `onClick` | rename | `onRowClick` | explicit payload semantic |
| `selectionMode` | rename | `selection` | parity with Grid |
| `selectedRowKeys` | rename | `selectedKeys` | legacy duplicate should be removed |
| `heightClass` | rename | `viewportClassName` or `heightClassName` | current name is implementation-heavy |
| `renderCell` | keep | `renderCell` | strong |

#### `Gallery`
Source: `src/components/ui/Gallery.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `body` | rename | `records` | align with Grid and Table |
| `Header` | normalize | `header` | casing consistency |
| `Footer` | normalize | `footer` | casing consistency |
| `onClick` | rename | `onItemClick` | payload semantic |
| `gutterSize` | rename | `gap` | layout semantic, not bootstrap jargon |
| `rowCols` | rename | `columns` | simpler and AI-predictable |
| `selectedRowKeys` | rename | `selectedKeys` | remove legacy duplicate |

#### `Percentage`
Source: `src/components/ui/Percentage.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `val` | rename | `value` | standard |
| `shape` | rename | `appearance` | bar vs circle changes the shell, not the spatial arrangement |
| `type` | rename | `tone` | color tone, not type |
| `background` | rename | `trackTone` | actual semantic role |
| `size` | split | `widthPercent` for bar, `diameter` for circle | currently unit meaning changes by shape |

#### `Code`
Source: `src/components/ui/Code.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `language` | keep | `language` | strong |
| `showCopy` | keep | `showCopy` | clear |
| `theme` | keep | `theme` | clear within code-block context |
| `background` | keep | `background` | code-block-specific visual surface semantic |

#### `Image`
Source: `src/components/ui/Image.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `src` | keep | `src` | standard |
| `placeholder` | keep | `placeholder` | clear |
| `label` | rename | `alt` | actual semantic role for images |
| `fit` | keep | `fit` | clear |
| `position` | keep | `position` | clear |
| `srcset` | normalize | `srcSet` | standard DOM casing |

#### `ImageAvatar`
Source: `src/components/ui/ImageAvatar.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `src` | keep | `src` | standard |
| `fit` | keep | `fit` | clear |
| `badge` | keep | `badge` | clear |
| `feedback` | keep | `feedback` | clear auxiliary UI semantic |

#### `Loader`
Source: `src/components/ui/Loader.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `show` | keep | `show` | explicit visibility state |
| `children` | keep | `children` | overlay wraps content |
| `description` | keep | `description` | clear |

#### `Badge`
Source: `src/components/ui/Badge.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `type` | rename | `tone` | visual status semantic |
| `content` | keep | `content` | good in descriptor object |
| `descriptorOnly` | rename | `renderDescriptorOnly` | explicit boolean behavior |

#### `Alert`
Source: `src/components/ui/Alert.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `type` | rename | `tone` | visual state, not type |
| `isFixed` | rename | `fixedPosition` | reveals actual values top/bottom |
| `timeout` | keep | `timeout` | clear |
| `icon` | keep | `icon` | clear |

#### `Icon`
Source: `src/components/ui/Icon.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `name` | keep | `name` | short and strong |
| `provider` | keep | `provider` | strong |
| `label` | keep | `label` | accessibility semantic |

### Navigation And Composition

#### `GridSystem` (`Wrapper`, `Container`, `Row`, `Col`)
Source: `src/components/ui/GridSystem.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `Wrapper` component name | keep | `Wrapper` | explicit layout primitive name in the current framework vocabulary |
| `className` | keep | `className` | base rendered element class semantic is correct here |
| `defaultSize` on `Col` | rename or remove | `span` or remove | prop is declared but not used, so it misleads AI consumers |
| breakpoint props `xs/sm/md/lg/xl/xxl` | keep | keep | standard responsive grid vocabulary |

#### `Carousel`
Source: `src/components/blocks/Carousel.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `showIndicators` | keep | `showIndicators` | clear |
| `showControls` | keep | `showControls` | clear |
| `showCaption` | keep | `showCaption` | clear |
| `layoutDark` | rename | `dark` | current name mixes layout with color mode; boolean `dark` is more direct |
| `autoPlay` | keep | `autoPlay` | clear |
| `startSlide` | rename | `initialSlide` | initialization semantic |
| `onParseCaption` | rename | `renderCaption` | callback renders caption UI, it does not parse |
| `onClick` | rename | `onSlideClick` | payload target is the slide area |

#### `Buttons`
Source: `src/components/ui/Buttons.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `variant` | keep | `variant` | strong |
| `showLoader` | rename | `loading` | state name, not imperative |
| `loadingLabel` | keep | `loadingLabel` | clear |
| `iconClass` | rename | `iconClassName` | standard suffix |
| `GoSite.url` | normalize | `href` | standard link target |
| `ReferSite.url` | normalize | `href` | standard link target |
| `ReferSite.imageUrl` | normalize | `imageSrc` | clear media source |

#### `Card`
Source: `src/components/ui/Card.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `title` | keep | `title` | strong |
| `header` | keep | `header` | strong |
| `footer` | keep | `footer` | strong |
| `showLoader` | rename | `loading` | state semantic |
| `showArrow` | rename | `showFrameAccent` or `showDecorativeCorners` | current name is implementation-specific |
| `bodyClass` | rename | `bodyClassName` | standard suffix |

#### `Modal`
Source: `src/components/ui/Modal.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `size` | keep | `size` | strong |
| `position` | keep | `position` | strong |
| `buttonFullscreen` | rename | `allowFullscreen` | capability boolean |
| `buttonCancel` | rename | `showCancel` | UI visibility semantic |
| `closeOnBackdrop` | keep | `closeOnBackdrop` | strong |
| `subTitleClass` | normalize | `subtitleClassName` | casing consistency |
| `bodyClass` | rename | `bodyClassName` | standard suffix |

#### `Tab`
Source: `src/components/ui/Tab.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `defaultTab` | rename | `defaultIndex` | actual semantic |
| `tabPosition` | rename | `layout` | top/left/right/bottom is layout |

#### `Brand`
Source: `src/components/blocks/Brand.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `url` | normalize | `to` or `href` | link target semantics |
| `logo` | rename | `logoSrc` | explicit media source |
| `logoClass` | rename | `logoClassName` | standard suffix |
| `labelClass` | rename | `labelClassName` | standard suffix |

#### `Breadcrumbs`
Source: `src/components/blocks/Breadcrumbs.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `trail` | keep | `trail` | strong |
| `rootItem` | keep | `rootItem` | strong |
| `separator` | keep | `separator` | strong |
| `jsonLd` | keep | `jsonLd` | standard |
| `baseUrl` | keep | `baseUrl` | strong |

#### `Dropdown`
Source: `src/components/blocks/Dropdown.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `toggleButton` | rename | `trigger` | broader and more UI-standard |
| `defaultOpen` | keep | `defaultOpen` | standard |
| `open` | keep | `open` | standard |
| `onOpenChange` | keep | `onOpenChange` | standard |
| `alwaysOpen` | rename | `staticOpen` | reveals behavior better |
| `position` | keep | `position` | alignment axis |
| `placement` | keep | `placement` | overlay side |
| `buttonClass` | rename | `triggerClassName` | semantic target |
| `menuClass` | rename | `menuClassName` | standard suffix |
| `badgeClass` | rename | `badgeClassName` | standard suffix |

#### `Menu`
Source: `src/components/blocks/Menu.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `context` | rename | `menuKey` or `menuContext` | current name is too generic |
| `Type` | normalize | `as` | standard component polymorphism semantic |
| `badges` | keep | `badges` | clear badge-map semantic |
| `itemClass`, `linkClass`, `iconClass`, `textClass`, `badgeClass`, `arrowClass`, `submenuClass` | normalize | `itemClassName`, `linkClassName`, etc. | standard suffix |

#### `Notifications`
Source: `src/components/blocks/Notifications.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `children` as data array | rename | `items` | `children` should not carry structured notification data |
| `badge` | keep | `badge` | good |

#### `Search`
Source: `src/components/blocks/Search.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `handleSearch` | rename | `onQueryChange` | callback semantic is query change, not generic handling |

### Content And Utilities

#### `MarkdownReader`
Source: `src/components/widgets/MarkdownReader.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `content` | keep | `content` | strong |
| `components` | keep | `components` | react-markdown standard |
| `head` | rename | `metadata` | semantic payload is page metadata |
| `onNavigateInternal` | rename | `onInternalLinkClick` | precise behavior |

#### `ImageEditor`
Source: `src/components/widgets/ImageEditor.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `imageUrl` | rename | `src` | standard image source |
| `modal` | rename | `useModal` or `renderInModal` | behavior flag |
| `onImageLoad` | keep | `onImageLoad` | strong |
| `onSave` | keep | `onSave` | returns data URL result |

### Schema And Template APIs

#### `Component`, `ComponentBlock`, `buildFormFields`
Source: `src/components/Component.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `Component.input` | keep | `Component.input` | concise and predictable |
| `Component.block` | keep | `Component.block` | concise and predictable |
| `Component.section` | keep | `Component.section` | concise and predictable |
| `model` on `ComponentBlock` | keep | `model` | strong schema semantic |
| `html()` | rename | `renderView()` or `renderContent()` | `html` is too implementation-shaped |
| `form()` | rename | `renderForm()` | verb-based render semantic |
| `default(options)` | rename | `create()` or `createComponent()` | `default` is semantically weak for a factory |
| `options.dataStoragePath` | rename | `options.resourcePath` or `options.recordPath` | align with canonical data naming |
| `buildFormFields` | keep | `buildFormFields` | strong |

#### `Template`, `FormTemplate`, `FormTemplate2`
Source: `src/components/Template.tsx`

| Current | Status | Suggested | Why |
|---|---|---|---|
| `htmlString` | rename | `templateMarkup` | clearer payload semantic |
| `components` in `FormTemplate` | rename | `fields` or `fieldDefinitions` | prop contains field specs, not generic React components |
| `dataStoragePath` | rename | `recordPath` | this API binds a record-backed form template |
| `template` in `FormTemplate2` | rename | `templatePath` | current prop is actually a database path |
| `fieldBucketKey` | rename | `fieldSetKey` | simpler and more AI-readable |
| `dataSource` | rename | `recordPath` | actual data-binding role |
| `loadFromDatabase(path, bucket)` | rename | `loadFromPath(path, fieldSetKey)` | avoid backend-specific wording in public API |

## Priority Refactor Order

### Tier 1: Global semantic debt

1. `UIProps`
   Replace `pre/post/wrapClass` with `before/after/wrapperClassName` and keep `className` for the base rendered element.
2. `Form` and `Grid`
   Align path, record identity, and lifecycle callback vocabulary.
3. `Table` and `Gallery`
   Align collection props to `records`, `columns`, `header`, `footer`, `selectedKeys`.

### Tier 2: Field and form ecosystem

1. `defaultValues` -> `initialValues`
2. `defaultValue` -> `initialValue` where feasible
3. `optionEmpty` -> `placeholderOption`
4. `min/max` -> unit-explicit names on collection widgets

### Tier 3: Visual and navigation consistency

1. `Grid.layout` -> `view` and `AssistantAI.viewMode` -> `view`
2. `Form.aspect` -> `appearance` and `Percentage.shape` -> `appearance`
3. `type` -> `tone` for `Alert`, `Badge`, `Percentage`
4. `toggleButton` -> `trigger`
5. `url` -> `href` or `to` depending on router semantics
6. `Header/Footer/Type` uppercase props -> lowercase semantic props

## Refactor Strategy

This audit assumes a **clean-break refactor**, not an alias-based migration.

Rules:

1. No deprecated aliases.
2. No dual vocabulary in the same codebase.
3. Rename the public API directly to the canonical semantic names.
4. Update showcase, tests, docs, templates, and internal call sites in the same refactor wave.
5. Reject any rename that leaves two different prop names for the same semantic function.

## Review Notes

This audit was cross-checked against an external review document in `docs/API_SEMANTIC_NAMING_AUDIT_deep_seek.md`.

Accepted improvements from that review:

- explicit alignment with `CLAUDE.md` naming categories
- `Grid.layout` -> `view`
- `AssistantAI.viewMode` -> `view`
- `Form.aspect` -> `appearance`
- `Percentage.shape` -> `appearance`
- `Prompt.defaultValue` -> `initialValue` for consistency

Rejected or partially rejected suggestions:

- `onFinally` was **not** kept as-is, because the runtime does not express generic `finally` semantics strongly enough; `afterRecordMutation` remains the clearer AI-facing name
- `Component.tsx`, `Template.tsx`, and `FormEnhancer.tsx` were **not** classified as removable dead code in this audit, because they are still exported or still referenced in the current repository
- `Command.tsx` and `src/pages/Helper.tsx` may be legacy candidates for removal, but they are outside the main scope of this public component naming audit

## Open Decisions

These items remain intentionally open because the repository allows more than one defensible choice, and the final decision should be taken explicitly rather than implied by a rename.

| Topic | Current state | Preferred direction in this audit | Alternative still defensible | Why it remains open |
|---|---|---|---|---|
| `Form.onFinally` | callback after save/delete flow | `afterRecordMutation` | keep `onFinally` | `afterRecordMutation` is more domain-explicit and AI-readable, but `onFinally` is familiar to programmers and signals guaranteed execution |
| `Select.db` | provider-backed options source config | `optionsSource` | `remoteOptions`, or keep `db` | the repo is provider-oriented, but the naming choice depends on whether the framework wants to foreground provider-agnostic semantics or explicitly remote/provider-backed semantics |
| `Brand.url` and similar routing props | mixed router/internal/external semantics | specialize to `to` or `href` per component | normalize everything to one routing name | the best name depends on whether each component is router-bound, external-link-oriented, or dual-mode |
| `GridAction.render` split target | union currently mixes formatter and renderer semantics | split toward `renderCell` plus explicit formatter vocabulary | keep a narrower `render` contract | this is not only a rename, but a type-contract cleanup decision |
| `ImageEditor.modal` | boolean controlling modal behavior | `useModal` | `renderInModal` | both names are clear; the better one depends on whether the semantic is capability, rendering destination, or behavior toggle |

Decision rule:

- if a topic here is resolved, it should move back into the main audit as a normal prescribed rename
- until then, it should not be treated as fully settled API law

## Legacy Removal Candidates

These items are not part of the semantic rename verdict itself. They are cleanup candidates that may deserve a separate removal CR after usage is confirmed.

| Candidate | Current evidence | Reason to consider removal | Why not marked as removed in this audit |
|---|---|---|---|
| `src/components/ui/fields/Command.tsx` | referenced in docs/status as legacy and uses deprecated `document.execCommand` | weak modern fit, deprecated editing approach, already flagged elsewhere in repo docs | this audit is about naming semantics, and removal requires a dedicated verification pass |
| `src/pages/Helper.tsx` | historical helper page, also flagged in repo docs as legacy | appears outside the modern app/theme/component flow | still present and exported through page indexes, so removal must be confirmed separately |
| `src/components/FormEnhancer.tsx` | still referenced by `AssistantAI` and grid utilities | architecture looks legacy compared to `FormContext`; limited active value | still used in the current repo, so it is a migration/removal candidate, not dead code yet |
| `src/components/Template.tsx` | still exported and referenced in the public surface | older template/schema path may no longer fit the preferred direction | export presence means it is not safe to mark dead without a dedicated usage audit |
| `src/components/Component.tsx` / `ComponentBlock` | still exported and still referenced in the repo | schema-driven layer may be legacy relative to current direction | public export plus internal references mean removal cannot be assumed from this audit alone |

Operational rule:

- first verify real usage with a dedicated dependency audit
- then either remove the module entirely or keep it and bring its naming into alignment with the canonical vocabulary

## Final Reverse Verification Checklist

- [x] Every current prop listed here exists in the cited source file.
- [x] Every rename recommendation is consistent with the canonical vocabulary section.
- [x] `Form`, `Grid`, `Table`, and `Gallery` now share the same data semantics in the document.
- [x] No section uses `type` for visual tone unless explicitly justified.
- [x] No section keeps uppercase prop names unless they are intentional React component names.
- [x] `children` is never recommended as a data payload prop.
- [x] Path props are differentiated as `resourcePath` vs `recordPath`.
- [x] Record identity is differentiated as `recordKey`.
