import React, { useState } from 'react';
import { ActionButton, ThemeSwitcher } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

const THEME_SWITCHER_PROPS: PropDef[] = [
    { name: 'surface', type: '"flat" | "modal"', default: '"flat"', description: 'Render as embeddable flat panel or inside a modal shell.' },
    { name: 'open', type: 'boolean', default: 'true', description: 'Used only when `surface="modal"` to control visibility.' },
    { name: 'onClose', type: '() => void', description: 'Used only when `surface="modal"` when the modal should close.' },
    { name: 'showHeader', type: 'boolean', description: 'Control whether the internal header is shown. Defaults to true in modal mode and false in flat usage unless explicitly enabled.' },
    { name: 'title', type: 'ReactNode', description: 'Header title shown inside the switcher.' },
    { name: 'subtitle', type: 'ReactNode', description: 'Secondary header text below the title.' },
    { name: 'headerActions', type: 'ReactNode', description: 'Optional actions rendered on the right side of the switcher header.' },
    { name: 'themeOptions', type: 'Record<string, { label?: string; description?: string }>', description: 'Optional per-theme metadata used to rename or describe registry entries.' },
    { name: 'showModeSection', type: 'boolean', default: 'true', description: 'Show the light/dark mode controls.' },
    { name: 'showPrimarySection', type: 'boolean', default: 'true', description: 'Show the primary color swatches.' },
    { name: 'showRadiusSection', type: 'boolean', default: 'true', description: 'Show the border radius slider.' },
    { name: 'showFontSection', type: 'boolean', default: 'true', description: 'Show the font selector.' },
    { name: 'showStatusSection', type: 'boolean', default: 'true', description: 'Show semantic status color controls.' },
    { name: 'showThemeSection', type: 'boolean', default: 'true', description: 'Show the theme registry selection list.' },
    { name: 'showIconLibrarySection', type: 'boolean', default: 'true', description: 'Show icon library and phosphor weight controls.' },
    { name: 'className', type: 'string', description: 'Additional classes applied to the modal panel.' },
    { name: 'wrapperClassName', type: 'string', description: 'Additional classes applied to the modal wrapper.' },
];

const IDE_THEME_OPTIONS = {
    'vscode-dark-plus': {
        label: 'VS Code Dark+',
        description: 'Classic editor palette from Visual Studio Code.',
    },
    'vscode-light-plus': {
        label: 'VS Code Light+',
        description: 'Light Visual Studio Code palette for bright workspaces.',
    },
    'tokyo-night': {
        label: 'Tokyo Night',
        description: 'Soft navy IDE palette with blue accents.',
    },
    'tokyo-night-light': {
        label: 'Tokyo Night Light',
        description: 'Calmer light IDE palette with slate-blue contrast.',
    },
};

export default function ThemeSwitcherPage() {
    const [openDefault, setOpenDefault] = useState(false);
    const [openCompact, setOpenCompact] = useState(false);

    return (
        <PageLayout
            title="ThemeSwitcher"
            description="Reusable theme control surface for mode, fonts, semantic colors, icon libraries and built-in theme presets."
        >
            <Section
                title="Flat By Default"
                description="ThemeSwitcher is now an embeddable control surface that can sit inline inside settings pages, side panels or editor shells."
                preview={(
                    <div className="w-full max-w-3xl">
                        <ThemeSwitcher
                            title="Workspace appearance"
                            subtitle="Shared theme controls embedded directly in the page layout."
                            showHeader
                            themeOptions={IDE_THEME_OPTIONS}
                            showIconLibrarySection={false}
                        />
                    </div>
                )}
                code={`<ThemeSwitcher
    title="Workspace appearance"
    subtitle="Shared theme controls embedded directly in the page layout."
    showHeader
    themeOptions={{
        'vscode-dark-plus': { label: 'VS Code Dark+' },
        'tokyo-night': { label: 'Tokyo Night' },
    }}
    showIconLibrarySection={false}
/>`}
            />

            <Section
                title="Modal Wrapper"
                description="Showcase uses the same framework component inside a modal shell by switching the surface prop."
                preview={(
                    <div className="flex w-full max-w-xl items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Open the live theme switcher</h3>
                            <p className="mt-1 text-sm text-muted-foreground">This uses the framework component directly, not a showcase-only implementation.</p>
                        </div>
                        <ActionButton label="Open" onClick={() => setOpenDefault(true)} />
                        <ThemeSwitcher surface="modal" open={openDefault} onClose={() => setOpenDefault(false)} themeOptions={IDE_THEME_OPTIONS} />
                    </div>
                )}
                code={`import { ActionButton, ThemeSwitcher } from '@llmnative/react';

const [open, setOpen] = useState(false);

<>
    <ActionButton label="Open" onClick={() => setOpen(true)} />
    <ThemeSwitcher
        surface="modal"
        open={open}
        onClose={() => setOpen(false)}
        themeOptions={{
            'vscode-dark-plus': { label: 'VS Code Dark+' },
            'tokyo-night': { label: 'Tokyo Night' },
        }}
    />
</>`}
            />

            <Section
                title="Focused Preset Picker"
                description="You can hide sections when you only want theme presets and mode switching."
                preview={(
                    <div className="flex w-full max-w-xl items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Compact launcher</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Useful for editor shells where theme and mode are the only exposed controls.</p>
                        </div>
                        <ActionButton variant="outline-secondary" label="Open compact" onClick={() => setOpenCompact(true)} />
                        <ThemeSwitcher
                            surface="modal"
                            open={openCompact}
                            onClose={() => setOpenCompact(false)}
                            title="Editor themes"
                            subtitle="Choose a preset and color mode."
                            themeOptions={IDE_THEME_OPTIONS}
                            showPrimarySection={false}
                            showRadiusSection={false}
                            showFontSection={false}
                            showStatusSection={false}
                        />
                    </div>
                )}
                code={`<ThemeSwitcher
    open={open}
    onClose={() => setOpen(false)}
    title="Editor themes"
    subtitle="Choose a preset and color mode."
    showPrimarySection={false}
    showRadiusSection={false}
    showFontSection={false}
    showStatusSection={false}
/>`}
            />

            <PropDocsTable props={THEME_SWITCHER_PROPS} title="Props" />
        </PageLayout>
    );
}
