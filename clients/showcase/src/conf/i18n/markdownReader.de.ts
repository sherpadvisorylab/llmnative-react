import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        markdownReader: {
            page: {
                title: 'MarkdownReader',
                description: 'Rendert Markdown mit @llmnative/react-Styling, GFM-Unterstutzung, Code-Kopie und Behandlung interner Links.',
            },
            sections: {
                renderedMarkdown: {
                    title: 'Gerendertes Markdown',
                    description: 'Dieselbe Markdown-Zeichenfolge kann im Repository gelesen und in der App gerendert werden.',
                },
            },
            labels: {
                internalNavigationIntercepted: 'Interne Navigation abgefangen:',
            },
            demo: {
                content: `# MarkdownReader

Rendere repository-freundliches Markdown mit dem Stil von @llmnative/react.

## Funktionen

- GitHub Flavored Markdown
- Uberschrift-Anker
- Abfangen interner Links
- Kopierbare Codeblöcke

| Funktion | Status |
| --- | --- |
| Tabellen | Unterstutzt |
| Task-Listen | Unterstutzt |

- [x] Dokumentation rendern
- [ ] Wiki-artige Seiten verdrahten

> Markdown bleibt fur Menschen und KI lesbar, wahrend die App es als thematisierte UI rendert.

\`\`\`tsx
<MarkdownReader content={markdown} />
\`\`\`

Weiter zu [Quick start](/docs/quick-start).`,
                metadataTitle: 'MarkdownReader',
                metadataDescription: 'Rendert Markdown mit GFM-Unterstutzung und thematisierten Komponenten.',
            },
            propsDocs: {
                title: 'MarkdownReader-Props',
                items: {
                    content: { description: 'Markdown-Zeichenfolge zum Rendern.' },
                    metadata: { description: 'SEO-Metadaten, die uber die Head-Komponente injiziert werden.', typeDetails: `{
  title?: string;
  description?: string;
}` },
                    onInternalLinkClick: { description: 'Fangt Klicks auf interne Links (relative Pfade) ab. Damit kann mit React Router navigiert werden.' },
                    components: { description: 'Benutzerdefinierte react-markdown-Komponenten, die uber die eingebauten thematisierten Renderer wie h1-h4, p, ul, ol, table, a, pre und code gelegt werden.' },
                    className: { description: 'Zusatzliche CSS-Klassen auf dem Prose-Wrapper.' },
                    wrapperClassName: { description: 'Zusatzliche CSS-Klassen auf dem aussersten div, zusammen mit className angewendet.' },
                },
            },
            playground: {
                title: 'Markdown Reader',
            },
        },
    },
});
