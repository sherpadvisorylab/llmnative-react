import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));

import Form from '../../../src/components/widgets/Form';
import { Input } from '../../../src/components/ui/fields/Input';
import Prompt, { PromptMode, runPrompt } from '../../../src/components/widgets/Prompt';
import { AIProvider } from '../../../src/providers/ai/AIProviderContext';
import type { AIProviderAdapter } from '../../../src/providers/ai';
import { renderWithProviders } from '../../helpers/renderWithProviders';

describe('Prompt', () => {
    it('renders prompt edit mode with prompt metadata enabled by default', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.EDIT}
                    minHeight={120}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                />
            </Form>
        );

        expect(screen.getByText('Prompt: Summary')).toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', {
                name: 'Prompt ON. In PromptRun, this textarea is treated as the prompt template and can be executed against the current record. Turn OFF to skip the prompt system and use the plain fallback text instead.',
            })
        ).toBeInTheDocument();
        expect(screen.getByText('AI is not configured. You can still edit and save this prompt.')).toBeInTheDocument();
    });

    it('toggles prompt metadata off from the switch when edit mode starts enabled', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.EDIT}
                    minHeight={120}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                />
            </Form>
        );

        const toggle = screen.getByRole('checkbox', {
            name: 'Prompt ON. In PromptRun, this textarea is treated as the prompt template and can be executed against the current record. Turn OFF to skip the prompt system and use the plain fallback text instead.',
        });

        expect(toggle).toBeChecked();
        expect(screen.getByText('Prompt: Summary')).toBeInTheDocument();

        fireEvent.click(toggle);

        expect(
            screen.getByRole('checkbox', {
                name: 'Prompt OFF. In PromptRun, the prompt system is skipped and the plain fallback text is used directly. Turn ON to use this textarea as the prompt template.',
            })
        ).not.toBeChecked();
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.queryByText('Prompt: Summary')).not.toBeInTheDocument();
    });

    it('toggles prompt metadata on and off when edit mode starts disabled', () => {
        renderWithProviders(
            <Form
                aspect="empty"
                defaultValues={{
                    description: {
                        value: 'A short human-written description without AI assistance.',
                    },
                }}
            >
                <Prompt
                    name="description"
                    label="Description"
                    mode={PromptMode.EDIT}
                    minHeight={120}
                    defaultValue={{
                        value: 'A short human-written description without AI assistance.',
                        enabled: false,
                    }}
                />
            </Form>
        );

        const toggleOff = screen.getByRole('checkbox', {
            name: 'Prompt OFF. In PromptRun, the prompt system is skipped and the plain fallback text is used directly. Turn ON to use this textarea as the prompt template.',
        });

        expect(toggleOff).not.toBeChecked();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('A short human-written description without AI assistance.')).toBeInTheDocument();

        fireEvent.click(toggleOff);

        const toggleOn = screen.getByRole('checkbox', {
            name: 'Prompt ON. In PromptRun, this textarea is treated as the prompt template and can be executed against the current record. Turn OFF to skip the prompt system and use the plain fallback text instead.',
        });

        expect(toggleOn).toBeChecked();
        expect(screen.getByText('Prompt: Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('A short human-written description without AI assistance.')).toBeInTheDocument();

        fireEvent.click(toggleOn);

        expect(screen.getByRole('checkbox', {
            name: 'Prompt OFF. In PromptRun, the prompt system is skipped and the plain fallback text is used directly. Turn ON to use this textarea as the prompt template.',
        })).not.toBeChecked();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('A short human-written description without AI assistance.')).toBeInTheDocument();
    });

    it('runs the prompt in run mode with a custom executor and writes the generated result back into the form field', async () => {
        renderWithProviders(
            <Form
                aspect="empty"
                defaultValues={{
                    projectName: 'Atlas Console',
                    summary: {
                        value: '',
                        prompt: {
                            enabled: 'on',
                            value: 'Write a concise summary for {projectName}.',
                            language: 'English',
                        },
                    },
                }}
            >
                <Input name="projectName" label="Project name" />
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.RUN}
                    minHeight={120}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                    onRunPrompt={async (prompt, config, data) => (
                        `${data?.projectName} | ${config.language} | ${prompt}`
                    )}
                />
            </Form>
        );

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));

        await waitFor(() => {
            expect(
                screen.getByDisplayValue('Atlas Console | English | Write a concise summary for {projectName}.')
            ).toBeInTheDocument();
        });

        expect(screen.queryByText('Prompt execution is unavailable.')).not.toBeInTheDocument();
    });

    it('falls back to a plain textarea in run mode when prompt metadata is disabled', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.RUN}
                    minHeight={120}
                    defaultValue={{ value: 'Human-written summary.', enabled: false }}
                />
            </Form>
        );

        expect(screen.getByLabelText('Summary')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Run/i })).not.toBeInTheDocument();
    });

    it('uses renderFallback to replace the default plain textarea UI', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.RUN}
                    defaultValue={{ value: 'Human-written summary.', enabled: false }}
                    renderFallback={() => <div>Custom plain fallback</div>}
                />
            </Form>
        );

        expect(screen.getByText('Custom plain fallback')).toBeInTheDocument();
        expect(screen.queryByLabelText('Summary')).not.toBeInTheDocument();
    });

    it('shows AI unavailable notice and disables run when no provider or custom executor exists', () => {
        renderWithProviders(
            <Form
                aspect="empty"
                defaultValues={{
                    summary: {
                        value: '',
                        prompt: {
                            enabled: 'on',
                            value: 'Write a concise summary for {projectName}.',
                        },
                    },
                }}
            >
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.RUN}
                    minHeight={120}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                />
            </Form>
        );

        expect(screen.getByText('AI not configured')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Run/i })).toBeDisabled();
    });

    it('uses renderAIUnavailable in edit mode when AI is unavailable', () => {
        const renderAIUnavailable = vi.fn(() => <div>Custom AI unavailable</div>);

        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.EDIT}
                    defaultValue={{ value: 'Write a concise summary.', enabled: true }}
                    renderAIUnavailable={renderAIUnavailable}
                />
            </Form>
        );

        expect(screen.getByText('Custom AI unavailable')).toBeInTheDocument();
        expect(renderAIUnavailable).toHaveBeenCalledWith({
            mode: PromptMode.EDIT,
            providerId: null,
            reason: undefined,
            configured: false,
        });
    });

    it('shows a visible error when prompt execution fails', async () => {
        const failingProvider: AIProviderAdapter = {
            id: 'failing',
            label: 'Failing',
            defaultModel: 'default',
            isConfigured: () => true,
            getCapabilities: async () => ({
                supportsTemperature: true,
                models: [{
                    id: 'failing/default',
                    provider: 'failing',
                    model: 'default',
                    label: 'Failing / default',
                }],
            }),
            complete: async () => {
                throw new Error('Provider exploded');
            },
        };

        renderWithProviders(
            <AIProvider registry={{ failing: failingProvider }} defaultKey="failing">
                <Form
                    aspect="empty"
                    defaultValues={{
                        summary: {
                            value: '',
                            prompt: {
                                enabled: 'on',
                                value: 'Write a concise summary for {projectName}.',
                            },
                        },
                    }}
                >
                    <Prompt
                        name="summary"
                        label="Summary"
                        mode={PromptMode.RUN}
                        minHeight={120}
                        defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                    />
                </Form>
            </AIProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));

        await waitFor(() => {
            expect(screen.getByText('Provider exploded')).toBeInTheDocument();
        });
    });

    it('opens slash commands from the textarea and applies the highlighted command with Enter', async () => {
        renderWithProviders(
            <Form
                aspect="empty"
                defaultValues={{
                    copy: {
                        value: '',
                        prompt: {
                            enabled: 'on',
                            value: 'Draft product copy.',
                        },
                    },
                }}
            >
                <Prompt
                    name="copy"
                    label="Copy"
                    mode={PromptMode.RUN}
                    defaultValue={{ value: 'Draft product copy.', enabled: true }}
                    onRunPrompt={async (prompt) => prompt}
                    commands={[
                        {
                            name: 'shorten',
                            description: 'Shorten to one sentence',
                            handler: (value) => `Shorten this text:\n\n${value}`,
                        },
                    ]}
                />
            </Form>
        );

        const textarea = document.querySelector('textarea[name="copy.value"]') as HTMLTextAreaElement | null;
        expect(textarea).not.toBeNull();

        fireEvent.keyDown(textarea!, { key: '/' });
        fireEvent.change(textarea!, { target: { value: '/' } });

        await waitFor(() => {
            expect(screen.getByText('/shorten')).toBeInTheDocument();
        });

        fireEvent.keyDown(textarea!, { key: 'Enter' });

        await waitFor(() => {
            expect(textarea?.value).toBe('Shorten this text:\n\n/');
        });
    });

    it('forwards attached files to the custom executor', async () => {
        const executor = vi.fn(async () => 'Attachment summary');

        renderWithProviders(
            <Form
                aspect="empty"
                defaultValues={{
                    report: {
                        value: '',
                        prompt: {
                            enabled: 'on',
                            value: 'Summarise the attachment.',
                        },
                    },
                }}
            >
                <Prompt
                    name="report"
                    label="Report"
                    mode={PromptMode.RUN}
                    defaultValue={{ value: 'Summarise the attachment.', enabled: true }}
                    onRunPrompt={executor}
                    attachments
                />
            </Form>
        );

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
        expect(fileInput).not.toBeNull();

        const file = new File(['hello world'], 'notes.txt', { type: 'text/plain' });
        fireEvent.change(fileInput!, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));

        await waitFor(() => {
            expect(executor).toHaveBeenCalledTimes(1);
        });

        const [, options] = executor.mock.calls[0];
        expect(options.attachments).toHaveLength(1);
        expect(options.attachments?.[0]).toMatchObject({
            mimeType: 'text/plain',
            name: 'notes.txt',
        });
        expect(options.attachments?.[0].base64).toBeTruthy();
    });

    it('renders status items after a successful run', async () => {
        renderWithProviders(
            <Form
                aspect="empty"
                defaultValues={{
                    summary: {
                        value: '',
                        prompt: {
                            enabled: 'on',
                            value: 'Write a concise summary for Atlas Console.',
                        },
                    },
                }}
            >
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.RUN}
                    defaultValue={{ value: 'Write a concise summary for Atlas Console.', enabled: true, model: 'openai/gpt-4o' }}
                    onRunPrompt={async () => 'A concise answer.'}
                    statusItems={['tokensIn', 'tokensOut', 'duration']}
                />
            </Form>
        );

        fireEvent.click(screen.getByRole('button', { name: /Run/i }));

        await waitFor(() => {
            expect(screen.getByText(/Input: \d+ tok/i)).toBeInTheDocument();
            expect(screen.getByText(/Output: \d+ tok/i)).toBeInTheDocument();
        });
    });

});

describe('runPrompt', () => {
    it('uses the custom executor directly when provided', async () => {
        const result = await runPrompt(
            { value: 'Write a concise summary.', language: 'English' },
            { projectName: 'Atlas Console' },
            async (prompt, config, data) => `${data?.projectName} | ${config.language} | ${prompt}`
        );

        expect(result).toBe('Atlas Console | English | Write a concise summary.');
    });
});
