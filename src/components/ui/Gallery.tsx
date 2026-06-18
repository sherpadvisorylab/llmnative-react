import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from "../../Theme";
import { useI18n, interpolate } from "../../I18n";
import { Wrapper } from "../ui/GridSystem";
import { RecordProps } from "../../providers/data/DataProvider";
import Pagination, { PaginationParams } from './Pagination';
import { UIProps } from '../';
import { cn } from '../../libs/cn';
import { BadgeOverlay, BadgeProps } from './Badge';
import { Order, type OrderConfig } from '../../libs/order';
import { RecordSelectionState, useRecordSelection } from './useRecordSelection';
import { useStableRecordKey } from './useStableRecordKey';

type ImageProps = React.ReactElement<HTMLImageElement>;
export type GalleryRecord = RecordProps & {
    img?: React.ReactElement<{
        className: string;
        style?: React.CSSProperties;
        onClick?: (e: React.MouseEvent<HTMLImageElement>) => void
    }>;
    thumbnail?: string;
    mimetype?: string;
    width?: number;
    height?: number;
    name?: string;
};

export type GalleryOverlayPosition =
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "middleLeft"
    | "middleRight";

export type GalleryOverlayFilter =
    | Partial<Record<keyof GalleryRecord, unknown>>
    | ((item: GalleryRecord, index: number) => boolean);

export type GalleryOverlayValue =
    | BadgeProps
    | ((item: GalleryRecord, index: number) => BadgeProps | null | undefined);

export type GalleryOverlay = {
    position: GalleryOverlayPosition;
    badge?: GalleryOverlayValue;
    render?: (item: GalleryRecord, index: number) => React.ReactNode;
    when?: GalleryOverlayFilter;
    className?: string;
};

type GalleryRenderedRecord =
    | { kind: "item"; item: GalleryRecord; index: number }
    | { kind: "group"; groupName: string; items: Array<{ item: GalleryRecord; index: number }> };

type GalleryVisualCacheEntry = {
    recordRef: GalleryRecord;
    overlaysRef: GalleryOverlay[] | undefined;
    onClickRef: GalleryProps["onRowClick"];
    rowIndex: number;
    image: ImageProps;
    overlays: React.ReactNode;
};

export type GallerySelectionState = RecordSelectionState<GalleryRecord>;
export type GallerySelectionChangeHandler = (selection: GallerySelectionState) => void;

export interface GalleryProps extends UIProps {
    records?: GalleryRecord[];
    header?: string | React.ReactNode;
    footer?: string | React.ReactNode;
    overlays?: GalleryOverlay[];
    onRowClick?: (record: GalleryRecord) => void;
    onSelectionChange?: GallerySelectionChangeHandler;
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    scrollToTopOnChange?: boolean;
    scrollBehavior?: ScrollBehavior;
    gap?: 0 | 1 | 2 | 3 | 4 | 5;
    columns?: 1 | 2 | 3 | 4 | 6;
    groupBy?: string | string[];
    selectedKeys?: string[];
    scrollClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    selectedClassName?: string;
}

