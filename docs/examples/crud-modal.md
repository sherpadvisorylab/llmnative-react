# Example: Grid with advanced modal edit

Scenario: product catalogue with a richer edit experience inside the built-in Grid modal.

---

## Grid with custom form content

```tsx
import { Grid, Input, Select, UploadImage, Tab, Badge } from '@llmnative/react'

export default function ProductCatalog() {
  return (
    <Grid
      path="/products"
      columns={[
        { key: 'name', label: 'Product', sortable: true },
        { key: 'category', label: 'Category' },
        {
          key: 'price',
          label: 'Price',
          render: ({ value }) => `EUR ${Number(value).toFixed(2)}`,
        },
        {
          key: 'status',
          label: 'Status',
          render: ({ value }) => (
            <Badge variant={value === 'active' ? 'success' : 'secondary'}>
              {value === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          ),
        },
      ]}
      actions={['add', 'edit', 'delete']}
      view="table"
      pagination={{ limit: 20, align: 'end' }}
      sortable
      groupBy="category"
      onLoad={(records) => records.map((record) => ({
        ...record,
        price: record.price ? record.price / 100 : 0,
      }))}
      onSave={async ({ record }) => ({
        ...record,
        price: Math.round(record.price * 100),
      })}
      form={() => (
        <Tab
          tabs={[
            {
              key: 'info',
              label: 'Information',
              content: (
                <>
                  <Input name="name" label="Product name" required />
                  <Input name="sku" label="SKU code" />
                  <Input name="price" label="Price (EUR)" inputType="number" step={0.01} />
                  <Select
                    name="category"
                    label="Category"
                    optionsSource={{ path: '/categories', labelField: 'name', valueField: '_key' }}
                  />
                  <Select
                    name="status"
                    label="Status"
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                      { label: 'Draft', value: 'draft' },
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
                  <UploadImage name="cover" label="Cover image" />
                  <UploadImage name="gallery.0" label="Photo 1" />
                  <UploadImage name="gallery.1" label="Photo 2" />
                  <UploadImage name="gallery.2" label="Photo 3" />
                </>
              ),
            },
          ]}
        />
      )}
    />
  )
}
```

If you also need manual ordering, keep the reordered record set in parent state:

```tsx
const [rows, setRows] = useState(records)

<Grid
  records={rows}
  recordId="_key"
  view="table"
  columns={columns}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>
```

---

## Fully custom modal action

When the built-in CRUD shortcuts are not enough, declare an explicit modal action:

```tsx
<Grid
  path="/orders"
  columns={columns}
  actions={{
    preview: {
      kind: 'modal',
      label: 'Preview',
      size: 'lg',
      body: ({ record }) => <OrderDetailPanel order={record} />,
    },
  }}
/>
```
