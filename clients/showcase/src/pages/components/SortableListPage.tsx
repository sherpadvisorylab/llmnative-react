import React, { useState } from 'react';
import { ActionButton, Badge, SortableList } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

const SORTABLE_LIST_PROPS: PropDef[] = [
    { name: 'items', type: 'TItem[]', description: 'The items, in their order.' },
    { name: 'getKey', type: '(item: TItem) => string', description: 'A stable key of an item.' },
    { name: 'renderItem', type: '(item: TItem, index: number) => SortableListCard', description: 'The card of an item: title, description, meta, badge, icon, trailing (a compact ListCard).' },
    { name: 'onReorder', type: '(items: TItem[], meta: { fromIndex, toIndex, item }) => void', description: 'The items in their new order, after a drag by the handle or an arrow key on it.' },
    { name: 'label', type: 'string', description: 'The name of the list, for assistive technologies.' },
    { name: 'numbered', type: 'boolean', default: 'false', description: 'Shows the position of each item before its card.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'No reordering: the handles are left out.' },
    { name: 'emptyState', type: 'ReactNode', description: 'What the list shows without items.' },
    { name: 'className / itemClassName / cardClassName', type: 'string', description: 'Classes of the list, of each row and of each card.' },
];

type Account = { id: string; email: string; added: string; exhausted?: string };

const ACCOUNTS: Account[] = [
    { id: 'a1', email: 'mario@example.com', added: 'Added Nov 5' },
    { id: 'b2', email: 'lucia@example.com', added: 'Added Nov 6', exhausted: '18:00' },
    { id: 'c3', email: 'anna@example.com', added: 'Added Nov 7' },
];

function AccountsDemo() {
    const [accounts, setAccounts] = useState(ACCOUNTS);
    return (
        <div className="w-full max-w-lg">
            <SortableList
                items={accounts}
                getKey={(account) => account.id}
                label="Accounts"
                numbered
                onReorder={setAccounts}
                renderItem={(account) => ({
                    title: account.email,
                    meta: account.added,
                    badge: account.exhausted
                        ? <Badge variant="warning">Out of credit until {account.exhausted}</Badge>
                        : <Badge variant="success">Available</Badge>,
                    trailing: <ActionButton icon="trash-2" variant="link" label="Remove" onClick={() => setAccounts((current) => current.filter((item) => item.id !== account.id))} />,
                })}
                emptyState={<p className="text-sm text-muted-foreground">No accounts yet.</p>}
            />
        </div>
    );
}

export default function SortableListPage() {
    return (
        <PageLayout
            title="SortableList"
            description="Compact cards a person puts in order: dragged by their handle, or moved with the arrow keys."
        >
            <Section
                title="Accounts in order"
                description="The order is the order of use: drag a card by its handle, or focus the handle and press the up and down arrows. A screen reader hears the new position."
                preview={<AccountsDemo />}
                code={`import { Badge, SortableList } from '@llmnative/react';

<SortableList
    items={accounts}
    getKey={(account) => account.id}
    label="Accounts"
    numbered
    onReorder={(next) => setAccounts(next)}
    renderItem={(account) => ({
        title: account.email,
        meta: account.added,
        badge: <Badge variant="success">Available</Badge>,
    })}
/>`}
            />
            <PropDocsTable props={SORTABLE_LIST_PROPS} title="Props" />
        </PageLayout>
    );
}
