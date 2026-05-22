import React, { useCallback, useMemo, useState } from 'react';
import { useTheme } from "../../Theme";
import { Wrapper } from "../ui/GridSystem";
import { converter } from "../../libs/converter";
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
    | { kind: "item"; image: ImageProps; item: GalleryRecord; index: number }
    | { kind: "group"; element: React.ReactElement };

export type GallerySelectionState = RecordSelectionState<GalleryRecord>;

interface GalleryProps extends UIProps {
    body?: GalleryRecord[];
    Header?: string | React.ReactNode;
    Footer?: string | React.ReactNode;
    overlays?: GalleryOverlay[];
    onClick?: (record: GalleryRecord) => void;
    onSelectionChange?: (selection: GallerySelectionState) => void;
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    scrollToTopOnChange?: boolean;
    scrollBehavior?: ScrollBehavior;
    gutterSize?: 0 | 1 | 2 | 3 | 4 | 5;
    rowCols?: 1 | 2 | 3 | 4 | 6;
    groupBy?: string | string[];
    selectedKeys?: string[];
    selectedRowKeys?: string[];
    scrollClass?: string;
    headerClass?: string;
    bodyClass?: string;
    footerClass?: string;
    selectedClass?: string;
}

const Gallery = ({
    body = undefined,
    Header = undefined,
    Footer = undefined,
    overlays = undefined,
    onClick = undefined,
    onSelectionChange = undefined,
    sortable = false,
    pagination = undefined,
    gutterSize = undefined,
    rowCols = undefined,
    groupBy = undefined,
    selectedKeys = undefined,
    selectedRowKeys = undefined,
    pre = undefined,
    post = undefined,
    wrapClass = undefined,
    className = undefined,
    headerClass = undefined,
    scrollClass = undefined,
    bodyClass = undefined,
    footerClass = undefined,
    selectedClass = undefined
}: GalleryProps) => {
    const theme = useTheme("gallery");
    const activeClass = selectedClass || theme.Gallery.selectedClass;
    const [paginationNavEl, setPaginationNavEl] = useState<HTMLElement | null>(null);
    const paginationNavRef = useCallback((node: HTMLDivElement | null) => {
        if (node) setPaginationNavEl(node);
    }, []);
    const paddingSize = gutterSize ?? theme.Gallery.gutterSize;
    const numCols = rowCols ?? theme.Gallery.rowCols;
    const spacingScale: Record<number, string> = {
        0: "0",
        1: "0.25rem",
        2: "0.5rem",
        3: "1rem",
        4: "1.5rem",
        5: "3rem",
    };
    const itemGap = spacingScale[paddingSize] || spacingScale[2];
    const overlayOffset = "0.75rem";
    const overlayLaneWidth = "calc(50% - 1rem)";
    const itemWidth = `calc((100% - (${itemGap} * ${numCols - 1})) / ${numCols})`;
    const galleryRecords = body || [];
    const sortableOrder = useMemo(() => {
        if (!sortable) return undefined;
        if (typeof sortable === 'object') return sortable;

        const firstRecord = body?.[0];
        if (!firstRecord) return undefined;

        const firstSortableKey = Object.keys(firstRecord).find((key) => !key.startsWith('_'));
        if (!firstSortableKey) return undefined;

        return { field: firstSortableKey, dir: 'asc' as const };
    }, [body, typeof sortable === 'object' ? sortable?.dir : undefined, typeof sortable === 'object' ? sortable?.field : undefined, sortable]);
    const getStableRecordKey = useStableRecordKey<GalleryRecord>('item');
    const getRecordKey = useCallback((record: GalleryRecord, index?: number) => getStableRecordKey(record, index), [getStableRecordKey]);
    const {
        activeSelectedKeys,
        showSelection,
        updateSelection,
    } = useRecordSelection<GalleryRecord>({
        records: galleryRecords,
        selectedKeys,
        legacySelectedKeys: selectedRowKeys,
        onSelectionChange,
        getRecordKey,
    });

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

        onClick?.(record);
    }

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
                className: cn("img-fluid w-full rounded-lg object-cover", imgElement.props.className),
                style: {
                    ...(imgElement.props.style || {}),
                    aspectRatio: imgElement.props.style?.aspectRatio || "16 / 11",
                    cursor: onClick ? "pointer" : "default",
                },
                onClick: onClick ? ((e: React.MouseEvent<HTMLImageElement>) => {
                    handleClick(e, item);
                    imgElement.props.onClick?.(e);
                }) : imgElement.props.onClick,
            }) as ImageProps;
        }

        return (
            <img
                className="img-fluid w-full rounded-lg object-cover"
                src={
                    item.thumbnail
                        ? item.mimetype + item.thumbnail
                        : 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAgAAAAwAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
                }
                alt={item.name}
                width={item.width}
                height={item.height}
                style={{ aspectRatio: "16 / 11", cursor: onClick ? "pointer" : "default" }}
                onClick={onClick ? ((e: React.MouseEvent<HTMLImageElement>) => handleClick(e, item)) : undefined}
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

    const renderItem = (Component: React.ReactElement, index: number, item: GalleryRecord) => {
        const recordKey = getRecordKey(item, index);
        const isSelected = activeSelectedKeys.includes(recordKey);
        const activeClasses = activeClass?.split(/\s+/).filter(Boolean) || [];

        return (
        <div
            key={index}
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
                            aria-label={`Select item ${recordKey}`}
                            checked={isSelected}
                            onChange={() => toggleSelection(item, index)}
                            onClick={(event) => event.stopPropagation()}
                        />
                    </label>
                )}
                {Component}
                {renderItemOverlays(item, index)}
            </div>
        </div>
        );
    };

    const getGroups = (body: GalleryRecord[], seps: string | string[]): GalleryRenderedRecord[] => {
        const groupMap: Record<string, Array<{ image: ImageProps; item: GalleryRecord; index: number }>> = {};

        body.forEach((item, index) => {
            const imgElement = getImage(item, index);
            const alt = imgElement.props.alt || "";
            const src = imgElement.props.src || "";
            if (!alt || !src) return;

            const [leftPart] = converter.splitFirst(alt.toUpperCase(), seps, /^\d/g);
            const groupKey = leftPart || "GROUP";

            if (!groupMap[groupKey]) groupMap[groupKey] = [];
            groupMap[groupKey].push({ image: imgElement, item, index });
        });

        return Object.entries(groupMap).map(([groupName, items]) => (
            {
                kind: "group",
                element: (
                    <section key={groupName} className="gallery-group rounded-lg border bg-card p-3 text-left">
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            {groupName.toLowerCase()}
                        </h3>
                        <div className={cn("flex flex-wrap items-center", "row-cols-" + numCols)} style={{ gap: itemGap }}>
                            {items.map(({ image, item, index }) => renderItem(image, index, item))}
                        </div>
                    </section>
                )
            }
        ));
    };

    const renderedBody = useMemo(() => {
        if (!Array.isArray(body)) return undefined;

        const orderedBody = Order.records(body, sortableOrder) || [];

        return groupBy
            ? getGroups(orderedBody, groupBy)
            : orderedBody.map((item, index) => ({ kind: "item", image: getImage(item, index), item, index }) as GalleryRenderedRecord);
    }, [activeSelectedKeys, body, groupBy, overlays, sortableOrder, toggleSelection]);

    if (renderedBody === undefined) {
        return <p className={"p-4"}><span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Caricamento in corso...</p>;
    } else if (renderedBody.length === 0) {
        return <p className={"p-4"}>Nessun dato trovato</p>;
    }

    return (
        <div className={cn("flex items-stretch gap-3", wrapClass || theme.Gallery.wrapClass)}>
            {pre && <div className="gallery-pre flex shrink-0 items-center self-stretch">{pre}</div>}
            <Wrapper className={cn("min-w-0 flex-1 flex flex-col", className || theme.Gallery.className)}>
                {Header && <div className={headerClass || theme.Gallery.headerClass}>{Header}</div>}
                <Wrapper className={cn("min-w-0 flex-1", scrollClass || theme.Gallery.scrollClass)}>
                    <Pagination
                        recordSet={renderedBody}
                        appendTo={paginationNavEl}
                        wrapClass="px-3 pt-4 pb-2"
                        {...(pagination || {})}
                    >
                        {(pageRecords, pageOffset) => (
                            <div className="p-3">
                                <div
                                    className={"flex flex-wrap text-center items-center row-cols-" + numCols + " " + (bodyClass || theme.Gallery.bodyClass)}
                                    style={{ gap: itemGap }}
                                >
                                    {pageRecords.map((record) => (
                                        record.kind === "group"
                                            ? record.element
                                            : renderItem(record.image, record.index, record.item)
                                    ))}
                                </div>
                            </div>
                        )}
                    </Pagination>
                </Wrapper>
                <div ref={paginationNavRef} className="mt-auto" />
                {Footer && <div className={footerClass || theme.Gallery.footerClass}>{Footer}</div>}
            </Wrapper>
            {post && <div className="gallery-post flex shrink-0 items-center self-stretch">{post}</div>}
        </div>)
}

export default Gallery;

