import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        auth: {
            page: {
                title: 'Auth',
                description: 'Provider-driven auth UI, yong yu yingyong denglu he waibu OAuth jicheng.',
            },
            sections: {
                avatarLogin: {
                    title: 'Avatar login',
                    description: 'Ba moren auth service yongzuo yingyong shenfen, bing jiang qi xuanran wei profile huo avatar control.',
                },
                integrationConnect: {
                    title: 'Integration connect',
                    description: 'Wei waibu jicheng shiyong mingming auth service. Showcase preview bei jinyong, yi bimian dakai zhenshi de provider chuangkou.',
                },
            },
            labels: {
                authButtonPropsTitle: 'AuthButton props',
                authButtonPlaygroundTitle: 'AuthButton',
                primaryButtonClasses: 'primary button classes',
                connectDropbox: 'Connect Dropbox',
            },
            propsDocs: {
                items: {
                    provider: { description: 'AuthProvider driver key. Muren shiyong app auth service.' },
                    intent: { description: 'Xiang suo xuan AuthProvider qingqiu de dongzuo.' },
                    aspect: { description: 'Auth dongzuo de shijue chengxian.' },
                    scopes: { description: 'Xiang suo xuan provider qingqiu de scopes.' },
                    iconLogout: { description: 'Yong yu avatar logout menu item de IconProvider key.' },
                    avatarClass: { description: 'Yingyong dao profile avatar de CSS classes.' },
                    options: { description: 'Zai auth button moren zhi shang de ActionButton overrides. Ruguo chuandi, danding top-level props hui zuowei fallback.' },
                    label: { description: 'Button label. Ruguo options cunzai, hui bei options.label fugai. Muren zai yirenzheng shi wei Connected, fouze signIn intent xia wei Sign in.' },
                    icon: { description: 'Button de IconProvider key. Ruguo options cunzai, hui bei options.icon fugai. Muren genju auth state shiyong link huo link-break.' },
                    title: { description: 'Native title tooltip. Ruguo options cunzai, hui bei options.title fugai. Dang provider wei peizhi shi, hui zidong shezhi wei peizhi cuowu xinxi.' },
                    disabled: { description: 'Jinyong button. Ruguo options cunzai, hui bei options.disabled fugai. Dang auth provider wei peizhi shi, hui zidong qiangzhi wei true.' },
                    className: { description: 'Yingyong dao button de CSS classes. Ruguo options cunzai, hui bei options.className fugai.' },
                },
            },
            playground: {
                title: 'AuthButton',
                shortcuts: {
                    dropbox: { label: 'dropbox', help: 'Dropbox read scopes.' },
                    drive: { label: 'drive', help: 'Google Drive readonly scope.' },
                    empty: { label: 'empty', help: 'No extra scopes.' },
                },
            },
        },
    },
});
