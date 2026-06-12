# @llmnative/react â€” AI Reference

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

## App â€” Entry point

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

## Provider System â€” Complete Matrix

| Servizio | Interfaccia | Provider disponibili | Obbligatorio |
|----------|-------------|---------------------|--------------|
| **data** | `DataProviderAdapter` | `mock`, `firebase` (RTDB), `firestoreDb` (Firestore), `supabase` | sÃ¬ (fallback: Mock) |
| **storage** | `StorageProviderAdapter` | `firebase`, `supabase`, `dropbox` | no (null) |
| **auth** | `AuthProviderAdapter` | `google`, `dropbox`, `supabase`, `firebase` | sÃ¬ (fallback: Google) |
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
| `timeout` | number | â€” |
| `icon` | `string \| boolean` | â€” |
| `onClose` | `() => void` | â€” |

#### Badge
```ts
// Simplified: badge prop accepts ReactNode or descriptor
<Badge variant="success">Active</Badge>
```
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `variant` | `"info" \| "success" \| "warning" \| "danger" \| "primary" \| "secondary" \| "light" \| "dark"` | `"primary"` |
| `className` | string | â€” |
| `before`, `after`, `wrapperClassName` | via UIProps | â€” |

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
| `label` | `string \| ReactNode` | â€” |
| `icon` | string | â€” |
| `badge` | `BadgeProps` | â€” |
| `disabled` | boolean | â€” |
| `loading` | boolean | â€” |
| `onClick` | `(e) => any` | â€” |

**LoadingButton extends IButton** with:
| Prop | Type |
|------|------|
| `onClick` | `(e, setMessage?) => Promise<any>` |
| `loadingLabel` | `string \| ReactNode` |

#### Card
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `title` | string | â€” |
| `header` | `string \| ReactNode` | â€” |
| `footer` | `string \| ReactNode` | â€” |
| `loading` | boolean | â€” |
| `showArrow` | boolean | â€” |
| `before`, `after`, `wrapperClassName`, `className` | via UIProps | â€” |

#### Image
| Prop | Type | Default |
|------|------|---------|
| `src` | string | required |
| `fit` | `"cover" \| "contain" \| "fill" \| "scale-down" \| "none"` | `"cover"` |
| `position` | `"center" \| "top" \| "bottom" \| "left" \| "right" \| "top left" \| ...` | `"center"` |
| `width`, `height` | number | â€” |
| `placeholder` | string | â€” |
| `srcset`, `sizes` | string | â€” |
| `label`, `title` | string | â€” |

#### Loader
`<Loader />` â€” mostra spinner di caricamento.