const Gallery = ({
    records = undefined,
    header = undefined,
    footer = undefined,
    overlays = undefined,
    onRowClick = undefined,
    onSelectionChange = undefined,
    sortable = false,
    pagination = undefined,
    gap = undefined,
    columns = undefined,
    groupBy = undefined,
    selectedKeys = undefined,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
    headerClassName = undefined,
    scrollClassName = undefined,
    bodyClassName = undefined,
    footerClassName = undefined,
    selectedClassName = undefined
}: GalleryProps) => {
    const theme = useTheme("gallery");
    const dict = useI18n('gallery');
    const common = useI18n('common');
    const activeClass = selectedClassName || theme.Gallery.selectedClassName;
    const [paginationNavEl, setPaginationNavEl] = useState<HTMLElement | null>(null);
    const paginationNavRef = useCallback((node: HTMLDivElement | null) => {
        if (node) setPaginationNavEl(node);
    }, []);
    const paddingSize = gap ?? theme.Gallery.gap;
    const numCols = columns ?? theme.Gallery.rowCols;
    const spacingScale: Record<number, string> = {
        0: "0",
        1: "0.25rem",
        2: "0.5rem",
        3: "1rem",
        4: "1.5rem",
        5: "3rem",
    };
    const itemGap = spacingScale[paddingSize] ?? spacingScale[2];
    const overlayOffset = "0.75rem";
    const overlayLaneWidth = "calc(50% - 1rem)";
    const itemWidth = paddingSize === 0
        ? `${(100 / numCols).toFixed(4)}%`
        : `calc((100% - (${itemGap} * ${numCols - 1})) / ${numCols})`;
    const galleryRecords = records || [];
    const sortableOrder = useMemo(() => {
        if (!sortable) return undefined;
        if (typeof sortable === 'object') return sortable;

        const firstRecord = records?.[0];
        if (!firstRecord) return undefined;

        const firstSortableKey = Object.keys(firstRecord).find((key) => !key.startsWith('_'));
        if (!firstSortableKey) return undefined;

        return { field: firstSortableKey, dir: 'asc' as const };
    }, [records, typeof sortable === 'object' ? sortable?.dir : undefined, typeof sortable === 'object' ? sortable?.field : undefined, sortable]);
    const getStableRecordKey = useStableRecordKey<GalleryRecord>('item');
    const getRecordKey = useCallback((record: GalleryRecord, index?: number) => getStableRecordKey(record, index), [getStableRecordKey]);
    const {
        activeSelectedKeys,
        showSelection,
        updateSelection,
    } = useRecordSelection<GalleryRecord>({
        records: galleryRecords,
        selectedKeys,
        onSelectionChange,
        getRecordKey,
    });
    const visualCacheRef = useRef<Map<string, GalleryVisualCacheEntry>>(new Map());

    useEffect(() => {
        const validKeys = new Set(galleryRecords.map((record, index) => getRecordKey(record, index)));
        for (const recordKey of visualCacheRef.current.keys()) {
            if (!validKeys.has(recordKey)) {
                visualCacheRef.current.delete(recordKey);
            }
        }
    }, [galleryRecords, getRecordKey]);

    const handleClick = (e: React.MouseEvent<HTMLElement>, record: GalleryRecord) => {
        if (activeClass) {
            const activeClasses = activeClass.split(/\s+/).filter(Boolean);
            let currentElement = e.target as HTMLElement;

            while (currentElement && !currentElement.classList.contains("item")) {
                if (['A', 'BUTTON', 'INPUT', 'LABEL'].includes(currentElement.tagName)) {
                    return;
                }
                currentElement = currentElement.parentNode as HTMLElement;
            }

            if (!activeClasses.every((className) => currentElement.classList.contains(className))) {
                Array.from(currentElement.parentNode?.children || []).forEach(row => {
                    row.classList.remove(...activeClasses);
                });

                currentElement.classList.add(...activeClasses);
            }
        }

        onRowClick?.(record);
    };

    const toggleSelection = useCallback((record: GalleryRecord, index: number) => {
        const recordKey = getRecordKey(record, index);
        const nextKeys = activeSelectedKeys.includes(recordKey)
            ? activeSelectedKeys.filter((key) => key !== recordKey)
            : [...activeSelectedKeys, recordKey];
        updateSelection(nextKeys);
    }, [activeSelectedKeys, getRecordKey, updateSelection]);

    const getImage = (item: GalleryRecord, index: number): ImageProps => {
        const imgElement = item.img;

        if (imgElement && React.isValidElement(imgElement)) {
            return React.cloneElement(imgElement, {
                className: cn("block h-auto w-full max-w-full rounded-lg object-cover", imgElement.props.className),
                style: {
                    ...(imgElement.props.style || {}),
                    aspectRatio: imgElement.props.style?.aspectRatio || "16 / 11",
                    cursor: onRowClick ? "pointer" : "default",
                },
                onClick: onRowClick ? ((e: React.MouseEvent<HTMLImageElement>) => {
                    handleClick(e, item);
                    imgElement.props.onClick?.(e);
                }) : imgElement.props.onClick,
            }) as ImageProps;
        }

        return (
            <img
                className="block h-auto w-full max-w-full rounded-lg object-cover"
                src={
                    item.thumbnail
                        ? item.mimetype + item.thumbnail
                        : 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAgAAAAwAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
                }
                alt={item.name}
                width={item.width}
                height={item.height}
                style={{ aspectRatio: "16 / 11", cursor: onRowClick ? "pointer" : "default" }}
                onClick={onRowClick ? ((e: React.MouseEvent<HTMLImageElement>) => handleClick(e, item)) : undefined}
            />
        );
    };

    const renderOverlayContent = (content: BadgeProps): React.ReactNode => {
        if (React.isValidElement(content)) return content;

        return (
            <span className="inline-block max-w-full overflow-hidden text-ellipsis align-top">
                <BadgeOverlay badge={content} className="badge-overlay" />
            </span>
        );
    };

    const renderOverlay = (
        content: BadgeProps,
        style: React.CSSProperties,
        align: "left" | "right" = "left",
        className?: string
    ): React.ReactNode => (
        <div
            className={cn(
                "absolute z-10 overflow-hidden text-ellipsis whitespace-nowrap leading-none",
                align === "right" ? "text-right" : "text-left",
                className
            )}
            style={{
                width: overlayLaneWidth,
                maxWidth: overlayLaneWidth,
                pointerEvents: "none",
                ...style,
            }}
        >
            {renderOverlayContent(content)}
        </div>
    );

    const overlayPositionStyles: Record<GalleryOverlayPosition, { style: React.CSSProperties; align?: "left" | "right" }> = {
        topLeft: { style: { left: overlayOffset, top: overlayOffset } },
        topRight: { style: { right: overlayOffset, top: overlayOffset }, align: "right" },
        bottomLeft: { style: { bottom: overlayOffset, left: overlayOffset } },
        bottomRight: { style: { bottom: overlayOffset, right: overlayOffset }, align: "right" },
        middleLeft: { style: { left: overlayOffset, top: "50%", transform: "translateY(-50%)" } },
        middleRight: { style: { right: overlayOffset, top: "50%", transform: "translateY(-50%)" }, align: "right" },
    };

    const matchesOverlay = (overlay: GalleryOverlay, item: GalleryRecord, index: number): boolean => {
        if (!overlay.when) return true;
        if (typeof overlay.when === "function") return overlay.when(item, index);

        return Object.entries(overlay.when).every(([key, value]) => item[key] === value);
    };

    const getOverlayContent = (overlay: GalleryOverlay, item: GalleryRecord, index: number): BadgeProps | null | undefined => {
        if (overlay.render) return overlay.render(item, index);
        if (typeof overlay.badge === "function") return overlay.badge(item, index);
        return overlay.badge;
    };

    const renderItemOverlays = (item: GalleryRecord, index: number): React.ReactNode => {
        if (!overlays?.length) return null;

        return overlays.map((overlay, overlayIndex) => {
            if (!overlay.position || !matchesOverlay(overlay, item, index)) return null;

            const content = getOverlayContent(overlay, item, index);
            if (content === undefined || content === null || content === false) return null;

            const position = overlayPositionStyles[overlay.position];
            if (!position) return null;

            return (
                <React.Fragment key={`${overlay.position}-${overlayIndex}`}>
                    {renderOverlay(content, position.style, position.align, overlay.className)}
                </React.Fragment>
            );
        });
    };

    const getItemVisuals = useCallback((item: GalleryRecord, index: number) => {
        const recordKey = getRecordKey(item, index);
        const cached = visualCacheRef.current.get(recordKey);

        if (
            cached
            && cached.recordRef === item
            && cached.overlaysRef === overlays
            && cached.onClickRef === onRowClick
            && cached.rowIndex === index
        ) {
            return {
                image: cached.image,
                overlays: cached.overlays,
            };
        }

        const visuals = {
            image: getImage(item, index),
            overlays: renderItemOverlays(item, index),
        };

        visualCacheRef.current.set(recordKey, {
            recordRef: item,
            overlaysRef: overlays,
            onClickRef: onRowClick,
            rowIndex: index,
            image: visuals.image,
            overlays: visuals.overlays,
        });

        return visuals;
    }, [getRecordKey, onRowClick, overlays]);

    const renderItem = (index: number, item: GalleryRecord) => {
        const recordKey = getRecordKey(item, index);
        const isSelected = activeSelectedKeys.includes(recordKey);
        const activeClasses = activeClass?.split(/\s+/).filter(Boolean) || [];
        const visuals = getItemVisuals(item, index);

        return (
            <div
                key={recordKey}
                className={cn("item min-w-0", isSelected && activeClasses)}
                style={{
                    flex: `0 0 ${itemWidth}`,
                    maxWidth: itemWidth,
                }}
            >
                <div className="relative overflow-hidden rounded-lg">
                    {showSelection && (
                        <label className="absolute left-3 top-3 z-20 inline-flex items-center rounded bg-background/90 px-2 py-1 shadow-sm">
                            <input
                                type="checkbox"
                                aria-label={interpolate(dict.selectItem, { key: recordKey })}
                                checked={isSelected}
                                onChange={() => toggleSelection(item, index)}
                                onClick={(event) => event.stopPropagation()}
                            />
                        </label>
                    )}
                    {visuals.image}
                    {visuals.overlays}
                </div>
            </div>
        );
    };

    const getGroups = (sourceBody: GalleryRecord[], fields: string | string[]): GalleryRenderedRecord[] => {
        const groupFields = Array.isArray(fields) ? fields : [fields];
        const groupMap = new Map<string, Array<{ item: GalleryRecord; index: number }>>();

        sourceBody.forEach((item, index) => {
            const groupKey = groupFields.map((field) => String(item[field] ?? "")).join(" · ") || "-";
            if (!groupMap.has(groupKey)) groupMap.set(groupKey, []);
            groupMap.get(groupKey)!.push({ item, index });
        });

        return Array.from(groupMap.entries()).map(([groupName, items]) => ({
            kind: "group",
            groupName,
            items,
        }));
    };

    const renderedBody = useMemo(() => {
        if (!Array.isArray(records)) return undefined;

        const orderedBody = Order.records(records, sortableOrder) || [];

        return groupBy
            ? getGroups(orderedBody, groupBy)
            : orderedBody.map((item, index) => ({ kind: "item", item, index }) as GalleryRenderedRecord);
    }, [records, groupBy, sortableOrder]);

    if (renderedBody === undefined) {
        return <p className={"p-4"}><span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />{common.loading}</p>;
    } else if (renderedBody.length === 0) {
        return <p className={"p-4"}>{common.noDataFound}</p>;
    }

    return (
        <div className={cn("flex items-stretch gap-3", wrapperClassName || theme.Gallery.wrapperClassName)}>
            {before && <div className="gallery-before flex shrink-0 items-center self-stretch">{before}</div>}
            <Wrapper className={cn("min-w-0 flex-1 flex flex-col", className || theme.Gallery.className)}>
                {header && <div className={headerClassName || theme.Gallery.headerClassName}>{header}</div>}
                <Wrapper className={cn("min-w-0 flex-1", scrollClassName || theme.Gallery.scrollClassName)}>
                    <Pagination
                        records={renderedBody}
                        appendTo={paginationNavEl}
                        wrapperClassName="px-3 pt-4 pb-2"
                        {...(pagination || {})}
                    >
                        {(pageRecords) => (
                            <div className="p-3">
                                <div
                                    className={"flex flex-wrap text-center items-center row-cols-" + numCols + " " + (bodyClassName || theme.Gallery.bodyClassName)}
                                    style={{ gap: itemGap }}
                                >
                                    {pageRecords.map((record) => (
                                        record.kind === "group"
                                            ? (
                                                <section key={record.groupName} className="gallery-group rounded-lg border bg-card p-3 text-left">
                                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                                        {record.groupName}
                                                    </h3>
                                                    <div className={cn("flex flex-wrap items-center", "row-cols-" + numCols)} style={{ gap: itemGap }}>
                                                        {record.items.map(({ item, index }) => renderItem(index, item))}
                                                    </div>
                                                </section>
                                            )
                                            : renderItem(record.index, record.item)
                                    ))}
                                </div>
                            </div>
                        )}
                    </Pagination>
                </Wrapper>
                <div ref={paginationNavRef} className="mt-auto" />
                {footer && <div className={footerClassName || theme.Gallery.footerClassName}>{footer}</div>}
            </Wrapper>
            {after && <div className="gallery-after flex shrink-0 items-center self-stretch">{after}</div>}
        </div>);
};

export default Gallery;

