import React from 'react';
import { DataProvider, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, MockDataProvider, useDataProvider } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseDropdownI18n } from '../../showcase/i18n';

type DropdownMockItem = {
    type?: 'item' | 'header' | 'divider';
    label?: string;
    icon?: string;
    url?: string;
};

function WithDropdownMock({
    children,
    seed,
}: {
    children: React.ReactNode;
    seed: Record<string, Record<string, DropdownMockItem>>;
}) {
    const provider = React.useMemo(() => new MockDataProvider(seed), [seed]);

    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

function DropdownItemsFromMock({
    path,
    emptyStateLabel,
}: {
    path: string;
    emptyStateLabel: string;
}) {
    const provider = useDataProvider();
    const [records, setRecords] = React.useState<Array<DropdownMockItem & { _key?: string; _index?: number }>>([]);

    React.useEffect(() => {
        return provider.subscribe(path, setRecords);
    }, [path, provider]);

    if (records.length === 0) {
        return <DropdownHeader>{emptyStateLabel}</DropdownHeader>;
    }

    return (
        <>
            {records.map((record, index) => {
                const key = record._key ?? String(index);

                if (record.type === 'header') {
                    return <DropdownHeader key={key}>{record.label}</DropdownHeader>;
                }

                if (record.type === 'divider') {
                    return <DropdownDivider key={key} />;
                }

                return (
                    <DropdownItem key={key} icon={record.icon || undefined} url={record.url || undefined}>
                        {record.label || key}
                    </DropdownItem>
                );
            })}
        </>
    );
}

export default function DropdownPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseDropdownI18n();

    const dropdownItemsSeed = React.useMemo<Record<string, DropdownMockItem>>(() => ({
        header: { type: 'header', label: t.labels.recordActions },
        edit: { type: 'item', label: t.labels.edit, icon: 'edit' },
        duplicate: { type: 'item', label: t.labels.duplicate, icon: 'copy' },
        divider: { type: 'divider' },
        delete: { type: 'item', label: t.labels.delete, icon: 'trash' },
    }), [t]);

    const playgroundSeed = React.useMemo(
        () => ({
            '/dropdown-items': dropdownItemsSeed,
        }),
        [dropdownItemsSeed],
    );

    const dropdownProps = React.useMemo<PropDef[]>(() => [
        { name: 'children', type: 'ReactNode', required: true, description: t.propsDocs.items.children.description },
        {
            name: 'trigger',
            type: 'string | ReactNode | TriggerConfig',
            required: true,
            description: t.propsDocs.items.trigger.description,
            control: 'text',
            typeDetails: `string | ReactNode | {
  icon?: string;
  text?: string;
}`,
        },
        {
            name: 'badge',
            type: 'ReactNode | BadgeConfig',
            description: t.propsDocs.items.badge.description,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.propsDocs.items.badge.shortcuts?.none.label || 'none', value: null, help: t.propsDocs.items.badge.shortcuts?.none.help },
                { label: t.propsDocs.items.badge.shortcuts?.count.label || 'count', value: { content: '3', variant: 'danger' }, help: t.propsDocs.items.badge.shortcuts?.count.help },
                { label: t.propsDocs.items.badge.shortcuts?.live.label || 'live', value: { content: t.labels.liveBadge, variant: 'success' }, help: t.propsDocs.items.badge.shortcuts?.live.help },
            ],
            typeDetails: `ReactNode | {
  content: ReactNode;
  variant?: string;
}`,
        },
        { name: 'header', type: 'ReactNode', description: t.propsDocs.items.header.description, control: 'text' },
        { name: 'footer', type: 'ReactNode', description: t.propsDocs.items.footer.description, control: 'text' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: t.propsDocs.items.defaultOpen.description, control: 'boolean' },
        { name: 'open', type: 'boolean', description: t.propsDocs.items.open.description },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: t.propsDocs.items.onOpenChange.description },
        { name: 'staticOpen', type: 'boolean', default: 'false', description: t.propsDocs.items.staticOpen.description, control: 'boolean' },
        { name: 'placement', type: '"auto" | "top" | "bottom"', default: '"bottom"', description: t.propsDocs.items.placement.description, control: 'select', options: ['auto', 'top', 'bottom'] },
        { name: 'position', type: '"start" | "end"', default: 'none', description: t.propsDocs.items.position.description, control: 'select', options: ['', 'start', 'end'] },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'triggerClassName', type: 'string', description: t.propsDocs.items.triggerClassName.description, control: 'text' },
        { name: 'badgeClassName', type: 'string', description: t.propsDocs.items.badgeClassName.description, control: 'text' },
        { name: 'menuClassName', type: 'string', description: t.propsDocs.items.menuClassName.description, control: 'text' },
        { name: 'headerClassName', type: 'string', description: t.propsDocs.items.headerClassName.description, control: 'text' },
        { name: 'footerClassName', type: 'string', description: t.propsDocs.items.footerClassName.description, control: 'text' },
        { name: 'motion', type: 'MotionReference', description: t.propsDocs.items.motion.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: dropdownProps,
        mockSeed: playgroundSeed,
        defaultProps: {
            itemsPath: '/dropdown-items',
            trigger: t.labels.actions,
            badge: { content: '3', variant: 'danger' },
            before: '',
            after: '',
            header: t.labels.menu,
            footer: t.labels.footer,
            defaultOpen: false,
            staticOpen: false,
            placement: 'bottom',
            position: '',
            wrapperClassName: '',
            className: '',
            triggerClassName: '',
            badgeClassName: '',
            menuClassName: '',
            headerClassName: '',
            footerClassName: '',
        },
        render: (p) => (
            <WithDropdownMock seed={playgroundSeed}>
                <Dropdown
                    key={`${p.defaultOpen}-${p.staticOpen}-${p.itemsPath}`}
                    trigger={p.trigger || t.labels.actions}
                    badge={p.badge || undefined}
                    header={p.header || undefined}
                    footer={p.footer || undefined}
                    defaultOpen={p.defaultOpen}
                    staticOpen={p.staticOpen}
                    placement={p.placement || undefined}
                    position={p.position || undefined}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                    className={p.className || undefined}
                    triggerClassName={p.triggerClassName || undefined}
                    badgeClassName={p.badgeClassName || undefined}
                    menuClassName={p.menuClassName || undefined}
                    headerClassName={p.headerClassName || undefined}
                    footerClassName={p.footerClassName || undefined}
                >
                    <DropdownItemsFromMock path={p.itemsPath || '/dropdown-items'} emptyStateLabel={t.labels.emptyStateNoItems} />
                </Dropdown>
            </WithDropdownMock>
        ),
    }), [dropdownProps, playgroundSeed, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.actionMenu.title}
                description={t.sections.actionMenu.description}
                preview={
                    <div className="min-h-48 pt-3 pr-3">
                        <Dropdown trigger={t.labels.actions} header={t.labels.menu}>
                            <DropdownHeader>{t.labels.recordActions}</DropdownHeader>
                            <DropdownItem icon="edit">{t.labels.edit}</DropdownItem>
                            <DropdownItem icon="copy">{t.labels.duplicate}</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem icon="trash">{t.labels.delete}</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from '@llmnative/react';

<Dropdown trigger="Actions" header="Menu">
    <DropdownHeader>Record actions</DropdownHeader>
    <DropdownItem icon="edit">Edit</DropdownItem>
    <DropdownItem icon="copy">Duplicate</DropdownItem>
    <DropdownDivider />
    <DropdownItem icon="trash">Delete</DropdownItem>
</Dropdown>`}
            />

            <Section
                title={t.sections.dataDrivenItems.title}
                description={t.sections.dataDrivenItems.description}
                preview={
                    <div className="min-h-56 pt-3 pr-4">
                        <WithDropdownMock seed={playgroundSeed}>
                            <Dropdown trigger={t.labels.dataMenu} header={t.labels.fromMockDb} defaultOpen>
                                <DropdownItemsFromMock path="/dropdown-items" emptyStateLabel={t.labels.emptyStateNoItems} />
                            </Dropdown>
                        </WithDropdownMock>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, useDataProvider } from '@llmnative/react';

function DropdownItemsFromMock({ path }) {
    const provider = useDataProvider();
    const [records, setRecords] = React.useState([]);

    React.useEffect(() => {
        return provider.subscribe(path, setRecords);
    }, [path, provider]);

    return records.map((record) => {
        if (record.type === 'header') return <DropdownHeader key={record._key}>{record.label}</DropdownHeader>;
        if (record.type === 'divider') return <DropdownDivider key={record._key} />;
        return <DropdownItem key={record._key} icon={record.icon} url={record.url}>{record.label}</DropdownItem>;
    });
}

<DataProvider registry={{ default: new MockDataProvider({
  '/dropdown-items': {
    header: { type: 'header', label: 'Record actions' },
    edit: { type: 'item', label: 'Edit', icon: 'edit' },
    duplicate: { type: 'item', label: 'Duplicate', icon: 'copy' },
    divider: { type: 'divider' },
    delete: { type: 'item', label: 'Delete', icon: 'trash' },
  },
}) }} defaultKey="default">
    <Dropdown trigger="Data menu" header="From mock DB" defaultOpen>
        <DropdownItemsFromMock path="/dropdown-items" />
    </Dropdown>
</DataProvider>`}
            />

            <Section
                title={t.sections.toggleBadge.title}
                description={t.sections.toggleBadge.description}
                preview={
                    <div className="min-h-48 pt-3 pr-4">
                        <Dropdown
                            trigger={{ icon: 'bell', text: t.labels.notifications }}
                            badge={{ content: 8, variant: 'danger' }}
                            header={t.labels.notifications}
                            position="start"
                        >
                            <DropdownItem icon="mail">{t.labels.newMessage}</DropdownItem>
                            <DropdownItem icon="calendar">{t.labels.calendarInvite}</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem icon="check">{t.labels.markAllAsRead}</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownItem } from '@llmnative/react';

