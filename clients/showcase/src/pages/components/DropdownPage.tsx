import React from 'react';
import { DataProvider, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, MockDataProvider, useDataProvider } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const DROPDOWN_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Dropdown menu content' },
    { name: 'itemsPath', type: 'string', default: '/dropdown-items', description: 'Mock database collection used to render menu records in the playground', control: 'text' },
    { name: 'toggleButton', type: 'string | ReactNode | { icon?: string; text?: string }', required: true, description: 'Button content or icon/text config', control: 'text' },
    { name: 'badge', type: 'ReactNode | { content; type? }', description: 'Badge displayed on the toggle', control: 'json' },
    { name: 'header', type: 'ReactNode', description: 'Header content above menu items', control: 'text' },
    { name: 'footer', type: 'ReactNode', description: 'Footer content below menu items', control: 'text' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Starts the uncontrolled dropdown open on first render', control: 'boolean' },
    { name: 'alwaysOpen', type: 'boolean', default: 'false', description: 'Renders the menu as a static always-visible panel without the toggle button', control: 'boolean' },
    { name: 'position', type: '"start" | "end"', default: 'none', description: 'Menu alignment. Empty means no forced horizontal alignment.', control: 'select', options: ['', 'start', 'end'] },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on dropdown root', control: 'text' },
    { name: 'buttonClass', type: 'string', description: 'CSS classes on toggle button', control: 'text' },
    { name: 'badgeClass', type: 'string', description: 'CSS classes on badge', control: 'text' },
    { name: 'menuClass', type: 'string', description: 'CSS classes on the menu panel', control: 'text' },
    { name: 'headerClass', type: 'string', description: 'CSS classes on header wrapper', control: 'text' },
    { name: 'footerClass', type: 'string', description: 'CSS classes on footer wrapper', control: 'text' },
];

type DropdownMockItem = {
    type?: 'item' | 'header' | 'divider';
    label?: string;
    icon?: string;
    url?: string;
};

const DROPDOWN_ITEMS_SEED: Record<string, DropdownMockItem> = {
    header: { type: 'header', label: 'Record actions' },
    edit: { type: 'item', label: 'Edit', icon: 'edit' },
    duplicate: { type: 'item', label: 'Duplicate', icon: 'copy' },
    divider: { type: 'divider' },
    delete: { type: 'item', label: 'Delete', icon: 'trash' },
};

const PLAYGROUND_SEED = {
    '/dropdown-items': DROPDOWN_ITEMS_SEED,
};

