import React, { createContext, useContext } from 'react';
import type { AIProviderAdapter } from './AIProvider';

type AIProviderContextValue = {
    registry: Record<string, AIProviderAdapter>;
    defaultKey: string;
};

const AIProviderContext = createContext<AIProviderContextValue | null>(null);

export const AIProvider = ({
    registry,
    defaultKey,
    children,
}: AIProviderContextValue & { children: React.ReactNode }) => (
    <AIProviderContext.Provider value={{ registry, defaultKey }}>
        {children}
    </AIProviderContext.Provider>
);

export const useAIProvider = (name?: string): AIProviderAdapter | null => {
    const ctx = useContext(AIProviderContext);
    if (!ctx) return null;
    const key = name ?? ctx.defaultKey;
    return ctx.registry[key] ?? null;
};

export const useAIProviderRegistry = (): AIProviderContextValue | null => useContext(AIProviderContext);

export default AIProviderContext;
