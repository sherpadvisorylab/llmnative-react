import baseTheme from './default';
import type { ThemeDefinition } from '../src/Theme';

const definition: ThemeDefinition = {
    ...baseTheme,
    preset: {
        ...baseTheme.preset,
        mode: 'dark',
        colors: {
            ...baseTheme.preset.colors,
            ...{},
        },
        dark: {
            ...baseTheme.preset.dark,
            ...{
    background: '235 18.8% 12.5%',
    foreground: '229.3 35.4% 75.1%',
    card: '240 15.4% 10.2%',
    cardForeground: '232.7 13.9% 53.5%',
    popover: '240 14.9% 9.2%',
    popoverForeground: '232.7 13.9% 53.5%',
    primary: '217.3 39.8% 55.7%',
    primaryForeground: '0 0% 100%',
    secondary: '240 15.4% 10.2%',
    secondaryForeground: '232.7 13.9% 53.5%',
    muted: '235.4 18.8% 13.5%',
    mutedForeground: '230.3 16.1% 37.8%',
    accent: '228.8 20% 15.7%',
    accentForeground: '229.3 35.4% 75.1%',
    border: '240 11.1% 7.1%',
    input: '240 14.9% 9.2%',
    ring: '228.7 72.6% 85.7%'
},
        },
    },
};

export default definition;
