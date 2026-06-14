import { locales, type DeepPartial, type I18nDict } from '@llmnative/react';

const ar: DeepPartial<I18nDict> = {
    ...locales.ar,
    showcase: {
        navDocs:              'التوثيق',
        navComponents:        'المكوّنات',
        navProviders:         'المزودات / التكاملات',
        navExamples:          'الأمثلة',
        navBenchmark:         'المعيار',
        groupFoundation:      'الأساسيات',
        groupUIPrimitives:    'مكوّنات واجهة المستخدم',
        groupWidgets:         'الأدوات',
        groupFormFields:      'حقول النماذج',
        groupBlocks:          'الكتل',
        groupBuiltInDrivers:  'المشغّلات المدمجة',
        groupCommonPatterns:  'الأنماط الشائعة',
        groupAuthFlows:       'تدفقات المصادقة',
        playgroundButton:     'Playground',
        playgroundOpen:       'فتح Playground',
    },
};

export default ar;
