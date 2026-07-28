# Direttiva canonica UI per i consumer di `@llmnative/react`

Questa è l'unica fonte di verità per questa regola. Qualsiasi progetto che
consuma `@llmnative/react` come fondazione della propria Admin UI deve
richiamare questo file dal proprio `AGENTS.md` (o equivalente), senza
duplicarne il contenuto.

## Regola

L'interfaccia del progetto consumer deve essere composta esclusivamente
usando componenti e API pubbliche di `@llmnative/react`. I componenti di
dominio del progetto possono comporre tali API, ma non devono introdurre
primitive UI custom, controlli interattivi hand-rolled o loro sostituti
HTML/CSS quando il framework offre una capability equivalente.

Prima di implementare o modificare un'interfaccia, verificare i componenti
pubblici del framework e usarli per struttura, input, azioni, menu, modali,
tab, feedback e stati accessibili.

Se il framework non dispone della capability necessaria, oppure non permette
di soddisfare il requisito senza aggiramenti, fermarsi e comunicarlo
all'utente: la decisione è se estendere il framework o cambiare il requisito
del progetto consumer. Non implementare un'alternativa UI nel progetto
consumer.

## A chi si applica

A qualunque repository che dichiari una dipendenza da `@llmnative/react` per
la propria Admin UI (es. `llmnative/cms`). Il progetto consumer può aggiungere
proprie direttive verticali specifiche nel proprio `AGENTS.md`, ma non può
sostituire o allentare questa regola.
