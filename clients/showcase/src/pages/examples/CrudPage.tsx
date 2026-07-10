import React from 'react';
import { MockDataProvider, DataProvider, GridDB, Form, Input, Select, Badge } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { Section } from '../../docs-kit/page';
import { useShowcaseCrudI18n, useShowcaseCommonI18n } from '../../showcase/i18n';

interface Product { id?: string; name: string; price: number; category: string; inStock: boolean; }

const PRODUCTS: Product[] = [
    { id: '1', name: 'Laptop Pro', price: 2499, category: 'electronics', inStock: true },
    { id: '2', name: 'Wireless Mouse', price: 49, category: 'electronics', inStock: true },
    { id: '3', name: 'Ergonomic Chair', price: 899, category: 'furniture', inStock: true },
    { id: '4', name: 'Desk Lamp', price: 129, category: 'furniture', inStock: false },
    { id: '5', name: 'Notebook Set', price: 19, category: 'office', inStock: true },
    { id: '6', name: 'Coffee Maker', price: 79, category: 'kitchen', inStock: true },
];

const PRODUCT_SEED = Object.fromEntries(PRODUCTS.map((p) => [p.id!, { ...p }]));
const mockProvider = new MockDataProvider({ '/products': PRODUCT_SEED });

function WithMock({ children, provider }: { children: React.ReactNode; provider?: MockDataProvider }) {
    const scoped = React.useMemo(() => provider ?? mockProvider, [provider]);
    return <DataProvider registry={{ default: scoped }} defaultKey="default">{children}</DataProvider>;
}

function ProductForm() {
    return (
        <Form path="/products" defaultValues={{ category: 'electronics', inStock: true }}>
            <Input name="name" label="Product name" required />
            <Input name="price" label="Price" inputType="number" required />
            <Select name="category" label="Category" options={[
                { label: 'Electronics', value: 'electronics' },
                { label: 'Furniture', value: 'furniture' },
                { label: 'Office', value: 'office' },
                { label: 'Kitchen', value: 'kitchen' },
            ]} />
            <Select name="inStock" label="In stock" options={[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
            ]} />
        </Form>
    );
}

const CRUD_CODE = `import { GridDB, Form, Input, Select, Badge } from '@llmnative/react'

<GridDB
  path="/products"
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'price', label: 'Price', render: ({ value }) => \`€ \${value}\` },
    { key: 'category', label: 'Category' },
    { key: 'inStock', label: 'Stock', render: ({ value }) =>
      <Badge variant={value ? 'success' : 'danger'}>{value ? 'In stock' : 'Out'}</Badge> },
  ]}
  actions={['add', 'edit', 'delete']}
  form={<ProductForm />}
  pagination={{ limit: 5 }}
/>`;

const DATA_CODE = `const products = [
  { id: '1', name: 'Laptop Pro', price: 2499, category: 'electronics', inStock: true },
  { id: '2', name: 'Wireless Mouse', price: 49, category: 'electronics', inStock: true },
  // ...
];`;

const PROVIDER_CODE = `const provider = new MockDataProvider({ '/products': PRODUCT_SEED });

<DataProvider registry={{ default: provider }} defaultKey="default">
  <GridDB path="/products" ... />
</DataProvider>`;

export default function CrudPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseCrudI18n();
    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.data.title}
                description={t.sections.data.description}
                code={DATA_CODE}
            />
            <Section
                title={t.sections.providerSetup.title}
                description={t.sections.providerSetup.description}
                code={PROVIDER_CODE}
            />
            <Section
                title={t.sections.fullCrud.title}
                description={t.sections.fullCrud.description}
                preview={
                    <WithMock>
                        <div className="space-y-4">
                            <GridDB
                                path="/products"
                                columns={[
                                    { key: 'name', label: 'Name', sortable: true },
                                    { key: 'price', label: 'Price', render: ({ value }) => `€ ${value}` },
                                    { key: 'category', label: 'Category' },
                                    { key: 'inStock', label: 'Stock', render: ({ value }) =>
                                        <Badge variant={value ? 'success' : 'danger'}>{value ? 'In stock' : 'Out'}</Badge> },
                                ]}
                                actions={['add', 'edit', 'delete']}
                                form={<ProductForm />}
                                pagination={{ limit: 5 }}
                            />
                        </div>
                    </WithMock>
                }
                code={CRUD_CODE}
            />
        </PageLayout>
    );
}
