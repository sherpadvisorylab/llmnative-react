import React from 'react';
import { Tab, TabItem } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseTabI18n } from '../../showcase/i18n';

const POSITIONS = ['default', 'top', 'left', 'right', 'bottom'] as const;

export default function TabPage() {
    const t = useShowcaseTabI18n();

    const tabProps = React.useMemo<PropDef[]>(() => [
        { name: 'children', type: 'ReactNode', required: true, description: t.propsDocs.tab.items.children.description },
        { name: 'defaultIndex', type: 'number', default: '0', description: t.propsDocs.tab.items.defaultIndex.description, control: 'number', min: 0 },
        { name: 'layout', type: '"default" | "top" | "left" | "right" | "bottom"', default: '"default"', description: t.propsDocs.tab.items.layout.description, control: 'select', options: ['default', 'top', 'left', 'right', 'bottom'] },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.tab.items.before.description },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.tab.items.after.description },
        { name: 'motion', type: 'MotionReference', description: t.propsDocs.tab.items.motion.description },
        { name: 'className', type: 'string', description: t.propsDocs.tab.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.tab.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const tabItemProps = React.useMemo<PropDef[]>(() => [
        { name: 'label', type: 'ReactNode', required: true, description: t.propsDocs.tabItem.items.label.description },
        { name: 'children', type: 'ReactNode', required: true, description: t.propsDocs.tabItem.items.children.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        props: tabProps,
        defaultProps: { layout: 'default', defaultIndex: 0, className: '', wrapperClassName: '' },
        render: (p) => (
            <Tab
                layout={p.layout}
                defaultIndex={p.defaultIndex}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            >
                <TabItem label={t.labels.general}>{t.labels.generalSettingsContent}</TabItem>
                <TabItem label={t.labels.advanced}>{t.labels.advancedOptionsContent}</TabItem>
                <TabItem label={t.labels.permissions}>{t.labels.permissionManagementContent}</TabItem>
            </Tab>
        ),
    }), [t, tabProps]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            {POSITIONS.map((pos) => (
                <Section
                    key={pos}
                    title={t.examples.layouts.items[pos].title}
                    description={t.examples.layouts.items[pos].description}
                    preview={
                        <Tab layout={pos}>
                            <TabItem label={t.labels.general}>{t.labels.generalTabContent}</TabItem>
                            <TabItem label={t.labels.advanced}>{t.labels.advancedTabContent}</TabItem>
                            <TabItem label={t.labels.permissions}>{t.labels.permissionsTabContent}</TabItem>
                        </Tab>
                    }
                    code={`import { Tab, TabItem } from '@llmnative/react';

<Tab layout="${pos}">
    <TabItem label="General">General content</TabItem>
    <TabItem label="Advanced">Advanced content</TabItem>
    <TabItem label="Permissions">Permissions content</TabItem>
</Tab>`}
                />
            ))}

            <PropDocsTable props={tabProps} title={t.propsDocs.tabTitle} />
            <PropDocsTable props={tabItemProps} title={t.propsDocs.tabItemTitle} />

        </PageLayout>
    );
}
