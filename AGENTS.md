# @llmnative/react — Agent Reference

Leggi `llms-full.txt` per l'intera API surface: componenti, provider, hook, tipi, esempi.
Leggi `llms.txt` per orientamento rapido e provider matrix.
Leggi `.notes/STATUS.md` per lo stato attuale del progetto e CR aperti.
Leggi `.notes/CHANGE_REQUESTS.md` per la lista completa di tutte le CR (passate, in corso, future).

Tutti gli import da `'@llmnative/react'` — mai da sottodirectory.
I provider si iniettano via `<App providers={...}>` — mai importati direttamente nei componenti.

## Workflow CR → Issue → Commit → Close

Ogni modifica significativa al framework segue questo flusso obbligatorio:

1. **Identificare la CR** — ogni unità di lavoro ha una CR in `.notes/CHANGE_REQUESTS.md`
2. **Creare issue su GitHub** — prima di scrivere codice, creare issue su `https://github.com/sherpadvisorylab/llmnative-react/issues` con label `pending` o `in-progress`
3. **Scrivere il codice** — implementare la CR
4. **Commit con CR number** — messaggio commit nel formato `CR-NNN: titolo breve`
5. **Aggiornare CHANGE_REQUESTS.md** — checklist e stato ✅
6. **Aggiornare STATUS.md** — sezione Open CR + Completed CR
7. **Chiudere la issue su GitHub** — con label `done`, link al commit

Regole:
- CR numerate progressivamente (CR-001, CR-002, ...). Nuove CR prendono il prossimo numero libero.
- L'issue su GitHub va creata PRIMA di iniziare il lavoro.
- Se una modifica è minore (bug fix, refactor locale, docs), non serve CR — basta commit diretto.
- Tutte le CR aperte sono listate in STATUS.md e CHANGE_REQUESTS.md.
- Le label GitHub: `pending` (da fare), `in-progress` (in lavorazione), `done` (completata).
