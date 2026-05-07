import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import MarkdownReader from '../../../src/components/widgets/MarkdownReader';
import { renderWithProviders } from '../../helpers/renderWithProviders';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));

Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
        writeText: vi.fn(() => Promise.resolve()),
    },
});

describe('MarkdownReader', () => {
    it('renders headings and paragraphs', () => {
        renderWithProviders(<MarkdownReader content={'# Introduction\n\nHello **world**.'} />);

        expect(screen.getByRole('heading', { name: 'Introduction' })).toBeInTheDocument();
        expect(screen.getByText('world')).toBeInTheDocument();
    });

    it('renders GFM tables and task lists', () => {
        renderWithProviders(
            <MarkdownReader
                content={[
                    '| Name | Status |',
                    '| ---- | ------ |',
                    '| Docs | Done |',
                    '',
                    '- [x] Render markdown',
                ].join('\n')}
            />
        );

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Docs')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('copies fenced code blocks', () => {
        vi.spyOn(console, 'log').mockImplementation(() => undefined);
        renderWithProviders(<MarkdownReader content={'```tsx\n<Grid />\n```'} />);

        fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('<Grid />');
    });

    it('intercepts internal links', () => {
        const onNavigateInternal = vi.fn();
        renderWithProviders(
            <MarkdownReader
                content={'Read [Quick start](/docs/quick-start) and [npm](https://www.npmjs.com/).'}
                onNavigateInternal={onNavigateInternal}
            />
        );

        fireEvent.click(screen.getByRole('link', { name: 'Quick start' }));
        expect(onNavigateInternal).toHaveBeenCalledWith('/docs/quick-start', expect.any(Object));
        expect(screen.getByRole('link', { name: 'npm' })).toHaveAttribute('target', '_blank');
    });
});
