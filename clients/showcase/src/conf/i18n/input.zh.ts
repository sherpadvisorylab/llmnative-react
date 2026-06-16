import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        input: {
            page: {
                title: 'Input',
                description: '包含 text、number、email、password、color、date、datetime、week、month 和 textarea 变体。所有输入都能感知 Form 上下文并自动集成。',
            },
            sections: {
                textVariants: {
                    title: '文本变体',
                    description: '最常见的输入类型。都支持 label、required、placeholder 和 disabled。',
                },
                numberRange: { title: '数字与范围' },
                dateTime: { title: '日期和时间' },
                colorPicker: { title: '颜色选择器' },
                textarea: {
                    title: 'Textarea',
                    description: '支持可配置行数的多行文本。',
                },
                checkbox: { title: 'Checkbox' },
                disabledReadOnlyAfterSet: {
                    title: 'Disabled 与 readOnlyAfterSet',
                    description: 'readOnlyAfterSet 会在值被设置后禁用字段。',
                },
            },
            labels: {
                fieldLabel: '字段标签',
                typeSomething: '输入一些内容...',
                firstName: '名字',
                email: '邮箱',
                password: '密码',
                website: '网站',
                age: '年龄',
                score: '分数 (0-100)',
                birthday: '生日',
                startTime: '开始时间',
                appointment: '预约',
                week: '周',
                month: '月',
                brandColor: '品牌颜色',
                bio: '简介',
                tellUsAboutYourself: '介绍一下你自己...',
                acceptTerms: '我接受条款和条件',
                recordId: '记录 ID',
                slug: 'Slug',
            },
            propsDocs: {
                title: 'Input 属性',
                items: {
                    name: { description: '字段名，用作表单键和点路径。' },
                    label: { description: '显示在输入框上方的标签。' },
                    type: { description: 'HTML 输入类型。' },
                    placeholder: { description: '占位文本。' },
                    required: { description: '将字段标记为必填，并在标签上显示星号。' },
                    disabled: { description: '使字段变为只读。' },
                    readOnlyAfterSet: { description: '字段在设置值后变为只读。' },
                    defaultValue: { description: '当不由 Form 管理时的初始值。' },
                    min: { description: 'number 和 range 的最小值。' },
                    max: { description: 'number 和 range 的最大值。' },
                    step: { description: 'number 和 range 的步进值。' },
                    feedback: { description: '显示在字段下方的校验反馈。' },
                    id: { description: '输入元素的显式 id。省略时自动生成。' },
                    labelClassName: { description: '应用到 label 元素的 CSS 类。' },
                    validator: { description: '自定义校验函数。返回错误信息以阻止提交。' },
                    className: { description: '输入元素上的 CSS 类。' },
                    wrapperClassName: { description: '外层包装器上的 CSS 类。' },
                },
            },
            playground: {
                title: 'Input',
            },
        },
    },
});
