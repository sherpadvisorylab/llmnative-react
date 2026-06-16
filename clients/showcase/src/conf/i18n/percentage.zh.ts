import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({ showcase: { percentage: {
    page: { title: 'Percentage', description: '进度指示器，可渲染为水平条或圆形仪表，并支持 min/max 归一化和主题色。' },
    sections: {
        bars: { title: '条形进度', description: '条形适合信息密集的仪表板和表格详情面板。value 会在 min 和 max 之间归一化。' },
        circles: { title: '圆形进度', description: '圆形适合摘要型指标，此时百分比是主要视觉信号。' },
        normalization: { title: 'Min/max 归一化', description: '显示的百分比按 (value - min) / (max - min) 计算，然后限制在 0 到 100 之间。' },
        variants: { title: '颜色变体与插槽', description: 'variant 控制填充色。trackVariant 控制轨道色。before/after 可添加外围上下文。' },
    },
    labels: {
        completion: '完成度',
        storage: '存储',
        budgetUsed: '预算已用',
        risk: '风险',
        quality: '质量',
        coverage: '覆盖率',
        noText: '无文本',
        revenueTarget: '收入目标：150 中的 75',
        temperatureRange: '温度范围：20-40 中的 30',
        clampedAboveMax: '超过最大值后被限制',
    },
    propsDocs: { items: {
        value: { description: '归一化前的当前值。' }, max: { description: '映射到 100% 的最大值。' }, min: { description: '映射到 0% 的最小值。' }, appearance: { description: '进度形态。' }, variant: { description: '进度填充颜色。' }, trackVariant: { description: '轨道或背景颜色。' }, thickness: { description: '条形高度或圆形描边宽度。' }, showText: { description: '显示归一化后的百分比文本。' }, size: { description: '条形宽度百分比或圆形像素尺寸。' }, fontSize: { description: '百分比文本的像素字号。' }, label: { description: '百分比上方的标签。' }, before: { description: '控件前的内容。' }, after: { description: '控件后的内容。' }, className: { description: '应用到进度指示器的 CSS 类。' }, wrapperClassName: { description: '应用到包装器的 CSS 类。' },
    } },
    playground: { title: 'Percentage', defaultLabel: '完成度', props: {
        value: { description: '归一化前的当前值。' }, max: { description: '映射到 100% 的最大值。' }, min: { description: '映射到 0% 的最小值。' }, appearance: { description: '进度形态。' }, variant: { description: '进度填充颜色。' }, trackVariant: { description: '轨道或背景颜色。' }, thickness: { description: '条形高度或圆形描边宽度。' }, showText: { description: '显示归一化后的百分比文本。' }, size: { description: '条形宽度百分比或圆形像素尺寸。' }, fontSize: { description: '百分比文本的像素字号。' }, label: { description: '百分比上方的标签。' }, before: { description: '控件前的内容。' }, after: { description: '控件后的内容。' }, className: { description: '应用到进度指示器的 CSS 类。' }, wrapperClassName: { description: '应用到包装器的 CSS 类。' },
    } },
} } });
