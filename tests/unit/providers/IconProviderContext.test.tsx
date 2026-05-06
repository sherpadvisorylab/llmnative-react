import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { IconComponentProps, IconProvider } from '../../../src/providers/icon/IconProvider';
import {
    IconProviderProvider,
    useIconController,
    useIconProvider,
} from '../../../src/providers/icon/IconProviderContext';

function IconProbe() {
    const controller = useIconController();
    const provider = useIconProvider();
    const Resolved = provider?.resolve('search');

    return (
        <div>
            <span data-testid="provider-id">{controller.providerId}</span>
            <span data-testid="has-search">{Resolved ? 'yes' : 'no'}</span>
            <button onClick={() => controller.setProvider('phosphor')}>phosphor</button>
        </div>
    );
}

describe('IconProviderProvider', () => {
    it('accepts a string shorthand for the default provider', () => {
        render(
            <IconProviderProvider config="phosphor">
                <IconProbe />
            </IconProviderProvider>
        );

        expect(screen.getByTestId('provider-id')).toHaveTextContent('phosphor');
        expect(screen.getByTestId('has-search')).toHaveTextContent('yes');
    });

    it('merges custom providers with built-in providers', () => {
        const CustomIcon = (props: IconComponentProps) => <span data-testid="custom-icon" {...props} />;
        const customProvider: IconProvider = {
            id: 'custom',
            resolve: (name) => name === 'search' ? CustomIcon : null,
        };

        render(
            <IconProviderProvider config={{ default: 'custom', providers: { custom: customProvider } }}>
                <IconProbe />
            </IconProviderProvider>
        );

        expect(screen.getByTestId('provider-id')).toHaveTextContent('custom');
        expect(screen.getByTestId('has-search')).toHaveTextContent('yes');

        fireEvent.click(screen.getByText('phosphor'));
        expect(screen.getByTestId('provider-id')).toHaveTextContent('phosphor');
    });
});
