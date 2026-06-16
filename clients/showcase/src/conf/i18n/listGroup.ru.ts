import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        listGroup: {
            page: {
                title: 'ListGroup',
                description: 'Bootstrap-sovmestimaya gruppa spiska so sostoyaniyami active, disabled, loading, click i drag.',
            },
            sections: {
                statusList: {
                    title: 'Spisok statusov',
                    description: 'Ispolzui active, disabled i badge sostoyaniya dlya predstavleniya etapov workflow ili grupp navigacii.',
                },
            },
            labels: {
                workflow: 'Workflow',
                backlog: 'Backlog',
                inProgress: 'V rabote',
                review: 'Review',
                done: 'Gotovo',
            },
            propsDocs: {
                items: {
                    children: { description: 'Soderzhimoe elementov spiska.' },
                    label: { description: 'Neobyazatelnaya metka nad spiskom.' },
                    onClick: { description: 'Delaet elementy spiska klikabelnymi.' },
                    draggable: { description: 'Delaet elementy peretaskivaemymi.' },
                    onDrop: { description: 'Transformiruet peretaskivaemyi tekst pered pomeshcheniem v dataTransfer.' },
                    activeIndices: { description: 'Indeksy, renderimye kak aktivnye.', shortcuts: { none: { label: 'none', help: 'Net aktivnykh elementov.' }, first: { label: 'first', help: 'Pervyi element aktiven.' }, multi: { label: 'multi', help: 'Neskolko aktivnykh elementov.' } } },
                    disabledIndices: { description: 'Indeksy, renderimye kak otklyuchennye.', shortcuts: { none: { label: 'none', help: 'Net otklyuchennykh elementov.' }, last: { label: 'last', help: 'Otklyuchit poslednii element.' }, mixed: { label: 'mixed', help: 'Otklyuchit pervyi i poslednii element.' } } },
                    loadingIndices: { description: 'Indeksy, renderimye v sostoyanii loading.', shortcuts: { none: { label: 'none', help: 'Net sostoyaniya loading.' }, single: { label: 'single', help: 'Vtoroi element zagruzhaetsya.' }, multi: { label: 'multi', help: 'Neskolko elementov zagruzhayutsya.' } } },
                    before: { description: 'Kontent pered spiskom.' },
                    after: { description: 'Kontent posle spiska.' },
                    className: { description: 'CSS-klassy na list-group.' },
                    wrapperClassName: { description: 'CSS-klassy na wrapper.' },
                    itemClassName: { description: 'CSS-klassy na kazhdom elemente.' },
                },
            },
            playground: {
                title: 'ListGroup',
            },
        },
    },
});
