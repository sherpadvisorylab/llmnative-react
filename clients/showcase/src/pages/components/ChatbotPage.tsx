import React, { useState } from 'react';
import { Chatbot } from '@llmnative/react';
import type { ChatbotSubmitPayload } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';
import { useShowcaseChatbotI18n } from '../../showcase/i18n';

function LastSubmitPreview({ payload }: { payload: ChatbotSubmitPayload | null }) {
    if (!payload) return null;
    return (
        <pre className="mt-2 max-w-xl overflow-x-auto rounded-md border bg-muted/30 p-3 text-xs">
            {JSON.stringify({ ...payload, files: payload.files.map((f) => f.name) }, null, 2)}
        </pre>
    );
}

function BasicComposerDemo() {
    const [value, setValue] = useState('');
    const [last, setLast] = useState<ChatbotSubmitPayload | null>(null);
    const t = useShowcaseChatbotI18n();

    return (
        <div className="w-full max-w-xl">
            <Chatbot
                value={value}
                onChange={setValue}
                placeholder={t.labels.placeholder}
                onSubmit={(payload) => { setLast(payload); setValue(''); }}
            />
            <LastSubmitPreview payload={last} />
        </div>
    );
}

function AttachmentsDemo() {
    const [value, setValue] = useState('');
    const [last, setLast] = useState<ChatbotSubmitPayload | null>(null);

    return (
        <div className="w-full max-w-xl">
            <Chatbot
                value={value}
                onChange={setValue}
                attachments
                onSubmit={(payload) => { setLast(payload); setValue(''); }}
            />
            <LastSubmitPreview payload={last} />
        </div>
    );
}

function ModelPickerDemo() {
    const [value, setValue] = useState('');
    const [model, setModel] = useState('anthropic/claude-sonnet-4-0');
    const [last, setLast] = useState<ChatbotSubmitPayload | null>(null);
    const t = useShowcaseChatbotI18n();

    return (
        <div className="w-full max-w-xl">
            <Chatbot
                value={value}
                onChange={setValue}
                models={[
                    { label: t.labels.modelClaude, value: 'anthropic/claude-sonnet-4-0' },
                    { label: t.labels.modelGpt, value: 'openai/gpt-4o' },
                    { label: t.labels.modelGemini, value: 'gemini/gemini-2.5-pro' },
                ]}
                selectedModel={model}
                onModelChange={setModel}
                onSubmit={(payload) => { setLast(payload); setValue(''); }}
            />
            <LastSubmitPreview payload={last} />
        </div>
    );
}

function RunningAndStopDemo() {
    const [value, setValue] = useState('Long-running turn…');
    const [running, setRunning] = useState(true);
    const t = useShowcaseChatbotI18n();

    return (
        <div className="w-full max-w-xl space-y-3">
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">running, no onStop</p>
                    <Chatbot value={value} onChange={setValue} running disabled onSubmit={() => undefined} />
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">running + onStop</p>
                    <Chatbot value={value} onChange={setValue} running={running} onStop={() => setRunning(false)} onSubmit={() => setRunning(true)} />
                </div>
            </div>
            <p className="text-xs text-muted-foreground">{t.labels.stopHint}</p>
        </div>
    );
}

function DisabledDemo() {
    const [value, setValue] = useState('');
    const t = useShowcaseChatbotI18n();

    return (
        <div className="w-full max-w-xl space-y-2">
            <Chatbot value={value} onChange={setValue} disabled onSubmit={() => undefined} />
            <p className="text-xs text-muted-foreground">{t.labels.disabledHint}</p>
        </div>
    );
}

export default function ChatbotPage() {
    const t = useShowcaseChatbotI18n();

    const propsConfig = React.useMemo<PropDef[]>(() => ([
        { name: 'value', type: 'string', required: true, description: t.propsDocs.items.value.description },
        { name: 'onChange', type: '(value: string) => void', required: true, description: t.propsDocs.items.onChange.description },
        { name: 'onSubmit', type: '(payload: ChatbotSubmitPayload) => void', required: true, description: t.propsDocs.items.onSubmit.description },
        { name: 'placeholder', type: 'string', description: t.propsDocs.items.placeholder.description },
        { name: 'running', type: 'boolean', default: t.propsDocs.items.running.default, description: t.propsDocs.items.running.description },
        { name: 'onStop', type: '() => void', description: t.propsDocs.items.onStop.description },
        { name: 'disabled', type: 'boolean', default: t.propsDocs.items.disabled.default, description: t.propsDocs.items.disabled.description },
        { name: 'attachments', type: 'boolean', default: t.propsDocs.items.attachments.default, description: t.propsDocs.items.attachments.description },
        { name: 'commands', type: 'EditorCommand[]', description: t.propsDocs.items.commands.description },
        { name: 'commandsTrigger', type: 'string', default: t.propsDocs.items.commandsTrigger.default, description: t.propsDocs.items.commandsTrigger.description },
        { name: 'models', type: '{ label: string; value: string }[]', description: t.propsDocs.items.models.description },
        { name: 'selectedModel', type: 'string', description: t.propsDocs.items.selectedModel.description },
        { name: 'onModelChange', type: '(id: string) => void', description: t.propsDocs.items.onModelChange.description },
        { name: 'showSettings', type: 'boolean', default: t.propsDocs.items.showSettings.default, description: t.propsDocs.items.showSettings.description },
        { name: 'minHeight', type: 'number', default: t.propsDocs.items.minHeight.default, description: t.propsDocs.items.minHeight.description },
        { name: 'maxHeight', type: 'number', default: t.propsDocs.items.maxHeight.default, description: t.propsDocs.items.maxHeight.description },
    ]), [t]);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.basicComposer.title}
                description={t.sections.basicComposer.description}
                preview={<BasicComposerDemo />}
                code={`const [value, setValue] = useState('');

<Chatbot
  value={value}
  onChange={setValue}
  onSubmit={(payload) => {
    console.log(payload); // { text, files: [], model }
    setValue('');
  }}
/>`}
            />

            <Section
                title={t.sections.attachments.title}
                description={t.sections.attachments.description}
                preview={<AttachmentsDemo />}
                code={`<Chatbot value={value} onChange={setValue} attachments onSubmit={handleSubmit} />`}
            />

            <Section
                title={t.sections.modelPicker.title}
                description={t.sections.modelPicker.description}
                preview={<ModelPickerDemo />}
                code={`<Chatbot
  value={value}
  onChange={setValue}
  models={[
    { label: 'Claude Sonnet', value: 'anthropic/claude-sonnet-4-0' },
    { label: 'GPT-4o', value: 'openai/gpt-4o' },
  ]}
  selectedModel={selectedModel}
  onModelChange={setSelectedModel}
  onSubmit={handleSubmit}
/>`}
            />

            <Section
                title={t.sections.runningAndStop.title}
                description={t.sections.runningAndStop.description}
                preview={<RunningAndStopDemo />}
                code={`// No onStop — disabled spinner, no abort capability.
<Chatbot value={value} onChange={setValue} running disabled onSubmit={handleSubmit} />

// With onStop — button stays clickable to interrupt.
<Chatbot value={value} onChange={setValue} running onStop={handleStop} onSubmit={handleSubmit} />`}
            />

            <Section
                title={t.sections.disabledState.title}
                description={t.sections.disabledState.description}
                preview={<DisabledDemo />}
                code={`<Chatbot value={value} onChange={setValue} disabled onSubmit={handleSubmit} />`}
            />

            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
