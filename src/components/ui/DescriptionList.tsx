import React from "react";
import { useTheme } from "../../Theme";
import { cn } from "../../libs/cn";

/** One label → value pair of a `<DescriptionList>`. */
export interface DescriptionListItem {
    /** Stable React key; defaults to the label when it is a string, otherwise the index. */
    key?: string;
    label: React.ReactNode;
    /** `null`, `undefined` and `''` render as the list's `emptyValue`. */
    value?: React.ReactNode;
    /** Tooltip for the value; defaults to the value itself when it is a string and `truncate` is on. */
    title?: string;
}

export type DescriptionListLayout = "horizontal" | "stacked";
export type DescriptionListColumns = 1 | 2 | 3 | 4 | 5 | 6;

export interface DescriptionListProps {
    items: readonly DescriptionListItem[];
    /** `"horizontal"` (default): label column on the left, stacked on small screens.
     *  `"stacked"`: label above its value, laid out in `columns`. */
    layout?: DescriptionListLayout;
    /** Stacked layout only: number of columns from the `lg` breakpoint (1–6, default 1). */
    columns?: DescriptionListColumns;
    /** Horizontal layout only: width of the label column (any CSS length, default `"12rem"`). */
    labelWidth?: string;
    /** Shown for empty values (default `"—"`). */
    emptyValue?: React.ReactNode;
    /** Keep each value on one line with an ellipsis. */
    truncate?: boolean;
    wrapperClassName?: string;
    className?: string;
    itemClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
}

// Static class names so Tailwind generates them at build time.
const STACKED_COLUMNS: Record<DescriptionListColumns, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
};

const isEmpty = (value: React.ReactNode) => value === null || value === undefined || value === "";

/**
 * Read-only label → value pairs (profile data, a record's facts, summaries), rendered as a
 * semantic `<dl>`. Use it instead of hand-written `<dl>`/`<dt>`/`<dd>` markup; for editable data use
 * `<Form>` fields, for many records use `<Table>` or `<Grid>`.
 */
export default function DescriptionList({
    items,
    layout = "horizontal",
    columns = 1,
    labelWidth = "12rem",
    emptyValue = "—",
    truncate = false,
    wrapperClassName = undefined,
    className = undefined,
    itemClassName = undefined,
    labelClassName = undefined,
    valueClassName = undefined,
}: DescriptionListProps) {
    const theme = useTheme("descriptionList").DescriptionList;
    const horizontal = layout === "horizontal";
    const list = (
        <dl
            className={cn(
                "grid",
                horizontal ? "gap-y-3" : cn("gap-x-8 gap-y-4", STACKED_COLUMNS[columns]),
                className || theme?.className,
            )}
            data-layout={layout}
        >
            {items.map((item, index) => {
                const empty = isEmpty(item.value);
                const title = item.title ?? (truncate && typeof item.value === "string" ? item.value : undefined);
                const key = item.key ?? (typeof item.label === "string" ? item.label : String(index));
                return (
                    <div
                        key={key}
                        className={cn(
                            "min-w-0",
                            horizontal && "grid gap-1 sm:grid-cols-[var(--rf-dl-label-width)_minmax(0,1fr)] sm:gap-4",
                            itemClassName || theme?.itemClassName,
                        )}
                        style={horizontal ? ({ "--rf-dl-label-width": labelWidth } as React.CSSProperties) : undefined}
                    >
                        <dt
                            className={cn(
                                horizontal
                                    ? "text-sm text-muted-foreground"
                                    : "text-[10px] font-medium uppercase tracking-widest text-muted-foreground",
                                labelClassName || theme?.labelClassName,
                            )}
                        >
                            {item.label}
                        </dt>
                        <dd
                            className={cn(
                                "m-0 text-sm font-medium",
                                empty ? "text-muted-foreground" : "text-foreground",
                                !horizontal && "mt-1",
                                truncate ? "truncate" : "break-words",
                                valueClassName || theme?.valueClassName,
                            )}
                            title={title}
                        >
                            {empty ? emptyValue : item.value}
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
    return wrapperClassName || theme?.wrapperClassName
        ? <div className={cn(wrapperClassName || theme?.wrapperClassName)}>{list}</div>
        : list;
}
