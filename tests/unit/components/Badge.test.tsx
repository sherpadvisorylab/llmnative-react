import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BadgeOverlay } from '../../../src/components/ui/Badge';

describe('BadgeOverlay', () => {
    it('renders a standalone badge from descriptor props', () => {
        render(<BadgeOverlay content="new" type="success" />);

        const badge = screen.getByText('new');

        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('badge-success');
    });

    it('renders an overlay badge when children are provided', () => {
        render(
            <BadgeOverlay badge={3}>
                <button type="button">Inbox</button>
            </BadgeOverlay>
        );

        const badge = screen.getByText('3');

        expect(screen.getByRole('button', { name: 'Inbox' })).toBeVisible();
        expect(badge).toHaveClass('badge-overlay');
        expect(badge).toHaveClass('badge-info');
    });
});
