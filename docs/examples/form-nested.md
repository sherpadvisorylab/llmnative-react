# Example: Form with nested objects and dynamic arrays

Scenario: quote form with customer section, delivery address, and dynamic product lines.

---

## Full form

```tsx
import { Form, Input, Select, Repeat, Upload } from '@llmnative/react'

export default function QuoteForm() {
  return (
    <Form
      dataStoragePath="/quotes"
      aspect="card"
      showBack
      defaultValues={{
        status: 'draft',
        items: [{ description: '', qty: 1, unitPrice: 0 }],
      }}
      onSave={async ({ record }) => ({
        ...record,
        total: calculateTotal(record.items),
        updatedAt: Date.now(),
      })}
    >

      {/* ── Customer section ─────────────────────────────── */}
      <Select
        name="customerId"
        label="Customer"
        db={{ path: "/customers", labelField: "companyName", valueField: "_key" }}
        required
      />

      {/* ── Delivery address (2-level nested object) ──────── */}
      <Input name="deliveryAddress.street"   label="Street / No."  />
      <Input name="deliveryAddress.zip"      label="ZIP"           />
      <Input name="deliveryAddress.city"     label="City"          />
      <Select
        name="deliveryAddress.country"
        label="Country"
        options={countryOptions}
        defaultValue="US"
      />

      {/* ── Contacts (fixed-length array) ────────────────── */}
      <Input name="contacts.0.name"  label="Primary contact - Name" />
      <Input name="contacts.0.email" label="Primary contact - Email" inputType="email" />
      <Input name="contacts.1.name"  label="Alternate contact - Name" />
      <Input name="contacts.1.email" label="Alternate contact - Email" inputType="email" />

      {/* ── Quote lines (dynamic array with Repeat) ──────── */}
      <Repeat name="items" defaultLength={3} label="Quote lines">
        {(index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gap: 8 }}>
            <Input
              name={`items.${index}.description`}
              label={index === 0 ? "Description" : ""}
              placeholder="Product/service description"
            />
            <Input
              name={`items.${index}.qty`}
              label={index === 0 ? "Qty" : ""}
              inputType="number"
              min={1}
              defaultValue={1}
            />
            <Input
              name={`items.${index}.unitPrice`}
              label={index === 0 ? "Unit price €" : ""}
              inputType="number"
              step={0.01}
              min={0}
            />
          </div>
        )}
      </Repeat>

      {/* ── Metadata ─────────────────────────────────────── */}
      <Select
        name="status"
        label="Status"
        options={[
          { label: "Draft",    value: "draft" },
          { label: "Sent",     value: "sent" },
          { label: "Accepted", value: "accepted" },
          { label: "Rejected", value: "rejected" },
        ]}
      />
      <Input name="notes"      label="Internal notes" />
      <Upload.Document name="attachment" label="Attachment" />

    </Form>
  )
}

function calculateTotal(items: any[] = []) {
  return items.reduce((sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0), 0)
}
```

---

## Resulting data structure

```
/quotes/
  1746356400000/
    customerId: "-NxKm9abc"
    deliveryAddress:
      street: "123 Main St"
      zip: "10001"
      city: "New York"
      country: "US"
    contacts:
      0:
        name: "John Smith"
        email: "john@client.com"
      1:
        name: "Jane Doe"
        email: "jane@client.com"
    items:
      0:
        description: "Web application development"
        qty: 1
        unitPrice: 5000
      1:
        description: "Annual maintenance"
        qty: 12
        unitPrice: 200
      2:
        description: ""
        qty: 1
        unitPrice: 0
    status: "draft"
    notes: "To review before sending"
    total: 7400
    updatedAt: 1746356400000
```

---

## Corner cases to keep in mind

**Falsy values must not disappear:** `qty: 0` and `unitPrice: 0` must remain in the record. The framework handles `null`, `undefined`, `0`, `false`, `""` correctly.

**Sparse arrays:** if the user fills only `items.0` and `items.2` (leaving `items.1` empty), Firebase saves only non-null values. On reload, `items.1` will be `undefined`. Handle this in `onLoad` if normalisation is needed.

**Repeat with variable length:** `defaultLength` is only the initial number of rows. The user can add/remove rows — the final value is an array of variable length.
