import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        icon: {
            page: { title: 'Icon', description: 'Рендерер иконок на основе провайдеров. Активная библиотека иконок настраивается глобально в App и может переключаться во время выполнения. Встроенные провайдеры: lucide (по умолчанию), phosphor.' },
            sections: {
                basicUsage: { description: 'Рендерит любую иконку по имени. Активный провайдер разрешает имя в соответствующий компонент.' },
                catalog: { title: 'Каталог иконок', description: 'Общие имена иконок, поддерживаемые всеми встроенными провайдерами. Активный провайдер: {providerId}.' },
                sizes: { description: 'Prop size задает ширину и высоту в пикселях. Значение по умолчанию - 16.' },
                colors: { title: 'Цвета через className', description: 'Иконки наследуют CSS-цвет текста. Используйте любые utility-классы Tailwind вида text-*.' },
                providers: { title: 'Встроенные провайдеры: lucide vs phosphor', description: 'lucide используется по умолчанию. phosphor встроен. Оба провайдера поддерживают одинаковые имена иконок.' },
                phosphor: { title: 'Варианты толщины Phosphor', description: 'Передавайте weight прямо в Icon: не нужно заново создавать провайдер. Поддерживаемые значения: thin, light, regular (по умолчанию), bold, fill, duotone.' },
                appConfig: { title: 'Конфигурация на уровне App', description: 'Провайдер иконок задается один раз в App и наследуется через context. Его можно менять во время выполнения с помощью useIconController.' },
                aliases: { title: 'Алиасы', description: 'Сопоставляйте собственные семантические имена с именами конкретного провайдера. Настраивается один раз на уровне App и работает с любым провайдером.' },
                a11y: { title: 'Доступность', description: 'Иконки без label получают aria-hidden (декоративные). Указывайте label, если иконка несет смысл без соседнего текста.' },
                customProvider: { title: 'Пользовательский провайдер', description: 'Реализуйте IconProviderAdapter, чтобы интегрировать любую библиотеку иконок.' },
            },
        },
    },
});
