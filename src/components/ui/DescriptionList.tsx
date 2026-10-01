import React from "react";
import { useTheme } from "../../Theme";
import type { UIProps } from "../types";
import { Wrapper } from "./GridSystem";
import { cn } from "../../libs/cn";

/** Layout of a `DescriptionList`: label beside the value or above it. */
export type DescriptionListLayout = 'horizontal' | 'stacked';

/** A single read-only label → value pair. */
export interface DescriptionListItem {
    /** Pair label, rendered inside a `<dt>`. */
    label: React.ReactNode;
    /** Pair value, rendered inside a `<dd>`. Empty values fall back to `emptyValue`. */
    value?: React.ReactNode;
}

export interface DescriptionListProps extends UIProps {
    /** Pairs to render, one `<dt>`/`<dd>` per item. */
    items: DescriptionListItem[];
    /** `"horizontal"` (default) puts the label beside the value; `"stacked"` puts it above. */
    layout?: DescriptionListLayout;
    /** Responsive column count for `layout="stacked"` (1–6). Ignored in `horizontal`. */
    columns?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Fixed label column width for `layout="horizontal"` (any CSS length, e.g. `"12rem"`). */
    labelWidth?: string;
    /** Content rendered when a value is `null`, `undefined` or `''` (default `'—'`). */
    emptyValue?: React.ReactNode;
    /** Keep values on a single line with an ellipsis; sets a native `title` on text values. */
    truncate?: boolean;
}

const COLUMN_CLASS: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
};

const isEmptyValue = (value: React.ReactNode): boolean =>
    value === null || value === undefined || value === '';

const isTextValue = (value: React.ReactNode): value is string | number =>
    typeof value === 'string' || typeof value === 'number';

const DescriptionList = ({
    items,
    layout = 'horizontal',
    columns = 1,
    labelWidth = undefined,
    emptyValue = '—',
    truncate = false,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
}: DescriptionListProps) => {
    const theme = useTheme('descriptionList');
    const listTheme = theme.DescriptionList;
    const isStacked = layout === 'stacked';

    const listClassName = cn(
        isStacked
            ? cn('grid gap-x-6 gap-y-4', COLUMN_CLASS[columns] ?? COLUMN_CLASS[1])
            : 'flex flex-col gap-3',
        listTheme.className,
        className,
    );

    const itemStyle = !isStacked && labelWidth
        ? ({ '--rf-description-list-label-width': labelWidth } as React.CSSProperties)
        : undefined;

    return (
        <Wrapper className={cn(listTheme.wrapperClassName, wrapperClassName)}>
            {before}
            <dl className={listClassName}>
                {items.map((item, index) => {
                    const displayValue = isEmptyValue(item.value) ? emptyValue : item.value;
                    const title = truncate && isTextValue(displayValue) ? String(displayValue) : undefined;

                    return (
                        <div
                            key={index}
                            className={cn(
                                isStacked
                                    ? 'flex min-w-0 flex-col gap-0.5'
                                    : 'grid min-w-0 grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[var(--rf-description-list-label-width,10rem)_minmax(0,1fr)]',
                                listTheme.itemClassName,
                            )}
                            style={itemStyle}
                        >
                            <dt className={cn('text-sm font-medium text-muted-foreground', listTheme.labelClassName)}>
                                {item.label}
                            </dt>
                            <dd
                                className={cn('min-w-0 text-sm text-foreground', truncate && 'truncate', listTheme.valueClassName)}
                                title={title}
                            >
                                {displayValue}
                            </dd>
                        </div>
                    );
                })}
            </dl>
            {after}
        </Wrapper>
    );
};

export default DescriptionList;
