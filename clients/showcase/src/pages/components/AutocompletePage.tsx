import React, { useState } from 'react';
import { Autocomplete, Form } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseAutocompleteI18n } from '../../showcase/i18n';

function CreatableDemo({
    people,
    tags,
    t,
}: {
    people: Array<{ label: string; value: string; }>;
    tags: Array<{ label: string; value: string; }>;
    t: ReturnType<typeof useShowcaseAutocompleteI18n>;
}) {
    const [selectedTags, setSelectedTags] = useState(['react', 'typescript']);

    return (
        <div className="w-full max-w-md space-y-3">
            <Form appearance="empty">
                <Autocomplete
                    name="tags"
                    label={t.labels.technologies}
                    placeholder={t.labels.selectOrTypeTag}
                    options={tags}
                    defaultValue={selectedTags}
                    creatable
                    onCreate={(value) => setSelectedTags((prev) => [...prev, value])}
                />
            </Form>
            <div className="text-xs text-muted-foreground">
                {t.labels.persistedTags}: <span className="font-mono">{JSON.stringify(selectedTags)}</span>
            </div>
        </div>
    );
}

export default function AutocompletePage() {
    const t = useShowcaseAutocompleteI18n();

    const people = React.useMemo(() => [
        { label: t.labels.aliceJohnson, value: 'alice' },
        { label: t.labels.bobMartinez, value: 'bob' },
        { label: t.labels.carlaRossi, value: 'carla' },
        { label: t.labels.davidKim, value: 'david' },
        { label: t.labels.evaMuller, value: 'eva' },
    ], [t]);

    const tags = React.useMemo(() => [
        { label: t.labels.react, value: 'react' },
        { label: t.labels.typeScript, value: 'typescript' },
        { label: t.labels.firebase, value: 'firebase' },
        { label: t.labels.tailwind, value: 'tailwind' },
        { label: t.labels.nodeJs, value: 'nodejs' },
        { label: t.labels.graphQl, value: 'graphql' },
    ], [t]);

    const autocompleteProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'options', type: 'Option[] | string[] | number[]', description: t.propsDocs.items.options.description, control: 'json', rows: 6, shortcuts: [
            { label: 'people', value: people, help: 'Named people options.' },
            { label: 'tags', value: tags, help: 'Technology tags.' },
            { label: 'simple', value: ['alpha', 'beta', 'gamma'], help: 'Simple string list.' },
        ], typeDetails: `Array<{ label: string; value: string }> | string[] | number[]`, example: `options={[
  { label: 'Alice Johnson', value: 'alice' },
  { label: 'Bob Martinez', value: 'bob' },
]}` },
        {
            name: 'optionsSource',
            type: 'AutocompleteDbConfig',
            description: t.propsDocs.items.optionsSource.description,
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
            help: t.propsDocs.items.optionsSource.help,
        },
        { name: 'placeholder', type: 'string', description: t.propsDocs.items.placeholder.description, control: 'text' },
        { name: 'minItems', type: 'number', description: t.propsDocs.items.minItems.description, control: 'number', min: 0 },
        { name: 'maxItems', type: 'number', description: t.propsDocs.items.maxItems.description, control: 'number', min: 1 },
        { name: 'creatable', type: 'boolean', default: 'false', description: t.propsDocs.items.creatable.description, control: 'boolean' },
        { name: 'onCreate', type: '(value: string) => Promise<void> | void', description: t.propsDocs.items.onCreate.description, example: `onCreate={async (value) => {
  await db.set(\`/tags/\${value}\`, { label: value, value });
}}` },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        { name: 'readOnlyAfterSet', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnlyAfterSet.description, control: 'boolean' },
        { name: 'defaultValue', type: 'string[] | string', description: t.propsDocs.items.defaultValue.description, control: 'json', rows: 3, shortcuts: [
            { label: 'single', value: 'alice', help: 'Single selected value.' },
            { label: 'multi', value: ['alice', 'carla'], help: 'Multiple selected values.' },
            { label: 'empty', value: [], help: 'No initial value.' },
        ] },
        { name: 'feedback', type: 'string', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'validator', type: '(value: FieldValue) => string | undefined', description: t.propsDocs.items.validator.description },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'order', type: 'OrderConfig', description: t.propsDocs.items.order.description, control: 'json', rows: 4, shortcuts: [
            { label: 'label asc', value: { field: 'label', dir: 'asc' }, help: 'Sort by label ascending.' },
            { label: 'label desc', value: { field: 'label', dir: 'desc' }, help: 'Sort by label descending.' },
            { label: 'value asc', value: { field: 'value', dir: 'asc' }, help: 'Sort by value ascending.' },
        ], typeDetails: `{
  field: 'label' | 'value';
  dir: 'asc' | 'desc';
}`, example: `order={{ field: 'label', dir: 'asc' }}` },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [people, tags, t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        showFormRecord: true,
        props: autocompleteProps,
        mockSeed: {
            '/showcase/users': {
                alice: { label: t.labels.aliceJohnson, value: 'alice' },
                bob: { label: t.labels.bobMartinez, value: 'bob' },
                carla: { label: t.labels.carlaRossi, value: 'carla' },
            },
        },
        defaultProps: {
            name: 'users',
            label: t.labels.users,
            title: t.labels.searchUsers,
            options: people,
            optionsSource: '/showcase/users',
            placeholder: t.labels.typeName,
            minItems: 0,
            maxItems: 5,
            creatable: false,
            required: false,
            disabled: false,
            readOnlyAfterSet: false,
            defaultValue: ['alice'],
            feedback: '',
            order: { field: 'label', dir: 'asc' },
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
    }), [autocompleteProps, people, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                bare
                title={t.sections.basic.title}
                description={t.sections.basic.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="assignees"
                                label={t.labels.assignees}
                                placeholder={t.labels.typeName}
                                options={people}
                            />
                        </Form>
                    </div>
                )}
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

            <Section
                bare
                title={t.sections.defaultValues.title}
                description={t.sections.defaultValues.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="assignees"
                                label={t.labels.assigneesMaxThree}
                                placeholder={t.labels.typeName}
                                options={people}
                                defaultValue={['alice', 'bob']}
                                max={3}
                            />
                        </Form>
                    </div>
                )}
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

            <Section
                bare
                title={t.sections.tagInput.title}
                description={t.sections.tagInput.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="tags"
                                label={t.labels.technologies}
                                placeholder={t.labels.addTag}
                                options={tags}
                                defaultValue={['react', 'typescript']}
                            />
                        </Form>
                    </div>
                )}
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

            <Section
                bare
                title={t.sections.creatable.title}
                description={t.sections.creatable.description}
                preview={<CreatableDemo people={people} tags={tags} t={t} />}
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

            <Section
                bare
                title={t.sections.dataProviderBacked.title}
                description={t.sections.dataProviderBacked.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Autocomplete
                                name="users"
                                label={t.labels.users}
                                placeholder={t.labels.searchUsers}
                                optionsSource={{ path: '/showcase/users' }}
                                defaultValue={['alice']}
                            />
                        </Form>
                    </div>
                )}
                code={`<Form>
    <Autocomplete
        name="users"
        label="Users"
        placeholder="Search users..."
        optionsSource={{ path: '/users' }}
    />
</Form>`}
            />

            <PropDocsTable props={autocompleteProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
