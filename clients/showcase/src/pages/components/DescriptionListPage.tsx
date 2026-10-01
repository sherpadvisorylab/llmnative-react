import React from 'react';
import { Badge, DescriptionList } from '@llmnative/react';
import type { DescriptionListColumns, DescriptionListLayout } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseDescriptionListI18n } from '../../showcase/i18n';

export default function DescriptionListPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseDescriptionListI18n();

    const profile = React.useMemo(() => [
        { label: t.labels.email, value: 'mario.rossi@example.com' },
        { label: t.labels.role, value: t.labels.admin },
        { label: t.labels.dealer, value: 'Elettro Nord srl' },
        { label: t.labels.phone, value: null },
    ], [t]);

    const facts = React.useMemo(() => [
        { label: t.labels.status, value: <Badge variant="success">{t.labels.delivered}</Badge> },
        { label: t.labels.buyer, value: 'Una ragione sociale piuttosto lunga S.r.l.' },
        { label: t.labels.shipped, value: '02/10/2025' },
        { label: t.labels.price, value: '2.458,20 €' },
    ], [t]);

    const props = React.useMemo<PropDef[]>(() => [
        { name: 'items', type: 'DescriptionListItem[]', description: t.propsDocs.items.items.description },
        { name: 'layout', type: '"horizontal" | "stacked"', default: '"horizontal"', description: t.propsDocs.items.layout.description, control: 'select', options: ['horizontal', 'stacked'] },
        { name: 'columns', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: t.propsDocs.items.columns.description, control: 'number', min: 1, max: 6 },
        { name: 'labelWidth', type: 'string', default: '"12rem"', description: t.propsDocs.items.labelWidth.description, control: 'text' },
        { name: 'emptyValue', type: 'ReactNode', default: '"—"', description: t.propsDocs.items.emptyValue.description, control: 'text' },
        { name: 'truncate', type: 'boolean', default: 'false', description: t.propsDocs.items.truncate.description, control: 'boolean' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props,
        defaultProps: { layout: 'horizontal', columns: 4, labelWidth: '12rem', emptyValue: '—', truncate: false, className: '', wrapperClassName: '' },
        render: (p) => (
            <DescriptionList
                items={p.layout === 'stacked' ? facts : profile}
                layout={p.layout as DescriptionListLayout}
                columns={Math.min(6, Math.max(1, Number(p.columns) || 1)) as DescriptionListColumns}
                labelWidth={p.labelWidth || undefined}
                emptyValue={p.emptyValue}
                truncate={p.truncate}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            />
        ),
    }), [props, facts, profile]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.horizontal.title}
                description={t.sections.horizontal.description}
                preview={<div className="w-full max-w-2xl"><DescriptionList items={profile} /></div>}
                code={`import { DescriptionList } from '@llmnative/react';

<DescriptionList
    items={[
        { label: 'Login email', value: 'mario.rossi@example.com' },
        { label: 'Role', value: 'Administrator' },
        { label: 'Dealer', value: 'Elettro Nord srl' },
        { label: 'Phone', value: null },   // shows the emptyValue "—"
    ]}
/>`}
            />

            <Section
                title={t.sections.stacked.title}
                description={t.sections.stacked.description}
                preview={<div className="w-full"><DescriptionList layout="stacked" columns={4} truncate items={facts} /></div>}
                code={`<DescriptionList
    layout="stacked"
    columns={4}
    truncate
    items={[
        { label: 'Status', value: <Badge variant="success">Delivered</Badge> },
        { label: 'Buyer', value: 'A rather long company name S.r.l.' },
        { label: 'Shipped on', value: '02/10/2025' },
        { label: 'Unit price', value: '2.458,20 €' },
    ]}
/>`}
            />

            <PropDocsTable props={props} title={common.sections.props} />
        </PageLayout>
    );
}
