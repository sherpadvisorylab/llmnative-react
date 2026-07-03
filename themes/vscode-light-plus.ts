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
    background: '0 0% 100%',
    foreground: '0 0% 0%',
    cardForeground: '0 0% 0%',
    popoverForeground: '0 0% 0%',
    primaryForeground: '0 0% 100%',
    secondaryForeground: '0 0% 0%',
    accent: '0 0% 91%',
    accentForeground: '0 0% 0%'
},
        },
        dark: {
            ...baseTheme.preset.dark,
            ...{},
        },
    },
};

export default definition;
