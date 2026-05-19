import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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

    it('orders records before rendering when order is provided', () => {
        render(<Gallery body={body} order={{ field: 'name', dir: 'desc' }} />);

        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('alt', 'Launch');
        expect(images[1]).toHaveAttribute('alt', 'Hero');
    });

    it('passes the clicked record to onClick', () => {
        const clicks: string[] = [];

        render(
            <Gallery
                body={body}
                onClick={(record) => clicks.push(record._key || '')}
            />
        );

        fireEvent.click(screen.getByAltText('Hero'));
        expect(clicks).toEqual(['hero']);
    });

    it('shows selection checkboxes when onSelectionChange is provided and reports selected keys', () => {
        const selections: string[][] = [];

        render(
            <Gallery
                body={body}
                onSelectionChange={(selection) => selections.push(selection.keys)}
            />
        );

        fireEvent.click(screen.getByLabelText('Select item hero'));
        expect(selections.at(-1)).toEqual(['hero']);
    });
});
