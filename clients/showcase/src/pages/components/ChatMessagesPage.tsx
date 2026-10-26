import React from 'react';
import { ChatMarkdown, ChatQuestions, ChatReasoning } from '@llmnative/react';
import type { ChatQuestion, ChatQuestionAnswer } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseChatMessagesI18n } from '../../showcase/i18n';

/** Streams `text` a few characters at a time, as a model would. */
function useStream(text: string, step = 5, every = 30) {
    // null: the whole text, not streaming.
    const [length, setLength] = React.useState<number | null>(null);
    const [run, setRun] = React.useState(0);
    React.useEffect(() => {
        if (run === 0) return;
        setLength(0);
        const timer = window.setInterval(() => {
            setLength((current) => {
                const next = (current ?? 0) + step;
                if (next < text.length) return next;
                window.clearInterval(timer);
                return null;
            });
        }, every);
        return () => window.clearInterval(timer);
    }, [run, text, step, every]);
    return {
        shown: length === null ? text : text.slice(0, length),
        streaming: length !== null,
        replay: () => setRun((n) => n + 1),
    };
}

export default function ChatMessagesPage() {
    const t = useShowcaseChatMessagesI18n();
    const markdown = useStream(t.demo.markdown);
    const reasoning = useStream(t.demo.reasoning, 3, 40);
    const [answers, setAnswers] = React.useState<ChatQuestionAnswer[] | null>(null);
    const [formKey, setFormKey] = React.useState(0);

    const questions = React.useMemo<ChatQuestion[]>(() => [
        {
            id: 'database',
            header: t.demo.q1Header,
            question: t.demo.q1Question,
            options: [
                { label: t.demo.q1Option1, description: t.demo.q1Option1Description },
                { label: t.demo.q1Option2, description: t.demo.q1Option2Description },
            ],
            recommended: 0,
        },
        {
            id: 'features',
            header: t.demo.q2Header,
            question: t.demo.q2Question,
            options: [{ label: t.demo.q2Option1 }, { label: t.demo.q2Option2 }, { label: t.demo.q2Option3 }],
            multiple: true,
        },
    ], [t]);

    const markdownProps = React.useMemo<PropDef[]>(() => [
        { name: 'content', type: 'string', required: true, description: t.propsDocs.markdown.content.description, control: 'textarea' },
        { name: 'streaming', type: 'boolean', default: 'false', description: t.propsDocs.markdown.streaming.description, control: 'boolean' },
        { name: 'tone', type: "'default' | 'muted'", default: "'default'", description: t.propsDocs.markdown.tone.description, control: 'select', options: ['default', 'muted'] },
        { name: 'highlight', type: 'boolean', default: 'true', description: t.propsDocs.markdown.highlight.description, control: 'boolean' },
        { name: 'onLinkClick', type: '(href, event) => void', description: t.propsDocs.markdown.onLinkClick.description },
        { name: 'components', type: 'Components', description: t.propsDocs.markdown.components.description },
        { name: 'classNames', type: 'ChatMarkdownClassNames', description: t.propsDocs.markdown.classNames.description },
    ], [t]);

    const reasoningProps = React.useMemo<PropDef[]>(() => [
        { name: 'content', type: 'string', required: true, description: t.propsDocs.reasoning.content.description },
        { name: 'streaming', type: 'boolean', default: 'false', description: t.propsDocs.reasoning.streaming.description },
        { name: 'duration', type: 'number', description: t.propsDocs.reasoning.duration.description },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: t.propsDocs.reasoning.defaultOpen.description },
        { name: 'open', type: 'boolean', description: t.propsDocs.reasoning.open.description },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: t.propsDocs.reasoning.onOpenChange.description },
        { name: 'label', type: 'ReactNode', description: t.propsDocs.reasoning.label.description },
        { name: 'icon', type: 'string', default: "'brain'", description: t.propsDocs.reasoning.icon.description },
        { name: 'classNames', type: 'ChatReasoningClassNames', description: t.propsDocs.reasoning.classNames.description },
    ], [t]);

    const questionsProps = React.useMemo<PropDef[]>(() => [
        { name: 'questions', type: 'ChatQuestion[]', required: true, description: t.propsDocs.questions.questions.description, typeDetails: '{ id?, header?, question, options?: { label, description? }[], multiple?, recommended?: number | string, custom? }' },
        { name: 'onSubmit', type: '(answers: ChatQuestionAnswer[]) => void | Promise<unknown>', description: t.propsDocs.questions.onSubmit.description, typeDetails: '{ id?, header?, values: string[] }' },
        { name: 'numbering', type: "'numeric' | 'alpha'", description: t.propsDocs.questions.numbering.description },
        { name: 'allowOther', type: 'boolean', default: 'true', description: t.propsDocs.questions.allowOther.description },
        { name: 'answers', type: 'ChatQuestionAnswer[]', description: t.propsDocs.questions.answers.description },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.questions.disabled.description },
        { name: 'autoFocus', type: 'boolean', default: 'false', description: t.propsDocs.questions.autoFocus.description },
        { name: 'submitLabel', type: 'string', description: t.propsDocs.questions.submitLabel.description },
        { name: 'classNames', type: 'ChatQuestionsClassNames', description: t.propsDocs.questions.classNames.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        props: markdownProps,
        defaultProps: { content: t.demo.markdown, streaming: false, tone: 'default', highlight: true },
        render: (p) => (
            <ChatMarkdown content={p.content ?? ''} streaming={Boolean(p.streaming)} tone={p.tone} highlight={p.highlight !== false} />
        ),
    }), [markdownProps, t]);

    usePlayground(playground, t.playground.title);

    const replayButton = (onClick: () => void, running: boolean) => (
        <button type="button" onClick={onClick} disabled={running} className="btn btn-outline-primary btn-sm">
            {running ? t.demo.streaming : t.demo.replay}
        </button>
    );

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.markdown.title}
                description={t.sections.markdown.description}
                preview={(
                    <div className="flex w-full flex-col gap-3">
                        <div>{replayButton(markdown.replay, markdown.streaming)}</div>
                        <div className="w-full max-w-sm rounded-lg border bg-card p-3">
                            <ChatMarkdown content={markdown.shown} streaming={markdown.streaming} />
                        </div>
                    </div>
                )}
                code={`import { ChatMarkdown } from '@llmnative/react';

// streaming closes what the end of the text left open
// (a code fence, a table header, **bold**), so nothing jumps.
<ChatMarkdown content={message.text} streaming={message.running} />`}
            />

            <Section
                title={t.sections.reasoning.title}
                description={t.sections.reasoning.description}
                preview={(
                    <div className="flex w-full flex-col gap-3">
                        <div>{replayButton(reasoning.replay, reasoning.streaming)}</div>
                        <div className="w-full max-w-sm rounded-lg border bg-card p-3">
                            <ChatReasoning content={reasoning.shown} streaming={reasoning.streaming} duration={12} />
                            <ChatMarkdown content={t.demo.reasoningAnswer} />
                        </div>
                    </div>
                )}
                code={`import { ChatReasoning } from '@llmnative/react';

<ChatReasoning content={message.reasoning} streaming={message.thinking} duration={12} />`}
            />

            <Section
                title={t.sections.questions.title}
                description={t.sections.questions.description}
                preview={(
                    <div className="flex w-full flex-col gap-3">
                        <div className="w-full max-w-md">
                            <ChatQuestions key={formKey} questions={questions} onSubmit={(given) => setAnswers(given)} />
                        </div>
                        {answers && (
                            <div className="flex w-full max-w-md flex-col gap-2">
                                <pre className="overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs">{JSON.stringify(answers, null, 2)}</pre>
                                <div>
                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { setAnswers(null); setFormKey((k) => k + 1); }}>
                                        {t.demo.again}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                code={`import { ChatQuestions } from '@llmnative/react';

<ChatQuestions
  questions={[
    { id: 'database', header: 'Database', question: 'Which database?', recommended: 0,
      options: [{ label: 'Postgres', description: 'Relational' }, { label: 'SQLite' }] },
    { id: 'features', header: 'Features', question: 'Which features?', multiple: true,
      options: [{ label: 'Login' }, { label: 'Search' }, { label: 'Export' }] },
  ]}
  onSubmit={(answers) => send(answers)} // [{ id, header, values: ['Postgres'] }, …]
/>`}
            />

            <Section
                title={t.sections.answered.title}
                description={t.sections.answered.description}
                preview={(
                    <div className="w-full max-w-md">
                        <ChatQuestions
                            questions={questions}
                            answers={[{ id: 'database', values: [t.demo.q1Option1] }, { id: 'features', values: [t.demo.q2Option1, t.demo.q2Option3] }]}
                        />
                    </div>
                )}
                code={`<ChatQuestions questions={questions} answers={message.answers} />`}
            />

            <PropDocsTable props={markdownProps} title={`ChatMarkdown · ${t.propsTitle}`} />
            <PropDocsTable props={reasoningProps} title={`ChatReasoning · ${t.propsTitle}`} />
            <PropDocsTable props={questionsProps} title={`ChatQuestions · ${t.propsTitle}`} />
        </PageLayout>
    );
}
