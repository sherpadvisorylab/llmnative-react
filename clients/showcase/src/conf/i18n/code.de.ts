import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        code: {
            page: { title: 'Code', description: 'Syntaxhervorgehobener Code-Block auf Basis von Prism mit optionaler Kopieraktion, Sprachladung und Theme-Auswahl.' },
            sections: {
                tsx: { title: 'TSX-Block', description: 'Verwende Code fuer Beispiele, Snippets und Vorschauen generierten Quellcodes.' },
                languages: { title: 'Sprachen', description: 'Die Komponente laedt die Prism-Grammatik fuer die ausgewaehlte Sprache lazy.' },
                themesCopy: { title: 'Themes und Kopieren', description: 'Klicke auf ein Theme, um es vorzuschauen. showCopy steuert den Clipboard-Button.' },
                slotsWrapper: { title: 'Slots und Wrapper', description: 'pre und post sitzen ausserhalb des Code-Blocks als linke und rechte Seitenelemente. wrapperClassName und className helfen dabei, den Block in reichhaltigere Dokumentationslayouts einzupassen.' },
            },
        },
    },
});
