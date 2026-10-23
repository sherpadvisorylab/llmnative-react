import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Identicon, identiconPattern } from '../../../src/components';

describe('Identicon', () => {
    it('draws the same icon for the same value, and another for another value', () => {
        expect(identiconPattern('dealdesk')).toEqual(identiconPattern('dealdesk'));
        const names = ['dealdesk', 'playbook', 'cms', 'react', 'acme/app', 'Ada Lovelace'];
        const drawn = new Set(names.map((name) => JSON.stringify(identiconPattern(name))));
        expect(drawn.size).toBe(names.length);
    });

    it('is symmetric around its middle column, inside the grid and never empty', () => {
        for (const value of ['', 'a', 'dealdesk', 'x'.repeat(200), 'ünïcødé ✓']) {
            const { cells, hue } = identiconPattern(value);
            expect(cells.length).toBeGreaterThan(0);
            expect(hue).toBeGreaterThanOrEqual(0);
            expect(hue).toBeLessThan(360);
            const filled = new Set(cells.map(([row, column]) => `${row},${column}`));
            for (const [row, column] of cells) {
                expect(row).toBeGreaterThanOrEqual(0);
                expect(row).toBeLessThan(5);
                expect(filled.has(`${row},${4 - column}`)).toBe(true);
            }
        }
    });

    it('renders an SVG of the given size, one rect per filled cell', () => {
        const { container } = render(<Identicon value="dealdesk" size={24} />);
        const svg = container.querySelector('svg')!;
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
        expect(svg.querySelectorAll('rect')).toHaveLength(identiconPattern('dealdesk').cells.length);
    });

    it('has an accessible name with a title, and is decorative without one', () => {
        const { container, rerender } = render(<Identicon value="dealdesk" title="dealdesk" />);
        expect(screen.getByRole('img', { name: 'dealdesk' })).toBeInTheDocument();
        rerender(<Identicon value="dealdesk" />);
        expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('takes before and after content around the icon', () => {
        render(<Identicon value="dealdesk" after={<span>dealdesk</span>} />);
        expect(screen.getByText('dealdesk').parentElement?.previousElementSibling?.tagName.toLowerCase()).toBe('svg');
    });
});
