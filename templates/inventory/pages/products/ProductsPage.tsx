import React from 'react';
import { Grid, Badge, Input, Select } from '@llmnative/react';

const categoryOptions = [
    { label: 'Electronics', value: 'Electronics' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Home & Garden', value: 'Home & Garden' },
    { label: 'Sports', value: 'Sports' },
];

export default function ProductsPage() {
    return (
        <Grid
            path="/products"
            columns={[
                { key: 'name', label: 'Product', sortable: true },
                { key: 'sku', label: 'SKU' },
                { key: 'category', label: 'Category', sortable: true },
                {
                    key: 'price',
                    label: 'Price',
                    render: ({ value }) => `$ ${(Number(value) / 100).toFixed(2)}`,
                },
                {
                    key: 'stock',
                    label: 'Stock',
                    render: ({ value }) => (
                        <Badge variant={Number(value) === 0 ? 'danger' : Number(value) < 10 ? 'warning' : 'success'}>
                            {value}
                        </Badge>
                    ),
                },
                {
                    key: 'active',
                    label: 'Active',
                    render: ({ value }) => (
                        <Badge variant={value ? 'success' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
                    ),
                },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
            pagination={{ limit: 25 }}
            onLoad={(data) => ({ ...data, price: data.price ? data.price / 100 : 0 })}
            onSave={async ({ record }) => ({ ...record, price: Math.round(record.price * 100) })}
        >
            {() => (
                <>
                    <Input name="name" label="Product name" required />
                    <Input name="sku" label="SKU" />
                    <Select name="category" label="Category" options={categoryOptions} />
                    <Input name="price" label="Price ($)" inputType="number" />
                    <Input name="stock" label="Stock (units)" inputType="number" />
                </>
            )}
        </Grid>
    );
}
