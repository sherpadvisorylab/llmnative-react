# Showcase I18n Checklist

## Objective

Move all user-facing hardcoded texts from showcase pages into `clients/showcase/src/conf/i18n/*` using `useI18n('showcase')`, with explicit and coherent keys, translated in all supported locales:

- `en`
- `it`
- `de`
- `ru`
- `zh`
- `ar`

## Scope

In scope:

- `PageLayout` titles and descriptions
- `Section` titles and descriptions
- Showcase-only labels rendered directly inside pages when they are part of the documentation UI
- `PropDocsTable` titles when hardcoded in showcase pages
- Other obvious documentation/help texts shown in the page body

Out of scope unless explicitly requested later:

- Code snippets shown inside `code={...}`
- Prop names, type names, enum values, API identifiers
- Texts that already come from the library-level i18n namespaces outside showcase
- Markdown docs content under `docs/`

## Conventions

- Namespace: `showcase`
- Prefer nested page dictionaries for new work
- Access nested slices with dot paths when useful: `useI18n('showcase.grid')`
- Reuse cross-page wording in shared semantic nodes before duplicating page-local keys
- For already migrated pages, use `showcase.common` + `showcase.{page}` directly
- Bootstrap only the shell dictionaries needed immediately, then lazy-load page namespaces with an in-memory cache
- Model repeating page structures consistently:
  - `page.title`, `page.description`
  - `examples.{group}.title`, `examples.{group}.description`, `examples.{group}.items.{example}.title`
  - `playground.*`
  - `propsDocs.*`
- Keep legacy flat keys only as a temporary migration layer for not-yet-migrated pages, and remove runtime fallbacks as soon as the nested node is available in every locale

## Required steps for each page

- [ ] Add missing keys to `clients/showcase/src/types/i18n.d.ts`
- [ ] Add English source strings to `clients/showcase/src/conf/i18n/en.ts`
- [ ] Add translations to `it.ts`, `de.ts`, `ru.ts`, `zh.ts`, `ar.ts`
- [ ] Replace hardcoded page strings with `const t = useI18n('showcase')`
- [ ] Verify no remaining user-facing hardcoded text in the page

## Status legend

- `done`: page wired to showcase i18n and translated in all locales
- `partial`: keys/types exist but page still renders hardcoded strings
- `todo`: not yet migrated

## Already started

- [x] Shared shell labels
- [x] `AlertPage`
- [x] `BadgePage`
- [x] `CardPage`
- [x] `LoaderPage`
- [x] `IconPage`

Note: first migrated block completed and translated in all supported locales.

Note: `showcase.common`, `showcase.home`, `showcase.grid`, `showcase.gridPreview`, `showcase.imageEditor`, `showcase.layoutBuilder`, `showcase.markdownReader`, `showcase.alert`, `showcase.badge`, `showcase.card`, `showcase.loader`, `showcase.icon`, `showcase.brand`, `showcase.carousel`, `showcase.gallery`, `showcase.gridSystem`, `showcase.table`, `showcase.auth`, `showcase.examplesOverview`, `showcase.benchmark`, `showcase.checkbox`, `showcase.buttons`, `showcase.actionButton`, `showcase.loadingButton`, `showcase.navigationButtons`, `showcase.code`, `showcase.modal`, `showcase.modalYesNo`, `showcase.modalOk`, `showcase.pagination`, `showcase.percentage`, `showcase.localeSwitcher`, `showcase.tab`, `showcase.dropdown`, `showcase.motion`, `showcase.listGroup`, `showcase.imageAvatar`, `showcase.input`, `showcase.switch`, `showcase.select`, `showcase.textArea`, `showcase.imageUrl`, `showcase.autocomplete`, `showcase.checklist`, `showcase.image`, `showcase.notifications`, `showcase.search`, `showcase.menu`, `showcase.breadcrumbs`, `showcase.repeat`, `showcase.tabDynamic`, `showcase.upload`, `showcase.uploadImage`, `showcase.uploadDocument`, `showcase.uploadCsv`, `showcase.prompt`, `showcase.promptShared`, `showcase.promptEditor`, `showcase.promptLive` and `showcase.promptPlain` are now split into dedicated `namespace.locale.ts` files and loaded through the showcase namespace loader.

## Page inventory

### Top level

- [x] `pages/Home.tsx` - done
- [x] `pages/BenchmarkPage.tsx` - done
- [x] `pages/examples/ExamplesOverview.tsx` - done

### UI Primitives

