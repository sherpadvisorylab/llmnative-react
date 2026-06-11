import React from 'react';
import { Card } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Card body content', control: 'text' },
    { name: 'title', type: 'string', description: 'Card title rendered in the header area', control: 'text' },
    { name: 'header', type: 'string | ReactNode', description: 'Custom header content (replaces or extends title)', control: 'text' },
    { name: 'footer', type: 'string | ReactNode', description: 'Footer content rendered below the body', control: 'text' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Overlay a loading spinner over the card body', control: 'boolean' },
    { name: 'showArrow', type: 'boolean', default: 'false', description: 'Show the optional decorative card-arrow layer from the theme', control: 'boolean' },
    { name: 'headerClassName', type: 'string', description: 'Additional CSS classes for the header element', control: 'text' },
    { name: 'bodyClassName', type: 'string', description: 'Additional CSS classes for the body element', control: 'text' },
    { name: 'footerClassName', type: 'string', description: 'Additional CSS classes for the footer element', control: 'text' },
    { name: 'className', type: 'string', description: 'Additional CSS classes on the card root', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the card', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the card', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: {
        children: 'Card body content goes here.',
        title: 'Card title',
        header: '',
        footer: '',
        loading: false,
        showArrow: false,
        headerClassName: '',
        bodyClassName: '',
        footerClassName: '',
        className: '',
        wrapperClassName: '',
        before: '',
        after: '',
    },
    render: (p) => (
        <Card
            title={p.title || undefined}
            header={p.header || undefined}
            footer={p.footer || undefined}
            loading={p.loading}
            showArrow={p.showArrow}
            headerClassName={p.headerClassName || undefined}
            bodyClassName={p.bodyClassName || undefined}
            footerClassName={p.footerClassName || undefined}
            className={p.className || undefined}
            wrapperClassName={p.wrapperClassName || undefined}
            before={p.before || undefined}
            after={p.after || undefined}
        >
            {p.children}
        </Card>
    ),
};

export default function CardPage() {
    usePlayground(PLAYGROUND, 'Card');

    return (
        <PageLayout
            title="Card"
            description="Versatile container with optional header, body, footer and built-in loader overlay."
        >
            <Section
                title="Basic card"
                preview={
                    <Card wrapperClassName="w-full max-w-sm">
                        Card body content goes here.
                    </Card>
                }
                code={`import { Card } from '@llmnative/react';

<Card>Card body content goes here.</Card>`}
            />

            <Section
                title="With header and footer"
                preview={
                    <Card
                        wrapperClassName="w-full max-w-sm"
                        title="Card title"
                        header={<span className="text-sm text-muted-foreground">action</span>}
                        footer={<button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Confirm</button>}
                    >
                        Card body with some example text.
                    </Card>
                }
                code={`<Card
    title="Card title"
    header={<span className="text-sm text-muted-foreground">action</span>}
    footer={<button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Confirm</button>}
>
    Card body with some example text.
</Card>`}
            />

            <Section
                title="Card grid"
                preview={
                    <div className="grid grid-cols-3 gap-3 w-full">
                        {[
                            { label: 'Total users', value: '1,284' },
                            { label: 'Active orders', value: '43' },
                            { label: 'Revenue', value: '$9,820' },
                        ].map((m) => (
                            <Card key={m.label}>
                                <div className="text-xs text-muted-foreground">{m.label}</div>
                                <div className="text-2xl font-bold mt-1">{m.value}</div>
                            </Card>
                        ))}
                    </div>
                }
                code={`{metrics.map((m) => (
    <Card key={m.label}>
        <div className="text-xs text-muted-foreground">{m.label}</div>
        <div className="text-2xl font-bold mt-1">{m.value}</div>
    </Card>
))}`}
            />

            <Section
                title="Card with loader"
                description="Pass loading to overlay a spinner while data is being fetched."
                preview={
                    <Card wrapperClassName="w-full max-w-sm" title="User profile" loading={true}>
                        <div className="flex items-center justify-center min-h-[60px] text-xs text-muted-foreground">
                            Loading...
                        </div>
                    </Card>
                }
                code={`<Card title="User profile" loading={isLoading}>
    {data && <UserDetails user={data} />}
</Card>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}

