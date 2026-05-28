import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';

const variantPages = [
    {
        title: 'PromptEditor',
        path: '/components/prompt/editor',
        description: 'Author and maintain the stored prompt template with a dedicated editor surface.',
    },
    {
        title: 'PromptLive',
        path: '/components/prompt/live',
        description: 'Execute the stored prompt against the active form record and write the generated result back into the same field.',
    },
    {
        title: 'PromptPlain',
        path: '/components/prompt/plain',
        description: 'Plain fallback surface used when prompt mode is disabled and the field behaves like a normal textarea.',
    },
];

export default function PromptIndexPage() {
    return (
        <PageLayout
            title="Prompt"
            description="Prompt-aware textarea field that can store literal text or an AI prompt configuration, and optionally execute it against the current form record."
        >
            <Section
                title="Modes"
                description="The mode prop selects the surface. editor (default) is for authoring the prompt template. live shows execution controls and writes the result back into the field."
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

// editor mode (default) — author and store the prompt template
<Form>
  <Prompt
    name="summary"
    label="Summary"
    rows={5}
    defaultValue={{ value: 'Write a concise summary for {projectName}.', enabled: true }}
  />
</Form>

// live mode — execute and write the result back into the field
<Form>
  <Prompt name="summary" mode={PromptMode.LIVE} onRunPrompt={myExecutor} />
</Form>`}
            />
        </PageLayout>
    );
}
