import React from 'react';
import { BackLink, GoSite, ReferSite } from 'react-firestrap';
import PageLayout from '../../../components/PageLayout';
import Section from '../../../components/Section';
import PropsTable from '../../../components/PropsTable';

const PROPS = [
    { name: 'label', type: 'string', description: 'Visible label' },
    { name: 'url', type: 'string', description: 'External URL for GoSite or ReferSite' },
    { name: 'title', type: 'string', description: 'ReferSite title and image alt text' },
    { name: 'imageUrl', type: 'string', description: 'ReferSite image source' },
    { name: 'width', type: 'number | string', description: 'ReferSite image width' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the rendered element' },
];

export default function NavigationButtonsPage() {
    return (
        <PageLayout title="Navigation Buttons" description="Back navigation and external reference helpers.">
            <Section
                title="Navigation helpers"
                preview={
                    <div className="flex flex-wrap items-center gap-4">
                        <BackLink className="border border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary" />
                        <GoSite label="React" url="https://react.dev" className="text-lg font-semibold" />
                        <ReferSite title="React" url="https://react.dev" imageUrl="https://react.dev/favicon.ico" width={30} />
                    </div>
                }
                code={`<BackLink className="border border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary" />
<GoSite label="React" url="https://react.dev" />
<ReferSite title="React" url="https://react.dev" imageUrl="/logo.png" width={30} />`}
            />
            <PropsTable props={PROPS} />
        </PageLayout>
    );
}
