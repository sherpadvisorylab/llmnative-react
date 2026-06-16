import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        badge: {
            page: { title: 'Badge', description: 'Etichette inline per stati, contatori e categorie. Quando children e un elemento React, Badge entra in modalita overlay e posiziona gli indicatori su quell\'elemento.' },
            sections: {
                colorVariants: { title: 'Varianti colore', description: 'I badge inline usano testo o contenuto React inline come children.' },
                overlayAfter: { title: 'Overlay: after in alto a destra', description: 'Passa un elemento React come children con after per mostrare un badge in alto a destra.' },
                overlayBefore: { title: 'Overlay: before in alto a sinistra', description: 'Usa before per posizionare il badge in alto a sinistra.' },
                overlayBoth: { title: 'Overlay: entrambi gli angoli', description: 'before e after possono coesistere: in alto a sinistra e in alto a destra contemporaneamente.' },
                overlayDot: { title: 'Overlay: punto', description: 'Senza before o after viene mostrato un piccolo indicatore a punto in alto a destra.' },
                inlineMode: { title: 'Inline con before/after', description: 'In modalita inline, before e after vengono renderizzati fuori dallo span del badge.' },
            },
        },
    },
});
