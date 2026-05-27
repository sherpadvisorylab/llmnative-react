import React from 'react';
import { Search } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const SEARCH_PROPS: PropDef[] = [
    { name: 'handleSearch', type: '(event: ChangeEvent<HTMLInputElement>) => void', description: 'Called when the hidden search input changes' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: SEARCH_PROPS,
    defaultProps: {},
    render: () => <Search />,
};

export default function SearchPage() {
    usePlayground(PLAYGROUND, 'Search');

    return (
        <PageLayout title="Search" description="Header search trigger block. Current implementation renders a toggle button and hidden input.">
            <Section
                title="Search trigger"
                preview={<Search />}
                code={`import { Search } from '@llmnative/react';

<Search handleSearch={(event) => console.log(event.target.value)} />`}
            />

            <PropDocsTable props={SEARCH_PROPS} />
        </PageLayout>
    );
}
