import React from 'react';
import { ActionButton, Badge, Icon, ListCard } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PlaygroundConfig, PropDef } from '../../docs-kit/playground';

const LIST_CARD_PROPS: PropDef[] = [
    { name: 'title', type: 'ReactNode', description: 'Primary label rendered in the card header.', control: 'text' },
    { name: 'description', type: 'ReactNode', description: 'Secondary description shown below the title.', control: 'textarea', rows: 3 },
    { name: 'meta', type: 'ReactNode', description: 'Small tertiary line, useful for domains, ids or timestamps.', control: 'text' },
    { name: 'badge', type: 'ReactNode', description: 'Right-aligned badge or status element in the header.' },
    { name: 'icon', type: 'string | ReactNode', description: 'Leading icon name or fully custom React node.', control: 'icon' },
    { name: 'trailing', type: 'ReactNode', description: 'Trailing slot for chevrons, counts or auxiliary actions.' },
    { name: 'footer', type: 'ReactNode', description: 'Footer area rendered below meta/description.', control: 'text' },
    { name: 'children', type: 'ReactNode', description: 'Alias for footer-style extra content.' },
    { name: 'href', type: 'string', description: 'Turns the card into a link.', control: 'text' },
    { name: 'external', type: 'boolean', default: 'false', description: 'Open `href` in a new tab when true.', control: 'boolean' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Apply the active/selected visual state.', control: 'boolean' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interactions and dim the card.', control: 'boolean' },
    { name: 'dashed', type: 'boolean', default: 'false', description: 'Use a dashed border, useful for create/add affordances.', control: 'boolean' },
    { name: 'compact', type: 'boolean', default: 'false', description: 'Reduce the internal padding for denser lists.', control: 'boolean' },
    { name: 'align', type: '"start" | "center"', default: '"start"', description: 'Vertical alignment for leading/trailing areas.', control: 'select', options: ['start', 'center'] },
    { name: 'onClick', type: '(event: MouseEvent) => void', description: 'Optional click handler for button-like cards.' },
    { name: 'titleClassName', type: 'string', description: 'Additional classes for the title slot.', control: 'text' },
    { name: 'descriptionClassName', type: 'string', description: 'Additional classes for the description slot.', control: 'text' },
    { name: 'metaClassName', type: 'string', description: 'Additional classes for the meta slot.', control: 'text' },
    { name: 'badgeClassName', type: 'string', description: 'Additional classes for the badge slot.', control: 'text' },
    { name: 'leadingClassName', type: 'string', description: 'Additional classes for the leading icon wrapper.', control: 'text' },
    { name: 'bodyClassName', type: 'string', description: 'Additional classes for the card body container.', control: 'text' },
    { name: 'headerClassName', type: 'string', description: 'Additional classes for the header row.', control: 'text' },
    { name: 'trailingClassName', type: 'string', description: 'Additional classes for the trailing slot.', control: 'text' },
    { name: 'footerClassName', type: 'string', description: 'Additional classes for the footer area.', control: 'text' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the component.' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the component.' },
    { name: 'motion', type: 'MotionReference', description: 'Optional motion preset for press interactions.' },
    { name: 'className', type: 'string', description: 'Additional classes for the card root.', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'Additional classes for the outer wrapper.', control: 'text' },
];

