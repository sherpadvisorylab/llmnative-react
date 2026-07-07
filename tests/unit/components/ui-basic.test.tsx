import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockSetLocale = vi.fn();
vi.mock('../../../src/I18n', () => ({
    useI18n: vi.fn(() => ({
        locale: 'en',
        availableLocales: ['en', 'it'],
        setLocale: mockSetLocale,
    })),
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../src/motion', () => ({
    useEnterMotion: vi.fn(() => ({})),
    useMotionState: vi.fn(() => ({})),
    usePressMotion: vi.fn(() => ({})),
}));

import Code from '../../../src/components/ui/Code';
import Icon from '../../../src/components/ui/Icon';
import LocaleSwitcher from '../../../src/components/ui/LocaleSwitcher';
import Pagination from '../../../src/components/ui/Pagination';
import Percentage from '../../../src/components/ui/Percentage';

describe('Code', () => {
    it('renders inline code', () => {
        render(<Code>const x = 1;</Code>);
        expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });
});

describe('Icon', () => {
    it('renders with a known icon name', () => {
        const { container } = render(<Icon name="star" />);
        expect(container.querySelector('i, span, svg')).toBeTruthy();
    });
});

describe('LocaleSwitcher', () => {
    it('renders with locale options', () => {
        render(<LocaleSwitcher />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
});

describe('Pagination', () => {
    it('renders page buttons', () => {
        render(
            <Pagination records={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} limit={5}>
                {(pageRecords) => <div>{pageRecords.length} items</div>}
            </Pagination>
        );
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});

describe('Percentage', () => {
    it('renders a percentage value', () => {
        render(<Percentage value={75} />);
        expect(screen.getByText('75%')).toBeInTheDocument();
    });
});
