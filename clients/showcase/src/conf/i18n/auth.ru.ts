import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        auth: {
            page: {
                title: 'Auth',
                description: 'Provider-driven auth UI dlya vhoda v prilozhenie i vneshnikh OAuth integratsiy.',
            },
            sections: {
                avatarLogin: {
                    title: 'Avatar login',
                    description: 'Ispolzuyte auth service po umolchaniyu kak identichnost prilozheniya i renderite ego kak profil ili avatar control.',
                },
                integrationConnect: {
                    title: 'Integration connect',
                    description: 'Ispolzuyte imenovannyy auth service dlya vneshnikh integratsiy. Preview v showcase otklyuchen, chtoby ne otkryvat realnoe okno provider.',
                },
            },
            labels: {
                authButtonPropsTitle: 'AuthButton props',
                authButtonPlaygroundTitle: 'AuthButton',
                primaryButtonClasses: 'primary button classes',
                connectDropbox: 'Connect Dropbox',
            },
            propsDocs: {
                items: {
                    provider: { description: 'AuthProvider driver key. Po umolchaniyu ispolzuetsya auth service prilozheniya.' },
                    intent: { description: 'Deystvie, zaproshennoe u vybrannogo AuthProvider.' },
                    aspect: { description: 'Vizualnoe predstavlenie auth deystviya.' },
                    scopes: { description: 'Scopes, zaprashivaemye u vybrannogo provider.' },
                    iconLogout: { description: 'IconProvider key dlya punkta logout v avatar menu.' },
                    avatarClass: { description: 'CSS classes dlya profile avatar.' },
                    options: { description: 'ActionButton overrides poverh standartnykh nastroek auth button. Esli peredany, otdelnye top-level props rabotayut kak fallback.' },
                    label: { description: 'Button label. Pereopredelyaetsya cherez options.label. Po umolchaniyu Connected pri autentifikatsii ili Sign in dlya signIn intent.' },
                    icon: { description: 'IconProvider key dlya button. Pereopredelyaetsya cherez options.icon. Po umolchaniyu link ili link-break v zavisimosti ot auth state.' },
                    title: { description: 'Native title tooltip. Pereopredelyaetsya cherez options.title. Avtomaticheski ustanavlivaetsya v soobshchenie ob oshibke konfiguratsii, esli provider ne nastroen.' },
                    disabled: { description: 'Otkluchaet button. Pereopredelyaetsya cherez options.disabled. Avtomaticheski stanovitsya true, esli auth provider ne nastroen.' },
                    className: { description: 'CSS classes dlya button. Pereopredelyaetsya cherez options.className.' },
                },
            },
            playground: {
                title: 'AuthButton',
                shortcuts: {
                    dropbox: { label: 'dropbox', help: 'Dropbox read scopes.' },
                    drive: { label: 'drive', help: 'Google Drive readonly scope.' },
                    empty: { label: 'empty', help: 'No extra scopes.' },
                },
            },
        },
    },
});
