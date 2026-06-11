import React from 'react';
import { Tab, TabItem } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

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
    { name: 'defaultIndex', type: 'number', default: '0', description: 'Index of the initially active tab', control: 'number', min: 0 },
    { name: 'layout', type: '"default" | "top" | "left" | "right" | "bottom"', default: '"default"', description: 'Layout position of the tab navigation', control: 'select', options: ['default', 'top', 'left', 'right', 'bottom'] },
    { name: 'before', type: 'ReactNode', description: 'Content rendered immediately before the tab container' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered immediately after the tab container' },
    { name: 'motion', type: 'MotionReference', description: 'Named motion preset or inline MotionProps override applied to each tab pane on activation' },
    { name: 'className', type: 'string', description: 'Additional CSS classes on the Tab root', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const TABITEM_PROPS: PropDef[] = [
    { name: 'label', type: 'ReactNode', required: true, description: 'Tab trigger label' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Tab panel content' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: TAB_PROPS,
    defaultProps: { layout: 'default', defaultIndex: 0, className: '', wrapperClassName: '' },
    render: (p) => (
        <Tab
            layout={p.layout}
            defaultIndex={p.defaultIndex}
            className={p.className || undefined}
            wrapperClassName={p.wrapperClassName || undefined}
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
            description="Tab navigation with five layout positions. Renders as classic underline tabs or pill-style depending on layout."
        >
            {POSITIONS.map((pos) => (
                <Section
                    key={pos}
                    title={`layout="${pos}"`}
                    description={POSITION_NOTES[pos]}
                    preview={
                        <Tab layout={pos}>
                            <TabItem label="General">Content of the General tab.</TabItem>
                            <TabItem label="Advanced">Content of the Advanced tab.</TabItem>
                            <TabItem label="Permissions">Content of the Permissions tab.</TabItem>
                        </Tab>
                    }
                    code={`import { Tab, TabItem } from '@llmnative/react';

<Tab layout="${pos}">
    <TabItem label="General">General content</TabItem>
    <TabItem label="Advanced">Advanced content</TabItem>
    <TabItem label="Permissions">Permissions content</TabItem>
</Tab>`}
                />
            ))}

            <PropDocsTable props={TAB_PROPS} title="Tab props" />
            <PropDocsTable props={TABITEM_PROPS} title="TabItem props" />

        </PageLayout>
    );
}
