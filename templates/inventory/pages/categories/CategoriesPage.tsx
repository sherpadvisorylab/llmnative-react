import React from 'react';
import { Grid, Input } from '@llmnative/react';

export default function CategoriesPage() {
    return (
        <Grid
            path="/categories"
            columns={[
                { key: 'name', label: 'Category', sortable: true },
                { key: 'slug', label: 'Slug' },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
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
