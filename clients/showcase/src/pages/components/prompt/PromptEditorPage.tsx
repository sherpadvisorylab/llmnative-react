import React from 'react';
import { Form, Prompt, PromptMode } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import { createPromptPlayground, createPromptPlaygroundSeed, PROMPT_EDITOR_PROPS, PROMPT_SHARED_PROPS } from './promptDocs';

const PLAYGROUND = createPromptPlayground(
    'edit',
    (p, onValuesChange) => (
        <Form
            appearance="empty"
            defaultValues={createPromptPlaygroundSeed(p.defaultValue as Record<string, unknown> | undefined)}
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
    PROMPT_EDITOR_PROPS,
);

export default function PromptEditorPage() {
    usePlayground(PLAYGROUND, 'PromptEdit');

    return (
        <PageLayout
            title="PromptEdit"
            description="Author and store the prompt template. The enabled Switch toggles between prompt mode (AI execution) and plain text mode."
        >
            {/* ── Author prompt text ── */}
            <Section
                title="Author prompt text"
                description="In edit mode the textarea stores the raw template. The enabled Switch (top-right) toggles prompt metadata on/off. When enabled, the field name is prefixed with 'Prompt:' and the availability notice appears if no AI is configured."
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            summary: {
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a concise project summary for {projectName}.',
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
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

            {/* ── Disabled — plain textarea ── */}
            <Section
                title="Disabled — plain textarea"
                description="When enabled is false the prompt engine is off. The field stores plain text and the AI toggle and availability notice are hidden. Use this when some records need AI and others don't."
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            description: {
                                value: 'A short human-written description without AI assistance.',
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="description"
                                label="Description"
                                mode={PromptMode.EDIT}
                                rows={4}
                                defaultValue={{
                                    value: 'A short human-written description without AI assistance.',
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

            {/* ── AI unavailable notice ── */}
            <Section
                title="AI unavailable notice"
                description="When the component is in enabled state but no AI provider is configured, a warning appears below the textarea. Use renderAIUnavailable to replace it with custom UI."
                bare
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{
                            summary: {
                                prompt: {
                                    enabled: 'on',
                                    value: 'Write a summary for {projectName}.',
                                },
                            },
                        }}
                    >
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label="Summary"
                                mode={PromptMode.EDIT}
                                rows={4}
                                defaultValue={{ value: 'Write a summary for {projectName}.', enabled: true }}
                                renderAIUnavailable={({ reason }) => (
                                    <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                        Custom notice — {reason || 'AI provider not configured'}
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

            <PropDocsTable props={[...PROMPT_EDITOR_PROPS, ...PROMPT_SHARED_PROPS]} />
        </PageLayout>
    );
}
