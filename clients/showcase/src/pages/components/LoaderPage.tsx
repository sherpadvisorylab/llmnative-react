import React, { useState } from 'react';
import { Loader, LoadingButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Content to wrap — shown when show=false, behind the overlay when show=true.' },
    { name: 'show', type: 'boolean', default: 'false', description: 'When true, renders a blurred overlay with a spinner on top of children.', control: 'boolean' },
    { name: 'icon', type: 'string', description: 'Icon name for the spinner. Defaults to the theme value (Loader.icon).', control: 'icon' },
    { name: 'title', type: 'string', description: 'Heading shown below the spinner. Defaults to the theme value.', control: 'text' },
    { name: 'description', type: 'string', description: 'Secondary text shown below the title.', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the loader inner container.', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outer wrapper.', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROPS_CONFIG,
    defaultProps: { show: true, icon: '', title: '', description: '', className: '', wrapperClassName: '' },
    render: (p) => (
        <Loader
            show={p.show}
            icon={p.icon || undefined}
            title={p.title || undefined}
            description={p.description || undefined}
            className={p.className || undefined}
            wrapperClassName={p.wrapperClassName || undefined}
        >
            <div className="p-8 text-sm text-muted-foreground text-center border rounded-lg w-56">
                Content area
            </div>
        </Loader>
    ),
};

export default function LoaderPage() {
    usePlayground(PLAYGROUND, 'Loader');
    const [show, setShow] = useState(false);

    return (
        <PageLayout
            title="Loader"
            description="Overlay spinner that wraps any content. When show=true, a blurred backdrop with a themed spinner is rendered on top of children — the content remains in the DOM and is revealed instantly when the loader is dismissed."
        >
            {/* ── Show / hide ── */}
            <Section
                title="Show / hide"
                description="Toggle show to overlay or reveal the wrapped content. The content is always mounted — no layout shift when the loader disappears."
                preview={
                    <div className="space-y-4 w-full max-w-sm">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setShow((v) => !v)}
                        >
                            {show ? 'Hide loader' : 'Show loader'}
                        </button>
                        <Loader show={show} title="Loading data…">
                            <div className="border rounded-lg p-6 min-h-[100px] flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">Content is ready.</p>
                            </div>
                        </Loader>
                    </div>
                }
                code={`import { Loader } from '@llmnative/react';

const [loading, setLoading] = useState(true);

<Loader show={loading} title="Loading data…">
    <MyDataView data={data} />
</Loader>`}
            />

            {/* ── Custom icon and message ── */}
            <Section
                title="Custom icon and message"
                description="Override the theme defaults per-instance with icon, title, and description. The icon value is a class name — any icon supported by the configured icon provider works."
                preview={
                    <div className="flex flex-wrap gap-6">
                        <Loader show title="Saving…" description="Please wait" icon="custom-loader">
                            <div className="border rounded-lg p-6 w-48 min-h-[120px]" />
                        </Loader>
                        <Loader show title="Uploading…">
                            <div className="border rounded-lg p-6 w-48 min-h-[120px]" />
                        </Loader>
                        <Loader show>
                            <div className="border rounded-lg p-6 w-48 min-h-[120px]" />
                        </Loader>
                    </div>
                }
                code={`import { Loader } from '@llmnative/react';

// Custom icon + title + description
<Loader show icon="custom-loader" title="Saving…" description="Please wait">
    <Content />
</Loader>

// Title only
<Loader show title="Uploading…">
    <Content />
</Loader>

// Theme defaults (icon and title from Loader theme config)
<Loader show>
    <Content />
</Loader>`}
            />

            {/* ── Card integration ── */}
            <Section
                title="Card integration"
                description="Card exposes a showLoader prop as a convenience shorthand — it wraps the card body in a Loader automatically."
                preview={null}
                code={`import { Card } from '@llmnative/react';

<Card showLoader={isLoading} title="Users">
    <UserTable data={data} />
</Card>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />

            {/* ── Other loading indicators ── */}
            <Section
                title="Other loading indicators in the framework"
                description="@llmnative/react ships additional loading patterns for different contexts."
                preview={
                    <div className="space-y-6">
                        {/* CSS spinner */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">CSS spinner — inline</p>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">sm</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">md</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-block h-7 w-7 animate-spin rounded-full border-[3px] border-current border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">lg</span>
                                </div>
                            </div>
                        </div>
                        {/* LoadingButton */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">LoadingButton — async action</p>
                            <div className="flex flex-wrap gap-3">
                                <LoadingButton
                                    className="btn-primary"
                                    label="Save"
                                    onClick={async () => { await new Promise((r) => setTimeout(r, 1500)); return true; }}
                                />
                                <LoadingButton
                                    className="btn-outline-secondary"
                                    label="Export"
                                    icon="download"
                                    onClick={async () => { await new Promise((r) => setTimeout(r, 1500)); return true; }}
                                />
                            </div>
                        </div>
                    </div>
                }
                code={`// ── CSS spinner ──────────────────────────────────────────────
// Use Tailwind's animate-spin with a partial border for a clean ring spinner.
<span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />

// ── LoadingButton ────────────────────────────────────────────
import { LoadingButton } from '@llmnative/react';

// Spinner replaces label automatically while onClick is pending.
<LoadingButton
    className="btn-primary"
    label="Save"
    onClick={async () => {
        await save();
        return true; // return false to keep the button in loading state
    }}
/>`}
            />
        </PageLayout>
    );
}
