import React from "react";
import { type OrderConfig } from "../../../libs/order";
import { type PaginationParams } from "../../ui/Pagination";
import { type GalleryOverlay } from "../../ui/Gallery";
import { type DatabaseOptions, type RecordProps } from "../../../providers/data/DataProvider";

export type GridLayout = "table" | "gallery";
export type GridSticky = "top" | "bottom";
export type GridSelectionMode = false | "single" | "multiple";

export type GridRecordKey<TRecord> =
    | keyof TRecord
    | ((record: TRecord) => string);

/**
 * Declarative field shown as an overlay on a gallery card — distinct from `GridColumn`
 * (which drives table columns): a card doesn't need the same fields as a table row,
 * and has its own visibility picker (`views.gallery.fieldPicker`) separate from the
 * table's `views.table.columnPicker`.
 */
export type GridGalleryField<TRecord> = {
    /** Record field to read. Accepts dot-notation strings for nested fields. */
    key: keyof TRecord | string;
    /** Label shown in the field picker (not on the card itself — the card shows the value only). */
    label: string;
    /** Where on the card this field's value is overlaid. Defaults to `"bottomLeft"`. */
    position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "middleLeft" | "middleRight";
    /** Whether this field is shown by default when `fieldPicker` is enabled. Defaults to `true`. */
    defaultVisible?: boolean;
    /** Custom render — defaults to the raw field value as text. */
    render?: (value: unknown, record: TRecord) => React.ReactNode;
};

/** Table-specific view options, grouped under `views.table`. */
export type GridTableViewConfig = {
    /** Show a built-in "Columns" dropdown letting the user show/hide table columns. Default `false`. */
    columnPicker?: boolean;
    /** CSS classes on the underlying `<table>` element — forwarded to `Table`'s own `className`.
     * A `<table>` with `table-layout: auto` (the default) shrinks its columns to fit the
     * container instead of overflowing it, so wide/many-column content never triggers a
     * horizontal scrollbar on its own — set a `min-w-[…]` here (combined with `views.table`'s
     * ancestor allowing horizontal overflow, e.g. via `wrapperClassName="overflow-x-auto"`) to
     * force the table wider than its container when needed. */
    className?: string;
    /** Tailwind height/max-height class for the inner viewport — forwarded to `Table`'s own
     * `heightClassName`. When set, `Table` enables internal vertical scrolling automatically AND
     * pins its own `<thead>`/`<tfoot>` to the top/bottom of that same scrolling viewport, so only
     * the body rows move — no extra prop needed for that, it's `Table`'s own default behavior
     * whenever it is height-bound. */
    heightClassName?: string;
    /** Additional class on the inner scrolling viewport — forwarded to `Table`'s own
     * `scrollClassName`. Use as an addon for overflow styling or fine-grained tweaks. */
    scrollClassName?: string;
    /** Optional extra classes on `<thead>` — forwarded to `Table`'s own `headerClassName`. Purely
     * cosmetic (e.g. extra padding/typography); the sticky-header-when-scrollable behavior itself
     * is automatic (see `heightClassName` above) and does not depend on this prop being set. */
    headerClassName?: string;
};

/** Gallery-specific view options, grouped under `views.gallery`. */
export type GridGalleryViewConfig<TRecord> = {
    /** Cards per row — one of `1|2|3|4|6` (the only values the underlying `Gallery` component supports). */
    columns?: 1 | 2 | 3 | 4 | 6;
    /**
     * Declarative fields overlaid on each card (see `GridGalleryField`). Generates the
     * overlays automatically and, combined with `fieldPicker`, a "Fields" dropdown
     * analogous to the table's "Columns" picker — but a separate one, since a card
     * typically shows fewer/different fields than a table row.
     */
    fields?: GridGalleryField<TRecord>[];
    /** Show the built-in "Fields" dropdown for `fields` above. Default `false`. */
    fieldPicker?: boolean;
    /**
     * Escape hatch: fully custom overlay renderers (forwarded to `<Gallery overlays>`),
     * for anything `fields` can't express (e.g. an action button, not just a label).
     * ADDITIVE to the overlays generated from `fields` — a caller commonly needs both at
     * once (e.g. a Delete button plus checkable label fields); positions shared by both
     * simply stack, with the custom overlay rendered first.
     */
    overlays?: GalleryOverlay[];
};

