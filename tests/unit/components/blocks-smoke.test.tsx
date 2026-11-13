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
import { setStaticMenu } from '../../../src/App';
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
        expect(container.textContent).toContain('Products');
    });

    it('names a segment by the title of its route in the menu, a word made readable, an id as it is', () => {
        setStaticMenu({ main: [{ path: '/impostazioni', title: 'Impostazioni' }], routes: [{ path: '/lead-fermi', hidden: true, title: 'Lead fermi' }] });
        const labels = (trail: string) => {
            const { container, unmount } = render(<MemoryRouter><Breadcrumbs trail={trail} /></MemoryRouter>);
            const text = [...container.querySelectorAll('li')].map((item) => item.textContent?.trim()).filter((text) => text && text !== '/');
            unmount();
            return text;
        };
        expect(labels('/impostazioni')).toEqual(['Impostazioni']);
        expect(labels('/lead-fermi/a1B2c3')).toEqual(['Lead fermi', 'a1B2c3']);
        expect(labels('/contatti-attivi')).toEqual(['Contatti attivi']);
        setStaticMenu({});
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
