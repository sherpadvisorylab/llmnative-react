import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        auth: {
            page: {
                title: 'Auth',
                description: 'Provider-driven auth UI litasjil dukhul al tatbiq wa lil external OAuth integrations.',
            },
            sections: {
                avatarLogin: {
                    title: 'Avatar login',
                    description: 'Istakhdim al auth service al iftiradi kahuwiya lil tatbiq wa ardhu ka profile aw avatar control.',
                },
                integrationConnect: {
                    title: 'Integration connect',
                    description: 'Istakhdim auth service musamma lil external integrations. Al showcase preview muattal li tajannub fath nafitha haqiqiya lil provider.',
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
                    provider: { description: 'AuthProvider driver key. By default yastakhdim auth service al app.' },
                    intent: { description: 'Al amal al matlub min al AuthProvider al mukhtar.' },
                    aspect: { description: 'Al ard al basari li amal al auth.' },
                    scopes: { description: 'Al scopes al matluba min al provider al mukhtar.' },
                    iconLogout: { description: 'IconProvider key lil avatar logout menu item.' },
                    avatarClass: { description: 'CSS classes al mutabbaqa ala profile avatar.' },
                    options: { description: 'ActionButton overrides fawq defaults al auth button. Inda tawafurha, tastakhdim al props al ulya ka fallback.' },
                    label: { description: 'Button label. Yutaghallab alayha min options.label inda tawafur options. Al iftiradi Connected aw Sign in hasab al halah.' },
                    icon: { description: 'IconProvider key lil button. Yutaghallab alayha min options.icon inda tawafur options. Al iftiradi link aw link-break hasab auth state.' },
                    title: { description: 'Native title tooltip. Yutaghallab alayha min options.title inda tawafur options. Tudad awtomatikiyaan ila khata takwin iza lam yukon al provider muaddadan.' },
                    disabled: { description: 'Yuattil al button. Yutaghallab alayha min options.disabled inda tawafur options. Tufrad true awtomatikiyaan iza lam yukon al auth provider muaddadan.' },
                    className: { description: 'CSS classes al mutabbaqa ala al button. Yutaghallab alayha min options.className inda tawafur options.' },
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
