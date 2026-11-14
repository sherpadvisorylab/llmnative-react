/**
 * 2.3.0 — a confirmation names its action and marks it red when it cannot be undone; the loader speaks the
 * language of the app.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../../../src/I18n';
import { it as italian } from '../../../src/conf/i18n/it';
import { ModalYesNo } from '../../../src/components/ui/Modal';
import Loader from '../../../src/components/ui/Loader';

const inItalian = ({ children }: { children: React.ReactNode }) => (
    <I18nProvider config={{ locale: 'it', translations: { it: italian } }}>{children}</I18nProvider>
);

describe('ModalYesNo', () => {
    it('names the action, puts it red and last when it cannot be undone', async () => {
        const onYes = vi.fn(async () => true);
        render(
            <ModalYesNo title="Revocare l'invito?" danger yesLabel="Revoca" noLabel="Annulla" onYes={onYes} onNo={async () => true}>
                La persona non potrà più usare il link.
            </ModalYesNo>,
            { wrapper: inItalian },
        );

        const revoke = await screen.findByRole('button', { name: 'Revoca' });
        const cancel = screen.getByRole('button', { name: 'Annulla' });
        expect(revoke).toHaveClass('btn-danger');
        // "Annulla" comes first: a careful choice, not the default one.
        expect(cancel.compareDocumentPosition(revoke) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        await userEvent.click(revoke);
        await waitFor(() => expect(onYes).toHaveBeenCalledOnce());
    });

    it('keeps Yes and No of the dictionary, Yes first, without the new props', async () => {
        render(<ModalYesNo onYes={async () => true} onNo={async () => true}>Sicuro?</ModalYesNo>, { wrapper: inItalian });

        const yes = await screen.findByRole('button', { name: 'Sì' });
        const no = screen.getByRole('button', { name: 'No' });
        expect(yes).toHaveClass('btn-primary');
        expect(yes.compareDocumentPosition(no) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
});

describe('Loader', () => {
    it('says loading in the language of the app, never "Loading.." in every language', () => {
        render(<Loader show>{null}</Loader>, { wrapper: inItalian });
        expect(screen.getByText('Caricamento...')).toBeInTheDocument();
        expect(screen.queryByText('Loading..')).not.toBeInTheDocument();
    });
});
