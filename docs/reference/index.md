# Components API Reference

> TL;DR per AI: questa pagina è il riferimento completo di props per ogni componente. Per esempi d'uso vedi [patterns](/docs/patterns) e [examples](/docs/examples/crud-basic).

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

### `<Grid>`, `<GridArray>`, `<GridDB>`

`Grid` e' il gateway comodo. `GridArray` e `GridDB` sono le entrypoint esplicite AI-first:

- `GridArray` quando hai gia' i record in memoria
- `GridDB` quando i record arrivano da `DataProvider`
- `Grid` quando vuoi una facciata unica che instrada al wrapper corretto

`form` definisce il contenuto condiviso di default per `add` e `edit`.
`actions` usa un catalogo esplicito con `kind: "modal" | "route" | "external" | "inline" | "delete"`.
`selection` rende la selezione esplicita.
`reorderable` dichiara il drag in table mode, mentre `onReorder` riceve il record set finale ordinato.

```tsx
<GridDB
  path="/users"
  order={{ name: "asc" }}
  columns={[
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: ({ value }) => <Badge>{value}</Badge>,
    },
  ]}
  title="Users"
  form={<UserFormFields />}
  actions={["add", "edit", "delete"]}
  layout="table"
  selection="multiple"
  pagination={{ limit: 20, align: "end" }}
  reorderable
  onReorder={(records, meta) => {}}
  header={({ title, selection, open }) => (
    <Header
      title={title}
      selectedCount={selection.keys.length}
      onAdd={() => open("add")}
    />
  )}
  footer={({ records }) => <Footer total={records.length} />}
  transformRecords={(records) => records.filter((record) => record.active)}
  onClickRow={(record) => navigate(`/detail/${record._key}`)}
  onSave={async ({ record, action, storagePath }) => ""}
  onDelete={async ({ record }) => ""}
  onAfterAction={async ({ record, action }) => true}
/>
```

Con dati locali:

```tsx
<GridArray
  records={records}
  recordId="_key"
  columns={columns}
  layout="gallery"
  groupBy=" | "
/>
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
<Autocomplete
  name="userId"
  db={{ path: "/users" }}
  placeholder="Cerca…"
  max={5}
/>

{/* Autocomplete creatable — valori liberi + persistenza */}
<Autocomplete
  name="tags"
  label="Tags"
  db={{ path: "/tags" }}
  creatable
  onCreate={async (value) => {
    await db.set(`/tags/${value}`, { label: value, value });
  }}
/>

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
import { Prompt, PromptMode } from '@llmnative/react'

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
  header={[{ key: 'name', label: 'Nome', sort: true }]}
  body={data}
  sortable={{ field: 'name', dir: 'asc' }} // oppure true
  selectedKeys={selectedKeys}
  onSelectionChange={({ keys, records, clear, hasSelection }) => {}}
  onReorder={(reorderedRecords, meta) => {}}
  heightClass="max-h-72"        // aggiunge automaticamente lo scroll verticale interno
  onClick={(record) => {}}
  className="table-striped"
/>
```

Note rapide:

- `sortable={true}` abilita l'header sorting; le colonne con `sort: false` restano statiche.
- `sortable` puo' essere anche un `OrderConfig`, ad esempio `sortable={{ field: 'name', dir: 'asc' }}`, per impostare il sort iniziale della vista senza un prop separato.
- `onSelectionChange` fa comparire automaticamente la colonna checkbox.
- `onReorder` abilita il riordino manuale delle righe. Il primo argomento e' sempre l'intero array riordinato.
- `onReorder` non va usato insieme al sorting della stessa vista perche' le due modalita' competono sullo stesso ordine visibile. Se vengono combinati, il riordino manuale ha precedenza, il sorting viene ignorato e `Table` emette un `console.warn`.
- `heightClass` e' il modo consigliato per creare una viewport interna con altezza fissa. `scrollClass` resta disponibile come estensione.

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
  body={items}
  sortable={{ field: 'name', dir: 'asc' }}
  selectedKeys={selectedKeys}
  onSelectionChange={({ keys, records, clear, hasSelection }) => {}}
  rowCols={3}             // colonne per riga
  gutterSize={3}
  onClick={(record) => console.log(record._key)}
/>
```

`Gallery` non ha header sorting interattivo: applica `sortable` ai record in ingresso e usa la stessa semantica di selezione di `Table`.

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
// Resolved by the active icon provider
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
// → accesso al runtime theme completo, inclusi theme.Form.*, theme.Modal.*, theme.ActionButton.*
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

type OrderConfig = {
  field: string
  dir?: 'asc' | 'desc'
}

// FormRef
interface FormRef {
  handleSave: (e?: React.MouseEvent) => Promise<boolean>
  handleDelete: (e?: React.MouseEvent) => Promise<boolean>
  getRecord: () => { record: RecordProps; isNewRecord: boolean }
  getHeader: () => React.ReactNode
  getFooter: () => React.ReactNode
}
```
