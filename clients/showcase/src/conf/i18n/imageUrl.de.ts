import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageUrl: {
            page: {
                title: 'ImageUrl',
                description: 'Zusammengesetztes Formularfeld fuer Bild-URL, Alt-Prompt-Metadaten, Breite, Hoehe und Live-Vorschau.',
            },
            sections: {
                imageMetadata: {
                    title: 'Bildmetadaten',
                },
            },
            labels: {
                hero: 'hero',
                heroImage: 'Hero-Bild',
                blueHeroIllustration: 'Blaue Hero-Illustration',
                squareThumbnail: 'Quadratisches Thumbnail',
            },
            propsDocs: {
                title: 'ImageUrl-Props',
                items: {
                    name: { description: 'Objekt-Feldname im Form-Datensatz.' },
                    label: { description: 'Label fuer das URL-Feld.' },
                    required: { description: 'Markiert verschachtelte Felder als erforderlich.' },
                    defaultValue: { description: 'Initiales verschachteltes Bildobjekt.' },
                    value: { description: 'Kontrollierter Wert des extern verwalteten verschachtelten Bildobjekts.' },
                    inheritWrapperClassName: { description: 'Wenn true, erbt das Feld wrapperClassName aus dem uebergeordneten Form-Kontext.' },
                    mode: { description: 'Prompt-Modus fuer den Alt-Text.' },
                    before: { description: 'Inhalt vor der Feldgruppe.' },
                    after: { description: 'Inhalt nach der Feldgruppe.' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    className: { description: 'CSS-Klassen am URL-Input.' },
                    wrapperClassName: { description: 'CSS-Klassen am Wrapper.' },
                },
            },
            playground: {
                title: 'ImageUrl',
            },
        },
    },
});
