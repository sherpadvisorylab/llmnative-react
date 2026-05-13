import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StorageProvider, useStorageProvider } from '../../../src/providers/storage/StorageProviderContext';
import type { StorageProviderAdapter } from '../../../src/providers/storage/StorageProvider';

const createStorageAdapter = (label: string): StorageProviderAdapter => ({
    upload: vi.fn(async (_file, path) => `${label}:upload:${path}`),
    getURL: vi.fn(async (path) => `${label}:url:${path}`),
    download: vi.fn(async () => new Blob(['file'])),
    delete: vi.fn(async () => true),
});

function Probe({ name }: { name?: string }) {
    const storage = useStorageProvider(name);
    return <div data-testid="provider">{storage ? 'available' : 'missing'}</div>;
}

describe('StorageProviderContext', () => {
    it('returns null when used outside the provider', () => {
        render(<Probe />);
        expect(screen.getByTestId('provider')).toHaveTextContent('missing');
    });

    it('returns the default storage adapter', () => {
        const adapter = createStorageAdapter('default');

        render(
            <StorageProvider registry={{ default: adapter }} defaultKey="default">
                <Probe />
            </StorageProvider>
        );

        expect(screen.getByTestId('provider')).toHaveTextContent('available');
    });

    it('selects a named storage adapter from the registry', () => {
        const defaultAdapter = createStorageAdapter('default');
        const mediaAdapter = createStorageAdapter('media');

        function NamedProbe() {
            const storage = useStorageProvider('media');
            storage?.getURL('/images/avatar.png');
            return <div data-testid="provider">{storage ? 'available' : 'missing'}</div>;
        }

        render(
            <StorageProvider registry={{ default: defaultAdapter, media: mediaAdapter }} defaultKey="default">
                <NamedProbe />
            </StorageProvider>
        );

        expect(screen.getByTestId('provider')).toHaveTextContent('available');
        expect(mediaAdapter.getURL).toHaveBeenCalledWith('/images/avatar.png');
        expect(defaultAdapter.getURL).not.toHaveBeenCalled();
    });

    it('returns null for unknown storage names', () => {
        render(
            <StorageProvider registry={{ default: createStorageAdapter('default') }} defaultKey="default">
                <Probe name="unknown" />
            </StorageProvider>
        );

        expect(screen.getByTestId('provider')).toHaveTextContent('missing');
    });
});