/**
 * Groups every Table/Gallery-view-switching concern under one input, instead of a flat
 * spray of booleans on `<Grid>` — `toggle` decides whether the switch exists at all,
 * `table`/`gallery` hold the options specific to each view (column picker vs. field
 * picker are deliberately two different controls, since a gallery card and a table row
 * don't need to show the same fields).
 */
export type GridViewsConfig<TRecord> = {
    /** Show the built-in Table/Gallery switch in the header, letting the user change the active view at runtime. Default `false` — `view` behaves as a fixed initial mode when omitted, same as before this existed. */
    toggle?: boolean;
    table?: GridTableViewConfig;
    gallery?: GridGalleryViewConfig<TRecord>;
};

export type GridFormat =
    | "text"
    | "email"
    | "date"
    | "datetime"
    | "badge"
    | "image"
    | "boolean"
    | "json";

export type GridCellContext<TRecord> = {
    record: TRecord;
    value: unknown;
    key: string;
    rowIndex: number;
    runAction: (actionKey: string) => void;
};

/**
 * Column definition for `<Grid>` / `<Table>`.
 * `render` accepts a built-in format string ("date", "badge", …) or a custom
 * render function that receives the full cell context.
 */
export type GridColumn<TRecord> = {
    /** Record field to read. Accepts dot-notation strings for nested fields. */
    key: keyof TRecord | string;
    /** Column header label. */
    label: string;
    /** Enable click-to-sort on this column. */
    sortable?: boolean;
    /** Extra CSS classes on the `<td>` / cell wrapper. */
    className?: string;
    /** Built-in format name or custom render function. */
    render?: GridFormat | ((ctx: GridCellContext<TRecord>) => React.ReactNode);
    /** Whether this column is shown by default when `views.table.columnPicker` is enabled. Defaults to `true`. */
    defaultVisible?: boolean;
};

export type GridSelectionState<TRecord> = {
    keys: string[];
    records: TRecord[];
    hasSelection: boolean;
    clear: () => void;
};

export type GridSelectionChangeHandler<TRecord> = (selection: GridSelectionState<TRecord>) => void;

export type GridSelectionConfig<TRecord> = {
    mode: "single" | "multiple";
    defaultKeys?: string[];
    onChange?: GridSelectionChangeHandler<TRecord>;
};

export type GridReorderMeta<TRecord> = {
    fromIndex: number;
    toIndex: number;
    record: TRecord;
};

export type GridReorderHandler<TRecord> = (
    records: TRecord[],
    meta: GridReorderMeta<TRecord>
) => void;

export type GridActionContext<TRecord> = {
    actionKey: string;
    record?: TRecord;
    recordKey?: string;
    rowIndex?: number;
    isNewRecord: boolean;
    runAction: (actionKey: string, record?: TRecord) => void;
};

export type GridModalActionContext<TRecord> = {
    actionKey: string;
    record?: TRecord;
    recordKey?: string;
    rowIndex?: number;
    isNewRecord: boolean;
    runAction: (actionKey: string) => void;
};

type GridActionPredicate<TRecord> = boolean | ((record?: TRecord) => boolean);

export type GridModalAction<TRecord> = {
    kind: "modal";
    label?: string;
    icon?: string;
    visible?: GridActionPredicate<TRecord>;
    disabled?: GridActionPredicate<TRecord>;
    title?: React.ReactNode | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
    size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
    position?: "center" | "top" | "left" | "right" | "bottom";
    allowFullscreen?: boolean;
    header?: React.ReactNode | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
    body?: React.ReactNode | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
    footer?: React.ReactNode | false | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
};

export type GridRouteAction<TRecord> = {
    kind: "route";
    label?: string;
    icon?: string;
    visible?: GridActionPredicate<TRecord>;
    disabled?: GridActionPredicate<TRecord>;
    to: string | ((ctx: GridActionContext<TRecord>) => string);
};

