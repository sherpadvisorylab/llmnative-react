import React from 'react';
import { ContextMenu, Form, Prompt, PromptMode } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import { createPromptEditorProps, createPromptPlayground, createPromptPlaygroundSeed, createPromptSharedProps } from './promptDocs';
import { useShowcasePromptEditorI18n, useShowcasePromptSharedI18n } from '../../../showcase/i18n';

function isPromptEnabled(value: unknown): boolean {
    return value === 'on' || value === true || value === 'true' || value === 1;
}

function StablePromptExample({
    defaultValues,
    promptFieldName,
    minHeightClassName,
    children,
}: {
    defaultValues: Record<string, unknown>;
    promptFieldName: string;
    minHeightClassName?: string;
    children: React.ReactNode;
}) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const lastEnabledRef = React.useRef<boolean | null>(null);

    return (
        <Form
            appearance="empty"
            defaultValues={defaultValues}
            onRecordChange={(record) => {
                const field = record?.[promptFieldName];
                const nextEnabled = isPromptEnabled(
                    field && typeof field === 'object' && !Array.isArray(field)
                        ? (field as { prompt?: { enabled?: unknown } }).prompt?.enabled
                        : undefined
                );

                if (lastEnabledRef.current === null) {
                    lastEnabledRef.current = nextEnabled;
                    return;
                }

                if (lastEnabledRef.current !== nextEnabled) {
                    lastEnabledRef.current = nextEnabled;
                    requestAnimationFrame(() => {
                        containerRef.current?.scrollIntoView({ block: 'nearest' });
                    });
                }
            }}
        >
            <div ref={containerRef} className={minHeightClassName ? `max-w-3xl ${minHeightClassName}` : 'max-w-3xl'}>
                {children}
            </div>
        </Form>
    );
}

