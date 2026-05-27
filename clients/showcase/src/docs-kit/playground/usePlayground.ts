import React from 'react';
import type { PlaygroundConfig } from './playground.types';
import { usePlaygroundContext } from './PlaygroundProvider';

export function usePlayground(config: PlaygroundConfig, title: string) {
    const { registerPlayground, clearPlayground } = usePlaygroundContext();

    React.useEffect(() => {
        registerPlayground(config, title);
        return () => clearPlayground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
