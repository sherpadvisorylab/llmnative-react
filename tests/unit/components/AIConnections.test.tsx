import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import AIConnections, { AIModelRegionBadge } from '../../../src/components/blocks/AIConnections';
import type { AIConnectionStore, AIConnectionsSnapshot, AIConnector } from '../../../src/providers/ai/connections';
import { isModelInRegion } from '../../../src/providers/ai/connections';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-134: the page where an app connects its AI providers, behind the app's store of the connections.

/** A store in memory: what the page sends, what it would keep (never returned to the page). */
function memoryStore(initial: AIConnectionsSnapshot = { providers: [] }) {
    let snapshot = initial;
    const secrets: Record<string, Record<string, string>> = {};
    const store: AIConnectionStore & { secrets: typeof secrets } = {
        secrets,
        load: vi.fn(async () => snapshot),
        connect: vi.fn(async (provider: string, fields: Record<string, string>) => {
            if (fields.apiKey === 'wrong') return { ok: false as const, error: 'invalid key' };
            secrets[provider] = { ...secrets[provider], ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value)) };
            const visible = Object.fromEntries(Object.entries(fields).filter(([key]) => key !== 'apiKey' && key !== 'serviceAccount'));
            snapshot = { ...snapshot, providers: [...snapshot.providers.filter((entry) => entry.id !== provider), { id: provider, fields: visible }] };
            return { ok: true as const };
        }),
        disconnect: vi.fn(async (provider: string) => {
            snapshot = { ...snapshot, providers: snapshot.providers.filter((entry) => entry.id !== provider) };
        }),
        setOrder: vi.fn(async () => undefined),
        models: vi.fn(async () => [
            { id: 'vertex/gemini-3.5-flash', provider: 'vertex', model: 'gemini-3.5-flash', label: 'x', dataRegion: 'eu', structuredOutput: 'native' as const, pricing: { input: 0.3, output: 2.5, currency: 'USD' as const, source: 'models.dev' as const } },
            { id: 'vertex/other', provider: 'vertex', model: 'other', label: 'y', dataRegion: 'global', structuredOutput: 'native' as const },
        ]),
    };
    return store;
}

beforeEach(() => localStorage.clear());

