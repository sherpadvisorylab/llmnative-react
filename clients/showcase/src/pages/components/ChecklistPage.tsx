import React from 'react';
import { Checklist, Form } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseChecklistI18n } from '../../showcase/i18n';

export default function ChecklistPage() {
    const t = useShowcaseChecklistI18n();

    const tags = React.useMemo(() => [
        { label: t.labels.react, value: 'react' },
        { label: t.labels.typeScript, value: 'typescript' },
        { label: t.labels.firebase, value: 'firebase' },
        { label: t.labels.tailwind, value: 'tailwind' },
        { label: t.labels.nodeJs, value: 'nodejs' },
    ], [t]);

    const permissions = React.useMemo(() => [
        { label: t.labels.read, value: 'read' },
        { label: t.labels.write, value: 'write' },
        { label: t.labels.delete, value: 'delete' },
        { label: t.labels.admin, value: 'admin' },
    ], [t]);

    const checklistProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'options', type: 'Option[] | string[] | number[]', description: t.propsDocs.items.options.description, control: 'json', rows: 6, shortcuts: [
            { label: 'tags', value: tags, help: 'Technology checklist.' },
            { label: 'permissions', value: permissions, help: 'Permission checklist.' },
            { label: 'simple', value: ['one', 'two', 'three'], help: 'Simple string values.' },
        ], typeDetails: `Array<{ label: string; value: string }> | string[] | number[]` },
        {
            name: 'optionsSource',
            type: 'ChecklistDbConfig',
            description: t.propsDocs.items.optionsSource.description,
            typeDetails: `{
  path?: string;
  fieldMap?: Record<string, string>;
  where?: Record<string, unknown>;
  order?: { field: string; dir: 'asc' | 'desc' };
}`,
            control: 'text',
            readOnly: true,
            help: t.propsDocs.items.optionsSource.help,
        },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        { name: 'readOnlyAfterSet', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnlyAfterSet.description, control: 'boolean' },
        { name: 'defaultValue', type: 'string[] | string', description: t.propsDocs.items.defaultValue.description, control: 'json', rows: 3, shortcuts: [
            { label: 'single', value: 'react', help: 'Single default selection.' },
            { label: 'multi', value: ['react', 'typescript'], help: 'Multiple defaults.' },
            { label: 'empty', value: [], help: 'No default selections.' },
        ] },
        { name: 'feedback', type: 'string', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'validator', type: '(value: FieldValue) => string | undefined', description: t.propsDocs.items.validator.description },
        { name: 'order', type: 'OrderConfig', description: t.propsDocs.items.order.description, control: 'json', rows: 4, shortcuts: [
            { label: 'label asc', value: { field: 'label', dir: 'asc' }, help: 'Sort by label ascending.' },
            { label: 'label desc', value: { field: 'label', dir: 'desc' }, help: 'Sort by label descending.' },
            { label: 'value asc', value: { field: 'value', dir: 'asc' }, help: 'Sort by value ascending.' },
        ], typeDetails: `{
  field: 'label' | 'value';
  dir: 'asc' | 'desc';
}` },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'itemClassName', type: 'string', description: t.propsDocs.items.itemClassName.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [permissions, t, tags]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        showFormRecord: true,
        props: checklistProps,
        mockSeed: {
            '/showcase/tags': {
                react: { label: t.labels.react, value: 'react' },
                typescript: { label: t.labels.typeScript, value: 'typescript' },
                firebase: { label: t.labels.firebase, value: 'firebase' },
            },
        },
        defaultProps: {
            name: 'tags',
            label: t.labels.technologies,
            title: t.labels.selectTechnologies,
            options: tags,
            optionsSource: '/showcase/tags',
            required: false,
            disabled: false,
            readOnlyAfterSet: false,
            defaultValue: ['react', 'typescript'],
            feedback: '',
            order: { field: 'label', dir: 'asc' },
            before: '',
            after: '',
            itemClassName: '',
            className: '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" onChange={onValuesChange}>
                <Checklist
                    name={p.name || 'tags'}
                    label={p.label}
                    title={p.title || undefined}
                    options={Array.isArray(p.options) ? p.options : []}
                    optionsSource={typeof p.optionsSource === 'string' && p.optionsSource ? { path: p.optionsSource } : (p.optionsSource && typeof p.optionsSource === 'object' ? p.optionsSource : undefined)}
                    required={p.required}
                    disabled={p.disabled}
                    readOnlyAfterSet={p.readOnlyAfterSet}
                    defaultValue={p.defaultValue}
                    feedback={p.feedback || undefined}
                    order={p.order && typeof p.order === 'object' ? p.order : undefined}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    itemClassName={p.itemClassName || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [checklistProps, t, tags]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                bare
                title={t.sections.basic.title}
                description={t.sections.basic.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty" defaultValues={{ tags: ['react', 'typescript'] }}>
                            <Checklist name="tags" label={t.labels.technologies} options={tags} />
                        </Form>
                    </div>
                )}
                code={`import { Checklist, Form } from '@llmnative/react';

<Form defaultValues={{ tags: ['react', 'typescript'] }}>
    <Checklist
        name="tags"
        label="Technologies"
        options={[
            { label: 'React',      value: 'react'      },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Firebase',   value: 'firebase'   },
        ]}
    />
</Form>`}
            />

            <Section
                bare
                title={t.sections.permissions.title}
                description={t.sections.permissions.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty" defaultValues={{ permissions: ['read', 'write'] }}>
                            <Checklist name="permissions" label={t.labels.permissions} options={permissions} />
                        </Form>
                    </div>
                )}
                code={`<Form defaultValues={{ permissions: ['read', 'write'] }}>
    <Checklist
        name="permissions"
        label="Permissions"
        options={[
            { label: 'Read',   value: 'read'   },
            { label: 'Write',  value: 'write'  },
            { label: 'Delete', value: 'delete' },
            { label: 'Admin',  value: 'admin'  },
        ]}
    />
</Form>`}
            />

            <Section
                bare
                title={t.sections.requiredDisabled.title}
                preview={(
                    <div className="w-full max-w-md flex gap-8">
                        <Form appearance="empty">
                            <Checklist name="tags" label={t.labels.required} options={tags.slice(0, 3)} required />
                        </Form>
                        <Form appearance="empty" defaultValues={{ tags: ['react'] }}>
                            <Checklist name="tags" label={t.labels.disabled} options={tags.slice(0, 3)} disabled />
                        </Form>
                    </div>
                )}
                code={`<Checklist name="tags" label="Required" options={options} required />
<Checklist name="tags" label="Disabled" options={options} disabled />`}
            />

            <PropDocsTable props={checklistProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
