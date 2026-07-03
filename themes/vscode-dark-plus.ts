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
    background: '0 0% 11.8%',
    foreground: '0 0% 83.1%',
    cardForeground: '0 0% 83.1%',
    popover: '240 1.3% 14.7%',
    popoverForeground: '0 0% 80%',
    primaryForeground: '0 0% 11.8%',
    secondaryForeground: '0 0% 83.1%',
    accentForeground: '0 0% 83.1%'
},
        },
    },
};

export default definition;
