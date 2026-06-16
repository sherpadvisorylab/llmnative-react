import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridDb: {
            page: {
                title: 'GridDB',
                description: 'Вариант Grid с provider. Подписывается на путь DataProvider и автоматически получает обновления, включая фильтрацию, сортировку и переназначение полей на стороне provider.',
            },
            sections: {
                basicUsage: {
                    title: 'Базовое использование',
                    description: 'Минимальная рабочая форма GridDB. Передайте путь, и Grid подпишется на коллекцию, выводя колонки из входящих записей.',
                },
                providerFilter: {
                    title: 'Фильтр на стороне provider',
                    description: 'where фильтрует записи на стороне provider до того, как они попадут в компонент, поэтому грид не перегружает данные.',
                },
                providerOrder: {
                    title: 'Сортировка на стороне provider',
                    description: 'order сортирует записи на стороне provider до того, как компонент их получит.',
                },
                fromUrl: {
                    title: 'fromUrl - путь от маршрута',
                    description: 'fromUrl определяет путь коллекции по текущему pathname маршрута вместо жестко заданного пути. Этот пример читает данные из URL текущей страницы.',
                },
                grouping: {
                    title: 'Группировка',
                    description: 'groupBy разделяет строки под заголовками секций. Работает и для таблицы, и для галереи, и может сочетаться с сортировкой на стороне provider.',
                },
            },
            labels: {
                teamMembers: 'Участники команды',
            },
            propsDocs: {
                categories: {
                    gridDb: 'GridDB',
                    shared: 'Общие',
                },
                items: {
                    path: { description: 'Путь коллекции DataProvider. Используйте вместе с fromUrl={false} (по умолчанию).' },
                    fromUrl: { description: 'Если true, путь коллекции берется из текущего pathname, а не из path. fromUrl всегда имеет приоритет.' },
                    recordId: { description: 'Определитель идентичности для выбора, состояния редактирования и путей мутаций. Передайте имя поля или стрелочную функцию.' },
                    where: { description: 'Фильтр на стороне provider, применяемый до стриминга записей.' },
                    order: { description: 'Сортировка на стороне provider, применяемая до стриминга записей.' },
                    fieldMap: { description: 'Переименовывает поля provider в имена, используемые в UI, до рендера.' },
                },
            },
            playground: {
                groups: {
                    gridDb: 'GridDB',
                    shared: 'Общие',
                },
                props: {
                    path: { description: 'Путь коллекции, используемый когда fromUrl отключен.' },
                    fromUrl: { description: 'Берет путь коллекции из текущего pathname. В этом playground это переключает на другой seed-набор данных.' },
                    recordId: {
                        description: 'Определитель идентичности записи.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'Использовать нативное ключевое поле provider.' },
                            explicitId: { label: 'id', help: 'Использовать явное поле id.' },
                            functionId: { label: 'fn', help: 'Стрелочная функция, возвращающая поле id.' },
                        },
                    },
                    where: {
                        description: 'Фильтр на стороне provider перед стримингом записей.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'Без фильтра.' },
                            active: { label: 'active', help: 'Показывать только активных участников.' },
                            admins: { label: 'admins', help: 'Показывать только администраторов.' },
                        },
                    },
                    order: {
                        description: 'Сортировка на стороне provider перед стримингом записей.',
                        shortcuts: {
                            none: { label: 'none', help: 'Сохранить порядок provider по умолчанию.' },
                            nameAsc: { label: 'name asc', help: 'Сортировать по имени по возрастанию.' },
                            emailDesc: { label: 'email desc', help: 'Сортировать по email по убыванию.' },
                        },
                    },
                    fieldMap: {
                        description: 'Переименовывает поля provider в имена UI.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'Без переназначения.' },
                            fullName: { label: 'fullName', help: 'Показывать provider-поле "name" как "fullName".' },
                        },
                    },
                },
            },
        },
    },
});
