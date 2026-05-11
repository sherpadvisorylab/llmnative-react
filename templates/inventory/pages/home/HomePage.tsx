import React from 'react';
import { mockData } from '../../data/mockData';

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
    return (
        <div className="rounded-lg border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}

export default function HomePage() {
    const products = Object.values(mockData['/products']);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return (
        <div className="mx-auto max-w-5xl space-y-8 px-2 py-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Inventory</h1>
                <p className="text-sm text-muted-foreground">Stock overview across all categories.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Products"    value={products.length} />
                <StatCard label="Total stock" value={totalStock.toLocaleString()} sub="units" />
                <StatCard label="Out of stock" value={outOfStock} sub="products" />
                <StatCard label="Stock value" value={`$ ${(totalValue / 100).toLocaleString()}`} />
            </div>
        </div>
    );
}
