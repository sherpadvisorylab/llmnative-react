import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tab: {
            page: {
                title: 'Tab',
                description: 'Tanqol tab bidعم khams mawadi layout mukhtalifa. Hasab al mawdi, yutam عرض tabs taqlidiyya ma underline aw pill layout.',
            },
            examples: {
                layouts: {
                    title: 'Mawaqi al layout',
                    description: 'Qarin bayn mawaqi al tanqol al mutaha li ikhtiyar al binya al anسب li aqsam al safha aw shashat al iedadat aw al ruya al musanida.',
                    items: {
                        default: {
                            tab: 'default',
                            title: 'layout="default"',
                            description: 'Tabs taqlidiyya ma underline. Munasiba li aqsam al muhtawa al raisiyya.',
                        },
                        top: {
                            tab: 'top',
                            title: 'layout="top"',
                            description: 'Pill tabs fawq al muhtawa. Munasiba lil filtar aw al ruya al thanawiyya.',
                        },
                        left: {
                            tab: 'left',
                            title: 'layout="left"',
                            description: 'Pills raasiyya ala al yasar. Mumtaza li safahat al iedadat.',
                        },
                        right: {
                            tab: 'right',
                            title: 'layout="right"',
                            description: 'Pills raasiyya ala al yamin li layout mutaqabil aw panelat musanida.',
                        },
                        bottom: {
                            tab: 'bottom',
                            title: 'layout="bottom"',
                            description: 'Pills taht al muhtawa inda ma turid ibqa al afaal aw al khulasa fi al aala.',
                        },
                    },
                },
            },
            labels: {
                general: 'General',
                advanced: 'Advanced',
                permissions: 'Permissions',
                generalSettingsContent: 'General settings content.',
                advancedOptionsContent: 'Advanced options content.',
                permissionManagementContent: 'Permission management.',
                generalTabContent: 'Content of the General tab.',
                advancedTabContent: 'Content of the Advanced tab.',
                permissionsTabContent: 'Content of the Permissions tab.',
            },
            propsDocs: {
                tabTitle: 'Tab props',
                tabItemTitle: 'TabItem props',
                tab: {
                    items: {
                        children: { description: 'Abna TabItem.' },
                        defaultIndex: { description: 'Fahras al tab al nashit ibtidaan.' },
                        layout: { description: 'Mawdi tanqol al tabs.' },
                        before: { description: 'Muhtawa yutam عرضه mubasharatan qabl حاوية Tab.' },
                        after: { description: 'Muhtawa yutam عرضه mubasharatan baad حاوية Tab.' },
                        motion: { description: 'Preset motion musamma aw override inline li MotionProps yutabbaq ala kull panel tab inda al tafil.' },
                        className: { description: 'Asma CSS idafiyya ala jithr Tab.' },
                        wrapperClassName: { description: 'Asma CSS ala al wrapper al khariji.' },
                    },
                },
                tabItem: {
                    items: {
                        label: { description: 'Nass mushaghil al tab.' },
                        children: { description: 'Muhtawa panel al tab.' },
                    },
                },
            },
            playground: {
                title: 'Tab',
            },
        },
    },
});
