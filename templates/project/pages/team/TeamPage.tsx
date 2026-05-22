import React from 'react';
import { Grid, Input } from '@ash/react';

export default function TeamPage() {
    return (
        <Grid
            dataStoragePath="/team"
            columns={[
                { key: 'name',  label: 'Name',  sort: true },
                { key: 'role',  label: 'Role' },
                { key: 'email', label: 'Email' },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
            allowedSorting
        >
            {() => (
                <>
                    <Input name="name"  label="Full name" required />
                    <Input name="role"  label="Role" />
                    <Input name="email" label="Email" inputType="email" />
                </>
            )}
        </Grid>
    );
}
