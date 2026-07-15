import { useMemo } from 'react';

/**
 * `'fill'` means "stretch to the height of whatever parent container you're placed in,
 * instead of a fixed pixel height" — the parent must actually provide a real height (e.g.
 * a flex column with `flex-1 min-h-0`) for this to have any effect; on an auto-height
 * parent it resolves to the same as not being there.
 */
export type EditorHeight = number | 'fill';

export interface EditorHeightOptions {
    minHeight?: EditorHeight;
    maxHeight?: number;
    paddingOffset?: number;
}

export interface EditorHeightResult {
    /** True when `minHeight === 'fill'` — the editor stretches to its parent's height with
     * its own internal scroll, instead of using a fixed pixel min-height. */
    fill: boolean;
    adjustedMinHeight: number;
    wrapperStyle: React.CSSProperties;
    resolvedMinHeight: number;
    resolvedMaxHeight: number | undefined;
}

export function useEditorHeight({ minHeight = 200, maxHeight = 600, paddingOffset = 0 }: EditorHeightOptions): EditorHeightResult {
    return useMemo(() => {
        const fill = minHeight === 'fill';
        const numericMinHeight = fill ? 0 : minHeight;
        const adjustedMinHeight = numericMinHeight - paddingOffset;
        return {
            fill,
            adjustedMinHeight,
            wrapperStyle: fill
                ? { height: '100%', overflowY: 'auto' }
                : { maxHeight, overflowY: maxHeight ? 'auto' : undefined } as React.CSSProperties,
            resolvedMinHeight: numericMinHeight,
            resolvedMaxHeight: fill ? undefined : maxHeight,
        };
    }, [minHeight, maxHeight, paddingOffset]);
}
