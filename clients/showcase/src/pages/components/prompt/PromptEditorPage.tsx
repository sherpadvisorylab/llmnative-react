import React from 'react';
import { Form, Prompt, PromptMode } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import { createPromptEditorProps, createPromptPlayground, createPromptPlaygroundSeed, createPromptSharedProps } from './promptDocs';
import { useShowcasePromptEditorI18n, useShowcasePromptSharedI18n } from '../../../showcase/i18n';

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
                        rows={typeof p.rows === 'number' ? p.rows : undefined}
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
                    <Form
                        appearance="empty"
                        defaultValues={{
                            summary: {
                                prompt: {
                                    enabled: 'on',
                                    value: t.labels.conciseProjectSummary,
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label={t.labels.summary}
                                mode={PromptMode.EDIT}
                                rows={5}
                                defaultValue={{
                                    value: t.labels.conciseProjectSummary,
                                    enabled: true,
                                }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form appearance="empty">
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.EDIT}
    rows={5}
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
                    <Form
                        appearance="empty"
                        defaultValues={{
                            description: {
                                value: t.labels.humanWrittenDescription,
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="description"
                                label={t.labels.descriptionField}
                                mode={PromptMode.EDIT}
                                rows={4}
                                defaultValue={{
                                    value: t.labels.humanWrittenDescription,
                                    enabled: false,
                                }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt
  name="description"
  label="Description"
  mode={PromptMode.EDIT}
  rows={4}
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
                    <Form
                        appearance="empty"
                        defaultValues={{
                            summary: {
                                prompt: {
                                    enabled: 'on',
                                    value: t.labels.shortProjectSummary,
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label={t.labels.summary}
                                mode={PromptMode.EDIT}
                                rows={4}
                                defaultValue={{ value: t.labels.shortProjectSummary, enabled: true }}
                                renderAIUnavailable={({ reason }) => (
                                    <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                        {t.labels.customNoticePrefix} {reason || t.labels.aiProviderNotConfigured}
                                    </div>
                                )}
                            />
                        </div>
                    </Form>
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

            <PropDocsTable props={[...editorProps, ...sharedProps]} title={t.propsDocs.title} />
        </PageLayout>
    );
}
