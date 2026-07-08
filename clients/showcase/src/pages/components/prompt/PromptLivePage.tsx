import React from 'react';
import { AIProvider, ContextMenu, createAIProviderRegistry, Form, Prompt, PromptMode, PromptUtils } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import type { PlaygroundConfig } from '../../../docs-kit/playground';
import { usePlayground } from '../../../docs-kit/playground';
import {
    createPromptLiveProps,
    createPromptPlayground,
    createPromptPlaygroundSeed,
    createPromptSharedProps,
    executePromptPreview,
} from './promptDocs';
import { useShowcasePromptLiveI18n, useShowcasePromptSharedI18n } from '../../../showcase/i18n';

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
                defaultValues={createPromptPlaygroundSeed((props.__sharedCopy as never), props.defaultValue as Record<string, unknown> | undefined)}
                onChange={onValuesChange}
            >
                <Prompt
                    name={typeof props.name === 'string' ? props.name : 'summary'}
                    label={typeof props.label === 'string' ? props.label : undefined}
                    mode={PromptMode.RUN}
                    required={Boolean(props.required)}
                    defaultValue={props.defaultValue as Parameters<typeof Prompt>[0]['defaultValue']}
                    minHeight={typeof props.minHeight === 'number' ? props.minHeight : undefined}
                    maxHeight={typeof props.maxHeight === 'number' ? props.maxHeight : undefined}
                    before={props.before ? String(props.before) : undefined}
                    after={props.after ? String(props.after) : undefined}
                    className={typeof props.className === 'string' ? props.className : undefined}
                    wrapperClassName={typeof props.wrapperClassName === 'string' ? props.wrapperClassName : undefined}
                    variables={variables}
                    commands={Array.isArray(props.commands) ? props.commands as Parameters<typeof Prompt>[0]['commands'] : undefined}
                    commandsTrigger={typeof props.commandsTrigger === 'string' ? props.commandsTrigger : undefined}
                    attachments={Boolean(props.attachments)}
                />
            </Form>
        </AIProvider>
    );
}

