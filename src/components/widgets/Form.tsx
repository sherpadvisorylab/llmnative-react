    import React, { createContext, useContext, useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback, useMemo } from 'react';
    import { flushSync } from 'react-dom';

    import { useLocation } from "react-router-dom";
    import { Wrapper } from "../ui/GridSystem";
    import { trimSlash, cleanRecord, normalizeKey, safeClone } from "../../libs/utils";
    import { useDataProvider } from "../../providers/data/DataProviderContext";
    import Card from "../ui/Card";
    import { ActionButton, BackLink, LoadingButton } from "../ui/Buttons";
    import { getGlobalVars } from "../../Global";
    import { useTheme } from "../../Theme";
    import { useI18n, interpolate } from "../../I18n";
    import Alert from "../ui/Alert";
    import { FieldValue, RecordProps, RECORD_KEY } from "../../providers/data/DataProvider";
    import {FormTree, ModelProps, buildFormFields} from "../Component";
    import Breadcrumbs from "../blocks/Breadcrumbs";
    import { UIProps } from '../';
    import { cn } from '../../libs/cn';

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
        validator?: (value: FieldValue) => string | undefined | Promise<string | undefined>;
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
                    wrapperClassName,
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
        /** Persist unsaved changes locally and offer restore/discard on re-entry. Defaults to `false`. */
        persistDraft?: boolean;
        /** When provided, the save/delete notice is rendered sticky at the top of this container
         *  instead of inline in the form footer. Ideal for full-page forms outside a modal. */
        noticeAnchorRef?: React.RefObject<HTMLElement>;
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

    type DraftNoticeState = "restore" | "restored" | null;

    const createRecordSnapshot = (value: RecordProps | undefined): string => (
        JSON.stringify(cleanRecord(value ?? {}))
    );

    const parseDraftRecord = (raw: string | null): RecordProps | undefined => {
        if (!raw) return undefined;

        try {
            const parsed = JSON.parse(raw) as unknown;
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                return parsed as RecordProps;
            }
        } catch {
            return undefined;
        }

        return undefined;
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
        persistDraft = false,
        noticeAnchorRef = undefined,
        showBack = false,
        wrapperClassName = undefined,
        headerClassName = undefined,
        className = undefined,
        footerClassName = undefined
    }, ref) => {
        const location = useLocation();
        const theme = useTheme("form");
        const dict = useI18n('form');
        const db = useDataProvider();

        const [record, setRecord] = useState<RecordProps | undefined>(defaultValues);
        const isNewRecord = !defaultValues?.[RECORD_KEY];
        const baselineRecordRef = useRef<RecordProps>(safeClone(defaultValues ?? {}));
        const [baselineSnapshot, setBaselineSnapshot] = useState(() => createRecordSnapshot(defaultValues));
        const [draftNoticeState, setDraftNoticeState] = useState<DraftNoticeState>(null);

        const draftStorageKey = useMemo(() => {
            if (!persistDraft) return undefined;
            const identity = path || `${location.pathname}${location.hash || ''}`;
            const normalizedIdentity = normalizeKey(identity);
            return normalizedIdentity ? `llmnative.form-draft.${normalizedIdentity}` : undefined;
        }, [persistDraft, location.pathname, location.hash, path]);

        const canSave = Boolean(onSave || path || !isNewRecord);
        const isDirty = useMemo(
            () => createRecordSnapshot(record) !== baselineSnapshot,
            [record, baselineSnapshot]
        );
        const noChangesToSave = dict.noChangesToSave ?? 'No changes to save';
        const draftRestoreTitle = dict.draftRestoreTitle ?? 'Unsaved changes found';
        const draftRestoreMessage = dict.draftRestoreMessage ?? 'A local draft is available for this form. Restore it or discard it.';
        const draftRestoreAction = dict.draftRestoreAction ?? 'Restore';
        const draftDiscardAction = dict.draftDiscardAction ?? 'Discard';
        const draftRestoredTitle = dict.draftRestoredTitle ?? 'Draft restored';
        const draftRestoredMessage = dict.draftRestoredMessage ?? 'The local draft has been restored. You can still discard it for a few seconds.';

        const clearDraftStorage = useCallback(() => {
            if (!draftStorageKey || typeof localStorage === 'undefined') return;
            localStorage.removeItem(draftStorageKey);
        }, [draftStorageKey]);

        const readStoredDraft = useCallback(() => {
            if (!draftStorageKey || typeof localStorage === 'undefined') return undefined;
            return parseDraftRecord(localStorage.getItem(draftStorageKey));
        }, [draftStorageKey]);

        const restoreBaselineRecord = useCallback(() => {
            setRecord(safeClone(baselineRecordRef.current));
        }, []);

        const discardStoredDraft = useCallback(() => {
            clearDraftStorage();
            restoreBaselineRecord();
            setDraftNoticeState(null);
        }, [clearDraftStorage, restoreBaselineRecord]);

        const restoreStoredDraft = useCallback(() => {
            const storedDraft = readStoredDraft();
            if (!storedDraft) {
                setDraftNoticeState(null);
                return;
            }

            setRecord(safeClone(storedDraft));
            setDraftNoticeState("restored");
        }, [readStoredDraft]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(()=>{
            const nextDefaultValues = safeClone(defaultValues ?? {});

            if (defaultValues) {
                setRecord(nextDefaultValues);
                onLoad?.(safeClone(nextDefaultValues));
            }

            baselineRecordRef.current = nextDefaultValues;
            setBaselineSnapshot(createRecordSnapshot(nextDefaultValues));

            if (!persistDraft) {
                setDraftNoticeState(null);
                return;
            }

            const storedDraft = readStoredDraft();
            if (storedDraft && createRecordSnapshot(storedDraft) !== createRecordSnapshot(nextDefaultValues)) {
                setDraftNoticeState("restore");
                return;
            }

            setDraftNoticeState(null);
        }, [JSON.stringify(defaultValues), persistDraft, onLoad, readStoredDraft]);

        const recordRef = useRef(record);
        useEffect(() => {
            recordRef.current = record;
            if (record !== undefined) onRecordChange?.(record);
        }, [record, onRecordChange]);

        useEffect(() => {
            if (!draftStorageKey || typeof localStorage === 'undefined' || record === undefined) return;

            if (!isDirty) {
                const storedDraft = readStoredDraft();
                if (storedDraft && createRecordSnapshot(storedDraft) !== baselineSnapshot) {
                    return;
                }
                localStorage.removeItem(draftStorageKey);
                return;
            }

            const timer = window.setTimeout(() => {
                localStorage.setItem(draftStorageKey, JSON.stringify(cleanRecord(record)));
            }, 150);

            return () => window.clearTimeout(timer);
        }, [baselineSnapshot, draftStorageKey, isDirty, readStoredDraft, record]);


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

        const validateFields = useCallback(async (): Promise<boolean> => {
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
                    const msg = await validator(value);
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

        const handleSave = useCallback(async (e: React.MouseEvent<HTMLElement>): Promise<boolean> => {
            e.preventDefault();
            if (!isDirty) {
                showNotice && setNotification({ message: noChangesToSave, type: "info" });
                return false;
            }

            flushSync(() => {
                setErrors({});
                showNotice && setNotification(undefined);
            });
            if (!(await validateFields())) {
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
            baselineRecordRef.current = safeClone(recordRef.current ?? {});
            setBaselineSnapshot(createRecordSnapshot(recordRef.current));
            clearDraftStorage();
            setDraftNoticeState(null);
            return await handleFinally(action);
        }, [path, onSave, showNotice, computeSavePath, validateFields, dict, isDirty, noChangesToSave, clearDraftStorage, db, defaultValues, handleFinally, isNewRecord]);

        const handleDelete = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();

            showNotice && setNotification(undefined);

            const recordStoragePath =
                (onDelete && await onDelete({ record: recordRef.current }))
                ?? computeSavePath(recordRef.current ?? {});

            recordStoragePath && await db.remove(recordStoragePath);
            clearDraftStorage();
            setDraftNoticeState(null);
            return await handleFinally("delete");
        }, [onDelete, computeSavePath, clearDraftStorage, db, handleFinally, showNotice]);

        useImperativeHandle(ref, () => ({
            handleSave: handlers?.handleSave ?? handleSave,
            handleDelete: handlers?.handleDelete ?? handleDelete,
            getHeader: handlers?.getHeader ?? (() => header),
            getRecord: handlers?.getRecord ?? (() => ({record: recordRef.current ?? {}, isNewRecord})),
            getFooter: handlers?.getFooter ?? (() => footer),
        }), [handleSave, handleDelete, handlers]);

        const handleFormKeyDown = useCallback((event: React.KeyboardEvent<HTMLFormElement>) => {
            if (event.defaultPrevented) return;
            const isSaveShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
            if (!isSaveShortcut || !canSave || !isDirty) return;

            event.preventDefault();
            void handleSave({ preventDefault: () => undefined } as React.MouseEvent<HTMLElement>);
        }, [canSave, handleSave, isDirty]);

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
                appearance={noticeAnchorRef ? "default" : "text"}
                placement={noticeAnchorRef ? "sticky" : "inline"}
                anchorRef={noticeAnchorRef}
                timeout={notification.type === 'success' ? 3000 : undefined}
                onClose={notification.type === 'success' ? () => setNotification(undefined) : undefined}
            >
                {notification.message}
            </Alert>
        ) : null, [notification, noticeAnchorRef]);

        const draftNoticeEl = useMemo(() => {
            if (!draftNoticeState) return null;

            const title = draftNoticeState === "restore" ? draftRestoreTitle : draftRestoredTitle;
            const message = draftNoticeState === "restore" ? draftRestoreMessage : draftRestoredMessage;

            return (
                <Alert
                    variant={draftNoticeState === "restore" ? "warning" : "info"}
                    timeout={draftNoticeState === "restored" ? 6000 : undefined}
                    onClose={draftNoticeState === "restored" ? () => setDraftNoticeState(null) : undefined}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="font-medium">{title}</div>
                            <div className="text-sm opacity-90">{message}</div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            {draftNoticeState === "restore" ? (
                                <>
                                    <ActionButton
                                        label={draftRestoreAction}
                                        variant="warning"
                                        onClick={() => restoreStoredDraft()}
                                    />
                                    <ActionButton
                                        label={draftDiscardAction}
                                        variant="outline-secondary"
                                        onClick={() => discardStoredDraft()}
                                    />
                                </>
                            ) : (
                                <ActionButton
                                    label={draftDiscardAction}
                                    variant="outline-secondary"
                                    onClick={() => discardStoredDraft()}
                                />
                            )}
                        </div>
                    </div>
                </Alert>
            );
        }, [
            discardStoredDraft,
            draftDiscardAction,
            draftNoticeState,
            draftRestoreAction,
            draftRestoreMessage,
            draftRestoreTitle,
            draftRestoredMessage,
            draftRestoredTitle,
            restoreStoredDraft,
        ]);

        const displayComponent = useMemo(() => {
            if(!appearance && ref) return <>{draftNoticeEl}{components}{notificationEl}</>;

            switch (appearance) {
                case "empty":
                    return <>{draftNoticeEl}{components}{notificationEl}</>;
                case "card":
                default:
                    return <Card
                        header={header || <Breadcrumbs rootItem={(isNewRecord ? dict.headerAdd : dict.headerEdit)} trail={path || undefined} />}
                        footer={(footer || !isNewRecord || onSave || onDelete || showBack || !!path) && <>
                            {footer}
                            {notificationEl}
                            {(onSave || !!path || !isNewRecord) && <LoadingButton
                                className={cn(theme.Form.buttonSaveClass, !isDirty && "cursor-not-allowed opacity-50")}
                                label={dict.buttonSave}
                                title={!isDirty ? noChangesToSave : undefined}
                                disabled={!isDirty}
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
                        <>
                            {draftNoticeEl}
                            {components}
                        </>
                    </Card>;
            }
        }, [appearance, header, footer, onSave, onDelete, showBack, components, ref, notificationEl, draftNoticeEl, dict, isNewRecord, path, handleSave, handleDelete, isDirty, noChangesToSave, theme.Form.buttonSaveClass]);

        return (
            <Wrapper className={wrapperClassName || theme.Form.wrapperClassName}>
                <form
                    ref={containerRef}
                    noValidate
                    onSubmit={e => e.preventDefault()}
                    onKeyDownCapture={handleFormKeyDown}
                    onKeyDown={handleFormKeyDown}
                >
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
