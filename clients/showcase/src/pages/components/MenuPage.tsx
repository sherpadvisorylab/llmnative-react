import React from 'react';
import { Menu } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const MENU_PROPS: PropDef[] = [
    { name: 'menuKey', type: 'string', required: true, description: 'Menu context key passed to useMenu', control: 'select', options: ['components', 'docs', 'providers', 'examples'] },
    { name: 'as', type: '"ul" | "ol"', default: '"ul"', description: 'List element type', control: 'select', options: ['ul', 'ol'] },
    { name: 'badges', type: 'Record<string, BadgeConfig>', description: 'Badges keyed by lower-case item title', control: 'json', rows: 6, shortcuts: [
        { label: 'none', value: {}, help: 'No menu badges.' },
        { label: 'single', value: { alert: { type: 'primary', children: 'new' } }, help: 'One badge on alert.' },
        { label: 'multi', value: { alert: { type: 'primary', children: 'new' }, auth: { type: 'warning', children: 'beta' } }, help: 'Multiple keyed badges.' },
    ], typeDetails: `Record<string, {
  type?: string;
  children: ReactNode;
}>` },
    { name: 'before', type: 'ReactNode', description: 'Content before menu', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Content after menu', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on menu list', control: 'text' },
    { name: 'headerClassName', type: 'string', description: 'CSS classes on header items', control: 'text' },
    { name: 'itemClassName', type: 'string', description: 'CSS classes on li items', control: 'text' },
    { name: 'linkClassName', type: 'string', description: 'CSS classes on links', control: 'text' },
    { name: 'iconClassName', type: 'string', description: 'CSS classes on icon wrapper', control: 'text' },
    { name: 'textClassName', type: 'string', description: 'CSS classes on item text', control: 'text' },
    { name: 'badgeClassName', type: 'string', description: 'CSS classes on badges', control: 'text' },
    { name: 'arrowClassName', type: 'string', description: 'CSS classes on submenu arrow', control: 'text' },
    { name: 'submenuClassName', type: 'string', description: 'CSS classes on nested lists', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: MENU_PROPS,
    size: 'lg',
    defaultProps: {
        menuKey: 'components',
        as: 'ul',
        badges: { alert: { type: 'primary', children: 'new' } },
        before: '',
        after: '',
        wrapperClassName: 'max-h-80 overflow-auto rounded-md border p-3',
        className: 'space-y-1',
        headerClassName: '',
        itemClassName: 'list-none',
        linkClassName: 'flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent',
        iconClassName: '',
        textClassName: '',
        badgeClassName: '',
        arrowClassName: '',
        submenuClassName: 'ml-4 space-y-1',
    },
    render: (p) => (
        <Menu
            menuKey={p.menuKey || 'components'}
            as={p.as || 'ul'}
            badges={p.badges && typeof p.badges === 'object' ? p.badges : {}}
            before={p.before || undefined}
            after={p.after || undefined}
            wrapperClassName={p.wrapperClassName || undefined}
            className={p.className || undefined}
            headerClassName={p.headerClassName || undefined}
            itemClassName={p.itemClassName || undefined}
            linkClassName={p.linkClassName || undefined}
            iconClassName={p.iconClassName || undefined}
            textClassName={p.textClassName || undefined}
            badgeClassName={p.badgeClassName || undefined}
            arrowClassName={p.arrowClassName || undefined}
            submenuClassName={p.submenuClassName || undefined}
        />
    ),
};

export default function MenuPage() {
    usePlayground(PLAYGROUND, 'Menu');

    return (
        <PageLayout title="Menu" description="Route-aware navigation menu rendered from an App menu context.">
            <Section
                title="Components menu"
                preview={<Menu menuKey="components" wrapperClassName="max-h-80 overflow-auto rounded-md border p-3" className="space-y-1" itemClassName="list-none" linkClassName="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent" />}
                code={`import { Menu } from '@llmnative/react';

<Menu menuKey="components" />`}
            />

            <PropDocsTable props={MENU_PROPS} />
        </PageLayout>
    );
}
