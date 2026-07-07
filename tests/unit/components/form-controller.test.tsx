import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
    useFormController,
    useFormActions,
    FormControllerContext,
    resetFormController,
    getFormControllerStore,
    type FormController,
} from '../../../src/components/widgets/form-controller';

// ── Store (via renderHook to respect hook rules) ───────────────────

describe('FormController store', () => {
    it('creates a controller with initial state', () => {
        const { result } = renderHook(() => useFormController());
        const ctrl = result.current;
        expect(ctrl.isNewRecord).toBe(true);
        expect(ctrl.isDirty).toBe(false);
        expect(ctrl.saveDisabled).toBe(true);
        expect(ctrl.deleteDisabled).toBe(true);
        expect(ctrl.hasDraft).toBe(false);
        expect(ctrl.draftStatus).toBeNull();
        expect(ctrl.errors).toEqual({});
        expect(ctrl.hasErrors).toBe(false);
        expect(ctrl.isSaving).toBe(false);
        expect(ctrl.isDeleting).toBe(false);
        expect(ctrl.canSave).toBe(false);
        expect(ctrl.canDelete).toBe(false);
        expect(ctrl.record).toBeUndefined();
    });

    it('setState updates state and notifies subscribers', () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);

        act(() => {
            store.setState({ isDirty: true, saveDisabled: false });
        });

        expect(store.getState().isDirty).toBe(true);
        expect(store.getState().saveDisabled).toBe(false);
        expect(listener).toHaveBeenCalledTimes(1);
        unsubscribe();
    });

    it('setState does not notify when nothing changed', () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);
        act(() => { store.setState({ isDirty: false }); });
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);

        act(() => { store.setState({ isDirty: false }); });

        expect(listener).not.toHaveBeenCalled();
        unsubscribe();
    });

    it('bindActions replaces noop actions', () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);

        const save = vi.fn(async () => true);
        const reset = vi.fn();
        act(() => { store.bindActions({ save, reset }); });

        const snapshot = store.getControllerSnapshot();
        expect(snapshot.save).toBe(save);
        expect(snapshot.reset).toBe(reset);
    });

    it('bindActions skips when no action changed', () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);
        const save = vi.fn(async () => true);
        act(() => { store.bindActions({ save }); });

        const listener = vi.fn();
        store.subscribe(listener);
        act(() => { store.bindActions({ save }); });

        expect(listener).not.toHaveBeenCalled();
    });

    it('subscribe returns an unsubscribe function', () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);
        unsubscribe();

        act(() => { store.setState({ isDirty: true }); });

        expect(listener).not.toHaveBeenCalled();
    });

    it('bindActions emits only when at least one action reference changes', () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);
        const listener = vi.fn();
        store.subscribe(listener);

        const save = vi.fn(async () => false);
        const discardDraft = vi.fn();
        act(() => { store.bindActions({ save, discardDraft }); });

        expect(listener).toHaveBeenCalledTimes(1);

        act(() => { store.bindActions({ save, discardDraft }); });

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('resetFormController resets state and clears bound actions', async () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);
        act(() => {
            store.setState({ isDirty: true, saveDisabled: false, isSaving: true, errors: { name: 'Required' } });
        });
        const save = vi.fn(async () => true);
        act(() => { store.bindActions({ save }); });

        act(() => { resetFormController(result.current); });

        const state = store.getState();
        expect(state.isDirty).toBe(false);
        expect(state.saveDisabled).toBe(true);
        expect(state.isSaving).toBe(false);
        expect(state.errors).toEqual({});
        expect(state.hasErrors).toBe(false);
        expect(state.record).toBeUndefined();
        expect(state.draftStatus).toBeNull();

        await expect(store.getControllerSnapshot().save()).resolves.toBe(false);
    });
});

// ── Hook: useFormController ────────────────────────────────────────

describe('useFormController', () => {
    it('returns a stable controller reference across re-renders', () => {
        const { result, rerender } = renderHook(() => useFormController());
        const first = result.current;
        rerender();
        expect(result.current).toBe(first);
    });

    it('reuses an existing controller when passed as argument', () => {
        const { result: existing } = renderHook(() => useFormController());
        const { result } = renderHook(() => useFormController(existing.current));
        expect(result.current).toBe(existing.current);
    });

    it('shares store between two components via the same controller', () => {
        const { result: shared } = renderHook(() => useFormController());

        const { result: a } = renderHook(() => useFormController(shared.current));
        const { result: b } = renderHook(() => useFormController(shared.current));

        act(() => {
            getFormControllerStore(shared.current).setState({ isDirty: true, saveDisabled: false });
        });

        expect(a.current.isDirty).toBe(true);
        expect(b.current.isDirty).toBe(true);
        expect(a.current.saveDisabled).toBe(false);
        expect(b.current.saveDisabled).toBe(false);
    });

    it('re-renders when store state changes', () => {
        const { result } = renderHook(() => useFormController());
        const store = getFormControllerStore(result.current);

        act(() => {
            store.setState({ isSaving: true, record: { name: 'test' } });
        });

        expect(result.current.isSaving).toBe(true);
        expect(result.current.record).toEqual({ name: 'test' });
    });

    it('does not re-render when store state is set to the same values', () => {
        const renderCount = vi.fn();
        const { result } = renderHook(() => {
            renderCount();
            return useFormController();
        });
        const store = getFormControllerStore(result.current);

        act(() => { store.setState({ isDirty: true }); });

        const before = renderCount.mock.calls.length;

        act(() => { store.setState({ isDirty: true }); });

        expect(renderCount.mock.calls.length).toBe(before);
    });
});

// ── Hook: useFormActions ────────────────────────────────────────────

function ControllerProvider({ controller, children }: { controller: FormController; children: React.ReactNode }) {
    const ctrl = useFormController(controller);
    return (
        <FormControllerContext.Provider value={ctrl}>
            {children}
        </FormControllerContext.Provider>
    );
}

describe('useFormActions', () => {
    it('returns controller from FormControllerContext', () => {
        const { result: ctrl } = renderHook(() => useFormController());
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ControllerProvider controller={ctrl.current}>
                {children}
            </ControllerProvider>
        );
        const { result } = renderHook(() => useFormActions(), { wrapper });
        expect(result.current).toBeTruthy();
    });

    it('reflects state changes from the context controller', () => {
        const { result: ctrl } = renderHook(() => useFormController());
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ControllerProvider controller={ctrl.current}>
                {children}
            </ControllerProvider>
        );
        const { result } = renderHook(() => useFormActions(), { wrapper });

        act(() => {
            getFormControllerStore(ctrl.current).setState({ isDirty: true, saveDisabled: false });
        });

        expect(result.current.isDirty).toBe(true);
        expect(result.current.saveDisabled).toBe(false);
    });

    it('throws when used outside FormControllerContext', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => renderHook(() => useFormActions())).toThrow(
            'useFormActions must be used within a FormControllerContext'
        );

        consoleSpy.mockRestore();
    });
});
