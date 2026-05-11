import React from 'react';
import { Grid, Badge, Input, Select } from 'react-firestrap';

const stageOptions = [
    { label: 'Prospect',   value: 'prospect' },
    { label: 'Qualified',  value: 'qualified' },
    { label: 'Proposal',   value: 'proposal' },
    { label: 'Won',        value: 'won' },
    { label: 'Lost',       value: 'lost' },
];

const stageVariant: Record<string, string> = {
    prospect:  'secondary',
    qualified: 'info',
    proposal:  'warning',
    won:       'success',
    lost:      'danger',
};

export default function DealsPage() {
    return (
        <Grid
            dataStoragePath="/deals"
            columns={[
                { key: 'title',   label: 'Deal',    sort: true },
                { key: 'contact', label: 'Contact' },
                { key: 'value',   label: 'Value',
                    onDisplay: ({ value }) => `$ ${Number(value).toLocaleString()}`,
                },
                { key: 'stage',   label: 'Stage',
                    onDisplay: ({ value }) => (
                        <Badge variant={stageVariant[value] ?? 'secondary'}>{value}</Badge>
                    ),
                },
                { key: 'closedAt', label: 'Closed',
                    onDisplay: ({ value }) => value || '—',
                },
            ]}
            allowedActions={['add', 'edit', 'delete']}
            modal={{ mode: 'form' }}
            type="table"
            groupBy="stage"
            allowedSorting
            pagination={{ perPage: 25 }}
        >
            {() => (
                <>
                    <Input  name="title"    label="Deal title"  required />
                    <Input  name="contact"  label="Contact name" />
                    <Input  name="value"    label="Value ($)"   inputType="number" />
                    <Select name="stage"    label="Stage"       options={stageOptions} />
                    <Input  name="closedAt" label="Closed date" inputType="date" />
                </>
            )}
        </Grid>
    );
}
