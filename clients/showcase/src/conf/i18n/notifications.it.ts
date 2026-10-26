import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: 'Notifiche',
                description: 'Menu notifiche costruito sopra Dropdown e DropdownItem.',
            },
            sections: {
                notificationMenu: {
                    title: 'Menu notifiche',
                    description: 'Usa Notifications per mostrare aggiornamenti recenti dietro un trigger a campanella con badge, titolo, orario e icona.',
                },
            },
            detail: {
                title: 'Dettaglio e azioni',
                description: 'Una riga di dettaglio sotto il titolo, pulsanti per agire dal menu senza aprire la voce (con il caricamento finché lavorano) e link esterni in una nuova scheda. onItemClick dice quale voce è stata aperta, per segnarla letta.',
                sourceTitle: 'Fonte senza Action',
                sourceDetail: 'crm · sources/notes/pricing.md',
                openAction: 'Apri l\'Action',
                blockedTitle: 'Issue bloccata',
                blockedDetail: 'crm #12 · passata a una persona',
                now: 'ora',
            },
            labels: {
                newDeploymentCompleted: 'Nuovo deploy completato',
                storageUsageReached80: "L'utilizzo dello storage ha raggiunto l'80%",
                twoMinutesAgo: '2 minuti fa',
                oneHourAgo: '1 ora fa',
            },
            propsDocs: {
                items: {
                    items: { description: 'Record di notifica renderizzati nel menu.' },
                    badge: { description: 'Badge mostrato sul toggle della campanella.' },
                    description: { description: 'Riga sotto il titolo di ogni voce: cosa e dove.' },
                    actions: { description: 'Pulsanti sotto la voce: agiscono senza aprirla, con il caricamento durante la promessa.' },
                    external: { description: 'Apre l\'url come indirizzo in una nuova scheda invece che come rotta.' },
                    onItemClick: { description: 'Chiamata quando una voce viene aperta (es. per segnarla letta); il menu si chiude.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper.' },
                },
            },
            playground: {
                title: 'Notifiche',
                defaultBadge: '2',
            },
        },
    },
});
