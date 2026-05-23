import React from 'react';
import { Form, Select } from '@llmnative/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const ROLES = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];

const COUNTRIES = [
    { label: 'Italy', value: 'it' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Spain', value: 'es' },
    { label: 'United Kingdom', value: 'gb' },
    { label: 'United States', value: 'us' },
];

const SELECT_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text' },
    { name: 'label', type: 'string', description: 'Label displayed above the select', control: 'text' },
    { name: 'title', type: 'string', description: 'Native title attribute on the select element', control: 'text' },
    { name: 'options', type: 'Option[] | string[] | number[]', description: 'Static options array', control: 'json', typeDetails: `Array<{ label: string; value: string }> | string[] | number[]`, example: `options={[
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
]}` },
    {
        name: 'db',
        type: 'SelectDbConfig',
        description: 'DataProvider path used to fetch options',
        typeDetails: `{
  path?: string;
  fieldMap?: Record<string, string>;
  where?: Record<string, unknown>;
  order?: { field: string; dir: 'asc' | 'desc' };
}`,
        example: `db={{
  path: '/showcase/categories',
  fieldMap: { label: 'name', value: '_key' },
  where: { active: true },
  order: { field: 'label', dir: 'asc' },
}}`,
        control: 'text',
        readOnly: true,
        help: 'This playground uses a MockDataProvider. Edit the records in Mock database below to change the options returned by this path.',
    },
    { name: 'optionEmpty', type: 'Option | null', description: 'Placeholder option shown when nothing is selected; set to null to hide it', control: 'json', typeDetails: `{
  label: string;
  value: string;
} | null`, example: `optionEmpty={{ label: 'Select...', value: '' }}` },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required', control: 'boolean' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select', control: 'boolean' },
    { name: 'updatable', type: 'boolean', default: 'true', description: 'When false, an existing value locks the select', control: 'boolean' },
    { name: 'defaultValue', type: 'any', description: 'Initial selected value', control: 'text' },
    { name: 'feedback', type: 'string', description: 'Validation feedback message shown below the field', control: 'text' },
    { name: 'order', type: 'OrderConfig', description: 'Sort order for options (default: label asc)', control: 'json', typeDetails: `{
  field: 'label' | 'value';
  dir: 'asc' | 'desc';
}`, example: `order={{ field: 'label', dir: 'asc' }}` },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the select inside an input group', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the select inside an input group', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by the Form context' },
    { name: 'className', type: 'string', description: 'CSS classes on the select element', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    showFormRecord: true,
    props: SELECT_PROPS,
    mockSeed: {
        '/showcase/categories': {
            sales: { label: 'Sales', value: 'sales' },
            ops: { label: 'Operations', value: 'ops' },
            support: { label: 'Support', value: 'support' },
        },
    },
    defaultProps: {
        name: 'categoryId',
        label: 'Category',
        title: 'Choose a category',
        options: ROLES,
        db: '/showcase/categories',
        optionEmpty: {
            label: 'Select...',
            value: '',
        },
        required: false,
        disabled: false,
        updatable: true,
        defaultValue: '',
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
            <Select
                name={p.name || 'categoryId'}
                label={p.label}
                title={p.title || undefined}
                options={Array.isArray(p.options) ? p.options : []}
                db={typeof p.db === 'string' && p.db ? { path: p.db } : (p.db && typeof p.db === 'object' ? p.db : undefined)}
                optionEmpty={p.optionEmpty === null ? null : (p.optionEmpty || undefined)}
                required={p.required}
                disabled={p.disabled}
                updatable={p.updatable}
                defaultValue={p.defaultValue || undefined}
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

export default function SelectPage() {
    usePlayground(PLAYGROUND, 'Select');

    return (
        <PageLayout
            title="Select"
            description="Native dropdown select. Options can be a static array or pulled live from a DataProvider."
        >
            <Section bare
                title="Basic dropdown"
                description="Static options array - the simplest usage."
                preview={
                    <div className="w-full max-w-md">
                        <Form aspect="empty">
                            <Select name="role" label="Role" options={ROLES} />
                        </Form>
                    </div>
                }
                code={`import { Form, Select } from '@llmnative/react';

const ROLES = [
    { label: 'Admin',  value: 'admin'  },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];

<Form>
    <Select name="role" label="Role" options={ROLES} />
</Form>`}
            />

            <Section bare
                title="Required select"
                preview={
                    <div className="w-full max-w-md">
                        <Form aspect="empty">
                            <Select name="country" label="Country" options={COUNTRIES} required />
                        </Form>
                    </div>
                }
                code={`<Select name="country" label="Country" options={COUNTRIES} required />`}
            />

            <Section bare
                title="DataProvider-backed"
                description="Pass a db prop instead of options to fetch from the registered DataProvider at runtime."
                preview={
                    <div className="w-full max-w-md">
                        <Form aspect="empty">
                            <Select
                                name="categoryId"
                                label="Category"
                                db={{ path: '/showcase/categories' }}
                                defaultValue="ops"
                            />
                        </Form>
                    </div>
                }
                code={`// Fetches records from the active DataProvider and maps them to options.
<Form>
    <Select
        name="categoryId"
        label="Category"
        db={{ path: '/showcase/categories' }}
        defaultValue="ops"
    />
</Form>`}
            />

            <PropDocsTable props={SELECT_PROPS} />
        </PageLayout>
    );
}
