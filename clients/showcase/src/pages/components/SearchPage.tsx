import React from 'react';
import { Search } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

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
                code={`import { Search } from 'react-firestrap';

<Search handleSearch={(event) => console.log(event.target.value)} />`}
            />

            <PropDocsTable props={SEARCH_PROPS} />
        </PageLayout>
    );
}
