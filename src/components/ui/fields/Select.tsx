import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from "../../../I18n";
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
    /** Called when the user creates a value (`creatable`). Return `false` (or resolve to `false`)
     *  to keep the created value out of the selection, e.g. to open a creation form instead. */
    onCreate?: (value: string) => Promise<void | boolean> | void | boolean;
    /** Class of the options list (rendered in a portal, as wide as the field). */
    listClassName?: string;
    /** Class of every option of the list. */
    optionClassName?: string;
}

export interface ChecklistProps extends BaseProps {
    itemClassName?: string;
}

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

/** Case- and accent-insensitive text used to match options against what the user types. */
const searchable = (text: string): string => text.toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

type AutocompleteItem =
    | { kind: 'option'; option: Option }
    | { kind: 'create'; text: string };

type ListPosition = { top?: number; bottom?: number; left: number; width: number; maxHeight: number };

/** Combobox with a themed listbox (CR-096): the list is drawn by the framework, as wide as the
 *  field, shows labels only and is driven by keyboard and mouse. The stored value is unchanged:
 *  the array of the selected option values. */
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
    listClassName = undefined,
    optionClassName = undefined,
    validator = undefined,
    creatable = false,
    onCreate = undefined,
}: AutocompleteProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });
    const theme = useTheme("select");
    const dict = useI18n('autocomplete');

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

    const labelOf = useMemo(() => new Map(opts.map((op) => [op.value, op.label || op.value])), [opts]);

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [position, setPosition] = useState<ListPosition | null>(null);
    const fieldRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    const selected = selectedItems as string[];
    const canAddMore = !maxItems || selected.length < maxItems;
    const isDisabled = disabled || (readOnlyAfterSet && !isEmpty(value));

    const items = useMemo<AutocompleteItem[]>(() => {
        const text = query.trim();
        const needle = searchable(text);
        const matches = opts
            .filter((op) => !selected.includes(op.value))
            .filter((op) => !needle || searchable(op.label || op.value).includes(needle) || searchable(op.value).includes(needle))
            .map((option): AutocompleteItem => ({ kind: 'option', option }));
        const exists = Boolean(text) && opts.some((op) => searchable(op.label || op.value) === needle || op.value === text);
        return creatable && text && !exists ? [...matches, { kind: 'create', text }] : matches;
    }, [opts, selected, query, creatable]);

    const id = useId();
    const listId = `${id}-options`;
    const optionId = (index: number) => `${id}-option-${index}`;
    const isOpen = open && canAddMore && !isDisabled;

    const updatePosition = useCallback(() => {
        const field = fieldRef.current;
        if (!field) return;
        const rect = field.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom - 8;
        const spaceAbove = rect.top - 8;
        const below = spaceBelow >= 200 || spaceBelow >= spaceAbove;
        setPosition({
            ...(below ? { top: rect.bottom + 4 } : { bottom: window.innerHeight - rect.top + 4 }),
            left: rect.left,
            width: rect.width,
            maxHeight: Math.max(120, Math.min(288, below ? spaceBelow : spaceAbove)),
        });
    }, []);

    useEffect(() => {
        if (!isOpen) return undefined;
        updatePosition();
        const onScrollOrResize = () => updatePosition();
        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (fieldRef.current?.contains(target) || listRef.current?.contains(target)) return;
            setOpen(false);
        };
        window.addEventListener('resize', onScrollOrResize);
        window.addEventListener('scroll', onScrollOrResize, true);
        document.addEventListener('mousedown', onPointerDown);
        return () => {
            window.removeEventListener('resize', onScrollOrResize);
            window.removeEventListener('scroll', onScrollOrResize, true);
            document.removeEventListener('mousedown', onPointerDown);
        };
    }, [isOpen, updatePosition, selected.length]);

    useEffect(() => {
        setActive((current) => Math.min(current, Math.max(0, items.length - 1)));
    }, [items.length]);

    useEffect(() => {
        if (!isOpen) return;
        const element = document.getElementById(optionId(active));
        if (element && typeof element.scrollIntoView === 'function') element.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, isOpen]);

    const writeValue = (next: string[]) => {
        setSelectedItems(next);
        handleChange?.({ target: { name, value: next } });
    };

    const commitValue = (optionValue: string) => {
        if (!optionValue || selected.includes(optionValue) || !canAddMore) return;
        const next = [...selected, optionValue];
        writeValue(next);
        setQuery('');
        setActive(0);
        if (maxItems && next.length >= maxItems) setOpen(false);
    };

    const createValue = async (text: string) => {
        setQuery('');
        setActive(0);
        const result = await onCreate?.(text);
        // `false` lets the consumer handle the new value itself (e.g. open a creation form).
        if (result === false) {
            setOpen(false);
            return;
        }
        setLocalOpts((prev) => (prev.some((op) => op.value === text) ? prev : [...prev, { label: text, value: text }]));
        commitValue(text);
    };

    const choose = (item: AutocompleteItem | undefined) => {
        if (!item) return;
        if (item.kind === 'option') commitValue(item.option.value);
        else void createValue(item.text);
    };

    const removeItem = (optionValue: string) => {
        writeValue(selected.filter((item) => item !== optionValue));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!open) { setOpen(true); return; }
            setActive((current) => Math.min(current + 1, Math.max(0, items.length - 1)));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActive((current) => Math.max(current - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (isOpen && items[active]) { choose(items[active]); return; }
            const text = query.trim();
            if (!text) return;
            const match = opts.find((op) => op.value === text || searchable(op.label || op.value) === searchable(text));
            if (match) commitValue(match.value);
            else if (creatable) void createValue(text);
        } else if (event.key === 'Escape') {
            if (!isOpen) return;
            // Close the list only: the keydown must not reach the Modal's Escape handler.
            event.preventDefault();
            event.nativeEvent.stopPropagation();
            setOpen(false);
        } else if (event.key === 'Tab') {
            setOpen(false);
        } else if (event.key === 'Backspace' && !query && selected.length > 0) {
            removeItem(selected[selected.length - 1]);
        }
    };

    const list = isOpen && position && (
        <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={label ?? title ?? name}
            className={cn(
                "fixed z-[250] overflow-y-auto rounded-xl border border-border/60 bg-popover/95 p-1 text-sm text-popover-foreground shadow-xl shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-popover/90 dark:shadow-black/20",
                listClassName || theme.Autocomplete.listClassName,
            )}
            style={{ top: position.top, bottom: position.bottom, left: position.left, width: position.width, maxHeight: position.maxHeight }}
        >
            {items.length === 0 ? (
                <li role="presentation" className="px-2.5 py-2 text-muted-foreground">{dict.noResults}</li>
            ) : items.map((item, index) => (
                <li
                    key={item.kind === 'option' ? `option-${item.option.value}` : `create-${item.text}`}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === active}
                    className={cn(
                        "cursor-pointer select-none rounded-md px-2.5 py-2 transition-colors",
                        index === active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
                        item.kind === 'create' && "font-medium",
                        optionClassName || theme.Autocomplete.optionClassName,
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(item)}
                >
                    {item.kind === 'option'
                        ? (item.option.label || item.option.value)
                        : dict.create.replace('{value}', item.text)}
                </li>
            ))}
        </ul>
    );

    return (
        <Wrapper className={formWrapClass || theme.Autocomplete.wrapperClassName}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <Wrapper className={before || after ? cn(fieldGroupClass, "flex-nowrap") : ""}>
                {before && <SelectAddon side="before">{before}</SelectAddon>}
                <div
                    ref={fieldRef}
                    className={cn(
                        fieldControlBaseClass,
                        "h-auto min-h-9 flex-wrap items-center gap-1 py-1.5 px-2",
                        before && "rounded-l-none",
                        after && "rounded-r-none",
                        error && 'border-destructive focus-within:ring-destructive/20',
                    )}
                    onClick={() => {
                        if (isDisabled) return;
                        inputRef.current?.focus();
                        // A focused field reopens on click too (after Escape or a selection).
                        setOpen(true);
                    }}
                >
                    {selected.map(item => (
                        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary" key={item}>
                            <span className="truncate">{labelOf.get(item) ?? item}</span>
                            {!isDisabled && (
                                <button
                                    type="button"
                                    aria-label={`${dict.remove} ${labelOf.get(item) ?? item}`}
                                    className="ml-0.5 cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                                    onClick={(event) => { event.stopPropagation(); removeItem(item); }}
                                >×</button>
                            )}
                        </span>
                    ))}
                    {canAddMore && (
                        <input
                            ref={inputRef}
                            id={id}
                            type="text"
                            role="combobox"
                            aria-expanded={Boolean(isOpen && position)}
                            aria-controls={listId}
                            aria-autocomplete="list"
                            aria-activedescendant={isOpen && items[active] ? optionId(active) : undefined}
                            autoComplete="off"
                            className={cn("min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground", className || theme.Autocomplete.className)}
                            required={required && selected.length < (minItems || 0)}
                            disabled={isDisabled}
                            placeholder={creatable ? (placeholder ?? dict.createPlaceholder) : placeholder}
                            title={title}
                            value={query}
                            onChange={(event) => { setQuery(event.target.value); setActive(0); setOpen(true); }}
                            onFocus={() => setOpen(true)}
                            onBlur={() => setOpen(false)}
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </div>
                {after && <SelectAddon side="after">{after}</SelectAddon>}
            </Wrapper>
            {list && typeof document !== 'undefined' ? createPortal(list, document.body) : null}
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
