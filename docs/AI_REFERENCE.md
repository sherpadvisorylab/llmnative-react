# @llmnative/react — AI Reference

Framework React AI-first per generazione deterministica di UI. Data-driven di default, schema-driven opzionale.

```bash
npx @llmnative/react create    # scaffold
npm install @llmnative/react   # manual
```

Importare CSS: `import '@llmnative/react/dist/index.css'`

---

## Naming conventions (strict)

| Prop | Cosa controlla | Valori |
|------|----------------|--------|
| `view` | Presentazione contenuto | `table \| gallery`, `list \| carousel` |
| `appearance` | Guscio visuale | `card \| plain`, `button \| avatar` |
| `layout` | Disposizione spaziale interna | `vertical \| horizontal \| inline`, `split \| stacked` |
| `mode` | Comportamento operativo | `editor \| live`, `light \| dark \| system` |
| `variant` | Tono semantico/cromatico | `primary \| secondary \| danger` |
| `position` | Ancoraggio/comparsa | `center \| left \| right \| top \| bottom` |
| `size` | Scala/dimensione | `sm \| md \| lg \| xl \| fullscreen` |

---

## App — Entry point

```tsx
<App
  providers={{
    firebase: { config },
    supabase: { config },
    google: { oAuth2 },
    services: {
      data: 'firebase',      // DataDriverName
      storage: 'supabase',   // StorageDriverName | null
      auth: 'google',        // AuthDriverName | null
      email: 'gmail',        // EmailDriverName | null
      ai: 'openai',          // AIDriverName | null
    },
  }}
  iconProvider="lucide"      // 'lucide' | 'phosphor' | AppIconProviderConfig
  themeProvider              // 'default' | 'flat' | 'cyber' | AppThemeProviderConfig
  menuConfig={menuConfig}
  importPage={(path) => import(path)}
/>
```

### AppThemeProviderConfig
```ts
{
  mode: 'light' | 'dark' | 'system';
  theme: 'default' | 'flat' | 'cyber' | string;
  // Built-in themes: default, flat, cyber
  themes?: Record<string, {
    preset?: ThemePresetConfig;       // colors, radius, font
    motion?: MotionRegistry;
    components?: Record<string, Partial<ThemeComponent>>;
  }>;
  themeOverride?: Record<string, Partial<ThemeComponent>>;
}
```

### AppIconProviderConfig
```ts
{
  providers?: Record<string, IconProviderAdapter>;
  default: string;       // provider name
  aliases?: Record<string, string>;  // e.g. { delete: 'trash', edit: 'pencil' }
}
```

---

## Provider System — Complete Matrix

| Servizio | Interfaccia | Provider disponibili | Obbligatorio |
|----------|-------------|---------------------|--------------|
| **data** | `DataProviderAdapter` | `mock`, `firebase` (RTDB), `firestoreDb` (Firestore), `supabase` | sì (fallback: Mock) |
| **storage** | `StorageProviderAdapter` | `firebase`, `supabase`, `dropbox` | no (null) |
| **auth** | `AuthProviderAdapter` | `google`, `dropbox`, `supabase`, `firebase` | sì (fallback: Google) |
| **email** | `EmailProviderAdapter` | `gmail` | no (null) |
| **ai** | `AIProviderAdapter` | `openai`, `openrouter`, `opencode`, `deepseek`, `gemini`, `anthropic`, `mistral` | no (null) |

### Config keys per provider

| Provider | Config |
|----------|--------|
| Firebase RTDB | `{ config: FirebaseConfig }` |
| Firestore | `{ config: FirebaseConfig }` (autodetected, no extra key) |
| Supabase | `{ config: SupabaseConfig }` |
| Mock | `{ data: RecordArray }` |
| Google Auth | `{ oAuth2: GoogleOAuth2Config }` |
| Dropbox | `{ config: DropboxConfig }` |
| Gmail | `{ enabled: true }` |
| AI keys | `{ geminiApiKey, openaiApiKey, anthropicApiKey, deepSeekApiKey, mistralApiKey }` in `Config.tsx` |

