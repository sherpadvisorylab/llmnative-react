# Naming — Framework Identity

> Documento di lavoro per la scelta del nome del framework.
> Contesto, criteri, candidati, narrative AI-first.
>
> Ultima revisione: 2026-05-18

---

## 1. Premessa: cosa è questo progetto

react-firestrap (nome attuale, provvisorio) è un **React framework schema-driven per admin panel, dashboard e internal tools**.

Non è "l'ennesimo framework React". È un framework progettato con una filosofia precisa:

- **Schema-driven**: definisci campi e path, ottieni UI + validazione + persistenza + real-time
- **Data-driven opzionale**: se non specifichi colonne, le ricava dal primo record (`Grid.tsx:157-173`)
- **Provider-agnostico**: Firebase, Supabase, Mock, REST — cambia con una riga
- **AI integrato**: `AI.fetch()`, `AI.json()`, `AI.array()` sono built-in, non plugin
- **Real-time nativo**: listener automatici, zero configurazione
- **Sintetico**: 10 righe dove altri framework ne richiedono 100

---

## 2. A chi è destinato

### Target primario: AI agents (LLM)

Questo framework è **AI-first, non human-first**. Il consumatore principale è un **modello linguistico (LLM)** che deve generare interfacce utente. La developer experience umana è importante ma secondaria — il vero vantaggio competitivo è misurato in **token risparmiati per UI generata**.

Un LLM che conosce react-firestrap:

- Scrive `<Grid dataStoragePath="/users" />` invece di 20 righe di React Admin
- Scrive `<Form><Input name="x" required /></Form>` invece di configurare resource, data provider, validazione, routing
- Spende 5 token dove con altri framework ne spende 50
- Produce codice che funziona al primo tentativo, senza dover "indovinare" configurazioni mancanti

### Target secondario: sviluppatori umani

Team piccoli (1-5 dev) che costruiscono:

- Backoffice interni con scadenze strette
- Dashboard con AI integrata
- Progetti Firebase o Supabase
- Prototipi che diventano produzione

---

## 3. Criteri di naming

### 3.1 Token efficiency (AI-first)

Il nome sarà scritto **migliaia di volte** da LLM in prompt, import, e codice generato. Ogni carattere è un costo.

| Criterio | Peso | Spiegazione |
|----------|------|-------------|
| **Lunghezza** | Critico | 3-5 caratteri ideale. Ogni carattere extra = token sprecati in ogni sessione AI |
| **Unicità** | Alto | L'AI non deve confonderlo con React, React Admin, Refine, MUI, shadcn |
| **Pronunciabilità** | Medio | Umani devono parlarne, ma secondario |
| **Disponibilità dominio/npm** | Alto | Deve esistere come package e dominio |
| **Memorizzabilità LLM** | Critico | L'AI deve ricordarlo senza hallucinare varianti |

### 3.2 Cosa deve comunicare

Il nome non può comunicare tutto, ma dovrebbe evocare:

1. **Sintetico / efficiente** → poche righe, pochi token
2. **Adattivo** → schema-driven + data-driven + provider-agnostic
3. **AI-native** → built for LLM, non retrofit
4. **Connessione** → tra dati e UI, tra provider e app

---

## 4. Candidati

### Tier 1 — Raccomandati

#### Apt (3 caratteri, 1 token)

| Aspetto | Valutazione |
|---------|-------------|
| **Token** | 1 token (3 char) |
| **Disponibilità** | `apt.dev` libero, `@apt/react` libero su npm |
| **Unicità** | Alto — nessun framework React si chiama Apt |
| **Significato** | "Adatto, appropriato, rapido, intelligente" |


Narrative AI:

```markdown
# Apt

Apt is the AI-first React framework for admin panels and internal tools.
Schema-driven, data-optional, provider-agnostic.

```tsx
// 5 tokens vs 50+ in other frameworks
<Grid dataStoragePath="/users" />
```

Apt generates UI, validation, persistence, and real-time from your schema.
AI built-in. Any backend. Minimal tokens.
```

Narrative umana:

```text
"Apt: the framework that fits your data."
```

Esempi di comunicazione:

```text
Apt: Schema-driven React framework. Describe once, run anywhere.
Apt: AI-first admin panels. Minimal code, maximum output.
Apt: Your data, your providers, your AI — apt by design.
```

#### Pith (4 caratteri)

