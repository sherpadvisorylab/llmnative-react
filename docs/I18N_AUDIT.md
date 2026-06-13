# i18n Audit — Hardcoded UI Strings

> Generated: 2026-06-13  
> Framework: `@llmnative/react`  
> Status: work in progress — tracking migration of all user-visible hardcoded strings

---

## Legend

| Status | Meaning |
|--------|---------|
| ✅ | Migrated to i18n |
| 🔄 | Planned / in progress |
| ⬜ | Not yet started |

---

## Already migrated

| Component | Namespace | Keys |
|-----------|-----------|------|
| `components/ui/Modal.tsx` | `modal` | close, save, delete, cancel |
| `components/ui/fields/Select.tsx` | `select` | placeholder |
| `components/blocks/Notifications.tsx` | `notifications` | title, seeAll |
| `components/blocks/Search.tsx` | `common` | search |
| `components/widgets/Form.tsx` | `form` | headerAdd, headerEdit, buttonSave, buttonDelete, buttonBack, requiredField, requiredFieldGeneric, saveSuccess, deleteSuccess, noticeRequiredFields |
| `components/widgets/grid-core/GridCore.tsx` | `grid` | deleteConfirm, buttonAdd |
| `components/ui/fields/Upload.tsx` | `upload` | clickOrDrag, dropToUpload, uploadMore, editFileName, editorImage |

---

## Pending migration

### `components/ui/Code.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 205 | `"Copy code"` | `copyCode` | `code` |

### `components/ui/Pagination.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 116 | `"Page navigation"` | `pageNavigation` | `common` |

### `components/ui/Buttons.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 204 | `"<- Back"` | `back` | `common` |

### `components/ui/Gallery.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 367 | `"Select item {recordKey}"` | `selectItem` | `gallery` |
| 409 | `"Loading..."` | `loading` | `common` |
| 411 | `"No data found"` | `noDataFound` | `common` |

### `components/ui/Table.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 234 | `"No data found"` | `noDataFound` | `common` |
| 300 | `"Select all rows"` | `selectAllRows` | `table` |
| 349–355 | `"Sort by {label}"` / `"Sort by {label}, currently {direction}"` | `sortBy` / `sortByCurrent` | `table` |
| 484 | `"Select row {key}"` | `selectRow` | `table` |
| 509 | `"Reorder row {key}"` | `reorderRow` | `table` |

### `components/ui/fields/UploadCSV.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 156 | `"Loaded"` | `loaded` | `upload` |
| 164 | `"Remove"` | `removeFile` | `upload` |
| 178 | `"Upload another file"` | `uploadAnother` | `upload` |
| 199 | `"Drop to parse"` | `dropToParse` | `upload` |
| 199 | `"Click to upload or drag and drop"` | `clickOrDrag` (shared) | `upload` |

### `components/ui/fields/Crop.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 351 | `"Click {scale} to enable this crop"` | `enableCrop` | `crop` |
| 370 | `"Variants"` | `variants` | `crop` |
| 391 | `"Output file"` | `outputFile` | `crop` |
| 488 | `"active"` | `active` | `crop` |
| 495 | `"Remove {scale} variant"` | `removeVariant` | `crop` |
| 611 | `"File name"` | `fileName` | `crop` |

### `components/widgets/ImageEditor.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 244–287 | `"Undo"` | `undo` | `imageEditor` |
| 244–287 | `"Redo"` | `redo` | `imageEditor` |
| 244–287 | `"Zoom Out"` | `zoomOut` | `imageEditor` |
| 244–287 | `"Zoom In"` | `zoomIn` | `imageEditor` |
| 244–287 | `"Crop"` | `crop` | `imageEditor` |
| 244–287 | `"Flip horizontal"` | `flipHorizontal` | `imageEditor` |
| 244–287 | `"Flip vertical"` | `flipVertical` | `imageEditor` |
| 244–287 | `"Rotate 90°"` | `rotate` | `imageEditor` |
| 244–287 | `"Free drawing"` | `freeDrawing` | `imageEditor` |
| 244–287 | `"Arrow"` | `arrow` | `imageEditor` |
| 244–287 | `"Text"` | `text` | `imageEditor` |
| 244–287 | `"Rectangle"` | `rectangle` | `imageEditor` |
| 244–287 | `"Circle"` | `circle` | `imageEditor` |
| 244–287 | `"Triangle"` | `triangle` | `imageEditor` |
| 295 | `"Image Editor"` | `title` | `imageEditor` |

### `src/auth.tsx` — AuthButton
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 248 | `"Auth provider \"{providerLabel}\" is not configured..."` | `notConfigured` | `auth` |
| 289 | `"AuthProvider does not implement signIn()."` | `notImplemented` | `auth` |
| 299 | `"Connected"` | `connected` | `auth` |
| 299 | `"Sign in"` | `signIn` | `auth` |
| 299 | `"Connect"` | `connect` | `auth` |
| 310 | `"Authenticated"` | `authenticated` | `auth` |
| 352 | `"SIGN IN"` | `signIn` (reuse) | `auth` |
| 367 | `"LOGOUT"` | `signOut` | `auth` |

