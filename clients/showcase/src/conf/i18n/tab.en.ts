import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tab: {
            page: {
                title: 'Tab',
                description: 'Tab navigation with five layout positions. Renders as classic underline tabs or pill-style layouts depending on placement.',
            },
            examples: {
                layouts: {
                    title: 'Layout positions',
                    description: 'Compare the available navigation placements to choose the right structure for page sections, settings screens or supporting views.',
                    items: {
                        default: {
                            tab: 'default',
                            title: 'layout="default"',
                            description: 'Classic underline tabs. Best for primary content sections.',
                        },
                        top: {
                            tab: 'top',
                            title: 'layout="top"',
                            description: 'Pill tabs above the content. Good for filters or secondary views.',
                        },
                        left: {
                            tab: 'left',
                            title: 'layout="left"',
                            description: 'Vertical pills on the left. Ideal for settings pages.',
                        },
                        right: {
                            tab: 'right',
                            title: 'layout="right"',
                            description: 'Vertical pills on the right for mirrored or supporting side layouts.',
                        },
                        bottom: {
                            tab: 'bottom',
                            title: 'layout="bottom"',
                            description: 'Pills below the content when actions or summaries should stay above.',
                        },
                    },
                },
                editorSidebar: {
                    title: 'Editor sidebar pattern',
                    description: 'A realistic settings editor layout with vertical navigation on the right and a structured content panel on the left.',
                },
            },
            labels: {
                general: 'General',
                advanced: 'Advanced',
                permissions: 'Permissions',
                branding: 'Branding',
                localization: 'Localization',
                tracking: 'Tracking',
                generalSettingsContent: 'General settings content.',
                advancedOptionsContent: 'Advanced options content.',
                permissionManagementContent: 'Permission management.',
                generalTabContent: 'Content of the General tab.',
                advancedTabContent: 'Content of the Advanced tab.',
                permissionsTabContent: 'Content of the Permissions tab.',
                editorTitle: 'Acme Corp',
                editorDescription: 'Site configuration workspace with sections for identity, localization and integrations.',
                editorPanelTitle: 'Site identity',
                editorPanelDescription: 'Canonical domain, naming and editorial description for the selected website.',
                fieldSiteName: 'Site name',
                fieldDomain: 'Domain',
                fieldDescription: 'Description',
                helperDomain: 'Used as the base for canonical URLs and sitemap generation.',
                helperDescription: 'Short summary used across SEO defaults and admin previews.',
            },
            propsDocs: {
                tabTitle: 'Tab props',
                tabItemTitle: 'TabItem props',
                tab: {
                    items: {
                        children: { description: 'TabItem children.' },
                        defaultIndex: { description: 'Index of the initially active tab.' },
                        layout: { description: 'Layout position of the tab navigation.' },
                        before: { description: 'Content rendered immediately before the tab container.' },
                        after: { description: 'Content rendered immediately after the tab container.' },
                        motion: { description: 'Named motion preset or inline MotionProps override applied to each tab pane on activation.' },
                        className: { description: 'Additional CSS classes on the Tab root.' },
                        wrapperClassName: { description: 'CSS classes on the outer wrapper.' },
                    },
                },
                tabItem: {
                    items: {
                        label: { description: 'Tab trigger label.' },
                        children: { description: 'Tab panel content.' },
                    },
                },
            },
            playground: {
                title: 'Tab',
            },
        },
    },
});
