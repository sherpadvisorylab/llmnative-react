import React from 'react';
import { Menu } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseMenuI18n } from '../../showcase/i18n';

export default function MenuPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseMenuI18n();

    const menuProps = React.useMemo<PropDef[]>(() => [
        { name: 'menuKey', type: 'string', required: true, description: t.propsDocs.items.menuKey.description, control: 'select', options: ['components', 'docs', 'providers', 'examples'] },
        { name: 'as', type: '"ul" | "ol"', default: '"ul"', description: t.propsDocs.items.as.description, control: 'select', options: ['ul', 'ol'] },
        { name: 'badges', type: 'Record<string, BadgeConfig>', description: t.propsDocs.items.badges.description, control: 'json', rows: 6, shortcuts: [
            { label: t.labels.none, value: {}, help: t.propsDocs.items.badges.shortcuts?.none.help },
            { label: t.labels.single, value: { alert: { type: 'primary', children: t.labels.newBadge } }, help: t.propsDocs.items.badges.shortcuts?.single.help },
            { label: t.labels.multi, value: { alert: { type: 'primary', children: t.labels.newBadge }, auth: { type: 'warning', children: t.labels.betaBadge } }, help: t.propsDocs.items.badges.shortcuts?.multi.help },
        ], typeDetails: `Record<string, {
  type?: string;
  children: ReactNode;
}>` },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'headerClassName', type: 'string', description: t.propsDocs.items.headerClassName.description, control: 'text' },
        { name: 'itemClassName', type: 'string', description: t.propsDocs.items.itemClassName.description, control: 'text' },
        { name: 'linkClassName', type: 'string', description: t.propsDocs.items.linkClassName.description, control: 'text' },
        { name: 'iconClassName', type: 'string', description: t.propsDocs.items.iconClassName.description, control: 'text' },
        { name: 'textClassName', type: 'string', description: t.propsDocs.items.textClassName.description, control: 'text' },
        { name: 'badgeClassName', type: 'string', description: t.propsDocs.items.badgeClassName.description, control: 'text' },
        { name: 'arrowClassName', type: 'string', description: t.propsDocs.items.arrowClassName.description, control: 'text' },
        { name: 'submenuClassName', type: 'string', description: t.propsDocs.items.submenuClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: menuProps,
        size: 'lg',
        defaultProps: {
            menuKey: 'components',
            as: 'ul',
            badges: { alert: { type: 'primary', children: t.labels.newBadge } },
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
    }), [menuProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.componentsMenu.title}
                description={t.sections.componentsMenu.description}
                preview={<Menu menuKey="components" wrapperClassName="max-h-80 overflow-auto rounded-md border p-3" className="space-y-1" itemClassName="list-none" linkClassName="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent" />}
                code={`import { Menu } from '@llmnative/react';

<Menu menuKey="components" />`}
            />

            <PropDocsTable props={menuProps} title={common.sections.props} />
        </PageLayout>
    );
}
