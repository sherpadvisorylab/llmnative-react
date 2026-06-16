import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadImage: {
            page: {
                title: 'UploadImage',
                description: 'Campo upload immagini con anteprima thumbnail inline, azioni overlay al passaggio del mouse e supporto opzionale a piu immagini. Salva i descrittori file nel record del Form.',
            },
            sections: {
                singleImage: {
                    title: 'Immagine singola',
                    description: 'Uso predefinito: un\'immagine alla volta con thumbnail di dimensione fissa. Dopo il caricamento puoi usare le azioni overlay per anteprima o rimozione.',
                },
                multipleImages: {
                    title: 'Immagini multiple',
                    description: 'Passa multiple per consentire la selezione di piu immagini. Ogni file viene renderizzato come thumbnail separata. L\'upload si ferma quando viene raggiunto il limite max.',
                },
                editableCrop: {
                    title: 'Modificabile (crop)',
                    description: 'Aggiungi editable per mostrare l\'icona matita al passaggio del mouse. Il click apre l\'editor immagini con strumenti di crop e scala, e le varianti generate vengono salvate in quell\'entry del Form record.',
                },
                acceptFilter: {
                    title: 'Filtro accept',
                    description: 'Limita il selettore file a specifici tipi MIME. Il browser applica il filtro nel selettore file nativo.',
                },
            },
            labels: {
                avatar: 'Avatar',
                galleryMax: 'Gallery (max 6)',
                coverPhotoEditable: 'Foto copertina (modificabile)',
                pngOnly: 'Solo PNG',
            },
            propsDocs: {
                title: 'Props di UploadImage',
                items: {
                    name: { description: 'Nome del campo collegato al record del Form' },
                    label: { description: 'Etichetta renderizzata sopra l\'area di upload' },
                    multiple: { description: 'Consente di selezionare piu di un\'immagine alla volta', default: 'false' },
                    editable: { description: 'Mostra il pulsante crop/modifica al passaggio del mouse; apre l\'image editor', default: 'false' },
                    previewWidth: { description: 'Larghezza della thumbnail in pixel', default: '100' },
                    previewHeight: { description: 'Altezza della thumbnail in pixel', default: '100' },
                    accept: { description: 'Tipi MIME accettati (es. "image/png,image/jpeg")', default: '"image/*"' },
                    max: { description: 'Numero massimo di file consentiti', default: '100' },
                    required: { description: 'Marca il campo come obbligatorio; blocca l\'invio del form se vuoto', default: 'false' },
                    onChange: { description: 'Chiamata a ogni modifica della lista file con il valore aggiornato e il contesto form' },
                    before: { description: 'Contenuto renderizzato prima della griglia immagini, dentro il wrapper esterno' },
                    after: { description: 'Contenuto renderizzato dopo la griglia immagini, dentro il wrapper esterno' },
                    className: { description: 'Classi CSS sul contenitore interno' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper esterno' },
                },
            },
            playground: {
                title: 'Playground UploadImage',
                defaultLabel: 'Gallery',
            },
        },
    },
});
