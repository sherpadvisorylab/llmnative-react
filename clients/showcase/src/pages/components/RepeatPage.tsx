import React from 'react';
import { Form, Input, Repeat } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseRepeatI18n } from '../../showcase/i18n';

export default function RepeatPage() {
    const t = useShowcaseRepeatI18n();

    const repeatProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'children', type: 'ReactNode | ((record, records, index) => ReactNode)', required: true, description: t.propsDocs.items.children.description },
        { name: 'layout', type: 'horizontal | inline', default: 'horizontal', description: t.propsDocs.items.layout.description, control: 'select', options: ['horizontal', 'inline'] },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'minItems', type: 'number', description: t.propsDocs.items.minItems.description, control: 'number', min: 0, max: 5 },
        { name: 'maxItems', type: 'number', description: t.propsDocs.items.maxItems.description, control: 'number', min: 1, max: 8 },
        { name: 'readOnly', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnly.description, control: 'boolean' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'onAdd', type: '(value: any[]) => void', description: t.propsDocs.items.onAdd.description },
        { name: 'onRemove', type: '(index: number) => void', description: t.propsDocs.items.onRemove.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: repeatProps,
        showFormRecord: true,
        size: 'lg',
        defaultProps: {
            name: 'items',
            layout: 'horizontal',
            minItems: 1,
            maxItems: 5,
            label: t.labels.tasks,
            readOnly: false,
            className: '',
        },
        render: (p, onValuesChange) => {
            const isInline = p.layout === 'inline';
            return (
                <Form
                    appearance="empty"
                    defaultValues={{
                        [p.name || 'items']: isInline
                            ? [{ name: t.labels.primary, value: '#2563eb' }, { name: t.labels.secondary, value: '#64748b' }, { name: t.labels.accent, value: '#f59e0b' }]
                            : [{ name: t.labels.design }, { name: t.labels.build }, { name: t.labels.test }],
                    }}
                    onChange={onValuesChange}
                >
                    <Repeat
                        name={p.name || 'items'}
                        layout={p.layout || 'horizontal'}
                        minItems={p.minItems}
                        maxItems={p.maxItems}
                        label={p.label || undefined}
                        readOnly={p.readOnly}
                        className={p.className || undefined}
                    >
                        {isInline
                            ? () => (
                                <div className="flex items-center gap-2">
                                    <Input name="value" type="color" className="w-10 shrink-0 p-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <Input name="name" placeholder="token-name" />
                                    </div>
                                </div>
                            )
                            : <Input name="name" label={t.labels.taskName} />
                        }
                    </Repeat>
                </Form>
            );
        },
    }), [repeatProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>

            {/* 1 — Basic horizontal */}
            <Section
                bare
                title={t.sections.repeatedFields.title}
                description={t.sections.repeatedFields.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty" defaultValues={{ tasks: [{ name: t.labels.design }, { name: t.labels.build }] }}>
                            <Repeat name="tasks" label={t.labels.tasks} minItems={1} maxItems={5}>
                                <Input name="name" label={t.labels.taskName} />
                            </Repeat>
                        </Form>
                    </div>
                )}
                code={`import { Form, Input, Repeat } from '@llmnative/react';

<Form defaultValues={{ tasks: [{ name: 'Design' }, { name: 'Build' }] }}>
    <Repeat name="tasks" label="Tasks" minItems={1} maxItems={5}>
        <Input name="name" label="Task name" />
    </Repeat>
</Form>`}
            />

            {/* 2 — Inline layout */}
            <Section
                bare
                title={t.sections.inlineLayout.title}
                description={t.sections.inlineLayout.description}
                preview={(
                    <div className="w-full max-w-sm">
                        <Form appearance="empty" defaultValues={{ colors: [
                            { name: t.labels.primary, value: '#2563eb' },
                            { name: t.labels.secondary, value: '#64748b' },
                            { name: t.labels.accent, value: '#f59e0b' },
                        ]}}>
                            <Repeat name="colors" label={t.labels.addColor} layout="inline" minItems={1}>
                                {() => (
                                    <div className="flex items-center gap-2">
                                        <Input name="value" type="color" className="w-10 shrink-0 p-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <Input name="name" placeholder="token-name" />
                                        </div>
                                    </div>
                                )}
                            </Repeat>
                        </Form>
                    </div>
                )}
                code={`<Form defaultValues={{ colors: [
    { name: 'primary',   value: '#2563eb' },
    { name: 'secondary', value: '#64748b' },
    { name: 'accent',    value: '#f59e0b' },
]}}>
    <Repeat name="colors" label="Add color" layout="inline" minItems={1}>
        {() => (
            <div className="flex items-center gap-2">
                <Input name="value" type="color" className="w-10 shrink-0 p-0.5" />
                <div className="flex-1 min-w-0">
                    <Input name="name" placeholder="token-name" />
                </div>
            </div>
        )}
    </Repeat>
</Form>`}
            />

            {/* 3 — Multiple fields */}
            <Section
                bare
                title={t.sections.multipleFields.title}
                description={t.sections.multipleFields.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty" defaultValues={{ links: [
                            { platform: t.labels.twitter, url: 'https://twitter.com/acme' },
                            { platform: t.labels.github, url: 'https://github.com/acme' },
                            { platform: t.labels.linkedin, url: 'https://linkedin.com/company/acme' },
                        ]}}>
                            <Repeat name="links" label={t.labels.socialLinks} maxItems={6}>
                                <Input name="platform" label={t.labels.platform} />
                                <Input name="url" label={t.labels.url} type="url" placeholder="https://..." />
                            </Repeat>
                        </Form>
                    </div>
                )}
                code={`<Form defaultValues={{ links: [
    { platform: 'Twitter',  url: 'https://twitter.com/acme' },
    { platform: 'GitHub',   url: 'https://github.com/acme' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/acme' },
]}}>
    <Repeat name="links" label="Social links" maxItems={6}>
        <Input name="platform" label="Platform" />
        <Input name="url"      label="URL" type="url" placeholder="https://..." />
    </Repeat>
</Form>`}
            />

            {/* 4 — Min / max constraints */}
            <Section
                bare
                title={t.sections.constraints.title}
                description={t.sections.constraints.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty" defaultValues={{ langs: [
                            { name: t.labels.english },
                            { name: t.labels.italian },
                        ]}}>
                            <Repeat name="langs" label={t.labels.languages} minItems={1} maxItems={4}>
                                <Input name="name" label={t.labels.language} />
                            </Repeat>
                        </Form>
                    </div>
                )}
                code={`// First item cannot be removed (minItems=1).
// Add button disappears once 4 items are reached (maxItems=4).
<Form defaultValues={{ langs: [{ name: 'English' }, { name: 'Italian' }] }}>
    <Repeat name="langs" label="Languages" minItems={1} maxItems={4}>
        <Input name="name" label="Language" />
    </Repeat>
</Form>`}
            />

            {/* 5 — Read-only */}
            <Section
                bare
                title={t.sections.readOnlyMode.title}
                description={t.sections.readOnlyMode.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty" defaultValues={{ skills: [
                            { name: t.labels.javascript },
                            { name: t.labels.typescript },
                            { name: t.labels.react },
                        ]}}>
                            <Repeat name="skills" label={t.labels.skills} readOnly>
                                <Input name="name" label={t.labels.skill} />
                            </Repeat>
                        </Form>
                    </div>
                )}
                code={`<Form defaultValues={{ skills: [
    { name: 'JavaScript' },
    { name: 'TypeScript' },
    { name: 'React' },
]}}>
    <Repeat name="skills" label="Skills" readOnly>
        <Input name="name" label="Skill" />
    </Repeat>
</Form>`}
            />

            {/* 6 — Children as function */}
            <Section
                bare
                title={t.sections.functionChildren.title}
                description={t.sections.functionChildren.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty" defaultValues={{ steps: [
                            { name: 'Install', command: 'npm ci' },
                            { name: 'Build', command: 'npm run build' },
                            { name: 'Test', command: 'npm test' },
                        ]}}>
                            <Repeat name="steps" label={t.labels.pipelineSteps}>
                                {({ index }: { index: number }) => (
                                    <>
                                        <Input name="name" label={`${t.labels.stepName} #${index + 1}`} />
                                        <Input name="command" label={t.labels.command} placeholder="npm run ..." />
                                    </>
                                )}
                            </Repeat>
                        </Form>
                    </div>
                )}
                code={`<Form defaultValues={{ steps: [
    { name: 'Install', command: 'npm ci' },
    { name: 'Build',   command: 'npm run build' },
    { name: 'Test',    command: 'npm test' },
]}}>
    <Repeat name="steps" label="Pipeline steps">
        {({ index }) => (
            <>
                <Input name="name"    label={\`Step #\${index + 1}\`} />
                <Input name="command" label="Command" placeholder="npm run ..." />
            </>
        )}
    </Repeat>
</Form>`}
            />

            <PropDocsTable props={repeatProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