#### Modal
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `title` | `ReactNode` | â€” |
| `header` | `ReactNode` | â€” |
| `footer` | `ReactNode \| false` | â€” |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "fullscreen"` | `"md"` |
| `position` | `"center" \| "top" \| "left" \| "right" \| "bottom"` | `"center"` |
| `onClose` | `() => void` | â€” |
| `onSave` | `ModalSaveHandler` | â€” |
| `onDelete` | `ModalDeleteHandler` | â€” |
| `closeOnBackdrop` | boolean | `true` |
| `zIndex` | number | â€” |
| `allowFullscreen`, `showCancel` | boolean | â€” |

**Sub-components:** `Modal.YesNo` (conferma), `Modal.Ok` (notifica).

#### Percentage
| Prop | Type | Default |
|------|------|---------|
| `value` | number | `0` |
| `max` | number | `100` |
| `min` | number | `0` |
| `appearance` | `"bar" \| "circle"` | `"bar"` |
| `variant` | `"info" \| "success" \| "warning" \| "danger" \| "primary" \| "secondary" \| "light" \| "dark"` | `"info"` |
| `thickness` | number | â€” |
| `showText` | boolean | `true` |
| `size` | number | â€” |
| `label` | string | â€” |

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
| `minItems` | number | â€” |
| `maxItems` | number | â€” |

#### Tab
| Prop | Type | Default |
|------|------|---------|
| `children` | `ReactNode` | required |
| `defaultIndex` | number | `0` |
| `layout` | `"default" \| "top" \| "left" \| "right" \| "bottom"` | `"default"` |
| `motion` | via MotionUIProps | â€” |

**Sub-component:** `<Tab.Item label="Tab 1">Content</Tab.Item>`

#### Table
| Prop | Type | Default |
|------|------|---------|
| `columns` | `TableHeaderProp[]` | â€” |
| `records` | `RecordArray` | â€” |
| `onRowClick` | `(record) => void` | â€” |
| `onReorder` | `TableReorderHandler` | â€” |
| `onSelectionChange` | `TableSelectionChangeHandler` | â€” |
| `selection` | `"single" \| "multiple"` | â€” |
| `sortable` | `boolean \| OrderConfig` | â€” |
| `pagination` | `PaginationParams` | â€” |
| `groupBy` | `string \| string[]` | â€” |
| `renderCell` | `(record, key, index) => ReactNode` | â€” |

**TableHeaderProp:** `{ key: string; label: string; className?: string; sort?: boolean }`

#### Gallery
| Prop | Type | Default |
|------|------|---------|
| `records` | `GalleryRecord[]` | â€” |
| `overlays` | `GalleryOverlay[]` | â€” |
| `onClickRow` | `(record) => void` | â€” |
| `onSelectionChange` | `GallerySelectionChangeHandler` | â€” |
| `sortable` | `boolean \| OrderConfig` | â€” |
| `pagination` | `PaginationParams` | â€” |
| `gutterSize` | `0 \| 1 \| 2 \| 3 \| 4 \| 5` | â€” |
| `columns` | `1 \| 2 \| 3 \| 4 \| 6` | â€” |
| `groupBy` | `string \| string[]` | â€” |

**GalleryRecord extends RecordProps** con: `img`, `thumbnail`, `mimetype`, `width`, `height`, `name`.

**GalleryOverlay:** `{ position, badge?, render?, when?, className? }`

#### GridSystem
Row/Col layout component. `<GridSystem.Row><GridSystem.Col xs={12} md={6}>...</GridSystem.Col></GridSystem.Row>`

#### Code
`<Code language="tsx">code</Code>` â€” syntax-highlighted code block.

#### Icon
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `size` | number | â€” |

Usa il provider icone configurato (lucide/phosphor/custom).

#### ImageAvatar
`<ImageAvatar src="..." label="User" size={40} />` â€” Avatar circolare con fallback iniziali.

#### LayoutBuilder
`<LayoutBuilder layout={[...]} />` â€” layout declarativo multi-riga.

---

### Form Fields

#### Input
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `label` | string | â€” |
| `required` | boolean | â€” |
| `inputType` | `"text" \| "number" \| "email" \| "password" \| "color" \| "date" \| "time" \| "datetime-local" \| "week" \| "month"` | `"text"` |
| `placeholder` | string | â€” |
| `disabled` | boolean | â€” |
| `min`, `max`, `step` | number | â€” |
| `defaultValue` | any | â€” |
| `validator` | `(value) => string \| undefined` | â€” |

**Sub-components:** `<Input.TextArea rows={4} />`, `<Input.Checkbox valueChecked="yes" />`, `<Input.ListGroup>`

#### Select
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `label` | string | â€” |
| `options` | `Option[] \| string[] \| number[]` | â€” |
| `optionsSource` | `DBConfig` (carica da provider) | â€” |
| `required` | boolean | â€” |
| `order` | `{ field: 'label' \| 'value', dir: 'asc' \| 'desc' }` | â€” |

**Sub-components:**
- `<Select.Autocomplete optionsSource={{ path: "/users", labelField: "email" }} />` â€” autocomplete con ricerca
- `<Select.Checklist options={[...]} />` â€” multi-selezione a checkbox

**DBConfig:** `{ path: string; labelField: string; valueField?: string }`

#### Upload
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `label` | string | â€” |
| `editable` | boolean | â€” |
| `multiple` | boolean | â€” |
| `accept` | string | â€” |
| `max` | number | â€” |

**Sub-components:**
- `<Upload.Image />` â€” con crop e preview
- `<Upload.Document />` â€” file generici
- `<UploadCSV />` â€” import CSV con preview tabellare

#### Prompt
Campo AI-potenziato con editor e modalita live.
| Prop | Type | Default |
|------|------|---------|
| `name` | string | required |
| `mode` | `"edit" \| "run"` | `"edit"` |
| `rows` | number | - |
| `onRunPrompt` | `(prompt, options, data?) => Promise<string>` | - |
| `commands` | `PromptCommand[]` | - |
| `attachments` | boolean | `false` |
| `actions` | `PromptAction[]` | - |
| `statusItems` | `PromptStatusItem[]` | - |
| `renderFallback` | `(props) => ReactNode` | - |
| `renderAIUnavailable` | `(props) => ReactNode` | - |

```tsx
<Prompt
  name="summary"
  mode={PromptMode.RUN}
  commands={[
    { name: 'translate', icon: 'languages', handler: (value) => `Translate to English:\n\n${value}` },
  ]}
  attachments
  actions={[{ key: 'tokenUsage', icon: 'bar-chart-2', label: 'Token details' }]}
  statusItems={['tokensIn', 'tokensOut', 'contextPercent', 'duration']}
