import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        auth: {
            page: {
                title: 'Auth',
                description: 'UI auth guidata dal provider per login applicativo e integrazioni OAuth esterne.',
            },
            sections: {
                avatarLogin: {
                    title: 'Login avatar',
                    description: 'Usa il servizio auth predefinito come identita applicativa e renderizzalo come controllo profilo o avatar.',
                },
                integrationConnect: {
                    title: 'Connessione integrazione',
                    description: 'Usa un servizio auth nominato per integrazioni esterne. La preview showcase e disabilitata per evitare l apertura di una finestra reale del provider.',
                },
            },
            labels: {
                authButtonPropsTitle: 'Props AuthButton',
                authButtonPlaygroundTitle: 'AuthButton',
                primaryButtonClasses: 'classi pulsante primary',
                connectDropbox: 'Connetti Dropbox',
            },
            propsDocs: {
                items: {
                    provider: { description: 'Chiave del driver AuthProvider. Di default usa il servizio auth dell app.' },
                    intent: { description: 'Azione richiesta al provider auth selezionato.' },
                    aspect: { description: 'Presentazione visuale dell azione auth.' },
                    scopes: { description: 'Scope richiesti al provider selezionato.' },
                    iconLogout: { description: 'Chiave IconProvider usata per la voce logout del menu avatar.' },
                    avatarClass: { description: 'Classi CSS applicate all avatar profilo.' },
                    options: { description: 'Override ActionButton applicati sopra i default del pulsante auth. Quando presenti, le singole prop top-level vengono usate come fallback.' },
                    label: { description: 'Label del pulsante. Sovrascritta da options.label quando options e presente. Di default mostra Connected se autenticato, altrimenti Sign in per intent signIn.' },
                    icon: { description: 'Chiave IconProvider del pulsante. Sovrascritta da options.icon quando options e presente. Di default usa link o link-break in base allo stato auth.' },
                    title: { description: 'Attributo title nativo tooltip. Sovrascritto da options.title quando options e presente. Viene impostato automaticamente con un errore di configurazione se il provider non e configurato.' },
                    disabled: { description: 'Disabilita il pulsante. Sovrascritto da options.disabled quando options e presente. Forzato automaticamente a true quando il provider auth non e configurato.' },
                    className: { description: 'Classi CSS applicate al pulsante. Sovrascritte da options.className quando options e presente.' },
                },
            },
            playground: {
                title: 'AuthButton',
                shortcuts: {
                    dropbox: { label: 'dropbox', help: 'Scope lettura Dropbox.' },
                    drive: { label: 'drive', help: 'Scope readonly Google Drive.' },
                    empty: { label: 'empty', help: 'Nessuno scope extra.' },
                },
            },
        },
    },
});
