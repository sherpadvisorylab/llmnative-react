import React from "react";
import { type OrderConfig } from "../../../libs/order";
import { type PaginationParams } from "../../ui/Pagination";
import { type DatabaseOptions, type RecordProps } from "../../../providers/data/DataProvider";

export type GridLayout = "table" | "gallery";
export type GridSticky = "top" | "bottom";
export type GridSelectionMode = false | "single" | "multiple";

export type GridRecordKey<TRecord> =
    | keyof TRecord
    | ((record: TRecord) => string);

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
export type GridPresentation = {
    /** Display mode: `"table"` (default) or `"gallery"` card layout. */
    view?: GridLayout;
    /** Stick the header (`"top"`) or footer (`"bottom"`) while scrolling. */
    sticky?: GridSticky;
    /** CSS classes on the outermost wrapper element. */
    wrapperClassName?: string;
    /** Show a loading skeleton instead of rows. */
    loading?: boolean;
    /** Title rendered in the Grid header area. */
    title?: React.ReactNode;
    /** Content rendered before the Grid. */
    before?: React.ReactNode;
    /** Content rendered after the Grid. */
    after?: React.ReactNode;
};

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
    & GridPresentation
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
};

