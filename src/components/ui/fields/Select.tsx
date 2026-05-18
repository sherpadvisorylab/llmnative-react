import React, { useEffect, useId, useMemo, useState } from 'react';
import { Label } from "./Input";
import { Wrapper } from "../GridSystem"
import { useTheme } from "../../../Theme";
import { arraysEqual, arrayUnique, isEmpty, sanitizeKey } from "../../../libs/utils";
import { DatabaseOptions, RecordProps } from "../../../providers/data/DataProvider";
import { useDataProvider } from "../../../providers/data/DataProviderContext";
import { FormFieldProps, useFormContext } from '../../widgets/Form';
import { cn } from '../../../libs/cn';

interface Option extends RecordProps {
    label: string;
    value: string;
}

interface DBConfig extends DatabaseOptions {
    path?: string;
}

interface OrderConfig {
    field: 'label' | 'value';
    dir: 'asc' | 'desc';
}

const DEFAULT_ORDER: OrderConfig = { field: "label", dir: "asc" };

interface BaseProps extends FormFieldProps {
    updatable?: boolean;
    disabled?: boolean;
    title?: string;
    feedback?: string;
    options?: Option[] | string[] | number[];
    db?: DBConfig;
    order?: OrderConfig;
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

const valueToArray = (value: string | number | any[] | undefined): any[] => {
    if (!value) return []

    return typeof value === 'string' || typeof value === "number"
        ? value.toString().split(',')
        : value;
}

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
        label: record.label ?? record.name ?? record.title ?? record._key ?? '',
        value: record.value ?? record._key ?? record.label ?? record.name ?? '',
    }));

function getOptionsDB(
    db?: DBConfig
): DatabaseOptions {
    return {
        fieldMap: normalizeOption(db?.fieldMap),
        where: db?.where,
        order: db?.order,
        onLoad: db?.onLoad,
    };
}

