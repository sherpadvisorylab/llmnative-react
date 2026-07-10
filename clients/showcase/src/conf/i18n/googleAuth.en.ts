import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        googleAuth: {
            page: { title: 'Google sign-in', description: 'Google OAuth 2.0 with AuthButton — requires real credentials to go live.' },
            sections: {
                authButton: { title: 'AuthButton', description: 'Use the AuthButton component with provider set to googleAuth and intent set to signIn. The demo below is disabled because no OAuth client is configured in this environment.' },
                configuration: { title: 'Configuration', description: 'Configure Google OAuth via App providers. Requires a Google Cloud Console project with OAuth 2.0 Web Client credentials.' },
                relatedPages: { title: 'Related pages', description: 'See the full Auth component page for all available AuthButton props, intents, and integrations (Dropbox, Firebase Auth, Supabase Auth).' },
            },
        },
    },
});
