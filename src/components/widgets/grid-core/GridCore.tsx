import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../Theme";
import { useI18n } from "../../../I18n";
import { useDataProvider } from "../../../providers/data/DataProviderContext";
import Card from "../../ui/Card";
import Modal from "../../ui/Modal";
import { ActionButton, buttonPrimaryClass } from "../../ui/Buttons";
import { Dropdown } from "../../blocks/Dropdown";
import { type GalleryOverlay } from "../../ui/Gallery";
import { getRecordValue } from "../../../libs/utils";
import { type RecordProps } from "../../../providers/data/DataProvider";
import GridGalleryView from "./GridGalleryView";
import GridTableView from "./GridTableView";
import {
    type GridAction,
    type GridActionContext,
    type GridCoreProps,
    type GridFooterContext,
    type GridGalleryField,
    type GridHeaderContext,
    type GridLayout,
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
    context: GridActionContext<TRecord> | GridModalActionContext<TRecord>,
    deleteConfirmLabel: string,
    labels?: { add?: string }
) => {
    if (action?.kind === "delete") {
        if (typeof action.title === "function") return action.title(context as GridModalActionContext<TRecord>);
        return action.title || deleteConfirmLabel;
    }
    if (action?.kind === "modal") {
        if (typeof action.title === "function") return action.title(context as GridModalActionContext<TRecord>);
        return action.title || getActionLabel(actionKey, action, labels);
    }
    return getActionLabel(actionKey, action, labels);
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
    views,
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
    const dict = useI18n('grid');
    const gridLabels = useMemo(() => ({ add: dict.buttonAdd }), [dict.buttonAdd]);
    const db = useDataProvider();
    const { preparedRecords, loading: preparedRecordsLoading } = useGridPreparedRecords({ records, onLoad });
    const inferredColumns = useGridColumns({ columns, records: preparedRecords, form });

    // Every Table/Gallery-view-switching concern lives under one `views` input instead of
    // a flat spray of booleans — `toggle` for the switch itself, `table`/`gallery` for the
    // options specific to each (column picker vs. gallery field picker are deliberately
    // two distinct controls: a card doesn't need to show the same fields as a table row).
    const viewsConfig = views ?? {};
    const tableViewConfig = viewsConfig.table ?? {};
    const galleryViewConfig = viewsConfig.gallery ?? {};

    // `view` is the initial/default display mode. When `views.toggle` is enabled, the
    // user can switch at runtime — `resolvedView` tracks that, re-synced if the caller
    // changes `view` from outside (e.g. a controlled parent).
    const [resolvedView, setResolvedView] = useState<GridLayout>(view);
    useEffect(() => { setResolvedView(view); }, [view]);

    // Column visibility (opt-in via `views.table.columnPicker`) — tracks HIDDEN keys
    // rather than visible ones, seeded once from each column's `defaultVisible`. Table
    // view only; gallery has its own separate field-visibility state below.
    const [hiddenColumnKeys, setHiddenColumnKeys] = useState<Set<string>>(
        () => new Set(inferredColumns.filter((c) => c.defaultVisible === false).map((c) => String(c.key)))
    );
    const toggleColumnVisibility = useCallback((key: string) => {
        setHiddenColumnKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key); else next.add(key);
            return next;
        });
    }, []);
    const displayedColumns = useMemo(
        () => inferredColumns.filter((c) => !hiddenColumnKeys.has(String(c.key))),
        [inferredColumns, hiddenColumnKeys]
    );

    // Gallery field visibility (opt-in via `views.gallery.fieldPicker`) — same
    // hidden-keys-set pattern as the table's column picker, but a completely separate
    // state: a gallery card commonly shows fewer/different fields than a table row.
    const galleryFields = galleryViewConfig.fields ?? [];
    const [hiddenGalleryFieldKeys, setHiddenGalleryFieldKeys] = useState<Set<string>>(
        () => new Set(galleryFields.filter((f) => f.defaultVisible === false).map((f) => String(f.key)))
    );
    const toggleGalleryFieldVisibility = useCallback((key: string) => {
        setHiddenGalleryFieldKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key); else next.add(key);
            return next;
        });
    }, []);
    const visibleGalleryFields = useMemo(
        () => galleryFields.filter((f) => !hiddenGalleryFieldKeys.has(String(f.key))),
        [galleryFields, hiddenGalleryFieldKeys]
    );
    // `views.gallery.overlays` is an escape hatch for things `fields` can't express (an
    // interactive action button, not just a read-only label) — ADDITIVE to whatever
    // `fields` generates, not a replacement: a caller commonly needs both (e.g. a Delete
    // button AND checkable label fields) at once. Visible `fields` are grouped by
    // `position` (default "bottomLeft") into one overlay block per position; positions
    // used by both `overlays` and `fields` simply stack (custom overlay rendered first).
    const resolvedGalleryOverlays: GalleryOverlay[] | undefined = useMemo(() => {
        const fieldOverlays: GalleryOverlay[] = [];
        if (visibleGalleryFields.length) {
            const byPosition = new Map<string, GridGalleryField<TRecord>[]>();
            visibleGalleryFields.forEach((f) => {
                const position = f.position ?? "bottomLeft";
                if (!byPosition.has(position)) byPosition.set(position, []);
                byPosition.get(position)!.push(f);
            });
            fieldOverlays.push(...Array.from(byPosition.entries()).map(([position, fields]) => ({
                position: position as GalleryOverlay["position"],
                render: (item: RecordProps) => (
                    <div className="w-full space-y-0.5 bg-background/90 px-2 py-1 text-xs">
                        {fields.map((f) => {
                            const value = getRecordValue(item, String(f.key));
                            return (
                                <div key={String(f.key)} className="truncate font-medium">
                                    {f.render ? f.render(value, item as TRecord) : String(value ?? "")}
                                </div>
                            );
                        })}
                    </div>
                ),
            })));
        }
        const combined = [...(galleryViewConfig.overlays ?? []), ...fieldOverlays];
        return combined.length ? combined : undefined;
    }, [galleryViewConfig.overlays, visibleGalleryFields]);
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
        formController,
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
    // A `form` is only needed to open the built-in inline "modal" edit action — `route`
    // (navigate to an edit page), `external`, and `inline` edit actions don't render any
    // in-place form at all, so gating row-click on `form` for those unconditionally
    // disabled click-to-edit for a very common pattern (Grid used purely as a list, with
    // a dedicated edit page navigated to via `{ kind: 'route' }`).
    const editAction = normalizedActions.edit;
    const canOpenEditFromRow = !!editAction && (editAction.kind !== "modal" || !!form);

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
                label={getActionLabel(actionKey, action, gridLabels)}
                disabled={isActionDisabled(action, record)}
                onClick={() => runAction(actionKey, record)}
            />
        );
    }, [normalizedActions, runAction, gridLabels]);

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

    // Built-in Table/Gallery switch — opt-in via `views.toggle`. Note: only rendered when
    // the caller relies on the default header (i.e. doesn't pass its own `header` prop);
    // a fully custom `header` bypasses these controls, same as it already bypasses
    // `headerActionKeys` today.
    // Each ActionButton's own variant class (`.btn-secondary`/`.btn-outline-secondary`)
    // already carries its own `rounded-md` and (for the outline variant) its own `border` —
    // stacking that on top of the wrapper's single grouping border produced a doubled/uneven
    // border at the seam between the two buttons. `rounded-none border-0` strips both from
    // each button (Tailwind's utilities layer always wins over the `.btn*` components-layer
    // classes — see globals.css), leaving exactly one border: the wrapper's own, plus a
    // single `border-l` divider between the two segments.
    //
    // Active state is a plain "raised pill" (bg-card + shadow), not a named button variant:
    // `--secondary` and `--muted` share the exact same HSL value in every built-in theme, so
    // once Grid's header sits directly on a muted page background (no card box of its own), a
    // `secondary`-filled "active" button becomes visually indistinguishable from the floor
    // behind it — and `primary` (the obvious alternative) reads as too loud/attention-grabbing
    // for a passive view toggle. `bg-card` (the same white the Table/Gallery panel below uses)
    // gives a subtle but reliable lift off the floor in every theme without introducing an
    // accent color. No `variant` prop here — a fully custom className instead, so the base
    // `.btn` sizing/focus-ring still applies but bg/text are ours to control.
    const viewToggleControl = viewsConfig.toggle ? (
        <span className="inline-flex rounded-md border border-border overflow-hidden">
            <ActionButton
                icon="list"
                ariaLabel="Table view"
                title="Table view"
                className={
                    "rounded-none border-0 "
                    + (resolvedView === "table" ? "bg-card text-foreground shadow-sm" : "bg-transparent text-muted-foreground")
                }
                onClick={() => setResolvedView("table")}
            />
            <ActionButton
                icon="layout-grid"
                ariaLabel="Gallery view"
                title="Gallery view"
                className={
                    "rounded-none border-0 border-l border-border "
                    + (resolvedView === "gallery" ? "bg-card text-foreground shadow-sm" : "bg-transparent text-muted-foreground")
                }
                onClick={() => setResolvedView("gallery")}
            />
        </span>
    ) : null;

    // Built-in column-visibility picker — opt-in via `views.table.columnPicker`, table view
    // only. Icon-only trigger (no label): sits to the left of the table/gallery toggle as
    // a compact per-view "configure what's shown" control, not a labeled action. Explicit
    // `triggerClassName` overrides the Dropdown theme's default ('btn btn-outline-primary',
    // meant for generic nav-style menus) — this picker is a neutral peer of the view toggle
    // buttons above, not a primary call-to-action.
    const columnPickerControl = tableViewConfig.columnPicker && resolvedView === "table" ? (
        <Dropdown trigger={{ icon: "columns", title: "Columns" }} triggerClassName="btn btn-outline-secondary" position="end">
            {inferredColumns.map((column) => {
                const key = String(column.key);
                return (
                    <label key={key} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent">
                        <input
                            type="checkbox"
                            checked={!hiddenColumnKeys.has(key)}
                            onChange={() => toggleColumnVisibility(key)}
                        />
                        {column.label}
                    </label>
                );
            })}
        </Dropdown>
    ) : null;

    // Built-in field-visibility picker for gallery cards — opt-in via
    // `views.gallery.fieldPicker`, gallery view only, entirely separate state/UI from
    // the table's column picker above. Icon-only trigger, same rationale as columnPickerControl.
    const fieldPickerControl = galleryViewConfig.fieldPicker && resolvedView === "gallery" && galleryFields.length ? (
        <Dropdown trigger={{ icon: "sliders-horizontal", title: "Fields" }} triggerClassName="btn btn-outline-secondary" position="end">
            {galleryFields.map((field) => {
                const key = String(field.key);
                return (
                    <label key={key} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent">
                        <input
                            type="checkbox"
                            checked={!hiddenGalleryFieldKeys.has(key)}
                            onChange={() => toggleGalleryFieldVisibility(key)}
                        />
                        {field.label}
                    </label>
                );
            })}
        </Dropdown>
    ) : null;

    const resolvedHeader = useMemo(() => {
        if (header !== undefined) {
            return typeof header === "function" ? header(headerContext) : header;
        }
        if (!title && !headerActionKeys.length && !viewToggleControl && !columnPickerControl && !fieldPickerControl) return undefined;

        return (
            <>
                {title || <span />}
                {(headerActionKeys.length || viewToggleControl || columnPickerControl || fieldPickerControl) ? (
                    <span className="flex flex-wrap items-center gap-2">
                        {columnPickerControl}
                        {fieldPickerControl}
                        {viewToggleControl}
                        {headerActionKeys.map((actionKey) => (
                            <React.Fragment key={actionKey}>
                                {actionButton(actionKey)}
                            </React.Fragment>
                        ))}
                    </span>
                ) : null}
            </>
        );
    }, [actionButton, header, headerActionKeys, headerContext, title, viewToggleControl, columnPickerControl, fieldPickerControl]);

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
            >
                {resolvedView === "gallery" ? (
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
                        columns={galleryViewConfig.columns}
                        overlays={resolvedGalleryOverlays}
                    />
                ) : (
                    <GridTableView
                        records={preparedRecords}
                        recordId={recordId}
                        columns={displayedColumns}
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
                            : getActionContext(activeAction.actionKey, activeAction.record),
                        dict.deleteConfirm,
                        gridLabels
                    )}
                    onClose={close}
                    onSave={
                        activeActionConfig.kind === "modal"
                        && activeActionConfig.footer === undefined
                        && (activeAction.actionKey === "add" || activeAction.actionKey === "edit")
                            ? (event) => formController.save(event)
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


