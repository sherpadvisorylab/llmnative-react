import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        code: {
            page: { title: 'Code', description: 'Блок кода с подсветкой синтаксиса на базе Prism, с необязательным копированием, загрузкой языка и выбором темы.' },
            sections: {
                tsx: { title: 'Блок TSX', description: 'Используйте Code для примеров, сниппетов и предварительного просмотра сгенерированного исходника.' },
                languages: { title: 'Языки', description: 'Компонент лениво загружает грамматику Prism для выбранного языка.' },
                themesCopy: { title: 'Темы и копирование', description: 'Нажмите на тему, чтобы просмотреть ее. showCopy управляет кнопкой копирования.' },
                slotsWrapper: { title: 'Слоты и wrapper', description: 'pre и post располагаются снаружи блока кода как левые и правые боковые элементы. wrapperClassName и className помогают встроить блок в более насыщенные документирующие макеты.' },
            },
        },
    },
});
