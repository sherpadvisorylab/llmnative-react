import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        identicon: {
            page: {
                title: 'Identicon',
                description: "Ein aus einem Wert gezeichnetes Symbol, wie GitHub es für ein Konto ohne Bild zeichnet: ein symmetrisches 5×5-Raster, Zellen und Farbton aus einem Hash. Derselbe Wert ergibt immer dasselbe Symbol; nichts wird geladen oder gespeichert.",
            },
            sections: {
                values: {
                    title: "Werte",
                    description: "Jeder Wert erhält sein eigenes Symbol: für Repositories, Mandanten oder Benutzer ohne Bild.",
                },
                sizes: {
                    title: "Größen",
                    description: "size setzt Breite und Höhe in Pixeln; die Zeichnung skaliert ohne Unschärfe.",
                },
                inRow: {
                    title: "In einer Zeile",
                    description: "before und after setzen Inhalte neben das Symbol; className ändert seine Form.",
                },
            },
            labels: {
                repository: "Repository",
            },
            propsDocs: {
                title: "Identicon-Props",
                items: {
                    value: { description: "Wofür das Symbol steht: derselbe Wert zeichnet immer dasselbe Symbol." },
                    size: { description: "Breite und Höhe in Pixeln (Standard 40)." },
                    title: { description: "Barrierefreier Name: damit ist das Symbol role=\"img\"; ohne ist es dekorativ (aria-hidden)." },
                    before: { description: "Inhalt vor dem Symbol." },
                    after: { description: "Inhalt nach dem Symbol." },
                    className: { description: "Klassen des SVG; standardmäßig rounded-md bg-muted (Theme Identicon.className)." },
                    wrapperClassName: { description: "Klassen des Wrappers, nur mit before oder after vorhanden." },
                },
            },
            playground: {
                title: 'Identicon',
            },
        },
    },
});
