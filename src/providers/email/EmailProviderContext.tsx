import React, { createContext, useContext, useMemo } from 'react';
import type { EmailProviderAdapter } from './EmailProvider';

type EmailProviderContextValue = {
    registry: Record<string, EmailProviderAdapter>;
    defaultKey: string;
};

const EmailProviderContext = createContext<EmailProviderContextValue | null>(null);

export const EmailProvider = ({
    registry,
    defaultKey,
    children,
}: EmailProviderContextValue & { children: React.ReactNode }) => {
    const value = useMemo(() => ({ registry, defaultKey }), [registry, defaultKey]);
    return <EmailProviderContext.Provider value={value}>{children}</EmailProviderContext.Provider>;
};

export const useEmailProvider = (name?: string): EmailProviderAdapter | null => {
    const ctx = useContext(EmailProviderContext);
    if (!ctx) return null;
    const key = name ?? ctx.defaultKey;
    return ctx.registry[key] ?? null;
};

export default EmailProviderContext;
