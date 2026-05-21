import React, { useCallback, useMemo } from "react";
import { useTheme } from "../../../Theme";
import { useDataProvider } from "../../../providers/data/DataProviderContext";
import Card from "../../ui/Card";
import Modal from "../../ui/Modal";
import { ActionButton, buttonPrimaryClass } from "../../ui/Buttons";
import { type RecordProps } from "../../../providers/data/DataProvider";
import GridGalleryView from "./GridGalleryView";
import GridTableView from "./GridTableView";
import {
    type GridAction,
    type GridActionContext,
    type GridCoreProps,
    type GridFooterContext,
    type GridHeaderContext,
} from "./types";
import {
    getActionLabel,
    isActionDisabled,
    isActionVisible,
    resolveInitialOrder,
} from "./utils";
import useGridActions from "./useGridActions";
import useGridColumns from "./useGridColumns";
import useGridPreparedRecords from "./useGridPreparedRecords";
import useGridSelection from "./useGridSelection";

const buildActionTitle = <TRecord extends RecordProps>(actionKey: string, action: GridAction<TRecord> | undefined, context: GridActionContext<TRecord>) => {
    if (action?.kind === "delete") {
        if (typeof action.confirmTitle === "function") return action.confirmTitle(context);
        return action.confirmTitle || "Delete record";
    }
    if (action?.kind === "modal") {
        if (typeof action.title === "function") return action.title(context);
        return action.title || getActionLabel(actionKey, action);
    }
    return getActionLabel(actionKey, action);
};

