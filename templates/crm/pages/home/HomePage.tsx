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
    const contacts = Object.values(mockData['/contacts']);
    const deals = Object.values(mockData['/deals']);
    const openDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
    const pipeline = openDeals.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="mx-auto max-w-5xl space-y-8 px-2 py-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Overview of your CRM activity.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Contacts" value={contacts.length} />
                <StatCard label="Active" value={contacts.filter(c => c.status === 'active').length} sub="active contacts" />
                <StatCard label="Open deals" value={openDeals.length} />
                <StatCard label="Pipeline" value={`$ ${pipeline.toLocaleString()}`} sub="total open value" />
            </div>
        </div>
    );
}
