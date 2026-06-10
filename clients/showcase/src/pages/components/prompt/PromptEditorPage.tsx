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
            defaultValues={createPromptPlaygroundSeed(p.defaultValue)}
            onChange={onValuesChange}
        >
            <div className="max-w-3xl">
                <Prompt
                    name={p.name || 'summary'}
                    label={p.label || undefined}
                    mode={PromptMode.EDIT}
                    required={p.required}
                    defaultValue={p.defaultValue}
                    rows={p.rows}
                    before={p.pre || undefined}
                    after={p.post || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
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
            description="Author and maintain the stored prompt template with a dedicated edit surface."
        >
            <Section
                title="Author prompt text"
                description="Edit mode is the authoring surface: it lets the user store prompt text, switch between plain text and prompt metadata, and see when AI execution is unavailable."
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
                                label="Summary prompt"
                                mode={PromptMode.EDIT}
                                rows={5}
                                defaultValue={{ value: 'Write a concise project summary for {projectName}.', enabled: true }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form appearance="empty">
  <Prompt
    name="summary"
    label="Summary prompt"
    mode={PromptMode.EDIT}
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
