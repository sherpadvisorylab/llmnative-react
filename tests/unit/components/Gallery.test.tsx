import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Gallery from '../../../src/components/ui/Gallery';

const body = [
    {
        _key: 'hero',
        name: 'Hero',
        category: 'Brand',
        img: <img src="hero.png" alt="Hero" />,
    },
    {
        _key: 'launch',
        name: 'Launch',
        category: 'Campaign',
        img: <img src="launch.png" alt="Launch" />,
    },
];

describe('Gallery overlays', () => {
    it('renders a badge overlay on every item when no filter is provided', () => {
        render(
            <Gallery
                body={body}
                overlays={[{ position: 'topRight', badge: { content: 'new', type: 'primary' } }]}
            />
        );

        const badges = screen.getAllByText('new');

        expect(badges).toHaveLength(2);
        badges.forEach((badge) => {
            expect(badge).toHaveClass('badge');
            expect(badge).toHaveClass('badge-primary');
        });
    });

    it('filters overlay rules by record fields', () => {
        render(
            <Gallery
                body={body}
                overlays={[{ position: 'bottomLeft', badge: 'brand', when: { category: 'Brand' } }]}
            />
        );

        expect(screen.getByText('brand')).toHaveClass('badge-info');
        expect(screen.queryByText('campaign')).not.toBeInTheDocument();
    });
});
