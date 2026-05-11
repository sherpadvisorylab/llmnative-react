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
    const projects = Object.values(mockData['/projects']);
    const tasks = Object.values(mockData['/tasks']);

    return (
        <div className="mx-auto max-w-5xl space-y-8 px-2 py-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Project overview</h1>
                <p className="text-sm text-muted-foreground">Track projects, tasks and team progress.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Projects"    value={projects.length} />
                <StatCard label="Active"      value={projects.filter(p => p.status === 'active').length} sub="projects" />
                <StatCard label="Open tasks"  value={tasks.filter(t => t.status !== 'done').length} />
                <StatCard label="Completed"   value={tasks.filter(t => t.status === 'done').length} sub="tasks" />
            </div>
        </div>
    );
}
