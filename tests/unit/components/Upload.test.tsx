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
    PLACEHOLDER_IMAGE: 'placeholder.png',
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
        Pagination:    { maxItems: 5 },
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

import Form from '../../../src/components/widgets/Form';
import { UploadDocument, UploadImage, FileProps, getFileUrl } from '../../../src/components/ui/fields/Upload';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const fileRecord = (overrides: Partial<FileProps> = {}): FileProps => ({
    key: 'contract.pdf',
    fileName: 'contract.pdf',
    size: 2048,
    type: 'application/pdf',
    progress: 100,
    url: 'https://example.test/contract.pdf',
    variants: {},
    ...overrides,
});

describe('UploadDocument', () => {
    it('renders the upload control and an existing file table', () => {
        renderWithProviders(
            <Form defaultValues={{ attachments: [fileRecord()] }}>
                <UploadDocument name="attachments" label="Attachments" multiple />
            </Form>
        );

        expect(screen.getByText('Attachments')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'contract.pdf' })).toHaveAttribute('href', 'https://example.test/contract.pdf');
        expect(screen.getByText('2.00 KB')).toBeInTheDocument();
    });

    it('hides upload button when max is reached', () => {
        renderWithProviders(
            <Form defaultValues={{ attachments: [fileRecord()] }}>
                <UploadDocument name="attachments" max={1} />
            </Form>
        );

        expect(screen.queryByRole('button', { name: /upload/i })).not.toBeInTheDocument();
    });

    it('removes an existing document from the form state', () => {
        renderWithProviders(
            <Form defaultValues={{ attachments: [fileRecord()] }}>
                <UploadDocument name="attachments" />
            </Form>
        );

        const removeButton = screen.getAllByRole('button').find((button) => button.textContent === '');
        expect(removeButton).toBeDefined();

        fireEvent.click(removeButton!);
        expect(screen.queryByRole('link', { name: 'contract.pdf' })).not.toBeInTheDocument();
    });
});

describe('UploadImage', () => {
    it('renders completed image previews from existing values', () => {
        renderWithProviders(
            <Form defaultValues={{ photos: [fileRecord({
                key: 'avatar.png',
                fileName: 'avatar.png',
                type: 'image/png',
                url: 'https://example.test/avatar.png',
            })] }}>
                <UploadImage name="photos" label="Photos" />
            </Form>
        );

        expect(screen.getByText('Photos')).toBeInTheDocument();
        expect(screen.getByAltText('preview-0')).toHaveAttribute('src', 'https://example.test/avatar.png');
    });
});

describe('getFileUrl', () => {
    it('returns the remote url when the file has no base64 payload', () => {
        expect(getFileUrl(fileRecord())).toBe('https://example.test/contract.pdf');
    });
});

