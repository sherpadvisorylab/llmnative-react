# i18n Audit — Hardcoded UI Strings

> Updated: 2026-10-26 — CR-097: the components below "Migrated in CR-097" were not in the
> 19/06 census and still had English texts in the code; now in `I18nDict` (en/it/de/ru/ar/zh).
> Framework: `@llmnative/react`

---

## Legend

| Status | Meaning |
|--------|---------|
| ✅ | Fully migrated — no hardcoded user-visible strings |
| ⬜ | Still has hardcoded strings listed below |

---

## Fully migrated (14/14)

| File | Status |
|------|--------|
| `components/ui/Code.tsx` | ✅ `dict.copyCode`, `dict.copy`, `dict.copied`, `dict.codeLanguageDefault` |
| `components/ui/Pagination.tsx` | ✅ `dict.pageNavigation` |
| `components/ui/Buttons.tsx` | ✅ `dict.back` |
| `components/ui/Gallery.tsx` | ✅ `dict.selectItem`, `common.loading`, `common.noDataFound` |
| `components/ui/Table.tsx` | ✅ `dict.noDataFound`, `selectAllRows`, `sortBy`/`sortByCurrent`, `selectRow`, `reorderRow` |
| `components/ui/fields/UploadCSV.tsx` | ✅ `dict.loaded`, `removeFile`, `uploadAnother`, `dropToParse`, `clickOrDrag` |
| `components/ui/fields/Crop.tsx` | ✅ `dict.enableCrop`, `fileName`, `variants`, `outputFile`, `active`, `removeVariant` |
| `components/widgets/ImageEditor.tsx` | ✅ `dict.undo`, `redo`, `zoomOut`/`zoomIn`, `crop`, `flipHorizontal`, `flipVertical`, `rotate`, `freeDrawing`, `arrow`, `text`, `rectangle`, `circle`, `triangle`, `title`, `save` |
| `components/ui/LayoutBuilder.tsx` | ✅ `dict.maxElements`, `noSpace`, `dragToMove`, `remove`, `dragToResize`, `dragHere` |
| `components/blocks/Carousel.tsx` | ✅ `dict.pageNavigation`, `previous`, `next` |
| `src/pages/NotFound.tsx` | ✅ `dict.notFoundMessage`, `goHome` |
| `src/auth.tsx` | ✅ `dict.signIn`, `dict.signOut`, `dict.connected`, `common.loading`, ecc. |
| `src/components/widgets/Prompt.tsx` | ✅ Tutte le stringhe migrate a dict (promptLabel, runFailed, attachmentsNotSupported, defaultOption, aiNotConfiguredShort, tokenInput/output ecc.) |
| `src/components/widgets/MarkdownReader.tsx` | ✅ `dict.codeLanguageDefault`, `dict.copied`, `dict.copy` |

---

## Migrated in CR-097 (12 files)

| File | Status |
|------|--------|
| `components/blocks/Notifications.tsx` | ✅ `notifications.markAllRead`, `empty`, `emptyHint` |
| `components/ErrorBoundary.tsx` | ✅ `errorBoundary.*` (title, description, technical details, debug panel, copy/send report, try again, go home); English via `useI18nDictOrEnglish()` outside `<I18nProvider>` |
| `components/blocks/ThemeSwitcher.tsx` | ✅ `themeSwitcher.*` (header, section labels, light/dark, sharp/rounded, swatch and status names, icon library descriptions, weights) |
| `components/ui/fields/ImageField.tsx` | ✅ `imageField.*` (open original, crop, image URL, alt text, variants) |
| `components/ui/fields/RichText.tsx` | ✅ `richText.*` (toolbar titles, headings, table actions, uploads, source, words/chars, link bubble) + `imageField.*` (image dialogs, new/same tab) + `common.cancel`/`save` |
| `components/ui/fields/Upload.tsx` | ✅ file-name label → `crop.fileName` |
| `components/widgets/TabDynamic.tsx`, `components/ui/TabDynamic.tsx` | ✅ `tabDynamic.addTab` |
| `components/widgets/grid-core/GridCore.tsx` | ✅ `grid.tableView`, `galleryView`, `columns`, `fields` |
| `components/widgets/Chatbot.tsx` | ✅ `prompt.role`, `language`, `voice`, `style`, `temperature`, `stop`, `stopping` |
| `components/blocks/Breadcrumbs.tsx` | ✅ `breadcrumbs.label` (`aria-label` of the `nav`) |

Guard: `tests/unit/i18n.hardcodedText.test.ts` scans these files (plus `SideNav.tsx`) and fails on
a new hard-coded visible text; per-file allowlist for non-translatable literals (`URL`, `DEV`, `rem`,
`KB`, URL placeholders). Translation tests: `tests/unit/components/i18n.components.test.tsx`.

Left as is (not text to translate): font names and icon library names in `ThemeSwitcher`, the
`window.prompt('URL')` of `RichText`, technical error messages.

---

## Nessuna stringa hardcoded rimasta nei file censiti (CR-029, CR-097).
