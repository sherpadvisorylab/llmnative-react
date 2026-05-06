import React from 'react';
import { Badge } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

const TYPES = ['primary', 'info', 'success', 'warning', 'danger', 'secondary'] as const;

export default function BadgePage() {
    return (
        <PageLayout
            title="Badge"
            description="Inline labels for status, counters and categories."
        >
            <Section
                title="Color variants"
                preview={
                    <div className="flex flex-wrap gap-2">
                        {TYPES.map((type) => (
                            <Badge key={type} type={type}>{type}</Badge>
                        ))}
                    </div>
                }
                code={`import { Badge } from 'react-firestrap';

<Badge type="primary">primary</Badge>
<Badge type="success">success</Badge>
<Badge type="warning">warning</Badge>
<Badge type="danger">danger</Badge>`}
            />

            <Section
                title="In context"
                description="Badges paired with text or buttons."
                preview={
                    <div className="flex flex-wrap items-center gap-6">
                        <span className="text-sm font-medium">
                            Pending orders <Badge type="warning">12</Badge>
                        </span>
                        <span className="text-sm font-medium">
                            Notifications <Badge type="danger">3</Badge>
                        </span>
                        <div className="relative inline-block">
                            <button className="btn btn-primary">Messages</button>
                            <Badge type="danger" wrapClass="absolute -top-1 -right-1">5</Badge>
                        </div>
                    </div>
                }
                code={`<span>Pending orders <Badge type="warning">12</Badge></span>

{/* Badge absolutely positioned over a button */}
<div className="relative inline-block">
    <button className="btn btn-primary">Messages</button>
    <Badge type="danger" wrapClass="absolute -top-1 -right-1">5</Badge>
</div>`}
            />
        </PageLayout>
    );
}
