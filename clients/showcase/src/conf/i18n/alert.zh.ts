import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        alert: {
            page: { title: 'Alert', description: '向用户显示上下文反馈消息。支持图标、自动关闭和固定定位。' },
            sections: {
                variants: { description: '每种类型都有预设颜色和图标。' },
                appearance: { title: '外观', description: 'appearance="text" 会渲染一个紧凑的行内提示：没有背景、没有边框，宽度贴合内容。非常适合放在按钮旁边做状态反馈。' },
                withoutIcon: { title: '无图标' },
                autoDismiss: { title: '自动关闭', description: 'Alert 会在指定超时（毫秒）后自动关闭。' },
                placement: { title: '放置模式', description: 'placement 控制 alert 的渲染位置：inline（默认，在普通文档流中）或 fixed（通过 portal 固定在视口上方，覆盖所有内容）。' },
            },
        },
    },
});
