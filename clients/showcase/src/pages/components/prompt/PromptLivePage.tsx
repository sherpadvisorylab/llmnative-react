import React from 'react';
import { AIProvider, createAIProviderRegistry, Form, Prompt, PromptMode } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import type { PlaygroundConfig } from '../../../docs-kit/playground';
import { usePlayground } from '../../../docs-kit/playground';
import {
    createPromptPlayground,
    createPromptPlaygroundSeed,
    executePromptPreview,
    PROMPT_LIVE_PROPS,
    PROMPT_SHARED_PROPS,
} from './promptDocs';

const PLAYGROUND_PROVIDER_OPTIONS = ['openai', 'openrouter', 'opencode', 'openai-compatible', 'deepseek', 'gemini', 'anthropic', 'mistral'] as const;

const PLAYGROUND_AI_CONFIG_KEY: Record<Exclude<(typeof PLAYGROUND_PROVIDER_OPTIONS)[number], 'openai-compatible'>, 'openaiApiKey' | 'openRouterApiKey' | 'openCodeApiKey' | 'deepSeekApiKey' | 'geminiApiKey' | 'anthropicApiKey' | 'mistralApiKey'> = {
    openai: 'openaiApiKey',
    openrouter: 'openRouterApiKey',
    opencode: 'openCodeApiKey',
    deepseek: 'deepSeekApiKey',
    gemini: 'geminiApiKey',
    anthropic: 'anthropicApiKey',
    mistral: 'mistralApiKey',
};

function PromptRunPlaygroundPreview({
    props,
    onValuesChange,
}: {
    props: Record<string, any>;
    onValuesChange?: (v: Record<string, any>) => void;
}) {
    const providerId = (props.playgroundAIProvider || 'openai') as (typeof PLAYGROUND_PROVIDER_OPTIONS)[number];
    const apiKey = typeof props.playgroundApiKey === 'string' ? props.playgroundApiKey : '';
    const compatibleBaseUrl = typeof props.playgroundCompatibleBaseUrl === 'string'
        ? props.playgroundCompatibleBaseUrl.trim()
        : '';
    const aiConfig = !apiKey
        ? undefined
        : providerId === 'openai-compatible'
            ? {
                openAICompatible: {
                    apiKey,
                    baseUrl: compatibleBaseUrl,
                    defaultModel: 'default',
                    fallbackModels: ['default'],
                },
            }
            : { [PLAYGROUND_AI_CONFIG_KEY[providerId]]: apiKey };
    const registry = createAIProviderRegistry(aiConfig);

    return (
        <AIProvider registry={registry} defaultKey={providerId}>
            <Form
                aspect="empty"
                defaultValues={createPromptPlaygroundSeed(props.defaultValue)}
                onChange={onValuesChange}
            >
                <Prompt
                    name={props.name || 'summary'}
                    label={props.label || undefined}
                    mode={PromptMode.RUN}
                    required={props.required}
                    defaultValue={props.defaultValue}
                    rows={props.rows}
                    pre={props.pre || undefined}
                    post={props.post || undefined}
                    className={props.className || undefined}
                    wrapClass={props.wrapClass || undefined}
                />
            </Form>
        </AIProvider>
    );
}

const BASE_PLAYGROUND = createPromptPlayground(
    'run',
    (p, onValuesChange) => (
        <PromptRunPlaygroundPreview props={p} onValuesChange={onValuesChange} />
    ),
    PROMPT_LIVE_PROPS,
);

