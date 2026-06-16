import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        motion: {
            page: {
                title: 'Motion',
                description: 'Interaktivnyi playground dlya theme-driven motion registry, lokalnykh override komponentov i tekushchego pokrytiya vo vsem framework.',
            },
            sections: {
                presetControls: { title: 'Upravlenie presetami', description: 'Pereklyuchaisya mezhdu built-in temami i smotri, kak no-motion, subtle, standard i expressive vedut sebya poverkh tekushchego registry.' },
                pressAndOpenStates: { title: 'Sostoyaniya press i open', description: 'Eti kontroly ispolzuyut lokalnye motion override iz vybrannogo preseta, chtoby sravnivat intensivnost bez izmeneniya bazovoi temy.' },
                modalAndTabTransitions: { title: 'Perekhody modal i tab', description: 'Ispolzui odin i tot zhe preset dlya centralnykh dialogov, bokovykh panelei i perekhodov soderzhimogo tab, chtoby proverit soglasovannost pered vneseniem effekta v temu.' },
                sharedApi: { title: 'Obshchee API', description: 'Eto te ruchki, kotorye ty testiruesh v etom playground: imenovannye entry v theme registry i lokalnye override komponentov.' },
            },
            presets: {
                none: 'Otkluchaet dekorativnyi motion i polezen kak bystryi proxy reduced motion vo vremya vizualnogo QA.',
                subtle: 'Spokoinyi i bystryi. Luchshe podkhodit dlya plotnykh dashboard, admin-panelei i operacionnykh workflow.',
                standard: 'Ispolzuet tekushchii theme registry kak est. Eto production-default, kotoryi postavlyaetsya seichas.',
                expressive: 'Bolee dlinnye peremeshcheniya i bolee silnyi feedback. Polezno dlya demo, hero-vzaimodeistvii i bolee vizualnykh produktov.',
            },
            labels: {
                theme: 'Tema',
                motionPreset: 'Motion preset',
                saveDraft: 'Sokhranit cher novik',
                publish: 'Opublikovat',
                noMotion: 'Bez motion',
                pressCoverage: 'Sostoyaniya press seichas pokryvayut ActionButton, LoadingButton i trigger dropdown.',
                openMenu: 'Otkryt menu',
                motionAware: 'Motion-aware',
                localOverrideActive: 'Lokalnyi override aktiven',
                currentPreset: 'Tekushchii preset',
                currentTheme: 'Tekushchaya tema',
                effectLocal: 'Effekt',
                centerDialog: 'Centralnyi dialog',
                rightPanel: 'Pravaya panel',
                notifications: 'Uvedomleniya',
                buttons: 'Knopki',
                accessibility: 'Dostupnost',
                pendingGap: 'Ostavshiisya gap',
                sharedApiPreview: 'Stranica namerenno razdelena mezhdu reality na urovne temy i lokalnymi override playground. Eto delaet ee poleznoi uzhe seichas, dazhe esli globalnaya sistema presetov eshche ne oformlena kak runtime API pervogo klassa.',
                motionApiSurface: 'Poverkhnost Motion API',
                centerDialogPreview: 'Prevyu centralnogo dialoga',
                rightPanelPreview: 'Prevyu pravoi paneli',
                centerDialogHeader: 'Standartnaya shell dialoga s lokalnym motion override.',
                rightPanelHeader: 'Bokovaya panel s custom motion preset poverkh tekushchei temy.',
                activeTheme: 'Aktivnaya tema',
                activePlaygroundPreset: 'Aktivnyi preset playground',
                previewNotice: 'Eto prevyu namerenno lokalnoe: ono pomogaet sravnivat intensivnost motion bez mutacii globalnogo theme registry.',
                durationUnit: 'ms',
                reducedMotionSeparator: ' | ',
            },
            notifications: {
                registryReloaded: { title: 'Motion registry perezagruzhen', time: 'Tolko chto' },
                modalThemeFallback: { title: 'Prevyu modal ispolzuet fallback temy', time: '2 minuty nazad' },
                reducedMotionRespected: { title: 'Reduced motion vse eshche uvazhaet nastroiki OS', time: '10 minut nazad' },
            },
            tabContent: {
                buttons: { paragraph1: 'Tab seichas animiruyut aktivnuyu panel cherez fadeUp na urovne temy.', paragraph2: 'Playground mozhet lokalno zamenit eto dlya sravneniya subtle i expressive perekhodov.' },
                accessibility: { paragraph1: 'none polezen dlya proverki layout bez dekorativnogo motion.', paragraph2: 'OS-level prefers-reduced-motion vse ravno imeet prioritet, kogda effekt ispolzuet respect-user.' },
                pendingGap: { paragraph1: 'Notifications uzhe nasledуют dropdown motion iz temy.', paragraph2: 'Otdelnaya polirovka toast ostayotsya poslednim gap CR-027 posle etoi stranicy.' },
            },
            propsDocs: {
                title: 'Poverkhnost Motion API',
                items: {
                    motion: { description: 'Lokalnyi override podderzhivaetsya v ActionButton, LoadingButton, Dropdown, Modal i Tab. Peredai false, chtoby otklyuchit motion komponenta.', typeDetails: 'type MotionReference = string | MotionEffect | false', example: `<Modal motion="slideFromRight" />
<ActionButton label="Save" motion={false} />` },
                    themeMotion: { description: 'Maping na urovne temy iz semanticheskikh sostoyanii komponentov v imenovannye effekty motion registry.', example: `Modal: {
  motion: {
    center: 'fade',
    right: 'slideFromRight',
    backdrop: 'fade',
  },
}` },
                    transition: { description: 'Dlitelnost, easing, delay i spisok svoistv, ispolzuemykh motion-effektom.', typeDetails: `{
  duration?: number;
  easing?: string;
  delay?: number;
  properties?: string[];
}` },
                    reducedMotion: { description: 'Upravlyaet povedeniem effekta, kogda polzovatel vklyuchaet reduced motion na urovne OS.', example: `motion={{
  from: { opacity: 0 },
  to: { opacity: 1 },
  reducedMotion: 'respect-user',
}}` },
                },
            },
        },
    },
});
