import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        menu: {
            page: {
                title: 'Menu',
                description: 'Route-aware navigation menu rendered from an App menu context.',
            },
            sections: {
                componentsMenu: {
                    title: 'Components menu',
                    description: 'Menu reads the configured app navigation tree and renders nested items with optional badges and custom wrappers.',
                },
            },
            labels: {
                none: 'none',
                single: 'single',
                multi: 'multi',
                newBadge: 'new',
                betaBadge: 'beta',
            },
            propsDocs: {
                items: {
                    menuKey: { description: 'Menu context key passed to useMenu.' },
                    as: { description: 'List element type.' },
                    badges: {
                        description: 'Badges keyed by lower-case item title.',
                        shortcuts: {
                            none: { label: 'none', help: 'No menu badges.' },
                            single: { label: 'single', help: 'One badge on alert.' },
                            multi: { label: 'multi', help: 'Multiple keyed badges.' },
                        },
                    },
                    before: { description: 'Content before menu.' },
                    after: { description: 'Content after menu.' },
                    wrapperClassName: { description: 'CSS classes on wrapper.' },
                    className: { description: 'CSS classes on menu list.' },
                    headerClassName: { description: 'CSS classes on header items.' },
                    itemClassName: { description: 'CSS classes on li items.' },
                    linkClassName: { description: 'CSS classes on links.' },
                    iconClassName: { description: 'CSS classes on icon wrapper.' },
                    textClassName: { description: 'CSS classes on item text.' },
                    badgeClassName: { description: 'CSS classes on badges.' },
                    arrowClassName: { description: 'CSS classes on submenu arrow.' },
                    submenuClassName: { description: 'CSS classes on nested lists.' },
                },
            },
            playground: {
                title: 'Menu',
            },
        },
    },
});
