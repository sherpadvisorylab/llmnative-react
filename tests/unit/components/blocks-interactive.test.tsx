import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    it('shows the detail of an item, runs its actions without opening it, and tells when it is opened', async () => {
        let resolve: () => void = () => undefined;
        const fix = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
        const opened = vi.fn();
        render(
            <MemoryRouter>
                <Notifications
                    onItemClick={opened}
                    items={[
                        { id: 'source', title: 'Source without its Action', description: 'crm · sources/notes/a.md', url: '/projects/crm', time: 'now', icon: 'file', actions: [{ label: 'Open the Action', icon: 'play', onClick: fix, variant: 'primary' }] },
                        { id: 'issue', title: 'Issue blocked', url: 'https://github.com/acme/crm/issues/3', external: true, time: '1h', icon: 'octagon-alert' },
                        { title: 'Only shown', time: '2h', icon: 'info' },
                    ]}
                />
            </MemoryRouter>
        );
        // The menu opens from the bell.
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getByText('crm · sources/notes/a.md')).toBeInTheDocument();
        const action = screen.getByRole('button', { name: 'Open the Action' });
        fireEvent.click(action);
        expect(fix).toHaveBeenCalledTimes(1);
        // Working while its promise runs, and the notification was not opened.
        expect(action).toBeDisabled();
        expect(opened).not.toHaveBeenCalled();
        resolve();
        await waitFor(() => expect(action).not.toBeDisabled());
        // An address opens in a new tab; a notification without url is no link.
        const external = screen.getByText('Issue blocked').closest('a')!;
        expect(external).toHaveAttribute('href', 'https://github.com/acme/crm/issues/3');
        expect(external).toHaveAttribute('target', '_blank');
        expect(screen.getByText('Only shown').closest('a')).toBeNull();
        fireEvent.click(external);
        expect(opened).toHaveBeenCalledWith(expect.objectContaining({ id: 'issue' }), 1);
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