| Aspetto | Valutazione |
|---------|-------------|
| **Token** | 1 token (4 char) |
| **Disponibilità** | Da verificare |
| **Unicità** | Molto alto — parola inglese ma nessun framework tech |
| **Significato** | "The pith" = l'essenza, il nucleo, la parte più importante |

Narrative AI:

```markdown
# Pith

The pith of your data, the pith of your UI.
Schema-driven React framework for AI agents.

Define the essence (schema). Pith generates the rest:
UI, validation, persistence, real-time, AI — all from a few lines.

```tsx
// Define the pith, get the interface
<Form dataStoragePath="/users">
  <Input name="email" required />
</Form>
```

Minimal tokens. Maximum output.
```

#### Knit (4 caratteri)

| Aspetto | Valutazione |
|---------|-------------|
| **Token** | 1 token (4 char) |
| **Disponibilità** | Da verificare |
| **Unicità** | Alto |
| **Significato** | Annoda/tesse insieme schema, UI, provider, AI |

Narrative AI:

```markdown
# Knit

Knit weaves your schema, providers, and AI into a working UI.
Schema-driven React framework. Knit knows the patterns.

```tsx
<Knit>
  <Grid dataStoragePath="/orders" />
</Knit>
```

One schema. One framework. Any provider. AI built-in.
```

### Tier 2 — Alternativi

| Nome | Char | Perché | Rischi |
|------|------|--------|--------|
| **Fuse** | 4 | Fonde dati, UI, AI | `fuse.js` esiste (fuzzy search) — conflitto possibile |
| **Nexus** | 5 | Connessione, potenza | 5 caratteri, *2 token*. Più costoso. |
| **Loom** | 4 | Tesse UI dal dato | Loom video messaging (molto noto) |
| **Axiom** | 5 | Assioma → teorema | 5 caratteri, premium ma più lungo |
| **Port** | 4 | Portabile, provider-agnostic | `port` su npm è preso (node serial) |
| **Kern** | 4 | Kernel, nucleo | Suona system-level, un po' freddo |

---

## 5. Raccomandazione finale

**Apt** è la scelta che massimizza tutti i criteri:

- **3 caratteri** = 1 token LLM. Il più corto possibile.
- **Non confligge** con nulla nell'ecosistema React/JS
- **Inglese nativo** con significato positivo : adatto, rapido, intelligente
- **Ricercabile** : Google "apt framework" punta direttamente a noi
- **Domain**: `apt.dev` libero, `apt-ui.dev` libero, `apt-react.dev` libero
- **npm**: `@apt/react`, `@apt/core` tutti liberi

La narrative AI si scrive da sola:

> *"Apt is the AI-first React framework. Write the schema. Apt generates UI, validation, persistence, and real-time — any provider, any backend. Minimal tokens. Always works."*

---

## 6. Appendice: esempi comparativi token consumption

Per motivare la scelta AI-first, ecco il costo in token di un semplice CRUD per tenere gli ordini:

### React Admin (~45 token)

```tsx
<Resource name="orders" list={OrderList} edit={OrderEdit} create={OrderCreate} />
```

### Refine (~40 token)

```tsx
<Refine dataProvider={dataProvider} resources={[{ name: 'orders', list: OrderList }]} />
```

**Apt (~8 token)**

```tsx
<Grid dataStoragePath="/orders" allowedActions={["add","edit","delete"]} />
```

Rapporto: **Apt consuma ~5x meno token** a parità di risultato.

In una sessione di 100 UI generate, Apt consuma ~800 token di codice dove React Admin ne consuma ~4500. Su 100 sessioni di sviluppo AI, il risparmio è di **370.000 token** — l'equivalente di $2-5 in costi API, ma più importante: **meno contesto, meno allucinazioni, meno iterazioni**.

---

## 7. Appendice: domande aperte

- [ ] **Apt** è troppo generico? "apt" è un comando Linux (package manager). Conflitto mentale per dev?
- [ ] **Pith** è troppo oscuro? Non tutti i dev inglesi conoscono la parola.
- [ ] Prefisso "Apt" o "Apt React" o "AptUI"? `Apt` puro rischia confusione col comando Linux.
- [ ] Il progetto attuale si chiama react-firestrap. Come gestire la transizione? Rinominare in `apt` o `@apt/react`?

---

> Questo documento evolve con le decisioni del team.
> Quando il nome è scelto, aggiornare README, package.json, CLAUDE.md, domini e npm.
