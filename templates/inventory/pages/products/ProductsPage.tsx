import React from 'react';
import { Grid, Badge, Input, Select } from 'react-firestrap';

const categoryOptions = [
    { label: 'Electronics',   value: 'Electronics' },
    { label: 'Clothing',      value: 'Clothing' },
    { label: 'Home & Garden', value: 'Home & Garden' },
    { label: 'Sports',        value: 'Sports' },
];

export default function ProductsPage() {
    return (
        <Grid
            dataStoragePath="/products"
            columns={[
                { key: 'name',     label: 'Product',  sort: true },
                { key: 'sku',      label: 'SKU' },
                { key: 'category', label: 'Category', sort: true },
                { key: 'price',    label: 'Price',
                    onDisplay: ({ value }) => `$ ${(Number(value) / 100).toFixed(2)}`,
                },
                { key: 'stock',    label: 'Stock',
                    onDisplay: ({ value }) => (
                        <Badge variant={Number(value) === 0 ? 'danger' : Number(value) < 10 ? 'warning' : 'success'}>
                            {value}
                        </Badge>
                    ),
                },
                { key: 'active',   label: 'Active',
                    onDisplay: ({ value }) => (
                        <Badge variant={value ? 'success' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
                    ),
                },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
            allowedSorting
            pagination={{ perPage: 25 }}
            onLoad={(data) => ({ ...data, price: data.price ? data.price / 100 : 0 })}
            onSave={async ({ record }) => ({ ...record, price: Math.round(record.price * 100) })}
        >
            {() => (
                <>
                    <Input  name="name"     label="Product name" required />
                    <Input  name="sku"      label="SKU" />
                    <Select name="category" label="Category"     options={categoryOptions} />
                    <Input  name="price"    label="Price ($)"    inputType="number" />
                    <Input  name="stock"    label="Stock (units)"inputType="number" />
                </>
            )}
        </Grid>
    );
}
