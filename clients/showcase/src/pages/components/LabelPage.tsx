import React from 'react';
import { Form, Input, Label, Switch, TextArea } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDocsInput } from '../../docs-kit/docs/propDocs.types';

const labelProps: PropDocsInput[] = [
    {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Visible text rendered by the label element.',
    },
    {
        name: 'required',
        type: 'boolean',
        default: 'false',
        description: 'Adds the required asterisk next to the label text.',
    },
    {
        name: 'htmlFor',
        type: 'string',
        description: 'Connects the label to the target field id for focus and accessibility.',
    },
    {
        name: 'className',
        type: 'string',
        description: 'Additional Tailwind classes merged on top of the framework label styles.',
    },
];

export default function LabelPage() {
    return (
        <PageLayout
            title="Label"
            description="Small form primitive used by Input, TextArea, Switch and Upload to keep field headings accessible and visually consistent."
        >
            <Section
                title="Standalone label"
                description="Use Label directly when you need a framework-consistent caption outside the higher-level field components."
                preview={(
                    <div className="w-full max-w-xl rounded-md border bg-background p-4">
                        <Label label="Project name" htmlFor="project-name" required />
                        <input
                            id="project-name"
                            className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                            placeholder="Northwind revamp"
                        />
                    </div>
                )}
                code={`import { Label } from '@llmnative/react';

<Label label="Project name" htmlFor="project-name" required />
<input id="project-name" />`}
            />

            <Section
                title="Used by field components"
                description="Most apps will not render Label manually because Input, TextArea and Switch already compose it for you."
                preview={(
                    <Form appearance="empty" defaultValues={{ title: 'Acme launch', summary: 'Ship the landing page this week.', published: 'on' }}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input name="title" label="Title" required />
                            <Switch name="published" label="Published" />
                            <div className="md:col-span-2">
                                <TextArea name="summary" label="Summary" minHeight={112} />
                            </div>
                        </div>
                    </Form>
                )}
                code={`import { Form, Input, Switch, TextArea } from '@llmnative/react';

<Form>
  <Input name="title" label="Title" required />
  <Switch name="published" label="Published" />
  <TextArea name="summary" label="Summary" minHeight={112} />
</Form>`}
            />

            <PropDocsTable props={labelProps} />
        </PageLayout>
    );
}
