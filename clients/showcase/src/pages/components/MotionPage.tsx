import React from 'react';
import {
    ActionButton,
    Dropdown,
    DropdownItem,
    Modal,
    Notifications,
    Tab,
    TabItem,
    useThemeController,
    resolveMotionEffect,
} from '@llmnative/react';
import type { MotionEffect, MotionReference } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

type MotionPreset = 'none' | 'subtle' | 'standard' | 'expressive';
type ModalPreviewPosition = 'center' | 'right';
type MotionIntent = 'press' | 'open' | 'enter' | 'modalCenter' | 'modalSide';

const NOTIFICATIONS = [
    { title: 'Motion registry reloaded', url: '/components/motion', time: 'Just now', icon: 'settings' },
    { title: 'Modal preview uses theme fallback', url: '/components/modal', time: '2 minutes ago', icon: 'fullscreen' },
    { title: 'Reduced motion still respects OS settings', url: '/docs/motion', time: '10 minutes ago', icon: 'warning' },
];

const MOTION_DOCS: PropDef[] = [
    {
        name: 'motion',
        type: 'MotionReference | false',
        description: 'Local override supported by ActionButton, LoadingButton, Dropdown, Modal and Tab. Pass false to disable the component motion.',
        typeDetails: `type MotionReference = string | MotionEffect | false`,
        example: `<Modal motion="slideFromRight" />
<ActionButton label="Save" motion={false} />`,
    },
    {
        name: 'theme.<Component>.motion',
        type: 'Record<string, MotionReference>',
        description: 'Theme-level mapping from semantic component states to named effects in the motion registry.',
        example: `Modal: {
  motion: {
    center: 'fade',
    right: 'slideFromRight',
    backdrop: 'fade',
  },
}`,
    },
    {
        name: 'transition',
        type: 'MotionTransition',
        description: 'Duration, easing, delay and property list used by a motion effect.',
        typeDetails: `{
  duration?: number;
  easing?: string;
  delay?: number;
  properties?: string[];
}`,
    },
    {
        name: 'reducedMotion',
        type: '"respect-user" | "always" | "never"',
        description: 'Controls how the effect behaves when the user enables reduced motion at OS level.',
        example: `motion={{
  from: { opacity: 0 },
  to: { opacity: 1 },
  reducedMotion: 'respect-user',
}}`,
    },
];

const PRESET_COPY: Record<MotionPreset, string> = {
    none: 'Disables decorative motion and is useful as a quick reduced-motion proxy during visual QA.',
    subtle: 'Quiet and fast. Better for dense dashboards, admin panels and operational workflows.',
    standard: 'Uses the current theme registry as-is. This is the production default you are shipping today.',
    expressive: 'Longer travel and stronger feedback. Useful for demos, hero interactions and more visual products.',
};

const createEffect = (
    from: React.CSSProperties,
    to: React.CSSProperties,
    duration: number,
    properties: string[],
    easing = 'cubic-bezier(0.2, 0, 0, 1)'
): MotionEffect => ({
    from: from as unknown as MotionEffect['from'],
    to: to as unknown as MotionEffect['to'],
    transition: { duration, easing, properties },
    reducedMotion: 'respect-user',
});

function getPresetMotion(preset: MotionPreset, intent: MotionIntent): MotionReference {
    if (preset === 'none') return false;
    if (preset === 'standard') {
        switch (intent) {
            case 'press':
                return 'press';
            case 'open':
                return 'fadeDown';
            case 'enter':
                return 'fadeUp';
            case 'modalCenter':
                return 'fade';
            case 'modalSide':
                return 'slideFromRight';
        }
    }

    if (preset === 'subtle') {
        switch (intent) {
            case 'press':
                return createEffect({}, { transform: 'scale(0.995)' }, 80, ['transform', 'box-shadow']);
            case 'open':
                return createEffect({ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'translateY(0)' }, 110, ['opacity', 'transform', 'visibility']);
            case 'enter':
                return createEffect({ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }, 120, ['opacity', 'transform']);
            case 'modalCenter':
                return createEffect({ opacity: 0, transform: 'scale(0.985)' }, { opacity: 1, transform: 'scale(1)' }, 120, ['opacity', 'transform']);
            case 'modalSide':
                return createEffect({ opacity: 0, transform: 'translateX(28px)' }, { opacity: 1, transform: 'translateX(0)' }, 140, ['opacity', 'transform']);
        }
    }

    switch (intent) {
        case 'press':
            return createEffect({}, { transform: 'scale(0.965)' }, 120, ['transform', 'box-shadow'], 'cubic-bezier(0.16, 1, 0.3, 1)');
        case 'open':
            return createEffect({ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'translateY(0)' }, 220, ['opacity', 'transform', 'visibility'], 'cubic-bezier(0.16, 1, 0.3, 1)');
        case 'enter':
            return createEffect({ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }, 220, ['opacity', 'transform'], 'cubic-bezier(0.16, 1, 0.3, 1)');
        case 'modalCenter':
            return createEffect({ opacity: 0, transform: 'scale(0.94)' }, { opacity: 1, transform: 'scale(1)' }, 220, ['opacity', 'transform'], 'cubic-bezier(0.16, 1, 0.3, 1)');
        case 'modalSide':
            return createEffect({ opacity: 0, transform: 'translateX(84px)' }, { opacity: 1, transform: 'translateX(0)' }, 240, ['opacity', 'transform'], 'cubic-bezier(0.16, 1, 0.3, 1)');
    }
}

