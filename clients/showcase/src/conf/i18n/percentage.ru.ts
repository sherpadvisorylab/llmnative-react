import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({ showcase: { percentage: {
    page: { title: 'Percentage', description: 'Индикатор прогресса в виде горизонтальной полосы или кругового счетчика с нормализацией min/max и цветами, согласованными с темой.' },
    sections: {
        bars: { title: 'Полосы прогресса', description: 'Используйте полосы для плотных дашбордов и панелей деталей в таблицах. Значение нормализуется между min и max.' },
        circles: { title: 'Круговые индикаторы', description: 'Используйте круги для сводных метрик, где процент является главным визуальным сигналом.' },
        normalization: { title: 'Нормализация min/max', description: 'Показываемый процент вычисляется как (value - min) / (max - min), затем ограничивается диапазоном от 0 до 100.' },
        variants: { title: 'Цветовые варианты и слоты', description: 'variant управляет заливкой. trackVariant управляет треком. before/after могут добавлять окружающий контекст.' },
    },
    labels: {
        completion: 'Завершение',
        storage: 'Хранилище',
        budgetUsed: 'Бюджет использован',
        risk: 'Риск',
        quality: 'Качество',
        coverage: 'Покрытие',
        noText: 'Без текста',
        revenueTarget: 'Цель по выручке: 75 из 150',
        temperatureRange: 'Диапазон температуры: 30 в 20-40',
        clampedAboveMax: 'Ограничено выше максимума',
    },
    propsDocs: { items: {
        value: { description: 'Текущее значение до нормализации min/max.' }, max: { description: 'Максимальное значение, соответствующее 100%.' }, min: { description: 'Минимальное значение, соответствующее 0%.' }, appearance: { description: 'Форма индикатора прогресса.' }, variant: { description: 'Цвет заливки прогресса.' }, trackVariant: { description: 'Цвет трека или фона.' }, thickness: { description: 'Высота полосы или толщина линии круга.' }, showText: { description: 'Показывать текст нормализованного процента.' }, size: { description: 'Ширина полосы в процентах или размер круга в пикселях.' }, fontSize: { description: 'Размер текста процента в пикселях.' }, label: { description: 'Подпись над индикатором.' }, before: { description: 'Контент перед компонентом.' }, after: { description: 'Контент после компонента.' }, className: { description: 'CSS-классы на отрисованном индикаторе.' }, wrapperClassName: { description: 'CSS-классы на обертке.' },
    } },
    playground: { title: 'Percentage', defaultLabel: 'Завершение', props: {
        value: { description: 'Текущее значение до нормализации min/max.' }, max: { description: 'Максимальное значение, соответствующее 100%.' }, min: { description: 'Минимальное значение, соответствующее 0%.' }, appearance: { description: 'Форма индикатора прогресса.' }, variant: { description: 'Цвет заливки прогресса.' }, trackVariant: { description: 'Цвет трека или фона.' }, thickness: { description: 'Высота полосы или толщина линии круга.' }, showText: { description: 'Показывать текст нормализованного процента.' }, size: { description: 'Ширина полосы в процентах или размер круга в пикселях.' }, fontSize: { description: 'Размер текста процента в пикселях.' }, label: { description: 'Подпись над индикатором.' }, before: { description: 'Контент перед компонентом.' }, after: { description: 'Контент после компонента.' }, className: { description: 'CSS-классы на отрисованном индикаторе.' }, wrapperClassName: { description: 'CSS-классы на обертке.' },
    } },
} } });
