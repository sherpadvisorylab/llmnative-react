import React from 'react';
import { Notifications } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const NOTIFICATIONS = [
    { title: 'New deployment completed', url: '/components/notifications', time: '2 minutes ago', icon: 'check-circle' },
    { title: 'Storage usage reached 80%', url: '/components/notifications', time: '1 hour ago', icon: 'warning' },
];

const NOTIFICATIONS_PROPS: PropDef[] = [
    { name: 'children', type: 'NotificationItem[]', description: 'Notification records rendered in the dropdown' },
    { name: 'badge', type: 'ReactNode', description: 'Badge displayed on the bell toggle', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: NOTIFICATIONS_PROPS,
    defaultProps: {
        badge: '2',
        wrapClass: '',
    },
    render: (p) => (
        <Notifications badge={p.badge || undefined} wrapClass={p.wrapClass || undefined}>
            {NOTIFICATIONS}
        </Notifications>
    ),
};

export default function NotificationsPage() {
    usePlayground(PLAYGROUND, 'Notifications');

    return (
        <PageLayout title="Notifications" description="Notification dropdown built on top of Dropdown and DropdownItem.">
            <Section
                title="Notification menu"
                preview={<Notifications badge={2}>{NOTIFICATIONS}</Notifications>}
                code={`import { Notifications } from 'react-firestrap';

<Notifications badge={2}>
    {[
        { title: 'New deployment completed', url: '/', time: '2 minutes ago', icon: 'check-circle' },
    ]}
</Notifications>`}
            />

            <PropDocsTable props={NOTIFICATIONS_PROPS} />
        </PageLayout>
    );
}
