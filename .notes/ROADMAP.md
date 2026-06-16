# Roadmap

> Operational roadmap aligned to the codebase on 2026-05-08.
> The full historical plan lives in `docs/CHANGE_REQUESTS.md`; the current verified status lives in `docs/STATUS.md`.

---

## Direction

React FireStrap is becoming a Vite-first, provider-agnostic and AI-friendly React framework. The core advantage remains the same: build complex data-driven interfaces in a few lines, without forcing the consumer to know the internal details of the provider.

---

## Consolidated state

Already implemented and verified:

- Vite library build with CJS/ESM/CSS/types output.
- `DataProvider`, `StorageProvider`, `AuthProvider`, `EmailProvider` and their contexts.
- `FirebaseDataProvider`, `FirebaseStorageProvider`, `MockDataProvider`.
- Supabase implementations present but partial.
- App-level declarative provider config via `<App providers={{ ... }}>`.
- Internal `RuntimeProvider` that composes runtime config and persisted global state.
- Client-side head management via `HeadProvider`, `Head` and dedicated hooks for metadata/document/social/language/pagination/assets/PWA/schema.org.
- Theme registry and icon registry controllable from `<App>`.
- Tailwind v4 runtime via CSS compatibility layer.
- Public `MarkdownReader`.
- Vite-based showcase built on `<App providers={{ ... }}>` and Markdown docs via frontmatter.
- Vite-first scaffold realigned to the new `providers` API.
- Unit/component tests: 14 files, 124 passing tests.

Not yet complete:

- Firebase/Supabase integration tests.
- Storage/Auth/Email provider tests.
- Component tests for Prompt.
- Contract tests for concrete storage implementations.
- Playwright E2E and CI.
- Showcase without stubs for providers and examples.
- Public deploy of the showcase.
- Final component API audit and removal/isolation of legacy debt.

---

## Recommended sequence

```text
CR-006 tests hardening              in progress
CR-007 showcase completion          in progress
CR-012 showcase native examples     next
CR-014 component API audit          after/while CR-012
CR-008..CR-011 themes cleanup       after visual baseline
2.0.0-rc                            after tests + showcase no critical stubs
```

---

## Priority 1 - Verifiability

Goal: be able to say what works with automated tests, not just with a build.

Tasks:

- Add `Upload` tests. *(done: base component coverage)*
- Add `Prompt` tests.
- Add `Repeat` tests. *(done: render/add/readOnly/save nested)*
- Add storage provider tests at least on mock/fake adapter or dedicated contract. *(partial: `StorageProviderContext` covered)*
- Add Firebase integration with emulator or explicitly mark it as manual until emulator setup.
- Add Supabase integration only when `SupabaseDataProvider` stops logging `not fully implemented yet`.
- Add separate scripts if needed: `test:unit`, `test:integration`, `test:e2e`.
- Add CI.

---

## Priority 2 - Real showcase

Goal: remove stub routes that today give a more complete perception than the real state.

First pages to make real:

- `/examples/crud`: `Grid + Form + MockDataProvider`.
- `/examples/nested-form`: dot notation, array/repeat and default values.
- `/examples/dashboard`: metrics and tables from mock data.
- `/providers/data/firebase`: real contract, config and limits.
- `/providers/data/supabase`: honest page about partial state and REST API used.
- `/providers/storage`: real contract `upload/getURL/download/delete`.

Acceptance:

- Every route in the menu is either a working demo or explicitly declares it is a planned page.
- `clients/showcase npm run build` continues to pass.

---

## Priority 3 - API audit

Goal: surface and fix public inconsistencies before the RC.

Known issues:

- `Input`: clarify `type` vs `inputType`.
- `Select`: complete/document `placeholder`.
- `Form`: clarify the bare variant vs `aspect`.
- `Grid`: align docs/API on `pagination.limit` vs `pagination.perPage`.
- `Modal`: verify actually exported props.
- `Icon`: single `name` prop; the `icon` prop has been removed from the `Icon` component.
- `StorageProvider`: docs aligned to the real API `getURL`/`delete`.

---

## Priority 4 - Release readiness

Before `2.0.0-rc`:

- `npm run test` passes.
- `npm run build` passes.
- `cd clients/showcase && npm run build` passes.
- Showcase without critical stubs in main paths.
- Operational docs updated to the same date.
- Unresolved gaps declared in `STATUS.md`.

Before `2.0.0`:

- CI active.
- At least one E2E CRUD flow.
- Clear integration strategy for Firebase and Supabase.
- README and public docs aligned to the real state.
