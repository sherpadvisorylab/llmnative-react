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

// ── Playground AI provider picker ────────────────────────────────────────────

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
    props: Record<string, unknown>;
    onValuesChange?: (v: Record<string, unknown>) => void;
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
    const variables = props.variables && typeof props.variables === 'object' && !Array.isArray(props.variables)
        ? props.variables as Record<string, unknown>
        : undefined;

    return (
        <AIProvider registry={registry} defaultKey={providerId}>
            <Form
                appearance="empty"
                defaultValues={createPromptPlaygroundSeed(
                    props.defaultValue as Record<string, unknown> | undefined
                )}
                onChange={onValuesChange}
            >
                <Prompt
                    name={typeof props.name === 'string' ? props.name : 'summary'}
                    label={typeof props.label === 'string' ? props.label : undefined}
                    mode={PromptMode.RUN}
                    required={Boolean(props.required)}
                    defaultValue={props.defaultValue as Parameters<typeof Prompt>[0]['defaultValue']}
                    rows={typeof props.rows === 'number' ? props.rows : undefined}
                    before={props.before ? String(props.before) : undefined}
                    after={props.after ? String(props.after) : undefined}
                    className={typeof props.className === 'string' ? props.className : undefined}
                    wrapperClassName={typeof props.wrapperClassName === 'string' ? props.wrapperClassName : undefined}
                    variables={variables}
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
                            value={typeof props.playgroundAIProvider === 'string' ? props.playgroundAIProvider : 'openai'}
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
                            value={typeof props.playgroundApiKey === 'string' ? props.playgroundApiKey : ''}
                            placeholder="Paste API key for the selected provider"
                            onChange={(event) => onUpdateProp('playgroundApiKey', event.target.value)}
                        />
                    </div>
                    {props.playgroundAIProvider === 'openai-compatible' && (
                        <input
                            type="url"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground"
                            value={typeof props.playgroundCompatibleBaseUrl === 'string' ? props.playgroundCompatibleBaseUrl : ''}
                            placeholder="Base URL for the OpenAI-compatible endpoint"
                            onChange={(event) => onUpdateProp('playgroundCompatibleBaseUrl', event.target.value)}
                        />
                    )}
                </div>
            ),
        },
    ],
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PromptLivePage() {
    usePlayground(PLAYGROUND, 'PromptRun');

    return (
        <PageLayout
            title="PromptRun"
            description="Execute the stored prompt against the active form record and write the generated result back into the same field."
        >
            {/* ── AI unavailable notice ── */}
            <Section
                title="AI unavailable notice"
                description="When no AI provider is configured the component shows an inline warning in the footer bar and disables the Run button. The edit gear is still accessible."
                bare
                preview={(
                    <Form
                        appearance="empty"
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
                                rows={4}
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
  appearance="empty"
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
    rows={4}
    defaultValue={{
      value: 'Write a concise launch summary for {projectName}.',
      enabled: true,
      language: 'English',
    }}
  />
</Form>`}
            />

            {/* ── Run against form context ── */}
            <Section
                title="Run against form context"
                description="onRunPrompt wires a custom executor — here a local mock — so the full run flow is visible without a real AI key. The form record is passed as data and {placeholders} are resolved automatically."
                bare
                preview={(
                    <Form
                        appearance="empty"
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
                code={`const myRunner = async (prompt, options, data) => {
  const response = await ai.complete({ prompt, ...options, data });
  return response.text;
};

<Form appearance="empty" defaultValues={{ projectName: 'Northwind Revamp', ... }}>
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
    onRunPrompt={myRunner}
  />
</Form>`}
            />

            {/* ── Variables — resolved preview ── */}
            <Section
                title="Variables — resolved preview"
                description="Pass variables to inject external values into the template. In edit mode, the eye icon in the footer bar reveals a read-only preview showing the prompt as it will be sent to the AI — with all {placeholders} resolved."
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            tagline: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a punchy one-line tagline for {product}, a {industry} platform. Keep it under 10 words.',
                                    language: 'English',
                                    style: 'bold',
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="tagline"
                                label="Tagline"
                                mode={PromptMode.RUN}
                                rows={4}
                                variables={{ product: 'Atlas Console', industry: 'DevOps' }}
                                defaultValue={{
                                    value: 'Write a punchy one-line tagline for {product}, a {industry} platform. Keep it under 10 words.',
                                    enabled: true,
                                    language: 'English',
                                    style: 'bold',
                                }}
                                onRunPrompt={executePromptPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt
  name="tagline"
  label="Tagline"
  mode={PromptMode.RUN}
  variables={{ product: 'Atlas Console', industry: 'DevOps' }}
  defaultValue={{
    value: 'Write a punchy one-line tagline for {product}, a {industry} platform.',
    enabled: true,
    language: 'English',
    style: 'bold',
  }}
  onRunPrompt={myRunner}
/>`}
            />

            {/* ── Edit mode settings ── */}
            <Section
                title="Edit mode — settings toolbar"
                description="Click the gear icon (top-right on hover) to enter edit mode. The footer bar exposes model, role, language, voice, style and temperature controls — all stored in the form record under the prompt key."
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            projectName: 'Atlas Console',
                            bio: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a short product description for {projectName}. Highlight the key differentiators.',
                                    language: 'English',
                                    style: 'professional',
                                    voice: 'Informative',
                                    temperature: 0.7,
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="bio"
                                label="Product description"
                                mode={PromptMode.RUN}
                                rows={5}
                                defaultValue={{
                                    value: 'Write a short product description for {projectName}. Highlight the key differentiators.',
                                    enabled: true,
                                    language: 'English',
                                    style: 'professional',
                                    voice: 'Informative',
                                    temperature: 0.7,
                                }}
                                onRunPrompt={executePromptPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`// Hover the prompt → gear icon (top-right) → click to enter edit mode.
// The footer bar shows: model selector + role / language / voice / style / temperature icon dropdowns.
// All values are stored under name + ".prompt.*" in the form record.

<Prompt
  name="bio"
  label="Product description"
  mode={PromptMode.RUN}
  defaultValue={{
    value: 'Write a short product description for {projectName}.',
    enabled: true,
    language: 'English',
    style: 'professional',
    voice: 'Informative',
    temperature: 0.7,
  }}
  onRunPrompt={myRunner}
/>`}
            />

            {/* ── Multiple prompts in a form ── */}
            <Section
                title="Multiple prompts in a form"
                description="Each Prompt field owns an independent template and AI settings, stored under its form key. Run each one separately — they share the same form record but never overwrite each other."
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            projectName: 'Atlas Console',
                            summary: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a concise summary for {projectName}.',
                                    language: 'English',
                                    style: 'concise',
                                },
                            },
                            tagline: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a punchy one-line tagline for {projectName}.',
                                    style: 'bold',
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl space-y-4">
                            <Prompt
                                name="summary"
                                label="Summary"
                                mode={PromptMode.RUN}
                                rows={4}
                                defaultValue={{
                                    value: 'Write a concise summary for {projectName}.',
                                    enabled: true,
                                    language: 'English',
                                    style: 'concise',
                                }}
                                onRunPrompt={executePromptPreview}
                            />
                            <Prompt
                                name="tagline"
                                label="Tagline"
                                mode={PromptMode.RUN}
                                rows={3}
                                defaultValue={{
                                    value: 'Write a punchy one-line tagline for {projectName}.',
                                    enabled: true,
                                    style: 'bold',
                                }}
                                onRunPrompt={executePromptPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form appearance="empty" defaultValues={{ projectName: 'Atlas Console', ... }}>
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.RUN}
    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true, style: 'concise' }}
    onRunPrompt={myRunner}
  />
  <Prompt
    name="tagline"
    label="Tagline"
    mode={PromptMode.RUN}
    defaultValue={{ value: 'Write a punchy one-line tagline for {projectName}.', enabled: true, style: 'bold' }}
    onRunPrompt={myRunner}
  />
