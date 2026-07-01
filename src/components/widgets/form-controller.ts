import React, { createContext, useContext, useRef, useSyncExternalStore } from 'react';
import type { RecordProps } from '../../providers/data/DataProvider';

export type FormDraftStatus = 'restore' | 'restored' | null;

export type FormActionEvent = {
    preventDefault?: () => void;
};

export type FormControllerState = {
    record?: RecordProps;
    isNewRecord: boolean;
    isDirty: boolean;
    canSave: boolean;
    canDelete: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    saveDisabled: boolean;
    deleteDisabled: boolean;
    hasDraft: boolean;
    draftStatus: FormDraftStatus;
    errors: Record<string, string>;
    hasErrors: boolean;
};

export type FormControllerActions = {
    save: (event?: FormActionEvent) => Promise<boolean>;
    delete: (event?: FormActionEvent) => Promise<boolean>;
    reset: () => void;
    restoreDraft: () => void;
    discardDraft: () => void;
};

export type FormController = FormControllerState & FormControllerActions;

type FormControllerStore = {
    bindActions: (actions: Partial<FormControllerActions>) => void;
    getControllerSnapshot: () => FormController;
    getState: () => FormControllerState;
    setState: (nextState: Partial<FormControllerState>) => void;
    subscribe: (listener: () => void) => () => void;
};

const FORM_CONTROLLER_STORE = Symbol('llmnative.form-controller-store');

type FormControllerWithStore = FormController & {
    [FORM_CONTROLLER_STORE]: FormControllerStore;
};

const createInitialState = (): FormControllerState => ({
    record: undefined,
    isNewRecord: true,
    isDirty: false,
    canSave: false,
    canDelete: false,
    isSaving: false,
    isDeleting: false,
    saveDisabled: true,
    deleteDisabled: true,
    hasDraft: false,
    draftStatus: null,
    errors: {},
    hasErrors: false,
});

const noopAsync = async () => false;
const noop = () => undefined;

function createFormControllerStore(): FormControllerStore {
    let state = createInitialState();
    let controllerSnapshot: FormControllerWithStore;
    const listeners = new Set<() => void>();
    const actions: FormControllerActions = {
        save: noopAsync,
        delete: noopAsync,
        reset: noop,
        restoreDraft: noop,
        discardDraft: noop,
    };

    const emit = () => {
        controllerSnapshot = {
            ...state,
            save: actions.save,
            delete: actions.delete,
            reset: actions.reset,
            restoreDraft: actions.restoreDraft,
            discardDraft: actions.discardDraft,
            [FORM_CONTROLLER_STORE]: store,
        };
        listeners.forEach((listener) => listener());
    };

    const store: FormControllerStore = {
        bindActions(nextActions) {
            let changed = false;
            if (nextActions.save && actions.save !== nextActions.save) {
                actions.save = nextActions.save;
                changed = true;
            }
            if (nextActions.delete && actions.delete !== nextActions.delete) {
                actions.delete = nextActions.delete;
                changed = true;
            }
            if (nextActions.reset && actions.reset !== nextActions.reset) {
                actions.reset = nextActions.reset;
                changed = true;
            }
            if (nextActions.restoreDraft && actions.restoreDraft !== nextActions.restoreDraft) {
                actions.restoreDraft = nextActions.restoreDraft;
                changed = true;
            }
            if (nextActions.discardDraft && actions.discardDraft !== nextActions.discardDraft) {
                actions.discardDraft = nextActions.discardDraft;
                changed = true;
            }
            if (!changed) return;
            emit();
        },
        getControllerSnapshot: () => controllerSnapshot,
        getState: () => state,
        setState(nextState) {
            const nextMergedState = { ...state, ...nextState };
            const changed = Object.keys(nextMergedState).some((key) => (
                state[key as keyof FormControllerState] !== nextMergedState[key as keyof FormControllerState]
            ));
            if (!changed) return;
            state = nextMergedState;
            emit();
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };

    controllerSnapshot = {
        ...state,
        save: actions.save,
        delete: actions.delete,
        reset: actions.reset,
        restoreDraft: actions.restoreDraft,
        discardDraft: actions.discardDraft,
        [FORM_CONTROLLER_STORE]: store,
    };

    return store;
}

function ensureFormControllerStore(controller?: FormController): FormControllerStore {
    const candidate = controller as FormControllerWithStore | undefined;
    return candidate?.[FORM_CONTROLLER_STORE] ?? createFormControllerStore();
}

export function getFormControllerStore(controller: FormController): FormControllerStore {
    return ensureFormControllerStore(controller);
}

export function resetFormController(controller: FormController): void {
    const store = getFormControllerStore(controller);
    store.setState(createInitialState());
    store.bindActions({
        save: noopAsync,
        delete: noopAsync,
        reset: noop,
        restoreDraft: noop,
        discardDraft: noop,
    });
}

export const FormControllerContext = createContext<FormController | null>(null);

export function useFormController(controller?: FormController): FormController {
    const localStoreRef = useRef<FormControllerStore>();
    if (!localStoreRef.current) {
        localStoreRef.current = controller ? ensureFormControllerStore(controller) : createFormControllerStore();
    }

    const store = controller ? ensureFormControllerStore(controller) : localStoreRef.current;
    return useSyncExternalStore(store.subscribe, store.getControllerSnapshot, store.getControllerSnapshot);
}

export function useFormActions(): FormController {
    const controller = useContext(FormControllerContext);
    if (!controller) {
        throw new Error('useFormActions must be used within a FormControllerContext');
    }
    return controller;
}
