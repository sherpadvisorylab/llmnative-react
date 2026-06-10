import React, { useState } from 'react';
import { UploadCSV } from '@llmnative/react';
import type { UploadCSVData } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';

function DataPreview({ data }: { data: UploadCSVData | null }) {
    if (!data) {
        return <p className="text-sm text-muted-foreground italic">No file loaded yet.</p>;
    }
    return (
        <div className="space-y-2 text-sm">
            <p className="font-medium">{data.file.name} — {data.data.length} rows, {data.fields.length} fields</p>
            <div className="overflow-auto max-h-48 rounded border">
                <table className="w-full text-xs">
                    <thead>
                        <tr>
                            {data.fields.map((f) => (
                                <th key={f} className="px-2 py-1 bg-muted text-left font-mono">{f}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.slice(0, 5).map((row, i) => (
                            <tr key={i} className="border-t">
                                {data.fields.map((f) => (
                                    <td key={f} className="px-2 py-1 font-mono">{String(row[f] ?? '')}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.data.length > 5 && (
                <p className="text-muted-foreground">…and {data.data.length - 5} more rows</p>
            )}
        </div>
    );
}

const PROPS_CONFIG: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name (used for data-name attribute)' },
    { name: 'onDataLoaded', type: 'UploadCSVDataLoadedHandler', required: true, description: 'Called with parsed CSV data, fields array, and original File' },
    { name: 'label', type: 'string', description: 'Visible label inside the drop zone', control: 'text' },
    { name: 'icon', type: 'string', default: '"upload"', description: 'Icon name shown in the drop zone', control: 'icon' },
    { name: 'delimiter', type: 'string', description: 'Column delimiter. Auto-detected when omitted.', control: 'text' },
    { name: 'normalizeKeys', type: 'boolean', default: 'false', description: 'Lowercase and slug-ify column header names', control: 'boolean' },
    { name: 'removeEmptyFields', type: 'boolean', default: 'false', description: 'Drop fields with empty / null values from each row', control: 'boolean' },
    { name: 'onParseField', type: 'UploadCSVParseFieldHandler', description: 'Transform each [key, value] pair during parse. Return undefined to drop the field.' },
    { name: 'className', type: 'string', description: 'CSS classes on the drop zone element', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROPS_CONFIG,
    defaultProps: { label: 'Drag or click to upload CSV', icon: 'upload', normalizeKeys: false, removeEmptyFields: false, delimiter: '', className: '', wrapperClassName: '' },
    render: (p) => {
        const [data, setData] = React.useState<UploadCSVData | null>(null);
        return (
            <div className="space-y-4 w-full">
                <UploadCSV
                    name="csv-demo"
                    label={p.label || undefined}
                    icon={p.icon || 'upload'}
                    normalizeKeys={p.normalizeKeys}
                    removeEmptyFields={p.removeEmptyFields}
                    delimiter={p.delimiter || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                    onDataLoaded={setData}
                />
                <DataPreview data={data} />
            </div>
        );
    },
};

export default function UploadCSVPage() {
    usePlayground(PLAYGROUND, 'UploadCSV');

    const [parsed, setParsed] = useState<UploadCSVData | null>(null);

    return (
        <PageLayout
            title="UploadCSV"
            description="Drag-and-drop or click-to-browse CSV/TSV uploader. Parses with PapaParse and returns typed row data via onDataLoaded."
        >
            <Section
                title="Basic CSV upload"
                description="Drop a CSV file onto the zone or click to browse. The parsed rows and field names are delivered to onDataLoaded."
                preview={
                    <div className="space-y-4 w-full">
                        <UploadCSV
                            name="csv-basic"
                            label="Drag or click to upload CSV"
                            onDataLoaded={setParsed}
                        />
                        <DataPreview data={parsed} />
                    </div>
                }
                code={`import { UploadCSV } from '@llmnative/react';
import type { UploadCSVData } from '@llmnative/react';

function MyPage() {
    const [csvData, setCsvData] = useState<UploadCSVData | null>(null);

    return (
        <UploadCSV
            name="import"
            label="Drag or click to upload CSV"
            onDataLoaded={setCsvData}
        />
    );
}`}
            />

            <Section
                title="Normalized keys + empty field removal"
                description="normalizeKeys slug-ifies column headers. removeEmptyFields drops cells with null/empty values."
                preview={
                    <div className="alert alert-info text-sm space-y-1">
                        <p><code className="font-mono">normalizeKeys</code> turns <em>First Name</em> → <em>first_name</em>.</p>
                        <p><code className="font-mono">removeEmptyFields</code> drops columns that are blank for a row.</p>
                    </div>
                }
                code={`<UploadCSV
    name="import"
    normalizeKeys
    removeEmptyFields
    onDataLoaded={(result) => {
        console.log(result.fields);  // ['first_name', 'last_name', ...]
        console.log(result.data);    // rows with empty values stripped
    }}
/>`}
            />

            <Section
                title="Custom field transform"
                description="Use onParseField to intercept each [key, value] pair. Return the pair (optionally modified) or undefined to drop the field."
                preview={
                    <div className="alert alert-info text-sm">
                        Return <code className="font-mono">undefined</code> to drop a field, or return a new <code className="font-mono">[key, value]</code> tuple to rename/cast.
                    </div>
                }
                code={`<UploadCSV
    name="import"
    onParseField={([key, value]) => {
        if (key === 'internal_id') return undefined;         // drop column
        if (key === 'price') return [key, Number(value)];   // cast to number
        return [key, value];
    }}
    onDataLoaded={handleData}
/>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
