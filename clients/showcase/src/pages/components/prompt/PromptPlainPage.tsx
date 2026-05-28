import React from 'react';
import { Form, Prompt, PromptMode } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import {
    createPromptPlayground,
    createPromptPlaygroundSeed,
    PROMPT_PLAIN_PROPS,
    PROMPT_SHARED_PROPS,
} from './promptDocs';

const PLAYGROUND = createPromptPlayground(
    'plain',
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
                    mode={PromptMode.LIVE}
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
    PROMPT_PLAIN_PROPS,
);

export default function PromptPlainPage() {
    usePlayground(PLAYGROUND, 'PromptPlain');

    return (
        <PageLayout
            title="PromptPlain"
            description="Plain fallback surface used when prompt mode is disabled and the field behaves like a normal textarea."
        >
            <Section
                title="Fallback to plain textarea"
                description="When prompt metadata is disabled, live mode should degrade cleanly to a simple textarea instead of exposing execution controls."
                bare
                preview={(
                    <Form aspect="empty" defaultValues={{ summary: { value: 'A short human-written summary.' } }}>
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label="Summary"
                                mode={PromptMode.LIVE}
                                rows={4}
                                defaultValue={{ value: 'A short human-written summary.', enabled: false }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form aspect="empty">
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.LIVE}
    rows={4}
    defaultValue={{ value: 'A short human-written summary.', enabled: false }}
  />
</Form>`}
            />

            <PropDocsTable props={[...PROMPT_PLAIN_PROPS, ...PROMPT_SHARED_PROPS]} />
        </PageLayout>
    );
}