function RegistryEffectCard({
    name,
    details,
}: {
    name: string;
    details: ReturnType<typeof resolveMotionEffect>;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-foreground">{name}</h4>
                <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    {details.transition.duration}ms
                </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
                {details.transition.properties.join(', ')} • {details.reducedMotion}
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-border bg-muted/40 p-3">
                <div
                    className="h-14 w-full rounded-md border border-primary/25 bg-primary/10"
                    style={{
                        ...(details.to as unknown as React.CSSProperties),
                        transition: details.transitionValue,
                    }}
                />
            </div>
        </div>
    );
}

function MotionPresetButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'rounded-full border px-3 py-1.5 text-sm transition-colors',
                active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
            ].join(' ')}
        >
            {label}
        </button>
    );
}

export default function MotionPage() {
    const { theme, themes, applyTheme } = useThemeController();
    const [preset, setPreset] = React.useState<MotionPreset>('standard');
    const [modalPosition, setModalPosition] = React.useState<ModalPreviewPosition | null>(null);
    const activeTheme = themes[theme] ?? themes.default;
    const registryEntries = React.useMemo(
        () => Object.keys(activeTheme.motion).map((key) => ({
            key,
            details: resolveMotionEffect(key, activeTheme.motion, key),
        })),
        [activeTheme.motion]
    );

    const pressMotion = React.useMemo(() => getPresetMotion(preset, 'press'), [preset]);
    const openMotion = React.useMemo(() => getPresetMotion(preset, 'open'), [preset]);
    const enterMotion = React.useMemo(() => getPresetMotion(preset, 'enter'), [preset]);
    const modalCenterMotion = React.useMemo(() => getPresetMotion(preset, 'modalCenter'), [preset]);
    const modalSideMotion = React.useMemo(() => getPresetMotion(preset, 'modalSide'), [preset]);

    return (
        <PageLayout
            title="Motion"
            description="Interactive playground for the theme-driven motion registry, local component overrides and current coverage across the framework."
        >
            <Section
                title="Preset controls"
                description="Switch between built-in themes, then preview how no-motion, subtle, standard and expressive settings feel on top of the current registry."
                preview={(
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-2 text-sm font-medium text-foreground">Theme</span>
                                {Object.keys(themes).map((themeId) => (
                                    <MotionPresetButton
                                        key={themeId}
                                        active={themeId === theme}
                                        label={themeId}
                                        onClick={() => applyTheme(themeId)}
                                    />
                                ))}
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="mr-2 text-sm font-medium text-foreground">Motion preset</span>
                                {(['none', 'subtle', 'standard', 'expressive'] as MotionPreset[]).map((presetId) => (
                                    <MotionPresetButton
                                        key={presetId}
                                        active={presetId === preset}
                                        label={presetId}
                                        onClick={() => setPreset(presetId)}
                                    />
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">{PRESET_COPY[preset]}</p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {registryEntries.map(({ key, details }) => (
                                <RegistryEffectCard key={key} name={key} details={details} />
                            ))}
                        </div>
                    </div>
                )}
                code={`import { ActionButton, Modal } from '@llmnative/react';

<ActionButton label="Save" motion="press" />
<Modal motion="slideFromRight" />

// You can also pass an inline effect for local experiments
<Modal
  motion={{
    from: { opacity: 0, transform: 'scale(0.96)' },
    to: { opacity: 1, transform: 'scale(1)' },
    transition: { duration: 140, easing: 'ease-out', properties: ['opacity', 'transform'] },
    reducedMotion: 'respect-user',
  }}
/>`}
            />

            <Section
                title="Press and open states"
                description="These controls use local motion overrides derived from the selected preset, so you can compare intensity without changing the underlying theme."
                preview={(
                    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex flex-wrap gap-3">
                                <ActionButton label="Save draft" icon="floppy-disk" motion={pressMotion} />
                                <ActionButton label="Publish" icon="caret-right" motion={pressMotion} />
                                <ActionButton label="No motion" icon="pause" motion={false} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Press states currently cover <code>ActionButton</code>, <code>LoadingButton</code> and dropdown toggles.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <Dropdown
                                motion={openMotion}
                                position="end"
                                toggleButton={{ icon: 'settings', text: 'Open menu' }}
                                header="Motion aware"
                                footer="Local override active"
                            >
                                <DropdownItem icon="sliders-horizontal">Current preset: {preset}</DropdownItem>
                                <DropdownItem icon="palette">Current theme: {theme}</DropdownItem>
                                <DropdownItem icon="gauge">Effect: local {preset}</DropdownItem>
                            </Dropdown>
                        </div>
                    </div>
                )}
                code={`<Dropdown motion="fadeDown" toggleButton={{ icon: 'settings', text: 'Open menu' }}>
  <DropdownItem icon="gauge">Motion-aware menu</DropdownItem>
</Dropdown>`}
            />

            <Section
                title="Modal and tab transitions"
                description="Use the same preset across centered dialogs, side panels and tab content transitions to validate consistency before promoting an effect into the theme."
                preview={(
                    <div className="space-y-5">
                        <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <ActionButton label="Center dialog" icon="app-window" motion={pressMotion} onClick={() => setModalPosition('center')} />
                            <ActionButton label="Right panel" icon="fullscreen" motion={pressMotion} onClick={() => setModalPosition('right')} />
                            <ActionButton label="Notifications" icon="bell" motion={pressMotion} onClick={() => {}} />
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <Tab motion={enterMotion}>
                                <TabItem label="Buttons">
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p>Tabs currently animate their active pane with <code>fadeUp</code> at theme level.</p>
                                        <p>The playground can replace it locally to compare subtle vs expressive transitions.</p>
                                    </div>
                                </TabItem>
                                <TabItem label="Accessibility">
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p><code>none</code> is useful to sanity-check layouts without decorative motion.</p>
                                        <p>OS-level <code>prefers-reduced-motion</code> still wins whenever an effect uses <code>respect-user</code>.</p>
                                    </div>
                                </TabItem>
                                <TabItem label="Pending gap">
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p><code>Notifications</code> already inherit dropdown motion from the theme.</p>
                                        <p>Dedicated toast-level polish is still the remaining CR-027 gap after this page.</p>
                                    </div>
                                </TabItem>
                            </Tab>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <Notifications badge={3}>{NOTIFICATIONS}</Notifications>
                        </div>
                    </div>
                )}
                code={`<Tab motion="fadeUp">
  <TabItem label="Overview">...</TabItem>
  <TabItem label="Accessibility">...</TabItem>
</Tab>`}
            />

            <Section
                title="Shared API"
                description="These are the knobs you are exercising in this playground: named registry entries in the theme plus local component overrides."
                preview={(
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-sm text-muted-foreground">
                        <p>
                            The page is intentionally split between theme-level reality and local playground overrides.
                            This makes it useful today, even though the global preset system is not yet modelled as a first-class runtime API.
                        </p>
                    </div>
                )}
                code={`const motion = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    transition: { duration: 160, easing: 'cubic-bezier(0.2, 0, 0, 1)', properties: ['opacity'] },
    reducedMotion: 'respect-user',
  },
};`}
            />

            <PropDocsTable props={MOTION_DOCS} title="Motion API surface" />

            {modalPosition && (
                <Modal
                    title={modalPosition === 'center' ? 'Center dialog preview' : 'Right panel preview'}
                    header={modalPosition === 'center'
                        ? 'Standard dialog shell with local motion override.'
                        : 'Edge panel using a custom motion preset on top of the current theme.'}
                    position={modalPosition}
                    size="lg"
                    motion={modalPosition === 'center' ? modalCenterMotion : modalSideMotion}
                    onClose={() => setModalPosition(null)}
                    onSave={async () => {
                        setModalPosition(null);
                        return true;
                    }}
                >
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                            Active theme: <strong className="text-foreground">{theme}</strong>
                        </p>
                        <p>
                            Active playground preset: <strong className="text-foreground">{preset}</strong>
                        </p>
                        <p>
                            This preview is intentionally local: it helps compare motion intensity without mutating the global theme registry.
                        </p>
                    </div>
                </Modal>
            )}
        </PageLayout>
    );
}
