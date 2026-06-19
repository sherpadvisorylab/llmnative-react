# i18n Audit — Hardcoded UI Strings

> Updated: 2026-06-19 — re-audited against real codebase.
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

## Nessuna stringa hardcoded rimasta. CR-029 completato.
