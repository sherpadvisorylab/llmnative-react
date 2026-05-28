import React from 'react';
import { Form, Prompt } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import { createPromptPlayground, createPromptPlaygroundSeed, PROMPT_EDITOR_PROPS, PROMPT_SHARED_PROPS } from './promptDocs';

const PLAYGROUND = createPromptPlayground(
    'editor',
    (p, onValuesChange) => (
        <Form
            aspect="empty"
            defaultValues={createPromptPlaygroundSeed(p.defaultValue)}
            onChange={onValuesChange}
        >
            <div className="max-w-3xl">
                <Prompt
                    name={p.name || 'summary'}
                    label={p.label || undefined}
                    required={p.required}
                    defaultValue={p.defaultValue}
                    rows={p.rows}
                    pre={p.pre || undefined}
                    post={p.post || undefined}
                    className={p.className || undefined}
                    wrapClass={p.wrapClass || undefined}
                />
            </div>
        </Form>
    ),
    PROMPT_EDITOR_PROPS,
);

export default function PromptEditorPage() {
    usePlayground(PLAYGROUND, 'PromptEditor');

    return (
        <PageLayout
            title="PromptEditor"
            description="Author and maintain the stored prompt template with a dedicated editor surface."
        >
            <Section
                title="Author prompt text"
                description="Editor mode is the authoring surface: it lets the user store prompt text and switch between plain text and prompt metadata."
                bare
                preview={(
                    <Form
                        aspect="empty"
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
                                label="Summary prompt"
                                rows={5}
                                defaultValue={{ value: 'Write a concise project summary for {projectName}.', enabled: true }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form aspect="empty">
  <Prompt
    name="summary"
    label="Summary prompt"
    rows={5}
    defaultValue={{
      value: 'Write a concise project summary for {projectName}.',
      enabled: true,
    }}
  />
</Form>`}
            />

            <PropDocsTable props={[...PROMPT_EDITOR_PROPS, ...PROMPT_SHARED_PROPS]} />
        </PageLayout>
    );
}
