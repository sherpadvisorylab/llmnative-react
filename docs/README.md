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
- Use relative `.md` links, for example `[Installation](./installation.md)`.
- Keep interactive demos and the component catalog in TSX under `clients/showcase/src/pages`.
- Keep operational files such as `CHANGE_REQUESTS.md`, `STATUS.md` and `ROADMAP.md` readable for AI and contributors, but without `path` frontmatter unless they should appear in the sidebar.
