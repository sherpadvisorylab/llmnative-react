import React from "react";
import { useTheme } from "../../Theme";
import type { UIProps } from '../types';
import { cn } from '../../libs/cn';

// An icon drawn from a value, as GitHub draws one for an account without a picture: a 5×5 grid,
// symmetric around its middle column, cells and hue from a hash of the value. The same value always
// gives the same icon; nothing is fetched or stored.

interface IdenticonProps extends UIProps {
    /** What the icon stands for: a repository, a tenant, a user name… */
    value: string;
    /** Width and height in pixels. */
    size?: number;
    /** Accessible name. Without it the icon is decorative (`aria-hidden`). */
    title?: string;
}

/** FNV-1a, 32 bits: a stable hash of the value. */
function hash(value: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < value.length; i++) {
        h ^= value.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}

/** A small generator seeded by the hash (mulberry32): enough bits for the cells and the hue. */
function generator(seed: number): () => number {
    let state = seed;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** The filled cells (row, column) and the hue of a value. Exported for tests. */
export function identiconPattern(value: string): { cells: Array<[number, number]>; hue: number } {
    const next = generator(hash(value));
    const cells: Array<[number, number]> = [];
    // Three columns are drawn, the first two mirrored: 15 coin flips.
    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 3; column++) {
            if (next() < 0.5) continue;
            cells.push([row, column]);
            if (column < 2) cells.push([row, 4 - column]);
        }
    }
    // Never an empty icon: the middle cell at least.
    if (!cells.length) cells.push([2, 2]);
    return { cells, hue: Math.floor(next() * 360) };
}

const Identicon = ({
    value,
    size             = 40,
    title            = undefined,
    before           = undefined,
    after            = undefined,
    wrapperClassName = undefined,
    className        = undefined,
}: IdenticonProps) => {
    const theme = useTheme("identicon");
    const { cells, hue } = identiconPattern(value);
    // A mid tone reads on light and dark surfaces alike.
    const fill = `hsl(${hue} 55% 52%)`;

    const icon = (
        <svg
            width={size}
            height={size}
            viewBox="-0.5 -0.5 6 6"
            shapeRendering="crispEdges"
            className={cn("shrink-0", className || theme.Identicon?.className || "rounded-md bg-muted")}
            {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
        >
            {title && <title>{title}</title>}
            {cells.map(([row, column]) => <rect key={`${row}-${column}`} x={column} y={row} width={1} height={1} fill={fill} />)}
        </svg>
    );

    if (!before && !after) return icon;
    return (
        <div className={cn("flex items-center gap-3", wrapperClassName || theme.Identicon?.wrapperClassName)}>
            {before && <div className="shrink-0 self-center">{before}</div>}
            {icon}
            {after && <div className="min-w-0 self-center">{after}</div>}
        </div>
    );
};

export default Identicon;
