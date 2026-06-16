import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        benchmark: {
            page: {
                title: 'Token-Benchmark',
                description: 'Wie viel weniger Code, und wie viele weniger Tokens, eine KI benoetigt, um dasselbe App-Verhalten mit @llmnative/react statt mit reinem React auszudruecken.',
            },
            labels: {
                seeLive: 'Live ansehen',
                tokens: 'Tokens',
                fewerTokens: 'weniger Tokens',
                acrossAllScenarios: 'Ueber alle 4 Szenarien hinweg',
                savingOf: 'eine Einsparung von',
                plainReact: 'Reines React',
                whyFewerTokensMatter: 'Warum weniger Tokens wichtig sind',
            },
            methodology: {
                tokenCountingTitle: 'Token-Zaehlung',
                tokenCountingBodyBefore: 'verwendet die Bibliothek',
                tokenCountingLib: 'gpt-tokenizer',
                tokenCountingBodyAfter: '(GPT-4 cl100k_base Tokenizer). Andere Modelle tokenisieren leicht anders; entscheidend ist der relative Unterschied zwischen den Spalten, nicht die absolute Zahl.',
                fairComparisonsTitle: 'Faire Vergleiche',
                fairComparisonsBodyBefore: 'jede Vanilla-Spalte verwendet erstklassige Bibliotheken und Muster',
                fairComparisonsLib: '@react-oauth/google',
                fairComparisonsBodyMiddle: 'fuer Auth sowie eine saubere DataService-Abstraktion fuer das Provider-Switch-Szenario, nicht handgeschriebenes Boilerplate.',
                fairComparisonsBodyAfter: 'Das Ziel ist, die API-Kompression des Frameworks zu messen, nicht schlechtes Vanilla-Code absichtlich auszuwaehlen.',
                representativeSnippetsTitle: 'Repraesentative Snippets',
                representativeSnippetsBody: 'jede Spalte zeigt die Kernform der Implementierung fuer dieses Szenario, nicht jede umgebende App-Sorge. Routing, Styling und Deployment-Setup sind auf beiden Seiten bewusst ausgelassen.',
            },
            summary: {
                frameworkLabel: '@llmnative/react',
                vanillaLabel: 'Reines React',
            },
            scenarios: {
                crud: {
                    title: 'CRUD-Grid mit Realtime + Pagination',
                    description: 'Provider-gestuertes CRUD-Grid mit Realtime-Updates, eingebauten Add/Edit/Delete-Aktionen, Sortierung und Pagination.',
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
                    title: 'Form mit Validierung + Laden/Speichern',
                    description: 'Provider-gestuertes Formular, das bei Bedarf einen bestehenden Record laedt, Eingaben validiert und ueber den aktiven Data-Adapter speichert.',
                    tags: {
                        form: 'Form',
                        input: 'Input',
                        select: 'Select',
                        validation: 'Validierung',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: 'React + Firebase',
                },
                provider: {
                    title: 'Daten-Backend wechseln',
                    description: 'Wechsle die Datenquelle der gesamten App zwischen Mock, Firebase RTDB, Firestore oder Supabase, ohne eine einzige Komponente anzupassen.',
                    tags: {
                        dataProvider: 'DataProvider',
                        portsAdapters: 'Ports & Adapters',
                    },
                    frameworkLabel: 'Config-Aenderung (1 Zeile)',
                    vanillaLabel: 'DIY-Abstraktionsschicht',
                    vanillaNote: 'Ein sorgfaeltiger Entwickler wuerde einen DataService-Adapter mit etwa 60 Zeilen bauen. Das Framework liefert dieselbe Abstraktion bereits fertig und an Grid, Form und Select angebunden.',
                },
                auth: {
                    title: 'Google Auth + geschuetzte Route',
                    description: 'Richte Google Sign-in einmal ein, greife ueberall auf das Nutzerprofil zu und schuetze Seiteninhalt ueber den Auth-Status des Providers.',
                    tags: {
                        auth: 'Auth',
                        google: 'Google',
                        protectedRoute: 'Geschuetzte Route',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: '@react-oauth/google',
                    vanillaNote: 'Verwendet die Standardbibliothek @react-oauth/google, also den fairsten Vanilla-Vergleich, nicht rohes GIS-Boilerplate.',
                },
            },
            why: {
                fasterGeneration: {
                    title: 'Schnellere Generierung',
                    description: 'Ein KI-Agent, der pro Feature 80% weniger Code schreibt, erledigt Aufgaben proportional schneller und bleibt laenger innerhalb der Kontextgrenzen.',
                },
                lowerCost: {
                    title: 'Niedrigere Kosten',
                    description: 'Jeder KI-API-Aufruf wird pro Token abgerechnet. Weniger Ausgabetokens pro Feature bedeuten geringere Kosten pro Feature, und im grossen Massstab ist der Unterschied erheblich.',
                },
                higherReliability: {
                    title: 'Hoehere Zuverlaessigkeit',
                    description: 'Weniger Code bedeutet weniger Flaeche fuer Halluzinationen, Importfehler und State-Bugs. Das Framework uebernimmt das Boilerplate; die KI konzentriert sich auf die Absicht.',
                },
            },
        },
    },
});
