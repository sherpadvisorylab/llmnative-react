# Components API Reference

> TL;DR per AI: questa pagina è il riferimento completo di props per ogni componente. Per esempi d'uso vedi [patterns.md](patterns.md) e [examples/](examples/).

---

## Widgets (smart — gestiscono stato e persistenza)

### `<Form>`

Carica un record da database, gestisce lo stato dei campi figli, salva e cancella.

```tsx
<Form
  dataStoragePath="/collection"   // path Firebase della collezione
  recordId="abc123"               // id record specifico (ometti per nuovo record)
  aspect="card"                   // "card" | "none" (default: "none")
  showBack={true}                 // mostra bottone indietro
  defaultValues={{ role: "user" }}// valori iniziali per nuovo record
  onLoad={(data) => data}         // trasforma dati dopo caricamento
  onSave={async ({ record, isNewRecord, storagePath }) => record}
  onDelete={async ({ record }) => {}}
  onFinally={async ({ action, record }) => true}
  setPrimaryKey={() => `id_${Date.now()}`}
  savePath={(record) => `/users/${record.email}`}
  ref={formRef}                   // FormRef per controllo esterno
>
  {/* fields figli */}
</Form>
```

### `<Grid>`

Lista dati con real-time updates, sorting, paginazione, modal CRUD integrato.

```tsx
<Grid
  dataStoragePath="/collection"   // Firebase path (real-time listener)
  dataArray={records}             // alternativa: dati in memoria
  columns={[
    {
      key: 'fieldName',
      label: 'Label colonna',
      sort: true,                 // abilita sorting su questa colonna
      onDisplay: ({ value, record, key }) => <span>{value}</span>,
      // oppure: onDisplay: 'toDate' (converter built-in)
    }
  ]}
  allowedActions={["add", "edit", "delete"]}
  allowedSorting={true}
  modal={{
    mode: "form",                 // "form" | "empty"
    size: "lg",                   // Bootstrap modal size
    position: "center",
    onOpen: (record) => <CustomModalContent record={record} />,
  }}
  type="table"                    // "table" | "gallery"
  groupBy="status"                // stringa o array di stringhe
  pagination={{ perPage: 20 }}
  sticky="top"                    // "top" | "bottom"
  header={<h2>Titolo</h2>}
  headerAction={<button>Azione</button>}
  // oppure: headerAction={(records) => <span>{records.length} records</span>}
  footer={<div>Footer</div>}
  onLoadRecord={(record, index) => record}  // return false per escludere
  onDisplayBefore={async (records, setRecords, setLoader) => {}}
  onClick={(record) => navigate(`/detail/${record._key}`)}
  onSave={async ({ record, action, storagePath }) => ""}
  onDelete={async ({ record }) => ""}
  onFinally={async ({ record, action }) => true}
>
  {/* children: fields usati nel modal form */}
  {({ record }) => (
    <Input name="name" label="Nome" />
  )}
</Grid>
```

---

## Fields (controlled — ricevono value e onChange da Form)

### `<Input>`

```tsx
<Input
  name="fieldName"          // obbligatorio — supporta dot notation
  label="Label"
  inputType="text"          // text | number | email | password | color |
                            // date | datetime-local | time | week | month
  required={true}
  defaultValue=""
  placeholder="..."
  min={0}                   // per number, date
  max={100}
  step={0.01}               // per number
  disabled={false}
  updatable={false}         // true = readonly dopo il primo valore
  wrapClass="mb-3"          // classe CSS del wrapper
  className="form-control"  // classe CSS dell'input
  pre={<span>€</span>}      // contenuto prima dell'input
  post={<span>.00</span>}   // contenuto dopo l'input
  onChange={(name, value) => {}}
/>
```

### `<Select>`

```tsx
<Select
  name="fieldName"
  label="Label"
  options={[
    { label: "Opzione 1", value: "val1" },
    { label: "Opzione 2", value: "val2" },
  ]}
  // OPPURE: da database
  db={{
    path: "/collection",
    labelField: "name",         // campo usato come label
    valueField: "_key",         // campo usato come value (default: _key)
    where: { active: true },
    order: { name: "asc" },
  }}
  required={false}
  defaultValue=""
  disabled={false}
  onChange={(name, value) => {}}
/>

{/* Autocomplete con ricerca */}
<Select.Autocomplete name="userId" db={{ path: "/users", labelField: "email" }} />

{/* Multi-selezione con checkbox */}
<Select.Checklist
  name="tags"
  options={[{ label: "Tag 1", value: "tag1" }]}
/>
```

### `<Upload>`

```tsx
<Upload
  name="fieldName"
  label="Label"
  accept="image/*"          // MIME type accettati
  maxSize={5242880}         // dimensione max in byte (5MB)
  onChange={(name, value) => {}}  // value = { base64, name, size, type }
/>

{/* Immagine con crop integrato */}
<Upload.Image
  name="cover"
  label="Immagine"
  aspectRatio={16/9}        // ratio per il crop
/>

{/* Documento (PDF, Word, ecc.) */}
<Upload.Document name="pdf" label="Documento" />
```

### `<UploadCSV>`

```tsx
<UploadCSV
  name="data"
  label="Importa CSV"
  onParsed={(records) => {}}   // callback con i record parsati
/>
```

### `<Prompt>`

Campo AI: configura ed esegue un prompt, scrive il risultato nel record.

