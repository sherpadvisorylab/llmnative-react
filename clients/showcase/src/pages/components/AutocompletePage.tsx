import React, { useState } from 'react';
import { Autocomplete, Form } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

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
    { name: 'options', type: 'Array<{ label: string; value: string }> | string[] | number[]', description: 'Static options for suggestions', control: 'json' },
    {
        name: 'db',
        type: '{ path?: string; srcPath?: string; fieldMap?: object; where?: object; order?: object }',
        description: 'DataProvider path used to fetch suggestions',
        control: 'text',
        readOnly: true,
        help: 'This playground uses a MockDataProvider. Edit the records in Mock database below to change the suggestions returned by this path.',
    },
    { name: 'placeholder', type: 'string', description: 'Input placeholder text', control: 'text' },
    { name: 'min', type: 'number', description: 'Minimum number of selected items', control: 'number', min: 0 },
    { name: 'max', type: 'number', description: 'Maximum number of selected items', control: 'number', min: 1 },
    { name: 'creatable', type: 'boolean', default: 'false', description: 'Allow typing free values not in options list; press Enter to confirm', control: 'boolean' },
    { name: 'onCreate', type: '(value: string) => Promise<void> | void', description: 'Called when a new free value is confirmed; use this to persist the new option' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required', control: 'boolean' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field', control: 'boolean' },
    { name: 'updatable', type: 'boolean', default: 'true', description: 'When false, an existing value locks the input', control: 'boolean' },
    { name: 'defaultValue', type: 'string[] | string', description: 'Initial selected values', control: 'json' },
    { name: 'feedback', type: 'string', description: 'Validation feedback message shown below the field', control: 'text' },
    { name: 'order', type: '{ field: "label" | "value"; dir: "asc" | "desc" }', description: 'Sort order for options (default: label asc)', control: 'json' },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the autocomplete inside an input group', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the autocomplete inside an input group', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the input element', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
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
        db: '/showcase/users',
        placeholder: 'Type a name...',
        min: 0,
        max: 5,
        creatable: false,
        required: false,
        disabled: false,
        updatable: true,
        defaultValue: ['alice'],
        feedback: '',
        order: {
            field: 'label',
            dir: 'asc',
        },
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <Autocomplete
                name={p.name || 'users'}
                label={p.label}
                title={p.title || undefined}
                placeholder={p.placeholder || undefined}
                options={Array.isArray(p.options) ? p.options : []}
                db={typeof p.db === 'string' && p.db ? { path: p.db } : (p.db && typeof p.db === 'object' ? p.db : undefined)}
                max={p.max || undefined}
                min={p.min || undefined}
                creatable={p.creatable}
                required={p.required}
                disabled={p.disabled}
                updatable={p.updatable}
                defaultValue={p.defaultValue}
                feedback={p.feedback || undefined}
                order={p.order && typeof p.order === 'object' ? p.order : undefined}
                pre={p.pre || undefined}
                post={p.post || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
            />
        </Form>
    ),
};

function CreatableDemo() {
    const [tags, setTags] = useState(['react', 'typescript']);
    return (
        <div className="w-full max-w-md space-y-3">
            <Form aspect="empty">
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
                        <Form aspect="empty">
                            <Autocomplete
                                name="assignees"
                                label="Assignees"
                                placeholder="Type a name..."
                                options={PEOPLE}
                            />
                        </Form>
                    </div>
                }
                code={`import { Autocomplete, Form } from 'react-firestrap';

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
                        <Form aspect="empty">
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
                        <Form aspect="empty">
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
import { Autocomplete, Form, useDataProvider } from 'react-firestrap';

function TagField() {
    const db = useDataProvider();

    return (
        <Form>
            <Autocomplete
                name="tags"
                label="Technologies"
                placeholder="Select or type a new tag..."
                db={{ path: '/tags' }}
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
                description="Pass db instead of options to load suggestions from the active DataProvider."
                preview={
                    <div className="w-full max-w-md">
                        <Form aspect="empty">
                            <Autocomplete
                                name="users"
                                label="Users"
                                placeholder="Search users..."
                                db={{ path: '/showcase/users' }}
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
        db={{ path: '/users' }}
    />
</Form>`}
            />

            <PropsTable props={AUTOCOMPLETE_PROPS} />
        </PageLayout>
    );
}