- [x] `pages/components/AlertPage.tsx` - done
- [x] `pages/components/BadgePage.tsx` - done
- [x] `pages/components/buttons/index.tsx` - done
- [x] `pages/components/buttons/ActionButtonPage.tsx` - done
- [x] `pages/components/buttons/LoadingButtonPage.tsx` - done
- [x] `pages/components/buttons/NavigationButtonsPage.tsx` - done
- [x] `pages/components/CardPage.tsx` - done
- [x] `pages/components/CodePage.tsx` - done
- [x] `pages/components/DropdownPage.tsx` - done
- [x] `pages/components/GalleryPage.tsx` - done
- [x] `pages/components/GridSystemPage.tsx` - done
- [x] `pages/components/IconPage.tsx` - done
- [x] `pages/components/ImagePage.tsx` - done
- [x] `pages/components/ImageAvatarPage.tsx` - done
- [x] `pages/components/LoaderPage.tsx` - done
- [x] `pages/components/LocaleSwitcherPage.tsx` - done
- [x] `pages/components/ModalPage.tsx` - done
- [x] `pages/components/ModalYesNoPage.tsx` - done
- [x] `pages/components/ModalOkPage.tsx` - done
- [x] `pages/components/MotionPage.tsx` - done
- [x] `pages/components/PaginationPage.tsx` - done
- [x] `pages/components/PercentagePage.tsx` - done
- [x] `pages/components/TabPage.tsx` - done
- [x] `pages/components/TablePage.tsx` - done
- [x] `pages/components/CarouselPage.tsx` - done

Note: the pages above are now aligned to direct nested runtime access via `showcase.common` / `showcase.{page}`. The showcase runtime now bootstraps `showcase.common` eagerly and lazy-loads page namespaces with cached locale patches.

### Widgets

- [x] `pages/components/AuthPage.tsx` - done
- [x] `pages/components/ImageEditorPage.tsx` - done
- [x] `pages/components/LayoutBuilderPage.tsx` - done
- [x] `pages/components/MarkdownReaderPage.tsx` - done
- [x] `pages/components/prompt/index.tsx` - done
- [x] `pages/components/prompt/PromptEditorPage.tsx` - done
- [x] `pages/components/prompt/PromptLivePage.tsx` - done
- [x] `pages/components/prompt/PromptPlainPage.tsx` - done
- [x] `pages/components/RepeatPage.tsx` - done
- [x] `pages/components/TabDynamicPage.tsx` - done
- [x] `pages/components/GridPage.tsx` - done: page fully wired to `showcase.grid` namespace, all 6 locales translated
- [x] `pages/components/GridArrayPage.tsx` - done
- [x] `pages/components/GridDbPage.tsx` - done
- [x] `pages/components/GridPreviewPage.tsx` - done
- [x] `pages/components/FormPage.tsx` - done: page fully wired to `showcase.form` namespace, all 6 locales translated
- [x] `pages/components/FormValidationPage.tsx` - done: page fully wired to `showcase.formValidation` namespace, all 6 locales translated

### Form fields

- [x] `pages/components/AutocompletePage.tsx` - done
- [x] `pages/components/CheckboxPage.tsx` - done
- [x] `pages/components/ChecklistPage.tsx` - done
- [x] `pages/components/ImageUrlPage.tsx` - done
- [x] `pages/components/InputPage.tsx` - done
- [x] `pages/components/ListGroupPage.tsx` - done
- [x] `pages/components/SelectPage.tsx` - done
- [x] `pages/components/SwitchPage.tsx` - done
- [x] `pages/components/TextAreaPage.tsx` - done
- [x] `pages/components/UploadPage.tsx` - done
- [x] `pages/components/upload/UploadImagePage.tsx` - done
- [x] `pages/components/upload/UploadDocumentPage.tsx` - done
- [x] `pages/components/upload/UploadCSVPage.tsx` - done

### Blocks

- [x] `pages/components/BrandPage.tsx` - done
- [x] `pages/components/BreadcrumbsPage.tsx` - done
- [x] `pages/components/MenuPage.tsx` - done
- [x] `pages/components/NotificationsPage.tsx` - done
- [x] `pages/components/SearchPage.tsx` - done

## Cross-checks

- [x] Side navigation group labels are fully driven by showcase i18n
- [x] Topbar / shell labels are fully driven by showcase i18n
- [x] Example and benchmark pages use showcase i18n consistently
- [x] Stub pages reviewed for fallback text — `Stub.tsx` wired to `showcase.common.stub` in all 6 locales
- [x] Grep for remaining hardcoded `title="..."` and `description="..."` in showcase pages — all 25 matches are component demo props (out of scope per conventions)
- [x] Monolithic locale files eliminated: `en.ts`, `it.ts`, `de.ts`, `ru.ts`, `zh.ts`, `ar.ts`, `showcaseGridShared.ts` deleted — all 64 namespaces now self-contained in dedicated files
- [x] `legacyLocaleLoaders` and fallback path removed from `showcaseNamespaceLoader.ts`
- [x] Run typecheck — `tsc --noEmit` passes with 0 errors