export default function PromptLivePage() {
    const t = useShowcasePromptLiveI18n();
    const shared = useShowcasePromptSharedI18n();
    const liveProps = React.useMemo(() => createPromptLiveProps(shared), [shared]);
    const sharedProps = React.useMemo(() => createPromptSharedProps(shared), [shared]);
    const runPreview = React.useCallback(
        (prompt: string, config: Record<string, unknown>, data?: Record<string, unknown>) => executePromptPreview(shared, prompt, config, data),
        [shared],
    );

    const basePlayground = React.useMemo(() => createPromptPlayground(
        shared,
        'run',
        (p, onValuesChange) => (
            <PromptRunPlaygroundPreview props={{ ...p, __sharedCopy: shared }} onValuesChange={onValuesChange} />
        ),
        liveProps,
    ), [liveProps, shared]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        ...basePlayground,
        defaultProps: {
            ...basePlayground.defaultProps,
            playgroundAIProvider: 'openai',
            playgroundApiKey: '',
            playgroundCompatibleBaseUrl: 'https://api.openai.com/v1',
        },
        inspectorSections: [
            {
                label: shared.playground.inspector.providerLabel,
                icon: 'stars',
                render: (props, onUpdateProp) => (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {shared.playground.inspector.providerDescription}
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
                                placeholder={shared.playground.inspector.apiKeyPlaceholder}
                                onChange={(event) => onUpdateProp('playgroundApiKey', event.target.value)}
                            />
                        </div>
                        {props.playgroundAIProvider === 'openai-compatible' && (
                            <input
                                type="url"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground"
                                value={typeof props.playgroundCompatibleBaseUrl === 'string' ? props.playgroundCompatibleBaseUrl : ''}
                                placeholder={shared.playground.inspector.compatibleBaseUrlPlaceholder}
                                onChange={(event) => onUpdateProp('playgroundCompatibleBaseUrl', event.target.value)}
                            />
                        )}
                    </div>
                ),
            },
        ],
    }), [basePlayground, shared]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.aiUnavailableNotice.title}
                description={t.sections.aiUnavailableNotice.description}
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            projectName: t.labels.northwindRevamp,
                            summary: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: t.labels.conciseLaunchSummary,
                                    language: shared.playground.defaults.english,
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label={t.labels.summary}
                                mode={PromptMode.RUN}
                                minHeight={120}
                                maxHeight={160}
                                defaultValue={{
                                    value: t.labels.conciseLaunchSummary,
                                    enabled: true,
                                    language: shared.playground.defaults.english,
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
    minHeight={120}
    maxHeight={160}
    defaultValue={{
      value: 'Write a concise launch summary for {projectName}.',
      enabled: true,
      language: 'English',
    }}
  />
</Form>`}
            />

            <Section
                title={t.sections.runAgainstFormContext.title}
                description={t.sections.runAgainstFormContext.description}
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            projectName: t.labels.northwindRevamp,
                            summary: {
                                value: '',
                                prompt: {
                                    enabled: 'on',
                                    value: t.labels.conciseLaunchSummary,
                                    language: shared.playground.defaults.english,
                                    style: shared.playground.defaults.concise,
                                    temperature: 0.6,
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label={t.labels.summary}
                                mode={PromptMode.RUN}
                                minHeight={140}
                                maxHeight={200}
                                variables={{ projectName: t.labels.northwindRevamp }}
                                defaultValue={{
                                    value: t.labels.conciseLaunchSummary,
                                    enabled: true,
                                    language: shared.playground.defaults.english,
                                    style: shared.playground.defaults.concise,
                                    temperature: 0.6,
                                }}
                                onRunPrompt={runPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`const myRunner = async (prompt, options, data) => {
  const response = await ai.complete({ prompt, ...options, data });
  return response.text;
};`}
            />

            <Section
                title={t.sections.variablesResolvedPreview.title}
                description={t.sections.variablesResolvedPreview.description}
                bare
                preview={(
                    <Form appearance="empty">
                        <div className="max-w-3xl">
                            <Prompt
                                name="tagline"
                                label={t.labels.tagline}
                                mode={PromptMode.RUN}
                                minHeight={120}
                                maxHeight={160}
                                variables={{ product: t.labels.atlasConsole, industry: 'DevOps' }}
                                defaultValue={{
                                    value: t.labels.punchyTagline,
                                    enabled: true,
                                    language: shared.playground.defaults.english,
                                    style: 'bold',
                                }}
                                onRunPrompt={runPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt name="tagline" mode={PromptMode.RUN} variables={{ product: 'Atlas Console', industry: 'DevOps' }} />`}
            />

            <Section
                title={t.sections.editModeSettingsToolbar.title}
                description={t.sections.editModeSettingsToolbar.description}
                bare
                preview={(
                    <Form appearance="empty">
                        <div className="max-w-3xl">
                            <Prompt
                                name="bio"
                                label={t.labels.productDescription}
                                mode={PromptMode.RUN}
                                minHeight={140}
                                maxHeight={200}
                                defaultValue={{
                                    value: t.labels.shortProductDescription,
                                    enabled: true,
                                    language: shared.playground.defaults.english,
                                    style: 'professional',
                                    voice: 'Informative',
                                    temperature: 0.7,
                                }}
                                onRunPrompt={runPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt name="bio" mode={PromptMode.RUN} />`}
            />

            <Section
                title={t.sections.multiplePromptsInForm.title}
                description={t.sections.multiplePromptsInForm.description}
                bare
                preview={(
                    <Form appearance="empty" defaultValues={{ projectName: t.labels.atlasConsole }}>
                        <div className="max-w-3xl space-y-4">
                            <Prompt
                                name="summary"
                                label={t.labels.summary}
                                mode={PromptMode.RUN}
                                minHeight={120}
                                maxHeight={160}
                                defaultValue={{ value: t.labels.conciseProjectSummary, enabled: true, language: shared.playground.defaults.english, style: shared.playground.defaults.concise }}
                                onRunPrompt={runPreview}
                            />
                            <Prompt
                                name="tagline"
                                label={t.labels.tagline}
                                mode={PromptMode.RUN}
                                minHeight={96}
                                maxHeight={140}
                                defaultValue={{ value: t.labels.punchyTagline, enabled: true, style: 'bold' }}
                                onRunPrompt={runPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form appearance="empty"><Prompt name="summary" /><Prompt name="tagline" /></Form>`}
            />

            <Section
                title={t.sections.customUnavailableNotice.title}
                description={t.sections.customUnavailableNotice.description}
                bare
                preview={(
                    <Form appearance="empty">
                        <div className="max-w-3xl">
                            <Prompt
                                name="notes"
                                label={t.labels.meetingNotes}
                                mode={PromptMode.RUN}
                                minHeight={120}
                                maxHeight={160}
                                defaultValue={{ value: t.labels.meetingSummary, enabled: true }}
                                renderAIUnavailable={({ reason }) => (
                                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-warning/60 bg-warning/5 px-3 py-2 text-xs text-warning">
                                        <span>!</span>
                                        <span>{reason || t.labels.customUnavailableFallback}</span>
                                    </div>
                                )}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt name="notes" mode={PromptMode.RUN} renderAIUnavailable={({ reason }) => <div>{reason}</div>} />`}
            />

            <Section
                title="Commands via internal ContextMenu"
                description="Pass commands to mount ContextMenu directly inside the result textarea. Typing the trigger opens one unified menu instead of a separate slash surface."
                bare
                preview={(
                    <Form appearance="empty">
                        <div className="max-w-3xl">
                            <Prompt
                                name="copy"
                                label={t.labels.marketingCopy}
                                mode={PromptMode.RUN}
                                minHeight={140}
                                maxHeight={200}
                                commands={[
                                    { name: 'translate', description: 'Translate to English', icon: 'languages', handler: () => 'Translate the following to English:\n\n' },
                                    { name: 'shorten', description: 'Shorten text', icon: 'minimize-2', handler: () => 'Shorten to 1 sentence:\n\n' },
                                    { name: 'bulletpoints', description: 'Convert to bullet points', icon: 'list', handler: () => 'Convert to 3 bullet points:\n\n' },
                                ]}
                                commandsTrigger="/"
                                defaultValue={{ value: t.labels.devopsPlatformDescription, enabled: true }}
                                onRunPrompt={runPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt
  name="copy"
  mode={PromptMode.RUN}
  commands={COMMANDS}
  commandsTrigger="/"
/>`}
            />

            <Section
                title={t.sections.attachments.title}
                description={t.sections.attachments.description}
                bare
                preview={(
                    <Form appearance="empty">
                        <div className="max-w-3xl">
                            <Prompt
                                name="report"
                                label={t.labels.documentSummary}
                                mode={PromptMode.RUN}
                                minHeight={120}
                                maxHeight={160}
                                attachments
                                defaultValue={{ value: t.labels.attachedDocumentSummary, enabled: true }}
                                onRunPrompt={runPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt name="report" mode={PromptMode.RUN} attachments />`}
            />

            <Section
                title={t.sections.multimodalInputs.title}
                description={t.sections.multimodalInputs.description}
                code={`<Prompt name="analysis" mode={PromptMode.RUN} attachments />`}
            />

            <Section
                title={t.sections.statusItems.title}
                description={t.sections.statusItems.description}
                bare
                preview={(
                    <Form appearance="empty">
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label={t.labels.summary}
                                mode={PromptMode.RUN}
                                minHeight={140}
                                maxHeight={200}
                                statusItems={['tokensIn', 'tokensOut', 'contextPercent', 'duration']}
                                actions={[{ key: 'tokenUsage', icon: 'bar-chart-2', label: 'Token details' }]}
                                defaultValue={{ value: t.labels.conciseProjectSummary, enabled: true, language: shared.playground.defaults.english }}
                                onRunPrompt={runPreview}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt name="summary" mode={PromptMode.RUN} statusItems={STATUS} actions={ACTIONS} />`}
            />

            <Section
                title={t.sections.promptUtils.title}
                description={t.sections.promptUtils.description}
                preview={(
                    <div className="rounded-xl border border-input bg-muted/20 p-4 text-sm font-mono space-y-1 text-foreground">
                        <p><span className="text-muted-foreground">{t.labels.tokenCountComment}</span></p>
                        <p>PromptUtils.countTokens(<span className="text-primary">"Hello world"</span>) <span className="text-muted-foreground">→ {PromptUtils.countTokens('Hello world')}</span></p>
                        <p className="pt-1"><span className="text-muted-foreground">{t.labels.contextWindowComment}</span></p>
                        <p>PromptUtils.modelContextWindow(<span className="text-primary">"openai/gpt-4o"</span>) <span className="text-muted-foreground">→ {PromptUtils.modelContextWindow('openai/gpt-4o')?.toLocaleString()}</span></p>
                        <p className="pt-1"><span className="text-muted-foreground">{t.labels.contextUsageComment}</span></p>
                        <p>PromptUtils.contextPercent(<span className="text-primary">5000</span>, <span className="text-primary">"openai/gpt-4o"</span>) <span className="text-muted-foreground">→ {PromptUtils.contextPercent(5000, 'openai/gpt-4o').toFixed(2)}%</span></p>
                        <p className="pt-1"><span className="text-muted-foreground">{t.labels.costEstimateComment}</span></p>
                        <p>PromptUtils.estimateCost(<span className="text-primary">500</span>, <span className="text-primary">200</span>, <span className="text-primary">"openai/gpt-4o"</span>) <span className="text-muted-foreground">→ ${PromptUtils.estimateCost(500, 200, 'openai/gpt-4o').toFixed(6)}</span></p>
                    </div>
                )}
                code={`import { PromptUtils } from '@llmnative/react';`}
            />

            <Section
                title="ContextMenu: variabili contesto"
                description="Il wrapper esterno con ContextMenu resta supportato. Qui @ apre un menu separato per inserire variabili di contesto nella textarea visibile del PromptRun, mentre i comandi interni continuano a usare il trigger configurato del Prompt."
                preview={(
                    <Form appearance="empty" defaultValues={{
                        projectName: 'Atlas Console',
                        summary: {
                            value: '',
                            prompt: {
                                enabled: 'on',
                                value: 'Write a concise summary for {projectName} in {language}.',
                            },
                        },
                    }}>
                        <div className="max-w-3xl">
                            <ContextMenu trigger="@">
                                <ContextMenu.Heading>Variabili contesto</ContextMenu.Heading>
                                <ContextMenu.Item label="Project name" value="{projectName}" icon="folder" />
                                <ContextMenu.Item label="Industry" value="{industry}" icon="building" />
                                <ContextMenu.Item label="Customer" value="{customerName}" icon="user" />
                                <ContextMenu.Item label="Language" value="{language}" icon="languages" />
                                <Prompt
                                    name="summary"
                                    label={t.labels.summary}
                                    mode={PromptMode.RUN}
                                    minHeight={120}
                                    maxHeight={160}
                                    defaultValue={{
                                        value: 'Write a concise summary for {projectName} in {language}.',
                                        enabled: true,
                                        language: shared.playground.defaults.english,
                                    }}
                                    onRunPrompt={runPreview}
                                />
                            </ContextMenu>
                        </div>
                    </Form>
                )}
                code={`import { ContextMenu } from '@llmnative/react';

<ContextMenu trigger="@">
    <ContextMenu.Heading>Context variables</ContextMenu.Heading>
    <ContextMenu.Item label="Project name" value="{projectName}" />
    <ContextMenu.Item label="Industry" value="{industry}" />
    <ContextMenu.Item label="Language" value="{language}" />
    <Prompt name="summary" mode={PromptMode.RUN} />
</ContextMenu>`}
            />

            <PropDocsTable props={[...liveProps, ...sharedProps]} title={t.propsDocs.title} />
        </PageLayout>
    );
}