<Dropdown
    trigger={{ icon: 'bell', text: 'Notifications' }}
    badge={{ content: 8, variant: 'danger' }}
    header="Notifications"
    position="start"
>
    <DropdownItem icon="mail">New message</DropdownItem>
    <DropdownItem icon="calendar">Calendar invite</DropdownItem>
    <DropdownDivider />
    <DropdownItem icon="check">Mark all as read</DropdownItem>
</Dropdown>`}
            />

            <Section
                title={t.sections.menuAlignment.title}
                description={t.sections.menuAlignment.description}
                preview={
                    <div className="flex min-h-48 justify-end pt-3 pr-4">
                        <Dropdown
                            trigger={{ icon: 'settings', text: t.labels.settings }}
                            badge={{ content: t.labels.newBadge, variant: 'success' }}
                            header={t.labels.preferences}
                            position="end"
                        >
                            <DropdownItem icon="user">{t.labels.profile}</DropdownItem>
                            <DropdownItem icon="shield">{t.labels.security}</DropdownItem>
                            <DropdownItem icon="moon">{t.labels.theme}</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownItem } from '@llmnative/react';

<Dropdown
    trigger={{ icon: 'settings', text: 'Settings' }}
    badge={{ content: 'new', variant: 'success' }}
    header="Preferences"
    position="end"
>
    <DropdownItem icon="user">Profile</DropdownItem>
    <DropdownItem icon="shield">Security</DropdownItem>
    <DropdownItem icon="moon">Theme</DropdownItem>
</Dropdown>`}
            />

            <Section
                title={t.sections.headerFooter.title}
                description={t.sections.headerFooter.description}
                preview={
                    <div className="min-h-52 pt-3 pr-3">
                        <Dropdown
                            trigger={t.labels.workspace}
                            header={<span>{t.labels.currentWorkspace}</span>}
                            footer={<button type="button" className="btn btn-link">{t.labels.manageWorkspaces}</button>}
                        >
                            <DropdownHeader>{t.labels.switchTo}</DropdownHeader>
                            <DropdownItem icon="package">{t.labels.designSystem}</DropdownItem>
                            <DropdownItem icon="database">{t.labels.dataPlatform}</DropdownItem>
                            <DropdownItem icon="terminal">{t.labels.developerTools}</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownHeader, DropdownItem } from '@llmnative/react';

