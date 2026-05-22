import React from 'react';
import { Breadcrumbs } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const BREADCRUMBS_PROPS: PropDef[] = [
    { name: 'path', type: 'string', description: 'Path to parse. Falls back to current location', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'First breadcrumb item before path segments', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on ol.breadcrumb', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: BREADCRUMBS_PROPS,
    defaultProps: {
        path: '/components/forms/checklist',
        pre: 'Home',
        className: '',
    },
    render: (p) => <Breadcrumbs path={p.path || undefined} pre={p.pre || undefined} className={p.className || undefined} />,
};

export default function BreadcrumbsPage() {
    usePlayground(PLAYGROUND, 'Breadcrumbs');

    return (
        <PageLayout title="Breadcrumbs" description="Breadcrumb trail generated from a path or the current route.">
            <Section
                title="Generated path"
                preview={<Breadcrumbs path="/components/forms/checklist" pre="Home" />}
                code={`import { Breadcrumbs } from 'react-firestrap';

<Breadcrumbs path="/components/forms/checklist" pre="Home" />`}
            />

            <PropDocsTable props={BREADCRUMBS_PROPS} />
        </PageLayout>
    );
}
