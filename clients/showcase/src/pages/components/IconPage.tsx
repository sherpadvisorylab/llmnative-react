import React from 'react';
import { Icon } from '@ash/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const ICONS = ['search', 'settings', 'user', 'bell', 'check', 'warning', 'trash', 'download'];

const ICON_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Icon name resolved by the active icon provider', control: 'icon' },
    { name: 'size', type: 'number', default: '16', description: 'Rendered icon size in pixels', control: 'number', min: 8, max: 64 },
    { name: 'className', type: 'string', description: 'CSS classes on the icon component', control: 'text' },
    { name: 'provider', type: 'IconProviderAdapter', description: 'Optional provider override for this icon instance' },
    { name: 'label', type: 'string', description: 'Reserved semantic label prop; current built-in renderer does not output it' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: ICON_PROPS,
    defaultProps: {
        name: 'search',
        size: 28,
        className: 'text-primary',
    },
    render: (p) => (
        <div className="flex items-center gap-3 text-foreground">
            <Icon name={p.name || 'search'} size={p.size} className={p.className || undefined} />
            <span className="font-mono text-sm">{p.name || 'search'}</span>
        </div>
    ),
};

export default function IconPage() {
    usePlayground(PLAYGROUND, 'Icon');

    return (
        <PageLayout title="Icon" description="Provider-backed icon renderer. The active provider is configured globally on App.">
            <Section
                title="Common icons"
                preview={
                    <div className="flex flex-wrap gap-4 text-foreground">
                        {ICONS.map((name) => (
                            <div key={name} className="flex items-center gap-2 rounded-md border px-3 py-2">
                                <Icon name={name} size={18} />
                                <span className="text-sm">{name}</span>
                            </div>
                        ))}
                    </div>
                }
                code={`import { Icon } from '@ash/react';

<Icon name="search" size={18} />
<Icon name="settings" className="text-primary" />`}
            />

            <PropDocsTable props={ICON_PROPS} />
        </PageLayout>
    );
}
