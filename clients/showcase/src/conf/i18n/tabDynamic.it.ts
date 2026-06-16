import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tabDynamic: {
            page: {
                title: 'TabDynamic',
                description: 'Editor dinamico a tab per array di sezioni form ripetute.',
            },
            sections: {
                editableTabs: {
                    title: 'Tab modificabili',
                    description: 'TabDynamic renderizza ogni elemento dell’array come tab rimovibile e mantiene il pannello attivo collegato al record corrente del Form.',
                },
            },
            labels: {
                section: 'Sezione',
                dynamicSections: 'Sezioni dinamiche',
                intro: 'Intro',
                title: 'Titolo',
            },
            propsDocs: {
                items: {
                    name: { description: 'Nome del campo array nel record del Form.' },
                    children: { description: 'Campi renderizzati dentro il tab attivo.' },
                    onChange: { description: 'Change handler personalizzato chiamato dal contesto Form.' },
                    onAdd: { description: 'Chiamata dopo aver aggiunto un tab.' },
                    onRemove: { description: 'Chiamata dopo aver rimosso un tab.' },
                    label: { description: 'Prefisso label del tab o template di conversione.' },
                    min: { description: 'Numero minimo di tab.' },
                    max: { description: 'Numero massimo di tab.' },
                    activeIndex: { description: 'Tab iniziale attivo.' },
                    title: { description: 'Titolo sopra i tab.' },
                    readOnly: { description: 'Nasconde le azioni di aggiunta e rimozione.' },
                    tabPosition: { description: 'Posizione del layout dei tab.' },
                },
            },
            playground: {
                title: 'TabDynamic',
            },
        },
    },
});
