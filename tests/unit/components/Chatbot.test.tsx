import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Chatbot, groupModelOptions } from '../../../src/components/widgets/Chatbot';
import type { ChatbotModelOption, ChatbotSubmitPayload } from '../../../src/components/widgets/Chatbot';
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

    it('shows per-1M input/output prices, highlights free models and flags missing prices', () => {
        renderWithProviders(
            <ControlledChatbot
                onSubmit={vi.fn()}
                models={[
                    { label: 'Paid', value: 'openai/gpt-5-mini', pricing: { input: 0.25, output: 2, currency: 'USD', source: 'models.dev' } },
                    { label: 'Free', value: 'opencode/big-pickle', pricing: { input: 0, output: 0, currency: 'USD', source: 'models.dev' } },
                    { label: 'Unknown', value: 'glm/glm-z1-preview', pricing: null },
                    { label: 'No pricing data', value: 'custom/x' },
                ]}
                modelPlaceholder="Choose a model"
            />
        );

        fireEvent.click(screen.getByText('Choose a model'));

        expect(screen.getByText('$0.25 / $2')).toBeInTheDocument();
        expect(screen.getByText('$0 / $0')).toBeInTheDocument();
        expect(screen.getByText('Free').closest('button')?.className).toContain('bg-success/10');
        expect(screen.getByText('Paid').closest('button')?.className).not.toContain('bg-success/10');
        expect(screen.getAllByText('Price not found')).toHaveLength(1);
        expect(screen.getByText('Unknown').closest('button')).toHaveTextContent('Price not found');
    });

    describe('groupModelOptions()', () => {
        it('groups in first-appearance order, keeping ungrouped options in one anonymous section', () => {
            const options: ChatbotModelOption[] = [
                { label: 'a1', value: 'a/a1', group: 'Alpha' },
                { label: 'b1', value: 'b/b1', group: 'Beta' },
                { label: 'plain', value: 'plain' },
                { label: 'a2', value: 'a/a2', group: 'Alpha' },
            ];

            expect(groupModelOptions(options)).toEqual([
                { group: 'Alpha', options: [options[0], options[3]] },
                { group: 'Beta', options: [options[1]] },
                { options: [options[2]] },
            ]);
        });

        it('returns a single anonymous section when no option carries a group', () => {
            const options: ChatbotModelOption[] = [
                { label: 'a', value: 'a' },
                { label: 'b', value: 'b' },
            ];
            expect(groupModelOptions(options)).toEqual([{ options }]);
        });
    });

    it('renders one sticky header per group, in first-appearance order, with the models below', () => {
        renderWithProviders(
            <ControlledChatbot
                onSubmit={vi.fn()}
                models={[
                    { label: 'gpt-4o', value: 'openai/gpt-4o', group: 'OpenAI' },
                    { label: 'claude-sonnet', value: 'anthropic/claude-sonnet-4-0', group: 'Anthropic' },
                    { label: 'gpt-4.1', value: 'openai/gpt-4.1', group: 'OpenAI' },
                ]}
                modelPlaceholder="Choose a model"
            />
        );

        fireEvent.click(screen.getByText('Choose a model'));

        const openaiHeader = screen.getByText('OpenAI');
        const anthropicHeader = screen.getByText('Anthropic');
        expect(openaiHeader.className).toContain('sticky');
        expect(anthropicHeader.className).toContain('sticky');
        expect(openaiHeader.compareDocumentPosition(anthropicHeader) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(screen.getByText('gpt-4o')).toBeInTheDocument();
        expect(screen.getByText('gpt-4.1')).toBeInTheDocument();
        expect(screen.getByText('claude-sonnet')).toBeInTheDocument();
    });

    it('keeps the flat list (no headers) when no option has a group', () => {
        renderWithProviders(
            <ControlledChatbot
                onSubmit={vi.fn()}
                models={[
                    { label: 'Claude Sonnet', value: 'anthropic/claude-sonnet-4-0' },
                    { label: 'GPT-4o', value: 'openai/gpt-4o' },
                ]}
                modelPlaceholder="Choose a model"
            />
        );

        fireEvent.click(screen.getByText('Choose a model'));

        expect(screen.getByText('Claude Sonnet')).toBeInTheDocument();
        expect(screen.getByText('GPT-4o')).toBeInTheDocument();
        expect(screen.queryByText('anthropic')).not.toBeInTheDocument();
    });

    it('keeps pricing rendering identical inside grouped sections', () => {
        renderWithProviders(
            <ControlledChatbot
                onSubmit={vi.fn()}
                models={[
                    { label: 'Paid', value: 'openai/gpt-5-mini', group: 'OpenAI', pricing: { input: 0.25, output: 2, currency: 'USD', source: 'models.dev' } },
                    { label: 'Free', value: 'opencode/big-pickle', group: 'OpenCode', pricing: { input: 0, output: 0, currency: 'USD', source: 'models.dev' } },
                    { label: 'Unknown', value: 'glm/glm-z1-preview', group: 'GLM', pricing: null },
                    { label: 'No pricing data', value: 'custom/x', group: 'Custom' },
                ]}
                modelPlaceholder="Choose a model"
            />
        );

        fireEvent.click(screen.getByText('Choose a model'));

        expect(screen.getByText('$0.25 / $2')).toBeInTheDocument();
        expect(screen.getByText('$0 / $0')).toBeInTheDocument();
        expect(screen.getByText('Free').closest('button')?.className).toContain('bg-success/10');
        expect(screen.getAllByText('Price not found')).toHaveLength(1);
        expect(screen.getByText('OpenAI').className).toContain('sticky');
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
