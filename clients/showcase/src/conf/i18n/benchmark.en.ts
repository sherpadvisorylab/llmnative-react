import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        benchmark: {
            page: {
                title: 'Token Benchmark',
                description: 'How much less code, and how many fewer tokens, an AI needs to express the same app behavior using @llmnative/react vs plain React.',
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
                tokenCountingBodyAfter: 'library (GPT-4 cl100k_base tokenizer). Other models tokenize slightly differently; the relative difference between columns is what matters, not the absolute numbers.',
                fairComparisonsTitle: 'Fair comparisons',
                fairComparisonsBodyBefore: 'each vanilla column uses best-in-class libraries and patterns',
                fairComparisonsLib: '@react-oauth/google',
                fairComparisonsBodyMiddle: 'for auth, and a proper DataService abstraction for the provider switch scenario, not hand-rolled boilerplate.',
                fairComparisonsBodyAfter: 'The goal is to measure the framework API compression, not to cherry-pick bad vanilla code.',
                representativeSnippetsTitle: 'Representative snippets',
                representativeSnippetsBody: 'each column shows the core implementation shape for that scenario, not every surrounding app concern. Routing, styling and deployment setup are intentionally omitted from both sides.',
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
                    description: 'Change the data source for the entire app: mock, Firebase RTDB, Firestore or Supabase, without touching a single component.',
                    tags: {
                        dataProvider: 'DataProvider',
                        portsAdapters: 'Ports & Adapters',
                    },
                    frameworkLabel: 'Config change (1 line)',
                    vanillaLabel: 'DIY abstraction layer',
                    vanillaNote: 'A careful developer would build a DataService adapter (~60 lines). The framework ships the same abstraction pre-built and pre-wired to Grid, Form and Select.',
                },
                auth: {
                    title: 'Google Auth + protected route',
                    description: 'Wire Google sign-in once, access the user profile anywhere, and gate page content off provider auth state.',
                    tags: {
                        auth: 'Auth',
                        google: 'Google',
                        protectedRoute: 'Protected route',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: '@react-oauth/google',
                    vanillaNote: 'Uses the standard @react-oauth/google library, the fairest vanilla comparison, not raw GIS boilerplate.',
                },
            },
            why: {
                fasterGeneration: {
                    title: 'Faster generation',
                    description: 'An AI agent that writes 80% less code per feature completes tasks proportionally faster and stays within context limits longer.',
                },
                lowerCost: {
                    title: 'Lower cost',
                    description: 'Every AI API call is billed per token. Fewer output tokens per feature means lower cost per feature, and at scale the difference is significant.',
                },
                higherReliability: {
                    title: 'Higher reliability',
                    description: 'Less code means less surface area for hallucinations, import errors and state bugs. The framework owns the boilerplate; the AI owns the intent.',
                },
            },
        },
    },
});