export type GridExternalAction<TRecord> = {
    kind: "external";
    label?: string;
    icon?: string;
    visible?: GridActionPredicate<TRecord>;
    disabled?: GridActionPredicate<TRecord>;
    href: string | ((ctx: GridActionContext<TRecord>) => string);
};

export type GridInlineAction<TRecord> = {
    kind: "inline";
    label?: string;
    icon?: string;
    visible?: GridActionPredicate<TRecord>;
    disabled?: GridActionPredicate<TRecord>;
    run: (ctx: GridActionContext<TRecord>) => void | Promise<void>;
};

export type GridDeleteAction<TRecord> = {
    kind: "delete";
    label?: string;
    icon?: string;
    visible?: GridActionPredicate<TRecord>;
    disabled?: GridActionPredicate<TRecord>;
    title?: React.ReactNode | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
    size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
    position?: "center" | "top" | "left" | "right" | "bottom";
    allowFullscreen?: boolean;
    header?: React.ReactNode | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
    body?: React.ReactNode | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
    footer?: React.ReactNode | false | ((ctx: GridModalActionContext<TRecord>) => React.ReactNode);
};

export type GridAction<TRecord> =
    | GridModalAction<TRecord>
    | GridRouteAction<TRecord>
    | GridExternalAction<TRecord>
    | GridInlineAction<TRecord>
    | GridDeleteAction<TRecord>;

export type GridActions<TRecord> =
    | Array<"add" | "edit" | "delete">
    | Record<string, GridAction<TRecord> | false>;

export type GridHeaderContext<TRecord> = {
    title?: React.ReactNode;
    records: TRecord[];
    selection: GridSelectionState<TRecord>;
    runAction: (actionKey: string, record?: TRecord) => void;
};

export type GridFooterContext<TRecord> = {
    records: TRecord[];
    selection: GridSelectionState<TRecord>;
    runAction: (actionKey: string, record?: TRecord) => void;
};

export type GridFormContext<TRecord> = GridActionContext<TRecord> & {
    record: TRecord | undefined;
};

export type GridMutationSaveArgs<TRecord> = {
    record?: TRecord;
    action: "create" | "update";
    storagePath?: string;
};

export type GridMutationSaveHandler<TRecord> = (
    args: GridMutationSaveArgs<TRecord>
) => Promise<string | undefined>;

export type GridMutationDeleteArgs<TRecord> = {
    record?: TRecord;
};

export type GridMutationDeleteHandler<TRecord> = (
    args: GridMutationDeleteArgs<TRecord>
) => Promise<string | undefined>;

export type GridAfterActionArgs<TRecord> = {
    record?: TRecord;
    action: "create" | "update" | "delete";
};

export type GridAfterActionHandler<TRecord> = (
    args: GridAfterActionArgs<TRecord>
) => Promise<boolean>;

/** Visual / layout props for `<Grid>`. */
export type GridPresentation<TRecord> = {
    /** Display mode: `"table"` (default) or `"gallery"` card layout. Acts as the initial/default view — see `views.toggle` to let the user switch at runtime. */
    view?: GridLayout;
    /** Table/Gallery switch + per-view options (column picker, gallery field picker, cards-per-row, …) — see `GridViewsConfig`. Omit entirely to keep the pre-existing fixed-`view` behavior. */
    views?: GridViewsConfig<TRecord>;
    /** Stick the header (`"top"`) or footer (`"bottom"`) while scrolling. */
    sticky?: GridSticky;
    /** CSS classes on the outermost wrapper element. */
    wrapperClassName?: string;
    /** CSS classes on the Card's own root box — the bordered element itself (`ui/Card.tsx`'s
     * `cardRootClassName`), distinct from `wrapperClassName` (the element AROUND the card,
     * e.g. for `before`/`after` layout) and `bodyClassName` (the padded area inside the card).
     * The root box has no `display: flex`/height by default — its body only actually gets a
     * bounded height (and therefore an internal scrollbar) when THIS box is also a flex column
     * with a real height, e.g. `"flex h-full min-h-0 flex-col"`. Needed together with
     * `bodyClassName`/`views.table.heightClassName` for a full-height Grid to scroll internally
     * instead of growing past its container. */
    cardClassName?: string;
    /** CSS classes on the Card body — the container directly around the table/gallery view.
     * Grid always renders inside a `Card` (`ui/Card.tsx`); its body defaults to a fixed padding
     * with no height constraint. Use this (typically with `flex-1 min-h-0 overflow-hidden p-0`,
     * paired with `wrapperClassName`/`cardClassName` making the card itself a bounded flex
     * column, and `views.table.heightClassName`) to make the table's own internal scroll fill
     * the remaining height of a flex ancestor instead of growing the page. */
    bodyClassName?: string;
    /** Show a loading skeleton instead of rows. */
    loading?: boolean;
    /** Title rendered in the Grid header area. */
    title?: React.ReactNode;
    /** Content rendered before the Grid. */
    before?: React.ReactNode;
    /** Content rendered after the Grid. */
    after?: React.ReactNode;
};

