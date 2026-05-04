# Esempio: Grid con modal edit avanzato

Scenario: catalogo prodotti con modal che mostra dettagli estesi e tab.

---

## Grid con modal custom

```tsx
import { Grid, Form, Input, Select, Upload, Tab, Badge } from 'react-firestrap'

export default function ProductCatalog() {
  return (
    <Grid
      dataStoragePath="/products"
      columns={[
        { key: 'name',     label: 'Prodotto', sort: true },
        { key: 'category', label: 'Categoria' },
        {
          key: 'price',
          label: 'Prezzo',
          onDisplay: ({ value }) => `€ ${Number(value).toFixed(2)}`,
        },
        {
          key: 'status',
          label: 'Stato',
          onDisplay: ({ value }) => (
            <Badge variant={value === 'active' ? 'success' : 'secondary'}>
              {value === 'active' ? 'Attivo' : 'Inattivo'}
            </Badge>
          ),
        },
      ]}
      allowedActions={["add", "edit", "delete"]}
      modal={{ mode: "form", size: "xl" }}
      type="table"
      pagination={{ perPage: 20 }}
      allowedSorting
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
              label: 'Informazioni',
              content: (
                <>
                  <Input name="name"        label="Nome prodotto"  required />
                  <Input name="sku"         label="Codice SKU" />
                  <Input name="price"       label="Prezzo (€)"     inputType="number" step={0.01} />
                  <Select
                    name="category"
                    label="Categoria"
                    db={{ path: "/categories", labelField: "name", valueField: "_key" }}
                  />
                  <Select
                    name="status"
                    label="Stato"
                    options={[
                      { label: "Attivo",   value: "active" },
                      { label: "Inattivo", value: "inactive" },
                      { label: "Bozza",    value: "draft" },
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
                  <Upload.Image name="cover"   label="Immagine copertina" />
                  <Upload.Image name="gallery.0" label="Foto 1" />
                  <Upload.Image name="gallery.1" label="Foto 2" />
                  <Upload.Image name="gallery.2" label="Foto 3" />
                </>
              ),
            },
            {
              key: 'details',
              label: 'Dettagli',
              content: (
                <>
                  <Input name="description" label="Descrizione breve" />
                  <Input name="weight"      label="Peso (g)"   inputType="number" />
                  <Input name="dimensions.w" label="Larghezza (cm)" inputType="number" />
                  <Input name="dimensions.h" label="Altezza (cm)"   inputType="number" />
                  <Input name="dimensions.d" label="Profondità (cm)" inputType="number" />
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

---

## Modal con contenuto completamente custom

Quando `modal={{ mode: "empty" }}` il contenuto del modal è interamente gestito dall'`onOpen` callback.

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

## Struttura dati risultante

```
/products/
  prod_abc123/
    name: "Scarpa da corsa"
    sku: "RUN-001"
    price: 9990           ← in centesimi nel DB, euro nella UI
    category: "-NxKm9..."  ← _key della categoria
    status: "active"
    cover: { base64: "...", name: "cover.jpg", type: "image/jpeg" }
    gallery:
      0: { base64: "...", name: "foto1.jpg" }
      1: { base64: "...", name: "foto2.jpg" }
    description: "Leggera e traspirante"
    weight: 280
    dimensions: { w: 30, h: 12, d: 10 }
```
