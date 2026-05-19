import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../Theme";
import { type OrderConfig } from "../../libs/order";
import { converter } from "../../libs/converter";
import { getRecordValue, safeClone, trimSlash } from "../../libs/utils";
import { useDataProvider } from "../../providers/data/DataProviderContext";
import { RecordArray, RecordProps } from "../../providers/data/DataProvider";
import { extractComponentProps } from "../FormEnhancer";
import { PaginationParams } from "../ui/Pagination";
import Card from "../ui/Card";
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

export type GridActionConfig = {
    label?: string;
    icon?: string;
    visible?: ActionVisibility;
    disabled?: ActionDisabled;
};

export type GridActionContext = {
    records?: RecordArray;
    selectedKeys: string[];
    selectedRecords: RecordArray;
    clearSelection: () => void;
};

export type GridActions = {
    default?: {
        add?: boolean | GridActionConfig;
        edit?: boolean | GridActionConfig;
        delete?: boolean | GridActionConfig;
    };
    header?: React.ReactNode | ((ctx: GridActionContext) => React.ReactNode);
    footer?: React.ReactNode | ((ctx: GridActionContext) => React.ReactNode);
};

export type GridEditorContext = {
    record?: RecordProps;
    key?: string;
    index?: number;
    close: () => void;
};

export type GridEditor = {
    mode?: "modal" | "inline" | "custom";
    form?: React.ReactNode | ((ctx: GridEditorContext) => React.ReactNode);
    renderHeader?: (record?: RecordProps) => React.ReactNode;
    renderContent?: (ctx: GridEditorContext) => React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
    position?: "center" | "top" | "left" | "right" | "bottom";
};

