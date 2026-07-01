import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "../Form";
import { useFormController } from "../form-controller";
import { type DataProviderAdapter, type RecordProps } from "../../../providers/data/DataProvider";
import {
    type GridAction,
    type GridActionContext,
    type GridActions,
    type GridFormContext,
    type GridModalActionContext,
    type GridRecordKey,
} from "./types";
import {
    getActionLabel,
    getRecordKeyResolver,
    isActionDisabled,
    isActionVisible,
    normalizeActions,
    sanitizeHashPart,
} from "./utils";

export type GridActiveAction<TRecord extends RecordProps> = {
    actionKey: string;
    record?: TRecord;
};

type UseGridActionsArgs<TRecord extends RecordProps> = {
    actions?: GridActions<TRecord>;
    form?: React.ReactElement | ((ctx: GridFormContext<TRecord>) => React.ReactNode);
    editDeepLink?: boolean;
    preparedRecords: TRecord[];
    recordId: GridRecordKey<TRecord>;
    sourcePath?: string;
    db: DataProviderAdapter;
    onSave?: (args: { record?: TRecord; action: "create" | "update"; storagePath?: string }) => Promise<string | undefined>;
    onDelete?: (args: { record?: TRecord }) => Promise<string | undefined>;
    onComplete?: (args: { record?: TRecord; action: "create" | "update" | "delete" }) => Promise<boolean>;
    audit?: boolean;
};

type InternalGridActionContext<TRecord extends RecordProps> = GridActionContext<TRecord> & {
    close: () => void;
    save: () => Promise<boolean>;
    remove: () => Promise<boolean>;
};