/** Config for `GridBehavior.searchable` beyond a plain `true` — restrict which fields match,
 * or override the input's placeholder. */
export type GridSearchConfig<TRecord> = {
    /** Placeholder text for the search input — defaults to the localized `common.search`
     * ("Search"). */
    placeholder?: string;
    /** Field keys to match against — omit to search every string-valued field on each record. */
    fields?: Array<keyof TRecord | string>;
};

/** One `{ label, value }` choice for a `'select'`/`'multiselect'` filter. */
export type GridFilterOption = {
    label: string;
    value: string;
};

interface GridFilterBase {
    /** Unique key identifying this filter — used as the React key and to track its state, so
     * it must be stable and unique within the `filters` array. */
    key: string;
    /** Label shown in the filters panel, and as the prefix of the filter's chip once active. */
    label: string;
}

/** A checkbox filter. `kind` may be omitted — it defaults to `'toggle'` (the original,
 * pre-1.8 shape of `GridFilterConfig`). */
export type GridFilterToggleConfig<TRecord> = GridFilterBase & {
    kind?: 'toggle';
    /** Initial checkbox state. Defaults to `false`. */
    defaultValue?: boolean;
    /** Return `true` to keep `record` given the filter's current checkbox `value`. Called for
     * every record on every render of the filtered set — keep it cheap and pure. */
    predicate: (record: TRecord, value: boolean) => boolean;
};

/** A single-choice dropdown filter. */
export type GridFilterSelectConfig<TRecord> = GridFilterBase & {
    kind: 'select';
    options: GridFilterOption[];
    /** Return `true` to keep `record`. `value` is `''` when nothing is selected — treat that as
     * "no constraint" (match every record). */
    predicate: (record: TRecord, value: string) => boolean;
};

/** A multi-choice filter, rendered as a checkbox list in the filters panel. */
export type GridFilterMultiSelectConfig<TRecord> = GridFilterBase & {
    kind: 'multiselect';
    options: GridFilterOption[];
    /** Return `true` to keep `record`. `values` is `[]` when nothing is selected — treat that
     * as "no constraint" (match every record). */
    predicate: (record: TRecord, values: string[]) => boolean;
};

/** A `from`/`to` date-range filter, rendered as two native date inputs. */
export type GridFilterDateRangeConfig<TRecord> = GridFilterBase & {
    kind: 'dateRange';
    /** Return `true` to keep `record`. `from`/`to` are `''` when that bound isn't set —
     * treat an empty bound as unconstrained on that side. */
    predicate: (record: TRecord, range: { from: string; to: string }) => boolean;
};

/** A `min`/`max` numeric-range filter, rendered as two native number inputs. */
export type GridFilterNumberRangeConfig<TRecord> = GridFilterBase & {
    kind: 'numberRange';
    /** Return `true` to keep `record`. `min`/`max` are `undefined` when that bound isn't set —
     * treat an unset bound as unconstrained on that side. */
    predicate: (record: TRecord, range: { min: number | undefined; max: number | undefined }) => boolean;
};

