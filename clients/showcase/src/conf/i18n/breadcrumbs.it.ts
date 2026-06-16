import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        breadcrumbs: {
            page: {
                title: 'Breadcrumbs',
                description: 'Percorso breadcrumb ricavato da una stringa URL o costruito da una lista esplicita di elementi. Gli elementi con href sono link; l’ultimo senza href rappresenta la pagina corrente.',
            },
            sections: {
                urlStringTrail: {
                    title: 'Percorso da stringa URL',
                    description: 'Passa una stringa URL: i segmenti diventano link e l’ultimo segmento viene trattato come pagina corrente.',
                },
                explicitItemList: {
                    title: 'Lista esplicita di elementi',
                    description: 'Usa un BreadcrumbItem[] quando le label differiscono dagli slug URL o quando ti serve controllo completo sui link.',
                },
                currentRoute: {
                    title: 'Route corrente (senza trail)',
                    description: 'Quando trail è omesso, il componente legge automaticamente la route corrente.',
                },
                chevronSeparator: {
                    title: 'Separatore chevron',
                },
                jsonLdStructuredData: {
                    title: 'Dati strutturati JSON-LD',
                    description: 'Abilita jsonLd per iniettare uno script schema.org BreadcrumbList. baseUrl viene usato solo per lo schema e non cambia i link visivi.',
                },
                standaloneSchema: {
                    title: 'buildBreadcrumbSchema - uso standalone',
                    description: 'Usa l’utility esportata per generare dati schema.org in modo indipendente per SSR, sitemap o iniezione custom nell’head. stringify: true restituisce una stringa pronta per dangerouslySetInnerHTML.',
                },
            },
            labels: {
                home: 'Home',
                products: 'Prodotti',
                shoes: 'Scarpe',
                sneakers: 'Sneakers',
                runningShoes: 'Scarpe running',
                docs: 'Docs',
                components: 'Componenti',
                breadcrumbs: 'Breadcrumbs',
                jsonLdOutput: 'Output JSON-LD (schema.org BreadcrumbList)',
                generatedScriptTag: 'script <script type="application/ld+json"> generato',
                currentPageOmitted: 'senza href -> pagina corrente',
            },
            propsDocs: {
                items: {
                    trail: { description: 'Il percorso breadcrumb. Passa una stringa URL per analizzare automaticamente i segmenti, oppure un BreadcrumbItem[] per controllo esplicito. Se omesso, usa la route corrente.' },
                    rootItem: { description: 'Elemento ancora opzionale renderizzato prima del trail. Passa una stringa per una label semplice o un BreadcrumbItem per aggiungere un link.' },
                    separator: { description: 'Separatore renderizzato tra gli elementi. Usa "chevron" per una freccia SVG.' },
                    jsonLd: { description: 'Quando true, renderizza un tag BreadcrumbList <script type="application/ld+json"> per dati SEO strutturati.' },
                    baseUrl: { description: 'Base URL anteposto agli href solo nell’output JSON-LD. Non influisce sui link visivi e di default usa window.location.origin.' },
                    className: { description: 'Classi CSS sul wrapper nav.' },
                },
                schemaTitle: 'buildBreadcrumbSchema',
                schemaItems: {
                    items: { description: 'La lista di elementi breadcrumb. Gli elementi con href ottengono un URL assoluto nello schema; quelli senza href per la pagina corrente no.' },
                    rootItem: { description: 'Elemento ancora opzionale anteposto agli items, con la stessa shape di BreadcrumbItem.' },
                    baseUrl: { description: 'Base URL anteposto a tutti gli href per produrre URL assoluti richiesti da schema.org.' },
                    stringify: { description: 'Quando true restituisce una stringa JSON invece di un oggetto plain, pronta per dangerouslySetInnerHTML senza JSON.stringify.' },
                },
            },
            playground: {
                title: 'Breadcrumbs',
                shortcuts: {
                    urlString: 'Stringa URL',
                    explicitItems: 'Elementi espliciti',
                    deepPath: 'Percorso profondo',
                    clear: 'Pulisci',
                    stringValue: 'Stringa',
                    withLink: 'Con link',
                },
            },
        },
    },
});
