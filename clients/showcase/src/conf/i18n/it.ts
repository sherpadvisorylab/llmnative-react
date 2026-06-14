import { locales, type DeepPartial, type I18nDict } from '@llmnative/react';

const it: DeepPartial<I18nDict> = {
    ...locales.it,
    showcase: {
        navDocs:              'Documentazione',
        navComponents:        'Componenti',
        navProviders:         'Provider / Integrazioni',
        navExamples:          'Esempi',
        navBenchmark:         'Benchmark',
        groupFoundation:      'Fondamenta',
        groupUIPrimitives:    'Primitivi UI',
        groupWidgets:         'Widget',
        groupFormFields:      'Campi form',
        groupBlocks:          'Blocchi',
        groupBuiltInDrivers:  'Driver integrati',
        groupCommonPatterns:  'Pattern comuni',
        groupAuthFlows:       'Flussi auth',
        playgroundButton:     'Playground',
        playgroundOpen:       'Apri Playground',
    },
};

export default it;
