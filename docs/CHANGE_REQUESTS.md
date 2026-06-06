# Change Requests

> Ogni CR rappresenta un'unità di lavoro autonoma con motivazione, scope e checklist.  
> Stato: `⬜ todo` · `🔄 in progress` · `✅ done` · `🚫 cancelled`  
> Ultima revisione: 2026-06-06

---

## Indice

| CR | Titolo | Priorità | Dipende da | Stato |
|----|--------|----------|-----------|-------|
| [CR-001](#cr-001--documentazione-ai-first) | Documentazione AI-first | Alta | — | ✅ |
| [CR-002](#cr-002--provider-abstraction-layer) | Provider abstraction layer | Critica | — | ✅ |
| [CR-002b](#cr-002b--authprovideradapter--emailprovideradapter-contracts) | AuthProviderAdapter + EmailProviderAdapter contracts | Alta | CR-002 | ✅ |
| [CR-003](#cr-003--typescript-strict) | TypeScript strict | Alta | — | ✅ |
| [CR-004](#cr-004--shadcnui--tailwind-css) | shadcn/ui + Tailwind CSS | Alta | CR-002 | ✅ |
| [CR-005](#cr-005--cli-update-e-scaffolding) | CLI update e scaffolding | Media | CR-002, CR-004 | ✅ |
| [CR-006](#cr-006--batterie-di-test) | Batterie di test | Alta | CR-002, CR-003 | 🔄 |
| [CR-007](#cr-007--showcase-app) | Showcase app | Alta | CR-002, CR-004 | 🔄 |
| [CR-008](#cr-008--tema-empty--tailwind--shadcnui) | Tema `empty` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-009](#cr-009--tema-default--tailwind--shadcnui) | Tema `default` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-010](#cr-010--tema-flat--tailwind--shadcnui) | Tema `flat` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-011](#cr-011--tema-cyber--tailwind--shadcnui) | Tema `cyber` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-021](#cr-021--use-case-templates) | Use case templates (crm, admin, inventory, project) | Media | CR-005, CR-017 | ✅ |
| [CR-012](#cr-012--showcase-refactor--react-firestrap-native) | Showcase refactor — react-firestrap native | Alta | CR-004, CR-007 | ⬜ |
| [CR-013](#cr-013--icon-provider-system) | Icon provider system | Media | CR-004 | ✅ |
| [CR-014](#cr-014--raffinazione-componenti--props-e-comportamenti) | Raffinazione componenti — props e comportamenti | Media | CR-007 | 🔄 |
| [CR-015](#cr-015--vite-toolchain-framework--scaffolding) | Vite toolchain framework + scaffolding | Alta | CR-003, CR-004, CR-006 | ✅ |
| [CR-016](#cr-016--showcase-vite--scaffold-first) | Showcase Vite + scaffold-first | Alta | CR-012, CR-015 | ✅ |
| [CR-017](#cr-017--app-managed-theme--icon-registries) | App-managed theme + icon registries | Alta | CR-004, CR-013 | ✅ |
| [CR-018](#cr-018--markdownreader-component) | MarkdownReader component | Alta | CR-004, CR-017 | ✅ |
| [CR-019](#cr-019--markdown-powered-showcase-docs) | Markdown-powered showcase docs | Alta | CR-018 | ✅ |
| [CR-020](#cr-020--head-management--declarative-provider-config) | Head management + declarative provider config | Alta | CR-017, CR-019 | ✅ |
| [CR-022](#cr-022--bootstrap-utility-cleanup) | Bootstrap utility cleanup — JSX → Tailwind nativo | Media | CR-004 | ✅ |
| [CR-023](#cr-023--driver-manifest--service-registry) | Driver manifest + service registry | Alta | CR-002, CR-002b | ✅ |
| [CR-024](#cr-024--wysiwyg-editor-component) | WYSIWYG editor component | Alta | CR-004, CR-014 | ⬜ |
| [CR-025](#cr-025--contextmenu-con-comandi-e-mention) | ContextMenu con comandi e @mention | Alta | CR-024 | ⬜ |
| [CR-026](#cr-026--authbutton-provider-agnostic--dropboxauthprovider) | AuthButton provider-agnostic + DropboxAuthProvider | Alta | CR-002b, CR-023 | ✅ |
| [CR-027](#cr-027--motion-system-e-interazioni-animate) | Motion system e interazioni animate | Media | CR-017, CR-022 | 🔄 |
| [CR-028](#cr-028--stato-configurazione-provider) | Stato configurazione provider | Alta | CR-002, CR-023, CR-026 | ✅ |
| [CR-029](#cr-029--internationalization-i18n-del-framework) | Internationalization i18n del framework | Alta | CR-017, CR-019 | ⬜ |
| [CR-030](#cr-030--self-contained-typed-themes) | Self-contained typed themes | Alta | CR-017, CR-027 | ✅ |
| [CR-031](#cr-031--sidebar-block-del-framework) | Sidebar block del framework | Media | CR-007, CR-017 | ⬜ |
| [CR-032](#cr-032--firebaseauthprovider) | FirebaseAuthProvider (email/password + anonymous) | Alta | CR-002b, CR-023 | ✅ |
| [CR-033](#cr-033--firestoredataprovider) | FirestoreDataProvider (Cloud Firestore) | Alta | CR-002, CR-023, CR-039 | ✅ |
| [CR-034](#cr-034--supabasedataprovider-completo) | SupabaseDataProvider completo (SDK + real-time) | Alta | CR-002, CR-023 | ✅ |
| [CR-035](#cr-035--supabasestorageprovider-completo) | SupabaseStorageProvider completo (SDK) | Media | CR-002, CR-023 | ✅ |
| [CR-036](#cr-036--supabaseauthprovider) | SupabaseAuthProvider (email/password + OAuth) | Alta | CR-002b, CR-023 | ✅ |
| [CR-037](#cr-037--component-builder-system) | Component Builder System — useX() hooks per export HTML/JSON | Media | CR-007 | ⬜ |
| [CR-038](#cr-038--ai-first-naming-normalization) | AI-first naming normalization | Alta | CR-014, CR-037 | ⬜ |
| [CR-039](#cr-039--firebase-sdk-compat--modular-v9) | Firebase SDK compat → modular v9+ | Alta | CR-002, CR-023 | ✅ |

---

## CR-026 — AuthButton provider-agnostic + DropboxAuthProvider

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002b, CR-023  

### Motivazione
`SignInButton` e il vecchio `AuthButton` espongono due modelli diversi per problemi simili: autenticazione OAuth applicativa e connessione OAuth a servizi esterni. La codebase deve convergere su un unico componente `AuthButton`, guidato dagli `AuthProvider` registrati nel provider manifest.

### Scope
- Estendere `AuthProviderAdapter` con `signIn()` e `isAuthenticated()`.
- Aggiungere `DropboxAuthProvider` come driver auth `dropboxAuth`.
- Rendere `AuthButton` agnostico: `provider`, `intent`, `aspect`.
- Rimuovere l'export pubblico `SignInButton`.
- Spostare la pagina showcase `Auth` tra i Widgets.
- Aggiornare documentazione provider e componente.
- Aggiungere test su `AuthButton`, adapter auth e manifest.

### Checklist
- [x] Aggiornare contratto auth.
- [x] Implementare `DropboxAuthProvider`.
- [x] Rifattorizzare `AuthButton`.
- [x] Aggiornare export e call site Dropbox.
- [x] Aggiornare docs.
- [x] Eseguire test e build.

---

## CR-027 — Motion system e interazioni animate

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-017, CR-022  
**Stima:** 1 settimana  
**Breaking change:** No

### Motivazione

L'interfaccia di react-firestrap oggi è funzionale, ma molti stati cambiano in modo secco: apertura di modali, dropdown, accordion, tab, loading, focus e click sui bottoni. Un sistema di micro-animazioni ben progettato può rendere il framework più professionale, più fluido e più piacevole da usare senza diventare invadente.

L'obiettivo è introdurre un **motion system** nativo: leggero di default, accessibile, customizzabile dall'utente finale e coerente con temi e componenti esistenti.

### Principi di design

- Le animazioni devono aiutare la comprensione dello stato, non decorare a caso.
- Default professionale: transizioni brevi, morbide, non teatrali.
- Rispetto di `prefers-reduced-motion`.
- Nessun layout shift: preferire `opacity`, `transform` e `scale`.
- Ogni componente deve poter ereditare il preset globale ma anche essere customizzato localmente.
- Il sistema deve funzionare bene sia in app operative/dense sia in showcase o tool più visuali.

### Scope

**Incluso:**
- Aggiungere un layer `motion` nel theme system.
- Definire effetti semantici per durata, easing, transform, opacity e intensità.
- Aggiungere helper CSS/classi o utility interne per stati comuni: `enter`, `exit`, `hover`, `press`, `focus`, `loading`.
- Animare apertura/chiusura di `Modal`, `Dropdown`, `Accordion`, `Tabs`, `Notifications`, menu contestuali e pannelli laterali dove presenti.
- Aggiungere feedback di press/click sui bottoni: micro scale, highlight o ripple leggero.
- Aggiungere animazioni di focus e hover coerenti per elementi interattivi.
- Aggiungere skeleton/loading transitions dove già esistono loading states.
- Esporre configurazione nel tema:

```tsx
export const motion = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    transition: {
      duration: 160,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      properties: ['opacity'],
    },
    reducedMotion: 'respect-user',
  },
};

export const components = {
  Modal: {
    motion: {
      center: 'fade',
    },
  },
};
```

- Consentire override locale sui componenti:

```tsx
<Modal motion="slideFromRight" />
<Accordion motion="fadeUp" />
<Button motion={false} />
```

### Preset target

- `none`: disabilita animazioni non essenziali.
- `subtle`: molto leggero, adatto a dashboard e app operative.
- `standard`: default professionale.
- `expressive`: più evidente, utile per showcase, demo e prodotti più consumer.

### Componenti prioritari

1. `Button` / `ActionButton` / `LoadingButton`
2. `Modal`
3. `Dropdown`
4. `Accordion`
5. `Tab`
6. `Notifications`
7. `Menu` / context menu
8. `AuthButton` e controlli provider-driven

### Accessibilità

- Rispettare `prefers-reduced-motion`.
- Non usare animazioni lampeggianti o ripetitive.
- Non bloccare input utente durante animazioni decorative.
- Garantire che focus ring e stati tastiera restino visibili.

### Documentazione e showcase

- Aggiungere pagina docs `docs/architecture/motion.md` o sezione dedicata nel theme system.
- Aggiungere esempi nello showcase con controlli per preset, intensity e reduced motion.
- Documentare best practice: quando animare, quando evitare, quali proprietà usare.

### Checklist

- [x] Disegnare token e preset motion nel theme system.
- [x] Implementare rispetto di `prefers-reduced-motion`.
- [x] Aggiungere utility/classi condivise.
- [x] Animare bottoni e press state.
- [x] Animare Modal.
- [x] Animare Dropdown/Menu.
- [x] Animare Accordion.
- [x] Animare Tabs.
- [ ] Animare Notifications/Toast.
- [x] Aggiungere override globale e locale.
- [x] Aggiungere docs motion.
- [x] Aggiungere showcase motion playground.
- [x] Testare keyboard navigation e reduced motion.
- [x] `npm run test` e `npm run build` passano.

### Stato verificato al 2026-05-27

Implementazione presente e verificata in codebase:
- `src/motion.ts` espone registry, resolver e hook pubblici (`useMotionEffect`, `useMotionState`, `usePressMotion`, `useEnterMotion`).
- I temi built-in esportano `motion` insieme a `preset` e `components`.
- Le integrazioni effettivamente trovate oggi coprono button/action/loading button, modal, dropdown/menu, tab, image e image avatar.
- La documentazione dedicata esiste in `docs/architecture/motion.md`.
- La copertura test include `tests/unit/motion.test.ts`.

Gap residui confermati:
- `Notifications` usa ancora principalmente il comportamento del `Dropdown` sottostante; non c'e' un trattamento motion specifico del blocco.
- La pagina showcase/playground dedicata al motion system e' ora presente in `clients/showcase/src/pages/components/MotionPage.tsx`.

---

## CR-028 — Stato configurazione provider

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002, CR-023, CR-026  
**Stima:** 3-4 giorni  
**Breaking change:** No, ma può richiedere piccoli aggiornamenti ai provider custom

### Motivazione

Con CR-026 abbiamo introdotto su `AuthButton` una prima regola corretta: se il provider auth usato dal componente non ha la chiave obbligatoria, il componente resta visibile ma non operativo, mostra uno stato disabilitato e spiega il problema tramite tooltip.

Questa CR porta la stessa regola a tutto il framework. I componenti provider-driven devono sapere se il provider che stanno usando è configurato, e devono comportarsi in modo coerente quando mancano chiavi, endpoint, bucket o variabili obbligatorie.

### Regola generale

Un componente può lavorare solo se il provider che usa è **registrato e configurato**.

Se il provider non è configurato:
- il componente entra in stato disabled/read-only;
- mostra un affordance visivo leggero;
- espone un title/tooltip diagnostico;
- non apre modali/menu inutili;
- non invia richieste al backend/provider;
- lascia un messaggio utile in console solo in modalità sviluppo.

### API target

Standardizzare il contratto già introdotto sugli auth provider:

```ts
export interface ProviderConfigurationState {
  configured: boolean;
  reason?: string;
  missingKeys?: string[];
}

export interface ProviderAdapterBase {
  isConfigured?(): boolean;
  getConfigurationState?(): ProviderConfigurationState;
}
```

`isConfigured()` resta la via semplice per i componenti. `getConfigurationState()` serve quando vogliamo messaggi diagnostici migliori, per esempio "Missing dropbox.clientId" o "Missing firebase.apiKey".

### Scope

**Incluso:**
- Rinominare/standardizzare il concetto come "configuration state", non "readiness".
- Mantenere e rifinire quanto già fatto su `GoogleAuthProvider`, `DropboxAuthProvider` e `AuthButton`.
- Aggiungere `getConfigurationState()` agli auth provider.
- Estendere la stessa regola a:
  - `FirebaseDataProvider`
  - `FirebaseStorageProvider`
  - `SupabaseDataProvider`
  - `SupabaseStorageProvider`
  - `GmailEmailProvider`
  - AI provider configurabili
- Aggiungere helper/hook tipo `useProviderConfiguration(service, providerKey)`.
- Aggiornare componenti provider-driven per stato disabled coerente.
- Stato visuale standard: opacity ridotta, cursor `not-allowed`, title diagnostico.
- Aggiornare showcase con esempi di provider configurato/non configurato.
- Documentare la regola nelle pagine provider.

### Escluso

- Wizard automatico per configurare le chiavi.
- UI di gestione tenant/secrets.
- Validazione server-side delle credenziali.

### Checklist

- [x] Definire `ProviderConfigurationState`.
- [x] Aggiungere `getConfigurationState()` come contratto comune.
- [x] Rifinire lo stato configurazione sugli AuthProvider già introdotti.
- [x] Implementare stato configurazione sui DataProvider.
- [x] Implementare stato configurazione sugli StorageProvider.
- [x] Implementare stato configurazione sugli EmailProvider.
- [x] Implementare stato configurazione per integrazioni AI/utility.
- [x] Aggiungere helper condiviso.
- [x] Aggiornare componenti provider-driven.
- [x] Aggiungere test per provider mancanti o config incompleta.
- [x] Aggiornare docs providers.
- [x] Verificare showcase Auth con provider non configurati.
- [x] `npm run test` e `npm run build` passano.

---

## CR-029 — Internationalization i18n del framework

**Stato:** ⬜ todo  
**Branch:** `modernize/cr-029-i18n`  
**Priorità:** Alta  
**Dipende da:** CR-017, CR-019  
**Stima:** 1 settimana  
**Breaking change:** No, ma cambia il modo consigliato di scrivere nuove label interne

### Motivazione

Oggi molte label, messaggi, testi di fallback e tooltip del framework sono scolpiti direttamente nella codebase, quasi sempre in inglese. Questo rende difficile usare react-firestrap in applicazioni multilingua e rende incoerente la personalizzazione dei testi.

Il framework deve estrarre le stringhe interne in un sistema i18n nativo, con dizionari di default, context per la lingua corrente e adapter sostituibile dall'app finale.

### Obiettivo

Creare un layer di traduzione framework-level:
- ogni componente usa chiavi di traduzione invece di stringhe hardcoded;
- l'app può scegliere lingua e dizionario;
- l'app può sovrascrivere solo alcune label;
- il framework resta usabile anche senza configurazione i18n esplicita, usando `en` come default.

### API target

Configurazione globale:

```tsx
<App
  locale="it"
  translations={{
    it: {
      auth: {
        signIn: 'Accedi',
        signOut: 'Esci',
        providerNotConfigured: 'Provider "{provider}" non configurato.',
      },
    },
  }}
/>
```

Context/hook:

```tsx
const { t, locale, setLocale } = useI18n();

t('auth.signIn');
t('auth.providerNotConfigured', { provider: 'googleAuth' });
```

Adapter opzionale:

```tsx
<I18nProvider
  locale="it"
  adapter={i18nextAdapter}
>
  <App />
</I18nProvider>
```

### Scope

**Incluso:**
- Creare dizionario base `en`.
- Creare struttura chiavi per aree: `common`, `auth`, `form`, `grid`, `upload`, `validation`, `providers`, `navigation`, `errors`.
- Introdurre `I18nProvider` e `useI18n()`.
- Aggiungere adapter interface per integrare sistemi esterni come i18next, FormatJS o dizionari custom.
- Estrarre stringhe hardcoded dai componenti pubblici.
- Supportare interpolazione semplice: `{provider}`, `{field}`, `{count}`.
- Supportare fallback: lingua scelta → `en` → chiave.
- Consentire override parziale dei dizionari.
- Aggiungere controllo lingua nello showcase.
- Documentare come aggiungere nuove stringhe senza hardcodarle.

### Componenti prioritari

1. `AuthButton`
2. `Form`
3. `Grid`
4. `Upload`
5. `Select`
6. `Modal`
7. `Notifications`
8. `MarkdownReader`
9. Messaggi provider/configuration state
10. Errori e fallback comuni

### Regole per nuove stringhe

- Nessuna nuova label o messaggio utente hardcoded dentro componenti pubblici.
- Le stringhe tecniche da console possono restare in inglese, ma i messaggi UI devono passare da `t()`.
- Le chiavi devono essere stabili e leggibili, non generate dinamicamente.
- Ogni nuova chiave deve avere almeno fallback `en`.

### Escluso

- Traduzione automatica dei contenuti Markdown dell'app.
- Gestione SEO multilingua completa (`hreflang`, canonical per locale), che può diventare una CR separata.
- Formattazione avanzata ICU/plurali complessi nella prima iterazione, salvo se l'adapter esterno la fornisce.

### Checklist

- [ ] Definire `I18nProvider`, `useI18n()` e adapter interface.
- [ ] Creare dizionario default `en`.
- [ ] Aggiungere supporto override parziale.
- [ ] Aggiungere interpolazione semplice.
- [ ] Estrarre stringhe da `AuthButton`.
- [ ] Estrarre stringhe da form/grid/upload/select.
- [ ] Estrarre stringhe da modal/notifications/navigation.
- [ ] Estrarre messaggi provider/configuration state.
- [ ] Aggiungere showcase per cambio lingua.
- [ ] Aggiungere docs i18n.
- [ ] Aggiungere test per fallback, override e interpolazione.
- [ ] `npm run test` e `npm run build` passano.

---

## CR-030 — Self-contained typed themes

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-017, CR-027  

### Motivazione

Il theme system aveva due fonti di verità: il tema componenti completo dentro `src/Theme.tsx` e i preset visuali dentro `themes/*.ts`. Questo rendeva difficile capire dove personalizzare un tema e lasciava una shape troppo generica con `[key: string]: any`.

### Decisione

Ogni tema vive in modo autonomo. I file `themes/default.ts`, `themes/flat.ts` e `themes/cyber.ts` esportano tutti:

```ts
export const preset: ThemePresetConfig = { ... };
export const motion: MotionRegistry = { ... };
export const components: Theme = { ... };
export default { preset, motion, components };
```

Non esiste merge implicito tra temi built-in. L'unica patch opzionale dell'app è `themeOverride`.

### Checklist

- [x] Spostare il tema completo fuori da `src/Theme.tsx`.
- [x] Rendere `themes/default.ts`, `themes/flat.ts`, `themes/cyber.ts` self-contained.
- [x] Introdurre `ThemeDefinition`.
- [x] Sostituire `presets` con `themes`.
- [x] Rinominare il tema component-level in `components` e riservare `themeOverride` alla patch opzionale app-level.
- [x] Rafforzare `Theme` / `ThemeConfig` con shape parlante.
- [x] Aggiornare showcase.
- [x] Aggiornare docs.
- [x] Test e build passano.

---

## CR-031 — Sidebar block del framework

**Stato:** ⬜ todo  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-007, CR-017  
**Stima:** 1-2 giorni  
**Breaking change:** No

### Motivazione

La sidebar dello showcase contiene già un pattern utile per molte app: legge i menu registrati su `<App>`, seleziona il contesto in base alla route, raggruppa le voci e renderizza una navigazione laterale compatta. Oggi però vive nel client showcase, mentre i template hanno sidebar locali duplicate e meno parametrizzabili.

Il framework deve offrire un blocco `Sidebar` riusabile in `src/components/blocks`, lasciando ai template/client il ruolo di comporlo dentro layout e sezioni specifiche.

### Decisione architetturale

`Sidebar` è un **block/componente del framework**, non una section:

- `blocks`: componente riusabile, provider-aware, esportato da `@llmnative/react`.
- `sections`: composizioni locali dei template/client, dove si decide posizione, stato mobile, header e layout.

Percorso previsto:

```text
src/components/blocks/Sidebar.tsx
```

Export pubblico:

```ts
export { default as Sidebar } from './blocks/Sidebar';
```

### API proposta

Uso semplice:

```tsx
<Sidebar context="sidebar" />
```

Uso route-aware, come nello showcase:

```tsx
<Sidebar
  contexts={{
    '/docs': 'docs',
    '/components': 'components',
    '/providers': 'providers',
    '/examples': 'examples',
  }}
/>
```

Props candidate:

```ts
type SidebarProps = {
  context?: string;
  contexts?: Record<string, string>;
  items?: MenuItem[];
  groupBy?: 'group' | false | ((item: MenuItem) => string);
  title?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  empty?: React.ReactNode;
  sticky?: boolean;
  stickyTop?: string;
  widthClass?: string;
  className?: string;
  navClass?: string;
  groupClass?: string;
  groupTitleClass?: string;
  itemClass?: string;
  activeItemClass?: string;
  childItemClass?: string;
  activeChildItemClass?: string;
  renderItem?: (item: MenuItem) => React.ReactNode;
  renderGroupTitle?: (group: string) => React.ReactNode;
};
```

### Scope

- Estrarre la sidebar dello showcase in `src/components/blocks/Sidebar.tsx`.
- Supportare almeno `context`, `contexts`, `items`, grouping, class override e slot `header/footer/empty`.
- Usare `useMenu()` e `useLocation()` quando il componente lavora in modalità route-aware.
- Esportare `Sidebar` da `src/components/index.ts` e `src/index.ts` se necessario.
- Aggiornare `clients/showcase` a usare il block del framework.
- Valutare se sostituire le sidebar duplicate in `templates/*/sections/Sidebar.tsx` con wrapper locali basati su `Sidebar`.
- Aggiornare docs/reference e showcase component page.
- Aggiungere test unitari per selezione context, grouping e render vuoto.

### Criteri di accettazione

- [ ] `import { Sidebar } from '@llmnative/react'` funziona.
- [ ] `<Sidebar context="sidebar" />` renderizza il menu di quel contesto.
- [ ] `<Sidebar contexts={{ '/docs': 'docs' }} />` seleziona il contesto dalla route corrente.
- [ ] Le voci possono essere raggruppate per `group` o renderizzate flat.
- [ ] Lo showcase usa la sidebar del framework senza duplicare logica.
- [ ] I template possono comporla come section locale senza copiare il rendering interno.
- [ ] Docs e test aggiornati.

---

## CR-032 — FirebaseAuthProvider

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002b, CR-023  
**Stima:** 2-3 giorni  
**Breaking change:** No

### Motivazione

Il framework usa già Firebase come backend primario per data e storage. L'autenticazione Firebase nativa (email/password, anonymous, link magico) manca però di un provider dedicato: oggi l'unico auth provider per Firebase è `GoogleAuthProvider`, che dipende da OAuth2 Google e non supporta scenari senza Google account (app B2B, accesso email, demo anonimo).

`FirebaseAuthProvider` implementa `AuthProviderAdapter` usando il modulo `firebase/auth` del Firebase SDK modular v9+, integrandosi nel manifest esistente come driver `firebaseAuth`.

### Decisione architetturale

- Si usa il **Firebase SDK modular** (`firebase/auth` v9+), non il compat API già usato da `firebase.ts` data/storage. I due possono coesistere nella stessa app Firebase.
- Il provider è **stateless** rispetto a React: non gestisce Context, delega tutto a `onAuthStateChanged`. I componenti che usano lo stato auth leggono da `AuthProviderContext` esistente.
- I metodi opzionali `getAccessToken` e `isAuthenticated` sono implementati.
- Il driver si chiama **`firebaseAuth`** nel manifest.

### File da creare / modificare

```text
src/providers/auth/firebase/FirebaseAuthProvider.ts   ← nuovo
src/providers/manifest.ts                              ← aggiungere driver firebaseAuth a FIREBASE_MANIFEST
src/providers/manifest.ts                              ← aggiungere 'firebaseAuth' a AuthDriverName
tests/unit/providers/FirebaseAuthProvider.test.tsx     ← nuovo
```

### Interfaccia da implementare

```typescript
// AuthProviderAdapter (src/providers/auth/AuthProvider.ts)
interface AuthProviderAdapter extends ProviderConfigurable {
    getUser(): UserProfile | null;
    signIn?(options?: AuthSignInOptions): Promise<UserProfile | null>;
    signOut(): Promise<void>;
    onAuthChange(callback: (user: UserProfile | null) => void): () => void;
    getAccessToken?(scopes?: string[]): Promise<string>;
    isAuthenticated?(): boolean;
}
```

### Metodi supportati

| Metodo | Implementazione |
|--------|----------------|
| `signIn({ method: 'email', email, password })` | `signInWithEmailAndPassword` |
| `signIn({ method: 'emailLink', email })` | `sendSignInLinkToEmail` + `signInWithEmailLink` |
| `signIn({ method: 'anonymous' })` | `signInAnonymously` |
| `signOut()` | `signOut` Firebase |
| `onAuthChange(cb)` | `onAuthStateChanged` — ritorna unsubscribe |
| `getUser()` | `auth.currentUser` mappato su `UserProfile` |
| `isAuthenticated()` | `auth.currentUser !== null` |
| `getConfigurationState()` | verifica che Firebase sia inizializzato |

`AuthSignInOptions` esteso per `FirebaseAuthProvider`:

```typescript
interface FirebaseSignInOptions extends AuthSignInOptions {
    method?: 'email' | 'emailLink' | 'anonymous';
    email?: string;
    password?: string;
}
```

### Integrazione manifest

```typescript
// src/providers/manifest.ts — FIREBASE_MANIFEST
firebaseAuth: { service: 'auth', create: () => new FirebaseAuthProvider() }

// AuthDriverName
export type AuthDriverName = 'googleAuth' | 'dropboxAuth' | 'firebaseAuth';
```

### Configurazione consumer

```tsx
<App
  providers={{
    firebase: { config: firebaseConfig },
    services: {
      data: 'dbRealtime',
      auth: 'firebaseAuth',
    },
  }}
/>
```

### Criteri di accettazione

- [ ] `FirebaseAuthProvider` implementa `AuthProviderAdapter` senza errori TypeScript strict.
- [ ] `signIn({ method: 'email', email, password })` autentica e ritorna `UserProfile`.
- [ ] `signIn({ method: 'anonymous' })` autentica anonimamente e ritorna `UserProfile`.
- [ ] `signOut()` termina la sessione.
- [ ] `onAuthChange(cb)` invoca il callback al cambio stato e ritorna un unsubscribe funzionante.
- [ ] `getUser()` ritorna il profilo corrente o `null`.
- [ ] `isAuthenticated()` ritorna `true` solo a sessione attiva.
- [ ] `getConfigurationState()` ritorna `configured: false` se Firebase non è inizializzato.
- [ ] Driver `firebaseAuth` registrato in `FIREBASE_MANIFEST` e in `AuthDriverName`.
- [ ] Test unitari con Firebase Auth emulatore o mock SDK passano.

---

## CR-033 — FirestoreDataProvider

**Stato:** ✅ done — 2026-06-06  
**Branch:** `main`  
**Priorità:** Alta  
**Dipende da:** CR-002, CR-023  
**Breaking change:** No

### Motivazione

`FirebaseDataProvider` usa Firebase **Realtime Database** (RTDB), adatto a dati gerarchici e sincronizzazione semplice. Molte app preferiscono **Cloud Firestore**, che offre query strutturate, indici composti, collezioni/documenti, e operatori di filtro nativi (array-contains, not-in, ecc.). Il framework deve esporre entrambi come driver intercambiabili.

`FirestoreDataProvider` implementa `DataProviderAdapter` usando il modulo `firebase/firestore` SDK modular v9+, supportando tutto il contratto dell'interfaccia incluse le query `where` / `order` / `count` e il listener real-time via `onSnapshot`.

### Decisione architetturale

- **SDK modular** (`firebase/firestore` v9+): non il compat API di RTDB.
- I path seguono la convenzione framework: `/collection` → collezione; `/collection/id` → documento singolo. Subcollection: `/collection/id/subcollection`.
- `WhereClause` e `OrderClause` del framework sono mappati sulle Firestore query constraints nativi. Gli operatori `in`/`nin` mappano su `array-contains`/`not-in` di Firestore.
- Il listener usa `onSnapshot` con unsubscribe pulita tramite `useEffect`.
- Il driver si chiama **`firestore`** nel manifest.
- `readShallow` non è applicabile a Firestore (niente shallow read): il metodo opzionale viene omesso.
- `setChunks` è supportato tramite batch write Firestore.

### File da creare / modificare

```text
src/providers/data/firestore.ts           ← nuovo
src/providers/manifest.ts                  ← aggiungere driver firestore a FIREBASE_MANIFEST
src/providers/manifest.ts                  ← aggiungere 'firestore' a DataDriverName
tests/unit/providers/firestore.test.ts     ← nuovo
```

### Interfaccia da implementare

```typescript
// DataProviderAdapter — tutti i metodi obbligatori + count e setChunks facoltativi
interface DataProviderAdapter extends ProviderConfigurable {
    read(path: string, options?: ReadOptions): Promise<any>;
    set(path: string, data: object, exception?: boolean): Promise<void>;
    update(path: string, data: object, exception?: boolean): Promise<void>;
    remove(path: string, exception?: boolean): Promise<void>;
    useListener(path, setRecords, options?: DatabaseOptions): void;
    count?(path: string): Promise<number>;
    setChunks?(path: string, data: object, options?: SetChunksOptions): Promise<void>;
}
```

### Mapping WhereClause → Firestore constraints

| Operatore framework | Firestore constraint |
|---------------------|---------------------|
| `{ field: value }` (scalar) | `where(field, '==', value)` |
| `{ field: { eq: v } }` | `where(field, '==', v)` |
| `{ field: { lt: v } }` | `where(field, '<', v)` |
| `{ field: { lte: v } }` | `where(field, '<=', v)` |
| `{ field: { gt: v } }` | `where(field, '>', v)` |
| `{ field: { gte: v } }` | `where(field, '>=', v)` |
| `{ field: { in: [...] } }` | `where(field, 'in', [...])` |
| `{ field: { nin: [...] } }` | `where(field, 'not-in', [...])` |

### Mapping OrderClause → Firestore

```typescript
// { createdAt: 'desc', name: 'asc' } → orderBy('createdAt', 'desc'), orderBy('name', 'asc')
```

### Comportamento read / useListener

- `read('/collection')` → `getDocs(collection(...))` → ritorna `RecordArray` con `_key = doc.id`.
- `read('/collection/id')` → `getDoc(doc(...))` → ritorna oggetto singolo o `null`.
- `useListener('/collection', cb, { where, order })` → `onSnapshot` con query constraints; `_key = doc.id`.

### Integrazione manifest

```typescript
// FIREBASE_MANIFEST
firestore: { service: 'data', create: () => new FirestoreDataProvider() }

// DataDriverName
export type DataDriverName = 'dbRealtime' | 'firestore' | 'supabaseDb' | 'mock';
```

### Configurazione consumer

```tsx
<App
  providers={{
    firebase: { config: firebaseConfig },
    services: { data: 'firestore', storage: 'firestorage', auth: 'googleAuth' },
  }}
/>
```

### Criteri di accettazione

- [x] `FirestoreDataProvider` implementa `DataProviderAdapter` senza errori TypeScript strict.
- [x] `read('/col')` ritorna tutti i documenti come `RecordArray` con `_key`.
- [x] `read('/col/id')` ritorna il singolo documento o `null`.
- [x] `read('/col', { where: { status: 'active' } })` filtra correttamente.
- [x] `read('/col', { order: { createdAt: 'desc' } })` ordina correttamente.
- [x] `set('/col/id', data)` crea/sovrascrive il documento.
- [x] `update('/col/id', data)` fa merge parziale (`updateDoc`).
- [x] `remove('/col/id')` cancella il documento.
- [x] `useListener('/col', cb, { where, order })` invoca cb immediatamente e ad ogni modifica; cleanup su unmount.
- [x] `count('/col')` ritorna il numero di documenti (tramite `getCountFromServer`).
- [x] `setChunks` scrive in batch di dimensione configurabile.
- [x] `getConfigurationState()` ritorna `configured: false` se Firebase non è inizializzato.
- [x] Driver `firestoreDb` registrato in `FIREBASE_MANIFEST` e `DataDriverName`.
- [ ] Test unitari con Firestore emulatore o mock SDK passano.

---

## CR-034 — SupabaseDataProvider completo

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002, CR-023  
**Stima:** 3-4 giorni  
**Breaking change:** No (sostituisce lo stub esistente, stesso driver name `supabaseDb`)

### Motivazione

`src/providers/data/supabase.ts` è uno stub basato su `fetch` raw che avvisa `"not fully implemented yet"` ad ogni chiamata. Non usa il client ufficiale `@supabase/supabase-js`, non supporta real-time genuino (polling ogni 5s), non implementa filtering/ordering server-side, e non gestisce errori.

Questa CR riscrive il provider usando `@supabase/supabase-js` v2, implementando tutto il contratto `DataProviderAdapter` con query native Supabase (PostgREST), real-time via `supabase.channel()` + `postgres_changes`, e supporto completo a `WhereClause`/`OrderClause`.

### Decisione architetturale

- Si usa **`@supabase/supabase-js` v2** — installato come dipendenza opzionale (peer dep o dynamic import).
- Il client Supabase viene istanziato una volta per config (`url` + `anonKey`), con singleton interno alla classe.
- I path framework `/table` → `supabase.from('table')`; `/table/id` → query con `.eq('id', id)`.
- Il campo primario è `id` per default; configurabile via `primaryKey` nel costruttore.
- Real-time tramite `supabase.channel().on('postgres_changes', ...)` — richiede Realtime abilitato sulla tabella in Supabase.
- `WhereClause`/`OrderClause` mappati su metodi fluenti PostgREST del client.
- `count` tramite `.select('*', { count: 'exact', head: true })`.
- `setChunks` tramite inserimenti batch con `upsert`.
- `readShallow` non applicabile a SQL → omesso.

### File da creare / modificare

```text
src/providers/data/supabase.ts             ← riscrivere (stesso file, stessa classe)
tests/unit/providers/supabase-data.test.ts ← nuovo/aggiornare
```

Il driver name `supabaseDb` nel manifest resta invariato.

### Mapping WhereClause → PostgREST

| Operatore framework | Metodo Supabase client |
|---------------------|----------------------|
| `{ field: value }` (scalar) | `.eq(field, value)` |
| `{ field: { eq: v } }` | `.eq(field, v)` |
| `{ field: { lt: v } }` | `.lt(field, v)` |
| `{ field: { lte: v } }` | `.lte(field, v)` |
| `{ field: { gt: v } }` | `.gt(field, v)` |
| `{ field: { gte: v } }` | `.gte(field, v)` |
| `{ field: { in: [...] } }` | `.in(field, [...])` |
| `{ field: { nin: [...] } }` | `.not(field, 'in', '(...)')` |

### Mapping OrderClause → PostgREST

```typescript
// { createdAt: 'desc', name: 'asc' }
// → .order('createdAt', { ascending: false }).order('name', { ascending: true })
```

### Comportamento read / useListener

- `read('/table')` → `.select('*')` → `RecordArray` con `_key = String(row.id)`.
- `read('/table/id')` → `.select('*').eq('id', id).single()` → oggetto o `null`.
- `read('/table', { where, order })` → query con filtri e ordinamento server-side.
- `useListener('/table', cb, { where, order })` → `channel.on('postgres_changes')` per INSERT/UPDATE/DELETE + fetch iniziale; unsubscribe su cleanup.

### Criteri di accettazione

- [ ] `SupabaseDataProvider` riscritta usa `@supabase/supabase-js` v2, nessun `fetch` raw.
- [ ] Nessun `console.warn("not fully implemented yet")` rimasto.
- [ ] `read('/table')` ritorna `RecordArray` con `_key`.
- [ ] `read('/table/id')` ritorna oggetto singolo o `null`.
- [ ] `read` con `where` e `order` applica filtri e sorting server-side.
- [ ] `set` usa `upsert` con `onConflict: 'id'`.
- [ ] `update` usa `.update(data).eq('id', id)`.
- [ ] `remove` usa `.delete().eq('id', id)`.
- [ ] `useListener` usa `postgres_changes` real-time + unsubscribe pulizia; fa fetch iniziale.
- [ ] `count` usa `select('*', { count: 'exact', head: true })`.
- [ ] `setChunks` fa upsert in batch con `chunkSize` configurabile.
- [ ] `getConfigurationState()` verifica `url` e `anonKey` presenti.
- [ ] TypeScript strict: nessun `any` non giustificato.
- [ ] Test aggiornati: contratto completo passa su istanza test Supabase o mock client.

---

## CR-035 — SupabaseStorageProvider completo

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-002, CR-023  
**Stima:** 1-2 giorni  
**Breaking change:** No (sostituisce lo stub esistente, stesso driver name `supabaseStorage`)

### Motivazione

`src/providers/storage/supabase.ts` usa `fetch` raw per tutte le operazioni e avvisa `"not fully implemented yet"`. Funziona parzialmente (upload e getURL sono abbastanza lineari) ma non usa il client ufficiale, non gestisce signed URL per bucket privati, non ha download affidabile né error handling.

Questa CR riscrive il provider usando `@supabase/supabase-js` v2 Storage API, implementando tutto il contratto `StorageProviderAdapter` con supporto bucket pubblici e privati.

### Decisione architetturale

- Si usa il **client Supabase condiviso** (stesso singleton di CR-034 se nella stessa app): istanziato da `url` + `anonKey`.
- `bucket` configurabile nel costruttore (default: `'public'`).
- `upload` usa `supabase.storage.from(bucket).upload(path, blob, { upsert: true })`.
- `getURL` usa `getPublicUrl` per bucket pubblici. Per bucket privati, usa `createSignedUrl` con TTL configurabile (default 3600s).
- `download` usa `supabase.storage.from(bucket).download(path)`.
- `delete` usa `supabase.storage.from(bucket).remove([path])`.
- Il campo `isPrivate` nel costruttore determina se usare URL pubblici o signed.

### File da creare / modificare

```text
src/providers/storage/supabase.ts                ← riscrivere (stesso file, stessa classe)
tests/unit/providers/supabase-storage.test.ts    ← nuovo/aggiornare
```

Il driver name `supabaseStorage` nel manifest resta invariato.

### Interfaccia da implementare

```typescript
interface StorageProviderAdapter extends ProviderConfigurable {
    upload(file: string, path: string): Promise<string | undefined>;
    getURL(path: string): Promise<string | undefined>;
    download(path: string): Promise<Blob | undefined>;
    delete(path: string): Promise<boolean>;
}
```

Note implementative:
- `upload(file, path)` — `file` è una stringa base64 data URL (`data:mime;base64,...`). Deve essere convertita in `Blob` prima dell'upload.
- `getURL(path)` — ritorna URL pubblico o signed in base a `isPrivate`.
- `download(path)` — usa le API Supabase Storage, non `fetch` raw sull'URL pubblico.

### Criteri di accettazione

- [ ] `SupabaseStorageProvider` riscritta usa `@supabase/supabase-js` v2 Storage API, nessun `fetch` raw.
- [ ] Nessun `console.warn("not fully implemented yet")` rimasto.
- [ ] `upload(base64DataUrl, path)` converte correttamente e carica il file; ritorna URL.
- [ ] `getURL(path)` ritorna URL pubblico per bucket pubblici.
- [ ] `getURL(path)` ritorna signed URL per bucket privati (`isPrivate: true`).
- [ ] `download(path)` ritorna `Blob` scaricato tramite SDK.
- [ ] `delete(path)` rimuove il file e ritorna `true` su successo, `false` su errore.
- [ ] `getConfigurationState()` verifica `url` e `anonKey` presenti.
- [ ] TypeScript strict: nessun `any` non giustificato.
- [ ] Test aggiornati: contratto completo passa su istanza test Supabase o mock client.

---

## CR-036 — SupabaseAuthProvider

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002b, CR-023  
**Stima:** 2-3 giorni  
**Breaking change:** No

### Motivazione

Supabase ha un sistema auth integrato (`supabase.auth`) che supporta email/password, magic link, OAuth provider (Google, GitHub, ecc.) e anonymous sign-in. Il framework non ha un `SupabaseAuthProvider`, costringendo le app Supabase a usare `GoogleAuthProvider` Firebase (dipendenza incoerente) o a gestire l'auth manualmente fuori dal sistema provider.

Questa CR aggiunge `SupabaseAuthProvider` che implementa `AuthProviderAdapter` usando `@supabase/supabase-js` v2 Auth API, registrato come driver `supabaseAuth` nel manifest.

### Decisione architetturale

- Si usa il **client Supabase condiviso** (stesso singleton di CR-034/CR-035).
- `UserProfile` viene mappato da `supabase.auth.getUser()` / `onAuthStateChange`.
- `onAuthChange` usa `supabase.auth.onAuthStateChange` — ritorna unsubscribe.
- `getAccessToken` ritorna il JWT della sessione corrente (`session.access_token`).
- `signIn` supporta: `method: 'email'` (password), `method: 'magicLink'`, `method: 'oauth'` (Google, GitHub, ecc.), `method: 'anonymous'`.
- Il driver si chiama **`supabaseAuth`** nel manifest.

### File da creare / modificare

```text
src/providers/auth/supabase/SupabaseAuthProvider.ts   ← nuovo
src/providers/manifest.ts                              ← aggiungere driver supabaseAuth a SUPABASE_MANIFEST
src/providers/manifest.ts                              ← aggiungere 'supabaseAuth' a AuthDriverName
tests/unit/providers/SupabaseAuthProvider.test.tsx     ← nuovo
```

### Interfaccia da implementare

```typescript
interface AuthProviderAdapter extends ProviderConfigurable {
    getUser(): UserProfile | null;
    signIn?(options?: AuthSignInOptions): Promise<UserProfile | null>;
    signOut(): Promise<void>;
    onAuthChange(callback: (user: UserProfile | null) => void): () => void;
    getAccessToken?(scopes?: string[]): Promise<string>;
    isAuthenticated?(): boolean;
}
```

### Metodi supportati

| Metodo | Implementazione Supabase |
|--------|--------------------------|
| `signIn({ method: 'email', email, password })` | `signInWithPassword({ email, password })` |
| `signIn({ method: 'magicLink', email })` | `signInWithOtp({ email })` |
| `signIn({ method: 'oauth', provider })` | `signInWithOAuth({ provider })` |
| `signIn({ method: 'anonymous' })` | `signInAnonymously()` |
| `signOut()` | `supabase.auth.signOut()` |
| `onAuthChange(cb)` | `supabase.auth.onAuthStateChange(...)` |
| `getUser()` | `session?.user` mappato su `UserProfile` |
| `isAuthenticated()` | `session !== null` |
| `getAccessToken()` | `session?.access_token` |

`AuthSignInOptions` esteso per Supabase:

```typescript
interface SupabaseSignInOptions extends AuthSignInOptions {
    method?: 'email' | 'magicLink' | 'oauth' | 'anonymous';
    email?: string;
    password?: string;
    provider?: 'google' | 'github' | 'discord' | string;
    redirectTo?: string;
}
```

### Mapping UserProfile

```typescript
// da supabase User → UserProfile
{
    uid:         user.id,
    email:       user.email,
    displayName: user.user_metadata?.full_name ?? user.user_metadata?.name,
    photoURL:    user.user_metadata?.avatar_url,
    // resto di user_metadata spread
}
```

### Integrazione manifest

```typescript
// SUPABASE_MANIFEST
supabaseAuth: { service: 'auth', create: (cfg) => new SupabaseAuthProvider(cfg) }

// AuthDriverName
export type AuthDriverName = 'googleAuth' | 'dropboxAuth' | 'firebaseAuth' | 'supabaseAuth';
```

### Configurazione consumer

```tsx
<App
  providers={{
    supabase: { url: '...', anonKey: '...' },
    services: {
      data:    'supabaseDb',
      storage: 'supabaseStorage',
      auth:    'supabaseAuth',
    },
  }}
/>
```

### Criteri di accettazione

- [ ] `SupabaseAuthProvider` implementa `AuthProviderAdapter` senza errori TypeScript strict.
- [ ] `signIn({ method: 'email', email, password })` autentica e ritorna `UserProfile`.
- [ ] `signIn({ method: 'magicLink', email })` invia il link e ritorna `null` (nessun utente ancora).
- [ ] `signIn({ method: 'oauth', provider: 'google' })` avvia il redirect OAuth.
- [ ] `signIn({ method: 'anonymous' })` autentica anonimamente e ritorna `UserProfile`.
- [ ] `signOut()` termina la sessione.
- [ ] `onAuthChange(cb)` invoca il callback al cambio stato e ritorna un unsubscribe funzionante.
- [ ] `getUser()` ritorna il profilo corrente mappato su `UserProfile`, o `null`.
- [ ] `isAuthenticated()` ritorna `true` solo a sessione attiva.
- [ ] `getAccessToken()` ritorna il JWT della sessione corrente.
- [ ] `getConfigurationState()` verifica `url` e `anonKey` presenti.
- [ ] Driver `supabaseAuth` registrato in `SUPABASE_MANIFEST` e `AuthDriverName`.
- [ ] Test unitari con mock del client Supabase passano.

---

## CR-001 — Documentazione AI-first

**Stato:** ✅ done  
**Branch:** `modernize/cr-001-docs`  
**Priorità:** Alta — inizia subito, parallela a tutto  
**Stima:** 2–3 giorni  

### Motivazione
Un AI che lavora su questo progetto ha zero training data su react-firestrap. Senza documentazione dedicata, ogni sessione riparte da zero e l'AI indovina le API sbagliando. `CLAUDE.md` nella root viene letto automaticamente da Claude Code ad ogni sessione.

### Scope
- `CLAUDE.md` (root) — quick reference per AI: pattern principali, dove cercare le cose, regole di dipendenza
- `docs/overview.md` — cos'è il framework, cosa non è, quando usarlo
- `docs/architecture.md` — struttura cartelle, regole di dipendenza tra layer
- `docs/patterns.md` — i 5 pattern che coprono il 90% dei casi d'uso
- `docs/components.md` — API reference di ogni componente pubblico
- `docs/providers.md` — come configurare e scrivere un DataProvider (aggiornare dopo CR-002)
- `docs/examples/crud-basic.md` — Grid + Form con Firebase
- `docs/examples/crud-modal.md` — Grid con modal edit
- `docs/examples/form-nested.md` — Form con oggetti annidati e array
- `docs/examples/custom-provider.md` — come scrivere un DataProvider custom

### Checklist
- [x] Scrivere `CLAUDE.md`
- [x] Scrivere `docs/overview.md`
- [x] Scrivere `docs/architecture.md`
- [x] Scrivere `docs/patterns.md`
- [x] Scrivere `docs/components.md`
- [x] Scrivere `docs/examples/crud-basic.md`
- [x] Scrivere `docs/examples/crud-modal.md`
- [x] Scrivere `docs/examples/form-nested.md`
- [x] Aggiornare `docs/providers.md` dopo CR-002
- [x] Scrivere `docs/examples/custom-provider.md` dopo CR-002

---

## CR-002 — Provider abstraction layer

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Critica — sblocca CR-004  
**Stima:** 1–2 settimane  
**Breaking change:** No (API pubblica invariata, cambia solo internamente)

### Motivazione
`Form.tsx` e `Grid.tsx` importano `db` direttamente da `libs/database.ts` che wrappa Firebase. Non è possibile usare Supabase, Firestore o REST senza riscrivere i widget core. Il coupling è il problema architetturale principale del progetto.

### Scope — Nuova struttura cartelle

```
src/
  providers/
    data/
      DataProvider.ts         ← interface
      DataProviderContext.tsx  ← React Context + useDataProvider() hook
      firebase.ts             ← migrato da libs/database.ts + integrations/google/firedatabase.ts
      supabase.ts             ← nuovo
    storage/
      StorageProvider.ts      ← interface
      StorageProviderContext.tsx
      firebase.ts             ← migrato da integrations/google/firestorage.ts
      supabase.ts             ← nuovo
    ai/
      index.ts                ← migrato da integrations/ai.ts (rimane concreto, no interface)
    auth/
      google/                 ← migrato da integrations/google/GoogleAuth.tsx + auth.ts
    scrape/
      index.ts                ← migrato da integrations/scrape.ts
    dropbox/
      index.ts                ← migrato da integrations/dropbox.tsx
  types/                      ← RINOMINATA da models/
```

### DataProviderAdapter contract

```typescript
// src/providers/data/DataProvider.ts
export interface QueryOptions {
  where?: { [field: string]: Condition | OperatorValue }
  order?: { [field: string]: 'asc' | 'desc' }
  limit?: number
  fieldMap?: Record<string, string>
}

export interface DataProviderAdapter {
  read(path: string): Promise<Record<string, any> | null>
  set(path: string, data: object): Promise<void>
  remove(path: string): Promise<void>
  list(path: string, options?: QueryOptions): Promise<RecordArray>
  useListener(path: string, callback: (data: RecordArray) => void): void
  count(path: string): Promise<number>
}
```

### StorageProviderAdapter contract

```typescript
// src/providers/storage/StorageProvider.ts
export interface StorageProviderAdapter {
  upload(file: string, path: string): Promise<string | undefined>
  getURL(path: string): Promise<string | undefined>
  download(path: string): Promise<Blob | undefined>
  delete(path: string): Promise<boolean>
}
```

Nota di audit 2026-05-08: questa e' la surface reale verificata in `src/providers/storage/StorageProvider.ts`. Le bozze iniziali usavano `getUrl`/`remove`, ma non corrispondono alla codebase attuale.

### Iniezione in App.tsx

```tsx
<App
  providers={{
    firebase: { config: firebaseConfig },
    supabase: { config: supabaseConfig },
    services: {
      data: 'firebase',
      storage: 'supabase',
    },
  }}
/>
```

Nota di audit 2026-05-08: la API pubblica corrente non richiede piu' `new FirebaseDataProvider()` o `storageProvider`. Gli adapter built-in vengono creati internamente a partire da `providers`.

### Checklist
- [x] Creare `src/providers/data/DataProvider.ts` (interface + tipi)
- [x] Creare `src/providers/data/DataProviderContext.tsx` (Context + hook)
- [x] Creare `src/providers/storage/StorageProvider.ts` (interface)
- [x] Creare `src/providers/storage/StorageProviderContext.tsx`
- [x] Migrare `firedatabase.ts` → `providers/data/firebase.ts` implementando DataProvider
- [x] Migrare `firestorage.ts` → `providers/storage/firebase.ts` implementando StorageProvider
- [x] Scrivere `providers/data/supabase.ts`
- [x] Scrivere `providers/storage/supabase.ts`
- [x] Aggiornare `Form.tsx` — sostituire `import db` con `useDataProvider()`
- [x] Aggiornare `Grid.tsx` — sostituire `import db` con `useDataProvider()`
- [x] Aggiornare `Upload.tsx` — sostituire storage diretto con `useStorageProvider()`
- [x] Aggiornare `App.tsx` — accettare configurazione dichiarativa `providers`
- [x] Spostare `integrations/ai.ts` → `providers/ai/index.ts`
- [x] Spostare `integrations/google/GoogleAuth.tsx` → `providers/auth/google/`
- [x] Spostare `integrations/google/auth.ts` → `providers/auth/google/auth.ts`
- [x] Spostare `integrations/google/firebase.ts` → `providers/firebase-init.ts`
- [x] Spostare `integrations/google/email.ts` → `providers/email/google/email.ts`
- [x] Spostare `integrations/google/keyword.ts` → `providers/seo/google/keyword.ts`
- [x] Spostare `integrations/google/trend.ts` → `providers/seo/google/trend.ts`
- [x] Spostare `integrations/scrape.ts` → `providers/scrape/index.ts`
- [x] Spostare `integrations/dropbox.tsx` → `providers/storage/dropbox.ts`
- [x] Rinominare `models/` → `types/` (backward-compat stubs in models/)
- [x] Creare backward-compat stubs in integrations/ per tutti i file spostati
- [x] Aggiornare `src/index.ts` con i nuovi export path
- [x] Aggiornare libs/database.ts e libs/storage.ts (backward-compat re-export)
- [ ] Test manuale: Form con FirebaseDataProvider
- [ ] Test manuale: Grid con FirebaseDataProvider
- [ ] Test manuale: Upload con FirebaseStorageProvider
- [ ] Test manuale: Form con SupabaseDataProvider

---

## CR-002b — AuthProviderAdapter + EmailProviderAdapter contracts

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002  
**Breaking change:** No

### Motivazione
`GoogleAuth.tsx` e `email.ts` sono implementazioni concrete senza contratto. Non è possibile sostituire l'autenticazione (es. GitHub OAuth, email+password) o il provider email (SendGrid, Mailgun) senza riscrivere i componenti che li usano. Si applica lo stesso pattern Ports & Adapters già usato per DataProvider e StorageProvider.

### Scope

```
providers/
  auth/
    AuthProvider.ts           ← interface: UserProfile, AuthProvider
    AuthProviderContext.tsx   ← React Context + useAuthProvider() hook
    google/
      GoogleAuthProvider.ts  ← GoogleAuthProvider implements AuthProviderAdapter
  email/
    EmailProvider.ts          ← interface: EmailSendParams, EmailProvider
    EmailProviderContext.tsx  ← React Context + useEmailProvider() hook
    google/
      GmailEmailProvider.ts  ← GmailEmailProvider implements EmailProviderAdapter
```

### AuthProviderAdapter contract

```typescript
export interface UserProfile {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  [key: string]: any;
}

export interface AuthProviderAdapter {
  getUser(): UserProfile | null;
  signOut(): Promise<void>;
  onAuthChange(callback: (user: UserProfile | null) => void): () => void;
  getAccessToken?(scopes?: string[]): Promise<string>;
}
```

### EmailProviderAdapter contract

```typescript
export interface EmailSendParams {
  to: string | string[];
  bcc?: string | string[];
  subject: string;
  message: string;
}

export interface EmailProviderAdapter {
  send(params: EmailSendParams): Promise<void>;
}
```

### Iniezione in App.tsx

```tsx
<App
  providers={{
    google: { oAuth2: googleOAuth2 },
    gmail: { enabled: true },
    services: {
      auth: 'google',
      email: 'gmail',
    },
  }}
/>
```

Nota di audit 2026-05-08: anche Auth/Email passano dalla configurazione dichiarativa `providers`.

### Checklist

- [x] Creare `providers/auth/AuthProvider.ts`
- [x] Creare `providers/auth/AuthProviderContext.tsx`
- [x] Creare `providers/auth/google/GoogleAuthProvider.ts`
- [x] Creare `providers/email/EmailProvider.ts`
- [x] Creare `providers/email/EmailProviderContext.tsx`
- [x] Creare `providers/email/google/GmailEmailProvider.ts`
- [x] Aggiornare `App.tsx` — accettare `authProvider` e `emailProvider` come prop
- [x] Aggiornare `src/index.ts` con nuovi export

---

## CR-003 — TypeScript strict

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta — parallela a CR-002  
**Stima:** 1 settimana  
**Breaking change:** No

### Motivazione
`RecordProps` è tipizzato come `{ [key: string]: any }` (di fatto `any`). Questo impedisce all'AI di inferire i tipi dei campi, di trovare errori in anticipo, e di fare autocompletion utile. Con TypeScript strict il codice diventa auto-documentante.

### Scope
- Abilitare `strict: true` nel tsconfig
- Introdurre generics su `RecordProps<T>`
- Tipizzare `QueryOptions`, `ColumnFormatter`, `FormRef`, `FieldAdapter`
- Risolvere tutti gli errori TypeScript risultanti

### Checklist
- [x] `strict: true` già abilitato in `tsconfig.json`
- [x] Rimozione `@types/react-router-dom` v5 (obsoleto in RRD v6, tipi bundled)
- [x] Installazione `react-router-dom@^6.22.0` e `googleapis` come devDependencies
- [x] Fix `App.tsx`: cast nullable firebaseConfig/oAuth2 per strict null checks
- [x] Fix `providers/email/google/apis/email.ts`: overload googleapis corretto
- [x] Rimosso exclude stale `src/integrations/google` da tsconfig.json
- [x] Build pulita senza errori (`tsc --noEmit` exit 0)

---

## CR-004 — shadcn/ui + Tailwind CSS

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta — dopo CR-002 stabile  
**Stima:** 2–3 settimane  
**Dipende da:** CR-002 completata  
**Breaking change:** Sì — temi Bootstrap non più compatibili (major version bump)

### Motivazione
Bootstrap è in declino nell'ecosistema React. shadcn/ui + Tailwind è lo standard moderno: headless, accessibile, customizzabile, e ampiamente conosciuto dall'AI. Il sistema tema via Context è già pronto — si tratta di riscrivere i valori delle classi e i componenti sottostanti.

### Scope
- Installare e configurare Tailwind CSS
- Installare shadcn/ui
- Riscrivere i valori di classe in `Theme.tsx` (Bootstrap → Tailwind)
- Sostituire i componenti primitivi con equivalenti shadcn
- Mantenere invariata l'API pubblica dei componenti

### Componenti da migrare

| Componente | shadcn equivalente | Note |
|------------|-------------------|------|
| Button, LoadingButton | `Button` | varianti: default, outline, ghost |
| Input | `Input` | |
| Select, Autocomplete | `Select`, `Combobox` | |
| Checklist | `Checkbox` group | |
| Modal | `Dialog` | |
| Card | `Card` | |
| Badge | `Badge` | |
| Alert | `Alert` | |
| Table | `Table` | |
| Tab, TabDynamic | `Tabs` | |
| Pagination | custom Tailwind | shadcn non ha paginazione built-in |
| Upload | custom Tailwind | UI custom con drop zone |
| Loader | custom Tailwind | spinner o skeleton |

### Approccio scelto: Bootstrap compatibility layer via Tailwind `@layer components`

Invece di usare i componenti shadcn/ui direttamente (che richiederebbe riscrivere i file `.tsx`),  
si definiscono le stesse classi Bootstrap (`.btn`, `.badge`, `.alert`, `.modal`, `.card`, ecc.)  
come macro Tailwind via `@apply` in `@layer components`. Questo significa:
- Nessun cambiamento al codice dei componenti `.tsx`
- CSS generato da Tailwind (tree-shaking, zero Bootstrap runtime)
- Il percorso tema raccomandato passa da `themeProvider`; i valori delle classi nel tema sono ora Tailwind puri
- Consumatori che usano `cn()` possono usare utilities Tailwind direttamente

### Schema architetturale
```
src/globals.css          ← @import "tailwindcss" + @theme (colori) + @layer components (Bootstrap compat)
src/libs/cn.ts           ← helper clsx + tailwind-merge
src/Theme.tsx            ← defaultTheme aggiornato con classi Tailwind-compat
dist/index.css           ← CSS estratto da MiniCssExtractPlugin (consumer lo importa una volta)
dist/index.js            ← bundle JS invariato
```

### Consumer setup
```tsx
// main.tsx / App.tsx del consumer
import '@llmnative/react/dist/index.css';   // ← un solo import
```

### Checklist
- [x] Installare Tailwind CSS v4 + `@tailwindcss/postcss` + autoprefixer
- [x] Installare `clsx` + `tailwind-merge`
- [x] Configurare `tailwind.config.js` (content scan `src/**/*.{ts,tsx}`)
- [x] Configurare `postcss.config.js`
- [x] Aggiornare `webpack.config.js` — aggiungere `css-loader`, `postcss-loader`, `MiniCssExtractPlugin`
- [x] Creare `src/globals.css` — `@import "tailwindcss"` + `@theme inline` (colori) + `@layer components` (Bootstrap compat layer completo)
- [x] Creare `src/libs/cn.ts` — helper `cn()` esportato
- [x] Aggiornare `src/index.ts` — aggiungere `import './globals.css'`
- [x] Aggiornare `Theme.tsx` defaultTheme — tutti i valori Bootstrap → classi Tailwind-compat
- [x] Aggiornare `package.json` — aggiungere `"style"` + `"exports"` fields
- [x] Build pulita (webpack dev + prod, 0 errori)
- [x] Test visivo completo di tutti i componenti nel consumer *(baseline tramite showcase; visual regression profonda resta in CR-007/CR-014)*
- [x] Aggiornare `docs/patterns.md` con nota import CSS
- [x] Verificare dark mode via `.dark` class override delle `--rf-*` variables

---

## CR-005 — CLI update e scaffolding

**Stato:** ✅ done  
**Branch:** `modernize/cli`  
**Priorità:** Media  
**Dipende da:** CR-002, CR-004

### Motivazione
Il CLI (`npx ash create`) generava struttura con Bootstrap e Firebase hardcoded. Dopo le migrazioni doveva offrire scelta del provider e generare boilerplate aggiornato.

### Risoluzione

CR-005 è stata assorbita da CR-015, che ha reso lo scaffolding ufficiale Vite-first e ha aggiunto la scelta provider nel CLI. Le parti residue di documentazione/scaffold avanzato vengono tracciate nelle CR successive invece di mantenere una CR duplicata.

### Checklist
- [x] Aggiornare `bin/cli.js` — scaffolding con Tailwind invece di Bootstrap *(via CR-015)*
- [x] Aggiungere prompt interattivo: scelta DataProvider (Firebase / Supabase / Mock / Custom) *(via CR-015)*
- [x] Generare configurazione provider nel progetto scaffoldato *(via CR-015)*
- [x] Aggiornare README con nuove istruzioni *(via CR-015)*
- [x] Riconciliare CR con CR-015 e chiuderla come assorbita

---

## CR-006 — Batterie di test

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Alta  
**Stima:** 2–3 settimane  
**Dipende da:** CR-002 (i test testano le interface, non Firebase direttamente), CR-003 (TypeScript strict aiuta la correttezza dei test)  
**Breaking change:** No

### Motivazione
Senza test ogni refactor è un salto nel vuoto. I test devono essere scritti **dopo** CR-002 perché testano le interface (`DataProvider`, `StorageProvider`) e non l'implementazione Firebase — così rimangono validi quando aggiungi Supabase o altri provider. Tre livelli: unit (funzioni pure), integration (provider contract), component (UI con Testing Library).

### Stack di test verificato

```
Vitest                  ← test runner Vite-native
React Testing Library   ← componenti React
@testing-library/user-event ← interazioni utente realistiche
happy-dom               ← environment DOM dei test
```

Non ancora configurati in codebase: `msw`, Firebase Emulator/vitest-firebase, Playwright E2E e CI.

### Struttura cartelle test

```
src/
  __tests__/
    unit/
      libs/                     ← test funzioni pure (converter, path, sanitizer, cache)
      providers/
        DataProvider.contract.ts  ← test contract: ogni provider DEVE superarli
    integration/
      providers/
        firebase.test.ts          ← FirebaseDataProvider contro emulatore locale
        supabase.test.ts          ← SupabaseDataProvider contro istanza test
    components/
      ui/
        Input.test.tsx
        Select.test.tsx
        Upload.test.tsx
      widgets/
        Form.test.tsx             ← form con mock DataProvider
        Grid.test.tsx             ← grid con mock DataProvider
      fields/
        Prompt.test.tsx
        AssistantAI.test.tsx
playground/                       ← (CR-007) app separata, non in __tests__
```

### Contract test — il pattern chiave

Il `DataProvider.contract.ts` è un set di test parametrici che ogni implementazione deve superare. Garantisce che Firebase, Supabase e REST si comportino identicamente dall'esterno:

```typescript
// src/__tests__/unit/providers/DataProvider.contract.ts
export function runDataProviderContract(
  createProvider: () => DataProviderAdapter,
  cleanup: () => Promise<void>
) {
  describe('DataProvider contract', () => {
    let provider: DataProviderAdapter

    beforeEach(() => { provider = createProvider() })
    afterEach(cleanup)

    it('read → null su path inesistente', async () => {
      expect(await provider.read('/nonexistent/path')).toBeNull()
    })

    it('set + read → ritorna il record salvato', async () => {
      await provider.set('/test/1', { name: 'Mario' })
      expect(await provider.read('/test/1')).toMatchObject({ name: 'Mario' })
    })

    it('remove → il record non esiste più', async () => {
      await provider.set('/test/2', { name: 'Luigi' })
      await provider.remove('/test/2')
      expect(await provider.read('/test/2')).toBeNull()
    })

    it('list → ritorna array con _key per ogni record', async () => {
      await provider.set('/test/a', { val: 1 })
      await provider.set('/test/b', { val: 2 })
      const list = await provider.list('/test')
      expect(list).toHaveLength(2)
      expect(list[0]).toHaveProperty('_key')
    })

    it('list con where eq → filtra correttamente', async () => { ... })
    it('list con order asc → ordine rispettato', async () => { ... })
    it('useListener → callback chiamata su cambio dati', async () => { ... })
    it('count → numero corretto di record', async () => { ... })
  })
}

// Uso nei test specifici:
// firebase.test.ts  → runDataProviderContract(() => new FirebaseDataProvider(testConfig), cleanup)
// supabase.test.ts  → runDataProviderContract(() => new SupabaseDataProvider(testConfig), cleanup)
```

### Unit test — libs/

```typescript
// converter.test.ts
describe('converter.toCamel', () => {
  it('converte snake_case', () => expect(converter.toCamel('hello_world')).toBe('helloWorld'))
  it('converte kebab-case', () => expect(converter.toCamel('hello-world')).toBe('helloWorld'))
  it('stringa vuota', () => expect(converter.toCamel('')).toBe(''))
})

// path.test.ts — normalizePath, trimPath, dirname, normalizeKey
// sanitizer.test.ts — html, key
// cache.test.ts — set/get/clear
```

### Component test — pattern standard

```tsx
// Form.test.tsx
const mockProvider = createMockDataProvider({
  '/users/1': { name: 'Mario', role: 'admin' }
})

it('carica i dati dal provider e popola i campi', async () => {
  render(
    <DataProviderContext.Provider value={mockProvider}>
      <Form dataStoragePath="/users/1">
        <Input name="name" label="Nome" />
        <Select name="role" options={[...]} />
      </Form>
    </DataProviderContext.Provider>
  )
  expect(await screen.findByDisplayValue('Mario')).toBeInTheDocument()
})

it('salva chiamando provider.set con i dati corretti', async () => {
  const spy = vi.spyOn(mockProvider, 'set')
  await userEvent.click(screen.getByText('Salva'))
  expect(spy).toHaveBeenCalledWith('/users/1', expect.objectContaining({ name: 'Mario' }))
})

it('validazione required — non salva se campo obbligatorio vuoto', async () => { ... })
it('dot notation — name="address.city" aggiorna oggetto annidato', async () => { ... })
it('array index — name="items.0.name" aggiorna primo elemento array', async () => { ... })
```

### Corner case da coprire obbligatoriamente

**Form:**
- [ ] Dot notation su N livelli di profondità (`a.b.c.d`)
- [ ] Array index notation (`items.0.name`, `items.99.value`)
- [ ] Campo `required` blocca il submit
- [ ] `onLoad` trasforma i dati prima del render
- [ ] `onSave` può modificare i dati prima della scrittura
- [ ] `onFinally` viene chiamato dopo save e delete
- [ ] Record nuovo vs record esistente (isNewRecord)
- [ ] `setPrimaryKey` custom
- [ ] `savePath` custom
- [ ] FormRef: handleSave, handleDelete, getRecord esposti correttamente

**Grid:**
- [ ] Dati vuoti — mostra stato empty
- [ ] Real-time update — nuovi record appaiono senza refresh
- [ ] Paginazione — navigazione tra pagine
- [ ] Sorting — ordine asc/desc su colonna
- [ ] groupBy — raggruppamento corretto
- [ ] allowedActions: solo "add" → no edit/delete visibili
- [ ] Modal add → Form nuovo record
- [ ] Modal edit → Form con dati esistenti
- [ ] onLoadRecord ritorna false → record escluso dalla lista

**DataProvider contract:**
- [ ] Path con caratteri speciali
- [ ] Record con valori null/undefined/0/false (non devono sparire)
- [ ] Listener si disconnette quando componente unmonta
- [ ] where con operatori: eq, lt, lte, gt, gte, in, nin
- [ ] order multi-campo

**Input:**
- [ ] Valore iniziale undefined → campo vuoto, non stringa "undefined"
- [ ] Tipo number → valore numerico, non stringa
- [ ] Drag and drop testo → inserito alla posizione cursore
- [ ] updatable: false → read-only dopo primo valore

**Select:**
- [ ] Options da array statico
- [ ] Options da DataProvider (db config)
- [ ] Autocomplete — filtra correttamente
- [ ] Checklist — multi-selezione, valore come array

### Checklist

- [x] Configurare Vitest 2.x + React Testing Library + happy-dom (`vitest.config.ts`)
- [ ] Configurare Firebase Emulator per test di integrazione
- [x] Creare `MockDataProvider` — implementazione in-memory completa (`src/providers/data/mock.ts`)
- [x] Scrivere `DataProvider.contract.ts` — contract test parametrico (14 test)
- [x] `MockDataProvider.test.ts` — MockDataProvider supera il contract + test useListener (22 test)
- [x] Unit test: `utils.ts` — trimSlash, normalizePath, normalizeKey, isEmpty, safeClone (23 test)
- [x] Unit test: `converter.ts` — toCamel, toUpper, toLower, toSlug, truncate, toQueryString, parse, subStringCount (16 test)
- [ ] Unit test: `path.ts`
- [ ] Unit test: `sanitizer.ts`
- [ ] Unit test: `cache.ts`
- [ ] Integration test: `FirebaseDataProvider` contro emulatore
- [ ] Integration test: `SupabaseDataProvider` contro istanza test
- [x] Component test: `Form.tsx` — defaultValues, FormDatabase loading, save, onFinally, nested dot notation (9 test)
- [x] Component test: `Grid.tsx` — headers, rows, empty state, dataArray, onDisplay formatter, real-time add/remove, allowedActions (8 test)
- [x] Component test: `Input.tsx` — rendering, labels, types, placeholder, disabled, user interaction (8 test)
- [x] Component test: `Select.tsx`
- [x] Component test: `Upload.tsx` — document/image existing values, max limit, remove, URL helper (5 test)
- [ ] Component test: `Prompt.tsx`
- [x] Component test: `Repeat.tsx` — render array, add item, readOnly controls, save nested values (4 test)
- [x] Provider context test: `StorageProviderContext.tsx` — missing/default/named/unknown adapter (4 test)
- [ ] Configurare Playwright per smoke test E2E
- [ ] E2E: flusso CRUD completo (add → edit → delete)
- [ ] E2E: login Google
- [x] Aggiungere script `test`, `test:watch`, `test:coverage` in `package.json`
- [ ] Aggiungere CI check (GitHub Actions o equivalente)

### Stato verificato al 2026-05-27

Verifica reale eseguita oggi:
- `npx vitest run --reporter=dot` passa.
- La suite attuale e' salita a **25 file / 188 test**.

Copertura effettivamente presente oggi:
- libs: `utils`, `converter`
- framework/runtime: `App`, `motion`
- provider/config: `MockDataProvider`, `StorageProviderContext`, `ProviderConfiguration`, `DropboxAuthProvider`, auth manifest
- componenti: `Form`, `Grid`, `Input`, `Select`, `Upload`, `Repeat`, `MarkdownReader`, `Table`, `Modal`, `Dropdown`, `Gallery`, `Buttons`, `Badge`, `AuthButton`

Gap residui confermati:
- mancano ancora test `Prompt`
- mancano integration test Firebase/Supabase
- mancano test su storage concrete implementations, browser OAuth reali ed email provider
- mancano E2E Playwright e CI

---

## CR-007 — Showcase app

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Alta — anticipata per testare visivamente CR-004  
**Stima:** 3–4 settimane  
**Dipende da:** CR-002, CR-004 (rimossa dipendenza da CR-006 — la showcase serve anche come test visivo)  
**Breaking change:** No (app separata)

### Motivazione
Una showcase app serve a tre cose contemporaneamente: documentazione interattiva per sviluppatori, test manuale visivo di ogni componente con ogni combinazione di props, e stress test di corner case reali. È anche il modo più efficace per mostrare il framework a chi non lo conosce. Anticipata rispetto a CR-006 perché è necessaria per verificare visivamente CR-004 (Tailwind migration).

### Struttura

App separata in `clients/showcase/` nella root del repo (non dentro `src/`). Oggi usa il framework stesso come dipendenza locale ed e' una **consumer app Vite reale**:

```
clients/showcase/
  package.json                   ← dipendenza: "@llmnative/react": "file:../../"
  vite.config.mts                ← build del client showcase
  src/
    index.tsx                    ← entry `<App>` react-firestrap + provider/env config
    conf/
      menu.ts                    ← menuConfig canonico per navigazione e pagine
    layouts/
      ShowcaseLayout.tsx         ← LayoutDefault custom con sidebar/topbar
    pages/
      Home.tsx                   ← home: overview del framework, link rapidi
      components/                ← una pagina per componente o famiglia
      docs/                      ← pagine markdown/stub
      examples/                  ← esempi applicativi
```

### Pattern di ogni pagina componente

Ogni pagina segue la stessa struttura per consistenza:

```
┌─────────────────────────────────────────────────────┐
│ NomeComponente                                       │
│ Descrizione breve di cosa fa                        │
├──────────────────────┬──────────────────────────────┤
│                      │  Props configurabili          │
│   PREVIEW LIVE       │  ─────────────────────────── │
│                      │  label: [input testo]         │
│   [componente qui]   │  required: [toggle]           │
│                      │  defaultValue: [input]        │
│                      │  disabled: [toggle]           │
├──────────────────────┴──────────────────────────────┤
│ Codice generato (aggiornato live)                   │
│ <Input name="field" label="..." required />         │
├─────────────────────────────────────────────────────┤
│ Corner cases                                        │
│ [caso 1] [caso 2] [caso 3] ...                      │
└─────────────────────────────────────────────────────┘
```

Il codice generato live è particolarmente utile per l'AI: un developer (o un AI) può configurare visivamente il componente e ottenere il codice esatto da copiare.

### Checklist

- [x] Creare `clients/showcase/` come app separata consumer del framework
- [x] Collegare come dipendenza locale (`file:../../`)
- [x] Configurare router (react-router-dom) con sidebar
- [x] Creare layout: sidebar navigazione + area preview + blocco codice copiabile
- [x] Creare componente `PageLayout` — header pagina con titolo e descrizione
- [x] Creare componente `Section` — preview live + codice con pulsante copia
- [x] Home page con overview, quick links e quick start
- [x] Pagina Alert: tutte le varianti, senza icona, con timeout
- [x] Pagina Badge: tutte le varianti, in contesto con testo e bottoni
- [x] Pagina Button: solid, outline, link, disabilitato, stato loading
- [x] Pagina Card: base, con header/footer, griglia di card
- [x] Pagina Loader: spinner inline, Loader come wrapper
- [x] Pagina Modal: tutte le posizioni (center/left/right/top/bottom), ModalYesNo
- [x] Pagina Pagination: demo interattiva 50 record, spiegazione sticky
- [x] Pagina Tab: tutte le posizioni (default/top/left/right/bottom)
- [x] Pagina Table: striping, selezione riga, colonne custom
- [x] Build production dello showcase pulita (oggi via Vite, 0 errori)
- [x] Pagine Input: tutti i tipi (string, number, email, password, color, date, datetime, week, month)
- [x] Pagine Select: basic, static options, checklist
- [x] Pagine Select: from-db (richiede DataProvider live), autocomplete
- [x] Pagine Upload: image (con crop), document, CSV
- [x] Pagine Form: basic, nested-objects, edit existing record, lifecycle hooks — powered by MockDataProvider
- [x] Pagine Grid: read-only table, full CRUD, pagination, column formatters, in-memory dataArray — powered by MockDataProvider
- [x] MockDataProvider: implementazione in-memory del DataProvider per showcase offline
- [x] Pagine Providers: confronto Firebase vs Supabase side-by-side
- [x] Showcase migrata a Vite (`vite.config.mts`, `src/index.tsx`, build produzione verificata)
- [x] Pagine aggiuntive reali: Auth, Notifications, Buttons dedicate, Prompt, GridArray, GridDB, Autocomplete, Checklist, Image, ImageAvatar, LayoutBuilder
- [ ] Deploy (GitHub Pages o Vercel)
- [ ] Link alla showcase da `CLAUDE.md` e `docs/`

### Stato verificato al 2026-05-27

Implementazione reale confermata:
- `clients/showcase` builda con `npm run build`.
- Il menu espone molte pagine componente reali e non solo i nuclei iniziali.
- Le docs pubbliche dello showcase arrivano da Markdown via `markdownDocs`.
- Esistono ancora route stub per alcuni provider concreti e per esempi applicativi (`/examples/crud`, `/examples/dashboard`, `/examples/nested-form`, `/examples/file-manager`, `/examples/google-auth`).

---

## CR-008 — Tema `empty` → Tailwind + shadcn/ui

**Stato:** ✅ done  
**Risolto da:** CR-004 (rimozione Bootstrap) + CR-021 (2026-05-11)  
**Breaking change:** No

### Risoluzione

La cartella `themes/empty/` è stata eliminata. Il concetto di "template minimale" è ora il template `blank` in `templates/blank/` generato dallo scaffolding CLI. Non ha dipendenze Bootstrap.

---

## CR-009 — Tema `default` → Tailwind + shadcn/ui

**Stato:** ✅ done  
**Risolto da:** CR-004 (rimozione Bootstrap) + CR-021 (2026-05-11)  
**Breaking change:** No

### Risoluzione

La cartella `themes/default/src/` è stata eliminata. I colori del preset `default` sono ora in `themes/default.ts` (importato da `src/Theme.tsx`). Il layout shell (Header, Sidebar, Footer, PreLoader) è stato spostato in `templates/` — ogni template ne ha una copia indipendente. Nessuna dipendenza Bootstrap residua.

---

## CR-010 — Tema `flat` → Tailwind + shadcn/ui

**Stato:** ✅ done  
**Risolto da:** CR-004 (rimozione Bootstrap) + CR-021 (2026-05-11)  
**Breaking change:** No

### Risoluzione

La cartella `themes/flat/src/` è stata eliminata. I colori del preset `flat` sono ora in `themes/flat.ts`. Layout shell spostato in `templates/`. Nessun file `.pc-*`, `pcoded.js` o Bootstrap bundle residuo.

---

## CR-011 — Tema `cyber` → Tailwind + shadcn/ui

**Stato:** ✅ done  
**Risolto da:** CR-004 (rimozione Bootstrap) + CR-021 (2026-05-11)  
**Breaking change:** No

### Risoluzione

La cartella `themes/cyber/src/` è stata eliminata. I colori del preset `cyber` (dark-first, green neon, radius 0) sono ora in `themes/cyber.ts`. Nessun bundle Bootstrap o `vendor.min.css` residuo.

---

## CR-012 — Showcase refactor — react-firestrap native

**Stato:** ⬜ todo  
**Branch:** `modernize/cr-012-showcase-native`  
**Priorità:** Alta  
**Dipende da:** CR-004, CR-007  
**Stima:** 3–5 giorni  

### Motivazione

Il client `clients/showcase/` è nato come prototipo Vite standalone per sviluppare e testare i componenti visivamente. Nel corso del suo sviluppo è cresciuto in modo organico usando HTML grezzo, classi Bootstrap manuali e un routing custom — tutto materiale che non ha nulla a che fare con il framework stesso.

Questo è un problema su due livelli:

1. **Non è una prova autentica del framework.** Se il progetto più visibile di react-firestrap non usa react-firestrap, il framework perde credibilità come strumento di sviluppo reale.
2. **Duplicazione di soluzioni.** Ogni cosa costruita nello showcase da zero (layout, routing, menu, modal, form) è già risolta dal framework. Riscriverla in parallelo è spreco di codice e crea divergenza.

L'obiettivo di CR-012 è ricostruire `clients/showcase/` *integralmente* usando solo i pattern e i componenti descritti in `CLAUDE.md`: `<App>`, `menuConfig`, `LayoutDefault`, `Grid`, `Form`, `Modal`, provider, ecc. Lo showcase diventa così la documentazione vivente più credibile del framework — ogni feature esposta è una feature dimostrata in produzione.

### Scope

**Incluso:**
- Eliminare tutto il codice che non usa react-firestrap nativamente (routing custom, layout a mano, classi Bootstrap scritte a mano)
- Adottare `<App>` come entry point con `menuConfig` per la navigazione laterale
- Usare `LayoutDefault` (o un `importLayout` custom minimo) per header, sidebar, breadcrumb
- Ogni pagina del catalogo componenti dimostra il componente usando react-firestrap direttamente
- La pagina "Providers" mostra una configurazione reale con `DataProvider`, `StorageProvider`, ecc.
- La pagina "Theme" usa il `ThemePanel` collegato a CSS variables reali di react-firestrap
- Il client usa la stessa toolchain moderna del repository e resta un consumer reale del package

**Escluso:**
- Modifiche al core del framework (se serve cambiare qualcosa nel core, aprire CR separata)
- Firebase reale (lo showcase usa `dataArray` statici o un mock `DataProvider`)

### Architettura target

```
clients/showcase/
  vite.config.mts        ← build Vite del client showcase
  src/
    index.tsx           ← <App> entry point, zero routing custom
    conf/
      menu.ts           ← menuConfig con voci per ogni sezione
    layouts/
      ShowcaseLayout.tsx  ← LayoutDefault wrapper con Topbar e ThemePanel
    pages/
      components/       ← una pagina per componente (Alert, Badge, Card, ...)
      providers/        ← demo configurazione provider
      theme/            ← pannello tema con live CSS variables
      grid/             ← Grid CRUD demo con dataArray
      form/             ← Form demo con schema
    globals.css         ← solo @import tailwindcss + @theme inline (niente layout custom)
  tsconfig.json         ← paths per react-firestrap (invariato)
```

### Decisione bundler

Lo showcase oggi usa **Vite**. La motivazione originaria di questa CR resta valida, ma il percorso tecnico e' stato assorbito da CR-016:
- gli script effettivi del client buildano via `vite`
- l'entry consumer resta `src/index.tsx`
- il client continua a validare l'uso reale del package, ma senza dipendere da una toolchain webpack dedicata

La scelta del bundler resta un dettaglio di tooling del client, non un'API del framework. Non condiziona la dimostrazione dei pattern react-firestrap.

### Checklist

#### Setup
- [ ] Creare branch `modernize/cr-012-showcase-native`
- [ ] Rimuovere il routing custom da `App.tsx` dello showcase
- [ ] Adottare `<App>` di react-firestrap come entry point
- [ ] Definire `menuConfig` in `src/conf/menu.ts` con tutte le sezioni del catalogo

#### Layout
- [ ] Implementare `ShowcaseLayout.tsx` usando `LayoutDefault` (o il wrapper minimo equivalente)
- [ ] Integrare `Topbar` e `ThemePanel` nel layout custom
- [ ] Verificare dark mode, responsive, z-index sidebar

#### Pagine componenti
- [ ] `AlertPage` — usa `<Alert>` di react-firestrap, mostra tutte le varianti
- [ ] `BadgePage` — usa `<Badge>` di react-firestrap
- [ ] `CardPage` — usa `<Card>` di react-firestrap
- [ ] `ButtonPage` — usa `<LoadingButton>`, `<ActionButton>` di react-firestrap
- [ ] `ModalPage` — usa `<Modal>`, `<ModalYesNo>`, `<ModalOk>` con tutte le posizioni
- [ ] `InputPage` — usa `<Input>` con tutti gli `inputType`
- [ ] `SelectPage` — usa `<Select>`, `<Select.Autocomplete>`, `<Select.Checklist>`
- [ ] `UploadPage` — usa `<Upload>`, `<Upload.Image>`, `<Upload.Document>`
- [ ] `TablePage` — usa `<Grid type="table">` con `dataArray` statico
- [ ] `GalleryPage` — usa `<Grid type="gallery">` con `dataArray` statico

#### Pagine avanzate
- [ ] `FormPage` — Form standalone con schema reale, `onLoad`, `onSave`, `onFinally`
- [ ] `GridCrudPage` — Grid con `allowedActions`, `modal`, `groupBy`, `pagination`
- [ ] `ProvidersPage` — Descrive e dimostra la configurazione dei provider
- [ ] `ThemePage` — Live CSS variables con `ThemePanel` integrato

#### Qualità
- [ ] Zero classi Bootstrap scritte a mano nelle pagine (tutto passa dai componenti)
- [ ] Nessun routing custom (tutto gestito da `<App>` e `menuConfig`)
- [ ] TypeScript senza errori (`tsc --noEmit` pulito)
- [ ] Test visivo completo: light/dark, tutti i preset tema, tutte le icon library
- [ ] Aggiornare `docs/CHANGE_REQUESTS.md` — stato CR-007 e CR-012 a ✅

### Stato verificato al 2026-05-27

Questa CR non e' piu' un refactor "webpack-first": il risultato ricercato esiste gia' in larga parte nello showcase attuale, ma attraverso la migrazione Vite di CR-016.

Stato reale:
- `<App>` e `menuConfig` sono gia' il centro dello showcase attuale.
- `clients/showcase/src/index.tsx`, `src/conf/menu.ts` e `src/layouts/ShowcaseLayout.tsx` esistono e buildano.
- Resta aperta come CR di completamento qualitativo: eliminare gli stub residui e sostituirli con demo native o pagine esplicitamente oneste sullo stato reale dei provider.

---

## CR-013 — Icon provider system

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-004  

### Motivazione

Il sistema di icone precedente usava classi Bootstrap (`<i className="bi-...">`) con risoluzione attraverso il tema. Non aveva nessuna astrazione portabile: cambiare libreria di icone significava modificare ogni componente.

La modernizzazione CR-004 (Tailwind) richiede SVG-based icons. La scelta della libreria (Lucide, Phosphor, Heroicons...) deve essere una decisione dell'app consumer, non della libreria, esattamente come avviene per DataProvider e StorageProvider.

### Principio di design: convention over configuration

Per evitare la mappatura manuale di ogni icona, il provider usa **auto-risoluzione PascalCase**:

```
"arrow-right"   → ArrowRight   ✓  (auto)
"check-circle"  → CheckCircle  ✓  (auto)
"sun"           → Sun          ✓  (auto)
```

Solo i nomi che **divergono per convenzione** tra librerie entrano nell'alias map (~10-15 per libreria, non 200+).

### Scope

#### Library (`src/`)

```
src/providers/icon/
  IconProvider.ts           ← interface: id, resolve(name)
  IconProviderContext.tsx   ← React Context + useIconProvider() hook
  IconProvider             ← wrapper componente
  LucideIconProvider.tsx    ← impl Lucide: auto-PascalCase + alias map
  PhosphorIconProvider.tsx  ← impl Phosphor: auto-PascalCase + alias map + weight
  index.ts                  ← barrel export

src/components/ui/Icon.tsx  ← riscritto: usa useIconProvider(), props: name, size, className, provider?
src/App.tsx                 ← aggiunto iconProvider?: IconProviderAdapter prop → MaybeIconProvider wrapper
src/index.ts                ← export dei nuovi tipi e classi
package.json                ← lucide-react e @phosphor-icons/react come optionalPeerDependencies + devDependencies
```

#### Showcase (`clients/showcase/`)

```
src/context/ThemeContext.tsx  ← aggiunto iconLibraryId state + setIconLibrary() + IconProvider wrapper
src/components/Icon.tsx       ← semplificato: re-export da react-firestrap (rimosse map locali)
src/components/ThemePanel.tsx ← usa setIconLibrary() da ThemeContext invece di setIconLibrary() locale
src/pages/docs/Icons.tsx      ← NUOVA pagina documentazione completa
src/conf/menu.ts              ← aggiunta voce /docs/icons
```

### Architettura

```
ShowcaseThemeProvider (stato iconProvider)
  └── IconProvider (context)
        └── App
              └── Icon name="search"
                    └── useIconProvider() → provider.resolve("search") → <Search size={16} />
```

Il consumer sceglie il provider una volta sola. Tutto il codice consumer usa `<Icon name="...">` senza mai importare dalla libreria specifica.

### PhosphorIconProvider — feature weight

Phosphor supporta 6 pesi (thin, light, regular, bold, fill, duotone). Si passa al costruttore:

```ts
new PhosphorIconProvider('bold')   // tutti i componenti dell'app avranno icone bold
new PhosphorIconProvider('fill')   // icone filled
```

Il PhosphorIconProvider fa caching dei componenti wrappati per evitare re-render.

### Provider custom

```ts
import type { IconProviderAdapter, IconComponentProps } from '@llmnative/react';

export class HeroIconProvider implements IconProviderAdapter {
    readonly id = 'heroicons';
    resolve(name: string) {
        const key = toPascalCase(name) + 'Icon';
        return (HeroIcons as any)[key] ?? null;
    }
}
```

### Checklist

- [x] Creare `src/providers/icon/IconProvider.ts`
- [x] Creare `src/providers/icon/LucideIconProvider.tsx`
- [x] Creare `src/providers/icon/PhosphorIconProvider.tsx`
- [x] Creare `src/providers/icon/IconProviderContext.tsx`
- [x] Creare `src/providers/icon/index.ts`
- [x] Riscrivere `src/components/ui/Icon.tsx`
- [x] Aggiornare `src/App.tsx` — prop `iconProvider` + `MaybeIconProvider`
- [x] Aggiornare `src/index.ts` — export nuovi tipi
- [x] Aggiornare `package.json` — optionalPeerDependencies + devDependencies
- [x] Aggiornare `clients/showcase/src/context/ThemeContext.tsx`
- [x] Semplificare `clients/showcase/src/components/Icon.tsx`
- [x] Aggiornare `clients/showcase/src/components/ThemePanel.tsx`
- [x] Creare `clients/showcase/src/pages/docs/Icons.tsx`
- [x] Aggiornare `clients/showcase/src/conf/menu.ts`
- [x] Rebuild libreria (`npm run build`) — verificare zero errori TypeScript
- [x] Test visivo showcase: switch Lucide ↔ Phosphor, tutti i pesi Phosphor *(coperto da ThemePanel showcase + CR-017 acceptance; visual regression profonda resta in CR-007)*
- [x] Aggiornare `CLAUDE.md` con il pattern IconProvider

---

## CR-014 — Raffinazione componenti — props e comportamenti

**Stato:** 🔄 in progress  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-007 (serve la showcase per avere visibilità su ogni componente)  
**Stima:** ongoing — affrontata per componente dopo CR-007 completa  
**Breaking change:** Potenziale — props rinominate o tipi più stretti

### Motivazione

Durante lo sviluppo della showcase (CR-007) è emerso che diversi componenti hanno props non dichiarate nel tipo, comportamenti impliciti non documentati, o mancano di varianti già usate internamente ma non esposte all'esterno. La showcase serve da "specchio": ogni sezione di demo rivela cosa manca o è inconsistente nell'API pubblica.

Questa CR è un **contenitore evolutivo**: non ha una deadline fissa, ma raccoglie tutto il debito di API che emerge man mano che la showcase viene completata e i test (CR-006) vengono scritti.

### Scope

Per ogni componente censito, verificare e correggere:

1. **Completezza dei tipi** — tutte le props usabili devono essere dichiarate nell'interfaccia TypeScript esportata
2. **Documentazione inline** — JSDoc minimo sulle props non ovvie
3. **Comportamenti impliciti** — es. `updatable` di Input, `optionEmpty` di Select, `setPrimaryKey` di Form: vanno testati e documentati
4. **Consistenza naming** — verificare che le props seguano una convenzione uniforme tra componenti (es. `wrapClass` vs `className`, `label` vs `title`)
5. **Default sensati** — props opzionali con default ragionevoli invece di `undefined` silenzioso

### Componenti da rivedere (censimento iniziale)

| Componente | Issue noti | Priorità |
|------------|-----------|----------|
| `Input` | `type` vs `inputType` usati in modo inconsistente nella codebase consumer | Alta |
| `Select` | `placeholder` non esposto su `SelectProps` (solo su `AutocompleteProps`) | Alta |
| `Select` | `db` prop usa `path` come nel DataProvider; alias legacy rimosso | Done |
| `Form` | `aspect="none"` non valido (solo `"card" \| "empty"`) — manca un terzo valore o il bare layout | Media |
| `Grid` | `pagination.perPage` non esiste — si usa `limit` ma la docs dice `perPage` | Alta |
| `Grid` | `groupBy` non testato nella showcase | Media |
| `Modal` | `footerClose` prop aggiunta ma non nei tipi esportati | Bassa |
| `Icon` | prop unica `name`; la prop `icon` e' stata rimossa dal componente `Icon` | Done |

### Processo

Per ogni componente: aprire un sotto-task nella checklist, aggiornare il tipo, aggiornare la showcase, aggiornare i test (CR-006).

### Interventi completati (2026-05-12)

**Badge — overlay mode:**
`Badge` ora supporta due modalità distinte in base al tipo di `children`:
- `children` = stringa/numero → badge inline (comportamento precedente invariato)
- `children` = React element → modalità overlay: il badge si posiziona sull'elemento figlio
  - `pre` → badge top-left con label
  - `post` → badge top-right con label
  - nessuno dei due → pallino indicatore top-right
  - background solido (non trasparente) via classe `.badge-overlay` + `bg-{type}`

**Select.Autocomplete — creatable:**
Aggiunta prop `creatable?: boolean` e callback `onCreate?: (value: string) => Promise<void> | void`.
Premere Enter su un valore non presente in lista crea l'opzione con aggiornamento ottimistico locale (l'utente vede subito il chip, `onCreate` viene eseguito in background).

**Select.Autocomplete — bug fix disabled:**
Rimossa logica errata `disabled={disabled || (!updatable && !isEmpty(value))}` che disabilitava l'input quando il form aveva `defaultValues`. Ora usa semplicemente `disabled={disabled}`.

**Form — prop `onChange`:**
Aggiunta prop `onChange?: (record: RecordProps) => void` che notifica il consumer ad ogni cambiamento del record. Usata dalla Playground per mostrare il JSON del record in tempo reale.

**Form — fix reset su prop change:**
`useEffect([defaultValues])` si riattivava ad ogni render perché `defaultValues` è un oggetto (riferimento nuovo ad ogni render). Risolto usando `JSON.stringify(defaultValues)` come dipendenza per un confronto deep.

**Showcase Playground — layout e funzionalità:**
- Preview e JSON accordion sempre visibili; solo la sezione props scorre
- Accordion collassabile per la preview e per il JSON del record form
- Flag `showFormRecord` in `PlaygroundConfig` per abilitare/disabilitare l'accordion JSON (Alert/Badge non ne hanno bisogno)
- Dimensione modale minima `md` (rimosso `sm`)
- Prop `name` aggiunta come control editabile in tutti i playground di field

### Checklist

- [ ] Audit completo di tutti i componenti in `src/components/ui/` e `src/components/ui/fields/`
- [ ] Fix `Input`: chiarire `type` vs deprecato `inputType`
- [ ] Fix `Select`: esporre `placeholder` su `SelectProps` o documentare perché non c'è
- [x] Fix `Select`: allineare naming a `db.path` e rimuovere l'alias legacy
- [ ] Fix `Form`: aggiungere `aspect="none"` o rinominare la variante bare
- [ ] Fix `Grid`: rinominare `pagination.limit` → `pagination.perPage` (o viceversa, con alias)
- [ ] Fix `Modal`: aggiungere `footerClose` ai tipi esportati
- [x] Fix `Icon`: rimuovere la prop `icon` dal componente `Icon` e migrare gli usi interni a `name`
- [x] Fix `Badge`: aggiungere overlay mode con `pre`/`post`/dot
- [x] Fix `Select.Autocomplete`: aggiungere `creatable` + `onCreate`
- [x] Fix `Select.Autocomplete`: bug `disabled` su form con `defaultValues`
- [x] Fix `Form`: aggiungere `onChange` prop
- [x] Fix `Form`: `useEffect` con `JSON.stringify(defaultValues)` per evitare reset spurio
- [ ] Aggiornare showcase per ogni fix rimanente — le pagine di demo diventano smoke test visivi
- [ ] Aggiornare `CLAUDE.md` con le API corrette dopo ogni fix

### Stato verificato al 2026-05-27

Avanzamenti concreti visibili oggi in codebase:
- Showcase molto piu' ampia, utile come smoke test visivo dell'API pubblica.
- Pagine dedicate per `Buttons`, `Auth`, `Notifications`, `GridArray`, `GridDB`, `Prompt`, `Autocomplete`, `Checklist`, `Image`, `ImageAvatar`, `LayoutBuilder`.
- Copertura test rafforzata su `Grid`, `Table`, `Modal`, `Dropdown`, `Buttons`, `Badge`, `AuthButton`.

Gap ancora coerenti con la CR:
- audit completo delle API pubbliche non terminato
- `Prompt` resta senza test dedicati
- restano da riallineare alcune docs/props su `Input`, `Grid`, `Modal` e variante bare di `Form`

---

## CR-015 — Vite toolchain framework + scaffolding

**Stato:** ✅ done
**Branch:** `modernize/cr-015-vite-toolchain`
**Priorità:** Alta
**Dipende da:** CR-003, CR-004, CR-006
**Stima:** 3–5 giorni
**Breaking change:** Potenziale — cambia la toolchain di build e lo scaffold generato, non le API React pubbliche

### Motivazione

La modernizzazione del framework non deve fermarsi ai componenti e ai provider. La libreria e lo showcase sono stati riallineati a Vite, lo stack usato per sviluppo rapido, build prevedibili e setup minimale.

Portare react-firestrap a Vite rende coerenti framework, consumer e scaffolding: un nuovo progetto generato dal CLI deve nascere già con la stessa toolchain che usiamo per validare il framework stesso.

### Obiettivo

Migrare la toolchain del framework a un modello Vite-first:

- build libreria con Vite library mode, oppure alternativa leggera equivalente se motivata (`tsup` solo se produce un risultato più pulito)
- output `dist/` compatibile con gli export pubblici attuali
- CSS bundle `dist/index.css` mantenuto
- dichiarazioni TypeScript `.d.ts` generate e pubblicate
- test Vitest invariati o semplificati
- CLI/scaffolding aggiornato per generare app Vite + React + Tailwind + provider configuration

### Scope

**Incluso:**
- Aggiungere `vite.config.mts` per la libreria root
- Rimuovere `webpack.config.js` dalla build principale quando Vite produce output equivalente
- Aggiornare `package.json` root: script `build`, `build:dev`, `watch/dev`, export ESM/CJS se necessari
- Verificare peer dependencies e externalization di React, ReactDOM, React Router, Firebase, icon libraries
- Mantenere `src/index.ts` come entry pubblica della libreria
- Aggiornare generazione CSS Tailwind in `dist/index.css`
- Aggiornare `bin/cli.js` e `scripts/cli/*` per scaffold Vite-first
- Lo scaffold deve creare `src/index.tsx`, `src/conf/`, `src/layouts/`, `src/pages/`, `src/sections/`, `src/components/`, `src/data/`, `src/styles/globals.css`
- Lo scaffold deve configurare provider selezionati: Firebase, Supabase, mock/custom
- Aggiornare `README.md`, `CLAUDE.md`, `docs/patterns.md`, `docs/architecture.md`

**Escluso:**
- Riscrivere lo showcase: viene fatto in CR-016
- Cambiare API pubbliche di `App`, `Form`, `Grid`, providers o componenti UI
- Migrare i temi legacy `default`, `flat`, `cyber`, `empty` oltre quanto serve per buildare

### Architettura target root

```
react-firestrap/
  vite.config.mts             ← build libreria Vite-first
  tsconfig.json               ← strict + declarations
  package.json                ← exports coerenti con dist ESM/CSS/types
  src/
    index.ts                  ← public entry invariata
    globals.css               ← Tailwind/theme source
  scripts/cli/
    setup-project.js          ← genera consumer Vite
    templates/                ← se necessario, template scaffold
```

### Scaffold target

```
my-app/
  index.html
  vite.config.ts
  package.json
  src/
    index.tsx                 ← render <App>
    conf/
      app.ts                  - App wiring: provider, icone, tema
      menu.ts                 - menuConfig
    layouts/
      AppLayout.tsx           - LayoutDefault consumer
    pages/
      home/
        HomePage.tsx
    sections/
      home/
        TasksSection.tsx
    components/
      EmptyState.tsx
      PageHeader.tsx
    data/
      mockData.ts
    styles/
      globals.css             - import CSS app + eventuali override
```

### Checklist

- [x] Audit output webpack attuale: file prodotti, CSS, declarations, externals, export map
- [x] Aggiungere `vite.config.mts` root in library mode
- [x] Configurare externals per React, ReactDOM, React Router, Firebase, Lucide, Phosphor
- [x] Verificare generazione `dist/index.js` o decidere nuova export map ESM/CJS
- [x] Verificare generazione `dist/index.css`
- [x] Verificare generazione `dist/types`
- [x] Aggiornare `package.json` root: `main`, `module`, `types`, `style`, `exports`
- [x] Aggiornare script root: `build`, `build:dev`, `watch:dev`
- [x] Rimuovere il comando webpack temporaneo dopo la verifica dell'output Vite
- [x] Eseguire build Vite e confrontare API pubbliche esportate
- [x] Eseguire `npm run test`
- [x] Aggiornare CLI scaffolding a Vite-first
- [x] Aggiungere prompt provider nello scaffolding: Firebase / Supabase / Mock / Custom
- [x] Generare `src/conf/menu.ts` nello scaffold
- [x] Generare `src/index.tsx` con `<App>` e provider config
- [x] Generare `vite.config.ts` consumer con alias/dedupe minimi
- [x] Aggiornare docs e README con Vite come percorso raccomandato
- [x] Aggiornare `CLAUDE.md` con la nuova toolchain
- [x] Aggiornare `CHANGELOG.md`

### Criteri di accettazione

- [x] `npm run build` root passa con Vite
- [x] `npm run test` passa
- [x] `npm pack --dry-run` contiene `dist`, types, CSS, CLI e themes previsti
- [x] Uno scaffold generato installa dipendenze e parte con `npm run dev`
- [x] Un consumer Vite importa `@llmnative/react` senza doppia istanza React
- [x] Gli import CSS documentati funzionano: `import '@llmnative/react/dist/index.css'`

---

## CR-016 — Showcase Vite + scaffold-first

**Stato:** ✅ done
**Branch:** `modernize/cr-016-showcase-vite`
**Priorità:** Alta
**Dipende da:** CR-012, CR-015
**Stima:** 2–4 giorni
**Breaking change:** No per la libreria; cambia la struttura interna di `clients/showcase`

### Motivazione

Dopo CR-015, lo showcase deve diventare il primo consumer reale dello scaffold Vite generato dal framework. Non deve essere un client speciale mantenuto a mano: deve dimostrare che un'app nata dallo scaffolding ufficiale può documentare, validare e usare react-firestrap in modo completo.

Questo chiude il cerchio del refactoring: il framework usa Vite, lo scaffolding genera Vite, e lo showcase viene ricostruito con quella stessa struttura.

### Obiettivo

Ricostruire `clients/showcase/` come app Vite scaffold-first:

- struttura uguale o quasi uguale a quella generata dal CLI aggiornato in CR-015
- entry `src/index.tsx`
- menu canonico in `src/conf/menu.ts`
- layout custom in `src/layouts/ShowcaseLayout.tsx`
- providers mock/offline configurati come in un consumer reale
- pagine componenti, provider, temi e docs migrate senza routing custom parallelo

### Scope

**Incluso:**
- Reintrodurre Vite nello showcase solo dopo CR-015
- Sostituire `webpack.config.js` con `vite.config.mts`
- Aggiornare `package.json` showcase: `dev`, `build`, `preview`
- Usare lo scaffold generato come base strutturale
- Mantenere `<App>` di react-firestrap come entry applicativa
- Mantenere `src/conf/menu.ts` come unica fonte del menu
- Collegare `ThemePanel`, App `themeProvider`, App `iconProvider` e dark mode
- Usare `MockDataProvider` per demo offline riproducibili
- Validare tutte le pagine già presenti

**Escluso:**
- Cambiare build root della libreria: già coperto da CR-015
- Aggiungere nuove API ai componenti: aprire/aggiornare CR-014 se emerge debito
- Deploy pubblico: può restare task CR-007 o CR separata

### Architettura target showcase

```
clients/showcase/
  index.html
  vite.config.mts
  package.json
  src/
    index.tsx                 ← render <App>
    globals.css
    conf/
      menu.ts                 ← menuConfig unico
    layout/
      ShowcaseLayout.tsx
    components/
      Topbar.tsx
      Sidebar.tsx
      ThemePanel.tsx
      PageLayout.tsx
      Section.tsx
    pages/
      docs/
      components/
      providers/
      examples/
      theme/
```

### Checklist

- [x] Generare una nuova app showcase da CLI CR-015 o allineare manualmente alla struttura prodotta
- [x] Aggiungere `vite.config.mts` showcase con dedupe React/ReactDOM/React Router
- [x] Aggiornare `package.json` showcase: `dev`, `build`, `preview`
- [x] Rimuovere `webpack.config.js` e dipendenze webpack dallo showcase
- [x] Mantenere `src/index.tsx` come entry unica
- [x] Mantenere `src/conf/menu.ts` come menu unico
- [x] Verificare import `react-firestrap/dist/index.css`
- [x] Configurare provider mock/offline per Form, Grid, Select e pagine Providers
- [x] Verificare tema App-managed: light/dark, preset, CSS variables
- [x] Verificare `IconProvider`: Lucide/Phosphor switch e weight Phosphor
- [x] Migrare pagine docs già coperte da CR-015/CR-017; lasciare gli altri stub alle CR dedicate
- [x] Aggiornare pagine docs Installation/Scaffolding per mostrare Vite-first
- [x] Separare Introduction e Quick start nella sidebar docs showcase
- [x] Eseguire `npm run build` nello showcase
- [x] Eseguire `npm run dev` e smoke test manuale
- [x] Documentare differenze rispetto al precedente showcase webpack
- [x] Aggiornare `CHANGE_REQUESTS.md`, `README.md`, `CLAUDE.md`

### Criteri di accettazione

- [x] `clients/showcase npm run build` passa con Vite
- [x] `clients/showcase npm run dev` serve l'app senza doppia istanza React
- [x] Navigazione gestita da `<App>` + `menuConfig`, nessun router custom parallelo
- [x] Tutte le pagine principali dello showcase renderizzano
- [x] ThemePanel modifica davvero CSS variables e dark mode
- [x] Switch icone Lucide/Phosphor visibile nello showcase
- [x] Lo showcase ha la stessa struttura dello scaffold ufficiale CR-015

---

## CR-017 — App-managed theme + icon registries

**Stato:** ✅ done
**Branch:** `modernize/cr-017-app-theme-icon-registries`
**Priorità:** Alta
**Dipende da:** CR-004, CR-013
**Stima:** 2–4 giorni
**Breaking change:** No all'epoca della CR; aggiornamento 2026-05-18: `importTheme` e' stato rimosso a favore di `themeProvider`.

### Motivazione

`App` è già l'orchestratore dei provider principali: data, storage, auth, email e icon provider statico. Tema e icone devono seguire lo stesso principio: il framework offre default sensati, ma il consumer può scegliere, estendere o sovrascrivere tutto da un solo punto.

Oggi lo showcase mantiene un `ThemeContext` locale che gestisce light/dark, preset colore, radius e icon library. Questa logica è utile, ma non deve vivere solo nello showcase: deve diventare una funzionalità del framework, esposta da `App` e controllabile con hook pubblici.

### API target

Uso semplice:

```tsx
<App iconProvider="phosphor" themeProvider="cyber" />
```

Equivalente esplicito:

```tsx
<App
  iconProvider={{ default: 'phosphor' }}
  themeProvider={{ theme: 'cyber' }}
/>
```

Uso avanzato:

```tsx
<App
  iconProvider={{
    default: 'heroicons',
    providers: {
      heroicons: new HeroIconProvider(),
    },
    aliases: {
      delete: 'trash',
      edit: 'pencil',
    },
  }}
  themeProvider={{
    defaultMode: 'dark',
    theme: 'brand',
    themes: {
      brand: {
        preset: {
          mode: 'dark',
          colors: { primary: '346.8 77.2% 49.8%' },
          radius: 0.75,
        },
        motion: defaultMotion,
        components: {
          ...defaultComponents,
          ActionButton: { ...defaultComponents.ActionButton, className: 'btn-primary font-semibold' },
          Card: { ...defaultComponents.Card, className: 'shadow-sm' },
        },
      },
    },
    themeOverride: {
      Modal: { size: 'xl' },
    },
  }}
/>
```

### Regole icon registry

Il framework espone provider built-in:

```ts
{
  lucide: new LucideIconProvider(),
  phosphor: new PhosphorIconProvider(),
}
```

`App.iconProvider` accetta:

```ts
type AppIconProviderConfig =
  | string
  | {
      default?: string;
      providers?: Record<string, IconProviderAdapter>;
      aliases?: Record<string, string>;
    };
```

Comportamento:

- `undefined` usa `lucide`
- stringa usa quel valore come provider default
- oggetto fa merge con i provider built-in
- `providers` custom aggiungono o sovrascrivono provider built-in
- `aliases` custom si fondono con alias default
- se il provider richiesto non esiste, fallback a `lucide` con warning in development

### Regole theme registry

Il framework espone temi built-in:

```ts
{
  default: { mode: 'light', primary: '221.2 83.2% 53.3%', radius: 0.5 },
  flat:    { mode: 'light', primary: '215 25% 27%',        radius: 0.125 },
  cyber:   { mode: 'dark',  primary: '160 84% 39%',        radius: 0 },
}
```

`App.themeProvider` accetta:

```ts
type AppThemeProviderConfig =
  | string
  | ThemeDefinition
  | {
      defaultMode?: 'light' | 'dark' | 'system';
      theme?: string;
      themes?: Record<string, ThemeDefinition>;
      themeOverride?: ThemeConfig;
    };
```

Comportamento:

- `undefined` usa tema `default` e mode `light`
- stringa usa quel valore come `theme`
- `ThemeDefinition` diretto diventa il tema attivo con id `custom`
- oggetto fa merge con i temi built-in
- `themes` custom aggiungono o sovrascrivono temi self-contained built-in
- `themeOverride` e' un override globale applicato dopo il tema selezionato
- applica `.dark` su `document.documentElement`
- applica CSS variables principali, almeno `--rf-primary`, `--rf-primary-foreground`, `--radius`
- `importTheme` non fa piu' parte della API pubblica: usare `themeProvider={brand}` o `themeProvider={{ themes: { brand }, theme: 'brand' }}`

### Hook pubblici

```ts
const theme = useThemeController();

theme.mode;
theme.theme;
theme.primary;
theme.radius;
theme.setMode('dark');
theme.applyTheme('cyber');
theme.setPrimary('346.8 77.2% 49.8%');
theme.setRadius(0.75);
```

```ts
const icons = useIconController();

icons.providerId;
icons.setProvider('phosphor');
icons.registerProvider('heroicons', new HeroIconProvider());
```

### Scope

**Incluso:**
- Estendere `src/Theme.tsx` con theme registry, temi built-in e controller hook
- Estendere `src/App.tsx` con `themeProvider?: AppThemeProviderConfig`
- Evolvere `iconProvider` in `App` per accettare stringa o config avanzata
- Aggiungere un controller per cambiare icon provider a runtime
- Esportare tipi e hook da `src/index.ts`
- Migrare `clients/showcase` a usare `App iconProvider=... themeProvider=...`
- Rimuovere `IconProvider` dal `ShowcaseThemeProvider`
- Ridurre `clients/showcase/src/context/ThemeContext.tsx` a state UI locale, o eliminarlo se `ThemePanel` può usare solo hook framework
- Aggiornare `ThemePanel` per usare `useThemeController()` e `useIconController()`
- Aggiornare docs e `CLAUDE.md`

**Escluso:**
- Migrazione Vite dello showcase: CR-016
- Conversione dei temi legacy completi: CR-008/009/010/011
- Redesign visuale dei componenti: CR-014

### Checklist

- [x] Definire tipi `AppIconProviderConfig`, `AppThemeProviderConfig`, `ThemePresetConfig`
- [x] Aggiungere registry icon built-in: `lucide`, `phosphor`
- [x] Aggiornare `App.iconProvider` per accettare stringa o config
- [x] Aggiungere `IconRegistryProvider` o estendere `IconProviderContext`
- [x] Aggiungere `useIconController()`
- [x] Aggiungere registry temi built-in: `default`, `flat`, `cyber`
- [x] Aggiornare `ThemeProvider` per accettare config diretta tramite `themeProvider`
- [x] Aggiungere `useThemeController()`
- [x] Applicare `.dark` e CSS variables dal provider framework
- [x] Mantenere backward compatibility di `useTheme(section)`
- [x] Rimuovere `importTheme` legacy e convergere su `themeProvider`
- [x] Aggiornare `src/index.ts` con export tipi/hook
- [x] Aggiornare `clients/showcase/src/index.tsx` con `iconProvider="lucide"` e `themeProvider="default"` o tema desiderato
- [x] Aggiornare `ThemePanel` per usare hook framework
- [x] Rimuovere provider icon/theme duplicati dallo showcase
- [x] Aggiornare pagina docs Icons
- [x] Aggiungere pagina docs Theme o completare stub esistente
- [x] Aggiornare `CLAUDE.md`
- [x] Aggiungere test unitari per resolver string/object config
- [x] Eseguire `npm run build`
- [x] Eseguire `npm run test`
- [x] Eseguire `clients/showcase npm run build`

### Criteri di accettazione

- [x] `<App />` usa Lucide + tema `default`
- [x] `<App iconProvider="phosphor" />` cambia provider icone senza configurazione extra
- [x] `<App themeProvider="cyber" />` applica tema `cyber`
- [x] Config avanzate aggiungono provider/temi custom senza perdere quelli built-in
- [x] `ThemePanel` dello showcase controlla tema e icone tramite hook del framework
- [x] Nessun `IconProvider` custom è necessario nello showcase
- [x] `themeProvider={brand}` accetta un `ThemeDefinition` diretto
- [x] Backward compatibility: `useTheme(section)` continua a restituire il runtime theme completo

---

## CR-018 — MarkdownReader component

**Stato:** ✅ done  
**Branch:** `modernize/cr-018-markdown-reader`  
**Priorità:** Alta  
**Dipende da:** CR-004, CR-017  
**Breaking change:** No

### Motivazione

La documentazione dello showcase e la documentazione AI-first devono convergere verso una sorgente leggibile, versionabile e riusabile. Prima di migrare lo showcase a contenuti Markdown, serve un componente pubblico della libreria che sappia renderizzare Markdown in modo coerente con il tema react-firestrap.

Non vogliamo reinventare il parser Markdown. Il componente deve orchestrare librerie mature e già adottate dall'ecosistema React/Markdown.

### Scelta tecnica proposta

Usare una pipeline basata su:

- `react-markdown` per rendere Markdown come React elements, sfruttando unified/remark/rehype.
- `remark-gfm` per GitHub Flavored Markdown: tabelle, task list, strikethrough.
- `rehype-slug` per generare id sugli heading.
- `rehype-autolink-headings` per link/anchor sugli heading.
- `rehype-sanitize` o una policy equivalente se abilitiamo HTML raw.

Frontmatter e caricamento file non fanno parte del componente base: saranno gestiti in CR-019 con `gray-matter` o parser equivalente lato showcase/build.

### API target

```tsx
import { MarkdownReader } from '@llmnative/react';

<MarkdownReader
  content={markdown}
  head={{
    title: 'Quick start',
    description: 'Create a Vite consumer app with react-firestrap.',
  }}
  components={{
    a: MarkdownLink,
  }}
  onNavigateInternal={(href) => navigate(href)}
/>
```

### Scope

**Incluso:**
- Creare `src/components/widgets/MarkdownReader.tsx` o posizione equivalente nello stesso livello pubblico di `Form` e `Grid`.
- Esportare `MarkdownReader` da `src/components/index.ts` e `src/index.ts`.
- Supportare Markdown base e GFM.
- Mappare elementi Markdown a componenti/stili react-firestrap: heading, paragraph, link, list, table, blockquote, code block.
- Code block con pulsante copia.
- Headings con anchor link.
- Link interni intercettabili via callback.
- Metadata HTML head opzionali tramite `head`.
- Supporto a `className`, `wrapClass` e override componenti.
- Dark mode/theme compatibility tramite CSS variables e classi del framework.
- Test component con React Testing Library.

**Escluso:**
- Lettura automatica da filesystem o URL.
- Parsing frontmatter.
- Generazione menu/route da Markdown.
- MDX e componenti React inline dentro Markdown.

### Checklist

- [x] Installare dipendenze mature: `react-markdown`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`
- [x] Valutare `rehype-sanitize` se abilitiamo HTML raw
- [x] Creare componente `MarkdownReader`
- [x] Creare componente interno `MarkdownCodeBlock` con copy-to-clipboard
- [x] Mappare `table` su styling coerente con `Table`
- [x] Mappare blockquote/callout su styling coerente con `Alert`
- [x] Implementare gestione link interni via `onNavigateInternal`
- [x] Aggiungere integrazione opzionale con head dinamico (`head.title`, `head.description`, `head.meta`)
- [x] Aggiungere props e tipi pubblici
- [x] Esportare da barrel files
- [x] Aggiungere pagina showcase componente o sezione docs dimostrativa
- [x] Aggiungere test component
- [x] Eseguire `npm run test`
- [x] Eseguire `npm run build`

### Criteri di accettazione

- [x] Un consumer può renderizzare una stringa Markdown con `<MarkdownReader content={...} />`
- [x] Tabelle, task list, link, heading e code block sono renderizzati correttamente
- [x] I link interni possono essere convertiti in navigazione React Router senza reload pagina
- [x] Un consumer puo' impostare `document.title` e meta description tramite `head`
- [x] I code block hanno copia negli appunti
- [x] Il componente segue tema e dark mode tramite CSS variables/classi correnti
- [x] Nessun parser Markdown custom viene mantenuto nel progetto

---

## CR-019 — Markdown-powered showcase docs

**Stato:** ✅ done  
**Branch:** `modernize/cr-019-markdown-showcase-docs`  
**Priorità:** Alta  
**Dipende da:** CR-018  
**Breaking change:** No per la libreria; cambia il modo in cui lo showcase alimenta le pagine docs

### Motivazione

Oggi la documentazione vive in due forme: file Markdown in `docs/` utili ad AI e maintainer, e pagine TSX nello showcase utili agli utenti finali. Questo crea duplicazione e rischio di divergenza.

L'obiettivo è avere una sorgente Markdown wiki-style che sia leggibile nel repo da AI e contributor, renderizzata nello showcase per end user, navigabile con link interni, ordinabile tramite frontmatter e compatibile con demo TSX interattive dove servono.

### Architettura target

```text
docs/
  index.md
  quick-start.md
  installation.md
  app-configuration.md
  menu-configuration.md
  providers.md
  patterns/
    grid.md
    form.md
    nested.md

clients/showcase/src/
  docs/
    manifest.ts          # generato o mantenuto da import.meta.glob
  pages/docs/
    MarkdownDocPage.tsx  # usa MarkdownReader
```

### Frontmatter target

```md
---
title: Quick start
group: Getting started
order: 30
path: /docs/quick-start
---

# Quick start

Create an app with:

~~~bash
npx ash create
~~~

See [Installation](./installation.md).
```

### Scope

**Incluso:**
- Definire convenzione frontmatter per docs wiki-style.
- Usare `gray-matter` o equivalente per leggere frontmatter.
- Caricare Markdown nello showcase con `import.meta.glob(..., { query: '?raw', import: 'default' })` o strategia Vite equivalente.
- Generare `menuConfig.docs` dai metadata Markdown.
- Renderizzare pagine Markdown con `MarkdownReader`.
- Riscrivere link relativi `.md` in route interne dello showcase.
- Supportare anchor heading.
- Mantenere pagine componenti live in TSX.
- Migrare docs testuali showcase: Introduction, Quick start, Installation, Create an app, App configuration, Routing & menu, Provider pattern, Theme system, Icon system, Core patterns.
- Documentare le convenzioni per AI e contributor.

**Escluso:**
- Convertire demo interattive componenti in Markdown.
- MDX.
- CMS esterno.

### Checklist

- [x] Scegliere struttura definitiva dei Markdown in `docs/`
- [x] Aggiungere frontmatter alle pagine Markdown interessate
- [x] Creare loader/manifest Markdown nello showcase
- [x] Creare `MarkdownDocPage`
- [x] Generare menu docs da frontmatter
- [x] Implementare riscrittura link wiki-style
- [x] Migrare Introduction e Quick start
- [x] Migrare Installation e Create an app
- [x] Migrare App configuration e Routing & menu
- [x] Migrare Provider/Theme/Icon docs testuali
- [x] Migrare Core patterns testuali
- [x] Aggiornare `CLAUDE.md` con regole docs Markdown
- [x] Aggiornare `docs/README.md` o equivalente con convenzioni contributor
- [x] Eseguire `clients/showcase npm run build`
- [x] Smoke test route docs e link interni

### Criteri di accettazione

- [x] Una modifica a un file Markdown in `docs/` si riflette nello showcase docs
- [x] La sidebar docs è generata dai metadata Markdown
- [x] I link relativi tra pagine Markdown navigano nello showcase senza reload
- [x] Le pagine sono ancora leggibili direttamente da AI e contributor nel repo
- [x] Le pagine interattive TSX continuano a funzionare come demo live

---

## CR-020 — Head management + declarative provider config

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-017, CR-019  
**Breaking change:** Sì, per la API di configurazione di `<App>`: i provider built-in ora si dichiarano sotto `providers`.

### Motivazione
La configurazione pubblica era diventata troppo frammentata: `firebaseConfig`, `oAuth2`, `dataProvider`, `storageProvider`, `authProvider`, `defaultProviders` e adapter istanziati dal consumer esponevano dettagli interni e aumentavano la curva di apprendimento. Inoltre il browser `<head>` non aveva una responsabilità centrale abbastanza strutturata.

### Scope
- Introdurre configurazione dichiarativa:

```tsx
<App
  providers={{
    firebase: { config: firebaseConfig },
    supabase: { config: supabaseConfig },
    google: { oAuth2: googleOAuth2 },
    mock: { data: mockData },
    services: {
      data: 'firebase',
      storage: 'supabase',
      auth: 'google',
    },
  }}
/>
```

- Spostare la config Firebase dentro `providers.firebase.config`.
- Tenere Google separato in `providers.google`, non annidato in Firebase.
- Lasciare gli adapter custom sotto `providers.custom`.
- Comporre config runtime e global vars con `RuntimeProvider`.
- Introdurre head management centralizzato con `HeadProvider` e hook dedicati:
  - `useHead`
  - `useDocumentHead`
  - `useSocialHead`
  - `useLanguageHead`
  - `usePaginationHead`
  - `useAssetsHead`
  - `usePwaHead`
  - `useSchemaOrgHead`
- Aggiornare `MarkdownReader` per impostare metadata pagina da Markdown frontmatter.
- Aggiornare scaffold, README, docs Markdown e showcase examples.

### Checklist
- [x] `AppProps` usa `providers?: AppProvidersConfig`.
- [x] Rimossi ingressi pubblici diretti `firebaseConfig`, `dataProvider`, `storageProvider`, `authProvider`, `emailProvider`, `defaultProviders`.
- [x] `providers.firebase`, `providers.supabase`, `providers.google`, `providers.gmail`, `providers.mock`, `providers.custom` registrano i servizi interni.
- [x] `providers.services` seleziona data/storage/auth/email.
- [x] `RuntimeProvider` compone `ConfigContext` e `GlobalProvider`.
- [x] `HeadProvider` genera `<head>` via JSX portal.
- [x] Aggiunta pagina `docs/head.md`.
- [x] Aggiornati README e docs operative.
- [x] Aggiornato `scripts/cli/setup-project.js`.
- [x] Verifica scaffold temporanea con `VITE_PROVIDER` e `<App providers={{ ... }}>`.

### Criteri di accettazione
- [x] `npm run test` passa.
- [x] `npm run build` passa.
- [x] `cd clients/showcase && npm run build` passa.
- [x] Lo scaffold generato non contiene piu' la vecchia API `dataProvider` / `firebaseConfig`.


---

## CR-021 — Use case templates

**Stato:** ✅ done  
**Data:** 2026-05-11  
**Priorità:** Media  
**Dipende da:** CR-005, CR-017  
**Breaking change:** No

### Motivazione

Lo scaffolding generava un'unica HomePage minimale uguale per tutti i tipi di progetto. I temi (`default`, `flat`, `cyber`) mescolavano preset colori e struttura pagine in un'unica cartella annidata, rendendo impossibile combinare liberamente tema visivo e tipo di app.

### Scope

1. **Separazione tema / template**: i preset colori estratti da `src/Theme.tsx` in `themes/default.ts`, `themes/flat.ts`, `themes/cyber.ts`. `src/Theme.tsx` importa da questi file invece di avere oggetti hardcoded.
2. **Eliminazione vecchia struttura `themes/*/src/`**: le cartelle annidate `themes/default/`, `themes/flat/`, `themes/cyber/`, `themes/empty/` rimosse.
3. **Nuova cartella `templates/`**: 5 template indipendenti, ciascuno con layout, sections, pages, conf/menu.ts, data/mockData.ts.
4. **CLI aggiornato**: aggiunta domanda `Which app template?` separata da `Which theme?`. Supporto flag `--theme=` e `--template=`.
5. **Docs aggiornate**: `docs/quick-start.md`, `docs/scaffolding.md`, `docs/theme.md`.

### Template disponibili

| Template | Pagine | Pattern showcase |
|----------|--------|-----------------|
| `blank` | Home con Grid tasks | Punto di partenza pulito |
| `crm` | Dashboard · Contacts · Companies · Deals | `groupBy`, Badge formatter, dot notation |
| `admin` | Overview · Users · Roles · Settings | Form singleton, `Select` con opzioni, `Upload.Image` |
| `inventory` | Overview · Products · Categories | `onLoad`/`onSave` price conversion, stock Badge |
| `project` | Overview · Projects · Tasks · Team | `groupBy` status, priority Badge, Repeat |

### Checklist

- [x] Creare `themes/default.ts`, `themes/flat.ts`, `themes/cyber.ts`
- [x] Aggiornare `src/Theme.tsx` — import da `../themes/` invece di oggetti inline
- [x] Rimuovere `themes/default/`, `themes/flat/`, `themes/cyber/`, `themes/empty/`
- [x] Creare `templates/blank/`
- [x] Creare `templates/crm/`
- [x] Creare `templates/admin/`
- [x] Creare `templates/inventory/`
- [x] Creare `templates/project/`
- [x] Aggiornare `scripts/cli/setup-project.js`
- [x] Aggiornare `docs/quick-start.md`
- [x] Aggiornare `docs/scaffolding.md`
- [x] Aggiornare `docs/theme.md`
- [x] `npm run build:dev` passa senza errori

---

## CR-022 — Bootstrap utility cleanup

**Stato:** ✅ done  
**Data:** 2026-05-12  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-004  
**Breaking change:** No (classi interne non pubbliche)

### Motivazione

CR-004 ha introdotto il compatibility layer Tailwind che ricrea le classi Bootstrap *named* (`.btn`, `.badge`, `.form-control`, ecc.). Tuttavia i componenti della libreria usavano ancora classi Bootstrap *utility* direttamente nel JSX (`d-flex`, `position-relative`, `align-items-center`, `ps-3`, `me-1`, ecc.). Questo creava una dipendenza implicita sul layer Bootstrap e rendeva il JSX inconsistente: alcune parti usavano Tailwind nativo, altre ancora Bootstrap utilities.

### Scope

Audit e migrazione di tutte le classi Bootstrap utility presenti nel JSX dei componenti `src/` verso il Tailwind nativo equivalente. Le classi *named* del compatibility layer (`.btn`, `.badge`, `.nav`, `.card`, ecc.) rimangono invariate — non sono Bootstrap utilities, sono contratti stilistici del compatibility layer.

### Mappatura principali

| Bootstrap utility | Tailwind nativo |
|-------------------|-----------------|
| `d-flex` | `flex` |
| `d-none` | `hidden` |
| `d-block` | `block` |
| `position-relative` | `relative` |
| `position-absolute` | `absolute` |
| `align-items-center` | `items-center` |
| `justify-content-end` | `justify-end` |
| `flex-column` | `flex-col` |
| `ps-N` / `pe-N` | `pl-N` / `pr-N` |
| `ms-N` / `me-N` | `ml-N` / `mr-N` |
| `w-100` / `h-100` | `w-full` / `h-full` |
| `start-0` / `end-0` | `left-0` / `right-0` |
| `border-start` | `border-l` |

### File migrati

- `src/components/blocks/`: Carousel, Notifications, Search
- `src/components/ui/`: Gallery, Loader, Modal, Pagination, Repeat, Tab, TabDynamic, Table
- `src/components/ui/fields/`: AssistantAI, Command, Crop, ImageUrl, Input, Prompt, Upload
- `src/components/widgets/`: ImageEditor, Prompt, TabDynamic
- `src/providers/auth/google/GoogleAuth.tsx`
- `src/providers/storage/dropbox.tsx`
- `src/App.tsx`, `src/Config.tsx`, `src/Theme.tsx`
- `src/pages/BlogPost.tsx`, `src/pages/NotFound.tsx`
- `clients/showcase/src/pages/components/PaginationPage.tsx`, `TabPage.tsx`

### Checklist

- [x] Audit con grep di tutte le classi Bootstrap utility nel JSX `src/`
- [x] Migrare tutti i file `src/components/`
- [x] Migrare tutti i file `src/providers/`
- [x] Migrare `src/App.tsx`, `src/Config.tsx`, `src/Theme.tsx`
- [x] Migrare `src/pages/`
- [x] Migrare `clients/showcase/src/pages/components/`
- [x] Correggere import stale (`integrations/ai` → `providers/ai`, `integrations/google/firedatabase` → `providers/data/DataProvider`)
- [x] Correggere prop `icon` → `name` su `<Icon>` nei file copiati
- [x] `npm run build:dev` passa senza errori

---

## CR-023 — Driver manifest + service registry

**Stato:** ✅ done  
**Data:** 2026-05-12  
**Branch:** `modernize`  
**Priorità:** Alta  
**Dipende da:** CR-002, CR-002b  
**Breaking change:** Sì — i nomi driver in `services` cambiano (vedi migrazione)

### Motivazione

Il sistema provider aveva due problemi strutturali:

1. **Ambiguità driver**: `services.data = 'firebase'` non distingue tra Firebase Realtime Database e Firestore. Firebase può esporre più driver per la stessa categoria di service.
2. **If-chain non estendibile**: `resolveProviderRegistries` in `App.tsx` conteneva una sequenza di `if (providers.firebase)`, `if (providers.supabase)`, ecc. Aggiungere un nuovo provider richiedeva sempre di modificare questa funzione.

### Soluzione

Ogni provider espone un **manifest** — una mappa `{ driverName → DriverDescriptor }` dove ogni descriptor dichiara:
- `service`: la categoria (`'data' | 'storage' | 'auth' | 'email'`)
- `create(cfg)`: factory che riceve la config del provider e restituisce l'adapter

`App.tsx` costruisce a startup un dizionario piatto `driverName → adapterInstance` con **un solo loop generico** su `PROVIDER_MANIFESTS`. La risoluzione di ogni service è O(1): `registry[services.data]`.

I provider utility (Dropbox, AI) non hanno una categoria di service — restano in `providers.*` e sono accessibili tramite i loro hook/utility dedicati.

### File

- `src/providers/manifest.ts` — **nuovo**: tipi `DriverDescriptor`, `DriverManifest`, `ServicesConfig`; manifest per firebase, google, supabase, mock; union types `DataDriverName`, `StorageDriverName`, `AuthDriverName`, `EmailDriverName`; `PROVIDER_MANIFESTS` (registry centrale)
- `src/App.tsx` — `resolveProviderRegistries` riscritto con loop generico; `AppProvidersConfig` aggiornato; `gmail?` rimosso (ora driver `gmail` sotto `google`)
- `src/index.ts` — re-export dei nuovi tipi da `providers/manifest`

### Nuovi nomi driver

| Categoria | Prima | Ora |
|-----------|-------|-----|
| data | `'firebase'` | `'dbRealtime'` |
| data | `'supabase'` | `'supabaseDb'` |
| data | `'mock'` | `'mock'` (invariato) |
| storage | `'firebase'` | `'firestorage'` |
| storage | `'supabase'` | `'supabaseStorage'` |
| auth | `'google'` | `'googleAuth'` |
| email | `'gmail'` | `'gmail'` (invariato) |

### Migrazione consumer

```tsx
// Prima
providers={{
  firebase: firebaseConfig,
  google: googleOAuth2,
  gmail: { enabled: true },
  services: { data: 'firebase', storage: 'firebase', auth: 'google', email: 'gmail' },
}}

// Ora
providers={{
  firebase: firebaseConfig,
  google: googleOAuth2,          // gmail è un driver di google, non serve campo separato
  services: { data: 'dbRealtime', storage: 'firestorage', auth: 'googleAuth', email: 'gmail' },
}}
```

### Checklist

- [x] Creare `src/providers/manifest.ts`
- [x] Aggiornare `AppProvidersConfig` — rimuovere `gmail?`, usare `ServicesConfig` tipizzata
- [x] Riscrivere `resolveProviderRegistries` con loop generico
- [x] Rimuovere import provider concreti da `App.tsx` (ora nel manifest)
- [x] Aggiornare `src/index.ts` — re-export nuovi tipi
- [x] Aggiornare `docs/providers.md`
- [x] Aggiornare `docs/app-configuration.md`
- [x] `npm run build:dev` passa senza errori

---

## CR-024 — WYSIWYG editor component

**Stato:** ⬜ todo  
**Branch:** `modernize/cr-024-wysiwyg`  
**Priorità:** Alta  
**Dipende da:** CR-004, CR-014  
**Stima:** 1–2 settimane  
**Breaking change:** No (nuovo componente)

### Motivazione

I campi `Input` e `TextArea` gestiscono testo semplice. Per contenuti strutturati (articoli, descrizioni prodotto, note formattate) serve un editor WYSIWYG integrato nel sistema Form/Grid, che si comporti come gli altri field: riceve `value`, emette `onChange(name, value)`, si integra con il sistema tema.

Il componente deve essere un field a tutti gli effetti — funziona dentro `<Form>`, dentro un modal di `<Grid>`, e in modalità standalone.

### Scelta libreria — aperta

La libreria di editing è ancora da decidere all'avvio della CR. Candidata principale:

**Tiptap** (`@tiptap/react`) — framework headless sopra ProseMirror:
- Architettura estensione-based: ogni feature (bold, link, mention, table) è un modulo opzionale
- Headless: nessun CSS imposto, il tema react-firestrap controlla l'aspetto
- CR-025 (ContextMenu + mention) si appoggia nativamente alle extension Tiptap
- Community ampia, documentazione solida, licenza MIT (core)
- `peerDependency` opzionale — chi non usa `<RichEditor>` non porta il bundle

Alternative da valutare prima di procedere:
- **Quill** (via `react-quill-new`) — più semplice, meno estendibile
- **Slate.js** — molto flessibile, curva alta, meno maintained
- **Lexical** (Meta) — moderno, ottimo per mention/command, meno maturo degli altri due

### API target

```tsx
import { RichEditor } from '@llmnative/react';

// Dentro un Form
<Form dataStoragePath="/articles">
  <Input name="title" label="Titolo" required />
  <RichEditor
    name="body"
    label="Contenuto"
    toolbar={['bold', 'italic', 'heading', 'bulletList', 'link']}
    placeholder="Inizia a scrivere..."
    rows={12}
  />
</Form>

// Standalone con valore controllato
<RichEditor
  name="notes"
  value={html}
  onChange={(name, value) => setHtml(value)}
/>
```

### Formato valore

Il valore emesso da `onChange` è **HTML** (`string`). Questo lo rende compatibile con i backend esistenti senza trasformazioni, leggibile da `<MarkdownReader>` con piccole estensioni, e incollabile direttamente in email o CMS.

Alternativa JSON (formato nativo Tiptap/ProseMirror) da valutare: permette diff strutturati ma richiede parsing lato server.

### Toolbar configurabile

```tsx
type ToolbarItem =
  | 'bold' | 'italic' | 'underline' | 'strike'
  | 'heading'          // h1–h3 via dropdown
  | 'bulletList' | 'orderedList'
  | 'blockquote' | 'codeBlock'
  | 'link' | 'image'
  | 'undo' | 'redo'
  | 'divider';         // separatore visivo

<RichEditor toolbar={['bold', 'italic', 'divider', 'heading', 'link']} />
<RichEditor toolbar="full" />    // tutti gli item
<RichEditor toolbar="minimal" /> // solo bold, italic, link
```

### Integrazione tema

Il componente usa classi CSS del compatibility layer per la toolbar (`.btn`, `.btn-sm`, `.btn-outline-secondary`) e variabili CSS theme (`--rf-primary`, `--rf-border`, `--rf-radius`) per il focus ring e i colori dell'editor area. Nessun CSS hardcoded.

### Output del contenuto

```tsx
// Lettura sicura dell'HTML — in sola lettura usa MarkdownReader o un div sanitizzato
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(record.body) }} />

// Oppure con MarkdownReader (se il contenuto è misto HTML/Markdown)
<MarkdownReader content={record.body} />
```

### Scope

**Incluso:**
- Componente `RichEditor` in `src/components/ui/fields/RichEditor.tsx`
- Integrazione come form field (`useFormContext`)
- Toolbar configurabile con preset `'minimal'`, `'full'` e array custom
- Tema coerente con il sistema react-firestrap
- Export da `src/index.ts`
- Pagina showcase con playground e sezioni per ogni toolbar preset
- `peerDependency` opzionale: la libreria scelta non viene inclusa nel bundle se il componente non è usato

**Escluso:**
- Upload immagini inline nell'editor (rimandato a una sotto-CR o CR-026)
- Collaborazione real-time
- MDX / componenti React dentro l'editor
- ContextMenu/@mention (CR-025, dipende da questa)

### Checklist

- [ ] Valutare Tiptap vs alternative — scegliere e documentare la decisione
- [ ] Aggiungere la libreria scelta come `optionalPeerDependency` in `package.json`
- [ ] Creare `src/components/ui/fields/RichEditor.tsx`
- [ ] Implementare integrazione `useFormContext`
- [ ] Implementare toolbar configurabile con preset
- [ ] Applicare tema react-firestrap (CSS variables + compatibility layer)
- [ ] Aggiungere export in `src/index.ts`
- [ ] Aggiungere pagina `clients/showcase/src/pages/components/RichEditorPage.tsx`
- [ ] Aggiornare `src/conf/menu.ts` dello showcase
- [ ] Aggiornare `docs/components.md` con API `RichEditor`
- [ ] `npm run build:dev` passa senza errori
- [ ] Smoke test visivo: Form con RichEditor, valore salvato e ricaricato correttamente

---

## CR-025 — ContextMenu con comandi e @mention

**Stato:** ⬜ todo  
**Branch:** `modernize/cr-025-context-menu`  
**Priorità:** Alta  
**Dipende da:** CR-024  
**Stima:** 1 settimana  
**Breaking change:** No (nuovo componente)

### Motivazione

Nei contesti di editing collaborativo o note-taking è comune il pattern **slash command** (`/`) e **@mention**: l'utente digita un carattere trigger e appare un menu contestuale con azioni o suggerimenti. Questo pattern è distinto da un dropdown standard — appare inline nel testo, segue il cursore, e inserisce contenuto strutturato nell'editor.

Il componente `ContextMenu` (già abbozzato in `src/components/ui/fields/Command.tsx`) va riscritto in modo strutturato, estendibile e integrato nativamente con l'editor scelto in CR-024.

### API target

```tsx
import { RichEditor, ContextMenu } from '@llmnative/react';

<RichEditor name="body">
  {/* slash command: digita / per vedere le azioni */}
  <ContextMenu trigger="/" label="Comandi">
    <ContextMenu.Item
      id="heading"
      label="Titolo"
      icon="heading"
      onSelect={() => editor.chain().toggleHeading({ level: 2 }).run()}
    />
    <ContextMenu.Item
      id="quote"
      label="Citazione"
      icon="quote"
      onSelect={() => editor.chain().toggleBlockquote().run()}
    />
    <ContextMenu.Item
      id="table"
      label="Tabella"
      icon="table"
      onSelect={() => editor.chain().insertTable().run()}
    />
  </ContextMenu>

  {/* @mention: digita @ per cercare utenti */}
  <ContextMenu trigger="@" label="Menziona" searchable>
    {({ query }) => (
      <MentionResults
        query={query}
        onSelect={(user) => editor.chain().insertMention(user).run()}
      />
    )}
  </ContextMenu>
</RichEditor>
```

### Comportamento

1. L'utente digita il carattere `trigger` nell'editor
2. Il menu appare posizionato vicino al cursore (floating, non in un portale fisso)
3. L'utente può filtrare con ulteriore testo (`searchable`) o navigare con tastiera (↑ ↓ Enter Esc)
4. Selezionando un item, il trigger character e il testo digitato vengono rimpiazzati dall'output dell'azione
5. Esc o click fuori chiude il menu senza modificare il testo

### Uso standalone (senza RichEditor)

Il componente `ContextMenu` funziona anche su campi di testo normali — utile per mention in commenti, chat o input veloci senza editor ricco:

```tsx
<Input name="comment" label="Commento">
  <ContextMenu trigger="@" searchable>
    {({ query }) => <UserSuggestions query={query} />}
  </ContextMenu>
</Input>
```

### Architettura interna

Se la libreria scelta in CR-024 è Tiptap, i trigger vengono implementati come **Suggestion extension** (`@tiptap/suggestion`), che gestisce nativamente la rilevazione del trigger character, il posizionamento floating e la navigazione tastiera. Il componente `ContextMenu` diventa un wrapper React thin sopra questa extension.

Se la libreria è diversa, la logica di rilevazione trigger va re-implementata — ma l'API pubblica del componente rimane identica.

### Refactoring Command.tsx

Il file `src/components/ui/fields/Command.tsx` contiene un prototipo grezzo dello stesso pattern, ma usa `contentEditable` + `document.execCommand` (deprecato) e non ha integrazione con l'editor. Va rimosso o svuotato a favore di `ContextMenu`.

### Scope

**Incluso:**
- Componente `ContextMenu` in `src/components/ui/fields/ContextMenu.tsx`
- Integration con `RichEditor` (CR-024)
- Uso standalone su `Input` e `TextArea`
- Navigazione tastiera: ↑ ↓ Enter Esc Tab
- Filtro testo (`searchable`)
- Posizionamento floating vicino al cursore
- Export da `src/index.ts`
- Rimozione/svuotamento di `Command.tsx`
- Pagina showcase con demo slash command + @mention
- Aggiornamento `docs/components.md`

**Escluso:**
- Mention con persistenza (salvare le mention come link o nodi strutturati nell'editor) — può essere aggiunto in CR-026
- Multi-trigger simultanei in editor diversi
- SSR

### Checklist

- [ ] Verificare l'API Suggestion di Tiptap (o equivalente per la libreria scelta)
- [ ] Creare `src/components/ui/fields/ContextMenu.tsx`
- [ ] Implementare integration con `RichEditor`
- [ ] Implementare uso standalone su `Input`/`TextArea`
- [ ] Navigazione tastiera completa
- [ ] Posizionamento floating
- [ ] Rimuovere/svuotare `src/components/ui/fields/Command.tsx`
- [ ] Aggiungere export in `src/index.ts`
- [ ] Aggiungere pagina showcase `ContextMenuPage.tsx`
- [ ] Aggiornare `docs/components.md`
- [ ] `npm run build:dev` passa senza errori
- [ ] Smoke test: slash command inserisce contenuto correttamente; @mention filtra e inserisce

---

## CR-037 — Component Builder System

**Stato:** ⬜ todo  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** CR-007  

### Motivazione

`useImage` (già implementato in `src/libs/imageBuilder.ts`) dimostra un pattern utile: un hook factory che accetta la configurazione di un componente e restituisce metodi `toHtml()`, `toJson()` e `params()` per generare output statico SEO/CMS-ready senza dipendenze React.

Il caso d'uso reale di `useImage` è specifico e giustificato: il tag `<img>` ha attributi complessi (`srcset`, `sizes`, `fetchpriority`, `loading`, `decoding`) difficili da scrivere a mano per CMS headless, SSR o template statici. Un sistema builder modulare generalizza questo pattern ad altri componenti che hanno un'eguale complessità di serializzazione.

### Obiettivo

Definire una convenzione e un'infrastruttura leggera per builder hook tipo `useX(config)` per i componenti del framework che lo giustificano. Il builder:
- è una factory pura (zero dipendenze React)
- vive in `src/libs/` seguendo la regola architetturale del layer
- espone `{ toHtml, toJson, params }` come contratto uniforme
- viene importato con named export da `@llmnative/react`

### Candidati concreti

| Componente | Caso d'uso builder |
|------------|-------------------|
| `Image` | ✅ già implementato — `useImage()` in `src/libs/imageBuilder.ts` |
| `<head>` meta/OG tags | `useOpenGraph(config)` → genera `<meta>` SEO tags per CMS/SSR |
| `<video>` | `useVideo(config)` → `<video>` con `<source>` multipli, `poster`, `preload` |

**Nota:** componenti interattivi (Button, Modal, Card) non sono candidati — il loro HTML statico non ha utilità senza JS e non rappresenta un dolore reale per i consumer.

### Contratto da standardizzare

```typescript
interface ComponentBuilderResult<P> {
    toHtml: (options?: unknown) => string;
    toJson: (options?: unknown) => string;
    params: (options?: unknown) => P;
}
```

### Scope

- Definire il contratto `ComponentBuilderResult<P>` in `src/types/`
- Fare in modo che `useImage` aderisca al contratto (già quasi compliant)
- Aggiungere builder solo quando emerge un secondo caso concreto (regola: 2+ casi giustificano l'astrazione)
- Documentare la convenzione in `docs/architecture/`

### Escluso

- Builder per componenti interattivi (Button, Card, Modal, Form)
- Generazione automatica da schema o da JSX
- Runtime serialization di componenti React montati

### Checklist

- [ ] Definire `ComponentBuilderResult<P>` in `src/types/builder.ts`
- [ ] Allineare `UseImageResult` al contratto condiviso
- [ ] Identificare il secondo candidato concreto (es. `useOpenGraph`)
- [ ] Implementare il secondo builder come prova di pattern
- [ ] Aggiornare `src/libs/index.ts` con i nuovi export
- [ ] Aggiungere sezione "Builder hooks" in `docs/architecture/index.md`
- [ ] Aggiungere showcase demo per ogni builder implementato
- [ ] `npm run build` passa senza errori

---

## CR-038 — AI-first naming normalization

**Stato:** ⬜ todo  
**Branch:** `modernize/cr-038-ai-first-naming`  
**Priorità:** Alta  
**Dipende da:** CR-014, CR-037  
**Stima:** 1 settimana  
**Breaking change:** Sì — rename diretto delle public props senza alias di compatibilità

### Motivazione

La codebase oggi usa parole diverse per concetti simili:

- `Grid.layout` per scegliere `table | gallery`
- `Form.aspect` per scegliere `card | empty`
- `AuthButton.aspect` per scegliere `button | avatar`
- `AssistantAI.viewMode` per scegliere `list | carousel`
- `ImageUrl.mode` per un comportamento che in realtà riguarda il prompt

Questo genera ambiguità sia per gli umani sia, soprattutto, per gli agenti AI.  
Un framework AI-first deve usare un vocabolario piccolo, stabile e semanticamente netto: una parola = un concetto.

### Decisione

Il framework adotta questo vocabolario esplicito:

- `view`: data/content representation
- `appearance`: visual shell
- `layout`: spatial arrangement
- `mode`: operational behavior
- `variant`: semantic tone
- `position`: anchor point
- `size`: scale/dimension

### Regola architetturale

Questa CR **non introduce alias**, **non introduce deprecazioni graduali** e **non mantiene nomi legacy**.

Se un public API name è ambiguo:
- si rinomina direttamente;
- si aggiornano subito framework, showcase, documentazione, test e scaffolding;
- il changelog segnala il breaking change;
- i consumer devono adeguarsi alla nuova naming map.

Motivazione: l'obiettivo primario è la chiarezza AI-first, non la backward compatibility.

### Rinominazioni target

#### 1. View

Usare `view` quando cambia la rappresentazione dei dati o del contenuto.

- `Grid.layout` → `Grid.view`
- `GridArray.layout` → `GridArray.view`
- `GridDB.layout` → `GridDB.view`
- `AssistantAI.viewMode` → `AssistantAI.view`

Valori attesi:
- `table | gallery`
- `list | carousel`

#### 2. Appearance

Usare `appearance` quando cambia il guscio visuale del componente.

- `Form.aspect` → `Form.appearance`
- `AuthButton.aspect` → `AuthButton.appearance`

Valori attesi:
- `card | plain`
- `button | avatar`

Nota: dentro questa CR il valore `empty` del Form deve essere rivalutato e, se confermato ambiguo, sostituito con `plain`.

#### 3. Layout

Usare `layout` solo quando cambia la disposizione spaziale interna.

Confermati:
- `Repeat.layout`
- `docs-kit` playground `layout: 'split' | 'stacked'`

#### 4. Mode

Usare `mode` solo quando cambia il comportamento operativo.

Confermati:
- `Prompt.mode`
- `Theme.mode`

Da rinominare:
- `ImageUrl.mode` → `ImageUrl.promptMode`

#### 5. Variant / Position / Size

Confermati:
- `ActionButton.variant`
- `LoadingButton.variant`
- `Modal.position`
- `Modal.size`

### Scope

**Incluso:**
- Aggiornare i public props name nei componenti framework coinvolti
- Aggiornare tipi TypeScript, export pubblici e docs inline
- Aggiornare tutte le pagine showcase e playground
- Aggiornare `CLAUDE.md` con la tassonomia ufficiale
- Aggiornare docs di riferimento e pattern docs
- Aggiornare test unit/component
- Aggiornare `CHANGELOG.md` con breaking changes espliciti

**Escluso:**
- Alias backward compatibility
- Warning di deprecazione
- Layer di compatibilità in runtime
- Codemod automatico per i consumer esterni

### File / aree coinvolte

- `src/components/widgets/Grid.tsx`
- `src/components/widgets/grid-core/*`
- `src/components/widgets/Form.tsx`
- `src/auth.tsx`
- `src/components/ui/fields/ImageUrl.tsx`
- `src/components/ui/fields/AssistantAI.tsx`
- `src/components/widgets/Prompt.tsx` (solo verifica semantica, non necessariamente rename)
- `clients/showcase/src/pages/components/*`
- `docs/*`
- `CLAUDE.md`

### Checklist

- [ ] Formalizzare il vocabolario in `CLAUDE.md`
- [ ] Rinominare `Grid.layout` in `Grid.view`
- [ ] Rinominare `GridArray.layout` in `GridArray.view`
- [ ] Rinominare `GridDB.layout` in `GridDB.view`
- [ ] Rinominare `AssistantAI.viewMode` in `AssistantAI.view`
- [ ] Rinominare `Form.aspect` in `Form.appearance`
- [ ] Rinominare `AuthButton.aspect` in `AuthButton.appearance`
- [ ] Rinominare `ImageUrl.mode` in `ImageUrl.promptMode`
- [ ] Valutare e normalizzare i valori `empty` → `plain` dove opportuno
- [ ] Verificare che `Repeat.layout`, `Prompt.mode`, `variant`, `position`, `size` restino semanticamente coerenti
- [ ] Aggiornare showcase, prop docs e preset playground
- [ ] Aggiornare test
- [ ] Aggiornare `CHANGELOG.md`
- [ ] `npm run build` e `cd clients/showcase && npm run build` passano

---

## CR-039 — Firebase SDK compat → modular v9+

**Stato:** ✅ done  
**Branch:** `main`  
**Priorità:** Alta  
**Dipende da:** CR-002, CR-023  
**Prerequisito di:** CR-033 (Firestore non ha API compat), CR-034, CR-036  
**Stima:** 2–3 giorni  
**Breaking change:** No (API pubblica invariata, cambia solo l'implementazione interna)

### Motivazione

Il framework usa `firebase/compat` — il wrapper di compatibilità che emula l'API di Firebase v8. Google lo ha introdotto come ponte di migrazione temporaneo, non come API definitiva. Ha due problemi concreti:

1. **Bundle size**: `firebase/compat` non è tree-shakeable. Importare `firebase/compat/database` carica l'intero sottomodulo, anche le parti non usate. Il modular SDK v9+ è progettato per il tree-shaking: il bundler include solo le funzioni effettivamente importate. Riduzione attesa: 40–60% del peso Firebase nel bundle.

2. **Blocco architetturale**: FirestoreDataProvider (CR-033) usa solo l'SDK modular — non esiste un compat layer per Firestore. Finché `firebase-init.ts` usa `firebase/compat`, integrare Firestore richiede di gestire due SDK paralleli nello stesso progetto, con due `firebase.app()` concorrenti.

3. **Accoppiamento strutturale**: il listener `onConfigChange` è attualmente a livello di modulo in `firebase.ts` (data) e `firebase.ts` (storage). Questo significa che entrambi i moduli si attivano non appena vengono importati — anche se nessun provider Firebase è configurato come servizio. La migrazione al modular SDK è l'occasione giusta per spostare il listener a livello di istanza (costruttore della classe), eliminando il side effect all'import.

### Scope

**Incluso:**

- Rimuovere `firebase/compat` da tutti i file Firebase del framework.
- Riscrivere `src/providers/firebase-init.ts` con l'SDK modular (`initializeApp`, `getApp`, `deleteApp` da `firebase/app`).
- Riscrivere `src/providers/data/firebase.ts` con l'SDK modular (`getDatabase`, `ref`, `get`, `set`, `update`, `remove`, `onValue`, `query`, `orderByChild`, `equalTo` da `firebase/database`).
- Riscrivere `src/providers/storage/firebase.ts` con l'SDK modular (`getStorage`, `ref`, `uploadString`, `getDownloadURL`, `deleteObject` da `firebase/storage`).
- Spostare il listener `onConfigChange` dal livello di modulo al costruttore della classe (`FirebaseDataProvider`, `FirebaseStorageProvider`) con guard statico per evitare registrazioni duplicate.
- Aggiornare `GoogleAuthProvider` / `firebase-init.ts` per usare `getAuth` modular dove necessario (già parzialmente fatto).
- Verificare che il bundle finale sia più leggero con `vite-bundle-visualizer` o `rollup-plugin-visualizer`.

**Escluso:**

- FirestoreDataProvider (CR-033) — CR separata che dipende da questa.
- Migrazione del Firebase SDK nel consumer (showcase, template) — usano la libreria come black box.
- Firebase Admin SDK (usato solo lato server in GmailEmailProvider, non tocca il bundle client).

### Mapping API — compat → modular

| Compat | Modular |
|--------|---------|
| `import firebase from 'firebase/compat/app'` | `import { initializeApp, getApp, deleteApp } from 'firebase/app'` |
| `import 'firebase/compat/database'` | `import { getDatabase, ref, ... } from 'firebase/database'` |
| `import 'firebase/compat/storage'` | `import { getStorage, ref, ... } from 'firebase/storage'` |
| `firebase.initializeApp(config)` | `initializeApp(config)` |
| `firebase.apps.length` | `getApps().length` |
| `firebase.app()` | `getApp()` |
| `firebase.app().delete()` | `deleteApp(getApp())` |
| `firebase.app().database()` | `getDatabase()` |
| `db.ref('/path')` | `ref(db, '/path')` |
| `dbRef.once('value')` | `get(dbRef)` |
| `dbRef.set(data)` | `set(dbRef, data)` |
| `dbRef.update(data)` | `update(dbRef, data)` |
| `dbRef.remove()` | `remove(dbRef)` |
| `dbRef.on('value', cb)` | `onValue(dbRef, cb)` → ritorna unsubscribe |
| `firebase.app().storage()` | `getStorage()` |
| `storage.ref('/path')` | `storageRef(storage, '/path')` |
| `ref.putString(data, 'data_url')` | `uploadString(ref, data, 'data_url')` |
| `ref.getDownloadURL()` | `getDownloadURL(ref)` |
| `ref.delete()` | `deleteObject(ref)` |

### Fix accoppiamento modulo (da fare in questa CR)

```ts
// PRIMA — listener a livello di modulo (si attiva all'import)
let databaseInstance: Database;
if (typeof onConfigChange === 'function') {
    onConfigChange((newConfig: Config) => {
        if (newConfig.firebase) init(newConfig.firebase);
    });
}

// DOPO — listener a livello di istanza (si attiva solo quando il provider è creato)
export class FirebaseDataProvider implements DataProviderAdapter {
    private static listenerRegistered = false;

    constructor() {
        if (!FirebaseDataProvider.listenerRegistered) {
            FirebaseDataProvider.listenerRegistered = true;
            onConfigChange((newConfig: Config) => {
                if (newConfig.firebase) init(newConfig.firebase);
            });
        }
    }
}
```

### Criteri di accettazione

- [x] Nessun import `firebase/compat` rimasto nei file del framework.
- [x] `FirebaseDataProvider` funziona: read, set, update, remove, useListener, count, setChunks.
- [x] `FirebaseStorageProvider` funziona: upload, getURL, download, delete.
- [x] `firebase-init.ts` usa solo API modular (`initializeApp`, `getApp`, `deleteApp`, `getApps`).
- [x] Il listener `onConfigChange` è nel costruttore della classe, non a livello di modulo.
- [x] Nessun errore Firebase a console in app senza auth configurato.
- [x] Bundle JS del framework ridotto (verificato con visualizer) — Firebase nel bundle showcase: 770 KB con modular (era ~1.300-1.500 KB con compat). tui-image-editor (1.985 KB) e lucide-react (943 KB) sono i prossimi candidati a ottimizzazione (P3.3).
- [x] TypeScript strict: nessun errore `tsc --noEmit`.
- [x] `npm run test` passa (198 test pass, 0 regressioni).
- [x] `npm run build` passa.
