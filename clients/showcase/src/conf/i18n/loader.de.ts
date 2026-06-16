import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loader: {
            page: { title: 'Loader', description: 'Overlay-Spinner, der beliebigen Inhalt umschliesst. Wenn show=true ist, wird ueber den children ein unscharfer Hintergrund mit thematischem Spinner gerendert; der Inhalt bleibt im DOM und erscheint sofort wieder, wenn der Loader ausgeblendet wird.' },
            sections: {
                showHide: { title: 'Anzeigen / ausblenden', description: 'Schalte show um, um den umschlossenen Inhalt zu ueberlagern oder wieder anzuzeigen. Der Inhalt bleibt immer gemountet: kein Layout-Sprung, wenn der Loader verschwindet.' },
                custom: { title: 'Benutzerdefiniertes Icon und Nachricht', description: 'Ueberschreibt die Theme-Standards pro Instanz mit icon, title und description. Der icon-Wert ist ein Icon-Name: jedes vom konfigurierten Provider unterstuetzte Icon funktioniert.' },
                card: { title: 'Card-Integration', description: 'Card bietet eine showLoader-Prop als bequeme Kurzform: Der Card-Body wird automatisch in einen Loader gewrappt.' },
                other: { title: 'Weitere Ladeindikatoren im Framework', description: '@llmnative/react bietet weitere Lade-Patterns fuer unterschiedliche Kontexte.' },
            },
        },
    },
});
