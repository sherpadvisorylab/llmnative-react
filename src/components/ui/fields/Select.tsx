import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { interpolate, useI18n } from "../../../I18n";
import {
    Label,
    FieldError,
    fieldAddonClass,
    fieldControlBaseClass,
    fieldFeedbackClass,
    fieldGroupClass,
} from "./Input";
import { Wrapper } from "../GridSystem";
import { useTheme } from "../../../Theme";
import { DEFAULT_ORDER, Order, type OrderConfig } from "../../../libs/order";
import { arraysEqual, arrayUnique, isEmpty, sanitizeKey } from "../../../libs/utils";
import { DatabaseOptions, DBConfig, FieldValue, RecordProps, RECORD_KEY } from "../../../providers/data/DataProvider";
import { useDataProvider } from "../../../providers/data/DataProviderContext";
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import { cn } from '../../../libs/cn';

interface Option extends RecordProps {
    label: string;
    value: string;
    group?: string;
}

type OptionOrderConfig = OrderConfig & {
    field: 'label' | 'value';
};

interface BaseProps extends FormFieldProps {
    /** When `true`, the select becomes read-only (disabled) once a value has been set. */
    readOnlyAfterSet?: boolean;
    disabled?: boolean;
    title?: string;
    feedback?: string;
    options?: Option[] | string[] | number[];
    optionsSource?: DBConfig;
    order?: OptionOrderConfig;
    validator?: (value: FieldValue) => string | undefined;
}

export interface SelectProps extends BaseProps {
    placeholderOption?: Option;
    value?: string | number;
}

export interface AutocompleteProps extends BaseProps {
    minItems?: number;
    maxItems?: number;
    placeholder?: string;
    creatable?: boolean;
    /**
     * Called when a value not present in the options is confirmed with `creatable`.
     * Return `false` (or a promise resolving to `false`) to cancel the selection —
     * e.g. to open a dedicated creation form instead.
     */
    onCreate?: (value: string) => boolean | void | Promise<boolean | void>;
}

export interface ChecklistProps extends BaseProps {
    itemClassName?: string;
}

const normalizeSearch = (value: string): string =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const valueToArray = (value: FieldValue): unknown[] => {
    if (value == null || value === '' || typeof value === 'boolean') return [];
    if (typeof value === 'object' && !Array.isArray(value)) return [];
    return typeof value === 'string' || typeof value === 'number'
        ? value.toString().split(',')
        : value;
};

const normalizeOption = (
    fieldMap: Record<string, unknown> | string | number | undefined
): Option => {
    if (!fieldMap) {
        return { label: '@value', value: '@value' };
    }

    if (typeof fieldMap !== 'object') {
        return { label: fieldMap?.toString() || '', value: fieldMap?.toString() || '' };
    }

    return {
        label: String(fieldMap?.label ?? '') || '',
        value: String(fieldMap?.value ?? '') || ''
    };
};

const normalizeLookup = (records: RecordProps[]): Option[] =>
    records.map((record) => normalizeOption({
        label: record.label ?? record.name ?? record.title ?? record[RECORD_KEY] ?? '',
        value: record.value ?? record[RECORD_KEY] ?? record.label ?? record.name ?? '',
    }));

function getOptionsDB(
    optionsSource?: DBConfig
): DatabaseOptions {
    return {
        fieldMap: optionsSource?.fieldMap,
        where: optionsSource?.where,
        order: optionsSource?.order,
        onLoad: optionsSource?.onLoad,
    };
}

const isDbOrdered = (
    fieldMap: DatabaseOptions["fieldMap"],
    dbOrder: DBConfig["order"],
    order: OptionOrderConfig
) => {
    const mappedField = fieldMap?.[order.field];
    const [firstDbOrder] = Object.entries(dbOrder || {});

    if (!firstDbOrder || !mappedField) return false;

    const [dbField, dbDir] = firstDbOrder;
    return dbField === mappedField && dbDir === order.dir;
};

