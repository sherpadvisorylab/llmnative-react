import React from 'react';
import { Form, Prompt, PromptMode } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import {
    createPromptPlayground,
    createPromptPlaygroundSeed,
    executePromptPreview,
    PROMPT_LIVE_PROPS,
    PROMPT_SHARED_PROPS,
} from './promptDocs';

const PLAYGROUND = createPromptPlayground(
    'live',
    (p, onValuesChange) => (
        <Form
            aspect="empty"
            defaultValues={createPromptPlaygroundSeed(p.defaultValue)}
            onChange={onValuesChange}
        >
            <Prompt
                name={p.name || 'summary'}
                label={p.label || undefined}
                mode={PromptMode.LIVE}
                required={p.required}
                defaultValue={p.defaultValue}
                rows={p.rows}
                pre={p.pre || undefined}
                post={p.post || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
                onRunPrompt={executePromptPreview}
            />
        </Form>
    ),
    PROMPT_LIVE_PROPS,
);

export default function PromptLivePage() {
    usePlayground(PLAYGROUND, 'PromptLive');

    return (
        <PageLayout
            title="PromptLive"
            description="Execute the stored prompt against the active form record and write the generated result back into the same field."
        >
            <Section
                title="Run against form context"
                description="Live mode is useful when the prompt already exists and the user needs generated content from the current record."
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
                                mode={PromptMode.LIVE}
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
    mode={PromptMode.LIVE}
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
