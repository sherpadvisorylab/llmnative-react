import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Chatbot } from '../../../src/components/widgets/Chatbot';
import type { ChatbotSubmitPayload } from '../../../src/components/widgets/Chatbot';
import { renderWithProviders } from '../../helpers/renderWithProviders';

/** Wrapper controllato minimale — Chatbot non ha uno stato di testo proprio, chi lo
 * consuma possiede `value`/`onChange` (vedi Prompt.tsx/Agentico nel CMS). */
function ControlledChatbot(props: Partial<React.ComponentProps<typeof Chatbot>> & { onSubmit: (p: ChatbotSubmitPayload) => void }) {
    const [value, setValue] = useState(props.value ?? '');
    return <Chatbot {...props} value={value} onChange={setValue} onSubmit={props.onSubmit} />;
}

describe('Chatbot', () => {
    it('renders with no Form ancestor and lets the user type freely', () => {
        renderWithProviders(<ControlledChatbot onSubmit={vi.fn()} placeholder="Say something…" />);

        const textarea = screen.getByPlaceholderText('Say something…');
        fireEvent.change(textarea, { target: { value: 'Hello there' } });

        expect(textarea).toHaveValue('Hello there');
    });

    it('submits the current text on Run click', () => {
        const onSubmit = vi.fn();
        renderWithProviders(<ControlledChatbot onSubmit={onSubmit} value="Migrate old redirects" />);

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({ text: 'Migrate old redirects', files: [] });
    });

    it('submits on Enter (without shift) when no slash-commands are configured', () => {
        const onSubmit = vi.fn();
        renderWithProviders(<ControlledChatbot onSubmit={onSubmit} value="quick message" />);

        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', shiftKey: false });

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('attaches a file, previews it, forwards it on submit, and clears it after', async () => {
        const onSubmit = vi.fn();
        renderWithProviders(<ControlledChatbot onSubmit={onSubmit} value="see attached" attachments />);

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
        expect(fileInput).not.toBeNull();

        const file = new File(['old-path,new-path\n/a,/b'], 'redirects.csv', { type: 'text/csv' });
        fireEvent.change(fileInput!, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('redirects.csv')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        const payload = onSubmit.mock.calls[0][0] as ChatbotSubmitPayload;
        expect(payload.files).toHaveLength(1);
        expect(payload.files[0].name).toBe('redirects.csv');

        await waitFor(() => {
            expect(screen.queryByText('redirects.csv')).not.toBeInTheDocument();
        });
    });

    it('reports the selected model on submit and via onModelChange', () => {
        const onSubmit = vi.fn();
        const onModelChange = vi.fn();
        renderWithProviders(
            <ControlledChatbot
                onSubmit={onSubmit}
                value="hi"
                models={[{ label: 'Claude Sonnet', value: 'anthropic/claude-sonnet-4-0' }, { label: 'GPT-4o', value: 'openai/gpt-4o' }]}
                selectedModel="anthropic/claude-sonnet-4-0"
                onModelChange={onModelChange}
            />
        );

        fireEvent.click(screen.getByText('claude-sonnet-4-0'));
        fireEvent.click(screen.getByText('GPT-4o'));
        expect(onModelChange).toHaveBeenCalledWith('openai/gpt-4o');

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));
        expect(onSubmit.mock.calls[0][0]).toMatchObject({ model: 'anthropic/claude-sonnet-4-0' });
    });

    it('shows a disabled spinner while running without an onStop handler (no abort capability)', () => {
        renderWithProviders(<ControlledChatbot onSubmit={vi.fn()} value="working…" running />);
        expect(screen.getByRole('button', { name: /Stop/i })).toBeDisabled();
    });

    it('lets the caller stop an in-flight run when onStop is provided', () => {
        const onStop = vi.fn();
        renderWithProviders(<ControlledChatbot onSubmit={vi.fn()} value="working…" running onStop={onStop} />);

        const stopButton = screen.getByRole('button', { name: /Stop/i });
        expect(stopButton).not.toBeDisabled();
        fireEvent.click(stopButton);
        expect(onStop).toHaveBeenCalledTimes(1);
    });

    it('respects the disabled prop regardless of text content', () => {
        const onSubmit = vi.fn();
        renderWithProviders(<ControlledChatbot onSubmit={onSubmit} value="" disabled />);
        expect(screen.getByRole('button', { name: /Run/i })).toBeDisabled();
    });

    it('attaches files dropped onto the composer and forwards them on submit', async () => {
        const onSubmit = vi.fn();
        renderWithProviders(<ControlledChatbot onSubmit={onSubmit} value="see dropped file" attachments />);

        const file = new File(['old-path,new-path\n/a,/b'], 'dropped.csv', { type: 'text/csv' });
        const dataTransfer = { types: ['Files'], files: [file] };

        fireEvent.dragEnter(screen.getByRole('textbox'), { dataTransfer });
        expect(screen.getByText('Drop files to attach')).toBeInTheDocument();

        fireEvent.drop(screen.getByRole('textbox'), { dataTransfer });

        await waitFor(() => {
            expect(screen.getByText('dropped.csv')).toBeInTheDocument();
        });
        expect(screen.queryByText('Drop files to attach')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));
        const payload = onSubmit.mock.calls[0][0] as ChatbotSubmitPayload;
        expect(payload.files.map((f) => f.name)).toEqual(['dropped.csv']);
    });

    it('ignores non-file drags and never shows the drop overlay without attachments enabled', () => {
        renderWithProviders(<ControlledChatbot onSubmit={vi.fn()} value="" attachments={false} />);
        const dataTransfer = { types: ['Files'], files: [new File(['x'], 'x.txt', { type: 'text/plain' })] };

        fireEvent.dragEnter(screen.getByRole('textbox'), { dataTransfer });
        expect(screen.queryByText('Drop files to attach')).not.toBeInTheDocument();
    });
});
