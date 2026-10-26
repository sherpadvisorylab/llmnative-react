import React from 'react';
import { Notifications } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseNotificationsI18n } from '../../showcase/i18n';

export default function NotificationsPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseNotificationsI18n();

    const notifications = React.useMemo(() => [
        { title: t.labels.newDeploymentCompleted, url: '/components/notifications', time: t.labels.twoMinutesAgo, icon: 'check-circle' },
        { title: t.labels.storageUsageReached80, url: '/components/notifications', time: t.labels.oneHourAgo, icon: 'warning' },
    ], [t]);

    // An item with its detail and an action that works for a moment; an item that opens an address.
    const [opened, setOpened] = React.useState<string | null>(null);
    const detailed = React.useMemo(() => [
        {
            id: 'source', title: t.detail.sourceTitle, description: t.detail.sourceDetail, url: '/components/notifications', time: t.detail.now, icon: 'file-warning',
            actions: [{ label: t.detail.openAction, icon: 'play', variant: 'primary' as const, onClick: () => new Promise((done) => setTimeout(done, 1200)) }],
        },
        { id: 'blocked', title: t.detail.blockedTitle, description: t.detail.blockedDetail, url: 'https://github.com/sherpadvisorylab/llmnative-react/issues', external: true, time: t.labels.oneHourAgo, icon: 'octagon-alert', read: opened === 'blocked' },
    ], [t, opened]);

    const notificationsProps = React.useMemo<PropDef[]>(() => [
        { name: 'items', type: 'NotificationItem[]', description: t.propsDocs.items.items.description },
        { name: 'items[].description', type: 'ReactNode', description: t.propsDocs.items.description.description },
        { name: 'items[].actions', type: 'NotificationAction[]', description: t.propsDocs.items.actions.description },
        { name: 'items[].external', type: 'boolean', description: t.propsDocs.items.external.description },
        { name: 'onItemClick', type: '(item, index) => void', description: t.propsDocs.items.onItemClick.description },
        { name: 'badge', type: 'ReactNode', description: t.propsDocs.items.badge.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: notificationsProps,
        defaultProps: {
            badge: t.playground.defaultBadge,
            wrapperClassName: '',
        },
        render: (p) => (
            <Notifications badge={p.badge || undefined} wrapperClassName={p.wrapperClassName || undefined} items={notifications} />
        ),
    }), [notifications, notificationsProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.notificationMenu.title}
                description={t.sections.notificationMenu.description}
                preview={<Notifications badge={2} items={notifications} />}
                code={`import { Notifications } from '@llmnative/react';

<Notifications badge={2} items={[
    { title: 'New deployment completed', url: '/', time: '2 minutes ago', icon: 'check-circle' },
]} />`}
            />

            <Section
                title={t.detail.title}
                description={t.detail.description}
                preview={<Notifications badge={1} items={detailed} onItemClick={(item) => setOpened(item.id ?? null)} />}
                code={`import { Notifications } from '@llmnative/react';

<Notifications
    onItemClick={(item) => markRead(item.id)}
    items={[{
        id: 'source',
        title: 'Source without its Action',
        description: 'crm · sources/notes/pricing.md',
        url: '/projects/crm',
        time: 'now',
        icon: 'file-warning',
        actions: [{ label: 'Open the Action', icon: 'play', variant: 'primary', onClick: openAction }],
    }, {
        id: 'blocked',
        title: 'Issue blocked',
        url: 'https://github.com/acme/crm/issues/12',
        external: true,
        time: '1 hour ago',
        icon: 'octagon-alert',
    }]}
/>`}
            />

            <PropDocsTable props={notificationsProps} title={common.sections.props} />
        </PageLayout>
    );
}