/** One entry of `GridBehavior.filters` — a checkbox, dropdown, multi-choice list, date range,
 * or numeric range, all rendered together in the filters panel opened from Grid's own default
 * header (see `GridBehavior.filters`). */
export type GridFilterConfig<TRecord> =
    | GridFilterToggleConfig<TRecord>
    | GridFilterSelectConfig<TRecord>
    | GridFilterMultiSelectConfig<TRecord>
    | GridFilterDateRangeConfig<TRecord>
    | GridFilterNumberRangeConfig<TRecord>;

/** Interaction / behaviour props for `<Grid>`. */
export type GridBehavior<TRecord> = {
    /** Enable global sorting. Pass an `OrderConfig` to set a default sort. */
    sortable?: boolean | OrderConfig;
    /** Pagination config. `{ limit: 20 }` is the common form. */
    pagination?: PaginationParams;
    /** Row selection: `false` (off), `"single"`, `"multiple"`, or a full `GridSelectionConfig`. */
    selection?: false | "single" | "multiple" | GridSelectionConfig<TRecord>;
    /** Called when the user clicks a row (outside an action button). */
    onRowClick?: (record: TRecord) => void;
    /** Allow drag-and-drop row reordering. */
    reorderable?: boolean;
    /** Called after a drag reorder with the new record order and move metadata. */
    onReorder?: GridReorderHandler<TRecord>;
    /** Group rows by a field or array of fields. */
    groupBy?: keyof TRecord | string | Array<keyof TRecord | string>;
    /** Enable a built-in search box in Grid's own default header — filters the records actually
     * rendered (table/gallery, and whatever they in turn compute: sort/pagination/selection all
     * see the FILTERED set, not the original one) by a case-insensitive substring match. `true`
     * searches every string-valued field on each record; pass a `GridSearchConfig` to restrict to
     * specific fields or customize the placeholder. Only rendered as part of Grid's OWN default
     * header — same as `views.table.columnPicker`/`views.toggle`, a fully custom `header` prop
     * bypasses it entirely (render your own search input there instead). */
    searchable?: boolean | GridSearchConfig<TRecord>;
    /** Filters (checkbox / select / multiselect / date range / number range) opened from a
     * "Filters" button in Grid's OWN default header, next to the search box — applied BEFORE
     * `searchable` (filters → search → sort → pagination/selection all see the FILTERED set).
     * Each active filter shows as a removable chip on the header row. Same extension point as
     * `searchable`: a fully custom `header` prop bypasses it entirely (render your own filter
     * controls there instead). */
    filters?: GridFilterConfig<TRecord>[];
};

/** Data-mutation hooks for `<Grid>`. */
export type GridPersistence<TRecord> = {
    /** Called before saving a record. Return a custom storage path or `undefined`. */
    onSave?: GridMutationSaveHandler<TRecord>;
    /** Called before deleting a record. Return a path override or `undefined`. */
    onDelete?: GridMutationDeleteHandler<TRecord>;
    /** Called after create/update/delete. Return `false` to suppress default navigation. */
    onComplete?: GridAfterActionHandler<TRecord>;
    /** Automatically write `createdAt` / `updatedAt` timestamps on every mutation. */
    audit?: boolean;
};

/**
 * Full prop surface shared by all `<Grid>` variants.
 * Combines presentation, behaviour, and persistence with a few top-level hooks.
 */
export type GridBaseProps<TRecord> =
    & GridPresentation<TRecord>
    & GridBehavior<TRecord>
    & GridPersistence<TRecord>
    & {
        /** Transform the record array after loading (filter, sort, enrich). */
        onLoad?: (records: TRecord[]) => TRecord[] | Promise<TRecord[]>;
        /** Column definitions. Omit to auto-generate from record keys. */
        columns?: GridColumn<TRecord>[];
        /** Enable built-in `"add"/"edit"/"delete"` shortcuts, or provide custom `GridAction` objects. */
        actions?: GridActions<TRecord>;
        /** Form element or factory rendered inside the add/edit modal. */
        form?: React.ReactElement | ((ctx: GridFormContext<TRecord>) => React.ReactNode);
        /** Sync the edit modal state to the URL hash (enables direct links). */
        editDeepLink?: boolean;
        /** Content rendered in the Grid header bar. Receives selection context. */
        header?: React.ReactNode | ((ctx: GridHeaderContext<TRecord>) => React.ReactNode);
        /** Content rendered in the Grid footer bar. Receives selection context. */
        footer?: React.ReactNode | ((ctx: GridFooterContext<TRecord>) => React.ReactNode);
    };

