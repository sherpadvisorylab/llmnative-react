import React from 'react';
import { Autocomplete, Form, Select, Checklist } from 'react-firestrap';
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

            <LiveForm
                title="Autocomplete"
                description="Uses a datalist and stores selected values as an array."
                code={`import { Autocomplete, Form } from 'react-firestrap';

<Form defaultValues={{ assignees: ['alice'] }}>
    <Autocomplete
        name="assignees"
        label="Assignees"
        placeholder="Type a person..."
        options={[
            { label: 'Alice', value: 'alice' },
            { label: 'Bob', value: 'bob' },
            { label: 'Carla', value: 'carla' },
        ]}
        max={3}
    />
</Form>`}
            >
                <Autocomplete
                    name="assignees"
                    label="Assignees"
                    placeholder="Type a person..."
                    options={[
                        { label: 'Alice', value: 'alice' },
                        { label: 'Bob', value: 'bob' },
                        { label: 'Carla', value: 'carla' },
                    ]}
                    max={3}
                />
            </LiveForm>

            <Section
                title="DataProvider-backed"
                description="Pass a db prop instead of options to fetch from the registered DataProvider. This demo uses the showcase MockDataProvider."
                preview={
                    <div className="w-full max-w-md">
                        <Form defaultValues={{ categoryId: 'ops' }}>
                            <Select
                                name="categoryId"
                                label="Category"
                                db={{ path: '/showcase/categories' }}
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, Select } from 'react-firestrap';

// Fetches { label, value } records from the active DataProvider.
<Form defaultValues={{ categoryId: 'ops' }}>
    <Select
        name="categoryId"
        label="Category"
        db={{ path: '/showcase/categories' }}
    />
</Form>`}
            />
        </PageLayout>
    );
}
