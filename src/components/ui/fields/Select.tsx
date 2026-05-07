import React, { useEffect, useId, useMemo, useState } from 'react';
import { Label } from "./Input";
import { Col, Wrapper } from "../GridSystem"
import { useTheme } from "../../../Theme";
import { arraysEqual, arrayUnique, isEmpty, sanitizeKey } from "../../../libs/utils";
import { DatabaseOptions, RecordProps } from "../../../providers/data/DataProvider";
import { useDataProvider } from "../../../providers/data/DataProviderContext";
import { FormFieldProps, useFormContext } from '../../widgets/Form';

interface Option extends RecordProps {
    label: string;
    value: string;
}

interface DBConfig extends DatabaseOptions {
    srcPath?: string;
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
    //value         = undefined,
    onChange = undefined,
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
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass });

    const theme = useTheme("select");

    const dbOptions = useMemo(() => getOptionsDB(db), [db?.fieldMap, db?.where, db?.order, db?.onLoad]);
    const database = useDataProvider();
    const [lookup, setLookup] = useState<Option[]>([]);
    database.useListener(db?.srcPath ?? db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);

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
                    className={`form-select ${className || theme.Select.className}`}
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
    //value           = undefined,
    min = undefined,
    max = undefined,
    onChange = undefined,
    required = false,
    updatable = true,
    disabled = false,
    label = undefined,
    placeholder = undefined,
    pre = undefined,
    post = undefined,
    feedback = undefined,
    options = [],
    db = undefined,
    order = undefined,
    wrapClass = undefined,
    className = undefined,
}: AutocompleteProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass });

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
    database.useListener(db?.srcPath ?? db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);

    const opts = useMemo(() => {
        const combinedOptions = getOptions(options, lookup, order, db?.order, dbOptions.fieldMap);
        return arrayUnique(combinedOptions, 'value');
    }, [options, lookup, order, db?.order, dbOptions.fieldMap]);

    const handleAutocompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;

        if (opts.filter(op => op.value === currentValue).length === 0) {
            return;
        }

        if (selectedItems.includes(currentValue) || (max && selectedItems.length >= max)) {
            e.target.value = '';
            return;
        }

        setSelectedItems(prevState => {
            const updatedItems = [...prevState, currentValue];
            setTimeout(() => {
                handleChange?.({ target: { name: name, value: updatedItems } }); //, opts
            }, 0);

            return updatedItems;
        });

        e.target.value = '';
    };

    const removeItem = (currentValue: string) => {
        setSelectedItems(prevState => {
            const updatedItems = prevState.filter(item => item !== currentValue);
            setTimeout(() => {
                handleChange?.({ target: { name: name, value: updatedItems } }); //, opts
            }, 0);

            return updatedItems;
        });
    };

    const id = useId();
    return (
        <Wrapper className={formWrapClass || theme.Autocomplete.wrapClass}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <Wrapper className={pre || post ? "input-group flex-nowrap" : ""}>
                {pre && <span className="input-group-text">{pre}</span>}
                <div className={`d-flex flex-wrap gap-1 form-control`}>
                    {selectedItems.map(item => (
                        <Col xs="auto" className="p-1 bg-secondary rounded" key={item}>
                            {item}<button className={"btn-close ms-1 p-0"} onClick={() => removeItem(item)}></button>
                        </Col>
                    ))}
                    {(!max || selectedItems.length < max) && <Col><input
                        id={id}
                        type={"text"}
                        className={`border-0 form-control w-100 ${className || theme.Autocomplete.className}`}
                        required={required && selectedItems.length < (min || 0)}
                        disabled={disabled || (!updatable && !isEmpty(value))}
                        placeholder={placeholder}
                        list={name}
                        onChange={handleAutocompleteChange}
                    /></Col>}
                </div>
                <datalist id={name}>
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
    //value       = [],
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
    checkClass = undefined,
}: ChecklistProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass });

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
    database.useListener(db?.srcPath ?? db?.path, (records) => setLookup(normalizeLookup(records)), dbOptions);

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

    return (
        <Wrapper className={formWrapClass}>
            {label && <><Label label={label} className={"form-check-label"} required={required} /><hr className={"mt-0"} /></>}
            <Wrapper className={pre || post ? "input-group" : ""}>
                {pre && <span className="input-group-text">{pre}</span>}
                {opts.map((op) => {
                    const key = sanitizeKey(`cl-${name}-${op.value}`);
                    return (
                        <div key={key} className={checkClass}>
                            <input
                                className={"form-check-input"}
                                type={"checkbox"}
                                id={key}
                                defaultValue={op.value}
                                onChange={handleChecklistChange}
                                defaultChecked={selectedItems.includes(op.value)}
                            />
                            <label htmlFor={key} className={"ms-1"}>{op.label}</label>
                        </div>
                    );
                })}
                {post && <span className="input-group-text">{post}</span>}
            </Wrapper>
            {feedback && <div className="feedback">{feedback}</div>}
        </Wrapper>
    );
};
