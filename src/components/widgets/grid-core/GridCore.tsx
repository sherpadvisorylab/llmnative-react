import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../Theme";
import { useI18n, type I18nDict } from "../../../I18n";
import { useDataProvider } from "../../../providers/data/DataProviderContext";
import Card from "../../ui/Card";
import Modal from "../../ui/Modal";
import Badge from "../../ui/Badge";
import { ActionButton, buttonPrimaryClass } from "../../ui/Buttons";
import { Dropdown } from "../../blocks/Dropdown";
import { type GalleryOverlay } from "../../ui/Gallery";
import { getRecordValue } from "../../../libs/utils";
import { cn } from "../../../libs/cn";
import { type RecordProps } from "../../../providers/data/DataProvider";
import GridGalleryView from "./GridGalleryView";
import GridTableView from "./GridTableView";
import {
    type GridAction,
    type GridActionContext,
    type GridCoreProps,
    type GridFilterConfig,
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

type GridFilterValue = boolean | string | string[] | { from: string; to: string } | { min: number | undefined; max: number | undefined };
type GridFiltersDict = I18nDict["grid"];

const neutralFilterValue = <TRecord extends RecordProps>(f: GridFilterConfig<TRecord>): GridFilterValue => {
    switch (f.kind) {
        case "select": return "";
        case "multiselect": return [];
        case "dateRange": return { from: "", to: "" };
        case "numberRange": return { min: undefined, max: undefined };
        default: return f.defaultValue ?? false;
    }
};

const isFilterActive = <TRecord extends RecordProps>(f: GridFilterConfig<TRecord>, value: GridFilterValue): boolean => {
    switch (f.kind) {
        case "select": return typeof value === "string" && value !== "";
        case "multiselect": return Array.isArray(value) && value.length > 0;
        case "dateRange": {
            const range = value as { from: string; to: string };
            return Boolean(range?.from) || Boolean(range?.to);
        }
        case "numberRange": {
            const range = value as { min: number | undefined; max: number | undefined };
            return range?.min !== undefined || range?.max !== undefined;
        }
        default: return Boolean(value) !== Boolean(f.defaultValue ?? false);
    }
};

const runFilterPredicate = <TRecord extends RecordProps>(f: GridFilterConfig<TRecord>, record: TRecord, value: GridFilterValue): boolean => {
    switch (f.kind) {
        case "select": return f.predicate(record, value as string);
        case "multiselect": return f.predicate(record, value as string[]);
        case "dateRange": return f.predicate(record, value as { from: string; to: string });
        case "numberRange": return f.predicate(record, value as { min: number | undefined; max: number | undefined });
        default: return f.predicate(record, value as boolean);
    }
};

const filterChipLabel = <TRecord extends RecordProps>(f: GridFilterConfig<TRecord>, value: GridFilterValue, dict: GridFiltersDict): string => {
    switch (f.kind) {
        case "select": {
            const option = f.options.find((o) => o.value === value);
            return `${f.label}: ${option?.label ?? String(value)}`;
        }
        case "multiselect": {
            const values = value as string[];
            if (values.length === 1) {
                const option = f.options.find((o) => o.value === values[0]);
                return `${f.label}: ${option?.label ?? values[0]}`;
            }
            return `${f.label}: ${dict.filtersSelectedCountTemplate.replace("{count}", String(values.length))}`;
        }
        case "dateRange": {
            const range = value as { from: string; to: string };
            if (range.from && range.to) return `${f.label}: ${range.from} → ${range.to}`;
            if (range.from) return `${f.label}: ${dict.filtersRangeFrom} ${range.from}`;
            return `${f.label}: ${dict.filtersRangeTo} ${range.to}`;
        }
        case "numberRange": {
            const range = value as { min: number | undefined; max: number | undefined };
            if (range.min !== undefined && range.max !== undefined) return `${f.label}: ${range.min}–${range.max}`;
            if (range.min !== undefined) return `${f.label}: ${dict.filtersRangeMin} ${range.min}`;
            return `${f.label}: ${dict.filtersRangeMax} ${range.max}`;
        }
        default: return f.label;
    }
};

const filterFieldControlClass = "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function FilterField<TRecord extends RecordProps>({ filter, value, onChange, dict }: {
    filter: GridFilterConfig<TRecord>;
    value: GridFilterValue;
    onChange: (value: GridFilterValue) => void;
    dict: GridFiltersDict;
}) {
    if (filter.kind === "select") {
        return (
            <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">{filter.label}</span>
                <select className={filterFieldControlClass} value={value as string} onChange={(e) => onChange(e.target.value)}>
                    <option value="">{dict.filtersSelectPlaceholder}</option>
                    {filter.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </label>
        );
    }

    if (filter.kind === "multiselect") {
        const values = value as string[];
        const toggleValue = (v: string) => onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
        return (
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">{filter.label}</span>
                <div className="flex flex-col gap-1">
                    {filter.options.map((o) => (
                        <label key={o.value} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                            <input type="checkbox" checked={values.includes(o.value)} onChange={() => toggleValue(o.value)} />
                            {o.label}
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    if (filter.kind === "dateRange") {
        // Two full-width rows, not side-by-side — a native date input's own calendar affordance
        // already wants real width, and stacking avoids forcing a minimum panel width (or a
        // horizontal scrollbar) just to fit two of them next to each other.
        const range = value as { from: string; to: string };
        return (
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">{filter.label}</span>
                <div className="flex flex-col gap-2">
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{dict.filtersRangeFrom}</span>
                        <input type="date" className={filterFieldControlClass} value={range.from} onChange={(e) => onChange({ ...range, from: e.target.value })} />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{dict.filtersRangeTo}</span>
                        <input type="date" className={filterFieldControlClass} value={range.to} onChange={(e) => onChange({ ...range, to: e.target.value })} />
                    </label>
                </div>
            </div>
        );
    }

    if (filter.kind === "numberRange") {
        const range = value as { min: number | undefined; max: number | undefined };
        return (
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">{filter.label}</span>
                <div className="flex flex-col gap-2">
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{dict.filtersRangeMin}</span>
                        <input type="number" className={filterFieldControlClass} value={range.min ?? ""} onChange={(e) => onChange({ ...range, min: e.target.value === "" ? undefined : Number(e.target.value) })} />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{dict.filtersRangeMax}</span>
                        <input type="number" className={filterFieldControlClass} value={range.max ?? ""} onChange={(e) => onChange({ ...range, max: e.target.value === "" ? undefined : Number(e.target.value) })} />
                    </label>
                </div>
            </div>
        );
    }

    // "toggle" (or omitted `kind`) — same switch visual as the `Switch` field, hand-rolled
    // rather than reusing `Switch` itself, which is a Form field (`useCheckboxField`) and would
    // require wrapping the whole filters panel in a `<Form>`.
    const checked = value as boolean;
    return (
        <label className="inline-flex cursor-pointer items-center gap-2 select-none">
            <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange(!checked)}
                    className="peer absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                />
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute inset-0 rounded-full transition-colors duration-200 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                        checked ? "bg-primary" : "bg-muted-foreground/35"
                    )}
                >
                    <span
                        className={cn(
                            "pointer-events-none absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-200 ease-out",
                            checked && "translate-x-4"
                        )}
                    />
                </span>
            </span>
            <span className="text-sm text-foreground">{filter.label}</span>
        </label>
    );
}

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
    cardClassName,
    bodyClassName,
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
    searchable,
    filters,
    onSave,
    onDelete,
    onComplete,
    audit = false,
    onLoad,
}: GridCoreProps<TRecord>) {
    const theme = useTheme("grid");
    const dict = useI18n('grid');
    const commonDict = useI18n('common');
    const gridLabels = useMemo(() => ({ add: dict.buttonAdd }), [dict.buttonAdd]);
    const db = useDataProvider();
    const { preparedRecords, loading: preparedRecordsLoading } = useGridPreparedRecords({ records, onLoad });
    const inferredColumns = useGridColumns({ columns, records: preparedRecords, form });

    // Opt-in via `filters` — checkbox / select / multiselect / date-range / number-range filters
    // opened from a "Filters" button in Grid's own default header, applied BEFORE `searchable`
    // (see pipeline below). Same extension point as `searchable`: only wired into Grid's OWN
    // default header, a fully custom `header` bypasses it entirely.
    const [filterValues, setFilterValues] = useState<Record<string, GridFilterValue>>(
        () => Object.fromEntries((filters ?? []).map((f) => [f.key, neutralFilterValue(f)]))
    );
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const setFilterValue = useCallback((key: string, value: GridFilterValue) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
    }, []);
    const resetFilter = useCallback((f: GridFilterConfig<TRecord>) => {
        setFilterValues((prev) => ({ ...prev, [f.key]: neutralFilterValue(f) }));
    }, []);
    const activeFilters = (filters ?? []).filter((f) => isFilterActive(f, filterValues[f.key] ?? neutralFilterValue(f)));
    const filteredRecords = useMemo(() => {
        if (!filters || filters.length === 0) return preparedRecords;
        return preparedRecords.filter((record) =>
            filters.every((f) => runFilterPredicate(f, record, filterValues[f.key] ?? neutralFilterValue(f)))
        );
    }, [preparedRecords, filters, filterValues]);

    // Icon-only, sitting right next to the search box (or standalone if `searchable` is off) —
    // matches the common SaaS convention of a filter glyph grouped with search, not a separate
    // labeled button competing for header space.
    const filterButton = filters && filters.length > 0 ? (
        <ActionButton
            icon="filter"
            ariaLabel={dict.filtersButton}
            title={dict.filtersButton}
            variant="link"
            badge={activeFilters.length > 0 ? activeFilters.length : undefined}
            onClick={() => setFilterPanelOpen(true)}
        />
    ) : null;

    // Real framework components, not hand-rolled markup: `Badge` for the pill, `ActionButton`
    // for the remove control — so it inherits the app's real button behavior (cursor, focus
    // ring, disabled state) instead of a bespoke `<button>×</button>`.
    const filterChips = (filters ?? []).length > 0 && activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
            {activeFilters.map((f) => (
                <Badge key={f.key} variant="info" className="inline-flex items-center gap-1">
                    {filterChipLabel(f, filterValues[f.key] ?? neutralFilterValue(f), dict)}
                    <ActionButton
                        icon="x"
                        variant="link"
                        ariaLabel={`${dict.filtersClearAll} ${f.label}`}
                        title={`${dict.filtersClearAll} ${f.label}`}
                        onClick={() => resetFilter(f)}
                    />
                </Badge>
            ))}
        </div>
    ) : null;

    const filterControl = !searchable && filterButton ? (
        <div className="flex flex-wrap items-center gap-2">
            {filterButton}
            {filterChips}
        </div>
    ) : null;

    const filterPanel = filterPanelOpen && filters && filters.length > 0 ? (
        <Modal
            title={dict.filtersPanelTitle}
            size="md"
            position="right"
            onClose={() => setFilterPanelOpen(false)}
            footer={(
                <ActionButton
                    label={dict.filtersClearAll}
                    variant="link"
                    disabled={activeFilters.length === 0}
                    onClick={() => setFilterValues(Object.fromEntries(filters.map((f) => [f.key, neutralFilterValue(f)])))}
                />
            )}
        >
            <div className="flex flex-col gap-5">
                {filters.map((f) => (
                    <FilterField key={f.key} filter={f} value={filterValues[f.key] ?? neutralFilterValue(f)} onChange={(value) => setFilterValue(f.key, value)} dict={dict} />
                ))}
            </div>
        </Modal>
    ) : null;

    // Opt-in via `searchable` — filters the records actually rendered (table/gallery, and
    // whatever they compute downstream: sort/pagination/selection all see the FILTERED set).
    // Only wired into Grid's OWN default header (see `resolvedHeader` below) — a fully custom
    // `header` bypasses it entirely, same as the view toggle/column picker. Applied AFTER
    // `filters` — see `filteredRecords` above.
    const searchConfig = searchable === true ? {} : (searchable || undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const searchedRecords = useMemo(() => {
        if (!searchConfig || !searchTerm.trim()) return filteredRecords;
        const q = searchTerm.trim().toLowerCase();
        const fieldKeys = searchConfig.fields?.map(String);
        return filteredRecords.filter((record) => {
            const keys = fieldKeys ?? Object.keys(record);
            return keys.some((key) => {
                const value = getRecordValue(record, key);
                return typeof value === "string" && value.toLowerCase().includes(q);
            });
        });
    }, [filteredRecords, searchConfig, searchTerm]);
    // Order matters here: search+filter trigger, then that trigger's own active-filter chips
    // right next to it (same visual group), and the match count trailing last as a summary of
    // the whole row — not sandwiched between the Filters button and its own chips, which reads
    // as if the count belonged to the button rather than the result set.
    const searchControl = searchConfig ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="flex min-w-0 items-center gap-1">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchConfig.placeholder ?? commonDict.search}
                    className="w-full max-w-xs rounded-md border border-input bg-background px-2 py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {filterButton}
            </div>
            {filterChips}
            <span className="shrink-0 text-xs text-muted-foreground">{searchedRecords.length} / {preparedRecords.length}</span>
        </div>
    ) : null;

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
        if (!title && !searchControl && !filterControl && !headerActionKeys.length && !viewToggleControl && !columnPickerControl && !fieldPickerControl) return undefined;

        return (
            <>
                {/* Only wrap title in the extra flex span when there's a search box and/or
                    filter controls to sit alongside it — keeps the exact previous markup (just
                    `{title || <span />}`) for every existing Grid that doesn't use
                    `searchable`/`filters`, no layout change. */}
                {(searchControl || filterControl) ? (
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                        {title}
                        {searchControl}
                        {filterControl}
                    </span>
                ) : (title || <span />)}
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
    }, [actionButton, header, headerActionKeys, headerContext, title, viewToggleControl, columnPickerControl, fieldPickerControl, searchControl, filterControl]);

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
                className={cn(theme.Grid.Card.className, sticky ? `sticky-${sticky}` : "", cardClassName)}
                headerClassName={theme.Grid.Card.headerClassName}
                bodyClassName={cn(theme.Grid.Card.bodyClassName, bodyClassName)}
                footerClassName={theme.Grid.Card.footerClassName}
                loading={loading || preparedRecordsLoading}
            >
                {resolvedView === "gallery" ? (
                    <GridGalleryView
                        records={searchedRecords}
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
                        records={searchedRecords}
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
                        className={tableViewConfig.className}
                        heightClassName={tableViewConfig.heightClassName}
                        scrollClassName={tableViewConfig.scrollClassName}
                        headerClassName={tableViewConfig.headerClassName}
                        before={before}
                        after={after}
                    />
                )}
            </Card>
            {filterPanel}
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