const PLAYGROUND_PROPS: PropDef[] = [
    ...LIST_CARD_PROPS,
    { name: 'badgeLabel', type: 'string', description: 'Playground helper for badge text.', control: 'text' },
    { name: 'badgeVariant', type: '"success" | "warning" | "secondary"', description: 'Playground helper for badge tone.', control: 'select', options: ['success', 'warning', 'secondary'] },
    { name: 'trailingMode', type: '"none" | "chevron" | "count"', description: 'Playground helper for trailing content.', control: 'select', options: ['none', 'chevron', 'count'] },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PLAYGROUND_PROPS,
    defaultProps: {
        title: 'Acme Blog',
        description: 'Editorial website configuration with branding, localization and publishing settings.',
        meta: 'acme.blog',
        badgeLabel: 'active',
        badgeVariant: 'success',
        icon: 'globe',
        trailingMode: 'none',
        footer: '',
        href: '',
        external: false,
        active: true,
        disabled: false,
        dashed: false,
        compact: false,
        align: 'start',
        titleClassName: '',
        descriptionClassName: '',
        metaClassName: '',
        badgeClassName: '',
        leadingClassName: '',
        bodyClassName: '',
        headerClassName: '',
        trailingClassName: '',
        footerClassName: '',
        className: '',
        wrapperClassName: '',
    },
    render: (p) => {
        const badge = p.badgeLabel
            ? <Badge variant={p.badgeVariant}>{p.badgeLabel}</Badge>
            : undefined;

        const trailing = p.trailingMode === 'chevron'
            ? <Icon name="chevron-right" size={16} className="text-muted-foreground" />
            : p.trailingMode === 'count'
                ? <span className="text-xs font-medium text-muted-foreground">12</span>
                : undefined;

        return (
            <div className="w-full max-w-xl">
                <ListCard
                    title={p.title || undefined}
                    description={p.description || undefined}
                    meta={p.meta || undefined}
                    badge={badge}
                    icon={p.icon || undefined}
                    trailing={trailing}
                    footer={p.footer ? <span className="text-xs text-muted-foreground">{p.footer}</span> : undefined}
                    href={p.href || undefined}
                    external={p.external}
                    active={p.active}
                    disabled={p.disabled}
                    dashed={p.dashed}
                    compact={p.compact}
                    align={p.align}
                    onClick={!p.href ? () => undefined : undefined}
                    titleClassName={p.titleClassName || undefined}
                    descriptionClassName={p.descriptionClassName || undefined}
                    metaClassName={p.metaClassName || undefined}
                    badgeClassName={p.badgeClassName || undefined}
                    leadingClassName={p.leadingClassName || undefined}
                    bodyClassName={p.bodyClassName || undefined}
                    headerClassName={p.headerClassName || undefined}
                    trailingClassName={p.trailingClassName || undefined}
                    footerClassName={p.footerClassName || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </div>
        );
    },
};

const siteCards = [
    { name: 'Acme Corp', domain: 'acme.com', status: 'active' },
    { name: 'Acme Blog', domain: 'acme.blog', status: 'active' },
    { name: 'Acme Jobs', domain: 'acme.careers', status: 'draft' },
];

export default function ListCardPage() {
    usePlayground(PLAYGROUND, 'ListCard');

    return (
        <PageLayout
            title="ListCard"
            description="Selectable list card for side panels, managers and IDE-like navigation surfaces."
        >
            <Section
                title="Selection List"
                description="Ideal for tenant, site or workspace pickers where one card is active at a time."
                preview={
                    <div className="grid w-full max-w-md gap-3">
                        {siteCards.map((site, index) => (
                            <ListCard
                                key={site.name}
                                title={site.name}
                                meta={site.domain}
                                icon="globe"
                                badge={<Badge variant={site.status === 'draft' ? 'warning' : 'success'}>{site.status}</Badge>}
                                active={index === 0}
                                onClick={() => undefined}
                            />
                        ))}
                    </div>
                }
                code={`import { Badge, ListCard } from '@llmnative/react';

<ListCard
    title="Acme Corp"
    meta="acme.com"
    icon="globe"
    badge={<Badge variant="success">active</Badge>}
    active
    onClick={() => {}}
/>`}
            />

            <Section
                title="Create Affordance"
                description="Dashed mode works well for add/create actions without breaking visual consistency."
                preview={
                    <div className="w-full max-w-md">
                        <ListCard
                            title="Add site"
                            description="Create a new website in the current tenant."
                            icon="plus"
                            dashed
                            compact
                            onClick={() => undefined}
                        />
                    </div>
                }
                code={`<ListCard
    title="Add site"
    description="Create a new website in the current tenant."
    icon="plus"
    dashed
    compact
    onClick={() => {}}
/>`}
            />

            <Section
                title="Trailing Slot"
                description="Use the trailing slot for counts, chevrons or lightweight action hints."
                preview={
                    <div className="grid w-full max-w-md gap-3">
                        <ListCard
                            title="Workspace settings"
                            description="Appearance, platform flags and shared preferences."
                            icon="settings-2"
                            trailing={<Icon name="chevron-right" size={16} className="text-muted-foreground" />}
                            href="/components/list-card"
                        />
                        <ListCard
                            title="Notifications"
                            meta="12 unread"
                            icon="bell"
                            trailing={<span className="text-xs font-medium text-muted-foreground">12</span>}
                            onClick={() => undefined}
                        />
                    </div>
                }
                code={`<ListCard
    title="Workspace settings"
    description="Appearance, platform flags and shared preferences."
    icon="settings-2"
    trailing={<Icon name="chevron-right" size={16} />}
    href="/settings"
/>`}
            />

            <Section
                title="Manager Sidebar Composition"
                description="A realistic composition similar to CMS site/tenant managers."
                preview={
                    <div className="grid w-full gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
                        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
                            {siteCards.map((site, index) => (
                                <ListCard
                                    key={site.name}
                                    title={site.name}
                                    meta={site.domain}
                                    icon="globe"
                                    badge={<Badge variant={site.status === 'draft' ? 'warning' : 'success'}>{site.status}</Badge>}
                                    active={index === 1}
                                    onClick={() => undefined}
                                />
                            ))}
                            <ListCard
                                title="Add site"
                                description="New website in the current tenant."
                                icon="plus"
                                dashed
                                compact
                                onClick={() => undefined}
                            />
                        </div>
                        <div className="rounded-xl border border-border/60 bg-card p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Acme Blog</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Embedded editor surface paired with a ListCard sidebar.</p>
                                </div>
                                <ActionButton variant="outline-secondary" label="Close" onClick={() => undefined} />
                            </div>
                        </div>
                    </div>
                }
                code={`<div className="space-y-3">
    <ListCard title="Acme Corp" meta="acme.com" icon="globe" active onClick={() => {}} />
    <ListCard title="Acme Blog" meta="acme.blog" icon="globe" onClick={() => {}} />
    <ListCard title="Add site" icon="plus" dashed compact onClick={() => {}} />
</div>`}
            />

            <PropDocsTable props={LIST_CARD_PROPS} title="Props" />
        </PageLayout>
    );
}
