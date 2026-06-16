import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gallery: {
            page: {
                title: 'Gallery',
                description: 'Visuelle Datengalerie mit gemeinsamem Support fuer Sortierung, Overlays, Auswahl und Pagination.',
            },
            sections: {
                sortedGallery: {
                    title: 'Sortierte Galerie',
                    description: 'Gallery akzeptiert denselben Sortiervertrag wie Grid und Table. Eingehende Datensaetze werden vor dem Rendern sortiert, ohne eigene Header-UI.',
                },
                recordClick: {
                    title: 'Record-Klick',
                    description: 'onRowClick erhaelt jetzt den geklickten Datensatz, sodass Consumer direkt record._key verwenden koennen.',
                },
                bulkSelection: {
                    title: 'Mehrfachauswahl',
                    description: 'Gallery uebernimmt die Table-Semantik: selectedKeys steuert die Auswahl und onSelectionChange liefert die ausgewaehlten Datensaetze. Externe Bulk-Aktionen bleiben ausserhalb der Komponente.',
                },
                groupedPaged: {
                    title: 'Gruppiert und paginiert',
                    description: 'Uebergib einen Feldnamen an groupBy, um Karten in beschriftete Bereiche zu gruppieren. Mit sortable auf demselben Feld entstehen natuerliche Cluster. Fuer mehrstufige Gruppierung kann ein Array uebergeben werden.',
                },
            },
            labels: {
                assets: 'Assets',
                selectableAssets: 'Auswaehlbare Assets',
                assetsByCategory: 'Assets nach Kategorie',
                selectedKey: 'Ausgewaehlter Schluessel',
                none: 'keiner',
                multiCheckbox: 'Mehrfach-Checkbox',
                enableSelectionHelp: 'Aktiviere die Auswahl, um das onSelectionChange-Payload live in der Galerie-Vorschau zu sehen.',
                enableMultiCheckbox: 'Mehrfach-Checkbox aktivieren',
                disableMultiCheckbox: 'Mehrfach-Checkbox deaktivieren',
                onSelectionPayload: 'onSelectionChange-Payload',
                payloadEmptyHint: 'Aktiviere oben die Mehrfach-Checkbox und waehle dann Karten aus, um hier das Callback-Payload zu sehen.',
                export: 'Exportieren',
                clear: 'Leeren',
                selectAssetsToEnableBulk: 'Waehle Assets aus, um externe Bulk-Aktionen zu aktivieren',
                selectedCount: 'ausgewaehlt',
                selectedGalleryItems: 'Ausgewaehlte Galerie-Elemente',
                record: 'record',
                newBadge: 'neu',
                brandBadge: 'brand',
                reviewBadge: 'review',
            },
            values: {
                assetNames: {
                    hero: 'Brand Hero',
                    social: 'Brand Social',
                    iconset: 'Brand Icon Set',
                    launch: 'Campaign Launch',
                    banner: 'Campaign Banner',
                    guide: 'Docs Guide',
                },
                categories: {
                    brand: 'Brand',
                    campaign: 'Kampagne',
                    docs: 'Docs',
                },
                statuses: {
                    ready: 'bereit',
                    draft: 'entwurf',
                    review: 'review',
                },
            },
            propsDocs: {
                title: 'Gallery-Props',
                items: {
                    records: { description: 'Datensaetze mit img- oder Thumbnail-Daten.' },
                    header: { description: 'Header-Inhalt oberhalb der Galerie.' },
                    footer: { description: 'Footer-Inhalt unterhalb der Galerie.' },
                    sortable: { description: 'Gallery hat keine sortierbare Header-UI, aber ein OrderConfig-Objekt kann den eingehenden Datensatz vor dem Rendern sortieren.', shortcuts: {
                        false: { label: 'false', help: 'Clientseitige Sortierung deaktivieren.' },
                        nameAsc: { label: 'name asc', help: 'Nach Name aufsteigend sortieren.' },
                        statusDesc: { label: 'status desc', help: 'Nach Status absteigend sortieren.' },
                    } },
                    overlays: { description: 'Overlay-Regeln basierend auf Position und Datensatzfiltern.', shortcuts: {
                        none: { label: 'none', help: 'Keine Overlays.' },
                        status: { label: 'status', help: 'Statusbezogene Overlays.' },
                        brand: { label: 'brand', help: 'Kategoriebezogenes Brand-Badge.' },
                    } },
                    onRowClick: { description: 'Wird aufgerufen, wenn der Benutzer auf eine Datensatzkarte klickt.' },
                    onSelectionChange: { description: 'Wird bei jeder Aenderung der Auswahl aufgerufen. Wenn gesetzt, erscheinen Auswahl-Checkboxen automatisch.' },
                    selectedKeys: { description: 'Kontrollierter Auswahlstatus fuer externe Bulk-Aktionen.' },
                    pagination: { description: 'Gemeinsam genutzte Pagination-Konfiguration.', shortcuts: {
                        default: { label: 'default', help: 'Zentrierte Standard-Pagination.' },
                        compact: { label: 'compact', help: 'Kleinere Seiten und Navigation.' },
                        sticky: { label: 'sticky', help: 'Sticky-Steuerung am unteren Rand.' },
                    } },
                    gap: { description: 'Innenabstand der Items.' },
                    columns: { description: 'Spalten pro Zeile.' },
                    groupBy: { description: 'Gruppiert Karten nach einem Feldnamen. Datensaetze mit demselben Wert werden in derselben Sektion gerendert. Fuer mehrstufige Gruppierung ein Array uebergeben.', placeholder: 'z. B. category oder ["category","status"]', shortcuts: {
                        off: { label: 'off', help: 'Keine Gruppierung.' },
                        category: { label: 'category', help: 'Nach Kategorie gruppieren.' },
                        status: { label: 'status', help: 'Nach Status gruppieren.' },
                        catStatus: { label: 'cat+status', help: 'Mehrstufig: Kategorie, dann Status.' },
                    } },
                    scrollToTopOnChange: { description: 'Scrollt die Galerie beim Seitenwechsel wieder nach oben.' },
                    scrollBehavior: { description: 'Scroll-Verhalten fuer das Zurueckspringen nach oben beim Seitenwechsel.' },
                    className: { description: 'Klasse fuer den inneren Flex-Column-Wrapper.' },
                    wrapperClassName: { description: 'Klasse fuer das aeusserste Wrapper-Element.' },
                    scrollClassName: { description: 'Klasse fuer den scrollbaren Body-Container.' },
                    headerClassName: { description: 'Klasse fuer den Header-Container.' },
                    bodyClassName: { description: 'Klasse fuer den Flex-Wrap-Container der Items.' },
                    footerClassName: { description: 'Klasse fuer den Footer-Container.' },
                    selectedClassName: { description: 'Klasse fuer das ausgewaehlte Item.' },
                    before: { description: 'Inhalt links neben der Galerie.' },
                    after: { description: 'Inhalt rechts neben der Galerie.' },
                },
            },
            playground: {
                title: 'Gallery',
            },
        },
    },
});
