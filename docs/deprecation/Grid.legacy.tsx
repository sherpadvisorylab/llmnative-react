import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../Theme";
import { type OrderConfig } from "../../libs/order";
import { converter } from "../../libs/converter";
import { getRecordValue, safeClone, trimSlash } from "../../libs/utils";
import { useDataProvider } from "../../providers/data/DataProviderContext";
import { DatabaseOptions, DBConfig, RecordArray, RecordProps } from "../../providers/data/DataProvider";
import { extractComponentProps } from "../FormEnhancer";
import { PaginationParams } from "../ui/Pagination";
import Card from "../ui/Card";
import { ActionButton, buttonPrimaryClass } from "../ui/Buttons";
import Gallery, { GallerySelectionState } from "../ui/Gallery";
import Modal from "../ui/Modal";
import Table, { TableHeaderProp, TableReorderMeta, TableSelectionState } from "../ui/Table";
import Form, { FormRef } from "./Form";

type ColumnFormatterArgs = {
    value: any;
    record: RecordProps;
    key: string;
};

export type GridColumnTransform = keyof typeof converter | ((args: ColumnFormatterArgs) => React.ReactNode);

export type GridColumn = TableHeaderProp & {
    transform?: GridColumnTransform;
};

type ActionVisibility = boolean | ((record?: RecordProps) => boolean);
type ActionDisabled = boolean | ((record?: RecordProps) => boolean);
type GridActionRenderer = React.ReactNode | ((ctx: GridActionRenderContext) => React.ReactNode);
type GridModalConfig = {
    size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
    position?: "center" | "top" | "left" | "right" | "bottom";
};
type GridSlotRenderer<T> = React.ReactNode | ((ctx: T) => React.ReactNode);
type GridActionName = string;

export type GridActionRenderContext = {
    actionType: GridActionName;
    record?: RecordProps;
    key?: string;
    index?: number;
    isNewRecord: boolean;
    Actions: GridActionButtonMap;
    action: (action: GridActionName, record?: RecordProps) => void;
    close: () => void;
    save: () => Promise<boolean>;
    remove: () => Promise<boolean>;
};

export type GridActionButtonProps = {
    label?: string;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    record?: RecordProps;
    onClick?: () => void;
};

export type GridActionButtonMap = Record<string, React.ComponentType<GridActionButtonProps>>;

export type GridHeaderContext = {
    title?: React.ReactNode;
    Actions: GridActionButtonMap;
    records?: RecordArray;
    selectedKeys: string[];
    selectedRecords: RecordArray;
    clearSelection: () => void;
};

export type GridFooterContext = {
    Actions: GridActionButtonMap;
    records?: RecordArray;
    selectedKeys: string[];
    selectedRecords: RecordArray;
    clearSelection: () => void;
};

export type GridActionConfig = {
    label?: string;
    icon?: string;
    visible?: ActionVisibility;
    disabled?: ActionDisabled;
    mode?: string | ((record?: RecordProps) => string) | GridModalConfig | null;
    header?: React.ReactNode | ((ctx: GridActionRenderContext) => React.ReactNode);
    render?: GridActionRenderer;
};

export type GridActions = {
    add?: false | GridActionConfig;
    edit?: false | GridActionConfig;
    delete?: false | GridActionConfig;
} & Record<string, false | GridActionConfig | undefined>;

export type GridSource = RecordArray | string | DBConfig;
export type GridSortable = boolean | OrderConfig;

