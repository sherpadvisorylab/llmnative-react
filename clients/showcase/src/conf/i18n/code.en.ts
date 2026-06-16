import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        code: {
            page: { title: 'Code', description: 'Syntax highlighted code block powered by Prism, with optional copy action, language loading and theme selection.' },
            sections: {
                tsx: { title: 'TSX block', description: 'Use Code for examples, snippets and generated source previews.' },
                languages: { title: 'Languages', description: 'The component lazy-loads the Prism grammar for the selected language.' },
                themesCopy: { title: 'Themes and copy', description: 'Click a theme to preview it. showCopy controls the clipboard button.' },
                slotsWrapper: { title: 'Slots and wrapper', description: 'pre and post sit outside the code block as left and right side adornments. wrapperClassName and className let the block fit inside richer documentation layouts.' },
            },
        },
    },
});
