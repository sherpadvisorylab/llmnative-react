import React, { useState } from 'react';
import { Autocomplete, Form } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const PEOPLE = [
    { label: 'Alice Johnson', value: 'alice' },
    { label: 'Bob Martinez', value: 'bob' },
    { label: 'Carla Rossi', value: 'carla' },
    { label: 'David Kim', value: 'david' },
    { label: 'Eva Muller', value: 'eva' },
];

const TAGS = [
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Firebase', value: 'firebase' },
    { label: 'Tailwind', value: 'tailwind' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'GraphQL', value: 'graphql' },
];

const AUTOCOMPLETE_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text' },
    { name: 'label', type: 'string', description: 'Label above the input', control: 'text' },
    { name: 'title', type: 'string', description: 'Native title attribute on the text input', control: 'text' },
    { name: 'options', type: 'Option[] | string[] | number[]', description: 'Static options for suggestions', control: 'json', rows: 6, shortcuts: [
        { label: 'people', value: PEOPLE, help: 'Named people options.' },
        { label: 'tags', value: TAGS, help: 'Technology tags.' },
        { label: 'simple', value: ['alpha', 'beta', 'gamma'], help: 'Simple string list.' },
    ], typeDetails: `Array<{ label: string; value: string }> | string[] | number[]`, example: `options={[
  { label: 'Alice Johnson', value: 'alice' },
  { label: 'Bob Martinez', value: 'bob' },
]}` },
    {
        name: 'optionsSource',
        type: 'AutocompleteDbConfig',
        description: 'DataProvider path used to fetch suggestions',
        typeDetails: `{
  path?: string;
  fieldMap?: Record<string, string>;
  where?: Record<string, unknown>;
  order?: { field: string; dir: 'asc' | 'desc' };
}`,
        example: `optionsSource={{
  path: '/showcase/users',
  order: { field: 'label', dir: 'asc' },
}}`,
        control: 'text',
        readOnly: true,
        help: 'This playground uses a MockDataProvider. Edit the records in Mock database below to change the suggestions returned by this path.',
    },
    { name: 'placeholder', type: 'string', description: 'Input placeholder text', control: 'text' },
    { name: 'minItems', type: 'number', description: 'Minimum number of selected items', control: 'number', min: 0 },
    { name: 'maxItems', type: 'number', description: 'Maximum number of selected items', control: 'number', min: 1 },
    { name: 'creatable', type: 'boolean', default: 'false', description: 'Allow typing free values not in options list; press Enter to confirm', control: 'boolean' },
    { name: 'onCreate', type: '(value: string) => Promise<void> | void', description: 'Called when a new free value is confirmed; use this to persist the new option', example: `onCreate={async (value) => {
  await db.set(\`/tags/\${value}\`, { label: value, value });
}}` },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required', control: 'boolean' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field', control: 'boolean' },
    { name: 'readOnlyAfterSet', type: 'boolean', default: 'false', description: 'Field becomes read-only (disabled) once a value has been set', control: 'boolean' },
    { name: 'defaultValue', type: 'string[] | string', description: 'Initial selected values', control: 'json', rows: 3, shortcuts: [
        { label: 'single', value: 'alice', help: 'Single selected value.' },
        { label: 'multi', value: ['alice', 'carla'], help: 'Multiple selected values.' },
        { label: 'empty', value: [], help: 'No initial value.' },
    ] },
    { name: 'feedback', type: 'string', description: 'Validation feedback message shown below the field', control: 'text' },
    { name: 'validator', type: '(value: FieldValue) => string | undefined', description: 'Custom validation function; return an error string to block submission, undefined to pass' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by the Form context' },
    { name: 'order', type: 'OrderConfig', description: 'Sort order for options (default: label asc)', control: 'json', rows: 4, shortcuts: [
        { label: 'label asc', value: { field: 'label', dir: 'asc' }, help: 'Sort by label ascending.' },
        { label: 'label desc', value: { field: 'label', dir: 'desc' }, help: 'Sort by label descending.' },
        { label: 'value asc', value: { field: 'value', dir: 'asc' }, help: 'Sort by value ascending.' },
    ], typeDetails: `{
  field: 'label' | 'value';
  dir: 'asc' | 'desc';
}`, example: `order={{ field: 'label', dir: 'asc' }}` },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the autocomplete inside an input group', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the autocomplete inside an input group', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the input element', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    showFormRecord: true,
    props: AUTOCOMPLETE_PROPS,
    mockSeed: {
        '/showcase/users': {
            alice: { label: 'Alice Johnson', value: 'alice' },
            bob: { label: 'Bob Martinez', value: 'bob' },
            carla: { label: 'Carla Rossi', value: 'carla' },
        },
    },
    defaultProps: {
        name: 'users',
        label: 'Users',
        title: 'Search users',
        options: PEOPLE,
        optionsSource: '/showcase/users',
        placeholder: 'Type a name...',
        minItems: 0,
        maxItems: 5,
        creatable: false,
        required: false,
        disabled: false,
        readOnlyAfterSet: false,
        defaultValue: ['alice'],
        feedback: '',
        order: {
            field: 'label',
            dir: 'asc',
        },
        before: '',
        after: '',
        className: '',
        wrapperClassName: '',
    },
    render: (p, onValuesChange) => (
        <Form appearance="empty" onChange={onValuesChange}>
            <Autocomplete
                name={p.name || 'users'}
                label={p.label}
                title={p.title || undefined}
                placeholder={p.placeholder || undefined}
                options={Array.isArray(p.options) ? p.options : []}
                optionsSource={typeof p.optionsSource === 'string' && p.optionsSource ? { path: p.optionsSource } : (p.optionsSource && typeof p.optionsSource === 'object' ? p.optionsSource : undefined)}
                maxItems={p.maxItems || undefined}
                minItems={p.minItems || undefined}
                creatable={p.creatable}
                required={p.required}
                disabled={p.disabled}
                readOnlyAfterSet={p.readOnlyAfterSet}
                defaultValue={p.defaultValue}
                feedback={p.feedback || undefined}
                order={p.order && typeof p.order === 'object' ? p.order : undefined}
                before={p.before || undefined}
                after={p.after || undefined}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            />
        </Form>
    ),
};

