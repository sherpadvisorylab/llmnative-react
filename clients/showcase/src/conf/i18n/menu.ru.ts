import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        menu: {
            page: {
                title: 'Menu',
                description: 'Navigatsionnoe menu, zavisyashchee ot marshruta i postroennoe iz konteksta menyu prilozheniya.',
            },
            sections: {
                componentsMenu: {
                    title: 'Menyu komponentov',
                    description: 'Menu chitaet nastroennoe derevo navigatsii prilozheniya i renderit vlozhennye punkty s opzionalnymi badge i obertkami.',
                },
            },
            labels: {
                none: 'net',
                single: 'odin',
                multi: 'neskolko',
                newBadge: 'new',
                betaBadge: 'beta',
            },
            propsDocs: {
                items: {
                    menuKey: { description: 'Klyuch konteksta menyu, peredavaemyy v useMenu.' },
                    as: { description: 'Tip elementa spiska.' },
                    badges: {
                        description: 'Badge, indeksirovannye po nazvaniyu elementa v nizhnem registre.',
                        shortcuts: {
                            none: { label: 'net', help: 'Bez badge v menyu.' },
                            single: { label: 'odin', help: 'Odin badge na alert.' },
                            multi: { label: 'neskolko', help: 'Neskolko badge dlya raznykh klyuchey.' },
                        },
                    },
                    before: { description: 'Kontent pered menyu.' },
                    after: { description: 'Kontent posle menyu.' },
                    wrapperClassName: { description: 'CSS-klassy obertki.' },
                    className: { description: 'CSS-klassy spiska menyu.' },
                    headerClassName: { description: 'CSS-klassy elementov zagolovka.' },
                    itemClassName: { description: 'CSS-klassy elementov li.' },
                    linkClassName: { description: 'CSS-klassy ssylok.' },
                    iconClassName: { description: 'CSS-klassy obertki ikony.' },
                    textClassName: { description: 'CSS-klassy teksta elementa.' },
                    badgeClassName: { description: 'CSS-klassy badge.' },
                    arrowClassName: { description: 'CSS-klassy strely podmenyu.' },
                    submenuClassName: { description: 'CSS-klassy vlozhennykh spiskov.' },
                },
            },
            playground: {
                title: 'Menu',
            },
        },
    },
});
