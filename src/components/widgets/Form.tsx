    import React, { createContext, useContext, useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback, useMemo } from 'react';
    import { flushSync } from 'react-dom';

    import { useLocation } from "react-router-dom";
    import { Wrapper } from "../ui/GridSystem";
    import { trimSlash, cleanRecord } from "../../libs/utils";
    import { useDataProvider } from "../../providers/data/DataProviderContext";
    import Card from "../ui/Card";
    import { BackLink, LoadingButton } from "../ui/Buttons";
    import setLog from "../../libs/log";
    import { useTheme } from "../../Theme";
    import Alert from "../ui/Alert";
    import { RecordProps, RECORD_KEY } from "../../providers/data/DataProvider";
    import {FormTree, ModelProps, buildFormFields} from "../Component";
    import Breadcrumbs from "../blocks/Breadcrumbs";
    import { UIProps } from '../';

    export type ChangeHandler = React.ChangeEvent<any> | { target: { name: string; value?: any } };

    type FormHandleChange = (event: ChangeHandler) => void;
    interface FormProviderProps {
        record: RecordProps | undefined;
        setRecord: React.Dispatch<React.SetStateAction<RecordProps | undefined>>;
        wrapClass?: string;
    }
    export type FieldOnChange = (params: {event: ChangeHandler, name: string, value: any, record: RecordProps, onChange: FormHandleChange}) => void;
    export type InputType = "text" | "number" | "email" | "password" | "color" | "date" | "time" | "datetime-local" | "week" | "month" | "range" | "checkbox" | "radio" | "url" ;

    interface FormContextProps {
        name: string;
        onChange?: FieldOnChange;
        wrapClass?: string;
        inputType?: InputType;
        defaultValue?: any;
        inheritFormWrapClass?: boolean;
    }
    interface FormContextResult {
        value: any;
        handleChange: FormHandleChange;
        formWrapClass?: string;
        record: RecordProps;
    }

    const cloneContainer = (value: any) => (
        Array.isArray(value)
            ? [...value]
            : (value && typeof value === "object")
                ? { ...value }
                : {}
    );

    const isArrayIndex = (value: string) => !Number.isNaN(Number(value));

    const normalizeInputValue = (rawValue: string, inputType: InputType) => {
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
        let cursor: any = root;
        // Dynamic path traversal across nested objects/arrays.

        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            const nextKey = path[i + 1];
            const currentValue = cursor[key];

            cursor[key] =
                currentValue != null && typeof currentValue === "object"
                    ? cloneContainer(currentValue)
                    : createContainer(nextKey);

            cursor = cursor[key];
        }

        const finalKey = path[path.length - 1];
        if (nextValue == null || nextValue === "") {
            if (Array.isArray(cursor) && isArrayIndex(finalKey)) {
                cursor.splice(Number(finalKey), 1);
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
        value?: any;
        required?: boolean;
        onChange?: FieldOnChange;
        defaultValue?: any; //todo: da propagare per le select, checkbox e vrificare la copertura ovunque
        inheritFormWrapClass?: boolean;
    }

    interface SetFormFieldsNameProps {
        children: React.ReactNode;
        parentName: string;
        parentKey?: string;
        wrapClass?: string;
    }

    const FormContext = createContext<FormProviderProps | null>(null);

    // ── Validation context ─────────────────────────────────────────────────────

    interface FieldValidationConstraints {
        required?: boolean;
        label?: string;
        validator?: (value: any) => string | undefined;
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

export const useFormContext = ({name, onChange, wrapClass, inputType = "text", defaultValue, inheritFormWrapClass = true}: FormContextProps): FormContextResult => {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error("useFormContext must be used within a FormContext.Provider");
    if (!name) throw new Error("useFormContext: name is required");

    const validationCtx = useContext(FormValidationContext);

    const formChange = (event: ChangeHandler, sourceRecord?: RecordProps) => {
        const nextRecord = applyChangeToRecord(sourceRecord ?? ctx.record, event, inputType);
        return nextRecord;
    }

        const value = useMemo(() => {
            const currentValue = name.split(".").reduce((acc, key) => (acc === undefined ? undefined : acc[key]), ctx.record);
                if (currentValue === undefined && defaultValue !== undefined) {
                    return defaultValue ?? '';
                }
            return currentValue ?? '';
        }, [name, ctx.record, defaultValue]);


        return {
            value,
            handleChange: (event) => {
                validationCtx?.clearFieldError(event.target.name);
                let nextRecord = ctx.record;
                ctx.setRecord((prev) => {
                    nextRecord = formChange(event, prev);
                    return nextRecord;
                });
                onChange?.({
                    event,
                    name,
                    value: event.target.value,
                    record: nextRecord ?? {},
                    onChange: (nextEvent) => {
                        ctx.setRecord((prev) => formChange(nextEvent, prev));
                    }
                });
            },
            formWrapClass: [wrapClass, inheritFormWrapClass ? ctx.wrapClass : undefined].filter(Boolean).join(" "),
            record: ctx.record ?? {},
        };
    };

    type UseHandleDropProps = {
        name: string;
        value: string;
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
                (document as any).caretRangeFromPoint?.(e.clientX, e.clientY);
              return position && "offset" in position
                ? position.offset
                : target.value.length;
            })();

            // Crea nuovo valore
            const newValue =
              (value ?? "").slice(0, caretPosition) +
              text +
              (value ?? "").slice(caretPosition);

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

    export const setFormFieldsName = ({children, parentName, parentKey, wrapClass}: SetFormFieldsNameProps): React.ReactNode => {
        return React.Children.map(children, (child) => {
            if (!parentName || !React.isValidElement(child)) return child;

            const {name, children: childChildren} = child.props;
            const newProps: Record<string, any> = {};
            if (name) {
                newProps.name       = setParentName(name, parentName);
                newProps.key        = parentKey ?? newProps.name;
                newProps.wrapClass  = child.props.wrapClass ?? wrapClass;

                if (child.props.pre && React.isValidElement(child.props.pre) ) {
                    newProps.pre = setFormFieldsName({
                        children: child.props.pre,
                        parentName,
                        parentKey: `${newProps.key}.pre` ,
                    });
                }
                if (child.props.post && React.isValidElement(child.props.post) ) {
                    newProps.post = setFormFieldsName({
                        children: child.props.post,
                        parentName,
                        parentKey: `${newProps.key}.post` ,
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

            return React.cloneElement(child as any, newProps);
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

    interface BaseFormProps {
        aspect?: "card" | "empty";
        header?: React.ReactNode;
        footer?: React.ReactNode;
        path?: string;
        handlers?: FormHandlers;
        keyGenerator?: (record: RecordProps) => string;
        onLoad?: (record: RecordProps) => void;
        onChange?: (record: RecordProps) => void;
        onSave?: FormSaveHandler;
        onDelete?: FormDeleteHandler;
        onFinally?: FormFinallyHandler;
        log?: boolean;
        showNotice?: boolean;
        showBack?: boolean;
        wrapClass?: string;
        headerClass?: string;
        className?: string;
        footerClass?: string;
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

    interface FormProps extends BaseFormProps {
        children?: React.ReactNode | ((fields: FormTree) => React.ReactNode) | ((args: { record?: RecordProps }) => React.ReactNode);
        defaultValues?: RecordProps;
    }

    export interface FormRef {
        handleSave: (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;
        handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;
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
            return <p className={"p-4"}><span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Loading…</p>;
        }

        return <FormData {...rest} defaultValues={record} path={path} ref={ref} />;
    });

    type NoticeProps = {
        type: "danger" | "success" | "info" | "warning" | "primary" | "secondary" | "light" | "dark";
        message: string;
    };

    const FormData = forwardRef<FormRef, FormDefaultProps>(({
        children,
        aspect = undefined,
        header = undefined,
        footer = undefined,
        path = undefined,
        handlers = undefined,
        defaultValues = undefined,
        keyGenerator = undefined,
        onLoad = undefined,
        onChange = undefined,
        onSave = undefined,
        onDelete = undefined,
        onFinally = undefined,
        log = false,
        showNotice = true,
        showBack = false,
        wrapClass = undefined,
        headerClass = undefined,
        className = undefined,
        footerClass = undefined
    }, ref) => {
        const theme = useTheme("form");
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
            if (record !== undefined) onChange?.(record);
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
                    .reduce((acc: any, key) => acc?.[key], recordRef.current);
                if (required) {
                    const empty =
                        value === null ||
                        value === undefined ||
                        (typeof value === 'string' && value.trim() === '') ||
                        (Array.isArray(value) && value.length === 0);
                    if (empty) {
                        newErrors[fieldName] = label ? `${label} is required` : 'Required field';
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
        }, []);

        // Builds the DB write path from the collection path and record key.
        // For existing records: strips trailing record-ID segment if already in path,
        // then appends the key — handles both /users and /users/user_001 as input.
        const computeSavePath = useCallback((rec: RecordProps): string | undefined => {
            if (!path) return undefined;
            const base = trimSlash(path);
            if (isNewRecord) {
                const segments = base.split('/').filter(Boolean);
                // Even segment count = doc path (e.g. /table/id) — ID already embedded, save directly
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


        const handleSave = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<boolean> => {
            e.preventDefault();

            flushSync(() => {
                setErrors({});
                showNotice && setNotification(undefined);
            });
            if (!validateFields()) {
                showNotice && setNotification({ message: theme.Form.i18n.noticeRequiredFields, type: "warning" });
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
        }, [path, onSave, onFinally, showNotice, computeSavePath, validateFields]);

        const handleDelete = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();

            showNotice && setNotification(undefined);

            const recordStoragePath =
                (onDelete && await onDelete({ record: recordRef.current }))
                ?? computeSavePath(recordRef.current ?? {});

            recordStoragePath && await db.remove(recordStoragePath);
            return await handleFinally("delete");
        }, [path, onDelete, onFinally, showNotice, computeSavePath]);

        const handleFinally = useCallback(async (action: 'create' | 'update' | 'delete') => {
            log && path && setLog(path, action, recordRef.current);

            notice({ message: `Record ${action}d successfully`, type: "success" });

            return (await onFinally?.({record: recordRef.current, action})) ?? true;
        }, [log, path, onFinally, notice]);

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

        const components = (
            <FormContext.Provider value={{ record, setRecord, wrapClass: "mb-3" }}>
                <FormValidationContext.Provider value={validationContextValue}>
                    {typeof children === 'function' ? children({record}) : children}
                </FormValidationContext.Provider>
            </FormContext.Provider>
        );


        const notificationEl = notification && (
            <Alert
                type={notification.type}
                appearance="text"
                timeout={notification.type === 'success' ? 3000 : undefined}
                onClose={notification.type === 'success' ? () => setNotification(undefined) : undefined}
            >
                {notification.message}
            </Alert>
        );

        const displayComponent = useMemo(() => {
            if(!aspect && ref) return <>{components}{notificationEl}</>;

            switch (aspect) {
                case "empty":
                    return <>{components}{notificationEl}</>;
                case "card":
                default:
                    return <Card
                        header={header || <Breadcrumbs rootItem={(isNewRecord ? theme.Form.i18n.headerAdd : theme.Form.i18n.headerEdit)} trail={path || undefined} />}
                        footer={(footer || !isNewRecord || onSave || onDelete || showBack || !!path) && <>
                            {footer}
                            {notificationEl}
                            {(onSave || !!path || !isNewRecord) && <LoadingButton
                                className={theme.Form.buttonSaveClass}
                                label={theme.Form.i18n.buttonSave}
                                onClick={e => handleSave(e)}
                            />}
                            {(onDelete || !isNewRecord) && <LoadingButton
                                className={theme.Form.buttonDeleteClass}
                                label={theme.Form.i18n.buttonDelete}
                                onClick={handleDelete}
                            />}
                            {showBack && <BackLink
                                className={theme.Form.buttonBackClass}
                                label={theme.Form.i18n.buttonBack}
                            />}
                        </>}
                        headerClass={headerClass || theme.Form.Card.headerClass}
                        bodyClass={className || theme.Form.Card.bodyClass}
                        footerClass={footerClass || theme.Form.Card.footerClass}
                    >
                        {components}
                    </Card>;
            }
        }, [aspect, header, footer, onSave, onDelete, showBack, record, components, ref, notificationEl]);

        return (
            <Wrapper className={wrapClass || theme.Form.wrapClass}>
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
            <FormDatabase path={dbPath} defaultValues={defaults} {...formProps}>
                {children && children(fields)}
            </FormDatabase>

        );
    }

    export default forwardRef(Form);