const getOptions = (
    options: Array<string | number | Option>,
    lookup: Option[],
    order?: OptionOrderConfig,
    dbOrder?: DBConfig["order"],
    fieldMap?: DatabaseOptions["fieldMap"]
): Option[] => {
    const effectiveOrder = order || { ...DEFAULT_ORDER, field: 'label' };
    const combined = [
        ...options.map(normalizeOption),
        ...lookup
    ];

    if (options.length === 0 && isDbOrdered(fieldMap, dbOrder, effectiveOrder)) {
        return combined;
    }

    return Order.records(combined, effectiveOrder) || [];
};

const SelectAddon = ({ children, side }: { children: React.ReactNode; side: 'before' | 'after' }) => (
    <span className={cn(
        fieldAddonClass,
        side === 'before' ? "rounded-l-md rounded-r-none border-r-0" : "rounded-l-none rounded-r-md border-l-0"
    )}>
        {children}
    </span>
);

export const Select = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    required = false,
    readOnlyAfterSet = false,
    disabled = false,
    placeholderOption = undefined,
    label = undefined,
    title = undefined,
    before = undefined,
    after = undefined,
    feedback = undefined,
    options = [],
    optionsSource = undefined,
    order = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined,
    validator = undefined,
}: SelectProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });
    const theme = useTheme("select");
    const dict = useI18n('select');
    const resolvedPlaceholder = placeholderOption ?? { label: dict.placeholder, value: "" };

    const dbOptions = useMemo(() => getOptionsDB(optionsSource), [optionsSource?.fieldMap, optionsSource?.where, optionsSource?.order, optionsSource?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    useEffect(() => {
        return database.subscribe(optionsSource?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);
    }, [database, optionsSource?.path, dbOptions]);

    const opts = useMemo(() => {
        const combinedOptions = getOptions(options, lookup, order, optionsSource?.order, dbOptions.fieldMap);

        return arrayUnique(
            value && !combinedOptions.length
                ? [...combinedOptions, { label: `× ${value.toString()}`, value: value.toString() }]
                : combinedOptions
        );
    }, [options, lookup, order, optionsSource?.order, dbOptions.fieldMap, value]);

    if (!value && !resolvedPlaceholder && opts.length > 0) {
        handleChange?.({ target: { name, value: opts[0].value } });
    }

    const id = useId();
    return (
        <Wrapper className={formWrapClass || theme.Select.wrapperClassName}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <Wrapper className={before || after ? cn(fieldGroupClass, "flex-nowrap") : ""}>
                {before && <SelectAddon side="before">{before}</SelectAddon>}
                <select
                    id={id}
                    name={name}
                    className={cn(
                        fieldControlBaseClass,
                        "appearance-none pr-8",
                        before && "!rounded-l-none",
                        after && "!rounded-r-none",
                        error && 'border-destructive focus-visible:ring-destructive/20',
                        className || theme.Select.className
                    )}
                    value={(value as string | number | undefined) ?? ''}
                    required={required}
                    disabled={disabled || (readOnlyAfterSet && !isEmpty(value))}
                    onChange={handleChange}
                    title={title}
                >
                    {resolvedPlaceholder && <option key={`${id}-empty`} value={resolvedPlaceholder.value}>{resolvedPlaceholder.label}</option>}
                    {opts.some(o => o.group)
                        ? Object.entries(
                            opts.reduce<Record<string, Option[]>>((acc, o) => {
                                const g = o.group ?? '';
                                (acc[g] ??= []).push(o);
                                return acc;
                            }, {})
                          ).map(([group, groupOpts]) =>
                            group
                                ? <optgroup key={group} label={group}>
                                    {groupOpts.map((op, i) => <option key={`${id}-${group}-${i}`} value={op.value}>{op.label}</option>)}
                                  </optgroup>
                                : groupOpts.map((op, i) => <option key={`${id}-nogroup-${i}`} value={op.value}>{op.label}</option>)
                          )
                        : opts.map((op, index) => <option key={`${id}-${index}`} value={op.value}>{op.label}</option>)
                    }
                </select>
                {after && <SelectAddon side="after">{after}</SelectAddon>}
            </Wrapper>
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>
            }
        </Wrapper>
    );
};

