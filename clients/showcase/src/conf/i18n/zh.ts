import { locales, type DeepPartial, type I18nDict } from '@llmnative/react';

const zh: DeepPartial<I18nDict> = {
    ...locales.zh,
    showcase: {
        navDocs:              '文档',
        navComponents:        '组件',
        navProviders:         '提供商 / 集成',
        navExamples:          '示例',
        navBenchmark:         '基准测试',
        groupFoundation:      '基础',
        groupUIPrimitives:    'UI 基础组件',
        groupWidgets:         '组件',
        groupFormFields:      '表单字段',
        groupBlocks:          '块',
        groupBuiltInDrivers:  '内置驱动',
        groupCommonPatterns:  '常用模式',
        groupAuthFlows:       '认证流程',
        playgroundButton:     'Playground',
        playgroundOpen:       '打开 Playground',
    },
};

export default zh;
