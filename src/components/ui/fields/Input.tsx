import React, { useEffect, useId, useState } from 'react';
import { isEmpty, isInteractiveElement } from "../../../libs/utils";
import { Wrapper } from "../GridSystem";
import { ActionButton, Icon, UIProps } from '../../..';
import { FormFieldProps, InputType, useFormContext, useHandleDrop, useFieldValidation } from '../../widgets/Form';
import type { FieldValue } from '../../../providers/data/DataProvider';
import { cn } from '../../../libs/cn';
import { useEditorHeight } from '../../../libs/editorHeight';

interface BaseInputProps extends FormFieldProps {
    placeholder?: string;
    type?: InputType;
    /** When `true`, the field becomes read-only (disabled) once a value has been set. */
    readOnlyAfterSet?: boolean;
    disabled?: boolean;
    feedback?: string;
    min?: number;
    max?: number;
    step?: number;
    id?: string;
    labelClassName?: string;
    validator?: (value: FieldValue) => string | undefined | Promise<string | undefined>;
    /** Content rendered as an absolute overlay inside the input (right side). No addon border/bg. */
    afterInset?: React.ReactNode;
}

interface LabelProps {
    label: string;
    required?: boolean;
    htmlFor?: string;
    className?: string;
}

export type InputProps = Omit<BaseInputProps, 'type'>;

export interface CheckboxProps extends FormFieldProps {
    title?: string;
    ariaLabel?: string;
    valueChecked?: string | number;
}

export interface TextAreaProps extends FormFieldProps {
    placeholder?: string;
    /** When `true`, the textarea becomes read-only (disabled) once a value has been set. */
    readOnlyAfterSet?: boolean;
    disabled?: boolean;
    minHeight?: number;
    maxHeight?: number;
    feedback?: string;
    textareaRef?: React.RefObject<HTMLTextAreaElement | null> | ((el: HTMLTextAreaElement | null) => void) | undefined;
    id?: string;
    labelClassName?: string;
    validator?: (value: FieldValue) => string | undefined | Promise<string | undefined>;
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onClick?: React.MouseEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
}

export interface ListGroupProps extends UIProps {
    children: React.ReactNode[];
    onClick?: (event: React.MouseEvent<HTMLDivElement>, index: number) => void;
    label?: string;
    draggable?: boolean;
    onDrop?: (text: string) => string;
    activeIndices?: number[];
    disabledIndices?: number[];
    loadingIndices?: number[];
    itemClassName?: string;
}

export const fieldLabelClass = "mb-1 block text-sm font-medium leading-5 text-foreground";
export const fieldFeedbackClass = "mt-1 text-xs text-muted-foreground";
export const fieldControlBaseClass = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
export const fieldTextAreaBaseClass = "flex min-h-[5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
export const fieldGroupClass = "flex w-full items-stretch";
export const fieldAddonClass = "inline-flex shrink-0 items-center border border-input bg-muted px-3 py-1 text-sm text-muted-foreground";

const withFieldEdges = (baseClass: string, { before, after }: { before?: React.ReactNode; after?: React.ReactNode }) =>
    cn(
        baseClass,
        before && "!rounded-l-none",
        after && "!rounded-r-none"
    );

const FieldAddon = ({
    children,
    side,
}: {
    children: React.ReactNode;
    side: 'before' | 'after';
}) => (
    <span
        className={cn(
            fieldAddonClass,
            side === 'before' ? "rounded-l-md rounded-r-none border-r-0" : "rounded-l-none rounded-r-md border-l-0"
        )}
    >
        {children}
    </span>
);

export const FieldError = ({ message }: { message: string }) => (
    <div
        className="mt-1 flex items-center gap-1 text-xs text-destructive"
        role="alert"
        aria-live="polite"
    >
        <Icon name="warning-circle" size={12} className="shrink-0" />
        <span>{message}</span>
    </div>
);

