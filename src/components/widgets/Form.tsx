    import React, { createContext, useContext, useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback, useMemo } from 'react';
    import { flushSync } from 'react-dom';

    import { useLocation } from "react-router-dom";
    import { Wrapper } from "../ui/GridSystem";
    import { trimSlash, cleanRecord, normalizeKey } from "../../libs/utils";
    import { useDataProvider } from "../../providers/data/DataProviderContext";
    import Card from "../ui/Card";
    import { BackLink, LoadingButton } from "../ui/Buttons";
    import { getGlobalVars } from "../../Global";
    import { useTheme } from "../../Theme";
    import { useI18n, interpolate } from "../../I18n";
    import Alert from "../ui/Alert";
    import { FieldValue, RecordProps, RECORD_KEY } from "../../providers/data/DataProvider";
    import {FormTree, ModelProps, buildFormFields} from "../Component";
    import Breadcrumbs from "../blocks/Breadcrumbs";
    import { UIProps } from '../';

    export type ChangeHandler =
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
        | { target: { name: string; value?: FieldValue } };

    type FormHandleChange = (event: ChangeHandler) => void;
    interface FormProviderProps {
        record: RecordProps | undefined;
        setRecord: React.Dispatch<React.SetStateAction<RecordProps | undefined>>;
        wrapperClassName?: string;
    }
    export type FieldOnChange = (params: {event: ChangeHandler, name: string, value: FieldValue, record: RecordProps, onChange: FormHandleChange}) => void;
    export type InputType = "text" | "number" | "email" | "password" | "color" | "date" | "time" | "datetime-local" | "week" | "month" | "range" | "checkbox" | "radio" | "url" ;

    interface FormContextProps {
        name: string;
        onChange?: FieldOnChange;
        wrapperClassName?: string;
        inputType?: InputType;
        defaultValue?: FieldValue;
        inheritWrapperClassName?: boolean;
    }
    interface FormContextResult {
        value: FieldValue;
        handleChange: FormHandleChange;
        formWrapClass?: string;
        record: RecordProps;
    }

    const cloneContainer = (value: unknown): Record<string, unknown> | unknown[] => (
        Array.isArray(value)
            ? [...value]
            : (value && typeof value === "object")
                ? { ...(value as Record<string, unknown>) }
                : {}
    );

    const isArrayIndex = (value: string) => !Number.isNaN(Number(value));

    const normalizeInputValue = (rawValue: FieldValue, inputType: InputType) => {
        if (!["number", "range"].includes(inputType)) return rawValue;
        return rawValue === "" || rawValue == null ? "" : Number(rawValue);
    };

    const createContainer = (nextKey?: string) => {
        return nextKey !== undefined && isArrayIndex(nextKey) ? [] : {};
    };

    const applyChangeToRecord = (
        source: RecordProps | undefined,
        event: ChangeHandler,
        inputType: InputType
    ): RecordProps => {
        const path = event.target.name.split(".");
        const nextValue = normalizeInputValue(event.target.value, inputType);

        const root = cloneContainer(source ?? {}) as RecordProps;
        let cursor: Record<string, unknown> = root as Record<string, unknown>;
        // Dynamic path traversal across nested objects/arrays.

        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            const nextKey = path[i + 1];
            const currentValue = cursor[key];

            cursor[key] =
                currentValue != null && typeof currentValue === "object"
                    ? cloneContainer(currentValue)
                    : createContainer(nextKey);

            cursor = cursor[key] as Record<string, unknown>;
        }

        const finalKey = path[path.length - 1];
        if (nextValue == null || nextValue === "") {
            if (Array.isArray(cursor) && isArrayIndex(finalKey)) {
                (cursor as unknown[]).splice(Number(finalKey), 1);
            } else {
                delete cursor[finalKey];
            }
        } else {
            cursor[finalKey] = nextValue;
        }

        return root;
    };

    export interface FormFieldProps extends UIProps {
        name: string;
        label?: string;
        value?: FieldValue;
        required?: boolean;
        onChange?: FieldOnChange;
        defaultValue?: FieldValue;
        inheritWrapperClassName?: boolean;
    }

    interface SetFormFieldsNameProps {
        children: React.ReactNode;
        parentName: string;
        parentKey?: string;
        wrapperClassName?: string;
    }

    const FormContext = createContext<FormProviderProps | null>(null);

    // ── Validation context ─────────────────────────────────────────────────────

    interface FieldValidationConstraints {
        required?: boolean;
        label?: string;
        validator?: (value: FieldValue) => string | undefined;
    }

    interface FormValidationContextValue {
        registerField: (name: string, ref: React.MutableRefObject<FieldValidationConstraints>) => void;
        unregisterField: (name: string) => void;
        clearFieldError: (name: string) => void;
        errors: Record<string, string>;
    }

    export const FormValidationContext = createContext<FormValidationContextValue | null>(null);

    /**
     * Hook for field components to register themselves for validation and receive
     * their error message. Call it in every field that supports `required`.
     */
    export const useFieldValidation = (name: string, constraints: FieldValidationConstraints): string | undefined => {
        const ctx = useContext(FormValidationContext);
        const constraintsRef = useRef<FieldValidationConstraints>(constraints);
        constraintsRef.current = constraints; // always up to date without re-triggering registration

        useEffect(() => {
            if (!ctx) return;
            ctx.registerField(name, constraintsRef);
            return () => ctx.unregisterField(name);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [name]);

        return ctx?.errors[name];
    };

export const useFormContext = ({name, onChange, wrapperClassName, inputType = "text", defaultValue, inheritWrapperClassName = true}: FormContextProps): FormContextResult => {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error("useFormContext must be used within a FormContext.Provider");
    if (!name) throw new Error("useFormContext: name is required");

    const validationCtx = useContext(FormValidationContext);

        const value = useMemo(() => {
            const currentValue = name.split(".").reduce<FieldValue | undefined>(
                (acc, key) => {
                    if (acc === null || acc === undefined) return undefined;
                    if (Array.isArray(acc)) {
                        const idx = Number(key);
                        return isNaN(idx) ? undefined : acc[idx] as FieldValue | undefined;
                    }
                    if (typeof acc !== 'object') return undefined;
                    return (acc as RecordProps)[key];
                },
                ctx.record
            );
                if (currentValue === undefined && defaultValue !== undefined) {
                    return defaultValue ?? '';
                }
            return currentValue ?? '';
        }, [name, ctx.record, defaultValue]);

        const handleChange = useCallback((event: ChangeHandler) => {
            validationCtx?.clearFieldError(event.target.name);
            let nextRecord: RecordProps | undefined;
            ctx.setRecord((prev) => {
                nextRecord = applyChangeToRecord(prev, event, inputType);
                return nextRecord;
            });
            onChange?.({
                event,
                name,
                value: event.target.value,
                record: nextRecord ?? {},
                onChange: (nextEvent) => {
                    ctx.setRecord((prev) => applyChangeToRecord(prev, nextEvent, inputType));
                }
            });
        }, [validationCtx, ctx.setRecord, onChange, name, inputType]);

        return {
            value,
            handleChange,
            formWrapClass: [wrapperClassName, inheritWrapperClassName ? ctx.wrapperClassName : undefined].filter(Boolean).join(" "),
            record: ctx.record ?? {},
        };
    };

    type UseHandleDropProps = {
        name: string;
        value: FieldValue;
        handleChange?: FormHandleChange;
      };

    export const useHandleDrop = ({ name, value, handleChange }: UseHandleDropProps) => {
        return React.useCallback(
          (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            e.preventDefault();

            const target = e.target as HTMLTextAreaElement | HTMLInputElement;
            const raw = e.dataTransfer.getData("text/plain");
            const text = `${raw}`;

            target.focus();

            // Calcola posizione caret
            const caretPosition = (() => {
              const position =
                document.caretPositionFromPoint?.(e.clientX, e.clientY) ??
                (document as unknown as { caretRangeFromPoint?: (x: number, y: number) => { offset?: number } }).caretRangeFromPoint?.(e.clientX, e.clientY);
              return position && "offset" in position
                ? (position.offset ?? target.value.length)
                : target.value.length;
            })();

            const valueStr = String(value ?? "");
            // Crea nuovo valore
            const newValue =
              valueStr.slice(0, caretPosition) +
              text +
              valueStr.slice(caretPosition);

            // Notifica onChange

            handleChange?.({
              target: {
                value: newValue.trim(),
                name,
              },
            });

            // Posiziona il cursore dopo il testo inserito
            requestAnimationFrame(() => {
              const newPosition = caretPosition + text.length;
              target.setSelectionRange(newPosition, newPosition);
            });
          },
          [name, value, handleChange]
        );
    }

    function setParentName(name: string, parentName: string) {
        if (name.indexOf('.') === -1 || parentName.indexOf('.') === -1) return `${parentName}.${name}`;

        const min = Math.min(name.length, parentName.length);
        let i = 0;

        while (i < min && name.charCodeAt(i) === parentName.charCodeAt(i)) i++;

        const lastDot = name.lastIndexOf('.', i - 1);
        if (lastDot === -1) return `${parentName}.${name}`;

        return `${parentName}.${name.slice(lastDot + 1)}`;
    }

    export const setFormFieldsName = ({children, parentName, parentKey, wrapperClassName}: SetFormFieldsNameProps): React.ReactNode => {
        return React.Children.map(children, (child) => {
            if (!parentName || !React.isValidElement(child)) return child;

            const {name, children: childChildren} = child.props;
            const newProps: Record<string, unknown> = {};
            if (name) {
                newProps.name       = setParentName(name, parentName);
                newProps.key        = parentKey ?? newProps.name;
                newProps.wrapperClassName  = child.props.wrapperClassName ?? wrapperClassName;

                if (child.props.before && React.isValidElement(child.props.before) ) {
                    newProps.before = setFormFieldsName({
                        children: child.props.before,
                        parentName,
                        parentKey: `${newProps.key}.before` ,
                    });
                }
                if (child.props.after && React.isValidElement(child.props.after) ) {
                    newProps.after = setFormFieldsName({
                        children: child.props.after,
                        parentName,
                        parentKey: `${newProps.key}.after` ,
                    });
                }
            }
            if (childChildren) {
                newProps.children   = setFormFieldsName({
                    children: childChildren,
                    parentName,
                    parentKey,
                });
            }

            return React.cloneElement(child as React.ReactElement, newProps as Record<string, unknown>);
        });
    }

    export type FormSaveArgs = {
        record?: RecordProps;
        prevRecord?: RecordProps;
        storagePath?: string;
        action: 'create' | 'update';
    }

    export type FormDeleteArgs = {
        record?: RecordProps;
    }

    export type FormFinallyArgs = {
        record?: RecordProps;
        action: 'create' | 'update' | 'delete';
    }

    export type FormSaveHandler = (args: FormSaveArgs) => Promise<string | undefined>;
    export type FormDeleteHandler = (args: FormDeleteArgs) => Promise<string | undefined>;
    export type FormFinallyHandler = (args: FormFinallyArgs) => Promise<boolean>;

    /** Core props shared by all Form variants. */
    interface BaseFormProps {
        /** Visual wrapper: `"card"` adds a card shell; `"empty"` renders bare. */
        appearance?: "card" | "empty";
        /** Custom content rendered in the form header area. */
        header?: React.ReactNode;
        /** Custom content rendered in the form footer area. */
        footer?: React.ReactNode;
        /** Provider path for data load and save. Omit for a pure local form. */
        path?: string;
        /** Expose internal save/delete handles to a parent ref. */
        handlers?: FormHandlers;
        /** Generate a custom primary key for new records instead of auto-push. */
        keyGenerator?: (record: RecordProps) => string;
        /** Transform the record after loading from the provider. */
        onLoad?: (record: RecordProps) => void;
        /** Called on every field change with the current record state. */
        onRecordChange?: (record: RecordProps) => void;
        /** Transform the record before saving. Return the final record or a custom path. */
        onSave?: FormSaveHandler;
        /** Called before deletion. Return a path override or `undefined`. */
        onDelete?: FormDeleteHandler;
        /** Called after save or delete. Return `false` to suppress default navigation. */
        onComplete?: FormFinallyHandler;
        /** Log field-change events to the console (dev helper). */
        log?: boolean;
        /** Show the inline save/delete notice banner. Defaults to `true`. */
        showNotice?: boolean;
        /** Render a Back navigation button in the footer. */
        showBack?: boolean;
        /** CSS classes on the outermost wrapper element. */
        wrapperClassName?: string;
        /** CSS classes on the header container. */
        headerClassName?: string;
        /** CSS classes on the form body element. */
        className?: string;
        /** CSS classes on the footer container. */
        footerClassName?: string;
    }
    interface FormDefaultProps extends BaseFormProps {
        children: React.ReactNode | ((fields: FormTree) => React.ReactNode) | ((args: { record?: RecordProps}) => React.ReactNode);
        defaultValues?: RecordProps;
    }

    interface FormDatabaseProps extends FormDefaultProps {
        path: string;
    }
    interface FormModelProps extends BaseFormProps {
        model: ModelProps;
        children?: ((fields: FormTree) => React.ReactNode);
    }

    /**
     * Public props for `<Form>`.
     * When `path` points to an existing record the form loads its data automatically.
     * When `keyGenerator` or `defaultValues` is set the form operates in create-only mode.
     */
    export interface FormProps extends BaseFormProps {
        /** Field elements, a render-prop receiving the field tree, or a record-aware function. */
        children?: React.ReactNode | ((fields: FormTree) => React.ReactNode) | ((args: { record?: RecordProps }) => React.ReactNode);
        /** Initial field values for a new record. */
        defaultValues?: RecordProps;
    }

    export interface FormRef {
        handleSave: (e: React.MouseEvent<HTMLElement>) => Promise<boolean>;
        handleDelete: (e: React.MouseEvent<HTMLElement>) => Promise<boolean>;
        getHeader: () => React.ReactNode;
        getRecord: () => {record: RecordProps, isNewRecord: boolean};
        getFooter: () => React.ReactNode;
    }
    type FormHandlers = Partial<FormRef>;



    function Form(props: FormProps, ref?: React.Ref<FormRef>) {
        const location = useLocation();
        const { path, keyGenerator, handlers, defaultValues, children, ...rest } = props;

        const getDbPath = (p: string | undefined) => (
            p ?? (location.hash
                ? `${trimSlash(location.pathname)}/${location.hash.slice(1)}`
                : undefined)
        );

        const dbPath = getDbPath(path);

        // keyGenerator → always FormData (create mode, no DB read).
        return defaultValues || !dbPath || keyGenerator || (handlers && !path)
            ? <FormData children={children} defaultValues={defaultValues} handlers={handlers} path={path} keyGenerator={keyGenerator} {...rest} ref={ref} />
            : <FormDatabase children={children} defaultValues={defaultValues} handlers={handlers} path={dbPath} keyGenerator={keyGenerator} {...rest} ref={ref} />;
    }

    export const FormDatabase = forwardRef<FormRef, FormDatabaseProps>((props, ref) => {
        const { path, defaultValues, ...rest } = props;
        const db = useDataProvider();

        const [record, setRecord] = useState<RecordProps | undefined>(undefined);

        useEffect(() => {
            db.read(path).then(data => {
                setRecord({ ...defaultValues, ...data});
            }).catch(error => {
                console.error(error);
                setRecord({});
            });
        }, [path]);


        if (!record) {
            return <p className={"p-4"}><span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Loading...</p>;
        }

        return <FormData {...rest} defaultValues={record} path={path} ref={ref} />;
    });

    type NoticeProps = {
        type: "danger" | "success" | "info" | "warning" | "primary" | "secondary" | "light" | "dark";
        message: string;
    };

    const FormData = forwardRef<FormRef, FormDefaultProps>(({
        children,
        appearance = undefined,
        header = undefined,
        footer = undefined,
        path = undefined,
        handlers = undefined,
        defaultValues = undefined,
        keyGenerator = undefined,
        onLoad = undefined,
        onRecordChange = undefined,
        onSave = undefined,
        onDelete = undefined,
        onComplete = undefined,
        log = false,
        showNotice = true,
        showBack = false,
        wrapperClassName = undefined,
        headerClassName = undefined,
        className = undefined,
        footerClassName = undefined
    }, ref) => {
        const theme = useTheme("form");
        const dict = useI18n('form');
        const db = useDataProvider();

        const [record, setRecord] = useState<RecordProps | undefined>(defaultValues);
        const isNewRecord = !defaultValues?.[RECORD_KEY];

        // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(()=>{
            if (defaultValues) {
                setRecord({...defaultValues});
                onLoad?.({...defaultValues});
            }
        }, [JSON.stringify(defaultValues)]);

        const recordRef = useRef(record);
        useEffect(() => {
            recordRef.current = record;
            if (record !== undefined) onRecordChange?.(record);
        }, [record]);


        const [notification, setNotification] = useState<NoticeProps | undefined>(undefined);
        const notice = useCallback(({ message, type = "danger" }: NoticeProps) => {
            if (showNotice) {
                setNotification({ type, message });
            }
        }, [showNotice]);

        const [errors, setErrors] = useState<Record<string, string>>({});
        const fieldRefs = useRef<Record<string, React.MutableRefObject<FieldValidationConstraints>>>({});
        const containerRef = useRef<HTMLFormElement>(null);

        const registerField = useCallback((name: string, ref: React.MutableRefObject<FieldValidationConstraints>) => {
            fieldRefs.current[name] = ref;
        }, []);

        const unregisterField = useCallback((name: string) => {
            delete fieldRefs.current[name];
        }, []);

        const clearFieldError = useCallback((name: string) => {
            setErrors(prev => {
                if (!prev[name]) return prev;
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }, []);

        const validateFields = useCallback((): boolean => {
            const newErrors: Record<string, string> = {};
            for (const [fieldName, constraintsRef] of Object.entries(fieldRefs.current)) {
                const { required, label, validator } = constraintsRef.current;
                const value = fieldName
                    .split('.')
                    .reduce<FieldValue | undefined>(
                        (acc, key) => {
                            if (acc === null || acc === undefined) return undefined;
                            if (Array.isArray(acc)) return acc[Number(key)] as FieldValue | undefined;
                            if (typeof acc !== 'object') return undefined;
                            return (acc as RecordProps)[key];
                        },
                        recordRef.current
                    );
                if (required) {
                    const empty =
                        value === null ||
                        value === undefined ||
                        (typeof value === 'string' && value.trim() === '') ||
                        (Array.isArray(value) && value.length === 0);
                    if (empty) {
                        newErrors[fieldName] = label
                            ? interpolate(dict.requiredField, { field: label })
                            : dict.requiredFieldGeneric;
                        continue;
                    }
                }
                if (validator) {
                    const msg = validator(value);
                    if (msg) newErrors[fieldName] = msg;
                }
            }
            setErrors(newErrors);
            if (Object.keys(newErrors).length > 0) {
                const firstName = Object.keys(newErrors)[0];
                requestAnimationFrame(() => {
                    containerRef.current
                        ?.querySelector<HTMLElement>(`[name="${CSS.escape(firstName)}"]`)
                        ?.focus();
                });
            }
            return Object.keys(newErrors).length === 0;
        }, [dict]);

        // Builds the DB write path from the collection path and record key.
        // For existing records: strips trailing record-ID segment if already in path,
        // then appends the key - handles both /users and /users/user_001 as input.
        const computeSavePath = useCallback((rec: RecordProps): string | undefined => {
            if (!path) return undefined;
            const base = trimSlash(path);
            if (isNewRecord) {
                const segments = base.split('/').filter(Boolean);
                // Even segment count = doc path (e.g. /table/id) - ID already embedded, save directly
                if (segments.length % 2 === 0 && !keyGenerator) {
                    return `/${base}`;
                }
                const key = keyGenerator?.(rec) ?? Date.now().toString();
                return `/${base}/${key}`;
            }
            const key = rec[RECORD_KEY];
            if (!key) return path;
            const segments = base.split('/').filter(Boolean);
            const parent = segments[segments.length - 1] === key
                ? segments.slice(0, -1).join('/')
                : base;
            return `/${parent}/${key}`;
        }, [path, keyGenerator, isNewRecord]);


        const handleSave = useCallback(async (e: React.MouseEvent<HTMLElement>): Promise<boolean> => {
            e.preventDefault();

            flushSync(() => {
                setErrors({});
                showNotice && setNotification(undefined);
            });
            if (!validateFields()) {
                showNotice && setNotification({ message: dict.noticeRequiredFields, type: "warning" });
                return false;
            }
            const action = isNewRecord ? "create" : "update";

            const recordStoragePath =
                (onSave && await onSave({
                    record: recordRef.current,
                    prevRecord: defaultValues,
                    action,
                    storagePath: path,
                }))
                ?? computeSavePath(recordRef.current ?? {});

            recordStoragePath && await db.set(recordStoragePath, cleanRecord(recordRef.current));
            return await handleFinally(action);
        }, [path, onSave, onComplete, showNotice, computeSavePath, validateFields, dict]);

        const handleDelete = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();

            showNotice && setNotification(undefined);

            const recordStoragePath =
                (onDelete && await onDelete({ record: recordRef.current }))
                ?? computeSavePath(recordRef.current ?? {});

            recordStoragePath && await db.remove(recordStoragePath);
            return await handleFinally("delete");
        }, [path, onDelete, onComplete, showNotice, computeSavePath]);

        const handleFinally = useCallback(async (action: 'create' | 'update' | 'delete') => {
            if (log && path && db) {
                const when = new Date().toISOString();
                const user = getGlobalVars("user");
                db.set(`/log/${path}/${normalizeKey(when)}`, {
                    user: user?.email ?? 'unknown',
                    when,
                    action,
                    record: recordRef.current,
                });
            }

            notice({ message: action === 'delete' ? dict.deleteSuccess : dict.saveSuccess, type: "success" });

            return (await onComplete?.({record: recordRef.current, action})) ?? true;
        }, [log, path, onComplete, notice, dict]);

        useImperativeHandle(ref, () => ({
            handleSave: handlers?.handleSave ?? handleSave,
            handleDelete: handlers?.handleDelete ?? handleDelete,
            getHeader: handlers?.getHeader ?? (() => header),
            getRecord: handlers?.getRecord ?? (() => ({record: recordRef.current ?? {}, isNewRecord})),
            getFooter: handlers?.getFooter ?? (() => footer),
        }), [handleSave, handleDelete, handlers]);

        const validationContextValue = useMemo(() => ({
            registerField,
            unregisterField,
            clearFieldError,
            errors,
        }), [registerField, unregisterField, clearFieldError, errors]);

        const formCtx = useMemo(() => ({ record, setRecord, wrapperClassName: "mb-3" as const }), [record, setRecord]);

        const components = useMemo(() => (
            <FormContext.Provider value={formCtx}>
                <FormValidationContext.Provider value={validationContextValue}>
                    {typeof children === 'function' ? children({record} as unknown as FormTree & { record?: RecordProps | undefined }) : children}
                </FormValidationContext.Provider>
            </FormContext.Provider>
        ), [formCtx, validationContextValue, children, record]);

        const notificationEl = useMemo(() => notification ? (
            <Alert
                variant={notification.type}
                appearance="text"
                timeout={notification.type === 'success' ? 3000 : undefined}
                onClose={notification.type === 'success' ? () => setNotification(undefined) : undefined}
            >
                {notification.message}
            </Alert>
        ) : null, [notification]);

        const displayComponent = useMemo(() => {
            if(!appearance && ref) return <>{components}{notificationEl}</>;

            switch (appearance) {
                case "empty":
                    return <>{components}{notificationEl}</>;
                case "card":
                default:
                    return <Card
                        header={header || <Breadcrumbs rootItem={(isNewRecord ? dict.headerAdd : dict.headerEdit)} trail={path || undefined} />}
                        footer={(footer || !isNewRecord || onSave || onDelete || showBack || !!path) && <>
                            {footer}
                            {notificationEl}
                            {(onSave || !!path || !isNewRecord) && <LoadingButton
                                className={theme.Form.buttonSaveClass}
                                label={dict.buttonSave}
                                onClick={e => handleSave(e)}
                            />}
                            {(onDelete || !isNewRecord) && <LoadingButton
                                className={theme.Form.buttonDeleteClass}
                                label={dict.buttonDelete}
                                onClick={handleDelete}
                            />}
                            {showBack && <BackLink
                                className={theme.Form.buttonBackClass}
                                label={dict.buttonBack}
                            />}
                        </>}
                        headerClassName={headerClassName || theme.Form.Card.headerClassName}
                        bodyClassName={className || theme.Form.Card.bodyClassName}
                        footerClassName={footerClassName || theme.Form.Card.footerClassName}
                    >
                        {components}
                    </Card>;
            }
        }, [appearance, header, footer, onSave, onDelete, showBack, components, ref, notificationEl, dict, isNewRecord, path, handleSave, handleDelete]);

        return (
            <Wrapper className={wrapperClassName || theme.Form.wrapperClassName}>
                <form ref={containerRef} noValidate onSubmit={e => e.preventDefault()}>
                    {displayComponent}
                </form>
            </Wrapper>
        )
    });

    export function FormModel({
                                model,
                                children,
                                ...formProps
                            }: FormModelProps
    ) {
        const [ fields, defaults ] = React.useMemo(() => {
            if (!model) return [{}, {}];
            return buildFormFields(model);
        }, [model]);

        const location = useLocation();
        const getDbPath = (p: string | undefined) => (
            p ?? (location.hash
                ? `${trimSlash(location.pathname)}/${location.hash.slice(1)}`
                : undefined)
        );

        console.log("formnodel nodes", children && children(fields));
        const dbPath = getDbPath(formProps.path);
        if (!dbPath) return null;

        return (
            <FormDatabase path={dbPath} defaultValues={defaults as RecordProps} {...formProps}>
                {children && children(fields)}
            </FormDatabase>

        );
    }

    export default forwardRef(Form);
