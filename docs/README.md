# Docs conventions

The showcase end-user documentation is generated from Markdown files in `docs/` that declare explicit frontmatter.

```md
---
title: Quick start
group: Getting started
order: 30
path: /docs/quick-start
description: Short description shown on the page.
---
```

Rules:

- Add `path` only to pages that should appear in the showcase sidebar.
- Keep files in thematic folders:
  - `getting-started/` for onboarding and App setup.
  - `architecture/` for framework internals.
  - `patterns/` for reusable usage patterns.
  - `examples/` for copyable recipes and LLM-friendly implementation notes.
  - `providers/` for the Providers / Integrations menu.
  - `reference/` for API references.
- Use `index.md` as the entry page for a thematic folder. Example: `providers/index.md` is the index for the Providers / Integrations section.
- Use absolute route links for cross-section links, for example `[DataProvider](/providers/data)` or `[Quick start](/docs/quick-start)`.
- Keep interactive demos and the component catalog in TSX under `clients/showcase/src/pages`.
- Keep operational files such as `CHANGE_REQUESTS.md`, `STATUS.md` and `ROADMAP.md` at the `.notes/` root. They are internal project-management docs, readable for AI and contributors, but without `path` frontmatter unless they should appear in the sidebar.
