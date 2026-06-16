import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        motion: {
            page: {
                title: 'Motion',
                description: 'Playground interattivo per il motion registry guidato dal tema, gli override locali dei componenti e la copertura attuale nel framework.',
            },
            sections: {
                presetControls: {
                    title: 'Controlli preset',
                    description: 'Passa tra i temi built-in e poi confronta come no-motion, subtle, standard ed expressive si comportano sopra il registry corrente.',
                },
                pressAndOpenStates: {
                    title: 'Stati press e open',
                    description: 'Questi controlli usano override motion locali derivati dal preset selezionato, cosi puoi confrontare l intensita senza cambiare il tema sottostante.',
                },
                modalAndTabTransitions: {
                    title: 'Transizioni di modal e tab',
                    description: 'Usa lo stesso preset su dialog centrati, pannelli laterali e transizioni dei contenuti tab per validare la coerenza prima di promuovere un effetto nel tema.',
                },
                sharedApi: {
                    title: 'API condivisa',
                    description: 'Queste sono le leve che stai esercitando in questo playground: entry nominate nel theme registry piu override locali sui componenti.',
                },
            },
            presets: {
                none: 'Disattiva il motion decorativo ed e utile come proxy rapido per reduced motion durante la QA visiva.',
                subtle: 'Discreto e veloce. Migliore per dashboard dense, pannelli admin e workflow operativi.',
                standard: 'Usa il theme registry corrente cosi com e. E il default di produzione che stai distribuendo oggi.',
                expressive: 'Movimenti piu lunghi e feedback piu marcato. Utile per demo, interazioni hero e prodotti piu visivi.',
            },
            labels: {
                theme: 'Tema',
                motionPreset: 'Preset motion',
                saveDraft: 'Salva bozza',
                publish: 'Pubblica',
                noMotion: 'Senza motion',
                pressCoverage: 'Gli stati press coprono attualmente ActionButton, LoadingButton e i trigger dei dropdown.',
                openMenu: 'Apri menu',
                motionAware: 'Consapevole del motion',
                localOverrideActive: 'Override locale attivo',
                currentPreset: 'Preset corrente',
                currentTheme: 'Tema corrente',
                effectLocal: 'Effetto',
                centerDialog: 'Dialog centrale',
                rightPanel: 'Pannello destro',
                notifications: 'Notifiche',
                buttons: 'Bottoni',
                accessibility: 'Accessibilita',
                pendingGap: 'Gap aperto',
                sharedApiPreview: 'La pagina e volutamente divisa tra realta a livello tema e override locali del playground. Questo la rende utile gia oggi, anche se il sistema globale di preset non e ancora modellato come API runtime di primo livello.',
                motionApiSurface: 'Superficie API Motion',
                centerDialogPreview: 'Anteprima dialog centrale',
                rightPanelPreview: 'Anteprima pannello destro',
                centerDialogHeader: 'Shell dialog standard con override motion locale.',
                rightPanelHeader: 'Pannello laterale che usa un preset motion custom sopra il tema corrente.',
                activeTheme: 'Tema attivo',
                activePlaygroundPreset: 'Preset playground attivo',
                previewNotice: 'Questa anteprima e volutamente locale: aiuta a confrontare l intensita del motion senza mutare il theme registry globale.',
                durationUnit: 'ms',
                reducedMotionSeparator: ' | ',
            },
            notifications: {
                registryReloaded: { title: 'Motion registry ricaricato', time: 'Proprio ora' },
                modalThemeFallback: { title: 'L anteprima modal usa il fallback del tema', time: '2 minuti fa' },
                reducedMotionRespected: { title: 'Reduced motion rispetta ancora le impostazioni del sistema operativo', time: '10 minuti fa' },
            },
            tabContent: {
                buttons: {
                    paragraph1: 'Le tab animano attualmente il pannello attivo con fadeUp a livello tema.',
                    paragraph2: 'Il playground puo sostituirlo localmente per confrontare transizioni subtle ed expressive.',
                },
                accessibility: {
                    paragraph1: 'none e utile per controllare il layout senza motion decorativo.',
                    paragraph2: 'prefers-reduced-motion a livello OS continua comunque a vincere quando un effetto usa respect-user.',
                },
                pendingGap: {
                    paragraph1: 'Notifications eredita gia il motion del dropdown dal tema.',
                    paragraph2: 'La rifinitura dedicata ai toast resta ancora il gap CR-027 dopo questa pagina.',
                },
            },
            propsDocs: {
                title: 'Superficie API Motion',
                items: {
                    motion: {
                        description: 'Override locale supportato da ActionButton, LoadingButton, Dropdown, Modal e Tab. Passa false per disabilitare il motion del componente.',
                        typeDetails: 'type MotionReference = string | MotionEffect | false',
                        example: `<Modal motion="slideFromRight" />
<ActionButton label="Save" motion={false} />`,
                    },
                    themeMotion: {
                        description: 'Mappatura a livello tema dagli stati semantici dei componenti agli effetti nominati presenti nel motion registry.',
                        example: `Modal: {
  motion: {
    center: 'fade',
    right: 'slideFromRight',
    backdrop: 'fade',
  },
}`,
                    },
                    transition: {
                        description: 'Durata, easing, delay e lista di proprieta usate da un effetto motion.',
                        typeDetails: `{
  duration?: number;
  easing?: string;
  delay?: number;
  properties?: string[];
}`,
                    },
                    reducedMotion: {
                        description: 'Controlla come l effetto si comporta quando l utente abilita reduced motion a livello sistema operativo.',
                        example: `motion={{
  from: { opacity: 0 },
  to: { opacity: 1 },
  reducedMotion: 'respect-user',
}}`,
                    },
                },
            },
        },
    },
});
