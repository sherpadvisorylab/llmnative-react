# @llmnative/react — Agent Reference

Leggi `llms-full.txt` per l'intera API surface: componenti, provider, hook, tipi, esempi.
Leggi `llms.txt` per orientamento rapido e provider matrix.
Leggi `.notes/STATUS.md` per lo stato attuale del progetto e CR aperti.
Leggi `.notes/CHANGE_REQUESTS.md` per la lista completa di tutte le CR (passate, in corso, future).
Leggi e applica obbligatoriamente
`docs/maintainers/FRAMEWORK_CHANGE_RELEASE_WORKFLOW.md` per classificazione CR,
GitHub Issues, commit, versionamento, push e pubblicazione npm.

Tutti gli import da `'@llmnative/react'` — mai da sottodirectory.
I provider si iniettano via `<App providers={...}>` — mai importati direttamente nei componenti.

## Workflow di modifica e release

La sola fonte normativa è
`docs/maintainers/FRAMEWORK_CHANGE_RELEASE_WORKFLOW.md`. Non replicarne qui le
regole: ogni aggiornamento del processo va effettuato nel documento canonico.
