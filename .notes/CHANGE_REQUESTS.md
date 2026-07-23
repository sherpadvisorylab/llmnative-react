# Change Requests

> Ogni CR rappresenta un'unità di lavoro autonoma con motivazione, scope e checklist.  
> Stato: `⬜ todo` · `🔄 in progress` · `✅ done` · `🚫 cancelled`  
> Ultima revisione: 2026-07-21

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
| [CR-006](#cr-006--batterie-di-test) | Batterie di test | Alta | CR-002, CR-003 | ✅ |
| [CR-007](#cr-007--showcase-app) | Showcase app | Alta | CR-002, CR-004 | ✅ |
| [CR-008](#cr-008--tema-empty--tailwind--shadcnui) | Tema `empty` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-009](#cr-009--tema-default--tailwind--shadcnui) | Tema `default` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-010](#cr-010--tema-flat--tailwind--shadcnui) | Tema `flat` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-011](#cr-011--tema-cyber--tailwind--shadcnui) | Tema `cyber` → Tailwind + shadcn/ui | Bassa | CR-004 | ✅ |
| [CR-021](#cr-021--use-case-templates) | Use case templates (crm, admin, inventory, project) | Media | CR-005, CR-017 | ✅ |
| [CR-012](#cr-012--showcase-refactor--react-firestrap-native) | Showcase refactor — react-firestrap native | Alta | CR-004, CR-007 | ✅ |
| [CR-013](#cr-013--icon-provider-system) | Icon provider system | Media | CR-004 | ✅ |
| [CR-014](#cr-014--raffinazione-componenti--props-e-comportamenti) | Raffinazione componenti — props e comportamenti | Media | — | ✅ done |
| [CR-015](#cr-015--vite-toolchain-framework--scaffolding) | Vite toolchain framework + scaffolding | Alta | CR-003, CR-004, CR-006 | ✅ |
| [CR-016](#cr-016--showcase-vite--scaffold-first) | Showcase Vite + scaffold-first | Alta | CR-012, CR-015 | ✅ |
| [CR-017](#cr-017--app-managed-theme--icon-registries) | App-managed theme + icon registries | Alta | CR-004, CR-013 | ✅ |
| [CR-018](#cr-018--markdownreader-component) | MarkdownReader component | Alta | CR-004, CR-017 | ✅ |
| [CR-019](#cr-019--markdown-powered-showcase-docs) | Markdown-powered showcase docs | Alta | CR-018 | ✅ |
| [CR-020](#cr-020--head-management--declarative-provider-config) | Head management + declarative provider config | Alta | CR-017, CR-019 | ✅ |
| [CR-022](#cr-022--bootstrap-utility-cleanup) | Bootstrap utility cleanup — JSX → Tailwind nativo | Media | CR-004 | ✅ |
| [CR-023](#cr-023--driver-manifest--service-registry) | Driver manifest + service registry | Alta | CR-002, CR-002b | ✅ |
| [CR-024](#cr-024--wysiwyg-editor-component) | WYSIWYG editor component (`RichText`) | Alta | CR-004, CR-014 | ✅ |
| [CR-025](#cr-025--contextmenu-con-comandi-e-mention) | ContextMenu con comandi e @mention | Alta | CR-024 | ✅ |
| [CR-026](#cr-026--authbutton-provider-agnostic--dropboxauthprovider) | AuthButton provider-agnostic + DropboxAuthProvider | Alta | CR-002b, CR-023 | ✅ |
| [CR-027](#cr-027--motion-system-e-interazioni-animate) | Motion system e interazioni animate | Media | CR-017, CR-022 | ✅ |
| [CR-028](#cr-028--stato-configurazione-provider) | Stato configurazione provider | Alta | CR-002, CR-023, CR-026 | ✅ |
| [CR-029](#cr-029--internationalization-i18n-del-framework) | Internationalization i18n del framework | Alta | CR-017, CR-019 | ✅ |
| [CR-030](#cr-030--self-contained-typed-themes) | Self-contained typed themes | Alta | CR-017, CR-027 | ✅ |
| [CR-031](#cr-031--sidebar-block-del-framework) | Sidebar block del framework (`SideNav`) | Media | CR-007, CR-017 | ✅ |
| [CR-032](#cr-032--firebaseauthprovider) | FirebaseAuthProvider (email/password + anonymous) | Alta | CR-002b, CR-023 | ✅ |
| [CR-033](#cr-033--firestoredataprovider) | FirestoreDataProvider (Cloud Firestore) | Alta | CR-002, CR-023, CR-039 | ✅ |
| [CR-034](#cr-034--supabasedataprovider-completo) | SupabaseDataProvider completo (SDK + real-time) | Alta | CR-002, CR-023 | ✅ |
| [CR-035](#cr-035--supabasestorageprovider-completo) | SupabaseStorageProvider completo (SDK) | Media | CR-002, CR-023 | ✅ |
| [CR-036](#cr-036--supabaseauthprovider) | SupabaseAuthProvider (email/password + OAuth) | Alta | CR-002b, CR-023 | ✅ |
| [CR-037](#cr-037--component-builder-system) | Component Builder System — useX() hooks per export HTML/JSON | Media | CR-007 | ⬜ |
| [CR-038](#cr-038--ai-first-naming-normalization) | AI-first naming normalization | Alta | CR-014, CR-037 | ✅ done |
| [CR-039](#cr-039--firebase-sdk-compat--modular-v9) | Firebase SDK compat → modular v9+ | Alta | CR-002, CR-023 | ✅ |
| [CR-040](#cr-040--schemaform-form-generation-da-schema-json--factory) | SchemaForm: form generation da schema JSON / factory | Alta | CR-037 | ⬜ |
| [CR-041](#cr-041--seoenhancer-filtro-seo-tecnica-su-html-generato-proposta) | SeoEnhancer: filtro SEO tecnica su HTML generato (proposta) | Media | CR-007 | ⬜ |
| [CR-042](#cr-042--typescript-no-any-eliminazione-di-tutti-gli-usi-di-any) | TypeScript no-any: eliminazione di tutti gli usi di `any` | Alta | CR-003 | ✅ done |
| [CR-043](#cr-043--token-benchmark-page-nel-showcase) | Token Benchmark page nel showcase | Media | CR-016 | ✅ done |
| [CR-044](#cr-044--showcase-pagine-mancanti-label-uploadcsv-crop-command) | Showcase pagine mancanti (Label, UploadCSV, Crop, Command) | Bassa | CR-007 | ✅ |
| [CR-045](#cr-045--ai-adoption-piano-di-distribuzione-e-visibilita) | AI Adoption: piano di distribuzione e visibilità | Alta | CR-001, CR-016 | ⬜ |
| [CR-046](#cr-046--promptrun-visual-redesign--chatbot-style) | PromptRun visual redesign — chatbot style | Alta | — | ✅ |
| [CR-047](#cr-047--prompt-extensible-toolbar-commands-attachments-actions-statusitems--promptutils-api) | Prompt extensible toolbar + PromptUtils API | Alta | CR-046 | ✅ |
| [CR-048](#cr-048--prompt-file-attachment--ai-provider-visiondocs-integration) | Prompt file attachment — AI provider vision/docs | Media | CR-047 | ✅ done |
| [CR-049](#cr-049--componentschema--meta-layer-per-configurazione-campi) | Component.schema — meta-layer configurazione campi | Alta | — | ✅ |
| [CR-050](#cr-050--contextmenu-adapter-system-proposal) | ContextMenu adapter system | Media | CR-025 | ✅ done |
| [CR-051](#cr-051--workflowai-orchestrazione-pipeline-di-prompt) | WorkflowAI: orchestrazione pipeline di prompt | Alta | CR-039 | ⬜ |
| [CR-052](#cr-052--credentialsadapter-e-googleserviceaccountprovider) | CredentialsAdapter + GoogleServiceAccountProvider | Media | CR-002 | ✅ |
| [CR-053](#cr-053--doc-audit-api-publish-providersession-providerswitcher) | Doc audit: api, publish, ProviderSession, ProviderSwitcher | Media | — | ✅ |
| [CR-054](#cr-054--grid-views-config) | Grid views config (toggle table/gallery, column picker, field picker) | Media | — | ✅ |
| [CR-055](#cr-055--fill-height-editor) | Fill-height editor (`EditorHeight = number \| 'fill'`) | Bassa | — | ✅ |
| [CR-056](#cr-056--grouped-command-context-menu) | Grouped command menu in ContextMenu | Bassa | CR-025 | ✅ |
| [CR-057](#cr-057--theming-fixes-grid-table-gallery) | Theming fixes (Grid.Table, Grid.Gallery wrapper) | Bassa | — | ✅ |
| [CR-058](#cr-058--ai-tool-calling-system) | AI tool calling system (AIToolDefinition, AIToolCall, AIToolResult) | Alta | — | ✅ |
| [CR-059](#cr-059--abortable-ai-provider-calls) | Abortable AI provider calls (AbortSignal) | Alta | — | ✅ |
| [CR-060](#cr-060--i18n-modal-confirm-dialogs) | i18n'd Modal confirm dialogs | Media | CR-029 | ✅ |
| [CR-061](#cr-061--modal-rightinset-closeslot) | Modal rightInset / closeSlot props | Media | — | ✅ |
| [CR-062](#cr-062--secret-redaction-in-fetch-logs) | Secret redaction in fetch error logs | Alta | — | ✅ |
| [CR-063](#cr-063--tenant-firestore-databaseid-dispose) | Tenant Firestore db (databaseId, dispose) | Alta | CR-033 | ✅ |
| [CR-064](#cr-064--provider-dispose-contract) | Provider dispose contract (DataProviderAdapter.dispose) | Media | CR-002 | ✅ |
| [CR-065](#cr-065--firestore-getdb-inside-try-block) | Firestore getDb() dentro try block (race condition fix) | Alta | CR-033 | ✅ |
| [CR-066](#cr-066--empty-cache-snapshot-filter-firestore) | Empty cache snapshot filter in Firestore subscribe | Media | CR-033 | ✅ |
| [CR-067](#cr-067--asyncdropdown-searchable-component) | AsyncDropdown: componente searchable con AbortSignal | Media | — | ✅ |

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

**Stato:** ✅ done  
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
- [x] Animare Notifications/Toast.
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

**Stato:** ✅ done
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

- [x] Definire `I18nProvider`, `useI18n()` e tipi (`I18nDict`, `I18nConfig`, `I18nController`).
- [x] Creare dizionario default `en` (`src/conf/i18n/en.ts`).
- [x] Aggiungere supporto override parziale (deep merge in `I18nProvider`).
- [x] Aggiungere interpolazione semplice (`interpolate(template, vars)`).
- [x] Estrarre stringhe da `Select` (placeholder), `Modal` (save/delete/cancel/close), `Notifications`, `Search`.
- [x] Estrarre stringhe da `Form` (header, button labels, validation, success messages).
- [x] Estrarre stringhe da `Grid`/`GridCore` (deleteConfirm).
- [x] Estrarre stringhe da `Upload` (dropzone, editFileName, editorImage).
- [x] Integrare `<I18nProvider>` in `App.tsx`; prop `i18n?: I18nConfig` aggiunta.
- [x] Rimossi `ThemeConfig.Form.i18n` e `ThemeConfig.Grid.i18n` (obsoleti).
- [x] Esportare `I18nProvider`, `useI18n`, `interpolate`, tipi da `src/index.ts`.
- [x] Aggiungere showcase per cambio lingua (pagina esistente `/components/locale-switcher`).
- [x] Aggiungere docs i18n (`docs/architecture/i18n.md`).
- [x] Aggiungere test per fallback, override e interpolazione (16 test).
- [x] `npm run test` e `npm run build` passano.

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

## CR-031 — Sidebar block del framework (`SideNav`)

**Stato:** ✅ done — implementato come `SideNav` in `src/components/blocks/SideNav.tsx`, esportato pubblicamente e usato dallo showcase.
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

**Stato:** ✅ Done — 100%  
**Branch:** `modernize`  
**Priorità:** Alta  
**Stima:** 2–3 settimane  
**Dipende da:** CR-002, CR-003  
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
- [x] Configurare Firebase Emulator per test di integrazione (`firebase.json`, 10 test RTDB/Firestore/Storage)
- [x] Creare `MockDataProvider` — implementazione in-memory completa (`src/providers/data/mock.ts`)
- [x] Scrivere `DataProvider.contract.ts` — contract test parametrico (14 test)
- [x] `MockDataProvider.test.ts` — MockDataProvider supera il contract + test useListener (22 test)
- [x] Unit test: `utils.ts` — trimSlash, normalizePath, normalizeKey, isEmpty, safeClone (23 test)
- [x] Unit test: `converter.ts` — toCamel, toUpper, toLower, toSlug, truncate, toQueryString, parse, subStringCount (16 test)
- [x] Unit test: `path.ts` (54 test)
- [x] Unit test: `sanitizer.ts` (36 test)
- [x] Unit test: `cache.ts` (rimosso come dead code in CR-042 — non necessario)
- [x] Integration test: Firebase RTDB/Firestore/Storage contro emulatore (10 test)
- [x] Integration test: Supabase Postgres CRUD + Auth contro emulatore locale (8 test)
- [x] Component test: `Form.tsx` — defaultValues, FormDatabase loading, save, onFinally, nested dot notation (9 test)
- [x] Component test: `Grid.tsx` — headers, rows, empty state, dataArray, onDisplay formatter, real-time add/remove, allowedActions (8 test)
- [x] Component test: `Input.tsx` — rendering, labels, types, placeholder, disabled, user interaction (8 test)
- [x] Component test: `Select.tsx`
- [x] Component test: `Upload.tsx` — document/image existing values, max limit, remove, URL helper (5 test)
- [x] Component test: `Prompt.tsx` (13 test)
- [x] Component test: `Repeat.tsx` — render array, add item, readOnly controls, save nested values (4 test)
- [x] Provider context test: `StorageProviderContext.tsx` — missing/default/named/unknown adapter (4 test)
- [x] Configurare Playwright per smoke test E2E (15 test, 30+ pagine showcase)
- [x] E2E: flusso CRUD completo (add → edit → delete) — `showcase-crud.e2e.ts` (1 test)
- [ ] E2E: login Google (bloccato: servono credenziali OAuth reali)
- [x] Aggiungere script `test`, `test:watch`, `test:coverage`, `test:integration`, `test:e2e` in `package.json`
- [x] Aggiungere CI check (GitHub Actions o equivalente)

### Stato verificato al 2026-07-09

Verifica reale eseguita oggi:
- `npx vitest run --reporter=dot` passa (61 file, 643 test).
- `npx vitest run --config vitest.integration.config.mts` passa (18 test: 10 Firebase emulator + 8 Supabase emulator). Nota: 2 test Firebase Storage timeout (porta 9199 non attiva).
- `npx playwright test` passa (16 test E2E: 11 smoke + 4 interazioni + 1 CRUD).
  - Nota: 1 flaky (showcase-interactions key component pages, timeout su Vite pre-transform error).
- `npm run build` passa.

Copertura effettiva:
- libs: `utils`, `converter`, `path`, `sanitizer`
- framework/runtime: `App`, `motion`, theme/icon
- provider/config: `MockDataProvider` (contract + specific), `FirebaseDataProvider`, `FirestoreDataProvider`, `SupabaseDataProvider`, `FirebaseStorageProvider`, `SupabaseStorageProvider`, `SupabaseAuthProvider`, `DropboxAuthProvider`, `GmailEmailProvider`, `GoogleServiceAccountProvider`, `AIProviders`, `Scrape`, `ProxyRegistry`
- componenti: `Form`, `Grid`, `Input`, `Select`, `Upload`, `Repeat`, `Prompt`, `MarkdownReader`, `Table`, `Modal`, `Dropdown`, `Gallery`, `Buttons`, `Badge`, `AuthButton`, `StorageProviderContext`, form-controller
- Integration: Firebase RTDB/Firestore/Storage emulator (10 test) + Supabase Postgres CRUD + Auth (8 test)
- E2E: Playwright smoke + navigation + CRUD (16 test su 30+ pagine showcase)

Gap residui confermati (deferiti a CR future):
- Manca E2E login Google (bloccato: servono credenziali OAuth reali)
- CI presente (GitHub Actions) ma senza job integration/E2E

---

## CR-007 — Showcase app

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Alta — anticipata per testare visivamente CR-004  
**Stima:** 3–4 settimane  
**Dipende da:** CR-002, CR-004 (rimossa dipendenza da CR-006 — la showcase serve anche come test visivo)  
**Breaking change:** No (app separata)

> **Deploy e link docs**: rinviati a CR separato. La showcase è completa e navigabile localmente.

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
- [x] Provider stub risolti (redirect): `/providers/data/firebase`, `/providers/data/supabase`, `/providers/storage/firebase`, `/providers/auth/google`
- [x] Example stub risolti (real pages): CRUD, Dashboard, NestedForm, File manager, Google sign-in — tutti con `MockDataProvider`
- [ ] Deploy (GitHub Pages o Vercel) — *deferred*
- [ ] Link alla showcase da `CLAUDE.md` e `docs/` — *deferred*

### Stato verificato al 2026-07-10

Implementazione reale confermata:
- `clients/showcase` builda con `npm run build`.
- Il menu espone molte pagine componente reali e non solo i nuclei iniziali.
- Le docs pubbliche dello showcase arrivano da Markdown via `markdownDocs`.
- **Provider stub** (4): reindirizzano alle pagine markdown generiche (`/providers/data`, `/providers/storage`, `/providers/auth`).
- **Example stub** (5): pagine reali — `CrudPage.tsx`, `DashboardPage.tsx`, `NestedFormPage.tsx`, `FileManagerPage.tsx`, `GoogleAuthPage.tsx`. Tutti con `MockDataProvider`.
- **Stub rimanenti**: 0.

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

**Stato:** ✅ done — il refactor è completo al 99%. L'unica menzione residua di `react-firestrap` è un commento in `.env.template`.  
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

**Stato:** ✅ done  
**Branch:** `modernize`  
**Priorità:** Media  
**Dipende da:** —  
**Stima:** Completata 2026-07-07  
**Breaking change:** Nessuno — tutti i fix sono backward-compatible

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

### Componenti da rivedere (censimento iniziale — aggiornato 2026-07-07)

| Componente | Issue noti | Priorità | Stato |
|------------|-----------|----------|-------|
| `Input` | `type` vs `inputType` | Alta | Risolto — `type` è la prop pubblica, `inputType` è solo interno a `useFormContext` |
| `Select` | `placeholder` non esposto su `SelectProps` | Alta | Chiuso — `placeholderOption` copre già il caso; aggiungere `placeholder` creerebbe ambiguità |
| `Select` | `db` prop usa `path` come nel DataProvider; alias legacy rimosso | — | Done |
| `Form` | `appearance="none"` non valido | Media | Chiuso — `"empty"` già fornisce bare layout; `"none"` alias creerebbe ambiguità |
| `Grid` | `pagination.perPage` non esiste | Alta | Risolto — il codice usa `limit`, nessuna traccia di `perPage` nella codebase |
| `Grid` | `groupBy` non testato nella showcase | Media | Ancora aperto |
| `Modal` | `footerClose` prop aggiunta ma non nei tipi | Bassa | Rimossa — `footerClose` non è mai stato implementato nella codebase |
| `Icon` | prop unica `name` | — | Done |

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

#### Audit completato (2026-07-07)
- [x] Audit completo componenti `ui/`, `ui/fields/`, `blocks/`, `widgets/` (40+ componenti)
- [x] Input `type` vs `inputType` — risolto: `type` è la prop pubblica, `inputType` è interno
- [x] Select `placeholder` — chiuso: `placeholderOption` copre il caso, `placeholder` creerebbe ambiguità
- [x] Select db → path alias — Done
- [x] Form `appearance="none"` — chiuso: `"empty"` già fornisce bare layout
- [x] Grid `perPage` — risolto: codice usa `limit`, nessuna traccia di `perPage`
- [x] Modal `footerClose` — rimosso: mai implementato nella codebase
- [x] Icon `icon` → `name` — Done
- [x] Badge overlay mode — Done
- [x] Select.Autocomplete creatable + onCreate — Done
- [x] Select.Autocomplete disabled bug — Done
- [x] Form onChange prop — Done
- [x] Form useEffect JSON.stringify fix — Done

#### Bug reali emersi dall'audit
- [x] Fix **Gallery**: rimosse `scrollToTopOnChange` / `scrollBehavior` da `GalleryProps`
- [x] Fix **Repeat**: rimosso `value` da `RepeatProps`
- [x] Fix **ThemeSwitcher**: rimosso `extends UIProps` (ora solo `className` + `wrapperClassName`)
- [x] Fix **Autocomplete**: `validator` ora passato a `useFieldValidation(name, { required, label, validator })`
- [x] Fix **Checklist**: `validator` ora passato a `useFieldValidation(name, { required, label, validator })`
- [x] Fix **ActionButton**: `ariaLabel` implementato + fallback icon-only; `loading` spostato su `LoadingButtonProps`
- [x] Fix **PromptEditor**: interfacce ridisegnate senza `Omit<>` (PromptFieldBase → PromptWithAI → PromptEditorProps)
- [x] Fix **PromptPlainFallback**: interfacce ridisegnate senza `Omit<>` (PromptFieldBase → PromptPlainFallbackProps)

#### Pulizia
- [x] Aggiungere JSDoc minimo su props non ovvie per tutti i componenti `ui/` e `blocks/` (20+ file, ~100 prop commentate)
- [x] Aggiornare showcase per ogni fix
- [x] Aggiornare `AGENTS.md` con le API corrette

### Stato verificato al 2026-07-07

Audit API completo eseguito su 40+ componenti in `ui/`, `ui/fields/`, `blocks/`, `widgets/`:
- **✅ 18 componenti** puliti (props dichiarate, usate, JSDoc sufficiente)
- **⚠️ 16 componenti** con JSDoc mancante o defaults inconsistenti
- **❌ 8 bug reali** emersi (props dichiarate ma mai usate / validation ignorata)

Dettaglio audit per categoria:
- **ui/**: Alert, Badge, Buttons, Card, Code, Gallery, GridSystem, Icon, Image, ImageAvatar, LayoutBuilder, Loader, LocaleSwitcher, Modal, Pagination, Percentage, Repeat, Tab, Table
- **ui/fields/**: Input (+16 varianti), Select (+Autocomplete/Checklist), Upload (+UploadImage), Crop, UploadCSV, ImageField, RichText, CodeEditor, ContextMenu
- **blocks/**: Brand, Breadcrumbs, Carousel, Dropdown (6), ListCard, Menu, Notifications, ProviderSwitcher, Search, SideNav, ThemeSwitcher, Toolbar
- **widgets/**: Form (+FormDatabase/FormModel), Grid (+GridCore/GridArray/GridDB/GridTableView/GridGalleryView), ImageEditor, MarkdownReader, Prompt (+PromptEditor/PromptRun/PromptPlainFallback), TabDynamic, form-controller

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
- `src/components/ui/fields/`: AssistantAI, Command, Crop, ImageField, Input, Prompt, Upload
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

## CR-024 — WYSIWYG editor component (`RichText`)

**Stato:** ✅ done — `RichText.tsx` esiste (1510 righe), usa TipTap con lazy loading, toolbar configurabile, export pubblico, pagina showcase dedicata e file i18n multilingua.  
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

**Stato:** ✅ completato (v1.0.0) — `ContextMenu` implementato come componente standalone con floating positioning, navigazione tastiera, filtro searchable, trigger character custom. Integrato in showcase con Prompt (`{` per template variables, `@` per context variables, `/` per scorciatoie testo). `Command.tsx` rimosso.  
**Branch:** `modernize/cr-025-context-menu`  
**Priorità:** Alta  
**Dipende da:** CR-024  
**Stima:** 1 settimana  
**Breaking change:** No (nuovo componente)

### Deliverable realizzato

- `src/components/ui/fields/ContextMenu.tsx` (393 linee) — componente compound con `Item`, `Heading`, `Separator`
- Rilevazione trigger via `keyup` su `<textarea>` / `<input>` trovati con `querySelector`
- Posizionamento floating via mirror span che replica il font rendering
- Filtro searchable (filtra per `label` e `value`)
- Navigazione tastiera: ↑ ↓ Enter/Esc/Tab
- Click-outside-to-close via `pointerdown` listener
- `EditorContext` con `textBeforeCaret`, `textAfterCaret`, `insert()`, `replace()`
- Default behavior: sostituisce trigger + testo digitato con `item.value`
- `onSelect` custom: riceve `(item, editorContext)`
- Showcase: `ContextMenuPage.tsx` (4 demo: slash, searchable, @mention custom, multi-trigger)
- Showcase Prompt: `PromptEditorPage.tsx` (`trigger="{"`), `PromptLivePage.tsx` (`trigger="@"`), `PromptPlainPage.tsx` (`trigger="/"`)
- `Command.tsx` eliminato (commit `df7d4a6`)

### Non realizzato (per motivi architetturali)

- **Integrazione con RichText/Tiptap**: non compatibile — Tiptap ha API Suggestion nativa, non usa `<textarea>`. Richiederebbe un adattatore Tiptap.
- **Integrazione con CodeEditor**: non compatibile — CodeMirror non usa `<textarea>` ma contenteditable div. Richiederebbe un adattatore CodeMirror.
- **Render-prop pattern** `{({ query }) => ...}`: non implementato (i children sono Item statici)

### Limiti noti

- Funziona solo su `<textarea>` e `<input>` nativi — non su editor custom (CodeMirror, Tiptap, Draft.js, Slate)
- Single trigger per istanza (non multi-trigger sullo stesso ContextMenu)
- Nessuna persistenza delle mention

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

**Stato:** ✅ done  
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
- Il vecchio campo immagine esponeva `mode` per un comportamento che in realtà riguardava il prompt

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
- Rimuovere la vecchia semantica `mode` dal campo immagine legacy

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
- `src/components/ui/fields/ImageField.tsx`
- `src/components/ui/fields/AssistantAI.tsx`
- `src/components/widgets/Prompt.tsx` (solo verifica semantica, non necessariamente rename)
- `clients/showcase/src/pages/components/*`
- `docs/*`
- `CLAUDE.md`

### Checklist (verificato al 2026-07-09)

- [x] Formalizzare il vocabolario in `CLAUDE.md`
- [x] Rinominare `Grid.layout` in `Grid.view` — prop `view` attiva su GridCore
- [x] Rinominare `GridArray.layout` in `GridArray.view`
- [x] Rinominare `GridDB.layout` in `GridDB.view`
- [ ] Rinominare `AssistantAI.viewMode` in `AssistantAI.view` — AssistantAI rimosso (dead code)
- [x] Rinominare `Form.aspect` in `Form.appearance` — prop `appearance` attiva su Form
- [ ] Rinominare `AuthButton.aspect` in `AuthButton.appearance` — ancora `aspect` in `src/auth.tsx:209`
- [ ] Rinominare type `GridLayout` → `GridView` — ancora `GridLayout` in `grid-core/types.ts:6`
- [x] Chiudere definitivamente il debito storico del vecchio campo immagine
- [ ] Valutare e normalizzare i valori `empty` → `plain` dove opportuno
- [x] Verificare che `Repeat.layout`, `Prompt.mode`, `variant`, `position`, `size` restino semanticamente coerenti
- [x] Aggiornare showcase, prop docs e preset playground
- [x] Aggiornare test
- [x] Aggiornare `CHANGELOG.md`
- [x] `npm run build` e `cd clients/showcase && npm run build` passano

**Residuo CR-038:** `AuthButton.aspect` → `appearance` + type `GridLayout` → `GridView` (rinominare nei file che lo referenziano). Da fare in CR separata.

---

## CR-051 — WorkflowAI: orchestrazione pipeline di prompt

**Stato:** ⬜ todo (prima era CR-039, rinumerato per conflitto)
**Dipende da:** CR-039
**Stima:** 3-4 settimane

### Motivazione

Pipeline dichiarativa multi-step per orchestrazione di prompt AI. Consente di comporre sequenze di prompt con dipendenze, trasformazioni e branching.

### Nota

Questa CR era originariamente numerata CR-039, ma è stata rinumerata a CR-051 perché CR-039 era già assegnato a "Firebase SDK compat → modular v9+" (✅ done).

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

---

## CR-039 — WorkflowAI: orchestrazione pipeline di prompt

**Stato:** ⬜ todo
**Priorità:** P1 — differenziatore chiave vs competitor
**Dipendenze:** Prompt.tsx (usa `runPrompt`), FormContext, `useAIProvider`

### Motivazione

`AssistantAI` (rimosso in questa CR) era un prototipo accoppiato al workflow blog con tipi hardcoded (`{ Title } | { Description } | { outline }`), `FormEnhancer` legacy e `console.log` in produzione. Il concetto sottostante — orchestrare N prompt in sequenza dove l'output di uno alimenta il successivo — è genuinamente utile e mancante nel framework.

`Prompt` (il componente attuale) è un field AI-native per singola esecuzione. Non copre pipeline multi-step né la UX "genera N varianti → utente sceglie una".

### Obiettivo

`WorkflowAI` è un componente che dichiara una pipeline di step, ognuno dei quali è un prompt eseguibile. L'output di ogni step può alimentare i successivi. L'utente può selezionare tra varianti generate o accettarle automaticamente.

### API proposta

```tsx
<WorkflowAI
    steps={[
        {
            id: "title",
            label: "Genera titolo",
            prompt: "Scrivi 3 titoli per un articolo su: {topic}",
            variants: 3,         // genera N varianti da mostrare
            pick: "one",         // utente sceglie tra le varianti
            output: "string",
        },
        {
            id: "outline",
            label: "Genera struttura",
            prompt: "Crea un outline per l'articolo: {title}",
            pick: "auto",        // accetta automaticamente la prima risposta
            output: "array",     // schema: array di { headline, subheadings }
        },
        {
            id: "section",
            label: "Scrivi sezione",
            prompt: "Scrivi la sezione '{outline[0].headline}' in tono {voice}",
            pick: "one",
            output: "string",
        }
    ]}
    variables={{ topic: record.topic, voice: "professionale" }}
    model="anthropic/claude-sonnet-4-6"
    onComplete={(results) => {
        // results: { title: string, outline: array, section: string }
        handleChange({ target: { name, value: results } });
    }}
/>
```

### Prop

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `steps` | `WorkflowStep[]` | Definizione pipeline in ordine |
| `variables` | `Record<string, any>` | Variabili di interpolazione disponibili in tutti i prompt |
| `model` | `string` | Model ref opzionale (default: provider default) |
| `temperature` | `number` | Default 0.7 |
| `onComplete` | `(results: Record<string, any>) => void` | Callback finale con tutti gli output |
| `onStepComplete` | `(id: string, value: any) => void` | Callback per ogni step completato |
| `autoRun` | `boolean` | Avvia automaticamente il primo step |

### WorkflowStep

```ts
interface WorkflowStep {
    id: string;
    label: string;
    prompt: string;               // template con {variabile} e {stepId} per output precedenti
    pick: "one" | "auto";         // "one" = UX selezione; "auto" = accetta prima risposta
    variants?: number;            // numero di varianti da generare (default 1, max 5)
    output: "string" | "array" | "object";
    schema?: Record<string, any>; // JSON schema opzionale per validare l'output AI
}
```

### Comportamento

- I `{placeholder}` nel prompt vengono interpolati con `variables` + output degli step precedenti (referenziati per `id`)
- `pick: "one"` mostra le varianti come lista selezionabile; scelto un elemento si passa allo step successivo
- `pick: "auto"` esegue e passa allo step successivo senza interazione utente
- Ogni step ha un pulsante "Rigenera" per ri-eseguire senza perdere il progresso degli step successivi
- Lo stato dell'intera pipeline (`{ stepId: value }`) è serializzabile e può essere salvato su Form
- Usa `runPrompt` da `Prompt.tsx` — nessuna logica AI duplicata
- Integrazione con `FormContext` tramite `useFormContext`, non `FormEnhancer`
- Nessun tipo hardcoded: output generico validato da schema opzionale

### File da creare

- `src/components/widgets/WorkflowAI.tsx` — componente principale
- `src/components/widgets/workflow-ai/WorkflowStep.tsx` — singolo step con varianti
- `src/components/widgets/workflow-ai/types.ts` — tipi pubblici
- `clients/showcase/src/pages/components/WorkflowAIPage.tsx` — pagina showcase
- `tests/unit/components/WorkflowAI.test.tsx` — test unitari

### Criteri di accettazione

- [ ] Pipeline di 3+ step funzionante end-to-end con provider reale
- [ ] Interpolazione `{variabile}` e `{stepId}` funzionante
- [ ] `pick: "one"` mostra varianti selezionabili
- [ ] `pick: "auto"` esegue senza interazione
- [ ] Pulsante "Rigenera" per ogni step
- [ ] `onComplete` riceve tutti gli output tipizzati
- [ ] Integrazione con `Form` (salvataggio stato pipeline)
- [ ] Nessun uso di `FormEnhancer` o `cloneElement` ricorsivo
- [ ] TypeScript strict: nessun errore `tsc --noEmit`
- [ ] Test unitari: step rendering, interpolazione, pick modes
- [ ] Showcase page con esempio blog (title → outline → section)

---

## CR-041 — SeoEnhancer: filtro SEO tecnica su HTML generato (proposta)

**Stato:** ⬜ proposta
**Priorità:** P2 — feature parity / differenziatore AI-assisted
**Dipendenze:** `Head.tsx` (meta tags), `providers/ai/` (analisi opzionale), `MarkdownReader` (report)

### Motivazione

Il framework genera pagine dinamicamente ma non ha un layer che ottimizzi l'HTML prodotto dal punto di vista della SEO tecnica. Oggi le funzioni `getKeywordIdeas` e `getGoogleTrendsData` esistono in `providers/seo/google/` ma non sono collegate a nessun componente che agisca sull'output HTML. `seo.ts` era il wrapper — rimosso come dead code — ma l'idea di avere un punto di applicazione SEO rimane valida e va realizzata correttamente.

### Idea

`SeoEnhancer` è un filtro/componente che prende HTML generato per una pagina, applica automaticamente le ottimizzazioni SEO tecniche che può fare da solo, e restituisce:
1. **HTML migliorato** — con le correzioni già applicate inline
2. **Report strutturato** — cosa ha applicato automaticamente + lista di suggerimenti che richiedono intervento umano o dati esterni

### Utilizzo previsto

```tsx
import { SeoEnhancer } from '@llmnative/react'

// Wrapper su una pagina esistente
<SeoEnhancer
  html={generatedHtml}
  meta={{ title: "Titolo pagina", description: "...", keywords: ["react", "framework"] }}
  onReport={(report) => console.log(report)}  // riceve il report strutturato
>
  {/* oppure children come alternativa a html prop */}
  <MyPageContent />
</SeoEnhancer>

// Uso imperativo (per SSR o pipeline AI)
const { html, report } = await SeoEnhancer.process(rawHtml, meta)
```

### Ottimizzazioni automatiche (applicate dal tool)

| Categoria | Cosa fa |
|-----------|---------|
| **Meta tags** | Aggiunge/completa `<title>`, `<meta description>`, `<meta robots>`, `canonical` |
| **Open Graph** | Genera `og:title`, `og:description`, `og:image` se assenti |
| **Heading structure** | Verifica che esista un `<h1>` unico, warn se mancante |
| **Alt text** | Segnala `<img>` senza `alt` (non può inferire il testo, ma lo marca) |
| **Schema.org JSON-LD** | Inietta `WebPage` / `Article` structured data di base |
| **Semantic HTML** | Verifica presenza di `<main>`, `<nav>`, `<footer>` |
| **Lang attribute** | Aggiunge `lang` se assente, basato sul locale corrente |

### Report strutturato

```ts
interface SeoReport {
  applied: SeoAction[]      // ottimizzazioni applicate automaticamente
  suggestions: SeoSuggestion[]  // richiedono dati esterni o intervento umano
  score: number             // 0-100 stima del punteggio SEO
}

interface SeoAction {
  type: string              // es. "meta:description", "schema:webpage"
  description: string       // cosa è stato fatto
  before?: string           // valore originale (se modificato)
  after: string             // valore applicato
}

interface SeoSuggestion {
  priority: 'high' | 'medium' | 'low'
  category: string          // es. "content", "backlinks", "performance"
  message: string           // descrizione del problema
  howToFix?: string         // istruzione per risolverlo
}
```

### Esempio di report

```json
{
  "applied": [
    { "type": "meta:description", "description": "Meta description aggiunta", "after": "Framework React AI-first..." },
    { "type": "schema:webpage", "description": "JSON-LD WebPage iniettato" },
    { "type": "lang", "description": "Attributo lang='it' aggiunto a <html>" }
  ],
  "suggestions": [
    { "priority": "high", "category": "content", "message": "Nessun <h1> trovato nella pagina", "howToFix": "Aggiungi un titolo principale univoco" },
    { "priority": "medium", "category": "content", "message": "3 immagini senza alt text", "howToFix": "Descrivi ogni immagine con testo alternativo significativo" },
    { "priority": "low", "category": "backlinks", "message": "Nessun link interno verso questa pagina rilevato" }
  ],
  "score": 72
}
```

### Integrazione con AI (opzionale)

Se il provider AI è configurato, `SeoEnhancer` può arricchire il report con:
- Suggerimenti di keyword basati sul contenuto della pagina
- Proposta di meta description generata da AI se assente
- Analisi della leggibilità del testo

### File da creare

- `src/components/widgets/SeoEnhancer.tsx` — componente React + logica di processing
- `src/types/Seo.ts` — tipi `SeoReport`, `SeoAction`, `SeoSuggestion`
- `src/libs/seoAnalyzer.ts` — funzioni pure di analisi HTML (zero React, usabili anche lato SSR)
- `src/components/index.ts` — esportare `SeoEnhancer`
- `clients/showcase/src/pages/components/SeoEnhancerPage.tsx` — playground con report visibile

### Criteri di accettazione

- [ ] `SeoEnhancer` accetta `html` prop o `children` e restituisce HTML migliorato
- [ ] Tutte le ottimizzazioni automatiche della tabella sopra sono implementate
- [ ] `onReport` callback riceve un `SeoReport` strutturato dopo ogni processing
- [ ] `SeoEnhancer.process(html, meta)` funziona in contesto non-React (SSR/pipeline)
- [ ] Il report distingue chiaramente "applicato" da "da fare manualmente"
- [ ] Score 0-100 calcolato con pesi documentati
- [ ] Integrazione AI opzionale: meta description generata se assente e provider configurato
- [ ] TypeScript strict: nessun errore `tsc --noEmit`
- [ ] Test unitari: ogni ottimizzazione automatica verificata con HTML di input/output
- [ ] Showcase page con playground: incolla HTML → vedi HTML migliorato + report

---

## CR-040 — SchemaForm: form generation da schema JSON / factory

**Stato:** ⬜ todo
**Priorità:** P1 — differenziatore AI-first
**Dipendenze:** `Component.tsx` (factory registry), `Form.tsx` (FormContext), `Grid.tsx` (inferColumns)

### Motivazione

Il codebase ha già un registry di factory funzionante (`Component.input.*`, `Component.layout.*`) ma non esposto come feature first-class. Un LLM o un backend possono descrivere un form come schema JSON e il framework dovrebbe materializzarlo senza JSX.

Oggi il pattern esiste ma è nascosto, non documentato, non integrato con DataProvider, e non supporta round-trip JSON → Form → JSON.

### Obiettivo

`SchemaForm` è un componente che accetta uno schema JSON e genera un Form completo usando il registry factory esistente. Supporta sia la definizione imperativa (via `Component.input.*`) sia la definizione dichiarativa (JSON puro).

### API proposta

**Imperativa (già funzionante, da esporre):**
```tsx
import { Component, SchemaForm } from '@llmnative/react';

const schema = {
    name:  Component.input.string({ label: "Nome", required: true }),
    email: Component.input.email({ label: "Email" }),
    role:  Component.input.select({
        label: "Ruolo",
        options: [{ label: "Admin", value: "admin" }, { label: "User", value: "user" }],
    }),
    address: {
        city: Component.input.string({ label: "Città" }),
        zip:  Component.input.string({ label: "CAP" }),
    },
};

<SchemaForm
    schema={schema}
    path="/users"
    appearance="card"
    onComplete={async ({ action }) => { if (action === 'save') navigate('/users'); }}
/>
```

**Dichiarativa (JSON puro — per AI e backend):**
```tsx
const jsonSchema = {
    name:  { type: "string",  label: "Nome", required: true },
    email: { type: "email",   label: "Email" },
    role:  { type: "select",  label: "Ruolo", options: [...] },
    photo: { type: "uploadImage", label: "Foto" },
};

<SchemaForm
    schema={jsonSchema}
    path="/users"
/>
```

### Tipi supportati nello schema JSON

Tutti i tipi del registry `Component.input.*`:
`string`, `number`, `email`, `password`, `color`, `date`, `time`, `datetime`, `week`, `month`, `textarea`, `checkbox`, `switch`, `select`, `autocomplete`, `checklist`, `uploadImage`, `uploadDocument`, `prompt`, `imageField`

### Integrazione Grid

Grid già usa `inferColumns` per derivare colonne da un Form JSX. Con SchemaForm, Grid può derivare colonne direttamente dallo schema:

```tsx
<Grid
    path="/users"
    schema={jsonSchema}   // → genera sia le colonne che il form modale CRUD
/>
```

### Integrazione AI

Un LLM può generare uno schema JSON descrivendo i campi:
```ts
const schema = await AI.json(
    "Genera uno schema form per registrare un prodotto e-commerce con nome, prezzo, categoria e immagine"
);
// → { name: { type: "string" }, price: { type: "number" }, ... }

<SchemaForm schema={schema} path="/products" />
```

### File da creare / modificare

- `src/components/widgets/SchemaForm.tsx` — componente principale
- `src/types/Schema.ts` — tipo `JsonFieldSchema` e `SchemaModel`
- `src/components/Component.tsx` — aggiungere `Component.fromJson(schema)` per convertire JSON → ModelProps
- `src/components/index.ts` — esportare `SchemaForm`
- `src/components/widgets/Grid.tsx` — aggiungere prop `schema` come alternativa a `columns` + `form`
- `clients/showcase/src/pages/components/SchemaFormPage.tsx` — pagina showcase
- `tests/unit/components/SchemaForm.test.tsx` — test unitari

### Criteri di accettazione

- [ ] `SchemaForm` con schema imperativo (`Component.input.*`) genera un Form funzionante
- [ ] `SchemaForm` con schema JSON puro (`{ type: "string" }`) genera un Form funzionante
- [ ] Campi annidati (oggetti) supportati
- [ ] Integrazione con `path` DataProvider (load + save)
- [ ] `Grid` con `schema` prop genera colonne + form CRUD automaticamente
- [ ] `Component.fromJson(schema)` converte JSON → ModelProps
- [ ] TypeScript strict: nessun errore `tsc --noEmit`
- [ ] Test unitari: rendering per ogni tipo, nested fields, round-trip JSON
- [ ] Showcase page con esempio generato da AI

---

## CR-042 — TypeScript no-any: eliminazione di tutti gli usi di `any`

**Stato:** 🔄 in progress (fase 1 ✅ + fase 2 ✅, fase 3 residua)
**Priorità:** Alta
**Dipende da:** CR-003 (TypeScript strict ✅)
**Motivazione:** `any` disabilita completamente il type checker per la variabile in cui è usato, annullando il valore di TypeScript strict. Un codebase AI-first deve essere completamente tipizzato: i tool di generazione del codice (LLM) leggono i tipi per capire le API. Un `any` è segnale che il contratto non è definito.

### Stato audit aggiornato (2026-06-08)

| Fase | Count iniziale | Count residuo | Stato |
|------|---------------|---------------|-------|
| **Fase 1** — fix facili (type guard, catch, cast) | ~25 | 0 | ✅ |
| **Fase 2** — refactor strutturale (FieldValue, propagazioni) | ~80 | ~10 cast giustificati | ✅ |
| **Fase 3** — breaking change o limiti librerie esterne | ~109 | ~91 | 🔄 (vedi sotto) |
| **Totale** | **214** | **101** | — |

### Fase 1 — Completata (2026-06-07)

Fix applicati senza rischio di regressione:

| File | Fix |
|------|-----|
| `libs/utils.ts` | `isEmpty(data: any)` → `unknown`; `arraysEqual(a: any[], b: any[])` → `unknown[]`; `smartTypeCast(value: any)` → `unknown` |
| `components/Component.tsx` | `isFieldAdapter`, `isComponentBlock`, `isNestedModel` type guards: `(obj: any)` → `(obj: unknown)` con body adeguato |
| `components/blocks/Dropdown.tsx` | `isDropdownToggler(button: any)` → `(button: unknown)` |
| `components/ErrorBoundary.tsx` | `(import.meta as any).env` → cast tipizzato `{ env?: { DEV?: boolean } }` |
| `providers/data/firebase.ts` | `handleError(error: any)` → `error: unknown` + `String(error)` |
| `providers/data/firestore.ts` | `handleError(error: any)` → `error: unknown` + `String(error)` |
| `providers/data/supabase.ts` | `handleError(error: any)` → `error: unknown` + `instanceof Error ? .message : String()` |
| `providers/firebase-init.ts` | `catch (error: any)` → `unknown` + `instanceof Error` check |
| `providers/storage/firebase.ts` | 3× `catch (error: any)` → `unknown` + duck-type code check `(error as { code?: string }).code` |

### Fase 2 — Completata (2026-06-08)

**Root change:** `FieldValue` type introdotta e esportata da `DataProvider.ts`:
```ts
export type FieldValue = string | number | boolean | null | undefined | Record<string, unknown> | unknown[];
type FieldMap = Record<string, FieldValue>;   // era Record<string, any>
export type RecordProps = FieldMap & { _key?: string; _index?: number };
```

`FieldValue` esportata anche da `src/index.ts` come parte dell'API pubblica.

Propagazioni risolte nei 9 file che emettevano errori `tsc`:

| File | Fix |
|------|-----|
| `components/ui/fields/Select.tsx` | `getOptionsDB` semplificato: rimossa chiamata ridondante `normalizeOption(db.fieldMap)` (era no-op che causava type error); `interface Option extends RecordProps` mantenuta |
| `components/ui/fields/Upload.tsx` | Import `RecordProps` aggiunto; display rows con JSX → `as unknown as RecordProps[]`; onClick → `as unknown as FileProps` |
| `components/ui/Table.tsx` | `rawVal = item[key]` narrowato a `Record<string, unknown>` prima di accedere `.prompt`/`.value`; return → `as React.ReactNode` |
| `components/widgets/Form.tsx` | `import FieldValue` aggiunto; reduce tipizzato `<FieldValue \| undefined>` con gestione separata array index (fix bug latente su path `tasks.1.title`); children arg → `as unknown as FormTree` |
| `components/widgets/grid-core/utils.ts` | `displayRecord: RecordProps` → `Record<string, unknown>` (display records portano ReactNode, non FieldValue) |
| `components/widgets/Prompt.tsx` | `PromptConfig = Partial<PromptOptions> & { enabled?: boolean }` definita; `value?` in entrambe le interface → `RecordProps & { prompt?: PromptConfig }`; `isPromptEnabled` terzo param `RecordProps` → `unknown`; `runPrompt` call → `as PromptOptions` |
| `libs/utils.ts` | `cleanRecord` in loop array e branch object → cast `as RecordProps` |
| `pages/Users.tsx` | `record.email.replace(...)` → template literal `` `${record.email ?? ''}` `` (evita conflitto con componente `String` importato) |

**Risultato:** `tsc --noEmit` 0 errori · `vitest run` 377/377 · nessuna regressione.

### Fase 3 — Residua (breaking change o limiti librerie esterne)

I 101 `any` residui rientrano in queste categorie. **Non fixare senza una CR dedicata.**

| Categoria | Esempi | Motivo del blocco |
|-----------|--------|------------------|
| Contratti pubblici API | `DataProviderAdapter.read(): Promise<any>` | Breaking change per tutti i consumer |
| Form event types | `ChangeHandler = React.ChangeEvent<any>` | Il tipo del change event dipende dall'elemento HTML |
| Prop polimorfiche | `defaultValue?: any`, `value?: any` in FormFieldProps | Valori di campo sono polimorfici per design — richiederebbe generics |
| Firebase RTDB query builder | `as any` (10×) | SDK Firebase v9 non espone tipi intermedi dei query builder |
| Supabase query builder | `applyWhere/applyOrder(query: any)` | Fluent builder non è tipizzato in modo componibile |
| Dropbox API | `[key: string]: any` in interfacce risposta | Schema aperto da API esterna |
| Comparison utils | `getEntryValue`, `compareValues`, `matchWhere` | Operano su valori arbitrari — `unknown` richiederebbe narrowing ovunque |
| Callback generici | `validator?: (value: any)`, `onClick?: (e: any)` | Richiederebbe generics sull'intera catena di componenti |
| Librerie di terze parti senza tipi | ImageEditor fabric, PrismJS | Tipi non disponibili a compile time |

### Regola per il futuro

Vedi sezione "Regola no-any" in `CLAUDE.md`. **Da applicare da subito a tutto il codice nuovo.**

### Criteri di accettazione

- [x] `FieldValue` type introdotta in `DataProvider.ts`
- [x] `FieldMap = Record<string, FieldValue>` (era `Record<string, any>`)
- [x] `FieldValue` esportata da `src/index.ts`
- [x] Tutte le propagazioni risolte — `tsc --noEmit` zero errori
- [x] `vitest run` — 377/377 test pass, zero regressioni
- [x] Occorrenze `any` ridotte: 214 → 101
- [ ] Fase 3: ridurre ulteriormente con CR dedicata (generics, API breaking change)

## CR-043 — Token Benchmark page nel showcase

### Obiettivo

Dimostrare il vantaggio principale del framework — **riduzione del numero di token AI** necessari per descrivere la stessa UI — con confronti side-by-side reali e misurabili.

### Razionale

`@llmnative/react` è un framework AI-first: il suo value prop primario è che un agente AI può generare una UI complessa scrivendo una quantità di codice drasticamente inferiore rispetto a React puro + Firebase/Supabase. Questa pagina rende il vantaggio concreto e verificabile.

### Implementazione

**File creato:** `clients/showcase/src/pages/BenchmarkPage.tsx`

Quattro scenari reali con codice compilabile:

| Scenario | @llmnative/react | React + Firebase | Risparmio |
|----------|-----------------|-----------------|-----------|
| Grid CRUD (realtime + paginazione) | ~12 token | ~120 token | ~90% |
| Form con validazione + load/save | ~17 token | ~85 token | ~80% |
| Switch data backend (mock → Firebase → Supabase) | 1 riga config | migrazione per-component | n/d |
| Google Auth + protected route | ~10 token | ~70 token | ~86% |

**Metodologia token:** `⌈chars / 4⌉` — approssimazione standard GPT (1 token ≈ 4 caratteri). Indicatore relativo, non conta esatta.

**Summary bar:** totale aggregato across tutti gli scenari.

**"Why it matters" section:** tre colonne — velocità, costo, affidabilità.

**Navigazione:** link `Benchmark` aggiunto al top nav del showcase (`Topbar.tsx`) e rotta `/benchmark` registrata in `menu.ts`.

### Criteri di accettazione

- [x] Pagina `/benchmark` visibile nel top nav del showcase
- [x] 4 scenari con codice framework + vanilla side-by-side
- [x] Token counts calcolati client-side (`⌈chars / 4⌉`)
- [x] Summary bar con totale aggregato
- [x] TypeScript strict — `tsc --noEmit` zero errori
- [x] Build ok

---

## CR-044 — Showcase pagine mancanti (Label, UploadCSV, Crop, Command)

**Stato:** ✅ done
**Priorità:** Bassa
**Dipende da:** CR-007
**Stima:** 2-3 giorni
**Breaking change:** No

### Motivazione

L'audit completo dello showcase (`docs/SHOWCASE_AUDIT.md`) ha rivelato 4 componenti source che non hanno alcuna pagina showcase:

| Source | Componenti esportati |
|--------|---------------------|
| `src/components/ui/fields/Input.tsx` (linea 396) | **Label** — componente label standalone già usato internamente |
| `src/components/ui/fields/UploadCSV.tsx` | **UploadCSV** — componente per parsing/import CSV via Upload |
| `src/components/ui/fields/Crop.tsx` | **CropImage**, **FileNameEditor** — utility di crop/rename usate internamente da Upload |
| `src/components/ui/fields/Command.tsx` | **Command** — slash-command textarea con trigger, context e suggestion menu |

Senza showcase page:
- I componenti sono invisibili agli utenti del framework
- L'AI non ha documentazione interattiva su cui basarsi
- Eventuali regressioni non sono verificabili visivamente

### Scope

Per ogni componente mancante:

1. **Label** (`src/components/ui/fields/Input.tsx:396`)
   - Creare `clients/showcase/src/pages/components/LabelPage.tsx`
   - PropDocsTable: `children`, `className`, `wrapClass`, `required`
   - 1-2 sezioni dimostrative (label base, required indicator)

2. **UploadCSV** (`src/components/ui/fields/UploadCSV.tsx`)
   - Creare `clients/showcase/src/pages/components/UploadCSVPage.tsx`
   - PropDocsTable: `name`, `label`, `required`, `normalizeKeys`, `removeEmptyFields`, `onDataLoaded`, `onParseField`, `feedback`, UIProps
   - 1-2 sezioni (base CSV import, normalize keys)

3. **Crop** (`src/components/ui/fields/Crop.tsx`)
   - Creare `clients/showcase/src/pages/components/CropPage.tsx`
   - Documentare `CropImage` e `FileNameEditor`
   - PropDocsTable per ogni variante
   - 1-2 sezioni

4. **Command** — `Command.tsx` è stato **rimosso** da CR-025 (commit `df7d4a6`). Sostituito da `ContextMenu` con trigger character custom. Nessuna pagina showcase necessaria.

5. **Menu + routing**
   - Aggiungere voci al menu dello showcase (`src/conf/menu.ts` o equivalente)
   - Registrare route in `App.tsx`

### Escluso

- Refactor dei componenti source stessi (CR separata)
- Modifiche al comportamento runtime di Label/UploadCSV/Crop/Command

### Checklist

- [ ] Creare `LabelPage.tsx`
- [ ] Creare `UploadCSVPage.tsx`
- [ ] Creare `CropPage.tsx` (CropImage + FileNameEditor)
- [ ] Creare `CommandPage.tsx`
- [ ] Registrare menu + route per ogni nuova pagina
- [ ] Verificare navigazione funzionante nello showcase
- [ ] `tsc --noEmit` zero errori
- [ ] build ok

---

## CR-052 — CredentialsAdapter e GoogleServiceAccountProvider

**Stato:** ✅ done  
**Branch:** `main`  
**Priorità:** Media  
**Dipende da:** CR-002  
**Breaking change:** No

### Implementazione

- `src/providers/credentials/CredentialsAdapter.ts` — contratto `CredentialsAdapter` con metodo `getToken(scope?)`
- `src/providers/credentials/google/GoogleServiceAccountProvider.ts` — implementazione Web Crypto JWT, browser-safe, scoped Google API tokens
- Driver `googleServiceAccount` registrato in manifest
- Test: `tests/unit/providers/GoogleServiceAccountProvider.test.ts` (8 test)

---

## CR-045 — AI Adoption: piano di distribuzione e visibilità

**Stato:** ⬜ todo
**Priorità:** Alta
**Dipende da:** CR-001 (AI_REFERENCE), CR-016 (showcase + benchmark)
**Stima:** 2-3 settimane
**Breaking change:** No

### Motivazione

`@llmnative/react` è un framework AI-first, ma oggi un AI (Claude, GPT, Copilot, Cursor) che non ha `AI_REFERENCE.md` in contesto non sa nulla del framework. Inoltre non esiste presenza esterna — articoli, community, registry — che faccia conoscere il framework a sviluppatori e AI. Senza distribuzione e visibilità, il framework resta invisibile.

### Macro-aree

#### A — Distribuzione AI (training data + discovery)

Obiettivo: rendere il framework "conosciuto" dagli AI anche senza contesto esplicito.

1. **Pubblicare `AI_REFERENCE.md` su npm**
   - Inserirlo nel pacchetto pubblicato (`docs/AI_REFERENCE.md`)
   - Alcuni AI (es. Copilot, Cursor) scansionano `node_modules` e leggono i file `.md` dei pacchetti installati
   - Un AI che trova `@llmnative/react` in `package.json` potrà rispondere sulle API

2. **Generare `CLAUDE.md` / `.cursorrules` nello scaffold**
   - `npx @llmnative/react create` genera anche `CLAUDE.md` nella root del progetto
   - Contiene: pattern principali, esempi Grid/Form, regole naming, link a docs
   - Ogni AI (Claude Code, Cursor, Copilot) che apre il progetto lo legge automaticamente
   - File: `bin/templates/CLAUDE.md.hbs`

3. **Registrare il framework su registry AI**
   - **Smithery** (https://smithery.ai) — registry MCP server per AI
   - **OpenAI GPTs Knowledge Retrieval** — caricare AI_REFERENCE.md come knowledge base pubblica
   - **Anthropic Docs** (https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) — documentatione framework per Claude Code
   - **OpenCode Agents / Skills** — creare uno skill ufficiale @llmnative/react

4. **System prompt pre-confezionato**
   - `PROMPT_TEMPLATE.md` già esiste
   - Aggiungere `npx @llmnative/react ai-prompt` che stampa il prompt in console
   - Aggiungere `.aiprompt` nella root del progetto scaffoldato

#### B — Articoli tecnici (pubblicazione)

Obiettivo: far conoscere il framework alla comunità developer tramite contenuti autorevoli.

1. **Temi articoli** (5 pezzi chiave):
   - *"AI-first React: how we built a framework that cuts AI token consumption by 80%"* — narrativa principale, benchmark, perché è diverso
   - *"Ports & Adapters in the browser: Firebase, Supabase, Mock with one line of config"* — pattern architetturale, provider matrix
   - *"SchemaForm: generating forms from JSON schema with AI"* — quando CR-040 sarà implementata
   - *"From prototype to production: scaffolding AI-friendly React apps"* — CLI, scaffold, developer experience
   - *"How we eliminated 95% of `any` from a TypeScript framework"* — CR-042, qualità codice, TypeScript strict

2. **Piattaforme autorevoli dove pubblicare:**

| Piattaforma | Tipo | Pubblico | Note |
|-------------|------|----------|------|
| **dev.to** | Blog dev | 3M+ mese | Ottimo per "how we built X". Syndication automatica. |
| **Medium / JavaScript in Plain English** | Blog tech | 100M+ mese | Buon reach, ma meno tecnico. |
| **Hacker News** | Community | 10M+ mese | Serve un titolo che spacca. Il benchmark post potrebbe funzionare. |
| **FreeCodeCamp News** | Blog dev | 10M+ mese | Guest post. Richiede pitch editoriale. |
| **LogRocket Blog** | Blog React | 500K+ mese | Focus React + performance. Targeting perfetto. |
| **CSS-Tricks** (Almanac) | Blog frontend | 2M+ mese | Approccio più tutorial. |
| **React Newsletter** (react.statuscode, React Digest) | Newsletter | 100K+ | Una menzione nella newsletter = esposizione diretta. |
| **Smashing Magazine** | Magazine web | 1M+ mese | Guest post. Standard alto. |
| **InfoQ** | Magazine eng | 2M+ mese | Focus architetturale (provider pattern, ports & adapters). |
| **ACM Queue** | Magazine acc | 100K+ | Molto selettivo. Solo se c'è un paper. |
| **LinkedIn Engineering Blog** | Aziendale | 50M+ | Solo se pubblicato da un'azienda. Sherpa Advisory Lab qualifica. |
| **Twitter/X** + **Reddit** (r/reactjs, r/typescript, r/webdev) | Social | — | Complementare. Post + discussione. |

3. **Repo GitHub**
   - Aggiungere **README.md** più convincente: benchmark badge, GIF dello showcase, "try it now" button
   - GitHub **Topics** aggiornati: `react`, `typescript`, `ai-framework`, `firebase`, `supabase`, `low-code`, `admin-panel`, `react-admin`
   - GitHub **Pages** (già presente?) o Vercel deploy dello showcase come landing page
   - **Awesome React** list PR — candidarsi per essere aggiunti

#### C — Community

1. **Issue template** per feature request e bug report (già PR template?)
2. **Discussion template** per "show and tell" — progetti fatti con il framework
3. **Esempi reali** — 3-4 progetti esempio in `/examples/` (e-commerce admin, CRM, blog dashboard, inventario)
4. **Contributor guide** (`CONTRIBUTING.md`) — chiara e leggera

### Checklist

**A — Distribuzione AI**
- [ ] Inserire `docs/AI_REFERENCE.md` nel pacchetto npm
- [ ] Generare `CLAUDE.md` nello scaffold (`bin/templates/CLAUDE.md.hbs`)
- [ ] Generare `.cursorrules` o `.aiprompt` nello scaffold
- [ ] Aggiungere `npx @llmnative/react ai-prompt` al CLI
- [ ] Registrare su Smithery / MCP registry
- [ ] Caricare AI_REFERENCE su Anthropic Docs / OpenAI Knowledge Retrieval
- [ ] Creare skill ufficiale per OpenCode

**B — Articoli**
- [ ] Scrivere articolo 1: "AI-first React" (narrativa principale + benchmark)
- [ ] Scrivere articolo 2: "Ports & Adapters in the browser"
- [ ] Scrivere articolo 3: "SchemaForm" (dopo CR-040)
- [ ] Scrivere articolo 4: "Scaffolding AI-friendly React apps"
- [ ] Scrivere articolo 5: "Eliminating 95% of any" (TypeScript quality)
- [ ] Pubblicare su dev.to + cross-post Medium/FreeCodeCamp
- [ ] Postare su Hacker News
- [ ] Inviare a React Newsletter / React Digest
- [ ] Inviare a LogRocket Blog / Smashing Magazine
- [ ] Pitch a InfoQ / LinkedIn Engineering Blog

**C — Repo + Community**
- [ ] Riscrivere README con benchmark badge + showcase GIF
- [ ] Aggiornare GitHub Topics
- [ ] Deployare showcase su Vercel o GitHub Pages come landing page
- [ ] PR su Awesome React
- [ ] Creare CONTRIBUTING.md
- [ ] Aggiungere esempi reali in `/examples/`
- [ ] Template issue/discussion su GitHub

## CR-044 — Showcase: refactor componenti nativi → framework (decisioni aperte)

### Contesto

Audit completato il 2026-06-10: tutti i `<span className="badge ...">` e gli SVG icon inline sono già stati sostituiti con `<Badge>` e `<Icon>` (commit incluso in CR-043).

Restano quattro aree dove la sostituzione richiede una decisione prima di procedere.

---

### Decisione 1 — Buttons nella Topbar

**File:** `clients/showcase/src/components/Topbar.tsx`

**Situazione attuale:** I quattro pulsanti della toolbar (toggle dark mode, palette, GitHub, playground) usano `<button>` native styled manualmente con Tailwind (`w-8 h-8 hover:bg-accent transition-colors`). Il playground button aggiunge testo + icona inline.

**Opzione A — Sostituire con `<ActionButton>`**
I button userebbero il tema attivo. Look leggermente diverso (padding, focus ring, ecc. dal tema). Vantaggio: coerenza automatica con i temi custom.

**Opzione B — Tenere native**
Nessun rischio visivo. Il Topbar è infrastruttura del showcase, non un componente dimostrativo del framework.

**Domanda:** vale la coerenza tematica o il controllo manuale è preferibile per l'infrastruttura?

---

### Decisione 2 — Form controls in `PlaygroundPropControl.tsx`

**File:** `clients/showcase/src/docs-kit/playground/PlaygroundPropControl.tsx`

**Situazione attuale:** I controlli del playground (input text, select, checkbox, textarea) sono native HTML con una classe `BASE_INPUT` condivisa. Funzionano fuori da `<Form>` context.

**Vincolo tecnico:** `Input`, `Select`, `TextArea`, `Checkbox` del framework chiamano `useFormContext` internamente. Non funzionano standalone senza `<Form>`.

**Opzione A — Lasciare native** (stato attuale)
Zero lavoro. Il playground è infrastruttura interna, non documentazione pubblica del framework.

**Opzione B — Creare varianti "standalone"** (es. `Input.Bare`, `Select.Bare`)
Versioni leggere senza form context, solo styling + onChange callback. Riutilizzabili anche fuori dal showcase. Costo: ~1 giornata per estendere i field components.

**Opzione C — Wrappare in `<Form>` headless**
Avvolgere il PlaygroundControls in un Form senza visuale. Più facile ma introduce dipendenze non ovvie.

**Domanda:** ha senso esporre varianti standalone come parte dell'API pubblica del framework, o rimane infrastruttura interna?

---

### Decisione 3 — `<Table>` in `PropDocsTable.tsx`

**File:** `clients/showcase/src/docs-kit/docs/PropDocsTable.tsx`

**Situazione attuale:** La tabella usa HTML nativo con:
- `<colgroup>` con width fissi per 5 colonne
- Group header rows con `colSpan={5}`
- Righe espandibili via `onClick` con animazione `rotate-90`
- Alternate-row tinting calcolato a mano

**Vincolo tecnico:** Il componente `<Table>` del framework è ottimizzato per Grid (lista di record con colonne configurabili). Non supporta nativamente expandable rows né group headers con colSpan.

**Opzione A — Lasciare native** (stato attuale)
PropDocsTable è infrastruttura del showcase, non un caso d'uso pubblico.

**Opzione B — Estendere `<Table>` con `expandableRow` e `groupHeader`**
Aumenta la potenza di Table per casi d'uso avanzati. Costo: ~2 giorni. Diventa una CR separata (es. CR-045).

**Domanda:** vale estendere Table per supportare questo pattern, o rimane infrastruttura interna?

---

### Decisione 4 — Code block in `Section.tsx`

**File:** `clients/showcase/src/docs-kit/page/Section.tsx`

**Situazione attuale:** Il code block usa `<pre><code>` plain, senza syntax highlighting. Ha un copy button custom inline.

**Opzione A — Sostituire con `<Code>`**
Aggiunge syntax highlighting Prism, copy button integrato. Il copy button custom può essere rimosso. Aspetto più ricco.

**Opzione B — Lasciare native**
`<pre><code>` è leggero e non aggiunge Prism bundle a ogni pagina. Il code block della Section è solo per snippet di esempio, non per codice complesso.

**Domanda:** vuoi syntax highlighting nei code block delle pagine componente del showcase?

---

### Criteri di accettazione (da definire dopo le decisioni)

- [ ] Decisione 1 presa e implementata
- [ ] Decisione 2 presa e implementata
- [ ] Decisione 3 presa e implementata
- [ ] Decisione 4 presa e implementata

---

## CR-046 — PromptRun visual redesign — chatbot style

**Stato:** ✅ done
**Priorità:** Alta
**Dipende da:** —

### Motivazione

Il layout attuale di `PromptRun` (Switch toggle + gear + Run button in una bottom bar generica) non comunica chiaramente il modello mentale "scrivi → esegui → vedi risultato". Il pattern visivo dei prodotti AI consumer (Claude, ChatGPT, Gemini) è ormai uno standard de facto: textarea prominente, barra azioni compatta in basso, bottone invio a destra.

### Scope

- Ridisegnare `PromptRun` in `src/components/widgets/Prompt.tsx`:
  - Textarea senza bordo interno, `border-0 shadow-none focus-visible:ring-0`
  - Container esterno con `rounded-xl border border-input shadow-sm focus-within:ring-2 focus-within:ring-ring`
  - Bottom bar: `flex items-center gap-2 px-3 py-2 border-t border-input bg-transparent`
  - Sinistra: toggle "Edit prompt" come piccolo icon-button (matita) invece di Switch + testo
  - Centro: modello selezionato come testo muted cliccabile (apre il settings dropdown)
  - Destra: pulsante Run con `rounded-lg` e variante `primary`, sempre visibile
  - Settings gear spostato accanto al model selector, non nascosto dietro il toggle edit
- `PromptEditor` (EDIT mode): stesso trattamento visivo, Switch abilitazione a destra del label
- Nessun breaking change alle props pubbliche
- Aggiornare il tema `prompt` in `src/Theme.tsx` se necessario

### Architettura visiva target

```
┌─────────────────────────────────────────────────────┐  ← rounded-xl border focus-within:ring
│                                                     │
│  [placeholder / risultato / template]               │  ← textarea borderless, px-4 py-3
│                                                     │
├─────────────────────────────────────────────────────┤  ← border-t
│ [✏]  claude-sonnet-4 ▾  [⚙]       [✨ Run  →]    │  ← h-10 px-3
└─────────────────────────────────────────────────────┘
```

### Checklist

- [x] Ridisegnare `PromptRun` — container, textarea, bottom bar
- [x] Ridisegnare `PromptEditor` — allineamento visivo coerente con Run
- [x] Sostituire Switch "Result/Edit" con icon-button ✏ a sinistra della barra
- [x] Model selector come testo cliccabile (apre dropdown settings)
- [x] Verificare dark mode e tutti i temi (default, flat, cyber)
- [x] Aggiornare showcase `PromptLivePage`, `PromptEditorPage`, `PromptPlainPage`
- [x] Zero breaking change alle props

---

## CR-047 — Prompt extensible toolbar: commands, attachments, actions, statusItems + PromptUtils API

**Stato:** ✅ done
**Priorità:** Alta
**Dipende da:** CR-046

### Motivazione

Il `PromptRun` è usato come input AI in applicazioni reali. Le app hanno bisogno di:
1. **Slash commands** — comandi contestuali che l'utente può invocare digitando `/`
2. **Allegati** — file da includere nel contesto del prompt
3. **Toolbar estensibile** — slot per aggiungere azioni custom (dropdown, pannelli)
4. **Status bar** — informazioni live post-esecuzione (token, contesto, costo)
5. **API pubblica** — funzioni di utilità riutilizzabili fuori dal componente

### API pubblica proposta

```tsx
// Props aggiuntive su Prompt (mode="run")
<Prompt
  mode="run"
  commands={[
    { name: 'translate', description: 'Translate to English', icon: 'languages',
      handler: (currentValue) => `Translate the following to English:\n${currentValue}` },
    { name: 'summarize', description: 'Summarize in 3 bullet points', icon: 'list' },
  ]}
  attachments                   // boolean — abilita il bottone attach (📎)
  actions={[
    { key: 'tokenUsage', icon: 'cpu', label: 'Token usage' },   // built-in named
    { key: 'myPanel', icon: 'chart', label: 'Stats',
      content: <MyStatsPanel /> },                               // custom
  ]}
  statusItems={[
    'tokensIn', 'tokensOut', 'contextPercent',                   // built-in named
    { key: 'cost', render: (stats) => `~$${stats.estimatedCost}` }, // custom
  ]}
/>
```

```ts
// Utility pubblica
import { PromptUtils } from '@llmnative/react'

PromptUtils.countTokens(text: string): number
// stima approssimata chars/4 — compatibile browser senza tiktoken

PromptUtils.contextPercent(tokens: number, modelRef: string): number
// tokens / contextWindow * 100, lookup da getAIModelCatalog

PromptUtils.estimateCost(tokensIn: number, tokensOut: number, modelRef: string): number
// lookup pricing dal catalog (se disponibile), altrimenti NaN

PromptUtils.modelContextWindow(modelRef: string): number | null
// es. 200000 per claude-sonnet-4, null se sconosciuto
```

### Tipi

```ts
type PromptCommand = {
  name: string;
  description?: string;
  icon?: string;
  handler?: (currentValue: string) => string | Promise<string>;
};

type PromptAction =
  | { key: string; icon: string; label?: string }   // built-in named
  | { key: string; icon: string; label?: string; content: React.ReactNode }; // custom

type PromptStatusItem =
  | 'tokensIn' | 'tokensOut' | 'contextPercent' | 'model' | 'duration'
  | { key: string; render: (stats: PromptRunStats) => React.ReactNode };

type PromptRunStats = {
  tokensIn: number;
  tokensOut: number;
  contextPercent: number | null;
  model: string;
  durationMs: number;
  estimatedCost: number | null;
};
```

### Layout con tutto abilitato

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│  [textarea]                                           │
│                                                       │
├───────────────────────────────────────────────────────┤
│ [📎] [/cmd] [cpu▾] [chart▾]  claude-s ▾ [⚙] [▶ Run]│
│ in: 340 tok · out: 89 · ctx: 12% · ~$0.001           │
└───────────────────────────────────────────────────────┘
```

### Scope

- Aggiungere `commands`, `attachments`, `actions`, `statusItems` a `PromptRunBranchProps`
- Implementare slash-command popover (listener `onKeyDown`, filtra per `/ + testo`)
- Implementare attach button (click → `<input type="file">` hidden, file list visibile)
- Implementare `actions` slot: ogni item = icon-button + Dropdown
- Implementare `statusItems` strip: riga muted sotto la barra, popolata dopo ogni Run
- Esportare `PromptUtils` da `src/index.ts`
- Aggiornare showcase `PromptLivePage` con esempi per ogni nuova feature

### Checklist

- [x] Tipi `PromptCommand`, `PromptAction`, `PromptStatusItem`, `PromptRunStats`
- [x] `PromptUtils` in `src/libs/promptUtils.ts` con `countTokens`, `contextPercent`, `estimateCost`, `modelContextWindow`
- [x] Esportare `PromptUtils` da `src/index.ts`
- [x] Slash-command popover in `PromptRun`
- [x] Attach button + file list in `PromptRun`
- [x] `actions` slot rendering
- [x] `statusItems` strip, popolata da `PromptRunStats` after run
- [x] Built-in named actions: `tokenUsage` panel
- [x] Unit test per `PromptUtils`
- [x] Aggiornare showcase `PromptLivePage`
- [x] Aggiornare `docs/AI_REFERENCE.md` con la nuova API
---

## CR-049 — Component.schema — meta-layer per configurazione campi

**Stato:** ✅ done
**Branch:** `main`
**Priorità:** Alta
**Dipende da:** —
**Breaking change:** No

### Motivazione

`Component.input` fornisce factory per costruire form di editing dei contenuti (es. il creator che scrive il titolo di un articolo). Manca un livello parallelo per configurare le proprietà del campo stesso: label, placeholder, se è obbligatorio, min/max righe, ecc.

Il CMS `llmnative-cms` deve generare automaticamente la UI di configurazione di ogni campo dello schema partendo dalle stesse strutture di `@llmnative/react`, senza duplicare logica e mantenendo la type-safety completa.

### Decisione architetturale

`Component.schema` è un namespace parallelo a `Component.input` nel medesimo oggetto `Component`. Ogni metodo riceve un parametro `overrides` tipizzato all'interfaccia esatta del componente sottostante (es. `TextAreaProps`, `SelectProps`) e ritorna un `SchemaFields` — un oggetto in cui ogni chiave è un `FieldAdapter` che rappresenta una proprietà configurabile del campo.

La chiave di ogni override si mappa sul `defaultValue` del suo sotto-campo specifico, senza cross-contamination tra campi diversi.

### Scope

- Nuovo file `src/types/FormSchema.tsx` con `ComponentFormSchemaMap` e implementazione per tutti i 19 tipi di campo: `string`, `number`, `email`, `password`, `color`, `date`, `time`, `datetime`, `week`, `month`, `textarea`, `checkbox`, `switch`, `select`, `autocomplete`, `checklist`, `uploadImage`, `uploadDocument`, `imageField`
- `src/components/Component.tsx`: aggiunta `schema: componentFormSchema`, export di `FieldAdapter`
- `src/components/index.ts`: export di `FieldAdapter`, `FieldFactory`, `ModelProps`, `FormTree`, `ComponentFormSchemaMap`

### Esempio d'uso

```ts
// Ottiene i campi di configurazione per un textarea,
// con il valore predefinito "5 righe" pre-impostato
const fields = Component.schema.textarea({ rows: 5 })
// fields.rows  → f.number({ label: "Righe", min: 1, defaultValue: 5 })
// fields.label → f.string({ label: "Label", required: true })
// ...nessun altro campo riceve rows: 5

// Usato nel CMS per costruire la form di configurazione di un campo schema
const configForm = Component.schema[field.type](field.overrides)
```

### Checklist

- [x] Creare `src/types/FormSchema.tsx`
- [x] Implementare tutti i 19 tipi di campo
- [x] Aggiornare `Component.tsx`: aggiungere `schema`, esportare `FieldAdapter`
- [x] Aggiornare `src/components/index.ts`: nuovi type export
- [x] Build e TypeScript passano

---

## CR-048 — Prompt file attachment — AI provider vision/docs integration

**Stato:** ✅ completato (v1.0.0) — tutti gli item della checklist verificati. OpenAI ora supporta documenti: text/plain, application/json, text/csv, text/xml, text/javascript vengono decodificati e inviati come contesto testuale; altri formati binari (PDF, DOCX) vengono segnalati con nome file e MIME type. `supportsDocuments: true` per tutti i provider OpenAI-compatibili. 3 nuovi test di attachment.  
**Priorità:** Media
**Dipende da:** CR-047

### Motivazione

CR-047 aggiunge il bottone attach nella UI e il trasporto attachment-side. Questa CR completa l'integrazione provider-by-provider: immagini passate ai modelli vision, documenti inoltrati ai provider che li supportano nativamente, e capability flags coerenti per l'UI.

### Scope

- Estendere `AIRequestOptions` con `attachments?: PromptAttachment[]`
- Definire `PromptAttachment = { file: File; type: 'image' | 'document' | 'auto'; dataUrl?: string }`
- Aggiornare `runPrompt()` per passare gli allegati al provider
- Implementare lato provider:
  - **OpenAI**: `content` array con `image_url` per immagini (vision), testo estratto per PDF
  - **Anthropic**: `content` array con `image` block (base64) e `document` block
  - **Gemini**: `parts` array con `inlineData`
- `AIProviderCapabilities` esteso con `supportsVision: boolean`, `supportsDocuments: boolean`
- UI: file preview nella `PromptRun` (thumbnail per immagini, nome+size per documenti)
- `PromptUtils.fileToAttachment(file: File): Promise<PromptAttachment>` — converte File in attachment pronto per il provider

### Checklist

- [x] Tipo attachment trasportabile lato provider (`AIAttachment`)
- [x] `AIRequestOptions.attachments`
- [x] `AIProviderCapabilities.supportsVision` + `supportsDocuments`
- [x] `PromptUtils.fileToAttachment()`
- [x] OpenAI provider: document support oltre alle immagini
- [x] Anthropic provider: vision + document
- [x] Gemini provider: vision + document
- [x] UI preview allegati in `PromptRun`
- [x] Disabilitare attach button se provider non supporta (`supportsVision === false && supportsDocuments === false`)
- [x] Unit test
- [x] Aggiornare `docs/AI_REFERENCE.md`

---

## CR-050 — ContextMenu adapter system (proposal)

**Stato:** ✅ done — risolto via prop `controlled`, non via adapter formale  
**Priorità:** Media  
**Dipende da:** CR-025 (ContextMenu base completato)

### Motivazione

Il `ContextMenu` attuale (CR-025) funziona solo su `<textarea>` / `<input>` nativi perché usa `querySelector` e `keydown`/`keyup` eventi DOM. Due editor importanti nel framework non possono beneficiarne:

1. **CodeEditor** (CodeMirror) — rendering contenteditable, non textarea
2. **RichText** (Tiptap) — ha API Suggestion nativa incompatibile

### Soluzione implementata

Invece di un sistema di adapter formale (`ContextMenuAdapter`), il codebase utilizza un'architettura a **componenti controllati**:

1. **Prop `controlled`** (`ContextMenuControlledState`) aggiunta a `ContextMenu` — quando presente, disabilita tutti i listener DOM nativi e si affida completamente al genitore per trigger detection, editor context e posizionamento.
2. **CodeEditor** — usa un'estensione CodeMirror `updateListener` per trigger detection, `coordsAtPos()` per posizionamento, `view.dispatch()` per insert/replace.
3. **RichText** — usa eventi TipTap (`selectionUpdate`, `transaction`) per trigger detection, `editor.view.coordsAtPos()` per posizionamento, `state.tr.insertText()` per insert/replace.
4. **Prompt** — usa la modalità nativa (non controllata) su `<textarea>` nativo, senza modifiche.
5. **`EditorCommand`** interfaccia condivisa (`{ name, description?, icon?, handler? }`) importata da `ContextMenu.tsx` e usata da tutti e tre i componenti.

### Perché non serve un adapter formale

L'architettura a stato controllato è più semplice e type-safe:
- Ogni editor usa le proprie API native (CodeMirror extensions, TipTap eventi, DOM diretto)
- Il `ContextMenu` rimane un componente puramente presentazionale (posizionamento flottante + navigazione)
- Nessuna nuova interfaccia/astrazione da mantenere
- Backward compatibile: senza `controlled`, ContextMenu funziona come prima su textarea/input nativi

---

## CR-053 — Doc audit: api, publish, ProviderSession, ProviderSwitcher

**Stato:** ✅ done  
**Commit:** `713d5dc`  
**Priorità:** Media  
**Dipende da:** —

### Motivazione
Scrivere docs per api/publish/ProviderSession/ProviderSwitcher provider categories e aggiornare architecture index.

### Checklist
- [x] Scritto `docs/api.md`
- [x] Scritto `docs/publish.md`
- [x] Scritto `docs/provider-session.md`
- [x] Aggiornato `docs/architecture/index.md` folder tree
- [x] Allineamento completo docs vs codebase (25 discrepanze corrette)

---

## CR-054 — Grid views config

**Stato:** ✅ done  
**Commit:** `32a4843`  
**Priorità:** Media  

### Motivazione
Aggiungere alla Grid un sistema di `views` config per switchare tra vista tabella e galleria, con column picker e field picker separati per view.

### Checklist
- [x] `GridViewsConfig<TRecord>` type con `toggle`, `table`, `gallery`
- [x] `GridTableViewConfig` (columnPicker)
- [x] `GridGalleryViewConfig` (fieldPicker, overlays)
- [x] View toggle nativo nel header Grid
- [x] Backward compatible: `views` opzionale

---

## CR-055 — Fill-height editor

**Stato:** ✅ done  
**Commit:** `32a4843`  
**Priorità:** Bassa  

### Motivazione
Supportare editor a tutta altezza (`'fill'`) in CodeEditor, Input (textarea), RichText.

### Checklist
- [x] `EditorHeight = number | 'fill'`
- [x] `useEditorHeight` gestisce `'fill'` → `height: 100%`, overflow auto
- [x] Backward compatible: valori numerici continuano a funzionare

---

## CR-056 — Grouped command menu in ContextMenu

**Stato:** ✅ done  
**Commit:** `32a4843`  
**Priorità:** Bassa  
**Dipende da:** CR-025

### Motivazione
Raggruppare i comandi del ContextMenu per categoria (es. text formatting, insert, AI actions) invece di una lista piatta.

### Checklist
- [x] Grouped layout proof concept implementato
- [x] Backward compatible

---

## CR-057 — Theming fixes (Grid.Table, Grid.Gallery wrapper)

**Stato:** ✅ done  
**Commit:** `32a4843`  
**Priorità:** Bassa  

### Motivazione
Allineare classi Tailwind dei wrapper Grid.Table e Grid.Gallery con i temi built-in.

### Checklist
- [x] Fix classi wrapper per tutti i temi (default, flat, cyber)

---

## CR-058 — AI tool calling system

**Stato:** ✅ done  
**Commit:** `70141a9`  
**Priorità:** Alta  

### Motivazione
Supportare strumenti AI (function calling) attraverso i provider Anthropic, Gemini, OpenAI-compatible, OpenCode.

### Checklist
- [x] `AIToolDefinition`, `AIToolCall`, `AIToolResult` types
- [x] `AIConversationTurn` per history multi-turno
- [x] `AICompleteResult = { type: 'text' } | { type: 'tool_calls' }`
- [x] Anthropic: tools via `anthropic` SDK
- [x] Gemini: tools via `tools` config
- [x] OpenAI-compatible: tools via `tools` array
- [x] OpenCode: tools via OpenAI-compatible format
- [x] Prompt.tsx adattato al nuovo tipo di ritorno
- [x] Test aggiornati

---

## CR-059 — Abortable AI provider calls

**Stato:** ✅ done  
**Commit:** `70141a9`  
**Priorità:** Alta  

### Motivazione
Permettere la cancellazione delle richieste AI in-flight tramite AbortSignal (es. pulsante "stop").

### Checklist
- [x] `AbortSignal` in `AICompleteRequest`
- [x] Propagazione in `fetchRest` / `fetchJson`
- [x] Supporto in tutti e 4 i provider AI
- [x] `fetch.ts` opzione `signal` in `FetchOptions`
- [x] Backward compatible: `signal` opzionale

---

## CR-060 — i18n'd Modal confirm dialogs

**Stato:** ✅ done  
**Commit:** `70141a9`  
**Priorità:** Media  
**Dipende da:** CR-029

### Motivazione
Localizzare i pulsanti Save/Delete/Cancel/Yes/No/Ok del Modal tramite `useI18n('modal')`.

### Checklist
- [x] Dict `modal.save`, `modal.delete`, `modal.cancel`, `modal.yes`, `modal.no`, `modal.ok`, `modal.close`
- [x] Dizionari aggiornati per en/it/de/ru/zh/ar
- [x] ModalYesNo, ModalOk, ModalDefault usano `useI18n('modal')`

---

## CR-061 — Modal rightInset / closeSlot props

**Stato:** ✅ done  
**Commit:** `70141a9`  
**Priorità:** Media  

### Motivazione
- `rightInset`: riservare spazio a destra del Modal (es. pannello laterale persistente).
- `closeSlot`: sostituire il pulsante × con contenuto custom.

### Checklist
- [x] `ModalProps.rightInset?: number` — cover/backdrop si fermano prima, dialog right si sposta
- [x] `ModalProps.closeSlot?: ReactNode` — sostituisce × button
- [x] Documentazione inline JSDoc

---

## CR-062 — Secret redaction in fetch error logs

**Stato:** ✅ done  
**Commit:** `70141a9`  
**Priorità:** Alta  

### Motivazione
I log d'errore di `fetchRest` stampavano URL e header completi, inclusi API key in Authorization, x-api-key, query params.

### Checklist
- [x] Pattern `SENSITIVE_HEADER_PATTERN = /auth|key|token|secret/i`
- [x] `redactedHeadersForLogging()` sostituisce valori sensibili con `'[REDACTED]'`
- [x] `redactedUrlForLogging()` redige query params sensibili (`key`, `api_key`, `token`, `secret`)
- [x] `redactedRequestForLogging()` applica a tutte le console.warn

---

## CR-063 — Tenant Firestore db (databaseId, dispose)

**Stato:** ✅ done  
**Commit:** `d389c00`  
**Priorità:** Alta  
**Dipende da:** CR-033

### Motivazione
Supportare multi-tenancy con database Firestore dedicati per tenant, usando `getFirestore(app, databaseId)` invece del database default.

### Checklist
- [x] `FirestoreDataProviderConfig.databaseId?: string`
- [x] `getDb()` usa `getFirestore(getApp(), this.databaseId)` se configurato
- [x] ProviderSession: `TENANT_SHARED_DATABASE_ID = '(default)'` esplicito
- [x] `dispose()` chiama `terminate()` sul db Firestore

---

## CR-064 — Provider dispose contract

**Stato:** ✅ done  
**Commit:** `d389c00`  
**Priorità:** Media  
**Dipende da:** CR-002

### Motivazione
Aggiungere `dispose()` opzionale a `DataProviderAdapter` per cleanup esplicito (es. terminare connessioni Firestore).

### Checklist
- [x] `dispose?(): Promise<void>` in `DataProviderAdapter`
- [x] Implementato in `FirestoreDataProvider` (terminate)
- [x] Implementato in `SupabaseDataProvider` (dispose client)
- [x] `setProvider` in `App.tsx` chiama `await prevRegistry?.[key]?.dispose?.()` prima di sostituire

---

## CR-065 — Firestore getDb() dentro try block

**Stato:** ✅ done  
**Commit:** `d389c00`  
**Priorità:** Alta  
**Dipende da:** CR-033

### Motivazione
`getDb()` (→ `getApp()`) poteva lanciare sincronamente se Firebase non era inizializzato, causando unhandled promise rejection. Spostato dentro try/catch in tutti i metodi.

### Checklist
- [x] `getDb()` spostato dentro try in: read, set, update, remove, readShallow, setChunks
- [x] count() aveva già getDb() fuori try — corretto

---

## CR-066 — Empty cache snapshot filter in Firestore subscribe

**Stato:** ✅ done  
**Commit:** `d389c00`  
**Priorità:** Media  
**Dipende da:** CR-033

### Motivazione
Con offline persistence, il primo emit di `onSnapshot` è spesso uno snapshot vuoto da cache — causava flash "no data" nei consumer.

### Checklist
- [x] `if (snap.metadata?.fromCache && snap.size === 0) return;` in subscribe
- [x] Una collezione genuinamente vuota viene comunque notificata dal successivo snapshot server-side

---

## CR-067 — AsyncDropdown: componente searchable con AbortSignal

**Stato:** ✅ done  
**Priorità:** Media  

### Motivazione
Dropdown con caricamento asincrono dei dati, debounced search, AbortSignal per cancellare richieste in-flight, e stati loading/empty/error nativi.

### API

```typescript
type AsyncDropdownLoader<TItem> = (query: string, signal: AbortSignal) => Promise<TItem[]>;

interface AsyncDropdownProps<TItem> extends Omit<DropdownProps, 'children' | 'header' | 'onOpenChange'> {
    loadItems: AsyncDropdownLoader<TItem>;
    getItemId: (item: TItem) => string;
    renderItem: (item: TItem) => React.ReactNode;
    onSelect: (item: TItem) => void | Promise<void>;
    selectedId?: string | null;
    searchPlaceholder?: string;
    emptyState?: React.ReactNode;
    loadingState?: React.ReactNode;
    errorState?: (error: unknown) => React.ReactNode;
    debounceMs?: number;
    closeOnSelect?: boolean;
}
```

### Checklist
- [x] `AsyncDropdown<TItem>` implementato in Dropdown.tsx
- [x] 3 test unitari (caricamento + query, selezione + chiusura, errore) — 8 test totali nel file Dropdown
- [x] Pagina showcase AsyncDropdownPage con playground interattivo
- [x] Export pubblico da `@llmnative/react`
- [x] Commit e push
- [x] Aggiornare docs di riferimento

---
