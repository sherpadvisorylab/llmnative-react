import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import Alert from '../../../src/components/ui/Alert';

describe('Alert', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders sticky alerts inside the provided anchor container', async () => {
        const anchorRef = createRef<HTMLDivElement>();

        render(
            <div ref={anchorRef}>
                <Alert placement="sticky" anchorRef={anchorRef} variant="success">
                    Saved successfully
                </Alert>
            </div>
        );

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(anchorRef.current?.firstElementChild).not.toBeNull();
        expect(anchorRef.current?.textContent).toContain('Saved successfully');
    });

    it('supports sticky placement for text appearance too', async () => {
        const anchorRef = createRef<HTMLDivElement>();

        render(
            <div ref={anchorRef}>
                <Alert placement="sticky" appearance="text" anchorRef={anchorRef} variant="info">
                    Inline sticky status
                </Alert>
            </div>
        );

        await waitFor(() => {
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        expect(anchorRef.current?.textContent).toContain('Inline sticky status');
    });

    it('uses the provided timeout even when it is zero', async () => {
        vi.useFakeTimers();
        const onClose = vi.fn();

        render(
            <Alert timeout={0} onClose={onClose}>
                Immediate close
            </Alert>
        );

        await vi.runAllTimersAsync();

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
