import React from 'react';
import { Badge, DescriptionList } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseDescriptionListI18n } from '../../showcase/i18n';

const COLUMNS = ['1', '2', '3', '4', '5', '6'] as const;

export default function DescriptionListPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseDescriptionListI18n();

    const props = React.useMemo<PropDef[]>(() => [
        { name: 'items', type: 'DescriptionListItem[]', required: true, description: t.playground.props.items.description, readOnly: true },
        { name: 'layout', type: '"horizontal" | "stacked"', default: '"horizontal"', description: t.playground.props.layout.description, control: 'select', options: ['horizontal', 'stacked'] },
        { name: 'columns', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: t.playground.props.columns.description, control: 'select', options: [...COLUMNS] },
        { name: 'labelWidth', type: 'string', description: t.playground.props.labelWidth.description, control: 'text' },
        { name: 'emptyValue', type: 'ReactNode', default: '"—"', description: t.playground.props.emptyValue.description, control: 'text' },
        { name: 'truncate', type: 'boolean', default: 'false', description: t.playground.props.truncate.description, control: 'boolean' },
        { name: 'className', type: 'string', description: t.playground.props.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.playground.props.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props,
        defaultProps: { layout: 'horizontal', columns: '1', labelWidth: '10rem', emptyValue: '', truncate: false, className: '', wrapperClassName: '' },
        render: (p) => (
            <DescriptionList
                items={[
                    { label: t.labels.email, value: 'mario.rossi@example.com' },
                    { label: t.labels.role, value: <Badge variant="info">{t.labels.admin}</Badge> },
                    { label: t.labels.phone, value: '' },
                    { label: t.labels.bio, value: t.labels.longValue },
                ]}
                layout={p.layout === 'stacked' ? 'stacked' : 'horizontal'}
                columns={Number(p.columns) as 1 | 2 | 3 | 4 | 5 | 6}
                labelWidth={p.labelWidth || undefined}
                emptyValue={p.emptyValue || undefined}
                truncate={Boolean(p.truncate)}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            />
        ),
    }), [props, t]);

    usePlayground(playground, t.playground.title);

    const horizontalItems = [
        { label: t.labels.email, value: 'mario.rossi@example.com' },
        { label: t.labels.role, value: <Badge variant="info">{t.labels.admin}</Badge> },
        { label: t.labels.company, value: 'Voltab Energy' },
        { label: t.labels.address, value: 'Via Roma 12, Milano' },
    ];

    const stackedItems = [
        { label: t.labels.fullName, value: 'Mario Rossi' },
        { label: t.labels.company, value: 'Voltab Energy' },
        { label: t.labels.status, value: <Badge variant="success">{t.labels.admin}</Badge> },
        { label: t.labels.phone, value: '+39 02 1234567' },
    ];

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.horizontal.title}
                description={t.sections.horizontal.description}
                preview={<DescriptionList items={horizontalItems} labelWidth="10rem" className="w-full max-w-xl" />}
                code={`import { DescriptionList } from '@llmnative/react';

<DescriptionList
    layout="horizontal"
    labelWidth="10rem"
    items={[
        { label: 'Email', value: 'mario.rossi@example.com' },
        { label: 'Role', value: 'Administrator' },
    ]}
/>`}
            />

            <Section
                title={t.sections.stacked.title}
                description={t.sections.stacked.description}
                preview={<DescriptionList layout="stacked" columns={2} items={stackedItems} className="w-full max-w-2xl" />}
                code={`<DescriptionList
    layout="stacked"
    columns={2}
    items={[
        { label: 'Full name', value: 'Mario Rossi' },
        { label: 'Company', value: 'Voltab Energy' },
        { label: 'Status', value: 'Administrator' },
        { label: 'Phone', value: '+39 02 1234567' },
    ]}
/>`}
            />

            <Section
                title={t.sections.emptyValues.title}
                description={t.sections.emptyValues.description}
                preview={
                    <DescriptionList
                        labelWidth="10rem"
                        emptyValue={t.labels.empty}
                        className="w-full max-w-xl"
                        items={[
                            { label: t.labels.phone, value: null },
                            { label: t.labels.address, value: undefined },
                            { label: t.labels.notes, value: '' },
                        ]}
                    />
                }
                code={`<DescriptionList
    emptyValue="N/A"
    items={[
        { label: 'Phone', value: null },
        { label: 'Address', value: undefined },
        { label: 'Notes', value: '' },
    ]}
/>`}
            />

            <Section
                title={t.sections.truncate.title}
                description={t.sections.truncate.description}
                preview={
                    <DescriptionList
                        truncate
                        labelWidth="6rem"
                        className="w-full max-w-md"
                        items={[
                            { label: t.labels.bio, value: t.labels.longValue },
                            { label: t.labels.email, value: 'a-very-long-email-address@example.com' },
                        ]}
                    />
                }
                code={`<DescriptionList
    truncate
    labelWidth="6rem"
    items={[{ label: 'Bio', value: 'A very long value that needs truncation' }]}
/>`}
            />

            <Section
                title={t.sections.theme.title}
                description={t.sections.theme.description}
                preview={
                    <DescriptionList
                        layout="stacked"
                        columns={2}
                        className="w-full max-w-2xl rounded-lg border bg-muted/40 p-4"
                        items={[
                            { label: t.labels.fullName, value: 'Mario Rossi' },
                            { label: t.labels.status, value: <Badge variant="success">{t.labels.admin}</Badge> },
                        ]}
                    />
                }
                code={`// themeOverride={{ DescriptionList: {
//     wrapperClassName: '', className: '', itemClassName: '',
//     labelClassName: '', valueClassName: '',
// } }}

<DescriptionList layout="stacked" columns={2} items={items} />`}
            />

            <PropDocsTable props={props} title={common.sections.props} />
        </PageLayout>
    );
}
