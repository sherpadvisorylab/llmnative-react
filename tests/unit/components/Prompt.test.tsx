import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import Form from '../../../src/components/widgets/Form';
import { Input } from '../../../src/components/ui/fields/Input';
import Prompt, { PromptMode, runPrompt } from '../../../src/components/widgets/Prompt';
import { renderWithProviders } from '../../helpers/renderWithProviders';

describe('Prompt', () => {
    it('renders prompt editor mode with prompt metadata enabled by default', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    rows={4}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                />
            </Form>
        );

        expect(screen.getByText('Prompt: Summary')).toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', {
                name: 'Prompt ON. In PromptLive, this textarea is treated as the prompt template and can be executed against the current record. Turn OFF to skip the prompt system and use the plain fallback text instead.',
            })
        ).toBeInTheDocument();
    });

    it('toggles prompt metadata off from the switch when editor mode starts enabled', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    rows={4}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                />
            </Form>
        );

        const toggle = screen.getByRole('checkbox', {
            name: 'Prompt ON. In PromptLive, this textarea is treated as the prompt template and can be executed against the current record. Turn OFF to skip the prompt system and use the plain fallback text instead.',
        });

        expect(toggle).toBeChecked();
        expect(screen.getByText('Prompt: Summary')).toBeInTheDocument();

        fireEvent.click(toggle);

        expect(
            screen.getByRole('checkbox', {
                name: 'Prompt OFF. In PromptLive, the prompt system is skipped and the plain fallback text is used directly. Turn ON to use this textarea as the prompt template.',
            })
        ).not.toBeChecked();
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.queryByText('Prompt: Summary')).not.toBeInTheDocument();
    });

    it('runs the live prompt and writes the generated result back into the form field', async () => {
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
                    mode={PromptMode.LIVE}
                    rows={4}
                    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
                    onRunPrompt={async (prompt, config, data) => (
                        `${data?.projectName} | ${config.language} | ${prompt}`
                    )}
                />
            </Form>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Run prompt' }));

        await waitFor(() => {
            expect(screen.getByLabelText('Summary')).toHaveValue(
                'Atlas Console | English | Write a concise summary for {projectName}.'
            );
        });
    });

    it('falls back to a plain textarea in live mode when prompt metadata is disabled', () => {
        renderWithProviders(
            <Form aspect="empty">
                <Prompt
                    name="summary"
                    label="Summary"
                    mode={PromptMode.LIVE}
                    rows={4}
                    defaultValue={{ value: 'Human-written summary.', enabled: false }}
                />
            </Form>
        );

        expect(screen.getByLabelText('Summary')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Run prompt' })).not.toBeInTheDocument();
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
