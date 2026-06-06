import React, { useEffect, useId, useState } from 'react';
import { isEmpty, isInteractiveElement } from "../../../libs/utils";
import { Wrapper } from "../GridSystem";
import { ActionButton, Icon, UIProps } from '../../..';
import { FormFieldProps, InputType, useFormContext, useHandleDrop, useFieldValidation } from '../../widgets/Form';
import { cn } from '../../../libs/cn';

interface BaseInputProps extends FormFieldProps {
    placeholder?: string;
    type?: InputType;
    updatable?: boolean;
    disabled?: boolean;
    feedback?: string;
    min?: number;
    max?: number;
    step?: number;
    inputId?: string;
    labelClassName?: string;
    validator?: (value: any) => string | undefined;
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
    updatable?: boolean;
    disabled?: boolean;
    rows?: number;
    maxRows?: number;
    feedback?: string;
    useRef?: React.RefObject<HTMLTextAreaElement | null> | ((el: HTMLTextAreaElement | null) => void) | undefined;
    inputId?: string;
    labelClassName?: string;
    validator?: (value: any) => string | undefined;
}

export interface ListGroupProps extends UIProps {
    children: React.ReactNode[];
    onClick?: (event: React.MouseEvent<HTMLDivElement>, index: number) => void;
    label?: string;
    draggable?: boolean;
    onDrop?: (text: string) => string;
    actives?: number[];
    disables?: number[];
    loaders?: number[];
    itemClass?: string;
}

export const fieldLabelClass = "mb-1 block text-sm font-medium leading-5 text-foreground";
export const fieldFeedbackClass = "mt-1 text-xs text-muted-foreground";
export const fieldControlBaseClass = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
export const fieldTextAreaBaseClass = "flex min-h-[5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
export const fieldGroupClass = "flex w-full items-stretch";
export const fieldAddonClass = "inline-flex shrink-0 items-center border border-input bg-muted px-3 py-1 text-sm text-muted-foreground";

const withFieldEdges = (baseClass: string, { pre, post }: { pre?: React.ReactNode; post?: React.ReactNode }) =>
    cn(
        baseClass,
        pre && "!rounded-l-none",
        post && "!rounded-r-none"
    );

const FieldAddon = ({
    children,
    side,
}: {
    children: React.ReactNode;
    side: 'pre' | 'post';
}) => (
    <span
        className={cn(
            fieldAddonClass,
            side === 'pre' ? "rounded-l-md rounded-r-none border-r-0" : "rounded-l-none rounded-r-md border-l-0"
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
    wrapClass,
    defaultValue,
    valueChecked,
    inheritFormWrapClass,
}: {
    name: string;
    onChange?: CheckboxProps["onChange"];
    wrapClass?: string;
    defaultValue?: any;
    valueChecked: string | number;
    inheritFormWrapClass?: boolean;
}) => {
    const toValueString = (v: any): string => (v == null ? "" : `${v}`);

    const { value, handleChange, formWrapClass } = useFormContext({
        name,
        onChange,
        wrapClass,
        inputType: typeof valueChecked === "number" ? "number" : "text",
        defaultValue:
            defaultValue !== undefined
                ? (toValueString(defaultValue as any) === toValueString(valueChecked) ? toValueString(valueChecked) : "")
                : undefined,
        inheritFormWrapClass,
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
    updatable = true,
    disabled = false,
    pre = undefined,
    post = undefined,
    feedback = undefined,
    min = undefined,
    max = undefined,
    step = undefined,
    inputId = undefined,
    labelClassName = undefined,
    inheritFormWrapClass = true,
    wrapClass = undefined,
    className = undefined,
    validator = undefined,
}: BaseInputProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, inputType: type, defaultValue, inheritFormWrapClass });
    const error = useFieldValidation(name, { required, label, validator });
    const generatedId = useId();
    const id = inputId || generatedId;
    const handleDrop = useHandleDrop({ name, value, handleChange });

    return (
        <Wrapper className={formWrapClass}>
            {label && <Label label={label} required={required} htmlFor={id} className={labelClassName} />}
            <Wrapper className={pre || post ? fieldGroupClass : ""}>
                {pre && <FieldAddon side="pre">{pre}</FieldAddon>}
                <input
                    id={id}
                    type={type}
                    name={name}
                    className={withFieldEdges(cn(fieldControlBaseClass, error && 'border-destructive focus-visible:ring-destructive/20', className), { pre, post })}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || (!updatable && !isEmpty(value))}
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                />
                {post && <FieldAddon side="post">{post}</FieldAddon>}
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

    return <Input {...props} type={visible ? "text" : "password"} post={
        <ActionButton
            className="p-0 border-0"
            icon={visible ? "eye" : "eye-slash"}
            onClick={() => setVisible(!visible)}
        />}
    />;
};