/>
```

```ts
type PromptCommand = {
  name: string
  description?: string
  icon?: string
  handler?: (currentValue: string) => string | Promise<string>
}

type PromptAction = {
  key: string
  icon: string
  label?: string
  content?: React.ReactNode
}

type PromptStatusItem =
  | 'tokensIn' | 'tokensOut' | 'contextPercent' | 'model' | 'duration'
  | { key: string; render: (stats: PromptRunStats) => React.ReactNode }
```

`onRunPrompt` receives `AIRequestOptions.attachments` when files are attached. `PromptUtils` also exports `countTokens()`, `modelContextWindow()`, `contextPercent()`, `estimateCost()` and `fileToAttachment()`.
#### WorkflowAI _(CR-039, coming soon)_
`<WorkflowAI steps={[...]} />` â€” pipeline di prompt multi-step con selezione varianti e output concatenato tra step.

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
| `trail` | `string \| BreadcrumbItem[]` | â€” |
| `rootItem` | `string \| BreadcrumbItem` | â€” |
| `separator` | `"/" \| ">" \| "chevron" \| string` | `"/"` |
| `jsonLd` | boolean | â€” |

**BreadcrumbItem:** `{ label: string; href?: string }`

#### Menu
Nav tree generato da `menuConfig`. Renderizzato da App.

| Prop | Type |
|------|------|
| `menuKey` (path unico per contesto) | string |
| `as` | `'ul' \| 'ol'` |
| `badges` | `Record<string, { type?: BadgeType, children: string }>` |

#### Notifications
Dropdown notifiche con badge.

#### Search
`<Search onQueryChange={(e) => ...} />` â€” input ricerca.

#### Carousel
Carosello immagini con swipe e navigazione.

#### Dropdown
`<Dropdown>` â€” menu a discesa. Esportato via `* from ./blocks/Dropdown` con tutti i suoi sub-components.

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
  onComplete={async ({ record, action }) => true}
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
  appearance="card"
  onLoad={(data) => ({ ...data, price: data.price / 100 })}
  onSave={async ({ record }) => ({ ...record, price: record.price * 100 })}
  onComplete={async ({ action }) => { if (action === 'save') navigate('/products') }}
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
| `path` | string | â€” |
| `children` | `ReactNode \| ((fields) => ReactNode)` | â€” |
| `defaultValues` | `RecordProps` | â€” |
| `keyGenerator` | `(record) => string` | â€” |
| `onLoad` | `(record) => void` | â€” |
| `onRecordChange` | `(record) => void` | â€” |
| `onSave` | `FormSaveHandler` | â€” |
| `onDelete` | `FormDeleteHandler` | â€” |
| `onComplete` | `FormFinallyHandler` | â€” |
| `showBack` | boolean | â€” |

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
  maxPageButtons?: number;
  scrollToTopOnChange?: boolean;
  scrollBehavior?: ScrollBehavior;
  align?: "start" | "center" | "end";
  sticky?: boolean;
};
```

`<Pagination records={items}>{(pageRecords, offset) => ...}</Pagination>` â€” render prop pattern.

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
- `cn` â€” classname merger (tailwind-merge compatible)
- `converter` â€” data converters (date, number, etc.)
- `sanitizer` â€” HTML sanitizer
- `order` â€” `Order` class for sorting
- `path` â€” utility per percorsi dot-notation
- `db`, `storage` â€” Firebase RTDB/SRG raw access
- `seo` â€” `getKeywordIdeas()`, `getGoogleTrendsData()`
- `fetch` â€” HTTP fetch helper

---

## Key types

```ts
type RecordProps = Record<string, any>
type RecordArray = RecordProps[]
type RecordSelectionState<T> = { keys: string[]; records: T[]; hasSelection: boolean; clear: () => void }

interface UIProps {
  before?: React.ReactNode
  after?: React.ReactNode
  wrapperClassName?: string
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