</Form>`}
            />

            {/* ── Custom unavailable notice ── */}
            <Section
                title="Custom unavailable notice"
                description="renderAIUnavailable replaces the default footer warning with your own UI — useful for linking to a settings page or showing a branded message."
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            notes: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: 'Summarise the key points from this meeting.',
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="notes"
                                label="Meeting notes"
                                mode={PromptMode.RUN}
                                rows={4}
                                defaultValue={{
                                    value: 'Summarise the key points from this meeting.',
                                    enabled: true,
                                }}
                                renderAIUnavailable={({ reason }) => (
                                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-warning/60 bg-warning/5 px-3 py-2 text-xs text-warning">
                                        <span>⚠</span>
                                        <span>{reason || 'Connect an AI provider to enable one-click summarisation.'}</span>
                                    </div>
                                )}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt
  name="notes"
  label="Meeting notes"
  mode={PromptMode.RUN}
  defaultValue={{ value: 'Summarise the key points from this meeting.', enabled: true }}
  renderAIUnavailable={({ reason }) => (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-warning/60 bg-warning/5 px-3 py-2 text-xs text-warning">
      <span>⚠</span>
      <span>{reason || 'Connect an AI provider to enable one-click summarisation.'}</span>
    </div>
  )}
/>`}
            />

            <PropDocsTable props={[...PROMPT_LIVE_PROPS, ...PROMPT_SHARED_PROPS]} />
        </PageLayout>
    );
}
