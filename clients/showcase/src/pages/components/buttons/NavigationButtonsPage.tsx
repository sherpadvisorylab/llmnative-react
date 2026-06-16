import React from 'react';
import { BackLink, GoSite, ReferSite } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { useShowcaseNavigationButtonsI18n } from '../../../showcase/i18n';

const PROPS = [
    { name: 'label', type: 'string', description: 'Visible label' },
    { name: 'href', type: 'string', description: 'External URL for GoSite or ReferSite' },
    { name: 'title', type: 'string', description: 'ReferSite title and image alt text' },
    { name: 'imageSrc', type: 'string', description: 'ReferSite image source' },
    { name: 'width', type: 'number | string', description: 'ReferSite image width' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the rendered element' },
];

export default function NavigationButtonsPage() {
    const t = useShowcaseNavigationButtonsI18n();

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.helpers.title}
                preview={
                    <div className="flex flex-wrap items-center gap-4">
                        <BackLink className="border border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary" />
                        <GoSite label="React" href="https://react.dev" className="text-lg font-semibold" />
                        <ReferSite title="React" href="https://react.dev" imageSrc="https://react.dev/favicon.ico" width={30} />
                    </div>
                }
                code={`<BackLink className="border border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary" />
<GoSite label="React" href="https://react.dev" />
<ReferSite title="React" href="https://react.dev" imageSrc="/logo.png" width={30} />`}
            />
            <PropDocsTable props={PROPS} />
        </PageLayout>
    );
}
