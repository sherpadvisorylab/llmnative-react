import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        motion: {
            page: {
                title: 'Motion',
                description: 'Interaktives Playground fur das theme-gesteuerte Motion-Registry, lokale Komponenten-Overrides und die aktuelle Abdeckung im Framework.',
            },
            sections: {
                presetControls: { title: 'Preset-Steuerung', description: 'Wechsle zwischen den eingebauten Themes und vergleiche dann, wie sich no-motion, subtle, standard und expressive auf dem aktuellen Registry anfuhlen.' },
                pressAndOpenStates: { title: 'Press- und Open-States', description: 'Diese Controls verwenden lokale Motion-Overrides aus dem gewahlten Preset, damit du die Intensitat vergleichen kannst, ohne das zugrunde liegende Theme zu andern.' },
                modalAndTabTransitions: { title: 'Modal- und Tab-Ubergange', description: 'Nutze dasselbe Preset fur zentrierte Dialoge, Seitenpanels und Tab-Content-Ubergange, um Konsistenz zu validieren, bevor ein Effekt ins Theme ubernommen wird.' },
                sharedApi: { title: 'Gemeinsame API', description: 'Das sind die Stellschrauben in diesem Playground: benannte Registry-Eintrage im Theme plus lokale Komponenten-Overrides.' },
            },
            presets: {
                none: 'Deaktiviert dekorative Bewegung und ist als schneller Reduced-Motion-Ersatz wahrend visueller QA nutzlich.',
                subtle: 'Ruhig und schnell. Besser fur dichte Dashboards, Admin-Panels und operative Workflows.',
                standard: 'Verwendet das aktuelle Theme-Registry unverandert. Das ist der Produktionsstandard, den du heute auslieferst.',
                expressive: 'Langere Wege und starkeres Feedback. Gut fur Demos, Hero-Interaktionen und visuellere Produkte.',
            },
            labels: {
                theme: 'Theme',
                motionPreset: 'Motion-Preset',
                saveDraft: 'Entwurf speichern',
                publish: 'Veroffentlichen',
                noMotion: 'Keine Motion',
                pressCoverage: 'Press-States decken derzeit ActionButton, LoadingButton und Dropdown-Trigger ab.',
                openMenu: 'Menue offnen',
                motionAware: 'Motion-bewusst',
                localOverrideActive: 'Lokaler Override aktiv',
                currentPreset: 'Aktuelles Preset',
                currentTheme: 'Aktuelles Theme',
                effectLocal: 'Effekt',
                centerDialog: 'Zentraler Dialog',
                rightPanel: 'Rechtes Panel',
                notifications: 'Benachrichtigungen',
                buttons: 'Buttons',
                accessibility: 'Barrierefreiheit',
                pendingGap: 'Offene Lucke',
                sharedApiPreview: 'Die Seite ist bewusst zwischen Theme-Realitat und lokalen Playground-Overrides aufgeteilt. Dadurch ist sie schon heute nutzlich, obwohl das globale Preset-System noch keine vollwertige Runtime-API ist.',
                motionApiSurface: 'Motion-API-Flache',
                centerDialogPreview: 'Vorschau zentraler Dialog',
                rightPanelPreview: 'Vorschau rechtes Panel',
                centerDialogHeader: 'Standard-Dialog-Shell mit lokalem Motion-Override.',
                rightPanelHeader: 'Seitenpanel mit benutzerdefiniertem Motion-Preset uber dem aktuellen Theme.',
                activeTheme: 'Aktives Theme',
                activePlaygroundPreset: 'Aktives Playground-Preset',
                previewNotice: 'Diese Vorschau ist bewusst lokal: Sie hilft beim Vergleich der Motion-Intensitat, ohne das globale Theme-Registry zu verandern.',
                durationUnit: 'ms',
                reducedMotionSeparator: ' | ',
            },
            notifications: {
                registryReloaded: { title: 'Motion-Registry neu geladen', time: 'Gerade eben' },
                modalThemeFallback: { title: 'Modal-Vorschau verwendet Theme-Fallback', time: 'Vor 2 Minuten' },
                reducedMotionRespected: { title: 'Reduced Motion respektiert weiterhin die Betriebssystem-Einstellungen', time: 'Vor 10 Minuten' },
            },
            tabContent: {
                buttons: { paragraph1: 'Tabs animieren ihr aktives Panel derzeit auf Theme-Ebene mit fadeUp.', paragraph2: 'Das Playground kann es lokal ersetzen, um subtle- und expressive-Ubergange zu vergleichen.' },
                accessibility: { paragraph1: 'none ist nutzlich, um Layouts ohne dekorative Bewegung zu prufen.', paragraph2: 'prefers-reduced-motion auf OS-Ebene gewinnt weiterhin, wenn ein Effekt respect-user verwendet.' },
                pendingGap: { paragraph1: 'Notifications ubernehmen bereits Dropdown-Motion aus dem Theme.', paragraph2: 'Eigenstandige Toast-Politur bleibt nach dieser Seite die verbleibende CR-027-Lucke.' },
            },
            propsDocs: {
                title: 'Motion-API-Flache',
                items: {
                    motion: { description: 'Lokaler Override fur ActionButton, LoadingButton, Dropdown, Modal und Tab. Ubergib false, um die Komponenten-Motion zu deaktivieren.', typeDetails: 'type MotionReference = string | MotionEffect | false', example: `<Modal motion="slideFromRight" />
<ActionButton label="Save" motion={false} />` },
                    themeMotion: { description: 'Theme-Ebene-Mapping von semantischen Komponenten-States auf benannte Effekte im Motion-Registry.', example: `Modal: {
  motion: {
    center: 'fade',
    right: 'slideFromRight',
    backdrop: 'fade',
  },
}` },
                    transition: { description: 'Dauer, Easing, Delay und Eigenschaftsliste eines Motion-Effekts.', typeDetails: `{
  duration?: number;
  easing?: string;
  delay?: number;
  properties?: string[];
}` },
                    reducedMotion: { description: 'Steuert, wie sich der Effekt verhalt, wenn der Benutzer Reduced Motion im Betriebssystem aktiviert.', example: `motion={{
  from: { opacity: 0 },
  to: { opacity: 1 },
  reducedMotion: 'respect-user',
}}` },
                },
            },
        },
    },
});
