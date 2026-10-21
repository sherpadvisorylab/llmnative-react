import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthButton } from '../../../src/auth';
import { I18nProvider } from '../../../src/I18n';
import { AuthProvider } from '../../../src/providers/auth/AuthProviderContext';
import { GitHubAuthProvider } from '../../../src/providers/auth/github/GitHubAuthProvider';

const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const renderWithGitHub = (provider: GitHubAuthProvider, ui: React.ReactElement) =>
    render(
        <I18nProvider>
            <AuthProvider registry={{ githubAuth: provider }} defaultKey="githubAuth">
                {ui}
            </AuthProvider>
        </I18nProvider>
    );

describe('AuthButton with GitHubAuthProvider', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('shows the server profile and signs out through the adapter (avatar aspect)', async () => {
        const fetchMock = vi.fn(async (input: string) => {
            if (String(input).endsWith('/me')) return jsonResponse({ uid: '42', displayName: 'Octocat' });
            return new Response(null, { status: 204 });
        });
        vi.stubGlobal('fetch', fetchMock);
        const provider = new GitHubAuthProvider({ sessionUrl: 'https://session.example.com' });

        renderWithGitHub(provider, <AuthButton provider="githubAuth" intent="signIn" aspect="avatar" />);

        await screen.findByRole('button', { name: /octocat/i });

        await userEvent.click(screen.getByRole('button', { name: /octocat/i }));
        await userEvent.click(await screen.findByRole('menuitem', { name: /sign out/i }));

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith('https://session.example.com/logout', expect.objectContaining({ method: 'POST' }));
        });
        expect(provider.isAuthenticated()).toBe(false);
    });

    it('signs in by redirecting to the server (button aspect)', async () => {
        const assign = vi.fn();
        vi.stubGlobal('location', { assign });
        vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })));
        const provider = new GitHubAuthProvider({ sessionUrl: 'https://session.example.com' });

        renderWithGitHub(provider, <AuthButton provider="githubAuth" intent="signIn" label="Sign in with GitHub" />);

        await userEvent.click(screen.getByRole('button', { name: /sign in with github/i }));

        expect(assign).toHaveBeenCalledWith('https://session.example.com/login');
    });
});
