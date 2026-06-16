import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        markdownReader: {
            page: {
                title: 'MarkdownReader',
                description: 'Renderizza Markdown con styling @llmnative/react, supporto GFM, copia del codice e gestione dei link interni.',
            },
            sections: {
                renderedMarkdown: {
                    title: 'Markdown renderizzato',
                    description: 'La stessa stringa Markdown puo essere letta nel repository e renderizzata nell app.',
                },
            },
            labels: {
                internalNavigationIntercepted: 'Navigazione interna intercettata:',
            },
            demo: {
                content: `# MarkdownReader

Renderizza Markdown adatto al repository con lo stile di @llmnative/react.

## Funzionalita

- GitHub Flavored Markdown
- Anchor per i titoli
- Intercettazione dei link interni
- Blocchi di codice copiabili

| Funzionalita | Stato |
| --- | --- |
| Tabelle | Supportate |
| Task list | Supportate |

- [x] Renderizzare la documentazione
- [ ] Collegare pagine in stile wiki

> Il Markdown resta leggibile per umani e AI, mentre l app lo renderizza come UI tematizzata.

\`\`\`tsx
<MarkdownReader content={markdown} />
\`\`\`

Continua su [Quick start](/docs/quick-start).`,
                metadataTitle: 'MarkdownReader',
                metadataDescription: 'Renderizza Markdown con supporto GFM e componenti tematizzati.',
            },
            propsDocs: {
                title: 'Props MarkdownReader',
                items: {
                    content: { description: 'Stringa Markdown da renderizzare.' },
                    metadata: { description: 'Metadati SEO iniettati tramite il componente Head.', typeDetails: `{
  title?: string;
  description?: string;
}` },
                    onInternalLinkClick: { description: 'Intercetta i click sui link interni (percorsi relativi). Usalo per navigare con React Router.' },
                    components: { description: 'Override personalizzati dei componenti react-markdown, fusi sopra i renderer tematizzati built-in come h1-h4, p, ul, ol, table, a, pre e code.' },
                    className: { description: 'Classi CSS aggiuntive sul wrapper prose.' },
                    wrapperClassName: { description: 'Classi CSS aggiuntive sul div piu esterno, applicate insieme a className.' },
                },
            },
            playground: {
                title: 'Markdown Reader',
            },
        },
    },
});
