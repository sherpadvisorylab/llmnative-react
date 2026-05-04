# Overview

> TL;DR per AI: framework React che trasforma definizioni di campi in UI + persistenza. Poche righe per pagine CRUD complete. Stack attuale: Firebase + Bootstrap. Stack target v2: DataProvider pattern + shadcn/ui + Tailwind.

---

## Cos'è react-firestrap

react-firestrap è un framework React **schema-driven** per costruire interfacce data-driven. Il vantaggio principale è la velocità: quello che con React puro richiede centinaia di righe (form con validazione, stato, persistenza, grid con real-time updates, sorting, paginazione, modal CRUD) qui si scrive in decine.

Non è una UI library generica. È un framework opinionato che assume:
- Hai dati strutturati da leggere, creare, modificare, cancellare
- Vuoi un'interfaccia omogenea e coerente in tutto il progetto
- Vuoi focalizzarti sulla logica di business, non sul boilerplate

---

## Cosa fa e cosa non fa

**Fa:**
- CRUD completo su qualsiasi backend (v2: DataProvider pattern)
- Form con stato contestuale, validazione, oggetti annidati, array dinamici
- Grid con real-time updates, sorting, paginazione, raggruppamento, modal integrato
- Upload file (immagini con crop, documenti, CSV con parsing)
- Integrazione AI multi-provider (OpenAI, Gemini, Anthropic, DeepSeek, Mistral)
- Sistema tema centralizzato via React Context
- Autenticazione Google OAuth 2.0
- Multi-tenancy via localStorage
- Scaffolding progetto via CLI

**Non fa:**
- Logica di business complessa (non è un ORM, non ha business rules)
- Animazioni avanzate o UI altamente custom (per quello usa direttamente shadcn/ui)
- State management globale avanzato (non sostituisce Zustand/Redux per applicazioni complesse)
- SSR/SSG (è client-side rendering)

---

## Quando usarlo

**Ideale per:**
- Backoffice e dashboard amministrative
- Gestione dati con CRUD ripetitivo
- Prototipi veloci che devono diventare prodotti
- Applicazioni interne (CRM, ERP leggeri, portali dati)
- Progetti dove la velocità di sviluppo è prioritaria sulla customizzazione UI estrema

**Non ideale per:**
- Landing page o siti marketing
- App con UX altamente custom (form complessi con layout non standard)
- Applicazioni dove ogni schermata è completamente diversa dalle altre

---

## Concetto chiave: schema-driven

Il pattern centrale del framework è definire la struttura dei dati e ottenere UI + persistenza automaticamente.

```tsx
// Definisci i campi
const model = {
  name: Component.input.string({ label: "Nome", required: true }),
  email: Component.input.email({ label: "Email" }),
  role: Component.select({ label: "Ruolo", options: roleOptions }),
}

// Ottieni form + persistenza
const UserForm = ComponentBlock.default({ dataStoragePath: "/users" })
// → form con tutti i campi, validazione, caricamento da Firebase, salvataggio
```

In alternativa, composizione esplicita (più flessibile):

```tsx
<Form dataStoragePath="/users">
  <Input name="name" label="Nome" required />
  <Input name="email" label="Email" inputType="email" />
  <Select name="role" label="Ruolo" options={roleOptions} />
</Form>
```

---

## Architettura in 30 secondi

```
Config (Firebase, AI, OAuth)
    ↓
App (routing, theme, providers)
    ↓
Pages (composizione di widgets)
    ↓
Widgets: Form, Grid          ← smart: gestiscono stato e persistenza
    ↓
Fields: Input, Select, Upload ← controlled: ricevono value e onChange
    ↓
UI: Button, Card, Modal       ← presentazionali: solo rendering
    ↓
Providers: Firebase/Supabase  ← (v2) abstraction layer per il backend
```

Dettagli in [architecture.md](architecture.md).

---

## Stato del progetto

| Versione | Stato | Note |
|----------|-------|------|
| v1.x (attuale) | Stabile | Firebase + Bootstrap |
| v2.0 (in sviluppo, branch `v2`) | In progress | DataProvider + shadcn/ui + Tailwind + test |

Roadmap completa in [ROADMAP.md](ROADMAP.md).  
Change requests dettagliate in [CHANGE_REQUESTS.md](CHANGE_REQUESTS.md).
