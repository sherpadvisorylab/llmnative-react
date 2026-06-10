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
    type GridModalActionContext,
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

const buildActionTitle = <TRecord extends RecordProps>(
    actionKey: string,
    action: GridAction<TRecord> | undefined,
    context: GridActionContext<TRecord> | GridModalActionContext<TRecord>
) => {
    if (action?.kind === "delete") {
        if (typeof action.title === "function") return action.title(context as GridModalActionContext<TRecord>);
        return action.title || "Delete record";
    }
    if (action?.kind === "modal") {
        if (typeof action.title === "function") return action.title(context as GridModalActionContext<TRecord>);
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
    editDeepLink,
    header,
    footer,
    view = "table",
    sticky,
    wrapperClassName,
    loading = false,
    title,
    before,
    after,
    sortable = true,
    pagination,
    selection,
    onRowClick,
    reorderable = false,
    onReorder,
    groupBy,
    onSave,
    onDelete,
    onComplete,
    audit = false,
    onLoad,
}: GridCoreProps<TRecord>) {
    const theme = useTheme("grid");
    const db = useDataProvider();
    const { preparedRecords, loading: preparedRecordsLoading } = useGridPreparedRecords({ records, onLoad });
    const inferredColumns = useGridColumns({ columns, records: preparedRecords, form });
    const { mode: selectionMode, activeSelectionKeys, selectionState, handleSelectionChange } = useGridSelection({ selection });
    const {
        normalizedActions,
        activeAction,
        activeActionConfig,
        activeActionBody,
        activeKey,
        runAction,
        close,
        getActionContext,
        getModalActionContext,
        getRecordKey,
        formRef,
    } = useGridActions({
        actions,
        form,
        editDeepLink,
        preparedRecords,
        recordId,
        sourcePath,
        db,
        onSave,
        onDelete,
        onComplete,
        audit,
    });
    const canOpenEditFromRow = !!normalizedActions.edit && !!form;

    const handleRowClick = useCallback((record: TRecord) => {
        onRowClick?.(record);

        if (!canOpenEditFromRow) return;
        const recordKey = getRecordKey(record);
        if (activeAction?.actionKey === "edit" && activeAction.record && getRecordKey(activeAction.record) === recordKey) {
            close();
            return;
        }
        runAction("edit", record);
    }, [activeAction?.actionKey, activeAction?.record, canOpenEditFromRow, close, getRecordKey, onRowClick, runAction]);

    const rowClickHandler = onRowClick || canOpenEditFromRow
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
                onClick={() => runAction(actionKey, record)}
            />
        );
    }, [normalizedActions, runAction]);

    const headerActionKeys = useMemo(() => {
        return Object.entries(normalizedActions)
            .filter(([actionKey, action]) => actionKey !== "edit" && actionKey !== "delete" && isActionVisible(action, undefined))
            .map(([actionKey]) => actionKey);
    }, [normalizedActions]);

    const headerContext = useMemo<GridHeaderContext<TRecord>>(() => ({
        title,
        records: preparedRecords,
        selection: selectionState,
        runAction,
    }), [preparedRecords, runAction, selectionState, title]);

    const footerContext = useMemo<GridFooterContext<TRecord>>(() => ({
        records: preparedRecords,
        selection: selectionState,
        runAction,
    }), [preparedRecords, runAction, selectionState]);

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

    const activeModalContext = useMemo(() => {
        if (!activeAction || !activeActionConfig || (activeActionConfig.kind !== "modal" && activeActionConfig.kind !== "delete")) return undefined;
        return getModalActionContext(activeAction.actionKey, activeAction.record);
    }, [activeAction, activeActionConfig, getModalActionContext]);

    const activeModalHeader = useMemo(() => {
        if (!activeActionConfig || (activeActionConfig.kind !== "modal" && activeActionConfig.kind !== "delete") || activeActionConfig.header === undefined || !activeModalContext) {
            return undefined;
        }
        return typeof activeActionConfig.header === "function"
            ? activeActionConfig.header(activeModalContext)
            : activeActionConfig.header;
    }, [activeActionConfig, activeModalContext]);

    const activeModalFooter = useMemo(() => {
        if (!activeActionConfig || (activeActionConfig.kind !== "modal" && activeActionConfig.kind !== "delete")) return undefined;
        if (activeActionConfig.footer === false) return false;
        if (activeActionConfig.footer === undefined || !activeModalContext) return undefined;
        return typeof activeActionConfig.footer === "function"
            ? activeActionConfig.footer(activeModalContext)
            : activeActionConfig.footer;
    }, [activeActionConfig, activeModalContext]);

    const initialSort = resolveInitialOrder(sortable);

    return (
        <>
            <Card
                wrapperClassName={wrapperClassName}
                header={resolvedHeader}
                footer={resolvedFooter}
                className={(theme.Grid.Card.className + (sticky ? ` sticky-${sticky}` : "")).trim()}
                headerClassName={theme.Grid.Card.headerClassName}
                bodyClassName={theme.Grid.Card.bodyClassName}
                footerClassName={theme.Grid.Card.footerClassName}
                loading={loading || preparedRecordsLoading}
                showArrow={theme.Grid.Card.showArrow}
            >
                {view === "gallery" ? (
                    <GridGalleryView
                        records={preparedRecords}
                        recordId={recordId}
                        sortable={initialSort || sortable}
                        pagination={pagination}
                        selection={selectionMode}
                        selectedKeys={activeSelectionKeys}
                        onSelectionChange={selectionMode ? handleSelectionChange : undefined}
                        onRowClick={rowClickHandler}
                        groupBy={groupBy}
                        wrapperClassName={theme.Grid.Gallery.wrapperClassName}
                        before={before}
                        after={after}
                    />
                ) : (
                    <GridTableView
                        records={preparedRecords}
                        recordId={recordId}
                        columns={inferredColumns}
                        runAction={runAction}
                        sortable={initialSort || sortable}
                        pagination={pagination}
                        selection={selectionMode}
                        selectedKeys={activeSelectionKeys}
                        onSelectionChange={selectionMode ? handleSelectionChange : undefined}
                        onRowClick={rowClickHandler}
                        reorderable={reorderable}
                        onReorder={onReorder}
                        activeKey={activeKey}
                        groupBy={groupBy}
                        wrapperClassName={theme.Grid.Table.wrapperClassName}
                        before={before}
                        after={after}
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
                    header={activeModalHeader}
                    title={buildActionTitle(
                        activeAction.actionKey,
                        activeActionConfig,
                        activeActionConfig.kind === "modal" || activeActionConfig.kind === "delete"
                            ? getModalActionContext(activeAction.actionKey, activeAction.record)
                            : getActionContext(activeAction.actionKey, activeAction.record)
                    )}
                    onClose={close}
                    onSave={
                        activeActionConfig.kind === "modal"
                        && activeActionConfig.footer === undefined
                        && (activeAction.actionKey === "add" || activeAction.actionKey === "edit")
                            ? (event) => formRef.current?.handleSave(event) ?? Promise.resolve(false)
                            : undefined
                    }
                    onDelete={
                        activeActionConfig.kind === "delete"
                            ? async () => {
                                const record = activeAction.record;
                                if (!record) return false;
                                const storagePath = onDelete
                                    ? await onDelete({ record })
                                    : sourcePath
                                        ? `${sourcePath}/${getRecordKey(record)}`
                                        : undefined;
                                if (!storagePath && !onDelete) return false;
                                if (storagePath) await db.remove(storagePath);
                                const success = await onComplete?.({ record, action: "delete" }) ?? true;
                                if (success) close();
                                return success;
                            }
                            : activeActionConfig.kind === "modal"
                                && activeActionConfig.footer === undefined
                                && activeAction.actionKey === "edit"
                                && !!activeAction.record
                                && !!normalizedActions.delete
                                    ? async () => {
                                        await getModalActionContext(activeAction.actionKey, activeAction.record).runAction("remove");
                                        return false;
                                    }
                                    : undefined
                    }
                    footer={activeModalFooter}
                    showCancel={
                        activeActionConfig.kind === "modal" || activeActionConfig.kind === "delete"
                            ? activeActionConfig.footer === undefined
                            : true
                    }
                    allowFullscreen={
                        activeActionConfig.kind === "modal" || activeActionConfig.kind === "delete"
                            ? activeActionConfig.allowFullscreen
                            : true
                    }
                    wrapperClassName={theme.Grid.Modal.wrapperClassName}
                    className={theme.Grid.Modal.className}
                    headerClassName={theme.Grid.Modal.headerClassName}
                    titleClassName={theme.Grid.Modal.titleClassName}
                    bodyClassName={theme.Grid.Modal.bodyClassName}
                    footerClassName={theme.Grid.Modal.footerClassName}
                >
                    {activeActionBody}
                </Modal>
            )}
        </>
    );
}

export default GridCore;