const useCheckboxField = ({
    name,
    onChange,
    wrapperClassName,
    defaultValue,
    valueChecked,
    inheritWrapperClassName,
}: {
    name: string;
    onChange?: CheckboxProps["onChange"];
    wrapperClassName?: string;
    defaultValue?: FieldValue;
    valueChecked: string | number;
    inheritWrapperClassName?: boolean;
}) => {
    const toValueString = (v: FieldValue): string => (v == null ? "" : `${v}`);

    const { value, handleChange, formWrapClass } = useFormContext({
        name,
        onChange,
        wrapperClassName,
        inputType: typeof valueChecked === "number" ? "number" : "text",
        defaultValue:
            defaultValue !== undefined
                ? (toValueString(defaultValue) === toValueString(valueChecked) ? toValueString(valueChecked) : "")
                : undefined,
        inheritWrapperClassName,
    });

    const id = useId();
    const checked = toValueString(value) === toValueString(valueChecked);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange?.({
            target: {
                name,
                value: event.target.checked ? valueChecked : "",
            },
        });
    };

    return {
        id,
        checked,
        formWrapClass,
        handleCheckboxChange,
    };
};

export const Input = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    placeholder = undefined,
    label = undefined,
    type = "text",
    required = false,
    readOnlyAfterSet = false,
    disabled = false,
    before = undefined,
    after = undefined,
    afterInset = undefined,
    feedback = undefined,
    min = undefined,
    max = undefined,
    step = undefined,
    id = undefined,
    labelClassName = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined,
    validator = undefined,
}: BaseInputProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, inputType: type, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });
    const generatedId = useId();
    const elementId = id ?? generatedId;
    const handleDrop = useHandleDrop({ name, value, handleChange });

    return (
        <Wrapper className={formWrapClass}>
            {label && <Label label={label} required={required} htmlFor={elementId} className={labelClassName} />}
            <Wrapper className={cn(before || after ? fieldGroupClass : "", afterInset && "relative")}>
                {before && <FieldAddon side="before">{before}</FieldAddon>}
                <input
                    id={elementId}
                    type={type}
                    name={name}
                    className={withFieldEdges(cn(fieldControlBaseClass, error && 'border-destructive focus-visible:ring-destructive/20', afterInset && 'pr-9', className), { before, after })}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || (readOnlyAfterSet && !isEmpty(value))}
                    value={(value as string | number | undefined) ?? ''}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                />
                {after && <FieldAddon side="after">{after}</FieldAddon>}
                {afterInset && (
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 [&>*]:pointer-events-auto">
                        {afterInset}
                    </span>
                )}
            </Wrapper>
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>
            }
        </Wrapper>
    );
};

export const String = (props: InputProps) => (
    <Input {...props} type="text" />
);

export const Number = (props: InputProps) => (
    <Input {...props} type="number" />
);

export const Email = (props: InputProps) => (
    <Input {...props} type="email" />
);

export const Password = (props: InputProps) => {
    const [visible, setVisible] = useState(false);

    return <Input {...props} type={visible ? "text" : "password"} afterInset={
        <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible(!visible)}
            className="h-7 w-7 inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
            <Icon name={visible ? "eye" : "eye-off"} size={15} />
        </button>
    }/>;
};

// twMerge resolves conflicts: w-10 beats w-full, p-0.5 beats px-3 py-1
export const Color = ({ className, ...props }: InputProps) => (
    <Input
        {...props}
        type="color"
        className={cn('w-10 shrink-0 cursor-pointer p-0.5', className)}
    />
);

export const Date = (props: InputProps) => (
    <Input {...props} type="date" />
);

export const Time = (props: InputProps) => (
    <Input {...props} type="time" />
);

export const DateTime = (props: InputProps) => (
    <Input {...props} type="datetime-local" />
);

export const Week = (props: InputProps) => (
    <Input {...props} type="week" />
);

export const Month = (props: InputProps) => (
    <Input {...props} type="month" />
);

export const Range = (props: InputProps) => (
    <Input
        {...props}
        type="range"
        className={cn("!border-0 !bg-transparent !shadow-none !px-0 !py-0 !h-auto cursor-pointer accent-primary", props.className)}
    />
);

export const Url = (props: InputProps) => (
    <Input {...props} type="url" />
);

