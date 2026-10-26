import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        chatMessages: {
            page: {
                title: "Сообщения чата",
                description: "Части ответа модели: Markdown в потоке, рассуждение модели и интерактивные вопросы. ChatMarkdown, ChatReasoning и ChatQuestions.",
            },
            sections: {
                markdown: {
                    title: "Markdown в потоке",
                    description: "ChatMarkdown отображает GFM (таблицы, списки, заголовки, цитаты, код с подсветкой и копированием). С streaming он закрывает то, что текст оставил открытым, поэтому таблица или блок кода не прыгают, пока приходят. В узкой панели таблица прокручивается внутри себя.",
                },
                reasoning: {
                    title: "Рассуждение",
                    description: "ChatReasoning держит рассуждение модели в отдельном блоке: открыт, пока приходит, затем свёрнут за строкой «Рассуждал 12 с».",
                },
                questions: {
                    title: "Интерактивные вопросы",
                    description: "ChatQuestions: вкладка на каждый вопрос, пронумерованные варианты с выделенным рекомендуемым, одиночный или множественный выбор, «Другое» со свободным текстом, проверка и одна кнопка отправки. Клавиши: цифры выбирают, стрелки перемещают, Enter продолжает.",
                },
                answered: {
                    title: "Отвечено",
                    description: "С answers те же вопросы показывают данные ответы только для чтения: для прошлого сообщения разговора.",
                },
            },
            demo: {
                replay: "Запустить поток",
                streaming: "Приходит…",
                again: "Ответить снова",
                markdown: "## План релиза\n\nТри шага, **по одному в неделю**:\n\n1. Заморозить ветку `main`\n2. Запустить ~~ручные~~ автоматические проверки\n3. Опубликовать\n\n| Шаг | Кто | Когда | Заметки |\n| --- | --- | --- | --- |\n| Заморозка | Ada | Пн | Объявить в канале до полудня |\n| Проверки | Linus | Ср | Включая визуальные регрессионные тесты |\n| Публикация | Grace | Пт | npm и changelog |\n\n```ts\nexport async function publish(version: string) {\n  await run(`npm publish --tag ${version}`);\n}\n```\n\n> Спросите, прежде чем публиковать в пятницу. См. [руководство](https://github.com/sherpadvisorylab/llmnative-react).",
                reasoning: "Пользователь хочет релиз в **пятницу**.\n\n- Проверки занимают два дня\n- Среда — последний безопасный день для них\n\nЗначит, заморозка должна быть в понедельник.",
                reasoningAnswer: "Заморозка в **понедельник**, проверки в среду, публикация в пятницу.",
                q1Header: "База данных",
                q1Question: "Какую базу данных использовать в проекте?",
                q1Option1: "Postgres",
                q1Option1Description: "Реляционная, работает как сервис",
                q1Option2: "SQLite",
                q1Option2Description: "Один файл, ничего запускать не нужно",
                q2Header: "Функции",
                q2Question: "Какие функции войдут в первый релиз?",
                q2Option1: "Вход",
                q2Option2: "Поиск",
                q2Option3: "Экспорт в CSV",
            },
            propsDocs: {
                markdown: {
                    content: {
                        description: "GFM Markdown сообщения.",
                    },
                    streaming: {
                        description: "Текст ещё приходит: его конец исправляется перед отображением.",
                    },
                    tone: {
                        description: "muted для второстепенного текста, например рассуждения.",
                    },
                    highlight: {
                        description: "Подсветка синтаксиса кода (Prism, загружается по требованию).",
                    },
                    onLinkClick: {
                        description: "Вызывается для ссылки на маршрут приложения; адреса открываются в новой вкладке.",
                    },
                    components: {
                        description: "Замена отдельных элементов, как в react-markdown.",
                    },
                    classNames: {
                        description: "Классы для root, paragraph, heading, list, blockquote, tableWrapper, table, th, td, codeBlock, codeHeader, code, inlineCode, link.",
                    },
                },
                reasoning: {
                    content: {
                        description: "Рассуждение в Markdown.",
                    },
                    streaming: {
                        description: "Ещё приходит: открыт (если пользователь не закрыл), с пульсирующей иконкой.",
                    },
                    duration: {
                        description: "Секунды рассуждения: «Рассуждал 12 с».",
                    },
                    defaultOpen: {
                        description: "Открыт, когда не в потоке.",
                    },
                    open: {
                        description: "Управляемое состояние открытия.",
                    },
                    onOpenChange: {
                        description: "Вызывается при клике по строке сводки.",
                    },
                    label: {
                        description: "Заменяет текст сводки.",
                    },
                    icon: {
                        description: "Иконка строки сводки.",
                    },
                    classNames: {
                        description: "Классы для root, trigger, content.",
                    },
                },
                questions: {
                    questions: {
                        description: "Вопросы в формате инструмента question из opencode и MCP elicitation.",
                    },
                    onSubmit: {
                        description: "Все ответы по порядку: выбранные метки и/или свободный текст. Promise ожидается; после него показывается отвеченное состояние.",
                    },
                    numbering: {
                        description: "1-2-3 или A-B-C; по умолчанию как написаны метки.",
                    },
                    allowOther: {
                        description: "«Другое» со свободным ответом в каждом вопросе.",
                    },
                    answers: {
                        description: "Уже данные ответы: показываются только для чтения вместо формы.",
                    },
                    disabled: {
                        description: "Показывает форму без возможности менять и отправлять.",
                    },
                    autoFocus: {
                        description: "Ставит фокус на первый вариант, чтобы цифры работали сразу.",
                    },
                    submitLabel: {
                        description: "Текст кнопки отправки.",
                    },
                    classNames: {
                        description: "Классы для root, tabs, tab, panel, question, option, optionSelected, footer, summary.",
                    },
                },
            },
            playground: {
                title: "ChatMarkdown",
            },
            propsTitle: "Свойства",
        },
    },
});
