import React from 'react';
import { Grid, Input } from '@llmnative/react';

export default function CategoriesPage() {
    return (
        <Grid
            dataStoragePath="/categories"
            columns={[
                { key: 'name', label: 'Category', sort: true },
                { key: 'slug', label: 'Slug' },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
            allowedSorting
        >
            {() => (
                <>
                    <Input name="name" label="Category name" required />
                    <Input name="slug" label="Slug (e.g. home-garden)" />
                </>
            )}
        </Grid>
    );
}