describe('AIConnections', () => {
    it('lists the providers, the connected ones marked, the subscriptions apart', async () => {
        renderWithProviders(<AIConnections store={memoryStore({ providers: [{ id: 'anthropic' }] })} allow={['anthropic', 'gemini', 'opencode-go']} />);
        expect(await screen.findByText('Anthropic')).toBeInTheDocument();
        expect(screen.getByText('Subscriptions')).toBeInTheDocument();
        expect(screen.getByText('Pay as you go')).toBeInTheDocument();
        expect(screen.queryByText('OpenAI')).not.toBeInTheDocument();
        // CR-157: on each box how many connections it has.
        await waitFor(() => expect(screen.getAllByText('1 connection')).toHaveLength(1));
        expect(screen.getAllByText('To connect')).toHaveLength(2);
    });

    it('connects a provider through the store, shows the refusal, and never puts the key back on the page', async () => {
        const store = memoryStore();
        renderWithProviders(<AIConnections store={store} allow={['gemini']} />);
        fireEvent.click(await screen.findByText('Gemini'));
        const dialog = await screen.findByRole('dialog');
        const key = within(dialog).getByLabelText(/API Key/i);
        fireEvent.change(key, { target: { value: 'wrong' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'Connect' }));
        expect(await within(dialog).findByText('Not connected: invalid key')).toBeInTheDocument();
        fireEvent.change(key, { target: { value: 'AIza-secret' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'Connect' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(store.secrets.gemini).toEqual({ apiKey: 'AIza-secret' });
        expect(await screen.findByText('1 connection')).toBeInTheDocument();
        // Open again: the key field is empty, the dots say it is saved.
        fireEvent.click(screen.getByText('Gemini'));
        const again = await screen.findByRole('dialog');
        expect(within(again).getByLabelText(/API Key/i)).toHaveValue('');
        expect(within(again).getByPlaceholderText('•••••••••••• saved')).toBeInTheDocument();
        expect(document.body.innerHTML).not.toContain('AIza-secret');
    });

    it('shows the models of a connected provider with their data region against the rule of the app', async () => {
        renderWithProviders(<AIConnections store={memoryStore({ providers: [{ id: 'vertex', fields: { projectId: 'p', location: 'eu' } }] })} allow={['vertex']} region={{ preferred: 'eu' }} />);
        fireEvent.click(await screen.findByText('Vertex AI'));
        const dialog = await screen.findByRole('dialog');
        expect(await within(dialog).findByText('gemini-3.5-flash')).toBeInTheDocument();
        expect(within(dialog).getByText('EU')).toBeInTheDocument();
        expect(within(dialog).getByText('Global · Outside EU')).toBeInTheDocument();
        expect(within(dialog).getByText('Structured answers: native')).toBeInTheDocument();
        expect(within(dialog).getByLabelText(/Project ID/)).toHaveValue('p');
    });

    it('in read only, shows and does not change', async () => {
        renderWithProviders(<AIConnections store={memoryStore({ providers: [{ id: 'anthropic' }] })} allow={['anthropic']} readOnly />);
        expect(await screen.findByText('Set by the app: it cannot be changed here.')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Anthropic'));
        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).queryByRole('button', { name: 'Disconnect' })).not.toBeInTheDocument();
        expect(within(dialog).queryByLabelText(/API Key/i)).not.toBeInTheDocument();
    });

    it('connects a connector of the app with its own fields: a subscription on a runner the app names', async () => {
        const connect = vi.fn(async () => ({ ok: true as const }));
        const connector: AIConnector = {
            id: 'claude-code',
            label: 'Claude Code',
            description: 'The subscription of Claude, on a runner.',
            connected: false,
            fields: [
                { key: 'runnerUrl', label: 'Runner address', type: 'text' },
                { key: 'runnerToken', label: 'Runner access', type: 'password' },
            ],
            connect,
        };
        renderWithProviders(<AIConnections store={memoryStore()} allow={[]} connectors={[connector]} />);
        fireEvent.click(await screen.findByText('Claude Code'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.change(within(dialog).getByLabelText(/Runner address/), { target: { value: 'https://runner.example.com' } });
        fireEvent.change(within(dialog).getByLabelText(/Runner access/), { target: { value: 'tok' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'Connect' }));
        await waitFor(() => expect(connect).toHaveBeenCalledWith({ runnerUrl: 'https://runner.example.com', runnerToken: 'tok' }));
    });

    it('shows the order of the providers and goes back to automatic', async () => {
        const store = memoryStore({ providers: [{ id: 'anthropic' }, { id: 'gemini' }], order: { list: ['anthropic', 'gemini'], manual: true } });
        renderWithProviders(<AIConnections store={store} allow={['anthropic', 'gemini']} />);
        expect(await screen.findByText('Order of the providers')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Back to automatic' }));
        await waitFor(() => expect(store.setOrder).toHaveBeenCalledWith(null));
    });
});

describe('the data region of a model', () => {
    it('is in the region of the rule, or out of it', () => {
        expect(isModelInRegion({ dataRegion: 'eu' }, { preferred: 'eu' })).toBe(true);
        expect(isModelInRegion({}, { preferred: 'eu' })).toBe(false);
        expect(isModelInRegion({ dataRegion: 'us' })).toBe(true);
    });

    it('says not allowed when the app requires its region', () => {
        renderWithProviders(<AIModelRegionBadge model={{ dataRegion: 'us' }} region={{ preferred: 'eu', mode: 'require' }} />);
        expect(screen.getByText('USA · Not allowed: outside EU')).toBeInTheDocument();
    });
});
