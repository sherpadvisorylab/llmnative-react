import React, { useMemo, useState } from 'react';
import { Icon, ThemeSwitcher, useThemeController } from '@llmnative/react';

interface ThemePanelProps {
    open: boolean;
    onClose: () => void;
}

const THEME_METADATA = {
    default: {
        label: 'Default',
        description: 'Clean, rounded, blue primary',
    },
    flat: {
        label: 'Flat',
        description: 'Sharp corners, slate tones',
    },
    cyber: {
        label: 'Cyber',
        description: 'Zero radius, green neon',
    },
    'vscode-dark-plus': {
        label: 'VS Code Dark+',
        description: 'Classic Visual Studio Code dark editor palette',
    },
    'vscode-light-plus': {
        label: 'VS Code Light+',
        description: 'Classic Visual Studio Code light editor palette',
    },
    'tokyo-night': {
        label: 'Tokyo Night',
        description: 'Deep navy IDE look with soft blue accents',
    },
    'tokyo-night-light': {
        label: 'Tokyo Night Light',
        description: 'Light IDE palette with calm slate-blue contrast',
    },
} satisfies Record<string, { label: string; description: string }>;

export default function ThemePanel({ open, onClose }: ThemePanelProps) {
    const { theme } = useThemeController();
    const [copied, setCopied] = useState(false);

    const appConfiguration = useMemo(() => {
        return `import { App } from '@llmnative/react';

<App
    themeProvider={{
        theme: '${theme}',
        themeOverride: {},
    }}
/>`;
    }, [theme]);

    const copyConfiguration = () => {
        navigator.clipboard.writeText(appConfiguration.trim());
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <ThemeSwitcher
            surface="modal"
            open={open}
            onClose={onClose}
            title="Customize"
            subtitle="Live CSS variables, no reload."
            themeOptions={THEME_METADATA}
            headerActions={(
                <button
                    type="button"
                    title={copied ? 'Configuration copied' : 'Copy App configuration'}
                    aria-label={copied ? 'Configuration copied' : 'Copy App configuration'}
                    onClick={copyConfiguration}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    <Icon name={copied ? 'check' : 'copy'} size={15} />
                </button>
            )}
        />
    );
}
