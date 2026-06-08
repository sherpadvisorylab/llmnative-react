import React from 'react';

// ── Icons (inline SVG - class component cannot use hooks) ─────────────────────

const IconAlert = ({ size = 28 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const IconSend = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
);

const IconBug = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 2 1.88 1.88M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/>
        <path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/>
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
        <path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
    </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ErrorBoundaryProps {
    children: React.ReactNode;
    /** Custom fallback. Function receives (error, reset). */
    fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
    /** POST endpoint for error reports. If set, a "Send report" button appears. */
    reportUrl?: string;
    /** Show full debug panel (stack trace, component tree, browser context). Auto-enabled in DEV builds. */
    debug?: boolean;
    /** Render as a full-page error screen (min-h-screen, centered). Use at the app root level. */
    fullPage?: boolean;
}

interface State {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    detailsOpen: boolean;
    debugOpen: boolean;
    copied: boolean;
    reportState: 'idle' | 'sending' | 'sent' | 'failed';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const buildReportPayload = (error: Error, errorInfo: React.ErrorInfo | null) => ({
    error: {
        message: error.message,
        stack: error.stack ?? '',
    },
    componentStack: errorInfo?.componentStack ?? '',
    context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString(),
    },
});

const buildDebugText = (error: Error, errorInfo: React.ErrorInfo | null): string => {
    const payload = buildReportPayload(error, errorInfo);
    return [
        `Error: ${payload.error.message}`,
        '',
        '--- Stack Trace ---',
        payload.error.stack,
        '',
        '--- Component Stack ---',
        payload.componentStack,
        '',
        '--- Context ---',
        `URL:       ${payload.context.url}`,
        `Timestamp: ${payload.context.timestamp}`,
        `Agent:     ${payload.context.userAgent}`,
    ].join('\n');
};

// ── Component ─────────────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null,
            detailsOpen: false,
            debugOpen: false,
            copied: false,
            reportState: 'idle',
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        this.setState({ errorInfo: info });
        console.error('[ErrorBoundary]', error.message, info.componentStack);
    }

    reset = () => {
        window.location.reload();
    };

    copy = () => {
        const { error, errorInfo } = this.state;
        if (!error) return;
        navigator.clipboard?.writeText(buildDebugText(error, errorInfo)).then(() => {
            this.setState({ copied: true });
            setTimeout(() => this.setState({ copied: false }), 2000);
        });
    };

    sendReport = () => {
        const { error, errorInfo } = this.state;
        const { reportUrl } = this.props;
        if (!error || !reportUrl) return;
        this.setState({ reportState: 'sending' });
        fetch(reportUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildReportPayload(error, errorInfo)),
        })
            .then(r => this.setState({ reportState: r.ok ? 'sent' : 'failed' }))
            .catch(() => this.setState({ reportState: 'failed' }));
    };

    render() {
        const { error, errorInfo, detailsOpen, debugOpen, copied, reportState } = this.state;
        if (!error) return this.props.children;

        const { fallback, reportUrl, fullPage } = this.props;
        const isDebug = this.props.debug ?? (import.meta as { env?: { DEV?: boolean } }).env?.DEV ?? false;

        if (typeof fallback === 'function') {
            return (fallback as (e: Error, r: () => void) => React.ReactNode)(error, this.reset);
        }
        if (fallback != null) return fallback;

        const stackLines = (error.stack ?? error.message)
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean);

        const componentStackLines = (errorInfo?.componentStack ?? '')
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean);

        const wrapClass = fullPage
            ? 'flex min-h-screen flex-col items-center justify-center bg-background p-8'
            : 'flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8';

        return (
            <div className={wrapClass}>
            <div className="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-destructive/25 bg-destructive/5 p-6">

                {/* ── Header ───────────────────────────────────────── */}
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-destructive">
                        <IconAlert size={22} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">This page ran into a problem</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            An unexpected error occurred while rendering this content.
                        </p>
                    </div>
                </div>

                {/* ── Technical details (always available, collapsed) ── */}
                <div className="rounded-lg border bg-background/60">
                    <button
                        onClick={() => this.setState(s => ({ detailsOpen: !s.detailsOpen }))}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <IconChevron open={detailsOpen} />
                        Technical details
                        <span className="ml-auto truncate max-w-[280px] font-mono text-[11px] text-muted-foreground/70">
                            {error.message}
                        </span>
                    </button>
                    {detailsOpen && (
                        <div className="border-t">
                            <pre className="max-h-48 overflow-y-auto px-3 py-3 text-[11px] leading-relaxed text-muted-foreground font-mono whitespace-pre-wrap break-all">
                                {stackLines.join('\n')}
                            </pre>
                        </div>
                    )}
                </div>

                {/* ── Debug panel (debug mode only) ────────────────── */}
                {isDebug && (
                    <div className="rounded-lg border border-amber-200/60 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <button
                            onClick={() => this.setState(s => ({ debugOpen: !s.debugOpen }))}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-amber-700 dark:text-amber-400 transition-colors hover:opacity-80"
                        >
                            <IconBug />
                            <IconChevron open={debugOpen} />
                            Debug information
                            <span className="ml-auto text-[10px] font-normal opacity-60">DEV</span>
                        </button>
                        {debugOpen && (
                            <div className="border-t border-amber-200/60 dark:border-amber-900/40 px-3 py-3 space-y-3">
                                {/* Context */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700/70 dark:text-amber-400/70">Context</p>
                                    <dl className="grid grid-cols-[5rem_1fr] gap-x-2 gap-y-0.5 text-[11px] font-mono">
                                        <dt className="text-muted-foreground">URL</dt>
                                        <dd className="truncate text-foreground">{typeof window !== 'undefined' ? window.location.href : '-'}</dd>
                                        <dt className="text-muted-foreground">Time</dt>
                                        <dd className="text-foreground">{new Date().toISOString()}</dd>
                                        <dt className="text-muted-foreground">Agent</dt>
                                        <dd className="truncate text-foreground opacity-70">{typeof navigator !== 'undefined' ? navigator.userAgent : '-'}</dd>
                                    </dl>
                                </div>
                                {/* Component stack */}
                                {componentStackLines.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700/70 dark:text-amber-400/70">Component tree</p>
                                        <pre className="max-h-36 overflow-y-auto text-[11px] font-mono leading-relaxed text-foreground/80 whitespace-pre-wrap">
                                            {componentStackLines.join('\n')}
                                        </pre>
                                    </div>
                                )}
                                {/* Copy */}
                                <button
                                    onClick={this.copy}
                                    className="flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-accent"
                                >
                                    <IconCopy />
                                    {copied ? 'Copied!' : 'Copy debug info'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Actions ──────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={this.reset}
                        className="rounded-md border bg-background px-4 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                    >
                        Try again
                    </button>
                    <a
                        href="/"
                        className="rounded-md bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
                    >
                        Go to home
                    </a>
                    {reportUrl && (
                        <button
                            onClick={this.sendReport}
                            disabled={reportState === 'sending' || reportState === 'sent'}
                            className="ml-auto flex items-center gap-1.5 rounded-md border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
                        >
                            <IconSend />
                            {reportState === 'idle' && 'Send report'}
                            {reportState === 'sending' && 'Sending…'}
                            {reportState === 'sent' && 'Report sent ✓'}
                            {reportState === 'failed' && 'Failed - retry'}
                        </button>
                    )}
                </div>
            </div>
            </div>
        );
    }
}

export default ErrorBoundary;