export const Color = (props: InputProps) => (
    <Input {...props} type="color" />
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
    pre = undefined,
    post = undefined,
    inheritFormWrapClass = true,
    wrapClass = undefined,
    className = undefined
}: CheckboxProps) => {
    const { id, checked, formWrapClass, handleCheckboxChange } = useCheckboxField({
        name,
        onChange,
        wrapClass,
        defaultValue,
        valueChecked,
        inheritFormWrapClass,
    });
    const error = useFieldValidation(name, { required, label });

    return (
        <Wrapper className={formWrapClass}>
            <div className="flex items-center gap-2">
                {pre}
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
                    {required && <span className="text-danger">&nbsp;*</span>}
                </label>}
                {post}
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
    pre = undefined,
    post = undefined,
    inheritFormWrapClass = true,
    wrapClass = undefined,
    className = undefined
}: CheckboxProps) => {
    const { id, checked, formWrapClass, handleCheckboxChange } = useCheckboxField({
        name,
        onChange,
        wrapClass,
        defaultValue,
        valueChecked,
        inheritFormWrapClass,
    });
    const error = useFieldValidation(name, { required, label });

    return (
        <Wrapper className={formWrapClass}>
            <div className="flex items-center gap-2">
                {pre}
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
                            {required && <span className="text-danger">&nbsp;*</span>}
                        </span>
                    )}
                </label>
                {post}
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
            {label} {required && <span className="text-danger">*</span>}
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
    updatable = true,
    disabled = false,
    rows = undefined,
    maxRows = undefined,
    useRef = undefined,
    pre = undefined,
    post = undefined,
    feedback = undefined,
    inputId = undefined,
    labelClassName = undefined,
    inheritFormWrapClass = true,
    className = undefined,
    wrapClass = undefined,
    validator = undefined,
}: TextAreaProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapClass, defaultValue, inheritFormWrapClass });
    const error = useFieldValidation(name, { required, label, validator });

    const generatedId = useId();
    const id = inputId || generatedId;
    const handleDrop = useHandleDrop({ name, value, handleChange });
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    const assignRef = (el: HTMLTextAreaElement | null) => {
        internalRef.current = el;

        if (typeof useRef === "function") {
            useRef(el);
            return;
        }

        if (useRef && typeof useRef === "object" && "current" in useRef) {
            (useRef as { current: HTMLTextAreaElement | null }).current = el;
        }
    };

    useEffect(() => {
        if (!maxRows || !internalRef.current) return;
        const el = internalRef.current;
        const applyResize = () => {
            const s = getComputedStyle(el);
            const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.5;
            const pt = parseFloat(s.paddingTop) || 0;
            const pb = parseFloat(s.paddingBottom) || 0;
            const minH = rows ? lh * rows + pt + pb : 0;
            const maxH = lh * maxRows + pt + pb;
            el.style.height = 'auto';
            const h = Math.min(Math.max(el.scrollHeight, minH), maxH);
            el.style.height = `${h}px`;
            el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
        };
        applyResize();
        el.addEventListener('input', applyResize);
        return () => el.removeEventListener('input', applyResize);
    }, [maxRows, rows]);

    useEffect(() => {
        if (!maxRows || !internalRef.current) return;
        const el = internalRef.current;
        const s = getComputedStyle(el);
        const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.5;
        const pt = parseFloat(s.paddingTop) || 0;
        const pb = parseFloat(s.paddingBottom) || 0;
        const minH = rows ? lh * rows + pt + pb : 0;
        const maxH = lh * maxRows + pt + pb;
        el.style.height = 'auto';
        const h = Math.min(Math.max(el.scrollHeight, minH), maxH);
        el.style.height = `${h}px`;
        el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
    }, [value, maxRows, rows]);

    return (
        <Wrapper className={formWrapClass}>
            {label && <Label required={required} label={label} htmlFor={id} className={labelClassName} />}
            <Wrapper className={pre || post ? fieldGroupClass : ""}>
                {pre && <FieldAddon side="pre">{pre}</FieldAddon>}
                <textarea
                    id={id}
                    name={name}
                    className={withFieldEdges(cn(fieldTextAreaBaseClass, maxRows && "resize-none", error && 'border-destructive focus-visible:ring-destructive/20', className), { pre, post })}
                    ref={assignRef}
                    rows={rows}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || (!updatable && !isEmpty(value))}
                    value={value}
                    onChange={handleChange}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                />
                {post && <FieldAddon side="post">{post}</FieldAddon>}
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
    actives = undefined,
    draggable = undefined,
    onDrop = undefined,
    disables = undefined,
    loaders = undefined,
    pre = undefined,
    post = undefined,
    wrapClass = undefined,
    className = undefined,
    itemClass = undefined
}: ListGroupProps) => {
    const fullClassName = `list-group${className ? ' ' + className : ''}`;

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

    return <Wrapper className={wrapClass}>
        {pre}
        {label && <div>{label}</div>}
        <div className={fullClassName}>
            {children.map((child, index) => {
                const isActive = actives?.includes(index);
                const isDisable = disables?.includes(index);
                const isLoading = loaders?.includes(index);
                const fullItemClass = `list-group-item pl-1 ${itemClass ? ' ' + itemClass : ''
                    }${onClick ? ' list-group-item-action' : ''
                    }${isActive ? ' active' : ''
                    }${isDisable ? ' disabled' : ''
                    }${isLoading ? ' loading' : ''}`;

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
        {post}
    </Wrapper>;
};
