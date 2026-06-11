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
            appearance="empty"
            defaultValues={createPromptPlaygroundSeed(p.defaultValue as Record<string, unknown> | undefined)}
            onChange={onValuesChange}
        >
            <div className="max-w-3xl">
                <Prompt
                    name={typeof p.name === 'string' ? p.name : 'summary'}
                    label={typeof p.label === 'string' ? p.label : undefined}
                    mode={PromptMode.RUN}
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
    PROMPT_PLAIN_PROPS,
);

export default function PromptPlainPage() {
    usePlayground(PLAYGROUND, 'PromptPlain');

    return (
        <PageLayout
            title="PromptPlain"
            description="Plain fallback surface used when prompt mode is disabled. The component degrades to a standard textarea without any AI execution controls."
        >
            {/* ── Fallback to plain textarea ── */}
            <Section
                title="Fallback to plain textarea"
                description="When enabled is false (or missing) in run mode, the component renders a plain textarea. No gear, no footer bar, no run button — just a clean field for manually written content."
                bare
                preview={(
                    <Form appearance="empty" defaultValues={{ summary: { value: 'A short human-written summary.' } }}>
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label="Summary"
                                mode={PromptMode.RUN}
                                rows={4}
                                defaultValue={{ value: 'A short human-written summary.', enabled: false }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form appearance="empty">
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.RUN}
    rows={4}
    defaultValue={{ value: 'A short human-written summary.', enabled: false }}
  />
</Form>`}
            />

            {/* ── Custom renderFallback ── */}
            <Section
                title="Custom renderFallback"
                description="renderFallback replaces the default plain textarea entirely. Receive the same field props (name, label, required, onChange) and render whatever you need — a rich text editor, a read-only display, anything."
                bare
                preview={(
                    <Form appearance="empty" defaultValues={{ notes: { value: 'Agreed to follow up in two weeks.' } }}>
                        <div className="max-w-3xl">
                            <Prompt
                                name="notes"
                                label="Notes"
                                mode={PromptMode.RUN}
                                rows={4}
                                defaultValue={{ value: 'Agreed to follow up in two weeks.', enabled: false }}
                                renderFallback={({ name, label }) => (
                                    <div className="space-y-1.5">
                                        {label && (
                                            <p className="text-sm font-medium text-foreground">{label}</p>
                                        )}
                                        <div className="rounded-xl border border-dashed border-input bg-muted/20 px-4 py-3 text-sm text-muted-foreground italic">
                                            Custom fallback for field "{name}" — render a rich editor, read-only card, or anything here.
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt
  name="notes"
  label="Notes"
  mode={PromptMode.RUN}
  defaultValue={{ value: 'Agreed to follow up in two weeks.', enabled: false }}
  renderFallback={({ name, label }) => (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium">{label}</p>}
      <MyRichTextEditor name={name} />
    </div>
  )}
/>`}
            />

            <PropDocsTable props={[...PROMPT_PLAIN_PROPS, ...PROMPT_SHARED_PROPS]} />
        </PageLayout>
    );
}