export const Autocomplete = ({
    name,
    defaultValue = undefined,
    minItems = undefined,
    maxItems = undefined,
    onChange = undefined,
    required = false,
    readOnlyAfterSet = false,
    disabled = false,
    label = undefined,
    title = undefined,
    placeholder = undefined,
    before = undefined,
    after = undefined,
    feedback = undefined,
    options = [],
    optionsSource = undefined,
    order = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined,
    validator = undefined,
    creatable = false,
    onCreate = undefined,
}: AutocompleteProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });
    const theme = useTheme("select");
    const dict = useI18n('select');

    const valueArray = useMemo(() => valueToArray(value), [value]);
    const [selectedItems, setSelectedItems] = useState(() => valueArray);
    useEffect(() => {
        if (!arraysEqual(valueArray, selectedItems)) {
            setSelectedItems(valueArray);
        }
    }, [valueArray, selectedItems]);

    const dbOptions = useMemo(() => getOptionsDB(optionsSource), [optionsSource?.fieldMap, optionsSource?.where, optionsSource?.order, optionsSource?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    useEffect(() => {
        return database.subscribe(optionsSource?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);
    }, [database, optionsSource?.path, dbOptions]);

    const [localOpts, setLocalOpts] = useState<Option[]>([]);

    const opts = useMemo(() => {
        const combinedOptions = getOptions([...options, ...localOpts], lookup, order, optionsSource?.order, dbOptions.fieldMap);
        return arrayUnique(combinedOptions, 'value');
    }, [options, localOpts, lookup, order, optionsSource?.order, dbOptions.fieldMap]);

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const id = useId();
    const listId = `${id}-listbox`;
    const optionId = (index: number) => `${id}-option-${index}`;

    const isDisabled = disabled || (readOnlyAfterSet && !isEmpty(value));
    const atMax = Boolean(maxItems && selectedItems.length >= maxItems);

    const labelFor = useCallback((currentValue: string) => {
        const match = opts.find(op => op.value === currentValue);
        return match?.label || currentValue;
    }, [opts]);

    const filtered = useMemo(() => {
        const needle = normalizeSearch(query);
        if (!needle) return opts;
        return opts.filter(op =>
            normalizeSearch(op.label).includes(needle) || normalizeSearch(op.value).includes(needle)
        );
    }, [opts, query]);

    const showCreate = creatable
        && query.trim().length > 0
        && !atMax
        && !opts.some(op =>
            normalizeSearch(op.value) === normalizeSearch(query) || normalizeSearch(op.label) === normalizeSearch(query)
        );

    const items = useMemo(() => {
        const list = filtered.map(op => ({ label: op.label, value: op.value, create: false }));
        if (showCreate) {
            list.push({ label: interpolate(dict.createOption, { value: query.trim() }), value: query.trim(), create: true });
        }
        return list;
    }, [filtered, showCreate, query, dict.createOption]);

    const activeId = open && highlighted >= 0 && items[highlighted] ? optionId(highlighted) : undefined;

    const updateMenuPosition = useCallback(() => {
        const el = inputRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const maxHeight = 256;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const openUp = spaceBelow < maxHeight && spaceAbove > spaceBelow;
        setMenuStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            maxHeight,
            ...(openUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
        });
    }, []);

    useEffect(() => {
        if (!open) return;
        updateMenuPosition();
        window.addEventListener('resize', updateMenuPosition);
        window.addEventListener('scroll', updateMenuPosition, true);
        return () => {
            window.removeEventListener('resize', updateMenuPosition);
            window.removeEventListener('scroll', updateMenuPosition, true);
        };
    }, [open, updateMenuPosition]);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return;
            setOpen(false);
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    const removeItem = (currentValue: string) => {
        setSelectedItems(prevState => {
            const updatedItems = prevState.filter(item => item !== currentValue);
            setTimeout(() => {
                handleChange?.({ target: { name, value: updatedItems } });
            }, 0);
            return updatedItems;
        });
    };

    const selectValue = async (rawValue: string) => {
        const nextValue = rawValue.trim();
        if (!nextValue) return;
        if (selectedItems.includes(nextValue) || (maxItems && selectedItems.length >= maxItems)) {
            setQuery('');
            setOpen(false);
            return;
        }

        const exists = opts.some(op => op.value === nextValue);
        if (!exists) {
            if (!creatable) return;
            if (onCreate) {
                const result = await onCreate(nextValue);
                if (result === false) {
                    setQuery('');
                    return;
                }
            }
            setLocalOpts(prev => prev.some(op => op.value === nextValue) ? prev : [...prev, { label: nextValue, value: nextValue }]);
        }

        setSelectedItems(prevState => {
            const updatedItems = [...prevState, nextValue];
            setTimeout(() => {
                handleChange?.({ target: { name, value: updatedItems } });
            }, 0);
            return updatedItems;
        });
        setQuery('');
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isDisabled) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setHighlighted(0);
                return;
            }
            setHighlighted(prev => items.length === 0 ? -1 : prev < items.length - 1 ? prev + 1 : 0);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setHighlighted(items.length > 0 ? items.length - 1 : -1);
                return;
            }
            setHighlighted(prev => items.length === 0 ? -1 : prev > 0 ? prev - 1 : items.length - 1);
            return;
        }

        if (e.key === 'Enter') {
            if (!open) return;
            e.preventDefault();
            const item = items[highlighted];
            if (item) void selectValue(item.value);
            return;
        }

        if (e.key === 'Escape') {
            if (!open) return;
            e.preventDefault();
            setOpen(false);
            setHighlighted(-1);
            return;
        }

        if (e.key === 'Tab') {
            if (!open) return;
            const item = items[highlighted];
            if (item) void selectValue(item.value);
            setOpen(false);
            return;
        }

        if (e.key === 'Backspace' && query === '' && selectedItems.length > 0) {
            removeItem(selectedItems[selectedItems.length - 1] as string);
        }
    };

    const listElement = (
        <div
            ref={listRef}
            id={listId}
            role="listbox"
            className={cn(
                "z-[200] overflow-y-auto rounded-xl border border-border/60 bg-popover/95 p-1 text-sm text-popover-foreground shadow-xl shadow-black/5 outline-none backdrop-blur supports-[backdrop-filter]:bg-popover/90 dark:shadow-black/20",
                theme.Autocomplete.listClassName
            )}
            style={menuStyle}
        >
            {items.length === 0 ? (
                <div className="px-2 py-3 text-center text-muted-foreground">{dict.noResults}</div>
            ) : items.map((item, index) => {
                const selected = selectedItems.includes(item.value);
                return (
                    <div
                        key={`${id}-${item.create ? 'create' : 'option'}-${index}-${item.value}`}
                        id={optionId(index)}
                        role="option"
                        aria-selected={selected}
                        className={cn(
                            "flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left transition-colors",
                            index === highlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                            selected && "font-medium",
                            theme.Autocomplete.optionClassName
                        )}
                        onMouseDown={(event) => {
                            event.preventDefault();
                            void selectValue(item.value);
                        }}
                        onMouseEnter={() => setHighlighted(index)}
                    >
                        {item.label}
                    </div>
                );
            })}
        </div>
    );

    return (
        <Wrapper className={formWrapClass || theme.Autocomplete.wrapperClassName}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <Wrapper className={before || after ? cn(fieldGroupClass, "flex-nowrap") : ""}>
                {before && <SelectAddon side="before">{before}</SelectAddon>}
                <div
                    ref={rootRef}
                    className={cn(
                        fieldControlBaseClass,
                        "relative h-auto min-h-9 flex-wrap items-center gap-1 py-1.5 px-2",
                        before && "rounded-l-none",
                        after && "rounded-r-none",
                        isDisabled && "cursor-not-allowed opacity-60"
                    )}
                >
                    {(selectedItems as string[]).map(item => (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary" key={item}>
                            {labelFor(item)}
                            <button type="button" className="ml-0.5 opacity-60 transition-opacity hover:opacity-100" onClick={() => removeItem(item)}>×</button>
                        </span>
                    ))}
                    {!atMax && (
                        <input
                            ref={inputRef}
                            id={id}
                            type="text"
                            role="combobox"
                            aria-expanded={open}
                            aria-controls={listId}
                            aria-activedescendant={activeId}
                            aria-autocomplete="list"
                            aria-haspopup="listbox"
                            autoComplete="off"
                            className={cn("min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground", className || theme.Autocomplete.className)}
                            required={required && selectedItems.length < (minItems || 0)}
                            disabled={isDisabled}
                            placeholder={placeholder}
                            title={title}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setOpen(true);
                                setHighlighted(0);
                            }}
                            onFocus={() => { if (!isDisabled) setOpen(true); }}
                            onClick={() => { if (!isDisabled) setOpen(true); }}
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </div>
                {after && <SelectAddon side="after">{after}</SelectAddon>}
            </Wrapper>
            {open && typeof document !== 'undefined' && createPortal(listElement, document.body)}
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>}
        </Wrapper>
    );
};

