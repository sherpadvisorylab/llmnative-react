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

            <Section
                title={t.examples.editorSidebar.title}
                description={t.examples.editorSidebar.description}
                preview={(
                    <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-foreground">{t.labels.editorTitle}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{t.labels.editorDescription}</p>
                        </div>
                        <Tab layout="right">
                            <TabItem label={t.labels.general}>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">{t.labels.editorPanelTitle}</h4>
                                        <p className="mt-1 text-sm text-muted-foreground">{t.labels.editorPanelDescription}</p>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <label className="space-y-1.5">
                                            <span className="text-sm font-medium text-foreground">{t.labels.fieldSiteName}</span>
                                            <div className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm">
                                                Acme Corp
                                            </div>
                                        </label>
                                        <label className="space-y-1.5">
                                            <span className="text-sm font-medium text-foreground">{t.labels.fieldDomain}</span>
                                            <div className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm">
                                                acme.com
                                            </div>
                                            <span className="text-xs text-muted-foreground">{t.labels.helperDomain}</span>
                                        </label>
                                    </div>
                                    <label className="space-y-1.5">
                                        <span className="text-sm font-medium text-foreground">{t.labels.fieldDescription}</span>
                                        <div className="min-h-28 rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm">
                                            Corporate site for the Acme workspace.
                                        </div>
                                        <span className="text-xs text-muted-foreground">{t.labels.helperDescription}</span>
                                    </label>
                                </div>
                            </TabItem>
                            <TabItem label={t.labels.branding}>
                                <p className="text-sm text-muted-foreground">Logo, favicon, OG image and theme bindings.</p>
                            </TabItem>
                            <TabItem label={t.labels.localization}>
                                <p className="text-sm text-muted-foreground">Locale defaults, timezone and i18n setup.</p>
                            </TabItem>
                            <TabItem label={t.labels.tracking}>
                                <p className="text-sm text-muted-foreground">Analytics IDs, head snippets and body scripts.</p>
                            </TabItem>
                        </Tab>
                    </div>
                )}
                code={`import { Tab, TabItem } from '@llmnative/react';

<Tab layout="right">
    <TabItem label="General">Editor content</TabItem>
    <TabItem label="Branding">Branding settings</TabItem>
    <TabItem label="Localization">Localization settings</TabItem>
    <TabItem label="Tracking">Tracking settings</TabItem>
</Tab>`}
            />

            <PropDocsTable props={tabProps} title={t.propsDocs.tabTitle} />
            <PropDocsTable props={tabItemProps} title={t.propsDocs.tabItemTitle} />

        </PageLayout>
    );
}
