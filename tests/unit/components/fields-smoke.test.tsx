import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));
vi.mock('../../../src/motion', () => ({
    useEnterMotion: vi.fn(() => ({})),
    useMotionState: vi.fn(() => ({})),
    usePressMotion: vi.fn(() => ({})),
}));
vi.mock('../../../src/I18n', () => ({
    useI18n: vi.fn(() => ({})),
    I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('../../../src/Theme', () => ({
    useMotionRegistry: vi.fn(() => ({})),
    useTheme: vi.fn(() => ({
        Form: {
            wrapClass: '', buttonSaveClass: '', buttonDeleteClass: '', buttonBackClass: '',
            Card: { headerClass: '', bodyClass: '', footerClass: '' },
            i18n: { headerAdd: '', headerEdit: '', headerNewRecord: '', buttonSave: 'Save', buttonDelete: '', buttonBack: '', noticeRequiredFields: '' },
        },
    })),
    ThemeProvider: ({ children }: any) => children,
}));

vi.mock('../../../src/components/widgets/Form', () => ({
    useFormContext: vi.fn(() => ({
        watch: vi.fn(() => ({})),
        setValue: vi.fn(),
        register: vi.fn(() => ({})),
        getValues: vi.fn(() => ({})),
        errors: {},
        formWrapClass: '',
        inputWrapClass: '',
        inputClass: '',
        handleChange: vi.fn(),
    })),
    useFieldValidation: vi.fn(() => undefined),
    useHandleDrop: vi.fn(() => undefined),
    FormValidationContext: {
        Provider: ({ children }: any) => <>{children}</>,
    },
}));

import { ContextMenu } from '../../../src/components/ui/fields/ContextMenu';
import { Checkbox, Switch, TextArea } from '../../../src/components/ui/fields/Input';

describe('ContextMenu', () => {
    it('renders its container', () => {
        const { container } = render(
            <ContextMenu trigger="/">
                <ContextMenu.Item label="Bold" value="bold" icon="bold" />
                <ContextMenu.Item label="Italic" value="italic" icon="italic" />
            </ContextMenu>
        );
        expect(container.querySelector('div')).toBeTruthy();
    });
});

describe('Checkbox and Switch, disabled (CR-116)', () => {
    it('cannot be changed, and says why on hover of its label', () => {
        const { container } = render(
            <MemoryRouter>
                <Switch name="gate" label="Passes through the CI" disabled title="The agent does not commit" />
                <Checkbox name="agree" label="Agree" disabled title="Not yours to decide" />
                <Switch name="free" label="Free" />
            </MemoryRouter>
        );
        const [gate, agree, free] = [...container.querySelectorAll('input[type="checkbox"]')] as HTMLInputElement[];
        expect(gate!.disabled).toBe(true);
        expect(agree!.disabled).toBe(true);
        expect(free!.disabled).toBe(false);
        // A disabled input gets no hover in every browser: the reason is on what holds it.
        expect(screen.getByText('Passes through the CI').closest('label')!.getAttribute('title')).toBe('The agent does not commit');
        expect(screen.getByText('Passes through the CI').closest('label')!.className).toContain('cursor-not-allowed');
        expect(container.querySelector('[title="Not yours to decide"]')).toBeTruthy();
        expect(screen.getByText('Free').closest('label')!.getAttribute('title')).toBeNull();
    });
});

describe('TextArea', () => {
    it('renders a textarea with label', () => {
        render(
            <MemoryRouter>
                <TextArea name="description" label="Description" />
            </MemoryRouter>
        );
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders a textarea element', () => {
        const { container } = render(
            <MemoryRouter>
                <TextArea name="body" label="Body" />
            </MemoryRouter>
        );
        expect(container.querySelector('textarea')).toBeTruthy();
    });
});
