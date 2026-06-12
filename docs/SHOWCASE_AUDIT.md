# Showcase Audit

> Snapshot audited against the real codebase on 2026-06-12.
> Purpose: track showcase correctness before npm publication and guide follow-up fixes.

---

## Goal

The showcase has two responsibilities:

1. act as a real package consumer of `@llmnative/react`
2. document the framework with examples users can safely copy

That means each showcase page should satisfy **three** contracts at once:

- **API contract**: every imported symbol must exist in the public package
- **runtime contract**: the preview shown on the page must actually work
- **documentation contract**: the code snippet must describe the same pattern shown in the preview and in the page title/section title

The new automated export-contract test covers the first two at package level. This audit documents the remaining manual/documentation work.

---

## Automated coverage now in place

Implemented in:

- [tests/unit/publicExports.contract.test.ts](/abs/path/c:/projects/assets/sherpa/llmnative/react/tests/unit/publicExports.contract.test.ts)

What it verifies dynamically:

- every **runtime** symbol imported by `clients/showcase/src` from `@llmnative/react` exists in `dist/index.mjs`
- every **type-only** symbol imported by `clients/showcase/src` exists in the generated `.d.ts` export graph
- every runtime export from [src/components/index.ts](/abs/path/c:/projects/assets/sherpa/llmnative/react/src/components/index.ts) is reachable from the package root bundle

Current verification state:

- `npm test` passes
- `44` test files pass
- `457` tests pass

What this test does **not** verify:

- that a snippet is semantically aligned with the preview above it
- that a benchmark/comparison snippet represents the intended framework pattern
- that section descriptions still match the current behavior of the component

Those remain manual audit items.

---

## Findings Summary

### Confirmed fixed

1. **Public export mismatch: `Pagination`**
   - Symptom: showcase build failed because `Pagination` existed internally but was not publicly exported.
   - Fix applied:
     - [src/components/index.ts](/abs/path/c:/projects/assets/sherpa/llmnative/react/src/components/index.ts)
     - [clients/showcase/vite.config.mts](/abs/path/c:/projects/assets/sherpa/llmnative/react/clients/showcase/vite.config.mts)

2. **Snippet/API mismatch in benchmark auth example**
   - Symptom: [clients/showcase/src/pages/BenchmarkPage.tsx](/abs/path/c:/projects/assets/sherpa/llmnative/react/clients/showcase/src/pages/BenchmarkPage.tsx) used `Auth`, which is not a public export.
   - Fix applied:
     - example now uses `AuthButton` + `useAuthProvider`, which reflects the actual public API

3. **Type import mismatch in form validation example**
   - Symptom: [clients/showcase/src/pages/components/FormValidationPage.tsx](/abs/path/c:/projects/assets/sherpa/llmnative/react/clients/showcase/src/pages/components/FormValidationPage.tsx) showed `FormRef` as a runtime import instead of `import type`.
   - Fix applied:
     - snippet now uses `import type { FormRef }`

---

## Audit Criteria

Each showcase section should be reviewed against these questions:

### A. Public API correctness

- Are all imported symbols public exports of `@llmnative/react`?
- Are type-only symbols imported with `import type` where appropriate?
- Does the snippet use the current public prop names?

### B. Preview/snippet alignment

- Does the snippet represent the same component shown in the preview?
- Does the snippet include the minimal supporting wrapper needed to reproduce the preview?
- If the preview uses a provider/context wrapper, is that visible or clearly explained?

### C. Page/section narrative alignment

- Does the section title match what the preview actually demonstrates?
- Does the description still reflect current behavior?
- Is the snippet documenting a real framework pattern rather than an invented convenience wrapper?

---

## Audited Areas

### 1. Package consumer contract

Status: `green`

Evidence:

- showcase imports now resolve against the built package, not `src`
- `clients/showcase` build passes
- export contract test passes

Notes:

- This is the strongest part of the showcase today.
- It gives us confidence before npm publication that the app is consuming the package surface, not internal source files.

### 2. Benchmark page

Files:

- [clients/showcase/src/pages/BenchmarkPage.tsx](/abs/path/c:/projects/assets/sherpa/llmnative/react/clients/showcase/src/pages/BenchmarkPage.tsx)

Status: `fixed`

Assessment:

