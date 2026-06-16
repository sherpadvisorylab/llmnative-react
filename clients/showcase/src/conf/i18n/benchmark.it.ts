import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        benchmark: {
            page: {
                title: 'Benchmark Token',
                description: 'Quanto meno codice, e quanti token in meno, servono a una AI per esprimere lo stesso comportamento applicativo usando @llmnative/react rispetto a React puro.',
            },
            labels: {
                seeLive: 'Vedi live',
                tokens: 'token',
                fewerTokens: 'token in meno',
                acrossAllScenarios: 'Su tutti e 4 gli scenari',
                savingOf: 'un risparmio di',
                plainReact: 'React puro',
                whyFewerTokensMatter: 'Perche meno token contano',
            },
            methodology: {
                tokenCountingTitle: 'Conteggio token',
                tokenCountingBodyBefore: 'usa la libreria',
                tokenCountingLib: 'gpt-tokenizer',
                tokenCountingBodyAfter: '(tokenizer GPT-4 cl100k_base). Altri modelli tokenizzano in modo leggermente diverso; conta la differenza relativa tra le colonne, non il numero assoluto.',
                fairComparisonsTitle: 'Confronti corretti',
                fairComparisonsBodyBefore: 'ogni colonna vanilla usa librerie e pattern di alto livello',
                fairComparisonsLib: '@react-oauth/google',
                fairComparisonsBodyMiddle: 'per l auth, e una corretta astrazione DataService per lo scenario di cambio provider, non boilerplate scritto a mano.',
                fairComparisonsBodyAfter: 'L obiettivo e misurare la compressione API del framework, non costruire un confronto vanilla artificiosamente debole.',
                representativeSnippetsTitle: 'Snippet rappresentativi',
                representativeSnippetsBody: 'ogni colonna mostra la forma essenziale dell implementazione per quello scenario, non ogni dettaglio circostante dell app. Routing, styling e setup di deploy sono volutamente omessi da entrambi i lati.',
            },
            summary: {
                frameworkLabel: '@llmnative/react',
                vanillaLabel: 'React puro',
            },
            scenarios: {
                crud: {
                    title: 'Grid CRUD con realtime + paginazione',
                    description: 'Grid CRUD guidata dal provider con aggiornamenti realtime, azioni add/edit/delete integrate, ordinamento e paginazione.',
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
                    title: 'Form con validazione + load/save',
                    description: 'Form guidata dal provider che carica un record esistente quando serve, valida l input e salva tramite il data adapter attivo.',
                    tags: {
                        form: 'Form',
                        input: 'Input',
                        select: 'Select',
                        validation: 'Validazione',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: 'React + Firebase',
                },
                provider: {
                    title: 'Cambio backend dati',
                    description: 'Cambia la sorgente dati dell intera app, mock, Firebase RTDB, Firestore o Supabase, senza toccare un solo componente.',
                    tags: {
                        dataProvider: 'DataProvider',
                        portsAdapters: 'Ports & Adapters',
                    },
                    frameworkLabel: 'Cambio config (1 riga)',
                    vanillaLabel: 'Astrazione fai-da-te',
                    vanillaNote: 'Uno sviluppatore attento costruirebbe un adapter DataService di circa 60 righe. Il framework offre la stessa astrazione gia pronta e gia collegata a Grid, Form e Select.',
                },
                auth: {
                    title: 'Google Auth + route protetta',
                    description: 'Configura il login Google una sola volta, accedi al profilo utente ovunque e proteggi il contenuto in base allo stato auth del provider.',
                    tags: {
                        auth: 'Auth',
                        google: 'Google',
                        protectedRoute: 'Route protetta',
                    },
                    frameworkLabel: '@llmnative/react',
                    vanillaLabel: '@react-oauth/google',
                    vanillaNote: 'Usa la libreria standard @react-oauth/google, il confronto vanilla piu corretto, non boilerplate GIS grezzo.',
                },
            },
            why: {
                fasterGeneration: {
                    title: 'Generazione piu veloce',
                    description: 'Un agente AI che scrive l 80% di codice in meno per feature completa i task proporzionalmente piu in fretta e resta entro i limiti di contesto piu a lungo.',
                },
                lowerCost: {
                    title: 'Costo piu basso',
                    description: 'Ogni chiamata API AI viene fatturata per token. Meno token in output per feature significa meno costo per feature, e su larga scala la differenza diventa significativa.',
                },
                higherReliability: {
                    title: 'Affidabilita piu alta',
                    description: 'Meno codice significa meno superficie per allucinazioni, errori di import e bug di stato. Il framework possiede il boilerplate; la AI possiede l intento.',
                },
            },
        },
    },
});
