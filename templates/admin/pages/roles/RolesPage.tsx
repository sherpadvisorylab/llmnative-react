import React from 'react';
import { Grid, Input } from '@llmnative/react';

export default function RolesPage() {
    return (
        <Grid
            path="/roles"
            columns={[
                { key: 'name', label: 'Key', sortable: true },
                { key: 'label', label: 'Display name' },
                { key: 'description', label: 'Description' },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
        >
            {() => (
                <>
                    <Input name="name" label="Key (e.g. editor)" required />
                    <Input name="label" label="Display name" required />
                    <Input name="description" label="Description" />
                </>
            )}
        </Grid>
    );
}
