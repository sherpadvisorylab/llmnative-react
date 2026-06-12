import React from 'react';
import { Grid, Input } from '@llmnative/react';

export default function TeamPage() {
    return (
        <Grid
            path="/team"
            columns={[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'role', label: 'Role' },
                { key: 'email', label: 'Email' },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
        >
            {() => (
                <>
                    <Input name="name" label="Full name" required />
                    <Input name="role" label="Role" />
                    <Input name="email" label="Email" inputType="email" />
                </>
            )}
        </Grid>
    );
}
