import React from 'react';
import { Grid } from '@llmnative/react';

export default function HomePage() {
    return (
        <div className="mx-auto max-w-5xl space-y-8 px-2 py-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Welcome to [projectname]</h1>
                <p className="text-sm text-muted-foreground">
                    Scaffolded with LLM Native. Edit this page at <code>src/pages/home/HomePage.tsx</code>.
                </p>
            </div>

            <Grid
                dataStoragePath="/tasks"
                columns={[
                    { key: 'title', label: 'Task' },
                    { key: 'status', label: 'Status' },
                ]}
                allowedActions={['add', 'edit', 'delete']}
                modal={{ mode: 'form' }}
                type="table"
            />
        </div>
    );
}
