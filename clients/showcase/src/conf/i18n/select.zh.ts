import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        select: {
            page: {
                title: 'Select',
                description: '原生下拉选择框。选项可以是静态数组，也可以从 DataProvider 动态加载。',
            },
            sections: {
                basicDropdown: {
                    title: '基础下拉框',
                    description: '静态选项数组，是最简单的使用方式。',
                },
                requiredSelect: {
                    title: '必选选择框',
                    description: '当字段必须在表单提交前选择时使用 required。',
                },
                noPlaceholderOption: {
                    title: '无占位选项',
                    description: '将 placeholderOption 设为 null 以隐藏空行。当没有值时，Select 会自动选择第一个可用选项。',
                },
                readOnlyAfterSet: {
                    title: '设置后只读',
                    description: '当首次选择后应锁定时使用 readOnlyAfterSet。如果字段已有值，select 会以禁用状态渲染。',
                },
                dataProviderBacked: {
                    title: '由 DataProvider 驱动',
                    description: '传入 optionsSource 而不是 options，即可从已注册的 DataProvider 获取实时选项。',
                },
            },
            labels: {
                admin: '管理员',
                editor: '编辑',
                viewer: '查看者',
                italy: '意大利',
                germany: '德国',
                france: '法国',
                spain: '西班牙',
                unitedKingdom: '英国',
                unitedStates: '美国',
                category: '类别',
                chooseCategory: '选择一个类别',
                role: '角色',
                country: '国家',
                selectPlaceholder: '请选择...',
                chooseRolePlaceholder: '选择角色',
                sales: '销售',
                operations: '运营',
                support: '支持',
                draft: '草稿',
                review: '审核',
                published: '已发布',
            },
            propsDocs: {
                title: 'Select 属性',
                items: {
                    name: { description: '作为表单键的字段名。' },
                    label: { description: '显示在 select 上方的标签。' },
                    title: { description: 'select 元素上的原生 title 属性。' },
                    options: { description: '静态选项数组。', help: '支持 option 数组、字符串数组或数字数组。' },
                    optionsSource: { description: '用于获取选项的 DataProvider 路径。', help: 'playground 使用 MockDataProvider。编辑下方记录即可更改返回的选项。' },
                    placeholderOption: { description: '未选择时显示的占位选项。设为 null 可隐藏。' },
                    required: { description: '将字段标记为必填。' },
                    disabled: { description: '禁用 select。' },
                    readOnlyAfterSet: { description: '字段在设置值后变为只读。' },
                    defaultValue: { description: '初始选中值。' },
                    feedback: { description: '显示在字段下方的校验反馈。' },
                    validator: { description: '自定义校验函数。返回错误字符串可阻止提交。' },
                    order: { description: '选项排序方式。默认按 label 升序。' },
                    before: { description: '在输入组中渲染在 select 前面的内容。' },
                    after: { description: '在输入组中渲染在 select 后面的内容。' },
                    onChange: { description: '由 Form 上下文调用的自定义 change 处理器。' },
                    className: { description: 'select 元素上的 CSS 类。' },
                    wrapperClassName: { description: '外层包装器上的 CSS 类。' },
                },
            },
            playground: {
                title: 'Select',
            },
        },
    },
});
