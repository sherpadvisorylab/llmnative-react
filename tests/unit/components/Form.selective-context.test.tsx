// CR-081: sottoscrizione selettiva per-path di useFormContext — verifica che un consumer si
// ri-renderizzi SOLO quando cambia il proprio campo, che l'opt-in `subscribeToFullRecord` copra
// i consumer cross-field (Prompt.tsx), e che un consumer su un path "genitore" (non-leaf) reagisca
// comunque a un cambiamento in un discendente senza bisogno dell'opt-in.
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));
vi.mock('../../../src/Theme', () => ({
    useMotionRegistry: vi.fn(() => ({})),
    useTheme: vi.fn(() => ({
        Card:          { wrapClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', showLoader: false },
        Loader:        { wrapClass: '', className: '', icon: '', title: '', description: '' },
        Modal:         { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '', iconExpand: '', iconCollapse: '' },
        ActionButton:  { className: '', badgeClass: '' },
        LoadingButton: { className: '', badgeClass: '', spinnerClass: '' },
        Badge:         { className: '' },
        Alert:         { className: '' },
        Table:         { wrapClass: '', scrollClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', selectedClass: '' },
        Select:        { wrapClass: '', className: '' },
        Autocomplete:  { wrapClass: '', className: '' },
        Form: {
            wrapClass: '',
            buttonSaveClass: '', buttonDeleteClass: '', buttonBackClass: '',
            Card: { headerClass: '', bodyClass: '', footerClass: '' },
            i18n: { headerAdd: '', headerEdit: '', headerNewRecord: '', buttonSave: 'Save', buttonDelete: 'Delete', buttonBack: 'Back', noticeRequiredFields: '' },
        },
        Grid: {
            i18n: { buttonAdd: 'Add', headerAdd: '', headerEdit: '' },
            Table:   { wrapperClass: '', className: '', headerClass: '', bodyClass: '', footerClass: '', scrollClass: '', selectedClass: '' },
            Gallery: { wrapperClass: '', scrollClass: '', headerClass: '', bodyClass: '', footerClass: '', selectedClass: '', gutterSize: 0, rowCols: 3 },
            Card:    { className: '', headerClass: '', bodyClass: '', footerClass: '' },
            Modal:   { size: 'md', position: 'center', wrapClass: '', className: '', headerClass: '', titleClass: '', bodyClass: '', footerClass: '' },
        },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

import Form, { useFormContext } from '../../../src/components/widgets/Form';
import { Input } from '../../../src/components/ui/fields/Input';
import { renderWithProviders } from '../../helpers/renderWithProviders';

/** Campo di test minimale: incrementa un contatore ad OGNI render (non solo quando il proprio
 * valore cambia) — usato per dimostrare che il componente NON viene ri-renderizzato affatto
 * quando un campo sibling cambia, non solo che il suo valore visualizzato resta corretto. */
function CountingField({ name, renderCountRef, subscribeToFullRecord }: { name: string; renderCountRef: { current: number }; subscribeToFullRecord?: boolean }) {
    renderCountRef.current += 1;
    const { value, handleChange } = useFormContext({ name, subscribeToFullRecord });
    return (
        <input
            role="textbox"
            aria-label={name}
            value={String(value ?? '')}
            onChange={(e) => handleChange({ target: { name, value: e.target.value } })}
        />
    );
}

describe('Form — selective context (CR-081)', () => {
    it('does not re-render a field consumer when a sibling field changes (default, no opt-in)', () => {
        const countA = { current: 0 };
        const countB = { current: 0 };

        renderWithProviders(
            <Form defaultValues={{ fieldA: 'a', fieldB: 'b' }}>
                <CountingField name="fieldA" renderCountRef={countA} />
                <CountingField name="fieldB" renderCountRef={countB} />
            </Form>
        );

        const rendersAAfterMount = countA.current;
        const rendersBAfterMount = countB.current;

        fireEvent.change(screen.getByLabelText('fieldA'), { target: { name: 'fieldA', value: 'a2' } });

        expect(countA.current).toBeGreaterThan(rendersAAfterMount);
        expect(countB.current).toBe(rendersBAfterMount);

        fireEvent.change(screen.getByLabelText('fieldB'), { target: { name: 'fieldB', value: 'b2' } });

        expect(countB.current).toBeGreaterThan(rendersBAfterMount);
    });

    it('re-renders an opted-in full-record consumer when ANY other field changes', () => {
        const countCrossField = { current: 0 };

        function CrossFieldReader({ renderCountRef }: { renderCountRef: { current: number } }) {
            renderCountRef.current += 1;
            const { record } = useFormContext({ name: 'crossField', subscribeToFullRecord: true });
            return <span data-testid="other-value">{String((record as any)?.other ?? '')}</span>;
        }

        renderWithProviders(
            <Form defaultValues={{ crossField: '', other: 'x' }}>
                <Input name="other" label="Other" />
                <CrossFieldReader renderCountRef={countCrossField} />
            </Form>
        );

        expect(screen.getByTestId('other-value').textContent).toBe('x');
        const rendersAfterMount = countCrossField.current;

        fireEvent.change(screen.getByRole('textbox', { name: 'Other' }), { target: { name: 'other', value: 'y' } });

        expect(countCrossField.current).toBeGreaterThan(rendersAfterMount);
        expect(screen.getByTestId('other-value').textContent).toBe('y');
    });

    it('reacts to a nested descendant change when subscribed to the parent path, without opt-in', () => {
        const countParent = { current: 0 };

        function ParentPathReader({ renderCountRef }: { renderCountRef: { current: number } }) {
            renderCountRef.current += 1;
            const { value } = useFormContext({ name: 'group' });
            const group = (value as Record<string, unknown> | undefined) ?? {};
            return <span data-testid="nested-value">{String(group.child ?? '')}</span>;
        }

        renderWithProviders(
            <Form defaultValues={{ group: { child: 'initial' } }}>
                <Input name="group.child" label="Child" />
                <ParentPathReader renderCountRef={countParent} />
            </Form>
        );

        expect(screen.getByTestId('nested-value').textContent).toBe('initial');
        const rendersAfterMount = countParent.current;

        fireEvent.change(screen.getByRole('textbox', { name: 'Child' }), { target: { name: 'group.child', value: 'changed' } });

        expect(countParent.current).toBeGreaterThan(rendersAfterMount);
        expect(screen.getByTestId('nested-value').textContent).toBe('changed');
    });
});
