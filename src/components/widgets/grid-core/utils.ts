import React from "react";
import { converter } from "../../../libs/converter";
import { getRecordValue } from "../../../libs/utils";
import { type OrderConfig } from "../../../libs/order";
import { type RecordProps } from "../../../providers/data/DataProvider";
import {
    type GridAction,
    type GridActions,
    type GridCellContext,
    type GridColumn,
    type GridFormat,
    type GridFormContext,
    type GridRecordKey,
} from "./types";

export const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

export const sanitizeHashPart = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

export const getRecordKeyResolver = <TRecord extends RecordProps>(recordId: GridRecordKey<TRecord>) => {
    return (record: TRecord) => {
        if (typeof recordId === "function") return String(recordId(record));
        const value = record[recordId];
        if (value == null || value === "") return "";
        return String(value);
    };
};

export const formatGridValue = (format: GridFormat | undefined, value: unknown) => {
    if (format == null || format === "text") return value as React.ReactNode;
    if (format === "boolean") return value ? "Yes" : "No";
    if (format === "json") return value == null ? "" : JSON.stringify(value, null, 2);
    if (format === "badge") return value as React.ReactNode;
    if (format === "image") return value as React.ReactNode;
    if (format === "email") return value as React.ReactNode;

    const converterKey = format === "datetime" ? "dateTime" : format;
    const formatter = (converter as Record<string, ((value: unknown) => React.ReactNode) | undefined>)[converterKey];
    return formatter ? formatter(value) : value as React.ReactNode;
};

export const renderGridCellValue = <TRecord extends RecordProps>(
    column: GridColumn<TRecord>,
    context: GridCellContext<TRecord>
) => {
    return typeof column.render === "function"
        ? column.render(context)
        : formatGridValue(column.render, context.value);
};

export const buildDisplayRecords = <TRecord extends RecordProps>(
    records: TRecord[],
    columns: GridColumn<TRecord>[],
    runAction: (actionKey: string, record?: TRecord) => void
) => {
    return records.map((record, rowIndex) => {
        const displayRecord: Record<string, unknown> = { ...record, _index: rowIndex };

        for (const column of columns) {
            const columnKey = String(column.key);
            const value = getRecordValue(record, columnKey);
            const context: GridCellContext<TRecord> = {
                record,
                value,
                key: columnKey,
                rowIndex,
                runAction: (actionKey: string) => runAction(actionKey, record),
            };
            displayRecord[columnKey] = renderGridCellValue(column, context);
        }

        return displayRecord as TRecord;
    });
};

const defaultHeader = <TRecord extends RecordProps>(key: string): GridColumn<TRecord> => ({
    key,
    label: converter.toCamel(key, " "),
    sortable: true,
});

const extractFormFieldNames = <T>(
    components: React.ReactNode | React.ReactNode[],
    onField: (props: Record<string, unknown>) => T
): T[] => {
    const result: T[] = [];
    const walk = (nodes: React.ReactNode) => {
        React.Children.forEach(nodes, (child) => {
            if (!React.isValidElement(child)) return;
            const { props } = child as React.ReactElement<Record<string, unknown>>;
            if (props.name) {
                result.push(onField(props));
            } else if (props.children) {
                walk(props.children as React.ReactNode);
            }
        });
    };
    walk(Array.isArray(components) ? components : [components]);
    return result;
};

export const inferColumns = <TRecord extends RecordProps>(
    columns: GridColumn<TRecord>[] | undefined,
    records: TRecord[],
    form: React.ReactElement | ((ctx: GridFormContext<TRecord>) => React.ReactNode) | undefined
) => {
    if (columns?.length) return columns;
    if (React.isValidElement(form)) {
        const formCols = extractFormFieldNames(form, (props) => defaultHeader<TRecord>(props.name as string));
        if (formCols.length > 0) return formCols;
    }
    const firstRecord = records[0];
    if (!firstRecord) return [];

    return Object.entries(firstRecord).reduce<GridColumn<TRecord>[]>((acc, [key, value]) => {
        if (key.startsWith("_")) return acc;
        if (React.isValidElement(value) || typeof value !== "object" || Array.isArray(value)) {
            acc.push(defaultHeader<TRecord>(key));
        }
        return acc;
    }, []);
};

export const normalizeActions = <TRecord extends RecordProps>(
    actions: GridActions<TRecord> | undefined,
    hasForm: boolean
): Record<string, GridAction<TRecord>> => {
    if (Array.isArray(actions)) {
        return actions.reduce<Record<string, GridAction<TRecord>>>((acc, actionKey) => {
            if (actionKey === "delete") {
                acc[actionKey] = { kind: "delete" };
            } else {
                acc[actionKey] = { kind: "modal" };
            }
            return acc;
        }, {});
    }

    if (!actions) {
        return hasForm
            ? {
                add: { kind: "modal" },
                edit: { kind: "modal" },
                delete: { kind: "delete" },
            }
            : {};
    }

    return Object.entries(actions).reduce<Record<string, GridAction<TRecord>>>((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
    }, {});
};

export const isActionVisible = <TRecord extends RecordProps>(action: GridAction<TRecord> | undefined, record?: TRecord) => {
    if (!action?.visible) return true;
    return typeof action.visible === "function" ? action.visible(record) : action.visible;
};

export const isActionDisabled = <TRecord extends RecordProps>(action: GridAction<TRecord> | undefined, record?: TRecord) => {
    if (!action?.disabled) return false;
    return typeof action.disabled === "function" ? action.disabled(record) : action.disabled;
};

export const getActionLabel = (
    actionKey: string,
    action: { label?: string } | undefined,
    labels?: { add?: string; edit?: string; delete?: string }
) => {
    if (action?.label) return action.label;
    if (actionKey === "add") return labels?.add ?? "Add";
    if (actionKey === "edit") return labels?.edit ?? "Edit";
    if (actionKey === "delete") return labels?.delete ?? "Delete";
    return converter.toCamel(actionKey, " ");
};

export const resolveInitialOrder = (sortable: boolean | OrderConfig | undefined) => {
    if (!sortable || typeof sortable === "boolean") return undefined;
    return sortable;
};
