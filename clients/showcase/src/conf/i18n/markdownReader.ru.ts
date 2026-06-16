import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        markdownReader: {
            page: {
                title: 'MarkdownReader',
                description: 'Рендерит Markdown со стилем @llmnative/react, поддержкой GFM, копированием кода и обработкой внутренних ссылок.',
            },
            sections: {
                renderedMarkdown: {
                    title: 'Отрендеренный Markdown',
                    description: 'Одна и та же строка Markdown может читаться в репозитории и рендериться в приложении.',
                },
            },
            labels: {
                internalNavigationIntercepted: 'Внутренняя навигация перехвачена:',
            },
            demo: {
                content: `# MarkdownReader

Рендерьте Markdown, удобный для репозитория, со стилем @llmnative/react.

## Возможности

- GitHub Flavored Markdown
- Якоря заголовков
- Перехват внутренних ссылок
- Копируемые блоки кода

| Возможность | Статус |
| --- | --- |
| Таблицы | Поддерживаются |
| Списки задач | Поддерживаются |

- [x] Рендерить документацию
- [ ] Подключить страницы в стиле wiki

> Markdown остается читаемым для людей и ИИ, а приложение отображает его как тематизированный UI.

\`\`\`tsx
<MarkdownReader content={markdown} />
\`\`\`

Перейти к [Quick start](/docs/quick-start).`,
                metadataTitle: 'MarkdownReader',
                metadataDescription: 'Рендерит Markdown с поддержкой GFM и тематизированными компонентами.',
            },
            propsDocs: {
                title: 'Props MarkdownReader',
                items: {
                    content: { description: 'Строка Markdown для рендера.' },
                    metadata: { description: 'SEO-метаданные, внедряемые через компонент Head.', typeDetails: `{
  title?: string;
  description?: string;
}` },
                    onInternalLinkClick: { description: 'Перехватывает клики по внутренним ссылкам (относительные пути). Используйте для навигации через React Router.' },
                    components: { description: 'Пользовательские переопределения компонентов react-markdown, объединяемые поверх встроенных тематизированных рендереров вроде h1-h4, p, ul, ol, table, a, pre и code.' },
                    className: { description: 'Дополнительные CSS-классы для prose-обертки.' },
                    wrapperClassName: { description: 'Дополнительные CSS-классы для внешнего div, применяются вместе с className.' },
                },
            },
            playground: {
                title: 'Markdown Reader',
            },
        },
    },
});
