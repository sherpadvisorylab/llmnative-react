import React from 'react';
import { Grid, Badge, Input, Select } from '@ash/react';

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
            dataStoragePath="/users"
            columns={[
                { key: 'name',      label: 'Name',    sort: true },
                { key: 'email',     label: 'Email' },
                { key: 'role',      label: 'Role',
                    onDisplay: ({ value }) => (
                        <Badge variant={roleVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
                { key: 'status',    label: 'Status',
                    onDisplay: ({ value }) => (
                        <Badge variant={value === 'active' ? 'success' : 'secondary'}>{value}</Badge>
                    ),
                },
                { key: 'createdAt', label: 'Created', onDisplay: 'toDate' },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
            allowedSorting
            pagination={{ perPage: 25 }}
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
