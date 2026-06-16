import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        benchmark: {
            page: {
                title: 'Token Benchmark',
                description: 'Skolko menshe koda i skolko menshe tokens nuzhno AI, chtoby vyrazit to zhe povedenie prilozheniya s @llmnative/react po sravneniyu s plain React.',
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
                tokenCountingBodyAfter: 'library. Different models tokenize a little differently; what matters is the relative difference between columns.',
                fairComparisonsTitle: 'Fair comparisons',
                fairComparisonsBodyBefore: 'each vanilla column uses strong libraries and patterns',
                fairComparisonsLib: '@react-oauth/google',
                fairComparisonsBodyMiddle: 'for auth, and a proper DataService abstraction for provider switching.',
                fairComparisonsBodyAfter: 'The goal is to measure framework API compression.',
                representativeSnippetsTitle: 'Representative snippets',
                representativeSnippetsBody: 'each column shows the core implementation shape for the scenario, not every surrounding app concern.',
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
                    description: 'Change the data source for the entire app without touching a single component.',
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
                    description: 'An AI agent that writes much less code per feature completes tasks faster and stays within context limits longer.',
                },
                lowerCost: {
                    title: 'Lower cost',
                    description: 'AI API calls are billed per token. Fewer output tokens per feature means lower cost per feature.',
                },
                higherReliability: {
                    title: 'Higher reliability',
                    description: 'Less code means less surface area for hallucinations, import errors and state bugs.',
                },
            },
        },
    },
});
