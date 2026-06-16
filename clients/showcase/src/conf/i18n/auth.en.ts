import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        auth: {
            page: {
                title: 'Auth',
                description: 'Provider-driven auth UI for app sign-in and external OAuth integrations.',
            },
            sections: {
                avatarLogin: {
                    title: 'Avatar login',
                    description: 'Use the default auth service as application identity and render it as a profile/avatar control.',
                },
                integrationConnect: {
                    title: 'Integration connect',
                    description: 'Use a named auth service for external integrations. The showcase preview is disabled to avoid opening a real provider window.',
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
                    provider: { description: 'AuthProvider driver key. Defaults to the app auth service.' },
                    intent: { description: 'Action requested from the selected AuthProvider.' },
                    aspect: { description: 'Visual presentation of the auth action.' },
                    scopes: { description: 'Scopes requested from the selected provider.' },
                    iconLogout: { description: 'IconProvider key used for the avatar logout menu item.' },
                    avatarClass: { description: 'CSS classes applied to the profile avatar.' },
                    options: { description: 'ActionButton overrides applied on top of the auth button defaults. When set, individual top-level props are used as fallback values.' },
                    label: { description: 'Button label. Overridden by options.label when options is provided. Defaults to Connected when authenticated, Sign in for signIn intent otherwise.' },
                    icon: { description: 'IconProvider key for the button. Overridden by options.icon when options is provided. Defaults to link or link-break based on auth state.' },
                    title: { description: 'Native title attribute tooltip. Overridden by options.title when options is provided. Auto-set to a configuration error message when the provider is not configured.' },
                    disabled: { description: 'Disables the button. Overridden by options.disabled when options is provided. Automatically forced to true when the auth provider is not configured.' },
                    className: { description: 'CSS classes applied to the button. Overridden by options.className when options is provided.' },
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
