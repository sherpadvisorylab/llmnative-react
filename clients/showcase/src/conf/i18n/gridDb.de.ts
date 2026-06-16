import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridDb: {
            page: {
                title: 'GridDB',
                description: 'Provider-gestutzte Grid-Variante. Sie abonniert einen DataProvider-Pfad und streamt Aktualisierungen automatisch, inklusive Filterung, Sortierung und Feld-Mapping auf Provider-Ebene.',
            },
            sections: {
                basicUsage: {
                    title: 'Grundlegende Verwendung',
                    description: 'Die kleinste gultige GridDB-Form. Ubergib einen Pfad und lass Grid die Collection abonnieren und die Spalten aus den eingehenden Datensatzen ableiten.',
                },
                providerFilter: {
                    title: 'Filter auf Provider-Ebene',
                    description: 'where filtert Datensatze auf Provider-Ebene, bevor sie die Komponente erreichen, damit das Grid nicht zu viele Daten ladt.',
                },
                providerOrder: {
                    title: 'Sortierung auf Provider-Ebene',
                    description: 'order sortiert Datensatze auf Provider-Ebene, bevor die Komponente sie erhalt.',
                },
                fromUrl: {
                    title: 'fromUrl - routengetriebener Pfad',
                    description: 'fromUrl ermittelt den Collection-Pfad aus dem aktuellen Route-Pathnamen statt aus einem fest codierten Pfad. Diese Vorschau liest von der aktuellen Seiten-URL.',
                },
                grouping: {
                    title: 'Gruppierung',
                    description: 'groupBy trennt Zeilen unter Abschnitts-Uberschriften. Es funktioniert fur Tabellen- und Galerie-Layouts und kann mit providerseitiger Sortierung kombiniert werden.',
                },
            },
            labels: {
                teamMembers: 'Teammitglieder',
            },
            propsDocs: {
                categories: {
                    gridDb: 'GridDB',
                    shared: 'Gemeinsam',
                },
                items: {
                    path: { description: 'Collection-Pfad des DataProviders. Verwende ihn mit fromUrl={false} (Standard).' },
                    fromUrl: { description: 'Wenn true, wird der Collection-Pfad aus dem aktuellen Pathnamen statt aus path abgeleitet. fromUrl hat immer Vorrang.' },
                    recordId: { description: 'Identitatsaufloser fur Auswahl, Bearbeitungszustand und Mutationspfade. Ubergib einen Feldnamen oder eine Arrow-Funktion.' },
                    where: { description: 'Filter auf Provider-Ebene, der angewendet wird, bevor Datensatze gestreamt werden.' },
                    order: { description: 'Sortierung auf Provider-Ebene, die angewendet wird, bevor Datensatze gestreamt werden.' },
                    fieldMap: { description: 'Ordnet Provider-Feldnamen den in der UI verwendeten Namen vor dem Rendern zu.' },
                },
            },
            playground: {
                groups: {
                    gridDb: 'GridDB',
                    shared: 'Gemeinsam',
                },
                props: {
                    path: { description: 'Collection-Pfad, wenn fromUrl deaktiviert ist.' },
                    fromUrl: { description: 'Leitet den Collection-Pfad aus dem aktuellen Pathnamen ab. In diesem Playground wird dadurch ein anderer Seed-Datensatz genutzt.' },
                    recordId: {
                        description: 'Aufloser fur die Datensatz-Identitat.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'Verwendet das native Schlusselfeld des Providers.' },
                            explicitId: { label: 'id', help: 'Verwendet das explizite id-Feld.' },
                            functionId: { label: 'fn', help: 'Arrow-Funktion, die das id-Feld zuruckgibt.' },
                        },
                    },
                    where: {
                        description: 'Filter auf Provider-Ebene vor dem Daten-Stream.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'Kein Filter.' },
                            active: { label: 'active', help: 'Nur aktive Teammitglieder anzeigen.' },
                            admins: { label: 'admins', help: 'Nur Admins anzeigen.' },
                        },
                    },
                    order: {
                        description: 'Sortierung auf Provider-Ebene vor dem Daten-Stream.',
                        shortcuts: {
                            none: { label: 'none', help: 'Provider-Standardreihenfolge beibehalten.' },
                            nameAsc: { label: 'name asc', help: 'Nach Name aufsteigend sortieren.' },
                            emailDesc: { label: 'email desc', help: 'Nach E-Mail absteigend sortieren.' },
                        },
                    },
                    fieldMap: {
                        description: 'Ordnet Provider-Feldnamen UI-Feldnamen zu.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'Kein Mapping.' },
                            fullName: { label: 'fullName', help: 'Stellt Provider-"name" als "fullName" bereit.' },
                        },
                    },
                },
            },
        },
    },
});