- The page is **not** a component page; it documents framework-level patterns.
- Therefore its snippets do not need to map 1:1 to a single component preview.
- They **do** need to reflect real public API and real supported patterns.

Current state:

- auth snippet reflects public API
- scenario copy now describes representative framework patterns more precisely
- methodology notes clarify that the page compares implementation shape, not full app scaffolding

Residual note:

- token counts are intentionally tied to the exact snippets in the page and must be recomputed whenever those snippets change

### 3. Component pages with known snippet rigor

Files sampled during this audit:

- [clients/showcase/src/pages/components/AuthPage.tsx](/abs/path/c:/projects/assets/sherpa/llmnative/react/clients/showcase/src/pages/components/AuthPage.tsx)
- [clients/showcase/src/pages/components/PaginationPage.tsx](/abs/path/c:/projects/assets/sherpa/llmnative/react/clients/showcase/src/pages/components/PaginationPage.tsx)
- [clients/showcase/src/pages/components/FormValidationPage.tsx](/abs/path/c:/projects/assets/sherpa/llmnative/react/clients/showcase/src/pages/components/FormValidationPage.tsx)

Status: `good baseline`

Assessment:

- These pages now reflect public exports correctly.
- They are good reference pages for how other component pages should be reviewed.

What “good” looks like here:

- imports match the package
- type imports are explicit where needed
- snippet intent matches preview intent
- section description describes the thing actually demonstrated

---

## Open Risks

These are not confirmed bugs yet, but they are likely sources of documentation drift.

### 1. Multi-section component pages

Why risky:

- pages like `Table`, `Grid`, `Image`, `Prompt`, `Dropdown`, `Select` contain many sections
- these are the easiest places for one section’s snippet to drift away from the preview over time

Priority pages to inspect next:

1. `TablePage.tsx`
2. `GridPage.tsx`
3. `PromptLivePage.tsx`
4. `SelectPage.tsx`
5. `DropdownPage.tsx`
6. `ImagePage.tsx`

### 2. Pages that mix framework and example scaffolding

Why risky:

- some previews rely on mock providers, helper wrappers, local state, or playground plumbing
- snippets can silently omit those dependencies and become misleading even if the component usage itself is valid

Review focus:

- make sure the snippet is either self-contained
- or intentionally minimal with a short explanation of omitted setup

### 3. Type-heavy examples

Why risky:

- examples using `FormRef`, `UploadCSVData`, `RecordProps`, `PromptCommand`, `MotionEffect`, `IconProviderAdapter`, etc. can drift between runtime import and type import forms

Review focus:

- `import type` hygiene
- public `.d.ts` export availability
- snippet readability for users copying examples

---

## Recommended Fix Order

### Phase 1: high-value component pages

Audit and fix in this order:

1. `TablePage.tsx`
2. `GridPage.tsx`
3. `PromptLivePage.tsx`
4. `SelectPage.tsx`
5. `DropdownPage.tsx`

Why this order:

- they are feature-dense
- they are likely to be copied by real users
- they exercise more of the public surface than simple primitives

### Phase 2: supporting rich media / upload pages

Audit and fix:

1. `ImagePage.tsx`
2. `UploadImagePage.tsx`
3. `UploadDocumentPage.tsx`
4. `UploadCSVPage.tsx`

Progress update:

- `ImagePage.tsx`: fixed
- `UploadImagePage.tsx`: fixed
- `UploadDocumentPage.tsx`: fixed
- `UploadCSVPage.tsx`: fixed

### Phase 3: broad consistency pass

Run a final manual pass across all pages for:

- section wording
- prop naming consistency
- copy-paste readiness
- provider/setup notes

---

## Suggested Working Rules For Fixes

When fixing showcase pages, prefer these rules:

1. Do **not** add framework exports just to preserve an old snippet.
2. Fix the showcase snippet to match the real public API.
3. If a preview depends on local wrapper/setup, either:
   - include the wrapper in the snippet, or
   - call out clearly that setup is omitted for brevity.
4. In component pages, keep the snippet as close as possible to the preview immediately above it.
5. In benchmark or comparative pages, keep the snippet as close as possible to the real supported framework pattern.

---

## Next Action

Use this document as the working checklist for the next pass.

Recommended next concrete task:

- run the final broad consistency pass across the remaining showcase copy and package-facing docs

The highest-value audit items tracked in this document are now fixed; the remaining work is final wording polish and pre-publish signoff.