export type GridProps = {
    source?: GridSource;
    columns?: GridColumn[];
    title?: React.ReactNode;
    header?: GridSlotRenderer<GridHeaderContext>;
    footer?: GridSlotRenderer<GridFooterContext>;
    form?: GridActionRenderer;
    actions?: GridActions;
    view?: "table" | "gallery";
    sortable?: GridSortable;
    pagination?: PaginationParams;
    groupBy?: string | string[];
    createRecordKey?: (record: RecordProps) => string;
    transformRecords?: (records: RecordArray) => RecordArray | Promise<RecordArray>;
    onSave?: ({ record, action, storagePath }: { record?: RecordProps; storagePath?: string; action: "create" | "update" }) => Promise<string | undefined>;
    onDelete?: ({ record }: { record?: RecordProps }) => Promise<string | undefined>;
    onAfterAction?: ({ record, action }: { record?: RecordProps; action: "create" | "update" | "delete" }) => Promise<boolean>;
    onClick?: (record: RecordProps) => void;
    onSelectionChange?: (selection: TableSelectionState | GallerySelectionState) => void;
    onReorder?: (reorderedRecords: RecordArray, meta: TableReorderMeta) => void;
    selectedKeys?: string[];
    loading?: boolean;
    sticky?: "top" | "bottom";
    audit?: boolean;
    wrapClass?: string;
};

type ActiveGridAction = {
    type: GridActionName;
    record?: RecordProps;
};

const defaultHeader = (key: string): GridColumn => ({
    label: converter.toCamel(key, " "),
    key,
});

const asFormatter = (transform?: GridColumnTransform): ((args: ColumnFormatterArgs) => React.ReactNode) => {
    if (!transform) return ({ value }) => value;
    if (typeof transform === "function") return transform;
    return ({ value }) => converter[transform]?.(value);
};

const isActionEnabled = (action: false | GridActionConfig | undefined, record?: RecordProps, fallback = true) => {
    if (action === undefined) return fallback;
    if (action === false) return false;
    if (action.visible === undefined) return true;
    return typeof action.visible === "function" ? action.visible(record) : action.visible;
};

const isActionDisabled = (action: false | GridActionConfig | undefined, record?: RecordProps) => {
    if (!action) return false;
    if (action.disabled === undefined) return false;
    return typeof action.disabled === "function" ? action.disabled(record) : action.disabled;
};

const getActionLabel = (action: false | GridActionConfig | undefined, fallback: string) => {
    return typeof action === "object" && action?.label ? action.label : fallback;
};

