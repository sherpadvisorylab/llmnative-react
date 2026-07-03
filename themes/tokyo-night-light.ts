import baseTheme from './default';
import type { ThemeDefinition } from '../src/Theme';

const definition: ThemeDefinition = {
    ...baseTheme,
    preset: {
        ...baseTheme.preset,
        mode: 'light',
        colors: {
            ...baseTheme.preset.colors,
            ...{
    background: '231.4 16.3% 91.6%',
    foreground: '228.6 26.2% 27.6%',
    card: '226.7 12.3% 85.7%',
    cardForeground: '224.3 17.6% 25.7%',
    popover: '231.4 16.3% 91.6%',
    popoverForeground: '224.3 17.6% 25.7%',
    primary: '217.7 61.1% 41.4%',
    primaryForeground: '0 0% 100%',
    secondary: '226.7 12.3% 85.7%',
    secondaryForeground: '224.3 17.6% 25.7%',
    muted: '231.4 16.3% 91.6%',
    mutedForeground: '232.5 6.7% 47.1%',
    accent: '231.4 16.3% 91.6%',
    accentForeground: '224.3 17.6% 25.7%',
    border: '230 5.1% 76.9%',
    input: '231.4 16.3% 91.6%',
    ring: '224.3 17.6% 25.7%'
},
        },
        dark: {
            ...baseTheme.preset.dark,
            ...{},
        },
    },
};

export default definition;
