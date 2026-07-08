import React from 'react';
import { ContextMenu, Form, Prompt, PromptMode } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import { createPromptPlainProps, createPromptPlayground, createPromptPlaygroundSeed, createPromptSharedProps } from './promptDocs';
import { useShowcasePromptPlainI18n, useShowcasePromptSharedI18n } from '../../../showcase/i18n';

export default function PromptPlainPage() {
    const t = useShowcasePromptPlainI18n();
    const shared = useShowcasePromptSharedI18n();
    const plainProps = React.useMemo(() => createPromptPlainProps(shared), [shared]);
    const sharedProps = React.useMemo(() => createPromptSharedProps(shared), [shared]);
    const playground = React.useMemo(() => createPromptPlayground(
        shared,
        'plain',
        (p, onValuesChange) => (
            <Form
                appearance="empty"
                defaultValues={createPromptPlaygroundSeed(shared, p.defaultValue as Record<string, unknown> | undefined)}
                onChange={onValuesChange}
            >
                <div className="max-w-3xl">
                    <Prompt
                        name={typeof p.name === 'string' ? p.name : 'summary'}
                        label={typeof p.label === 'string' ? p.label : undefined}
                        mode={PromptMode.RUN}
                        required={Boolean(p.required)}
                        defaultValue={p.defaultValue as Parameters<typeof Prompt>[0]['defaultValue']}
                        minHeight={typeof p.minHeight === 'number' ? p.minHeight : undefined}
                        maxHeight={typeof p.maxHeight === 'number' ? p.maxHeight : undefined}
                        before={p.before ? String(p.before) : undefined}
                        after={p.after ? String(p.after) : undefined}
                        className={typeof p.className === 'string' ? p.className : undefined}
                        wrapperClassName={typeof p.wrapperClassName === 'string' ? p.wrapperClassName : undefined}
                    />
                </div>
            </Form>
        ),
        plainProps,
    ), [plainProps, shared]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.fallbackToPlainTextarea.title}
                description={t.sections.fallbackToPlainTextarea.description}
                bare
                preview={(
                    <Form appearance="empty" defaultValues={{ summary: { value: t.labels.shortHumanSummary } }}>
                        <div className="max-w-3xl">
                            <Prompt
                                name="summary"
                                label={t.labels.summary}
                                mode={PromptMode.RUN}
                                minHeight={120}
                                maxHeight={160}
                                defaultValue={{ value: t.labels.shortHumanSummary, enabled: false }}
                            />
                        </div>
                    </Form>
                )}
                code={`<Form appearance="empty"><Prompt name="summary" mode={PromptMode.RUN} /></Form>`}
            />

            <Section
                title={t.sections.customRenderFallback.title}
                description={t.sections.customRenderFallback.description}
                bare
                preview={(
                    <Form appearance="empty" defaultValues={{ notes: { value: t.labels.followUpTwoWeeks } }}>
                        <div className="max-w-3xl">
                            <Prompt
                                name="notes"
                                label={t.labels.notes}
                                mode={PromptMode.RUN}
                                minHeight={120}
                                maxHeight={160}
                                defaultValue={{ value: t.labels.followUpTwoWeeks, enabled: false }}
                                renderFallback={({ name, label }) => (
                                    <div className="space-y-1.5">
                                        {label && (
                                            <p className="text-sm font-medium text-foreground">{label}</p>
                                        )}
                                        <div className="rounded-xl border border-dashed border-input bg-muted/20 px-4 py-3 text-sm text-muted-foreground italic">
                                            {t.labels.customFallbackForField} "{name}" - {t.labels.customFallbackSuffix}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </Form>
                )}
                code={`<Prompt name="notes" mode={PromptMode.RUN} renderFallback={({ name }) => <MyRichTextEditor name={name} />} />`}
            />

            <Section
                title="ContextMenu: scorciatoie testo"
                description="Il wrapper esterno con ContextMenu resta permesso anche sui fallback plain. Qui il menu slash e fornito dal wrapper, non dai commands interni di Prompt."
                preview={(
                    <div className="max-w-3xl">
                        <Form appearance="empty" defaultValues={{ notes: { value: '' } }}>
                            <ContextMenu trigger="/">
                                <ContextMenu.Heading>Blocchi testo</ContextMenu.Heading>
                                <ContextMenu.Item label="Saluto formale" value="Dear Sir/Madam," icon="greeting" />
                                <ContextMenu.Item label="Follow-up" value="Follow up with the customer in 2 weeks." icon="clock" />
                                <ContextMenu.Item label="Chiusura" value="Best regards" icon="pen" />
                                <ContextMenu.Separator />
                                <ContextMenu.Heading>Formattazione</ContextMenu.Heading>
                                <ContextMenu.Item label="Titolo" value="# " icon="heading" />
                                <ContextMenu.Item label="Elenco" value="- " icon="list" />
                                <Prompt
                                    name="notes"
                                    label={t.labels.notes}
                                    mode={PromptMode.RUN}
                                    minHeight={120}
                                    maxHeight={160}
                                    defaultValue={{ value: '', enabled: false }}
                                />
                            </ContextMenu>
                        </Form>
                    </div>
                )}
                code={`import { ContextMenu } from '@llmnative/react';

<ContextMenu trigger="/">
    <ContextMenu.Heading>Blocchi testo</ContextMenu.Heading>
    <ContextMenu.Item label="Saluto" value="Dear Sir/Madam," />
    <ContextMenu.Item label="Follow-up" value="Follow up in 2 weeks." />
    <ContextMenu.Item label="Chiusura" value="Best regards" />
    <Prompt name="notes" mode={PromptMode.RUN} />
</ContextMenu>`}
            />

            <PropDocsTable props={[...plainProps, ...sharedProps]} title={t.propsDocs.title} />
        </PageLayout>
    );
}
