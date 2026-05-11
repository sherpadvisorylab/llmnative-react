import React from 'react';
import { Grid, Input, Select } from 'react-firestrap';

const industryOptions = [
    { label: 'Technology',    value: 'Technology' },
    { label: 'Manufacturing', value: 'Manufacturing' },
    { label: 'IT Services',   value: 'IT Services' },
    { label: 'Pharma',        value: 'Pharma' },
    { label: 'Finance',       value: 'Finance' },
    { label: 'Retail',        value: 'Retail' },
    { label: 'Other',         value: 'Other' },
];

export default function CompaniesPage() {
    return (
        <Grid
            dataStoragePath="/companies"
            columns={[
                { key: 'name',      label: 'Company',   sort: true },
                { key: 'industry',  label: 'Industry',  sort: true },
                { key: 'website',   label: 'Website' },
                { key: 'employees', label: 'Employees',
                    onDisplay: ({ value }) => value ? Number(value).toLocaleString() : '—',
                },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
            allowedSorting
            pagination={{ perPage: 20 }}
        >
            {() => (
                <>
                    <Input  name="name"      label="Company name" required />
                    <Select name="industry"  label="Industry"     options={industryOptions} />
                    <Input  name="website"   label="Website" />
                    <Input  name="employees" label="Employees"    inputType="number" />
                </>
            )}
        </Grid>
    );
}
