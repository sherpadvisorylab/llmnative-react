import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';

const solidVariants = ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'light', 'dark'] as const;
const outlineVariants = ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'light', 'dark'] as const;

const componentPages = [
    {
        title: 'ActionButton',
        path: '/components/buttons/action',
        description: 'Immediate actions with icons, badges, disabled state and press motion.',
    },
    {
        title: 'LoadingButton',
        path: '/components/buttons/loading',
        description: 'Async actions with loading state, progress text and automatic disable.',
    },
    {
        title: 'Navigation buttons',
        path: '/components/buttons/navigation',
        description: 'Back navigation and external reference helpers.',
    },
];

export default function ButtonsIndexPage() {
    return (
        <PageLayout
            title="Buttons"
            description="Semantic button states plus focused components for immediate actions, async actions, navigation and external references."
        >
            <Section
                title="Native state classes"
                description="Use framework-owned btn state classes for simple buttons and links."
                preview={
                    <div className="flex flex-wrap gap-2 pt-3 pr-3">
                        {solidVariants.map((name) => (
                            <button key={name} className={`btn btn-${name}`}>{name}</button>
                        ))}
                    </div>
                }
                code={`<button className="btn btn-primary">primary</button>
<button className="btn btn-secondary">secondary</button>
<button className="btn btn-danger">danger</button>`}
            />
            <Section
                title="Outline and link"
                description="Outline states use the same semantic names and tokens as solid buttons."
                preview={
                    <div className="flex flex-wrap items-center gap-2 pt-3 pr-3">
                        {outlineVariants.map((name) => (
                            <button key={name} className={`btn btn-outline-${name}`}>{name}</button>
                        ))}
                        <button className="btn btn-link">link</button>
                        <button className="btn btn-primary" disabled>disabled</button>
                    </div>
                }
                code={`<button className="btn btn-outline-primary">primary</button>
<button className="btn btn-outline-warning">warning</button>
<button className="btn btn-link">link</button>`}
            />
            <Section
                title="Button components"
                description="Use the focused pages for examples, props and playgrounds specific to each button component."
                preview={
                    <div className="grid gap-3 md:grid-cols-2">
                        {componentPages.map((page) => (
                            <Link
                                key={page.path}
                                to={page.path}
                                className="block rounded-md border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                            >
                                <h3 className="font-semibold text-foreground">{page.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
                            </Link>
                        ))}
                    </div>
                }
                code={`import { ActionButton, LoadingButton } from '@llmnative/react';`}
            />
        </PageLayout>
    );
}
