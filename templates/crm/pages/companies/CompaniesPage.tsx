import React from 'react';
import { Grid, Input, Select } from '@llmnative/react';

const industryOptions = [
    { label: 'Technology', value: 'Technology' },
    { label: 'Manufacturing', value: 'Manufacturing' },
    { label: 'IT Services', value: 'IT Services' },
    { label: 'Pharma', value: 'Pharma' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Retail', value: 'Retail' },
    { label: 'Other', value: 'Other' },
];

export default function CompaniesPage() {
    return (
        <Grid
            path="/companies"
            columns={[
                { key: 'name', label: 'Company', sortable: true },
                { key: 'industry', label: 'Industry', sortable: true },
                { key: 'website', label: 'Website' },
                {
                    key: 'employees',
                    label: 'Employees',
                    render: ({ value }) => value ? Number(value).toLocaleString() : '-',
                },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
            pagination={{ limit: 20 }}
        >
            {() => (
                <>
                    <Input name="name" label="Company name" required />
                    <Select name="industry" label="Industry" options={industryOptions} />
                    <Input name="website" label="Website" />
                    <Input name="employees" label="Employees" inputType="number" />
                </>
            )}
        </Grid>
    );
}
