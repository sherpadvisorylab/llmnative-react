import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Campo array dinamico che clona un gruppo di campi per ogni elemento e mantiene le azioni di aggiunta e rimozione sincronizzate con il record del Form.',
            },
            sections: {
                repeatedFields: {
                    title: 'Utilizzo base — layout orizzontale',
                    description: 'Layout di default. Ogni elemento ha un\'intestazione numerata, il proprio gruppo di campi e il pulsante di rimozione. Il pulsante di aggiunta appare sotto la lista o inline con la label se impostata.',
                },
                inlineLayout: {
                    title: 'Layout inline',
                    description: 'Usa layout="inline" per mantenere ogni riga compatta: i figli occupano lo spazio disponibile e il pulsante di rimozione si posiziona a destra. Ideale per palette colori, liste di tag o coppie chiave-valore.',
                },
                multipleFields: {
                    title: 'Piu campi per elemento',
                    description: 'Inserisci quanti campi vuoi nel blocco ripetuto — ogni elemento ottiene la propria sezione numerata con intestazione e pulsante di rimozione.',
                },
                constraints: {
                    title: 'Vincoli min / max',
                    description: 'minItems impedisce la rimozione sotto un minimo (i primi N elementi non mostrano il pulsante rimuovi). maxItems nasconde il pulsante di aggiunta raggiunto il limite.',
                },
                readOnlyMode: {
                    title: 'Modalita sola lettura',
                    description: 'Imposta readOnly per nascondere le azioni di aggiunta e rimozione, trasformando la lista in una vista solo display.',
                },
                functionChildren: {
                    title: 'Children come funzione di render',
                    description: 'Passa una funzione come children per ricevere index e record corrente — utile per label dinamiche, campi condizionali o rendering consapevole dell\'indice.',
                },
            },
            labels: {
                items: 'Elementi',
                name: 'Nome',
                firstItem: 'Primo elemento',
                tasks: 'Attivita',
                taskName: 'Nome attivita',
                design: 'Design',
                build: 'Build',
                test: 'Test',
                addColor: 'Aggiungi colore',
                colors: 'Colori',
                colorName: 'Nome token',
                primary: 'primary',
                secondary: 'secondary',
                accent: 'accent',
                socialLinks: 'Link social',
                platform: 'Piattaforma',
                url: 'URL',
                twitter: 'Twitter',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                languages: 'Lingue',
                language: 'Lingua',
                english: 'Inglese',
                italian: 'Italiano',
                german: 'Tedesco',
                skills: 'Competenze',
                skill: 'Competenza',
                javascript: 'JavaScript',
                typescript: 'TypeScript',
                react: 'React',
                pipelineSteps: 'Step pipeline',
                stepName: 'Nome step',
                command: 'Comando',
            },
            propsDocs: {
                title: 'Props',
                items: {
                    name: { description: 'Nome del campo array nel record del Form.' },
                    children: { description: 'Campi clonati per ogni riga ripetuta. Passa una funzione per ricevere (record, records, index).' },
                    onChange: { description: 'Change handler personalizzato chiamato dal contesto Form.' },
                    onAdd: { description: 'Chiamata dopo aver aggiunto un elemento.' },
                    onRemove: { description: 'Chiamata dopo aver rimosso un elemento.' },
                    className: { description: 'Classi CSS sul wrapper root.' },
                    layout: { description: 'horizontal — card numerata per elemento; inline — riga compatta per elemento.' },
                    minItems: { description: 'Numero minimo di elementi — il pulsante rimuovi e nascosto per i primi N elementi.' },
                    maxItems: { description: 'Numero massimo di elementi — il pulsante aggiungi e nascosto una volta raggiunto il limite.' },
                    label: { description: 'Label della sezione sopra la lista; il pulsante aggiungi e posizionato inline.' },
                    readOnly: { description: 'Nasconde le azioni di aggiunta e rimozione.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
