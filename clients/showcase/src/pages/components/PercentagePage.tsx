import React from 'react';
import { Badge, Percentage } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

const PERCENTAGE_PROPS: PropDef[] = [
    { name: 'val', type: 'number', default: '0', description: 'Current value before min/max normalization', control: 'number', min: -50, max: 250 },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value mapped to 100%', control: 'number', min: 1, max: 250 },
    { name: 'min', type: 'number', default: '0', description: 'Minimum value mapped to 0%', control: 'number', min: -50, max: 150 },
    { name: 'shape', type: '"bar" | "circle"', default: '"bar"', description: 'Progress shape', control: 'select', options: ['bar', 'circle'] },
    { name: 'type', type: 'ColorType', default: '"primary"', description: 'Progress fill color', control: 'select', options: COLORS },
    { name: 'background', type: 'ColorType', default: '"secondary"', description: 'Track/background color', control: 'select', options: COLORS },
    { name: 'thickness', type: 'number', default: '10', description: 'Bar height or circle stroke width', control: 'number', min: 4, max: 36 },
    { name: 'showText', type: 'boolean', default: 'true', description: 'Show the normalized percentage text', control: 'boolean' },
    { name: 'size', type: 'number', default: '100', description: 'Bar width percentage or circle size in pixels', control: 'number', min: 40, max: 260 },
    { name: 'fontSize', type: 'number', default: '16', description: 'Percentage text size in pixels', control: 'number', min: 8, max: 36 },
    { name: 'label', type: 'string', description: 'Label above the percentage', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Content before the control', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after the control', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the rendered meter', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PERCENTAGE_PROPS,
    defaultProps: {
        val: 72,
        max: 100,
        min: 0,
        shape: 'bar',
        type: 'primary',
        background: 'secondary',
        thickness: 22,
        showText: true,
        size: 100,
        fontSize: 13,
        label: 'Completion',
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p) => (
        <Percentage
            val={p.val}
            max={p.max}
            min={p.min}
            shape={p.shape}
            type={p.type}
            background={p.background}
            thickness={p.thickness}
            showText={p.showText}
            size={p.size}
            fontSize={p.fontSize}
            label={p.label || undefined}
            pre={p.pre || undefined}
            post={p.post || undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
        />
    ),
};

export default function PercentagePage() {
    usePlayground(PLAYGROUND, 'Percentage');

    return (
        <PageLayout title="Percentage" description="Progress indicator rendered as a horizontal bar or circular meter, with min/max normalization and theme-aware colors.">
            <Section
                title="Bar meters"
                description="Use bars for dense dashboards and table detail panels. val is normalized between min and max."
                preview={
                    <div className="w-full max-w-xl space-y-5">
                        <Percentage label="Storage" val={64} type="success" thickness={22} fontSize={13} wrapClass="w-full" />
                        <Percentage label="Budget used" val={38} type="warning" thickness={18} fontSize={12} showText wrapClass="w-full" />
                        <Percentage label="Risk" val={12} type="danger" thickness={16} fontSize={12} wrapClass="w-full" />
                    </div>
                }
                code={`import { Percentage } from 'react-firestrap';

<Percentage label="Storage" val={64} type="success" thickness={22} />
<Percentage label="Budget used" val={38} type="warning" thickness={18} />
<Percentage label="Risk" val={12} type="danger" thickness={16} />`}
            />

            <Section
                title="Circular meters"
                description="Use circles for summary metrics where the percentage is the primary visual signal."
                preview={
                    <div className="flex flex-wrap gap-8">
                        <div className="text-center">
                            <Percentage shape="circle" val={82} type="primary" background="secondary" size={120} thickness={12} />
                            <div className="mt-2 text-sm font-medium">Quality</div>
                        </div>
                        <div className="text-center">
                            <Percentage shape="circle" val={54} type="info" background="secondary" size={120} thickness={12} />
                            <div className="mt-2 text-sm font-medium">Coverage</div>
                        </div>
                        <div className="text-center">
                            <Percentage shape="circle" val={91} type="success" background="secondary" size={120} thickness={12} showText={false} />
                            <div className="mt-2 text-sm font-medium">No text</div>
                        </div>
                    </div>
                }
                code={`<Percentage shape="circle" val={82} size={120} thickness={12} />
<Percentage shape="circle" val={54} type="info" size={120} thickness={12} />
<Percentage shape="circle" val={91} type="success" showText={false} />`}
            />

            <Section
                title="Min/max normalization"
                description="The displayed percent is calculated from (val - min) / (max - min), then clamped between 0 and 100."
                preview={
                    <div className="w-full max-w-xl space-y-5">
                        <Percentage label="Revenue target: 75 of 150" val={75} min={0} max={150} type="primary" thickness={22} />
                        <Percentage label="Temperature range: 30 in 20-40" val={30} min={20} max={40} type="info" thickness={22} />
                        <Percentage label="Clamped above max" val={220} min={0} max={200} type="success" thickness={22} />
                    </div>
                }
                code={`<Percentage label="Revenue target" val={75} min={0} max={150} />
<Percentage label="Temperature range" val={30} min={20} max={40} />
<Percentage label="Clamped above max" val={220} max={200} />`}
            />

            <Section
                title="Color variants and slots"
                description="type controls the fill. background controls the track. pre/post can add surrounding context."
                preview={
                    <div className="w-full max-w-xl space-y-4">
                        {COLORS.filter((color) => color !== 'light').map((color, index) => (
                            <div key={color} className="flex items-center gap-3">
                                <Badge type={color as any}>{color}</Badge>
                                <Percentage val={(index + 2) * 12} type={color as any} thickness={14} fontSize={11} wrapClass="flex-1" />
                            </div>
                        ))}
                        <Percentage pre={<span className="text-sm text-muted-foreground">0%</span>} post={<span className="text-sm text-muted-foreground">100%</span>} val={48} type="primary" thickness={18} wrapClass="flex items-center gap-3" />
                    </div>
                }
                code={`<Percentage val={72} type="primary" background="secondary" />
<Percentage
    pre={<span>0%</span>}
    post={<span>100%</span>}
    val={48}
/>`}
            />

            <PropDocsTable props={PERCENTAGE_PROPS} />
        </PageLayout>
    );
}
