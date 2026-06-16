import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridArray: {
            page: {
                title: 'GridArray',
                description: 'In-Memory-Variante von Grid, die ein vom Aufrufer verwaltetes Datensatz-Array direkt rendert. Ideal fur berechnete Daten, lokalen State und kleine Datensatze, die bereits im Frontend leben.',
            },
            sections: {
                basicUsage: {
                    title: 'Grundlegende Verwendung',
                    description: 'Die kleinste gultige GridArray-Form. Ubergib ein Datensatz-Array und lass Grid die Spalten aus der Datenstruktur ableiten. sortable und pagination sind hier bewusst explizit gesetzt.',
                },
                onLoadTransform: {
                    title: 'onLoad-Transformation',
                    description: 'Mit onLoad kannst du Datensatze vor der Anzeige normalisieren oder anreichern. Die Transformation lauft pro Render-Zyklus und kann auch asynchron aufgelost werden.',
                },
                grouping: {
                    title: 'Gruppierung',
                    description: 'groupBy trennt Zeilen unter einklappbaren Abschnitts-Uberschriften. Es funktioniert fur Tabellen- und Galerie-Layouts und akzeptiert ein einzelnes Feld oder mehrere Ebenen.',
                },
                selection: {
                    title: 'Auswahl',
                    description: 'selection aktiviert Radiobuttons oder Checkboxen. Nutze die Kurzform fur reinen UI-State oder die Objektform, wenn du Callbacks und Standardschlussel brauchst.',
                },
            },
            labels: {
                teamMembers: 'Teammitglieder',
                singleSelection: 'Einzelauswahl',
                multipleSelection: 'Mehrfachauswahl',
            },
            propsDocs: {
                categories: {
                    gridArray: 'GridArray',
                    shared: 'Gemeinsam',
                },
                items: {
                    records: {
                        description: 'Vom Aufrufer verwaltetes Datensatz-Array. GridArray rendert diesen Snapshot direkt und abonniert keinen Provider. Im Playground stammen die Datensatze aus der Mock-Datenbank unten.',
                    },
                    recordId: {
                        description: 'Identitatsaufloser fur Auswahl, Bearbeitungszustand und Mutationspfade. Ubergib einen Feldnamen oder eine Arrow-Funktion.',
                    },
                    onLoad: {
                        description: 'Transformiert Datensatze vor der Anzeige. Kann synchron oder asynchron nach der Ubergabe ausgefuhrt werden.',
                    },
                },
            },
            playground: {
                groups: {
                    gridArray: 'GridArray',
                    shared: 'Gemeinsam',
                },
                props: {
                    records: {
                        description: 'Vom Aufrufer verwaltetes Datensatz-Array. In diesem Playground stammen die Datensatze aus der Mock-Datenbank unten. Bearbeite sie, um die Aktualisierung live zu sehen.',
                    },
                    recordId: {
                        description: 'Aufloser fur die Datensatz-Identitat. Ubergib einen Feldnamen wie "_key" oder eine Arrow-Funktion.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'Verwendet das native Schlusselfeld des Providers.' },
                            explicitId: { label: 'id', help: 'Verwendet das explizite id-Feld.' },
                            functionId: { label: 'fn', help: 'Arrow-Funktion, die das id-Feld zuruckgibt.' },
                        },
                    },
                    onLoad: {
                        description: 'Transformiert Datensatze vor der Anzeige. Im Playground wird dies intern behandelt.',
                    },
                },
            },
        },
    },
});
