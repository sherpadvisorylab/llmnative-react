import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Helper per campi array dinamici che aggiunge e rimuove sezioni form ripetute.',
            },
            sections: {
                repeatedFields: {
                    title: 'Campi ripetuti',
                    description: 'Repeat clona lo stesso gruppo di campi per ogni elemento dell’array e mantiene le azioni di aggiunta e rimozione allineate al record corrente del Form.',
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
            },
            propsDocs: {
                items: {
                    name: { description: 'Nome del campo array nel record del Form.' },
                    children: { description: 'Campi clonati per ogni riga ripetuta.' },
                    onChange: { description: 'Change handler personalizzato chiamato dal contesto Form.' },
                    onAdd: { description: 'Chiamata dopo aver aggiunto un elemento.' },
                    onRemove: { description: 'Chiamata dopo aver rimosso un elemento.' },
                    className: { description: 'Classi CSS sul wrapper root.' },
                    layout: { description: 'Variante di layout di Repeat.' },
                    minItems: { description: 'Numero minimo di elementi.' },
                    maxItems: { description: 'Numero massimo di elementi.' },
                    label: { description: 'Etichetta della sezione con azione di aggiunta.' },
                    readOnly: { description: 'Nasconde le azioni di aggiunta e rimozione.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