export default function PromptEditorPage() {
    const t = useShowcasePromptEditorI18n();
    const shared = useShowcasePromptSharedI18n();
    const editorProps = React.useMemo(() => createPromptEditorProps(shared), [shared]);
    const sharedProps = React.useMemo(() => createPromptSharedProps(shared), [shared]);

    const playground = React.useMemo(() => createPromptPlayground(
        shared,
        'edit',
        (p, onValuesChange) => (
            <Form
                appearance="empty"
                defaultValues={createPromptPlaygroundSeed(shared, p.defaultValue as Record<string, unknown> | undefined)}
                onChange={onValuesChange}
            >
                <div className="max-w-3xl">
                    <Prompt
                        name={typeof p.name === 'string' ? p.name : 'summary'}
                        label={typeof p.label === 'string' ? p.label : undefined}
                        mode={PromptMode.EDIT}
                        required={Boolean(p.required)}
                        defaultValue={p.defaultValue as Parameters<typeof Prompt>[0]['defaultValue']}
                        minHeight={typeof p.minHeight === 'number' ? p.minHeight : undefined}
                        maxHeight={typeof p.maxHeight === 'number' ? p.maxHeight : undefined}
                        before={p.before ? String(p.before) : undefined}
                        after={p.after ? String(p.after) : undefined}
                        className={typeof p.className === 'string' ? p.className : undefined}
                        wrapperClassName={typeof p.wrapperClassName === 'string' ? p.wrapperClassName : undefined}
                    />
                </div>
            </Form>
        ),
        editorProps,
    ), [editorProps, shared]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.authorPromptText.title}
                description={t.sections.authorPromptText.description}
                bare
                preview={(
                    <StablePromptExample
                        promptFieldName="summaryAuthor"
                        defaultValues={{
                            summaryAuthor: {
                                prompt: {
                                    enabled: 'on',
                                    value: t.labels.conciseProjectSummary,
                                },
                            },
                        }}
                    >
                        <Prompt
                            name="summaryAuthor"
                            label={t.labels.summary}
                            mode={PromptMode.EDIT}
                            minHeight={140}
                            maxHeight={200}
                            defaultValue={{
                                value: t.labels.conciseProjectSummary,
                                enabled: true,
                            }}
                        />
                    </StablePromptExample>
                )}
                code={`<Form appearance="empty">
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.EDIT}
    minHeight={140}
    maxHeight={200}
    defaultValue={{
      value: 'Write a concise project summary for {projectName}.',
      enabled: true,
    }}
  />
</Form>`}
            />

            <Section
                title={t.sections.disabledPlainTextarea.title}
                description={t.sections.disabledPlainTextarea.description}
                bare
                preview={(
                    <StablePromptExample
                        promptFieldName="descriptionPlain"
                        defaultValues={{
                            descriptionPlain: {
                                value: t.labels.humanWrittenDescription,
                            },
                        }}
                    >
                        <Prompt
                            name="descriptionPlain"
                            label={t.labels.descriptionField}
                            mode={PromptMode.EDIT}
                            minHeight={120}
                            maxHeight={160}
                            defaultValue={{
                                value: t.labels.humanWrittenDescription,
                                enabled: false,
                            }}
                        />
                    </StablePromptExample>
                )}
                code={`<Prompt
  name="description"
  label="Description"
  mode={PromptMode.EDIT}
  minHeight={120}
  maxHeight={160}
  defaultValue={{
    value: 'A short human-written description without AI assistance.',
    enabled: false,
  }}
/>`}
            />

            <Section
                title={t.sections.aiUnavailableNotice.title}
                description={t.sections.aiUnavailableNotice.description}
                bare
                preview={(
                    <StablePromptExample
                        promptFieldName="summaryNotice"
                        minHeightClassName="min-h-[18rem]"
                        defaultValues={{
                            summaryNotice: {
                                prompt: {
                                    enabled: 'on',
                                    value: t.labels.shortProjectSummary,
                                },
                            },
                        }}
                    >
                        <Prompt
                            name="summaryNotice"
                            label={t.labels.summary}
                            mode={PromptMode.EDIT}
                            minHeight={120}
                            maxHeight={160}
                            defaultValue={{ value: t.labels.shortProjectSummary, enabled: true }}
                            renderAIUnavailable={({ reason }) => (
                                <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                    {t.labels.customNoticePrefix} {reason || t.labels.aiProviderNotConfigured}
                                </div>
                            )}
                        />
                    </StablePromptExample>
                )}
                code={`<Prompt
  name="summary"
  label="Summary"
  mode={PromptMode.EDIT}
  defaultValue={{ value: 'Write a summary for {projectName}.', enabled: true }}
  renderAIUnavailable={({ reason }) => (
    <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
      {reason || 'AI provider not configured'}
    </div>
  )}
/>`}
            />

            <Section
                title="ContextMenu: variabili template"
                description="Digita { per aprire un menu che inserisce variabili direttamente nel prompt template."
                bare
                preview={(
                    <StablePromptExample
                        promptFieldName="templateSummary"
                        minHeightClassName="min-h-[20rem]"
                        defaultValues={{
                            templateSummary: {
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a concise summary for {projectName} in {language}.',
                                },
                            },
                        }}
                    >
                        <ContextMenu trigger="{">
                            <ContextMenu.Heading>Variabili template</ContextMenu.Heading>
                            <ContextMenu.Item label="Project name" value="{projectName}" icon="folder" />
                            <ContextMenu.Item label="Industry" value="{industry}" icon="building" />
                            <ContextMenu.Item label="Language" value="{language}" icon="languages" />
                            <ContextMenu.Item label="Tone" value="{tone}" icon="pen" />
                            <ContextMenu.Item label="Date" value="{date}" icon="calendar" />
                            <Prompt
                                name="templateSummary"
                                label={t.labels.summary}
                                mode={PromptMode.EDIT}
                                minHeight={140}
                                maxHeight={200}
                                defaultValue={{
                                    value: 'Write a concise summary for {projectName} in {language}.',
                                    enabled: true,
                                }}
                            />
                        </ContextMenu>
                    </StablePromptExample>
                )}
                code={`import { ContextMenu } from '@llmnative/react';

<ContextMenu trigger="{">
    <ContextMenu.Heading>Variables</ContextMenu.Heading>
    <ContextMenu.Item label="Project name" value="{projectName}" />
    <ContextMenu.Item label="Language" value="{language}" />
    <ContextMenu.Item label="Date" value="{date}" />
    <Prompt name="template" mode={PromptMode.EDIT} />
</ContextMenu>`}
            />

            <PropDocsTable props={[...editorProps, ...sharedProps]} title={t.propsDocs.title} />
        </PageLayout>
    );
}
