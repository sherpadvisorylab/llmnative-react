import React from 'react';
import { Grid, Badge, Input, Select, type BadgeType } from '@llmnative/react';

const statusOptions = [
    { label: 'To do', value: 'todo' },
    { label: 'In progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
];

const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
];

const priorityVariant: Record<string, BadgeType> = {
    low: 'secondary',
    medium: 'warning',
    high: 'danger',
};

const statusVariant: Record<string, BadgeType> = {
    todo: 'secondary',
    'in-progress': 'primary',
    done: 'success',
};

export default function TasksPage() {
    return (
        <Grid
            path="/tasks"
            columns={[
                { key: 'title', label: 'Task', sortable: true },
                { key: 'project', label: 'Project', sortable: true },
                { key: 'assignee', label: 'Assignee' },
                {
                    key: 'priority',
                    label: 'Priority',
                    render: ({ value }) => (
                        <Badge variant={priorityVariant[String(value)] ?? 'secondary'}>{String(value)}</Badge>
                    ),
                },
                {
                    key: 'status',
                    label: 'Status',
                    render: ({ value }) => (
                        <Badge variant={statusVariant[String(value)] ?? 'secondary'}>{String(value)}</Badge>
                    ),
                },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            groupBy="status"
            sortable
            pagination={{ limit: 25 }}
            form={() => (
                <>
                    <Input name="title" label="Task title" required />
                    <Input name="project" label="Project" />
                    <Input name="assignee" label="Assignee" />
                    <Select name="priority" label="Priority" options={priorityOptions} />
                    <Select name="status" label="Status" options={statusOptions} />
                </>
            )}
        />
    );
}
