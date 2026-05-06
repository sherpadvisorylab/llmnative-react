import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function LoaderPage() {
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
                        <div className="border rounded p-4 min-h-[100px] flex items-center justify-center">
                            {show ? (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <span className="spinner-border" style={{ width: '2rem', height: '2rem' }} />
                                    <span className="text-sm">Loading...</span>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Content loaded successfully.</p>
                            )}
                        </div>
                    </div>
                }
                code={`import { Loader } from 'react-firestrap';

{/* Loader wraps any content — used internally by Card and Grid */}
<Loader show={isLoading}>
    <MyDataView data={data} />
</Loader>

{/* Shorthand via Card prop */}
<Card showLoader={isLoading}>
    {data && <DataView data={data} />}
</Card>`}
            />
        </PageLayout>
    );
}
