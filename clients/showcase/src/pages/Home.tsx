import React from 'react';
import { Link } from 'react-router-dom';
import { useShowcaseHomeI18n } from '../showcase/i18n';

const QUICK_LINKS = [
    { key: 'alert', label: 'Alert', path: '/components/alert' },
    { key: 'badge', label: 'Badge', path: '/components/badge' },
    { key: 'button', label: 'Button', path: '/components/button' },
    { key: 'card', label: 'Card', path: '/components/card' },
    { key: 'modal', label: 'Modal', path: '/components/modal' },
    { key: 'tab', label: 'Tab', path: '/components/tab' },
    { key: 'table', label: 'Table', path: '/components/table' },
    { key: 'pagination', label: 'Pagination', path: '/components/pagination' },
    { key: 'loader', label: 'Loader', path: '/components/loader' },
] as const;

export default function Home() {
    const t = useShowcaseHomeI18n();

    return (
        <div className="mx-auto max-w-4xl p-8">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground">{t.page.title}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    {t.page.description}
                </p>
            </div>

            <div className="mb-10 rounded-lg border bg-card p-5">
                <h2 className="mb-3 font-semibold">{t.sections.quickStart}</h2>
                <pre className="overflow-x-auto rounded bg-muted p-4 text-xs leading-relaxed">{`// 1. Install
npm install @llmnative/react

// 2. Import the stylesheet once in your entry point

// 3. Use the components
import { Alert, Badge, Grid, Form } from '@llmnative/react';`}</pre>
            </div>

            <h2 className="mb-4 font-semibold text-foreground">{t.sections.uiComponents}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {QUICK_LINKS.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className="group block rounded-lg border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                        <div className="font-medium text-foreground transition-colors group-hover:text-primary">
                            {link.label}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{t.quickLinks[link.key]}</div>
                    </Link>
                ))}
            </div>

            <div className="mt-10 rounded-lg border bg-muted/50 p-5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t.labels.stack}</span>{' '}
                React 18 · Tailwind CSS v4 · Firebase · TypeScript strict ·{' '}
                <a
                    href="https://github.com/sherpadvisorylab/react-quicksuite"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                >
                    {t.labels.github}
                </a>
            </div>
        </div>
    );
}
