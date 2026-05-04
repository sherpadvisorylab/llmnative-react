import React, { createContext, useContext } from 'react';
import { EmailProvider } from './EmailProvider';

type EmailProviderRegistry = {
    registry: Record<string, EmailProvider>;
    defaultKey: string;
};

const EmailProviderContext = createContext<EmailProviderRegistry | null>(null);

export const EmailProviderProvider = ({
    registry,
    defaultKey,
    children,
}: EmailProviderRegistry & { children: React.ReactNode }) => (
    <EmailProviderContext.Provider value={{ registry, defaultKey }}>
        {children}
    </EmailProviderContext.Provider>
);

export const useEmailProvider = (name?: string): EmailProvider | null => {
    const ctx = useContext(EmailProviderContext);
    if (!ctx) return null;
    const key = name ?? ctx.defaultKey;
    return ctx.registry[key] ?? null;
};

export default EmailProviderContext;
