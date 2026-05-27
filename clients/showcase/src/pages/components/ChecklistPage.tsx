import React from 'react';
import { Checklist, Form } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const TAGS = [
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Firebase', value: 'firebase' },
    { label: 'Tailwind', value: 'tailwind' },
    { label: 'Node.js', value: 'nodejs' },
];

const PERMISSIONS = [
    { label: 'Read', value: 'read' },
    { label: 'Write', value: 'write' },
    { label: 'Delete', value: 'delete' },
    { label: 'Admin', value: 'admin' },
];

const CHECKLIST_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key; stores selected values as an array', control: 'text' },
    { name: 'label', type: 'string', description: 'Group label above the checkboxes', control: 'text' },
    { name: 'title', type: 'string', description: 'Native title attribute on each checkbox input', control: 'text' },
    { name: 'options', type: 'Option[] | string[] | number[]', description: 'Static checkbox options', control: 'json', rows: 6, shortcuts: [
        { label: 'tags', value: TAGS, help: 'Technology checklist.' },
        { label: 'permissions', value: PERMISSIONS, help: 'Permission checklist.' },
        { label: 'simple', value: ['one', 'two', 'three'], help: 'Simple string values.' },
    ], typeDetails: `Array<{ label: string; value: string }> | string[] | number[]` },
    {
        name: 'db',
        type: 'ChecklistDbConfig',
        description: 'DataProvider path used to fetch checkbox options',
        typeDetails: `{
  path?: string;
  fieldMap?: Record<string, string>;
  where?: Record<string, unknown>;
  order?: { field: string; dir: 'asc' | 'desc' };
}`,
        control: 'text',
        readOnly: true,
        help: 'This playground uses a MockDataProvider. Edit the records in Mock database below to change the options returned by this path.',
    },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required', control: 'boolean' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all checkboxes', control: 'boolean' },
    { name: 'updatable', type: 'boolean', default: 'true', description: 'When false, an existing value locks the checklist', control: 'boolean' },
    { name: 'defaultValue', type: 'string[] | string', description: 'Initial selected values', control: 'json', rows: 3, shortcuts: [
        { label: 'single', value: 'react', help: 'Single default selection.' },
        { label: 'multi', value: ['react', 'typescript'], help: 'Multiple defaults.' },
        { label: 'empty', value: [], help: 'No default selections.' },
    ] },
    { name: 'feedback', type: 'string', description: 'Validation feedback message shown below the list', control: 'text' },
    { name: 'order', type: 'OrderConfig', description: 'Sort order for options (default: label asc)', control: 'json', rows: 4, shortcuts: [
        { label: 'label asc', value: { field: 'label', dir: 'asc' }, help: 'Sort by label ascending.' },
        { label: 'label desc', value: { field: 'label', dir: 'desc' }, help: 'Sort by label descending.' },
        { label: 'value asc', value: { field: 'value', dir: 'asc' }, help: 'Sort by value ascending.' },
    ], typeDetails: `{
  field: 'label' | 'value';
  dir: 'asc' | 'desc';
}` },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the checklist inside an input group', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the checklist inside an input group', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by the Form context' },
    { name: 'checkClass', type: 'string', description: 'CSS classes applied to each individual checkbox wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the checklist root', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'md',
    showFormRecord: true,
    props: CHECKLIST_PROPS,
    mockSeed: {
        '/showcase/tags': {
            react: { label: 'React', value: 'react' },
            typescript: { label: 'TypeScript', value: 'typescript' },
            firebase: { label: 'Firebase', value: 'firebase' },
        },
    },
    defaultProps: {
        name: 'tags',
        label: 'Technologies',
        title: 'Select technologies',
        options: TAGS,
        db: '/showcase/tags',
        required: false,
        disabled: false,
        updatable: true,
        defaultValue: ['react', 'typescript'],
        feedback: '',
        order: {
            field: 'label',
            dir: 'asc',
        },
        pre: '',
        post: '',
        checkClass: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <Checklist
                name={p.name || 'tags'}
                label={p.label}
                title={p.title || undefined}
                options={Array.isArray(p.options) ? p.options : []}
                db={typeof p.db === 'string' && p.db ? { path: p.db } : (p.db && typeof p.db === 'object' ? p.db : undefined)}
                required={p.required}
                disabled={p.disabled}
                updatable={p.updatable}
                defaultValue={p.defaultValue}
                feedback={p.feedback || undefined}
                order={p.order && typeof p.order === 'object' ? p.order : undefined}
                pre={p.pre || undefined}
                post={p.post || undefined}
                checkClass={p.checkClass || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
            />
        </Form>
    ),
};

export default function ChecklistPage() {
    usePlayground(PLAYGROUND, 'Checklist');

    return (
        <PageLayout
            title="Checklist"
            description="Vertical list of checkboxes for multi-select. Selected values are stored as an array in the form record."
        >
            <Section bare
                title="Basic checklist"
                description="Renders a checkbox for each option. Pre-selected values come from the Form's defaultValues."
                preview={
                    <div className="w-full max-w-md">
                        <Form aspect="empty" defaultValues={{ tags: ['react', 'typescript'] }}>
                            <Checklist name="tags" label="Technologies" options={TAGS} />
                        </Form>
                    </div>
                }
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

            <Section bare
                title="Permissions checklist"
                description="Common pattern for role/permission configuration."
                preview={
                    <div className="w-full max-w-md">
                        <Form aspect="empty" defaultValues={{ permissions: ['read', 'write'] }}>
                            <Checklist name="permissions" label="Permissions" options={PERMISSIONS} />
                        </Form>
                    </div>
                }
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

            <Section bare
                title="Required and disabled"
                preview={
                    <div className="w-full max-w-md flex gap-8">
                        <Form aspect="empty">
                            <Checklist name="tags" label="Required" options={TAGS.slice(0, 3)} required />
                        </Form>
                        <Form aspect="empty" defaultValues={{ tags: ['react'] }}>
                            <Checklist name="tags" label="Disabled" options={TAGS.slice(0, 3)} disabled />
                        </Form>
                    </div>
                }
                code={`<Checklist name="tags" label="Required" options={options} required />
<Checklist name="tags" label="Disabled" options={options} disabled />`}
            />

            <PropDocsTable props={CHECKLIST_PROPS} />
        </PageLayout>
    );
}
