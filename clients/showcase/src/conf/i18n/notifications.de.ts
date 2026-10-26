import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: 'Benachrichtigungen',
                description: 'Benachrichtigungsmenue auf Basis von Dropdown und DropdownItem.',
            },
            sections: {
                notificationMenu: {
                    title: 'Benachrichtigungsmenue',
                    description: 'Mit Notifications lassen sich aktuelle Updates hinter einem Glocken-Trigger mit Badge, Titel, Zeit und Icon anzeigen.',
                },
            },
            detail: {
                title: 'Detail und Aktionen',
                description: 'Eine Detailzeile unter dem Titel, Schaltflächen, um im Menü zu handeln, ohne den Eintrag zu öffnen (mit Ladeanzeige, solange sie arbeiten), und externe Links in einem neuen Tab. onItemClick meldet, welcher Eintrag geöffnet wurde, um ihn als gelesen zu markieren.',
                sourceTitle: 'Quelle ohne Action',
                sourceDetail: 'crm · sources/notes/pricing.md',
                openAction: 'Action öffnen',
                blockedTitle: 'Issue blockiert',
                blockedDetail: 'crm #12 · an eine Person übergeben',
                now: 'jetzt',
            },
            labels: {
                newDeploymentCompleted: 'Neue Bereitstellung abgeschlossen',
                storageUsageReached80: 'Speichernutzung hat 80 % erreicht',
                twoMinutesAgo: 'vor 2 Minuten',
                oneHourAgo: 'vor 1 Stunde',
            },
            propsDocs: {
                items: {
                    items: { description: 'Benachrichtigungseintraege im Dropdown.' },
                    badge: { description: 'Badge auf dem Glocken-Trigger.' },
                    description: { description: 'Zeile unter dem Titel jedes Eintrags: was und wo.' },
                    actions: { description: 'Schaltflächen unter dem Eintrag: Sie handeln, ohne ihn zu öffnen, mit Ladeanzeige während des Promise.' },
                    external: { description: 'Öffnet die URL als Adresse in einem neuen Tab statt als Route.' },
                    onItemClick: { description: 'Wird aufgerufen, wenn ein Eintrag geöffnet wird (z. B. um ihn als gelesen zu markieren); das Menü schließt sich.' },
                    wrapperClassName: { description: 'CSS-Klassen fuer den Wrapper.' },
                },
            },
            playground: {
                title: 'Benachrichtigungen',
                defaultBadge: '2',
            },
        },
    },
});
