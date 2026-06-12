import React from 'react';
import { Grid, Badge, Input, Select } from '@llmnative/react';

const stageOptions = [
    { label: 'Prospect', value: 'prospect' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Proposal', value: 'proposal' },
    { label: 'Won', value: 'won' },
    { label: 'Lost', value: 'lost' },
];

const stageVariant: Record<string, string> = {
    prospect: 'secondary',
    qualified: 'info',
    proposal: 'warning',
    won: 'success',
    lost: 'danger',
};

export default function DealsPage() {
    return (
        <Grid
            path="/deals"
            columns={[
                { key: 'title', label: 'Deal', sortable: true },
                { key: 'contact', label: 'Contact' },
                {
                    key: 'value',
                    label: 'Value',
                    render: ({ value }) => `$ ${Number(value).toLocaleString()}`,
                },
                {
                    key: 'stage',
                    label: 'Stage',
                    render: ({ value }) => (
                        <Badge variant={stageVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
                {
                    key: 'closedAt',
                    label: 'Closed',
                    render: ({ value }) => value || '-',
                },
            ]}
            actions={['add', 'edit', 'delete']}
            view="table"
            groupBy="stage"
            sortable
            pagination={{ limit: 25 }}
        >
            {() => (
                <>
                    <Input name="title" label="Deal title" required />
                    <Input name="contact" label="Contact name" />
                    <Input name="value" label="Value ($)" inputType="number" />
                    <Select name="stage" label="Stage" options={stageOptions} />
                    <Input name="closedAt" label="Closed date" inputType="date" />
                </>
            )}
        </Grid>
    );
}
