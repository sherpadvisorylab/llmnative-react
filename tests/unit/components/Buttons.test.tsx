import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ActionButton } from '../../../src/components/ui/Buttons';

describe('ActionButton', () => {
    it('renders badge through the shared overlay Badge component', () => {
        render(<ActionButton label="Settings" badge={{ content: '3', type: 'danger' }} />);

        const badge = screen.getByText('3');

        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('badge-overlay');
        expect(badge).toHaveClass('badge-danger');
    });

    it('uses the default badge type for badge shortcuts', () => {
        render(<ActionButton label="Settings" badge={3} />);

        const badge = screen.getByText('3');

        expect(badge).toHaveClass('badge-info');
    });

    it('keeps a diagnostic title available for disabled buttons', () => {
        render(<ActionButton label="Connect" disabled title="Missing api key" />);

        expect(screen.getAllByTitle('Missing api key').length).toBeGreaterThan(0);
    });
});
