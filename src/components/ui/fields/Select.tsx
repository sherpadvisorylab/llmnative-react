import React, { useEffect, useId, useMemo, useState } from 'react';
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
}

type OptionOrderConfig = OrderConfig & {
    field: 'label' | 'value';
};

interface BaseProps extends FormFieldProps {
    updatable?: boolean;
    disabled?: boolean;
    title?: string;
    feedback?: string;
    options?: Option[] | string[] | number[];
    db?: DBConfig;
    order?: OptionOrderConfig;
    validator?: (value: FieldValue) => string | undefined;
}

export interface SelectProps extends BaseProps {
    optionEmpty?: Option;
    value?: string | number;
}

export interface AutocompleteProps extends BaseProps {
    min?: number;
    max?: number;
    placeholder?: string;
    creatable?: boolean;
    onCreate?: (value: string) => Promise<void> | void;
}

export interface ChecklistProps extends BaseProps {
    checkClass?: string;
}

const valueToArray = (value: FieldValue): unknown[] => {
    if (value == null || typeof value === 'boolean') return [];
    if (typeof value === 'object' && !Array.isArray(value)) return [];
    return typeof value === 'string' || typeof value === 'number'
        ? value.toString().split(',')
        : value;
};

const normalizeOption = (
    fieldMap: Record<string, any> | string | number | undefined
): Option => {
    if (!fieldMap) {
        return { label: '@value', value: '@value' };
    }

    if (typeof fieldMap !== 'object') {
        return { label: fieldMap?.toString() || '', value: fieldMap?.toString() || '' };
    }

    return {
        label: fieldMap?.label?.toString() || '',
        value: fieldMap?.value?.toString() || ''
    };
};

const normalizeLookup = (records: RecordProps[]): Option[] =>
    records.map((record) => normalizeOption({
        label: record.label ?? record.name ?? record.title ?? record[RECORD_KEY] ?? '',
        value: record.value ?? record[RECORD_KEY] ?? record.label ?? record.name ?? '',
    }));

