import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        motion: {
            page: {
                title: 'Motion',
                description: 'Interactive playground for the theme-driven motion registry, local component overrides and current coverage across the framework.',
            },
            sections: {
                presetControls: {
                    title: 'Preset controls',
                    description: 'Switch between built-in themes, then preview how no-motion, subtle, standard and expressive settings feel on top of the current registry.',
                },
                pressAndOpenStates: {
                    title: 'Press and open states',
                    description: 'These controls use local motion overrides derived from the selected preset, so you can compare intensity without changing the underlying theme.',
                },
                modalAndTabTransitions: {
                    title: 'Modal and tab transitions',
                    description: 'Use the same preset across centered dialogs, side panels and tab content transitions to validate consistency before promoting an effect into the theme.',
                },
                sharedApi: {
                    title: 'Shared API',
                    description: 'These are the knobs you are exercising in this playground: named registry entries in the theme plus local component overrides.',
                },
            },
            presets: {
                none: 'Disables decorative motion and is useful as a quick reduced-motion proxy during visual QA.',
                subtle: 'Quiet and fast. Better for dense dashboards, admin panels and operational workflows.',
                standard: 'Uses the current theme registry as-is. This is the production default you are shipping today.',
                expressive: 'Longer travel and stronger feedback. Useful for demos, hero interactions and more visual products.',
            },
            labels: {
                theme: 'Theme',
                motionPreset: 'Motion preset',
                saveDraft: 'Save draft',
                publish: 'Publish',
                noMotion: 'No motion',
                pressCoverage: 'Press states currently cover ActionButton, LoadingButton and dropdown toggles.',
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
                sharedApiPreview: 'The page is intentionally split between theme-level reality and local playground overrides. This makes it useful today, even though the global preset system is not yet modelled as a first-class runtime API.',
                motionApiSurface: 'Motion API surface',
                centerDialogPreview: 'Center dialog preview',
                rightPanelPreview: 'Right panel preview',
                centerDialogHeader: 'Standard dialog shell with local motion override.',
                rightPanelHeader: 'Edge panel using a custom motion preset on top of the current theme.',
                activeTheme: 'Active theme',
                activePlaygroundPreset: 'Active playground preset',
                previewNotice: 'This preview is intentionally local: it helps compare motion intensity without mutating the global theme registry.',
                durationUnit: 'ms',
                reducedMotionSeparator: ' | ',
            },
            notifications: {
                registryReloaded: { title: 'Motion registry reloaded', time: 'Just now' },
                modalThemeFallback: { title: 'Modal preview uses theme fallback', time: '2 minutes ago' },
                reducedMotionRespected: { title: 'Reduced motion still respects OS settings', time: '10 minutes ago' },
            },
            tabContent: {
                buttons: {
                    paragraph1: 'Tabs currently animate their active pane with fadeUp at theme level.',
                    paragraph2: 'The playground can replace it locally to compare subtle vs expressive transitions.',
                },
                accessibility: {
                    paragraph1: 'none is useful to sanity-check layouts without decorative motion.',
                    paragraph2: 'OS-level prefers-reduced-motion still wins whenever an effect uses respect-user.',
                },
                pendingGap: {
                    paragraph1: 'Notifications already inherit dropdown motion from the theme.',
                    paragraph2: 'Dedicated toast-level polish is still the remaining CR-027 gap after this page.',
                },
            },
            propsDocs: {
                title: 'Motion API surface',
                items: {
                    motion: {
                        description: 'Local override supported by ActionButton, LoadingButton, Dropdown, Modal and Tab. Pass false to disable the component motion.',
                        typeDetails: 'type MotionReference = string | MotionEffect | false',
                        example: `<Modal motion="slideFromRight" />
<ActionButton label="Save" motion={false} />`,
                    },
                    themeMotion: {
                        description: 'Theme-level mapping from semantic component states to named effects in the motion registry.',
                        example: `Modal: {
  motion: {
    center: 'fade',
    right: 'slideFromRight',
    backdrop: 'fade',
  },
}`,
                    },
                    transition: {
                        description: 'Duration, easing, delay and property list used by a motion effect.',
                        typeDetails: `{
  duration?: number;
  easing?: string;
  delay?: number;
  properties?: string[];
}`,
                    },
                    reducedMotion: {
                        description: 'Controls how the effect behaves when the user enables reduced motion at OS level.',
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
