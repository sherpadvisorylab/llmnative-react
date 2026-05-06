import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme, useThemeController } from '../../../src/Theme';

function ThemeProbe() {
    const controller = useThemeController();
    const theme = useTheme('alert');

    return (
        <div>
            <span data-testid="preset">{controller.preset}</span>
            <span data-testid="mode">{controller.resolvedMode}</span>
            <span data-testid="primary">{controller.primary}</span>
            <span data-testid="radius">{controller.radius}</span>
            <span data-testid="alert-class">{theme.Alert.className}</span>
        </div>
    );
}

describe('ThemeProvider', () => {
    it('accepts a string shorthand for the default preset', () => {
        render(
            <ThemeProvider config="cyber">
                <ThemeProbe />
            </ThemeProvider>
        );

        expect(screen.getByTestId('preset')).toHaveTextContent('cyber');
        expect(screen.getByTestId('mode')).toHaveTextContent('dark');
        expect(document.documentElement).toHaveClass('dark');
        expect(document.documentElement.style.getPropertyValue('--rf-primary')).toBe('160 84% 39%');
    });

    it('merges custom presets and theme overrides with built-in theme defaults', () => {
        render(
            <ThemeProvider
                config={{
                    defaultPreset: 'brand',
                    presets: {
                        brand: {
                            primary: '346.8 77.2% 49.8%',
                            radius: 0.75,
                            theme: {
                                Alert: { className: 'brand-alert' },
                            },
                        },
                    },
                }}
            >
                <ThemeProbe />
            </ThemeProvider>
        );

        expect(screen.getByTestId('preset')).toHaveTextContent('brand');
        expect(screen.getByTestId('primary')).toHaveTextContent('346.8 77.2% 49.8%');
        expect(screen.getByTestId('radius')).toHaveTextContent('0.75');
        expect(screen.getByTestId('alert-class')).toHaveTextContent('brand-alert');
        expect(document.documentElement.style.getPropertyValue('--radius')).toBe('0.75rem');
    });
});