export const Checklist = ({
    name,
    defaultValue = undefined,
    onChange = undefined,
    required = false,
    readOnlyAfterSet = false,
    disabled = false,
    label = undefined,
    title = undefined,
    before = undefined,
    after = undefined,
    feedback = undefined,
    options = [],
    optionsSource = undefined,
    order = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined,
    validator = undefined,
    itemClassName = undefined,
}: ChecklistProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });

    const valueArray = useMemo(() => valueToArray(value), [value]);
    const [selectedItems, setSelectedItems] = useState(() => valueArray);
    useEffect(() => {
        if (!arraysEqual(valueArray, selectedItems)) {
            setSelectedItems(valueArray);
        }
    }, [valueArray, selectedItems]);

    const dbOptions = useMemo(() => getOptionsDB(optionsSource), [optionsSource?.fieldMap, optionsSource?.where, optionsSource?.order, optionsSource?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    useEffect(() => {
        return database.subscribe(optionsSource?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);
    }, [database, optionsSource?.path, dbOptions]);

    const opts = useMemo(() => {
        const combinedOptions = getOptions(options, lookup, order, optionsSource?.order, dbOptions.fieldMap);
        return arrayUnique(combinedOptions, 'value');
    }, [options, lookup, order, optionsSource?.order, dbOptions.fieldMap]);

    const removeItem = (currentValue: string) => {
        setSelectedItems(prevState => {
            const updatedItems = prevState.filter(item => item !== currentValue);
            setTimeout(() => {
                handleChange?.({ target: { name, value: updatedItems } });
            }, 0);

            return updatedItems;
        });
    };

    const handleChecklistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;

        if (!e.target.checked) {
            removeItem(currentValue);
            return;
        }

        if (opts.filter(op => op.value === currentValue).length === 0) {
            return;
        }

        if (selectedItems.includes(currentValue)) {
            return;
        }

        setSelectedItems(prevState => {
            const updatedItems = [...prevState, currentValue];
            setTimeout(() => {
                handleChange?.({ target: { name, value: updatedItems } });
            }, 0);

            return updatedItems;
        });
    };

    const id = useId();
    const isDisabled = disabled || (readOnlyAfterSet && selectedItems.length > 0);
    const checklist = (
        <Wrapper className={cn(
            before || after ? cn(fieldControlBaseClass, "h-auto min-h-9 w-full min-w-0 flex-col items-start py-2 px-3") : "",
            "space-y-1"
        )}>
            {opts.map((op) => {
                const key = sanitizeKey(`cl-${id}-${name}-${op.value}`);
                return (
                    <div key={key} className={cn("flex w-full items-center gap-2", itemClassName)}>
                        <input
                            className="h-4 w-4 shrink-0 rounded-sm border border-input bg-background text-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            type={"checkbox"}
                            id={key}
                            name={name}
                            value={op.value}
                            onChange={handleChecklistChange}
                            checked={selectedItems.includes(op.value)}
                            disabled={isDisabled}
                            title={title}
                        />
                        <label htmlFor={key} className="text-sm font-medium leading-none text-foreground">{op.label}</label>
                    </div>
                );
            })}
        </Wrapper>
    );

    return (
        <Wrapper className={cn(formWrapClass, className)}>
            {label && <><Label label={label} required={required} /><hr className={"mt-0"} /></>}
            {before || after ? (
                <Wrapper className={cn(fieldGroupClass, "flex-nowrap items-stretch")}>
                    {before && <SelectAddon side="before">{before}</SelectAddon>}
                    {checklist}
                    {after && <SelectAddon side="after">{after}</SelectAddon>}
                </Wrapper>
            ) : checklist}
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>}
        </Wrapper>
    );
};
