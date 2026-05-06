import React from 'react';
import { LoadingButton } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

const SOLID_VARIANTS = ['primary', 'secondary', 'danger', 'success', 'warning', 'info'] as const;
const OUTLINE_VARIANTS = ['primary', 'secondary', 'danger', 'success'] as const;

export default function ButtonPage() {
    return (
        <PageLayout
            title="Button"
            description="Action buttons with solid, outline and link variants. LoadingButton handles async states automatically."
        >
            <Section
                title="Solid"
                preview={
                    <div className="flex flex-wrap gap-2">
                        {SOLID_VARIANTS.map((v) => (
                            <button key={v} className={`btn btn-${v}`}>{v}</button>
                        ))}
                    </div>
                }
                code={`<button className="btn btn-primary">primary</button>
<button className="btn btn-secondary">secondary</button>
<button className="btn btn-danger">danger</button>
<button className="btn btn-success">success</button>`}
            />

            <Section
                title="Outline"
                preview={
                    <div className="flex flex-wrap gap-2">
                        {OUTLINE_VARIANTS.map((v) => (
                            <button key={v} className={`btn btn-outline-${v}`}>{v}</button>
                        ))}
                    </div>
                }
                code={`<button className="btn btn-outline-primary">primary</button>
<button className="btn btn-outline-secondary">secondary</button>
<button className="btn btn-outline-danger">danger</button>`}
            />

            <Section
                title="Link and disabled"
                preview={
                    <div className="flex flex-wrap gap-3 items-center">
                        <button className="btn btn-link">link button</button>
                        <button className="btn btn-primary" disabled>disabled</button>
                        <button className="btn btn-outline-primary" disabled>disabled outline</button>
                    </div>
                }
                code={`<button className="btn btn-link">link button</button>
<button className="btn btn-primary" disabled>disabled</button>`}
            />

            <Section
                title="LoadingButton — async state"
                description="Click to simulate a 2-second async operation. The spinner replaces the label while loading."
                preview={
                    <div className="flex flex-wrap gap-2">
                        <LoadingButton
                            className="btn-primary"
                            label="Save"
                            onClick={async () => {
                                await new Promise((r) => setTimeout(r, 2000));
                                return true;
                            }}
                        />
                        <LoadingButton
                            className="btn-outline-danger"
                            label="Delete"
                            onClick={async () => {
                                await new Promise((r) => setTimeout(r, 1500));
                                return true;
                            }}
                        />
                    </div>
                }
                code={`import { LoadingButton } from 'react-firestrap';

// Returns true to close the parent Modal, false to stay open
<LoadingButton
    className="btn-primary"
    label="Save"
    onClick={async (e) => {
        await saveData();
        return true;
    }}
/>`}
            />
        </PageLayout>
    );
}