### Hooks per provider

```ts
const data    = useDataProvider()              // DataProviderAdapter | null
const storage = useStorageProvider()           // StorageProviderAdapter | null
const auth    = useAuthProvider()              // AuthProviderAdapter | null
const email   = useEmailProvider()             // EmailProviderAdapter | null
const ai      = useAIProvider()                // AIProviderAdapter | null
const aiReg   = useAIProviderRegistry()        // all AI providers

// Named provider (multi-provider setup):
const supabase = useDataProvider('supabase')   // DataProviderAdapter | null
```

---

## Component Catalog

### UI Primitives

#### Alert
| Prop | Type | Default |
|------|------|---------|
| `children` | `string \| ReactNode` | required |
| `variant` | `"info" \| "success" \| "warning" \| "danger" \| "primary" \| "secondary" \| "light" \| "dark"` | `"info"` |
| `appearance` | `"default" \| "text"` | `"default"` |
| `placement` | `"inline" \| "fixed"` | `"inline"` |
| `timeout` | number | — |
| `icon` | `string \| boolean` | — |
| `onClose` | `() => void` | — |

#### Badge
```ts
// Simplified: badge prop accepts ReactNode or descriptor
<Badge variant="success">Active</Badge>
```
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `variant` | `"info" \| "success" \| "warning" \| "danger" \| "primary" \| "secondary" \| "light" \| "dark"` | `"primary"` |
| `className` | string | — |
| `pre`, `post`, `wrapClass` | via UIProps | — |

#### Button variants
| Component | Props | Usage |
|-----------|-------|-------|
| `ActionButton` | `IButton` | Standard button |
| `LoadingButton` | `LoadingButtonProps` | Async with loader |
| `BackLink` | `BackLinkProps` | Navigate back |
| `GoSite` | `GoSiteProps` | External link |
| `ReferSite` | `ReferSiteProps` | Referral card |

**IButton props:**
| Prop | Type | Default |
|------|------|---------|
| `variant` | `"primary" \| "secondary" \| "danger" \| "success" \| "warning" \| "info" \| "light" \| "dark" \| "outline-*" \| "link"` | `"primary"` |
| `label` | `string \| ReactNode` | — |
| `icon` | string | — |
| `badge` | `BadgeProps` | — |
| `disabled` | boolean | — |
| `showLoader` | boolean | — |
| `onClick` | `(e) => any` | — |

**LoadingButton extends IButton** with:
| Prop | Type |
|------|------|
| `onClick` | `(e, setMessage?) => Promise<any>` |
| `loadingLabel` | `string \| ReactNode` |

#### Card
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `title` | string | — |
| `header` | `string \| ReactNode` | — |
| `footer` | `string \| ReactNode` | — |
| `showLoader` | boolean | — |
| `showArrow` | boolean | — |
| `pre`, `post`, `wrapClass`, `className` | via UIProps | — |

#### Image
| Prop | Type | Default |
|------|------|---------|
| `src` | string | required |
| `fit` | `"cover" \| "contain" \| "fill" \| "scale-down" \| "none"` | `"cover"` |
| `position` | `"center" \| "top" \| "bottom" \| "left" \| "right" \| "top left" \| ...` | `"center"` |
| `width`, `height` | number | — |
| `placeholder` | string | — |
| `srcset`, `sizes` | string | — |
| `label`, `title` | string | — |

#### Loader
`<Loader />` — mostra spinner di caricamento.

