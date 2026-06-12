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
            <p className="font-medium">{data.file.name} - {data.data.length} rows, {data.fields.length} fields</p>
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
                <p className="text-muted-foreground">...and {data.data.length - 5} more rows</p>
            )}
        </div>
    );
}

const PROPS_CONFIG: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used for the wrapper data-name attribute' },
    { name: 'onDataLoaded', type: 'UploadCSVDataLoadedHandler', required: true, description: 'Called with parsed rows, header fields and the original File after a successful parse' },
    { name: 'onClear', type: '() => void', description: 'Called when the loaded file is removed from the component UI' },
    { name: 'label', type: 'string', description: 'Label rendered above the drop zone', control: 'text' },
    { name: 'icon', type: 'string', default: '"upload"', description: 'Icon name shown inside the drop zone', control: 'icon' },
    { name: 'delimiter', type: 'string', description: 'Optional delimiter passed to PapaParse. When omitted, PapaParse auto-detects it.', control: 'text' },
    { name: 'normalizeKeys', type: 'boolean', default: 'false', description: 'Normalize header names with normalizeKey before exposing them in fields and row objects', control: 'boolean' },
    { name: 'removeEmptyFields', type: 'boolean', default: 'false', description: 'Drop row entries whose parsed value is empty string or null', control: 'boolean' },
    { name: 'onParseField', type: 'UploadCSVParseFieldHandler', description: 'Transform or drop each [key, value] pair during parsing. Return undefined to omit the field.' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the uploader inside the outer wrapper' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the uploader inside the outer wrapper' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the inner uploader container', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes applied to the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROPS_CONFIG,
    defaultProps: {
        label: 'Drag or click to upload CSV',
        icon: 'upload',
        normalizeKeys: false,
        removeEmptyFields: false,
        delimiter: '',
        className: '',
        wrapperClassName: '',
    },
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
                    onClear={() => setData(null)}
                />
                <DataPreview data={data} />
            </div>
        );
    },
};

function NormalizeSection() {
    const [data, setData] = useState<UploadCSVData | null>(null);

    return (
        <div className="space-y-4 w-full">
            <UploadCSV
                name="csv-normalize"
                label="Upload CSV to see normalized keys"
                normalizeKeys
                removeEmptyFields
                onDataLoaded={setData}
                onClear={() => setData(null)}
            />
            <DataPreview data={data} />
        </div>
    );
}

function TransformSection() {
    const [data, setData] = useState<UploadCSVData | null>(null);

    return (
        <div className="space-y-4 w-full">
            <UploadCSV
                name="csv-transform"
                label="Upload CSV - columns starting with _ will be dropped"
                onParseField={([key, value]) =>
                    key.startsWith('_') ? undefined : [key, value]
                }
                onDataLoaded={setData}
                onClear={() => setData(null)}
            />
            <DataPreview data={data} />
        </div>
    );
}

export default function UploadCSVPage() {
    usePlayground(PLAYGROUND, 'UploadCSV');

    const [parsed, setParsed] = useState<UploadCSVData | null>(null);

    return (
        <PageLayout
            title="UploadCSV"
            description="Single-file CSV or TSV uploader with drag-and-drop, PapaParse integration and preview-friendly parsed output delivered through onDataLoaded."
        >
            <Section
                title="Basic CSV upload"
                description="Drop a CSV or TSV file onto the zone or click to browse. After parsing, the component switches into a loaded state and exposes rows, headers and the original File through onDataLoaded."
                preview={
                    <div className="space-y-4 w-full">
                        <UploadCSV
                            name="csv-basic"
                            label="Drag or click to upload CSV"
                            onDataLoaded={setParsed}
                            onClear={() => setParsed(null)}
                        />
                        <DataPreview data={parsed} />
                    </div>
                }
                code={`import { useState } from 'react';
import { UploadCSV } from '@llmnative/react';
import type { UploadCSVData } from '@llmnative/react';

function MyPage() {
  const [csvData, setCsvData] = useState<UploadCSVData | null>(null);

  return (
    <UploadCSV
      name="import"
      label="Drag or click to upload CSV"
      onDataLoaded={setCsvData}
      onClear={() => setCsvData(null)}
    />
  );
}`}
            />

            <Section
                title="Normalized keys + empty field removal"
                description="normalizeKeys transforms header names before they are exposed in fields and row objects. removeEmptyFields strips entries whose value is empty string or null from each parsed row."
                preview={<NormalizeSection />}
                code={`<UploadCSV
  name="import"
  normalizeKeys
  removeEmptyFields
  onDataLoaded={(result) => {
    console.log(result.fields); // ['first_name', 'last_name', ...]
    console.log(result.data);   // rows without empty string / null entries
  }}
/>`}
            />

            <Section
                title="Custom field transform"
                description="Use onParseField to intercept each parsed [key, value] pair. Return a modified pair to keep it, or undefined to drop that field from the final row object."
                preview={<TransformSection />}
                code={`<UploadCSV
  name="import"
  onParseField={([key, value]) => {
    if (key === 'internal_id') return undefined;
    if (key === 'price') return [key, Number(value)];
    return [key, value];
  }}
  onDataLoaded={handleData}
/>`}
            />

            <Section
                title="Custom delimiter"
                description="Pass delimiter when the file does not use PapaParse auto-detection reliably, for example semicolon-separated exports from spreadsheet tools."
                preview={
                    <div className="space-y-4 w-full">
                        <UploadCSV
                            name="csv-semicolon"
                            label="Upload semicolon-separated CSV"
                            delimiter=";"
                            onDataLoaded={() => undefined}
                        />
                    </div>
                }
                code={`<UploadCSV
  name="import"
  label="Upload semicolon-separated CSV"
  delimiter=";"
  onDataLoaded={handleData}
/>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
