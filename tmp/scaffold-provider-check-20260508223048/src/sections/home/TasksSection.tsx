import React from 'react';
import EmptyState from '../../components/EmptyState';
import { mockData } from '../../data/mockData';

export default function TasksSection() {
  const tasks = mockData['/tasks'];

  if (!tasks.length) {
    return <EmptyState title="No tasks yet" description="Add your first dataset in src/data/mockData.ts." />;
  }

  return (
    <section className="grid gap-3 md:grid-cols-2">
      {tasks.map((task) => (
        <article key={task.id} className="rounded-md border bg-card p-4">
          <p className="text-sm font-medium">{task.title}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{task.status}</p>
        </article>
      ))}
    </section>
  );
}
    