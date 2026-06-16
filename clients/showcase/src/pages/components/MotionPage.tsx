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
import { useShowcaseMotionI18n } from '../../showcase/i18n';

type MotionPreset = 'none' | 'subtle' | 'standard' | 'expressive';
type ModalPreviewPosition = 'center' | 'right';
type MotionIntent = 'press' | 'open' | 'enter' | 'modalCenter' | 'modalSide';

const createEffect = (
    from: React.CSSProperties,
    to: React.CSSProperties,
    duration: number,
    properties: string[],
    easing = 'cubic-bezier(0.2, 0, 0, 1)',
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
    durationUnit,
    reducedMotionSeparator,
}: {
    name: string;
    details: ReturnType<typeof resolveMotionEffect>;
    durationUnit: string;
    reducedMotionSeparator: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-foreground">{name}</h4>
                <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    {details.transition.duration}
                    {durationUnit}
                </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
                {details.transition.properties.join(', ')}
                {reducedMotionSeparator}
                {details.reducedMotion}
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
    const t = useShowcaseMotionI18n();
    const { theme, themes, applyTheme } = useThemeController();
    const [preset, setPreset] = React.useState<MotionPreset>('standard');
    const [modalPosition, setModalPosition] = React.useState<ModalPreviewPosition | null>(null);
    const activeTheme = themes[theme] ?? themes.default;

    const notifications = React.useMemo(() => ([
        { title: t.notifications.registryReloaded.title, url: '/components/motion', time: t.notifications.registryReloaded.time, icon: 'settings' },
        { title: t.notifications.modalThemeFallback.title, url: '/components/modal', time: t.notifications.modalThemeFallback.time, icon: 'fullscreen' },
        { title: t.notifications.reducedMotionRespected.title, url: '/docs/motion', time: t.notifications.reducedMotionRespected.time, icon: 'warning' },
    ]), [t]);

    const motionDocs = React.useMemo<PropDef[]>(() => [
        {
            name: 'motion',
            type: 'MotionReference | false',
            description: t.propsDocs.items.motion.description,
            typeDetails: t.propsDocs.items.motion.typeDetails,
            example: t.propsDocs.items.motion.example,
        },
        {
            name: 'theme.<Component>.motion',
            type: 'Record<string, MotionReference>',
            description: t.propsDocs.items.themeMotion.description,
            example: t.propsDocs.items.themeMotion.example,
        },
        {
            name: 'transition',
            type: 'MotionTransition',
            description: t.propsDocs.items.transition.description,
            typeDetails: t.propsDocs.items.transition.typeDetails,
        },
        {
            name: 'reducedMotion',
            type: '"respect-user" | "always" | "never"',
            description: t.propsDocs.items.reducedMotion.description,
            example: t.propsDocs.items.reducedMotion.example,
        },
    ], [t]);

    const presetCopy: Record<MotionPreset, string> = React.useMemo(() => ({
        none: t.presets.none,
        subtle: t.presets.subtle,
        standard: t.presets.standard,
        expressive: t.presets.expressive,
    }), [t]);

    const registryEntries = React.useMemo(
        () => Object.keys(activeTheme.motion).map((key) => ({
            key,
            details: resolveMotionEffect(key, activeTheme.motion, key),
        })),
        [activeTheme.motion],
    );

    const pressMotion = React.useMemo(() => getPresetMotion(preset, 'press'), [preset]);
    const openMotion = React.useMemo(() => getPresetMotion(preset, 'open'), [preset]);
    const enterMotion = React.useMemo(() => getPresetMotion(preset, 'enter'), [preset]);
    const modalCenterMotion = React.useMemo(() => getPresetMotion(preset, 'modalCenter'), [preset]);
    const modalSideMotion = React.useMemo(() => getPresetMotion(preset, 'modalSide'), [preset]);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.presetControls.title}
                description={t.sections.presetControls.description}
                preview={(
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-2 text-sm font-medium text-foreground">{t.labels.theme}</span>
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
                                <span className="mr-2 text-sm font-medium text-foreground">{t.labels.motionPreset}</span>
                                {(['none', 'subtle', 'standard', 'expressive'] as MotionPreset[]).map((presetId) => (
                                    <MotionPresetButton
                                        key={presetId}
                                        active={presetId === preset}
                                        label={presetId}
                                        onClick={() => setPreset(presetId)}
                                    />
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">{presetCopy[preset]}</p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {registryEntries.map(({ key, details }) => (
                                <RegistryEffectCard
                                    key={key}
                                    name={key}
                                    details={details}
                                    durationUnit={t.labels.durationUnit}
                                    reducedMotionSeparator={t.labels.reducedMotionSeparator}
                                />
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
                title={t.sections.pressAndOpenStates.title}
                description={t.sections.pressAndOpenStates.description}
                preview={(
                    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex flex-wrap gap-3">
                                <ActionButton label={t.labels.saveDraft} icon="floppy-disk" motion={pressMotion} />
                                <ActionButton label={t.labels.publish} icon="caret-right" motion={pressMotion} />
                                <ActionButton label={t.labels.noMotion} icon="pause" motion={false} />
                            </div>
                            <p className="text-sm text-muted-foreground">{t.labels.pressCoverage}</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <Dropdown
                                motion={openMotion}
                                position="end"
                                trigger={{ icon: 'settings', text: t.labels.openMenu }}
                                header={t.labels.motionAware}
                                footer={t.labels.localOverrideActive}
                            >
                                <DropdownItem icon="sliders-horizontal">{t.labels.currentPreset}: {preset}</DropdownItem>
                                <DropdownItem icon="palette">{t.labels.currentTheme}: {theme}</DropdownItem>
                                <DropdownItem icon="gauge">{t.labels.effectLocal}: local {preset}</DropdownItem>
                            </Dropdown>
                        </div>
                    </div>
                )}
                code={`<Dropdown motion="fadeDown" trigger={{ icon: 'settings', text: 'Open menu' }}>
  <DropdownItem icon="gauge">Motion-aware menu</DropdownItem>
</Dropdown>`}
            />

            <Section
                title={t.sections.modalAndTabTransitions.title}
                description={t.sections.modalAndTabTransitions.description}
                preview={(
                    <div className="space-y-5">
                        <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <ActionButton label={t.labels.centerDialog} icon="app-window" motion={pressMotion} onClick={() => setModalPosition('center')} />
                            <ActionButton label={t.labels.rightPanel} icon="fullscreen" motion={pressMotion} onClick={() => setModalPosition('right')} />
                            <ActionButton label={t.labels.notifications} icon="bell" motion={pressMotion} onClick={() => {}} />
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <Tab motion={enterMotion}>
                                <TabItem label={t.labels.buttons}>
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p>{t.tabContent.buttons.paragraph1}</p>
                                        <p>{t.tabContent.buttons.paragraph2}</p>
                                    </div>
                                </TabItem>
                                <TabItem label={t.labels.accessibility}>
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p>{t.tabContent.accessibility.paragraph1}</p>
                                        <p>{t.tabContent.accessibility.paragraph2}</p>
                                    </div>
                                </TabItem>
                                <TabItem label={t.labels.pendingGap}>
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <p>{t.tabContent.pendingGap.paragraph1}</p>
                                        <p>{t.tabContent.pendingGap.paragraph2}</p>
                                    </div>
                                </TabItem>
                            </Tab>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <Notifications badge={3} items={notifications} />
                        </div>
                    </div>
                )}
                code={`<Tab motion="fadeUp">
  <TabItem label="Overview">...</TabItem>
  <TabItem label="Accessibility">...</TabItem>
</Tab>`}
            />

            <Section
                title={t.sections.sharedApi.title}
                description={t.sections.sharedApi.description}
                preview={(
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-sm text-muted-foreground">
                        <p>{t.labels.sharedApiPreview}</p>
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

            <PropDocsTable props={motionDocs} title={t.propsDocs.title} />

            {modalPosition && (
                <Modal
                    title={modalPosition === 'center' ? t.labels.centerDialogPreview : t.labels.rightPanelPreview}
                    header={modalPosition === 'center' ? t.labels.centerDialogHeader : t.labels.rightPanelHeader}
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
                            {t.labels.activeTheme}: <strong className="text-foreground">{theme}</strong>
                        </p>
                        <p>
                            {t.labels.activePlaygroundPreset}: <strong className="text-foreground">{preset}</strong>
                        </p>
                        <p>{t.labels.previewNotice}</p>
                    </div>
                </Modal>
            )}
        </PageLayout>
    );
}