```tsx
import { Prompt, PromptMode } from 'react-firestrap'

<Prompt
  name="content"
  label="Contenuto generato"
  mode={PromptMode.EDITOR}   // EDITOR = UI configurazione | LIVE = esecuzione
  prompt="Scrivi un articolo su: {title}"  // {fieldName} interpola dal record
  model="gemini-pro"
  temperature={0.7}
  voice="professionale"
  style="informativo"
/>
```

### `<AssistantAI>`

Chat AI contestuale al record corrente.

```tsx
<AssistantAI
  name="aiChat"
  label="Assistente"
  context="Sei un assistente che aiuta a compilare schede prodotto."
/>
```

### `<ImageUrl>`

Input URL immagine con anteprima.

```tsx
<ImageUrl name="thumbnailUrl" label="URL immagine" />
```

---

## UI Primitives (presentazionali)

### `<Card>`

```tsx
<Card
  header={<h5>Titolo</h5>}
  footer={<button>Azione</button>}
  wrapClass="mb-4"
  className="shadow-sm"
>
  contenuto
</Card>
```

### `<Modal>`

```tsx
<Modal
  show={isOpen}
  onHide={() => setIsOpen(false)}
  title="Titolo modal"
  size="lg"               // sm | md | lg | xl
  position="center"       // center | top
  footer={<button onClick={handleSave}>Salva</button>}
>
  contenuto modal
</Modal>
```

### `<Alert>`

```tsx
<Alert variant="success">Operazione completata</Alert>
<Alert variant="danger">Errore: {message}</Alert>
// variant: primary | secondary | success | danger | warning | info | light | dark
```

### `<Badge>`

```tsx
<Badge variant="primary">Testo</Badge>
<Badge variant="success">Attivo</Badge>
```

### `<Table>`

```tsx
<Table
  headers={[{ key: 'name', label: 'Nome' }]}
  records={data}
  onRowClick={(record) => {}}
  className="table-striped"
/>
```

### `<Pagination>`

```tsx
<Pagination
  total={totalRecords}
  perPage={25}
  current={page}
  onChange={(page) => setPage(page)}
/>
```

### `<Repeat>`

Ripete children N volte, utile per array dinamici in un form.

```tsx
<Repeat name="items" defaultLength={3} label="Elementi">
  {(index) => (
    <div key={index}>
      <Input name={`items.${index}.name`} label={`Nome ${index + 1}`} />
      <Input name={`items.${index}.qty`}  label="Quantità" inputType="number" />
    </div>
  )}
</Repeat>
```

### `<Gallery>`

```tsx
<Gallery
  records={items}
  rowCols={3}             // colonne per riga
  gutterSize={3}
  renderItem={(record) => (
    <img src={record.imageUrl} alt={record.name} />
  )}
/>
```

### `<Tab>` / `<TabDynamic>`

```tsx
<Tab
  tabs={[
    { key: 'info',    label: 'Informazioni',  content: <InfoPanel /> },
    { key: 'history', label: 'Storico',       content: <HistoryPanel /> },
  ]}
  defaultTab="info"
/>
```

### `<Icon>`

```tsx
<Icon name="person-fill" size={20} className="text-primary" />
// Usa Bootstrap Icons
```

---

## Blocks (composizioni per layout)

### `<Menu>`

```tsx
<Menu
  items={menuItems}           // da useMenu() hook
  orientation="vertical"      // vertical | horizontal
  collapsible={true}
/>
```

### `<Brand>`

```tsx
<Brand
  logo={<img src="/logo.svg" />}
  title="App Name"
/>
```

### `<Breadcrumbs>`

```tsx
<Breadcrumbs
  items={[
    { label: 'Home', path: '/' },
    { label: 'Utenti', path: '/users' },
    { label: 'Mario Rossi' },
  ]}
/>
```

### `<Notifications>`

```tsx
<Notifications dataStoragePath="/notifications/userId" />
```

### `<Search>`

```tsx
<Search
  dataStoragePath="/products"
  searchField="name"
  onResult={(records) => setResults(records)}
  placeholder="Cerca prodotto..."
/>
```

---

## Hooks

### `useTheme(componentName?)`

```tsx
const theme = useTheme('form')
// → accesso a theme.Form.*, theme.Icons, theme.i18n
```

### `useGlobalVars(namespace)`

```tsx
const [token, setToken, removeToken] = useGlobalVars('auth.token')
```

### `useMenu(menuName?)`

```tsx
const items = useMenu('default')
// → MenuItem[] con active state calcolato automaticamente
```

### `useConfig()`

```tsx
const config = useConfig()
// → { firebase, google, ai, dropbox, scrape, proxyUri }
```

### `useDataProvider()` *(v2 — dopo CR-002)*

```tsx
const db = useDataProvider()
const record = await db.read('/users/123')
```

---

## Tipi TypeScript principali

```typescript
// Record dal database
type RecordProps = {
  [key: string]: any
  _key?: string      // chiave Firebase
  _index?: number    // indice nell'array
}

type RecordArray = RecordProps[]

// Colonna Grid
type Column = {
  key: string
  label?: string
  sort?: boolean
  onDisplay?: ColumnFormatter | string   // string = converter built-in
}

type ColumnFormatter = (args: {
  value: any
  record: RecordProps
  key?: string
}) => React.ReactNode

// FormRef
interface FormRef {
  handleSave: (e?: React.MouseEvent) => Promise<boolean>
  handleDelete: (e?: React.MouseEvent) => Promise<boolean>
  getRecord: () => { record: RecordProps; isNewRecord: boolean }
  getHeader: () => React.ReactNode
  getFooter: () => React.ReactNode
}
```
