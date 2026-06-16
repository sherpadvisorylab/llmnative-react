import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        motion: {
            page: {
                title: 'Motion',
                description: 'Playground tafauli li motion registry al madfou bil theme, wal override al mahalliya lil components, wa madar al taghtiya al halia fi al framework.',
            },
            sections: {
                presetControls: { title: 'Tahakkum al preset', description: 'Intaqil bayn al themes al mabniya dakhiliyan, thumma shahid kayfa yabdu no-motion wa subtle wa standard wa expressive fawq al registry al hali.' },
                pressAndOpenStates: { title: 'Haalat press wa open', description: 'Hadhihi al controls tastakhdim override motion mahalliya mustakhraja min al preset al mukhtar, hatta tuqarin shiddat al haraka min dun taghyir al theme al asasi.' },
                modalAndTabTransitions: { title: 'Intiqalat modal wa tab', description: 'Istaamil nafs al preset ma al dialogat al mutamarkiza wal panelat al janibiyya wa intiqalat muhtawa al tab li tahqiq al اتساق qabl raf al effect ila al theme.' },
                sharedApi: { title: 'API mushtaraka', description: 'Hadhihi hiya al adawat allati tujaribha fi hadha al playground: registry entries musamma fi al theme ma override mahalliya lil components.' },
            },
            presets: {
                none: 'Yutfil al motion al tazyini, wa huwa mufid kabadil sari li reduced motion athna al visual QA.',
                subtle: 'Hadi wa sari. Afdal lil dashboards al kathifa, wal admin panels, wal operational workflows.',
                standard: 'Yastaamil al theme registry al hali kama huwa. Hatha huwa al default al intaji alladhi tusallimuhu al yawm.',
                expressive: 'Haraka atwal wa feedback aqwa. Mufid lil demos wal hero interactions wal منتجات al akthar basariyya.',
            },
            labels: {
                theme: 'Theme',
                motionPreset: 'Motion preset',
                saveDraft: 'Save draft',
                publish: 'Publish',
                noMotion: 'No motion',
                pressCoverage: 'Haalat press tughti halian ActionButton wa LoadingButton wa triggerat al dropdown.',
                openMenu: 'Open menu',
                motionAware: 'Motion aware',
                localOverrideActive: 'Local override active',
                currentPreset: 'Current preset',
                currentTheme: 'Current theme',
                effectLocal: 'Effect',
                centerDialog: 'Center dialog',
                rightPanel: 'Right panel',
                notifications: 'Notifications',
                buttons: 'Buttons',
                accessibility: 'Accessibility',
                pendingGap: 'Pending gap',
                sharedApiPreview: 'Hadhihi al safha maqsumah amdan bayn al waqia ala mustawa al theme wa override al playground al mahalliya. Hatha yajaluha mufida al yawm, hatta law lam yutam namdajat nizam al preset al aalamiy ka runtime API min al daraja al ula.',
                motionApiSurface: 'Motion API surface',
                centerDialogPreview: 'Center dialog preview',
                rightPanelPreview: 'Right panel preview',
                centerDialogHeader: 'Dialog shell qiyasi ma local motion override.',
                rightPanelHeader: 'Panel janibi yastaamil custom motion preset fawq al theme al hali.',
                activeTheme: 'Active theme',
                activePlaygroundPreset: 'Active playground preset',
                previewNotice: 'Hatha al preview mahalli amdan: yusaid ala muqaranat shiddat al motion min dun taghyir al theme registry al aalamiy.',
                durationUnit: 'ms',
                reducedMotionSeparator: ' | ',
            },
            notifications: {
                registryReloaded: { title: 'Tam iadat تحميل motion registry', time: 'Al an' },
                modalThemeFallback: { title: 'Modal preview yastaamil theme fallback', time: 'Qabl dqiqatayn' },
                reducedMotionRespected: { title: 'Reduced motion la يزال yahtaram iidadat nizam al تشغيل', time: 'Qabl 10 daqaiq' },
            },
            tabContent: {
                buttons: { paragraph1: 'Al tabs tuharik al panel al nashit halian bi fadeUp ala mustawa al theme.', paragraph2: 'Yumkin lil playground an yastabdil dhalik mahalliyan li muqaranat subtle wa expressive transitions.' },
                accessibility: { paragraph1: 'none mufid li tafaqqud al layout min dun motion tazyini.', paragraph2: 'prefers-reduced-motion ala mustawa al OS yabqa lahu al awlawiyya inda ma yastaamil al effect qimat respect-user.' },
                pendingGap: { paragraph1: 'Notifications tarith dropdown motion min al theme bil fial.', paragraph2: 'Tahsin mustawa al toast maزال huwa al CR-027 gap al mutabaqqi baad hadhihi al safha.' },
            },
            propsDocs: {
                title: 'Motion API surface',
                items: {
                    motion: { description: 'Local override madum fi ActionButton wa LoadingButton wa Dropdown wa Modal wa Tab. Marrir false li taatil motion lil component.', typeDetails: 'type MotionReference = string | MotionEffect | false', example: `<Modal motion="slideFromRight" />
<ActionButton label="Save" motion={false} />` },
                    themeMotion: { description: 'Rabt ala mustawa al theme bayn halat al component al dalaliya wa al effects al musamma fi motion registry.', example: `Modal: {
  motion: {
    center: 'fade',
    right: 'slideFromRight',
    backdrop: 'fade',
  },
}` },
                    transition: { description: 'Al muda wa easing wa delay wa qaimat al khasais allati yastaamiluha motion effect.', typeDetails: `{
  duration?: number;
  easing?: string;
  delay?: number;
  properties?: string[];
}` },
                    reducedMotion: { description: 'Yutahakkam fi suluk al effect inda tafil al المستخدم ل reduced motion ala mustawa al OS.', example: `motion={{
  from: { opacity: 0 },
  to: { opacity: 1 },
  reducedMotion: 'respect-user',
}}` },
                },
            },
        },
    },
});
