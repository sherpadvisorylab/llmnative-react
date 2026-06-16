import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        benchmark: {
            page: {
                title: 'Token Benchmark',
                description: 'Kam min code aqall wa kam min tokens aqall tahtaj AI li taabir nafs suluk al app inda istikhdam @llmnative/react muqaranatan bi plain React.',
            },
            labels: {
                seeLive: 'See live',
                tokens: 'tokens',
                fewerTokens: 'fewer tokens',
                acrossAllScenarios: 'Across all 4 scenarios',
                savingOf: 'a saving of',
                plainReact: 'Plain React',
                whyFewerTokensMatter: 'Why fewer tokens matter',
            },
            methodology: {
                tokenCountingTitle: 'Token counting',
                tokenCountingBodyBefore: 'uses the',
                tokenCountingLib: 'gpt-tokenizer',
                tokenCountingBodyAfter: 'library. Mukhtalif al models tuqassim tokens bishakl mukhtalif qalilan.',
                fairComparisonsTitle: 'Fair comparisons',
                fairComparisonsBodyBefore: 'each vanilla column uses strong libraries and patterns',
                fairComparisonsLib: '@react-oauth/google',
                fairComparisonsBodyMiddle: 'for auth and a proper DataService abstraction for provider switching.',
                fairComparisonsBodyAfter: 'The goal is to measure API compression.',
                representativeSnippetsTitle: 'Representative snippets',
                representativeSnippetsBody: 'each column shows the core implementation shape for the scenario.',
            },
            summary: {
                frameworkLabel: '@llmnative/react',
                vanillaLabel: 'Plain React',
            },
            scenarios: {
                crud: {
                    title: 'CRUD Grid with realtime + pagination',
                    description: 'Provider-backed CRUD grid with realtime updates, built-in add/edit/delete actions, sorting and pagination.',
                    tags: {
                        grid: 'Grid',
                        form: 'Form',
                        modal: 'Modal',
                        firebase: 'Firebase',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: 'React + Firebase',
                },
                form: {
                    title: 'Form with validation + load/save',
                    description: 'Provider-backed form that loads an existing record when needed, validates input and saves through the active data adapter.',
                    tags: {
                        form: 'Form',
                        input: 'Input',
                        select: 'Select',
                        validation: 'Validation',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: 'React + Firebase',
                },
                provider: {
                    title: 'Switch data backend',
                    description: 'Change the data source for the app without touching a single component.',
                    tags: {
                        dataProvider: 'DataProvider',
                        portsAdapters: 'Ports & Adapters',
                    },
                    frameworkLabel: 'Config change (1 line)',
                    vanillaLabel: 'DIY abstraction layer',
                    vanillaNote: 'A careful developer would build a DataService adapter. The framework ships this abstraction already wired.',
                },
                auth: {
                    title: 'Google Auth + protected route',
                    description: 'Wire Google sign-in once, access the user profile anywhere, and gate content off provider auth state.',
                    tags: {
                        auth: 'Auth',
                        google: 'Google',
                        protectedRoute: 'Protected route',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: '@react-oauth/google',
                    vanillaNote: 'Uses the standard @react-oauth/google library, not raw GIS boilerplate.',
                },
            },
            why: {
                fasterGeneration: {
                    title: 'Faster generation',
                    description: 'AI agent alladhi yaktub code aqall yunjiz al mahammat bisuraa akbar.',
                },
                lowerCost: {
                    title: 'Lower cost',
                    description: 'AI API calls tuhasab bil token. Aqall tokens yaeni taklifa aqall.',
                },
                higherReliability: {
                    title: 'Higher reliability',
                    description: 'Code aqall yaeni akhta aqall wa masaha aqall lil hallucinations.',
                },
            },
        },
    },
});
