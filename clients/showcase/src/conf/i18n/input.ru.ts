import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        input: {
            page: {
                title: 'Input',
                description: 'Варианты text, number, email, password, color, date, datetime, week, month и textarea. Все поля знают о контексте Form и автоматически интегрируются с ним.',
            },
            sections: {
                textVariants: {
                    title: 'Текстовые варианты',
                    description: 'Самые распространенные типы input. Все поддерживают label, required, placeholder и disabled.',
                },
                numberRange: { title: 'Число и диапазон' },
                dateTime: { title: 'Дата и время' },
                colorPicker: { title: 'Выбор цвета' },
                textarea: {
                    title: 'Textarea',
                    description: 'Многострочный текст с настраиваемым количеством строк.',
                },
                checkbox: { title: 'Checkbox' },
                disabledReadOnlyAfterSet: {
                    title: 'Disabled и readOnlyAfterSet',
                    description: 'readOnlyAfterSet отключает поле после установки значения.',
                },
            },
            labels: {
                fieldLabel: 'Метка поля',
                typeSomething: 'Введите что-нибудь...',
                firstName: 'Имя',
                email: 'Email',
                password: 'Пароль',
                website: 'Сайт',
                age: 'Возраст',
                score: 'Оценка (0-100)',
                birthday: 'Дата рождения',
                startTime: 'Время начала',
                appointment: 'Встреча',
                week: 'Неделя',
                month: 'Месяц',
                brandColor: 'Цвет бренда',
                bio: 'О себе',
                tellUsAboutYourself: 'Расскажите о себе...',
                acceptTerms: 'Я принимаю условия и положения',
                recordId: 'ID записи',
                slug: 'Slug',
            },
            propsDocs: {
                title: 'Свойства Input',
                items: {
                    name: { description: 'Имя поля как ключ формы и путь dot-notation.' },
                    label: { description: 'Метка над полем.' },
                    type: { description: 'HTML-тип input.' },
                    placeholder: { description: 'Текст-подсказка.' },
                    required: { description: 'Помечает поле как обязательное и показывает звездочку в label.' },
                    disabled: { description: 'Делает поле только для чтения.' },
                    readOnlyAfterSet: { description: 'Поле становится только для чтения после установки значения.' },
                    defaultValue: { description: 'Начальное значение, если поле не управляется Form.' },
                    min: { description: 'Минимальное значение для number и range.' },
                    max: { description: 'Максимальное значение для number и range.' },
                    step: { description: 'Шаг для number и range.' },
                    feedback: { description: 'Сообщение валидации под полем.' },
                    id: { description: 'Явный id для элемента input. Если не указан, генерируется автоматически.' },
                    labelClassName: { description: 'CSS-классы для элемента label.' },
                    validator: { description: 'Пользовательская функция валидации. Верните текст ошибки, чтобы заблокировать отправку.' },
                    className: { description: 'CSS-классы элемента input.' },
                    wrapperClassName: { description: 'CSS-классы внешнего контейнера.' },
                },
            },
            playground: {
                title: 'Input',
            },
        },
    },
});