function WithDropdownMock({ children }: { children: React.ReactNode }) {
    const provider = React.useMemo(() => new MockDataProvider(PLAYGROUND_SEED), []);

    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

function DropdownItemsFromMock({ path }: { path: string }) {
    const provider = useDataProvider();
    const [records, setRecords] = React.useState<Array<DropdownMockItem & { _key?: string; _index?: number }>>([]);

    React.useEffect(() => {
        return provider.subscribe(path, setRecords);
    }, [path, provider]);

    if (records.length === 0) {
        return <DropdownHeader>No dropdown items</DropdownHeader>;
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

const PLAYGROUND: PlaygroundConfig = {
    props: DROPDOWN_PROPS,
    mockSeed: PLAYGROUND_SEED,
    defaultProps: {
        itemsPath: '/dropdown-items',
        toggleButton: 'Actions',
        badge: { content: '3', type: 'danger' },
        header: 'Menu',
        footer: 'Footer',
        defaultOpen: false,
        alwaysOpen: false,
        position: '',
        wrapClass: '',
        className: '',
        buttonClass: '',
        badgeClass: '',
        menuClass: '',
        headerClass: '',
        footerClass: '',
    },
    render: (p) => (
        <Dropdown
            key={`${p.defaultOpen}-${p.alwaysOpen}-${p.itemsPath}`}
            toggleButton={p.toggleButton || 'Actions'}
            badge={p.badge || undefined}
            header={p.header || undefined}
            footer={p.footer || undefined}
            defaultOpen={p.defaultOpen}
            alwaysOpen={p.alwaysOpen}
            position={p.position || undefined}
            wrapClass={p.wrapClass || undefined}
            className={p.className || undefined}
            buttonClass={p.buttonClass || undefined}
            badgeClass={p.badgeClass || undefined}
            menuClass={p.menuClass || undefined}
            headerClass={p.headerClass || undefined}
            footerClass={p.footerClass || undefined}
        >
            <DropdownItemsFromMock path={p.itemsPath || '/dropdown-items'} />
        </Dropdown>
    ),
};

export default function DropdownPage() {
    usePlayground(PLAYGROUND, 'Dropdown');

    return (
        <PageLayout title="Dropdown" description="Composed dropdown menu with toggle, badge, header, footer and item helpers.">
            <Section
                title="Action menu"
                description="Use DropdownItem for commands. Internal clicks keep the dropdown open by default; clicking outside or toggling the button closes it."
                preview={
                    <div className="min-h-48 pt-3 pr-3">
                        <Dropdown toggleButton="Actions" header="Menu">
                            <DropdownHeader>Record actions</DropdownHeader>
                            <DropdownItem icon="edit">Edit</DropdownItem>
                            <DropdownItem icon="copy">Duplicate</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem icon="trash">Delete</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'react-firestrap';

<Dropdown toggleButton="Actions" header="Menu">
    <DropdownHeader>Record actions</DropdownHeader>
    <DropdownItem icon="edit">Edit</DropdownItem>
    <DropdownItem icon="copy">Duplicate</DropdownItem>
    <DropdownDivider />
    <DropdownItem icon="trash">Delete</DropdownItem>
</Dropdown>`}
            />

            <Section
                title="Data-driven items"
                description="The playground uses the mock database at /dropdown-items. Edit that collection to change labels, icons, dividers and links without changing component code."
                preview={
                    <div className="min-h-56 pt-3 pr-4">
                        <WithDropdownMock>
                            <Dropdown toggleButton="Data menu" header="From mock DB" defaultOpen>
                                <DropdownItemsFromMock path="/dropdown-items" />
                            </Dropdown>
                        </WithDropdownMock>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, useDataProvider } from 'react-firestrap';

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

<Dropdown toggleButton="Data menu" header="From mock DB">
    <DropdownItemsFromMock path="/dropdown-items" />
</Dropdown>`}
            />

            <Section
                title="Toggle badge"
                description="Badges use the shared overlay Badge behavior. Pass badge as a number/string or as { content, type } for semantic colors."
                preview={
                    <div className="min-h-48 pt-3 pr-4">
                        <Dropdown
                            toggleButton={{ icon: 'bell', text: 'Notifications' }}
                            badge={{ content: 8, type: 'danger' }}
                            header="Notifications"
                            position="start"
                        >
                            <DropdownItem icon="mail">New message</DropdownItem>
                            <DropdownItem icon="calendar">Calendar invite</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem icon="check">Mark all as read</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownItem } from 'react-firestrap';

<Dropdown
    toggleButton={{ icon: 'bell', text: 'Notifications' }}
    badge={{ content: 8, type: 'danger' }}
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
                title="Menu alignment (position)"
                description='Use position="end" to align the menu to the right edge of the toggle (useful in toolbars and tight layouts). Optional text badge on the toggle.'
                preview={
                    <div className="flex min-h-48 justify-end pt-3 pr-4">
                        <Dropdown
                            toggleButton={{ icon: 'settings', text: 'Settings' }}
                            badge={{ content: 'new', type: 'success' }}
                            header="Preferences"
                            position="end"
                        >
                            <DropdownItem icon="user">Profile</DropdownItem>
                            <DropdownItem icon="shield">Security</DropdownItem>
                            <DropdownItem icon="moon">Theme</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownItem } from 'react-firestrap';

<Dropdown
    toggleButton={{ icon: 'settings', text: 'Settings' }}
    badge={{ content: 'new', type: 'success' }}
    header="Preferences"
    position="end"
>
    <DropdownItem icon="user">Profile</DropdownItem>
    <DropdownItem icon="shield">Security</DropdownItem>
    <DropdownItem icon="moon">Theme</DropdownItem>
</Dropdown>`}
            />

            <Section
                title="Header and footer"
                description="Header and footer frame grouped actions without becoming menu items."
                preview={
                    <div className="min-h-52 pt-3 pr-3">
                        <Dropdown
                            toggleButton="Workspace"
                            header={<span>Current workspace</span>}
                            footer={<button type="button" className="btn btn-link">Manage workspaces</button>}
                        >
                            <DropdownHeader>Switch to</DropdownHeader>
                            <DropdownItem icon="package">Design system</DropdownItem>
                            <DropdownItem icon="database">Data platform</DropdownItem>
                            <DropdownItem icon="terminal">Developer tools</DropdownItem>
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownHeader, DropdownItem } from 'react-firestrap';

<Dropdown
    toggleButton="Workspace"
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
                title="Interactive content"
                description="Internal controls can be used without closing the dropdown. The menu still closes when the user clicks outside."
                preview={
                    <div className="min-h-56 pt-3 pr-3">
                        <Dropdown toggleButton="Filters" header="Filter records" defaultOpen>
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
                        </Dropdown>
                    </div>
                }
                code={`import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'react-firestrap';

<Dropdown toggleButton="Filters" header="Filter records">
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
                title="Static menu"
                description="Set alwaysOpen to render the menu panel directly, without a toggle button. Use this when the dropdown content is part of the page instead of a transient popup."
                preview={
                    <Dropdown alwaysOpen header="Quick actions" footer={<button type="button" className="btn btn-link">View all</button>}>
                        <DropdownItem icon="plus">Create record</DropdownItem>
                        <DropdownItem icon="upload">Import data</DropdownItem>
                        <DropdownItem icon="download">Export report</DropdownItem>
                    </Dropdown>
                }
                code={`import { Dropdown, DropdownItem } from 'react-firestrap';

<Dropdown alwaysOpen header="Quick actions" footer={<button type="button" className="btn btn-link">View all</button>}>
    <DropdownItem icon="plus">Create record</DropdownItem>
    <DropdownItem icon="upload">Import data</DropdownItem>
    <DropdownItem icon="download">Export report</DropdownItem>
</Dropdown>`}
            />

            <PropsTable props={DROPDOWN_PROPS} />
        </PageLayout>
    );
}
