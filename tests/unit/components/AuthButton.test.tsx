import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthButton } from '../../../src/auth';
import { AuthProvider } from '../../../src/providers/auth/AuthProviderContext';
import type { AuthProviderAdapter, UserProfile } from '../../../src/providers/auth/AuthProvider';

const createAuthAdapter = (user: UserProfile | null = null, configured = true): AuthProviderAdapter => ({
    getUser: vi.fn(() => user),
    signIn: vi.fn(async () => user),
    signOut: vi.fn(async () => undefined),
    onAuthChange: vi.fn(() => () => undefined),
    isConfigured: vi.fn(() => configured),
    isAuthenticated: vi.fn(() => !!user),
});

describe('AuthButton', () => {
    it('delegates sign-in to the selected AuthProvider', async () => {
        const adapter = createAuthAdapter();

        render(
            <AuthProvider registry={{ dropboxAuth: adapter }} defaultKey="dropboxAuth">
                <AuthButton
                    provider="dropboxAuth"
                    intent="connect"
                    scopes={['files.metadata.read']}
                    options={{ label: 'Connect Dropbox' }}
                />
            </AuthProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /connect dropbox/i }));

        expect(adapter.signIn).toHaveBeenCalledWith({
            intent: 'connect',
            scopes: ['files.metadata.read'],
        });
    });

    it('delegates logout intents to signOut', async () => {
        const adapter = createAuthAdapter({ uid: 'u1', displayName: 'Ada' });

        render(
            <AuthProvider registry={{ googleAuth: adapter }} defaultKey="googleAuth">
                <AuthButton intent="signOut" options={{ label: 'Sign out' }} />
            </AuthProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: /sign out/i }));

        expect(adapter.signOut).toHaveBeenCalledOnce();
        expect(adapter.signIn).not.toHaveBeenCalled();
    });

    it('renders avatar aspect from the selected user', () => {
        const adapter = createAuthAdapter({
            uid: 'u1',
            displayName: 'Ada Lovelace',
            photoURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E",
        });

        render(
            <AuthProvider registry={{ googleAuth: adapter }} defaultKey="googleAuth">
                <AuthButton provider="googleAuth" intent="signIn" aspect="avatar" />
            </AuthProvider>
        );

        expect(screen.getAllByTitle('Ada Lovelace').length).toBeGreaterThan(0);
    });

    it('disables avatar actions when the selected provider is not configured', async () => {
        const adapter = createAuthAdapter({ uid: 'u1', displayName: 'Ada Lovelace' }, false);

        render(
            <AuthProvider registry={{ googleAuth: adapter }} defaultKey="googleAuth">
                <AuthButton provider="googleAuth" intent="signIn" aspect="avatar" />
            </AuthProvider>
        );

        const avatarButton = screen.getByRole('button', { name: /sign in/i });
        expect(avatarButton).toBeDisabled();
        expect(avatarButton).toHaveAttribute('title', expect.stringContaining('googleAuth is not configured'));
        expect(avatarButton).toHaveStyle({ opacity: '0.55', cursor: 'not-allowed' });

        await userEvent.click(avatarButton);

        expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
        expect(adapter.signIn).not.toHaveBeenCalled();
        expect(adapter.signOut).not.toHaveBeenCalled();
    });

    it('disables button aspect with a configuration tooltip when the provider is not configured', () => {
        const adapter = createAuthAdapter(null, false);

        render(
            <AuthProvider registry={{ dropboxAuth: adapter }} defaultKey="dropboxAuth">
                <AuthButton provider="dropboxAuth" intent="connect" label="Connect Dropbox" />
            </AuthProvider>
        );

        const button = screen.getByRole('button', { name: /connect dropbox/i });
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', expect.stringContaining('dropboxAuth is not configured'));
        expect(button).toHaveStyle({ opacity: '0.55', cursor: 'not-allowed' });
    });
});