function GridCore<TRecord extends RecordProps>({
    records,
    recordId,
    sourcePath,
    columns,
    actions,
    form,
    routeSync,
    header,
    footer,
    layout = "table",
    sticky,
    wrapClass,
    loading = false,
    title,
    sortable = true,
    pagination,
    selection = false,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    onClickRow,
    reorderable = false,
    onReorder,
    groupBy,
    onSave,
    onDelete,
    onAfterAction,
    createRecordKey,
    audit = false,
    transformRecords,
}: GridCoreProps<TRecord>) {
    const theme = useTheme("grid");
    const db = useDataProvider();
    const { preparedRecords, loading: preparedRecordsLoading } = useGridPreparedRecords({ records, transformRecords });
    const inferredColumns = useGridColumns({ columns, records: preparedRecords, form });
    const { activeSelectionKeys, selectionState, handleSelectionChange } = useGridSelection({
        selectedKeys,
        defaultSelectedKeys,
        onSelectionChange,
    });
    const {
        normalizedActions,
        activeAction,
        activeActionConfig,
        activeActionNode,
        activeKey,
        open,
        close,
        getActionContext,
        getRecordKey,
        formRef,
    } = useGridActions({
        actions,
        form,
        routeSync,
        preparedRecords,
        recordId,
        sourcePath,
        db,
        onSave,
        onDelete,
        onAfterAction,
        createRecordKey,
        audit,
    });
    const canOpenEditFromRow = !!normalizedActions.edit && !!form;

    const handleRowClick = useCallback((record: TRecord) => {
        onClickRow?.(record);

        if (!canOpenEditFromRow) return;
        const recordKey = getRecordKey(record);
        if (activeAction?.actionKey === "edit" && activeAction.record && getRecordKey(activeAction.record) === recordKey) {
            close();
            return;
        }
        open("edit", record);
    }, [activeAction?.actionKey, activeAction?.record, canOpenEditFromRow, close, getRecordKey, onClickRow, open]);

    const rowClickHandler = onClickRow || canOpenEditFromRow
        ? handleRowClick
        : undefined;

    const actionButton = useCallback((actionKey: string, record?: TRecord, className?: string) => {
        const action = normalizedActions[actionKey];
        if (!action || !isActionVisible(action, record)) return null;
        return (
            <ActionButton
                className={className || (actionKey === "add" ? buttonPrimaryClass : undefined)}
                icon={action.icon}
                label={getActionLabel(actionKey, action)}
                disabled={isActionDisabled(action, record)}
                onClick={() => open(actionKey, record)}
            />
        );
    }, [normalizedActions, open]);

    const headerActionKeys = useMemo(() => {
        return Object.entries(normalizedActions)
            .filter(([actionKey, action]) => actionKey !== "edit" && actionKey !== "delete" && isActionVisible(action, undefined))
            .map(([actionKey]) => actionKey);
    }, [normalizedActions]);

    const headerContext = useMemo<GridHeaderContext<TRecord>>(() => ({
        title,
        records: preparedRecords,
        selection: selectionState,
        open,
    }), [open, preparedRecords, selectionState, title]);

    const footerContext = useMemo<GridFooterContext<TRecord>>(() => ({
        records: preparedRecords,
        selection: selectionState,
        open,
    }), [open, preparedRecords, selectionState]);

    const resolvedHeader = useMemo(() => {
        if (header !== undefined) {
            return typeof header === "function" ? header(headerContext) : header;
        }
        if (!title && !headerActionKeys.length) return undefined;

        return (
            <>
                {title || <span />}
                {headerActionKeys.length ? (
                    <span className="flex flex-wrap items-center gap-2">
                        {headerActionKeys.map((actionKey) => (
                            <React.Fragment key={actionKey}>
                                {actionButton(actionKey)}
                            </React.Fragment>
                        ))}
                    </span>
                ) : null}
            </>
        );
    }, [actionButton, header, headerActionKeys, headerContext, title]);

    const resolvedFooter = useMemo(() => {
        if (footer !== undefined) {
            return typeof footer === "function" ? footer(footerContext) : footer;
        }
        return undefined;
    }, [footer, footerContext]);

    const initialSort = resolveInitialOrder(sortable);

    return (
        <>
            <Card
                wrapClass={wrapClass}
                header={resolvedHeader}
                footer={resolvedFooter}
                className={(theme.Grid.Card.className + (sticky ? ` sticky-${sticky}` : "")).trim()}
                headerClass={theme.Grid.Card.headerClass}
                bodyClass={theme.Grid.Card.bodyClass}
                footerClass={theme.Grid.Card.footerClass}
                showLoader={loading || preparedRecordsLoading}
                showArrow={theme.Grid.Card.showArrow}
            >
                {layout === "gallery" ? (
                    <GridGalleryView
                        records={preparedRecords}
                        recordId={recordId}
                        sortable={initialSort || sortable}
                        pagination={pagination}
                        selection={selection}
                        selectedKeys={activeSelectionKeys}
                        onSelectionChange={handleSelectionChange}
                        onClickRow={rowClickHandler}
                        groupBy={groupBy}
                        wrapClass={theme.Grid.Gallery.wrapClass}
                    />
                ) : (
                    <GridTableView
                        records={preparedRecords}
                        recordId={recordId}
                        columns={inferredColumns}
                        sortable={initialSort || sortable}
                        pagination={pagination}
                        selection={selection}
                        selectedKeys={activeSelectionKeys}
                        onSelectionChange={handleSelectionChange}
                        onClickRow={rowClickHandler}
                        reorderable={reorderable}
                        onReorder={onReorder}
                        activeKey={activeKey}
                        wrapClass={theme.Grid.Table.wrapClass}
                    />
                )}
            </Card>
            {activeAction && activeActionConfig && (activeActionConfig.kind === "modal" || activeActionConfig.kind === "delete") && (
                <Modal
                    size={
                        activeActionConfig.kind === "modal" || activeActionConfig.kind === "delete"
                            ? activeActionConfig.size || theme.Grid.Modal.size
                            : theme.Grid.Modal.size
                    }
                    position={
                        activeActionConfig.kind === "modal" || activeActionConfig.kind === "delete"
                            ? activeActionConfig.position || theme.Grid.Modal.position
                            : theme.Grid.Modal.position
                    }
                    header={buildActionTitle(activeAction.actionKey, activeActionConfig, getActionContext(activeAction.actionKey, activeAction.record))}
                    onClose={close}
                    onSave={activeActionConfig.kind === "modal" && (activeAction.actionKey === "add" || activeAction.actionKey === "edit") ? (event) => formRef.current?.handleSave(event) ?? Promise.resolve(false) : undefined}
                    onDelete={activeActionConfig.kind === "delete" ? async () => {
                        const record = activeAction.record;
                        if (!record) return false;
                        const storagePath = onDelete
                            ? await onDelete({ record })
                            : sourcePath
                                ? `${sourcePath}/${getRecordKey(record)}`
                                : undefined;
                        if (!storagePath) return false;
                        await db.remove(storagePath);
                        const success = await onAfterAction?.({ record, action: "delete" }) ?? true;
                        if (success) close();
                        return success;
                    } : undefined}
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
        </>
    );
}

export default GridCore;
