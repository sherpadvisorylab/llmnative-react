import React from 'react';
import { Grid, Badge, Input, Select, type BadgeType } from '@llmnative/react';

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Lead', value: 'lead' },
];

const statusVariant: Record<string, BadgeType> = {
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
                        <Badge variant={statusVariant[String(value)] ?? 'secondary'}>{String(value)}</Badge>
                    ),
                },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
            pagination={{ limit: 20 }}
            form={
                <>
                    <Input name="name" label="Full name" required />
                    <Input name="email" label="Email" type="email" />
                    <Input name="phone" label="Phone" />
                    <Input name="company" label="Company" />
                    <Select name="status" label="Status" options={statusOptions} />
                </>
            }
        />
    );
}