export const Checkbox = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    label = undefined,
    title = undefined,
    ariaLabel = undefined,
    required = false,
    valueChecked = "on",
    before = undefined,
    after = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined
}: CheckboxProps) => {
    const { id, checked, formWrapClass, handleCheckboxChange } = useCheckboxField({
        name,
        onChange,
        wrapperClassName,
        defaultValue,
        valueChecked,
        inheritWrapperClassName,
    });
    const error = useFieldValidation(name, { required, label });

    return (
        <Wrapper className={formWrapClass}>
            <div className="flex items-center gap-2">
                {before}
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    title={title}
                    aria-label={ariaLabel}
                    className={cn(
                        "h-4 w-4 shrink-0 rounded-sm border border-input bg-background text-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    checked={checked}
                    onChange={handleCheckboxChange}
                />
                {label && <label className="text-sm font-medium leading-none text-foreground" htmlFor={id}>
                    {label}
                    {required && <span className="text-destructive">&nbsp;*</span>}
                </label>}
                {after}
            </div>
            {error && <FieldError message={error} />}
        </Wrapper>
    );
};

export const Switch = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    label = undefined,
    title = undefined,
    ariaLabel = undefined,
    required = false,
    valueChecked = "on",
    before = undefined,
    after = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined
}: CheckboxProps) => {
    const { id, checked, formWrapClass, handleCheckboxChange } = useCheckboxField({
        name,
        onChange,
        wrapperClassName,
        defaultValue,
        valueChecked,
        inheritWrapperClassName,
    });
    const error = useFieldValidation(name, { required, label });

    return (
        <Wrapper className={formWrapClass}>
            <div className="flex items-center gap-2">
                {before}
                <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2 select-none">
                    <input
                        id={id}
                        name={name}
                        type="checkbox"
                        title={title}
                        aria-label={ariaLabel}
                        checked={checked}
                        onChange={handleCheckboxChange}
                        className="sr-only"
                    />
                    <span
                        aria-hidden="true"
                        className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-out",
                            checked ? "bg-primary" : "bg-muted-foreground/35",
                            className
                        )}
                    >
                        <span
                            className={cn(
                                "pointer-events-none absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-200 ease-out",
                                checked && "translate-x-4"
                            )}
                        />
                    </span>
                    {label && (
                        <span className="text-sm font-medium leading-none text-foreground">
                            {label}
                            {required && <span className="text-destructive">&nbsp;*</span>}
                        </span>
                    )}
                </label>
                {after}
            </div>
            {error && <FieldError message={error} />}
        </Wrapper>
    );
};

export const Label = ({
    label,
    required = false,
    htmlFor = undefined,
    className = undefined
}: LabelProps) => {
    return (
        <label htmlFor={htmlFor} className={cn(fieldLabelClass, className)}>
            {label} {required && <span className="text-destructive">*</span>}
        </label>
    );
};

