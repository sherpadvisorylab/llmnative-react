import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: 'Schreibgeschützte Label → Wert-Paare mit nativer <dl>/<dt>/<dd>-Semantik, horizontalem oder gestapeltem Layout, responsiven Spalten und themebasiertem Styling.',
            },
            sections: {
                horizontal: { title: 'Horizontal', description: 'Label neben dem Wert. Auf Mobilgeräten wird das Paar gestapelt und respektiert labelWidth auf größeren Bildschirmen.' },
                stacked: { title: 'Gestapelte Spalten', description: 'Label über dem Wert, in einem responsiven Raster mit 1–6 Spalten.' },
                emptyValues: { title: 'Leere Werte', description: 'null, undefined und leere Strings rendern emptyValue (Standard "—").' },
                truncate: { title: 'Kürzen', description: 'Hält lange Werte in einer Zeile mit Ellipse und gibt den vollständigen Text über einen nativen title aus.' },
                theme: { title: 'Theme', description: 'Jeder Slot lässt sich über den DescriptionList-Theme-Schlüssel gestalten: Wrapper, Liste, Item, Label und Wert.' },
            },
            labels: {
                email: 'E-Mail',
                role: 'Rolle',
                admin: 'Administrator',
                fullName: 'Vollständiger Name',
                company: 'Unternehmen',
                status: 'Status',
                phone: 'Telefon',
                address: 'Adresse',
                notes: 'Notizen',
                bio: 'Biografie',
                longValue: 'Ein sehr langer Wert, der nicht in eine Zeile passt und gekürzt werden muss',
                empty: 'N/V',
            },
            propsDocs: { items: {
                items: { description: 'Auszugebende Label- und Wert-Paare.' },
                layout: { description: 'Position des Labels: neben dem Wert (horizontal) oder darüber (stacked).' },
                columns: { description: 'Responsive Spaltenanzahl im stacked-Layout (1–6). Im horizontal-Layout ignoriert.' },
                labelWidth: { description: 'Feste Labelbreite im horizontal-Layout (beliebige CSS-Länge, z. B. "12rem").' },
                emptyValue: { description: 'Wird gerendert, wenn ein Wert null, undefined oder leer ist. Standard "—".' },
                truncate: { description: 'Hält Werte in einer Zeile mit Ellipse und setzt bei Textwerten einen nativen title.' },
                className: { description: 'CSS-Klassen für das <dl>-Element.' },
                wrapperClassName: { description: 'CSS-Klassen für den äußeren Wrapper.' },
            } },
            playground: {
                title: 'DescriptionList',
                props: {
                    items: { description: 'Auszugebende Label- und Wert-Paare.' },
                    layout: { description: 'Position des Labels: neben dem Wert (horizontal) oder darüber (stacked).' },
                    columns: { description: 'Responsive Spaltenanzahl im stacked-Layout (1–6). Im horizontal-Layout ignoriert.' },
                    labelWidth: { description: 'Feste Labelbreite im horizontal-Layout (beliebige CSS-Länge, z. B. "12rem").' },
                    emptyValue: { description: 'Wird gerendert, wenn ein Wert null, undefined oder leer ist. Standard "—".' },
                    truncate: { description: 'Hält Werte in einer Zeile mit Ellipse und setzt bei Textwerten einen nativen title.' },
                    className: { description: 'CSS-Klassen für das <dl>-Element.' },
                    wrapperClassName: { description: 'CSS-Klassen für den äußeren Wrapper.' },
                },
            },
        },
    },
});
