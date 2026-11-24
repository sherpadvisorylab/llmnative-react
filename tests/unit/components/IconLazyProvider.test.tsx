import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import Icon from '../../../src/components/ui/Icon';
import { IconProvider } from '../../../src/providers/icon/IconProviderContext';
import type { IconProviderAdapter } from '../../../src/providers/icon/IconProvider';

// CR-154 — a provider whose package loads on demand (`isReady` / `load`).
function lazyProvider(id = 'lazy') {
    let ready = false;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const provider: IconProviderAdapter = {
        id,
        isReady: () => ready,
        load: async () => { await gate; ready = true; },
        resolve: (name) => (ready ? (props) => <svg data-icon={name} width={props.size as number} /> : null),
    };
    return { provider, release: async () => { await act(async () => { release(); await gate; }); } };
}

describe('CR-154 — icons of a provider that loads on demand', () => {
    it('Icon keeps the place of the icon, then draws it once the provider is loaded', async () => {
        const { provider, release } = lazyProvider();
        const { container } = render(<Icon name="plus" size={18} provider={provider} />);
        expect(container.querySelector('[data-rf-icon-pending]')).not.toBeNull();
        expect(container.querySelector('svg')).toBeNull();

        await release();
        expect(container.querySelector('svg[data-icon="plus"]')).not.toBeNull();
        expect(container.querySelector('[data-rf-icon-pending]')).toBeNull();
    });

    it('IconProvider waits for its provider before the first render: the app appears with its icons', async () => {
        const { provider, release } = lazyProvider();
        // React 19 runs the retry of a suspended tree within act only when the render itself was in an async act.
        await act(async () => {
            render(
                <React.Suspense fallback={<span>loading</span>}>
                    <IconProvider provider={provider}><p>content <Icon name="check" /></p></IconProvider>
                </React.Suspense>,
            );
        });
        expect(screen.getByText('loading')).toBeInTheDocument();
        expect(screen.queryByText(/content/)).toBeNull();

        await release();
        expect(screen.getByText(/content/).querySelector('svg[data-icon="check"]')).not.toBeNull();
        expect(document.querySelector('[data-rf-icon-pending]')).toBeNull();
    });
});
