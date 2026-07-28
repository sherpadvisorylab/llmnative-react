# @llmnative/react — Agent Reference

Leggi `llms-full.txt` per l'intera API surface: componenti, provider, hook, tipi, esempi.
Leggi `llms.txt` per orientamento rapido e provider matrix.
Leggi `.notes/STATUS.md` per lo stato attuale del progetto e CR aperti.
Leggi `.notes/CHANGE_REQUESTS.md` per la lista completa di tutte le CR (passate, in corso, future).
Tutti gli import da `'@llmnative/react'` — mai da sottodirectory.
I provider si iniettano via `<App providers={...}>` — mai importati direttamente nei componenti.

## Direttive

Ogni riga è una regola vincolante a file separato. Leggere il file solo
quando il trigger corrispondente si verifica — non caricarlo a priori. Questa
tabella è l'unica fonte di verità sull'elenco delle direttive: `CLAUDE.md`,
`GEMINI.md`, `.cursorrules` e `.github/copilot-instructions.md` devono
soltanto rimandare qui, senza duplicare l'elenco.

| Direttiva | File | Trigger |
|---|---|---|
| Framework change & release workflow | `docs/directives/maintainers/llm-rule-framework-change-release.md` | La richiesta modifica `@llmnative/react` e poi chiede commit/push |
| UI consumer directive | `docs/directives/consumers/llm-rule-ui-consumer.md` | Si implementa o modifica un'interfaccia in un progetto consumer di `@llmnative/react` |
