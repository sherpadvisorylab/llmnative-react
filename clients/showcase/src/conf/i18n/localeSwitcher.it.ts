import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        localeSwitcher: {
            page: {
                title: 'LocaleSwitcher',
                description: 'Dropdown che permette all utente di cambiare la lingua attiva a runtime. Non renderizza nulla quando e configurata una sola lingua e salva la scelta nel cookie llmnative_locale.',
            },
            sections: {
                liveDemo: {
                    title: 'Demo live',
                    description: 'Lo switcher qui sotto controlla la lingua di tutto lo showcase. Le traduzioni configurate sono subito disponibili, quindi cambiando lingua si aggiornano sidebar, pulsanti e preview dei componenti.',
                },
                nullWhenSingleLocale: {
                    title: 'Null con una sola lingua configurata',
                    description: 'LocaleSwitcher restituisce null automaticamente quando translations contiene zero o una sola lingua. Il consumer non ha bisogno di rendering condizionale.',
                },
                customLabels: {
                    title: 'Etichette lingua personalizzate',
                    description: 'La prop labels sovrascrive o estende la mappa interna dei nomi lingua. Utile quando il pubblico si aspetta nomi nativi, abbreviazioni o badge personalizzati.',
                },
                cookiePersistence: {
                    title: 'Persistenza via cookie',
                    description: 'La lingua selezionata viene salvata in un cookie first-party con durata di un anno. Al caricamento successivo, il cookie ha priorita sulla locale dichiarata in App.i18n.',
                },
                appConfiguration: {
                    title: 'Configurare le traduzioni in App',
                    description: 'Passa translations ad App.i18n per rendere disponibili altre lingue. Ogni chiave locale nell oggetto translations diventa un opzione selezionabile, mentre le chiavi mancanti ricadono su English.',
                },
            },
            labels: {
                language: 'Language',
                italian: 'Italiano',
                localeBadgeEn: 'EN',
                localeBadgeIt: 'IT',
                localeBadgeDe: 'DE',
                localeBadgeRu: 'RU',
                localeBadgeZh: 'ZH',
                localeBadgeAr: 'AR',
            },
            propsDocs: {
                items: {
                    icon: { description: 'Nome icona passato al componente Icon. Va bene qualsiasi icona supportata dal provider configurato.' },
                    label: { description: 'Etichetta visibile opzionale renderizzata prima della select.' },
                    labels: { description: 'Permette di sovrascrivere o estendere i nomi visualizzati per i codici lingua. Viene unita ai default interni.' },
                    className: { description: 'Classi CSS aggiuntive applicate al wrapper.' },
                },
            },
            playground: {
                title: 'LocaleSwitcher',
                props: {
                    icon: { description: 'Nome icona passato al componente Icon. Va bene qualsiasi icona supportata dal provider configurato.' },
                    label: { description: 'Etichetta visibile opzionale renderizzata prima della select.' },
                    className: { description: 'Classi CSS aggiuntive applicate al wrapper.' },
                },
            },
        },
    },
});
