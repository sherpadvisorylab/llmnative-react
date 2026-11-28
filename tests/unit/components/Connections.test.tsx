import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { ConnectionBoard, ConnectionList } from '../../../src/components/blocks/Connections';
import AIConnections from '../../../src/components/blocks/AIConnections';
import type { AIConnectionStore, AIConnectionsSnapshot } from '../../../src/providers/ai/connections';
import { renderWithProviders } from '../../helpers/renderWithProviders';

// CR-157: the connections as boxes with their count, and the connections of a provider as a list.

describe('ConnectionBoard', () => {
    it('shows the boxes by group with how many connections each has, and opens one', () => {
        const onOpen = vi.fn();
        renderWithProviders(
            <ConnectionBoard
                items={[
                    { id: 'claude-code', label: 'Claude Code', group: 'subscription', count: 3 },
                    { id: 'opencode-go', label: 'OpenCode Go', group: 'subscription', count: 1 },
                    { id: 'openai', label: 'OpenAI', count: 0 },
                    { id: 'deepseek', label: 'DeepSeek', count: 2, status: <span>Out of credit</span> },
                ]}
                onOpen={onOpen}
            />,
        );
        expect(screen.getByText('Subscriptions')).toBeInTheDocument();
        expect(screen.getByText('Pay as you go')).toBeInTheDocument();
        expect(screen.getByText('3 connections')).toBeInTheDocument();
        expect(screen.getByText('1 connection')).toBeInTheDocument();
        expect(screen.getByText('To connect')).toBeInTheDocument();
        expect(screen.getByText('Out of credit')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Claude Code'));
        expect(onOpen).toHaveBeenCalledWith('claude-code');
    });
});

describe('ConnectionList', () => {
    it('adds with the flow of the caller, renames, and revokes after a confirmation', async () => {
        const onRename = vi.fn(async () => undefined);
        const onRemove = vi.fn(async () => undefined);
        renderWithProviders(
            <ConnectionList
                items={[{ id: 'a', label: 'work@example.com' }, { id: 'b', exhaustedUntil: '2026-11-28T15:00:00Z' }]}
                onRename={onRename}
                onRemove={onRemove}
                onReorder={vi.fn()}
                renderAdd={(done) => <button type="button" onClick={done}>the sign-in</button>}
            />,
        );
        expect(screen.getByText('Connections (2)')).toBeInTheDocument();
        expect(screen.getByText('work@example.com')).toBeInTheDocument();
        expect(screen.getByText('Connection 2')).toBeInTheDocument();
        expect(screen.getByText(/No credit until/)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.click(screen.getByText('the sign-in'));
        expect(screen.queryByText('the sign-in')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Rename work@example.com' }));
        const rename = await screen.findByRole('dialog');
        fireEvent.change(within(rename).getByLabelText('Name'), { target: { value: 'Work' } });
        fireEvent.click(within(rename).getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(onRename).toHaveBeenCalledWith('a', 'Work'));

        fireEvent.click(screen.getByRole('button', { name: 'Revoke Connection 2' }));
        expect(await screen.findByText('Revoke Connection 2? The app stops using it.')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
        await waitFor(() => expect(onRemove).toHaveBeenCalledWith('b'));
    });

    it('in read only, shows the connections without actions', () => {
        renderWithProviders(<ConnectionList items={[{ id: 'a', label: 'One' }]} onRemove={vi.fn()} renderAdd={() => null} readOnly />);
        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Revoke One' })).not.toBeInTheDocument();
    });
});

describe('AIConnections with several keys (CR-157)', () => {
    function store(initial: AIConnectionsSnapshot) {
        let snapshot = initial;
        const value: AIConnectionStore = {
            load: vi.fn(async () => snapshot),
            connect: vi.fn(async () => ({ ok: true as const })),
            disconnect: vi.fn(async (provider: string) => { snapshot = { providers: snapshot.providers.filter((entry) => entry.id !== provider) }; }),
            addAccount: vi.fn(async (provider: string, fields: Record<string, string>) => {
                snapshot = { providers: snapshot.providers.map((entry) => (entry.id === provider ? { ...entry, accounts: [...(entry.accounts ?? [{ id: 'k1' }]), { id: 'k2', label: fields.label }] } : entry)) };
                return { ok: true as const };
            }),
            removeAccount: vi.fn(async () => undefined),
        };
        return value;
    }

    it('lists the one key, adds a second, and revoking the last one disconnects the provider', async () => {
        const connections = store({ providers: [{ id: 'openai' }] });
        renderWithProviders(<AIConnections store={connections} allow={['openai']} />);
        fireEvent.click(await screen.findByText('OpenAI'));
        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Account 1')).toBeInTheDocument();
        fireEvent.click(within(dialog).getByRole('button', { name: 'Add an account' }));
        fireEvent.change(within(dialog).getByLabelText('Name'), { target: { value: 'Second' } });
        fireEvent.change(within(dialog).getAllByLabelText(/API Key/i).at(-1)!, { target: { value: 'sk-2' } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'Add' }));
        await waitFor(() => expect(connections.addAccount).toHaveBeenCalledWith('openai', expect.objectContaining({ label: 'Second', apiKey: 'sk-2' })));
        expect(await screen.findByText('2 connections')).toBeInTheDocument();
    });

    it('revoking the only key disconnects the provider', async () => {
        const connections = store({ providers: [{ id: 'openai' }] });
        renderWithProviders(<AIConnections store={connections} allow={['openai']} />);
        fireEvent.click(await screen.findByText('OpenAI'));
        const dialog = await screen.findByRole('dialog');
        fireEvent.click(within(dialog).getByRole('button', { name: 'Revoke Account 1' }));
        fireEvent.click(await screen.findByRole('button', { name: 'Yes' }));
        await waitFor(() => expect(connections.disconnect).toHaveBeenCalledWith('openai'));
        expect(connections.removeAccount).not.toHaveBeenCalled();
    });
});
