import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

const TAB_LABELS = ['General', 'Advanced', 'Permissions'];

function DemoTabs({ position }: { position: string }) {
    const [active, setActive] = React.useState(0);
    const isVertical = position === 'left' || position === 'right';
    const isTabs = position === 'default';

    const menu = (
        <ul className={`nav ${isTabs ? 'nav-tabs' : 'nav-pills'}${isVertical ? ' flex-column' : ''}`}>
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

export default function TabPage() {
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
        </PageLayout>
    );
}