export const TextArea = ({
    name,
    onChange = undefined,
    defaultValue = undefined,
    placeholder = undefined,
    label = undefined,
    required = false,
    readOnlyAfterSet = false,
    disabled = false,
    minHeight = 96,
    maxHeight = undefined,
    textareaRef = undefined,
    before = undefined,
    after = undefined,
    feedback = undefined,
    id = undefined,
    labelClassName = undefined,
    inheritWrapperClassName = true,
    className = undefined,
    wrapperClassName = undefined,
    validator = undefined,
    onKeyDown = undefined,
    onClick = undefined,
    onBlur = undefined,
}: TextAreaProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });
    const height = useEditorHeight({ minHeight, maxHeight });

    const generatedId = useId();
    const elementId = id ?? generatedId;
    const handleDrop = useHandleDrop({ name, value, handleChange });
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    const assignRef = (el: HTMLTextAreaElement | null) => {
        internalRef.current = el;

        if (typeof textareaRef === "function") {
            textareaRef(el);
            return;
        }

        if (textareaRef && typeof textareaRef === "object" && "current" in textareaRef) {
            (textareaRef as { current: HTMLTextAreaElement | null }).current = el;
        }
    };

    useEffect(() => {
        if (!internalRef.current) return;
        const el = internalRef.current;
        el.style.height = 'auto';
        const nextHeight = Math.max(el.scrollHeight, height.resolvedMinHeight);
        const cappedHeight = height.resolvedMaxHeight
            ? Math.min(nextHeight, height.resolvedMaxHeight)
            : nextHeight;

        el.style.minHeight = `${height.resolvedMinHeight}px`;
        el.style.maxHeight = height.resolvedMaxHeight ? `${height.resolvedMaxHeight}px` : '';
        el.style.height = `${cappedHeight}px`;
        el.style.overflowY = height.resolvedMaxHeight && nextHeight > height.resolvedMaxHeight ? 'auto' : 'hidden';
    }, [value, height.resolvedMinHeight, height.resolvedMaxHeight]);

    return (
        <Wrapper className={formWrapClass}>
            {label && <Label required={required} label={label} htmlFor={elementId} className={labelClassName} />}
            <Wrapper className={before || after ? fieldGroupClass : ""}>
                {before && <FieldAddon side="before">{before}</FieldAddon>}
                <textarea
                    id={elementId}
                    name={name}
                    className={withFieldEdges(cn(fieldTextAreaBaseClass, "resize-none", error && 'border-destructive focus-visible:ring-destructive/20', className), { before, after })}
                    ref={assignRef}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || (readOnlyAfterSet && !isEmpty(value))}
                    value={(value as string | number | undefined) ?? ''}
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    onClick={onClick}
                    onBlur={onBlur}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                />
                {after && <FieldAddon side="after">{after}</FieldAddon>}
            </Wrapper>
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>
            }
        </Wrapper>
    );
};

export const ListGroup = ({
    children,
    onClick = undefined,
    label = undefined,
    activeIndices = undefined,
    draggable = undefined,
    onDrop = undefined,
    disabledIndices = undefined,
    loadingIndices = undefined,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
    itemClassName = undefined
}: ListGroupProps) => {
    const fullClassName = cn("flex flex-col divide-y divide-border rounded-md border bg-card", className);

    const extractText = (node: React.ReactNode): string => {
        const walk = (n: React.ReactNode): string => {
            if (n == null || typeof n === "boolean") return "";
            if (typeof n === "string" || typeof n === "number") return `${n}`;
            if (Array.isArray(n)) return n.map(walk).join(" ");
            if (React.isValidElement(n)) return walk(n.props.children);
            return "";
        };

        return walk(node).replace(/\s+/g, " ").trim();
    };

    const handleDragStart = (e: React.DragEvent<HTMLSpanElement>, text: string) => {
        e.dataTransfer.setData('text/plain', onDrop?.(text) ?? text);
    };

    return <Wrapper className={wrapperClassName}>
        {before}
        {label && <div>{label}</div>}
        <div className={fullClassName}>
            {children.map((child, index) => {
                const isActive = activeIndices?.includes(index);
                const isDisable = disabledIndices?.includes(index);
                const isLoading = loadingIndices?.includes(index);
                const fullItemClass = cn(
                    "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                    onClick && "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-primary/8 text-foreground",
                    isDisable && "pointer-events-none opacity-50",
                    isLoading && "animate-pulse",
                    itemClassName
                );

                return onClick
                    ? <div
                        key={index}
                        onClick={(e) => {
                            if (!isLoading && !isInteractiveElement(e)) {
                                onClick(e, index);
                            }
                        }}
                        className={fullItemClass}
                        style={{ cursor: "pointer" }}
                    >
                        {child}
                    </div>

                    :
                    <span
                        key={index}
                        className={fullItemClass}
                        draggable={draggable}
                        onDragStart={draggable ? (e) => handleDragStart(e, extractText(child)) : undefined}
                        style={{ cursor: draggable ? 'grab' : 'default' }}
                    >
                        {draggable && <Icon name='grip-vertical' />}
                        {child}
                    </span>;
            })}
        </div>
        {after}
    </Wrapper>;
};
