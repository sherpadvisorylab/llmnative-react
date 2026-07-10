import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        googleAuth: {
            page: { title: 'Accesso Google', description: 'OAuth 2.0 con Google tramite AuthButton — richiede credenziali reali per funzionare.' },
            sections: {
                authButton: { title: 'AuthButton', description: 'Usa il componente AuthButton con provider impostato a googleAuth e intent a signIn. La demo qui sotto è disabilitata perché nessun client OAuth è configurato in questo ambiente.' },
                configuration: { title: 'Configurazione', description: 'Configura Google OAuth tramite App providers. Richiede un progetto Google Cloud Console con credenziali client OAuth 2.0 Web.' },
                relatedPages: { title: 'Pagine correlate', description: 'Consulta la pagina componente Auth per tutte le props AuthButton, intent e integrazioni (Dropbox, Firebase Auth, Supabase Auth).' },
            },
        },
    },
});
