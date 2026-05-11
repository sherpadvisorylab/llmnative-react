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
    const users = Object.values(mockData['/users']);
    const roles = Object.values(mockData['/roles']);

    return (
        <div className="mx-auto max-w-5xl space-y-8 px-2 py-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Admin panel</h1>
                <p className="text-sm text-muted-foreground">System overview and management.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Total users" value={users.length} />
                <StatCard label="Active users" value={users.filter(u => u.status === 'active').length} />
                <StatCard label="Roles defined" value={roles.length} />
            </div>
        </div>
    );
}
