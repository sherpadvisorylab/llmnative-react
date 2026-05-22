import React from 'react';
import { Grid, Badge, Input, Select } from '@ash/react';

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
            dataStoragePath="/contacts"
            columns={[
                { key: 'name',    label: 'Name',    sort: true },
                { key: 'email',   label: 'Email' },
                { key: 'company', label: 'Company', sort: true },
                { key: 'phone',   label: 'Phone' },
                { key: 'status',  label: 'Status',
                    onDisplay: ({ value }) => (
                        <Badge variant={statusVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
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
                    <Input name="name"    label="Full name"   required />
                    <Input name="email"   label="Email"       inputType="email" />
                    <Input name="phone"   label="Phone" />
                    <Input name="company" label="Company" />
                    <Select name="status" label="Status" options={statusOptions} />
                </>
            )}
        </Grid>
    );
}
