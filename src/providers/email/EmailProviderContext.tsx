import React, { createContext, useContext, useMemo } from 'react';
import type { EmailSendAdapter } from './EmailSend';
import type { EmailReadAdapter } from './EmailRead';

// The registries of the categories `emailSend` and `emailRead` (CR-130), as <App> builds them.

type Registry<T> = { registry: Record<string, T>; defaultKey: string };

const EmailSendContext = createContext<Registry<EmailSendAdapter> | null>(null);
const EmailReadContext = createContext<Registry<EmailReadAdapter> | null>(null);

export const EmailSendProvider = ({ registry, defaultKey, children }: Registry<EmailSendAdapter> & { children: React.ReactNode }) => {
    const value = useMemo(() => ({ registry, defaultKey }), [registry, defaultKey]);
    return <EmailSendContext.Provider value={value}>{children}</EmailSendContext.Provider>;
};

export const EmailReadProvider = ({ registry, defaultKey, children }: Registry<EmailReadAdapter> & { children: React.ReactNode }) => {
    const value = useMemo(() => ({ registry, defaultKey }), [registry, defaultKey]);
    return <EmailReadContext.Provider value={value}>{children}</EmailReadContext.Provider>;
};

/** The adapter that sends (the default one, or `name`), or `null` when none is registered. */
export const useEmailSendProvider = (name?: string): EmailSendAdapter | null => {
    const ctx = useContext(EmailSendContext);
    return ctx ? ctx.registry[name ?? ctx.defaultKey] ?? null : null;
};

/** The adapter that reads (the default one, or `name`), or `null` when none is registered. */
export const useEmailReadProvider = (name?: string): EmailReadAdapter | null => {
    const ctx = useContext(EmailReadContext);
    return ctx ? ctx.registry[name ?? ctx.defaultKey] ?? null : null;
};
