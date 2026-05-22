import React from 'react';
import { Form, Prompt, PromptMode } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const PROMPT_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text' },
    { name: 'label', type: 'string', description: 'Textarea label', control: 'text' },
    { name: 'mode', type: 'PromptMode', default: '"editor"', description: 'Editor mode or live prompt mode', control: 'select', options: ['editor', 'live'] },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks text area as required', control: 'boolean' },
    { name: 'defaultValue', type: 'PromptValue', description: 'Initial prompt config', control: 'json', typeDetails: `{
  value: string;
  enabled: boolean;
  role: string;
  language: string;
  voice: string;
  style: string;
  model: string;
  temperature: number;
}` },
    { name: 'rows', type: 'number', description: 'Textarea rows', control: 'number', min: 2, max: 14 },
    { name: 'onRunPrompt', type: '(prompt, config, data) => Promise<string>', description: 'Custom executor used in live mode' },
    { name: 'renderPromptDisabled', type: '(props) => ReactNode', description: 'Custom disabled renderer in live mode' },
    { name: 'pre', type: 'ReactNode', description: 'Content before prompt editor', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after prompt editor', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'className', type: 'string', description: 'CSS classes on textarea', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROMPT_PROPS,
    showFormRecord: true,
    size: 'lg',
    defaultProps: {
        name: 'summary',
        label: 'Summary',
        mode: PromptMode.EDITOR,
        required: false,
        defaultValue: {
            value: 'Write a concise project summary for {projectName}.',
            enabled: true,
            role: '',
            language: 'English',
            voice: '',
            style: '',
            model: '',
            temperature: 0.7,
        },
        rows: 5,
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <Prompt
                name={p.name || 'summary'}
                label={p.label || undefined}
                mode={p.mode}
                required={p.required}
                defaultValue={p.defaultValue}
                rows={p.rows}
                pre={p.pre || undefined}
                post={p.post || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
                onRunPrompt={async () => 'Generated preview text'}
            />
        </Form>
    ),
};

export default function PromptPage() {
    usePlayground(PLAYGROUND, 'Prompt');

    return (
        <PageLayout title="Prompt" description="Prompt-aware textarea field that can store literal text or AI prompt configuration.">
            <Section
                title="Prompt editor"
                preview={
                    <Form aspect="empty">
                        <Prompt name="summary" label="Summary" rows={5} defaultValue={{ value: 'Write a concise project summary.', enabled: true }} />
                    </Form>
                }
                code={`import { Form, Prompt } from 'react-firestrap';

<Form>
    <Prompt
        name="summary"
        label="Summary"
        rows={5}
        defaultValue={{ value: 'Write a concise project summary.', enabled: true }}
    />
</Form>`}
            />

            <PropDocsTable props={PROMPT_PROPS} />
        </PageLayout>
    );
}