#### Modal
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `title` | `ReactNode` | — |
| `header` | `ReactNode` | — |
| `footer` | `ReactNode \| false` | — |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "fullscreen"` | `"md"` |
| `position` | `"center" \| "top" \| "left" \| "right" \| "bottom"` | `"center"` |
| `onClose` | `() => void` | — |
| `onSave` | `ModalSaveHandler` | — |
| `onDelete` | `ModalDeleteHandler` | — |
| `closeOnBackdrop` | boolean | `true` |
| `zIndex` | number | — |
| `buttonFullscreen`, `buttonCancel` | boolean | — |

**Sub-components:** `Modal.YesNo` (conferma), `Modal.Ok` (notifica).

#### Percentage
| Prop | Type | Default |
|------|------|---------|
| `val` | number | `0` |
| `max` | number | `100` |
| `min` | number | `0` |
| `appearance` | `"bar" \| "circle"` | `"bar"` |
| `variant` | `"info" \| "success" \| "warning" \| "danger" \| "primary" \| "secondary" \| "light" \| "dark"` | `"info"` |
| `thickness` | number | — |
| `showText` | boolean | `true` |
| `size` | number | — |
| `label` | string | — |

#### Repeat
```tsx
<Repeat name="items" defaultLength={3}>
  {(index) => <Input name={`items.${index}.name`} label={`Item ${index + 1}`} />}
