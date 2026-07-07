import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/I18n', () => ({
    useI18n: vi.fn(() => ({})),
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...(actual as object),
        useLocation: vi.fn(() => ({ pathname: '/products', search: '', hash: '', state: null, key: '' })),
    };
});

import Brand from '../../../src/components/blocks/Brand';
import { Breadcrumbs } from '../../../src/components/blocks/Breadcrumbs';
import Carousel from '../../../src/components/blocks/Carousel';

describe('Brand', () => {
    it('renders a label when no logo is provided', () => {
        render(<Brand label="MyApp" />, { wrapper: MemoryRouter });
        expect(screen.getByText('MyApp')).toBeInTheDocument();
    });
});

describe('Breadcrumbs', () => {
    it('renders breadcrumb items', () => {
        const { container } = render(
            <MemoryRouter>
                <Breadcrumbs
                    trail="/home/products"
                    rootItem={{ label: 'Home', href: '/' }}
                />
            </MemoryRouter>
        );
        expect(container.querySelector('a[href="/"]')).toBeTruthy();
        expect(container.textContent).toContain('products');
    });
});

describe('Carousel', () => {
    it('renders its children', () => {
        const { container } = render(
            <Carousel>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </Carousel>
        );
        expect(container.textContent).toContain('Slide 1');
        expect(container.textContent).toContain('Slide 2');
    });
});
