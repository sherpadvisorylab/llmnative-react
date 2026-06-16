import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        icon: {
            page: { title: 'Icon', description: 'Provider-backed icon renderer. The active icon library is configured globally on App and can be switched at runtime. Built-in providers: lucide (default), phosphor.' },
            sections: {
                basicUsage: { description: 'Render any icon by name. The active provider resolves the name to its component.' },
                catalog: { title: 'Icon catalog', description: 'Common icon names supported by all built-in providers. Active provider: {providerId}.' },
                sizes: { description: 'The size prop sets width and height in pixels. Default is 16.' },
                colors: { title: 'Colors via className', description: 'Icons inherit the CSS text color. Use any Tailwind text-* utility.' },
                providers: { title: 'Built-in providers: lucide vs phosphor', description: 'lucide is the default. phosphor is built-in. Both resolve the same icon names.' },
                phosphor: { title: 'Phosphor weight variants', description: 'Pass weight directly on Icon — no need to re-instantiate the provider. Supported values: thin, light, regular (default), bold, fill, duotone.' },
                appConfig: { title: 'App-level configuration', description: 'The icon provider is set once on App and inherited via context. It can be changed at runtime with useIconController.' },
                aliases: { title: 'Aliases', description: 'Map your own semantic names to provider-specific names. Configured once at App level, works with any provider.' },
                a11y: { title: 'Accessibility', description: 'Icons without label are aria-hidden (decorative). Provide label when the icon conveys meaning without adjacent text.' },
                customProvider: { title: 'Custom provider', description: 'Implement IconProviderAdapter to integrate any icon library.' },
            },
        },
    },
});
