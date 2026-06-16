import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        listGroup: {
            page: {
                title: 'ListGroup',
                description: 'Bootstrap-kompatible Listengruppe mit Active-, Disabled-, Loading-, Click- und Drag-States.',
            },
            sections: {
                statusList: {
                    title: 'Statusliste',
                    description: 'Nutze Active-, Disabled- und Badge-States, um Workflow-Phasen oder gruppierte Navigationseintrage darzustellen.',
                },
            },
            labels: {
                workflow: 'Workflow',
                backlog: 'Backlog',
                inProgress: 'In Bearbeitung',
                review: 'Prufung',
                done: 'Fertig',
            },
            propsDocs: {
                items: {
                    children: { description: 'Inhalt der Listeneintrage.' },
                    label: { description: 'Optionale Beschriftung uber der Liste.' },
                    onClick: { description: 'Aktiviert klickbare Listeneintrage.' },
                    draggable: { description: 'Macht Eintrage ziehbar.' },
                    onDrop: { description: 'Transformiert gezogenen Text, bevor er in dataTransfer abgelegt wird.' },
                    activeIndices: { description: 'Als aktiv gerenderte Indizes.', shortcuts: { none: { label: 'none', help: 'Keine aktiven Eintrage.' }, first: { label: 'first', help: 'Erster Eintrag aktiv.' }, multi: { label: 'multi', help: 'Mehrere aktive Eintrage.' } } },
                    disabledIndices: { description: 'Als deaktiviert gerenderte Indizes.', shortcuts: { none: { label: 'none', help: 'Keine deaktivierten Eintrage.' }, last: { label: 'last', help: 'Letzten Eintrag deaktivieren.' }, mixed: { label: 'mixed', help: 'Ersten und letzten Eintrag deaktivieren.' } } },
                    loadingIndices: { description: 'Als loading gerenderte Indizes.', shortcuts: { none: { label: 'none', help: 'Kein Loading-State.' }, single: { label: 'single', help: 'Zweiter Eintrag laedt.' }, multi: { label: 'multi', help: 'Mehrere Eintrage laden.' } } },
                    before: { description: 'Inhalt vor der Liste.' },
                    after: { description: 'Inhalt nach der Liste.' },
                    className: { description: 'CSS-Klassen auf list-group.' },
                    wrapperClassName: { description: 'CSS-Klassen auf dem Wrapper.' },
                    itemClassName: { description: 'CSS-Klassen auf jedem Eintrag.' },
                },
            },
            playground: {
                title: 'ListGroup',
            },
        },
    },
});
