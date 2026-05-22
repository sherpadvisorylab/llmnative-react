import React from 'react';
import { AssistantAI, Form } from '@ash/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const ASSISTANT_AI_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Card title and field name', control: 'text' },
    { name: 'promptTopic', type: 'PromptTopic', required: true, description: 'Prompt template and label', control: 'json', typeDetails: `{
  prompt: string;
  label: string;
}` },
    { name: 'configVariables', type: 'ConfigVariables', required: true, description: 'Variables injected into the prompt template', control: 'json', typeDetails: `{
  lang: string;
  voice: string;
  style: string;
  limit: string | number;
}` },
    { name: 'initialValue', type: 'string', description: 'Initial user input', control: 'text' },
    { name: 'children', type: 'ReactNode', description: 'Optional custom content inside the card' },
    { name: 'onChange', type: '(e: any) => void', required: true, description: 'Called when a response is selected' },
    { name: 'viewMode', type: '"list" | "carousel"', default: '"list"', description: 'Response presentation mode', control: 'select', options: ['list', 'carousel'] },
    { name: 'autoStart', type: 'boolean', default: 'false', description: 'Runs the request immediately when initialValue exists', control: 'boolean' },
    { name: 'onReset', type: '() => void', description: 'Called before a new request starts' },
    { name: 'pre', type: 'ReactNode', description: 'Content before the assistant', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after the assistant', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on Card', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: ASSISTANT_AI_PROPS,
    size: 'lg',
    defaultProps: {
        name: 'Title assistant',
        promptTopic: { prompt: 'Write 3 short titles about {keyword}.', label: 'Keyword' },
        configVariables: { lang: 'English', voice: 'friendly', style: 'concise', limit: '3' },
        initialValue: 'React dashboards',
        viewMode: 'list',
        autoStart: false,
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p) => (
        <Form aspect="empty">
            <AssistantAI
                name={p.name || 'Title assistant'}
                promptTopic={p.promptTopic}
                configVariables={p.configVariables}
                initialValue={p.initialValue || undefined}
                viewMode={p.viewMode || 'list'}
                autoStart={p.autoStart}
                onChange={() => undefined}
                pre={p.pre || undefined}
                post={p.post || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
            />
        </Form>
    ),
};

export default function AssistantAIPage() {
    usePlayground(PLAYGROUND, 'AssistantAI');

    return (
        <PageLayout title="AssistantAI" description="AI-assisted picker UI for generating and selecting content from an AI response.">
            <Section
                title="Manual assistant"
                description="autoStart is disabled in the showcase to avoid network calls until the user explicitly runs it."
                preview={
                    <Form aspect="empty">
                        <AssistantAI
                            name="Title assistant"
                            promptTopic={{ prompt: 'Write 3 short titles about {keyword}.', label: 'Keyword' }}
                            configVariables={{ lang: 'English', voice: 'friendly', style: 'concise', limit: '3' }}
                            initialValue="React dashboards"
                            onChange={() => undefined}
                        />
                    </Form>
                }
                code={`import { AssistantAI, Form } from '@ash/react';

<Form>
    <AssistantAI
        name="Title assistant"
        promptTopic={{ prompt: 'Write 3 short titles about {keyword}.', label: 'Keyword' }}
        configVariables={{ lang: 'English', voice: 'friendly', style: 'concise', limit: '3' }}
        initialValue="React dashboards"
        onChange={(value) => console.log(value)}
    />
</Form>`}
            />

            <PropDocsTable props={ASSISTANT_AI_PROPS} />
        </PageLayout>
    );
}
