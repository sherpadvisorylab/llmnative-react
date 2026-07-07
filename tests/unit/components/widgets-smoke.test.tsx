import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/I18n', () => ({
    useI18n: vi.fn(() => ({})),
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../src/components/widgets/Form', () => ({
    useFormContext: vi.fn(() => ({
        watch: vi.fn(() => []),
        setValue: vi.fn(),
        register: vi.fn(),
        getValues: vi.fn(() => ({ layout: [] })),
    })),
    FormValidationContext: {
        Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
}));

import { LayoutBuilder } from '../../../src/components/ui/LayoutBuilder';

describe('LayoutBuilder', () => {
    it('renders without crashing', () => {
        const { container } = render(
            <LayoutBuilder name="layout" />
        );
        expect(container.textContent).not.toBeNull();
    });
});
