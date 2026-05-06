import React from 'react';
import { Form, Select, Checklist } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

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

const TAGS = [
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Firebase', value: 'firebase' },
    { label: 'Tailwind', value: 'tailwind' },
    { label: 'Node.js', value: 'nodejs' },
];

function LiveForm({ children, title, description, code }: {
    children: React.ReactNode;
    title: string;
    description?: string;
    code: string;
}) {
    return (
        <Section
            title={title}
            description={description}
            preview={
                <div className="w-full max-w-md">
                    <Form defaultValues={{}}>
                        {children}
                    </Form>
                </div>
            }
            code={code}
        />
    );
}

export default function SelectPage() {
    return (
        <PageLayout
            title="Select"
            description="Dropdown, multi-select checklist and autocomplete variants. Options can be static arrays or pulled from a DataProvider at runtime."
        >
            <LiveForm
                title="Basic dropdown"
                description="Static options array — the simplest usage."
                code={`import { Form, Select } from 'react-firestrap';

const ROLES = [
    { label: 'Admin',  value: 'admin'  },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
];

<Form defaultValues={{}}>
    <Select name="role" label="Role" options={ROLES} />
</Form>`}
            >
                <Select name="role" label="Role" options={ROLES} />
            </LiveForm>

            <LiveForm
                title="Required select"
                code={`<Select
    name="country"
    label="Country"
    options={COUNTRIES}
    required
/>`}
            >
                <Select name="country" label="Country" options={COUNTRIES} required />
            </LiveForm>

            <LiveForm
                title="Checklist — multi-select"
                description="Renders a vertical list of checkboxes. Selected values are stored as an array."
                code={`import { Checklist } from 'react-firestrap';

<Checklist
    name="tags"
    label="Technologies"
    options={TAGS}
/>`}
            >
                <Checklist name="tags" label="Technologies" options={TAGS} />
            </LiveForm>

            <Section
                title="DataProvider-backed (runtime data)"
                description="Pass a db prop instead of options to fetch from your registered DataProvider. The component subscribes to real-time updates automatically."
                preview={
                    <div className="text-sm text-muted-foreground italic p-4">
                        Requires a DataProvider context with a collection at the given path.
                        Use the Grid/Form demo below for a live DataProvider example.
                    </div>
                }
                code={`import { Form, Select } from 'react-firestrap';

// Fetches { label: record.name, value: record._key } from /categories
<Form dataStoragePath="/products/prod_1">
    <Select
        name="categoryId"
        label="Category"
        db={{ path: '/categories', labelField: 'name', valueField: '_key' }}
    />
</Form>`}
            />
        </PageLayout>
    );
}
