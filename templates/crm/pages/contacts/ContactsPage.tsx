import React from 'react';
import { Grid, Badge, Input, Select } from '@llmnative/react';

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Lead', value: 'lead' },
];

const statusVariant: Record<string, string> = {
    active: 'success',
    inactive: 'secondary',
    lead: 'warning',
};

export default function ContactsPage() {
    return (
        <Grid
            path="/contacts"
            columns={[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'email', label: 'Email' },
                { key: 'company', label: 'Company', sortable: true },
                { key: 'phone', label: 'Phone' },
                {
                    key: 'status',
                    label: 'Status',
                    render: ({ value }) => (
                        <Badge variant={statusVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
            pagination={{ limit: 20 }}
        >
            {() => (
                <>
                    <Input name="name" label="Full name" required />
                    <Input name="email" label="Email" inputType="email" />
                    <Input name="phone" label="Phone" />
                    <Input name="company" label="Company" />
                    <Select name="status" label="Status" options={statusOptions} />
                </>
            )}
        </Grid>
    );
}
