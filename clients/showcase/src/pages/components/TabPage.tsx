import React from 'react';
import { Tab, TabItem } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const TAB_LABELS = ['General', 'Advanced', 'Permissions'];

function DemoTabs({ position }: { position: string }) {
    const [active, setActive] = React.useState(0);
    const isVertical = position === 'left' || position === 'right';
    const isTabs = position === 'default';

    const menu = (
        <ul className={`nav ${isTabs ? 'nav-tabs' : 'nav-pills'}${isVertical ? ' flex-col' : ''}`}>
            {TAB_LABELS.map((label, i) => (
                <li key={label} className="nav-item">
                    <button
                        className={`nav-link${active === i ? ' active' : ''}`}
                        onClick={() => setActive(i)}
                    >
                        {label}
                    </button>
                </li>
            ))}
        </ul>
    );

    const content = (
        <div className="p-3 text-sm text-muted-foreground flex-1">
            Content of the <strong>{TAB_LABELS[active]}</strong> tab.
        </div>
    );

    if (position === 'left')   return <div className="flex gap-2 w-full">{menu}{content}</div>;
    if (position === 'right')  return <div className="flex gap-2 w-full">{content}{menu}</div>;
    if (position === 'bottom') return <div className="flex flex-col gap-2 w-full">{content}{menu}</div>;

    return (
        <div className="w-full">
            {menu}
            <div className="p-3 text-sm text-muted-foreground">
                Content of the <strong>{TAB_LABELS[active]}</strong> tab.
            </div>
        </div>
    );
}

const POSITIONS = ['default', 'top', 'left', 'right', 'bottom'] as const;

const POSITION_NOTES: Record<string, string> = {
    default: 'Classic underline tabs (nav-tabs). Best for primary content sections.',
    top: 'Pill tabs at the top (nav-pills). Good for filters or sub-views.',
    left: 'Vertical pills on the left. Ideal for settings pages.',
    right: 'Vertical pills on the right.',
    bottom: 'Pills below the content.',
};

const TAB_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'TabItem children' },
    { name: 'defaultTab', type: 'number', default: '0', description: 'Index of the initially active tab', control: 'number', min: 0 },
    { name: 'tabPosition', type: '"default" | "top" | "left" | "right" | "bottom"', default: '"default"', description: 'Layout position of the tab navigation', control: 'select', options: ['default', 'top', 'left', 'right', 'bottom'] },
    { name: 'className', type: 'string', description: 'Additional CSS classes on the Tab root', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const TABITEM_PROPS: PropDef[] = [
    { name: 'label', type: 'ReactNode', required: true, description: 'Tab trigger label' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Tab panel content' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: TAB_PROPS,
    defaultProps: { tabPosition: 'default', defaultTab: 0, className: '', wrapClass: '' },
    render: (p) => (
        <Tab
            tabPosition={p.tabPosition}
            defaultTab={p.defaultTab}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
        >
            <TabItem label="General">General settings content.</TabItem>
            <TabItem label="Advanced">Advanced options content.</TabItem>
            <TabItem label="Permissions">Permission management.</TabItem>
        </Tab>
    ),
};

export default function TabPage() {
    usePlayground(PLAYGROUND, 'Tab');

    return (
        <PageLayout
            title="Tab"
            description="Tab navigation with five layout positions. Renders as classic underline tabs or pill-style depending on position."
        >
            {POSITIONS.map((pos) => (
                <Section
                    key={pos}
                    title={`tabPosition="${pos}"`}
                    description={POSITION_NOTES[pos]}
                    preview={<DemoTabs position={pos} />}
                    code={`import { Tab, TabItem } from 'react-firestrap';

<Tab tabPosition="${pos}">
    <TabItem label="General">General content</TabItem>
    <TabItem label="Advanced">Advanced content</TabItem>
    <TabItem label="Permissions">Permissions content</TabItem>
</Tab>`}
                />
            ))}

            <PropsTable props={TAB_PROPS} title="Tab props" />
            <PropsTable props={TABITEM_PROPS} title="TabItem props" />

        </PageLayout>
    );
}
