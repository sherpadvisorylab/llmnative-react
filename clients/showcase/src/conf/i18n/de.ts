import { locales, type DeepPartial, type I18nDict } from '@llmnative/react';

const de: DeepPartial<I18nDict> = {
    ...locales.de,
    showcase: {
        navDocs:              'Dokumentation',
        navComponents:        'Komponenten',
        navProviders:         'Provider / Integrationen',
        navExamples:          'Beispiele',
        navBenchmark:         'Benchmark',
        groupFoundation:      'Grundlagen',
        groupUIPrimitives:    'UI-Primitive',
        groupWidgets:         'Widgets',
        groupFormFields:      'Formularfelder',
        groupBlocks:          'Blöcke',
        groupBuiltInDrivers:  'Integrierte Treiber',
        groupCommonPatterns:  'Häufige Muster',
        groupAuthFlows:       'Auth-Abläufe',
        playgroundButton:     'Playground',
        playgroundOpen:       'Playground öffnen',
    },
};

export default de;
