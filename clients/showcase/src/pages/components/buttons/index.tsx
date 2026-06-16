import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import { useShowcaseButtonsI18n } from '../../../showcase/i18n';

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
    const t = useShowcaseButtonsI18n();

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.nativeStates.title}
                description={t.sections.nativeStates.description}
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
                title={t.sections.outlineLink.title}
                description={t.sections.outlineLink.description}
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
                title={t.sections.components.title}
                description={t.sections.components.description}
                preview={
                    <div className="grid gap-3 md:grid-cols-2">
                        {componentPages.map((page) => (
                            <Link
                                key={page.path}
                                to={page.path}
                                className="block rounded-md border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                            >
                                <h3 className="font-semibold text-foreground">{page.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {page.title === 'ActionButton'
                                        ? t.cards.actionButton
                                        : page.title === 'LoadingButton'
                                            ? t.cards.loadingButton
                                            : t.cards.navigation}
                                </p>
                            </Link>
                        ))}
                    </div>
                }
                code={`import { ActionButton, LoadingButton } from '@llmnative/react';`}
            />
        </PageLayout>
    );
}
