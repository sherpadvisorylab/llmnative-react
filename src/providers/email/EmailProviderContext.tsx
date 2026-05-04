import React, { createContext, useContext } from 'react';
import { EmailProvider } from './EmailProvider';

const EmailProviderContext = createContext<EmailProvider | null>(null);

export const EmailProviderProvider = ({
    provider,
    children,
}: {
    provider: EmailProvider;
    children: React.ReactNode;
}) => (
    <EmailProviderContext.Provider value={provider}>
        {children}
    </EmailProviderContext.Provider>
);

export const useEmailProvider = (): EmailProvider | null => {
    return useContext(EmailProviderContext);
};
