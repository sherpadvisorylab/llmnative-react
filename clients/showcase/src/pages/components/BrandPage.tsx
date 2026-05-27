import React from 'react';
import { Brand } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const LOGO = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" rx="20" fill="%232563eb"/%3E%3Cpath d="M24 28h48v10H38v10h28v10H38v18H24z" fill="white"/%3E%3C/svg%3E';

const BRAND_PROPS: PropDef[] = [
    { name: 'url', type: 'string', description: 'Router link destination', control: 'text' },
    { name: 'label', type: 'string', description: 'Brand text rendered next to the logo', control: 'text' },
    { name: 'logo', type: 'string', description: 'Logo image source', control: 'text' },
    { name: 'width', type: 'number', description: 'Logo width', control: 'number', min: 16, max: 160 },
    { name: 'height', type: 'number', default: '36', description: 'Logo height', control: 'number', min: 16, max: 160 },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on brand container', control: 'text' },
    { name: 'logoClass', type: 'string', description: 'CSS classes on link/span around logo', control: 'text' },
    { name: 'labelClass', type: 'string', description: 'CSS classes on label text', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: BRAND_PROPS,
    defaultProps: {
        url: '/',
        label: '@llmnative/react',
        logo: LOGO,
        width: 32,
        height: 32,
        wrapClass: '',
        className: 'flex items-center',
        logoClass: 'inline-flex items-center gap-2 text-foreground no-underline',
        labelClass: 'font-semibold',
    },
    render: (p) => <Brand {...p} />,
};

export default function BrandPage() {
    usePlayground(PLAYGROUND, 'Brand');

    return (
        <PageLayout title="Brand" description="Application brand block with optional router link, logo and text label.">
            <Section
                title="Logo and label"
                preview={<Brand url="/" logo={LOGO} label="@llmnative/react" width={32} height={32} />}
                code={`import { Brand } from '@llmnative/react';

<Brand url="/" logo={logoUrl} label="@llmnative/react" width={32} height={32} />`}
            />

            <PropDocsTable props={BRAND_PROPS} />
        </PageLayout>
    );
}
