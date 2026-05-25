import React from 'react';
import { Grid, Input } from '@llmnative/react';

export default function RolesPage() {
    return (
        <Grid
            dataStoragePath="/roles"
            columns={[
                { key: 'name',        label: 'Key',         sort: true },
                { key: 'label',       label: 'Display name' },
                { key: 'description', label: 'Description' },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
        >
            {() => (
                <>
                    <Input name="name"        label="Key (e.g. editor)"   required />
                    <Input name="label"       label="Display name"        required />
                    <Input name="description" label="Description" />
                </>
            )}
        </Grid>
    );
}