</Repeat>
```
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `children` | `(index: number, array: any[]) => ReactNode` | required |
| `defaultLength` | number | `0` |
| `maxLength` | number | — |

#### Tab
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `defaultTab` | number | `0` |
| `tabPosition` | `"default" \| "top" \| "left" \| "right" \| "bottom"` | `"default"` |
| `motion` | via MotionUIProps | — |

**Sub-component:** `<Tab.Item label="Tab 1">Content</Tab.Item>`

#### Table
| Prop | Type | Default |
|------|------|---------|
| `header` | `TableHeaderProp[]` | — |
| `body` | `RecordArray` | — |
| `onClick` | `(record) => void` | — |
| `onReorder` | `TableReorderHandler` | — |
| `onSelectionChange` | `TableSelectionChangeHandler` | — |
| `selectionMode` | `"single" \| "multiple"` | — |
| `sortable` | `boolean \| OrderConfig` | — |
| `pagination` | `PaginationParams` | — |
| `groupBy` | `string \| string[]` | — |
| `renderCell` | `(record, key, index) => ReactNode` | — |

**TableHeaderProp:** `{ key: string; label: string; className?: string; sort?: boolean }`

#### Gallery
| Prop | Type | Default |
|------|------|---------|
| `body` | `GalleryRecord[]` | — |
| `overlays` | `GalleryOverlay[]` | — |
| `onClick` | `(record) => void` | — |
| `onSelectionChange` | `GallerySelectionChangeHandler` | — |
| `sortable` | `boolean \| OrderConfig` | — |
| `pagination` | `PaginationParams` | — |
| `gutterSize` | `0 \| 1 \| 2 \| 3 \| 4 \| 5` | — |
| `rowCols` | `1 \| 2 \| 3 \| 4 \| 6` | — |
| `groupBy` | `string \| string[]` | — |

**GalleryRecord extends RecordProps** con: `img`, `thumbnail`, `mimetype`, `width`, `height`, `name`.

**GalleryOverlay:** `{ position, badge?, render?, when?, className? }`

#### GridSystem
Row/Col layout component. `<GridSystem.Row><GridSystem.Col xs={12} md={6}>...</GridSystem.Col></GridSystem.Row>`

#### Code
`<Code language="tsx">code</Code>` — syntax-highlighted code block.

#### Icon
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `size` | number | — |

Usa il provider icone configurato (lucide/phosphor/custom).

#### ImageAvatar
`<ImageAvatar src="..." label="User" size={40} />` — Avatar circolare con fallback iniziali.

#### LayoutBuilder
`<LayoutBuilder layout={[...]} />` — layout declarativo multi-riga.

---

### Form Fields

#### Input
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `label` | string | — |
| `required` | boolean | — |
| `inputType` | `"text" \| "number" \| "email" \| "password" \| "color" \| "date" \| "time" \| "datetime-local" \| "week" \| "month"` | `"text"` |
| `placeholder` | string | — |
| `disabled` | boolean | — |
| `min`, `max`, `step` | number | — |
| `defaultValue` | any | — |
| `validator` | `(value) => string \| undefined` | — |

**Sub-components:** `<Input.TextArea rows={4} />`, `<Input.Checkbox valueChecked="yes" />`, `<Input.ListGroup>`

#### Select
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `label` | string | — |
| `options` | `Option[] \| string[] \| number[]` | — |
| `db` | `DBConfig` (carica da provider) | — |
| `required` | boolean | — |
| `order` | `{ field: 'label' \| 'value', dir: 'asc' \| 'desc' }` | — |

**Sub-components:**
- `<Select.Autocomplete db={{ path: "/users", labelField: "email" }} />` — autocomplete con ricerca
- `<Select.Checklist options={[...]} />` — multi-selezione a checkbox

**DBConfig:** `{ path: string; labelField: string; valueField?: string }`

#### Upload
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `label` | string | — |
| `editable` | boolean | — |
| `multiple` | boolean | — |
| `accept` | string | — |
| `max` | number | — |

**Sub-components:**
- `<Upload.Image />` — con crop e preview
- `<Upload.Document />` — file generici
- `<UploadCSV />` — import CSV con preview tabellare

#### Prompt
Campo AI-potenziato con editor e modalità live.
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `mode` | `"edit" \| "run"` | `"edit"` |
| `rows` | number | — |
| `onRunPrompt` | `(prompt, options, data?) => Promise<string>` | — |
| `renderPlainFallback` | `(props) => ReactNode` | — |
| `renderAIUnavailable` | `(props) => ReactNode` | — |

#### AssistantAI
`<AssistantAI view="chat" />` — chat AI integrata con streaming e contesto.

---

### Blocks

#### Brand
| Prop | Type |
|------|------|
| `url` | string |
| `label` | string |
| `logo` | string |
| `width`, `height` | number |

#### Breadcrumbs
| Prop | Type | Default |
|------|------|---------|
| `trail` | `string \| BreadcrumbItem[]` | — |
| `rootItem` | `string \| BreadcrumbItem` | — |
| `separator` | `"/" \| ">" \| "chevron" \| string` | `"/"` |
| `jsonLd` | boolean | — |

**BreadcrumbItem:** `{ label: string; href?: string }`

#### Menu
Nav tree generato da `menuConfig`. Renderizzato da App.

| Prop | Type |
|------|------|
| `context` (path unico per contesto) | string |
| `Type` | `'ul' \| 'ol'` |
| `badges` | `Record<string, { type?: BadgeType, children: string }>` |

#### Notifications
Dropdown notifiche con badge.

#### Search
`<Search handleSearch={(e) => ...} />` — input ricerca.

#### Carousel
Carosello immagini con swipe e navigazione.

#### Dropdown
`<Dropdown>` — menu a discesa. Esportato via `* from ./blocks/Dropdown` con tutti i suoi sub-components.

---

### Widgets

#### Grid
Il componente CRUD principale. Supporta data provider e in-memory.

```tsx
<Grid
  path="/users"            // DataProvider-backed (string | "fromUrl")
  // OR records={users}    // In-memory array (alternativa a path)
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: ({ value }) => <Badge>{value}</Badge> },
  ]}
  actions={['add', 'edit', 'delete']}    // oppure Record<string, GridAction>
  view="table"                           // "table" | "gallery"
  pagination={{ limit: 20 }}
  groupBy="status"                       // string | string[]
  sortable={{ field: 'name', dir: 'asc' }}
  form={<FormFields />}                  // Form condiviso per CRUD
  onSave={async ({ record, action }) => { /* ... */ }}
  onAfterAction={async ({ record, action }) => true}
  selection={{ mode: 'multiple', onChange: (sel) => {} }}
  header={(ctx) => <div>{ctx.title}</div>}
  footer={(ctx) => <div>{ctx.records.length} records</div>}
  reorderable
  onReorder={(records, meta) => {}}
