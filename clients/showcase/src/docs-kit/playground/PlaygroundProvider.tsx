import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PlaygroundConfig, PlaygroundEnvironment } from './playground.types';

interface PlaygroundContextValue {
    config: PlaygroundConfig | null;
    title: string;
    open: boolean;
    environment: PlaygroundEnvironment;
    openPlayground: () => void;
    closePlayground: () => void;
    registerPlayground: (config: PlaygroundConfig, title: string) => void;
    clearPlayground: () => void;
}

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

export function PlaygroundProvider({
    children,
    environment,
}: {
    children: React.ReactNode;
    environment: PlaygroundEnvironment;
}) {
    const [config, setConfig] = useState<PlaygroundConfig | null>(null);
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);

    const registerPlayground = useCallback((cfg: PlaygroundConfig, t: string) => {
        setConfig(cfg);
        setTitle(t);
        setOpen(false);
    }, []);

    const clearPlayground = useCallback(() => {
        setConfig(null);
        setTitle('');
        setOpen(false);
    }, []);

    return (
        <PlaygroundContext.Provider value={{
            config,
            title,
            open,
            environment,
            openPlayground: () => setOpen(true),
            closePlayground: () => setOpen(false),
            registerPlayground,
            clearPlayground,
        }}>
            {children}
        </PlaygroundContext.Provider>
    );
}

export function usePlaygroundContext(): PlaygroundContextValue {
    const ctx = useContext(PlaygroundContext);
    if (!ctx) throw new Error('usePlaygroundContext must be used inside <PlaygroundProvider>');
    return ctx;
}
