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

    const notificationsProps = React.useMemo<PropDef[]>(() => [
        { name: 'items', type: 'NotificationItem[]', description: t.propsDocs.items.items.description },
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

            <PropDocsTable props={notificationsProps} title={common.sections.props} />
        </PageLayout>
    );
}
