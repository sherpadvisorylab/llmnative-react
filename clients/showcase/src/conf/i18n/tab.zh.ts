import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tab: {
            page: {
                title: 'Tab',
                description: 'Tab dao hang zhi chi wu zhong bu ju wei zhi. Gen ju fang zhi fang shi, zu jian hui xian shi jing dian xia hua xian tab huo pill yang shi.',
            },
            examples: {
                layouts: {
                    title: 'Bu ju wei zhi',
                    description: 'Dui bi ke yong de dao hang bai fang fang shi, wei ye mian fen qu, she zhi ye huo fu zhu shi tu xuan ze he shi de jie gou.',
                    items: {
                        default: {
                            tab: 'default',
                            title: 'layout="default"',
                            description: 'Jing dian xia hua xian tab. Zui shi he zhu yao nei rong fen qu.',
                        },
                        top: {
                            tab: 'top',
                            title: 'layout="top"',
                            description: 'Pill tab fang zai nei rong shang fang. Shi he guo lv qi huo ci yao shi tu.',
                        },
                        left: {
                            tab: 'left',
                            title: 'layout="left"',
                            description: 'Zuo ce chui zhi pill tab. Fei chang shi he she zhi ye.',
                        },
                        right: {
                            tab: 'right',
                            title: 'layout="right"',
                            description: 'You ce chui zhi pill tab, shi he jing xiang huo fu zhu ce bian bu ju.',
                        },
                        bottom: {
                            tab: 'bottom',
                            title: 'layout="bottom"',
                            description: 'Pill tab fang zai nei rong xia fang, shi he rang cao zuo huo zong jie bao chi zai shang fang.',
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
                        children: { description: 'TabItem zi jie dian.' },
                        defaultIndex: { description: 'Chu shi ji huo tab de suo yin.' },
                        layout: { description: 'Tab dao hang de bu ju wei zhi.' },
                        before: { description: 'Zai Tab rong qi qian mian li ji xuan ran de nei rong.' },
                        after: { description: 'Zai Tab rong qi hou mian li ji xuan ran de nei rong.' },
                        motion: { description: 'Ming ming de motion preset huo inline MotionProps override, zai tab panel ji huo shi ying yong.' },
                        className: { description: 'Fu jia dao Tab gen jie dian de CSS lei ming.' },
                        wrapperClassName: { description: 'Wai ceng wrapper de CSS lei ming.' },
                    },
                },
                tabItem: {
                    items: {
                        label: { description: 'Tab chu fa qi wen ben.' },
                        children: { description: 'Tab panel nei rong.' },
                    },
                },
            },
            playground: {
                title: 'Tab',
            },
        },
    },
});
