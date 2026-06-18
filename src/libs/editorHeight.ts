import { useMemo } from 'react';

export interface EditorHeightOptions {
    minHeight?: number;
    maxHeight?: number;
    paddingOffset?: number;
}

export interface EditorHeightResult {
    adjustedMinHeight: number;
    wrapperStyle: React.CSSProperties;
    resolvedMinHeight: number;
    resolvedMaxHeight: number | undefined;
}

export function useEditorHeight({ minHeight = 200, maxHeight = 600, paddingOffset = 0 }: EditorHeightOptions): EditorHeightResult {
    return useMemo(() => {
        const adjustedMinHeight = minHeight - paddingOffset;
        return {
            adjustedMinHeight,
            wrapperStyle: {
                maxHeight,
                overflowY: maxHeight ? 'auto' : undefined,
            } as React.CSSProperties,
            resolvedMinHeight: minHeight,
            resolvedMaxHeight: maxHeight,
        };
    }, [minHeight, maxHeight, paddingOffset]);
}
