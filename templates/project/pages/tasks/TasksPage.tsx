import React from 'react';
import { Grid, Badge, Input, Select } from '@llmnative/react';

const statusOptions = [
    { label: 'To do',       value: 'todo' },
    { label: 'In progress', value: 'in-progress' },
    { label: 'Done',        value: 'done' },
];

const priorityOptions = [
    { label: 'Low',    value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High',   value: 'high' },
];

const priorityVariant: Record<string, string> = {
    low:    'secondary',
    medium: 'warning',
    high:   'danger',
};

const statusVariant: Record<string, string> = {
    'todo':        'secondary',
    'in-progress': 'primary',
    'done':        'success',
};

export default function TasksPage() {
    return (
        <Grid
            dataStoragePath="/tasks"
            columns={[
                { key: 'title',    label: 'Task',     sort: true },
                { key: 'project',  label: 'Project',  sort: true },
                { key: 'assignee', label: 'Assignee' },
                { key: 'priority', label: 'Priority',
                    onDisplay: ({ value }) => (
                        <Badge variant={priorityVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
                { key: 'status',   label: 'Status',
                    onDisplay: ({ value }) => (
                        <Badge variant={statusVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
            groupBy="status"
            allowedSorting
            pagination={{ perPage: 25 }}
        >
            {() => (
                <>
                    <Input  name="title"    label="Task title"  required />
                    <Input  name="project"  label="Project" />
                    <Input  name="assignee" label="Assignee" />
                    <Select name="priority" label="Priority"    options={priorityOptions} />
                    <Select name="status"   label="Status"      options={statusOptions} />
                </>
            )}
        </Grid>
    );
}