export type GridCoreProps<TRecord extends RecordProps> = GridBaseProps<TRecord> & {
    records: TRecord[];
    recordId: GridRecordKey<TRecord>;
    sourcePath?: string;
};

export type GridArrayProps<TRecord extends RecordProps> = GridBaseProps<TRecord> & {
    records: TRecord[];
    recordId: GridRecordKey<TRecord>;
    /**
     * Base path the `records` were sourced from (e.g. `/components`) — enables the built-in
     * "delete" action's `db.remove(\`${sourcePath}/${recordKey}\`)` when the caller fetched
     * its own records (e.g. via `db.subscribe()`) instead of letting Grid fetch them itself
     * (`GridDBProps.path` does the equivalent there). Already threaded through to `GridCore`
     * — this was just missing from the public prop surface for the `records` variant.
     * Omit if delete is handled entirely via a custom `actions.delete`/`onDelete`.
     */
    sourcePath?: string;
};

export type GridDBQuery = Pick<DatabaseOptions, "where" | "order" | "fieldMap">;

export type GridDBPath = string;

export type GridDBProps<TRecord extends RecordProps = RecordProps> =
    GridBaseProps<TRecord>
    & GridDBQuery
    & (
        | { fromUrl: true; path?: never; recordId?: GridRecordKey<TRecord> }
        | { fromUrl?: false; path: GridDBPath; recordId?: GridRecordKey<TRecord> }
    );

export type GridGatewayArrayProps<TRecord extends RecordProps> = GridArrayProps<TRecord> & {
    path?: never;
};

export type GridGatewayDBProps<TRecord extends RecordProps = RecordProps> =
    GridDBProps<TRecord> & {
        records?: never;
    };

export type GridProps<TRecord extends RecordProps = RecordProps> =
    | GridGatewayArrayProps<TRecord>
    | GridGatewayDBProps<TRecord>;

export type GridTableViewProps<TRecord extends RecordProps> = {
    records: TRecord[];
    recordId: GridRecordKey<TRecord>;
    columns: GridColumn<TRecord>[];
    runAction: (actionKey: string, record?: TRecord) => void;
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    selection?: GridSelectionMode;
    selectedKeys?: string[];
    onSelectionChange?: GridSelectionChangeHandler<TRecord>;
    onRowClick?: (record: TRecord) => void;
    reorderable?: boolean;
    onReorder?: GridReorderHandler<TRecord>;
    activeKey?: string | null;
    groupBy?: keyof TRecord | string | Array<keyof TRecord | string>;
    wrapperClassName?: string;
    className?: string;
    heightClassName?: string;
    scrollClassName?: string;
    headerClassName?: string;
    before?: React.ReactNode;
    after?: React.ReactNode;
};

export type GridGalleryViewProps<TRecord extends RecordProps> = {
    records: TRecord[];
    recordId: GridRecordKey<TRecord>;
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    selection?: GridSelectionMode;
    selectedKeys?: string[];
    onSelectionChange?: GridSelectionChangeHandler<TRecord>;
    onRowClick?: (record: TRecord) => void;
    groupBy?: keyof TRecord | string | Array<keyof TRecord | string>;
    wrapperClassName?: string;
    before?: React.ReactNode;
    after?: React.ReactNode;
    /** Cards per row — forwarded to `<Gallery columns>`. */
    columns?: 1 | 2 | 3 | 4 | 6;
    /** Overlay badges/render-props for each card — forwarded to `<Gallery overlays>`. */
    overlays?: GalleryOverlay[];
};

