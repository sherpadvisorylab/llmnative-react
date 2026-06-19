import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import { useShowcaseCommonI18n, useShowcasePromptI18n } from '../../../showcase/i18n';

export default function PromptIndexPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcasePromptI18n();

    const variantPages = [
        {
            title: t.variants.editor.title,
            path: '/components/prompt/editor',
            description: t.variants.editor.description,
        },
        {
            title: t.variants.live.title,
            path: '/components/prompt/live',
            description: t.variants.live.description,
        },
        {
            title: t.variants.plain.title,
            path: '/components/prompt/plain',
            description: t.variants.plain.description,
        },
    ];

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={common.sections.variants}
                description={t.sections.modes.description}
                preview={
                    <div className="grid gap-3 md:grid-cols-3">
                        {variantPages.map((page) => (
                            <Link
                                key={page.path}
                                to={page.path}
                                className="block rounded-md border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                            >
                                <h3 className="font-semibold text-foreground">{page.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
                            </Link>
                        ))}
                    </div>
                }
                code={`import { Form, Prompt, PromptMode } from '@llmnative/react';

// edit mode (default) - author and store the prompt template
<Form>
  <Prompt
    name="summary"
    label="Summary"
    mode={PromptMode.EDIT}
    minHeight={140}
    maxHeight={200}
    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
  />
</Form>

// run mode - execute and write the result back into the field
<Form>
  <Prompt name="summary" mode={PromptMode.RUN} onRunPrompt={myExecutor} />
</Form>`}
            />
        </PageLayout>
    );
}
