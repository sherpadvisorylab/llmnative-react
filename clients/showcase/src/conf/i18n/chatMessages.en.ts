import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        chatMessages: {
            page: {
                title: "Chat messages",
                description: "The parts of a model reply: streaming Markdown, the reasoning of the model and interactive questions. ChatMarkdown, ChatReasoning and ChatQuestions.",
            },
            sections: {
                markdown: {
                    title: "Streaming Markdown",
                    description: "ChatMarkdown renders GFM (tables, lists, headings, quotes, code with highlighting and copy). With streaming it closes what the text left open, so a table or a code block does not jump while it arrives. In a narrow panel the table scrolls inside itself.",
                },
                reasoning: {
                    title: "Reasoning",
                    description: "ChatReasoning keeps the reasoning of the model in a block of its own: open while it streams, then closed behind \"Reasoned for 12 s\".",
                },
                questions: {
                    title: "Interactive questions",
                    description: "ChatQuestions: one tab per question, numbered choices with the recommended one highlighted, single or multiple choice, \"Other\" with free text, a review and one Submit. Keys: numbers choose, arrows move, Enter continues.",
                },
                answered: {
                    title: "Answered",
                    description: "With answers, the same questions show what was answered, read-only: for a past message of the conversation.",
                },
            },
            demo: {
                replay: "Stream it",
                streaming: "Streaming…",
                again: "Answer again",
                markdown: "## Release plan\n\nThree steps, **one per week**:\n\n1. Freeze the `main` branch\n2. Run the ~~manual~~ automated checks\n3. Publish\n\n| Step | Owner | Due | Notes |\n| --- | --- | --- | --- |\n| Freeze | Ada | Mon | Announce it in the channel before noon |\n| Checks | Linus | Wed | Includes the visual regression suite |\n| Publish | Grace | Fri | npm and the changelog |\n\n```ts\nexport async function publish(version: string) {\n  await run(`npm publish --tag ${version}`);\n}\n```\n\n> Ask before publishing on a Friday. See [the guide](https://github.com/sherpadvisorylab/llmnative-react).",
                reasoning: "The user wants a release on **Friday**.\n\n- Checks take two days\n- Wednesday is the last safe day for them\n\nSo the freeze has to happen on Monday.",
                reasoningAnswer: "Freeze on **Monday**, checks on Wednesday, publish on Friday.",
                q1Header: "Database",
                q1Question: "Which database should the project use?",
                q1Option1: "Postgres",
                q1Option1Description: "Relational, runs as a service",
                q1Option2: "SQLite",
                q1Option2Description: "A file, nothing to run",
                q2Header: "Features",
                q2Question: "Which features go in the first release?",
                q2Option1: "Login",
                q2Option2: "Search",
                q2Option3: "Export to CSV",
            },
            propsDocs: {
                markdown: {
                    content: {
                        description: "GFM Markdown of the message.",
                    },
                    streaming: {
                        description: "The text is still arriving: its end is repaired before rendering.",
                    },
                    tone: {
                        description: "muted for secondary text, such as the reasoning.",
                    },
                    highlight: {
                        description: "Syntax highlighting of fenced code (Prism, loaded on demand).",
                    },
                    onLinkClick: {
                        description: "Called on a link to a route of the app; addresses open in a new tab.",
                    },
                    components: {
                        description: "Overrides of single elements, as in react-markdown.",
                    },
                    classNames: {
                        description: "Classes for root, paragraph, heading, list, blockquote, tableWrapper, table, th, td, codeBlock, codeHeader, code, inlineCode, link.",
                    },
                },
                reasoning: {
                    content: {
                        description: "The reasoning, as Markdown.",
                    },
                    streaming: {
                        description: "Still arriving: open (unless the user closed it), with a pulsing icon.",
                    },
                    duration: {
                        description: "Seconds of reasoning: \"Reasoned for 12 s\".",
                    },
                    defaultOpen: {
                        description: "Open when not streaming.",
                    },
                    open: {
                        description: "Controlled open state.",
                    },
                    onOpenChange: {
                        description: "Called when the summary line is clicked.",
                    },
                    label: {
                        description: "Replaces the summary text.",
                    },
                    icon: {
                        description: "Icon of the summary line.",
                    },
                    classNames: {
                        description: "Classes for root, trigger, content.",
                    },
                },
                questions: {
                    questions: {
                        description: "The questions, in the shape of the question tool of opencode and of MCP elicitation.",
                    },
                    onSubmit: {
                        description: "All the answers, in order: chosen labels and/or free text. A promise is awaited; when it resolves the answered state shows.",
                    },
                    numbering: {
                        description: "1-2-3 or A-B-C; by default as the labels are written.",
                    },
                    allowOther: {
                        description: "\"Other\" with a free-text answer on every question.",
                    },
                    answers: {
                        description: "Answers already given: shown read-only instead of the form.",
                    },
                    disabled: {
                        description: "Shows the form without letting it change or be sent.",
                    },
                    autoFocus: {
                        description: "Focuses the first choice, so the number keys work at once.",
                    },
                    submitLabel: {
                        description: "Text of the submit button.",
                    },
                    classNames: {
                        description: "Classes for root, tabs, tab, panel, question, option, optionSelected, footer, summary.",
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
