import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        breadcrumbs: {
            page: {
                title: 'Breadcrumbs',
                description: 'Breadcrumb-Pfad aus einer URL-Zeichenkette oder aus einer expliziten Elementliste. Elemente mit href werden als Links gerendert; das letzte Element ohne href ist die aktuelle Seite.',
            },
            sections: {
                urlStringTrail: {
                    title: 'Pfad aus URL-Zeichenkette',
                    description: 'Gib eine URL-Zeichenkette weiter: Segmente werden zu Links und das letzte Segment gilt als aktuelle Seite.',
                },
                explicitItemList: {
                    title: 'Explizite Elementliste',
                    description: 'Verwende ein BreadcrumbItem[], wenn Labels von URL-Slugs abweichen oder du volle Kontrolle ueber Links brauchst.',
                },
                currentRoute: {
                    title: 'Aktuelle Route (ohne Trail)',
                    description: 'Wenn trail fehlt, liest die Komponente die aktuelle Route automatisch.',
                },
                chevronSeparator: {
                    title: 'Chevron-Trenner',
                },
                jsonLdStructuredData: {
                    title: 'JSON-LD Strukturdaten',
                    description: 'Aktiviere jsonLd, um ein schema.org BreadcrumbList-Script einzufuegen. baseUrl wird nur fuer das Schema verwendet und aendert keine sichtbaren Links.',
                },
                standaloneSchema: {
                    title: 'buildBreadcrumbSchema - standalone Nutzung',
                    description: 'Verwende das exportierte Utility, um schema.org-Daten unabhaengig fuer SSR, Sitemaps oder benutzerdefinierte Head-Injektion zu erzeugen. stringify: true liefert eine Zeichenkette fuer dangerouslySetInnerHTML.',
                },
            },
            labels: {
                home: 'Start',
                products: 'Produkte',
                shoes: 'Schuhe',
                sneakers: 'Sneaker',
                runningShoes: 'Laufschuhe',
                docs: 'Docs',
                components: 'Komponenten',
                breadcrumbs: 'Breadcrumbs',
                jsonLdOutput: 'JSON-LD Ausgabe (schema.org BreadcrumbList)',
                generatedScriptTag: 'erzeugtes <script type="application/ld+json">',
                currentPageOmitted: 'ohne href -> aktuelle Seite',
            },
            propsDocs: {
                items: {
                    trail: { description: 'Der Breadcrumb-Pfad. Gib eine URL-Zeichenkette fuer automatische Segmentanalyse oder ein BreadcrumbItem[] fuer explizite Kontrolle an. Faellt bei Auslassung auf die aktuelle Route zurueck.' },
                    rootItem: { description: 'Optionales Ankerelement vor dem Trail. Eine Zeichenkette erzeugt nur ein Label, ein BreadcrumbItem fuegt optional einen Link hinzu.' },
                    separator: { description: 'Trenner zwischen den Elementen. Verwende "chevron" fuer einen SVG-Pfeil.' },
                    jsonLd: { description: 'Wenn true, rendert die Komponente ein BreadcrumbList <script type="application/ld+json"> fuer strukturierte SEO-Daten.' },
                    baseUrl: { description: 'Basis-URL, die nur im JSON-LD-Ausgang den href-Werten vorangestellt wird. Sichtbare Links bleiben unveraendert; Standard ist window.location.origin.' },
                    className: { description: 'CSS-Klassen auf dem nav-Wrapper.' },
                },
                schemaTitle: 'buildBreadcrumbSchema',
                schemaItems: {
                    items: { description: 'Die Breadcrumb-Elementliste. Elemente mit href erhalten eine absolute URL im Schema; Elemente ohne href fuer die aktuelle Seite nicht.' },
                    rootItem: { description: 'Optionales Ankerelement vor den items mit derselben Form wie BreadcrumbItem.' },
                    baseUrl: { description: 'Basis-URL, die allen href-Werten vorangestellt wird, um absolute schema.org-URLs zu erzeugen.' },
                    stringify: { description: 'Wenn true, wird statt eines Plain Objects eine JSON-Zeichenkette geliefert, bereit fuer dangerouslySetInnerHTML ohne JSON.stringify.' },
                },
            },
            playground: {
                title: 'Breadcrumbs',
                shortcuts: {
                    urlString: 'URL-Zeichenkette',
                    explicitItems: 'Explizite Elemente',
                    deepPath: 'Tiefer Pfad',
                    clear: 'Leeren',
                    stringValue: 'Zeichenkette',
                    withLink: 'Mit Link',
                },
            },
        },
    },
});
