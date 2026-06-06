import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../../../src/components/ErrorBoundary';

// ── Helper: component that throws on demand ───────────────────────────────────

function Bomb({ shouldThrow = false }: { shouldThrow?: boolean }) {
    if (shouldThrow) throw new Error('Test explosion');
    return <div>All good</div>;
}

// Suppress React's noisy console.error for intentional errors in tests
let consoleError: typeof console.error;
beforeEach(() => {
    consoleError = console.error;
    console.error = vi.fn();
});
afterEach(() => {
    console.error = consoleError;
});

// ── 1. Normal render (no error) ───────────────────────────────────────────────

describe('ErrorBoundary — no error', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <Bomb />
            </ErrorBoundary>
        );
        expect(screen.getByText('All good')).toBeInTheDocument();
    });
});

// ── 2. Default fallback UI ────────────────────────────────────────────────────

describe('ErrorBoundary — default fallback', () => {
    it('shows the default error UI when a child throws', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.getByText('This page ran into a problem')).toBeInTheDocument();
    });

    it('does not show the original children after a crash', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.queryByText('All good')).not.toBeInTheDocument();
    });

    it('includes the error message in the technical details section', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        // The truncated message appears in the collapsed details button
        expect(screen.getByText(/Test explosion/)).toBeInTheDocument();
    });

    it('expands technical details on click', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        const toggle = screen.getByText('Technical details');
        expect(screen.queryByRole('log')).not.toBeInTheDocument();
        fireEvent.click(toggle);
        // The pre element containing the full stack is now visible
        const pre = document.querySelector('pre');
        expect(pre).toBeInTheDocument();
        expect(pre?.textContent).toMatch(/Test explosion/);
    });

    it('shows Try again and Go to home buttons', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go to home' })).toBeInTheDocument();
    });
});

// ── 3. Reset (Try again) ──────────────────────────────────────────────────────

describe('ErrorBoundary — reset', () => {
    it('resets the boundary when Try again is clicked and children no longer throw', () => {
        const { rerender } = render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );

        expect(screen.getByText('This page ran into a problem')).toBeInTheDocument();

        // Re-render with a non-throwing child BEFORE clicking reset
        rerender(
            <ErrorBoundary>
                <Bomb shouldThrow={false} />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
        expect(screen.getByText('All good')).toBeInTheDocument();
    });
});

// ── 4. Custom fallback (ReactNode) ────────────────────────────────────────────

describe('ErrorBoundary — custom fallback node', () => {
    it('renders the custom fallback node instead of the default UI', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error page</div>}>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.getByText('Custom error page')).toBeInTheDocument();
        expect(screen.queryByText('This page ran into a problem')).not.toBeInTheDocument();
    });
});

// ── 5. Custom fallback (function) ─────────────────────────────────────────────

describe('ErrorBoundary — custom fallback function', () => {
    it('passes the error and a reset callback to the fallback function', () => {
        const fallbackFn = vi.fn(() => <div>Fn fallback</div>);
        render(
            <ErrorBoundary fallback={fallbackFn}>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(fallbackFn).toHaveBeenCalled();
        const [error, reset] = fallbackFn.mock.calls[0];
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Test explosion');
        expect(typeof reset).toBe('function');
        expect(screen.getByText('Fn fallback')).toBeInTheDocument();
    });
});

// ── 6. Report button ──────────────────────────────────────────────────────────

describe('ErrorBoundary — report button', () => {
    it('hides the Send report button when reportUrl is not set', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.queryByRole('button', { name: /send report/i })).not.toBeInTheDocument();
    });

    it('shows the Send report button when reportUrl is set', () => {
        render(
            <ErrorBoundary reportUrl="https://example.com/errors">
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.getByRole('button', { name: /send report/i })).toBeInTheDocument();
    });

    it('POSTs the correct payload when Send report is clicked', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(null, { status: 200 })
        );

        render(
            <ErrorBoundary reportUrl="https://example.com/errors">
                <Bomb shouldThrow />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /send report/i }));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledOnce();
        });

        const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
        expect(url).toBe('https://example.com/errors');
        expect(init.method).toBe('POST');
        expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });

        const body = JSON.parse(init.body as string);
        expect(body.error.message).toBe('Test explosion');
        expect(body.error.stack).toBeTypeOf('string');
        expect(body.context.timestamp).toBeTypeOf('string');
        expect(body.context.url).toBeTypeOf('string');

        fetchSpy.mockRestore();
    });

    it('shows "Report sent" after a successful POST', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(null, { status: 200 })
        );

        render(
            <ErrorBoundary reportUrl="https://example.com/errors">
                <Bomb shouldThrow />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /send report/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /report sent/i })).toBeInTheDocument();
        });

        vi.restoreAllMocks();
    });

    it('shows "Failed — retry" after a failed POST', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

        render(
            <ErrorBoundary reportUrl="https://example.com/errors">
                <Bomb shouldThrow />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByRole('button', { name: /send report/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /failed/i })).toBeInTheDocument();
        });

        vi.restoreAllMocks();
    });
});

// ── 7. Debug panel ────────────────────────────────────────────────────────────

describe('ErrorBoundary — debug panel', () => {
    it('hides the debug panel when debug=false', () => {
        render(
            <ErrorBoundary debug={false}>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.queryByText('Debug information')).not.toBeInTheDocument();
    });

    it('shows the debug panel when debug=true', () => {
        render(
            <ErrorBoundary debug>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(screen.getByText('Debug information')).toBeInTheDocument();
    });

    it('expands the debug panel and shows context fields', () => {
        render(
            <ErrorBoundary debug>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        fireEvent.click(screen.getByText('Debug information'));
        expect(screen.getByText('URL')).toBeInTheDocument();
        expect(screen.getByText('Time')).toBeInTheDocument();
        expect(screen.getByText('Agent')).toBeInTheDocument();
    });
});

// ── 8. fullPage layout ────────────────────────────────────────────────────────

describe('ErrorBoundary — fullPage', () => {
    it('applies min-h-screen wrapper class when fullPage=true', () => {
        const { container } = render(
            <ErrorBoundary fullPage>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toMatch(/min-h-screen/);
    });

    it('applies my-4 wrapper class when fullPage is not set', () => {
        const { container } = render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toMatch(/my-4/);
    });
});

// ── 9. console.error is called ────────────────────────────────────────────────

describe('ErrorBoundary — side effects', () => {
    it('calls console.error with the error message when a child throws', () => {
        render(
            <ErrorBoundary>
                <Bomb shouldThrow />
            </ErrorBoundary>
        );
        expect(console.error).toHaveBeenCalled();
        const args = (console.error as ReturnType<typeof vi.fn>).mock.calls.flat().join(' ');
        expect(args).toMatch(/\[ErrorBoundary\]/);
    });
});
