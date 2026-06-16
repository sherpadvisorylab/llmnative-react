import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        auth: {
            page: {
                title: 'Auth',
                description: 'Provider-gesteuerte Auth-UI fuer App-Anmeldung und externe OAuth-Integrationen.',
            },
            sections: {
                avatarLogin: {
                    title: 'Avatar-Login',
                    description: 'Nutze den Standard-Auth-Service als Anwendungsidentitaet und rendere ihn als Profil- oder Avatar-Steuerelement.',
                },
                integrationConnect: {
                    title: 'Integrationsverbindung',
                    description: 'Nutze einen benannten Auth-Service fuer externe Integrationen. Die Showcase-Vorschau ist deaktiviert, damit kein echtes Provider-Fenster geoeffnet wird.',
                },
            },
            labels: {
                authButtonPropsTitle: 'AuthButton-Props',
                authButtonPlaygroundTitle: 'AuthButton',
                primaryButtonClasses: 'Primary-Button-Klassen',
                connectDropbox: 'Dropbox verbinden',
            },
            propsDocs: {
                items: {
                    provider: { description: 'AuthProvider-Treiberschluessel. Standardmaessig wird der Auth-Service der App verwendet.' },
                    intent: { description: 'Angeforderte Aktion fuer den ausgewaehlten AuthProvider.' },
                    aspect: { description: 'Visuelle Darstellung der Auth-Aktion.' },
                    scopes: { description: 'Vom ausgewaehlten Provider angeforderte Scopes.' },
                    iconLogout: { description: 'IconProvider-Schluessel fuer den Logout-Menueeintrag des Avatars.' },
                    avatarClass: { description: 'CSS-Klassen fuer den Profil-Avatar.' },
                    options: { description: 'ActionButton-Overrides ueber den Standardwerten des Auth-Buttons. Wenn gesetzt, dienen die einzelnen Top-Level-Props als Fallback.' },
                    label: { description: 'Button-Beschriftung. Wird von options.label ueberschrieben, wenn options gesetzt ist. Standard ist Connected bei Anmeldung, sonst Sign in fuer signIn.' },
                    icon: { description: 'IconProvider-Schluessel fuer den Button. Wird von options.icon ueberschrieben, wenn options gesetzt ist. Standard ist link oder link-break je nach Auth-Status.' },
                    title: { description: 'Natives title-Attribut als Tooltip. Wird von options.title ueberschrieben, wenn options gesetzt ist. Bei fehlender Provider-Konfiguration wird automatisch ein Fehlerhinweis gesetzt.' },
                    disabled: { description: 'Deaktiviert den Button. Wird von options.disabled ueberschrieben, wenn options gesetzt ist. Wird automatisch true, wenn der Auth-Provider nicht konfiguriert ist.' },
                    className: { description: 'CSS-Klassen fuer den Button. Wird von options.className ueberschrieben, wenn options gesetzt ist.' },
                },
            },
            playground: {
                title: 'AuthButton',
                shortcuts: {
                    dropbox: { label: 'dropbox', help: 'Dropbox-Lese-Scopes.' },
                    drive: { label: 'drive', help: 'Google-Drive-Readonly-Scope.' },
                    empty: { label: 'empty', help: 'Keine zusaetzlichen Scopes.' },
                },
            },
        },
    },
});
