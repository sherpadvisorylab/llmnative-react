# @llmnative/react — Copilot Instructions

Leggi `llms-full.txt` per l'intera API surface: componenti, provider, hook, tipi, esempi.
Leggi `llms.txt` per orientamento rapido e provider matrix.
Leggi e applica `AGENTS.md` e
`docs/maintainers/FRAMEWORK_CHANGE_RELEASE_WORKFLOW.md` per ogni modifica o
release del framework.

Tutti gli import da `'@llmnative/react'` — mai da sottodirectory.
I provider si iniettano via `<App providers={...}>` — mai importati direttamente nei componenti.
TypeScript strict: no `any`. Usare `unknown`, `Record<string, unknown>`, interfacce specifiche.
