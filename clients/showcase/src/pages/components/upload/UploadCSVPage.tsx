import React, { useState } from 'react';
import { UploadCSV } from '@llmnative/react';
import type { UploadCSVData } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';
import { useShowcaseUploadCsvI18n } from '../../../showcase/i18n';

type PreviewLabels = {
    emptyState: string;
    rowsLabel: string;
    fieldsLabel: string;
    andMoreRowsLabel: string;
};

function DataPreview({ data, labels }: { data: UploadCSVData | null; labels: PreviewLabels; }) {
    if (!data) {
        return <p className="text-sm text-muted-foreground italic">{labels.emptyState}</p>;
    }

    return (
        <div className="space-y-2 text-sm">
            <p className="font-medium">{data.file.name} - {data.data.length} {labels.rowsLabel}, {data.fields.length} {labels.fieldsLabel}</p>
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
                <p className="text-muted-foreground">
                    {labels.andMoreRowsLabel.replace('{count}', String(data.data.length - 5))}
                </p>
            )}
        </div>
    );
}

function NormalizeSection({ label, labels }: { label: string; labels: PreviewLabels; }) {
    const [data, setData] = useState<UploadCSVData | null>(null);

    return (
        <div className="space-y-4 w-full">
            <UploadCSV
                name="csv-normalize"
                label={label}
                normalizeKeys
                removeEmptyFields
                onDataLoaded={setData}
                onClear={() => setData(null)}
            />
            <DataPreview data={data} labels={labels} />
        </div>
    );
}

function TransformSection({ label, labels }: { label: string; labels: PreviewLabels; }) {
    const [data, setData] = useState<UploadCSVData | null>(null);

    return (
        <div className="space-y-4 w-full">
            <UploadCSV
                name="csv-transform"
                label={label}
                onParseField={([key, value]) =>
                    key.startsWith('_') ? undefined : [key, value]
                }
                onDataLoaded={setData}
                onClear={() => setData(null)}
            />
            <DataPreview data={data} labels={labels} />
        </div>
    );
}

export default function UploadCSVPage() {
    const t = useShowcaseUploadCsvI18n();
    const [parsed, setParsed] = useState<UploadCSVData | null>(null);

    const previewLabels = React.useMemo<PreviewLabels>(() => ({
        emptyState: t.labels.emptyState,
        rowsLabel: t.labels.rows,
        fieldsLabel: t.labels.fields,
        andMoreRowsLabel: t.labels.andMoreRows,
    }), [t.labels.andMoreRows, t.labels.emptyState, t.labels.fields, t.labels.rows]);

    const propsConfig = React.useMemo<PropDef[]>(() => ([
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description },
        { name: 'onDataLoaded', type: 'UploadCSVDataLoadedHandler', required: true, description: t.propsDocs.items.onDataLoaded.description },
        { name: 'onClear', type: '() => void', description: t.propsDocs.items.onClear.description },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'icon', type: 'string', default: t.propsDocs.items.icon.default, description: t.propsDocs.items.icon.description, control: 'icon' },
        { name: 'delimiter', type: 'string', description: t.propsDocs.items.delimiter.description, control: 'text' },
        { name: 'normalizeKeys', type: 'boolean', default: t.propsDocs.items.normalizeKeys.default, description: t.propsDocs.items.normalizeKeys.description, control: 'boolean' },
        { name: 'removeEmptyFields', type: 'boolean', default: t.propsDocs.items.removeEmptyFields.default, description: t.propsDocs.items.removeEmptyFields.description, control: 'boolean' },
        { name: 'onParseField', type: 'UploadCSVParseFieldHandler', description: t.propsDocs.items.onParseField.description },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ]), [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: propsConfig,
        defaultProps: {
            label: t.playground.defaultLabel,
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
                    <DataPreview data={data} labels={previewLabels} />
                </div>
            );
        },
    }), [previewLabels, propsConfig, t.playground.defaultLabel]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.basicUpload.title}
                description={t.sections.basicUpload.description}
                preview={
                    <div className="space-y-4 w-full">
                        <UploadCSV
                            name="csv-basic"
                            label={t.labels.basicLabel}
                            onDataLoaded={setParsed}
                            onClear={() => setParsed(null)}
                        />
                        <DataPreview data={parsed} labels={previewLabels} />
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
                title={t.sections.normalizedKeys.title}
                description={t.sections.normalizedKeys.description}
                preview={<NormalizeSection label={t.labels.normalizeLabel} labels={previewLabels} />}
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
                title={t.sections.customFieldTransform.title}
                description={t.sections.customFieldTransform.description}
                preview={<TransformSection label={t.labels.transformLabel} labels={previewLabels} />}
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
                title={t.sections.customDelimiter.title}
                description={t.sections.customDelimiter.description}
                preview={
                    <div className="space-y-4 w-full">
                        <UploadCSV
                            name="csv-semicolon"
                            label={t.labels.delimiterLabel}
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

            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
