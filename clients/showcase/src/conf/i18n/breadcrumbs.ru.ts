import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        breadcrumbs: {
            page: {
                title: 'Breadcrumbs',
                description: 'Khlebnye kroshki mogut stroitsya iz URL-stroki ili iz yavnogo spiska elementov. Elementy s href renderjatsya kak ssylki; posledniy bez href schitaetsya tekushchey stranitsei.',
            },
            sections: {
                urlStringTrail: {
                    title: 'Put iz URL-stroki',
                    description: 'Peredayte URL-stroku: segmenty stanovyatsya ssylkami, a posledniy segment schitaetsya tekushchey stranitsei.',
                },
                explicitItemList: {
                    title: 'Yavnyy spisok elementov',
                    description: 'Ispolzuyte BreadcrumbItem[], kogda nazvaniya otlichayutsya ot URL-slug ili nuzhen polnyy kontrol nad ssylkami.',
                },
                currentRoute: {
                    title: 'Tekushchiy marshrut (bez trail)',
                    description: 'Esli trail ne peredan, komponent avtomaticheski chitaet tekushchiy marshrut.',
                },
                chevronSeparator: {
                    title: 'Razdelitel chevron',
                },
                jsonLdStructuredData: {
                    title: 'Strukturirovannye dannye JSON-LD',
                    description: 'Vklyuchite jsonLd, chtoby dobavit script schema.org BreadcrumbList. baseUrl ispolzuetsya tolko dlya skhemy i ne menyaet vizualnye ssylki.',
                },
                standaloneSchema: {
                    title: 'buildBreadcrumbSchema - samostoyatelnoe ispolzovanie',
                    description: 'Ispolzuyte eksportiruemuyu utility dlya generatsii dannykh schema.org otdelno dlya SSR, sitemap ili sobstvennogo head injection. stringify: true vozvrashchaet stroku, gotovuyu dlya dangerouslySetInnerHTML.',
                },
            },
            labels: {
                home: 'Glavnaya',
                products: 'Produkty',
                shoes: 'Obuv',
                sneakers: 'Krossovki',
                runningShoes: 'Begovaya obuv',
                docs: 'Docs',
                components: 'Komponenty',
                breadcrumbs: 'Breadcrumbs',
                jsonLdOutput: 'JSON-LD vyvod (schema.org BreadcrumbList)',
                generatedScriptTag: 'sgenerirovannyy <script type="application/ld+json">',
                currentPageOmitted: 'bez href -> tekushchaya stranitsa',
            },
            propsDocs: {
                items: {
                    trail: { description: 'Tsepочка khlebnykh kroshek. Peredayte URL-stroku dlya avtomaticheskogo razbora segmentov ili BreadcrumbItem[] dlya yavnogo kontrolya. Pri otsutstvii ispolzuetsya tekushchiy marshrut.' },
                    rootItem: { description: 'Neobyazatelnyy yakornyy element pered trail. Stroka daet prostuyu metku, a BreadcrumbItem pozvolyaet dobavit ssylku.' },
                    separator: { description: 'Razdelitel mezhdu elementami. Ispolzuyte "chevron" dlya SVG-strelki.' },
                    jsonLd: { description: 'Kogda true, komponent renderit BreadcrumbList <script type="application/ld+json"> dlya strukturirovannykh SEO-dannykh.' },
                    baseUrl: { description: 'Bazovyy URL, dobavlyaemyy k href tolko v JSON-LD vyvode. Vizualnye ssylki ne menyaetsya; po umolchaniyu window.location.origin.' },
                    className: { description: 'CSS-klassy na nav-obertke.' },
                },
                schemaTitle: 'buildBreadcrumbSchema',
                schemaItems: {
                    items: { description: 'Spisok elementov khlebnykh kroshek. Elementy s href poluchayut absolyutnyy URL v skheme; elementy bez href dlya tekushchey stranitsy net.' },
                    rootItem: { description: 'Neobyazatelnyy yakornyy element pered items s toy zhe formoy, chto i BreadcrumbItem.' },
                    baseUrl: { description: 'Bazovyy URL, dobavlyaemyy ko vsem href dlya polucheniya absolyutnykh URL, trebuemykh schema.org.' },
                    stringify: { description: 'Kogda true, vozvrashchaetsya JSON-stroka vmesto obychnogo obekta, gotovaya dlya dangerouslySetInnerHTML bez JSON.stringify.' },
                },
            },
            playground: {
                title: 'Breadcrumbs',
                shortcuts: {
                    urlString: 'URL-stroka',
                    explicitItems: 'Yavnye elementy',
                    deepPath: 'Glubokiy put',
                    clear: 'Ochistit',
                    stringValue: 'Stroka',
                    withLink: 'So ssylkoy',
                },
            },
        },
    },
});