const sanitizeHashPart = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const getHashRecordKey = (hash: string, gridHashId: string) => {
    if (!hash) return undefined;

    const value = hash.replace(/^#/, "");
    const prefix = `${gridHashId}:`;
    if (!value.startsWith(prefix)) return undefined;

    const recordKey = value.slice(prefix.length);
    return recordKey ? decodeURIComponent(recordKey) : undefined;
};

const isRecordArraySource = (source: GridSource | undefined): source is RecordArray => Array.isArray(source);

const isDbSource = (source: GridSource | undefined): source is DBConfig => {
    return !!source && typeof source === "object" && !Array.isArray(source);
};

const getSourcePath = (source: GridSource | undefined, routePath: string): string | undefined => {
    if (isRecordArraySource(source)) return undefined;
    if (typeof source === "string") return source;
    if (isDbSource(source)) return source.path || routePath;
    return routePath;
};

const getSourceOptions = (source: GridSource | undefined): DatabaseOptions | undefined => {
    if (!isDbSource(source)) return undefined;

    return {
        where: source.where,
        order: source.order,
        fieldMap: source.fieldMap,
        onLoad: source.onLoad,
    };
};

const getInitialViewOrder = (source: GridSource | undefined): OrderConfig | undefined => {
    if (!isDbSource(source) || !source.order) return undefined;

    const [providerField, direction] = Object.entries(source.order)[0] || [];
    if (!providerField) return undefined;

    const mappedField = Object.entries(source.fieldMap || {}).find(([, value]) => value === providerField)?.[0] || providerField;
    return {
        field: mappedField,
        dir: direction === "desc" ? "desc" : "asc",
    };
};

const getSortableOrder = (sortable: GridSortable | undefined): OrderConfig | undefined => {
    if (!sortable || typeof sortable === "boolean") return undefined;
    return sortable;
};

const isSortingEnabled = (sortable: GridSortable | undefined) => sortable !== false;

const getActionConfig = (action: false | GridActionConfig | undefined): GridActionConfig | undefined => {
    if (!action) return undefined;
    return action;
};

const resolveRenderer = (renderer: GridActionRenderer | undefined, ctx: GridActionRenderContext): React.ReactNode => {
    if (!renderer) return null;
    return typeof renderer === "function" ? renderer(ctx) : renderer;
};

const isNavigationMode = (mode: GridActionConfig["mode"]): mode is string | ((record?: RecordProps) => string) => {
    return typeof mode === "string" || typeof mode === "function";
};

const getModalConfig = (mode: GridActionConfig["mode"]): GridModalConfig | undefined => {
    if (!mode || isNavigationMode(mode)) return undefined;
    return mode;
};

const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

const createSyntheticMouseEvent = () => ({
    preventDefault: () => undefined,
} as React.MouseEvent<HTMLButtonElement>);

const Grid = ({
    source = undefined,
    columns = undefined,
    title = undefined,
    header = undefined,
    footer = undefined,
    form = undefined,
    actions = undefined,
    view = "table",
    sortable = true,
    pagination = undefined,
    groupBy = undefined,
    createRecordKey = undefined,
    transformRecords = undefined,
    onSave = undefined,
    onDelete = undefined,
    onAfterAction = undefined,
    onClick = undefined,
    onSelectionChange = undefined,
    onReorder = undefined,
    selectedKeys = undefined,
    loading = false,
    sticky = undefined,
    audit = false,
    wrapClass = undefined,
}: GridProps) => {
    const theme = useTheme("grid");
    const location = useLocation();
    const navigate = useNavigate();
    const db = useDataProvider();
    const reactId = useId();
    const resolvedSourcePath = useMemo(() => getSourcePath(source, trimSlash(location.pathname)), [location.pathname, source]);
    const sourceOptions = useMemo(
        () => getSourceOptions(source),
        [isDbSource(source) ? source.fieldMap : undefined, isDbSource(source) ? source.onLoad : undefined, isDbSource(source) ? source.order : undefined, isDbSource(source) ? source.where : undefined]
    );
    const sortableOrder = useMemo(
        () => getSortableOrder(sortable),
        [typeof sortable === "object" ? sortable?.dir : undefined, typeof sortable === "object" ? sortable?.field : undefined]
    );
    const sortingEnabled = isSortingEnabled(sortable);
    const initialViewOrder = useMemo(
        () => sortableOrder || getInitialViewOrder(source),
        [isDbSource(source) ? source.fieldMap : undefined, isDbSource(source) ? source.order : undefined, sortableOrder]
    );
    const [providerRecords, setProviderRecords] = useState<RecordArray | undefined>(undefined);
    db.useListener(resolvedSourcePath, setProviderRecords, sourceOptions);
    const records = useMemo<RecordArray | undefined>(
        () => (isRecordArraySource(source) ? source : providerRecords),
        [providerRecords, source]
    );
    const gridHashId = useMemo(() => {
        const sourceId = resolvedSourcePath ? `grid-${trimSlash(resolvedSourcePath)}` : "grid-records";
        return `${sanitizeHashPart(sourceId)}-${sanitizeHashPart(reactId)}`;
    }, [reactId, resolvedSourcePath]);

    const [loader, setLoader] = useState(false);
    const [activeAction, setActiveAction] = useState<ActiveGridAction | null>(null);
    const formRef = useRef<FormRef | undefined>(undefined);
    const [preparedRecords, setPreparedRecords] = useState<RecordArray | undefined>(undefined);
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(selectedKeys || []);
    const [internalSelectedRecords, setInternalSelectedRecords] = useState<RecordArray>([]);

    const actionEntries = useMemo<Record<string, false | GridActionConfig | undefined>>(() => ({
        add: actions?.add,
        edit: actions?.edit,
        delete: actions?.delete,
        ...(actions || {}),
    }), [actions]);

    const addAction = actionEntries.add;
    const editAction = actionEntries.edit;
    const deleteAction = actionEntries.delete;

    useEffect(() => {
        if (!records || !transformRecords) {
            setPreparedRecords(undefined);
            setLoader(false);
            return;
        }

        let active = true;
        const result = transformRecords(safeClone(records));

        if (result instanceof Promise) {
            setLoader(true);
            result
                .then((nextRecords) => {
                    if (active) setPreparedRecords(nextRecords);
                })
                .finally(() => {
                    if (active) setLoader(false);
                });
        } else {
            setPreparedRecords(result);
            setLoader(false);
        }

        return () => {
            active = false;
        };
    }, [records, transformRecords]);

    useEffect(() => {
        setInternalSelectedKeys(selectedKeys || []);
    }, [selectedKeys]);

    useEffect(() => {
        if (!isActionEnabled(editAction, undefined, true)) return;

        const recordKey = getHashRecordKey(location.hash, gridHashId);
        if (!recordKey) {
            if (location.hash) {
                setActiveAction((current) => (current?.type === "edit" ? null : current));
            }
            return;
        }

        const record = records?.find((item) => item._key === recordKey);
        if (record && !isActionDisabled(editAction, record)) {
            setActiveAction((current) => (
                current?.type === "edit" && current.record?._key === record._key
                    ? current
                    : { type: "edit", record: safeClone(record) }
            ));
        }
    }, [editAction, gridHashId, location.hash, records]);

    const sourceRecords = useMemo(() => {
        if (!records) return undefined;
        if (transformRecords) return preparedRecords;
        return safeClone(records);
    }, [records, transformRecords, preparedRecords]);

    const tableHeaders: GridColumn[] = useMemo(() => {
        if (columns) return columns;
        if (!sourceRecords || sourceRecords.length === 0) return [];

        return form && React.isValidElement(form)
            ? extractComponentProps(form, (props) => defaultHeader(props.name))
            : Object.entries(sourceRecords[0]).reduce((acc: GridColumn[], [key, value]) => {
                if (key.startsWith("_")) return acc;
                if (
                    React.isValidElement(value) ||
                    typeof value !== "object" ||
                    Array.isArray(value)
                ) {
                    acc.push(defaultHeader(key));
                }
                return acc;
            }, []);
    }, [columns, sourceRecords, form]);

    const columnTransforms = useMemo(() => {
        return tableHeaders.reduce<Record<string, (args: ColumnFormatterArgs) => React.ReactNode>>((acc, column) => {
            acc[column.key] = asFormatter(column.transform);
            return acc;
        }, {});
    }, [tableHeaders]);

    const displayRecords: RecordArray | undefined = useMemo(() => {
        if (!sourceRecords) return undefined;

        return sourceRecords.reduce((acc: RecordArray, result: RecordProps, index: number) => {
            const displayRow: RecordProps = { ...result, _index: result._index ?? index };

            for (const key of Object.keys(columnTransforms)) {
                displayRow[key] = columnTransforms[key]({
                    value: getRecordValue(result, key),
                    record: result,
                    key,
                });
            }

            acc.push(displayRow);
            return acc;
        }, []);
    }, [sourceRecords, columnTransforms]);

    const canAdd = isActionEnabled(addAction, undefined, true) && (!!form || !!getActionConfig(addAction)?.render);
    const canEdit = (isActionEnabled(editAction, undefined, true) && (!!form || !!getActionConfig(editAction)?.render));
    const canDelete = isActionEnabled(deleteAction, activeAction?.record, true);

    const closeAction = useCallback(() => {
        setActiveAction(null);
        formRef.current = undefined;
        if (getHashRecordKey(location.hash, gridHashId)) {
            navigate({ pathname: location.pathname, search: location.search, hash: "" }, { replace: true });
        }
    }, [gridHashId, location.hash, location.pathname, location.search, navigate]);

    const resolveSourceRecord = useCallback((record: RecordProps): RecordProps | undefined => {
        return record._key
            ? records?.find((item) => item._key === record._key)
            : (typeof record._index === "number" ? records?.[record._index] : undefined);
    }, [records]);

    const updateInternalSelection = useCallback((nextKeys: string[], nextRecords: RecordArray) => {
        setInternalSelectedKeys(nextKeys);
        setInternalSelectedRecords(nextRecords);
    }, []);

    const clearSelection = useCallback(() => {
        updateInternalSelection([], []);
    }, [updateInternalSelection]);

    const selectedActionKeys = selectedKeys ?? internalSelectedKeys;

    const openAction = useCallback((type: GridActionName, record?: RecordProps) => {
        const config = getActionConfig(actionEntries[type]);
        const nextRecord = record ? safeClone(record) : {};
        const resolvedMode = typeof config?.mode === "function" ? config.mode(nextRecord) : config?.mode;

        if (typeof resolvedMode === "string" && resolvedMode) {
            if (isExternalUrl(resolvedMode)) {
                window.open(resolvedMode, "_blank", "noopener,noreferrer");
            } else {
                navigate(resolvedMode);
            }
            return;
        }

        setActiveAction({ type, record: nextRecord });

        if (type === "edit" && nextRecord?._key) {
            navigate({ hash: `${gridHashId}:${encodeURIComponent(nextRecord._key)}` }, { replace: false });
        } else if (getHashRecordKey(location.hash, gridHashId)) {
            navigate({ pathname: location.pathname, search: location.search, hash: "" }, { replace: true });
        }
    }, [actionEntries, gridHashId, location.hash, location.pathname, location.search, navigate]);

    const handleActionDelete = useCallback(async (): Promise<boolean> => {
        const record = activeAction?.record;
        if (!record?._key) return false;

        const storagePath = onDelete
            ? await onDelete({ record })
            : resolvedSourcePath
                ? `${resolvedSourcePath}/${record._key}`
                : undefined;

        if (!storagePath) return false;

        await db.remove(storagePath);
        const success = await onAfterAction?.({ record, action: "delete" }) ?? true;
        if (success) closeAction();
        return success;
    }, [activeAction?.record, closeAction, db, onAfterAction, onDelete, resolvedSourcePath]);

    const actionRecord = activeAction?.record;
    const actionKey = actionRecord?._key;
    const actionIndex = actionRecord?._index;
    const isNewRecord = !actionKey;

    const handleActionSave = useCallback(async (): Promise<boolean> => {
        if (!formRef.current) return false;
        return formRef.current.handleSave(createSyntheticMouseEvent());
    }, []);

    const getPreferredActionRecord = useCallback((type: GridActionName, record?: RecordProps) => {
        if (type === "add") return undefined;
        if (record) return record;
        if (activeAction?.record) return activeAction.record;
        if (internalSelectedRecords.length > 0) return internalSelectedRecords[0];
        return undefined;
    }, [activeAction?.record, internalSelectedRecords]);

    const createActionButton = useCallback((type: GridActionName): React.ComponentType<GridActionButtonProps> => {
        const GridActionButton = ({ label, className, disabled, children, record, onClick }: GridActionButtonProps) => {
            const config = getActionConfig(actionEntries[type]);
            const targetRecord = getPreferredActionRecord(type, record);
            const visible = isActionEnabled(actionEntries[type], targetRecord, true);

            if (!visible) return null;

            const finalDisabled = disabled ?? isActionDisabled(actionEntries[type], targetRecord);
            const fallbackLabel = type === "add"
                ? theme.Grid.i18n.buttonAdd
                : type === "edit"
                    ? (theme.Grid.i18n.headerEdit || "Edit")
                    : type === "delete"
                        ? "Delete"
                        : converter.toCamel(type, " ");

            return (
                <ActionButton
                    className={className || (type === "add" ? buttonPrimaryClass : undefined)}
                    icon={config?.icon}
                    label={label || (typeof children === "string" ? children : undefined) || getActionLabel(config, fallbackLabel)}
                    disabled={finalDisabled}
                    onClick={() => {
                        onClick?.();
                        if (!onClick) openAction(type, targetRecord);
                    }}
                />
            );
        };

        GridActionButton.displayName = `Grid${type[0].toUpperCase()}${type.slice(1)}ActionButton`;
        return GridActionButton;
    }, [actionEntries, getPreferredActionRecord, openAction, theme.Grid.i18n.buttonAdd, theme.Grid.i18n.headerEdit]);

    const actionButtons = useMemo<GridActionButtonMap>(() => (
        Object.keys(actionEntries).reduce<GridActionButtonMap>((acc, key) => {
            acc[key] = createActionButton(key);
            return acc;
        }, {})
    ), [actionEntries, createActionButton]);

    const actionRenderContext = useMemo<GridActionRenderContext>(() => ({
        actionType: activeAction?.type || "add",
        record: actionRecord,
        key: actionKey,
        index: actionIndex,
        isNewRecord,
        Actions: actionButtons,
        action: openAction,
        close: closeAction,
        save: handleActionSave,
        remove: handleActionDelete,
    }), [activeAction?.type, actionButtons, actionIndex, actionKey, actionRecord, closeAction, handleActionDelete, handleActionSave, isNewRecord, openAction]);

    const headerContext = useMemo<GridHeaderContext>(() => ({
        title,
        Actions: actionButtons,
        records: sourceRecords,
        selectedKeys: selectedActionKeys,
        selectedRecords: internalSelectedRecords,
        clearSelection,
    }), [actionButtons, clearSelection, internalSelectedRecords, selectedActionKeys, sourceRecords, title]);

    const footerContext = useMemo<GridFooterContext>(() => ({
        Actions: actionButtons,
        records: sourceRecords,
        selectedKeys: selectedActionKeys,
        selectedRecords: internalSelectedRecords,
        clearSelection,
    }), [actionButtons, clearSelection, internalSelectedRecords, selectedActionKeys, sourceRecords]);

    const handleClick = useCallback((record: RecordProps) => {
        const sourceRecord = resolveSourceRecord(record);

        if (!sourceRecord) {
            console.error("Grid.handleClick: no matching source record found");
            return;
        }

        const nextRecord = safeClone(sourceRecord);
        onClick?.(nextRecord);

        if (nextRecord?._key && activeAction?.type === "edit" && activeAction.record?._key === nextRecord._key) {
            closeAction();
            return;
        }

        if (nextRecord?._key && canEdit && !isActionDisabled(editAction, nextRecord)) {
            openAction("edit", nextRecord);
        }
    }, [resolveSourceRecord, onClick, activeAction, closeAction, canEdit, editAction, openAction]);

    const handleSelectionChange = useCallback((selection: TableSelectionState | GallerySelectionState) => {
        const nextSourceRecords = selection.records
            .map((record) => resolveSourceRecord(record))
            .filter(Boolean)
            .map((record) => safeClone(record!));

        updateInternalSelection(selection.keys, nextSourceRecords);

        onSelectionChange?.({
            ...selection,
            records: nextSourceRecords,
            clear: () => clearSelection(),
        });
    }, [clearSelection, onSelectionChange, resolveSourceRecord, updateInternalSelection]);

    const handleReorder = useCallback((reorderedDisplayRecords: RecordArray, meta: TableReorderMeta) => {
        const reorderedRecords = reorderedDisplayRecords
            .map((record) => resolveSourceRecord(record))
            .filter(Boolean)
            .map((record) => safeClone(record!));

        const movedRecord = resolveSourceRecord(meta.record);

        onReorder?.(reorderedRecords, {
            ...meta,
            record: movedRecord ? safeClone(movedRecord) : meta.record,
        });
    }, [onReorder, resolveSourceRecord]);

    const setFormRefCallback = useCallback((ref: FormRef | null) => {
        formRef.current = ref ?? undefined;
    }, []);

    const handleModalSave = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        return formRef.current?.handleSave(event) ?? Promise.resolve(false);
    }, []);

    const displayComponent = useMemo(() => {
        const interactive = (onClick || canEdit) ? handleClick : undefined;

        if (view === "gallery") {
            return (
                <Gallery
                    body={displayRecords}
                    onClick={interactive}
                    onSelectionChange={onSelectionChange || selectedKeys !== undefined ? handleSelectionChange : undefined}
                    selectedKeys={selectedKeys}
                    sortable={sortingEnabled ? (sortableOrder || initialViewOrder || true) : false}
                    pagination={pagination}
                    wrapClass={theme.Grid.Gallery.wrapClass}
                    scrollClass={theme.Grid.Gallery.scrollClass}
                    headerClass={theme.Grid.Gallery.headerClass}
                    bodyClass={theme.Grid.Gallery.bodyClass}
                    footerClass={theme.Grid.Gallery.footerClass}
                    selectedClass={!canEdit ? theme.Grid.Gallery.selectedClass : undefined}
                    gutterSize={theme.Grid.Gallery.gutterSize}
                    rowCols={theme.Grid.Gallery.rowCols}
                    groupBy={groupBy}
                />
            );
        }

        return (
            <Table
                header={tableHeaders}
                body={displayRecords}
                onClick={interactive}
                onSelectionChange={onSelectionChange || selectedKeys !== undefined ? handleSelectionChange : undefined}
                onReorder={onReorder ? handleReorder : undefined}
                activeKey={activeAction?.type === "edit" ? (activeAction.record?._key ?? null) : null}
                selectedKeys={selectedKeys}
                sortable={sortingEnabled ? (sortableOrder || initialViewOrder || true) : false}
                pagination={pagination}
                wrapClass={theme.Grid.Table.wrapClass}
                className={theme.Grid.Table.className}
                headerClass={theme.Grid.Table.headerClass}
                bodyClass={theme.Grid.Table.bodyClass}
                footerClass={theme.Grid.Table.footerClass}
                scrollClass={theme.Grid.Table.scrollClass}
                selectedClass={!canEdit ? theme.Grid.Table.selectedClass : undefined}
            />
        );
    }, [
        view,
        displayRecords,
        onClick,
        canEdit,
        handleClick,
        onSelectionChange,
        selectedKeys,
        handleSelectionChange,
        initialViewOrder,
        pagination,
        theme,
        groupBy,
        tableHeaders,
        onReorder,
        handleReorder,
        sortingEnabled,
    ]);

    const resolveActionHeader = useCallback((type: GridActionName, record?: RecordProps) => {
        const config = getActionConfig(actionEntries[type]);
        const actionCtx: GridActionRenderContext = {
            ...actionRenderContext,
            actionType: type,
            record,
            key: record?._key,
            index: record?._index,
            isNewRecord: !record?._key,
        };

        if (config?.header !== undefined) {
            return typeof config.header === "function" ? config.header(actionCtx) : config.header;
        }

        if (type === "add") return theme.Grid.i18n.headerAdd || "Add record";
        if (type === "edit") return theme.Grid.i18n.headerEdit || "Edit record";
        if (type === "delete") return "Delete record";
        return converter.toCamel(type, " ");
    }, [actionEntries, actionRenderContext, theme.Grid.i18n.headerAdd, theme.Grid.i18n.headerEdit]);

    const renderDefaultFormNode = useCallback((record?: RecordProps): React.ReactNode => {
        const formNode = resolveRenderer(form, {
            ...actionRenderContext,
            actionType: activeAction?.type || "add",
            record,
            key: record?._key,
            index: record?._index,
            isNewRecord: !record?._key,
        });

        if (!formNode || !React.isValidElement(formNode)) return formNode;

        const { _key, ...defaultValues } = record || {};

        return (
            <Form
                aspect="empty"
                defaultValues={defaultValues}
                savePath={({ record: nextRecord }: { record: RecordProps }) => (
                    resolvedSourcePath
                        ? _key
                            ? `${resolvedSourcePath}/${_key}`
                            : `${resolvedSourcePath}/${createRecordKey?.(nextRecord) ?? Date.now()}`
                        : undefined
                )}
                log={audit}
                onSave={onSave}
                onDelete={onDelete}
                onFinally={async ({ record: nextRecord, action }) => {
                    const success = await onAfterAction?.({ record: nextRecord, action }) ?? true;
                    if (success) closeAction();
                    return success;
                }}
                ref={setFormRefCallback}
            >
                {formNode}
            </Form>
        );
    }, [actionRenderContext, activeAction?.type, audit, closeAction, createRecordKey, form, onAfterAction, onDelete, onSave, resolvedSourcePath, setFormRefCallback]);

    const activeActionConfig = activeAction ? getActionConfig(actionEntries[activeAction.type]) : undefined;
    const activeActionModalConfig = getModalConfig(activeActionConfig?.mode);
    const activeActionUsesExternalShell = activeActionConfig?.mode === null;

    const activeActionNode = useMemo(() => {
        if (!activeAction) return null;

        const config = activeActionConfig;
        const rendererNode = resolveRenderer(config?.render, actionRenderContext);

        if (rendererNode) return rendererNode;
        if (activeAction.type === "delete") {
            return (
                <div className="space-y-2">
                    <p>Delete this record?</p>
                    {activeAction.record?._key && <p className="text-sm text-muted-foreground">Key: {activeAction.record._key}</p>}
                </div>
            );
        }

        if (activeAction.type === "add" || activeAction.type === "edit") {
            return renderDefaultFormNode(activeAction.record);
        }

        return null;
    }, [activeAction, activeActionConfig, actionRenderContext, renderDefaultFormNode]);

    const usesDefaultActionForm = !!activeAction && (activeAction.type === "add" || activeAction.type === "edit") && !activeActionConfig?.render;
    const usesDefaultDeleteConfirm = !!activeAction && activeAction.type === "delete" && !activeActionConfig?.render;
    const resolvedHeader = useMemo(() => {
        if (header !== undefined) {
            return typeof header === "function" ? header(headerContext) : header;
        }

        if (!title && !canAdd) return undefined;

        return (
            <>
                {title || <span />}
                {canAdd && actionButtons.add && (
                    <span className="flex flex-wrap items-center gap-2">
                        {React.createElement(actionButtons.add)}
                    </span>
                )}
            </>
        );
    }, [actionButtons, canAdd, header, headerContext, title]);

    const resolvedFooter = useMemo(() => {
        if (footer !== undefined) {
            return typeof footer === "function" ? footer(footerContext) : footer;
        }

        return undefined;
    }, [footer, footerContext]);

    return (
        <>
            <Card
                wrapClass={wrapClass}
                header={resolvedHeader}
                footer={resolvedFooter}
                className={(theme.Grid.Card.className + (sticky ? " sticky-" + sticky : "")).trim()}
                headerClass={theme.Grid.Card.headerClass}
                bodyClass={theme.Grid.Card.bodyClass}
                footerClass={theme.Grid.Card.footerClass}
                showLoader={loader || loading}
                showArrow={theme.Grid.Card.showArrow}
            >
                {displayComponent}
            </Card>
            {activeAction && !activeActionUsesExternalShell && (
                <Modal
                    size={activeActionModalConfig?.size || theme.Grid.Modal.size}
                    position={activeActionModalConfig?.position || theme.Grid.Modal.position}
                    header={resolveActionHeader(activeAction.type, activeAction.record)}
                    onClose={closeAction}
                    onSave={usesDefaultActionForm ? handleModalSave : undefined}
                    onDelete={usesDefaultDeleteConfirm ? handleActionDelete : undefined}
                    wrapClass={theme.Grid.Modal.wrapClass}
                    className={theme.Grid.Modal.className}
                    headerClass={theme.Grid.Modal.headerClass}
                    titleClass={theme.Grid.Modal.titleClass}
                    bodyClass={theme.Grid.Modal.bodyClass}
                    footerClass={theme.Grid.Modal.footerClass}
                >
                    {activeActionNode}
                </Modal>
            )}
            {activeAction && activeActionUsesExternalShell && activeActionNode}
        </>
    );
};

export default Grid;