const PLAYGROUND: PlaygroundConfig = {
    ...BASE_PLAYGROUND,
    defaultProps: {
        ...BASE_PLAYGROUND.defaultProps,
        playgroundAIProvider: 'openai',
        playgroundApiKey: '',
        playgroundCompatibleBaseUrl: 'https://api.openai.com/v1',
    },
    inspectorSections: [
        {
            label: 'AI provider',
            icon: 'stars',
            render: (props, onUpdateProp) => (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Pick a provider and paste an API key to wire the playground directly into the built-in AI registry. Leave the key empty to see the unavailable state.
                    </p>
                    <div className="flex overflow-hidden rounded-md border border-input bg-background shadow-sm">
                        <select
                            className="min-w-36 border-r border-input bg-muted/30 px-3 py-2 text-sm text-foreground outline-none"
                            value={props.playgroundAIProvider || 'openai'}
                            onChange={(event) => onUpdateProp('playgroundAIProvider', event.target.value)}
                        >
                            {PLAYGROUND_PROVIDER_OPTIONS.map((provider) => (
                                <option key={provider} value={provider}>
                                    {provider}
                                </option>
                            ))}
                        </select>
                        <input
                            type="password"
                            className="w-full bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            value={props.playgroundApiKey || ''}
                            placeholder="Paste API key for the selected provider"
                            onChange={(event) => onUpdateProp('playgroundApiKey', event.target.value)}
                        />
                    </div>
                    {props.playgroundAIProvider === 'openai-compatible' && (
                        <input
                            type="url"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground"
                            value={props.playgroundCompatibleBaseUrl || ''}
                            placeholder="Base URL for the OpenAI-compatible endpoint"
                            onChange={(event) => onUpdateProp('playgroundCompatibleBaseUrl', event.target.value)}
                        />
                    )}
                </div>
            ),
        },
    ],
};

export default function PromptLivePage() {
    usePlayground(PLAYGROUND, 'PromptRun');

    return (
        <PageLayout
            title="PromptRun"
            description="Execute the stored prompt against the active form record and write the generated result back into the same field."
        >
            <Section
                title="AI unavailable notice"
                description="This is the basic run variant. It intentionally omits onRunPrompt, so when no AI provider is configured the component shows the inline availability notice and disables the Run action."
                bare
                preview={(
                    <Form
                        aspect="empty"
                        defaultValues={{
                            projectName: 'Northwind Revamp',
                            summary: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a concise launch summary for {projectName}.',
                                    language: 'English',
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label="Summary"
                                mode={PromptMode.RUN}
                                rows={5}
                                defaultValue={{
                                    value: 'Write a concise launch summary for {projectName}.',
                                    enabled: true,
                                    language: 'English',
                                }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form
  aspect="empty"
  defaultValues={{
    projectName: 'Northwind Revamp',
    summary: {
      value: '',
      prompt: {
        enabled: 'on',
        value: 'Write a concise launch summary for {projectName}.',
        language: 'English',
      },
    },
  }}
>
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.RUN}
    rows={5}
    defaultValue={{
      value: 'Write a concise launch summary for {projectName}.',
      enabled: true,
      language: 'English',
    }}
  />
</Form>`}
            />

            <Section
                title="Run against form context"
                description="This variant shows how onRunPrompt works. A custom executor handles the prompt locally, so the component can still demonstrate the full run flow even without a registered AI provider."
                bare
                preview={(
                    <Form
                        aspect="empty"
                        defaultValues={{
                            projectName: 'Northwind Revamp',
                            summary: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a concise launch summary for {projectName}.',
                                    language: 'English',
                                    style: 'concise',
                                    temperature: 0.6,
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label="Summary"
                                mode={PromptMode.RUN}
                                rows={5}
                                defaultValue={{
                                    value: 'Write a concise launch summary for {projectName}.',
                                    enabled: true,
                                    language: 'English',
                                    style: 'concise',
                                    temperature: 0.6,
                                }}
                                onRunPrompt={executePromptPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form
  aspect="empty"
  defaultValues={{
    projectName: 'Northwind Revamp',
    summary: {
      value: '',
      prompt: {
        enabled: 'on',
        value: 'Write a concise launch summary for {projectName}.',
        language: 'English',
        style: 'concise',
        temperature: 0.6,
      },
    },
  }}
>
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.RUN}
    rows={5}
    defaultValue={{
      value: 'Write a concise launch summary for {projectName}.',
      enabled: true,
      language: 'English',
      style: 'concise',
      temperature: 0.6,
    }}
    onRunPrompt={executePromptPreview}
  />
</Form>`}
            />

            <PropDocsTable props={[...PROMPT_LIVE_PROPS, ...PROMPT_SHARED_PROPS]} />
        </PageLayout>
    );
}
