import React from 'react';
import { Form, Select } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseSelectI18n } from '../../showcase/i18n';

export default function SelectPage() {
    const t = useShowcaseSelectI18n();

    const roles = React.useMemo(() => [
        { label: t.labels.admin, value: 'admin' },
        { label: t.labels.editor, value: 'editor' },
        { label: t.labels.viewer, value: 'viewer' },
    ], [t]);

    const countries = React.useMemo(() => [
        { label: t.labels.italy, value: 'it' },
        { label: t.labels.germany, value: 'de' },
        { label: t.labels.france, value: 'fr' },
        { label: t.labels.spain, value: 'es' },
        { label: t.labels.unitedKingdom, value: 'gb' },
        { label: t.labels.unitedStates, value: 'us' },
    ], [t]);

    const selectProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'options', type: 'Option[] | string[] | number[]', description: t.propsDocs.items.options.description, control: 'json', rows: 6, shortcuts: [
            { label: 'roles', value: roles, help: 'Admin/editor/viewer roles.' },
            { label: 'countries', value: countries, help: 'Country options.' },
            { label: 'simple', value: [t.labels.draft, t.labels.review, t.labels.published], help: 'Simple string list.' },
        ], typeDetails: `Array<{ label: string; value: string }> | string[] | number[]`, example: `options={[
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
]}`, help: t.propsDocs.items.options.help },
        {
            name: 'optionsSource',
            type: 'SelectDbConfig',
            description: t.propsDocs.items.optionsSource.description,
            typeDetails: `{
  path?: string;
  fieldMap?: Record<string, string>;
  where?: Record<string, unknown>;
  order?: { [field: string]: 'asc' | 'desc' };
  onLoad?: (data) => data;
}`,
            example: `optionsSource={{
  path: '/showcase/categories',
  fieldMap: { label: 'name', value: '_key' },
  where: { active: true },
  order: { label: 'asc' },
}}`,
            control: 'text',
            readOnly: true,
            help: t.propsDocs.items.optionsSource.help,
        },
        { name: 'placeholderOption', type: 'Option | null', description: t.propsDocs.items.placeholderOption.description, control: 'json', rows: 3, shortcuts: [
            { label: 'default', value: { label: t.labels.selectPlaceholder, value: '' }, help: 'Default empty option.' },
            { label: 'choose', value: { label: t.labels.chooseRolePlaceholder, value: '' }, help: 'Custom placeholder text.' },
            { label: 'null', value: null, help: 'Hide the empty option.' },
        ], typeDetails: `{
  label: string;
  value: string;
} | null`, example: `placeholderOption={{ label: 'Select...', value: '' }}` },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        { name: 'readOnlyAfterSet', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnlyAfterSet.description, control: 'boolean' },
        { name: 'defaultValue', type: 'any', description: t.propsDocs.items.defaultValue.description, control: 'text' },
        { name: 'feedback', type: 'string', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'validator', type: '(value: FieldValue) => string | undefined', description: t.propsDocs.items.validator.description },
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
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [countries, roles, t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        showFormRecord: true,
        props: selectProps,
        mockSeed: {
            '/showcase/categories': {
                sales: { label: t.labels.sales, value: 'sales' },
                ops: { label: t.labels.operations, value: 'ops' },
                support: { label: t.labels.support, value: 'support' },
            },
        },
        defaultProps: {
            name: 'categoryId',
            label: t.labels.category,
            title: t.labels.chooseCategory,
            options: roles,
            optionsSource: '/showcase/categories',
            placeholderOption: {
                label: t.labels.selectPlaceholder,
                value: '',
            },
            required: false,
            disabled: false,
            readOnlyAfterSet: false,
            defaultValue: '',
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
                <Select
                    name={p.name || 'categoryId'}
                    label={p.label}
                    title={p.title || undefined}
                    options={Array.isArray(p.options) ? p.options : []}
                    optionsSource={typeof p.optionsSource === 'string' && p.optionsSource ? { path: p.optionsSource } : (p.optionsSource && typeof p.optionsSource === 'object' ? p.optionsSource : undefined)}
                    placeholderOption={p.placeholderOption === null ? null : (p.placeholderOption || undefined)}
                    required={p.required}
                    disabled={p.disabled}
                    readOnlyAfterSet={p.readOnlyAfterSet}
                    defaultValue={p.defaultValue || undefined}
                    feedback={p.feedback || undefined}
                    order={p.order && typeof p.order === 'object' ? p.order : undefined}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [roles, selectProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                bare
                title={t.sections.basicDropdown.title}
                description={t.sections.basicDropdown.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Select name="role" label={t.labels.role} options={roles} />
                        </Form>
                    </div>
                )}
                code={`import { Form, Select } from '@llmnative/react';

const ROLES = [
    { label: 'Admin',  value: 'admin'  },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];

<Form appearance="empty">
    <Select name="role" label="Role" options={ROLES} />
</Form>`}
            />

            <Section
                bare
                title={t.sections.requiredSelect.title}
                description={t.sections.requiredSelect.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Select name="country" label={t.labels.country} options={countries} required />
                        </Form>
                    </div>
                )}
                code={`<Form appearance="empty">
    <Select
        name="country"
        label="Country"
        options={COUNTRIES}
        required
    />
</Form>`}
            />

            <Section
                bare
                title={t.sections.noPlaceholderOption.title}
                description={t.sections.noPlaceholderOption.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Select
                                name="roleNoPlaceholder"
                                label={t.labels.role}
                                options={roles}
                                placeholderOption={null}
                            />
                        </Form>
                    </div>
                )}
                code={`<Form appearance="empty">
    <Select
        name="roleNoPlaceholder"
        label="Role"
        options={ROLES}
        placeholderOption={null}
    />
</Form>`}
            />

            <Section
                bare
                title={t.sections.readOnlyAfterSet.title}
                description={t.sections.readOnlyAfterSet.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Select
                                name="lockedRole"
                                label={t.labels.role}
                                options={roles}
                                defaultValue="editor"
                                readOnlyAfterSet
                            />
                        </Form>
                    </div>
                )}
                code={`<Form appearance="empty">
    <Select
        name="lockedRole"
        label="Role"
        options={ROLES}
        defaultValue="editor"
        readOnlyAfterSet
    />
</Form>`}
            />

            <Section
                bare
                title={t.sections.dataProviderBacked.title}
                description={t.sections.dataProviderBacked.description}
                preview={(
                    <div className="w-full max-w-md">
                        <Form appearance="empty">
                            <Select
                                name="categoryId"
                                label={t.labels.category}
                                optionsSource={{ path: '/showcase/categories' }}
                                defaultValue="ops"
                            />
                        </Form>
                    </div>
                )}
                code={`// Fetches records from the active DataProvider and maps them to options.
<Form appearance="empty">
    <Select
        name="categoryId"
        label="Category"
        optionsSource={{ path: '/showcase/categories' }}
        defaultValue="ops"
    />
</Form>`}
            />

            <PropDocsTable props={selectProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
