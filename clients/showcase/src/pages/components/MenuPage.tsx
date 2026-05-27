import React from 'react';
import { Menu } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const MENU_PROPS: PropDef[] = [
    { name: 'context', type: 'string', required: true, description: 'Menu context key passed to useMenu', control: 'select', options: ['components', 'docs', 'providers', 'examples'] },
    { name: 'Type', type: '"ul" | "ol"', default: '"ul"', description: 'List element type', control: 'select', options: ['ul', 'ol'] },
    { name: 'badges', type: 'Record<string, BadgeConfig>', description: 'Badges keyed by lower-case item title', control: 'json', rows: 6, shortcuts: [
        { label: 'none', value: {}, help: 'No menu badges.' },
        { label: 'single', value: { alert: { type: 'primary', children: 'new' } }, help: 'One badge on alert.' },
        { label: 'multi', value: { alert: { type: 'primary', children: 'new' }, auth: { type: 'warning', children: 'beta' } }, help: 'Multiple keyed badges.' },
    ], typeDetails: `Record<string, {
  type?: string;
  children: ReactNode;
}>` },
    { name: 'pre', type: 'ReactNode', description: 'Content before menu', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after menu', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on menu list', control: 'text' },
    { name: 'headerClass', type: 'string', description: 'CSS classes on header items', control: 'text' },
    { name: 'itemClass', type: 'string', description: 'CSS classes on li items', control: 'text' },
    { name: 'linkClass', type: 'string', description: 'CSS classes on links', control: 'text' },
    { name: 'iconClass', type: 'string', description: 'CSS classes on icon wrapper', control: 'text' },
    { name: 'textClass', type: 'string', description: 'CSS classes on item text', control: 'text' },
    { name: 'badgeClass', type: 'string', description: 'CSS classes on badges', control: 'text' },
    { name: 'arrowClass', type: 'string', description: 'CSS classes on submenu arrow', control: 'text' },
    { name: 'submenuClass', type: 'string', description: 'CSS classes on nested lists', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: MENU_PROPS,
    size: 'lg',
    defaultProps: {
        context: 'components',
        Type: 'ul',
        badges: { alert: { type: 'primary', children: 'new' } },
        pre: '',
        post: '',
        wrapClass: 'max-h-80 overflow-auto rounded-md border p-3',
        className: 'space-y-1',
        headerClass: '',
        itemClass: 'list-none',
        linkClass: 'flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent',
        iconClass: '',
        textClass: '',
        badgeClass: '',
        arrowClass: '',
        submenuClass: 'ml-4 space-y-1',
    },
    render: (p) => (
        <Menu
            context={p.context || 'components'}
            Type={p.Type || 'ul'}
            badges={p.badges && typeof p.badges === 'object' ? p.badges : {}}
            pre={p.pre || undefined}
            post={p.post || undefined}
            wrapClass={p.wrapClass || undefined}
            className={p.className || undefined}
            headerClass={p.headerClass || undefined}
            itemClass={p.itemClass || undefined}
            linkClass={p.linkClass || undefined}
            iconClass={p.iconClass || undefined}
            textClass={p.textClass || undefined}
            badgeClass={p.badgeClass || undefined}
            arrowClass={p.arrowClass || undefined}
            submenuClass={p.submenuClass || undefined}
        />
    ),
};

export default function MenuPage() {
    usePlayground(PLAYGROUND, 'Menu');

    return (
        <PageLayout title="Menu" description="Route-aware navigation menu rendered from an App menu context.">
            <Section
                title="Components menu"
                preview={<Menu context="components" wrapClass="max-h-80 overflow-auto rounded-md border p-3" className="space-y-1" itemClass="list-none" linkClass="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent" />}
                code={`import { Menu } from '@llmnative/react';

<Menu context="components" />`}
            />

            <PropDocsTable props={MENU_PROPS} />
        </PageLayout>
    );
}
