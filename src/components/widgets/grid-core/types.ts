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

export type GridColumn<TRecord> = {
    key: keyof TRecord | string;
    label: string;
    sortable?: boolean;
    className?: string;
    render?: GridFormat | ((ctx: GridCellContext<TRecord>) => React.ReactNode);
};

export type GridSelectionState<TRecord> = {
    keys: string[];
    records: TRecord[];
    hasSelection: boolean;
    clear: () => void;
};

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
    buttonFullscreen?: boolean;
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
    buttonFullscreen?: boolean;
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

export type GridMutationDeleteArgs<TRecord> = {
    record?: TRecord;
};

export type GridAfterActionArgs<TRecord> = {
    record?: TRecord;
    action: "create" | "update" | "delete";
};

export type GridRouteSync = {
    edit?: boolean;
};

export type GridPresentation = {
    layout?: GridLayout;
    sticky?: GridSticky;
    wrapClass?: string;
    loading?: boolean;
    title?: React.ReactNode;
};

export type GridBehavior<TRecord> = {
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    selection?: GridSelectionMode;
    selectedKeys?: string[];
    defaultSelectedKeys?: string[];
    onSelectionChange?: (selection: GridSelectionState<TRecord>) => void;
    onClickRow?: (record: TRecord) => void;
    reorderable?: boolean;
    onReorder?: (
        records: TRecord[],
        meta: { fromIndex: number; toIndex: number; record: TRecord }
    ) => void;
    groupBy?: keyof TRecord | string | Array<keyof TRecord | string>;
};

export type GridPersistence<TRecord> = {
    onSave?: (args: GridMutationSaveArgs<TRecord>) => Promise<string | undefined>;
    onDelete?: (args: GridMutationDeleteArgs<TRecord>) => Promise<string | undefined>;
    onAfterAction?: (args: GridAfterActionArgs<TRecord>) => Promise<boolean>;
    createRecordKey?: (record: TRecord) => string;
    audit?: boolean;
};

export type GridTransform<TRecord> = {
    transformRecords?: (records: TRecord[]) => TRecord[] | Promise<TRecord[]>;
};

export type GridBaseProps<TRecord> =
    & GridPresentation
    & GridBehavior<TRecord>
    & GridPersistence<TRecord>
    & GridTransform<TRecord>
    & {
        columns?: GridColumn<TRecord>[];
        actions?: GridActions<TRecord>;
        form?: React.ReactElement | ((ctx: GridFormContext<TRecord>) => React.ReactNode);
        routeSync?: GridRouteSync;
        header?: React.ReactNode | ((ctx: GridHeaderContext<TRecord>) => React.ReactNode);
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

export type GridDBQuery = Pick<DatabaseOptions, "where" | "order" | "fieldMap" | "onLoad">;

export type GridDBPath = string | "fromUrl";

export type GridDBProps<TRecord extends RecordProps = RecordProps> =
    GridBaseProps<TRecord>
    & GridDBQuery
    & {
        path: GridDBPath;
        recordId?: GridRecordKey<TRecord>;
    };

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
    onSelectionChange?: (selection: GridSelectionState<TRecord>) => void;
    onClickRow?: (record: TRecord) => void;
    reorderable?: boolean;
    onReorder?: (
        records: TRecord[],
        meta: { fromIndex: number; toIndex: number; record: TRecord }
    ) => void;
    activeKey?: string | null;
    wrapClass?: string;
};

export type GridGalleryViewProps<TRecord extends RecordProps> = {
    records: TRecord[];
    recordId: GridRecordKey<TRecord>;
    sortable?: boolean | OrderConfig;
    pagination?: PaginationParams;
    selection?: GridSelectionMode;
    selectedKeys?: string[];
    onSelectionChange?: (selection: GridSelectionState<TRecord>) => void;
    onClickRow?: (record: TRecord) => void;
    groupBy?: keyof TRecord | string | Array<keyof TRecord | string>;
    wrapClass?: string;
};