### `components/widgets/Prompt.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 239 | `"No AI providers are registered."` | `noProviders` | `prompt` |
| 283–284 | `"AI is not configured. You can still edit..."` | `aiNotConfiguredEdit` | `prompt` |
| 283–284 | `"AI is not configured. Prompt execution is unavailable."` | `aiNotConfiguredRun` | `prompt` |
| 315–316 | Prompt ON/OFF tooltip text | `toggleOnTitle` / `toggleOffTitle` | `prompt` |
| 675 | `"Close prompt editor"` / `"Edit prompt settings"` | `closeEditor` / `editSettings` | `prompt` |
| 779 | `"Attach files"` | `attachFiles` | `prompt` |
| 824 | `"No matching commands"` | `noMatchingCommands` | `prompt` |
| 841 | `"Token usage"` | `tokenUsage` | `prompt` |
| 842–846 | `"Input: {n} tok"` / `"Output: {n} tok"` / `"Context: {n}%"` / `"Cost: ~${n}"` / `"Time: {n}s"` | `tokenInput` / `tokenOutput` / `tokenContext` / `tokenCost` / `tokenTime` | `prompt` |
| 849 | `"Run the prompt to see token usage."` | `tokenUsageEmpty` | `prompt` |
| 954 | `"Hide preview"` / `"Show resolved preview"` | `hidePreview` / `showPreview` | `prompt` |
| 969 | `"Run prompt"` | `run` | `prompt` |
| 1071 | `"No AI provider is available for this prompt."` | `noProvider` | `prompt` |
| 1086 | `"The AI provider returned no response."` | `noResponse` | `prompt` |

### `components/ui/LayoutBuilder.tsx` ⚠️ (currently in Italian)
| Line | Text (IT) | Key | Namespace |
|------|-----------|-----|-----------|
| 221 | `"Hai già 12 elementi..."` | `maxElements` | `layout` |
| 249–256 | `"Nessuno spazio..."` | `noSpace` | `layout` |
| 414 | `"Trascina per spostare"` | `dragToMove` | `layout` |
| 433 | `"Rimuovi"` | `remove` | `layout` |
| 452 | `"Trascina per ridimensionare"` | `dragToResize` | `layout` |
| 469 | `"Trascina un elemento qui dentro"` | `dragHere` | `layout` |

### `components/blocks/Carousel.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 93–94 | `"Previous"` / `"Next"` | `previous` / `next` | `common` |

### `src/pages/NotFound.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 8 | `"404"` | skipped (not translatable) | — |
| 9 | `"Oops! Page not found."` | `notFoundMessage` | `common` |
| 10 | `"Go to Home"` | `goHome` | `common` |

### `components/widgets/MarkdownReader.tsx`
| Line | Text | Key | Namespace |
|------|------|-----|-----------|
| 62 | `"text"` (language fallback) | `codeLanguageDefault` | `code` |
| 69 | `"Copied"` / `"Copy"` | `copied` / `copy` | `code` |

---

## Full I18nDict target shape

```ts
interface I18nDict {
  common: {
    save: string; cancel: string; delete: string; close: string; back: string; search: string;
    loading: string; noDataFound: string; pageNavigation: string;
    previous: string; next: string;
    notFoundMessage: string; goHome: string;
  };
  auth: {
    signIn: string; signOut: string; connect: string; connected: string; authenticated: string;
    notConfigured: string; notImplemented: string;
  };
  form: {
    headerAdd: string; headerEdit: string;
    buttonSave: string; buttonDelete: string; buttonBack: string;
    requiredField: string; requiredFieldGeneric: string;
    saveSuccess: string; deleteSuccess: string; noticeRequiredFields: string;
  };
  grid: {
    buttonAdd: string; deleteConfirm: string; emptyState: string;
  };
  select: { placeholder: string };
  modal: { save: string; delete: string; cancel: string; close: string };
  upload: {
    clickOrDrag: string; dropToUpload: string; uploadMore: string;
    editFileName: string; editorImage: string;
    loaded: string; removeFile: string; uploadAnother: string; dropToParse: string;
  };
  notifications: { title: string; seeAll: string };
  code: { copyCode: string; copy: string; copied: string; codeLanguageDefault: string };
  table: {
    noDataFound: string; selectAllRows: string;
    sortBy: string; sortByCurrent: string; selectRow: string; reorderRow: string;
  };
  gallery: { selectItem: string };
  crop: {
    enableCrop: string; variants: string; outputFile: string;
    active: string; removeVariant: string; fileName: string;
  };
  imageEditor: {
    title: string; undo: string; redo: string; zoomOut: string; zoomIn: string;
    crop: string; flipHorizontal: string; flipVertical: string; rotate: string;
    freeDrawing: string; arrow: string; text: string;
    rectangle: string; circle: string; triangle: string;
  };
  prompt: {
    noProviders: string; aiNotConfiguredEdit: string; aiNotConfiguredRun: string;
    toggleOnTitle: string; toggleOffTitle: string;
    closeEditor: string; editSettings: string; attachFiles: string; run: string;
    noMatchingCommands: string;
    tokenUsage: string; tokenInput: string; tokenOutput: string;
    tokenContext: string; tokenCost: string; tokenTime: string; tokenUsageEmpty: string;
    hidePreview: string; showPreview: string;
    noProvider: string; noResponse: string;
  };
  layout: {
    maxElements: string; noSpace: string;
    dragToMove: string; remove: string; dragToResize: string; dragHere: string;
  };
}
```
