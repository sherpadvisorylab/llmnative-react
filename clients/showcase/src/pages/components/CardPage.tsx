import React from 'react';
import { Card } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function CardPage() {
    return (
        <PageLayout
            title="Card"
            description="Versatile container with optional header, scrollable body and footer. Supports a built-in loader overlay."
        >
            <Section
                title="Basic card"
                preview={
                    <Card wrapClass="w-full max-w-sm">
                        Card body content goes here.
                    </Card>
                }
                code={`import { Card } from 'react-firestrap';

<Card>Card body content goes here.</Card>`}
            />

            <Section
                title="With header and footer"
                preview={
                    <Card
                        wrapClass="w-full max-w-sm"
                        title="Card title"
                        header={<span className="text-sm text-muted-foreground">action</span>}
                        footer={<button className="btn btn-primary">Confirm</button>}
                    >
                        Card body with some example text.
                    </Card>
                }
                code={`<Card
    title="Card title"
    header={<span className="text-sm text-muted-foreground">action</span>}
    footer={<button className="btn btn-primary">Confirm</button>}
>
    Card body with some example text.
</Card>`}
            />

            <Section
                title="Card grid — metrics dashboard"
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
                description="Pass showLoader to overlay a spinner while data is being fetched."
                preview={
                    <Card wrapClass="w-full max-w-sm" title="User profile" showLoader={true}>
                        <div className="flex items-center justify-center min-h-[60px] text-xs text-muted-foreground">
                            Loading...
                        </div>
                    </Card>
                }
                code={`<Card title="User profile" showLoader={isLoading}>
    {data && <UserDetails user={data} />}
</Card>`}
            />
        </PageLayout>
    );
}