/>
```

**GridColumn render built-in:** `"text" \| "email" \| "date" \| "datetime" \| "badge" \| "image" \| "boolean" \| "json"` oppure `(ctx) => ReactNode`.

**GridAction kind:** `"modal"` (default), `"route"`, `"external"`, `"inline"`, `"delete"`.

**Actions shorthand:** `['add', 'edit', 'delete']` si espande a azioni built-in con modal/form.

#### Form
Form CRUD con validazione, nested data, lifecycle hooks.

```tsx
<Form
  path="/products"            // DataProvider-backed
  // aspect deprecated: use empty wrapper
  onLoad={(data) => ({ ...data, price: data.price / 100 })}
  onSave={async ({ record }) => ({ ...record, price: record.price * 100 })}
  onFinally={async ({ action }) => { if (action === 'save') navigate('/products') }}
  keyGenerator={() => `prod_${Date.now()}`}
  defaultValues={{ status: 'draft' }}
  showBack
>
  <Input name="title" label="Title" required />
  <Input name="price" label="Price" inputType="number" />
</Form>
```

| Prop | Type | Default |
|------|------|---------|
| `path` | string | — |
| `children` | `ReactNode \| ((fields) => ReactNode)` | — |
| `defaultValues` | `RecordProps` | — |
| `keyGenerator` | `(record) => string` | — |
| `onLoad` | `(record) => void` | — |
| `onChange` | `(record) => void` | — |
| `onSave` | `FormSaveHandler` | — |
| `onDelete` | `FormDeleteHandler` | — |
| `onFinally` | `FormFinallyHandler` | — |
| `showBack` | boolean | — |

**Nested/array data:**
```tsx
<Input name="address.city" label="City" />
<Input name="items.0.name" label="First item" />
```

**FormRef** (via `useRef<FormRef>()`): `{ handleSave, handleDelete, getRecord, getHeader, getFooter }`

#### TabDynamic
Tab dinamico con lazy loading dei contenuti.

#### ImageEditor
Editor immagine con crop, rotate, filtri. Output canvas.

#### MarkdownReader
Render Markdown con frontmatter, syntax highlight, TOC.

---

## Pagination

```ts
type PaginationParams = {
  page?: number;
  limit?: number;
  navLimit?: number;
  scrollToTopOnChange?: boolean;
  scrollBehavior?: ScrollBehavior;
  align?: "start" | "center" | "end";
  sticky?: boolean;
};
```

`<Pagination recordSet={items}>{(pageRecords, offset) => ...}</Pagination>` — render prop pattern.

---

## Order

```ts
type OrderConfig = {
  field: string;
  dir: 'asc' | 'desc';
};
```

---

## DatabaseOptions (per Grid query)

```ts
type DatabaseOptions = {
  where?: WhereClause[];
  order?: OrderClause[];
  fieldMap?: Record<string, string>;
};

type WhereClause = {
  field: string;
  op: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not-in' | 'array-contains' | 'array-contains-any';
  value: any;
};

type OrderClause = {
  field: string;
  dir: 'asc' | 'desc';
};
```

---

## AI Integration

```ts
import { AI } from '@llmnative/react'

const text  = await AI.fetch("Write a title for: {keyword}", { keywords: ["React"] })
const json  = await AI.json("List of 5 categories for a tech blog")
const arr   = await AI.array("5 tags for: machine learning")
```

**Hooks:**
```ts
const provider = useAIProvider()                     // default AI provider
const registry = useAIProviderRegistry()             // all registered AI providers
const catalog  = getAIModelCatalog(providerId?)      // available models
```

**Custom provider:**
```ts
import { AIProviderAdapter } from '@llmnative/react'

