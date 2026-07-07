import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/Theme', () => ({
    useThemeController: vi.fn(() => ({
        resolvedMode: 'light',
        primary: '221.2 83.2% 53.3%',
        radius: 0.5,
        fontSans: 'Inter',
        fontMono: 'JetBrains Mono',
        theme: 'default',
        colors: undefined,
        themes: {
            default: { id: 'default', label: 'Default', color: {} },
            flat: { id: 'flat', label: 'Flat', color: {} },
        },
        toggleMode: vi.fn(),
        setPrimary: vi.fn(),
        setRadius: vi.fn(),
        setFont: vi.fn(),
        applyTheme: vi.fn(),
        setTokens: vi.fn(),
    })),
    useTheme: vi.fn(() => ({
        Menu: {
            className: '',
            itemClassName: '',
            itemActiveClassName: '',
            itemInactiveClassName: '',
        },
        ProviderSwitcher: {
            className: '',
            itemClassName: '',
            itemActiveClassName: '',
            itemInactiveClassName: '',
            checkClassName: '',
            itemMetaClassName: '',
        },
        Dropdown: {
            className: '', motion: false,
        },
    })),
    ThemeProvider: ({ children }: any) => <>{children}</>,
    ThemeContext: { Provider: ({ children }: any) => <>{children}</> },
}));

vi.mock('../../../src/providers/icon/IconProviderContext', () => ({
    useIconController: vi.fn(() => ({
        providerId: 'lucide',
        setProvider: vi.fn(),
        registerProvider: vi.fn(),
    })),
    useIconProvider: vi.fn(() => ({
        resolve: vi.fn(() => null),
    })),
}));

vi.mock('../../../src/I18n', () => ({
    useI18n: vi.fn(() => ({})),
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../src/motion', () => ({
    useEnterMotion: vi.fn(() => ({})),
    useMotionState: vi.fn(() => ({})),
    usePressMotion: vi.fn(() => ({})),
}));

vi.mock('../../../src/providers/ProviderSession', () => ({
    useProviderSession: vi.fn(() => ({
        sessions: [],
        activeId: null,
        switchTo: vi.fn(),
        disconnect: vi.fn(),
        loading: false,
    })),
}));

vi.mock('../../../src/providers/auth/AuthProviderContext', () => ({
    useAuthProvider: vi.fn(() => ({
        getUser: vi.fn(),
        isAuthenticated: false,
    })),
}));

import ThemeSwitcher from '../../../src/components/blocks/ThemeSwitcher';
import ProviderSwitcher from '../../../src/components/blocks/ProviderSwitcher';

describe('ThemeSwitcher', () => {
    it('renders nothing in modal mode when closed', () => {
        const { container } = render(
            <ThemeSwitcher surface="modal" open={false} />
        );
        expect(container.textContent).toBe('');
    });

    it('renders in flat mode', () => {
        const { container } = render(
            <ThemeSwitcher surface="flat" showThemeSection />
        );
        expect(container.textContent).toContain('Theme');
    });
});

describe('ProviderSwitcher', () => {
    it('renders without crashing', () => {
        render(
            <ProviderSwitcher
                caption="Accounts"
                items={[
                    { id: 'google', label: 'Google' },
                    { id: 'dropbox', label: 'Dropbox' },
                ]}
            />
        );
        expect(screen.getByText('Google')).toBeInTheDocument();
    });
});
