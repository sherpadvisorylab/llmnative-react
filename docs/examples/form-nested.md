# Esempio: Form con oggetti annidati e array dinamici

Scenario: form preventivo con sezione cliente, indirizzo, e righe prodotto dinamiche.

---

## Form completo

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

      {/* ── Sezione cliente ──────────────────────────────── */}
      <Select
        name="customerId"
        label="Cliente"
        db={{ path: "/customers", labelField: "companyName", valueField: "_key" }}
        required
      />

      {/* ── Indirizzo (oggetto annidato a 2 livelli) ─────── */}
      <Input name="deliveryAddress.street"   label="Via / N°"  />
      <Input name="deliveryAddress.zip"      label="CAP"       />
      <Input name="deliveryAddress.city"     label="Città"     />
      <Select
        name="deliveryAddress.country"
        label="Paese"
        options={countryOptions}
        defaultValue="IT"
      />

      {/* ── Contatti (array a lunghezza fissa) ───────────── */}
      <Input name="contacts.0.name"  label="Referente principale - Nome" />
      <Input name="contacts.0.email" label="Referente principale - Email" inputType="email" />
      <Input name="contacts.1.name"  label="Referente alternativo - Nome" />
      <Input name="contacts.1.email" label="Referente alternativo - Email" inputType="email" />

      {/* ── Righe preventivo (array dinamico con Repeat) ─── */}
      <Repeat name="items" defaultLength={3} label="Righe preventivo">
        {(index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gap: 8 }}>
            <Input
              name={`items.${index}.description`}
              label={index === 0 ? "Descrizione" : ""}
              placeholder="Descrizione prodotto/servizio"
            />
            <Input
              name={`items.${index}.qty`}
              label={index === 0 ? "Qtà" : ""}
              inputType="number"
              min={1}
              defaultValue={1}
            />
            <Input
              name={`items.${index}.unitPrice`}
              label={index === 0 ? "Prezzo unit. €" : ""}
              inputType="number"
              step={0.01}
              min={0}
            />
          </div>
        )}
      </Repeat>

      {/* ── Metadati ─────────────────────────────────────── */}
      <Select
        name="status"
        label="Stato"
        options={[
          { label: "Bozza",     value: "draft" },
          { label: "Inviato",   value: "sent" },
          { label: "Accettato", value: "accepted" },
          { label: "Rifiutato", value: "rejected" },
        ]}
      />
      <Input name="notes" label="Note interne" />
      <Upload.Document name="attachment" label="Allegato" />

    </Form>
  )
}

function calculateTotal(items: any[] = []) {
  return items.reduce((sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0), 0)
}
```

---

## Struttura dati risultante

```
/quotes/
  1746356400000/
    customerId: "-NxKm9abc"
    deliveryAddress:
      street: "Via Roma 15"
      zip: "20100"
      city: "Milano"
      country: "IT"
    contacts:
      0:
        name: "Mario Rossi"
        email: "mario@client.it"
      1:
        name: "Giulia Bianchi"
        email: "giulia@client.it"
    items:
      0:
        description: "Sviluppo applicazione web"
        qty: 1
        unitPrice: 5000
      1:
        description: "Manutenzione annuale"
        qty: 12
        unitPrice: 200
      2:
        description: ""
        qty: 1
        unitPrice: 0
    status: "draft"
    notes: "Da rivedere prima dell'invio"
    total: 7400
    updatedAt: 1746356400000
```

---

## Corner case da tenere a mente

**Valori falsy non devono sparire:** `qty: 0` e `unitPrice: 0` devono restare nel record. Il framework gestisce correttamente `null`, `undefined`, `0`, `false`, `""`.

**Array sparsi:** se l'utente compila solo `items.0` e `items.2` (lasciando `items.1` vuoto), Firebase salva solo i valori non-null. Al ricaricamento, `items.1` sarà `undefined`. Gestire nel `onLoad` se serve normalizzazione.

**Repeat con lunghezza variabile:** `defaultLength` è solo il numero iniziale di righe. L'utente può aggiungere/rimuovere righe — il valore finale è un array di lunghezza variabile.
