# Roadmap

> Operational roadmap aligned to the codebase on 2026-07-10.
> The full historical plan lives in `.notes/CHANGE_REQUESTS.md`; the current verified status lives in `.notes/STATUS.md`.

---

## Direction

React FireStrap is becoming a Vite-first, provider-agnostic and AI-friendly React framework. The core advantage remains the same: build complex data-driven interfaces in a few lines, without forcing the consumer to know the internal details of the provider.

---

## Consolidated state

Already implemented and verified:

- Vite library build with CJS/ESM/CSS/types output.
- `DataProvider`, `StorageProvider`, `AuthProvider`, `EmailProvider` and their contexts.
- `FirebaseDataProvider`, `FirebaseStorageProvider`, `FirestoreDataProvider`, `SupabaseDataProvider`, `SupabaseStorageProvider`, `SupabaseAuthProvider`, `MockDataProvider`.
- App-level declarative provider config via `<App providers={{ ... }}>`.
- Internal `RuntimeProvider` that composes runtime config and persisted global state.
- Client-side head management via `HeadProvider`, `Head` and dedicated hooks for metadata/document/social/language/pagination/assets/PWA/schema.org.
- Theme registry and icon registry controllable from `<App>`.
- `I18nProvider`, `useI18n()`, locale dictionaries and `LocaleSwitcher`.
- Tailwind v4 runtime via CSS compatibility layer.
- Public `MarkdownReader`.
- `ImageField` is the active public image field.
- `ImageEditor` heavy runtime (`tui-image-editor`) now stays in a lazy chunk instead of being forced into the root bundle.
- Vite-based showcase built on `<App providers={{ ... }}>` and Markdown docs via frontmatter.
- Vite-first scaffold realigned to the new `providers` API.
- Unit/component/contract tests: 61 files, 643 tests (all pass).
- Showcase stubs risolti: 0 stub routes. 5 example pages reali + 4 provider redirect.
- Deploy e link docs rinviati.

Not yet complete:

- Browser OAuth integration test (Google — servono credenziali reali).
- Public deploy of the showcase.

---

## Recommended sequence

```text
CR-006 tests hardening              100% — 643 unit + 18 integration + 16 E2E
CR-007 showcase completion          100% — done
CR-051 WorkflowAI                   spec written — not started
CR-040 SchemaForm                   spec written — not started
```

---

## Priority 1 - Verifiability

Goal: be able to say what works with automated tests, not just with a build.

Tasks:

- Add `Upload` tests. *(done: base component coverage)*
- Keep `npm test` green as public surface evolves (`publicExports.contract.test.ts`).
- Add `Repeat` tests. *(done: render/add/readOnly/save nested)*
- Add storage provider tests at least on mock/fake adapter or dedicated contract. *(partial: `StorageProviderContext` covered)*
- Add Firebase integration with emulator or explicitly mark it as manual until emulator setup.
- Add Supabase integration coverage against a real/emulated backend.
- Add separate scripts if needed: `test:unit`, `test:integration`, `test:e2e`.
- Extend CI from build/unit to integration/E2E where credentials and emulators allow.

---

## Priority 3 - API audit

Goal: surface and fix public inconsistencies before the RC.

Known issues:

- `Input`: clarify `type` vs `inputType`.
- `Select`: complete/document `placeholder`.
- `Form`: clarify `appearance` and residual docs still mentioning `aspect`.
- `Grid`: align docs/API on `pagination.limit` vs `pagination.perPage`.
- `Modal`: verify actually exported props.
- `Icon`: single `name` prop; the `icon` prop has been removed from the `Icon` component.
- `StorageProvider`: docs aligned to the real API `getURL`/`delete`.

---

## Priority 4 - Release readiness

Released as `@llmnative/react@1.0.0` (2026-07-07).

Next (1.x / 2.0):

- CR-051: WorkflowAI declarative multi-step pipeline.
- CR-040: SchemaForm (form generation from JSON schema).
- CR-041: SeoEnhancer (technical SEO filter).
- Firebase/Supabase emulator integration tests in CI.
- GitHub Pages deploy della showcase.
- GitHub Pages deploy della showcase.
