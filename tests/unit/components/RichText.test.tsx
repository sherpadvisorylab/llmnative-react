import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));

import Form from '../../../src/components/widgets/Form';
import { RichText } from '../../../src/components/ui/fields/RichText';
import { renderWithProviders } from '../../helpers/renderWithProviders';

describe('RichText', () => {
    it('uses the plain text of a JSX label for the loading aria-label', () => {
        const { container } = renderWithProviders(
            <Form aspect="empty">
                <RichText name="body" label={<span>Body</span>} />
            </Form>
        );

        const placeholder = container.querySelector('[aria-busy="true"]');
        expect(placeholder).not.toBeNull();
        expect(placeholder?.getAttribute('aria-label')).toBe('Body');
    });
});
