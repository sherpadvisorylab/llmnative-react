import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { PlaygroundConfig } from '../types/playground';

interface PlaygroundContextValue {
    config: PlaygroundConfig | null;
    title: string;
    open: boolean;
    openPlayground: () => void;
    closePlayground: () => void;
    registerPlayground: (config: PlaygroundConfig, title: string) => void;
    clearPlayground: () => void;
}

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
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

/** Call this in any component page to register it with the topbar playground button. */
export function usePlayground(config: PlaygroundConfig, title: string) {
    const { registerPlayground, clearPlayground } = usePlaygroundContext();

    useEffect(() => {
        registerPlayground(config, title);
        return () => clearPlayground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
