import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/I18n', () => ({
    useI18n: vi.fn(() => ({})),
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../src/motion', () => ({
    useEnterMotion: vi.fn(() => ({})),
    useMotionState: vi.fn(() => ({})),
    usePressMotion: vi.fn(() => ({})),
}));

import Notifications from '../../../src/components/blocks/Notifications';
import Search from '../../../src/components/blocks/Search';
import Toolbar from '../../../src/components/blocks/Toolbar';

// ── Notifications ────────────────────────────────────────────────

describe('Notifications', () => {
    it('renders with items', () => {
        render(
            <MemoryRouter>
                <Notifications
                    items={[
                        { title: 'New message', url: '/messages', time: '5m ago', icon: 'mail' },
                    ]}
                />
            </MemoryRouter>
        );
        expect(screen.getByText('New message')).toBeInTheDocument();
        expect(screen.getByText('5m ago')).toBeInTheDocument();
    });

    it('renders empty state when no items', () => {
        render(
            <MemoryRouter>
                <Notifications items={[]} />
            </MemoryRouter>
        );
        expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
    });
});

// ── Search ───────────────────────────────────────────────────────

describe('Search', () => {
    it('renders a search input', () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});

// ── Toolbar ──────────────────────────────────────────────────────

describe('Toolbar', () => {
    it('renders leading, center, trailing sections', () => {
        render(
            <Toolbar
                leading={<span>Left</span>}
                center={<span>Center</span>}
                trailing={<span>Right</span>}
            />
        );
        expect(screen.getByText('Left')).toBeInTheDocument();
        expect(screen.getByText('Center')).toBeInTheDocument();
        expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <Toolbar>
                <button>Action</button>
            </Toolbar>
        );
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
});
