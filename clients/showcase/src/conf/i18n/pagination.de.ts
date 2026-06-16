import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        pagination: {
            page: {
                title: 'Pagination',
                description: 'Seitennavigation mit First-, Previous-, Next- und Last-Steuerung sowie einem konfigurierbaren Seitenfenster. Wird von Grid automatisch verwendet.',
            },
            sections: {
                interactive: {
                    title: 'Interaktive Pagination - 50 Eintraege, 8 pro Seite',
                    description: 'Klicke auf die Seitensteuerung, um durch den Datensatz zu navigieren.',
                },
                sticky: {
                    title: 'Sticky-Pagination-Leiste',
                    description: 'Wenn sticky=true gesetzt ist, schwebt die Pagination-Leiste mit unscharfem Hintergrund am unteren Rand des Viewports. Das ist das Standardverhalten in Grid.',
                },
            },
            labels: {
                recordPrefix: 'Eintrag',
                stickyPreviewLead: 'rendert die Navigationsleiste mit',
                stickyPreviewMiddle: 'und',
                stickyPreviewEnd: 'damit sie ueber dem Inhalt schwebt, ohne ihn vollstaendig zu verdecken.',
            },
            propsDocs: {
                items: {
                    records: { description: 'Vollstaendiger Datensatz fuer die Pagination.' },
                    children: { description: 'Render-Funktion, die die Datensaetze der aktuellen Seite und den Offset erhaelt.' },
                    page: { description: 'Initial aktive Seite (1-basiert). Wird nur beim Mount angewendet; danach steuert interner State die Navigation.' },
                    limit: { description: 'Anzahl der Elemente pro Seite.' },
                    maxPageButtons: { description: 'Maximale Anzahl sichtbarer Seitenbuttons.' },
                    sticky: { description: 'Fixiert die Pagination-Leiste am unteren Rand des Viewports.' },
                    align: { description: 'Horizontale Ausrichtung der Pagination-Steuerung.' },
                    scrollToTopOnChange: { description: 'Scrollt beim Seitenwechsel an den Seitenanfang.' },
                    scrollBehavior: { description: 'scrollIntoView-Verhalten, wenn scrollToTopOnChange aktiviert ist.' },
                    appendTo: { description: 'Portal-Ziel fuer die Pagination-Leiste.' },
                    before: { description: 'Inhalt innerhalb des Pagination-Wrappers vor der Navigationsleiste.' },
                    after: { description: 'Inhalt innerhalb des Pagination-Wrappers nach der Navigationsleiste.' },
                    wrapperClassName: { description: 'CSS-Klassen fuer das aeusserste Wrapper-Element.' },
                    className: { description: 'CSS-Klassen fuer das nav-Element mit den Seitenbuttons.' },
                },
            },
            playground: {
                title: 'Pagination',
                props: {
                    limit: { description: 'Anzahl der Elemente pro Seite.' },
                    maxPageButtons: { description: 'Maximale Anzahl sichtbarer Seitenbuttons.' },
                    sticky: { description: 'Fixiert die Pagination-Leiste am unteren Rand des Viewports.' },
                    align: { description: 'Horizontale Ausrichtung der Pagination-Steuerung.' },
                    scrollToTopOnChange: { description: 'Scrollt beim Seitenwechsel an den Seitenanfang.' },
                },
            },
        },
    },
});
