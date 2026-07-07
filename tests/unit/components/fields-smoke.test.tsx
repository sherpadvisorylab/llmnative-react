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
import { TextArea } from '../../../src/components/ui/fields/Input';

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
