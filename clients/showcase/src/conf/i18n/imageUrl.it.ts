import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageUrl: {
            page: {
                title: 'ImageUrl',
                description: 'Campo composto per URL immagine, metadati prompt alt, larghezza, altezza e anteprima live.',
            },
            sections: {
                imageMetadata: {
                    title: 'Metadati immagine',
                },
            },
            labels: {
                hero: 'hero',
                heroImage: 'Immagine hero',
                blueHeroIllustration: 'Illustrazione hero blu',
                squareThumbnail: 'Miniatura quadrata',
            },
            propsDocs: {
                title: 'Props ImageUrl',
                items: {
                    name: { description: 'Nome del campo oggetto nel record del Form.' },
                    label: { description: 'Etichetta del campo URL.' },
                    required: { description: 'Segna i campi nidificati come obbligatori.' },
                    defaultValue: { description: 'Oggetto immagine nidificato iniziale.' },
                    value: { description: 'Valore controllato dell oggetto immagine nidificato gestito esternamente.' },
                    inheritWrapperClassName: { description: 'Quando true il campo eredita wrapperClassName dal contesto Form padre.' },
                    mode: { description: 'Modalita prompt usata per il testo alt.' },
                    before: { description: 'Contenuto prima del gruppo di campi.' },
                    after: { description: 'Contenuto dopo il gruppo di campi.' },
                    onChange: { description: 'Handler custom di change chiamato dal contesto Form.' },
                    className: { description: 'Classi CSS sull input URL.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper.' },
                },
            },
            playground: {
                title: 'ImageUrl',
            },
        },
    },
});
