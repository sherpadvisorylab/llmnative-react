# Example: Grid with advanced modal edit

Scenario: product catalogue with a modal showing extended details and tabs.

---

## Grid with custom modal

```tsx
import { Grid, Form, Input, Select, Upload, Tab, Badge } from '@llmnative/react'

export default function ProductCatalog() {
  return (
    <Grid
      dataStoragePath="/products"
      columns={[
        { key: 'name',     label: 'Product',  sort: true },
        { key: 'category', label: 'Category' },
        {
          key: 'price',
          label: 'Price',
          onDisplay: ({ value }) => `€ ${Number(value).toFixed(2)}`,
        },
        {
          key: 'status',
          label: 'Status',
          onDisplay: ({ value }) => (
            <Badge variant={value === 'active' ? 'success' : 'secondary'}>
              {value === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          ),
        },
      ]}
      allowedActions={["add", "edit", "delete"]}
      modal={{ mode: "form", size: "xl" }}
      type="table"
      pagination={{ limit: 20, align: "end" }}
      sortable
      groupBy="category"
      onLoadRecord={(record) => ({
        ...record,
        price: record.price ? record.price / 100 : 0,
      })}
      onSave={async ({ record }) => ({
        ...record,
        price: Math.round(record.price * 100),
      })}
    >
      {({ record }) => (
        <Tab
          tabs={[
            {
              key: 'info',
              label: 'Information',
              content: (
                <>
                  <Input name="name"        label="Product name"   required />
                  <Input name="sku"         label="SKU code" />
                  <Input name="price"       label="Price (€)"      inputType="number" step={0.01} />
                  <Select
                    name="category"
                    label="Category"
                    optionsSource={{ path: "/categories", labelField: "name", valueField: "_key" }}
                  />
                  <Select
                    name="status"
                    label="Status"
                    options={[
                      { label: "Active",   value: "active" },
                      { label: "Inactive", value: "inactive" },
                      { label: "Draft",    value: "draft" },
                    ]}
                    defaultValue="draft"
                  />
                </>
              ),
            },
            {
              key: 'media',
              label: 'Media',
              content: (
                <>
                  <Upload.Image name="cover"     label="Cover image" />
                  <Upload.Image name="gallery.0" label="Photo 1" />
                  <Upload.Image name="gallery.1" label="Photo 2" />
                  <Upload.Image name="gallery.2" label="Photo 3" />
                </>
              ),
            },
            {
              key: 'details',
              label: 'Details',
              content: (
                <>
                  <Input name="description"  label="Short description" />
                  <Input name="weight"       label="Weight (g)"    inputType="number" />
                  <Input name="dimensions.w" label="Width (cm)"    inputType="number" />
                  <Input name="dimensions.h" label="Height (cm)"   inputType="number" />
                  <Input name="dimensions.d" label="Depth (cm)"    inputType="number" />
                </>
              ),
            },
          ]}
        />
      )}
    </Grid>
  )
}
```

If you also need manual ordering, pass `onReorder` and keep the reordered record set in parent state:

```tsx
const [rows, setRows] = useState(records)

<Grid
  source={rows}
  view="table"
  columns={columns}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>
```

> Note:
> manual row reorder and column sorting target the same visual order.
> If you pass `onReorder` together with `sortable`, manual reorder takes precedence, sorting is ignored, and the component logs a `console.warn`.

---

## Modal with fully custom content

When `modal={{ mode: "empty" }}` the modal content is entirely managed by the `onOpen` callback.

```tsx
<Grid
  dataStoragePath="/orders"
  columns={columns}
  allowedActions={["edit"]}
  modal={{
    mode: "empty",
    size: "lg",
    onOpen: (record) => <OrderDetailPanel order={record} />,
  }}
/>
```

---

## Resulting data structure

```
/products/
  prod_abc123/
    name: "Running shoe"
    sku: "RUN-001"
    price: 9990           ← cents in DB, euros in UI
    category: "-NxKm9..."  ← _key of the category
    status: "active"
    cover: { base64: "...", name: "cover.jpg", type: "image/jpeg" }
    gallery:
      0: { base64: "...", name: "photo1.jpg" }
      1: { base64: "...", name: "photo2.jpg" }
    description: "Light and breathable"
    weight: 280
    dimensions: { w: 30, h: 12, d: 10 }
```
