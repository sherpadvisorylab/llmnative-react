import { locales, type DeepPartial, type I18nDict } from '@llmnative/react';

const ru: DeepPartial<I18nDict> = {
    ...locales.ru,
    showcase: {
        navDocs:              'Документация',
        navComponents:        'Компоненты',
        navProviders:         'Провайдеры / Интеграции',
        navExamples:          'Примеры',
        navBenchmark:         'Бенчмарк',
        groupFoundation:      'Основы',
        groupUIPrimitives:    'UI-примитивы',
        groupWidgets:         'Виджеты',
        groupFormFields:      'Поля форм',
        groupBlocks:          'Блоки',
        groupBuiltInDrivers:  'Встроенные драйверы',
        groupCommonPatterns:  'Типовые шаблоны',
        groupAuthFlows:       'Потоки аутентификации',
        playgroundButton:     'Playground',
        playgroundOpen:       'Открыть Playground',
    },
};

export default ru;
