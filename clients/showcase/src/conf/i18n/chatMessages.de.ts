import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        chatMessages: {
            page: {
                title: "Chat-Nachrichten",
                description: "Die Teile einer Modellantwort: Markdown im Streaming, die Überlegung des Modells und interaktive Fragen. ChatMarkdown, ChatReasoning und ChatQuestions.",
            },
            sections: {
                markdown: {
                    title: "Markdown im Streaming",
                    description: "ChatMarkdown rendert GFM (Tabellen, Listen, Überschriften, Zitate, Code mit Hervorhebung und Kopieren). Mit streaming schließt es, was der Text offen gelassen hat, damit eine Tabelle oder ein Codeblock beim Eintreffen nicht springt. In einem schmalen Panel scrollt die Tabelle in sich.",
                },
                reasoning: {
                    title: "Überlegung",
                    description: "ChatReasoning hält die Überlegung des Modells in einem eigenen Block: offen während des Streamings, danach geschlossen hinter \"Hat 12 s überlegt\".",
                },
                questions: {
                    title: "Interaktive Fragen",
                    description: "ChatQuestions: ein Tab pro Frage, nummerierte Optionen mit hervorgehobener Empfehlung, Einfach- oder Mehrfachauswahl, \"Andere\" mit Freitext, eine Überprüfung und ein einziges Senden. Tasten: Zahlen wählen, Pfeile bewegen, Enter fährt fort.",
                },
                answered: {
                    title: "Beantwortet",
                    description: "Mit answers zeigen dieselben Fragen die gegebenen Antworten, schreibgeschützt: für eine frühere Nachricht der Unterhaltung.",
                },
            },
            demo: {
                replay: "Streamen",
                streaming: "Kommt an…",
                again: "Erneut antworten",
                markdown: "## Release-Plan\n\nDrei Schritte, **einer pro Woche**:\n\n1. Den Branch `main` einfrieren\n2. Die ~~manuellen~~ automatischen Prüfungen ausführen\n3. Veröffentlichen\n\n| Schritt | Wer | Wann | Hinweise |\n| --- | --- | --- | --- |\n| Einfrieren | Ada | Mo | Vor Mittag im Kanal ankündigen |\n| Prüfungen | Linus | Mi | Inklusive visueller Regressionstests |\n| Veröffentlichen | Grace | Fr | npm und das Changelog |\n\n```ts\nexport async function publish(version: string) {\n  await run(`npm publish --tag ${version}`);\n}\n```\n\n> Frag nach, bevor du an einem Freitag veröffentlichst. Siehe [die Anleitung](https://github.com/sherpadvisorylab/llmnative-react).",
                reasoning: "Der Nutzer möchte ein Release am **Freitag**.\n\n- Die Prüfungen dauern zwei Tage\n- Mittwoch ist der letzte sichere Tag dafür\n\nAlso muss am Montag eingefroren werden.",
                reasoningAnswer: "Einfrieren am **Montag**, Prüfungen am Mittwoch, Veröffentlichung am Freitag.",
                q1Header: "Datenbank",
                q1Question: "Welche Datenbank soll das Projekt verwenden?",
                q1Option1: "Postgres",
                q1Option1Description: "Relational, läuft als Dienst",
                q1Option2: "SQLite",
                q1Option2Description: "Eine Datei, nichts zu starten",
                q2Header: "Funktionen",
                q2Question: "Welche Funktionen kommen ins erste Release?",
                q2Option1: "Anmeldung",
                q2Option2: "Suche",
                q2Option3: "CSV-Export",
            },
            propsDocs: {
                markdown: {
                    content: {
                        description: "GFM-Markdown der Nachricht.",
                    },
                    streaming: {
                        description: "Der Text kommt noch an: sein Ende wird vor dem Rendern repariert.",
                    },
                    tone: {
                        description: "muted für sekundären Text, etwa die Überlegung.",
                    },
                    highlight: {
                        description: "Syntaxhervorhebung von Code (Prism, bei Bedarf geladen).",
                    },
                    onLinkClick: {
                        description: "Aufgerufen bei einem Link auf eine Route der App; Adressen öffnen sich in einem neuen Tab.",
                    },
                    components: {
                        description: "Ersetzungen einzelner Elemente, wie in react-markdown.",
                    },
                    classNames: {
                        description: "Klassen für root, paragraph, heading, list, blockquote, tableWrapper, table, th, td, codeBlock, codeHeader, code, inlineCode, link.",
                    },
                },
                reasoning: {
                    content: {
                        description: "Die Überlegung, als Markdown.",
                    },
                    streaming: {
                        description: "Kommt noch an: offen (sofern nicht geschlossen), mit pulsierendem Symbol.",
                    },
                    duration: {
                        description: "Sekunden der Überlegung: \"Hat 12 s überlegt\".",
                    },
                    defaultOpen: {
                        description: "Offen, wenn nicht gestreamt wird.",
                    },
                    open: {
                        description: "Gesteuerter Offen-Zustand.",
                    },
                    onOpenChange: {
                        description: "Aufgerufen beim Klick auf die Zusammenfassung.",
                    },
                    label: {
                        description: "Ersetzt den Text der Zusammenfassung.",
                    },
                    icon: {
                        description: "Symbol der Zusammenfassung.",
                    },
                    classNames: {
                        description: "Klassen für root, trigger, content.",
                    },
                },
                questions: {
                    questions: {
                        description: "Die Fragen, im Format des question-Tools von opencode und der MCP-Elicitation.",
                    },
                    onSubmit: {
                        description: "Alle Antworten, in Reihenfolge: gewählte Labels und/oder Freitext. Ein Promise wird abgewartet; danach erscheint der beantwortete Zustand.",
                    },
                    numbering: {
                        description: "1-2-3 oder A-B-C; standardmäßig wie die Labels geschrieben sind.",
                    },
                    allowOther: {
                        description: "\"Andere\" mit Freitext bei jeder Frage.",
                    },
                    answers: {
                        description: "Bereits gegebene Antworten: schreibgeschützt statt des Formulars.",
                    },
                    disabled: {
                        description: "Zeigt das Formular, ohne Änderungen oder Senden zu erlauben.",
                    },
                    autoFocus: {
                        description: "Fokussiert die erste Option, damit die Zahlentasten sofort funktionieren.",
                    },
                    submitLabel: {
                        description: "Text der Senden-Schaltfläche.",
                    },
                    classNames: {
                        description: "Klassen für root, tabs, tab, panel, question, option, optionSelected, footer, summary.",
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