class MyAIProvider implements AIProviderAdapter {
  async fetch(prompt: string, options?: AIRequestOptions): Promise<string> { ... }
  async json<T>(prompt: string, options?: AIRequestOptions): Promise<T> { ... }
  async array(prompt: string, options?: AIRequestOptions): Promise<string[]> { ... }
}
```

---

## Hooks Reference

| Hook | Returns | Usage |
|------|---------|-------|
| `useDataProvider(name?)` | `DataProviderAdapter \| null` | CRUD operations |
| `useStorageProvider(name?)` | `StorageProviderAdapter \| null` | File upload/download |
| `useAuthProvider(name?)` | `AuthProviderAdapter \| null` | Sign in/out, user profile |
| `useEmailProvider(name?)` | `EmailProviderAdapter \| null` | Send emails |
| `useAIProvider(name?)` | `AIProviderAdapter \| null` | AI fetch/json/array |
| `useAIProviderRegistry()` | `Record<string, AIProviderAdapter>` | All AI providers |
| `useTheme()` | `Theme \| undefined` | Current theme object |
| `useThemeController()` | `ThemeController` | `applyTheme()`, `setMode()` |
| `useIconController()` | `IconController` | `setProvider()`, `getIcon()` |
| `useIconProvider()` | `IconProviderAdapter` | Icon rendering |
| `useAccessToken()` | `string \| null` | OAuth access token |
| `useGlobalVars()` | `Record<string, any>` | localStorage-backed state |
| `useHead()` | `HeadController` | Document head (title, meta, links) |
| `useProxy()` | `(url, init?) => Promise<Response>` | Proxy fetch |
| `useImage()` | `UseImageResult` | Image srcset builder |

### DataProviderAdapter interface
```ts
interface DataProviderAdapter {
  read(path: string, options?: ReadOptions): Promise<any>
  set(path: string, data: object): Promise<void>
  update(path: string, data: object): Promise<void>
  remove(path: string): Promise<void>
  subscribe(path: string | undefined, callback: (records: RecordArray) => void): () => void
  count?(path: string, where?: WhereClause[]): Promise<number>
}
```

### StorageProviderAdapter interface
```ts
interface StorageProviderAdapter {
  upload(file: string, path: string): Promise<string | undefined>
  getURL(path: string): Promise<string | undefined>
  download(path: string): Promise<Blob | undefined>
  delete(path: string): Promise<boolean>
}
```

### AuthProviderAdapter interface
```ts
interface AuthProviderAdapter {
  signIn(intent?: AuthIntent, options?: AuthSignInOptions): Promise<UserProfile | undefined>
  signOut(): Promise<void>
  onAuthChange(callback: (user: UserProfile | null) => void): () => void
  getAccessToken(): Promise<string | null>
  getUser(): UserProfile | null
}
```

### EmailProviderAdapter interface
```ts
interface EmailProviderAdapter {
  send(params: EmailSendParams): Promise<boolean>
}
```

---

## Built-in utility exports da `libs/`

```ts
import { db, storage, path, log, seo } from '@llmnative/react'
import { converter, sanitizer, fetch, utils, order } from '@llmnative/react'
import { cn, useImage } from '@llmnative/react'
```
- `cn` — classname merger (tailwind-merge compatible)
- `converter` — data converters (date, number, etc.)
- `sanitizer` — HTML sanitizer
- `order` — `Order` class for sorting
- `path` — utility per percorsi dot-notation
- `db`, `storage` — Firebase RTDB/SRG raw access
- `seo` — `getKeywordIdeas()`, `getGoogleTrendsData()`
- `fetch` — HTTP fetch helper

---

## Key types

```ts
type RecordProps = Record<string, any>
type RecordArray = RecordProps[]
type RecordSelectionState<T> = { keys: string[]; records: T[]; hasSelection: boolean; clear: () => void }

interface UIProps {
  pre?: React.ReactNode
  post?: React.ReactNode
  wrapClass?: string
  className?: string
}

interface MotionUIProps extends UIProps {
  motion?: MotionReference
}

interface DBConfig {
  path: string
  labelField: string
  valueField?: string
  where?: WhereClause[]
  order?: OrderClause[]
}
```

---

## Pages esportate

| Componente | Source | Uso |
|-----------|--------|-----|
| `PageUsers` | `src/pages/Users` | Esempio CRUD utenti |
| `PageHelper` | `src/pages/Helper` | Pagina helper generica |
| `PageBlog` | `src/pages/Blog` | Pagina blog |

---

## ErrorBoundary

Tre livelli: App (fullPage), provider, route-specific (`key={item.path}`).

---

## Global state

```ts
const vars = useGlobalVars()           // tutte le variabili
getGlobalVars(key)                     // getter sincrono
setGlobalVars({ key: value })          // setter
removeGlobalVars(key)                  // rimuovi
```

Backend: `localStorage`. Dati condivisi tra pagine senza provider.
