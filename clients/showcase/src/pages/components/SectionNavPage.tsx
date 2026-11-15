import React from 'react';
import { ActionButton, Badge, ListCard, PageSection, SectionLayout } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

const SECTION_NAV_PROPS: PropDef[] = [
    { name: 'sections', type: '{ id, label, icon?, badge?, group? }[]', description: 'The entries of the menu: `id` is the anchor of a PageSection; entries with the same group are listed under it.' },
    { name: 'offset', type: 'number', default: '0', description: 'Height in px of the fixed header above the content: the menu and the sections stop below it.' },
    { name: 'label', type: 'string', default: 'common.pageSections', description: 'The name of the menu for assistive technologies.' },
    { name: 'className / itemClassName / activeClassName / groupClassName', type: 'string', description: 'Classes of the menu, of each entry, of the current one, of a group title.' },
];

const PAGE_SECTION_PROPS: PropDef[] = [
    { name: 'id', type: 'string', description: 'The anchor: the id of its entry in SectionNav (and of #id in the address).' },
    { name: 'title / description', type: 'ReactNode', description: 'The heading of the section (it names the region) and a line under it.' },
    { name: 'actions', type: 'ReactNode', description: 'Buttons on the right of the title.' },
    { name: 'offset', type: 'number', default: '0', description: 'Height of the fixed header: scrolling to the section stops below it.' },
];

const SECTIONS = [
    { id: 'demo-mail', label: 'Outgoing mail', icon: 'send', group: 'Settings', badge: <Badge variant="warning">Off</Badge> },
    { id: 'demo-inboxes', label: 'Inboxes', icon: 'mail', group: 'Settings' },
    { id: 'demo-agents', label: 'Agents', icon: 'bot', group: 'Settings' },
    { id: 'demo-catalog', label: 'Catalog', icon: 'package', group: 'Data' },
];

function SettingsDemo() {
    return (
        <div className="w-full">
            <SectionLayout sections={SECTIONS}>
                <PageSection id="demo-mail" title="Outgoing mail" description="The provider the app sends its own mails from.">
                    <ListCard icon="send" title="Not configured" description="Codes, invites and alerts cannot leave." trailing={<ActionButton label="Configure" variant="primary" />} />
                </PageSection>
                <PageSection id="demo-inboxes" title="Inboxes" description="The mailboxes the app reads." actions={<ActionButton label="Add" icon="plus" variant="secondary" />}>
                    <ListCard icon="mail" title="leads@acme.com" meta="Gmail · connected Nov 14" badge={<Badge variant="success">Connected</Badge>} />
                </PageSection>
                <PageSection id="demo-agents" title="Agents" description="Confidence threshold, daily fallbacks, retries.">
                    <div className="h-64 rounded-md border border-dashed border-border" />
                </PageSection>
                <PageSection id="demo-catalog" title="Catalog" description="The products the app sells.">
                    <div className="h-64 rounded-md border border-dashed border-border" />
                </PageSection>
            </SectionLayout>
        </div>
    );
}

export default function SectionNavPage() {
    return (
        <PageLayout
            title="SectionNav"
            description="The sections of a long page, like a settings page: a menu at their side that says where you are and goes to each one."
        >
            <Section
                title="A settings page"
                description="On large screens the menu is a sticky column grouped by `group`; on small ones a sticky row that scrolls sideways. The section on screen is highlighted; a click scrolls there and puts #id in the address, so a link can open it."
                preview={<SettingsDemo />}
                code={`import { PageSection, SectionLayout } from '@llmnative/react';

<SectionLayout
    offset={64} // the fixed header of the app
    sections={[
        { id: 'mail', label: 'Outgoing mail', group: 'Settings', badge: <Badge variant="warning">Off</Badge> },
        { id: 'catalog', label: 'Catalog', group: 'Data' },
    ]}
>
    <PageSection id="mail" title="Outgoing mail" description="…" offset={64}>…</PageSection>
    <PageSection id="catalog" title="Catalog" offset={64}><Grid … /></PageSection>
</SectionLayout>`}
            />
            <PropDocsTable props={SECTION_NAV_PROPS} title="SectionNav / SectionLayout props" />
            <PropDocsTable props={PAGE_SECTION_PROPS} title="PageSection props" />
        </PageLayout>
    );
}