function CreatableDemo() {
    const [tags, setTags] = useState(['react', 'typescript']);
    return (
        <div className="w-full max-w-md space-y-3">
            <Form appearance="empty">
                <Autocomplete
                    name="tags"
                    label="Technologies"
                    placeholder="Select or type a new tag..."
                    options={TAGS}
                    defaultValue={tags}
                    creatable
                    onCreate={(value) => setTags(prev => [...prev, value])}
                />
            </Form>
            <div className="text-xs text-muted-foreground">
                Persisted tags: <span className="font-mono">{JSON.stringify(tags)}</span>
            </div>
        </div>
    );
}

export default function AutocompletePage() {
    usePlayground(PLAYGROUND, 'Autocomplete');

    return (
        <PageLayout
            title="Autocomplete"
            description="Multi-value tag input with type-ahead suggestions. Stores selected values as an array in the form record."
        >
            <Section bare
                title="Basic autocomplete"
                description="Type to filter suggestions. Selected items appear as removable tags."
                preview={
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="assignees"
                                label="Assignees"
                                placeholder="Type a name..."
                                options={PEOPLE}
                            />
                        </Form>
                    </div>
                }
                code={`import { Autocomplete, Form } from '@llmnative/react';

<Form>
    <Autocomplete
        name="assignees"
        label="Assignees"
        placeholder="Type a name..."
        options={[
            { label: 'Alice Johnson', value: 'alice' },
            { label: 'Bob Martinez', value: 'bob' },
        ]}
    />
</Form>`}
            />

            <Section bare
                title="With default values and max limit"
                description="Pre-populate with existing values. max=3 prevents selecting more than 3 items."
                preview={
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="assignees"
                                label="Assignees (max 3)"
                                placeholder="Type a name..."
                                options={PEOPLE}
                                defaultValue={['alice', 'bob']}
                                max={3}
                            />
                        </Form>
                    </div>
                }
                code={`<Form>
    <Autocomplete
        name="assignees"
        label="Assignees (max 3)"
        placeholder="Type a name..."
        options={people}
        defaultValue={['alice', 'bob']}
        max={3}
    />
</Form>`}
            />

            <Section bare
                title="Tag input"
                description="Works equally well for free-form tags, not just people - any options array applies."
                preview={
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="tags"
                                label="Technologies"
                                placeholder="Add a tag..."
                                options={TAGS}
                                defaultValue={['react', 'typescript']}
                            />
                        </Form>
                    </div>
                }
                code={`<Form>
    <Autocomplete
        name="tags"
        label="Technologies"
        placeholder="Add a tag..."
        options={TAGS}
        defaultValue={['react']}
    />
</Form>`}
            />

            <Section bare
                title="Creatable - free input with persistence"
                description="Enable creatable to let users type values not in the list. Press Enter to confirm. Use onCreate to persist the new option to your DataProvider."
                preview={<CreatableDemo />}
                code={`import { useState } from 'react';
import { Autocomplete, Form, useDataProvider } from '@llmnative/react';

function TagField() {
    const db = useDataProvider();

    return (
        <Form>
            <Autocomplete
                name="tags"
                label="Technologies"
                placeholder="Select or type a new tag..."
                optionsSource={{ path: '/tags' }}
                creatable
                onCreate={async (value) => {
                    await db.set(\`/tags/\${value}\`, { label: value, value });
                }}
            />
        </Form>
    );
}`}
            />

            <Section bare
                title="DataProvider-backed"
                description="Pass optionsSource instead of options to load suggestions from the active DataProvider."
                preview={
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="users"
                                label="Users"
                                placeholder="Search users..."
                                optionsSource={{ path: '/showcase/users' }}
                                defaultValue={['alice']}
                            />
                        </Form>
                    </div>
                }
                code={`<Form>
    <Autocomplete
        name="users"
        label="Users"
        placeholder="Search users..."
        optionsSource={{ path: '/users' }}
    />
</Form>`}
            />

            <PropDocsTable props={AUTOCOMPLETE_PROPS} />
        </PageLayout>
    );
}