export type GridProps = {
    providerPath?: string;
    records?: RecordArray;
    columns?: GridColumn[];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    actions?: GridActions;
    editor?: GridEditor;
    view?: "table" | "gallery";
    sortable?: boolean;
    order?: OrderConfig;
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

const Grid = (props: GridProps) => {
    return props.records === undefined
        ? <GridProviderSource {...props} />
        : <GridArray {...props} />;
};

const GridProviderSource = (props: Omit<GridProps, "records">) => {
    const { providerPath, ...rest } = props;
    const location = useLocation();
    const db = useDataProvider();
    const resolvedProviderPath = providerPath || trimSlash(location.pathname);
    const [records, setRecords] = useState<RecordArray | undefined>(undefined);

    db.useListener(resolvedProviderPath, setRecords);

    return <GridArray {...rest} records={records} providerPath={resolvedProviderPath} />;
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

const isActionEnabled = (action: boolean | GridActionConfig | undefined, record?: RecordProps, fallback = false) => {
    if (action === undefined) return fallback;
    if (typeof action === "boolean") return action;
    if (action.visible === undefined) return true;
    return typeof action.visible === "function" ? action.visible(record) : action.visible;
};

const isActionDisabled = (action: boolean | GridActionConfig | undefined, record?: RecordProps) => {
    if (!action || typeof action === "boolean") return false;
    if (action.disabled === undefined) return false;
    return typeof action.disabled === "function" ? action.disabled(record) : action.disabled;
};

const getActionLabel = (action: boolean | GridActionConfig | undefined, fallback: string) => {
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

const GridArray = ({
    columns = undefined,
    providerPath = undefined,
    records = undefined,
    header = undefined,
    footer = undefined,
    actions = undefined,
    editor = undefined,
    view = "table",
    sortable = true,
    order = undefined,
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
    const reactId = useId();
    const gridHashId = useMemo(() => {
        const source = providerPath ? `grid-${trimSlash(providerPath)}` : "grid-records";
        return `${sanitizeHashPart(source)}-${sanitizeHashPart(reactId)}`;
    }, [providerPath, reactId]);

    const [loader, setLoader] = useState(false);
    const [modalData, setModalData] = useState<RecordProps | undefined>(undefined);
    const formRef = useRef<FormRef | undefined>(undefined);
    const [preparedRecords, setPreparedRecords] = useState<RecordArray | undefined>(undefined);
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(selectedKeys || []);
    const [internalSelectedRecords, setInternalSelectedRecords] = useState<RecordArray>([]);

    const editorMode = editor?.mode || "modal";
    const editorEnabled = !!editor?.form || !!editor?.renderContent;
    const hasFormEditor = !!editor?.form;
    const defaultActions = actions?.default;

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
        if (!editorEnabled || !isActionEnabled(defaultActions?.edit, undefined, true)) return;

        const recordKey = getHashRecordKey(location.hash, gridHashId);
        if (!recordKey) {
            if (location.hash) setModalData(undefined);
            return;
        }

        const record = records?.find((item) => item._key === recordKey);
        if (record && !isActionDisabled(defaultActions?.edit, record)) {
            setModalData((current) => (
                current?._key === record._key
                    ? current
                    : safeClone(record)
            ));
        }
    }, [defaultActions?.edit, editorEnabled, gridHashId, location.hash, records]);

    const sourceRecords = useMemo(() => {
        if (!records) return undefined;
        if (transformRecords) return preparedRecords;
        return safeClone(records);
    }, [records, transformRecords, preparedRecords]);

    const tableHeaders: GridColumn[] = useMemo(() => {
        if (columns) return columns;
        if (!sourceRecords || sourceRecords.length === 0) return [];

        return editor?.form && React.isValidElement(editor.form)
            ? extractComponentProps(editor.form, (props) => defaultHeader(props.name))
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
    }, [columns, sourceRecords, editor?.form]);

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

    const canAdd = editorEnabled && isActionEnabled(defaultActions?.add, undefined, true);
    const canEdit = editorEnabled && isActionEnabled(defaultActions?.edit, undefined, true);
    const canDelete = editorEnabled && isActionEnabled(defaultActions?.delete, modalData, true);

    const closeEditor = useCallback(() => {
        setModalData(undefined);
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

    const actionContext = useMemo<GridActionContext>(() => ({
        records: sourceRecords,
        selectedKeys: selectedKeys ?? internalSelectedKeys,
        selectedRecords: internalSelectedRecords,
        clearSelection,
    }), [clearSelection, internalSelectedKeys, internalSelectedRecords, selectedKeys, sourceRecords]);

    const handleClick = useCallback((record: RecordProps) => {
        const sourceRecord = resolveSourceRecord(record);

        if (!sourceRecord) {
            console.error("Grid.handleClick: no matching source record found");
            return;
        }

        const nextRecord = safeClone(sourceRecord);
        onClick?.(nextRecord);

        if (nextRecord?._key && canEdit && !isActionDisabled(defaultActions?.edit, nextRecord)) {
            setModalData(nextRecord);
            navigate({ hash: `${gridHashId}:${encodeURIComponent(nextRecord._key)}` }, { replace: false });
        }
    }, [resolveSourceRecord, onClick, canEdit, defaultActions?.edit, gridHashId, navigate]);

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

    const handleModalDelete = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        return formRef.current?.handleDelete(event) ?? Promise.resolve(false);
    }, []);

    const renderActionSlot = useCallback((slot: GridActions["header"] | GridActions["footer"]) => {
        if (!slot) return null;
        return typeof slot === "function" ? slot(actionContext) : slot;
    }, [actionContext]);

    const headerActions = useMemo(() => renderActionSlot(actions?.header), [actions?.header, renderActionSlot]);
    const footerActions = useMemo(() => renderActionSlot(actions?.footer), [actions?.footer, renderActionSlot]);

    const addButton = useMemo(() => {
        if (!canAdd) return null;

        return (
            <button
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isActionDisabled(defaultActions?.add)}
                onClick={() => setModalData({})}
            >
                {getActionLabel(defaultActions?.add, theme.Grid.i18n.buttonAdd)}
            </button>
        );
    }, [canAdd, defaultActions?.add, theme.Grid.i18n.buttonAdd]);

    const displayComponent = useMemo(() => {
        const interactive = (onClick || canEdit) ? handleClick : undefined;

        if (view === "gallery") {
            return (
                <Gallery
                    body={displayRecords}
                    onClick={interactive}
                    onSelectionChange={onSelectionChange || selectedKeys !== undefined ? handleSelectionChange : undefined}
                    selectedKeys={selectedKeys}
                    order={order}
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
                selectedKeys={selectedKeys}
                sortable={sortable}
                order={sortable ? order : undefined}
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
        order,
        pagination,
        theme,
        groupBy,
        tableHeaders,
        onReorder,
        handleReorder,
        sortable,
    ]);

    const editorContext = useMemo<GridEditorContext>(() => ({
        record: modalData,
        key: modalData?._key,
        index: modalData?._index,
        close: closeEditor,
    }), [closeEditor, modalData]);

    const renderEditorNode = useCallback((): React.ReactNode => {
        if (!modalData || !editorEnabled) return null;

        if (editor?.renderContent) {
            return editor.renderContent(editorContext);
        }

        const formNode = typeof editor?.form === "function"
            ? editor.form(editorContext)
            : editor?.form;

        if (!formNode || !React.isValidElement(formNode)) return formNode;

        const { _key, ...record } = modalData;

        return (
            <Form
                aspect="empty"
                defaultValues={record}
                savePath={({ record }: { record: RecordProps }) => (
                    providerPath
                        ? _key
                            ? `${providerPath}/${_key}`
                            : `${providerPath}/${createRecordKey?.(record) ?? Date.now()}`
                        : undefined
                )}
                log={audit}
                onSave={onSave}
                onDelete={onDelete}
                onFinally={async ({ record, action }) => {
                    const success = await onAfterAction?.({ record, action }) ?? true;
                    if (success) closeEditor();
                    return success;
                }}
                ref={setFormRefCallback}
            >
                {formNode}
            </Form>
        );
    }, [
        audit,
        closeEditor,
        createRecordKey,
        editor,
        editorContext,
        editorEnabled,
        modalData,
        onAfterAction,
        onDelete,
        onSave,
        providerPath,
        setFormRefCallback,
    ]);

    const editorNode = renderEditorNode();
    const currentRecord = modalData;
    const isNewRecord = !modalData?._key;

    const cardFooter = useMemo(() => {
        if (!footer && !footerActions) return undefined;
        if (!footer) return footerActions;
        if (!footerActions) return footer;

        return (
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>{footer}</div>
                <div>{footerActions}</div>
            </div>
        );
    }, [footer, footerActions]);

    const inlineEditor = editorMode === "inline" && modalData ? (
        <div className="mt-4 border-t pt-4">
            {editorNode}
        </div>
    ) : null;

    return (
        <>
            <Card
                wrapClass={wrapClass}
                header={(header || headerActions || addButton) && (
                    <>
                        {header || <span />}
                        {(headerActions || addButton) && (
                            <span className="flex flex-wrap items-center gap-2">
                                {headerActions}
                                {addButton}
                            </span>
                        )}
                    </>
                )}
                footer={cardFooter}
                className={(theme.Grid.Card.className + (sticky ? " sticky-" + sticky : "")).trim()}
                headerClass={theme.Grid.Card.headerClass}
                bodyClass={theme.Grid.Card.bodyClass}
                footerClass={theme.Grid.Card.footerClass}
                showLoader={loader || loading}
                showArrow={theme.Grid.Card.showArrow}
            >
                {displayComponent}
                {inlineEditor}
            </Card>
            {editorMode === "modal" && modalData && (
                <Modal
                    size={editor?.size || theme.Grid.Modal.size}
                    position={editor?.position || theme.Grid.Modal.position}
                    header={editor?.renderHeader?.(currentRecord) || (isNewRecord ? theme.Grid.i18n.headerAdd : theme.Grid.i18n.headerEdit)}
                    onClose={closeEditor}
                    onSave={hasFormEditor ? handleModalSave : undefined}
                    onDelete={hasFormEditor && !isNewRecord && canDelete && !isActionDisabled(defaultActions?.delete, currentRecord) ? handleModalDelete : undefined}
                    wrapClass={theme.Grid.Modal.wrapClass}
                    className={theme.Grid.Modal.className}
                    headerClass={theme.Grid.Modal.headerClass}
                    titleClass={theme.Grid.Modal.titleClass}
                    bodyClass={theme.Grid.Modal.bodyClass}
                    footerClass={theme.Grid.Modal.footerClass}
                >
                    {editorNode}
                </Modal>
            )}
        </>
    );
};

export default Grid;
