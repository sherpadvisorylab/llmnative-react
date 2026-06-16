import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        listGroup: {
            page: {
                title: 'ListGroup',
                description: 'Majmuat qawaim mutawafiqa ma Bootstrap ma halat active wa disabled wa loading wa click wa drag.',
            },
            sections: {
                statusList: {
                    title: 'Qaimat halat',
                    description: 'Istaamil halat active wa disabled wa badge li ard marahil workflow aw anasir tanqol mujammaa.',
                },
            },
            labels: {
                workflow: 'Workflow',
                backlog: 'Backlog',
                inProgress: 'In progress',
                review: 'Review',
                done: 'Done',
            },
            propsDocs: {
                items: {
                    children: { description: 'Muhtawa anasir al qaimah.' },
                    label: { description: 'Tasmiya ikhtiyariya fawq al qaimah.' },
                    onClick: { description: 'Tujail anasir al qaimah qabila lil naqr.' },
                    draggable: { description: 'Tajail al anasir qabila lil sحب.' },
                    onDrop: { description: 'Tughayyir al nass al mashub qabl wadihi fi dataTransfer.' },
                    activeIndices: { description: 'Faharis tuard ka anasir active.', shortcuts: { none: { label: 'none', help: 'Bila anasir active.' }, first: { label: 'first', help: 'Al unsur al awwal active.' }, multi: { label: 'multi', help: 'Anasir active متعددة.' } } },
                    disabledIndices: { description: 'Faharis tuard ka anasir disabled.', shortcuts: { none: { label: 'none', help: 'Bila anasir disabled.' }, last: { label: 'last', help: 'Atil al unsur al akhir.' }, mixed: { label: 'mixed', help: 'Atil al awwal wal akhir.' } } },
                    loadingIndices: { description: 'Faharis tuard fi halat loading.', shortcuts: { none: { label: 'none', help: 'Bila halat loading.' }, single: { label: 'single', help: 'Al unsur al thani fi loading.' }, multi: { label: 'multi', help: 'Anasir متعددة fi loading.' } } },
                    before: { description: 'Muhtawa qabl al qaimah.' },
                    after: { description: 'Muhtawa baad al qaimah.' },
                    className: { description: 'Asma CSS ala list-group.' },
                    wrapperClassName: { description: 'Asma CSS ala al wrapper.' },
                    itemClassName: { description: 'Asma CSS ala kull unsur.' },
                },
            },
            playground: {
                title: 'ListGroup',
            },
        },
    },
});