<Dropdown
    trigger="Workspace"
    header={<span>Current workspace</span>}
    footer={<button type="button" className="btn btn-link">Manage workspaces</button>}
>
    <DropdownHeader>Switch to</DropdownHeader>
    <DropdownItem icon="package">Design system</DropdownItem>
    <DropdownItem icon="database">Data platform</DropdownItem>
    <DropdownItem icon="terminal">Developer tools</DropdownItem>
</Dropdown>`}
            />

            <Section
                title={t.sections.interactiveContent.title}
                description={t.sections.interactiveContent.description}
                preview={
                    <div className="min-h-56 pt-3 pr-3">
                        <Dropdown trigger={t.labels.filters} header={t.labels.filterRecords} defaultOpen>
                            <DropdownHeader>{t.labels.status}</DropdownHeader>
                            <DropdownItem>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
                                    {t.labels.active}
                                </label>
                            </DropdownItem>
                            <DropdownItem>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 accent-primary" />
                                    {t.labels.archived}
                                </label>
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem icon="refresh">{t.labels.resetFilters}</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from '@llmnative/react';

<Dropdown trigger="Filters" header="Filter records">
    <DropdownHeader>Status</DropdownHeader>
    <DropdownItem>
        <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
            Active
        </label>
    </DropdownItem>
    <DropdownItem>
        <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-primary" />
            Archived
        </label>
    </DropdownItem>
    <DropdownDivider />
    <DropdownItem icon="refresh">Reset filters</DropdownItem>
</Dropdown>`}
            />

            <Section
                title={t.sections.staticMenu.title}
                description={t.sections.staticMenu.description}
                preview={
                    <Dropdown staticOpen header={t.labels.quickActions} footer={<button type="button" className="btn btn-link">{t.labels.viewAll}</button>}>
                        <DropdownItem icon="plus">{t.labels.createRecord}</DropdownItem>
                        <DropdownItem icon="upload">{t.labels.importData}</DropdownItem>
                        <DropdownItem icon="download">{t.labels.exportReport}</DropdownItem>
                    </Dropdown>
                }
                code={`import { Dropdown, DropdownItem } from '@llmnative/react';

<Dropdown staticOpen header="Quick actions" footer={<button type="button" className="btn btn-link">View all</button>}>
    <DropdownItem icon="plus">Create record</DropdownItem>
    <DropdownItem icon="upload">Import data</DropdownItem>
    <DropdownItem icon="download">Export report</DropdownItem>
</Dropdown>`}
            />

            <PropDocsTable props={dropdownProps} title={common.sections.props} />
        </PageLayout>
    );
}
