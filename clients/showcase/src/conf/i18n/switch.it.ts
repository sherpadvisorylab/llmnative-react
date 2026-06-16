import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        switch: {
            page: {
                title: 'Switch',
                description: 'Checkbox con stile switch che usa lo stesso contratto valore di Checkbox.',
            },
            sections: {
                booleanToggle: {
                    title: 'Toggle booleano',
                },
            },
            labels: {
                published: 'Pubblicato',
                togglePublishedState: 'Attiva o disattiva stato pubblicato',
            },
            propsDocs: {
                title: 'Props Switch',
                items: {
                    name: { description: 'Nome campo usato come chiave del form.' },
                    label: { description: 'Etichetta accanto allo switch.' },
                    title: { description: 'Attributo title nativo.' },
                    ariaLabel: { description: 'Etichetta accessibile per lo switch quando non c e una label visibile.' },
                    inheritWrapperClassName: { description: 'Se false ignora wrapperClassName ereditato dal contesto Form padre.' },
                    required: { description: 'Segna il campo come obbligatorio.' },
                    valueChecked: { description: 'Valore salvato quando e attivo.' },
                    defaultValue: { description: 'Valore iniziale attivo.' },
                    before: { description: 'Contenuto prima dello switch.' },
                    after: { description: 'Contenuto dopo lo switch.' },
                    onChange: { description: 'Handler custom di change chiamato dal contesto Form.' },
                    className: { description: 'Classi CSS sull input checkbox.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper.' },
                },
            },
            playground: {
                title: 'Switch',
            },
        },
    },
});
