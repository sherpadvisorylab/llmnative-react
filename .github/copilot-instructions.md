# @llmnative/react — Copilot Instructions

Leggi `llms-full.txt` per l'intera API surface: componenti, provider, hook, tipi, esempi.
Leggi `llms.txt` per orientamento rapido e provider matrix.
Leggi e applica `AGENTS.md`, inclusa la tabella "Direttive" e i relativi
trigger: leggere ogni file di direttiva solo quando il suo trigger si
verifica.

Tutti gli import da `'@llmnative/react'` — mai da sottodirectory.
I provider si iniettano via `<App providers={...}>` — mai importati direttamente nei componenti.
TypeScript strict: no `any`. Usare `unknown`, `Record<string, unknown>`, interfacce specifiche.