function useGridActions<TRecord extends RecordProps>({
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
    audit = false,
}: UseGridActionsArgs<TRecord>) {
    const location = useLocation();
    const navigate = useNavigate();
    const reactId = useId();
    const formController = useFormController();
    const getRecordKey = useMemo(() => getRecordKeyResolver(recordId), [recordId]);
    const normalizedActions = useMemo(() => normalizeActions(actions, !!form), [actions, form]);
    const [activeAction, setActiveAction] = useState<GridActiveAction<TRecord> | null>(null);
    const gridHashId = useMemo(() => {
        const sourceId = sourcePath || "grid-records";
        return `${sanitizeHashPart(sourceId)}-${sanitizeHashPart(reactId)}`;
    }, [reactId, sourcePath]);

    const close = useCallback(() => {
        setActiveAction(null);
        if (editDeepLink && location.hash.startsWith(`#${gridHashId}:`)) {
            navigate({ pathname: location.pathname, search: location.search, hash: "" }, { replace: true });
        }
    }, [editDeepLink, gridHashId, location.hash, location.pathname, location.search, navigate]);

    const removeRecord = useCallback(async (record: TRecord, closeOnSuccess = true) => {
        const storagePath = onDelete
            ? await onDelete({ record })
            : sourcePath
                ? `${sourcePath}/${getRecordKey(record)}`
                : undefined;
        if (!storagePath && !onDelete) return false;
        if (storagePath) await db.remove(storagePath);
        const result = await onComplete?.({ record, action: "delete" }) ?? true;
        if (result && closeOnSuccess) close();
        return result;
    }, [close, db, getRecordKey, onComplete, onDelete, sourcePath]);

    const saveCurrentAction = useCallback(async () => formController.save(), [formController]);

    const runAction = useCallback(async (actionKey: string, record?: TRecord) => {
        const action = normalizedActions[actionKey];
        if (!action) return;
        if (!isActionVisible(action, record) || isActionDisabled(action, record)) return;

        const context: InternalGridActionContext<TRecord> = {
            actionKey,
            record,
            recordKey: record ? getRecordKey(record) : undefined,
            rowIndex: record?._index,
            isNewRecord: !record,
            close,
            save: saveCurrentAction,
            remove: async () => {
                if (!record) return false;
                return removeRecord(record, true);
            },
            runAction: (nextActionKey: string, nextRecord?: TRecord) => runAction(nextActionKey, nextRecord),
        };

        if (action.kind === "route") {
            const target = typeof action.to === "function" ? action.to(context) : action.to;
            navigate(target);
            return;
        }

        if (action.kind === "external") {
            const target = typeof action.href === "function" ? action.href(context) : action.href;
            window.open(target, "_blank", "noopener,noreferrer");
            return;
        }

        if (action.kind === "inline") {
            await action.run(context);
            return;
        }

        if (actionKey === "edit" && editDeepLink && record) {
            navigate({ hash: `${gridHashId}:${encodeURIComponent(getRecordKey(record))}` }, { replace: false });
        }

        setActiveAction({ actionKey, record });
    }, [close, editDeepLink, getRecordKey, gridHashId, navigate, normalizedActions, removeRecord, saveCurrentAction]);

    const getActionContext = useCallback((actionKey: string, record?: TRecord): GridActionContext<TRecord> => ({
        actionKey,
        record,
        recordKey: record ? getRecordKey(record) : undefined,
        rowIndex: record?._index,
        isNewRecord: !record,
        runAction: (nextActionKey: string, nextRecord?: TRecord) => runAction(nextActionKey, nextRecord),
    }), [getRecordKey, runAction]);

    const runModalAction = useCallback(async (actionKey: string) => {
        const record = activeAction?.record;

        if (actionKey === "cancel") {
            close();
            return;
        }

        if (actionKey === "save") {
            await saveCurrentAction();
            return;
        }

        if (actionKey === "remove") {
            if (!record) return;
            await removeRecord(record, true);
            return;
        }

        await runAction(actionKey, record);
    }, [activeAction?.record, close, removeRecord, runAction, saveCurrentAction]);

    const getModalActionContext = useCallback((actionKey: string, record?: TRecord): GridModalActionContext<TRecord> => ({
        actionKey,
        record,
        recordKey: record ? getRecordKey(record) : undefined,
        rowIndex: record?._index,
        isNewRecord: !record,
        runAction: (nextActionKey: string) => {
            void runModalAction(nextActionKey);
        },
    }), [getRecordKey, runModalAction]);

    useEffect(() => {
        if (!editDeepLink) return;

        const hash = location.hash.replace(/^#/, "");
        const prefix = `${gridHashId}:`;
        if (!hash.startsWith(prefix)) {
            if (activeAction?.actionKey === "edit") setActiveAction(null);
            return;
        }

        const decodedRecordKey = decodeURIComponent(hash.slice(prefix.length));
        const nextRecord = preparedRecords.find((record) => getRecordKey(record) === decodedRecordKey);
        if (nextRecord) {
            setActiveAction((current) => (
                current?.actionKey === "edit" && current.record && getRecordKey(current.record) === decodedRecordKey
                    ? current
                    : { actionKey: "edit", record: nextRecord }
            ));
        }
    }, [activeAction?.actionKey, editDeepLink, getRecordKey, gridHashId, location.hash, preparedRecords]);

    const activeActionConfig = activeAction ? normalizedActions[activeAction.actionKey] : undefined;

    const activeActionBody = useMemo(() => {
        if (!activeAction || !activeActionConfig) return null;
        const actionContext = getActionContext(activeAction.actionKey, activeAction.record);
        const modalContext = getModalActionContext(activeAction.actionKey, activeAction.record);

        if (activeActionConfig.kind === "delete") {
            if (typeof activeActionConfig.body === "function") return activeActionConfig.body(modalContext);
            if (activeActionConfig.body !== undefined) return activeActionConfig.body;
            return (
                <div className="space-y-2">
                    <p>Delete this record?</p>
                    {activeAction.record && <p className="text-sm text-muted-foreground">{getRecordKey(activeAction.record)}</p>}
                </div>
            );
        }

        if ((activeAction.actionKey === "add" || activeAction.actionKey === "edit") && form) {
            const formNode = activeActionConfig.kind === "modal" && activeActionConfig.body !== undefined
                ? (typeof activeActionConfig.body === "function"
                    ? activeActionConfig.body(modalContext)
                    : activeActionConfig.body)
                : (typeof form === "function"
                    ? form({ ...actionContext, record: activeAction.record })
                    : form);
            if (!React.isValidElement(formNode)) return formNode;

            return (
                <Form
                    appearance="empty"
                    controller={formController}
                    defaultValues={activeAction.record}
                    log={audit}
                    onSave={onSave ? async ({ record, action, storagePath }) => (
                        onSave({
                            record: record as TRecord | undefined,
                            action,
                            storagePath,
                        })
                    ) : undefined}
                    onDelete={onDelete ? async ({ record }) => (
                        onDelete({
                            record: record as TRecord | undefined,
                        })
                    ) : undefined}
                    onComplete={async ({ record, action }) => {
                        const success = await onComplete?.({ record: record as TRecord | undefined, action }) ?? true;
                        if (success) close();
                        return success;
                    }}
                    path={sourcePath}
                >
                    {formNode}
                </Form>
            );
        }

        if (activeActionConfig.kind === "modal" && activeActionConfig.body !== undefined) {
            return typeof activeActionConfig.body === "function"
                ? activeActionConfig.body(modalContext)
                : activeActionConfig.body;
        }

        return null;
    }, [activeAction, activeActionConfig, audit, close, form, formController, getActionContext, getModalActionContext, getRecordKey, onComplete, onDelete, onSave, sourcePath]);

    return {
        normalizedActions,
        activeAction,
        activeActionConfig,
        activeActionBody,
        activeKey: activeAction?.actionKey === "edit" && activeAction.record ? getRecordKey(activeAction.record) : null,
        runAction,
        runModalAction,
        close,
        getActionContext,
        getModalActionContext,
        getRecordKey,
        formController,
        gridHashId,
    };
}

export default useGridActions;
