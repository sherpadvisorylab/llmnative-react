import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';

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
                    rows={4}
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
        expect(screen.getByText('No AI providers are registered.')).toBeInTheDocument();
    });

    it('toggles prompt metadata off from the switch when edit mode starts enabled', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.EDIT}
                    rows={4}
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
                    rows={4}
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
                    rows={4}
                    defaultValue={{ value: 'Human-written summary.', enabled: false }}
                />
            </Form>
        );

        expect(screen.getByLabelText('Summary')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Run/i })).not.toBeInTheDocument();
    });

    it('uses renderPlainFallback to replace the default plain textarea UI', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.RUN}
                    defaultValue={{ value: 'Human-written summary.', enabled: false }}
                    renderPlainFallback={() => <div>Custom plain fallback</div>}
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
                    rows={4}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                />
            </Form>
        );

        expect(screen.getByText('No AI providers are registered.')).toBeInTheDocument();
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
            reason: 'No AI providers are registered.',
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
                        rows={4}
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
