import React, { useMemo, useState, useEffect } from 'react';
import { UIProps, Wrapper } from "../index";
import { createPortal } from 'react-dom';
import { useTheme } from '../../Theme';
import { useI18n } from '../../I18n';
import { cn } from '../../libs/cn';

/**
 * Pagination configuration shared between `<Pagination>` and `<Grid pagination={...}>`.
 * All fields are optional — omit `limit` to disable pagination entirely.
 */
export type PaginationParams = {
    /** Initial page (1-based). Defaults to `1`. */
    page?: number;
    /** Records per page. Omit to show all records unpaginated. */
    limit?: number;
    /** Maximum page-number buttons to render before collapsing to ellipsis. */
    maxPageButtons?: number;
    /** Scroll the page back to the top on page change. */
    scrollToTopOnChange?: boolean;
    /** `scrollIntoView` scroll behavior when `scrollToTopOnChange` is enabled. */
    scrollBehavior?: ScrollBehavior;
    /** Horizontal alignment of the page-button bar: `"start"`, `"center"`, or `"end"`. */
    align?: "start" | "center" | "end";
    /** Stick the pagination bar to the bottom of the viewport while scrolling. */
    sticky?: boolean;
};

interface PaginationProps<T> extends UIProps, PaginationParams {
    records: T[];
    /** Render function receiving paginated records and current page offset. */
    children: (pageRecords: T[], pageOffset: number) => React.ReactNode;
    /** Portal target element — renders pagination bar outside the normal flow. */
    appendTo?: HTMLElement | null;
}

const Pagination = <T,>({
    records,
    children,
    limit = undefined,
    page = undefined,
    maxPageButtons = undefined,
    appendTo = undefined,
    before = undefined,
    after = undefined,
    className = undefined,
    wrapperClassName = undefined,
    scrollToTopOnChange = undefined,
    scrollBehavior = undefined,
    align = undefined,
    sticky = undefined
}: PaginationProps<T>) => {
    const theme = useTheme("pagination");
    const dict = useI18n('common');

    const [currentPage, setCurrentPage] = useState(page || 1);

    // ✅ sync se page cambia dall'esterno
   /* useEffect(() => {
        if (page && page !== currentPage) {
            setCurrentPage(page);
        }
    }, [page]);*/

    const pageLimit = limit || records.length;
    const totalPages = Math.ceil(records.length / pageLimit);

    const pageOffset = (currentPage - 1) * pageLimit;
    const end = pageOffset + pageLimit;

    const pageRecords = useMemo(
        () => records.slice(pageOffset, end),
        [records, pageOffset, end]
    );

    const go = (p: number) => {
        if (p >= 1 && p <= totalPages) {
            setCurrentPage(p);
        }
    };

    useEffect(() => {
        if (!(scrollToTopOnChange || theme.Pagination.scrollToTop)) return;

        window.scrollTo({
            top: 0,
            behavior: scrollBehavior || theme.Pagination.scrollBehavior
        });
    }, [currentPage, scrollToTopOnChange, scrollBehavior]);

    const range = useMemo(() => {
        const max = Math.min(maxPageButtons || theme.Pagination.maxItems, totalPages);

        let s = Math.max(1, currentPage - Math.floor(max / 2));
        let e = s + max - 1;

        if (e > totalPages) {
            e = totalPages;
            s = Math.max(1, e - max + 1);
        }

        return Array.from({ length: e - s + 1 }, (_, i) => s + i);
    }, [currentPage, maxPageButtons, totalPages]);

    const disabledPrev = currentPage === 1 ? 'disabled' : '';
    const disabledNext = currentPage === totalPages ? 'disabled' : '';
    const resolvedAlign = align || theme.Pagination.align;
    const alignmentClass = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
    }[resolvedAlign as "start" | "center" | "end"] || "justify-end";

    const nav = (
        <Wrapper className={(wrapperClassName || theme.Pagination.wrapperClassName) + (sticky || theme.Pagination.sticky ? ` ${theme.Pagination.stickyClassName}` : '')}
            style={sticky || theme.Pagination.sticky ? {backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.1)"} : {}}
        >
            {before}

            {records.length > pageLimit && (
                <nav aria-label={dict.pageNavigation} className={`${className || theme.Pagination.className} flex w-full ${alignmentClass}`}>
                    <ul className="flex items-center gap-1">

                        <li className="mr-2">
                            <button
                                type="button"
                                onClick={() => go(1)}
                                disabled={disabledPrev === 'disabled'}
                                className={cn(
                                    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border bg-background px-3 text-sm transition-colors",
                                    disabledPrev === 'disabled'
                                        ? "pointer-events-none opacity-40"
                                        : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <span>&laquo;</span>
                            </button>
                        </li>

                        <li>
                            <button
                                type="button"
                                disabled={disabledPrev === 'disabled'}
                                className={cn(
                                    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border bg-background px-3 text-sm transition-colors",
                                    disabledPrev === 'disabled'
                                        ? "pointer-events-none opacity-40"
                                        : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                )}
                                onClick={() => go(currentPage - 1)}
                            >
                                <span>&lsaquo;</span>
                            </button>
                        </li>

                        {range.map((pageNum) => (
                            <li key={pageNum}>
                                <button
                                    type="button"
                                    onClick={() => go(pageNum)}
                                    className={cn(
                                        "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border bg-background px-3 text-sm transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                        currentPage === pageNum && "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                                    )}
                                >
                                    {pageNum}
                                </button>
                            </li>
                        ))}

                        <li className="ml-2">
                            <button
                                type="button"
                                disabled={disabledNext === 'disabled'}
                                className={cn(
                                    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border bg-background px-3 text-sm transition-colors",
                                    disabledNext === 'disabled'
                                        ? "pointer-events-none opacity-40"
                                        : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                )}
                                onClick={() => go(currentPage + 1)}
                            >
                                <span>&rsaquo;</span>
                            </button>
                        </li>

                        <li>
                            <button
                                type="button"
                                onClick={() => go(totalPages)}
                                disabled={disabledNext === 'disabled'}
                                className={cn(
                                    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border bg-background px-3 text-sm transition-colors",
                                    disabledNext === 'disabled'
                                        ? "pointer-events-none opacity-40"
                                        : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <span>&raquo;</span>
                            </button>
                        </li>

                    </ul>
                </nav>
            )}

            {after}
        </Wrapper>
    );

    return (
        <>
            {children(pageRecords, pageOffset)}
            {appendTo
                ? createPortal(nav, appendTo)
                : appendTo === undefined && nav}
        </>
    );
};

export default Pagination;