const isDbOrdered = (
    fieldMap: DatabaseOptions["fieldMap"],
    dbOrder: DBConfig["order"],
    order: OrderConfig
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
    order?: OrderConfig,
    dbOrder?: DBConfig["order"],
    fieldMap?: DatabaseOptions["fieldMap"]
): Option[] => {
    const effectiveOrder = order || DEFAULT_ORDER;
    const combined = [
        ...options.map(normalizeOption),
        ...lookup
    ];

    if (options.length === 0 && isDbOrdered(fieldMap, dbOrder, effectiveOrder)) {
        return combined;
    }

    return combined.sort((a, b) => {
        const field = effectiveOrder.field;
        const aVal = (a[field] ?? "").toString();
        const bVal = (b[field] ?? "").toString();
        return effectiveOrder.dir === "desc"
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal)
    });
}

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
    wrapClass = undefined,
    className = undefined,
}: SelectProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, defaultValue });

    const theme = useTheme("select");

    const dbOptions = useMemo(() => getOptionsDB(db), [db?.fieldMap, db?.where, db?.order, db?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    database.useListener(db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);

    const opts = useMemo(() => {
        const combinedOptions = getOptions(options, lookup, order, db?.order, dbOptions.fieldMap);

        return arrayUnique(
            value && !combinedOptions.length
                ? [...combinedOptions, { label: `❌ ${value.toString()}`, value: value.toString() }]
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
            <Wrapper className={pre || post ? "input-group flex-nowrap" : ""}>
                {pre && <span className="input-group-text">{pre}</span>}
                <select
                    id={id}
                    name={name}
                    className={cn("form-select", className || theme.Select.className)}
                    value={value ?? ''}
                    required={required}
                    disabled={disabled || (!updatable && !isEmpty(value))}
                    onChange={handleChange}
                    title={title}
                >
                    {optionEmpty && <option key={`${id}-empty`} value={optionEmpty.value}>{optionEmpty.label}</option>}
                    {opts.map((op, index) => <option key={`${id}-${index}`} value={op.value}>{op.label}</option>)}
                </select>
                {post && <span className="input-group-text">{post}</span>}
            </Wrapper>
            {feedback && <div className="feedback">{feedback}</div>}
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
    wrapClass = undefined,
    className = undefined,
    creatable = false,
    onCreate = undefined,
}: AutocompleteProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, defaultValue });

    const theme = useTheme("select");

    const valueArray = useMemo(() => valueToArray(value), [value]);
    const [selectedItems, setSelectedItems] = useState(() => valueArray);
    useEffect(() => {
        if (!arraysEqual(valueArray, selectedItems)) {
            setSelectedItems(valueArray);
        }
    }, [valueArray]);

    const dbOptions = useMemo(() => getOptionsDB(db), [db?.fieldMap, db?.where, db?.order, db?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    database.useListener(db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);

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
        if (!inOpts) return; // free input committed via Enter (onKeyDown)
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
            <Wrapper className={pre || post ? "input-group flex-nowrap" : ""}>
                {pre && <span className="input-group-text">{pre}</span>}
                <div className={`flex flex-wrap items-center gap-1 form-control !h-auto min-h-9 py-1.5 px-2`}>
                    {selectedItems.map(item => (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full" key={item}>
                            {item}<button type="button" className="opacity-60 hover:opacity-100 transition-opacity ml-0.5" onClick={() => removeItem(item)}>×</button>
                        </span>
                    ))}
                    {(!max || selectedItems.length < max) && (
                        <input
                            id={id}
                            type="text"
                            className={cn("flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground", className || theme.Autocomplete.className)}
                            required={required && selectedItems.length < (min || 0)}
                            disabled={disabled || (!updatable && !isEmpty(value))}
                            placeholder={creatable ? (placeholder ?? 'Type or press Enter to create…') : placeholder}
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
                {post && <span className="input-group-text">{post}</span>}
            </Wrapper>
            {feedback && <div className="feedback">{feedback}</div>}
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
    wrapClass = undefined,
    className = undefined,
    checkClass = undefined,
}: ChecklistProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, defaultValue });

    const valueArray = useMemo(() => valueToArray(value), [value]);
    const [selectedItems, setSelectedItems] = useState(() => valueArray);
    useEffect(() => {
        if (!arraysEqual(valueArray, selectedItems)) {
            setSelectedItems(valueArray);
        }
    }, [valueArray]);

    const dbOptions = useMemo(() => getOptionsDB(db), [db?.fieldMap, db?.where, db?.order, db?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    database.useListener(db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);

    const opts = useMemo(() => {
        const combinedOptions = getOptions(options, lookup, order, db?.order, dbOptions.fieldMap);
        return arrayUnique(combinedOptions, 'value');
    }, [options, lookup, order, db?.order, dbOptions.fieldMap]);

    const removeItem = (currentValue: string) => {
        setSelectedItems(prevState => {
            const updatedItems = prevState.filter(item => item !== currentValue);
            setTimeout(() => {
                handleChange?.({ target: { name: name, value: updatedItems } }); //, opts
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
                handleChange?.({ target: { name: name, value: updatedItems } }); //, opts
            }, 0);

            return updatedItems;
        });
    };

    const id = useId();
    const isDisabled = disabled || (!updatable && selectedItems.length > 0);
    const checklist = (
        <Wrapper className={cn(
            pre || post ? "form-control !h-auto min-h-9 w-full min-w-0 flex-col items-start py-2 px-3" : "",
            "space-y-1"
        )}>
            {opts.map((op) => {
                const key = sanitizeKey(`cl-${id}-${name}-${op.value}`);
                return (
                    <div key={key} className={cn("form-check flex w-full items-center gap-2", checkClass)}>
                        <input
                            className={"form-check-input shrink-0"}
                            type={"checkbox"}
                            id={key}
                            name={name}
                            value={op.value}
                            onChange={handleChecklistChange}
                            checked={selectedItems.includes(op.value)}
                            disabled={isDisabled}
                            title={title}
                        />
                        <label htmlFor={key} className={"form-check-label"}>{op.label}</label>
                    </div>
                );
            })}
        </Wrapper>
    );

    return (
        <Wrapper className={cn(formWrapClass, className)}>
            {label && <><Label label={label} className={"form-check-label"} required={required} /><hr className={"mt-0"} /></>}
            {pre || post ? (
                <Wrapper className="input-group flex-nowrap items-stretch">
                    {pre && <span className="input-group-text">{pre}</span>}
                    {checklist}
                    {post && <span className="input-group-text">{post}</span>}
                </Wrapper>
            ) : checklist}
            {feedback && <div className="feedback">{feedback}</div>}
        </Wrapper>
    );
};
