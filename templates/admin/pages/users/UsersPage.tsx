import React from 'react';
import { Grid, Badge, Input, Select } from '@llmnative/react';

const roleOptions = [
    { label: 'Administrator', value: 'admin' },
    { label: 'Editor',        value: 'editor' },
    { label: 'Viewer',        value: 'viewer' },
];

const statusOptions = [
    { label: 'Active',   value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

const roleVariant: Record<string, string> = {
    admin:  'danger',
    editor: 'primary',
    viewer: 'secondary',
};

export default function UsersPage() {
    return (
        <Grid
            path="/users"
            columns={[
                { key: 'name',      label: 'Name',    sortable: true },
                { key: 'email',     label: 'Email' },
                { key: 'role',      label: 'Role',
                    render: ({ value }) => (
                        <Badge variant={roleVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
                { key: 'status',    label: 'Status',
                    render: ({ value }) => (
                        <Badge variant={value === 'active' ? 'success' : 'secondary'}>{value}</Badge>
                    ),
                },
                { key: 'createdAt', label: 'Created', render: 'date' },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
            pagination={{ limit: 25 }}
        >
            {() => (
                <>
                    <Input  name="name"   label="Full name" required />
                    <Input  name="email"  label="Email"     inputType="email" required />
                    <Select name="role"   label="Role"      options={roleOptions} />
                    <Select name="status" label="Status"    options={statusOptions} />
                </>
            )}
        </Grid>
    );
}
