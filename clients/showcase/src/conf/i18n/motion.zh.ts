import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        motion: {
            page: {
                title: 'Motion',
                description: 'Yong yu zhan shi theme-driven motion registry, zu jian ben di override he kuang jia dang qian fu gai qing kuang de jiao hu playground.',
            },
            sections: {
                presetControls: { title: 'Preset kong zhi', description: 'Zai built-in theme zhi jian qie huan, ran hou guan cha no-motion, subtle, standard he expressive zai dang qian registry zhi shang de biao xian.' },
                pressAndOpenStates: { title: 'Press yu open zhuang tai', description: 'Zhe xie kong jian shi yong cong suo xuan preset tui dao chu lai de ben di motion override, yin ci ni ke yi bi jiao qiang du er bu bi xiugai di ceng theme.' },
                modalAndTabTransitions: { title: 'Modal he tab guo du', description: 'Rang ju zhong dialog, ce bian panel he tab nei rong guo du gong yong tong yi preset, yi便 zai ba xiao guo sheng ji dao theme qian xian yan yi zhi xing.' },
                sharedApi: { title: 'Gong xiang API', description: 'Zhe xie jiu shi ni zai ci playground zhong zheng zai cao zuo de kai guan: theme zhong ming ming de registry entry he zu jian ben di override.' },
            },
            presets: {
                none: 'Guan bi zhuang shi xing dong hua, shi yi ge kuai su de reduced-motion dai li, shi he shi jue QA.',
                subtle: 'An jing er kuai. Geng shi he xin xi mi ji de dashboard, admin panel he yun ying workflow.',
                standard: 'Zhi jie shi yong dang qian theme registry. Zhe jiu shi ni xian zai fa bu de sheng chan mo ren zhi.',
                expressive: 'Geng chang de yun dong he geng qiang de fan kui. Shi he demo, hero jiao hu he geng pian shi jue hua de chan pin.',
            },
            labels: {
                theme: 'Theme',
                motionPreset: 'Motion preset',
                saveDraft: 'Save draft',
                publish: 'Publish',
                noMotion: 'No motion',
                pressCoverage: 'Dang qian press zhuang tai yi jing fu gai ActionButton, LoadingButton he dropdown trigger.',
                openMenu: 'Open menu',
                motionAware: 'Motion aware',
                localOverrideActive: 'Ben di override yi qi yong',
                currentPreset: 'Current preset',
                currentTheme: 'Current theme',
                effectLocal: 'Effect',
                centerDialog: 'Center dialog',
                rightPanel: 'Right panel',
                notifications: 'Notifications',
                buttons: 'Buttons',
                accessibility: 'Accessibility',
                pendingGap: 'Pending gap',
                sharedApiPreview: 'Zhe ge ye mian gu yi jiang theme ceng mian de xian shi zhuang kuang he playground ben di override fen kai. Ji shi quan ju preset xi tong hai mei cheng wei yi deng runtime API, zhe ye neng rang ci ye mian zai xian zai jiu hen you yong.',
                motionApiSurface: 'Motion API surface',
                centerDialogPreview: 'Center dialog preview',
                rightPanelPreview: 'Right panel preview',
                centerDialogHeader: 'Shi yong ben di motion override de biao zhun dialog shell.',
                rightPanelHeader: 'Zai dang qian theme zhi shang shi yong custom motion preset de ce bian panel.',
                activeTheme: 'Active theme',
                activePlaygroundPreset: 'Active playground preset',
                previewNotice: 'Zhe ge preview gu yi shi ben di de: ta bang zhu bi jiao motion qiang du, dan bu hui gai dong quan ju theme registry.',
                durationUnit: 'ms',
                reducedMotionSeparator: ' | ',
            },
            notifications: {
                registryReloaded: { title: 'Motion registry yi zhong xin jia zai', time: 'Gang gang' },
                modalThemeFallback: { title: 'Modal preview shi yong le theme fallback', time: '2 fen zhong qian' },
                reducedMotionRespected: { title: 'Reduced motion reng ran zun zhong cao zuo xi tong she zhi', time: '10 fen zhong qian' },
            },
            tabContent: {
                buttons: { paragraph1: 'Dang qian tab zai theme ceng mian yong fadeUp wei huo yue panel tian jia dong hua.', paragraph2: 'Playground ke yi zai ben di ti huan ta, fang bian dui bi subtle he expressive guo du.' },
                accessibility: { paragraph1: 'none hen shi he zai mei you zhuang shi dong hua de qing kuang xia jian cha layout.', paragraph2: 'Dang xiao guo shi yong respect-user shi, OS ceng de prefers-reduced-motion reng ran you zui gao you xian ji.' },
                pendingGap: { paragraph1: 'Notifications yi jing cong theme ji cheng le dropdown motion.', paragraph2: 'Toast ceng mian de jing xi xiu zheng reng ran shi zhe ge ye mian zhi hou sheng xia de CR-027 gap.' },
            },
            propsDocs: {
                title: 'Motion API surface',
                items: {
                    motion: { description: 'ActionButton, LoadingButton, Dropdown, Modal he Tab dou zhi chi ben di override. Chuan ru false ke guan bi gai zu jian de motion.', typeDetails: 'type MotionReference = string | MotionEffect | false', example: `<Modal motion="slideFromRight" />
<ActionButton label="Save" motion={false} />` },
                    themeMotion: { description: 'Zai theme ceng, ba zu jian de yu yi zhuang tai ying she dao motion registry li de ming ming xiao guo.', example: `Modal: {
  motion: {
    center: 'fade',
    right: 'slideFromRight',
    backdrop: 'fade',
  },
}` },
                    transition: { description: 'Motion effect shi yong de shi chang, easing, delay he shu xing lie biao.', typeDetails: `{
  duration?: number;
  easing?: string;
  delay?: number;
  properties?: string[];
}` },
                    reducedMotion: { description: 'Kong zhi dang yong hu zai OS ceng qi yong reduced motion shi, xiao guo ying ru he biao xian.', example: `motion={{
  from: { opacity: 0 },
  to: { opacity: 1 },
  reducedMotion: 'respect-user',
}}` },
                },
            },
        },
    },
});