function getOptionsDB(
    db?: DBConfig
): DatabaseOptions {
    return {
        fieldMap: db?.fieldMap,
        where: db?.where,
        order: db?.order,
        onLoad: db?.onLoad,
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

const SelectAddon = ({ children, side }: { children: React.ReactNode; side: 'pre' | 'post' }) => (
    <span className={cn(
        fieldAddonClass,
        side === 'pre' ? "rounded-l-md rounded-r-none border-r-0" : "rounded-l-none rounded-r-md border-l-0"
    )}>
        {children}
    </span>
);

export const Select = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    required = false,
    updatable = true,
    disabled = false,
    optionEmpty = {
        label: "Select...",
        value: ""
    },
    label = undefined,
    title = undefined,
    pre = undefined,
    post = undefined,
    feedback = undefined,
    options = [],
    db = undefined,
    order = undefined,
    inheritFormWrapClass = true,
    wrapClass = undefined,
    className = undefined,
    validator = undefined,
}: SelectProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, defaultValue, inheritFormWrapClass });
    const error = useFieldValidation(name, { required, label, validator });
    const theme = useTheme("select");

    const dbOptions = useMemo(() => getOptionsDB(db), [db?.fieldMap, db?.where, db?.order, db?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    useEffect(() => {
        return database.subscribe(db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);
    }, [database, db?.path, dbOptions]);

    const opts = useMemo(() => {
        const combinedOptions = getOptions(options, lookup, order, db?.order, dbOptions.fieldMap);

        return arrayUnique(
            value && !combinedOptions.length
                ? [...combinedOptions, { label: `× ${value.toString()}`, value: value.toString() }]
                : combinedOptions
        );
    }, [options, lookup, order, db?.order, dbOptions.fieldMap, value]);

    if (!value && !optionEmpty && opts.length > 0) {
        handleChange?.({ target: { name, value: opts[0].value } });
    }

    const id = useId();
    return (
        <Wrapper className={formWrapClass || theme.Select.wrapClass}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <Wrapper className={pre || post ? cn(fieldGroupClass, "flex-nowrap") : ""}>
                {pre && <SelectAddon side="pre">{pre}</SelectAddon>}
                <select
                    id={id}
                    name={name}
                    className={cn(
                        fieldControlBaseClass,
                        "appearance-none pr-8",
                        pre && "!rounded-l-none",
                        post && "!rounded-r-none",
                        error && 'border-destructive focus-visible:ring-destructive/20',
                        className || theme.Select.className
                    )}
                    value={(value as string | number | undefined) ?? ''}
                    required={required}
                    disabled={disabled || (!updatable && !isEmpty(value))}
                    onChange={handleChange}
                    title={title}
                >
                    {optionEmpty && <option key={`${id}-empty`} value={optionEmpty.value}>{optionEmpty.label}</option>}
                    {opts.map((op, index) => <option key={`${id}-${index}`} value={op.value}>{op.label}</option>)}
                </select>
                {post && <SelectAddon side="post">{post}</SelectAddon>}
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
    min = undefined,
    max = undefined,
    onChange = undefined,
    required = false,
    updatable = true,
    disabled = false,
    label = undefined,
    title = undefined,
    placeholder = undefined,
    pre = undefined,
    post = undefined,
    feedback = undefined,
    options = [],
    db = undefined,
    order = undefined,
    inheritFormWrapClass = true,
    wrapClass = undefined,
    className = undefined,
    creatable = false,
    onCreate = undefined,
}: AutocompleteProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, defaultValue, inheritFormWrapClass });
    const error = useFieldValidation(name, { required, label });
    const theme = useTheme("select");

    const valueArray = useMemo(() => valueToArray(value), [value]);
    const [selectedItems, setSelectedItems] = useState(() => valueArray);
    useEffect(() => {
        if (!arraysEqual(valueArray, selectedItems)) {
            setSelectedItems(valueArray);
        }
    }, [valueArray, selectedItems]);

    const dbOptions = useMemo(() => getOptionsDB(db), [db?.fieldMap, db?.where, db?.order, db?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    useEffect(() => {
        return database.subscribe(db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);
    }, [database, db?.path, dbOptions]);

    const [localOpts, setLocalOpts] = useState<Option[]>([]);

    const opts = useMemo(() => {
        const combinedOptions = getOptions([...options, ...localOpts], lookup, order, db?.order, dbOptions.fieldMap);
        return arrayUnique(combinedOptions, 'value');
    }, [options, localOpts, lookup, order, db?.order, dbOptions.fieldMap]);

    const commitValue = (currentValue: string, inputEl: HTMLInputElement) => {
        if (!currentValue) return;
        if (selectedItems.includes(currentValue) || (max && selectedItems.length >= max)) {
            inputEl.value = '';
            return;
        }
        setSelectedItems(prevState => {
            const updatedItems = [...prevState, currentValue];
            setTimeout(() => {
                handleChange?.({ target: { name, value: updatedItems } });
            }, 0);
            return updatedItems;
        });
        inputEl.value = '';
    };

    const handleAutocompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;
        const inOpts = opts.some(op => op.value === currentValue);
        if (!inOpts) return;
        commitValue(currentValue, e.target);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const currentValue = (e.target as HTMLInputElement).value.trim();
        if (!currentValue) return;

        const inOpts = opts.some(op => op.value === currentValue);
        if (!inOpts) {
            if (!creatable) return;
            setLocalOpts(prev => [...prev, { label: currentValue, value: currentValue }]);
            onCreate?.(currentValue);
        }
        commitValue(currentValue, e.target as HTMLInputElement);
    };

    const removeItem = (currentValue: string) => {
        setSelectedItems(prevState => {
            const updatedItems = prevState.filter(item => item !== currentValue);
            setTimeout(() => {
                handleChange?.({ target: { name, value: updatedItems } });
            }, 0);
            return updatedItems;
        });
    };

    const id = useId();
    const listId = `${id}-options`;
    return (
        <Wrapper className={formWrapClass || theme.Autocomplete.wrapClass}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <Wrapper className={pre || post ? cn(fieldGroupClass, "flex-nowrap") : ""}>
                {pre && <SelectAddon side="pre">{pre}</SelectAddon>}
                <div className={cn(
                    fieldControlBaseClass,
                    "h-auto min-h-9 flex-wrap items-center gap-1 py-1.5 px-2",
                    pre && "rounded-l-none",
                    post && "rounded-r-none"
                )}>
                    {(selectedItems as string[]).map(item => (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary" key={item}>
                            {item}
                            <button type="button" className="ml-0.5 opacity-60 transition-opacity hover:opacity-100" onClick={() => removeItem(item)}>×</button>
                        </span>
                    ))}
                    {(!max || selectedItems.length < max) && (
                        <input
                            id={id}
                            type="text"
                            className={cn("min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground", className || theme.Autocomplete.className)}
                            required={required && selectedItems.length < (min || 0)}
                            disabled={disabled || (!updatable && !isEmpty(value))}
                            placeholder={creatable ? (placeholder ?? 'Type or press Enter to create...') : placeholder}
                            title={title}
                            list={listId}
                            onChange={handleAutocompleteChange}
                            onKeyDown={handleKeyDown}
                        />
                    )}
                </div>
                <datalist id={listId}>
                    {opts.map((op, index) => <option value={op.value} key={`${id}-${index}`}>{op.label}</option>)}
                </datalist>
                {post && <SelectAddon side="post">{post}</SelectAddon>}
            </Wrapper>
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
    updatable = true,
    disabled = false,
    label = undefined,
    title = undefined,
    pre = undefined,
    post = undefined,
    feedback = undefined,
    options = [],
    db = undefined,
    order = undefined,
    inheritFormWrapClass = true,
    wrapClass = undefined,
    className = undefined,
    checkClass = undefined,
}: ChecklistProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, defaultValue, inheritFormWrapClass });
    const error = useFieldValidation(name, { required, label });

    const valueArray = useMemo(() => valueToArray(value), [value]);
    const [selectedItems, setSelectedItems] = useState(() => valueArray);
    useEffect(() => {
        if (!arraysEqual(valueArray, selectedItems)) {
            setSelectedItems(valueArray);
        }
    }, [valueArray, selectedItems]);

    const dbOptions = useMemo(() => getOptionsDB(db), [db?.fieldMap, db?.where, db?.order, db?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    useEffect(() => {
        return database.subscribe(db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);
    }, [database, db?.path, dbOptions]);

    const opts = useMemo(() => {
        const combinedOptions = getOptions(options, lookup, order, db?.order, dbOptions.fieldMap);
        return arrayUnique(combinedOptions, 'value');
    }, [options, lookup, order, db?.order, dbOptions.fieldMap]);

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
    const isDisabled = disabled || (!updatable && selectedItems.length > 0);
    const checklist = (
        <Wrapper className={cn(
            pre || post ? cn(fieldControlBaseClass, "h-auto min-h-9 w-full min-w-0 flex-col items-start py-2 px-3") : "",
            "space-y-1"
        )}>
            {opts.map((op) => {
                const key = sanitizeKey(`cl-${id}-${name}-${op.value}`);
                return (
                    <div key={key} className={cn("flex w-full items-center gap-2", checkClass)}>
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
            {pre || post ? (
                <Wrapper className={cn(fieldGroupClass, "flex-nowrap items-stretch")}>
                    {pre && <SelectAddon side="pre">{pre}</SelectAddon>}
                    {checklist}
                    {post && <SelectAddon side="post">{post}</SelectAddon>}
                </Wrapper>
            ) : checklist}
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>}
        </Wrapper>
    );
};
