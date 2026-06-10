import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
                records={body}
                overlays={[{ position: 'topRight', badge: { content: 'new', variant: 'primary' } }]}
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
                records={body}
                overlays={[{ position: 'bottomLeft', badge: 'brand', when: { category: 'Brand' } }]}
            />
        );

        expect(screen.getByText('brand')).toHaveClass('badge-info');
        expect(screen.queryByText('campaign')).not.toBeInTheDocument();
    });

    it('orders records before rendering when sortable OrderConfig is provided', () => {
        render(<Gallery records={body} sortable={{ field: 'name', dir: 'desc' }} />);

        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('alt', 'Launch');
        expect(images[1]).toHaveAttribute('alt', 'Hero');
    });

    it('passes the clicked record to onClick', () => {
        const clicks: string[] = [];

        render(
            <Gallery
                records={body}
                onRowClick={(record) => clicks.push(record._key || '')}
            />
        );

        fireEvent.click(screen.getByAltText('Hero'));
        expect(clicks).toEqual(['hero']);
    });

    it('shows selection checkboxes when onSelectionChange is provided and reports selected keys', () => {
        const selections: string[][] = [];

        render(
            <Gallery
                records={body}
                onSelectionChange={(selection) => selections.push(selection.keys)}
            />
        );

        fireEvent.click(screen.getByLabelText('Select item hero'));
        expect(selections.at(-1)).toEqual(['hero']);
    });

    it('keeps selection mapped to the ordered item when records have no _key', () => {
        const selections: string[][] = [];

        render(
            <Gallery
                records={[
                    { name: 'Zulu', img: <img src="zulu.png" alt="Zulu" /> },
                    { name: 'Alpha', img: <img src="alpha.png" alt="Alpha" /> },
                ]}
                sortable={{ field: 'name', dir: 'asc' }}
                onSelectionChange={(selection) => selections.push(selection.records.map((record) => record.name || ''))}
            />
        );

        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        expect(selections.at(-1)).toEqual(['Alpha']);
    });

    it('keeps grouped gallery checkboxes checked after selection changes', () => {
        render(
            <Gallery
                records={[
                    { _key: 'u1', name: 'Alice', role: 'Admin', img: <img src="alice.png" alt="Admin | Alice" /> },
                    { _key: 'u2', name: 'Julia', role: 'Admin', img: <img src="julia.png" alt="Admin | Julia" /> },
                ]}
                groupBy=" | "
                onSelectionChange={() => undefined}
            />
        );

        const checkbox = screen.getByLabelText('Select item u1');
        fireEvent.click(checkbox);

        expect(checkbox).toBeChecked();
    });

    it('evaluates overlay functions only for items visible on the current page', async () => {
        const badgeSpy = vi.fn((item: { name?: string }) => item.name);

        render(
            <Gallery
                records={[
                    { _key: 'u1', name: 'Alpha', img: <img src="alpha.png" alt="Alpha" /> },
                    { _key: 'u2', name: 'Bravo', img: <img src="bravo.png" alt="Bravo" /> },
                    { _key: 'u3', name: 'Charlie', img: <img src="charlie.png" alt="Charlie" /> },
                    { _key: 'u4', name: 'Delta', img: <img src="delta.png" alt="Delta" /> },
                ]}
                pagination={{ limit: 2, align: 'end' }}
                overlays={[{ position: 'topRight', badge: badgeSpy }]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Alpha')).toBeInTheDocument();
            expect(screen.getByText('Bravo')).toBeInTheDocument();
        });

        expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
        expect(badgeSpy).toHaveBeenCalledTimes(2);

        fireEvent.click(screen.getByRole('button', { name: '2' }));

        await waitFor(() => {
            expect(screen.getByText('Charlie')).toBeInTheDocument();
            expect(screen.getByText('Delta')).toBeInTheDocument();
        });

        expect(badgeSpy).toHaveBeenCalledTimes(4);
    });

    it('reuses cached overlay results when previously visible items become visible again', async () => {
        const badgeSpy = vi.fn((item: { name?: string }) => item.name);

        render(
            <Gallery
                records={[
                    { _key: 'u1', name: 'Alpha', img: <img src="alpha.png" alt="Alpha" /> },
                    { _key: 'u2', name: 'Bravo', img: <img src="bravo.png" alt="Bravo" /> },
                    { _key: 'u3', name: 'Charlie', img: <img src="charlie.png" alt="Charlie" /> },
                    { _key: 'u4', name: 'Delta', img: <img src="delta.png" alt="Delta" /> },
                ]}
                pagination={{ limit: 2, align: 'end' }}
                overlays={[{ position: 'topRight', badge: badgeSpy }]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Alpha')).toBeInTheDocument();
            expect(screen.getByText('Bravo')).toBeInTheDocument();
        });

        expect(badgeSpy).toHaveBeenCalledTimes(2);

        fireEvent.click(screen.getByRole('button', { name: '2' }));

        await waitFor(() => {
            expect(screen.getByText('Charlie')).toBeInTheDocument();
            expect(screen.getByText('Delta')).toBeInTheDocument();
        });

        expect(badgeSpy).toHaveBeenCalledTimes(4);

        fireEvent.click(screen.getByRole('button', { name: '1' }));

        await waitFor(() => {
            expect(screen.getByText('Alpha')).toBeInTheDocument();
            expect(screen.getByText('Bravo')).toBeInTheDocument();
        });

        expect(badgeSpy).toHaveBeenCalledTimes(4);

        fireEvent.click(screen.getByRole('button', { name: '2' }));

        await waitFor(() => {
            expect(screen.getByText('Charlie')).toBeInTheDocument();
            expect(screen.getByText('Delta')).toBeInTheDocument();
        });

        expect(badgeSpy).toHaveBeenCalledTimes(4);
    });
});

