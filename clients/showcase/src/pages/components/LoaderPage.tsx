import React, { useState } from 'react';
import { Loader } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const PROPS_CONFIG: PropDef[] = [
    { name: 'children', type: 'ReactNode', required: true, description: 'Content to wrap — shown when show=false' },
    { name: 'show', type: 'boolean', default: 'false', description: 'When true, overlays a spinner on top of children', control: 'boolean' },
    { name: 'icon', type: 'string', description: 'Custom icon name to use as spinner', control: 'icon' },
    { name: 'title', type: 'string', description: 'Text shown below the spinner', control: 'text' },
    { name: 'description', type: 'string', description: 'Secondary text shown below the title', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the loader root', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROPS_CONFIG,
    defaultProps: { show: true, icon: false, title: '', description: '', className: '', wrapClass: '' },
    render: (p) => (
        <Loader
            show={p.show}
            icon={p.icon || undefined}
            title={p.title || undefined}
            description={p.description || undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
        >
            <div className="p-6 text-sm text-muted-foreground text-center border rounded-lg w-48">
                Content area
            </div>
        </Loader>
    ),
};

export default function LoaderPage() {
    usePlayground(PLAYGROUND, 'Loader');
    const [show, setShow] = useState(true);

    return (
        <PageLayout
            title="Loader"
            description="Loading indicators. The Loader component wraps content and shows a spinner while show=true."
        >
            <Section
                title="Inline spinner"
                description="Use the CSS class directly for lightweight inline spinners."
                preview={
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="spinner-border spinner-border-sm" />
                            <span className="text-sm text-muted-foreground">Small</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="spinner-border" style={{ width: '1.5rem', height: '1.5rem' }} />
                            <span className="text-sm text-muted-foreground">Default</span>
                        </div>
                    </div>
                }
                code={`{/* Inline via CSS class */}
<span className="spinner-border spinner-border-sm" />

{/* Inside a LoadingButton — spinner replaces label automatically */}
import { LoadingButton } from 'react-firestrap';

<LoadingButton
    className="btn-primary"
    label="Save"
    onClick={async () => { await save(); return true; }}
/>`}
            />

            <Section
                title="Loader as content wrapper"
                description="Toggle the button to see the loader overlay appear and disappear."
                preview={
                    <div className="space-y-3 w-full">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setShow(!show)}
                        >
                            {show ? 'Hide loader' : 'Show loader'}
                        </button>
                        <Loader show={show} title="Loading data…">
                            <div className="border rounded p-4 min-h-[100px] flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">Content loaded successfully.</p>
                            </div>
                        </Loader>
                    </div>
                }
                code={`import { Loader } from 'react-firestrap';

<Loader show={isLoading} title="Loading data…">
    <MyDataView data={data} />
</Loader>

{/* Shorthand via Card prop */}
<Card showLoader={isLoading}>
    {data && <DataView data={data} />}
</Card>`}
            />

            <PropsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}
