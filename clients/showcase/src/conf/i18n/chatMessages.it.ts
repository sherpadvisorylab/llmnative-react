import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        chatMessages: {
            page: {
                title: "Messaggi di chat",
                description: "Le parti di una risposta di un modello: Markdown in streaming, il ragionamento del modello e le domande interattive. ChatMarkdown, ChatReasoning e ChatQuestions.",
            },
            sections: {
                markdown: {
                    title: "Markdown in streaming",
                    description: "ChatMarkdown disegna GFM (tabelle, elenchi, titoli, citazioni, codice con evidenziazione e copia). Con streaming chiude ciò che il testo ha lasciato aperto, così una tabella o un blocco di codice non salta mentre arriva. In un pannello stretto la tabella scorre dentro di sé.",
                },
                reasoning: {
                    title: "Ragionamento",
                    description: "ChatReasoning tiene il ragionamento del modello in un blocco suo: aperto mentre arriva, poi chiuso dietro \"Ha ragionato per 12 s\".",
                },
                questions: {
                    title: "Domande interattive",
                    description: "ChatQuestions: una scheda per domanda, opzioni numerate con la consigliata in evidenza, scelta singola o multipla, \"Altro\" con testo libero, un riepilogo e un solo Invia. Tasti: i numeri scelgono, le frecce spostano, Invio prosegue.",
                },
                answered: {
                    title: "Già risposte",
                    description: "Con answers le stesse domande mostrano le risposte date, in sola lettura: per un messaggio passato della conversazione.",
                },
            },
            demo: {
                replay: "Fallo arrivare",
                streaming: "In arrivo…",
                again: "Rispondi di nuovo",
                markdown: "## Piano di rilascio\n\nTre passi, **uno a settimana**:\n\n1. Congelare il branch `main`\n2. Eseguire i controlli ~~manuali~~ automatici\n3. Pubblicare\n\n| Passo | Chi | Quando | Note |\n| --- | --- | --- | --- |\n| Congelamento | Ada | Lun | Annunciarlo nel canale entro mezzogiorno |\n| Controlli | Linus | Mer | Compresa la suite di regressione visiva |\n| Pubblicazione | Grace | Ven | npm e il changelog |\n\n```ts\nexport async function publish(version: string) {\n  await run(`npm publish --tag ${version}`);\n}\n```\n\n> Chiedi prima di pubblicare di venerdì. Vedi [la guida](https://github.com/sherpadvisorylab/llmnative-react).",
                reasoning: "L'utente vuole un rilascio **venerdì**.\n\n- I controlli richiedono due giorni\n- Mercoledì è l'ultimo giorno sicuro per farli\n\nQuindi il congelamento va fatto lunedì.",
                reasoningAnswer: "Congelamento **lunedì**, controlli mercoledì, pubblicazione venerdì.",
                q1Header: "Database",
                q1Question: "Quale database deve usare il progetto?",
                q1Option1: "Postgres",
                q1Option1Description: "Relazionale, gira come servizio",
                q1Option2: "SQLite",
                q1Option2Description: "Un file, niente da avviare",
                q2Header: "Funzioni",
                q2Question: "Quali funzioni entrano nel primo rilascio?",
                q2Option1: "Accesso",
                q2Option2: "Ricerca",
                q2Option3: "Esportazione in CSV",
            },
            propsDocs: {
                markdown: {
                    content: {
                        description: "Markdown GFM del messaggio.",
                    },
                    streaming: {
                        description: "Il testo sta ancora arrivando: la sua fine viene riparata prima di disegnarlo.",
                    },
                    tone: {
                        description: "muted per un testo secondario, come il ragionamento.",
                    },
                    highlight: {
                        description: "Evidenziazione del codice (Prism, caricato quando serve).",
                    },
                    onLinkClick: {
                        description: "Chiamata su un link a una rotta dell'app; gli indirizzi si aprono in una nuova scheda.",
                    },
                    components: {
                        description: "Sostituzioni di singoli elementi, come in react-markdown.",
                    },
                    classNames: {
                        description: "Classi per root, paragraph, heading, list, blockquote, tableWrapper, table, th, td, codeBlock, codeHeader, code, inlineCode, link.",
                    },
                },
                reasoning: {
                    content: {
                        description: "Il ragionamento, in Markdown.",
                    },
                    streaming: {
                        description: "Sta ancora arrivando: aperto (se l'utente non lo chiude), con l'icona che pulsa.",
                    },
                    duration: {
                        description: "Secondi di ragionamento: \"Ha ragionato per 12 s\".",
                    },
                    defaultOpen: {
                        description: "Aperto quando non è in streaming.",
                    },
                    open: {
                        description: "Stato aperto controllato.",
                    },
                    onOpenChange: {
                        description: "Chiamata al click sulla riga di riepilogo.",
                    },
                    label: {
                        description: "Sostituisce il testo del riepilogo.",
                    },
                    icon: {
                        description: "Icona della riga di riepilogo.",
                    },
                    classNames: {
                        description: "Classi per root, trigger, content.",
                    },
                },
                questions: {
                    questions: {
                        description: "Le domande, nella forma dello strumento question di opencode e della elicitation MCP.",
                    },
                    onSubmit: {
                        description: "Tutte le risposte, in ordine: etichette scelte e/o testo libero. Una promessa viene attesa; quando si risolve compaiono le risposte date.",
                    },
                    numbering: {
                        description: "1-2-3 o A-B-C; di default come sono scritte le etichette.",
                    },
                    allowOther: {
                        description: "\"Altro\" con risposta libera su ogni domanda.",
                    },
                    answers: {
                        description: "Risposte già date: mostrate in sola lettura al posto del form.",
                    },
                    disabled: {
                        description: "Mostra il form senza farlo cambiare né inviare.",
                    },
                    autoFocus: {
                        description: "Mette il focus sulla prima opzione, così i numeri funzionano subito.",
                    },
                    submitLabel: {
                        description: "Testo del pulsante di invio.",
                    },
                    classNames: {
                        description: "Classi per root, tabs, tab, panel, question, option, optionSelected, footer, summary.",
                    },
                },
            },
            playground: {
                title: "ChatMarkdown",
            },
            propsTitle: "Props",
        },
    },
});
