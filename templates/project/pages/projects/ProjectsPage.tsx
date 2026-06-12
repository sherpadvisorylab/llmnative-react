import React from 'react';
import { Grid, Badge, Input, Select } from '@llmnative/react';

const statusOptions = [
    { label: 'Planning', value: 'planning' },
    { label: 'Active', value: 'active' },
    { label: 'On hold', value: 'on-hold' },
    { label: 'Done', value: 'done' },
];

const statusVariant: Record<string, string> = {
    planning: 'secondary',
    active: 'primary',
    'on-hold': 'warning',
    done: 'success',
};

export default function ProjectsPage() {
    return (
        <Grid
            path="/projects"
            columns={[
                { key: 'name', label: 'Project', sortable: true },
                { key: 'owner', label: 'Owner' },
                {
                    key: 'status',
                    label: 'Status',
                    render: ({ value }) => (
                        <Badge variant={statusVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
                { key: 'deadline', label: 'Deadline' },
                { key: 'description', label: 'Description' },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            sortable
            pagination={{ limit: 20 }}
        >
            {() => (
                <>
                    <Input name="name" label="Project name" required />
                    <Input name="owner" label="Owner" />
                    <Select name="status" label="Status" options={statusOptions} />
                    <Input name="deadline" label="Deadline" inputType="date" />
                    <Input name="description" label="Description" />
                </>
            )}
        </Grid>
    );
}
