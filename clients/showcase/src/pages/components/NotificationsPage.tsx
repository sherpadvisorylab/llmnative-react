import React from 'react';
import { Notifications } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const NOTIFICATIONS = [
    { title: 'New deployment completed', url: '/components/notifications', time: '2 minutes ago', icon: 'check-circle' },
    { title: 'Storage usage reached 80%', url: '/components/notifications', time: '1 hour ago', icon: 'warning' },
];

const NOTIFICATIONS_PROPS: PropDef[] = [
    { name: 'items', type: 'NotificationItem[]', description: 'Notification records rendered in the dropdown' },
    { name: 'badge', type: 'ReactNode', description: 'Badge displayed on the bell toggle', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: NOTIFICATIONS_PROPS,
    defaultProps: {
        badge: '2',
        wrapperClassName: '',
    },
    render: (p) => (
        <Notifications badge={p.badge || undefined} wrapperClassName={p.wrapperClassName || undefined} items={NOTIFICATIONS} />
    ),
};

export default function NotificationsPage() {
    usePlayground(PLAYGROUND, 'Notifications');

    return (
        <PageLayout title="Notifications" description="Notification dropdown built on top of Dropdown and DropdownItem.">
            <Section
                title="Notification menu"
                preview={<Notifications badge={2} items={NOTIFICATIONS} />}
                code={`import { Notifications } from '@llmnative/react';

<Notifications badge={2} items={[
    { title: 'New deployment completed', url: '/', time: '2 minutes ago', icon: 'check-circle' },
]} />`}
            />

            <PropDocsTable props={NOTIFICATIONS_PROPS} />
        </PageLayout>
    );
}
