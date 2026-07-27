import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppProvider } from '../../../src/App';
import {
    registerProviderSessionFactory,
    useProviderSession,
    type ProviderSessionResponse,
} from '../../../src/providers/ProviderSession';

const TEST_CATEGORY = 'session-coordination-test';
const TEST_TYPE = 'adapter';

function SessionProbe({
    source,
    onComplete,
}: {
    source: () => Promise<ProviderSessionResponse>;
    onComplete: () => void;
}) {
    const { switchSession } = useProviderSession();

    React.useEffect(() => {
        void switchSession(source, { sessionKey: 'tenant-1' }).then(onComplete);
    }, [onComplete, source, switchSession]);

    return null;
}

describe('ProviderSession coordination', () => {
    it('shares one keyed switch across independent hook consumers', async () => {
        const adapterFactory = vi.fn(() => ({ id: 'tenant-1-adapter' }));
        registerProviderSessionFactory(TEST_CATEGORY, TEST_TYPE, adapterFactory);

        const source = vi.fn(async (): Promise<ProviderSessionResponse> => ({
            providers: {
                [TEST_CATEGORY]: {
                    type: TEST_TYPE,
                    publicConfig: {},
                },
            },
        }));
        const onComplete = vi.fn();

        render(
            <AppProvider>
                <SessionProbe source={source} onComplete={onComplete} />
                <SessionProbe source={source} onComplete={onComplete} />
            </AppProvider>,
        );

        await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(2));
        expect(source).toHaveBeenCalledTimes(1);
        expect(adapterFactory).toHaveBeenCalledTimes(1);
    });
});
