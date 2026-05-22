import React from 'react';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
    { label: 'Alert', path: '/components/alert', desc: 'Contextual feedback messages' },
    { label: 'Badge', path: '/components/badge', desc: 'Inline labels for status and categories' },
    { label: 'Button', path: '/components/button', desc: 'Primary and secondary actions' },
    { label: 'Card', path: '/components/card', desc: 'Container with header, body and footer' },
    { label: 'Modal', path: '/components/modal', desc: 'Dialogs and edge panels' },
    { label: 'Tab', path: '/components/tab', desc: 'Horizontal and vertical tab navigation' },
    { label: 'Table', path: '/components/table', desc: 'Data table with striping and row selection' },
    { label: 'Pagination', path: '/components/pagination', desc: 'Page navigation with optional sticky bar' },
    { label: 'Loader', path: '/components/loader', desc: 'Loading indicators and spinners' },
];

export default function Home() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground">@ash/react showcase</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Interactive documentation for all components, widgets and providers of the framework.
                </p>
            </div>

            {/* Quick start */}
            <div className="mb-10 p-5 rounded-lg border bg-card">
                <h2 className="font-semibold mb-3">Quick start</h2>
                <pre className="text-xs bg-muted rounded p-4 overflow-x-auto leading-relaxed">{`// 1. Install
npm install @ash/react

// 2. Import the stylesheet once in your entry point
import '@ash/react/dist/index.css';

// 3. Use the components
import { Alert, Badge, Grid, Form } from '@ash/react';`}</pre>
            </div>

            {/* Component grid */}
            <h2 className="font-semibold text-foreground mb-4">UI Components</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {QUICK_LINKS.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className="block p-4 rounded-lg border bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                    >
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {link.label}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{link.desc}</div>
                    </Link>
                ))}
            </div>

            {/* Stack info */}
            <div className="mt-10 p-5 rounded-lg border bg-muted/50 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Stack:</span>{' '}
                React 18 · Tailwind CSS v4 · Firebase · TypeScript strict ·{' '}
                <a
                    href="https://github.com/sherpadvisorylab/react-quicksuite"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                >
                    GitHub →
                </a>
            </div>
        </div>
    );
}
