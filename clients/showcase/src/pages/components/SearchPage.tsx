import React from 'react';
import { Search } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseSearchI18n } from '../../showcase/i18n';

export default function SearchPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseSearchI18n();

    const searchProps = React.useMemo<PropDef[]>(() => [
        { name: 'onQueryChange', type: '(event: ChangeEvent<HTMLInputElement>) => void', description: t.propsDocs.items.onQueryChange.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: searchProps,
        defaultProps: {},
        render: () => <Search />,
    }), [searchProps]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.searchTrigger.title}
                description={t.sections.searchTrigger.description}
                preview={<Search />}
                code={`import { Search } from '@llmnative/react';

<Search onQueryChange={(event) => console.log(event.target.value)} />`}
            />

            <PropDocsTable props={searchProps} title={common.sections.props} />
        </PageLayout>
    );
}
